const conexao = require('../infraestrutura/conexao')

class parm {
    lista(res) {
        const sql = `SELECT * FROM parm;`

        conexao.all(sql, (erro, resultado) => {
            if(erro) {
                console.log(erro)
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        });
    }

    buscaPorId(id, res) {
        const sql = `SELECT parm_value FROM parm WHERE parm_id=${id}`

        conexao.all(sql, (erro, resultado) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado[0].parm_value)
            }
        })
    }
    
    adiciona(parm, res) {
        const sql = 'INSERT INTO parm (parm_id, parm_value) VALUES (?, ?)'

        conexao.all(sql, Object.values(parm), (erro, resultado) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(resultado)
            }
        })  
    }    

    altera(id, parm, res) {
        const sql = `UPDATE parm SET parm_value = ? WHERE parm_id = ${id}`

        conexao.all(sql, Object.values(parm), (erro, resultado) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }

    exclui(id, res) {
        const sql = `DELETE FROM parm WHERE parm_id=${id}`

        conexao.all(sql, (erro, resultado) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }
}

module.exports = new parm