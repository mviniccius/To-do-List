const express = require("express");
const connectDB = require("./database/db"); // conexao com o banco
const todoRoutes = require("./routes/todoRoutes"); //Rotas para o CRUD
const cors = require("cors");

//conectar DB
connectDB();

const app = express();

app.use(cors());

// Permite que o Express leia o corpo das requisições como JSON (muito importante para o POST e PUT)
app.use(express.json());

// Toda requisição que começar com /api/todos será tratada pelo 'todoRoutes'
app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.send("API da To-Do List rodando! Use /api/todos para acessar as rotas.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor rodando na porta:  ${PORT}`));
