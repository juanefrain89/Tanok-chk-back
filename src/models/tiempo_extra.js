

module.exports = (sequelize, DataType)=>{
    const tiempo_extra = sequelize.define("tiempo_extra",{
        fecha :{
            type : DataType.DATE,
            allowNull : false
        },
        id_empleado :{
                type : DataType.INTEGER,
            allowNull : false
        },
        horas :{
             type : DataType.FLOAT,
              allowNull : false
            
        }
    },{
         timestamps: false,
    tableName: "tiempo_extra",

    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
    
   // primaryKey: false,
    hasPrimaryKeys: false
    })
    
  return tiempo_extra;
}