const express = require("express");
const router = express.Router();
const imageUpload = require("../helpers/image-upload");
const fs = require("fs");
const adminController = require("../controllers/admin");




router.get("/blog/delete/:blogid", adminController.ShowBlogDeletePage);

router.post("/blog/delete/:blogid", adminController.DeleteBlog);

router.get("/blog/create", adminController.ShowCreateBlogPage);

router.post("/blog/create",imageUpload.upload.single("image") , adminController.CreateBlog);

router.get("/blogs/:blogid", adminController.ShowEditBlogPage);

router.post("/blogs/:blogid",imageUpload.upload.single("image"), adminController.EditBlog);

router.get("/blogs", adminController.GetBlogs);

router.get("/category/delete/:categoryid", adminController.ShowCategoryDeletePage);

router.post("/category/delete/:categoryid", adminController.DeleteCategory);


router.get("/category/create", adminController.ShowCategoryCreatePage);

router.post("/category/create", adminController.CreateCategory);

router.get("/categories/:categoryid", adminController.ShowCategoryEditPage);

router.post("/categories/:categoryid", adminController.EditCategory);

router.get("/categories", adminController.GetCategories);




module.exports = router;