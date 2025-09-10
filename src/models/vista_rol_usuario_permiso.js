const { DataTypes } = require("sequelize");

const dataTypes = require("sequelize/lib/data-types");

module.exports = (sequelize)=>{
    const vista_rol_usuario_permiso = sequelize.define("vista_rol_usuario_permiso",{
       
      
        id_usuario :{
             type: DataTypes.INTEGER,
      allowNull: false
        },
        correo:{
             type: DataTypes.STRING,
      unique: true,
      allowNull: false
        },
      
       rol_id:{
             type: DataTypes.INTEGER,
      allowNull: false
        },
        descripcion:{
             type: DataTypes.STRING,
      allowNull: false
        },
can:{

type: dataTypes.STRING,
allowNull : false
}

}, {
      tableName: "vista_rol_usuario_permiso",
    timestamps: false,
    freezeTableName: true,
    primaryKey: false,
    createdAt: false,
    updatedAt: false,
    // 👇 esto es lo clave
    hasPrimaryKeys: false,
})

return vista_rol_usuario_permiso
}