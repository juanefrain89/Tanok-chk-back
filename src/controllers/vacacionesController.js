const { where, literal  } = require("sequelize")
const { vacacionesModel, empleados } = require("../models")

module.exports ={
    obtener : (req,res)=>{
        vacacionesModel.findAll({
          
        })
        .then((e)=>{
            res.send(e)
        })
        .catch((eror)=>{
            res.send(eror)
        })
    },
crear: async (req, res) => {
  try {
    const { deviceUserId, recordTime, descripcion } = req.body;


    const vacacionCreada = await vacacionesModel.create({
      deviceUserId,
      recordTime,
      descripcion
    });

   
    const [cantidadActualizados] = await empleados.update(
      { vacacionesdisponibles: literal('vacacionesdisponibles - 1') },
      { where: { id: deviceUserId } }
    );

  
    const empleadoActualizado = await empleados.findOne({ where: { id: deviceUserId } });

    
    res.send({
      vacacion: vacacionCreada,
      empleado: empleadoActualizado,
      filasActualizadas: cantidadActualizados
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

}