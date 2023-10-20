// Dependencies
import mongoose from 'mongoose';

// User Schema
const purchaseSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Purchase = mongoose.model('Purchases', purchaseSchema);
export default Purchase;
