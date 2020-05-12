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
      propagaMudanca(card.id.replace('card',''),'U')
    }
  }
}

function zoomin() {
  novoZoom = consultarAPI('parm', 1) + .1
  fator = 1/novoZoom
  document.body.style.transform = 'scale(' + novoZoom + ')'
  document.getElementById('toolBar').style.transform = 'scale(' + (fator) + ')'
  manterAPI('put', 'parm', 'parm_value=' + novoZoom, 1)
  manterAPI('put', 'parm', 'parm_value=' + (fator), 2)
  document.getElementById('toolBar').children[1].textContent = parseInt(novoZoom * 100) + '%'
  propagaMudanca(novoZoom,'Z')
}

function zoomout() {
  novoZoom = consultarAPI('parm', 1) - .1
  fator = 1/novoZoom
  document.body.style.transform = 'scale(' + novoZoom + ')'
  document.getElementById('toolBar').style.transform = 'scale(' + (fator) + ')'
  manterAPI('put', 'parm', 'parm_value=' + novoZoom, 1)
  manterAPI('put', 'parm', 'parm_value=' + (fator), 2)
  document.getElementById('toolBar').children[1].textContent = parseInt(novoZoom * 100) + '%'
  propagaMudanca(novoZoom,'Z')
}

function carregamento() {
  dados = consultarAPI('card', 0)
  for (i = 0; i < dados.length; i++) {
    criaCard(dados[i].card_id, dados[i].card_class, dados[i].card_style, dados[i].card_text)
  }
  document.body.style.transform = 'scale(' + consultarAPI('parm', 1) + ')'
  classes = ['event', 'command', 'aggregate', 'condition', 'context']
  fator = consultarAPI('parm', 2)
  tamanhoCard = ''
  document.getElementById('toolBar').style.transform = 'scale(' + fator + ')'
  document.getElementById('toolBar').children[1].textContent = parseInt(consultarAPI('parm', 1) * 100) + '%'
}

function criaCard(id, classe, estilo, texto) {
  card = document.createElement('div')
  cardHeader = document.createElement('div')
  cardTitulo = document.createElement('div')
  cardOrdem = document.createElement('div')
  cardCor = document.createElement('div')
  cardEditar = document.createElement('div')
  cardExcluir = document.createElement('div')
  cardBody = document.createElement('div')
  card.setAttribute('id', 'card' + id)
  card.setAttribute('class', classe)
  card.setAttribute('style', estilo)
  card.setAttribute('onmousedown','mouseDown(event)')
  card.setAttribute('onmouseup','mouseUp(event)')
  cardHeader.setAttribute('id', 'card' + id + 'header')
  cardHeader.setAttribute('class', 'cardheader')
  cardTitulo.setAttribute('class', 'cardtitle')
  cardOrdem.setAttribute('class', 'cardordem')
  cardOrdem.textContent = estilo.substring(9, estilo.indexOf('; top'))
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
  cardBody.textContent = texto
  cardHeader.appendChild(cardOrdem)
  cardHeader.appendChild(cardTitulo)
  cardHeader.appendChild(cardCor)
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
      card_style = 'z-index: ' + (document.body.childElementCount - 2) + '; top: ' + ev.clientY + 'px; left:' + ev.clientX + 'px;'
      dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text
      card_id = manterAPI('post', 'card', dadosCard, 0)
      criaCard(card_id.seq, card_class, card_style, card_text)
      propagaMudanca(card_id.seq,'C')
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
        propagaMudanca(card.id.replace('card',''),'U')
      } else {
        alert('Digite um valor válido!')
      }
    }
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
    propagaMudanca(card.id.replace('card',''),'U')
  }
  if (ev.target.getAttribute('class') == 'cardeditar') {
    card = ev.target.parentElement.parentElement
    texto = prompt('Digite o novo texto')
    if (texto != null) {
      console.log('Alterei o texto')
      card.children[1].textContent = texto
      manterAPI('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
      propagaMudanca(card.id.replace('card',''),'U')
    }
  }
  if (ev.target.getAttribute('class') == 'cardexcluir') {
    card = ev.target.parentElement.parentElement
    console.log('Exclui card')
    card.remove()
    manterAPI('delete', 'card', '', card.id.replace("card", ""))
    propagaMudanca(card.id.replace('card',''),'D')
  }
}

function dragElement(elmnt) {
  
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
  document.getElementById(elmnt.id + "body").onmousedown = dragMouseDown

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
    elmnt.style.top = (elmnt.offsetTop - pos2*fator) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1*fator) + "px";
  }

  function closeDragElement() {
    e = window.event;
    e.preventDefault();
    document.onmouseup = null;
    document.onmousemove = null;
    if (e.target.parentElement.getAttribute('style') != null) {
      card = e.target.parentElement
      console.log('Alterei a posição')
      manterAPI('put', 'card', montaDadosCard(card), card.id.replace("card", ""))
      propagaMudanca(card.id.replace('card',''),'U')
    }
  }

}
