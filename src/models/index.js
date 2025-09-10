const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Carga modelos
db.User = require('./user')(sequelize, DataTypes);
db.empleados = require('./empleados')(sequelize, DataTypes);
db.turnos = require('./turnos')(sequelize, DataTypes); // ⚠️ AÑADE este
db.tiempo_extra = require("./tiempo_extra")(sequelize, DataTypes);
db.Asistencia = require("./Asistencia.js")(sequelize, DataTypes)
db.asistenciasTotales = require("./asistenciasTotales.js")(sequelize, DataTypes)
db.puestosModel = require("./puestosModel.js")(sequelize, DataTypes)
db.puesto = require("./puesto.js")(sequelize, DataTypes)
db.tres = require("./tres.js")(sequelize, DataTypes)
db.departamentos = require("./departamentos.js")(sequelize, DataTypes)
db.VistaPuestosCompleta = require("./vistaPuestosCompleta.js")(sequelize, DataTypes)
db.diasfestivos = require("./diasfestivos.js")(sequelize, DataTypes)
db.vistaEmpleados_puestoModel = require("./vistaEmpleados_puestoModel.js")(sequelize, DataTypes)
db.vacacionesModel = require("./vacacionesModel.js")(sequelize, DataTypes)
db.vista_rol_usuario_permiso = require("./vista_rol_usuario_permiso.js")(sequelize, DataTypes)
db.vista_ruta_paradaModel= require("./vista_ruta_paradaModel.js")(sequelize, DataTypes)
db.rutasModel = require("./rutasModel.js")(sequelize, DataTypes)
db.areasModel = require("./areasModel.js")(sequelize, DataTypes)
db.facebook = require("./facebook.js")(sequelize, DataTypes)
// ✅ Ejecuta métodos associate
if (db.empleados.associate) db.empleados.associate(db);
if (db.vistaEmpleados_puestoModel.associate) db.vistaEmpleados_puestoModel.associate(db);
if (db.turnos.associate) db.turnos.associate(db);


if(db.vacacionesModel.associate) db.empleados.associate(db)
    
   
module.exports = db;
