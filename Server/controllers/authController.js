const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User, validateRegisterUser, validateLoginUser } = require('../models/User');

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // use your email service
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
});

// Helper function to generate a random 5-digit code
const generateVerificationCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // Generates a random 5-digit code
};

//register
const register = asyncHandler(async (req, res) => {
  //Validation
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  //Create new user
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const verificationCode = generateVerificationCode(); // Generate verification code

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: "student",
    isVerified: false,
    verificationCode: verificationCode,
  });

  await user.save();

  //generate verification token
  const token = jwt.sign( { id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);
  const { password, ...other } = user._doc;

  // Send verification email
  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: 'EduTrax Email Verification',
    html: `<div>
    <h4>Click On The Link below to verify your email: </h4>
    <a href="http://localhost:3000/verify-email?token=${token}">Verify Your Email</a>
    <h4>OR:Use Your verification code :  ${verificationCode}</h4>
    </div>`
  })

  res.status(201).json({ message: 'You Registered is Successfully (^_^) , Please check your email to verify your account.', token, ...other });
});

// verification
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Invalid or missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

//Verification with code number
const verifyEmailWithCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and verification code are required' });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or verification code' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationCode = null; // Clear the verification code
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


//login
const login = asyncHandler(async (req, res) => {
  //validation
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //find user
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid Email or Password' });
  }

  if (!user.isVerified) {
    return res.status(400).json({ message: 'Please verify your email first' });
  }

  //compare password
  const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: 'Invalid Email or Password' });
  }

  //generate token
  const token = jwt.sign(
    { id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);
  const { password, ...other } = user._doc;
  res.status(200).json({ message: 'You Login in Successfully (^_^) ', ...other, token });
});

module.exports = {
  register,
  login,
  verifyEmail,
  verifyEmailWithCode
};
