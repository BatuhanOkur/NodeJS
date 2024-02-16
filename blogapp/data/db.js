const config = require("../config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.db.database,config.db.user, config.db.password,{
    dialect: "mysql",
    host: config.db.host
});

async function connect(){
    try{
        await sequelize.authenticate();
        console.log("mysql server connection is ready");
    }catch(err){
        console.log("Connection Error:", err);
    }
}
connect();
module.exports = sequelize;
