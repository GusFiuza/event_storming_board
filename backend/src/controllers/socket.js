module.exports = app => {
    const ws = new require('ws');
    const wss = new ws.Server({noServer: true});
    const rooms = new Set();
    let roomId = '';

    function onSocketConnect(ws) {

        roomNotExists = true

        for (room of rooms) {
            if (room.roomId == roomId) {
                roomNotExists = false
                room.users.unshift(ws)
            }
        }

        if (roomNotExists) {
            rooms.add({'roomId':roomId,'users':[ws]})
        }

        for (room of rooms) {
            if (room.users.indexOf(ws) > -1) {
                for (user of room.users) {
                    user.send(`${room.users.length}-users`)
                }
            }
        }

        ws.on('message', function(message) {
            for (room of rooms) {
                if (room.users.indexOf(ws) > -1) {
                    for (user of room.users) {
                        user.send(message)
                    }
                }
            }
        })
    
        ws.on('close', function() {
            for (room of rooms) {
                if (room.users.indexOf(ws) > -1) {
                    for (user of room.users) {
                        user.send(`${room.users.length - 1}-users`)
                    }
                }
            }
            for (room of rooms) {
                if (room.users.indexOf(ws) > -1) {
                    room.users.splice(room.users.indexOf(ws), 1)
                }
            }
        })
    }

    app.get('/ws', (req, res) => {
        roomId = req.query.roomid
        wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect)
    })
}
