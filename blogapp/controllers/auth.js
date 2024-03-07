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

exports.ShowLoginPage = async function(req, res){
    try {
        return res.render("auth/login",{
            title: "Giriş Yap"
        });
    } catch (error) {
        console.log(error);
    }
}

exports.Login = async function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({
            where:{
                email: email
            }
        });

        if(user){

            const match = await bcrypt.compare(password, user.password);

            if(match){
                
                // res.cookie("isAuth", 1);
                req.session.isAuth = 1;

                return res.redirect("/");

            }else{

                return res.render("auth/login",{
                    title: "Giriş Yap",
                    message: "Hatalı parola girdiniz!"
                });
            }

        }else{
            return res.render("auth/login",{
                title: "Giriş Yap",
                message: "Girilen mail adresiyle kayıtlı bir kullanıcı bulunamadı!"
            });
        }

    } catch (error) {
        console.log(error);
    }

}

exports.Logout = async function(req, res){
    //res.clearCookie("isAuth");
    await req.session.destroy();
    try {
        return res.redirect("login");
    } catch (error) {
        console.log(error);
    }
}

