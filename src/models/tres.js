const { DataTypes } = require("sequelize");
const { Sequelize, sequelize } = require(".");

module.exports = (sequelize)=>{
    const tres =sequelize.define("tres",{
        id :{
            allowNull : true,
            type : DataTypes.INTEGER,
             primaryKey: true,
        },
        relacion2 :{
            allowNull : false,
            type : DataTypes.INTEGER
        },
        id_puesto :{
            allowNull : false,
            type : DataTypes.INTEGER
        }
    },
{
    tableName : "tres",
      createdAt: false,
    updatedAt: false,
}

)
return tres
}