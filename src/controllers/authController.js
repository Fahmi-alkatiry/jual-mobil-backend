import prisma from '../lib/prisma.js';
import { ZodError } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/auth.schema.js';

export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = registerSchema.parse(req.body);

    const existingAdmin = await prisma.admin.findUnique({
      where: { username }
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Username sudah digunakan oleh admin lain'
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Sekarang aman karena admin_wa dan wa_device_id sudah opsional di Prisma
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({
      success: true,
      message: 'Admin berhasil didaftarkan',
      data: {
        id: newAdmin.id,
        username: newAdmin.username
      }
    });

  } catch (error) {
    console.error("DETIL ERROR REGISTRASI:", error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.issues.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error. Pastikan sudah npx prisma migrate dev.' 
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'ADMIN' },
      process.env.JWT_SECRET || 'secret_fallback_key',
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

export const getMe = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: { 
        id: true, 
        username: true, 
        email: true, 
        admin_wa: true, 
        wa_device_id: true 
      }
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin tidak ditemukan' });
    }

    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data profil' });
  }
};

/**
 * Controller untuk memperbarui profil admin (Email, WA, Device ID)
 */
export const updateProfile = async (req, res) => {
  try {
    const data = updateProfileSchema.parse(req.body);

    const updatedAdmin = await prisma.admin.update({
      where: { id: req.user.id },
      data: {
        email: data.email,
        admin_wa: data.admin_wa,
        wa_device_id: data.wa_device_id
      }
    });

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: {
        id: updatedAdmin.id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        admin_wa: updatedAdmin.admin_wa,
        wa_device_id: updatedAdmin.wa_device_id
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil' });
  }
};