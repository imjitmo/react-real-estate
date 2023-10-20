// Dependencies
import mongoose from 'mongoose';

// User Schema
const wishSchema = new mongoose.Schema(
  {
    listing_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    ref_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Wish = mongoose.model('Wishes', wishSchema);

export default Wish;
