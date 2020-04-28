frontendHost = 'http://' + window.location.hostname + ':' + window.location.port + '/'
backendHost = 'http://' + window.location.hostname + ':8002/'

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
