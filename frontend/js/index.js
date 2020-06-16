function checkChange(ev) {
  card = ev.target.parentElement.parentElement
  dataChange('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
  changeBroadcast(card.id.replace('card', ''), 'updateCard')
}

function inclui(ev) {
  card = ev.target.parentElement
  if (classes.indexOf(card.getAttribute('class')) != -1) {
    dragElement(card.id)
  }
}

function mouseDown(ev) {
  if (classes.indexOf(ev.target.getAttribute('class')) != -1) {
    tamanhoCard = ev.target.style.width + ' x ' + ev.target.style.height
  }
}

function mouseUp(ev) {
  if (classes.indexOf(ev.target.getAttribute('class')) != -1) {
    card = ev.target
    if (tamanhoCard != card.style.width + ' x ' + card.style.height) {
      console.log('Alterei o tamanho')
      dataChange('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
      changeBroadcast(card.id.replace('card', ''), 'updateCard')
    }
  }
}

function zoom(type) {
  novoZoom = dataQuery('parm', 1)
  if (type == '+') { novoZoom += .1 } else novoZoom -= .1
  dataChange('put', 'parm', 'parm_value=' + novoZoom, 1)
  changeBroadcast(novoZoom, 'zoomRate')
}

function showList(type) {
  boardlist = document.getElementById(type + 'List')
  if (boardlist.hidden) {
    boardlist.removeAttribute('hidden')
  } else {
    boardlist.setAttribute('hidden', '')
  }
}

function newItem(type) {
  if (type == 'board') {
    item = 'quadro'
  } else {
    item = 'instantâneo'
  }
  itemName = prompt('Digite um nome para seu ' + item + ':')
  if (itemName != null) {
    itemData = 'name=' + itemName
    itemId = dataChange('post', type, itemData, 0)
    changeBroadcast(0, type + 'List')
  } else {
    showList(type)
  }
}

function createBoard(id, nome) {
  boardItem = document.createElement('div')
  boardItem.setAttribute('id', 'board' + id)
  boardItem.setAttribute('class', 'listItem')
  boardItem.setAttribute('onclick', 'itemClick(' + id + ')')
  boardItem.textContent = nome
  boardControls = document.createElement('div')
  boardControls.setAttribute('class', 'listItemControl')
  boardEditar = document.createElement('div')
  boardEditar.setAttribute('class', 'edit control')
  boardExcluir = document.createElement('div')
  boardExcluir.setAttribute('class', 'delete control')
  boardControls.appendChild(boardEditar)
  boardControls.appendChild(boardExcluir)
  boardItem.appendChild(boardControls)
  boardlist = document.getElementById('boardList')
  boardlist.appendChild(boardItem)
  boardlist.setAttribute('hidden', '')
}

function criaSnapshot(id, nome) {
  snapItem = document.createElement('div')
  snapItem.setAttribute('id', 'snapshot' + id)
  snapItem.setAttribute('class', 'listItem')
  snapItem.setAttribute('onclick', 'itemClick(' + id + ')')
  snapItem.textContent = nome
  boardControls = document.createElement('div')
  boardControls.setAttribute('class', 'listItemControl')
  snapExcluir = document.createElement('div')
  snapExcluir.setAttribute('class', 'delete control')
  boardControls.appendChild(snapExcluir)
  snapItem.appendChild(boardControls)
  snapshotlist = document.getElementById('snapshotList')
  snapshotlist.appendChild(snapItem)
  snapshotlist.setAttribute('hidden', '')
}

function itemClick(id) {
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

function carregaCards() {
  filhos = document.body.childElementCount
  for (i = 2; i < filhos; i++) {
    document.body.children[2].remove()
  }
  dados = dataQuery('card-board', dataQuery('parm', 4) + '&' + dataQuery('snapshot', dataQuery('parm', 3)).snap_timestamp)
  for (i = 0; i < dados.length; i++) {
    criaCard(dados[i].card_id, dados[i].card_class, dados[i].card_style, dados[i].card_text, dados[i].card_check)
  }
}

function pageLoad() {
  boardListItem = dataQuery('board', 0)
  for (i = 0; i < boardListItem.length; i++) {
    createBoard(boardListItem[i].board_id, boardListItem[i].board_name)
  }
  document.getElementById('boardList').children[1].children[0].children[1].remove()
  checkedMark('boardList')

  snapshotListItem = dataQuery('snapshot', 0)
  for (i = 0; i < snapshotListItem.length; i++) {
      criaSnapshot(snapshotListItem[i].snap_id, snapshotListItem[i].snap_name)
  }
  document.getElementById('snapshotList').children[1].children[0].children[0].remove()
  checkedMark('snapshotList')

  dados = dataQuery('card-board', dataQuery('parm', 4) + '&' + dataQuery('snapshot', dataQuery('parm', 3)).snap_timestamp)
  for (i = 0; i < dados.length; i++) {
    criaCard(dados[i].card_id, dados[i].card_class, dados[i].card_style, dados[i].card_text, dados[i].card_check)
  }
  novoZoom = dataQuery('parm', 1)
  fator = 1 / novoZoom
  document.body.style.transform = 'scale(' + novoZoom + ')'
  document.getElementById('toolBar').style.transform = 'scale(' + fator + ')'
  document.getElementById('zoomRate').textContent = parseInt(novoZoom * 100) + '%'
  classes = ['event card', 'command card', 'aggregate card', 'condition card', 'context card']
  tamanhoCard = ''
}

function criaCard(id, classe, estilo, texto, marcacao) {
  card = document.createElement('div')
  cardHeader = document.createElement('div')
  cardCheck = document.createElement('input')
  cardOrdem = document.createElement('div')
  cardCopiar = document.createElement('div')
  cardCor = document.createElement('div')
  cardEditar = document.createElement('div')
  cardExcluir = document.createElement('div')
  cardBody = document.createElement('div')
  card.setAttribute('id', 'card' + id)
  card.setAttribute('class', classe)
  card.setAttribute('style', estilo)
  card.setAttribute('onmousedown', 'mouseDown(event)')
  card.setAttribute('onmouseup', 'mouseUp(event)')
  card.setAttribute('onmouseover', 'inclui(event)')
  cardHeader.setAttribute('id', 'card' + id + 'header')
  cardHeader.setAttribute('class', 'cardHeader')
  cardOrdem.setAttribute('class', 'order control')
  cardOrdem.textContent = estilo.substring(9, estilo.indexOf('; top'))
  cardCheck.setAttribute('type', 'checkbox')
  cardCheck.setAttribute('onchange', 'checkChange(event)')
  cardCopiar.setAttribute('class', 'duplicate control')
  cardCor.setAttribute('class', 'color control')
  cardEditar.setAttribute('class', 'edit control')
  cardExcluir.setAttribute('id', 'card' + id + 'excluir')
  cardExcluir.setAttribute('class', 'delete control')
  cardBody.setAttribute('id', 'card' + id + 'body')
  if (classe == 'context card') {
    cardBody.setAttribute('class', 'cardBody contextBody')
  } else {
    cardBody.setAttribute('class', 'cardBody')
  }
  if (marcacao == 0) { cardCheck.checked = false } else { cardCheck.checked = true }
  cardBody.textContent = texto
  cardHeader.appendChild(cardCheck)
  cardHeader.appendChild(cardOrdem)
  cardHeader.appendChild(cardCopiar)
  cardHeader.appendChild(cardCor)
  cardHeader.appendChild(cardEditar)
  cardHeader.appendChild(cardExcluir)
  card.appendChild(cardHeader)
  card.appendChild(cardBody)
  document.body.appendChild(card)
}

function montaDadosCard(card) {
  card_class = card.getAttribute('class')
  card_style = card.getAttribute('style')
  card_text = card.children[1].textContent
  if (card.children[0].children[0].checked) { checked = 1 } else { checked = 0 }
  dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text + '&board_id=' + dataQuery('parm', 4) + '&checked=' + checked
  return dadosCard
}

function bodyClick(ev) {
  if (ev.target.tagName == 'BODY') {
    card_text = prompt('Digite o texto do post-it:')
    if (card_text != null) {
      card_class = 'event card'
      card_style = 'z-index: ' + (document.body.childElementCount - 1) + '; top: ' + ev.clientY + 'px; left:' + ev.clientX + 'px;'
      dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text + '&board_id=' + dataQuery('parm', 4) + '&checked=' + 0
      card_id = dataChange('post', 'card', dadosCard, 0)
      changeBroadcast(card_id, 'createCard')
    }
  }
  if (ev.target.getAttribute('class') == 'order control') {
    card = ev.target.parentElement.parentElement
    ordem = prompt('Digite a nova ordem', card.children[0].children[1].textContent)
    if (ordem != null) {
      if (parseInt(ordem) > -1 & parseInt(ordem) < 100) {
        console.log('Alterei a ordem')
        card.style.zIndex = parseInt(ordem)
        dataChange('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
        changeBroadcast(card.id.replace('card', ''), 'updateCard')
      } else {
        alert('Digite um valor válido!')
      }
    }
  }
  if (ev.target.getAttribute('class') == 'duplicate control') {
    card = ev.target.parentElement.parentElement
    console.log('Dupliquei o card')
    card_class = card.getAttribute('class')
    card_style = 'z-index: ' + (document.body.childElementCount - 1) + '; '
    card_style = card_style + 'top: ' + (parseInt(card.style.top.replace('px', '')) + 50) + 'px; '
    card_style = card_style + 'left: ' + (parseInt(card.style.left.replace('px', '')) + 50) + 'px; '
    if (card.style.width != '') {
      card_style = card_style + 'width: ' + card.style.width + '; '
    }
    if (card.style.height != '') {
      card_style = card_style + 'height: ' + card.style.height + ';'
    }
    card_text = card.children[1].textContent
    if (card.children[0].children[0].checked == false) {
      card_check = 0
    } else {
      card_check = 1
    }
    dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text + '&board_id=' + dataQuery('parm', 4) + '&card_check=' + card_check
    card_id = dataChange('post', 'card', dadosCard, 0)
    changeBroadcast(card_id, 'createCard')
  }
  if (ev.target.getAttribute('class') == 'color control') {
    card = ev.target.parentElement.parentElement
    console.log('Cor do card')
    if (classes.indexOf(card.getAttribute('class')) + 1 == classes.length) {
      card_class = classes[0]
      card.children[1].setAttribute('class', 'cardBody')
    } else {
      card_class = classes[classes.indexOf(card.getAttribute('class')) + 1]
      if (card_class == 'context card') {
        card.children[1].setAttribute('class', 'cardBody contextBody')
      }
    }
    card.setAttribute('class', card_class)
    dataChange('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
    changeBroadcast(card.id.replace('card', ''), 'updateCard')
  }
  if (ev.target.getAttribute('class') == 'edit control') {
    if (ev.target.parentElement.parentElement.getAttribute('class') == 'listItem') {
      Item = ev.target.parentElement.parentElement
      texto = prompt('Digite o novo nome do quadro', Item.textContent)
      if (texto != null) {
        Item.textContent = texto
        dataChange('put', 'board', 'board_name=' + texto, Item.id.replace("board", ""))
        changeBroadcast(0, 'boardList')
        showList('board')
      }
    } else {
      card = ev.target.parentElement.parentElement
      texto = prompt('Digite o novo texto', card.children[1].textContent)
      if (texto != null) {
        console.log('Alterei o texto')
        card.children[1].textContent = texto
        dataChange('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
        changeBroadcast
        (card.id.replace('card', ''), 'updateCard')
      }
    }
  }
  if (ev.target.getAttribute('class') == 'delete control') {
    if (ev.target.parentElement.parentElement.getAttribute('class') == 'listItem') {
      Item = ev.target.parentElement.parentElement
      if (Item.parentElement.id == 'snapshotList') {
        dataChange('delete', 'snapshot', '', Item.id.replace("snapshot", ""))
        changeBroadcast(0, 'snapshotList')
        if (dataQuery('parm', 3) == Item.id.replace("snapshot", "")) {
          dataChange('put', 'parm', 'parm_value=' + 1, 3)
          changeBroadcast(0, 'boardView')
        }
        showList('snapshot')
      } else {
        if (confirm('Deseja apagar o quadro e todos os post-its contidos nele')) {
          dataChange('delete', 'board', '', Item.id.replace("board", ""))
          dataChange('delete', 'card-board', '', Item.id.replace("board", ""))
          changeBroadcast(0, 'boardList')
          if (dataQuery('parm', 4) == Item.id.replace("board", "")) {
            dataChange('put', 'parm', 'parm_value=' + 1, 4)
            changeBroadcast(0, 'boardView')
          }
          showList('board')
        }
      }
    } else {
      card = ev.target.parentElement.parentElement
      console.log('Exclui card')
      dataChange('delete', 'card', '', card.id.replace("card", ""))
      changeBroadcast(card.id.replace('card', ''), 'deleteCard')
    }
  }
}

function dragElement(card) {

  elementos = [card]

  for (i = 2; i < document.body.childElementCount; i++) {
    card = document.body.children[i]
    if (card.children[0].children[0].checked) {
      if (elementos.indexOf(card.id) == -1) {
        elementos.unshift(card.id)
      }
    }
  }

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
  for (i = 0; i < elementos.length; i++) {
    elmnt = document.getElementById(elementos[i])
    document.getElementById(elmnt.id + "body").onmousedown = dragMouseDown
  }

  function dragMouseDown() {
    e = window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag() {
    e = window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    for (i = 0; i < elementos.length; i++) {
      elmnt = document.getElementById(elementos[i])
      elmnt.style.top = (elmnt.offsetTop - pos2 * fator) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1 * fator) + "px";
    }
  }

  function closeDragElement() {
    e = window.event;
    e.preventDefault();
    document.onmouseup = null;
    document.onmousemove = null;
    if (e.target.parentElement.getAttribute('style') != null) {
      for (i = 0; i < elementos.length; i++) {
        card = document.getElementById(elementos[i])
        console.log('Alterei a posição')
        dataChange('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
        changeBroadcast(card.id.replace('card', ''), 'updateCard')
      }
    }
  }

}
