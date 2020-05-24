frontendHost = 'http://' + window.location.hostname + ':' + window.location.port + '/'
backendHost = 'http://' + window.location.hostname + ':8002/'
backendWs = 'ws://' + location.host + ':8002/ws'

socket = new WebSocket(backendWs);

function propagaMudanca(objeto, acao) {
    socket.send(`${objeto}-${acao}`)
}

socket.onmessage = function (event) {
    mensagemRecebida = event.data.split('-')
    if (mensagemRecebida[1] == 'AS') {
        carregaCards()
    } else if (mensagemRecebida[1] == 'B') {
        filhos = document.getElementById('bMenu').childElementCount
        for (i=2;i<filhos;i++) {
            document.getElementById('bMenu').children[2].remove()
        }
        dados = consultarAPI('board', 0)
        for (i = 0; i < dados.length; i++) {
            if (i == 0) {
                document.getElementById('bItem1').textContent = dados[i].board_name
                boardControls = document.createElement('div')
                boardControls.setAttribute('class', 'controles')
                boardEditar = document.createElement('div')
                boardEditar.setAttribute('class', 'cardeditar')
                boardControls.appendChild(boardEditar)
                document.getElementById('bItem1').appendChild(boardControls)
            } else {
                criaBoard(dados[i].board_id, dados[i].board_name)
            }
        }
    } else if (mensagemRecebida[1] == 'S') {
        filhos = document.getElementById('ssMenu').childElementCount
        for (i=2;i<filhos;i++) {
            document.getElementById('ssMenu').children[2].remove()
        }
        dados = consultarAPI('snap', 0)
        for (i = 0; i < dados.length; i++) {
            if (i == 0) {
                document.getElementById('ssItem1').textContent = dados[i].snap_name
            } else {
                criaSnapshot(dados[i].snap_id, dados[i].snap_name)
            }
        }
    } else if (mensagemRecebida[1] == 'Z') {
        novoZoom = parseFloat(mensagemRecebida[0])
        fator = 1/novoZoom
        document.body.style.transform = 'scale(' + novoZoom + ')'
        document.getElementById('toolBar').style.transform = 'scale(' + (fator) + ')'
        document.getElementById('toolBar').children[1].textContent = parseInt(novoZoom * 100) + '%'
    } else if (mensagemRecebida[1] == 'C') {
        if (document.getElementById('card' + mensagemRecebida[0]) == null) {
            dados = consultarAPI('card', mensagemRecebida[0])
            criaCard(dados.card_id, dados.card_class, dados.card_style, dados.card_text)
        }
    } else if (mensagemRecebida[1] == 'U') {
        document.getElementById('card' + mensagemRecebida[0]).remove()
        dados = consultarAPI('card', mensagemRecebida[0])
        criaCard(dados.card_id, dados.card_class, dados.card_style, dados.card_text)
    } else {
        if (document.getElementById('card' + mensagemRecebida[0]) != null) {
            document.getElementById('card' + mensagemRecebida[0]).remove()
        }
    }
}

socket.onclose = event => console.log(`Sevidor desconectado. Código: ${event.code}`)

function manterAPI(metodo, modelo, objeto, identificador) {
    Httpreq = new XMLHttpRequest()
    if (identificador == 0) {
        Httpreq.open(metodo, backendHost + modelo, false)
    } else {
        Httpreq.open(metodo, backendHost + modelo + '/' + identificador, false)
    }
    Httpreq.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
    if (objeto == '') {
        Httpreq.send()
    } else {
        Httpreq.send(objeto)
    }
    return JSON.parse(Httpreq.responseText)
}

function consultarAPI(modelo, identificador) {
    Httpreq = new XMLHttpRequest()
    if (identificador == 0) {
        Httpreq.open("GET", backendHost + modelo, false)
    } else {
        Httpreq.open("GET", backendHost + modelo + '/' + identificador, false)
    }
    Httpreq.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
    Httpreq.send()
    if (Httpreq.responseText == '') {
        return Httpreq.responseText
    } else {
        return JSON.parse(Httpreq.responseText)
    }
}
