const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/blogs/category/:slug", userController.ShowBlogsByCategory);

router.get("/blogs/:slug", userController.ShowBlogDetail);

router.get("/blogs", userController.ShowAllBlogs);

router.get("/", userController.Index);

module.exports = router;