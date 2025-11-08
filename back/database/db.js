const mongoose = require("mongoose");
var cli = require("cli-color");

const MONGODB_URI = "mongodb://localhost:27017";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(cli.green("MongoDB conectado com sucesso!"));
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados: ");
    process.exit(1);
  }
};

module.exports = connectDB;
