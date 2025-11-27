require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db')

const authRoutes = require('./routes/auth')
const machinesRoutes = require('./routes/machines')
const maintRoutes = require('./routes/maintenances')
const usersRoutes = require('./routes/users') // <--- NOVO
const authController = require('./controllers/authController')

const app = express()

app.use(cors())
app.use(bodyParser.json())

authController.seedAdminIfMissing(db)

app.use('/api/auth', authRoutes)
app.use('/api/machines', machinesRoutes)
app.use('/api/maintenances', maintRoutes)
app.use('/api/users', usersRoutes) // <--- NOVO

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`)
})
