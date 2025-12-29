const Category = require('../../model/category');
const { deleteImageFile } = require('../../utils/fileCleanup');

const createCategoryService = async (req, res) => {
    try {
        const { title, description, color } = req.body;
        const user = req.user;

        // Check max categories limit
        const canAddMore = await Category.canAddMoreCategories(user.id);
        if (!canAddMore) {
            // Clean up uploaded file
            if (req.file) {
                await deleteImageFile(req.file.path);
            }
            return res.badRequest({ message: 'Maximum limit of 8 categories reached' });
        }

        // Check unique title
        const existingCategory = await Category.findOne({
            user: user.id,
            title: new RegExp(`^${title}$`, 'i'),
            isActive: true
        });

        if (existingCategory) {
            // Clean up uploaded file
            if (req.file) {
                await deleteImageFile(req.file.path);
            }
            return res.badRequest({ message: 'Category with this title already exists' });
        }

        // Check if image was uploaded
        if (!req.file) {
            return res.badRequest({ message: 'Category image is required' });
        }

        // Get next order
        const order = await Category.getNextOrder(user.id);

        // Create category
        const category = await Category.create({
            title,
            description: description || '',
            color: color || '#3B82F6',
            image: req.file.path,
            user: user.id,
            order
        });

        // Transform image path to URL
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;

        return res.success({
            message: 'Category created successfully',
            data: {
                category: {
                    id: category._id,
                    title: category.title,
                    description: category.description,
                    color: category.color,
                    image: imageUrl,
                    order: category.order,
                    createdAt: category.createdAt
                }
            }
        });

    } catch (error) {
        console.error('Create category service error:', error);
        // Clean up uploaded file on error
        if (req.file) {
            await deleteImageFile(req.file.path);
        }
        throw error;
    }
};

module.exports = createCategoryService;