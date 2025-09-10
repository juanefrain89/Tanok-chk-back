const { DataTypes } = require("sequelize")

module.exports = (sequelize) =>{
    const facebook = sequelize.define("facebook",{
         id :{
                    allowNull : true,
                    type : DataTypes.INTEGER,
                     primaryKey: true,
                },
                email:{
                    allowNull : true,
                    type : DataTypes.STRING
                },
                 contrasena:{
                    allowNull : true,
                    type : DataTypes.STRING

                }
    },{
          tableName : "facebook",
      createdAt: false,
    updatedAt: false,
    })
    return facebook
}