const db = require("../models");
const vista_rol_usuario_permiso = db.vista_rol_usuario_permiso;

module.exports = {
  obtener: async (req, res) => {
    try {
      let all = [];
      const x = await vista_rol_usuario_permiso.findAll({ raw: true });

      for (let element of x) {
        let obj = all.find(e => e.id_usuario === element.id_usuario);

        if (obj) {
          obj.todospermisos.push(element.can);
        } else {
          element.todospermisos = [element.can];
          all.push(element);
        }
      }

      res.json(all);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener vista_rol_usuario_permiso" });
    }
  }
};
