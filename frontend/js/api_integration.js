backendHost = `http://${window.location.hostname}:8002/`

function dataChange(method, model, object, id) {
    Httpreq = new XMLHttpRequest()
    if (id == 0) {
        Httpreq.open(method, backendHost + model, false)
    } else {
        Httpreq.open(method, backendHost + model + '/' + id, false)
    }
    Httpreq.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
    if (object == '') {
        Httpreq.send()
    } else {
        Httpreq.send(object)
    }
    return JSON.parse(Httpreq.responseText)
}

function dataQuery(model, id) {
    Httpreq = new XMLHttpRequest()
    if (id == 0) {
        Httpreq.open("GET", backendHost + model, false)
    } else {
        Httpreq.open("GET", backendHost + model + '/' + id, false)
    }
    Httpreq.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
    Httpreq.send()
    if (Httpreq.responseText == '') {
        return Httpreq.responseText
    } else {
        return JSON.parse(Httpreq.responseText)
    }
}
