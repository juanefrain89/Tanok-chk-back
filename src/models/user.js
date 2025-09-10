module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define('Login', {
    correo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    contraseña:{
       type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    rol:{
        type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
     departamento : {
          type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'usuarios',
    timestamps: false  
  });

  return Login;
};
