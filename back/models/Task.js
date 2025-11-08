const mongoose = require("mongoose");

const toDoSchemas = new mongoose.Schema({
  //Conteudo da tarefa
  title: {
    type: String,
    required: true,
    trim: true,
  },
  //status da tarefa
  completed: {
    type: Boolean,
    default: false, //comecar a tarefa como nao completa
  },
  //data da criacao
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//exportar para ser utilizado por outros modulos
module.exports = mongoose.model("Todo", toDoSchemas);
