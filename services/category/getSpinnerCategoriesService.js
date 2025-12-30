const Category = require('../../model/category');

const getSpinnerCategoriesService = async (req, res) => {
    try {
        // Get categories for spinner (public access)
        const categories = await Category.find({ isActive: true })
            .populate('user', 'name email')
            .sort('order')
            .limit(8);

        // Transform categories
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const transformedCategories = categories.map(category => ({
            id: category._id,
            title: category.title,
            description: category.description,
            color: category.color,
            image: `${baseUrl}/${category.image.replace(/\\/g, '/')}`,
            order: category.order,
            user: category.user ? {
                id: category.user._id,
                name: category.user.name
            } : null
        }));

        // Check if we have enough categories for spinner
        const canSpin = transformedCategories.length >= 3;

        return res.success({
            message: canSpin ? 'Spinner categories retrieved successfully' : 'Not enough categories for spinner',
            data: {
                categories: transformedCategories,
                count: transformedCategories.length,
                canSpin
            }
        });

    } catch (error) {
        console.error('Get spinner categories service error:', error);
        throw error;
    }
};

module.exports = getSpinnerCategoriesService;