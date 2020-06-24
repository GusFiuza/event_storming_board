const conection = require('../infraestrutura/conection')

conection.all(`CREATE TABLE IF NOT EXISTS card (
            card_id INTEGER PRIMARY KEY AUTOINCREMENT,
            card_class TEXT NOT NULL,
            card_style TEXT NOT NULL,
            card_text TEXT NOT NULL,
            last_change TEXT NOT NULL,
            board_id INTEGER NOT NULL,
            card_check BOOLEAN NOT NULL);`, (err) => {
    if (err) {
        console.log("Erro na criação da tabela card: " + err)
    } else {
        conection.all(`SELECT count(*) as quantidade FROM card;`, (err, resultado) => {
            if (err) {
                console.log("Erro ao verificar dados na card: " + err)
            } else {
                if (resultado[0].quantidade == 0) {
                    conection.all(`INSERT INTO card
                        (card_class, card_style, card_text, last_change, board_id, card_check) 
                    VALUES 
                        ('context', 
                        'z-index: 0; top: 67px; left: 163px; width: 836px; height: 348px;', 
                        'Event storming digital board', datetime('now'), 1, 0);`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro de card: " + err)
                        }
                    })
                    conection.all(`INSERT INTO card 
                        (card_class, card_style, card_text, last_change, board_id, card_check) 
                    VALUES 
                        ('event', 
                        'z-index: 1; top: 136px; left: 179px;', 
                        'Event', datetime('now'), 1, 0);`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro de card: " + err)
                        }
                    })
                    conection.all(`INSERT INTO card 
                        (card_class, card_style, card_text, last_change, board_id, card_check) 
                    VALUES 
                        ('command', 
                        'z-index: 2; top: 268px; left: 377px;', 
                        'Command', datetime('now'), 1, 0);`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro de card: " + err)
                        }
                    })
                    conection.all(`INSERT INTO card 
                        (card_class, card_style, card_text, last_change, board_id, card_check)
                    VALUES 
                        ('aggregate', 
                        'z-index: 3; top: 131px; left: 583px;', 
                        'Aggregate', datetime('now'), 1, 0);`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro de card: " + err)
                        }
                    })
                    conection.all(`INSERT INTO card 
                        (card_class, card_style, card_text, last_change, board_id, card_check) 
                    VALUES 
                        ('condition', 
                        'z-index: 4; top: 269px; left: 786px;', 
                        'Condition', datetime('now'), 1, 0);`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro de card: " + err)
                        }
                    })
                }
            }
        })

    }
})

class card {
    create(card, res) {
        const sql = 'INSERT INTO card (card_class, card_style, card_text, last_change, board_id, card_check) VALUES (?, ?, ?, datetime("now"), ?, ?)'
        conection.all(sql, Object.values(card), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                conection.all("SELECT seq FROM sqlite_sequence WHERE name = 'card';", (erro, resultado) => {
                    if (erro) {
                        res.status(400).json(erro)
                    } else {
                        res.status(201).json(resultado[0].seq)
                    }
                })
            }
        })
    }

    read(board, time, res) {
        let sql = ''
        if (board != null) {
            sql = `SELECT * FROM card where board_id = ${board} AND last_change <="${time}";`
        } else {
            sql = `SELECT * FROM card;`
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
        const sql = `SELECT * FROM card WHERE card_id=${id}`
        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado[0])
            }
        })
    }

    update(id, card, res) {
        const sql = `UPDATE card SET card_class = ?, card_style = ?, card_text = ?, board_id = ?, card_check = ? WHERE card_id = ${id}`
        conection.all(sql, Object.values(card), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }

    delete(boardId, cardId, res) {
        let sql = ''
        if (boardId != null) {
            sql = `DELETE FROM card WHERE board_id=${boardId}`
        } else {
            sql = `DELETE FROM card WHERE card_id=${cardId}`
        }
        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }
}

module.exports = new card
