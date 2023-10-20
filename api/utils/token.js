// Dependencies
import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

// SECRET key from .env
const SECRET_KEY = process.env.KEY;

// Create Token
export const createAccessToken = (user) => {
  const userData = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(userData, SECRET_KEY);
};

// Verify User via Cookies
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Unauthorized Action'));
  jwt.verify(token, process.env.KEY, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));
    req.user = user;
    next();
  });
};

// Retreive token from the request header
export const verify = (req, res, next) => {
  // Auth Type is Bearer Token

  let token = req.headers.authorization;

  if (typeof token === 'undefined') {
    return res.send({ auth: 'Failed, No Token!' });
  } else {
    token = token.slice(7, token.length);
    jwt.verify(token, SECRET_KEY, function (error, decodedToken) {
      if (error) {
        return res.send({
          auth: 'Failed',
          message: error.message,
        });
      } else {
        req.user = decodedToken;

        // Will let the controller to proceed next
        next();
      }
    });
  }
};

// Verify User Level
export const verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.send({
      auth: 'Failed!',
      message: 'Access Forbidden',
    });
  }
};
