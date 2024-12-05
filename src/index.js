import { createSidebar } from './sidebar.js';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { todoApi } from './Service/todoService.js';
import { showNewTodoModal } from './todoDetails.js';

export class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.currentBoardId = null;
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
            await this.loadAndRenderTodos();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize app: ' + error.message);
        }
    }

    async loadAndRenderTodos() {
        try {
            let todos;
            if (this.currentBoardId) {
                todos = await todoApi.getTodosByBoard(this.currentBoardId);
            } else {
                todos = await todoApi.getAllTodos();
            }
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
        
        if (todos.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'No todos to display';
            todoListContainer.appendChild(emptyMessage);
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'todo-list';

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.dataset.todoId = todo.taskId;
            li.className = todo.status === 'Done' ? 'completed' : '';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.status === 'Done';

            const title = document.createElement('span');
            title.className = 'todo-title';
            title.textContent = todo.title;

            const date = document.createElement('span');
            date.className = 'due-date';
            if (todo.dueDate) {
                const formattedDate = format(new Date(todo.dueDate), 'yyyy-MM-dd');
                date.textContent = formattedDate;
            }

            li.appendChild(checkbox);
            li.appendChild(title);
            if (todo.dueDate) li.appendChild(date);

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
                return todos.filter(todo => todo.status === 'Done');
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
                const boardId = menuItem.dataset.boardId;

                // Update active menu item
                document.querySelectorAll('.menu-item').forEach(item => {
                    item.classList.remove('active');
                });
                menuItem.classList.add('active');

                // Update filter and re-render
                if (timeFilter) {
                    this.currentFilter = timeFilter;
                    this.currentBoardId = null;
                } else if (boardId) {
                    this.currentBoardId = parseInt(boardId);
                    this.currentFilter = 'all';
                } else if (menuItem.classList.contains('all')) {
                    this.currentFilter = 'all';
                    this.currentBoardId = null;
                }

                await this.loadAndRenderTodos();
            }
        });

        // Listen for todo updates
        document.addEventListener('todosUpdated', () => {
            this.loadAndRenderTodos();
        });

        // Listen for board updates
        document.addEventListener('boardsUpdated', () => {
            // Refresh the sidebar when boards are updated
            const existingSidebar = document.querySelector('.sidebar');
            if (existingSidebar) {
                const newSidebar = createSidebar();
                existingSidebar.replaceWith(newSidebar);
            }
            this.loadAndRenderTodos();
        });

        // Handle todo item changes
        document.addEventListener('change', async (e) => {
            if (e.target.type === 'checkbox' && e.target.closest('li')) {
                const li = e.target.closest('li');
                const todoId = parseInt(li.dataset.todoId);
                const status = e.target.checked ? 'Done' : 'Ongoing';

                try {
                    await todoApi.updateTodo(todoId, { status });
                    li.className = status === 'Done' ? 'completed' : '';
                } catch (error) {
                    console.error('Failed to update todo:', error);
                    this.showError('Failed to update todo: ' + error.message);
                    // Revert checkbox state on error
                    e.target.checked = !e.target.checked;
                }
            }
        });
    }

    showError(message) {
        // You can implement a more sophisticated error display mechanism
        alert(message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
});
