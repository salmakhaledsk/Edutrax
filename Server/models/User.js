const mongoose = require('mongoose');
const joi = require('joi');
const passComplexity = require('joi-password-complexity');

//User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
      minlength: 5,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      index: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['instructor', 'student', 'admin'],
      default: 'student',
    },
    // instructor fields optional
    title: {
      type: String,
      minlength: 2,
    },
    about: {
      type: String,
      minlength: 2,
    },
    avatar: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        publicId: null,
      }
    },
    removed: {
      type: Boolean,
      default: false,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: false
    },
    verificationCode: {
      type: String,
      required: false
    },
  },
  {
    timestamps: true, //It will add createdAt and updatedAt field in our schema by default
  }
);

//user model
const User = mongoose.model('User', UserSchema);

//User Validation
function validateRegisterUser(obj) {
  const schema = joi.object({
    name: joi.string().trim().min(2).max(200),
    email: joi.string().trim().min(5).max(100).email().required(),
    password: passComplexity().required(),
    role: joi.string().valid('student'),
    title: joi.string().min(3),
    about: joi.string().min(2),
  });
  return schema.validate(obj);
}

function validateLoginUser(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(3).max(100).email().required(),
    password: joi.string().trim().min(6).max(50).required(),
  });
  return schema.validate(obj);
}

function validateUpdateUser(obj) {
  const schema = joi.object({
    name: joi.string().trim().min(2).max(200),
    email: joi.string().trim().min(5).max(100).email(),
    password: joi.string().trim().min(6).max(50),
    title: joi.string().min(3),
    about: joi.string().min(2),
  });
  return schema.validate(obj);
}

function validateChangePassword(obj) {
  const schema = joi.object({
    password: joi.string().trim().min(6).max(50).required(),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateChangePassword,
};
