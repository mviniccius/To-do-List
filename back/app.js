var clc = require("cli-color");

var funcao = require("./funcao.js");

var resultado = funcao.validarIdade(18)

if(resultado){
    console.log(clc.green("pode tirar carteria"));
}else{
    console.log(clc.red("deve ter 18 anos para comecar a tirar carteria"));
}


console.log(clc.green("imprimindo verde!"));

var http = require("http");

http.createServer(function(request, response){
    response.write("primeiros passos no NodeJs fazendo Servidor");
    response.end();
}).listen(8081);

console.log(clc.green("Servidor rodando na porta 8081"))