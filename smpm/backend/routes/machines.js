const express = require('express');
const router = express.Router();
const controller = require('../controllers/machinesController');
const { ensureAuth } = require('../utils/auth');

// GET /api/machines
router.get('/', controller.list);

// GET /api/machines/:id
router.get('/:id', controller.getById);

// POST /api/machines
router.post('/', ensureAuth, controller.create);

// PUT /api/machines/:id
router.put('/:id', ensureAuth, controller.update);

// DELETE /api/machines/:id
router.delete('/:id', ensureAuth, controller.remove);

module.exports = router;
