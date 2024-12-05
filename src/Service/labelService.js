import axios from 'axios';

class LabelService {
    static baseURL = 'http://localhost:8080/api/labels';
    
    static axiosInstance = axios.create({
        baseURL: this.baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    static async getAllLabels() {
        try {
            const response = await this.axiosInstance.get('');
            return response.data;
        } catch (error) {
            console.error('Error fetching labels:');
            throw error;
        }
    }

    static async getLabelById(id) {
        try {
            const response = await this.axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching label:');
            throw error;
        }
    }

    static async createLabel(label) {
        try {
            const response = await this.axiosInstance.post('', {
                name: label.name,
                color: label.color
            });
            return response.data;
        } catch (error) {
            console.error('Error creating label:');
            throw error;
        }
    }

    static async updateLabel(id, label) {
        try {
            const response = await this.axiosInstance.put(`/${id}`, {
                name: label.name,
                color: label.color
            });
            return response.data;
        } catch (error) {
            console.error('Error updating label:');
            throw error;
        }
    }

    static async deleteLabel(id) {
        try {
            const response = await this.axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting label:');
            throw error;
        }
    }

    static async getLabelTasks(labelId) {
        try {
            const response = await this.axiosInstance.get(`/${labelId}/tasks`);
            return response.data;
        } catch (error) {
            console.error('Error fetching label tasks:');
            throw error;
        }
    }
}

export const labelApi = LabelService;
