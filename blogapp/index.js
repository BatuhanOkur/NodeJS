//express 

const express = require("express");
const app = express();

const cookieParser = require('cookie-parser');
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

//node modules
const path = require("path");


//routes

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");


//models
const Blog = require("./models/blog");
const Category = require("./models/category");
const User = require("./models/user");


//custom modules
const sequelize = require("./data/db");
const { Sequelize } = require("sequelize");
const locals = require("./middlewares/locals");

//template engine
app.set("view engine", "ejs");

//middleware
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: "123456",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 86400000
    },
    store: new SequelizeStore({
        db: sequelize
    })
}));

app.use(locals);

app.use("/libs",express.static(path.join(__dirname,"node_modules")));
app.use("/static",express.static(path.join(__dirname,"public")));

app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use(userRoutes);


//relations

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