const Snapshot = require('../models/snapshot')

module.exports = app => {
    app.post('/snapshot', (req, res) => {
        const snapshot = req.body
        Snapshot.create(snapshot, res)
    }) 

    app.get('/snapshot', (req, res) => {
        Snapshot.read(res)
    })

    app.get('/snapshot/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Snapshot.readById(id, res)
    })

    app.put('/snapshot/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const snapshot = req.body
        Snapshot.update(id, snapshot, res)
    })

    app.delete('/snapshot/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Snapshot.delete(id, res)
    })
}
