const Snapshot = require('../models/snapshot')

module.exports = app => {
    app.post('/snap', (req, res) => {
        const snapshot = req.body
        Snapshot.adiciona(snapshot, res)
    }) 

    app.get('/snap', (req, res) => {
        Snapshot.lista(res)
    })

    app.get('/snap/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Snapshot.buscaPorId(id, res)
    })

    app.put('/snap/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const snapshot = req.body
        Snapshot.altera(id, snapshot, res)
    })

    app.delete('/snap/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Snapshot.exclui(id, res)
    })
}