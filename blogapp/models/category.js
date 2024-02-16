const {DataTypes} = require("sequelize");
const sequelize = require("../data/db");

const Category = sequelize.define("category", {
    categoryid:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:  true
    },

    name:{
        type: DataTypes.STRING,
        allowNull: false
    },

    active:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

async function sync(){
    // await Category.sync({force: true});
    // console.log("Category table added");

    // await Category.bulkCreate([
        
    //     {name: "Web Geliştirme", active: true},
    //     {name: "Programlama", active: true},
    //     {name: "Veri Bilimi", active: true},
    //     {name: "Veri Analizi", active: false}
    // ]
    // )
}

sync();


module.exports = Category;