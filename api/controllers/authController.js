import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';
import User from '../models/User.js';
import { errorHandler } from '../utils/error.js';
import verifyEmail from '../utils/verify.js';

// User signup
export const signup = async (req, res, next) => {
  const { firstName, lastName, username, email, password, contactNumber } = await req.body;
  const displayName = await `${firstName} ${lastName}`;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  try {
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(500).json({ state: false, message: 'email is already taken' });
    }
    const checkUsername = await User.findOne({ username: username });
    if (checkUsername) {
      return res.status(500).json({ state: false, message: 'username is already taken' });
    }
    if (!checkUsername && !checkEmail) {
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        displayName: displayName,
        username: username,
        email: email,
        password: hashedPassword,
        contactNumber: contactNumber,
      });
      await newUser.save();
      const token = await new Token({ userId: newUser._id, token: crypto.randomBytes(16).toString('hex') });
      await token.save();

      const link = `https://pangilinan-capstone-3.onrender.com/verify/${token.token}`;

      await verifyEmail(email, link);
      return res.status(201).json('user created successfully');
    }
  } catch (error) {
    next(error);
  }
};

// User Sign in
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email }, { __v: 0, createdAt: 0, updatedAt: 0 });
    if (!checkUser) return next(errorHandler(404, 'User not found!'));

    if (checkUser.isActive === false)
      return res.status(401).json({
        success: false,
        message:
          'User is currently not active! We have sent a verification email! Please verify your account.',
      });

    const validPassword = bcryptjs.compareSync(password, checkUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));

    const tokie = jwt.sign(
      { id: checkUser._id, email: checkUser.email, isAdmin: checkUser.isAdmin },
      process.env.KEY
    );
    const { password: pass, ...rest } = checkUser._doc;

    res.cookie('access_token', tokie, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Google Signup
export const google = async (req, res, next) => {
  try {
    const userCheck = await User.findOne({ email: req.body.email });
    if (userCheck) {
      const tokie = await jwt.sign(
        { id: userCheck._id, email: userCheck.email, isAdmin: userCheck.isAdmin },
        process.env.KEY
      );
      const { password: pass, ...rest } = await userCheck._doc;
      return res.cookie('access_token', tokie, { httpOnly: true }).status(200).json(rest);
    } else if (userCheck && userCheck.isActive === false) {
      return res.status(401).json({ success: false, message: 'User is currently not active!' });
    } else {
      const generatedPassword =
        (await Math.random().toString(36).slice(-8)) + Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generatedPassword, 10);
      const username =
        (await req.body.name.split(' ').join('').toLowerCase()) + Math.random().toString(36).slice(-4);
      const newUser = new User({
        displayName: req.body.name,
        username: username,
        email: req.body.email,
        password: hashPassword,
        avatar: req.body.photo,
        isActive: true,
      });
      const result = await newUser.save();
      if (result) {
        const tokie = await jwt.sign(
          { id: result._id, email: result.email, isAdmin: result.isAdmin },
          process.env.KEY
        );
        const { password: pass, ...rest } = await result._doc;
        return res.cookie('access_token', tokie, { httpOnly: true }).status(200).json(rest);
      }
    }
  } catch (error) {
    next(error);
  }
};

// Sign Out
export const signOut = (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!!');
  } catch (error) {
    next(error);
  }
};

export const verifyAccount = async (req, res, next) => {
  try {
    const token = await Token.findOne({
      token: req.params.token,
    });
    if (token) {
      await User.updateOne({ _id: token.userId }, { $set: { isActive: true } });
      await Token.findByIdAndDelete(token._id);
      return res
        .status(200)
        .json({ state: true, message: 'Verification Successful! You may not log on to your account' });
    } else {
      return res.status(404).json({ state: false, message: 'Invalid Token! Please try again!' });
    }
  } catch (error) {
    next(error);
  }
};
