const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    uri: process.env.TIDB_URL,
    ssl: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

module.exports = pool;
