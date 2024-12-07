import './styles.css';
import { createSidebar } from './sidebar.js';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { todoApi } from './Service/todoService.js';
import { labelApi } from './Service/labelService.js';
import { showNewTodoModal, showEditTodoModal } from './todoDetails.js';

export class TodoApp {
    constructor() {
        this.todos = [];
        this.labels = new Map();
        this.currentFilter = 'all';
        this.currentBoardId = null;
        this.initializeApp();
    }

    async initializeApp() {
        try {
            console.log('Initializing app...');
            const mainContent = document.querySelector('main');
            if (!mainContent) {
                throw new Error('Main content element not found');
            }

            // Create sidebar
            const sidebar = createSidebar();
            if (sidebar) {
                document.body.insertBefore(sidebar, mainContent);
            }

            // Create todo list container if it doesn't exist
            let todoListContainer = document.querySelector('.todo-list-container');
            if (!todoListContainer) {
                todoListContainer = document.createElement('div');
                todoListContainer.className = 'todo-list-container';
                mainContent.appendChild(todoListContainer);
            }
            
            this.setupEventListeners();
            await this.loadAndRenderTodos();
            console.log('App initialization complete');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize app: ' + error.message);
        }
    }

    async loadAndRenderTodos() {
        try {
            console.log('Loading data...');
            // Load labels first
            const labels = await labelApi.getAllLabels();
            console.log('Labels loaded:', labels);
            this.labels.clear();
            labels.forEach(label => {
                this.labels.set(label.labelId, label);
            });

            // Then load todos
            let todos;
            if (this.currentBoardId) {
                todos = await todoApi.getTodosByBoard(this.currentBoardId);
            } else {
                todos = await todoApi.getAllTodos();
            }
            console.log('Todos loaded:', todos);
            
            this.todos = todos;
            this.renderTodos(this.filterTodos(todos));
            console.log('Render complete');
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load data: ' + error.message);
        }
    }

    renderTodos(todos) {
        const todoListContainer = document.querySelector('.todo-list-container');
        if (!todoListContainer) return;

        todoListContainer.innerHTML = '';
        
        // Add title
        const title = document.createElement('h1');
        title.textContent = 'Todo List';
        todoListContainer.appendChild(title);
        
        if (!todos || todos.length === 0) {
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

            // Create task content container
            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';

            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.status === 'Done';
            checkbox.addEventListener('change', async (e) => {
                try {
                    const newStatus = e.target.checked ? 'Done' : 'Pending';
                    await todoApi.updateTodo(todo.taskId, { ...todo, status: newStatus });
                    await this.loadAndRenderTodos();
                } catch (error) {
                    console.error('Error updating todo status:', error);
                    this.showError('Failed to update todo status');
                    e.target.checked = !e.target.checked; // Revert checkbox state
                }
            });
            taskContent.appendChild(checkbox);

            // Create title container
            const titleContainer = document.createElement('div');
            titleContainer.className = 'title-container';

            // Title
            const title = document.createElement('span');
            title.className = 'todo-title';
            title.textContent = todo.title;
            titleContainer.appendChild(title);

            // Label
            if (todo.labelId) {
                const label = document.createElement('span');
                label.className = 'priority';
                const labelData = this.labels.get(todo.labelId);
                if (labelData) {
                    label.style.backgroundColor = labelApi.getColorForLabel(labelData.name);
                    label.textContent = labelData.name;
                    titleContainer.appendChild(label);
                }
            }

            taskContent.appendChild(titleContainer);

            // Date element
            if (todo.dueDate) {
                const date = document.createElement('span');
                date.className = 'due-date';
                const formattedDate = format(new Date(todo.dueDate), 'yyyy-MM-dd');
                date.textContent = formattedDate;
                taskContent.appendChild(date);
            }

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-todo-btn';
            deleteBtn.innerHTML = 'X';
            deleteBtn.title = 'Delete task';
            deleteBtn.onclick = async (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this task?')) {
                    try {
                        await todoApi.deleteTodo(todo.taskId);
                        await this.loadAndRenderTodos();
                    } catch (error) {
                        console.error('Error deleting todo:', error);
                        this.showError('Failed to delete todo');
                    }
                }
            };

            // Add task content and delete button to li
            li.appendChild(taskContent);
            li.appendChild(deleteBtn);

            // Edit mode
            li.addEventListener('click', (e) => {
                if (e.target === checkbox || e.target === deleteBtn || e.target.closest('.delete-todo-btn')) {
                    return;
                }
                showEditTodoModal(todo);
            });

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
            
                    e.target.checked = !e.target.checked;
                }
            }
        });
    }

    showError(message) {
        const todoListContainer = document.querySelector('.todo-list-container');
        if (todoListContainer) {
            todoListContainer.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
});
