const conexao = require('../infraestrutura/conexao')

conexao.all(`CREATE TABLE IF NOT EXISTS snapshot (
    snap_id INTEGER PRIMARY KEY AUTOINCREMENT,
    snap_name TEXT NOT NULL,
    snap_timestamp TEXT NOT NULL);`, (err) => {
    if (err) {
        console.log("Erro na criação da tabela snapshot: " + err)
    } else {
        console.log('Tabela snapshot criada com sucesso')
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
        const sql = 'INSERT INTO snapshot (snap_name, snap_timestamp) VALUES (?, datetime("now"))'

        conexao.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                conexao.all("SELECT seq FROM sqlite_sequence WHERE name = 'snapshot';", (erro, resultado) => {
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