// models/Asistencia.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Asistencia = sequelize.define("Asistencia", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userSn: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'user_sn'
        },
        deviceUserId: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'device_user_id'
        },
        userName: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'user_name'
        },
        userId: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'user_id'
        },
        salida :{
 type: DataTypes.STRING,
 allowNull : true
        },
        horas_trabajadas:{
            type : DataTypes.JSON,
            allowNull : true
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: true
        },
        timestampStr: {
            type: DataTypes.STRING(255),
            field: 'timestamp_str'
        },
        recordTime: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'record_time'
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        time: {
            type: DataTypes.TIME,
            allowNull: true
        },
        recordType: {
            type: DataTypes.ENUM('entrada', 'salida', 'almuerzo', 'registro'),
            allowNull: true,
            field: 'record_type'
        },
        ip: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        state: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        mode: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        rawData: {
            type: DataTypes.JSON,
            field: 'raw_data'
        }
    }, {
        tableName: 'asistencias',
        timestamps: false, // Cambiado para seguir tu patrón
        indexes: [
            { fields: ['user_id'] },
            { fields: ['date'] },
            { fields: ['record_type'] },
            { fields: ['user_sn'] },
            { fields: ['timestamp'] }
        ]
    });

    // Asociaciones si las necesitas en el futuro
    Asistencia.associate = (models) => {
        // Ejemplo: si quieres relacionar con empleados
        // Asistencia.belongsTo(models.empleados, {
        //     foreignKey: 'userId',
        //     targetKey: 'id',
        //     as: 'empleado'
        // });
    };

    return Asistencia;
};