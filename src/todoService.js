import axios from 'axios'

class TodoService {
    static baseURL = 'http://localhost:8080/api/todos';

    static async getAllTodos() {
        try {
            const response = await fetch(this.baseURL);
            if (!response.ok) throw new Error('Network response error');
            return await response.json();
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    }

    static async addTodo(todo) {
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: todo.title,
                    description: todo.description || '',
                    completed: todo.completed || false,
                }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error adding todo:', error);
            throw error;
        }
    }

    static async updateTodo(id, todo) {
        try {
            const response = await fetch(`${this.baseURL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todo),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    }

    static async deleteTodo(id) {
        try {
            const response = await fetch(`${this.baseURL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return true;
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    }
}

export default TodoService;