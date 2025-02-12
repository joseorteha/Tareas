// Seleccionar elementos del DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const allTasksBtn = document.getElementById('allTasksBtn');
const pendingTasksBtn = document.getElementById('pendingTasksBtn');
const completedTasksBtn = document.getElementById('completedTasksBtn');

// Cargar tareas desde localStorage al iniciar
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Función para guardar tareas en localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para renderizar las tareas
function renderTasks(filter = 'all') {
    taskList.innerHTML = ''; // Limpiar la lista antes de renderizar

    let filteredTasks = tasks;

    if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.classList.toggle('completed', task.completed);

        // Animación al agregar tarea
        li.style.animation = 'fadeIn 0.5s ease-in-out';

        // Botón para eliminar la tarea
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = function() {
            tasks.splice(index, 1); // Eliminar la tarea del array
            saveTasksToLocalStorage(); // Guardar cambios en localStorage
            renderTasks(); // Volver a renderizar la lista
        };

        // Botón para editar la tarea
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.classList.add('edit-btn');
        editBtn.onclick = function() {
            const newText = prompt('Editar tarea:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                saveTasksToLocalStorage(); // Guardar cambios en localStorage
                renderTasks(); // Volver a renderizar la lista
            }
        };

        // Marcar tarea como completada
        li.onclick = function() {
            task.completed = !task.completed;
            saveTasksToLocalStorage(); // Guardar cambios en localStorage
            renderTasks(); // Volver a renderizar la lista
        };

        // Añadir botones al elemento de lista
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        // Añadir la tarea a la lista
        taskList.appendChild(li);
    });
}

// Función para agregar una nueva tarea
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Por favor, escribe una tarea.');
        return;
    }

    // Crear un nuevo objeto de tarea
    const newTask = {
        text: taskText,
        completed: false
    };

    tasks.push(newTask); // Agregar la tarea al array
    saveTasksToLocalStorage(); // Guardar en localStorage
    renderTasks(); // Renderizar la lista

    // Limpiar el input
    taskInput.value = '';
}

// Agregar tarea cuando se hace clic en el botón
addTaskBtn.addEventListener('click', addTask);

// También permitir agregar tarea presionando Enter
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Filtrar tareas según el botón seleccionado
allTasksBtn.addEventListener('click', function() {
    setActiveButton(allTasksBtn);
    renderTasks('all');
});

pendingTasksBtn.addEventListener('click', function() {
    setActiveButton(pendingTasksBtn);
    renderTasks('pending');
});

completedTasksBtn.addEventListener('click', function() {
    setActiveButton(completedTasksBtn);
    renderTasks('completed');
});

// Función para marcar el botón activo
function setActiveButton(button) {
    const buttons = [allTasksBtn, pendingTasksBtn, completedTasksBtn];
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Drag and Drop
let draggedTask = null;

taskList.addEventListener('dragstart', function(event) {
    draggedTask = event.target;
    setTimeout(() => {
        event.target.style.display = 'none';
    }, 0);
});

taskList.addEventListener('dragend', function(event) {
    setTimeout(() => {
        event.target.style.display = 'block';
        draggedTask = null;
    }, 0);
});

taskList.addEventListener('dragover', function(event) {
    event.preventDefault();
});

taskList.addEventListener('drop', function(event) {
    event.preventDefault();
    if (draggedTask && event.target.tagName === 'LI') {
        const tasksArray = Array.from(taskList.querySelectorAll('li'));
        const fromIndex = tasksArray.indexOf(draggedTask);
        const toIndex = tasksArray.indexOf(event.target);

        // Reorganizar en el array de tareas
        const [movedTask] = tasks.splice(fromIndex, 1);
        tasks.splice(toIndex, 0, movedTask);

        saveTasksToLocalStorage(); // Guardar cambios en localStorage
        renderTasks(); // Volver a renderizar la lista
    }
});

// Animación CSS
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);

// Renderizar las tareas al cargar la página
renderTasks();