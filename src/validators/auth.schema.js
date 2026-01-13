import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username wajib diisi" }),
  password: z.string().min(1, { message: "Password wajib diisi" })
});

export const registerSchema = z.object({
  username: z.string()
    .min(3, { message: "Username minimal 3 karakter" })
    .max(20, { message: "Username maksimal 20 karakter" }),
  password: z.string()
    .min(6, { message: "Password minimal 6 karakter" })
});

/**
 * Schema untuk validasi update profil admin
 */
export const updateProfileSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }).optional().or(z.literal('')),
  admin_wa: z.string().min(10, { message: "Nomor WhatsApp minimal 10 karakter" }).optional().or(z.literal('')),
  wa_device_id: z.string().optional().or(z.literal(''))
});