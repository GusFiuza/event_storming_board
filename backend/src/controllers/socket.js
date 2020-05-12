const http = require('http')

module.exports = app => {
    const ws = new require('ws');
    const wss = new ws.Server({noServer: true});
    const clients = new Set();
    
    function onSocketConnect(ws) {
        console.log('Nova conexão');
        clients.add(ws);
    
        ws.on('message', function(message) {
            console.log(`Mensagem recebida: ${message}`);
            for(let client of clients) {
                client.send(message);
            }
        })
    
        ws.on('close', function() {
            console.log(`connection closed`);
            clients.delete(ws);
        })
    }

    app.get('/ws', (req, res) => {
        wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
    })

    app.get('/info', (req, res) => {
        res.end('Clientes conectados: ' + clients.size)
    })

}