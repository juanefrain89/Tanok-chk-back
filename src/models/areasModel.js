const { DataTypes } = require("sequelize")

module.exports = (sequelize) =>{
    const areasModel = sequelize.define("areasModel",{

        id:{
            type : DataTypes.INTEGER,
            primaryKey : true,
            allowNull : true
        },
        nombre :{
             type : DataTypes.STRING,
              allowNull : true,

        },
        numero_departamento :{
         type : DataTypes.STRING,
              allowNull : true,
        },
         clave_departamento :{
         type : DataTypes.STRING,
              allowNull : true,
        }

    },{
          tableName: 'areas',
    timestamps: false  
    }
       
    )
    return areasModel
}