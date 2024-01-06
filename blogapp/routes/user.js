const express = require("express");
const router = express.Router();
const path = require("path");

const data = {
    title: "Popüler Kurslar",
    categories: ["Web Geliştirme", "Programlama", "Mobil Uygulamalar", "Veri Analizi", "Otomasyon Uygulamaları"],
    blogs:[
        {
            blogid: 1,
            blogTitle: "Komple Uygulamalı Web Geliştirme",
            blogDescription: "Sıfırdan ileri seviyeye Web Geliştirme: Html, css, Angular, JQuery .NET Core",
            blogImage:"/static/images/1.jpeg",
            mainPage: true
        },
        {
            blogid: 2,
            blogTitle: "Python Programlama",
            blogDescription: "Python Programlama kursuna katılmak için tıklayın!",
            blogImage:"/static/images/2.jpeg",
            mainPage: true
        },
        {
            blogid: 3,
            blogTitle: "Veri Bilimi",
            blogDescription: "Python ile istatistik ve veri bilimi dersleri.",
            blogImage:"/static/images/3.jpeg",
            mainPage: false
        },
        {
            blogid: 4,
            blogTitle: "React JS Kursu",
            blogDescription: "React JS ile frontend web geliştirme kursuna kaydolun!",
            blogImage:"/static/images/4.jpeg",
            mainPage: false
        },
    ]
}

router.use("/blogs/:blogid",function(req,res){
    res.render("users/blog-details");
});

router.use("/blogs",function(req,res){
    res.render("users/blogs", data);
});

router.use("/",function(req,res){
    res.render("users/index", data);
});

module.exports = router;