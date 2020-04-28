function zoomin() {
  document.body.style.zoom = parseFloat(document.body.style.zoom) + .1
  document.getElementById('toolBar').style.zoom = 1 / parseFloat(document.body.style.zoom)
  manterAPI('put', 'parm', 'parm_value=' + document.body.style.zoom, 1)
  manterAPI('put', 'parm', 'parm_value=' + document.getElementById('toolBar').style.zoom, 2)
}

function zoomout() {
  document.body.style.zoom = parseFloat(document.body.style.zoom) - .1
  document.getElementById('toolBar').style.zoom = 1 / parseFloat(document.body.style.zoom)
  manterAPI('put', 'parm', 'parm_value=' + document.body.style.zoom, 1)
  manterAPI('put', 'parm', 'parm_value=' + document.getElementById('toolBar').style.zoom, 2)
}

function carregamento() {
  dados = consultarAPI('card', 0)
  for (i = 0; i < dados.length; i++) {
    criaCard(dados[i].card_id, dados[i].card_class, dados[i].card_style, dados[i].card_text)
  }
  document.body.style.zoom = consultarAPI('parm', 1)
  document.getElementById('toolBar').style.zoom = consultarAPI('parm', 2)
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
  cardBody.setAttribute('class', 'cardbody')
  if (classe == 'context') {
    cardTitulo.textContent = texto
  } else {
    cardBody.textContent = texto
  }
  cardHeader.appendChild(cardOrdem)
  cardHeader.appendChild(cardTitulo)
  cardHeader.appendChild(cardEditar)
  cardHeader.appendChild(cardExcluir)
  card.appendChild(cardHeader)
  card.appendChild(cardBody)
  document.body.appendChild(card)
  dragElement(document.getElementById('card' + id))
}

function newCard(ev) {
  if (ev.target.id == 'board') {
    console.log('Novo card')
    card_text = prompt('Digite o texto do post-it:')
    if (card_text != null) {
      card_class = 'event'
      card_style = 'z-index: ' + document.body.childElementCount + '; top: ' + ev.clientY + 'px; left:' + ev.clientX + 'px;'
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
        card_class = card.getAttribute('class')
        card_style = card.getAttribute('style')
        if (card_class == 'context') {
          card_text = card.children[0].children[1].textContent
        } else {
          card_text = card.textContent
        }
        dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text
        manterAPI('put', 'card', dadosCard, card.id.replace("card", ""))
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
      if (card.getAttribute('class') == 'context') {
        card.children[0].children[1].textContent = texto
      } else {
        card.children[1].textContent = texto
      }
      card_class = card.getAttribute('class')
      card_style = card.getAttribute('style')
      dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + texto
      manterAPI('put', 'card', dadosCard, card.id.replace("card", ""))
    }
  }
  if (ev.target.getAttribute('class') == 'cardbody') {
    card = ev.target.parentElement
    console.log('Cor do card')
    if (card.getAttribute('class') == 'event') {
      card_class = 'command'
      card_text = card.children[1].textContent
    } else if (ev.target.parentElement.getAttribute('class') == 'command') {
      card_class = 'aggregate'
      card_text = card.children[1].textContent
    } else if (ev.target.parentElement.getAttribute('class') == 'aggregate') {
      card_class = 'context'
      card_text = card.children[1].textContent
      card.children[0].children[1].textContent = card_text
      card.children[1].textContent = ''
    } else {
      card_class = 'event'
      card_text = card.children[0].children[1].textContent
      card.children[1].textContent = card_text
      card.children[0].children[1].textContent = ''
    }
    card.setAttribute('class', card_class)
    card_class = card.getAttribute('class')
    card_style = card.getAttribute('style')
    dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text
    manterAPI('put', 'card', dadosCard, card.id.replace("card", ""))
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
      if (card.getAttribute('class') == 'context') {
        card_text = card.children[0].children[1].textContent
      } else {
        card_text = card.children[1].textContent
      }
      card_class = card.getAttribute('class')
      card_style = card.getAttribute('style')
      dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text
      manterAPI('put', 'card', dadosCard, card.id.replace("card", ""))
    }
  }
}