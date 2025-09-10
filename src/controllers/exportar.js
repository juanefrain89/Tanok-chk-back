// controllers/asistenciasController.js
const axios = require('axios');
const { Op } = require('sequelize');
const { Asistencia, asistenciasTotales, vacacionesModel } = require('../models');
const ZKLib = require('node-zklib');
const { parse, differenceInBusinessDays, differenceInMinutes, startOfDay, endOfDay } = require('date-fns');

class exportar {
    
    // Método para obtener y sincronizar datos de la API
   async syncAsistencias(req, res) {
  try {
    console.log('Iniciando sincronización de asistencias...');

    const response = await axios.get('http://localhost:3100/datos');
    const asistencias = response.data?.re?.data;

    if (!asistencias || !Array.isArray(asistencias)) {
      return res.status(400).json({
        success: false,
        message: 'No se encontraron datos válidos en la API',
        data: null
      });
    }

    console.log(`Procesando ${asistencias.length} registros...`);

    const resultados = [];
    let insertados = 0;
    let duplicados = 0;
    let errores = 0;

    for (const item of asistencias) {
      try {
        const recordTime = new Date(item.recordTime);

        const yaExiste = await Asistencia.findOne({
          where: {
            userSn: item.userSn,
            recordTime: recordTime
          }
        });

        if (!yaExiste) {
          await Asistencia.create({
            userSn: item.userSn,
            deviceUserId: item.deviceUserId,
            userName: item.userName,
            userId: item.userId,
            timestamp: new Date(item.timestamp),
            timestampStr: item.timestampStr,
            recordTime: recordTime,
            date: item.date,
            time: item.time,
            recordType: item.recordType,
            ip: item.ip,
            salida: item.salida,
            horas_trabajadas: item.horasTrabajadas,
            state: item.state || 0,
            mode: item.mode || 0,
            rawData: item.raw
          });

          insertados++;
          resultados.push({
            userSn: item.userSn,
            userName: item.userName,
            action: 'inserted',
            timestamp: item.timestamp
          });
        } else {
          duplicados++;
          resultados.push({
            userSn: item.userSn,
            userName: item.userName,
            action: 'duplicated',
            timestamp: item.timestamp
          });
        }

      } catch (error) {
        errores++;
        console.error(`Error procesando registro ${item.userSn}:`, error.message);
        resultados.push({
          userSn: item.userSn,
          userName: item.userName,
          action: 'error',
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Sincronización completada',
      data: {
        total: asistencias.length,
        insertados,
        duplicados,
        errores,
        detalles: resultados
      }
    });

  } catch (error) {
    console.error('Error en sincronización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al sincronizar asistencias',
      error: error.message
    });
  }
}

    
    // Método para obtener todas las asistencias de la BD
   async getAllAsistencias(req, res) {
    let fechaInicio;
    let fechaFin;
    
    try {
        const { page = 1, limit = 50, userId, date, recordType } = req.query;
        
        if (req.body.fechaInicio && req.body.fechaFin) {
            // Crear objetos Date y normalizar al inicio/fin del día en UTC
            fechaInicio = new Date(req.body.fechaInicio);
            fechaFin = new Date(req.body.fechaFin);
            
            // Ajustar al inicio del día (00:00:00.000) en UTC
            fechaInicio.setUTCHours(0, 0, 0, 0);
            
            // Ajustar al final del día (23:59:59.999) en UTC
            fechaFin.setUTCHours(23, 59, 59, 999);
            
            console.log("Fecha original inicio:", req.body.fechaInicio);
            console.log("Fecha procesada inicio:", fechaInicio.toISOString());
            console.log("Fecha original fin:", req.body.fechaFin);
            console.log("Fecha procesada fin:", fechaFin.toISOString());
        } else {
            // Usar fecha actual
            const hoy = new Date();
            fechaInicio = startOfDay(hoy);
            fechaFin = endOfDay(hoy);
        }

        // Construir filtros
        const where = {
            timestamp: {
                [Op.between]: [fechaInicio, fechaFin]
            }
        };

          const where2 = {
            recordTime: {
                [Op.between]: [fechaInicio, fechaFin]
            }
        };
        if (userId) where.userId = userId;
        if (date) where.date = date;
        if (recordType) where.recordType = recordType;

        // Paginación
        const offset = (page - 1) * limit;

      



let asistencias = await Asistencia.findAndCountAll({
  where,
  limit: parseInt(limit),
  offset: parseInt(offset),
  order: [['timestamp', 'DESC']]
});

let vacaciones = await vacacionesModel.findAndCountAll({
  where: where2
});

// Modificamos cada fila de vacaciones
for (let index = 0; index < vacaciones.rows.length; index++) {
  const element = vacaciones.rows[index];
  element.setDataValue('recordTime', element.recordTime + "T02:00:00");
  element.setDataValue('timestamp', element.recordTime);
  element.setDataValue('timestampStr', element.recordTime);
  element.setDataValue("userId",    String(element.deviceUserId))
}




// Unimos los resultados en un solo array
let asis = [
  ...asistencias.rows,
  ...vacaciones.rows
];

console.log("asis", asis);








        res.status(200).json({
            success: true,
            data: {
                asistencias: asis,
                total: asistencias.count,
                page: parseInt(page),
                totalPages: Math.ceil(asistencias.count / limit)
            }
        });

    } catch (error) {
        console.error('Error obteniendo asistencias:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener asistencias',
            error: error.message
        });
    }
}
    
    // Método para obtener asistencias por usuario
    async getAsistenciasByUser(req, res) {
        try {
            const { userId } = req.params;
            const { startDate, endDate } = req.query;
            
            const where = { userId };
            
            if (startDate && endDate) {
                where.date = {
                    [Op.between]: [startDate, endDate]
                };
            }
            
            const asistencias = await Asistencia.findAll({
                where,
                order: [['timestamp', 'DESC']]
            });
            
            res.status(200).json({
                success: true,
                data: asistencias
            });
            
        } catch (error) {
            console.error('Error obteniendo asistencias por usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener asistencias del usuario',
                error: error.message
            });
        }
    }
    
    // Método para ejecutar sincronización automática (cron job)
    async autoSync() {
        try {
            console.log('Ejecutando sincronización automática...');
            
            const response = await axios.get('http://localhost:3100/datos');
            const asistencias = response.data?.re?.data;
            
            if (!asistencias || !Array.isArray(asistencias)) {
                console.log('No se encontraron datos en la sincronización automática');
                return;
            }
            
            let procesados = 0;
            
            for (const item of asistencias) {
                try {
                    const asistenciaData = {
                        userSn: item.userSn,
                        deviceUserId: item.deviceUserId,
                        userName: item.userName,
                        userId: item.userId,
                        timestamp: new Date(item.timestamp),
                        timestampStr: item.timestampStr,
                        recordTime: new Date(item.recordTime),
                        date: item.date,
                        time: item.time,
                        recordType: item.recordType,
                        ip: item.ip,
                        state: item.state || 0,
                        mode: item.mode || 0,
                        rawData: item.raw
                    };
                    
                    await Asistencia.findOrCreate({
                        where: {
                            userSn: item.userSn,
                            recordTime: new Date(item.recordTime)
                        },
                        defaults: asistenciaData
                    });
                    
                    procesados++;
                    
                } catch (error) {
                    console.error(`Error en auto-sync para registro ${item.userSn}:`, error.message);
                }
            }
            
            console.log(`Sincronización automática completada. Procesados: ${procesados}`);
            
        } catch (error) {
            console.error('Error en sincronización automática:', error.message);
        }
    }

async exportarAsistenciastotales(req, res) {
  try {
    const zk = new ZKLib('10.10.227.91', 4370, 20000, 10000);
    await zk.createSocket();

    const todos = await zk.getAttendances();

    let insertados = 0;
    let duplicados = 0;

    for (let index = 0; index < todos.data.length; index++) {
      const element = todos.data[index];
      const recordTime = new Date(element.recordTime);
      const deviceUserId = element.deviceUserId;

      const yaExiste = await asistenciasTotales.findOne({
        where: {
          recordTime: recordTime,
          deviceUserId: deviceUserId
        }
      });

      if (!yaExiste) {
        await asistenciasTotales.create({
          userSn: element.userSn,
          recordTime: recordTime,
          ip: element.ip,
          deviceUserId: deviceUserId
        });
        insertados++;
      } else {
        duplicados++;
      }
    }

    res.json({
      success: true,
      mensaje: `Insertados: ${insertados}, Duplicados (omitidos): ${duplicados}`
    });

  } catch (error) {
    console.error("Error al exportar asistencias:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

}

module.exports = new exportar();