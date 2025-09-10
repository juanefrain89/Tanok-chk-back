const jwt = require('jsonwebtoken');
const db = require('../models');
const { User } = db;

module.exports = {
  crear: async (req, res) => {
    const { correo, contraseña } = req.body;



    
    try {
     let x =[]
       let all = []
    
       
     x = await db.vista_rol_usuario_permiso.findAll({ raw: true });

for (let index = 0; index < x.length; index++) {
    console.log("entro");
    
  const element = x[index];  
  let obj = all.find(e => e.id_usuario == element.id_usuario);
  if (obj) {
    console.log("encontró");
    obj.todospermisos.push(element.can)
  } else {
    element.todospermisos =[]
    element.todospermisos.push(element.can)
    all.push(element);
  }
}







      const usuario = await User.findOne({
        where: { correo, contraseña }
      });

    
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
all = all.find(e => e.id_usuario == usuario.id)

      const token = jwt.sign(
        {
          id: usuario.id,
          correo: usuario.correo,
          rol: usuario.rol
        },
        "gatito",
        { expiresIn: "100h" }
      );

      return res.status(200).json({ token, usuario, all });
    } catch (error) {
      console.error("❌ Error en login:", error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};



/**  
jwt.verify(token, "gatito", (err, decode)=>{
    if(err){
        console.log(err);
        res.send("el error ")
    }else{
        res.send(decode)        
    }
})*/
    


    
