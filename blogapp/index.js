const express = require("express");
const app = express();
const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
app.set("view engine", "ejs");

const mysql = require("mysql2");
const config = require("./config");

let connection = mysql.createConnection(config.db);

connection.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log("mysql server connection is done!");
    }
});

app.use("/libs",express.static(path.join(__dirname,"node_modules")));
app.use("/static",express.static(path.join(__dirname,"public")));

app.use("/admin", adminRoutes);
app.use(userRoutes);

app.listen(3000, function(){
    console.log("listening on port 3000");
})