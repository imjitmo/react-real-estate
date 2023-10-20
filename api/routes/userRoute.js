import express from 'express';

import { verifyAdmin, verifyToken } from '../utils/token.js';

// Controller
import {
  changeAdmin,
  changeState,
  deleteUser,
  getAllUsers,
  getUserListings,
  updateUser,
  viewUser,
} from '../controllers/userController.js';

// Routing Components
const router = express.Router();

// Update User
router.post('/update/:id', verifyToken, updateUser);

// Deactivate User
router.put('/delete/:id', verifyToken, deleteUser);

// View Listings
router.get('/listings/:id', verifyToken, getUserListings);

// Get All Users
router.get('/all', verifyToken, verifyAdmin, getAllUsers);

// Change Listing State
router.put('/change/:action/:id', verifyToken, verifyAdmin, changeState);

// Change Admin State
router.put('/admin/:action/:id', verifyToken, verifyAdmin, changeAdmin);

// View User
router.get('/view/profile/:id', verifyToken, viewUser);

// Exports
export default router;
