const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const descriptionInput = document.getElementById('descriptionInput');
const priorityInput = document.getElementById('priorityInput');
const dueDateInput = document.getElementById('dueDateInput');
const taskList = document.getElementById('taskList');
const filterPriority = document.getElementById('filterPriority');
const searchInput = document.getElementById('searchInput');
const toggleThemeButton = document.getElementById('toggleTheme');
const scrollToTopButton = document.getElementById('scrollToTop');

document.addEventListener('DOMContentLoaded', loadTasks);

function saveTasks() {
    const tasks = [];
    const items = taskList.querySelectorAll('li');
    items.forEach(item => {
        const task = {
            id: item.dataset.id,
            title: item.querySelector('h5').textContent,
            description: item.querySelector('p').textContent,
            priority: item.classList[0],
            dueDate: item.querySelector('p:nth-of-type(2)').textContent.split(': ')[1],
            completed: item.classList.contains('completed')
        };
        tasks.push(task);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => addTaskToList(task));
    }
}

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskValue = taskInput.value.trim();
    const descriptionValue = descriptionInput.value.trim();
    const priorityValue = priorityInput.value;
    const dueDateValue = dueDateInput.value;

    if (taskValue === '') {
        alert('Por favor, insira um título para a tarefa.');
        return;
    }

    const task = {
        id: Date.now().toString(), 
        title: taskValue,
        description: descriptionValue,
        priority: priorityValue,
        dueDate: dueDateValue,
        completed: false
    };

    addTaskToList(task);
    saveTasks(); 
    taskForm.reset();
});

function addTaskToList(task) {
    const listItem = document.createElement('li');
    listItem.classList.add(task.priority);
    listItem.dataset.id = task.id;

    if (task.completed) {
        listItem.classList.add('completed');
    }

    listItem.innerHTML = `
        <h5>${task.title}</h5>
        <p>${task.description}</p>
        <p><strong>Prioridade:</strong> ${task.priority}</p>
        <p><strong>Data de Vencimento:</strong> ${task.dueDate}</p>
        <button class="btn btn-success complete">${task.completed ? 'Desmarcar' : 'Concluir'}</button>
        <button class="btn btn-info edit">Editar</button>
        <button class="btn btn-danger remove">Remover</button>
    `;

    taskList.appendChild(listItem);

    listItem.querySelector('.complete').addEventListener('click', () => toggleComplete(listItem));
    listItem.querySelector('.remove').addEventListener('click', () => removeTask(listItem));
    listItem.querySelector('.edit').addEventListener('click', () => editTask(listItem));
}

function toggleComplete(listItem) {
    listItem.classList.toggle('completed');
    const isCompleted = listItem.classList.contains('completed');
    listItem.querySelector('.complete').textContent = isCompleted ? 'Desmarcar' : 'Concluir';
    saveTasks(); 
}

function removeTask(listItem) {
    listItem.remove();
    saveTasks(); 
}

function editTask(listItem) {
    taskInput.value = listItem.querySelector('h5').textContent;
    descriptionInput.value = listItem.querySelector('p').textContent;
    priorityInput.value = listItem.classList[0];
    dueDateInput.value = listItem.querySelector('p:nth-of-type(2)').textContent.split(': ')[1];
    removeTask(listItem); 
}

filterPriority.addEventListener('change', () => {
    const filterValue = filterPriority.value;
    const items = taskList.querySelectorAll('li');

    items.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});

searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    const items = taskList.querySelectorAll('li');

    items.forEach(item => {
        const title = item.querySelector('h5').textContent.toLowerCase();
        if (title.includes(searchValue)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});

toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    toggleThemeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Escuro';
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});