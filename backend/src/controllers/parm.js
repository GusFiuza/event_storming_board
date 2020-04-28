const Parm = require('../models/parm')

module.exports = app => {
    app.post('/parm', (req, res) => {
        const parm = req.body
        Parm.adiciona(parm, res)
    }) 

    app.get('/parm', (req, res) => {
        Parm.lista(res)
    })

    app.get('/parm/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Parm.buscaPorId(id, res)
    })

    app.put('/parm/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const parm = req.body
        Parm.altera(id, parm, res)
    })

    app.delete('/parm/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Parm.exclui(id, res)
    })
}