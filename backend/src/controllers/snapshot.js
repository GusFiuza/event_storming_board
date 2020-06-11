const Snapshot = require('../models/snapshot')

module.exports = app => {
    app.post('/snapshot', (req, res) => {
        const snapshot = req.body
        Snapshot.adiciona(snapshot, res)
    }) 

    app.get('/snapshot', (req, res) => {
        Snapshot.lista(res)
    })

    app.get('/snapshot/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Snapshot.buscaPorId(id, res)
    })

    app.put('/snapshot/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const snapshot = req.body
        Snapshot.altera(id, snapshot, res)
    })

    app.delete('/snapshot/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Snapshot.exclui(id, res)
    })
}