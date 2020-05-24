const Board = require('../models/board')

module.exports = app => {
    app.post('/board', (req, res) => {
        const board = req.body
        Board.adiciona(board, res)
    }) 

    app.get('/board', (req, res) => {
        Board.lista(res)
    })

    app.get('/board/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Board.buscaPorId(id, res)
    })

    app.put('/board/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const board = req.body
        Board.altera(id, board, res)
    })

    app.delete('/board/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Board.exclui(id, res)
    })
}