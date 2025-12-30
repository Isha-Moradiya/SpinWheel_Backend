const User = require('../../model/user');
const Otp = require("../../model/otp");
const { generateOTP } = require('../../utils/otpGenerator');
const { sendOTPEmail } = require('../../utils/emailService');
const { forgotPasswordSchema } = require('../../validation/authValidation');

const forgotPasswordService = async (req, res) => {
    try {
        const { error, value } = forgotPasswordSchema.validate(req.body);
        if (error) {
            return res.validationError({ message: error.details[0].message });
        }
        const { email } = value;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.recordNotFound({ message: 'User not found' });
        }

        // Update user
        user.isVerified = true;
        await user.save();

        // Delete old OTPs for this user
        await Otp.deleteMany({ email });

        // Generate new OTP
        const { otpCode, otpExpiry } = generateOTP();

        await Otp.create({
            email,
            otp: otpCode,
            expiresAt: otpExpiry,
        });

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otpCode);

        if (!emailSent) {
            return res.internalServerError({ message: 'Failed to send OTP email' });
        }

        return res.success({
            message: 'Password reset OTP sent to your email',
            data: {}
        });

    } catch (error) {
        console.error('Forgot password service error:', error);
        throw error;
    }
};

module.exports = forgotPasswordService;