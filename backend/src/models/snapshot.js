const conexao = require('../infraestrutura/conexao')

conexao.all(`CREATE TABLE IF NOT EXISTS snapshot (
    snap_id INTEGER PRIMARY KEY,
    snap_name TEXT NOT NULL,
    snap_timestamp TEXT NOT NULL);`, (err) => {
    if (err) {
        console.log("Erro na criação da tabela snapshot: " + err)
    } else {
        conexao.all(`SELECT count(*) as quantidade FROM snapshot;`, (err, resultado) => {
            if (err) {
                console.log("Erro ao verificar dados na snapshot: " + err)
            } else {
                console.log('Avaliando existência de snapshot')
                if (resultado[0].quantidade == 0) {
                    console.log('Cadastrando snapshot de exemplo')
                    conexao.all(`INSERT INTO snapshot
                        (snap_id, snap_name, snap_timestamp)
                    VALUES
                        (1, "O fim dos tempos", "9999-12-31 23:59:59");`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro do snapshot: " + err)
                        }
                    })
                }
            }
        })

    }
})

class snapshot {
    lista(res) {
        const sql = `SELECT * FROM snapshot;`

        conexao.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        });
    }

    buscaPorId(id, res) {
        const sql = `SELECT snap_name, snap_timestamp FROM snapshot WHERE snap_id=${id}`

        conexao.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado[0])
            }
        })
    }

    adiciona(parm, res) {
        const sql = 'INSERT INTO snapshot (snap_id, snap_name, snap_timestamp) VALUES (?, ?, datetime("now"))'

        conexao.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(resultado)
            }
        })
    }

    altera(id, parm, res) {
        const sql = `UPDATE snapshot SET snap_name = ?, snap_timestamp = ? WHERE snap_id = ${id}`

        conexao.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }

    exclui(id, res) {
        const sql = `DELETE FROM snapshot WHERE snap_id=${id}`

        conexao.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }
}

module.exports = new snapshot