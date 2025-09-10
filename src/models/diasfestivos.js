const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize)=>{
    const diasfestivos = sequelize.define("diasfestivos",{
      id: {
           type: DataTypes.INTEGER,
           primaryKey: true,
           autoIncrement: false
         },
         descripcion:{
            type : DataTypes.STRING,
            allowNull : true
         },
         fecha :{
            type : DataTypes.DATE,
            allowNull : false
         }
    },{
         tableName: 'diasfestivos',
    timestamps: false
        
    })
    return diasfestivos
}