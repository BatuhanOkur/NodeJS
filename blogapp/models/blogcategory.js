const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");
const Blog = require('./blog');
const Category = require('./category');

const BlogCategory = sequelize.define("blogcategory", {
    blogcategoryid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:  true
    },
});

Blog.belongsToMany(Category, {
    through: 'blogcategory',
    foreignKey: 'blogid',
    otherKey: 'categoryid'
});

Category.belongsToMany(Blog, {
    through: 'blogcategory',
    foreignKey: 'categoryid',
    otherKey: 'blogid'
});

async function sync(){
    await BlogCategory.sync({force: true});
    console.log("BlogCategory table added");
}

// sync();

module.exports = BlogCategory;
