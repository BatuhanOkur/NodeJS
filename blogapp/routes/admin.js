const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../data/db");
const { error } = require("console");
const util = require('util');
const { title } = require("process");
const dbQuery = util.promisify(db.query).bind(db);

router.get("/blog/create", async function(req,res){
    const [categories,] = await db.execute("select * from category where active = 1");
    res.render("admin/blog-create", {
        title: 'Blog Ekle',
        categories
    });
});

router.post("/blog/create", async function(req,res){
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const category = req.body.category;
    const mainpage = req.body.mainpage == "on" ? 1 : 0;
    const confirmation = req.body.confirmation == "on" ? 1 : 0;
    
    try {
        const [results] = await db.execute(
            `INSERT INTO blog(title, description, image, mainpage, confirmation) VALUES (?, ?, ?, ?, ?)`,
            [title, description, image, mainpage, confirmation]
          );
    
        if(results.insertId)
        {
            category.forEach(async element => {
                await db.execute(
                    `INSERT INTO blogcategory(categoryid, blogid) VALUES (?, ?)`,
                    [element, results.insertId]
                  );
            });    
        }
        res.redirect("/admin/blogs");
    } catch (error) {
        console.log(error);
    }
});

router.get("/blogs/:blogid",async function(req,res){
    const blogId = req.params.blogid;
    try{
        const [blogs,] = await db.execute("select * from blog where blogid = ?", [blogId]); 
        const [categories,] = await db.execute("select * from category where active = 1");
        const [blogcategories,] = await db.execute("select categoryid from blogcategory where blogid = ?", [blogId]);
        const relatedCategories = [];
        blogcategories.forEach(element => {
            relatedCategories.push(element.categoryid);
        })
        
        if(blogs){
            res.render("admin/blog-edit",{
                title: "Bloğu düzenle",
                blog: blogs[0],
                categories,
                relatedCategories
            });
        }else{
            res.redirect("/admin/blogs");
        }

    }catch(err){
        console.log(err);
    }
    
});

router.get("/blogs",async function(req,res){
    try {
        const [blogs,] = await db.execute("select blogid, title, image from blog");
        res.render("admin/blog-list",{
            title: "Blog Listesi",
            blogs
        });
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;