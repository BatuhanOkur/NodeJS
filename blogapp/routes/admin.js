const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../data/db");
const imageUpload = require("../helpers/image-upload");
const fs = require("fs");


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


router.post("/blog/create",imageUpload.upload.single("image") ,async function(req,res){
    const title = req.body.title;
    const description = req.body.description;
    const image = req.file.filename;
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

router.post("/blogs/:blogid",imageUpload.upload.single("image"),async function(req,res){
    const blogid = req.params.blogid;
    const title = req.body.title;
    const description = req.body.description;
    let image = req.body.image;
    if(req.file){
        image = req.file.filename;   
        fs.unlink("./public/images/" + req.body.image, err => {
            console.log(err);
        });
    }
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

router.get("/category/delete/:categoryid", async function(req,res){
    const categoryid = req.params.categoryid;

    try{
        const [categories,] = await db.execute("select * from category where categoryid = ?", [categoryid]);
        const category = categories[0];
        res.render("admin/category-delete",{
            title: "Kategoriyi Sil",
            category
        });
    }catch(error){
        console.log(error);
    }
});

router.post("/category/delete/:categoryid", async function(req,res){
    const categoryid = req.body.categoryid;

    try{
        await db.execute("delete from blogcategory where categoryid = ?", [categoryid]);
        await db.execute("delete from category where categoryid = ?", [categoryid]);
        res.redirect("/admin/categories?action=delete");
    }catch(error){
        console.log(error);
    }
});


router.get("/category/create", async function(req,res){
    res.render("admin/category-create", {
        title: 'Kategori Ekle'
    });
});

router.post("/category/create", async function(req,res){
    const name = req.body.name;
    const active = req.body.active == "on" ? 1 : 0;
    
    try {
        await db.execute(
            `INSERT INTO category(name, active) VALUES (?, ?)`,
            [name, active]
        );

        res.redirect("/admin/categories?action=create");
    } catch (error) {
        console.log(error);
    }
});

router.get("/categories/:categoryid", async function(req,res){
    const categoryid = req.params.categoryid;
    try {
        const [categories,] = await db.execute("select * from category where categoryid = ?", [categoryid]);
        const category = categories[0];
        res.render("admin/category-edit", {
            title: 'Kategori Ekle',
            category
        });
    } catch (error) {
        console.log(error);
    }
    
});

router.post("/categories/:categoryid", async function(req,res){
    const categoryid = req.params.categoryid;
    const name = req.body.name;
    const active = req.body.active == "on" ? 1 : 0;

    try {
        await db.execute("update category set name=?, active=? where categoryid = ?", [name,active,categoryid]);
        res.redirect("/admin/categories?action=edit");
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