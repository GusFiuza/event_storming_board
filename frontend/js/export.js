function openFile() {
    arquivo = document.getElementById("file").files[0]
    if (arquivo != null) {
        board_name = arquivo.name.replace('.json','')
        dadosBoard = 'board_name=' + board_name
        board_id = manterAPI('post', 'board', dadosBoard, 0)
        criaBoard(board_id, board_name)
        propagaMudanca(0, 'B')
        manterAPI('put', 'parm', 'parm_value=' + board_id, 4)
        loadFileAsText()
    }
}

function saveFile() {
    board_name = consultarAPI('board', consultarAPI('parm', 4)).board_name
    board_cards = consultarAPI('card-board', consultarAPI('parm', 4) + '&9999-12-31 23:59:59')
    saveTextAsFile(board_name + '.json', JSON.stringify(board_cards))
}

function saveTextAsFile(nome,arquivo) {
    var textToSave = arquivo
    var textToSaveAsBlob = new Blob([textToSave], { type: "text/json" });
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = nome
    var downloadLink = document.createElement("a");

    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function loadFileAsText() {
    var file = document.getElementById("file").files[0];
    var fileReader = new FileReader();
    
    fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        dados = JSON.parse(textFromFileLoaded)
        card_board = consultarAPI('parm', 4)
        for (i=0;i<dados.length;i++) {
            card_class = dados[i].card_class
            card_style = dados[i].card_style
            card_text = dados[i].card_text
            card_check = dados[i].card_check
            dadosCard = 'card_class=' + card_class + '&card_style=' + card_style + '&card_text=' + card_text + '&board_id=' + card_board + '&checked=' + card_check
            card_id = manterAPI('post', 'card', dadosCard, 0)
        }
        propagaMudanca(0, 'AS')
    };
    
    fileReader.readAsText(file, "UTF-8");
}