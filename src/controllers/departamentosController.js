const {  departamentos } = require("../models")

module.exports = {
    obtenerdepas : async(req,res)=>{
     try{
let resultado = await departamentos.findAll({})

  res.json({
        status: 200,
        departamentos: resultado
      });

    }catch  (err) {
console.error("❌ Error al obtener departamentos:", err);
      res.status(500).json({ error: "Error al obtener departamentos" });
    }
}}