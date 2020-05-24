const conexao = require('../infraestrutura/conexao')

conexao.all(`CREATE TABLE IF NOT EXISTS parm (
    parm_id INTEGER PRIMARY KEY, 
    parm_value FLOAT NOT NULL);`, (err) => {
    if (err) {
        console.log("Erro na criação da tabela parm: " + err)
    } else {
        conexao.all(`SELECT count(*) as quantidade FROM parm;`, (err, resultado) => {
            if (err) {
                console.log("Erro ao verificar dados na parm: " + err)
            } else {
                console.log('Avaliando existência de parâmetros')
                if (resultado[0].quantidade == 0) {
                    console.log('Cadastrando parâmetros iniciais')
                    conexao.all(`INSERT INTO parm
                        (parm_id, parm_value)
                    VALUES
                        (1, 1);`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro do parâmetro 1: " + err)
                        }
                    })
                    conexao.all(`INSERT INTO parm
                        (parm_id, parm_value)
                    VALUES
                        (2, 1);`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro do parâmetro 2: " + err)
                        }
                    })
                    conexao.all(`INSERT INTO parm
                        (parm_id, parm_value)
                    VALUES
                        (3, 1);`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro do parâmetro 3: " + err)
                        }
                    })
                    conexao.all(`INSERT INTO parm
                        (parm_id, parm_value)
                    VALUES
                        (4, 1);`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro do parâmetro 4: " + err)
                        }
                    })
                }
            }
        })

    }
})

class parm {
    lista(res) {
        const sql = `SELECT * FROM parm;`

        conexao.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        });
    }

    buscaPorId(id, res) {
        const sql = `SELECT parm_value FROM parm WHERE parm_id=${id}`

        conexao.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado[0].parm_value)
            }
        })
    }

    adiciona(parm, res) {
        const sql = 'INSERT INTO parm (parm_id, parm_value) VALUES (?, ?)'

        conexao.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(resultado)
            }
        })
    }

    altera(id, parm, res) {
        const sql = `UPDATE parm SET parm_value = ? WHERE parm_id = ${id}`

        conexao.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }

    exclui(id, res) {
        const sql = `DELETE FROM parm WHERE parm_id=${id}`

        conexao.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }
}

module.exports = new parm