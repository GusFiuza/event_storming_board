const conection = require('../infraestrutura/conection')

conection.all(`CREATE TABLE IF NOT EXISTS snapshot (
            snapshot_id INTEGER PRIMARY KEY AUTOINCREMENT,
            snapshot_name TEXT NOT NULL,
            snapshot_timestamp TEXT NOT NULL);`, (err) => {
    if (err) {
        console.log("Erro na criação da tabela snapshot: " + err)
    } else {
        conection.all(`SELECT count(*) as quantidade FROM snapshot;`, (err, resultado) => {
            if (err) {
                console.log("Erro ao verificar dados na snapshoot: " + err)
            } else {
                if (resultado[0].quantidade == 0) {
                    conection.all(`INSERT INTO snapshot (snapshot_id, snapshot_name, snapshot_timestamp)
                    VALUES
                        (1, 'Todos os post-its', '9999-12-31 23:59:59');`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro do parâmetro 1: " + err)
                        }
                    })
                }
            }
        })
    }
})

class snapshot {
    read(res) {
        const sql = `SELECT * FROM snapshot;`

        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        });
    }

    readById(id, res) {
        const sql = `SELECT snapshot_name, snapshot_timestamp FROM snapshot WHERE snapshot_id=${id}`

        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado[0])
            }
        })
    }

    create(parm, res) {
        const sql = 'INSERT INTO snapshot (snapshot_name, snapshot_timestamp) VALUES (?, datetime("now"))'

        conection.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                conection.all("SELECT seq FROM sqlite_sequence WHERE name = 'snapshot';", (erro, resultado) => {
                    if (erro) {
                        res.status(400).json(erro)
                    } else {
                        res.status(201).json(resultado[0].seq)
                    }
                })
            }
        })
    }

    update(id, parm, res) {
        const sql = `UPDATE snapshot SET snapshot_name = ? WHERE snap_id = ${id}`

        conection.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }

    delete(id, res) {
        const sql = `DELETE FROM snapshot WHERE snapshot_id=${id}`

        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }
}

module.exports = new snapshot
