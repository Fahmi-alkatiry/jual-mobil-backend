import jwt from 'jsonwebtoken';

/**
 * Middleware untuk memproteksi route yang hanya boleh diakses oleh Admin
 */
export const authenticateAdmin = (req, res, next) => {
  try {
    // 1. Ambil token dari header Authorization
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Akses ditolak, token tidak ditemukan' 
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback_key');

    // 3. Simpan data user/admin ke objek request agar bisa digunakan di controller
    req.user = decoded;

    // 4. Lanjutkan ke controller berikutnya
    next();

  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    
    // Tangani jika token kadaluwarsa atau tidak valid
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token telah kadaluwarsa, silakan login ulang' });
    }
    
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};