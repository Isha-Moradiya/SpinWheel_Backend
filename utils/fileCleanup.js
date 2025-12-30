const fs = require('fs').promises;
const path = require('path');

// ✅ Delete image file
const deleteImageFile = async (imagePath) => {
    try {
        if (imagePath && !imagePath.startsWith('http')) {
            const fullPath = path.join(__dirname, '..', imagePath);
            await fs.unlink(fullPath);
        }
    } catch (error) {
        // Ignore if file doesn't exist
        if (error.code !== 'ENOENT') {
            console.error('Error deleting image file:', error);
        }
    }
};

module.exports = {
    deleteImageFile
};