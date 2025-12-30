const registerService = require('../services/auth/registerService');
const loginService = require('../services/auth/loginService');
const getUserService = require('../services/auth/getUserService');
const verifyOtpService = require('../services/auth/verifyOtpService');
const resendOtpService = require('../services/auth/resendOtpService');
const forgotPasswordService = require('../services/auth/forgotPasswordService');
const resetPasswordService = require('../services/auth/resetPasswordService');

// ✅ Register
const register = async (req, res) => {
    try {
        await registerService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// ✅ Login
const login = async (req, res) => {
    try {
        await loginService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// ✅ Verify OTP
const verifyOtp = async (req, res) => {
    try {
        await verifyOtpService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// ✅ Resend OTP
const resendOtp = async (req, res) => {
    try {
        await resendOtpService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// ✅ Forgot Password
const forgotPassword = async (req, res) => {
    try {
        await forgotPasswordService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
    try {
        await resetPasswordService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// ✅ Get User Details
const getUser = async (req, res) => {
    try {
        await getUserService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    getUser,
};