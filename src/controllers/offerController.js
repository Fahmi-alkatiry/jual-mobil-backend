import prisma from '../lib/prisma.js';
import { ZodError } from 'zod';
import { createOfferSchema } from '../validators/offer.schema.js';
import { sendWaNotification } from '../services/whatsappService.js';

export const createOffer = async (req, res) => {
  try {
    const data = createOfferSchema.parse(req.body);

    const newOffer = await prisma.offer.create({
      data: { ...data, status: 'BARU' }
    });

    // Kirim notifikasi WhatsApp secara asinkron
    sendWaNotification(newOffer).catch(err => console.error("WA Notif Error:", err));

    res.status(201).json({ success: true, data: newOffer });

  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOffers = async (req, res) => {
  try {
    const { search, from, to, status } = req.query; // Menambahkan 'status' dari query params
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 10;

    // 1. Membangun Query "Where" untuk Filter
    const where = {
      AND: [
        // Filter Pencarian (Nama, Brand, Model, Lokasi)
        search ? {
          OR: [
            { fullName: { contains: search } },
            { brand: { contains: search } },
            { model: { contains: search } },
            { location: { contains: search } },
          ]
        } : {},
        
        // Filter Status (BARU, DIPROSES, SELESAI, BATAL)
        status ? { status: status } : {},

        // Filter Rentang Tanggal
        from ? { createdAt: { gte: new Date(from) } } : {},
        to ? { 
          createdAt: { 
            lte: (() => {
              const d = new Date(to);
              d.setHours(23, 59, 59, 999); // Pastikan mencakup seluruh hari terakhir
              return d;
            })() 
          } 
        } : {},
      ]
    };

    // 2. Eksekusi Query ke Database (Ambil Data, Total, dan Statistik Status)
    // Statistik dihitung berdasarkan filter pencarian & tanggal, tapi MENGABAIKAN filter status 
    // agar angka di card statistik dashboard tetap menunjukkan total kategori keseluruhan.
    const statsWhere = {
      AND: where.AND.filter(condition => !condition.status)
    };

    const [offers, total, statusGroups, totalAll] = await Promise.all([
      prisma.offer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.offer.count({ where }),
      prisma.offer.groupBy({
        by: ['status'],
        where: statsWhere,
        _count: { _all: true }
      }),
      prisma.offer.count({ where: statsWhere })
    ]);

    // Format statistik agar mudah dikonsumsi frontend
    const statistics = {
      TOTAL: totalAll,
      BARU: 0,
      DIPROSES: 0,
      SELESAI: 0,
      BATAL: 0
    };

    statusGroups.forEach(group => {
      statistics[group.status] = group._count._all;
    });

    // 3. Kirim Respon Sinkron dengan Frontend
    res.json({
      success: true,
      data: offers,
      statistics, 
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Fetch Offers Error:", error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data' });
  }
};

export const updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.offer.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui status' });
  }
};  


export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await prisma.offer.findUnique({
      where: { id: parseInt(id) }
    });

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    res.json({ success: true, data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail data' });
  }
};