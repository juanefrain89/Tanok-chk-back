const { DataTypes } = require("sequelize")
const empleados = require("./empleados")

module.exports = (sequelize) =>{
    const vacacionesModel = sequelize.define("vacacionesModel",{
id :{
      type: DataTypes.INTEGER,
          primaryKey: true
},
deviceUserId :{
    type : DataTypes.INTEGER,
    allowNull : false
},
recordTime :{
    type : DataTypes.DATE,
    allowNull : false
},
descripcion :{
      type : DataTypes.STRING,
    allowNull : true
}

    },{
            tableName: 'vacaciones',
    timestamps: false  
    })



    return vacacionesModel
}

