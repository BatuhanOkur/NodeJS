const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../data/db");
const { error } = require("console");
const util = require('util');
const { title } = require("process");
const dbQuery = util.promisify(db.query).bind(db);

router.get("/blog/delete/:blogid", async function(req,res){
    const blogid = req.params.blogid;

    try{
        const [blogs,] = await db.execute("select blogid, title from blog where blogid = ?", [blogid]);
        const blog = blogs[0];
        res.render("admin/blog-delete",{
            title: "Bloğu Sil",
            blog
        });
    }catch(error){
        console.log(error);
    }
});

router.post("/blog/delete/:blogid", async function(req,res){
    const blogid = req.body.blogid;

    try{
        await db.execute("delete from blogcategory where blogid = ?", [blogid]);
        await db.execute("delete from blog where blogid = ?", [blogid]);
        res.redirect("/admin/blogs?action=delete");
    }catch(error){
        console.log(error);
    }
});

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
            if(category != -1){
                if(category.length > 1){

                    category.forEach(async element => {
                        await db.execute(
                            `INSERT INTO blogcategory(categoryid, blogid) VALUES (?, ?)`,
                            [element, results.insertId]
                          );
                    }); 

                }else{
                    await db.execute(
                        `INSERT INTO blogcategory(categoryid, blogid) VALUES (?, ?)`,
                        [category, results.insertId]
                      );
                }
            }  
        }
        res.redirect("/admin/blogs?action=create");
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

router.post("/blogs/:blogid",async function(req,res){
    const blogid = req.params.blogid;
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const category = req.body.category;
    const mainpage = req.body.mainpage == "on" ? 1 : 0;
    const confirmation = req.body.confirmation == "on" ? 1 : 0;

    try {
        await db.execute(`
        update blog 
        set title = ?, 
        description = ?,
        image = ?,
        mainpage = ?,
        confirmation = ?
        where blogid = ?
        `, [title,description,image,mainpage,confirmation,blogid]);

        await db.execute("delete from blogcategory where blogid = ?", [blogid]);

        category.forEach(async element => {
            await db.execute(
                `INSERT INTO blogcategory(categoryid, blogid) VALUES (?, ?)`,
                [element, blogid]
              );
        });

        res.redirect("/admin/blogs?action=edit");

    } catch (error) {
        console.log(error);
    }
});

router.get("/blogs",async function(req,res){
    try {
        const [blogs,] = await db.execute("select blogid, title, image from blog");
        res.render("admin/blog-list",{
            title: "Blog Listesi",
            blogs,
            action: req.query.action
        });
    } catch (error) {
        console.log(error);
    }
});


router.get("/categories",async function(req,res){
    try {
        const [categories,] = await db.execute("select * from category");
        res.render("admin/category-list",{
            title: "Kategori Listesi",
            categories,
            action: req.query.action
        });
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;