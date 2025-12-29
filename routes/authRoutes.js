const express = require("express");
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

const {
    register,
    login,
    resendOtp,
    resetPassword,
    forgotPassword,
    verifyOtp,
    getUser,
} = require("../controllers/authController");

// ✅ Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/resend-otp", resendOtp);
router.post("/reset-password", resetPassword);

// ✅ Protected routes
router.get("/me", isAuthenticated, getUser);

module.exports = router;