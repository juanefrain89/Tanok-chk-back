const { Asistencia, asistenciasTotales } = require("../models");

module.exports = {
  agregar: async (req, res) => {
    try {
      const { dia, id, nombre, timestamp } = req.body;
      console.log(req.body);

      await Asistencia.create({
        deviceUserId: id,
        timestampStr: dia,
        userName: nombre,
        userId: id,
        timestamp: dia,
        recordTime: dia,
        date: dia,
        ip: "192.168.9.98"
      });

      // ✅ Construir fecha local correcta (día + hora deseada)
      const [year, month, day] = dia.split("-").map(Number);
      const fecha = new Date(year, month - 1, day, 2, 4, 0); // hora local 02:04:00

      await asistenciasTotales.create({
        recordTime: fecha,
        ip: "192.168.9.98",
        deviceUserId: id
      });

      res.json({ success: true });
    } catch (err) {
      console.error("Error al agregar:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
};
