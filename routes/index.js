const { Router } = require("express");
const authRoute = require("./authRoutes");
const categoryRoute = require("./categoryRoutes");

const router = Router();

// router.use("/", healthCheckRoute);
router.use("/auth", authRoute);
router.use("/categories", categoryRoute);

module.exports = router;
