import express from 'express';
import { verifyToken } from '../utils/token.js';

// controllers
import { createPurchase, getUserOrders, updateState, viewOrders } from '../controllers/purchaseController.js';

const router = express.Router();

// Create Purchase
router.post('/create/:productId', verifyToken, createPurchase);

// Get Orders
router.get('/view', verifyToken, viewOrders);

// Get User Orders
router.get('/transactions', verifyToken, getUserOrders);

// Update Order Status
router.put('/update/:id', verifyToken, updateState);

export default router;
