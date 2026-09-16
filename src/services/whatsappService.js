import axios from 'axios';
import prisma from '../lib/prisma.js';
import { env } from '../config/env.js';

/**
 * Helper untuk memastikan nomor hanya berisi angka tanpa format JID bawaan backend.
 * GoWA versi terbaru menangani suffix otomatis jika dikirim via payload yang tepat.
 */
const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  let cleaned = phone.toString().replace(/\D/g, ''); // Ambil angka saja
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  return cleaned;
};

/**
 * Service untuk mengirim notifikasi WhatsApp menggunakan GoWA Gateway
 */
export const sendWaNotification = async (offerData) => {
  try {
    // 1. Ambil konfigurasi WhatsApp dari database
    const adminConfig = await prisma.admin.findFirst({
      select: {
        admin_wa: true,
        wa_device_id: true,
      }
    });

    console.log('ℹ️ WA Service: Mengambil konfigurasi WA dari DB:', adminConfig);

    // 2. Alamat dasar GoWA API (Pastikan mengarah ke /message/text)
    // Jika di .env Anda menuliskan 'https://myperfumee.my.id', kita ganti otomatis ke rute yang benar.
    let waUrl = env.WA_API_URL || 'https://wa.myperfumee.my.id/send/message';
    const deviceId = adminConfig?.wa_device_id || env.WA_DEVICE_ID;
    const adminWa = adminConfig?.admin_wa || env.ADMIN_WA;
    
    const waUser = env.WA_BASIC_USER;
    const waPass = env.WA_BASIC_PASS;

    if (!deviceId) {
      console.error('⚠️ WA Service: Device ID tidak ditemukan di DB maupun .env');
      return;
    }

    // Template Pesan Admin
    const adminMessage = `*NOTIFIKASI JUAL MOBIL BARU* 🚗\n\n` +
      `*Unit:* ${offerData.brand} ${offerData.model} (${offerData.year})\n` +
      `*Warna:* ${offerData.color}\n` +
      `*KM:* ${offerData.mileage.toLocaleString()} km\n` +
      `*Transmisi:* ${offerData.transmission}\n` +
      `*Tanggal Pajak:* ${new Date(offerData.taxDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}\n` +
      `*Penjual:* ${offerData.fullName}\n` +
      `*Kepemilikan:* ${offerData.stnkOwnership}\n` +
      `*WhatsApp:* ${offerData.whatsapp}\n` +
      `*Lokasi:* ${offerData.location}\n\n` +
      `*https://fe.jualmobilku.my.id/admin/offers/${offerData.id}\n\n` +
      `_Segera cek dashboard admin untuk detail lengkap._`
      
      ;

    // Template Pesan Klien
    const clientMessage = `Halo *${offerData.fullName}*,\n\n` +
      `Terima kasih telah menggunakan JualMobilku. Data mobil *${offerData.brand} ${offerData.model}* telah kami terima.\n\n` +
      `Tim kami akan segera menghubungi Anda untuk konfirmasi jadwal inspeksi. 🙏`;

    const headers = {
      'X-Device-Id': deviceId,
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    if (waUser && waPass) {
      headers['Authorization'] = 'Basic ' + Buffer.from(`${waUser}:${waPass}`).toString('base64');
    }

    // Headers standar GoWA API
    const axiosConfig = { headers };

    // 3. Kirim Notifikasi ke Admin
    if (adminWa) {
      const cleanAdminPhone = cleanPhoneNumber(adminWa);
      
      // Menggunakan URLSearchParams agar terkirim sebagai Form Data yang valid untuk GoWA
      const adminPayload = new URLSearchParams();
      adminPayload.append('phone', cleanAdminPhone);
      adminPayload.append('message', adminMessage);

      await axios.post(waUrl, adminPayload, axiosConfig);
    } else {
      console.warn('⚠️ WA Service: Nomor Admin WA tidak ditemukan.');
    }

    // 4. Kirim Auto-Responder ke Klien
    const cleanClientPhone = cleanPhoneNumber(offerData.whatsapp);
    
    const clientPayload = new URLSearchParams();
    clientPayload.append('phone', cleanClientPhone);
    clientPayload.append('message', clientMessage);

    await axios.post(waUrl, clientPayload, axiosConfig);

    console.log(`✅ WA Notification Success: Notifikasi dikirim menggunakan Device [${deviceId}]`);

  } catch (error) {
    if (error.response?.status === 401) {
      console.error('❌ WA Auth Failed: Periksa WA_BASIC_USER/PASS di .env');
    } else if (error.response?.status === 404) {
      console.error('❌ WA Service 404: Endpoint GoWA tidak ditemukan. Cek kembali URL API Anda.');
      console.error('Detail Error:', error.response?.data);
    } else {
      console.error('❌ WA Service Error:', error.response?.data || error.message);
    }
  }
};

