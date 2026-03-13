const database = require('../config/database');
const logger = require('../utils/logger');

class Contact {
  static create(contactData) {
    return new Promise((resolve, reject) => {
      const { name, email, message, ip_address, user_agent } = contactData;
      
      const query = `
        INSERT INTO contacts (name, email, message, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
      `;

      database.getDb().run(query, [name, email, message, ip_address, user_agent], function(err) {
        if (err) {
          logger.error('Error creating contact:', err);
          reject(err);
        } else {
          logger.info(`New contact message saved with ID: ${this.lastID}`);
          resolve({ 
            id: this.lastID,
            success: true,
            message: '메시지가 성공적으로 전송되었습니다.'
          });
        }
      });
    });
  }

  static getAll(limit = 50, offset = 0) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id, name, email, message, is_read, created_at
        FROM contacts 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;

      database.getDb().all(query, [limit, offset], (err, rows) => {
        if (err) {
          logger.error('Error fetching contacts:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static markAsRead(id) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE contacts 
        SET is_read = 1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;

      database.getDb().run(query, [id], function(err) {
        if (err) {
          logger.error('Error updating contact:', err);
          reject(err);
        } else {
          resolve({ success: true, changes: this.changes });
        }
      });
    });
  }

  static getStats() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN is_read = 0 THEN 1 END) as unread,
          COUNT(CASE WHEN date(created_at) = date('now') THEN 1 END) as today
        FROM contacts
      `;

      database.getDb().get(query, (err, row) => {
        if (err) {
          logger.error('Error getting contact stats:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = Contact;