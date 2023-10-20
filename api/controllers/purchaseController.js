import Listing from '../models/Listing.js';
import Purchase from '../models/Purchase.js';

// Utils Imports
import { errorHandler } from '../utils/error.js';

export const createPurchase = async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      return res.status(500).json('Sorry Admin! Forbidden Acccess');
    }
    const product_id = req.params.productId;
    const userId = req.user.id;
    const checkStatus = await Listing.findOne({ _id: product_id, isAvailable: true });
    if (checkStatus) {
      const newPurchase = new Purchase({
        listing_id: product_id,
        user_id: userId,
        ref_id: checkStatus.userRef,
        type: checkStatus.type,
        price: checkStatus.regularPrice,
        discount: checkStatus.discountPrice,
        name: checkStatus.name,
      });
      const action = checkStatus.type === 'rent' ? 'Rented' : 'Purchased';
      const purchase = await newPurchase.save();
      const listing = await Listing.findByIdAndUpdate({ _id: product_id }, { isAvailable: false });
      return res.status(200).json({ state: true, message: `${action} Property Successfully!` });
    }
    return res.status(404).json({ state: false, message: 'Property is not available!' });
  } catch (error) {
    next(error);
  }
};

// View Own Orders
export const viewOrders = async (req, res, next) => {
  try {
    const purchase = await Purchase.find({ user_id: req.user.id });
    if (!purchase) {
      res.status(404).json(purchase);
      return;
    }
    res.status(200).json(purchase);
  } catch (error) {
    next(error);
  }
};

// Get User Orders
export const getUserOrders = async (req, res, next) => {
  try {
    const purchase = await Purchase.find({ ref_id: req.user.id });
    if (!purchase) {
      res.status(404).json(purchase);
      return;
    }
    res.status(200).json(purchase);
  } catch (error) {
    next(error);
  }
};

// Update Order Status
export const updateState = async (req, res, next) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate({ _id: req.params.id }, { status: req.body.status });
    res.status(200).json(purchase);
  } catch (error) {
    next(error);
  }
};
