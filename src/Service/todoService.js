import axios from 'axios'
import { Todo } from '../Entities/todo.js'

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
            console.log('Raw todo data from backend:', response.data);
            return response.data.map(todo => this._transformTodoResponse(todo));
        } catch (error) {
            console.error('Error fetching todos:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getTodoById(id) {
        try {
            const response = await this.axiosInstance.get(`/${id}`);
            return this._transformTodoResponse(response.data);
        } catch (error) {
            console.error('Error fetching todo:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createTodo(todo) {
        try {
            const requestData = {
                title: todo.title,
                description: todo.description || '',
                status: todo.status || 'PENDING',
                dueDate: todo.dueDate,
                createdAt: todo.createdAt,
                boardId: todo.boardId,
                userId: todo.userId,
                labelId: todo.labelId
            };
            
            console.log('Creating todo with data:', JSON.stringify(requestData, null, 2));
            
            const response = await this.axiosInstance.post('', requestData);
            console.log('Server response:', response.data);
            
            return Todo.fromJson(response.data);
        } catch (error) {
            console.error('Error creating todo:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateTodo(id, updates) {
        try {
            const requestData = {
                title: updates.title,
                description: updates.description,
                status: updates.status,
                dueDate: updates.dueDate ? new Date(updates.dueDate).toISOString() : null,
                boardId: updates.boardId,
                userId: updates.userId,
                labelId: updates.labelId
            };

            const response = await this.axiosInstance.put(`/${id}`, requestData);
            return this._transformTodoResponse(response.data);
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
            console.log('Board todos response:', {
                type: typeof response.data,
                isArray: Array.isArray(response.data),
                data: response.data
            });
            
            const todosArray = Array.isArray(response.data) ? response.data : [response.data];
            return todosArray.filter(todo => todo !== null).map(todo => this._transformTodoResponse(todo));
        } catch (error) {
            console.error('Error fetching todos for board:', error.response?.data || error.message);
            throw error;
        }
    }
    static _transformTodoResponse(todo) {
        return {
            taskId: todo.taskId,
            title: todo.title,
            description: todo.description,
            status: todo.status,
            dueDate: todo.dueDate,
            createdAt: todo.createdAt,
            boardId: todo.boardId,
            userId: todo.userId,
            labelId: todo.labelId,
            labelName: todo.labelName,
            labelColor: todo.labelColor
        };
    }
}

export const todoApi = TodoService;