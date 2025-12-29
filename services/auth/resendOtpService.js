const User = require('../../model/user');
const Otp = require("../../model/otp");
const { generateOTP } = require('../../utils/otpGenerator');
const { sendOTPEmail } = require('../../utils/emailService');
const { resendOtpSchema } = require('../../validation/authValidation');

const resendOtpService = async (req, res) => {
    try {
        const { error, value } = await resendOtpSchema.validate(req.body);
        if (error) {
            return res.validationError({ message: error.details[0].message });
        }
        const { email } = value;

        // Find user
        const user = await User.findOne({ email }).select('+otp +otpExpiry +isVerified');

        if (!user) {
            return res.recordNotFound({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.badRequest({ message: 'Email is already verified' });
        }

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
            message: 'OTP resent successfully',
            data: {}
        });

    } catch (error) {
        console.error('Resend OTP service error:', error);
        throw error;
    }
};

module.exports = resendOtpService;