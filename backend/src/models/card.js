const conexao = require('../infraestrutura/conexao')

class card {
    lista(res) {
        const sql = `SELECT * FROM card;`

        conexao.all(sql, (erro, resultado) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        });
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM card WHERE card_id=${id}`

        conexao.all(sql, (erro, resultado) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado[0])
            }
        })
    }
    
    adiciona(card, res) {
        const sql = 'INSERT INTO card (card_class, card_style, card_text) VALUES (?, ?, ?)'

        conexao.all(sql, Object.values(card), (erro, resultado) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                conexao.all("SELECT seq FROM sqlite_sequence WHERE name = 'card';", (erro, resultado) => {
                    if(erro) {
                        res.status(400).json(erro)
                    } else {
                        res.status(201).json(resultado[0])
                    }
                })
            }
        })  
    }    

    altera(id, card, res) {
        const sql = `UPDATE card SET card_class = ?, card_style = ?, card_text = ? WHERE card_id = ${id}`

        conexao.all(sql, Object.values(card), (erro, resultado) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }

    exclui(id, res) {
        const sql = `DELETE FROM card WHERE card_id=${id}`

        conexao.all(sql, (erro, resultado) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }
}

module.exports = new card