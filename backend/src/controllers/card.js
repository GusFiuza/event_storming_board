const Card = require('../models/card')

module.exports = app => {
    app.post('/card', (req, res) => {
        const card = req.body
        Card.create(card, res)
    }) 

    app.get('/card', (req, res) => {
        const board = req.query.board
        Card.read(board, res)
    })

    app.get('/card/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Card.readById(id, res)
    })

    app.put('/card/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const card = req.body
        Card.update(id, card, res)
    })

    app.delete('/card/:id', (req, res) => {
        const cardId = parseInt(req.params.id)
        const boardId = req.query.board
        Card.delete(boardId, cardId, res)
    })
}
