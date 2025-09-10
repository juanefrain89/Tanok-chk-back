const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const vistaEmpleados_puestoModel = sequelize.define("vistaEmpleados_puestoModel", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false
    },
    turno: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    curp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nss: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cup: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ingreso: {
      type: DataTypes.DATE,
      allowNull: true
    },
    numero_tarjeta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numero_empleado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tarjeta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: true
    },
    puesto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    area: {
      type: DataTypes.STRING,
      allowNull: true
    },
    escolaridad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sueldo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    sexo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    calle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    colonia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rfc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado_civil: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nacimiento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dom_beneficiario: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tel_beneficiario: {
      type: DataTypes.STRING,
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parada: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ruta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contacto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tel_emergencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parentesco: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contratacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tel_reclutado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cp_fiscal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apellido_materno:{
      type: DataTypes.STRING,
      allowNull: false
    },
     apellido_paterno:{
      type: DataTypes.STRING,
      allowNull: false
    },
    beneficiario: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vacacionesdisponibles :{
      type : DataTypes.INTEGER,
      allowNull : true
    },
    foto:{
      type : DataTypes.STRING,
      allowNull : false
    },
    id_area:{
          type : DataTypes.STRING,
      allowNull : false
    },
    nombre_area:{
          type : DataTypes.STRING,
      allowNull : false
    },
    numero_departamento:{
          type : DataTypes.INTEGER,
      allowNull : false
    },
    clave_departamento:{
          type : DataTypes.STRING,
      allowNull : false
    },
    nombre_departamento:{
          type : DataTypes.STRING,
      allowNull : false
    },
    clave_area:{
          type : DataTypes.STRING,
      allowNull : false
    },
    id_departamento:{
          type : DataTypes.INTEGER,
      allowNull : false
    },
    id_puesto:{
          type : DataTypes.INTEGER,
      allowNull : false
    },
    nombre_puesto:{
          type : DataTypes.STRING,
      allowNull : false
    },
    clavepuesto:{
          type : DataTypes.STRING,
      allowNull : false
    }
   
  }, {
    tableName: 'empleados_puesto',
    timestamps: false
  });

  vistaEmpleados_puestoModel.associate = (models) => {
    vistaEmpleados_puestoModel.belongsTo(models.turnos, {
      foreignKey: 'turno',
      targetKey: 'id',
      as: 'datosTurno'
    });

    vistaEmpleados_puestoModel.hasMany(models.vacacionesModel, {
  foreignKey: 'deviceUserId',  
  sourceKey: 'id',             
  as: 'vacacionesEmpleados'
});

  }

  return vistaEmpleados_puestoModel;
};
