const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { User, validateChangePassword } = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

router.get("/forgot-password", asyncHandler(async (req, res) => {
    res.json({ message: "Please send a POST request to reset your password." });
}));

router.post("/forgot-password", asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const secret = process.env.JWT_SECRET_KEY + user.password;
    const token = jwt.sign({ email: user.email, id: user.id }, secret, {
        expiresIn: '10m'
    });

    const link = `http://localhost:3000/password/reset-password/${user._id}/${token}`;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
        }
    });
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: user.email,
        subject: 'Reset your Password',
        html: `<div>
    <h4>Click On The Link below to reset your password </h4>
    <p>${link}</p>
    </div>`
    };

    transporter.sendMail(mailOptions, function (error, success) {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong :(" });
        } else {
            console.log('Email sent: ' + success.response);
            res.json({ message: "Reset password link has been sent to your email." });
        }
    });
}));

router.get("/reset-password/:userId/:token", asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const secret = process.env.JWT_SECRET_KEY + user.password;
    try {
        jwt.verify(req.params.token, secret);
        res.json({ message: "Token is valid", userId: req.params.userId, token: req.params.token });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
}));

router.post("/reset-password/:userId/:token", asyncHandler(async (req, res) => {
    const { error } = validateChangePassword(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const secret = process.env.JWT_SECRET_KEY + user.password;
    try {
        jwt.verify(req.params.token, secret);
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        user.password = req.body.password;
        await user.save();
        res.json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
}));

module.exports = router;