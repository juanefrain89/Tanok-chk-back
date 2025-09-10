const { log } = require("zkteco-js/src/logs/log")
const { diasfestivos } = require("../models")

module.exports ={
    obtener :(req, res)=>{
        diasfestivos.findAll({})
        .then((e)=>{
            res.send(e)
        })
    },

    crear:(req,res)=>{
        console.log(req.body);
        
        const {fecha, descripcion} = req.body
        diasfestivos.create({
fecha,
descripcion
        })
        .then((e)=>{
            res.send(e)
        })
        .catch((e)=>{
            res.send(e)
        })
    }
}