const Category = require('../../model/category');

const deleteCategoryService = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        // Check confirmation
        if (!req.body.confirm) {
            return res.badRequest({ 
                message: 'Please confirm deletion by sending confirm: true in request body' 
            });
        }

        // Find category
        const category = await Category.findOne({
            _id: id,
            user: user.id,
            isActive: true
        });

        if (!category) {
            return res.recordNotFound({ message: 'Category not found' });
        }

        // Soft delete
        category.isActive = false;
        await category.save();

        // Update order of remaining categories
        await Category.updateMany(
            { 
                user: user.id, 
                order: { $gt: category.order },
                isActive: true 
            },
            { $inc: { order: -1 } }
        );

        return res.success({
            message: 'Category deleted successfully'
        });

    } catch (error) {
        console.error('Delete category service error:', error);
        throw error;
    }
};

module.exports = deleteCategoryService;