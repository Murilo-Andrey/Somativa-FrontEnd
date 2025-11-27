const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2d';

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username e password obrigatórios' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      try {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        return res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        });
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    }
  );
};

// chamada em server.js: authController.seedAdminIfMissing(db);
exports.seedAdminIfMissing = async (dbInstance) => {
  const adminUser = 'admin';
  const defaultPassword = 'admin123';

  dbInstance.get('SELECT COUNT(*) as count FROM users', [], async (err, row) => {
    if (err) {
      console.error('Erro contagem usuários', err);
      return;
    }

    if (row.count === 0) {
      try {
        const hash = await bcrypt.hash(defaultPassword, 10);
        dbInstance.run(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          [adminUser, hash, 'admin'],
          (e) => {
            if (e) {
              console.error('Erro ao inserir admin', e);
            } else {
              console.log('Usuário admin criado: admin / admin123');
            }
          }
        );
      } catch (e) {
        console.error('Erro ao gerar hash do admin', e);
      }
    } else {
      console.log('Usuários já existem, não foi criado admin.');
    }
  });
};
