const conection = require('../infraestrutura/conection')

conection.all(`CREATE TABLE IF NOT EXISTS parm (
            parm_id INTEGER PRIMARY KEY, 
            parm_value FLOAT NOT NULL);`, (err) => {
    if (err) {
        console.log("Erro na criação da tabela parm: " + err)
    } else {
        conection.all(`SELECT count(*) as quantidade FROM parm;`, (err, resultado) => {
            if (err) {
                console.log("Erro ao verificar dados na parm: " + err)
            } else {
                if (resultado[0].quantidade == 0) {
                    conection.all(`INSERT INTO parm (parm_id, parm_value) VALUES (1, 1);`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro do parâmetro 1: " + err)
                        }
                    })
                    conection.all(`INSERT INTO parm (parm_id, parm_value) VALUES (3, 1);`, (err) => {
                        if (err) {
                            console.log("Erro no cadastro do parâmetro 3: " + err)
                        }
                    })
                    conection.all(`INSERT INTO parm (parm_id, parm_value) VALUES (4, 1);`, (err) => {
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
    create(parm, res) {
        const sql = 'INSERT INTO parm (parm_id, parm_value) VALUES (?, ?)'
        conection.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(resultado)
            }
        })
    }

    read(res) {
        const sql = `SELECT * FROM parm;`
        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        });
    }

    readById(id, res) {
        const sql = `SELECT parm_value FROM parm WHERE parm_id=${id}`
        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado[0].parm_value)
            }
        })
    }

    update(id, parm, res) {
        const sql = `UPDATE parm SET parm_value = ? WHERE parm_id = ${id}`
        conection.all(sql, Object.values(parm), (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }

    delete(id, res) {
        const sql = `DELETE FROM parm WHERE parm_id=${id}`
        conection.all(sql, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }
}

module.exports = new parm
