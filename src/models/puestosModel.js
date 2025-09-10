const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const VistaAreaDepartamento = sequelize.define("VistaAreaDepartamento", {
    id_area_departamento: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true // opcional: si quieres que use esta como clave
    },
    departamento_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombre_departamento: {
      type: DataTypes.STRING,
      allowNull: true
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombre_area: {
      type: DataTypes.STRING,
      allowNull: true
    },
   
  }, {
    tableName: 'vista_area_departamento',
    timestamps: false,
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    // 👇 Esto es lo que evita que busque 'id'
    defaultScope: {
      attributes: {
        exclude: ['id']
      }
    }
  });

  return VistaAreaDepartamento;
};
