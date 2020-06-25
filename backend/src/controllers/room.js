const Room = require('../models/room')

module.exports = app => {
    app.post('/room', (req, res) => {
        const room = req.body
        Room.create(room, res)
    }) 

    app.get('/room', (req, res) => {
        Room.read(res)
    })

    app.get('/room/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Room.readById(id, res)
    })

    app.put('/room/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const room = req.body
        Room.update(id, room, res)
    })

    app.delete('/room/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Room.delete(id, res)
    })
}