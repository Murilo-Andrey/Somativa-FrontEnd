const db = require('../db');

exports.list = (req, res) => {
  const { machine_id, status, from, to, q } = req.query;

  let sql = `
    SELECT
      m.*,
      machines.name AS machine_name
    FROM maintenances m
    JOIN machines ON m.machine_id = machines.id
    WHERE 1 = 1
  `;
  const params = [];

  if (machine_id) {
    sql += ' AND m.machine_id = ?';
    params.push(machine_id);
  }

  if (status) {
    sql += ' AND m.status = ?';
    params.push(status);
  }

  if (from) {
    sql += ' AND datetime(m.scheduled_at) >= datetime(?)';
    params.push(from);
  }

  if (to) {
    sql += ' AND datetime(m.scheduled_at) <= datetime(?)';
    params.push(to);
  }

  if (q) {
    sql += ' AND (m.title LIKE ? OR m.description LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }

  sql += ' ORDER BY m.scheduled_at DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json(rows);
  });
};

exports.getById = (req, res) => {
  const sql = `
    SELECT
      m.*,
      machines.name AS machine_name
    FROM maintenances m
    JOIN machines ON m.machine_id = machines.id
    WHERE m.id = ?
  `;

  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Manutenção não encontrada' });
    }
    return res.json(row);
  });
};

exports.create = (req, res) => {
  const { machine_id, title, description, scheduled_at } = req.body;

  // agora os 3 são obrigatórios
  if (!machine_id || !title || !scheduled_at) {
    return res.status(400).json({
      error: 'machine_id, title e scheduled_at são obrigatórios'
    });
  }

  // ⛔ BLOQUEIO DE DATA/HORÁRIO PASSADO
  const now = new Date();
  const chosen = new Date(scheduled_at);

  if (chosen < now) {
    return res.status(400).json({
      error: 'Não é permitido agendar manutenções em datas/horários que já passaram.'
    });
  }

  const stmt = `
    INSERT INTO maintenances (machine_id, title, description, scheduled_at, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    stmt,
    [machine_id, title, description || null, scheduled_at, 'programada'],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const sql = `
        SELECT
          m.*,
          machines.name AS machine_name
        FROM maintenances m
        JOIN machines ON m.machine_id = machines.id
        WHERE m.id = ?
      `;

      db.get(sql, [this.lastID], (e, row) => {
        if (e) {
          return res.status(500).json({ error: e.message });
        }
        return res.status(201).json(row);
      });
    }
  );
};



exports.update = (req, res) => {
  const { machine_id, title, description, scheduled_at, status } = req.body;

  const stmt = `
    UPDATE maintenances
    SET
      machine_id   = COALESCE(?, machine_id),
      title        = COALESCE(?, title),
      description  = COALESCE(?, description),
      scheduled_at = COALESCE(?, scheduled_at),
      status       = COALESCE(?, status)
    WHERE id = ?
  `;

  db.run(
    stmt,
    [machine_id, title, description, scheduled_at, status, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.get(
        'SELECT * FROM maintenances WHERE id = ?',
        [req.params.id],
        (e, row) => {
          if (e) {
            return res.status(500).json({ error: e.message });
          }
          if (!row) {
            return res.status(404).json({ error: 'Manutenção não encontrada' });
          }
          return res.json(row);
        }
      );
    }
  );
};

exports.remove = (req, res) => {
  db.run(
    'DELETE FROM maintenances WHERE id = ?',
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(204).send();
    }
  );
};
