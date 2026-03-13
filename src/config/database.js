const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../utils/logger');

const DB_PATH = path.join(__dirname, '../../data/website.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        logger.error('Database connection error:', err);
      } else {
        logger.info('Connected to SQLite database');
        this.initTables();
      }
    });
  }

  initTables() {
    // 연락처 메시지 테이블 생성
    const createContactsTable = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 방문자 통계 테이블 (Phase 2용)
    const createVisitsTable = `
      CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT,
        user_agent TEXT,
        referer TEXT,
        page_path TEXT,
        visit_date DATE DEFAULT CURRENT_DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createContactsTable, (err) => {
      if (err) logger.error('Error creating contacts table:', err);
      else logger.info('Contacts table ready');
    });

    this.db.run(createVisitsTable, (err) => {
      if (err) logger.error('Error creating visits table:', err);
      else logger.info('Visits table ready');
    });
  }

  getDb() {
    return this.db;
  }

  close() {
    this.db.close();
  }
}

module.exports = new Database();