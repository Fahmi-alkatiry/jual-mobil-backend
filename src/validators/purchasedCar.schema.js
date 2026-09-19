import { z } from 'zod';

export const carCategoryEnum = z.enum(['MPV', 'CITY_CAR', 'LCGC', 'SUV']);

export const purchasedCarCreateSchema = z.object({
  brand: z.string().min(1, 'Brand wajib diisi'),
  model: z.string().min(1, 'Model wajib diisi'),
  yearMin: z.coerce.number().int().min(200).max(2030),
  yearMax: z.coerce.number().int().min(200).max(2030),
  imageUrl: z.string().url('URL gambar tidak valid'),
  priceMin: z.coerce.number().int().min(1).max(999),
  priceMax: z.coerce.number().int().min(1).max(999),
  category: carCategoryEnum,
  isPublished: z.coerce.boolean().optional().default(true),
}).refine(d => d.yearMax >= d.yearMin, { message: 'yearMax harus >= yearMin', path: ['yearMax'] })
  .refine(d => d.priceMax >= d.priceMin, { message: 'priceMax harus >= priceMin', path: ['priceMax'] });

export const purchasedCarUpdateSchema = purchasedCarCreateSchema.partial().refine(
  d => d.yearMax === undefined || d.yearMin === undefined || d.yearMax >= d.yearMin,
  { message: 'yearMax harus >= yearMin', path: ['yearMax'] }
).refine(
  d => d.priceMax === undefined || d.priceMin === undefined || d.priceMax >= d.priceMin,
  { message: 'priceMax harus >= priceMin', path: ['priceMax'] }
);
