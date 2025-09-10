// src/database.js
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

module.exports = ({ config }) => {
  const sequelize = new Sequelize("organigrama", "root", "mexico.2025", config.options);
  
  const db = {
    sequelize,
    Sequelize,
    models: {}
  };

  const modelsDir = path.join(__dirname, 'models');
  
  if (fs.existsSync(modelsDir)) {
    fs.readdirSync(modelsDir).forEach(filename => {
      if (filename.endsWith('.js')) {
        const modelPath = path.join(modelsDir, filename);
        const model = require(modelPath)(sequelize, Sequelize.DataTypes);
        
        if (model && model.name) {
          db.models[model.name] = model;
          console.log(`Modelo cargado: ${model.name}`);
        }
      }
    });

    Object.keys(db.models).forEach(key => {
      if (db.models[key].associate) {
        db.models[key].associate(db.models);
      }
    });
    
    console.log(`Total de modelos cargados: ${Object.keys(db.models).length}`);
  } else {
    console.log('Directorio de modelos no encontrado:', modelsDir);
  }

  return db;
};