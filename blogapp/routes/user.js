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

router.use("/blogs",function(req,res){
    db.execute("select * from blog where confirmation = 1")
    .then(blogResult =>{

        db.execute("select * from category where active = 1")
        .then(categoryResult => {
            res.render("users/blogs", {
                title: "Popüler Kurslar",
                blogs: blogResult[0],
                categories: categoryResult[0]
            });
        })
        .catch(err => console.log(err));
        
    })
    .catch(err => console.log(err));
});

router.use("/",function(req,res){
    db.execute("select * from blog where mainpage = 1 and confirmation = 1")
    .then(blogResult =>{

        db.execute("select * from category where active = 1")
        .then(categoryResult => {
            res.render("users/index", {
                title: "Popüler Kurslar",
                blogs: blogResult[0],
                categories: categoryResult[0]
            });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
    
});

module.exports = router;