const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../data/db");
const imageUpload = require("../helpers/image-upload");
const fs = require("fs");

const Blog = require("../models/blog");
const Category = require("../models/category");
const { where } = require("sequelize");


router.get("/blog/delete/:blogid", async function(req,res){
    const blogid = req.params.blogid;

    try{
        const blog = await Blog.findByPk(blogid);

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
        const blog = await Blog.findByPk(blogid);
        if(blog){
            await blog.destroy();
            res.redirect("/admin/blogs?action=delete");
        }
        res.redirect("/admin/blogs");
    }catch(error){
        console.log(error);
    }
});

router.get("/blog/create", async function(req,res){
    
    const categories = await Category.findAll({
        where: {
            active:1
        }
    });
    res.render("admin/blog-create", {
        title: 'Blog Ekle',
        categories
    });
});


router.post("/blog/create",imageUpload.upload.single("image") ,async function(req,res){
    const title = req.body.title;
    const description = req.body.description;
    let image = req.body.image;
    if(req.file){
        image = req.file.filename;
    }
    const category = req.body.category;
    const mainpage = req.body.mainpage == "on" ? 1 : 0;
    const confirmation = req.body.confirmation == "on" ? 1 : 0;
    
    try {
            
            if(category != -1){
                if(category.length > 1){
                    
                    const blog = await Blog.create({
                        title: title,
                        description: description,
                        image: image,
                        mainpage:mainpage,
                        confirmation: confirmation      
                    });

                    category.forEach(async element => {                                               
                        //await BlogCategory.create({categoryid: element, blogid: blog.blogid});    
                        let categoryItem = await Category.findByPk(element); 
                        await blog.addCategory(categoryItem);                 
                    }); 
                    res.redirect("/admin/blogs?action=create");

                }else{                  
                    let categoryItem = await Category.findByPk(category); 
                    categoryItem.createBlog({
                        title: title,
                        description: description,
                        image: image,
                        mainpage:mainpage,
                        confirmation: confirmation      
                    });      

                    res.redirect("/admin/blogs?action=create");
                }
            }  
            res.redirect("/admin/blogs");
        } catch (error) {
            console.log(error);
        }
});

router.get("/blogs/:blogid",async function(req,res){
    const blogId = req.params.blogid;
    try{
        const blog = await Blog.findOne({
            where: {
                blogid: blogId
            },
            include:{
                model: Category,
                attributes: ["categoryid"]
            }
        });

        const categories = await Category.findAll({
            where: {
                active:1
            }
        });

        
        if(blog){
            res.render("admin/blog-edit",{
                title: "Bloğu düzenle",
                blog: blog.dataValues,
                categories
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

        const blog = await Blog.findByPk(blogid);
        if(blog){
            
            await blog.setCategories(category);

            blog.title = title;
            blog.description = description;
            blog.image = image;
            blog.mainpage = mainpage;
            blog.confirmation = confirmation;
            
            await blog.save();
        }

        res.redirect("/admin/blogs?action=edit&blogid=" + blogid);

    } catch (error) {
        console.log(error);
    }
});

router.get("/blogs",async function(req,res){
    try {
        const blogs = await Blog.findAll(
            {
                attributes:["blogid", "title", "image"]
            }
        );
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
        const category = await Category.findByPk(categoryid);
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
        await Category.create({name: name, active: active});

        res.redirect("/admin/categories?action=create");
    } catch (error) {
        console.log(error);
    }
});

router.get("/categories/:categoryid", async function(req,res){
    const categoryid = req.params.categoryid;
    try {
        const category = await Category.findByPk(categoryid);
        if(category){
            res.render("admin/category-edit", {
                title: 'Kategori Ekle',
                category
            });
        }
    } catch (error) {
        console.log(error);
    }
    
});

router.post("/categories/:categoryid", async function(req,res){
    const categoryid = req.params.categoryid;
    const name = req.body.name;
    const active = req.body.active == "on" ? 1 : 0;

    try {
        const category = await Category.findByPk(categoryid);
        if(category){

            category.name = name;
            category.active = active;

            await category.save();
        }

        res.redirect("/admin/categories?action=edit&categoryid=" + categoryid);
    } catch (error) {
        console.log(error);
    }
    
});

router.get("/categories",async function(req,res){
    try {
        const categories = await Category.findAll();

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