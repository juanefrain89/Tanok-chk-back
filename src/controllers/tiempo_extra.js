const { where } = require("sequelize");
const {tiempo_extra} = require("../models");
const { Op } = require('sequelize');
const { startOfWeek, endOfWeek } = require("date-fns");
const { log } = require("node-zklib/helpers/errorLog");


module.exports ={
obtener: (req, res) => {
  const { Op } = require('sequelize');
  const { sequelize } = require('../models'); // Ajusta la ruta según tu estructura

  let whereCondition;

  if (req.body.fechaInicio && req.body.fechaFin) {
    // Cuando se envían fechas específica
    // s
    console.log("inicio",req.body.fechaInicio );
    
    whereCondition = {
      fecha: {
        [Op.gte]: new Date(req.body.fechaInicio),
        [Op.lte]: new Date(req.body.fechaFin)
      }
    };
  } else {
   
    const hoy = new Date();
    const fechaHoy = hoy.getFullYear() + '-' + 
                   String(hoy.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(hoy.getDate()).padStart(2, '0');
    
    whereCondition = sequelize.where(
      sequelize.fn('DATE', sequelize.col('fecha')), 
      fechaHoy
    );
  }

  tiempo_extra.findAll({
    where: whereCondition
  })
  .then((datos) => {
    console.log("Condición de búsqueda:", whereCondition);
    console.log("Registros encontrados:", datos.length);
    res.send(datos);
  })
  .catch((error) => {
    console.error('Error al obtener registros de tiempo extra:', error);
    res.status(500).send({ error: 'Error al obtener datos' });
  });
}
,
obtenersemanal:(req,res) =>{
const {fechaInicio ,fechaFin} = req.body
console.log("fecha inicio", fechaInicio, "fecha fin", fechaFin);

}
,

add:async (req, res) => {
  const { fecha, id_empleado, horas } = req.body;
try{
 let fecha1 = new Date(fecha)

  
  let horasextrassemanal=0
let iniciosemana = startOfWeek(fecha1  )
iniciosemana.setHours(18,0,0)
console.log("inicio", iniciosemana);


let finsemana = endOfWeek(fecha  )
finsemana.setHours(29, 59, 59, 999);
   const x = await tiempo_extra.findAll({
  where: {
    fecha: {
      [Op.between]: [iniciosemana, finsemana]
    },
id_empleado : id_empleado    
  },
  raw: true
});



for (let index = 0; index < x.length; index++) {
  const element = x[index];
  horasextrassemanal +=  element.horas
    
}
console.log(horasextrassemanal);

if (horasextrassemanal >= 9 ) {
  console.log("entro ");
  
  res.status(401).json({succes : false, message : "el empleado no puede tener esa cantidad horas por que sobrepasa las 9 horas", horas: horasextrassemanal} )
return

}



}catch(e){
  console.log(e);
  
}
  console.log("----------------------------------------------------------------------------------------------------");






  tiempo_extra.create({ fecha, id_empleado, horas })
    .then(() => {
      res.status(200).json({ success: true, message: "Guardado correctamente" });
    })
    .catch((err) => {
      console.error("❌ Error al guardar tiempo extra:", err);
      res.status(500).json({ success: false, message: "Error al guardar tiempo extra", error: err });
    });
}


}