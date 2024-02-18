const express = require("express");
const app = express();
const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");


app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));

app.use("/libs",express.static(path.join(__dirname,"node_modules")));
app.use("/static",express.static(path.join(__dirname,"public")));

app.use("/admin", adminRoutes);
app.use(userRoutes);

const Blog = require("./models/blog");
const Category = require("./models/category");
const sequelize = require("./data/db");

Blog.belongsToMany(Category, { through: 'blogCategories' });
Category.belongsToMany(Blog, { through: 'blogCategories' });

(async () =>{
    //await sequelize.sync({force: true});
})();

app.listen(3000, function(){
    console.log("listening on port 3000");
})