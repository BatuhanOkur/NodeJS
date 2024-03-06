const User = require("../models/user");

exports.ShowRegisterPage = async function(req, res){
    try {
        return res.render("auth/register",{
            title: "Kayıt Ol"
        });
    } catch (error) {
        console.log(error);
    }
}

exports.Register = async function(req, res){
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        await User.create({
            fullname,
            email,
            password
        });

        return res.redirect("login");
    } catch (error) {
        console.log(error);
    }
}