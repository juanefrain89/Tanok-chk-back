// src/models/inicio.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataType) => {
  const inicio = sequelize.define("inicio", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    correo: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Debe ser un email válido'
        },
        notEmpty: {
          msg: 'El correo no puede estar vacío'
        }
      }
    }
  }, {
    tableName: 'login', 
    timestamps: true, 
    underscored: true 
  });

 
  inicio.associate = (models) => {
  
  };

  return inicio;
};