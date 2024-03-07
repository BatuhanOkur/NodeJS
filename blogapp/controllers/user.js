const { raw } = require("express");
const Blog = require("../models/blog");
const Category = require("../models/category");
const { where } = require("sequelize");
const config = require("../config");

exports.ShowBlogsByCategory = async function(req,res){
    const slug = req.params.slug;
    const size = config.pagination.size;
    const {page = 0} = req.query;
    try{
        const categories = await Category.findAll({
            where:{
                active: 1
            }
        });  

        if(slug === "all")
        {
            const {rows, count} = await Blog.findAndCountAll(
                {
                    where:{
                        confirmation:1
                    },
                    raw:true,
                    limit: size,
                    offset: page * size
                }
            );

            res.render("users/blogs", {
                title: "Bloglar",
                totalItems: count,
                totalPages: Math.ceil(count / size),
                currentPage: page,
                blogs: rows,
                categories,
                selectedCategory: slug
            });
        }else{
            
            const {rows, count} = await Blog.findAndCountAll({
                where: {
                    confirmation: true
                },
                raw:true,
                limit: size,
                offset: page * size,
                include:{
                    model: Category,
                    where:{url: slug}
                }
            });
                          
            res.render("users/blogs", {
                title: "Bloglar",
                totalItems: count,
                totalPages: Math.ceil(count / size),
                currentPage: page,
                blogs: rows,
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
    const size = config.pagination.size;
    const {page = 0} = req.query;
    try{
        
        const {rows, count} = await Blog.findAndCountAll(
            {
                where:{
                    confirmation:1
                },
                raw:true,
                limit: size,
                offset: page * size
            }
        );
        
        const categories = await Category.findAll({
            where:{
                active: 1
            }
        });    

        res.render("users/blogs", {
            title: "Bloglar",
            blogs: rows,
            totalItems: count,
            totalPages: Math.ceil(count / size),
            currentPage: page,
            categories,
            selectedCategory: "all",
            paginationSize : size
        });
    }
    catch(err){
        console.log(err);
    }
}

exports.Index = async function(req,res){
    const size = config.pagination.size;
    const {page = 0} = req.query;
    try{      
        const {rows, count} = await Blog.findAndCountAll(
            {
                where:{
                    confirmation:1,
                    mainpage: 1
                },
                raw:true,
                limit: size,
                offset: page * size
            }
        );

        const categories = await Category.findAll({
            where:{
                active: 1
            }
        });

        res.render("users/index", {
            title: "Bloglar",
            totalItems: count,
            totalPages: Math.ceil(count / size),
            currentPage: page,
            blogs: rows,
            categories,
            selectedCategory: "all",
            isAuth : req.session.isAuth
        });
    }
    catch(err){
        console.log(err);
    }
    
}