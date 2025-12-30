const createCategoryService = require('../services/category/createCategoryService');
const getCategoriesService = require('../services/category/getCategoriesService');
const getCategoryByIdService = require('../services/category/getCategoryByIdService');
const updateCategoryService = require('../services/category/updateCategoryService');
const deleteCategoryService = require('../services/category/deleteCategoryService');
const getSpinnerCategoriesService = require('../services/category/getSpinnerCategoriesService');
const getCategoryStatsService = require('../services/category/getCategoryStatsService');

// ✅ Create Category
const createCategory = async (req, res) => {
    try {
        await createCategoryService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// ✅ Get All Categories
const getCategories = async (req, res) => {
    try {
        await getCategoriesService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// ✅ Get Category by ID
const getCategoryById = async (req, res) => {
    try {
        await getCategoryByIdService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// ✅ Update Category
const updateCategory = async (req, res) => {
    try {
        await updateCategoryService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// ✅ Delete Category
const deleteCategory = async (req, res) => {
    try {
        await deleteCategoryService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// ✅ Get Spinner Categories (Public)
const getSpinnerCategories = async (req, res) => {
    try {
        await getSpinnerCategoriesService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// ✅ Get Category Statistics
const getCategoryStats = async (req, res) => {
    try {
        await getCategoryStatsService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getSpinnerCategories,
    getCategoryStats
};