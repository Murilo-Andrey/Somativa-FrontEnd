// backend/routes/users.js
const express = require('express')
const router = express.Router()
const controller = require('../controllers/usersController')
const { ensureAuth, ensureAdmin } = require('../utils/auth')

// todas as rotas daqui são protegidas
router.get('/', ensureAuth, ensureAdmin, controller.list)
router.post('/', ensureAuth, ensureAdmin, controller.create)
router.delete('/:id', ensureAuth, ensureAdmin, controller.remove)

module.exports = router
