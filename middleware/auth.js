const jwt = require("jsonwebtoken");
const User = require('../model/user');

// ✅ Auth Middleware
const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.unAuthorized({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.unAuthorized({ message: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Check if user exists
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.unAuthorized({ message: "User not found" });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.forbidden({
                message: "Please verify your email first"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.unAuthorized({ message: "Invalid token" });
    }
};

// ✅ Check if user is admin
const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.forbidden({
            message: "Forbidden. Admin access required."
        });
    }
    next();
};

module.exports = {
    isAuthenticated,
    isAdmin
};