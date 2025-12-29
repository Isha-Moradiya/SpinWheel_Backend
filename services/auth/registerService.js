const User = require('../../model/user');
const { generateOTP } = require('../../utils/otpGenerator');
const { sendOTPEmail } = require('../../utils/emailService');
const bcrypt = require("bcryptjs");
const { registerSchema } = require('../../validation/authValidation');
const Otp = require('../../model/otp');

module.exports = async (req, res) => {
    try {
        const { error, value } = await registerSchema.validate(req.body);
        if (error) {
            return res.validationError({ message: error.details[0].message });
        }

        const { name, email, password } = value;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.badRequest({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            role: "admin"
        });

        // Generate OTP
        const { otpCode, otpExpiry } = generateOTP();

        await Otp.create({
            email,
            otp: otpCode,
            expiresAt: otpExpiry,
        });

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otpCode);

        if (!emailSent) {
            return res.badRequest({ message: 'Failed to send OTP email' });
        }

        return res.success({
            message: 'Registration successful. OTP sent to your email.',
            data: {}
        });

    } catch (error) {
        return res.internalServerError({
            message: "Registration failed",
            data: { errors: error.message },
        });
    }
};