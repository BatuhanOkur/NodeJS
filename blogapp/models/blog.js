const {DataTypes} = require("sequelize");
const sequelize = require("../data/db");

const Blog = sequelize.define("blog", {
    blogid:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:  true
    },

    title:{
        type: DataTypes.STRING,
        allowNull: false
    },

    description:{
        type: DataTypes.TEXT,
    },

    image:{
        type: DataTypes.STRING,
        allowNull: false
    },

    mainpage:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    confirmation:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

async function sync(){
    // await Blog.sync({force: true});
    // console.log("Blog table added");

    // const blog = await Blog.create({
    //     title: ".Net Core İle Web Geliştirme",
    //     description: ".Net Core ve MSSQL teknolojileriyle web geliştirmeyi öğrenmek için kursa hemen kaydol!",
    //     image: "1.jpeg",
    //     mainpage:true,
    //     confirmation: true      
    // });

    // console.log("Blog Created: ID ",blog.blogid);
}

sync();


module.exports = Blog;