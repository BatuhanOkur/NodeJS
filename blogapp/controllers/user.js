const { raw } = require("express");
const Blog = require("../models/blog");
const Category = require("../models/category");
const { where } = require("sequelize");

exports.ShowBlogsByCategory = async function(req,res){
    const slug = req.params.slug;
    try{
        const categories = await Category.findAll({
            where:{
                active: 1
            }
        });  

        if(slug === "all")
        {
            const blogs = await Blog.findAll(
                {
                    where:{
                        confirmation:1
                    }
                }
            );

            res.render("users/blogs", {
                title: "Bloglar",
                blogs,
                categories,
                selectedCategory: slug
            });
        }else{
            
            const blogs = await Blog.findAll({
                where: {
                    confirmation: true
                },
                include:{
                    model: Category,
                    where:{url: slug}
                }
            });
                          
            res.render("users/blogs", {
                title: "Bloglar",
                blogs,
                categories,
                selectedCategory: slug
            });   
            
        }

        
    }
    catch(err)
    {
        console.log(err);
    }
}

exports.ShowBlogDetail = async function(req,res){
    const slug = req.params.slug;
    try{
        const blog = await Blog.findOne({
                where:{
                    url: slug
                },
                raw: true
            });

        if(blog)
        {
            res.render("users/blog-details",{
                blog
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
}

exports.ShowAllBlogs = async function(req,res){
    try{
        
        const blogs = await Blog.findAll(
            {
                where:{
                    confirmation:1
                }
            }
        );
        
        const categories = await Category.findAll({
            where:{
                active: 1
            }
        });    

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
}

exports.Index = async function(req,res){
    try{      
        const blogs = await Blog.findAll(
            {
                where:{
                    confirmation:1,
                    mainpage: 1
                }
            }
        );

        const categories = await Category.findAll({
            where:{
                active: 1
            }
        });

        res.render("users/index", {
            title: "Bloglar",
            blogs,
            categories,
            selectedCategory: "all"
        });
    }
    catch(err){
        console.log(err);
    }
    
}