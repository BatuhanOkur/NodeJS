const express = require("express");
const router = express.Router();
const imageUpload = require("../helpers/image-upload");
const fs = require("fs");
const adminController = require("../controllers/admin");
const isAuth = require("../middlewares/auth");




router.get("/blog/delete/:blogid", isAuth, adminController.ShowBlogDeletePage);

router.post("/blog/delete/:blogid", isAuth, adminController.DeleteBlog);

router.get("/blog/create", isAuth, adminController.ShowCreateBlogPage);

router.post("/blog/create", isAuth, imageUpload.upload.single("image") , adminController.CreateBlog);

router.get("/blogs/:blogid", isAuth, adminController.ShowEditBlogPage);

router.post("/blogs/:blogid", isAuth, imageUpload.upload.single("image"), adminController.EditBlog);

router.get("/blogs", isAuth, adminController.GetBlogs);

router.get("/category/delete/:categoryid", isAuth, adminController.ShowCategoryDeletePage);

router.post("/category/delete/:categoryid", isAuth, adminController.DeleteCategory);


router.get("/category/create", isAuth, adminController.ShowCategoryCreatePage);

router.post("/category/create", isAuth, adminController.CreateCategory);

router.get("/categories/:categoryid", isAuth, adminController.ShowCategoryEditPage);

router.post("/categories/:categoryid", isAuth, adminController.EditCategory);

router.get("/categories", isAuth, adminController.GetCategories);




module.exports = router;