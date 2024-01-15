const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../data/db");



const data = {
    title: "Popüler Kurslar"
}

router.use("/blogs/category/:categoryid", async function(req,res){
    const categoryId = req.params.categoryid;
    try{
        const [categories,] = await db.execute("select * from category where active = 1");

        if(categoryId === "all")
        {
            const [blogs,] = await db.execute("select * from blog where confirmation = 1");
            res.render("users/blogs", {
                title: "Bloglar",
                blogs,
                categories,
                selectedCategory: categoryId
            });
        }else{
            const [blogs,] = await db.execute(`
                SELECT *
                FROM blog b
                LEFT JOIN blogcategory bc ON bc.blogid = b.blogid
                WHERE b.confirmation = 1 AND categoryid = ?
                `, [categoryId]);
            
            res.render("users/blogs", {
                title: "Bloglar",
                blogs,
                categories,
                selectedCategory: categoryId
            });   
                          
        }

        
    }
    catch(err)
    {

    }
});

router.use("/blogs/:blogid",async function(req,res){
    const blogId = req.params.blogid;
    try{
        const [blog,] = await db.execute("select * from blog where blogid = ?",[blogId]);
        if(blog[0])
        {
            res.render("users/blog-details",{
                blog: blog[0]
            });
        }
        else{
            res.write("404 Not Found");
            res.end();
        }
    }
    catch(err){
        console.log(err);
    }
});

router.use("/blogs",async function(req,res){
    try{
        const [blogs,] = await db.execute("select * from blog where confirmation = 1");
        const [categories,] = await db.execute("select * from category where active = 1");
        res.render("users/blogs", {
            title: "Bloglar",
            blogs,
            categories,
            selectedCategory: null
        });
    }
    catch(err){
        console.log(err);
    }
});

router.use("/", async function(req,res){
    try{
        const [blogs,] = await db.execute("select * from blog where confirmation = 1 and mainpage = 1");
        const [categories,] = await db.execute("select * from category where active = 1");
        res.render("users/index", {
            title: "Popüler Bloglar",
            blogs,
            categories,
            selectedCategory: null
        });
    }
    catch(err){
        console.log(err);
    }
    
});

module.exports = router;