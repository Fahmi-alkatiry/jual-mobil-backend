// backend/src/validators/offer.schema.js
import { z } from 'zod';

export const createOfferSchema = z.object({
  brand: z.string().min(1, 'Brand wajib diisi'),
  model: z.string().min(1, 'Model wajib diisi'),
  year: z.coerce.number().int().min(1980).max(new Date().getFullYear()),

  transmission: z.enum(['Manual', 'Automatic']),
  color: z.string().min(1),

  mileage: z.coerce.number().int().min(0),
  taxDate: z.coerce.date().nullable().optional(),

  stnkOwnership: z.enum(['Pribadi', 'PT']),

  fullName: z.string().min(3),
  email: z.string().email().optional(),
  whatsapp: z.string().min(10),
  location: z.string().min(3)
});

export const offerStatusEnum = z.enum([
  'BARU',
  'DIPROSES',
  'SELESAI',
  'BATAL'
]);
