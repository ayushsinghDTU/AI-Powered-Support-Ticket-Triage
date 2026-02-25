const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "tickets.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    urgency INTEGER NOT NULL,
    keywords TEXT NOT NULL,
    confidence REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

function insertTicket(ticket) {
  const stmt = db.prepare(`
    INSERT INTO tickets (message, category, priority, urgency, keywords, confidence)
    VALUES (@message, @category, @priority, @urgency, @keywords, @confidence)
  `);

  const result = stmt.run({
    message: ticket.message,
    category: ticket.category,
    priority: ticket.priority,
    urgency: ticket.urgency ? 1 : 0,
    keywords: ticket.keywords.join(","),
    confidence: ticket.confidence
  });

  return result.lastInsertRowid;
}

function getTickets() {
  const stmt = db.prepare("SELECT * FROM tickets ORDER BY id DESC");
  const rows = stmt.all();

  return rows.map((row) => ({
    ...row,
    urgency: Boolean(row.urgency),
    keywords: row.keywords ? row.keywords.split(",").filter(Boolean) : []
  }));
}

module.exports = {
  insertTicket,
  getTickets
};
