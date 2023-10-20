import express from 'express';

//controllers
import { addWish, deleteWish, getWishlist, purchaseWish } from '../controllers/wishController.js';
import { verifyToken } from '../utils/token.js';

const router = express.Router();

//Add to Wish
router.post('/wish/:id', verifyToken, addWish);

//Get wishlist
router.get('/wish/view', verifyToken, getWishlist);

//Purchase Wish
router.post('/wish/create/:id', verifyToken, purchaseWish);

//Delete Wish
router.delete('/wish/remove/:id', verifyToken, deleteWish);

export default router;
