import express from 'express';

// Controller
import { google, signOut, signin, signup, verifyAccount } from '../controllers/authController.js';

const router = express.Router();

// User Signup
router.post('/signup', signup);

// User Signin
router.post('/signin', signin);

// Google Signin
router.post('/google', google);

// Signout
router.get('/signout', signOut);

// Verify non-gmail
router.get('/verify/:token', verifyAccount);

export default router;
