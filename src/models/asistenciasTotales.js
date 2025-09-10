const { DataTypes } = require("sequelize");


module.exports = (sequelize) =>{
    const asistenciasTotales = sequelize.define(("asistenciasTotales"),{
          id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                userSn: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                 
                },
                  recordTime: {
                            type: DataTypes.DATE,
                            allowNull: true,
           
                        },
                        ip :{
                            type : DataTypes.STRING,
                            allowNull : true
                        },
                        deviceUserId:{
type : DataTypes.INTEGER,
allowNull : false
                        }
    },{
         timestamps: false,
    })
    return asistenciasTotales
}


