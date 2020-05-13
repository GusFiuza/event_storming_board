const sqlite3 = require('sqlite3').verbose()
const destino = new sqlite3.Database('dados.db')
const origem = new sqlite3.Database('dados_copy.db')

module.exports = app => {
    app.get('/prov', (req, res) => {
        limpeza = 'DELETE FROM card;'
        destino.all(limpeza, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                console.log('Banco de dados limpo')
            }
        })
        leitura = 'SELECT * FROM card;'
        origem.all(leitura, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                for (i=0;i<resultado.length;i++) {
                    inclusao = `INSERT INTO card (card_class, card_style, card_text, last_change) VALUES ("${resultado[i].card_class}", "${resultado[i].card_style}", "${resultado[i].card_text}", '2020-01-01 00:00:00');`
                    destino.all(inclusao, (erro, resultado) => {
                        if (erro) {
                            console.log(erro.message)
                            res.status(400).json(erro)
                        } else {
                            console.log(`Card ${i} incluído.`)
                        }
                    })
                }
                res.status(200).json('Tudo OK!')
            }
        })
    })
}