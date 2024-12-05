import axios from 'axios';

class BoardService {
    static baseURL = 'http://localhost:8080/api/boards';
    
    static axiosInstance = axios.create({
        baseURL: this.baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    static async getAllBoards() {
        try {
            const response = await this.axiosInstance.get('');
            return response.data;
        } catch (error) {
            console.error('Error fetching boards:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getBoardById(id) {
        try {
            const response = await this.axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching board:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createBoard(board) {
        try {
            const response = await this.axiosInstance.post('', {
                name: board.name,
                description: board.description || ''
            });
            return response.data;
        } catch (error) {
            console.error('Error creating board:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateBoard(id, board) {
        try {
            const response = await this.axiosInstance.put(`/${id}`, {
                name: board.name,
                description: board.description
            });
            return response.data;
        } catch (error) {
            console.error('Error updating board:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteBoard(id) {
        try {
            const response = await this.axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting board:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getBoardTasks(boardId) {
        try {
            const response = await this.axiosInstance.get(`/${boardId}/tasks`);
            return response.data;
        } catch (error) {
            console.error('Error fetching board tasks:', error.response?.data || error.message);
            throw error;
        }
    }
}

export const boardApi = BoardService;
