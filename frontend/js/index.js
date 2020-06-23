// Page load
function pageLoad() {
  classes = ['event card', 'command card', 'aggregate card', 'condition card', 'context card']
  cardSize = ''
  factor = zoomLoad()
  listLoad('board')
  listLoad('snapshot')
  cardsLoad()
}

function zoomLoad() {
  zoomRate = dataQuery('parm', 1)
  document.body.style.transform = 'scale(' + zoomRate + ')'
  document.getElementById('toolBar').style.transform = 'scale(' + 1 / zoomRate + ')'
  document.getElementById('zoomRate').textContent = parseInt(zoomRate * 100) + '%'
  return 1 / zoomRate
}

function listLoad(type) {
  listItens = dataQuery(type, 0)
  if (type == 'board') {
    for (i = 0; i < listItens.length; i++) {
      createItem(type, listItens[i].board_id, listItens[i].board_name)
    }
  } else {
    for (i = 0; i < listItens.length; i++) {
      createItem(type, listItens[i].snap_id, listItens[i].snap_name)
    }
  }
  document.getElementById(type + 'List').children[1].children[0].children[1].remove()
  checkedMark(type + 'List')
}

function cardsLoad() {
  data = dataQuery('card', '?board=' + dataQuery('parm', 4) + '&lastChange=' + dataQuery('snapshot', dataQuery('parm', 3)).snap_timestamp)
  for (i = 0; i < data.length; i++) {
    createCard(data[i].card_id, data[i].card_class, data[i].card_style, data[i].card_text, data[i].card_check)
  }
}

// Page interaction
function bodyClick(ev) {
  if (ev.target.tagName == 'BODY') newCard(ev)
  if (ev.target.getAttribute('class') == 'duplicate control') cardDuplicate(ev)
  if (ev.target.getAttribute('class') == 'order control') cardOrderChange(ev)
  if (ev.target.getAttribute('class') == 'color control') cardColorChange(ev)
  if (ev.target.getAttribute('class') == 'edit control') {
    if (ev.target.parentElement.parentElement.getAttribute('class') == 'listItem') {
      listItemTextChange(ev)
    } else {
      cardTextChange(ev)
    }
  }
  if (ev.target.getAttribute('class') == 'delete control') {
    if (ev.target.parentElement.parentElement.getAttribute('class') == 'listItem') {
      listItemRemove(ev)
    } else {
      cardRemove(ev)
    }
  }
}

function newCard(ev) {
  cardText = prompt('Digite o texto do post-it:')
  if (cardText != null) {
    cardClass = 'event card'
    cardStyle = 'z-index: ' + (document.body.childElementCount - 1) + '; top: ' + ev.clientY + 'px; left: ' + ev.clientX + 'px;'
    cardData = 'card_class=' + cardClass + '&card_style=' + cardStyle + '&card_text=' + cardText + '&board_id=' + dataQuery('parm', 4) + '&checked=' + 0
    cardId = dataChange('post', 'card', cardData, 0)
    changeBroadcast(cardId, 'createCard')
  }
}

// Toolbar interaction
function showList(type) {
  boardlist = document.getElementById(type + 'List')
  if (boardlist.hidden) {
    boardlist.removeAttribute('hidden')
  } else {
    boardlist.setAttribute('hidden', '')
  }
}

function newListItem(type) {
  if (type == 'board') {item = 'quadro'} else {item = 'instantâneo'}
  itemName = prompt('Digite um nome para seu ' + item + ':')
  if (itemName != null) {
    itemData = 'name=' + itemName
    itemId = dataChange('post', type, itemData, 0)
    changeBroadcast(0, type + 'List')
  } else {
    showList(type)
  }
}

function listItemClick(id) {
  if (event.target.parentElement.id == 'boardList') {
    dataChange('put', 'parm', 'parm_value=1', 3)
    dataChange('put', 'parm', 'parm_value=' + id, 4)
    showList('board')
  }
  if (event.target.parentElement.id == 'snapshotList') {
    dataChange('put', 'parm', 'parm_value=' + id, 3)
    showList('snapshot')
  }
  changeBroadcast(0, 'boardView')
}

function listItemTextChange(ev) {
  item = ev.target.parentElement.parentElement
  type = item.parentElement.id.replace('List','')
  if (type == 'snapshot') {displayType = 'quadro'} else {displayType = 'instantâneo'}
  text = prompt('Digite o novo nome do ' + displayType, item.textContent)
  if (text != null & text != '') {
    dataChange('put', type, 'listItem_name=' + text, item.id.replace(type, ''))
    changeBroadcast(0, item.parentElement.id)
  }
  showList(type)
}

function listItemRemove(ev) {
  item = ev.target.parentElement.parentElement
  type = item.parentElement.id.replace('List','')
  if (type == 'snapshot') {
    displayType = 'instantâneo'
    parmNumber = 3
  } else {
    displayType = 'quadro e todos os post-its contidos nele'
    parmNumber = 4
  }
  if (confirm('Confirme a exclusão do ' + displayType)) {
    dataChange('delete', type, '', item.id.replace(type, ''))
    changeBroadcast(0, item.parentElement.id)
    if (item.parentElement.id == 'boardList') dataChange('delete', 'card', '', '0?board=' + item.id.replace("board", ""))
    if (dataQuery('parm', parmNumber) == item.id.replace(type, '')) {
      dataChange('put', 'parm', 'parm_value=' + 1, parmNumber)
      changeBroadcast(0, 'boardView')
    }
  }
  showList(type)
}

function zoom(type) {
  newZoom = dataQuery('parm', 1)
  if (type == '+') { newZoom += .1 } else newZoom -= .1
  dataChange('put', 'parm', 'parm_value=' + newZoom, 1)
  changeBroadcast(newZoom, 'zoomRate')
}

// Card interaction
function cardMouseOver(ev) {
  card = ev.target.parentElement
  if (classes.indexOf(card.getAttribute('class')) != -1) {
    turnOnCardMove(card.id)
  }
}

function cardMouseDown(ev) {
  if (classes.indexOf(ev.target.getAttribute('class')) != -1) {
    cardSize = ev.target.style.width + ' x ' + ev.target.style.height
  }
}

function cardMouseUp(ev) {
  if (classes.indexOf(ev.target.getAttribute('class')) != -1) {
    card = ev.target
    if (cardSize != card.style.width + ' x ' + card.style.height) {
      dataChange('put', 'card', createCardData(card), card.id.replace("card", ""))
      changeBroadcast(card.id.replace('card', ''), 'updateCard')
    }
  }
}

function cardDuplicate(ev) {
  card = ev.target.parentElement.parentElement
  cardClass = card.getAttribute('class')
  cardStyle = 'z-index: ' + (document.body.childElementCount - 1) + '; '
  cardStyle = cardStyle + 'top: ' + (parseInt(card.style.top.replace('px', '')) + 50) + 'px; '
  cardStyle = cardStyle + 'left: ' + (parseInt(card.style.left.replace('px', '')) + 50) + 'px; '
  if (card.style.width != '') cardStyle = cardStyle + 'width: ' + card.style.width + '; '
  if (card.style.height != '') cardStyle = cardStyle + 'height: ' + card.style.height + ';'
  cardText = card.children[1].textContent
  if (card.children[0].children[0].checked == false) {cardCheck = 0} else cardCheck = 1
  cardData = 'card_class=' + cardClass + '&card_style=' + cardStyle + '&card_text=' + cardText + '&board_id=' + dataQuery('parm', 4) + '&card_check=' + cardCheck
  cardId = dataChange('post', 'card', cardData, 0)
  changeBroadcast(cardId, 'createCard')
}

function cardCheckChange(ev) {
  card = ev.target.parentElement.parentElement
  dataChange('put', 'card', createCardData(card), card.id.replace("card", ""))
  changeBroadcast(card.id.replace('card', ''), 'updateCard')
}

function cardOrderChange(ev) {
  card = ev.target.parentElement.parentElement
  order = prompt('Digite a nova ordem', card.children[0].children[1].textContent)
  if (order != null) {
    if (parseInt(order) > -1 & parseInt(order) < 100) {
      card.style.zIndex = parseInt(order)
      dataChange('put', 'card', createCardData(card), card.id.replace("card", ""))
      changeBroadcast(card.id.replace('card', ''), 'updateCard')
    } else {
      alert('Digite um valor válido!')
    }
  }
}

function cardColorChange(ev) {
  card = ev.target.parentElement.parentElement
  if (classes.indexOf(card.getAttribute('class')) + 1 == classes.length) {
    cardClass = classes[0]
    card.children[1].setAttribute('class', 'cardBody')
  } else {
    cardClass = classes[classes.indexOf(card.getAttribute('class')) + 1]
    if (cardClass == 'context card') card.children[1].setAttribute('class', 'cardBody contextBody')
  }
  card.setAttribute('class', cardClass)
  dataChange('put', 'card', createCardData(card), card.id.replace("card", ""))
  changeBroadcast(card.id.replace('card', ''), 'updateCard')
}

function cardTextChange(ev) {
  card = ev.target.parentElement.parentElement
  text = prompt('Digite o novo texto', card.children[1].textContent)
  if (text != null) {
    card.children[1].textContent = text
    dataChange('put', 'card', createCardData(card), card.id.replace("card", ""))
    changeBroadcast(card.id.replace('card', ''), 'updateCard')
  }
}

function cardRemove(ev) {
  card = ev.target.parentElement.parentElement
  dataChange('delete', 'card', '', card.id.replace("card", ""))
  changeBroadcast(card.id.replace('card', ''), 'deleteCard')
}

function turnOnCardMove(card) {
  cardsToMove = [card]
  for (i = 2; i < document.body.childElementCount; i++) {
    card = document.body.children[i]
    if (card.children[0].children[0].checked) {
      if (cardsToMove.indexOf(card.id) == -1) {
        cardsToMove.unshift(card.id)
      }
    }
  }
  topPosition = 0
  leftPosition = 0
  newTopPosition = 0
  newLeftPosition = 0
  for (i = 0; i < cardsToMove.length; i++) {
    card = document.getElementById(cardsToMove[i])
    document.getElementById(card.id + "body").onmousedown = cardMoveMouseDown
  }
  function cardMoveMouseDown() {
    ev = window.event;
    ev.preventDefault();
    topPosition = ev.clientY;
    leftPosition = ev.clientX;
    document.onmousemove = cardMove;
    document.onmouseup = cardMoveEnd;
  }
  function cardMove() {
    ev = window.event;
    ev.preventDefault();
    newTopPosition = topPosition - ev.clientY;
    newLeftPosition = leftPosition - ev.clientX;
    leftPosition = ev.clientX;
    topPosition = ev.clientY;
    for (i = 0; i < cardsToMove.length; i++) {
      card = document.getElementById(cardsToMove[i])
      card.style.top = (card.offsetTop - newTopPosition * factor) + "px";
      card.style.left = (card.offsetLeft - newLeftPosition * factor) + "px";
    }
  }
  function cardMoveEnd() {
    ev = window.event;
    ev.preventDefault();
    document.onmousemove = null;
    document.onmouseup = null;
    if (ev.target.parentElement.getAttribute('style') != null) {
      for (i = 0; i < cardsToMove.length; i++) {
        card = document.getElementById(cardsToMove[i])
        dataChange('put', 'card', createCardData(card), card.id.replace("card", ""))
        changeBroadcast(card.id.replace('card', ''), 'updateCard')
      }
    }
  }
}

// Elements creation
function createItem(type, id, name) {
  item = document.createElement('div')
  item.setAttribute('id', type + id)
  item.setAttribute('class', 'listItem')
  item.setAttribute('onclick', 'listItemClick(' + id + ')')
  item.textContent = name
  itemControl = document.createElement('div')
  itemControl.setAttribute('class', 'listItemControl')
  itemEdit = document.createElement('div')
  itemEdit.setAttribute('class', 'edit control')
  itemDelete = document.createElement('div')
  itemDelete.setAttribute('class', 'delete control')
  itemControl.appendChild(itemEdit)
  itemControl.appendChild(itemDelete)
  item.appendChild(itemControl)
  list = document.getElementById(type + 'List')
  list.appendChild(item)
  list.setAttribute('hidden', '')
}

function createCard(cardId, cardClass, cardStyle, cardText, cardChecked) {
  card = document.createElement('div')
  card.setAttribute('id', 'card' + cardId)
  card.setAttribute('class', cardClass)
  card.setAttribute('style', cardStyle)
  card.setAttribute('onmouseover', 'cardMouseOver(event)')
  card.setAttribute('onmousedown', 'cardMouseDown(event)')
  card.setAttribute('onmouseup', 'cardMouseUp(event)')
  cardHeader = document.createElement('div')
  cardHeader.setAttribute('id', 'card' + cardId + 'header')
  cardHeader.setAttribute('class', 'cardHeader')
  cardCheck = document.createElement('input')
  cardCheck.setAttribute('type', 'checkbox')
  cardCheck.setAttribute('onchange', 'cardCheckChange(event)')
  if (cardChecked == 0) { cardCheck.checked = false } else { cardCheck.checked = true }
  cardOrder = document.createElement('div')
  cardOrder.setAttribute('class', 'order control')
  cardOrder.textContent = cardStyle.substring(9, cardStyle.indexOf('; top'))
  cardCopy = document.createElement('div')
  cardCopy.setAttribute('class', 'duplicate control')
  cardColor = document.createElement('div')
  cardColor.setAttribute('class', 'color control')
  cardEdit = document.createElement('div')
  cardEdit.setAttribute('class', 'edit control')
  cardDelete = document.createElement('div')
  cardDelete.setAttribute('class', 'delete control')
  cardBody = document.createElement('div')
  cardBody.setAttribute('id', 'card' + cardId + 'body')
  if (cardClass == 'context card') {
    cardBody.setAttribute('class', 'cardBody contextBody')
  } else {
    cardBody.setAttribute('class', 'cardBody')
  }
  cardBody.textContent = cardText
  cardHeader.appendChild(cardCheck)
  cardHeader.appendChild(cardOrder)
  cardHeader.appendChild(cardCopy)
  cardHeader.appendChild(cardColor)
  cardHeader.appendChild(cardEdit)
  cardHeader.appendChild(cardDelete)
  card.appendChild(cardHeader)
  card.appendChild(cardBody)
  document.body.appendChild(card)
}

function createCardData(card) {
  cardClass = card.getAttribute('class')
  cardStyle = card.getAttribute('style')
  cardText = card.children[1].textContent
  if (card.children[0].children[0].checked) { checked = 1 } else { checked = 0 }
  return `card_class=${cardClass}&card_style=${cardStyle}&card_text=${cardText}&board_id=${dataQuery('parm', 4)}&checked=${checked}`
}
