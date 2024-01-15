const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../data/db");
const { error } = require("console");
const util = require('util');
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

router.get("/blogs/:blogid",function(req,res){
    res.render("admin/blog-edit");
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