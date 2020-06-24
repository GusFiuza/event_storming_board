const conection = require('../infraestrutura/conection')

conection.all(`CREATE TABLE IF NOT EXISTS board (
            board_id INTEGER PRIMARY KEY AUTOINCREMENT,
            board_name TEXT NOT NULL);`, (err) => {
    if (err) {
        console.log("Erro na criação da tabela board: " + err)
    } else {
        conection.all(`SELECT count(*) as quantidade FROM board;`, (err, resultado) => {
            if (err) {
                console.log("Erro ao verificar dados na board: " + err)
            } else {
                if (resultado[0].quantidade == 0) {
                    conection.all(`INSERT INTO board (board_name) VALUES ('Quadro 1');`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro de board: " + err)
                        }
                    })
                }
            }
        })
    }
})

class board {
    create(parm, res) {
        const sql = 'INSERT INTO board (board_name) VALUES (?);'
        conection.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                conection.all("SELECT seq FROM sqlite_sequence WHERE name = 'board';", (erro, resultado) => {
                    if (erro) {
                        res.status(400).json(erro)
                    } else {
                        res.status(201).json(resultado[0].seq)
                    }
                })
            }
        })
    }

    read(res) {
        const sql = `SELECT * FROM board;`
        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        });
    }

    readById(id, res) {
        const sql = `SELECT board_name FROM board WHERE board_id=${id}`
        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado[0])
            }
        })
    }

    update(id, parm, res) {
        const sql = `UPDATE board SET board_name = ? WHERE board_id = ${id}`
        conection.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }

    delete(id, res) {
        const sql = `DELETE FROM board WHERE board_id=${id}`
        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }
}

module.exports = new board
