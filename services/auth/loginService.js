const User = require('../../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { loginSchema } = require('../../validation/authValidation');

module.exports = async (req, res) => {
    try {
        const { error, value } = await loginSchema.validate(req.body);
        if (error) {
            return res.validationError({ message: error.details[0].message });
        }
        const { email, password } = value;

        // Find user with password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.badRequest({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.badRequest({
                message: "Invalid email or password",
            });
        }

        // Check if verified
        if (!user.isVerified) {
            return res.validationError({ message: 'Please verify your email first' });
        }

        // Generate token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        return res.success({
            message: 'Login successful',
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
        console.error('Login service error:', error);
        throw error;
    }
};
