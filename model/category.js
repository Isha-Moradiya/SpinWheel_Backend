const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    image: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        trim: true,
        default: ""
    },

    color: {
        type: String,
        default: "#3B82F6",
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    order: {
        type: Number,
        default: 0,
        min: 0,
        index: true
    },

    isActive: {
        type: Boolean,
        default: true,
        index: true
    }

}, { timestamps: true });

// ✅ Check if user can add more categories
categorySchema.statics.canAddMoreCategories = async function(userId) {
    const count = await this.countDocuments({ 
        user: userId, 
        isActive: true 
    });
    return count < 8;
};

// ✅ Get next order number
categorySchema.statics.getNextOrder = async function(userId) {
    const lastCategory = await this.findOne({ user: userId })
        .sort('-order')
        .select('order');
    
    return lastCategory ? lastCategory.order + 1 : 0;
};

module.exports = mongoose.model('Category', categorySchema);