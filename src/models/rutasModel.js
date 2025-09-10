const { DataTypes } = require("sequelize")


module.exports = (sequelize) =>{
    const rutasModel = sequelize.define("rutasModel",{
        id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true
        },
        nombre:{
            type : DataTypes.STRING,
               allowNull: true,
        }
    },{
  tableName: 'rutas',
    timestamps: false  
    })
    return rutasModel
}