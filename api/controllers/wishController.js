import Listing from '../models/Listing.js';
import Purchase from '../models/Purchase.js';
import Wish from '../models/Wish.js';

// Add Wish
export const addWish = async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      return res.status(500).json('Sorry Admin, Access Forbidden!');
    }
    const wish = await Wish.findOne({ listing_id: req.params.id });
    if (wish) return res.status(500).json({ state: false, message: 'Aleady in the wishlist' });
    const listings = await Listing.findById({ _id: req.params.id });
    if (listings) {
      const list_id = listings._id;
      const user_id = req.user.id;
      const ref_id = listings.userRef;

      const newWish = new Wish({
        listing_id: list_id,
        user_id: user_id,
        ref_id: ref_id,
      });

      const checkWish = await newWish.save();

      if (checkWish) {
        return res.status(200).json(checkWish);
      } else {
        return res.status(500).json('Internal Server Error');
      }
    } else {
      return res.status(404).json('Listing Not Found!');
    }
  } catch (error) {
    next(error);
  }
};

// Get Wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wish.find({ user_id: req.user.id });
    const wishes = await wishlist.map((wishlist) => wishlist.listing_id);
    const listing = await Listing.find({ _id: { $in: wishes } });
    if (listing) {
      return res.status(200).json(listing);
    } else {
      return res.status(404).json({ state: false, message: 'No Wishlist found' });
    }
  } catch (error) {
    next(error);
  }
};

// Purchase Wish
export const purchaseWish = async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      return res.status(500).json('Sorry Admin! Forbidden Acccess');
    }
    const product_id = req.params.id;
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
      await newPurchase.save();
      const action = checkStatus.type === 'rent' ? 'Rented' : 'Purchased';
      const listing = await Listing.findByIdAndUpdate({ _id: product_id }, { isAvailable: false });
      const wish = await Wish.deleteOne({ user_id: req.user.id, listing_id: product_id });
      return res.status(200).json({ state: true, message: `${action} Property Successfully!` });
    }
    return res.status(404).json({ state: false, message: 'Property is not available!' });
  } catch (error) {
    next(error);
  }
};

// Delete Wish
export const deleteWish = async (req, res, next) => {
  const wishId = req.params.id;
  const userId = req.user.id;
  try {
    const wish = await Wish.deleteOne({ listing_id: wishId, user_id: userId });
    if (wish) {
      return res.status(200).json({ state: true, message: 'Wish removed successfully!' });
    } else {
      return res.status(500).json({ state: false, message: 'Something went wrong!' });
    }
  } catch (error) {
    next(error);
  }
};
