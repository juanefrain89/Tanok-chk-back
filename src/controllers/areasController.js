const { log } = require("zkteco-js/src/logs/log");
const { areasModel, departamentos } = require("../models");

module.exports = {
    obtener: (req, res) => {
        departamentos.findAll({})
            .then((b) => {
            
                res.status(200).json({ datos: b });
            })
            .catch((error) => {
                console.log(error);
                
             res.send("mal")
            });
    }
};
