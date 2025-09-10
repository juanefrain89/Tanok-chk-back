const { Op } = require("sequelize")
const { asistenciasTotales } = require("../models")
const { subDays } = require("date-fns")

module.exports ={
    obtener :async (req, res)=>{
        try{
            const hooy = new Date()
            hooy.setHours(23, 59, 59, 999);
            const inicio = subDays(hooy, 90)
            inicio.setHours(0,0,0)
            console.log(hooy);
            
      let a = await asistenciasTotales.findAll({
          where: {
           
                   recordTime: {
            [Op.between]: [inicio  , hooy   ]
          }
       
          }
      })
      res.send(a)
        }catch (w) {
            res.send(w)
        }
    }
}