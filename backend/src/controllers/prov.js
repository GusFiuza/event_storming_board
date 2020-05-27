const sqlite3 = require('sqlite3').verbose()
const destino = new sqlite3.Database('dados.db')
const origem = new sqlite3.Database('dados_copy.db')

module.exports = app => {
    app.get('/prov', (req, res) => {
        limpa_card = 'DELETE FROM card;'
        destino.all(limpa_card, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                console.log('Cards limpos')
            }
        })
        le_card = 'SELECT * FROM card;'
        origem.all(le_card, (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                for (i=0;i<resultado.length;i++) {
                    grava_card = `INSERT INTO card (card_class, card_style, card_text, last_change, board_id, card_check) VALUES ("${resultado[i].card_class}", "${resultado[i].card_style}", "${resultado[i].card_text}", "${resultado[i].last_change}", 1, 0);`
                    destino.all(grava_card, (erro, resultado) => {
                        if (erro) {
                            console.log(erro.message)
                            res.status(400).json(erro)
                        } else {
                            console.log('Cards incluídos.')
                        }
                    })
                }
            }
        })
        // limpa_card = 'DELETE FROM snapshot;'
        // destino.all(limpa_card, (erro, resultado) => {
        //     if (erro) {
        //         res.status(400).json(erro)
        //     } else {
        //         console.log('Snapshots limpos')
        //     }
        // })
        // le_card = 'SELECT * FROM snapshot;'
        // origem.all(le_card, (erro, resultado) => {
        //     if (erro) {
        //         res.status(400).json(erro)
        //     } else {
        //         for (i=0;i<resultado.length;i++) {
        //             grava_card = `INSERT INTO snapshot (snap_name, snap_timestamp) VALUES ("${resultado[i].snap_name}", "${resultado[i].snap_timestamp}");`
        //             destino.all(grava_card, (erro, resultado) => {
        //                 if (erro) {
        //                     console.log(erro.message)
        //                     res.status(400).json(erro)
        //                 } else {
        //                     console.log('Snapshots incluídos.')
        //                 }
        //             })
        //         }
        //     }
        // })
        res.status(200).json('Processo concluído com sucesso!')
    })
}