const express = require("express");

const app = express();

app.use("/blogs/:blogid",function(req,res){
    res.send("blog detail page");
});

app.use("/blogs",function(req,res){
    res.send("blog list");
});

app.use("/",function(req,res){
    res.send("homepage");
});

app.listen(3000, function(){
    console.log("listening on port 3000");
})