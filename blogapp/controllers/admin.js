const Blog = require("../models/blog");
const Category = require("../models/category");
const { where } = require("sequelize");
const slugfield = require("../helpers/slugfield");

exports.ShowBlogDeletePage = async function(req,res){
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
}


exports.DeleteBlog = async function(req,res){
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
}

exports.ShowCreateBlogPage = async function(req,res){
    
    const categories = await Category.findAll({
        where: {
            active:1
        }
    });
    res.render("admin/blog-create", {
        title: 'Blog Ekle',
        categories
    });
}

exports.CreateBlog = async function(req,res){
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
            const blog = await Blog.create({
                title: title,
                description: description,
                image: image,
                mainpage:mainpage,
                confirmation: confirmation,
                url: slugfield(title)      
            });

            if(category){
                let index = category.indexOf('-1');
                if(index !== -1)
                {
                    category.splice(index, 1)
                }

                if(category.length > 0){

                    category.forEach(async element => {                                               
                        //await BlogCategory.create({categoryid: element, blogid: blog.blogid});    
                        let categoryItem = await Category.findByPk(element); 
                        await blog.addCategory(categoryItem);                 
                    }); 
                    res.redirect("/admin/blogs?action=create");

                }
            }  
            res.redirect("/admin/blogs");
        } catch (error) {
            console.log(error);
        }
}

exports.ShowEditBlogPage = async function(req,res){
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
    
}

exports.EditBlog = async function(req,res){
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
    let category = req.body.category;
    const mainpage = req.body.mainpage == "on" ? 1 : 0;
    const confirmation = req.body.confirmation == "on" ? 1 : 0;

    try {

        if(category){
            let index = category.indexOf('-1');
            if(index !== -1)
            {
                category.splice(index, 1)
            }
        }else{
            category = [];
        }

        const blog = await Blog.findByPk(blogid);
        if(blog){
            
            await blog.setCategories(category);

            blog.title = title;
            blog.description = description;
            blog.image = image;
            blog.mainpage = mainpage;
            blog.confirmation = confirmation;
            blog.url = slugfield(title);
            
            await blog.save();
        }

        res.redirect("/admin/blogs?action=edit&blogid=" + blogid);

    } catch (error) {
        console.log(error);
    }
}

exports.GetBlogs = async function(req,res){
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
}

exports.ShowCategoryDeletePage = async function(req,res){
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
}

exports.DeleteCategory = async function(req,res){
    const categoryid = req.body.categoryid;

    try{
        const category = await Category.findByPk(categoryid);
        if(category){
            await category.destroy();
        }
        res.redirect("/admin/categories?action=delete");
    }catch(error){
        console.log(error);
    }
}

exports.ShowCategoryCreatePage = async function(req,res){
    res.render("admin/category-create", {
        title: 'Kategori Ekle'
    });
}

exports.CreateCategory = async function(req,res){
    const name = req.body.name;
    const active = req.body.active == "on" ? 1 : 0;
    
    try {
        await Category.create({name: name, active: active, url: slugfield(name)});

        res.redirect("/admin/categories?action=create");
    } catch (error) {
        console.log(error);
    }
}

exports.ShowCategoryEditPage = async function(req,res){
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
    
}

exports.EditCategory = async function(req,res){
    const categoryid = req.params.categoryid;
    const name = req.body.name;
    const active = req.body.active == "on" ? 1 : 0;

    try {
        const category = await Category.findByPk(categoryid);
        if(category){

            category.name = name;
            category.active = active;
            category.url = slugfield(name);

            await category.save();
        }

        res.redirect("/admin/categories?action=edit&categoryid=" + categoryid);
    } catch (error) {
        console.log(error);
    }
    
}

exports.GetCategories = async function(req,res){
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
}