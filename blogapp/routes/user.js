const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../data/db");



const data = {
    title: "Popüler Kurslar",
    categories: ["Web Geliştirme", "Programlama", "Mobil Uygulamalar", "Veri Analizi", "Otomasyon Uygulamaları"]
}

router.use("/blogs/:blogid",function(req,res){
    res.render("users/blog-details");
});

router.use("/blogs",async function(req,res){
    try{
        const [blogs,] = await db.execute("select * from blog where confirmation = 1");
        const [categories,] = await db.execute("select * from category where active = 1");
        res.render("users/blogs", {
            title: "Bloglar",
            blogs,
            categories
        });
    }
    catch(err){
        console.log(err);
    }
});

router.use("/", async function(req,res){
    try{
        const [blogs,] = await db.execute("select * from blog where confirmation = 1");
        const [categories,] = await db.execute("select * from category where active = 1");
        res.render("users/index", {
            title: "Popüler Bloglar",
            blogs,
            categories
        });
    }
    catch(err){
        console.log(err);
    }
    
});

module.exports = router;