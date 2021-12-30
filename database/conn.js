const mysql = require('mysql');
const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'solana_db',
    charset: 'utf8mb4'
});

try {
    conn.connect()
    console.log('Database connected.')
}
catch (e) {
    console.log(e)
}

module.exports = conn
