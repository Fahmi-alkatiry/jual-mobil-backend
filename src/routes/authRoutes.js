import express from 'express';
import { 
  registerAdmin, 
  loginAdmin, 
  getMe, 
  updateProfile
} from '../controllers/authController.js';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Route untuk Registrasi Admin Baru
 * Anda bisa menambahkan middleware authenticateAdmin di sini jika ingin 
 * membatasi pendaftaran admin hanya bisa dilakukan oleh admin lain.
 */
router.post('/register', registerAdmin);

/**
 * Route untuk Login Admin
 */
router.post('/login', loginAdmin);

/**
 * Route untuk mendapatkan informasi profil Admin yang sedang login
 * Menggunakan middleware authenticateAdmin untuk proteksi
 */
router.get('/me', authenticateAdmin, getMe);

// Route untuk memperbarui profil (hanya admin yang sedang login)
router.patch('/update-profile', authenticateAdmin, updateProfile);
export default router;