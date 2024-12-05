class TodoApi {
    constructor() {
        this.baseUrl = 'http://localhost:8080/api';
        this.todos = []; // In-memory storage until backend is ready
    }

    async getAllTodos() {
        try {
            // Simulating API call for now
            return this.todos;
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    }

    async createTodo(todoData) {
        try {
            // Generate a unique ID
            const newTodo = {
                ...todoData,
                id: Date.now(),
            };
            
            // Add to in-memory storage
            this.todos.push(newTodo);
            return newTodo;
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    }

    async updateTodo(id, todoData) {
        try {
            const index = this.todos.findIndex(todo => todo.id === id);
            if (index !== -1) {
                this.todos[index] = { ...this.todos[index], ...todoData };
                return this.todos[index];
            }
            throw new Error('Todo not found');
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    }

    async deleteTodo(id) {
        try {
            const index = this.todos.findIndex(todo => todo.id === id);
            if (index !== -1) {
                this.todos.splice(index, 1);
                return true;
            }
            throw new Error('Todo not found');
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    }

    async getTodoById(id) {
        try {
            const todo = this.todos.find(todo => todo.id === id);
            if (!todo) {
                throw new Error('Todo not found');
            }
            return todo;
        } catch (error) {
            console.error('Error fetching todo:', error);
            throw error;
        }
    }
}

export const todoApi = new TodoApi();
