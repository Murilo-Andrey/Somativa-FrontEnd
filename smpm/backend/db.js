const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DATABASE_FILE || './data/smpm.db';
const dir = path.dirname(dbFile);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new sqlite3.Database(dbFile);

// run migrations
const initSql = fs.readFileSync(path.join(__dirname, 'migrations', 'init.sql'), 'utf8');
db.serialize(() => {
  db.exec(initSql, (err) => {
    if (err) {
      console.error('Erro ao inicializar DB:', err);
    } else {
      console.log('Banco inicializado / verificado.');
    }
  });
});

module.exports = db;
