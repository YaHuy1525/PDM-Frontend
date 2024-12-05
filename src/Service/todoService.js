import axios from 'axios'

class TodoService {
    static baseURL = 'http://localhost:8080/api/tasks';
    
    static axiosInstance = axios.create({
        baseURL: this.baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    static async getAllTodos() {
        try {
            const response = await this.axiosInstance.get('');
            return response.data.map(todo => ({
                ...todo,
                completed: todo.status === 'COMPLETED',
                priority: todo.priority || 'NORMAL'
            }));
        } catch (error) {
            console.error('Error fetching todos:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getTodoById(id) {
        try {
            const response = await this.axiosInstance.get(`/${id}`);
            const todo = response.data;
            return {
                ...todo,
                completed: todo.status === 'COMPLETED',
                priority: todo.priority || 'NORMAL'
            };
        } catch (error) {
            console.error('Error fetching todo:', error.response?.data || error.message);
            throw error;
        }
    }

    static async addTodo(todo) {
        try {
            const response = await this.axiosInstance.post('', {
                title: todo.title,
                description: todo.description || '',
                dueDate: todo.dueDate,
                status: todo.completed ? 'COMPLETED' : 'PENDING',
                boardId: todo.boardId
            });
            return {
                ...response.data,
                completed: response.data.status === 'COMPLETED',
                priority: response.data.priority || 'NORMAL'
            };
        } catch (error) {
            console.error('Error adding todo:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateTodo(id, todo) {
        try {
            const response = await this.axiosInstance.put(`/${id}`, {
                title: todo.title,
                description: todo.description,
                dueDate: todo.dueDate,
                status: todo.completed ? 'COMPLETED' : 'PENDING',
                boardId: todo.boardId
            });
            return {
                ...response.data,
                completed: response.data.status === 'COMPLETED',
                priority: response.data.priority || 'NORMAL'
            };
        } catch (error) {
            console.error('Error updating todo:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteTodo(id) {
        try {
            const response = await this.axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting todo:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getTodosByBoard(boardId) {
        try {
            const response = await this.axiosInstance.get(`/board/${boardId}`);
            return response.data.map(todo => ({
                ...todo,
                completed: todo.status === 'COMPLETED',
                priority: todo.priority || 'NORMAL'
            }));
        } catch (error) {
            console.error('Error fetching todos by board:', error.response?.data || error.message);
            throw error;
        }
    }
}

export const todoApi = TodoService;