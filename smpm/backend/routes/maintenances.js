const express = require('express');
const router = express.Router();
const controller = require('../controllers/maintController');
const { ensureAuth } = require('../utils/auth');

// GET /api/maintenances
router.get('/', controller.list);

// GET /api/maintenances/:id
router.get('/:id', controller.getById);

// POST /api/maintenances
router.post('/', ensureAuth, controller.create);

// PUT /api/maintenances/:id
router.put('/:id', ensureAuth, controller.update);

// DELETE /api/maintenances/:id
router.delete('/:id', ensureAuth, controller.remove);

module.exports = router;
