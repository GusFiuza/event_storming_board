socket = new WebSocket(`ws://${location.host}:8002/ws`)

socket.onmessage = function (event) {
    message = event.data.split('-')
    object = message[0]
    action = message[1]
    
    if (action == 'boardView') {
        checkedMark('boardList')
        checkedMark('snapshotList')
        while (document.body.childElementCount > 2) {document.body.lastChild.remove()}
        cardsLoad()
    }
    
// Reavaliar ########################################################################

    if (action == 'boardList') {
        boardList = document.getElementById(action)
        while (boardList.childElementCount > 1) {
            boardList.lastChild.remove()
        }
        boardListItem = dataQuery(action.replace('List',''), 0)
        for (i = 0; i < boardListItem.length; i++) {
            createItem(action.replace('List',''), boardListItem[i].board_id, boardListItem[i].board_name)
        }
        boardList.children[1].children[0].children[1].remove()
        checkedMark(action)
    }
    
    if (action == 'snapshotList') {
        snapshotList = document.getElementById(action)
        while (snapshotList.childElementCount > 1) {
            snapshotList.lastChild.remove()
        }
        snapshotListItem = dataQuery(action.replace('List',''), 0)
        for (i = 0; i < snapshotListItem.length; i++) {
            createItem(action.replace('List',''), snapshotListItem[i].snap_id, snapshotListItem[i].snap_name)
        }
        snapshotList.children[1].children[0].children[1].remove()
        checkedMark(action)
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
    for (i = 1; i < list.childElementCount; i++) {
        list.children[i].setAttribute('style','')
    }
    if (itensList == 'boardList') {parmId = 4} else {parmId = 3}
    document.getElementById(itensList.replace('List','') + dataQuery('parm',parmId)).style.backgroundColor = 'gray'
}
