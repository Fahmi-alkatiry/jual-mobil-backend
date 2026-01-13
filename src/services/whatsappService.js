import axios from 'axios';
import prisma from '../lib/prisma.js';

/**
 * Service untuk mengirim notifikasi WhatsApp menggunakan GoWA Gateway
 * Mengambil konfigurasi admin_wa dan wa_device_id langsung dari database
 */
export const sendWaNotification = async (offerData) => {
  try {
    // 1. Ambil konfigurasi WhatsApp dari database (Admin pertama)
    const adminConfig = await prisma.admin.findFirst({
      select: {
        admin_wa: true,
        wa_device_id: true,
      }
    });

    // 2. Fallback ke Environment Variables jika database kosong
    const waUrl = process.env.WA_API_URL || 'http://localhost:3001/send/message';
    const deviceId = adminConfig?.wa_device_id || process.env.WA_DEVICE_ID;
    const adminWa = adminConfig?.admin_wa || process.env.ADMIN_WA;
    
    // Kredensial Basic Auth GoWA
    const waUser = process.env.WA_BASIC_USER || 'admin';
    const waPass = process.env.WA_BASIC_PASS || 'admin';

    if (!deviceId) {
      console.error('⚠️ WA Service: Device ID tidak ditemukan di DB maupun .env');
      return;
    }

    // Template Pesan untuk Admin
    const adminMessage = `*NOTIFIKASI JUAL MOBIL BARU* 🚗\n\n` +
      `*Unit:* ${offerData.brand} ${offerData.model} (${offerData.year})\n` +
      `*KM:* ${offerData.mileage.toLocaleString()} km\n` +
      `*Transmisi:* ${offerData.transmission}\n` +
      `*Penjual:* ${offerData.fullName}\n` +
      `*WhatsApp:* ${offerData.whatsapp}\n` +
      `*Lokasi:* ${offerData.location}\n\n` +
      `_Segera cek dashboard admin untuk detail lengkap._`;

    // Template Pesan untuk Klien
    const clientMessage = `Halo *${offerData.fullName}*,\n\n` +
      `Terima kasih telah menggunakan JualMobilku. Data mobil *${offerData.brand} ${offerData.model}* telah kami terima.\n\n` +
      `Tim kami akan segera menghubungi Anda untuk konfirmasi jadwal inspeksi. 🙏`;

    // Generate Basic Auth Token
    const authHeader = 'Basic ' + Buffer.from(`${waUser}:${waPass}`).toString('base64');

    const axiosConfig = {
      headers: {
        'Authorization': authHeader,
        'X-Device-Id': deviceId,
        'Content-Type': 'application/json'
      }
    };

    // 3. Kirim Notifikasi ke Admin
    if (adminWa) {
      await axios.post(waUrl, {
        phone: adminWa,
        message: adminMessage
      }, axiosConfig);
    } else {
      console.warn('⚠️ WA Service: Nomor Admin WA tidak ditemukan.');
    }

    // 4. Kirim Auto-Responder ke Klien
    await axios.post(waUrl, {
      phone: offerData.whatsapp.replace(/\+/g, '').replace(/\s/g, ''),
      message: clientMessage
    }, axiosConfig);

    console.log(`✅ WA Notification Success: Notifikasi dikirim menggunakan Device [${deviceId}]`);

  } catch (error) {
    if (error.response?.status === 401) {
      console.error('❌ WA Auth Failed: Periksa WA_BASIC_USER/PASS di .env');
    } else {
      console.error('❌ WA Service Error:', error.message);
    }
  }
};