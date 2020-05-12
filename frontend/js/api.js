frontendHost = 'http://' + window.location.hostname + ':' + window.location.port + '/'
backendHost = 'http://' + window.location.hostname + ':8002/'

url = 'ws://' + location.host + ':8002/ws'
socket = new WebSocket(url);

function propagaMudanca(objeto, acao) {
    socket.send(`${objeto}-${acao}`)
}

socket.onmessage = function (event) {
    mensagemRecebida = event.data.split('-')
    if (mensagemRecebida[1] == 'C') {
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
