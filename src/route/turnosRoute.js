const express = require('express');
const turnosController = require('../controllers/turnosController');
const router = express.Router();
router.get("/", turnosController.obtenerTurnos)

module.exports  = router