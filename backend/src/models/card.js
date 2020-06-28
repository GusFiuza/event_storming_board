const conection = require('../infraestrutura/conection')

conection.all(`CREATE TABLE IF NOT EXISTS card (
            card_id INTEGER PRIMARY KEY AUTOINCREMENT,
            card_class TEXT NOT NULL,
            card_style TEXT NOT NULL,
            card_text TEXT NOT NULL,
            board_id INTEGER NOT NULL,
            card_check BOOLEAN NOT NULL);`, (err) => {
    if (err) console.log("Erro na criação da tabela card: " + err.message)
})

class card {
    create(card, res) {
        const sql = 'INSERT INTO card (card_class, card_style, card_text, board_id, card_check) VALUES (?, ?, ?, ?, ?)'
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

    read(board, res) {
        let sql = ''
        if (board != null) {
            sql = `SELECT * FROM card where board_id = ${board};`
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
