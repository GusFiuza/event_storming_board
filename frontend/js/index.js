function carregamento() {
  dados = consultarAPI(0)
  for (i=0;i<dados.length;i++) {
    printCard(dados[i])
  }
}

function printCard(dados) {
  card = document.createElement('div')
  cardHeader = document.createElement('div')
  cardEditar = document.createElement('div')
  cardExcluir = document.createElement('div')
  cardBody = document.createElement('div')
  card.setAttribute('id', 'card' + dados.card_id)
  card.setAttribute('class', dados.card_class)
  card.setAttribute('style', dados.card_style)
  cardHeader.setAttribute('id', 'card' + dados.card_id + 'header')
  cardHeader.setAttribute('class', 'cardheader')
  cardEditar.setAttribute('class', 'cardeditar')
  cardEditar.textContent = '...'
  cardExcluir.setAttribute('id', 'card' + dados.card_id + 'excluir')
  cardExcluir.setAttribute('class', 'cardexcluir')
  cardExcluir.textContent = 'x'
  cardBody.setAttribute('id', 'card' + dados.card_id + 'body')
  cardBody.setAttribute('class', 'cardbody')
  cardBody.textContent = dados.card_text
  cardHeader.appendChild(cardEditar)
  cardHeader.appendChild(cardExcluir)
  card.appendChild(cardHeader)
  card.appendChild(cardBody)
  document.body.appendChild(card)
  dragElement(document.getElementById('card' + dados.card_id))
}

function newCard(ev) {
  if (ev.target.id == 'seletor') {
    if (document.getElementById('quadro').getAttribute('hidden') != null) {
      document.getElementById('quadro').removeAttribute('hidden')
    } else {
      document.getElementById('quadro').setAttribute('hidden','')
    }
  }
  if (ev.target.id == 'board') {
    console.log('Novo card')
    texto = prompt('Digite o texto do post-it:')
    if (texto != null) {
      dadosCard = `card_class=event&
      card_style=top: `+ ev.clientY + `px; left:` + ev.clientX + `px; &
      card_text=`+ texto    
      idCard = manterAPI('post',dadosCard,0)
      card = document.createElement('div')
      cardHeader = document.createElement('div')
      cardEditar = document.createElement('div')
      cardExcluir = document.createElement('div')
      cardBody = document.createElement('div')
      card.setAttribute('id', 'card' + idCard.seq)
      card.setAttribute('class', 'event')
      cardHeader.setAttribute('id', 'card' + idCard.seq + 'header')
      cardHeader.setAttribute('class', 'cardheader')
      cardEditar.setAttribute('class', 'cardeditar')
      cardEditar.textContent = '...'
      cardExcluir.setAttribute('id', 'card' + idCard.seq + 'excluir')
      cardExcluir.setAttribute('class', 'cardexcluir')
      cardExcluir.textContent = 'x'
      cardBody.setAttribute('id', 'card' + idCard.seq + 'body')
      cardBody.setAttribute('class', 'cardbody')
      cardBody.textContent = texto
      cardHeader.appendChild(cardEditar)
      cardHeader.appendChild(cardExcluir)
      card.appendChild(cardHeader)
      card.appendChild(cardBody)
      card.style.top = ev.clientY + "px";
      card.style.left = ev.clientX + "px";
      document.body.appendChild(card)
      dragElement(document.getElementById('card' + idCard.seq))
    }
  } 
  if (ev.target.getAttribute('class') == 'cardeditar') {
    texto = prompt('Digite o novo texto')
    if (texto != null) {
      console.log('Alterei o texto')
      ev.target.parentElement.parentElement.children[1].textContent = texto
      dadosCard = `card_class=` + ev.target.parentElement.parentElement.getAttribute('class') + `&
      card_style=`+ ev.target.parentElement.parentElement.getAttribute('style') + `&
      card_text=`+ texto
      manterAPI('put',dadosCard,ev.target.parentElement.parentElement.id.replace("card", ""))
    }
  } 
  if (ev.target.getAttribute('class') == 'cardbody') {
    console.log('Cor do card')
    if (ev.target.parentElement.getAttribute('class') == 'event') {
      ev.target.parentElement.setAttribute('class', 'command')
      dadosCard = `card_class=command&
      card_style=`+ ev.target.parentElement.getAttribute('style') + `&
      card_text=`+ ev.target.textContent    
    } else if (ev.target.parentElement.getAttribute('class') == 'command') {
      ev.target.parentElement.setAttribute('class', 'aggregate')
      dadosCard = `card_class=aggregate&
      card_style=`+ ev.target.parentElement.getAttribute('style') + `&
      card_text=`+ ev.target.textContent 
    } else {
      ev.target.parentElement.setAttribute('class', 'event')
      dadosCard = `card_class=event&
      card_style=`+ ev.target.parentElement.getAttribute('style') + `&
      card_text=`+ ev.target.textContent 
    }
    manterAPI('put',dadosCard,ev.target.parentElement.id.replace("card", ""))
  } 
  if (ev.target.getAttribute('class') == 'cardexcluir') {
    console.log('Exclui card')
    ev.target.parentElement.parentElement.remove()
    manterAPI('delete','',ev.target.parentElement.parentElement.id.replace("card", ""))
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

    if (e.target.parentElement.getAttribute('style') != null) {
      console.log('Alterei a posição')
      dadosCard = `card_class=`+ e.target.parentElement.getAttribute('class') + `&
      card_style=`+ e.target.parentElement.getAttribute('style') + `&
      card_text=`+ e.target.parentElement.textContent.substring(4)
      manterAPI('put',dadosCard,e.target.parentElement.id.replace("card", ""))
    }
  }
}