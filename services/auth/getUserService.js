const getUserService = async (req, res) => {
    try {
        // User is already attached by auth middleware
        const user = req.user;

        return res.success({
            message: 'User retrieved successfully',
            data: {
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
        console.error('Get user service error:', error);
        throw error;
    }
};

module.exports = getUserService;