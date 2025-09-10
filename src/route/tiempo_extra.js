const express = require('express');
const router = express.Router();
const userController = require('../controllers/tiempo_extra');
router.post('/', userController.obtener);
router.post("/2", userController.add)
module.exports = router;