import { createSidebar } from './sidebar.js';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { todoApi } from './Service/todoService.js';
import { showNewTodoModal } from './todoDetails.js';

export class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.initializeApp();
    }

    async initializeApp() {
        try {
            // Initialize sidebar
            const existingSidebar = document.querySelector('.sidebar');
            if (existingSidebar) {
                const newSidebar = createSidebar();
                existingSidebar.replaceWith(newSidebar);
            } else {
                document.body.appendChild(createSidebar());
            }

            // Create main content area if it doesn't exist
            if (!document.querySelector('.main-content')) {
                const mainContent = document.createElement('div');
                mainContent.className = 'main-content';
                document.body.appendChild(mainContent);

                // Create todo list container
                const todoListContainer = document.createElement('div');
                todoListContainer.className = 'todo-list-container';
                mainContent.appendChild(todoListContainer);
            }
            
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize app: ' + error.message);
        }
    }

    async loadAndRenderTodos() {
        try {
            const todos = await todoApi.getAllTodos();
            this.todos = todos;
            this.renderTodos(this.filterTodos(todos));
        } catch (error) {
            console.error('Failed to load todos:', error);
            this.showError('Failed to load todos: ' + error.message);
        }
    }

    renderTodos(todos) {
        const todoListContainer = document.querySelector('.todo-list-container');
        if (!todoListContainer) return;

        todoListContainer.innerHTML = '';
        const ul = document.createElement('ul');
        ul.className = 'todo-list';

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.dataset.todoId = todo.id;
            li.className = todo.completed ? 'completed' : '';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;

            const title = document.createElement('span');
            title.className = 'todo-title';
            title.textContent = todo.title;

            const date = document.createElement('span');
            date.className = 'due-date';
            if (todo.dueDate) {
                const formattedDate = format(new Date(todo.dueDate), 'yyyy-MM-dd');
                date.textContent = formattedDate;
            }

            const priority = document.createElement('span');
            priority.className = `priority ${todo.priority.toLowerCase()}`;
            priority.textContent = todo.priority;

            li.appendChild(checkbox);
            li.appendChild(title);
            if (todo.dueDate) li.appendChild(date);
            li.appendChild(priority);

            ul.appendChild(li);
        });

        todoListContainer.appendChild(ul);
    }

    filterTodos(todos) {
        if (!Array.isArray(todos)) {
            console.error('Expected todos to be an array but got:', todos);
            return [];
        }

        switch (this.currentFilter) {
            case 'today':
                return todos.filter(todo => todo.dueDate && isToday(new Date(todo.dueDate)));
            case 'thisWeek':
                return todos.filter(todo => todo.dueDate && isThisWeek(new Date(todo.dueDate)));
            case 'thisMonth':
                return todos.filter(todo => todo.dueDate && isThisMonth(new Date(todo.dueDate)));
            case 'completed':
                return todos.filter(todo => todo.completed);
            case 'WORK':
            case 'PERSONAL':
            case 'SHOPPING':
            case 'OTHERS':
                return todos.filter(todo => todo.category === this.currentFilter);
            default:
                return todos;
        }
    }

    setupEventListeners() {
        // Event delegation for sidebar menu items
        document.addEventListener('click', async (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) {
                const timeFilter = menuItem.dataset.time;
                const categoryFilter = menuItem.dataset.category;

                // Update active menu item
                document.querySelectorAll('.menu-item').forEach(item => {
                    item.classList.remove('active');
                });
                menuItem.classList.add('active');

                // Update filter and re-render
                if (timeFilter) {
                    this.currentFilter = timeFilter;
                } else if (categoryFilter) {
                    this.currentFilter = categoryFilter;
                } else if (menuItem.classList.contains('all')) {
                    this.currentFilter = 'all';
                }

                this.renderTodos(this.filterTodos(this.todos));
            }
        });

        // Handle todo item changes
        document.addEventListener('change', async (e) => {
            if (e.target.type === 'checkbox' && e.target.closest('li')) {
                const li = e.target.closest('li');
                const todoId = parseInt(li.dataset.todoId);
                const todo = this.todos.find(t => t.id === todoId);
                
                if (todo) {
                    try {
                        const updatedTodo = { ...todo, completed: e.target.checked };
                        await todoApi.updateTodo(todoId, updatedTodo);
                        await this.loadAndRenderTodos(); // Refresh the list
                    } catch (error) {
                        console.error('Failed to update todo:', error);
                        e.target.checked = !e.target.checked; // Revert the checkbox
                        this.showError('Failed to update todo: ' + error.message);
                    }
                }
            }
        });

        // Handle todos updated event
        document.addEventListener('todosUpdated', () => {
            this.loadAndRenderTodos();
        });
    }

    showError(message) {
        // Create error message element if it doesn't exist
        let errorDiv = document.getElementById('error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'error-message';
            errorDiv.className = 'error-message';
            document.body.appendChild(errorDiv);
        }

        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
});
