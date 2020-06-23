const Parm = require('../models/parm')

module.exports = app => {
    app.post('/parm', (req, res) => {
        const parm = req.body
        Parm.create(parm, res)
    }) 

    app.get('/parm', (req, res) => {
        Parm.read(res)
    })

    app.get('/parm/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Parm.readById(id, res)
    })

    app.put('/parm/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const parm = req.body
        Parm.update(id, parm, res)
    })

    app.delete('/parm/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Parm.delete(id, res)
    })
}
