const { turnos } = require("../models")

module.exports ={
    obtenerTurnos : (req, res)=>{
  
    turnos.findAll()
    .then((e)=>{
        res.send(e)
    })
    }
}