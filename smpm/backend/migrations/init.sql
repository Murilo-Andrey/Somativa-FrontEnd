PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS machines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sector TEXT,
  status TEXT DEFAULT 'operacional',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  machine_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at DATETIME,
  performed_at DATETIME,
  status TEXT DEFAULT 'programada',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(machine_id) REFERENCES machines(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_maint_machine ON maintenances(machine_id);
CREATE INDEX IF NOT EXISTS idx_maint_scheduled ON maintenances(scheduled_at);
