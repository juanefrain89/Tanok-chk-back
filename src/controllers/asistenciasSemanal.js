const {
  startOfISOWeek,
  endOfISOWeek,
  addDays,
  format,
  startOfDay,
  endOfDay
} = require('date-fns');

const { empleados, asistenciasTotales, turnos, vacacionesModel, diasfestivos } = require('../models');
const { log } = require('zkteco-js/src/logs/log');
const { Op } = require('sequelize');

module.exports = {
  obtenerSemanal: async (req, res) => {
    try {
      const { semana } = req.body;
      let fechaReferencia;

      // Calcular fecha base de la semana
      if (semana) {
        const [anio, semanaStr] = semana.split("-W");
        const semanaNum = parseInt(semanaStr);
        if (isNaN(semanaNum)) throw new Error("Semana inválida");

        const enero4 = new Date(anio, 0, 4);
        const inicioISO = startOfISOWeek(enero4);
        inicioISO.setDate(inicioISO.getDate() + (semanaNum - 1) * 7);
        fechaReferencia = inicioISO;
      } else {
        // Si no se especifica semana, usar la fecha actual
        fechaReferencia = new Date();
      }

      const inicioSemana = startOfDay(startOfISOWeek(fechaReferencia));
      const finSemana = endOfDay(endOfISOWeek(fechaReferencia));

      const diasSemana = Array.from({ length: 7 }).map((_, i) =>
        format(addDays(inicioSemana, i), 'yyyy-MM-dd')
      );

      // Traer todos los registros
      let feriados = await diasfestivos.findAll({
     
      })
      let todos = await asistenciasTotales.findAll({
        where :{
          recordTime :{
          [Op.between] : [inicioSemana, finSemana]          }
        }
      });
let vacaciones = await vacacionesModel.findAll({})
for (let index = 0; index < vacaciones.length; index++) {
  const element = vacaciones[index];
  element.recordTime = element.recordTime + "T02:00:00"
  
}
todos = [...todos, ...vacaciones, ...feriados]
     



      const registrosSemana = todos.filter(reg => {
        const fecha = new Date(reg.recordTime);
        return !isNaN(fecha) && fecha >= inicioSemana && fecha <= finSemana;
      });

      // Agrupar por usuario y fecha
      const resumen = {};
      registrosSemana.forEach(reg => {
        const fecha = new Date(reg.recordTime);
        const fechaStr = format(fecha, 'yyyy-MM-dd');
        const userId = reg.deviceUserId;

        if (!resumen[userId]) {
          resumen[userId] = {
            userId,
            userName: `Empleado ${userId}`,
            dias: {}
          };
        }

        resumen[userId].dias[fechaStr] = true;
      });

      const empleadosResumen = Object.values(resumen).map(empleado => {
        const asistencias = diasSemana.map(dia => ({
          fecha: dia,
          asistio: !!empleado.dias[dia]
        }));
        return {
          userId: empleado.userId,
          userName: empleado.userName,
          asistencias
        };
      });

      // Obtener empleados registrados
      const empleadosDB = await empleados.findAll({
      
        where :{
          activo : true
        },

         include: [{ model: turnos, as: "datosTurno", required: true }] 
      
      }
      );

      let empleadosConAsistencias = empleadosDB.map(empleado => {
        let asistenciasSemana = registrosSemana.filter(reg =>
          String(reg.deviceUserId) === String(empleado.id)
        );

       for (let index = 0; index < feriados.length; index++) {
        const element = feriados[index];
        element.recordTime = element.fecha + "T02:00:00"
asistenciasSemana.push(element)        
       }
        const dias = {
          lunes: false,
          martes: false,
          miercoles: false,
          jueves: false,
          viernes: false,
          sabado: false,
          domingo: false
        };

        asistenciasSemana.forEach(asistencia => {
          const fecha = new Date(asistencia.recordTime);
          const diaSemana = fecha.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado

          switch (diaSemana) {
            case 0: dias.domingo = true; break;
            case 1: dias.lunes = true; break;
            case 2: dias.martes = true; break;
            case 3: dias.miercoles = true; break;
            case 4: dias.jueves = true; break;
            case 5: dias.viernes = true; break;
            case 6: dias.sabado = true; break;
          }
        });

        return {
          id: empleado.id,
          nombre: empleado.nombre,
          infototal : empleado,
          turno: empleado.turno,
          dias,
          asistenciasSemana,
    
          totalRegistros: asistenciasSemana.length
        };
      });

    
      const estadisticas = {
        totalRegistrosSemana: registrosSemana.length,
        empleadosConAsistencias: empleadosConAsistencias.filter(emp => emp.totalRegistros > 0).length,
        empleadosSinAsistencias: empleadosConAsistencias.filter(emp => emp.totalRegistros === 0).length
      };

      res.json({
        success: true,
        registros: registrosSemana,
        semana: {
          inicio: format(inicioSemana, 'yyyy-MM-dd'),
          fin: format(finSemana, 'yyyy-MM-dd'),
          dias: diasSemana
        },
        registrosTotales: registrosSemana.length,
        empleados: empleadosResumen,
        empleadosConAsistencias,
        estadisticas
      });

    } catch (error) {
      console.error('Error en obtenerSemanal:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
