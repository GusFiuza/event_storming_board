const Card = require('../models/card')

module.exports = app => {
    app.post('/card', (req, res) => {
        const card = req.body
        Card.adiciona(card, res)
    }) 

    app.get('/card', (req, res) => {
        Card.lista(res)
    })

    app.get('/card-snapshot/:time', (req, res) => {
        const time = req.params.time
        Card.listaSnapshot(time, res)
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

    app.delete('/card/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Card.exclui(id, res)
    })
}