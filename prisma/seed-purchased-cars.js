import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const cars = [
  { brand: 'Toyota', model: 'Avanza 1.3 / 1.5 G / Veloz', yearMin: 2016, yearMax: 2024, imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80', priceMin: 145000000, priceMax: 175000000, category: 'MPV' },
  { brand: 'Toyota', model: 'Innova Reborn', yearMin: 2016, yearMax: 2024, imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', priceMin: 185000000, priceMax: 215000000, category: 'MPV' },
  { brand: 'Honda', model: 'Mobilio RS', yearMin: 2016, yearMax: 2023, imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', priceMin: 135000000, priceMax: 165000000, category: 'MPV' },
  { brand: 'Honda', model: 'Brio Satya', yearMin: 2018, yearMax: 2024, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', priceMin: 115000000, priceMax: 135000000, category: 'CITY_CAR' },
  { brand: 'Suzuki', model: 'Ignis GLX', yearMin: 2017, yearMax: 2022, imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80', priceMin: 115000000, priceMax: 145000000, category: 'CITY_CAR' },
  { brand: 'Honda', model: 'Jazz RS', yearMin: 2016, yearMax: 2021, imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80', priceMin: 155000000, priceMax: 185000000, category: 'CITY_CAR' },
  { brand: 'Toyota', model: 'Agya G', yearMin: 2016, yearMax: 2024, imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3ec7956e9d?w=800&q=80', priceMin: 115000000, priceMax: 125000000, category: 'LCGC' },
  { brand: 'Daihatsu', model: 'Ayla R', yearMin: 2016, yearMax: 2024, imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', priceMin: 115000000, priceMax: 130000000, category: 'LCGC' },
  { brand: 'Toyota', model: 'Calya G', yearMin: 2016, yearMax: 2024, imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80', priceMin: 115000000, priceMax: 135000000, category: 'LCGC' },
  { brand: 'Toyota', model: 'Fortuner VRZ', yearMin: 2016, yearMax: 2024, imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', priceMin: 195000000, priceMax: 215000000, category: 'SUV' },
  { brand: 'Honda', model: 'CR-V Turbo', yearMin: 2018, yearMax: 2024, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', priceMin: 185000000, priceMax: 215000000, category: 'SUV' },
  { brand: 'Mitsubishi', model: 'Xpander Cross', yearMin: 2019, yearMax: 2024, imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', priceMin: 165000000, priceMax: 195000000, category: 'SUV' },
];

const run = async () => {
  await prisma.purchasedCar.deleteMany();
  await prisma.purchasedCar.createMany({ data: cars });
  console.log(`Seeded ${cars.length} purchased cars with year range`);
};
run().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
