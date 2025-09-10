const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const turnos = sequelize.define("turnos", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    horas: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    turno: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lunes :{
      type : DataTypes.BOOLEAN,
      allowNull : true
    },
   martes :{
      type : DataTypes.BOOLEAN,
      allowNull : true
    },   
    miercoles :{
      type : DataTypes.BOOLEAN,
      allowNull : true
    },  
     jueves :{
      type : DataTypes.BOOLEAN,
      allowNull : true
    }, 
      viernes :{
      type : DataTypes.BOOLEAN,
      allowNull : true
    },
       sabado :{
      type : DataTypes.BOOLEAN,
      allowNull : true
    },   
    domingo :{
      type : DataTypes.BOOLEAN,
      allowNull : true
    },
    dias :{
      type: DataTypes.INTEGER,
      allowNull : true
    }
  }, {
    tableName: 'turnos',
    timestamps: false
  });

  turnos.associate = (models) => {
    turnos.hasMany(models.empleados, {
      foreignKey: 'turno',
      sourceKey: 'id',
      as: 'empleados'
    });
  };

  return turnos;
};