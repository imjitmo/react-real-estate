// Dependencies
import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    displayName: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/da3lvrezp/image/upload/v1697059103/avatars/xthbbu8lyzkdaez8twwq.jpg',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('Users', userSchema);
export default User;
