import express from 'express';
import { listPurchasedCars, getPurchasedCarById, createPurchasedCar, updatePurchasedCar, deletePurchasedCar } from '../controllers/purchasedCarController.js';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/purchased-cars', (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth) return authenticateAdmin(req, res, next);
  next();
}, listPurchasedCars);

router.get('/purchased-cars/:id', (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth) return authenticateAdmin(req, res, next);
  next();
}, getPurchasedCarById);

router.post('/purchased-cars', authenticateAdmin, createPurchasedCar);
router.patch('/purchased-cars/:id', authenticateAdmin, updatePurchasedCar);
router.delete('/purchased-cars/:id', authenticateAdmin, deletePurchasedCar);

export default router;
