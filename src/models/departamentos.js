const { DataTypes } = require("sequelize");
const { Sequelize, sequelize } = require(".");

module.exports = (sequelize)=>{
    const departamentos =sequelize.define("departamentos",{
        id :{
            allowNull : true,
            type : DataTypes.INTEGER,
             primaryKey: true,
        },
        nombre :{
            allowNull : false,
            type : DataTypes.STRING
        },
        area :{
allowNull : false,
            type : DataTypes.STRING
        }
    },
{
    tableName : "departamentos",
      createdAt: false,
    updatedAt: false,
}

)
return departamentos
}