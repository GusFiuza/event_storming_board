const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('dados.db')

process.on('SIGINT', () =>
database.close(() => {
        console.log('Banco de dados encerrado!')
        process.exit(0);
    })
)

module.exports = database