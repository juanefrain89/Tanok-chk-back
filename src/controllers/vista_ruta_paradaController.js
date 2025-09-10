const { vista_ruta_paradaModel, rutas, rutasModel } = require("../models")

module.exports ={
    obtener: (req,res)=>{
        vista_ruta_paradaModel.findAll({})
        .then((bien)=>{
           
            rutasModel.findAll({})
            .then((e)=>{
 res.status(200).json({datos : bien, rutas: e})
            })
        })
    }
}