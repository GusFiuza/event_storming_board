const conexao = require('../infraestrutura/conexao')

conexao.all(`CREATE TABLE IF NOT EXISTS board (
    board_id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_name TEXT NOT NULL);`, (err) => {
    if (err) {
        console.log("Erro na criação da tabela board: " + err)
    } else {
        console.log('Tabela board criada com sucesso')
        conexao.all(`SELECT count(*) as quantidade FROM board;`, (err, resultado) => {
            if (err) {
                console.log("Erro ao verificar dados na board: " + err)
            } else {
                console.log('Avaliando existência de boards de teste')
                if (resultado[0].quantidade == 0) {
                    console.log('Cadastrando board inicial')
                    conexao.all(`INSERT INTO board (board_name) VALUES ('quadro');`, (err) => {
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
    lista(res) {
        const sql = `SELECT * FROM board;`

        conexao.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        });
    }

    buscaPorId(id, res) {
        const sql = `SELECT board_name FROM board WHERE board_id=${id}`

        conexao.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado[0])
            }
        })
    }

    adiciona(parm, res) {
        const sql = 'INSERT INTO board (board_name) VALUES (?);'

        conexao.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                conexao.all("SELECT seq FROM sqlite_sequence WHERE name = 'board';", (erro, resultado) => {
                    if (erro) {
                        res.status(400).json(erro)
                    } else {
                        res.status(201).json(resultado[0].seq)
                    }
                })
            }
        })
    }

    altera(id, parm, res) {
        const sql = `UPDATE board SET board_name = ? WHERE board_id = ${id}`

        conexao.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }

    exclui(id, res) {
        const sql = `DELETE FROM board WHERE board_id=${id}`

        conexao.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }
}

module.exports = new board