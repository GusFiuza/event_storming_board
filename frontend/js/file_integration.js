function openFile() {
    file = document.getElementById("file").files[0]
    if (file != null) {
        boardName = file.name.replace('.json','')
        boardData = 'board_name=' + boardName
        boardId = dataChange('post', 'board', boardData, 0)
        createBoard(boardId, boardName)
        dataChange('put', 'parm', 'parm_value=' + boardId, 4)
        loadFileAsText()
        changeBroadcast(0, 'boardList')
    }
}

function saveFile() {
    boardName = dataQuery('board', dataQuery('parm', 4)).board_name
    boardCards = dataQuery('card-board', dataQuery('parm', 4) + '&9999-12-31 23:59:59')
    saveTextAsFile(boardName + '.json', JSON.stringify(boardCards))
}

function saveTextAsFile(nome,file) {
    var textToSave = file
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
        data = JSON.parse(textFromFileLoaded)
        cardBoard = dataQuery('parm', 4)
        for (i=0;i<data.length;i++) {
            cardClass = data[i].card_class
            cardStyle = data[i].card_style
            cardText = data[i].card_text
            cardCheck = data[i].card_check
            cardData = 'card_class=' + cardClass + '&card_style=' + cardStyle + '&card_text=' + cardText + '&board_id=' + cardBoard + '&checked=' + cardCheck
            dataChange('post', 'card', cardData, 0)
        }
        changeBroadcast(0, 'boardView')
    };
    fileReader.readAsText(file, "UTF-8");
}
