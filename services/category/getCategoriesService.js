const Category = require('../../model/category');

const getCategoriesService = async (req, res) => {
    try {
        const user = req.user;

        // Get categories
        const categories = await Category.find({ 
            user: user.id,
            isActive: true 
        }).sort('order');

        // Transform image paths to URLs
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const transformedCategories = categories.map(category => ({
            id: category._id,
            title: category.title,
            description: category.description,
            color: category.color,
            image: `${baseUrl}/${category.image.replace(/\\/g, '/')}`,
            order: category.order,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        }));

        // Get category count
        const categoryCount = await Category.countDocuments({ 
            user: user.id,
            isActive: true 
        });

        return res.success({
            message: 'Categories retrieved successfully',
            data: {
                categories: transformedCategories,
                count: categoryCount,
                remaining: 8 - categoryCount
            }
        });

    } catch (error) {
        console.error('Get categories service error:', error);
        throw error;
    }
};

module.exports = getCategoriesService;