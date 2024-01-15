const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../data/db");

router.get("/blog/create", async function(req,res){
    const [categories,] = await db.execute("select * from category where active = 1");
    res.render("admin/blog-create", {
        title: 'Blog Ekle',
        categories
    });
});

router.get("/blogs/:blogid",function(req,res){
    res.render("admin/blog-edit");
});

router.get("/blogs",function(req,res){
    res.render("admin/blog-list");
});


module.exports = router;