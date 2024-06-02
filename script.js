const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

let todos = [];

window.onload = () => {
  loadTodosFromDatabase();
};

function newTodo() {
  let text = prompt("Enter TODO");
  if (text) {
    const todo = { text: text, checked: false };
    addTodoToDatabase(todo);
  }
}

function addTodoToDatabase(todo) {
  fetch('https://prz9-aadb7-default-rtdb.europe-west1.firebasedatabase.app/todos.json', {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log("Todo added successfully:", data);
    const todoId = data.name;
    todo.id = todoId;
    todos.push(todo); 
    render();  
  })
  .catch(error => {
    console.error("Error adding todo:", error);
  });
}


function loadTodosFromDatabase() {
  document.getElementById('loading-message').style.display = 'block';
  fetch('https://prz9-aadb7-default-rtdb.europe-west1.firebasedatabase.app/todos.json')
  .then(response => response.json())
  .then(data => {
    todos = [];
    for (let key in data) {
      let todo = data[key];
      todo.id = key;
      todos.push(todo);
    }
    render();
    document.getElementById('loading-message').style.display = 'none';
  })
  .catch(error => {
    document.getElementById('loading-message').style.display = 'none';
    document.getElementById('error-message').innerText = "Error loading todos: " + error.message;
  });
}

function render() {
  list.innerHTML = todos.map(todo => renderTodo(todo)).join("");
  updateCounter();
}

function renderTodo(todo) {
  return `<li class="list-group-item">
    <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.checked ? "checked" : ""} onChange="checkTodo('${todo.id}')"/>
    <label for="${todo.id}"><span class="${todo.checked ? "text-success text-decoration-line-through" : ""}">${todo.text}</span></label>
    <button class="btn btn-danger btn-sm float-end" onClick="deleteTodo('${todo.id}')">delete</button>
  </li>`;
}

function updateCounter() {
  itemCountSpan.textContent = todos.length;
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.checked).length;
}

function deleteTodo(id) {
  fetch(`https://prz9-aadb7-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    console.log("Todo deleted successfully:", data);
    loadTodosFromDatabase();
  })
  .catch(error => {
    console.error("Error deleting todo:", error);
  });
}

function checkTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.checked = !todo.checked;
    updateTodoInDatabase(id, todo);
  }
}

function updateTodoInDatabase(id, todo) {
  fetch(`https://prz9-aadb7-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`, {
    method: 'PATCH',
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log("Todo updated successfully:", data);
    loadTodosFromDatabase();
  })
  .catch(error => {
    console.error("Error updating todo:", error);
  });
}
