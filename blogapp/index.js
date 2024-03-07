const express = require("express");
const app = express();
const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const cookieParser = require('cookie-parser');
const session = require("express-session");


app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: "123456",
    resave: false,
    saveUninitialized: false
}));

app.use("/libs",express.static(path.join(__dirname,"node_modules")));
app.use("/static",express.static(path.join(__dirname,"public")));

app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use(userRoutes);

const Blog = require("./models/blog");
const Category = require("./models/category");
const sequelize = require("./data/db");
const User = require("./models/user");

Blog.belongsToMany(Category, { through: 'blogCategories' });
Category.belongsToMany(Blog, { through: 'blogCategories' });

//1-n relation
Blog.belongsTo(User, {
    foreignkey: {
        allowNull: true
    }
});

User.hasMany(Blog);

(async () =>{
    //await sequelize.sync({force: true});
})();

app.listen(3000, function(){
    console.log("listening on port 3000");
})