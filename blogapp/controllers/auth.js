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
        const user = await User.findOne({ where: { email:email } });

        if(user){
            req.session.message = {text: "Girdiğiniz email adresiyle daha önce kayıt olunmuş.", class: "warning"};
            return res.redirect("login");
        }

        await User.create({
            fullname,
            email,
            password : hashedPassword
        });

        req.session.message = {text: "Kayıt işlemi başarılı, hesabınıza giriş yapabilirsiniz.", class: "success"};
        return res.redirect("login");

    } catch (error) {
        console.log(error);
    }
}

exports.ShowLoginPage = async function(req, res){
    const message = req.session.message;
    delete req.session.message;

    try {
        return res.render("auth/login",{
            title: "Giriş Yap",
            message,
            csrfToken: req.csrfToken(),
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
                req.session.isAuth = true;
                req.session.fullname = user.fullname;

                const url = req.query.returnUrl || "/";
                return res.redirect(url);

            }else{

                return res.render("auth/login",{
                    title: "Giriş Yap",
                    message: {text: "Hatalı parola girdiniz!", class: "warning"},
                    csrfToken: req.csrfToken()
                });
            }

        }else{
            return res.render("auth/login",{
                title: "Giriş Yap",
                message: {text: "Girilen mail adresiyle kayıtlı bir kullanıcı bulunamadı!", class: "warning"},
                csrfToken: req.csrfToken()
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

