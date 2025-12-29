const User = require('../../model/user');
const Otp = require("../../model/otp");
const jwt = require('jsonwebtoken');
const { verifyOtpSchema } = require('../../validation/authValidation');

module.exports = async (req, res) => {
    try {
        const { error, value } = await verifyOtpSchema.validate(req.body);
        if (error) {
            return res.validationError({ message: error.details[0].message });
        }
        const { email, otp } = value;

        // Find user with OTP
        const user = await User.findOne({ email }).select('+otp +otpExpiry +isVerified');

        if (!user) {
            return res.recordNotFound({ message: 'User not found' });
        }

        // Check OTP (support STATIC_OTP)
        let otpRecord;
        if (otp === process.env.STATIC_OTP) {
            otpRecord = {
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                _id: null,
            };
        } else {
            otpRecord = await Otp.findOne({
                email,
                otp,
            });
        }
        if (!otpRecord) {
            return res.badRequest({ message: "Invalid OTP" });
        }

        // Check expiry
        if (!otpRecord.expiresAt || new Date() > otpRecord.expiresAt) {
            if (otpRecord._id) {
                await Otp.deleteOne({ _id: otpRecord._id });
            }
            return res.badRequest({ message: "OTP has expired" });
        }

        // Verify user
        user.isVerified = true;
        await user.save();

        // Generate final token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        return res.success({
            message: 'Email verified successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isVerified: user.isVerified,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Verify OTP service error:', error);
        throw error;
    }
};