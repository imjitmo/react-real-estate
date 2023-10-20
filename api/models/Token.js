// Dependencies
import mongoose from 'mongoose';

// User Schema
const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: 'user',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Token = mongoose.model('Token', tokenSchema);

export default Token;
