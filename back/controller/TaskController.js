const { to } = require("cli-color/move");
const Todo = require("../models/Task");

//criar o CRUD das tarefas
//buscar tarefas
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos); //Envia a lista de tarefas
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//criar tarefa
exports.createTodo = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "O campo titulo é obrigatório " });
  }

  try {
    const newTodo = new Todo({ title });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Atualizar tarefa
exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!todo) {
      return res.status(404).json({ message: "Tarefa nao encontrada" });
    }
    res.status(200).json(todo);
  } catch (error) {}
  res.status(404).json({ message: error.message });
};

//Deletar tarefa
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(400).json({ message: "Tarefa nao encontrada!" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
};
