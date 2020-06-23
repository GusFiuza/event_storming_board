const Board = require('../models/board')

module.exports = app => {
    app.post('/board', (req, res) => {
        const board = req.body
        Board.create(board, res)
    }) 

    app.get('/board', (req, res) => {
        Board.read(res)
    })

    app.get('/board/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Board.readById(id, res)
    })

    app.put('/board/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const board = req.body
        Board.update(id, board, res)
    })

    app.delete('/board/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Board.delete(id, res)
    })
}
