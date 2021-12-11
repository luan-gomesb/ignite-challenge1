const express = require('express');
const cors = require('cors');
const {createUser, createTodo} = require("./ObjectFactory");

// const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const  username  =  request.body.username || request.headers.username;
  const userAlreadExist =  checkUserAlreadyExists(username);
  if(userAlreadExist){
    next();
  }else{
    return response.status(400).json({error:"User Not Found."});
  }
}

function checkUserAlreadyExists(username){
  return users.some((u) => (u.username === username));
}
function getUserByUsername(username){
  return users.find((u) => (u.username === username));
}
function getTodoById(id,todos){
  return todos.find((t) => (t.id === id));
}
//retorna nosa lista sem todo excluido
function removeTodoById(id,todos){
  return todos.filter((t) => (t.id !== id));
}


app.get('/',(request, response) => {
  return response.json(users);
});

app.post('/users',(request, response) => {
  const {name, username} = request.body;
  const userAlreadExist =  checkUserAlreadyExists(username);
  if(!userAlreadExist){
    const newUser =  createUser(name, username);
    users.push(newUser);
    return response.status(201).json(newUser);
  }else{
    response.status(400).json({error:"User Already Exists."});
  }
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const user = getUserByUsername(username);
  if(user){
    return response.status(200).json(user.todos);
  }

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title , deadline } =  request.body;
  const  user  = getUserByUsername(username);
  const newTodo = createTodo(title, deadline);
  user.todos.push(newTodo);
  return response.status(201).json(newTodo);
});
 
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const { title, deadline } =  request.body;
  const { id } = request.params;
  const user = getUserByUsername(username);
  const todo = getTodoById(id, user.todos);
  if(todo){
    todo.title = title;
    todo.deadline = deadline;
    return response.status(200).json(todo);
  }else{
    return response.status(404).json({error:"ToDo Not Found."});
  }

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;
  const user = getUserByUsername(username);
  const todo = getTodoById(id, user.todos);
  if(todo){
    todo.done = true;
    return response.status(200).json(todo);
  }else{
    return response.status(404).json({error:"ToDo Not Found."});
    
  }
  
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;
  const user = getUserByUsername(username);
  const todo = getTodoById(id, user.todos);
  console.log({username, user,todo});

  if(!todo) return response.status(404).json({error:"ToDo Not Found."});
  
  user.todos = removeTodoById(id, user.todos);
  return response.status(204).send();
});

module.exports = app;