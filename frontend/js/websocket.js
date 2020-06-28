socket = new WebSocket(`ws://${location.host}:8002/ws?${document.URL.split('?')[1]}`)

socket.onmessage = function (event) {
    message = event.data.split('-')
    object = message[0]
    action = message[1]
    
    if (action == 'users') {
        document.getElementById('users').textContent = object
    }

    if (action == 'boardView') {
        checkedMark('boardList')
        while (document.body.childElementCount > 2) {document.body.lastChild.remove()}
        cardsLoad()
    }
    
    if (action == 'boardList') {
        list = document.getElementById(action)
        while (list.childElementCount > 1) list.lastChild.remove()
        listLoad(action.replace('List',''))
    }
    
    if (action == 'zoomRate') {
        factor = zoomLoad()
    }
    
    if (action == 'createCard') {
        cardData = dataQuery('card', object)
        createCard(cardData.card_id, 
            cardData.card_class, 
            cardData.card_style, 
            cardData.card_text, 
            cardData.card_check)
    }
    
    if (action == 'updateCard') {
        document.getElementById('card' + object).remove()
        cardData = dataQuery('card', object)
        createCard(cardData.card_id, 
            cardData.card_class, 
            cardData.card_style, 
            cardData.card_text, 
            cardData.card_check)
    }
    
    if (action == 'deleteCard') {
        document.getElementById('card' + object).remove()
    }
}

socket.onclose = event => console.log(`Sevidor desconectado. Código: ${event.code}`)

function changeBroadcast(object, action) {
    socket.send(`${object}-${action}`)
}

function checkedMark(itensList) {
    list = document.getElementById(itensList)
    for (i = 1; i < list.childElementCount; i++) list.children[i].setAttribute('style','')
    if (itensList == 'boardList') {parmId = 4} else {parmId = 3}
    document.getElementById(itensList.replace('List','') + dataQuery('parm',parmId)).style.backgroundColor = 'gray'
}
