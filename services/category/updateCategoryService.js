const Category = require('../../model/category');
const { deleteImageFile } = require('../../utils/fileCleanup');

const updateCategoryService = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, color } = req.body;
        const user = req.user;

        // Find category
        let category = await Category.findOne({
            _id: id,
            user: user.id,
            isActive: true
        });

        if (!category) {
            // Clean up uploaded file
            if (req.file) {
                await deleteImageFile(req.file.path);
            }
            return res.recordNotFound({ message: 'Category not found' });
        }

        // Check unique title if changing
        if (title && title !== category.title) {
            const existingCategory = await Category.findOne({
                user: user.id,
                title: new RegExp(`^${title}$`, 'i'),
                _id: { $ne: id },
                isActive: true
            });

            if (existingCategory) {
                // Clean up uploaded file
                if (req.file) {
                    await deleteImageFile(req.file.path);
                }
                return res.conflict({ message: 'Category with this title already exists' });
            }
        }

        // Store old image for cleanup
        const oldImagePath = category.image;

        // Update fields
        if (title !== undefined) category.title = title;
        if (description !== undefined) category.description = description;
        if (color !== undefined) category.color = color;
        if (req.file) category.image = req.file.path;

        await category.save();

        // Delete old image if new one was uploaded
        if (req.file && oldImagePath) {
            await deleteImageFile(oldImagePath);
        }

        // Transform image path to URL
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imagePath = req.file ? req.file.path : oldImagePath;
        const imageUrl = `${baseUrl}/${imagePath.replace(/\\/g, '/')}`;

        return res.success({
            message: 'Category updated successfully',
            data: {
                category: {
                    id: category._id,
                    title: category.title,
                    description: category.description,
                    color: category.color,
                    image: imageUrl,
                    order: category.order,
                    updatedAt: category.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Update category service error:', error);
        // Clean up uploaded file on error
        if (req.file) {
            await deleteImageFile(req.file.path);
        }
        throw error;
    }
};

module.exports = updateCategoryService;