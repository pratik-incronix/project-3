document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
  const taskInput = document.getElementById('new-task');
  const taskDescription = taskInput.value.trim();

  if (taskDescription === '') {
    alert('Task description cannot be empty.');
    return;
  }

  const task = {
    id: Date.now(),
    description: taskDescription,
    completed: false
  };

  const tasks = getTasksFromLocalStorage();
  tasks.push(task);
  saveTasksToLocalStorage(tasks);
  renderTask(task);

  taskInput.value = '';
}

function renderTask(task) {
  const taskList = document.getElementById('task-list');
  const li = document.createElement('li');
  li.id = task.id;
  li.className = task.completed ? 'completed' : '';
  li.innerHTML = `
    <div class="task-container">
      <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTaskCompletion(${task.id})">
      <span onclick="toggleTaskCompletion(${task.id})">${task.description}</span>
      <input class="edit-input" type="text" value="${task.description}" style="display: none;">
      <button class="save-button" onclick="saveEdit(${task.id})" style="display: none;">Save</button>
    </div>
    <button onclick="editTask(${task.id})">Edit</button>
    <button onclick="deleteTask(${task.id})">Delete</button>
  `;
  taskList.appendChild(li);
}

function loadTasks() {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach(task => renderTask(task));
}

function toggleTaskCompletion(taskId) {
  const tasks = getTasksFromLocalStorage();
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasksToLocalStorage(tasks);
    const taskItem = document.getElementById(taskId.toString());
    taskItem.classList.toggle('completed');
    taskItem.querySelector('input[type="checkbox"]').checked = task.completed;
  }
}

function deleteTask(taskId) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasksToLocalStorage(tasks);
  document.getElementById(taskId.toString()).remove();
}

function editTask(taskId) {
  const taskItem = document.getElementById(taskId.toString());
  const taskDescription = taskItem.querySelector('span');
  const editInput = taskItem.querySelector('.edit-input');
  const saveButton = taskItem.querySelector('.save-button');
  const editButton = taskItem.querySelector('button:nth-child(3)');

  taskDescription.style.display = 'none';
  editInput.style.display = 'inline-block';
  saveButton.style.display = 'inline-block';
  editButton.style.display = 'none';
}

function saveEdit(taskId) {
  const taskItem = document.getElementById(taskId.toString());
  const editInput = taskItem.querySelector('.edit-input');
  const newDescription = editInput.value.trim();

  if (newDescription === '') {
    alert('Task description cannot be empty.');
    return;
  }

  const tasks = getTasksFromLocalStorage();
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.description = newDescription;
    saveTasksToLocalStorage(tasks);
    taskItem.querySelector('span').innerText = newDescription;
    editInput.style.display = 'none';
    taskItem.querySelector('.save-button').style.display = 'none';
    taskItem.querySelector('span').style.display = 'inline-block';
    taskItem.querySelector('button:nth-child(3)').style.display = 'inline-block';
  }
}

function getTasksFromLocalStorage() {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
}

function saveTasksToLocalStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
