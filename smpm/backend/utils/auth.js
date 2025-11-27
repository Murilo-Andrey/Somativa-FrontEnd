const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

exports.ensureAuth = (req, res, next) => {
  const header = req.headers.authorization

  if (!header) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  const parts = header.split(' ')
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token inválido' })
  }

  const token = parts[1]

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    req.user = decoded
    return next()
  })
}

exports.ensureAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores.' })
  }
  next()
}
