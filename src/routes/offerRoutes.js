// src/routes/offerRoutes.js
import express from 'express';
import { createOffer, getAllOffers, getOfferById, updateOfferStatus } from '../controllers/offerController.js';
import { offerLimiter } from '../middlewares/rateLimit.js';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';


const router = express.Router();

// Definisi Rute
router.post('/sell-car', offerLimiter, createOffer);
router.get('/offers', authenticateAdmin, getAllOffers);

router.get('/offers/:id', authenticateAdmin, getOfferById);

router.patch('/offers/:id/status', authenticateAdmin, updateOfferStatus);
export default router;
