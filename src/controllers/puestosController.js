const { puestosModel, puesto, tres, VistaPuestosCompleta, areasModel,  departamentos } = require("../models");

module.exports = {
  obtener: async (req, res) => {
    try {
      const area = await puestosModel.findAll({});
      const puestos = await VistaPuestosCompleta.findAll({});
      const todasareas = await areasModel.findAll({})
      const departamentoss = await departamentos.findAll({})
const puestos2 = await puesto.findAll({});
      res.json({
         puestos2: puestos2,
        puesto: puestos,
        area: area,
        todasareas : todasareas,
        departamentos : departamentoss,
        status: 200
      });
    } catch (err) {
      console.error("❌ Error al obtener datos:", err);
      res.status(500).json({ error: 'Error al obtener datos' });
    }
  },
  crear : (req, res)=>{
   const {relacion2,id_puesto} = req.body
console.log("body",req.body);

   tres.create({
      id_puesto : id_puesto,
      relacion2 : relacion2
   })
   .then((e)=>{      res.json({ mensaje: "bien" }); 
   })
  }
};
