const ZKLib = require('node-zklib');
const { parse, differenceInBusinessDays, differenceInMinutes } = require('date-fns');
module.exports ={
    obtener : async(req,res)=>{
             const zk = new ZKLib('10.10.227.91', 4370, 20000, 10000);
      await zk.createSocket();

      const todos = await zk.getAttendances();
  let users = [];
  users  = await zk.getUsers();
      let hoy = new Date()
      let filtrar =[]
      for (let index = 0; index < todos.data.length; index++) {
        const element = todos.data[index];


        let dia = new Date(element.recordTime)
   
        
       
            filtrar.push(element)

   
        
      }
      res.json( {
        usuarios : users,
        asistencias : filtrar
      })

    }
}