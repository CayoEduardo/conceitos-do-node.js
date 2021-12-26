const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user)
    return response.status(404).json({ error: "Usuário inexistente!" });
  else {
    request.user = user;
    return next();
  }
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const usuario = users.find((user) => user.username === username);

  if (!!usuario) {
    return response.status(400).json({ error: "Usuário já cadastrado." });
  } else {
    const newUser = {
      id: uuidv4(),
      name,
      username,
      todos: [],
    };

    users.push(newUser);

    return response.status(201).json(newUser);
  }
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { username } = request.headers;

  const usuarioIndex = users.findIndex((user) => user.username === username);

  const id = uuidv4();

  const newTodo = {
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  users[usuarioIndex].todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) return response.status(404).json({ error: "Todo não existente" });

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if (todo) {
    todo.done = true;

    return response.status(201).json(todo);
  } else return response.status(404).json({ error: "Todo não encontrado!" });
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);
  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (todo) {
    user["todos"].splice(todoIndex, 1);
    return response.status(204).json({ message: "Todo removido com sucesso!" });
  } else return response.status(404).json({ error: "Todo não encontrado!" });
});

module.exports = app;
