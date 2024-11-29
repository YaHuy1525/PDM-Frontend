import './styles.css';
import { createSidebar } from './sidebar';
import { loadTodos } from './loadTodos';
import { addTitle } from './addTitle';
import { showTodoDetails } from './todoDetails';
import TodoService from './todoService';

class TodoApp {
    constructor() {
        createSidebar();
        loadTodos();
        createSidebar();
        showTodoDetails();
        this.todos = [];
        this.initializeApp();
    }

    async initializeApp() {
        try {
            // Create sidebar and main container
            createSidebar();
            const main = document.createElement('div');
            main.id = 'main';
            document.body.appendChild(main);

            // Add title
            addTitle('My Todo', main);

            // Load and display todos
            await this.loadAndDisplayTodos(main);

            // Add event delegation for todo items
            main.addEventListener('click', (e) => {
                const todoItem = e.target.closest('li');
                if (todoItem && !e.target.matches('input[type="checkbox"]')) {
                    const todoId = Number(todoItem.dataset.todoId);
                    showTodoDetails(todoId);
                }
            });
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize the application. Please try again later.');
        }
    }

    async loadAndDisplayTodos(container) {
        try {
            await loadTodos(container);
        } catch (error) {
            console.error('Failed to load todos:', error);
            this.showError('Failed to load todos. Please try again later.');
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    async addTodo(todoData) {
        try {
            const newTodo = await TodoService.createTodo(todoData);
            await this.loadAndDisplayTodos(document.getElementById('main'));
            return newTodo;
        } catch (error) {
            console.error('Failed to add todo:', error);
            this.showError('Failed to add todo. Please try again.');
            throw error;
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
    window.app = app;
});
