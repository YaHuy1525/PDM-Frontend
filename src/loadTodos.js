import todos from './todos.json';
import { Todo } from './todo';
import { format, parseISO } from 'date-fns';

function initializeTodosInLocalStorage() {
    // localStorage.clear();  
    if (!localStorage.getItem('todos')) {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function saveTodosToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromLocalStorage() {
    const savedTodos = localStorage.getItem('todos');
    const parsedTodos = savedTodos ? JSON.parse(savedTodos) : todos;
    return parsedTodos.map(todo => new Todo(
        todo.id, todo.title, todo.description, todo.dueDate, todo.priority, todo.notes, todo.category, todo.isCompleted
    ));
}

export function loadTodos(parentElement) {
    initializeTodosInLocalStorage();

    const ul = document.createElement('ul');
    const todos = loadTodosFromLocalStorage();

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.dataset.todoId = todo.id;
        const formattedDate = format(parseISO(todo.dueDate), 'yyyy-MM-dd');

        const dateSpan = document.createElement('span');
        dateSpan.textContent = formattedDate;
        dateSpan.className = 'due-date';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.isCompleted;

        if (todo.isCompleted) {
            li.classList.add('completed');
        }

        checkbox.addEventListener('change', () => {
            todo.toggleComplete();
            if (checkbox.checked) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }
            saveTodosToLocalStorage(todos);
        });

        const prioritySpan = document.createElement('span');
        prioritySpan.textContent = todo.priority;
        prioritySpan.className = `priority ${todo.priority}`;
        if (todo.isCompleted) {
            prioritySpan.classList.add('completed');
        }

        li.appendChild(checkbox);
        li.appendChild(dateSpan);
        li.appendChild(document.createTextNode(todo.title));
        li.appendChild(prioritySpan);
        ul.appendChild(li);
    });

    let ulElement = parentElement.querySelector('ul');
    if (ulElement) {
        ulElement.replaceWith(ul);
    } else {
        parentElement.appendChild(ul);
    }
}

export { loadTodosFromLocalStorage, saveTodosToLocalStorage };