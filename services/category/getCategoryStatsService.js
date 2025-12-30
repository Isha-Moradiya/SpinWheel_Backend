const Category = require('../../model/category');

const getCategoryStatsService = async (req, res) => {
    try {
        const user = req.user;

        // Get category count
        const categoryCount = await Category.countDocuments({ 
            user: user.id,
            isActive: true 
        });

        // Get latest category
        const latestCategory = await Category.findOne({ 
            user: user.id,
            isActive: true 
        }).sort('-createdAt');

        return res.success({
            message: 'Category statistics retrieved successfully',
            data: {
                stats: {
                    total: categoryCount,
                    remaining: 8 - categoryCount,
                    canAddMore: categoryCount < 8,
                    latestCreated: latestCategory ? latestCategory.createdAt : null
                }
            }
        });

    } catch (error) {
        console.error('Get category stats service error:', error);
        throw error;
    }
};

module.exports = getCategoryStatsService;