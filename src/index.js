import './styles.css';
import { createSidebar } from './sidebar.js';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { todoApi } from './Service/todoService.js';
import { labelApi } from './Service/labelService.js';
import { showEditTodoModal } from './todoDetails.js';
import { LoginPage } from './login';
import { boardApi } from './Service/boardService.js'; // Import boardApi
import './login.css';

export class TodoApp {
    constructor() {
        this.todos = [];
        this.labels = new Map();
        this.boards = [];
        this.currentFilter = 'all';
        this.currentBoardId = null;
        this.initializeApp();
    }

    async initializeApp() {
        try {
            console.log('Initializing app...');
            this.boards = await boardApi.getAllBoards(); // Load boards
            console.log('Boards loaded:', this.boards);

            const mainContent = document.querySelector('main');
            if (!mainContent) {
                throw new Error('Main content element not found');
            }

            // Create sidebar
            const sidebar = createSidebar();
            if (sidebar) {
                document.body.insertBefore(sidebar, mainContent);
            }

            let todoListContainer = document.querySelector('.todo-list-container');
            todoListContainer = document.createElement('div');
            todoListContainer.className = 'todo-list-container';
            mainContent.appendChild(todoListContainer);
        
            
            this.setupEventListeners();
            await this.loadAndRenderTodos();
            console.log('App initialization complete');
        } catch (error) {
            console.error('Failed to initialize app:', error);
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
            } else if (this.currentFilter && this.currentFilter !== 'all') {
                todos = await todoApi.getFilteredTodos(this.currentFilter);
            } else {
                todos = await todoApi.getAllTodos();
            }
            
            console.log('Todos loaded:', todos);
            this.todos = todos;
            this.renderTodos(todos);
            console.log('Render complete');
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    renderTodos(todos) {
        const todoListContainer = document.querySelector('.todo-list-container');
        if (!todoListContainer) return;

        todoListContainer.innerHTML = '';
        
        // Create header container
        const headerContainer = document.createElement('div');
        headerContainer.className = 'header-container';
        
        // Add title
        const title = document.createElement('h1');
        title.textContent = this.getBoardTitle();
        const description = document.createElement('p');
        const boardDescription = this.getBoardDescription();
        if (boardDescription) {
            description.textContent = boardDescription;
            title.appendChild(description);
        }
        headerContainer.appendChild(title);
        todoListContainer.appendChild(headerContainer);

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
                    const newStatus = e.target.checked ? 'Done' : 'Ongoing';
                    //update todo with new status
                    await todoApi.updateTodo(todo.taskId, { ...todo, status: newStatus });
                    await this.loadAndRenderTodos();
                } catch (error) {
                    console.error('Error updating todo status:', error);
                    e.target.checked = !e.target.checked;
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
            deleteBtn.onclick = async (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this task?')) {
                    try {
                        await todoApi.deleteTodo(todo.taskId);
                        await this.loadAndRenderTodos();
                    } catch (error) {
                        console.error('Error deleting todo:', error);
                    }
                }
            };
            li.appendChild(taskContent);
            li.appendChild(deleteBtn);
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

    getBoardTitle() {
        if (this.currentBoardId) {
            const board = this.boards.find(b => b.boardId === this.currentBoardId);
            return board.name;
        }

        switch (this.currentFilter) {
            case 'today':
                return "Today's Tasks";
            case 'thisWeek':
                return 'This Week\'s Tasks';
            case 'thisMonth':
                return 'This Month\'s Tasks';
            default:
                return 'All Tasks';
        }
    }

    getBoardDescription() {
        if (this.currentBoardId && this.boards) {
            const board = this.boards.find(b => b.boardId === this.currentBoardId);
            return board.description;
        }
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

    async refreshBoards() {
        try {
            this.boards = await boardApi.getAllBoards();
            console.log('Boards refreshed:', this.boards);
        } catch (error) {
            console.error(error);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', async (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) {
                const timeFilter = menuItem.dataset.time;
                const boardId = menuItem.dataset.boardId;

                document.querySelectorAll('.menu-item').forEach(item => {
                    item.classList.remove('active');
                });
                menuItem.classList.add('active');

                if (timeFilter) {
                    this.currentFilter = timeFilter;
                    this.currentBoardId = null;
                } else if (boardId) {
                    await this.refreshBoards(); // Refresh boards before setting currentBoardId
                    this.currentBoardId = parseInt(boardId);
                    this.currentFilter = 'all';
                } else if (menuItem.classList.contains('all')) {
                    this.currentFilter = 'all';
                    this.currentBoardId = null;
                }
                await this.loadAndRenderTodos();
            }
        });

        document.addEventListener('todosUpdated', () => {
            this.loadAndRenderTodos();
        });

        document.addEventListener('boardsUpdated', async () => {
            await this.refreshBoards();
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                const newSidebar = createSidebar();
                sidebar.replaceWith(newSidebar);
            }
            this.loadAndRenderTodos();
        });

        document.addEventListener('change', async (e) => {
            if (e.target.type === 'checkbox' && e.target.closest('li')) {
                const li = e.target.closest('li');
                const todoId = parseInt(li.dataset.todoId);
                const status = e.target.checked ? 'Done' : 'Ongoing';

                try {
                    await todoApi.updateTodo(todoId, { status });
                    li.className = status === 'Done' ? 'completed':'';
                } catch (error) {
                    console.error('Failed to update todo:', error);
            
                    e.target.checked = !e.target.checked;
                }
            }
        });
    }

}

const token = localStorage.getItem('userToken');
const userId = localStorage.getItem('userId');

if (!token || !userId) {
    document.body.innerHTML = `
    <div class="container" id="container">
        <div class="form-container sign-up">
            <form action="register" method="post" class="register-form">
                <h1 class="welcome">Create Account</h1>
                <input type="text" id="username" placeholder="Username" required>
                <input type="text" id="fullName" placeholder="Full Name" required>
                <input type="email" id="user-email" placeholder="Email" required>
                <input type="password" id="user-pass" placeholder="Password" required>
                <input type="password" id="confirmed-pass" placeholder="Confirmed Password" required>
                <span id="error-message" class="error" style="display: none;">Password does not match</span>
                <a href="#" id="term-of-use">Terms of use</a>
                <button type="submit" class="submit">Sign Up</button>
            </form>
        </div>

        <div class="form-container sign-in">
            <form action="login" method="post" class="login-form">
                <h1 class="welcome">Login</h1>
                <input type="text" id="username" placeholder="Username" required>
                <input type="password" id="user-pass" placeholder="Password" required>
                <a href="#" class="forgot-pass">Forgot your password?</a>
                <button type="submit" class="submit">Login</button>
            </form>
        </div>

        <div class="toggle-container">
            <div class="toggle">
                <div class="toggle-panel toggle-left">
                    <h1>Register</h1>
                    <p>Register with your personal details NOWWW        Im not asking twice!!!!</p>
                    <button class="hidden" id="login">Sign In</button>
                </div>
                <div class="toggle-panel toggle-right">
                    <h1>What is the other way to say "inside a log"??</h1>
                    <p>Its LOGIN!!!!</p>
                    <button class="hidden" id="register">switch</button>
                </div>
            </div>
        </div>
    </div>`;
    new LoginPage();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new TodoApp();
    });
}
