const Blog = require("../models/blog");
const Category = require("../models/category");
const { where } = require("sequelize");

exports.ShowBlogsByCategory = async function(req,res){
    const categoryId = req.params.categoryid;
    try{
        const categories = await Category.findAll({
            where:{
                active: 1
            }
        });  

        if(categoryId === "all")
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
                selectedCategory: categoryId
            });
        }else{
            const category = await Category.findByPk(categoryId);
            if(category){
                const blogs = await category.getBlogs();
                          
                res.render("users/blogs", {
                    title: "Bloglar",
                    blogs,
                    categories,
                    selectedCategory: categoryId
                });   
            }
        }

        
    }
    catch(err)
    {
        console.log(err);
    }
}

exports.ShowBlogDetail = async function(req,res){
    const blogId = req.params.blogid;
    try{
        const blog = await Blog.findByPk(blogId);

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

exports.ShowPopularBlogs = async function(req,res){
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
            title: "Popüler Bloglar",
            blogs,
            categories,
            selectedCategory: null
        });
    }
    catch(err){
        console.log(err);
    }
    
}