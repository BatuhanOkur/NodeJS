const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.use("/blogs/category/:categoryid", userController.ShowBlogsByCategory);

router.use("/blogs/:blogid", userController.ShowBlogDetail);

router.use("/blogs", userController.ShowAllBlogs);

router.use("/", userController.ShowPopularBlogs);

module.exports = router;