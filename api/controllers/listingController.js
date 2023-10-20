import Listing from '../models/Listing.js';
import { errorHandler } from '../utils/error.js';

// Create Listing
export const createList = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    errorHandler(error.message);
  }
};

// Deactivate Listing
export const deactivateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You are not authorized!'));
  }

  try {
    await Listing.findByIdAndUpdate(req.params.id, { isActive: false });
    return res.status(200).json({ state: true, message: 'Listing is successfully archived' });
  } catch (error) {
    next(error);
  }
};

// Update Listings
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'Action Forbidden'));
  }
  try {
    const updateListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updateListing);
  } catch (error) {
    next(error);
  }
};

// Get Listing
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// Get Active Search Listings
export const getActiveListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === false) {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === false) {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === false) {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === false) {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sory || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      isActive: true,
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// Get all listings
export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({});

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// Change State
export const changeState = async (req, res, next) => {
  const id = req.params.id;
  const action = req.params.action;
  try {
    const listings = await Listing.findByIdAndUpdate({ _id: id }, { isActive: action });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};