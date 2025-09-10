const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const VistaPuestosCompleta = sequelize.define("vistaPuestosCompleta", {
    id_area_departamento: {
      type: DataTypes.INTEGER
    },
    departamento_id: {
      type: DataTypes.INTEGER
    },
    nombre_departamento: {
      type: DataTypes.STRING
    },
    area_id: {
      type: DataTypes.INTEGER
    },
    nombre_area: {
      type: DataTypes.STRING
    },
    id: {
      type: DataTypes.INTEGER, 
    },
    nombre: {
      type: DataTypes.STRING 
    },
    id_tres: {
      type: DataTypes.INTEGER,
      primaryKey: true 
    },
    relacion2: {
      type: DataTypes.INTEGER
    },
    id_puesto: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'vista_puestos_completa',
    timestamps: false,
    freezeTableName: true
  });

  return VistaPuestosCompleta;
};
