const customExpress = require('./src/config/customExpress')
const database = require('./src/infraestrutura/conexao')
        
const app = customExpress()

database.all("CREATE TABLE IF NOT EXISTS parm (parm_id INTEGER PRIMARY KEY, parm_value FLOAT NOT NULL);", (err) => {
    if (err) {
        console.log("Erro na criação da tabela de parâmetros: " + err)
    }
})

database.each("SELECT * FROM sqlite_master WHERE type='table';", (err, conteudo) => {
    if (conteudo.rootpage == 2) {
        console.log("Tabelas existentes:")
    }
    console.log('- ' + conteudo.name)
})

app.listen(3000, () => console.log('Servidor rodando na porta 8002'))

