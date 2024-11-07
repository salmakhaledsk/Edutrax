const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, validateRegisterUser, validateUpdateUser } = require('../models/User');
const path = require('path');
const fs = require('fs');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary")

//get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json(users);
});

//get user by id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.status(200).json(user);
  }
  res.status(404).json({ message: 'User not found' });
});

//update user
const putUser = asyncHandler(async (req, res) => {
  //Validation
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        title: req.body.title,
        about: req.body.about,
      },
    },
    {
      new: true,
    }
  ).select('-password');
  res.status(200).json(updatedUser);
});

//upload profile photo
const profilePhotoUpload = asyncHandler(async (req, res) => {

  //Validation
  if (!req.file) {
    return res.status(400).json({ message: "No File Provided" });
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // Upload to cloudinary
  const result = await cloudinaryUploadImage(imagePath);
  console.log(result);

  //Get the user from DB
  const user = await User.findById(req.user.id);

  //Delete the old profile photo if exist
  if (user.avatar.publicId !== null) {
    await cloudinaryRemoveImage(user.avatar.publicId);
  }

  //Change the profilePhoto field in the DB
  user.avatar = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();

  //Send response to client
  res.status(200).json({
    message: "your profile photo uploaded successfully",
    profilePhoto: { url: result.secure_url, publicId: result.public_id },
  });

  //Remvoe image from the server
  fs.unlinkSync(imagePath);
});

//delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  // user.removed = true ;
  if (user) {
    if (user.avatar.publicId !== null) {
      await cloudinaryRemoveImage(user.avatar.publicId);
    }
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'User Deleted Successfully' });
  }
  res.status(404).json({ message: 'User not found' });
});

//get all Instructors
const getAllInstructors = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "instructor" }).select('-password');
  res.status(200).json(users);
});


const getAllstudents = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "student" }).select('-password');
  res.status(200).json(users);
});

//post an Instructors
const postInstructor = asyncHandler(async (req, res) => {
  //Validation
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  //Create new instructor
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    title: req.body.title,
    about: req.body.about,
    role: "instructor",
    isVerified: true
  });

  const result = await user.save();

  //generate token
  const token = jwt.sign(
    { id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);
  const { password, ...other } = result._doc;
  res.status(201).json({ message: 'Instructor added Successfully (^_^) ', ...other, token });
});



//user count
const getUsersCount = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    res.status(200).json({ count: studentCount });
  } catch (error) {
    console.error('Error counting student users:', error);
    res.status(500).json({ message: 'Error retrieving student count', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  putUser,
  deleteUser,
  profilePhotoUpload,
  getAllInstructors,
  postInstructor,
  getUsersCount,
  getAllstudents
};
