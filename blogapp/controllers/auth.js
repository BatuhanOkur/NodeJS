const User = require("../models/user");
const bcrypt = require("bcrypt");

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

    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        await User.create({
            fullname,
            email,
            password : hashedPassword
        });

        return res.redirect("login");
    } catch (error) {
        console.log(error);
    }
}