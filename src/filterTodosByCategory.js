import { loadTodosFromLocalStorage } from './loadTodos';
import { format, parseISO } from 'date-fns';

export function filterTodosByCategory(category) {
    const main = document.getElementById('main');
    const todos = loadTodosFromLocalStorage();

    const filteredTodos = category ? todos.filter(todo => todo.category === category) : todos;

    const ul = document.createElement('ul');
    filteredTodos.forEach(todo => {
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
            if (checkbox.checked) {
                li.classList.add('completed');
                todo.isCompleted = true;
            } else {
                li.classList.remove('completed');
                todo.isCompleted = false;
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

    let ulElement = main.querySelector('ul');
    if (ulElement) {
        ulElement.replaceWith(ul);
    } else {
        main.appendChild(ul);
    }
}
