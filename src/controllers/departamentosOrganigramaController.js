const { departamentosOrganigramaModel } = require("../models");

module.exports = {
  obtener: async (req, res) => {
    try {
      const departamentos = await departamentosOrganigramaModel.findAll({});
      res.json(departamentos);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
      res.status(500).json({ error: "Error al obtener los departamentos" });
    }
  }
};
