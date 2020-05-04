const conexao = require('../infraestrutura/conexao')

conexao.all(`CREATE TABLE IF NOT EXISTS card (
    card_id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_class TEXT NOT NULL,
    card_style TEXT NOT NULL,
    card_text TEXT NOT NULL
);`, (err) => {
    if (err) {
        console.log("Erro na criação da tabela card: " + err)
    } else {
        conexao.all(`SELECT count(*) as quantidade FROM card;`, (err, resultado) => {
            if (err) {
                console.log("Erro ao verificar dados na card: " + err)
            } else {
                console.log('Avaliando existência de cards de teste')
                if (resultado[0].quantidade == 0) {
                    console.log('Cadastrando cards de teste')
                    conexao.all(`INSERT INTO card 
                        (card_class, 
                        card_style,
                        card_text) 
                    VALUES 
                        ('context', 
                        'z-index: 0; top: 67px; left: 163px; width: 836px; height: 348px;', 
                        'Event storming digital board');`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro de card: " + err)
                        }
                    })
                    conexao.all(`INSERT INTO card 
                        (card_class, 
                        card_style,
                        card_text) 
                    VALUES 
                        ('event', 
                        'z-index: 1; top: 136px; left: 179px;', 
                        'Event');`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro de card: " + err)
                        }
                    })
                    conexao.all(`INSERT INTO card 
                        (card_class, 
                        card_style,
                        card_text) 
                    VALUES 
                        ('command', 
                        'z-index: 2; top: 268px; left: 377px;', 
                        'Command');`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro de card: " + err)
                        }
                    })
                    conexao.all(`INSERT INTO card 
                        (card_class, 
                        card_style,
                        card_text) 
                    VALUES 
                        ('aggregate', 
                        'z-index: 3; top: 131px; left: 583px;', 
                        'Aggregate');`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro de card: " + err)
                        }
                    })
                    conexao.all(`INSERT INTO card 
                        (card_class, 
                        card_style,
                        card_text) 
                    VALUES 
                        ('condition', 
                        'z-index: 4; top: 269px; left: 786px;', 
                        'Condition');`, (err) => {
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
    lista(res) {
        const sql = `SELECT * FROM card;`

        conexao.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        });
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM card WHERE card_id=${id}`

        conexao.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado[0])
            }
        })
    }

    adiciona(card, res) {
        const sql = 'INSERT INTO card (card_class, card_style, card_text) VALUES (?, ?, ?)'

        conexao.all(sql, Object.values(card), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                conexao.all("SELECT seq FROM sqlite_sequence WHERE name = 'card';", (erro, resultado) => {
                    if (erro) {
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
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }

    exclui(id, res) {
        const sql = `DELETE FROM card WHERE card_id=${id}`

        conexao.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }
}

module.exports = new card