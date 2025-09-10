const { log } = require("node-zklib/helpers/errorLog");
const { crear } = require("../auth.js/login");
const db = require("../models");
const { where } = require("sequelize");
const { empleados, turnos, vacacionesModel } = db;
const path = require("path");
const fs = require("fs");
module.exports = {
  obtener: (req, res) => {
    empleados.findAll({
  where :{
    activo : true
  },
      include: [
        {
          model: turnos,
          as: 'datosTurno',
          required: true
        },
      {
        model : vacacionesModel,
        as : "vacacionesEmpleados",
        required : false
      }
      ]
    })
    .then((resultados) => {
      res.send(resultados);
    })
    .catch((error) => {
      console.error("Error al obtener empleados con turnos:", error);
      res.status(500).send({ error: "Error al consultar la base de datos" });
    });
  },

vistaempleados:(req,res)=>{
    db.vistaEmpleados_puestoModel.findAll({
      where: {
        activo : true
      },
      include: [
        {
          model: turnos,
          as: 'datosTurno',
          required: true
        },
      {
        model : vacacionesModel,
        as : "vacacionesEmpleados",
        required : false
      }
      ]
    })
    .then((resultados) => {
      res.send(resultados);
    })
    .catch((error) => {
      console.error("Error al obtener empleados con turnos:", error);
      res.status(500).send({ error: "Error al consultar la base de datos" });
    });

},
crearempleado: (req, res) => {
  let {
    nombre,
    telefono,
    nss,
    turno,
    numero_empleado,
    curp,
    ingreso,
    tarjeta,
    departamento,
    puesto,
    area,
    cup,
    escolaridad,
    sueldo,
    sexo,
    calle,
    colonia,
    ciudad,
    rfc,
    estado_civil,
    nacimiento,
    dom_beneficiario,
    tel_beneficiario,
    correo,
    parada,
    ruta,
    contacto,
    tel_emergencia,
    parentesco,
    contratacion,
    tel_reclutado,
    cp_fiscal,
    beneficiario,
    apellido_materno,
    apellido_paterno,
    imagen,
  } = req.body;

  ingreso = ingreso + "T12:00:00";
  console.log(ingreso, "ingreso");

  // Procesar imagen (si viene en Base64)
  if (imagen && imagen.startsWith("data:")) {
    const matches = imagen.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ mensaje: "Formato de imagen inválido" });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split("/")[1];
    const fileName = `evidencia_${numero_empleado}_${Date.now()}.${extension}`;
    const uploadDir = path.join(__dirname, "../uploads/evidencia2");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, base64Data, { encoding: "base64" });

    imagen = fileName;
  } else if (imagen && imagen !== "") {
   
    imagen = path.basename(imagen);
  }

  empleados
    .create({
      nombre,
      telefono,
      nss,
      turno,
      id: numero_empleado,
      curp,
      ingreso,
      numero_tarjeta: tarjeta,
      departamento,
      puesto,
      area,
      cup,
      escolaridad,
      sueldo,
      sexo,
      calle,
      colonia,
      ciudad,
      rfc,
      estado_civil,
      nacimiento,
      dom_beneficiario,
      tel_beneficiario,
      correo,
      parada,
      ruta,
      contacto,
      tel_emergencia,
      parentesco,
      contratacion,
      tel_reclutado,
      cp_fiscal,
      beneficiario,
      apellido_materno,
      apellido_paterno,
   foto:   imagen,
   activo : true
    })
    .then((e) => res.status(200).json(e))
    .catch((err) => {
      console.error("❌ Error al crear empleado:", err);

      let detalle = err.message;

      if (err.name === "SequelizeUniqueConstraintError") {
        detalle =
          err.original?.sqlMessage ||
          "Ya existe un registro con ese valor (violación de PRIMARY o UNIQUE)";
      } else if (err.name === "SequelizeValidationError") {
        detalle = err.errors.map((e) => e.message).join(", ");
      } else if (err.name === "SequelizeDatabaseError") {
        detalle = err.original?.sqlMessage || "Error en la base de datos";
      }

      res.status(500).json({
        mensaje: "Error al crear el empleado",
        error: err.name,
        detalle,
        completo: err,
      });
    });
},
    
  actualizarcantidadvacaciones:async (req,res)=>{
const {cantidad_dias, numero_empleado} = req.body
try{
 const actualizacion =    await empleados.update(
  {vacacionesdisponibles : cantidad_dias},
  {where :{id : numero_empleado}}
)
res.status(200).json({
  succes : true,
  data : actualizacion
})
}
catch(e){
  res.send(e)
}
  },

  borrar:(req,res)=>{
    console.log("entro");
    
   const { id } = req.params;
 empleados.update({activo : false},{
  where :{id : id}
 }
 )
  .then((deletedCount) => {
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    res.status(200).json({ message: "Empleado eliminado correctamente" });
  })
  .catch((error) => {
    console.error(error);
    res.status(500).json({ message: "Error eliminando empleado" });
  });
  },
  editarempleado:(req, res)=>{
   
  let {
    nombre,
    telefono,
    nss,
    turno,
    id,
    curp,
    ingreso,
    numero_tarjeta,
    departamento,
    puesto,
    area,
    cup,
    escolaridad,
    sueldo,
    sexo,
    calle,
    colonia,
    ciudad,
    rfc,
    estado_civil,
    nacimiento,
    dom_beneficiario,
    tel_beneficiario,
    correo,
    parada,
    ruta,
    contacto,
    tel_emergencia,
    parentesco,
    contratacion,
    tel_reclutado,
    cp_fiscal,
    beneficiario,
    apellido_materno,
    apellido_paterno,
    imagen,
  } = req.body;
console.log(req.body);
empleados.update(
  {
  nombre,
    telefono,
    nss,
    turno,
   id,
    curp,
    ingreso,
   numero_tarjeta,
    departamento,
    puesto,
    area,
    cup,
    escolaridad,
    sueldo,
    sexo,
    calle,
    colonia,
    ciudad,
    rfc,
    estado_civil,
    nacimiento,
    dom_beneficiario,
    tel_beneficiario,
    correo,
    parada,
    ruta,
    contacto,
    tel_emergencia,
    parentesco,
    contratacion,
    tel_reclutado,
    cp_fiscal,
    beneficiario,
    apellido_materno,
    apellido_paterno,
    imagen,
},{
  where : {id : id}
})
.then(
  (bien)=>{
    res.status(200).json({mensaje : "actualizado bien"})
  }
 
)

 .catch((e)=>{
  res.status(500).json({error : e})
 })
}
};
