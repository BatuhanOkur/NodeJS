exports.ShowRegisterPage = async function(req, res){
    try {
        return res.render("auth/register",{
            title: "Kayıt Ol"
        });
    } catch (error) {
        console.log(error);
    }
}