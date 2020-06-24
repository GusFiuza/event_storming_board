const conection = require('../infraestrutura/conection')

module.exports = app => {
    app.post('/database', (req, res) => {
        conection.all(req.body.sql, (erro, resultado) => {
            if (erro) {
                console.log(erro.message)
                res.status(400).json(erro)
            } else {
                res.status(201).json(resultado)
            }
        })
    }) 

    app.get('/database', (req, res) => {
        conection.all('select name from sqlite_master where type="table" order by name;', (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(resultado)
            }
        })
    })
}
