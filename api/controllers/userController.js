// Model Imports
import Listing from '../models/Listing.js';
import User from '../models/User.js';

// Utils Imports
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

// Update User
export const updateUser = async (req, res, next) => {
  const displayName =
    req.body.firstName && req.body.lastName ? `${req.body.firstName} ${req.body.lastName}` : '';
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You are not authorized to do this action'));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          displayName: displayName,
          password: req.body.password,
          contactNumber: req.body.contactNumber,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Deactivate User
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401, 'Action is Forbidden'));

  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.clearCookie('access_token');
    res.status(200).json('User has been deactivated');
  } catch (error) {
    next(error);
  }
};

// Get User Listings
export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id, isActive: true });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Change State
export const changeState = async (req, res, next) => {
  const id = req.params.id;
  const action = req.params.action;
  try {
    const users = await User.findByIdAndUpdate({ _id: id }, { isActive: action });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Change Admin
export const changeAdmin = async (req, res, next) => {
  const id = req.params.id;
  const action = req.params.action;
  try {
    const users = await User.findByIdAndUpdate({ _id: id }, { isAdmin: action });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// View User
export const viewUser = async (req, res, next) => {
  try {
    const data = await User.findOne(
      { _id: req.params.id, isActive: true },
      { password: 0, isAdmin: 0, __v: 0, createdAt: 0, updatedAt: 0 }
    );
    if (data) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ state: false, message: 'User not found or is inactive.' });
    }
  } catch (error) {
    next(error);
  }
};
