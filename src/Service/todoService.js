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
                taskId: todo.taskId,
                title: todo.title,
                description: todo.description,
                status: todo.status,
                dueDate: todo.dueDate,
                createdAt: todo.createdAt,
                boardId: todo.board?.boardId,
                userId: todo.user?.userId,
                labelId: todo.label?.labelId
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
                taskId: todo.taskId,
                title: todo.title,
                description: todo.description,
                status: todo.status,
                dueDate: todo.dueDate,
                createdAt: todo.createdAt,
                boardId: todo.board?.boardId,
                userId: todo.user?.userId,
                labelId: todo.label?.labelId
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
                status: todo.status || 'Ongoing',
                dueDate: todo.dueDate,
                boardId: todo.boardId,
                userId: todo.userId,
                labelId: todo.labelId
            });
            return {
                taskId: response.data.taskId,
                title: response.data.title,
                description: response.data.description,
                status: response.data.status,
                dueDate: response.data.dueDate,
                createdAt: response.data.createdAt,
                boardId: response.data.board?.boardId,
                userId: response.data.user?.userId,
                labelId: response.data.label?.labelId
            };
        } catch (error) {
            console.error('Error adding todo:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateTodo(id, updates) {
        try {
            const currentTodo = await this.getTodoById(id);
            const response = await this.axiosInstance.put(`/${id}`, {
                ...currentTodo,
                ...updates,
                status: updates.status || currentTodo.status
            });
            return {
                taskId: response.data.taskId,
                title: response.data.title,
                description: response.data.description,
                status: response.data.status,
                dueDate: response.data.dueDate,
                createdAt: response.data.createdAt,
                boardId: response.data.board?.boardId,
                userId: response.data.user?.userId,
                labelId: response.data.label?.labelId
            };
        } catch (error) {
            console.error('Error updating todo:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteTodo(id) {
        try {
            await this.axiosInstance.delete(`/${id}`);
        } catch (error) {
            console.error('Error deleting todo:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getTodosByBoard(boardId) {
        try {
            const response = await this.axiosInstance.get(`/board/${boardId}`);
            return response.data.map(todo => ({
                taskId: todo.taskId,
                title: todo.title,
                description: todo.description,
                status: todo.status,
                dueDate: todo.dueDate,
                createdAt: todo.createdAt,
                boardId: todo.board?.boardId,
                userId: todo.user?.userId,
                labelId: todo.label?.labelId
            }));
        } catch (error) {
            console.error('Error fetching todos for board:', error.response?.data || error.message);
            throw error;
        }
    }
}

export const todoApi = TodoService;