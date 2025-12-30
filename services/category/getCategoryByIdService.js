const Category = require('../../model/category');

const getCategoryByIdService = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        // Get category
        const category = await Category.findOne({
            _id: id,
            user: user.id,
            isActive: true
        });

        if (!category) {
            return res.recordNotFound({ message: 'Category not found' });
        }

        // Transform image path to URL
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/${category.image.replace(/\\/g, '/')}`;

        return res.success({
            message: 'Category retrieved successfully',
            data: {
                category: {
                    id: category._id,
                    title: category.title,
                    description: category.description,
                    color: category.color,
                    image: imageUrl,
                    order: category.order,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Get category by ID service error:', error);
        throw error;
    }
};

module.exports = getCategoryByIdService;