const express = require("express");
const router = express.Router();
const upload = require('../config/multer');
const { isAuthenticated } = require('../middleware/auth');

const {
    createCategory,
    getCategories,
    getSpinnerCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCategoryStatistics
} = require("../controllers/categoryController");

// ✅ Protected routes (require authentication)
router.post("/", 
    isAuthenticated, 
    upload.single('image'), 
    createCategory
);

router.get("/", 
    isAuthenticated, 
    getCategories
);

// router.get("/stats", 
//     isAuthenticated, 
//     getCategoryStatistics
// );

router.get("/:id", 
    isAuthenticated, 
    getCategoryById
);

router.put("/:id", 
    isAuthenticated, 
    upload.single('image'), 
    updateCategory
);

router.delete("/:id", 
    isAuthenticated, 
    deleteCategory
);

// ✅ Public route (for spinner)
router.get("/spinner/all", 
    getSpinnerCategories
);

module.exports = router;