import { format, parseISO } from 'date-fns';
import TodoService from './todoService';
import { showTodoDetails } from './todoDetails';

async function loadTodosFromBackend(boardId = null) {
    try {
        const tasks = await TodoService.getAllTasks(boardId);
        const labels = await TodoService.getLabels();
        
        // Enhance tasks with label information
        return tasks.map(task => ({
            ...task,
            label: labels.find(l => l.id === task.label_id)
        }));
    } catch (error) {
        console.error('Error loading tasks from backend:', error);
        return [];
    }
}

export async function loadTodos(parentElement, boardId = null) {
    const ul = document.createElement('div');
    ul.className = 'todo-list';
    try {
        const tasks = await loadTodosFromBackend(boardId);
        tasks.forEach(task => {
            const li = document.createElement('div');
            li.className = 'todo-item';
            li.dataset.taskId = task.id;
            
            if (task.status === 'completed') {
                li.classList.add('completed');
            }

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.checked = task.status === 'completed';
            checkbox.addEventListener('change', async () => {
                try {
                    task.status = checkbox.checked ? 'completed' : 'pending';
                    await TodoService.updateTask(task.id, task);
                    li.classList.toggle('completed', checkbox.checked);
                } catch (error) {
                    console.error('Error updating task:', error);
                    checkbox.checked = !checkbox.checked;
                }
            });

            // Task Content
            const content = document.createElement('div');
            content.className = 'todo-content';

            // Title
            const title = document.createElement('span');
            title.className = 'todo-title';
            title.textContent = task.title;

            // Date Badge
            const date = document.createElement('span');
            date.className = 'todo-date';
            if (task.due_date) {
                try {
                    date.textContent = format(parseISO(task.due_date), 'yyyy-MM-dd');
                } catch (error) {
                    console.warn('Invalid date format:', task.due_date);
                    date.textContent = task.due_date;
                }
            }

            // Priority Label
            if (task.label) {
                const priority = document.createElement('span');
                priority.className = `todo-priority priority-${task.label.name.toLowerCase()}`;
                priority.textContent = task.label.name;
                priority.style.backgroundColor = task.label.color;
                content.appendChild(priority);
            }

            content.appendChild(title);
            content.appendChild(date);

            li.appendChild(checkbox);
            li.appendChild(content);

            // Click handler for task details
            li.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    showTodoDetails(task.id);
                }
            });

            ul.appendChild(li);
        });

        if (parentElement) {
            const existingUl = parentElement.querySelector('div.todo-list');
            if (existingUl) {
                existingUl.remove();
            }
            parentElement.appendChild(ul);
        }

        return ul;
    } catch (error) {
        console.error('Error in loadTodos:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Failed to load tasks. Please try again later.';
        if (parentElement) {
            parentElement.appendChild(errorDiv);
        }
        return errorDiv;
    }
}

export { loadTodosFromBackend };