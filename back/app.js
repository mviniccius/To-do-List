var clc = require("cli-color");

var funcao = require("./funcao.js");

var resultado = funcao.validarIdade(18)

if(resultado){
    console.log(clc.green("pode tirar carteria"));
}else{
    console.log(clc.red("deve ter 18 anos para comecar a tirar carteria"));
}


console.log(clc.green("imprimindo verde!"));