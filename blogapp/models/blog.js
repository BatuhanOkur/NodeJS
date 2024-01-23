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
    },

    createDate:{
        type: DataTypes.DATETIME,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Blog;