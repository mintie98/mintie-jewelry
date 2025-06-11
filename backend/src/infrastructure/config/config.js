require('dotenv').config();

module.exports = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'Jewelry',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  port: process.env.PORT || 5001
};
