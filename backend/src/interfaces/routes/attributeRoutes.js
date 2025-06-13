const express = require('express');
const router = express.Router();
const attributeController = require('../controllers/attributeController');

// GET /api/attributes
router.get('/', attributeController.getAllAttributes);

module.exports = router; 