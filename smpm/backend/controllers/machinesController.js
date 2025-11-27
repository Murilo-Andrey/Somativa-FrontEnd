const db = require('../db');

exports.list = (req, res) => {
  const { sector, status, q } = req.query;

  let sql = 'SELECT * FROM machines WHERE 1=1';
  const params = [];

  if (sector) {
    sql += ' AND sector = ?';
    params.push(sector);
  }

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (q) {
    sql += ' AND name LIKE ?';
    params.push(`%${q}%`);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json(rows);
  });
};

exports.getById = (req, res) => {
  db.get(
    'SELECT * FROM machines WHERE id = ?',
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Máquina não encontrada' });
      }
      return res.json(row);
    }
  );
};

exports.create = (req, res) => {
  const { name, sector, status } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome obrigatório' });
  }

  db.run(
    'INSERT INTO machines (name, sector, status) VALUES (?, ?, ?)',
    [name, sector || null, status || 'operacional'],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.get(
        'SELECT * FROM machines WHERE id = ?',
        [this.lastID],
        (e, row) => {
          if (e) {
            return res.status(500).json({ error: e.message });
          }
          return res.status(201).json(row);
        }
      );
    }
  );
};

exports.update = (req, res) => {
  const { name, sector, status } = req.body;

  db.run(
    'UPDATE machines SET name = COALESCE(?, name), sector = COALESCE(?, sector), status = COALESCE(?, status) WHERE id = ?',
    [name, sector, status, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.get(
        'SELECT * FROM machines WHERE id = ?',
        [req.params.id],
        (e, row) => {
          if (e) {
            return res.status(500).json({ error: e.message });
          }
          if (!row) {
            return res.status(404).json({ error: 'Máquina não encontrada' });
          }
          return res.json(row);
        }
      );
    }
  );
};

exports.remove = (req, res) => {
  db.run(
    'DELETE FROM machines WHERE id = ?',
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(204).send();
    }
  );
};
