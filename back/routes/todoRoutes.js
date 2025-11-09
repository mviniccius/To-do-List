const express = require("express");
const router = express.Router();
const todoController = require("../controller/TaskController");

router.route("/")
  .get(todoController.getTodos)
  .post(todoController.createTodo);

router
  .route("/:id")
  .put(todoController.updateTodo)
  .delete(todoController.deleteTodo);

module.exports = router;
