document.getElementById('task-form').addEventListener('submit', getTask);

function getTask(event)
{
    event.preventDefault();
    const input = document.getElementById('task_name');
    const value = input.value.trim();
    if (input.value.trim() === '') {
        alert('La tarea no tiene ningun contenido.');
        return false;
    }

	let tasks = JSON.parse(window.localStorage.getItem('tasks'));
	if(tasks === null || !Array.isArray(tasks))
		tasks = []; 

	tasks.push({ text: value, done:false });
	window.localStorage.setItem('tasks',JSON.stringify(tasks))

    input.value = '';
    updateTodoList();
}

function updateTodoList()
{
    const ul = document.getElementById('todo-list');
    ul.innerHTML = '';

	const tasks = JSON.parse(window.localStorage.getItem('tasks') || []);
    if (!Array.isArray(tasks)) return;

	tasks.forEach((taskObj, index) =>  {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!taskObj.done;
        checkbox.addEventListener('change', () => toggleDone(index));
        checkbox.classList.add('task-checkbox');

        const span = document.createElement('span');
        span.textContent = taskObj.text;
        span.classList.add('task-text');
        if (taskObj.done) span.classList.add('completed');

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => removeTask(index));

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.type = 'button';
        editButton.addEventListener('click', () => showEditForm(index, taskObj.text))

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        ul.appendChild(li);
    });
}

function showEditForm(index, currentText){
    let existingForm = document.getElementById('edit-form');
    if (existingForm) existingForm.remove();

    const container = document.querySelector('.container');
    const form = document.createElement('form');
    form.id = 'edit-form';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.required = true;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Guardar cambios';
    saveButton.type = 'submit';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.type = 'button';
    cancelButton.addEventListener('click', () => form.remove());

    form.appendChild(input);
    form.appendChild(saveButton);
    form.appendChild(cancelButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        updateTask(index, input.value.trim());
        form.remove();
    });

    container.appendChild(form);
}

function updateTask(index, newText) {
    let tasks = JSON.parse(window.localStorage.getItem('tasks')) || [];
    if (newText === '') {
        alert('La tarea no puede quedar vacía.');
        return;
    }
    tasks[index].text = newText;
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTodoList();
}

function toggleDone(index) {
  let tasks = JSON.parse(window.localStorage.getItem('tasks') || '[]');
  if (!Array.isArray(tasks) || !tasks[index]) return;
  tasks[index].done = !tasks[index].done;
  window.localStorage.setItem('tasks', JSON.stringify(tasks));
  updateTodoList();
}

function removeTask(index) {
  let tasks = JSON.parse(window.localStorage.getItem('tasks') || '[]');
  if (!Array.isArray(tasks)) return;
  tasks.splice(index, 1);
  window.localStorage.setItem('tasks', JSON.stringify(tasks));
  updateTodoList();
}

updateTodoList();