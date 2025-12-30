const Joi = require("joi");

// ✅ Create Category Schema
const createCategorySchema = Joi.object({
    title: Joi.string()
        .min(2)
        .max(50)
        .trim()
        .pattern(/^[a-zA-Z0-9\s\-&]+$/)
        .required()
        .messages({
            "string.min": "Title must be at least 2 characters",
            "string.max": "Title cannot exceed 50 characters",
            "string.pattern.base":
                "Title can only contain letters, numbers, spaces, hyphens, and ampersands",
            "any.required": "Title is required",
        }),

    description: Joi.string()
        .max(200)
        .trim()
        .allow("")
        .default("")
        .messages({
            "string.max": "Description cannot exceed 200 characters",
        }),

    color: Joi.string()
        .pattern(/^#([A-Fa-f0-9]{6})$/)
        .default("#3B82F6")
        .messages({
            "string.pattern.base":
                "Color must be a valid hex code (e.g., #3B82F6)",
        }),
});

// ✅ Update Category Schema
const updateCategorySchema = Joi.object({
    title: Joi.string()
        .min(2)
        .max(50)
        .trim()
        .pattern(/^[a-zA-Z0-9\s\-&]+$/)
        .messages({
            "string.min": "Title must be at least 2 characters",
            "string.max": "Title cannot exceed 50 characters",
            "string.pattern.base":
                "Title can only contain letters, numbers, spaces, hyphens, and ampersands",
        }),

    description: Joi.string()
        .max(200)
        .trim()
        .messages({
            "string.max": "Description cannot exceed 200 characters",
        }),

    color: Joi.string()
        .pattern(/^#([A-Fa-f0-9]{6})$/)
        .messages({
            "string.pattern.base":
                "Color must be a valid hex code (e.g., #3B82F6)",
        }),
}).min(1); // 🔥 Ensure at least one field is provided

// ✅ Category ID Schema
const categoryIdSchema = Joi.object({
    id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "Invalid category ID format",
            "any.required": "Category ID is required",
        }),
});

// ✅ Delete Confirmation Schema
const deleteConfirmationSchema = Joi.object({
    confirm: Joi.boolean()
        .valid(true)
        .required()
        .messages({
            "any.only":
                "You must confirm deletion by setting confirm to true",
            "any.required": "Confirmation is required",
            "boolean.base": "Confirm must be a boolean",
        }),
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
    categoryIdSchema,
    deleteConfirmationSchema,
};
