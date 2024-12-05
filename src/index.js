import './styles.css';
import { createSidebar } from './sidebar';
import { loadTodos } from './loadTodos';
import { addTitle } from './addTitle';
import { showTodoDetails } from './todoDetails';

// document.addEventListener('DOMContentLoaded', () => {
//   const sidebar = createSidebar();
//   document.body.appendChild(sidebar);

//   const main = document.createElement('div');
//   main.id = 'main';
//   document.body.appendChild(main);

//   addTitle('My Todo', main);
//   loadTodos(main);

//   // Add event delegation for todo items
//   main.addEventListener('click', (e) => {
//     const todoItem = e.target.closest('li');
//     if (todoItem && !e.target.matches('input[type="checkbox"]')) {
//       const todoId = Number(todoItem.dataset.todoId);
//       showTodoDetails(todoId);
//     }
//   });
// });

// document.addEventListener('todosUpdated', () => {
//   loadTodos(document.getElementById('main'));
// })
import Todo from './addTodo';

class TodoApp {
    constructor() {
        this.todos = [];
        this.initializeApp();
    }

    async initializeApp() {
        try {
            this.todos = await Todo.loadTodos();
            this.renderTodos();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            // Show error message to user
        }
    }

    async addTodo(todoData) {
        try {
            const newTodo = await Todo.createTodo(todoData);
            this.todos.push(newTodo);
            this.renderTodos();
        } catch (error) {
            console.error('Failed to add todo:', error);
            // Show error message to user
        }
    }

    async updateTodo(id, todoData) {
        try {
            const updatedTodo = await Todo.updateTodo(id, todoData);
            const index = this.todos.findIndex(todo => todo.id === id);
            if (index !== -1) {
                this.todos[index] = updatedTodo;
                this.renderTodos();
            }
        } catch (error) {
            console.error('Failed to update todo:', error);
            // Show error message to user
        }
    }

    async deleteTodo(id) {
        try {
            await Todo.deleteTodo(id);
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.renderTodos();
        } catch (error) {
            console.error('Failed to delete todo:', error);
            // Show error message to user
        }
    }

    renderTodos() {
        // Your existing render logic here
        const todoList = document.querySelector('.todo-list');
        todoList.innerHTML = '';
        
        this.todos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.classList.add('todo-item');
            todoElement.innerHTML = `
                <h3>${todo.title}</h3>
                <p>${todo.description}</p>
                <button onclick="app.deleteTodo(${todo.id})">Delete</button>
                <button onclick="app.toggleComplete(${todo.id})">
                    ${todo.completed ? 'Uncomplete' : 'Complete'}
                </button>
            `;
            todoList.appendChild(todoElement);
        });
    }

    async toggleComplete(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            await this.updateTodo(id, todo);
        }
    }
}

// Initialize the app
const app = new TodoApp();
window.app = app; // Make it accessible globally for onclick handlers
