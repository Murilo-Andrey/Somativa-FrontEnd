// backend/controllers/usersController.js
const db = require('../db')
const bcrypt = require('bcryptjs')

// lista todos os usuários (apenas admin)
exports.list = (req, res) => {
  db.all('SELECT id, username, role FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    return res.json(rows)
  })
}

// cria novo usuário (apenas admin)
exports.create = async (req, res) => {
  const { username, password, role } = req.body

  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ error: 'username, password e role são obrigatórios.' })
  }

  // regra: se não for admin, precisa ser Gmail
  if (role !== 'admin' && !username.endsWith('@gmail.com')) {
    return res
      .status(400)
      .json({ error: 'Usuários não-admin devem usar e-mail Gmail.' })
  }

  db.get(
    'SELECT id FROM users WHERE username = ?',
    [username],
    async (err, existing) => {
      if (err) return res.status(500).json({ error: err.message })
      if (existing) {
        return res.status(400).json({ error: 'Usuário já existente.' })
      }

      try {
        const hash = await bcrypt.hash(password, 10)
        db.run(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          [username, hash, role],
          function (e) {
            if (e) return res.status(500).json({ error: e.message })

            db.get(
              'SELECT id, username, role FROM users WHERE id = ?',
              [this.lastID],
              (e2, user) => {
                if (e2) return res.status(500).json({ error: e2.message })
                return res.status(201).json(user)
              }
            )
          }
        )
      } catch (e) {
        return res.status(500).json({ error: e.message })
      }
    }
  )
}

// excluir usuário (apenas admin)
exports.remove = (req, res) => {
  const { id } = req.params

  // não permitir que o admin delete ele mesmo pelo menos aqui (opcional)
  if (Number(id) === req.user?.id) {
    return res
      .status(400)
      .json({ error: 'Você não pode excluir o próprio usuário logado.' })
  }

  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' })
    }
    return res.json({ success: true })
  })
}
