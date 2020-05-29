function checkChange(ev) {
  card = ev.target.parentElement.parentElement
  manterAPI('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
  propagaMudanca(card.id.replace('card', ''), 'U')
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
      manterAPI('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
      propagaMudanca(card.id.replace('card', ''), 'U')
    }
  }
}

function zoomin() {
  novoZoom = consultarAPI('parm', 1) + .1
  fator = 1 / novoZoom
  document.body.style.transform = 'scale(' + novoZoom + ')'
  document.getElementById('toolBar').style.transform = 'scale(' + (fator) + ')'
  manterAPI('put', 'parm', 'parm_value=' + novoZoom, 1)
  manterAPI('put', 'parm', 'parm_value=' + (fator), 2)
  document.getElementById('toolBar').children[1].textContent = parseInt(novoZoom * 100) + '%'
  propagaMudanca(novoZoom, 'Z')
}

function zoomout() {
  novoZoom = consultarAPI('parm', 1) - .1
  fator = 1 / novoZoom
  document.body.style.transform = 'scale(' + novoZoom + ')'
  document.getElementById('toolBar').style.transform = 'scale(' + (fator) + ')'
  manterAPI('put', 'parm', 'parm_value=' + novoZoom, 1)
  manterAPI('put', 'parm', 'parm_value=' + (fator), 2)
  document.getElementById('toolBar').children[1].textContent = parseInt(novoZoom * 100) + '%'
  propagaMudanca(novoZoom, 'Z')
}

function boards() {
  menu = document.getElementById('bMenu').hidden
  if (menu) {
    document.getElementById('bMenu').removeAttribute('hidden')
  } else {
    document.getElementById('bMenu').setAttribute('hidden', '')
  }
}

function snapshot() {
  menu = document.getElementById('ssMenu').hidden
  if (menu) {
    document.getElementById('ssMenu').removeAttribute('hidden')
  } else {
    document.getElementById('ssMenu').setAttribute('hidden', '')
  }
}

function novoBoard() {
  board_name = prompt('Digite um nome para seu quadro:')
  if (board_name != null) {
    dadosBoard = 'board_name=' + board_name
    board_id = manterAPI('post', 'board', dadosBoard, 0)
    criaBoard(board_id, board_name)
    propagaMudanca(0, 'B')
  } else {
    document.getElementById('bMenu').setAttribute('hidden', '')
  }
}

function novoSnapshot() {
  snap_name = prompt('Digite um nome para seu snapshot:')
  if (snap_name != null) {
    dadosSnapshot = 'snap_name=' + snap_name
    snap_id = manterAPI('post', 'snap', dadosSnapshot, 0)
    criaSnapshot(snap_id, snap_name)
    propagaMudanca(0, 'S')
  } else {
    document.getElementById('ssMenu').setAttribute('hidden', '')
  }
}

function criaBoard(id, nome) {
  boardItem = document.createElement('div')
  boardItem.setAttribute('id', 'bItem' + id)
  boardItem.setAttribute('class', 'ssItem')
  boardItem.setAttribute('onclick', 'boardItemClick(' + id + ')')
  boardItem.textContent = nome
  boardControls = document.createElement('div')
  boardControls.setAttribute('class', 'controles')
  boardEditar = document.createElement('div')
  boardEditar.setAttribute('class', 'cardeditar')
  boardExcluir = document.createElement('div')
  boardExcluir.setAttribute('class', 'cardexcluir')
  boardControls.appendChild(boardEditar)
  boardControls.appendChild(boardExcluir)
  boardItem.appendChild(boardControls)
  document.getElementById('bMenu').appendChild(boardItem)
  document.getElementById('bMenu').setAttribute('hidden', '')
}

function criaSnapshot(id, nome) {
  snapItem = document.createElement('div')
  snapItem.setAttribute('id', 'ssItem' + id)
  snapItem.setAttribute('class', 'ssItem')
  snapItem.setAttribute('onclick', 'snapItemClick(' + id + ')')
  snapItem.textContent = nome
  boardControls = document.createElement('div')
  boardControls.setAttribute('class', 'controles')
  snapExcluir = document.createElement('div')
  snapExcluir.setAttribute('class', 'cardexcluir')
  boardControls.appendChild(snapExcluir)
  snapItem.appendChild(boardControls)
  document.getElementById('ssMenu').appendChild(snapItem)
  document.getElementById('ssMenu').setAttribute('hidden', '')
}

function boardItemClick(id) {
  if (event.target.id.substring(0, 1) == 'b') {
    console.log('Board clicado')
    manterAPI('put', 'parm', 1, 3)
    manterAPI('put', 'parm', 'parm_value=' + id, 4)
    propagaMudanca(0, 'AS')
    document.getElementById('bMenu').setAttribute('hidden', '')
  }
  console.log(consultarAPI('parm', 4))
}

function snapItemClick(id) {
  if (event.target.id.substring(0, 1) == 's') {
    console.log('Snapshot clicado')
    manterAPI('put', 'parm', 'parm_value=' + id, 3)
    propagaMudanca(0, 'AS')
    document.getElementById('ssMenu').setAttribute('hidden', '')
  }
}

function carregaCards() {
  filhos = document.body.childElementCount
  for (i = 2; i < filhos; i++) {
    document.body.children[2].remove()
  }
  dados = consultarAPI('card-board', consultarAPI('parm', 4) + '&' + consultarAPI('snap', consultarAPI('parm', 3)).snap_timestamp)
  for (i = 0; i < dados.length; i++) {
    criaCard(dados[i].card_id, dados[i].card_class, dados[i].card_style, dados[i].card_text, dados[i].card_check)
  }
}

function carregamento() {
  dados = consultarAPI('snap', 0)
  for (i = 0; i < dados.length; i++) {
    if (i == 0) {
      document.getElementById('ssItem1').textContent = dados[i].snap_name
    } else {
      criaSnapshot(dados[i].snap_id, dados[i].snap_name)
    }
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
  dados = consultarAPI('card-board', consultarAPI('parm', 4) + '&' + consultarAPI('snap', consultarAPI('parm', 3)).snap_timestamp)
  for (i = 0; i < dados.length; i++) {
    criaCard(dados[i].card_id, dados[i].card_class, dados[i].card_style, dados[i].card_text, dados[i].card_check)
  }
  document.body.style.transform = 'scale(' + consultarAPI('parm', 1) + ')'
  classes = ['event', 'command', 'aggregate', 'condition', 'context']
  fator = consultarAPI('parm', 2)
  tamanhoCard = ''
  document.getElementById('toolBar').style.transform = 'scale(' + fator + ')'
  document.getElementById('toolBar').children[1].textContent = parseInt(consultarAPI('parm', 1) * 100) + '%'
}

function criaCard(id, classe, estilo, texto, marcacao) {
  card = document.createElement('div')
  cardHeader = document.createElement('div')
  cardTitulo = document.createElement('div')
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
  cardHeader.setAttribute('class', 'cardheader')
  cardTitulo.setAttribute('class', 'cardtitle')
  cardOrdem.setAttribute('class', 'cardordem')
  cardOrdem.textContent = estilo.substring(9, estilo.indexOf('; top'))
  cardCheck.setAttribute('type', 'checkbox')
  cardCheck.setAttribute('onchange','checkChange(event)')
  cardCopiar.setAttribute('class', 'cardduplicar')
  cardCor.setAttribute('class', 'cardcor')
  cardEditar.setAttribute('class', 'cardeditar')
  cardExcluir.setAttribute('id', 'card' + id + 'excluir')
  cardExcluir.setAttribute('class', 'cardexcluir')
  cardBody.setAttribute('id', 'card' + id + 'body')
  if (classe == 'context') {
    cardBody.setAttribute('class', 'cardbodycontext')
  } else {
    cardBody.setAttribute('class', 'cardbody')
  }
  if (marcacao == 0) {cardCheck.checked = false} else {cardCheck.checked = true}
  cardBody.textContent = texto
  cardHeader.appendChild(cardCheck)
  cardHeader.appendChild(cardOrdem)
  cardHeader.appendChild(cardTitulo)
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
  if (card.children[0].children[0].checked) {checked = 1} else {checked = 0}
  dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text + '&board_id=' + consultarAPI('parm', 4) + '&checked=' + checked
  return dadosCard
}

function newCard(ev) {
  if (ev.target.id == 'board') {
    console.log('Novo card')
    card_text = prompt('Digite o texto do post-it:')
    if (card_text != null) {
      card_class = 'event'
      card_style = 'z-index: ' + (document.body.childElementCount - 1) + '; top: ' + ev.clientY + 'px; left:' + ev.clientX + 'px;'
      dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text + '&board_id=' + consultarAPI('parm', 4) + '&checked=' + 0
      card_id = manterAPI('post', 'card', dadosCard, 0)
      criaCard(card_id, card_class, card_style, card_text, 0)
      propagaMudanca(card_id, 'C')
    }
  }
  if (ev.target.getAttribute('class') == 'cardordem') {
    card = ev.target.parentElement.parentElement
    ordem = prompt('Digite a nova ordem')
    if (ordem != null) {
      if (parseInt(ordem) > -1 & parseInt(ordem) < 100) {
        console.log('Alterei a ordem')
        card.style.zIndex = parseInt(ordem)
        manterAPI('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
        card.children[0].children[0].textContent = ordem
        propagaMudanca(card.id.replace('card', ''), 'U')
      } else {
        alert('Digite um valor válido!')
      }
    }
  }
  if (ev.target.getAttribute('class') == 'cardduplicar') {
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
    card_check = card.children[0].children[0].checked
    dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text + '&board_id=' + consultarAPI('parm', 4) + '&card_check=' + card_check
    card_id = manterAPI('post', 'card', dadosCard, 0)
    criaCard(card_id, card_class, card_style, card_text, card_check)
    propagaMudanca(card_id, 'C')
  }
  if (ev.target.getAttribute('class') == 'cardcor') {
    card = ev.target.parentElement.parentElement
    console.log('Cor do card')
    if (classes.indexOf(card.getAttribute('class')) + 1 == classes.length) {
      card_class = classes[0]
      card.children[1].setAttribute('class', 'cardbody')
    } else {
      card_class = classes[classes.indexOf(card.getAttribute('class')) + 1]
      if (card_class == 'context') {
        card.children[1].setAttribute('class', 'cardbodycontext')
      }
    }
    card.setAttribute('class', card_class)
    manterAPI('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
    propagaMudanca(card.id.replace('card', ''), 'U')
  }
  if (ev.target.getAttribute('class') == 'cardeditar') {
    if (ev.target.parentElement.parentElement.getAttribute('class').substring(0, 2) == 'ss') {
      Item = ev.target.parentElement.parentElement
      texto = prompt('Digite o novo nome do quadro')
      if (texto != null) {
        Item.textContent = texto
        manterAPI('put', 'board', 'board_name=' + texto, Item.id.replace("bItem", ""))
        propagaMudanca(0, 'B')
        document.getElementById('bMenu').setAttribute('hidden', '')
      }
    } else {
      card = ev.target.parentElement.parentElement
      texto = prompt('Digite o novo texto')
      if (texto != null) {
        console.log('Alterei o texto')
        card.children[1].textContent = texto
        manterAPI('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
        propagaMudanca(card.id.replace('card', ''), 'U')
      }
    }
  }
  if (ev.target.getAttribute('class') == 'cardexcluir') {
    if (ev.target.parentElement.parentElement.getAttribute('class').substring(0, 2) == 'ss') {
      Item = ev.target.parentElement.parentElement
      if (Item.id.substring(0, 1) == 's') {
        manterAPI('delete', 'snap', '', Item.id.replace("ssItem", ""))
        propagaMudanca(0, 'S')
        if (consultarAPI('parm', 3) == Item.id.replace("ssItem", "")) {
          manterAPI('put', 'parm', 'parm_value=' + 1, 3)
          propagaMudanca(0, 'AS')
        }
        document.getElementById('ssMenu').setAttribute('hidden', '')
      } else {
        if (confirm('Deseja apagar o quadro e todos os post-its contidos nele')) {
          manterAPI('delete', 'board', '', Item.id.replace("bItem", ""))
          manterAPI('delete', 'card-board', '', Item.id.replace("bItem", ""))
          propagaMudanca(0, 'B')
          if (consultarAPI('parm', 4) == Item.id.replace("bItem", "")) {
            manterAPI('put', 'parm', 'parm_value=' + 1, 4)
            propagaMudanca(0, 'AS')
          }
          document.getElementById('bMenu').setAttribute('hidden', '')
        }
      }
    } else {
      card = ev.target.parentElement.parentElement
      console.log('Exclui card')
      card.remove()
      manterAPI('delete', 'card', '', card.id.replace("card", ""))
      propagaMudanca(card.id.replace('card', ''), 'D')
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
        manterAPI('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
        propagaMudanca(card.id.replace('card', ''), 'U')
      }
    }
  }

}
