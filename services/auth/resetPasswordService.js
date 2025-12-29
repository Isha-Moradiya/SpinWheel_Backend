const User = require('../../model/user');
const bcrypt = require("bcryptjs");
const { resetPasswordSchema } = require('../../validation/authValidation');

const resetPasswordService = async (req, res) => {
    try {
        const { error, value } = await resetPasswordSchema.validate(req.body);
        if (error) {
            return res.validationError({ message: error.details[0].message });
        }
        const { email, newPassword, confirmPassword } = value;

        if (newPassword !== confirmPassword) {
            return res.badRequest({ message: "Passwords do not match" });
        }

        // Find user with OTP
        const user = await User.findOne({ email });

        if (!user) {
            return res.recordNotFound({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;
        user.isVerified = true;
        await user.save();

        return res.success({
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Reset password service error:', error);
        throw error;
    }
};

module.exports = resetPasswordService;