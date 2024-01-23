const express = require("express");
const app = express();
const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

const Blog = require("./models/blog");
const Category = require("./models/category");
const BlogCategory = require("./models/blogcategory");

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));

app.use("/libs",express.static(path.join(__dirname,"node_modules")));
app.use("/static",express.static(path.join(__dirname,"public")));

app.use("/admin", adminRoutes);
app.use(userRoutes);

app.listen(3000, function(){
    console.log("listening on port 3000");
})