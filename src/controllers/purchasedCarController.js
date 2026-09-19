import prisma from '../lib/prisma.js';
import { ZodError } from 'zod';
import { purchasedCarCreateSchema, purchasedCarUpdateSchema } from '../validators/purchasedCar.schema.js';

const mapCategory = (v) => v?.toUpperCase().replace(/ /g, '_');
const CATEGORY_VALUES = ['MPV', 'CITY_CAR', 'LCGC', 'SUV'];

export const listPurchasedCars = async (req, res) => {
  try {
    const { search, category, published } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);
    const isPublic = !req.user;
    const where = {
      AND: [
        isPublic ? { isPublished: true } : {},
        published !== undefined && !isPublic ? { isPublished: published === 'true' } : {},
        category && category !== 'ALL' ? { category: mapCategory(category) } : {},
        search ? { OR: [{ brand: { contains: search } }, { model: { contains: search } }] } : {},
      ],
    };
    const [data, total] = await Promise.all([
      prisma.purchasedCar.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.purchasedCar.count({ where }),
    ]);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data' });
  }
};

export const getPurchasedCarById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID tidak valid' });
  const item = await prisma.purchasedCar.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
  if (!item.isPublished && !req.user) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
  res.json({ success: true, data: item });
};

export const createPurchasedCar = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.category) body.category = mapCategory(body.category);
    const data = purchasedCarCreateSchema.parse(body);
    const created = await prisma.purchasedCar.create({ data });
    res.status(201).json({ success: true, data: created });
  } catch (e) {
    if (e instanceof ZodError) return res.status(400).json({ success: false, errors: e.errors });
    res.status(500).json({ success: false, message: e.message });
  }
};

export const updatePurchasedCar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID tidak valid' });
    const body = { ...req.body };
    if (body.category) body.category = mapCategory(body.category);
    const data = purchasedCarUpdateSchema.parse(body);
    const updated = await prisma.purchasedCar.update({ where: { id }, data });
    res.json({ success: true, data: updated });
  } catch (e) {
    if (e instanceof ZodError) return res.status(400).json({ success: false, errors: e.errors });
    if (e.code === 'P2025') return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.status(500).json({ success: false, message: e.message });
  }
};

export const deletePurchasedCar = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID tidak valid' });
  try {
    await prisma.purchasedCar.delete({ where: { id } });
    res.json({ success: true, message: 'Data dihapus' });
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.status(500).json({ success: false, message: e.message });
  }
};
