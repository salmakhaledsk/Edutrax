const express = require('express');
const { register, login, verifyEmail,verifyEmailWithCode } = require('../controllers/authController');
const router = express.Router();

// Register
router.post("/register", register);

//Login
router.post("/login", login)

//Verify Account
router.get("/verify-email", verifyEmail);

//Verify with code
router.post('/verify-code', verifyEmailWithCode);

module.exports = router;