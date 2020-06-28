const conection = require('../infraestrutura/conection')

conection.all(`CREATE TABLE IF NOT EXISTS room (
            room_id INTEGER PRIMARY KEY,
            room_owner TEXT NOT NULL);`, (err) => {
    if (err) console.log("Erro na criação da tabela room: " + err.message)
})

class room {
    create(parm, res) {
        const sql = 'INSERT INTO room (room_id, room_owner) VALUES (?, ?);'
        conection.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(resultado)
            }
        })
    }

    read(owner, res) {
        let sql = ''
        if (owner != null) {
            sql = `SELECT room_id FROM room WHERE room_owner='${owner}'`
        } else {
            sql = `SELECT * FROM room;`
        }
        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        });
    }

    readById(id, res) {
        const sql = `SELECT room_owner FROM room WHERE room_id=${id}`
        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado[0])
            }
        })
    }

    update(id, parm, res) {
        const sql = `UPDATE room SET room_owner = ? WHERE room_id = ${id}`
        conection.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }

    delete(id, res) {
        const sql = `DELETE FROM room WHERE room_id=${id}`
        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }
}

module.exports = new room
