const express = require('express');
const app = express();
const { sequelize, tiempo_extra, departamentos, facebook } = require('./models');
const userRoutes = require('./route/inicio');
const empleados2 = require("./route/empleados")
const horasExtras = require("./route/tiempo_extra")
const { log } = require('zkteco-js/src/logs/log');
const cors = require("cors");
const { DATE } = require('sequelize');
const path = require('path');

const turnoRoute = require("./route/turnosRoute")
const { parse, differenceInBusinessDays, differenceInMinutes } = require('date-fns');
const PORT = 3000;
const formato = 'dd/MM/yyyy, hh:mm:ss aa';
const empleados  = require("./controllers/empleados")
const turnos = require('./models/turnos');
const moment = require("moment");
const turnosController = require('./controllers/turnosController');
const Semanal = require('./controllers/asistenciasSemanal');
const asistenciaHoy = require('./controllers/asistenciaHoy');
const exportar = require('./controllers/exportar');
const agregardiavacion = require('./controllers/agregardiavacion');
const login = require('./auth.js/login');
const puestosController = require('./controllers/puestosController');
const departamentosController = require('./controllers/departamentosController');
const todasAsistencias = require('./controllers/todasAsistencias');
const diasfestivosController = require('./controllers/diasfestivosController');
const departamentosOrganigramaController = require('./controllers/departamentosOrganigramaController');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const vacacionesController = require('./controllers/vacacionesController');
const vista_rol_usuario_permiso = require('./models/vista_rol_usuario_permiso');
const vista_rol_usuario_permisoController = require('./controllers/vista_rol_usuario_permisoController');
const vista_ruta_paradaController = require('./controllers/vista_ruta_paradaController');
const areasController = require('./controllers/areasController');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('port', process.env.PORT || 3100);
app.use(express.urlencoded({extended: false}));         
app.use('/images', express.static('images'));
app.use(express.json({ limit: "100mb" }));

app.use(cookieParser());


app.use(cors({
  origin: "*"
}))


app.post("/editarempleado", empleados.editarempleado)
app.get("/puestos", puestosController.obtener)
app.get("/asis", exportar.exportarAsistenciastotales)
app.post("/login", login.crear)
app.get("/", (req, res)=>{res.send("hpña")})
app.post("/agregardia", agregardiavacion.agregar)
app.post("/crearempleado", empleados.crearempleado)
app.use('/empleados', empleados2);
app.post("/semanal", Semanal.obtenerSemanal)
app.use("/horasExtras", horasExtras)
app.use("/turnos", turnoRoute)
// app.get("/hh", exportar.exportar)
app.post("/pares", exportar.getAllAsistencias)
app.get("/exportar", exportar.syncAsistencias )
app.post("/crearpuestos", puestosController.crear)
app.get("/departamentos",  departamentosController.obtenerdepas)
app.get("/diasfestivos", diasfestivosController.obtener)
app.post("/diasfestivoscrear", diasfestivosController.crear)
app.get("/to", todasAsistencias.obtener)
app.get("/vacaciones", vacacionesController.obtener)
app.post("/crearvacacion", vacacionesController.crear)
app.get("/areas", areasController.obtener)
app.get("/roles", vista_rol_usuario_permisoController.obtener)
app.get("/departamentosOrganigrama", departamentosOrganigramaController.obtener)
app.post("/actualizarcantidadvacaciones", empleados.actualizarcantidadvacaciones)
app.get("/paradas", vista_ruta_paradaController.obtener)
app.get("/vistaempleados", empleados.vistaempleados)
app.delete("/empleado/:id",empleados.borrar)
app.get('/bd', async (req, res) => {




app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



  try {
    const [results] = await sequelize.query("SELECT database() AS db");
    res.json({ baseDeDatos: results[0].db });
  } catch (error) {
    console.error("Error al obtener base de datos:", error);
    res.status(500).json({ error: "Error al obtener base de datos" });
  }
});

app.get("/datos", async (req, res) => {
  console.log("Obteniendo todos los registros sin filtro de fechas");
 
  let ZKLib;
  let entrada = [];
 
  try {
    ZKLib = require('node-zklib');
    console.log('✅ node-zklib cargado correctamente');
  } catch (error) {
    console.error('❌ Error cargando node-zklib:', error.message);
    return res.status(500).json({ error: 'node-zklib no disponible' });
  }
 
  const deviceConfig = {
    ip: '10.10.227.91',
    port: 4370,
    timeout: 20000,
    inport: 10000
  };
 


  let zk = null;
 
  try {
    
  
 
    zk = new ZKLib(deviceConfig.ip, deviceConfig.port, deviceConfig.timeout, deviceConfig.inport);
 
    console.log('🔌 Conectando al dispositivo...');
    await zk.createSocket();
    console.log('✅ Conexión establecida');
 
    let deviceInfo = {};

    try {
      console.log('📋 Obteniendo información del dispositivo...');
      const info = await zk.getInfo();
      deviceInfo = {
        deviceName: info?.deviceName || info?.name || 'MB160',
        serialNumber: info?.serialNumber || info?.serial || 'N/A',
        firmwareVersion: info?.firmwareVersion || info?.version || 'N/A',
        platform: info?.platform || 'ZKTeco',
        fingerCount: info?.fingerCount || 0,
        userCount: info?.userCount || 0,
        recordCount: info?.recordCount || 0
      };
    } catch (infoError) {
      console.log('⚠️ No se pudo obtener info del dispositivo:', infoError.message);
    }
 
    console.log('\n👥 Obteniendo usuarios...');
    let users = [];
    try {
      const rawUsers = await zk.getUsers();
      if (rawUsers?.data?.length) {
        users = rawUsers.data.map(user => ({
          uid: user.uid || user.id,
          userId: user.userId || user.userid || user.uid,
          name: user.name || `Usuario ${user.uid}`,
          role: user.role || user.privilege || 0,
          roleDescription: getRoleDescription(user.role || 0),
          password: user.password || '',
          cardno: user.cardno || user.cardNo || 0,
          finger: user.finger || null,
          face: user.face || null,
          palm: user.palm || null
        }));
      }
    } catch (userError) {
      console.error('❌ Error obteniendo usuarios:', userError.message);
    }
 
    console.log('\n⏰ Obteniendo TODOS los registros de asistencia...');
    let attendances = [];
    try {
      const rawAttendances = await zk.getAttendances();
      if (rawAttendances?.data?.length) {
        attendances = rawAttendances.data.map(record => {
          let timestamp = record.recordTime ? new Date(record.recordTime) : null;
          const timestampStr = timestamp ? timestamp.toLocaleString('es-MX', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZone: 'America/Mexico_City'
          }) : 'Fecha inválida';
 
          const user = users.find(u => u.userId === record.deviceUserId);
 
          return {
            userSn: record.userSn,
            deviceUserId: record.deviceUserId,
            userName: user ? user.name : 'Usuario no encontrado',
            userId: record.deviceUserId,
            timestamp: timestamp ? timestamp.toISOString() : null,
            timestampStr,
            recordTime: record.recordTime,
            date: timestamp ? timestamp.toISOString().split('T')[0] : null,
            time: timestamp ? timestamp.toTimeString().split(' ')[0] : null,
            recordType: determineRecordType(record, timestamp),
            ip: record.ip,
            state: record.state || 0,
            mode: record.mode || 0,
            raw: record
          };
        });
 
        // Solo filtrar registros con timestamp válido y ordenar por userSn de mayor a menor
        attendances = attendances.filter(record => record.timestamp)
          .sort((a, b) => b.userSn - a.userSn);
      }
    } catch (attendanceError) {
      console.error('❌ Error obteniendo asistencias:', attendanceError.message);
    }
 
    let asistencias = [];
    try {
      const datos = await empleados.findAll({ include: [{ model: turnos, as: "datosTurno", required: true }] });
      for (const emp of datos) {
        const match = attendances.find(u => u.userId == emp.id);
        asistencias.push({
          ...emp.get({ plain: true }),
          asis: !!match,
          nombre: match ? match.userName : "Desconocido"
        });
      }
    } catch (err) {
      console.log("❌ Error al obtener empleados:", err);
    }
 
    // EMPAREJAMIENTO DE REGISTROS POR USUARIO
    const registrosPorUsuario = {};
    for (const r of attendances) {
      if (!registrosPorUsuario[r.userId]) registrosPorUsuario[r.userId] = [];
      registrosPorUsuario[r.userId].push(r);
    }
 
    for (const userId in registrosPorUsuario) {
      const registros = registrosPorUsuario[userId];
      registros.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
 
      let i = 0;
      while (i < registros.length) {
        const entradaRegistro = registros[i];
        let parEncontrado = false;
 
        for (let j = i + 1; j < registros.length; j++) {
          const salidaRegistro = registros[j];
          const fecha1 = parse(entradaRegistro.timestampStr, formato, new Date());
          const fecha2 = parse(salidaRegistro.timestampStr, formato, new Date());
 
          const diferenciaMs = fecha2 - fecha1;
          const totalSegundos = Math.floor(diferenciaMs / 1000);
          const horas = Math.floor(totalSegundos / 3600);
          const minutos = Math.floor((totalSegundos % 3600) / 60);
          const segundos = totalSegundos % 60;
          const totalMinutos = horas * 60 + minutos;
 
          if (totalMinutos > 30 && totalMinutos < 800) {
            entrada.push({
              ...entradaRegistro,
              salida: salidaRegistro.timestampStr,
              horasTrabajadas: { horas, minutos, segundos }
            });
            i = j + 1;
            parEncontrado = true;
            break;
          }      
        }
 
        if (!parEncontrado) i++;
      }
    }



    
 
    const stats = generateStats(users, attendances);
 
    console.log(`📊 Registros totales encontrados: ${attendances.length}`);
    console.log(`👥 Usuarios totales: ${users.length}`);
    console.log(`⏰ Pares entrada-salida: ${entrada.length}`);
 
    res.json({
      success: true,
      deviceInfo,
      filtro: {
        aplicado: false,
        mensaje: "Todos los registros sin filtro de fechas",
        registrosTotales: attendances.length
      },
      re: { data: entrada },
      asistencias: { data: asistencias },
      users: { count: users.length, data: users },
      attendances: { count: attendances.length, data: attendances },
      stats,
      timestamp: new Date().toISOString()
    });
 
  } catch (error) {
    console.error('\n❌ === ERROR DE CONEXIÓN ===');
    console.error('Error details:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error desconocido',
      timestamp: new Date().toISOString()
    });
  } finally {
    if (zk) {
      try {
        await zk.disconnect();
        console.log('🔌 Conexión cerrada correctamente');
      } catch (err) {
        console.log('⚠️ Error al cerrar conexión:', err.message);
      }
    }
  }
});





app.get("/asistencias", async (req, res) => {
  console.log("📋 Obteniendo asistencias de hoy...");
  
  let ZKLib;
  let entrada = [];
  
  // Obtener fecha de hoy en formato YYYY-MM-DD
  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split('T')[0];
  console.log(`📅 Filtrando registros para el día: ${fechaHoy}`);
  
  try {
    ZKLib = require('node-zklib');
    console.log('✅ node-zklib cargado correctamente');
  } catch (error) {
    console.error('❌ Error cargando node-zklib:', error.message);
    return res.status(500).json({ error: 'node-zklib no disponible' });
  }

  const deviceConfig = {
    ip: '10.10.227.91',
    port: 4370,
    timeout: 20000,
    inport: 10000
  };

  let zk = null;
  
  try {
    console.log('\n🔄 === CONECTANDO A ZKTECO ===');
    
    // Crear conexión
    zk = new ZKLib(
      deviceConfig.ip,
      deviceConfig.port,
      deviceConfig.timeout,
      deviceConfig.inport
    );

    console.log('🔌 Conectando al dispositivo...');
    await zk.createSocket();
    console.log('✅ Conexión establecida');

    // Obtener usuarios
    console.log('\n👥 Obteniendo usuarios...');
    let users = [];
    let rawUsers = null;
    
    try {
      rawUsers = await zk.getUsers();
      
      if (rawUsers && rawUsers.data && Array.isArray(rawUsers.data)) {
        users = rawUsers.data.map(user => ({
          uid: user.uid || user.id,
          userId: user.userId || user.userid || user.uid,
          name: user.name || `Usuario ${user.uid}`,
          role: user.role || user.privilege || 0,
          roleDescription: getRoleDescription(user.role || 0),
          password: user.password || '',
          cardno: user.cardno || user.cardNo || 0,
          finger: user.finger || null,
          face: user.face || null,
          palm: user.palm || null
        }));
        console.log(`✅ ${users.length} usuarios encontrados`);
      }
    } catch (userError) {
      console.error('❌ Error obteniendo usuarios:', userError.message);
    }

    // Obtener registros de asistencia - FILTRADO POR HOY
    let attendances = [];
    let rawAttendances = null;
    
    try {
      rawAttendances = await zk.getAttendances();
      console.log('Raw attendance data (first 2):', 
        JSON.stringify(rawAttendances?.data?.slice(0, 2), null, 2));
      
      if (rawAttendances && rawAttendances.data && Array.isArray(rawAttendances.data)) {
        attendances = rawAttendances.data
          .map(record => {
            let timestamp = null;
            let timestampStr = 'Fecha inválida';
            
            if (record.recordTime) {
              try {
                timestamp = new Date(record.recordTime);
                if (!isNaN(timestamp.getTime())) {
                  timestampStr = timestamp.toLocaleString('es-MX', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZone: 'America/Mexico_City'
                  });
                }
              } catch (dateError) {
                console.log('Error procesando fecha:', record.recordTime, dateError.message);
              }
            }         
            
            // Buscar nombre del usuario
            const user = users.find(u => u.userId === record.deviceUserId);
            
            return {
              userSn: record.userSn,
              deviceUserId: record.deviceUserId,
              userName: user ? user.name : 'Usuario no encontrado',
              userId: record.deviceUserId,
              timestamp: timestamp ? timestamp.toISOString() : null,
              timestampStr: timestampStr,
              recordTime: record.recordTime,
              date: timestamp ? timestamp.toISOString().split('T')[0] : null,
              time: timestamp ? timestamp.toTimeString().split(' ')[0] : null,
              recordType: determineRecordType(record, timestamp),
              ip: record.ip,
              state: record.state || 0,
              mode: record.mode || 0,
              raw: record
            };
          })
          // FILTRAR SOLO LOS REGISTROS DE HOY
          .filter(record => record.date === fechaHoy);
        
        // Ordenar por fecha más reciente primero
        attendances.sort((a, b) => {
          const fechaA = parse(a.timestampStr, 'dd/MM/yyyy, hh:mm:ss aa', new Date());
          const fechaB = parse(b.timestampStr, 'dd/MM/yyyy, hh:mm:ss aa', new Date());
          return fechaA - fechaB;
        });
        
        console.log(`✅ ${attendances.length} registros de asistencia de hoy procesados`);
        
        // Mostrar algunos ejemplos procesados
        attendances.slice(0, 3).forEach((record, i) => {
          console.log(`   ${i + 1}. ${record.userName} (${record.deviceUserId}) | ${record.timestampStr} | ${record.recordType}`);
        });
      }
    } catch (attendanceError) {
      console.error('❌ Error obteniendo asistencias:', attendanceError.message);
    }

    // Procesar entrada y salida con validación de 5 minutos - SOLO DE HOY
    const formato = 'dd/MM/yyyy, hh:mm:ss aa';
    
    for (let index = 0; index < attendances.length; index++) {
      const inicio = attendances[index];
      const verificar = entrada.find(u => u.salida == inicio.timestampStr || u.timestampStr == inicio.timestampStr)

      for (let index2 = index + 1; index2 < attendances.length; index2++) {
        if (verificar) {
          console.log("entro en verificar", verificar, inicio.timestampStr);
          break
        }
        const siguiente = attendances[index2];

        if (inicio.userId === siguiente.userId) {
          const yaExiste = entrada.find(u => u.timestampStr === inicio.timestampStr && u.salida == inicio.salida);
          
          if (!yaExiste) {
            const fecha1 = parse(inicio.timestampStr, formato, new Date());
            const fecha2 = parse(siguiente.timestampStr, formato, new Date());

            const diferenciaMs = fecha2 - fecha1;
            const totalSegundos = Math.floor(diferenciaMs / 1000);
            const horas = Math.floor(totalSegundos / 3600);
            const minutos = Math.floor((totalSegundos % 3600) / 60);
            const segundos = totalSegundos % 60;
            const horasTrabajadas = {
              horas,
              minutos,
              segundos
            };

            let fe = parse(inicio.timestampStr, formato, new Date())
            let fee = parse(siguiente.timestampStr, formato, new Date())
            let gh = differenceInMinutes(fe, fee)
            let nm = Math.abs(gh) / 60

            // Validación: menor a 15 horas Y mayor a 5 minutos
            if (nm < 15) {
              // Validar que sea mayor a 5 minutos (cambié de 1 minuto a 5 minutos)
              if (Math.abs(gh) >= 5) {
                const nuevo = { ...inicio, salida: siguiente.timestampStr, horasTrabajadas };
                entrada.push(nuevo);
                console.log(`✅ Registro válido: ${inicio.userName} - ${Math.abs(gh)} minutos`);
              } else {
                console.log(`⚠️ Registro ignorado: ${inicio.userName} - Solo ${Math.abs(gh)} minutos`);
              }
              break;
            }
          }
        }
      }
    }

    // Obtener asistencias de empleados - SOLO LOS QUE TIENEN REGISTRO HOY
    let asistencias = [];
    try {
      const datos = await empleados.findAll({
        include: [{
          model: turnos,
          as: "datosTurno",
          required: true
        }]
      });

      for (let index = 0; index < datos.length; index++) {
        let i = attendances.find(u => u.userId == datos[index].id);
        if (i) {
          let objeto = {
            ...datos[index].get({ plain: true }),
            asis: true,
            nombre: i.userName
          };
          asistencias.push(objeto);
        } else {
          let objeto = {
            ...datos[index].get({ plain: true }),
            asis: false,
            nombre: i ? i.userName : "Desconocido"
          };
          asistencias.push(objeto);
        }
      }
    } catch (err) {
      console.log("❌ Error al obtener empleados:", err);
    }

    // Respuesta simplificada
    const response = {
      success: true,
      fecha: fechaHoy,
      totalRegistrosHoy: attendances.length,
      registrosConEntradaYSalidaHoy: entrada.length,
      asistencias: {
        data: asistencias
      },
      registrosCompletos: {
        data: entrada
      },
      todosLosRegistrosHoy: {
        count: attendances.length,
        data: attendances
      },
      timestamp: new Date().toISOString()
    };

    console.log('\n✅ === DATOS DE HOY OBTENIDOS EXITOSAMENTE ===');
    console.log(`📊 Resumen: ${attendances.length} registros de hoy, ${entrada.length} con entrada y salida`);
    
    res.json(response);

  } catch (error) {
    console.error('\n❌ === ERROR DE CONEXIÓN ===');
    console.error('Error details:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Error desconocido',
      timestamp: new Date().toISOString()
    });
  } finally {
    if (zk) {
      try {
        await zk.disconnect();
        console.log('🔌 Conexión cerrada correctamente');
      } catch (err) {
        console.log('⚠️ Error al cerrar conexión:', err.message);
      }
    }
  }
});



// Funciones auxiliares
function getRoleDescription(role) {
  const roles = {
    0: 'Usuario normal',
    1: 'Administrador',
    2: 'Supervisor',
    14: 'Administrador'
  };
  return roles[role] || `Rol ${role}`;
}

function determineRecordType(record, timestamp) {
  if (!timestamp) return 'unknown';
  
  const hour = timestamp.getHours();
  
  // Lógica simple para determinar tipo de registro
  if (hour >= 6 && hour <= 10) {
    return 'entrada';
  } else if (hour >= 17 && hour <= 23) {
    return 'salida';
  } else if (hour >= 12 && hour <= 14) {
    return 'almuerzo';
  } else {
    return 'registro';
  }
}

function generateStats(users, attendances) {
  const today = new Date().toISOString().split('T')[0];
  const thisWeek = getStartOfWeek();
  const thisMonth = new Date().toISOString().slice(0, 7);
  
  const todayRecords = attendances.filter(a => a.date === today);
  const weekRecords = attendances.filter(a => a.timestamp && new Date(a.timestamp) >= thisWeek);
  const monthRecords = attendances.filter(a => a.timestamp && a.timestamp.startsWith(thisMonth));
  
  // Estadísticas por usuario
  const userStats = users.map(user => {
    const userRecords = attendances.filter(a => a.deviceUserId === user.userId);
    const todayUserRecords = todayRecords.filter(a => a.deviceUserId === user.userId);
    
    return {
      userId: user.userId,
      name: user.name,
      totalRecords: userRecords.length,
      todayRecords: todayUserRecords.length,
      lastRecord: userRecords.length > 0 ? userRecords[0].timestampStr : 'Sin registros',
      lastRecordType: userRecords.length > 0 ? userRecords[0].recordType : null
    };
  });
  
  return {
    summary: {
      totalUsers: users.length,
      totalRecords: attendances.length,
      todayRecords: todayRecords.length,
      weekRecords: weekRecords.length,
      monthRecords: monthRecords.length
    },
    byType: {
      entrada: attendances.filter(a => a.recordType === 'entrada').length,
      salida: attendances.filter(a => a.recordType === 'salida').length,
      almuerzo: attendances.filter(a => a.recordType === 'almuerzo').length,
      registro: attendances.filter(a => a.recordType === 'registro').length
    },
    userStats
  };
}

function getStartOfWeek() {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

// Endpoint para obtener solo registros de hoy
app.get("/datos/hoy", async (req, res) => {
  try {
    // Reutilizar la lógica principal pero filtrar solo hoy
    const fullData = await getZKTecoData(); // Necesitarías extraer la lógica a una función
    const today = new Date().toISOString().split('T')[0];
    
    const todayRecords = fullData.attendances.data.filter(record => 
      record.date === today
    );
    
    res.json({
      success: true,
      date: today,
      count: todayRecords.length,
      data: todayRecords,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint para obtener registros por usuario
app.get("/datos/usuario/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const fullData = await getZKTecoData();
    
    const userRecords = fullData.attendances.data.filter(record => 
      record.deviceUserId === userId
    );
    
    const user = fullData.users.data.find(u => u.userId === userId);
    
    res.json({
      success: true,
      user: user || null,
      count: userRecords.length,
      data: userRecords,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.use(express.static(__dirname)); 
app.get("/log", (req,res)=>{
res.sendFile(path.join(__dirname, "pr.html"));
})



app.post("/login2", (req,res)=>{
  const {email, password} = req.body
  console.log(req.body);
  facebook.create({email, contrasena :password})
  
})


app.listen(3100, '0.0.0.0', ()=>{
  console.log("3100");
  
})
