const Joi = require("joi");

// ✅ Register Validation Schema
const registerSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]*$/)
        .required()
        .messages({
            "string.min": "Name must be at least 2 characters",
            "string.max": "Name cannot exceed 50 characters",
            "string.pattern.base": "Name can only contain letters and spaces",
            "any.required": "Name is required",
        }),

    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required()
        .messages({
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .min(6)
        .max(50)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password cannot exceed 50 characters",
            "string.pattern.base":
                "Password must contain at least one letter and one number",
            "any.required": "Password is required",
        }),
});

// ✅ Login Validation Schema
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required()
        .messages({
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .min(6)
        .max(50)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password cannot exceed 50 characters",
            "string.pattern.base":
                "Password must contain at least one letter and one number",
            "any.required": "Password is required",
        }),
});

// ✅ OTP Verification Schema
const verifyOtpSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required()
        .messages({
            "string.email": "Please enter a valid email address",
        }),

    otp: Joi.string()
        .length(6)
        .pattern(/^\d+$/)
        .required()
        .messages({
            "string.length": "OTP must be exactly 6 digits",
            "string.pattern.base": "OTP must contain only numbers",
            "any.required": "OTP is required",
        }),
});

// ✅ Resend OTP Schema
const resendOtpSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required()
        .messages({
            "string.email": "Please enter a valid email address",
        }),
});

// ✅ Forgot Password Schema
const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required()
        .messages({
            "string.email": "Please enter a valid email address",
        }),
});

// ✅ Reset Password Schema
const resetPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required()
        .messages({
            "string.email": "Please enter a valid email address",
        }),

    newPassword: Joi.string()
        .min(6)
        .max(50)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password cannot exceed 50 characters",
            "string.pattern.base":
                "Password must contain at least one letter and one number",
        }),

    confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref("newPassword"))
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Confirm password is required",
        }),
});

module.exports = {
    registerSchema,
    loginSchema,
    verifyOtpSchema,
    resendOtpSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};
