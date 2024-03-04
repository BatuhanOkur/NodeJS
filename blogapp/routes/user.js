const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.use("/blogs/category/:slug", userController.ShowBlogsByCategory);

router.use("/blogs/:slug", userController.ShowBlogDetail);

router.use("/blogs", userController.ShowAllBlogs);

router.use("/", userController.Index);

module.exports = router;