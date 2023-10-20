import express from 'express';
import { verifyAdmin, verifyToken } from '../utils/token.js';

// controllers
import {
  changeState,
  createList,
  deactivateListing,
  getActiveListings,
  getAllListings,
  getListing,
  updateListing,
} from '../controllers/listingController.js';

const router = express.Router();

// Create Listing
router.post('/create', verifyToken, createList);

// Deactivate Listing
router.put('/archive/:id', verifyToken, deactivateListing);

// Update Listing
router.post('/update/:id', verifyToken, updateListing);

// Get User's Listing
router.get('/get/:id', getListing);

// Get All Active Search Listings
router.get('/get', getActiveListings);

// Get All Listings
router.get('/all', verifyToken, verifyAdmin, getAllListings);

// Change Listing State
router.put('/change/:action/:id', verifyToken, verifyAdmin, changeState);

export default router;
