const { DataTypes } = require("sequelize");
const { Sequelize, sequelize } = require(".");

module.exports = (sequelize)=>{
    const puesto =sequelize.define("puesto",{
        id :{
            allowNull : true,
            type : DataTypes.INTEGER,
             primaryKey: true,
        },
        nombre :{
            allowNull : false,
            type : DataTypes
        },
         clavepuesto :{
       type: DataTypes.STRING,
      allowNull: true
    }
    },
{
    tableName : "puestos",
      createdAt: false,
    updatedAt: false,
}

)
return puesto
}