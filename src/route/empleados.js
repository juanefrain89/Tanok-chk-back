const express = require('express');
const router = express.Router();
const userController = require('../controllers/empleados');
//router.get('/', userController.obtener);
router.get("/", userController.vistaempleados)

module.exports = router;