const Card = require('../models/card')

module.exports = app => {
    app.post('/card', (req, res) => {
        const card = req.body
        Card.adiciona(card, res)
    }) 

    app.get('/card-board/:parms', (req, res) => {
        const board = req.params.parms.split('&')[0]
        const time = req.params.parms.split('&')[1]
        Card.lista(board, time, res)
    })

    app.get('/card/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Card.buscaPorId(id, res)
    })

    app.put('/card/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const card = req.body
        Card.altera(id, card, res)
    })

    app.delete('/card-board/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Card.excluiBoard(id, res)
    })

    app.delete('/card/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Card.exclui(id, res)
    })
}