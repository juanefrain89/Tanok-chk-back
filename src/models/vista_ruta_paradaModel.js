const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
const vista_ruta_paradaModel = sequelize.define("vista_ruta_paradaModel",{
    id:{
        type : DataTypes.INTEGER,
        allowNull : true,
           primaryKey: true
    },
    id_ruta :{
         type : DataTypes.INTEGER,
        allowNull : true,
    },
    nombre_ruta :{
         type : DataTypes.STRING,
        allowNull : true,
    },
        nombre_parada :{
         type : DataTypes.STRING,
        allowNull : true,
    },
    primerturno:{
        type : DataTypes.STRING,
        allowNull : true
    },
      segundoturno:{
        type : DataTypes.STRING,
        allowNull : true
    },
    tercerturno:{
          type : DataTypes.STRING,
        allowNull : true

    }


},
{
     tableName: 'rutas_paradas',
    timestamps: false  
})    
return vista_ruta_paradaModel
}