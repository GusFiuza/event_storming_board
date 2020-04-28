classes = ['event', 'command', 'aggregate', 'condition', 'context']

function clicou(ev) {
  if (ev.target.getAttribute('class') != null) {
    if (classes.includes(ev.target.getAttribute('class'))) {
      console.log(ev.target)
    }
  }
}

function soltou(ev) {
  if (ev.target.getAttribute('class') != null) {
    if (classes.includes(ev.target.getAttribute('class'))) {
      console.log(ev.target)
    }
  }
}

function zoomin() {
  novoZoom = consultarAPI('parm', 1) + .1
  document.body.style.transform = 'scale(' + novoZoom + ')'
  document.getElementById('toolBar').style.transform = 'scale(' + (1 / novoZoom) + ')'
  manterAPI('put', 'parm', 'parm_value=' + novoZoom, 1)
  manterAPI('put', 'parm', 'parm_value=' + (1 / novoZoom), 2)
  document.getElementById('toolBar').children[1].textContent = parseInt(novoZoom * 100) + '%'
}

function zoomout() {
  novoZoom = consultarAPI('parm', 1) - .1
  document.body.style.transform = 'scale(' + novoZoom + ')'
  document.getElementById('toolBar').style.transform = 'scale(' + (1 / novoZoom) + ')'
  manterAPI('put', 'parm', 'parm_value=' + novoZoom, 1)
  manterAPI('put', 'parm', 'parm_value=' + (1 / novoZoom), 2)
  document.getElementById('toolBar').children[1].textContent = parseInt(novoZoom * 100) + '%'
}

function carregamento() {
  dados = consultarAPI('card', 0)
  for (i = 0; i < dados.length; i++) {
    criaCard(dados[i].card_id, dados[i].card_class, dados[i].card_style, dados[i].card_text)
  }
  document.body.style.transform = 'scale(' + consultarAPI('parm', 1) + ')'
  document.getElementById('toolBar').style.transform = 'scale(' + consultarAPI('parm', 2) + ')'
  document.getElementById('toolBar').children[1].textContent = parseInt(consultarAPI('parm', 1) * 100) + '%'
}

function criaCard(id, classe, estilo, texto) {
  card = document.createElement('div')
  cardHeader = document.createElement('div')
  cardTitulo = document.createElement('div')
  cardOrdem = document.createElement('div')
  cardEditar = document.createElement('div')
  cardExcluir = document.createElement('div')
  cardBody = document.createElement('div')
  card.setAttribute('id', 'card' + id)
  card.setAttribute('class', classe)
  card.setAttribute('style', estilo)
  cardHeader.setAttribute('id', 'card' + id + 'header')
  cardHeader.setAttribute('class', 'cardheader')
  cardTitulo.setAttribute('class', 'cardtitle')
  cardOrdem.setAttribute('class', 'cardordem')
  cardOrdem.textContent = estilo.substring(9, estilo.indexOf('; top'))
  cardEditar.setAttribute('class', 'cardeditar')
  cardExcluir.setAttribute('id', 'card' + id + 'excluir')
  cardExcluir.setAttribute('class', 'cardexcluir')
  cardBody.setAttribute('id', 'card' + id + 'body')
  if (classe == 'context') {
    cardBody.setAttribute('class', 'cardbodycontext')
  } else {
    cardBody.setAttribute('class', 'cardbody')
  }
  cardBody.textContent = texto
  cardHeader.appendChild(cardOrdem)
  cardHeader.appendChild(cardTitulo)
  cardHeader.appendChild(cardEditar)
  cardHeader.appendChild(cardExcluir)
  card.appendChild(cardHeader)
  card.appendChild(cardBody)
  document.body.appendChild(card)
  dragElement(document.getElementById('card' + id))
}

function montaDadosCard(card) {
  card_class = card.getAttribute('class')
  card_style = card.getAttribute('style')
  card_text = card.children[1].textContent
  dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text
  return dadosCard
}

function newCard(ev) {
  if (ev.target.id == 'board') {
    console.log('Novo card')
    card_text = prompt('Digite o texto do post-it:')
    if (card_text != null) {
      card_class = 'event'
      card_style = 'z-index: ' + (document.body.childElementCount - 1) + '; top: ' + ev.clientY + 'px; left:' + ev.clientX + 'px;'
      dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text
      card_id = manterAPI('post', 'card', dadosCard, 0)
      criaCard(card_id.seq, card_class, card_style, card_text)
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
      } else {
        alert('Digite um valor válido!')
      }
    }
  }
  if (ev.target.getAttribute('class') == 'cardeditar') {
    card = ev.target.parentElement.parentElement
    texto = prompt('Digite o novo texto')
    if (texto != null) {
      console.log('Alterei o texto')
      card.children[1].textContent = texto
      manterAPI('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
    }
  }
  if (ev.target.getAttribute('class').substring(0, 8) == 'cardbody') {
    card = ev.target.parentElement
    console.log('Cor do card')
    if (card.getAttribute('class') == 'event') {
      card_class = 'command'
    } else if (card.getAttribute('class') == 'command') {
      card_class = 'aggregate'
    } else if (card.getAttribute('class') == 'aggregate') {
      card_class = 'condition'
    } else if (card.getAttribute('class') == 'condition') {
      card_class = 'context'
      card.children[1].setAttribute('class', 'cardbodycontext')
    } else {
      card_class = 'event'
      card.children[1].setAttribute('class', 'cardbody')
    }
    card.setAttribute('class', card_class)
    manterAPI('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
  }
  if (ev.target.getAttribute('class') == 'cardexcluir') {
    card = ev.target.parentElement.parentElement
    console.log('Exclui card')
    card.remove()
    manterAPI('delete', 'card', '', card.id.replace("card", ""))
  }
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  function closeDragElement(e) {
    e = e || window.event;
    e.preventDefault();
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    if (e.target.parentElement.parentElement.getAttribute('style') != null) {
      card = e.target.parentElement.parentElement
      console.log('Alterei a posição')
      manterAPI('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
    }
  }
}
