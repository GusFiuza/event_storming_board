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
        carregaCards(mensagemRecebida[0])
    } else if (mensagemRecebida[1] == 'S') {
        filhos = document.getElementById('ssMenu').childElementCount
        for (i=1;i<filhos;i++) {
            document.getElementById('ssMenu').children[1].remove()
        }
        dados = consultarAPI('snap', 0)
        for (i = 0; i < dados.length; i++) {
            criaSnapshot(dados[i].snap_id, dados[i].snap_name)
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
