import { format, parseISO } from 'date-fns';
import TodoService from './todoService';

export async function filterTodosByCategory(category) {
    const main = document.getElementById('main');
    try {
        const todos = await TodoService.getAllTodos();
        const filteredTodos = category ? todos.filter(todo => todo.category === category) : todos;

        const ul = document.createElement('ul');
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.dataset.todoId = todo.id;
            
            // Format date if it exists
            let formattedDate = '';
            if (todo.dueDate) {
                try {
                    formattedDate = format(parseISO(todo.dueDate), 'yyyy-MM-dd');
                } catch (error) {
                    console.warn('Invalid date format:', todo.dueDate);
                    formattedDate = todo.dueDate;
                }
            }

            const dateSpan = document.createElement('span');
            dateSpan.textContent = formattedDate;
            dateSpan.className = 'due-date';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.isCompleted;

            if (todo.isCompleted) {
                li.classList.add('completed');
            }

            checkbox.addEventListener('change', async () => {
                try {
                    todo.isCompleted = checkbox.checked;
                    await TodoService.updateTodo(todo.id, todo);
                    if (checkbox.checked) {
                        li.classList.add('completed');
                    } else {
                        li.classList.remove('completed');
                    }
                } catch (error) {
                    console.error('Error updating todo:', error);
                    checkbox.checked = !checkbox.checked;
                }
            });

            const titleSpan = document.createElement('span');
            titleSpan.textContent = todo.title;
            titleSpan.className = 'todo-title';

            li.appendChild(checkbox);
            li.appendChild(titleSpan);
            li.appendChild(dateSpan);
            ul.appendChild(li);
        });

        let ulElement = main.querySelector('ul');
        if (ulElement) {
            ulElement.replaceWith(ul);
        } else {
            main.appendChild(ul);
        }
    } catch (error) {
        console.error('Error filtering todos:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Failed to filter todos. Please try again later.';
        main.appendChild(errorDiv);
    }
}
