import { loadTodosFromLocalStorage, saveTodosToLocalStorage } from './loadTodos';
import { format, parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';

export function filterTodosByTime(timePeriod) {
    const main = document.getElementById('main');
    const todos = loadTodosFromLocalStorage();

    let filteredTodos;
    switch (timePeriod) {
        case 'today':
            filteredTodos = todos.filter(todo => isToday(parseISO(todo.dueDate)));
            break;
        case 'thisWeek':
            filteredTodos = todos.filter(todo => isThisWeek(parseISO(todo.dueDate)));
            break;
        case 'thisMonth':
            filteredTodos = todos.filter(todo => isThisMonth(parseISO(todo.dueDate)));
            break;
        default:
            filteredTodos = todos;
    }

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
