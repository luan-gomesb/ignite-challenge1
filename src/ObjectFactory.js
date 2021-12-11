const {v4 : uuidv4}  = require("uuid")

function createUser(name, username){
 
  return {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
}
function createTodo(title, deadline){
  // const prazoInMiliSeconds = 1000*60*60*24*5;
  return {
    id: uuidv4(),
    title,
    done:false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
}
module.exports = {createUser, createTodo};

