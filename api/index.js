// Server Dependencies
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
// import cron from 'node-cron';

import path from 'path';

//Access Routes
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js';
import purchaseRouter from './routes/purchaseRoutes.js';
import userRouter from './routes/userRoute.js';
import wishRouter from './routes/wishRoute.js';

//Environment Variable Config
dotenv.config();

// Restart server every 10minutes
/*
-Cron Job to restart a session every 10minutes
-This is to cancel out the Render Sleep Mode
-Commented to preserve free time on render
*/
// import pingHandler from './utils/cron.js';
// cron.schedule('*/13 * * * *', pingHandler);

// Server Setup and Routes
const port = 5000; // Sub Port

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

// Database Connection
mongoose
  .connect(process.env.dbURL)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

// Back-end Routes
app.use('/api/user', userRouter); // User Router End-Point
app.use('/api/auth', authRouter); // Auth Router End-Point
app.use('/api/listing', listingRouter); // Listing Router End-Point
app.use('/api/purchase', purchaseRouter); // Purchase Router End-Point
app.use('/api/wishlist', wishRouter); // Purchase Router End-Point

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Server Gateway Reponse
app.listen(process.env.PORT || port, () => {
  console.log(`API is now online on port: ${process.env.PORT || port}`);
});
