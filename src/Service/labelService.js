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
            return response.data.map(label => ({
                labelId: label.labelId,
                name: label.name,
                color: this.getColorForLabel(label.name)
            }));
        } catch (error) {
            console.error('Error fetching labels:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getLabelById(id) {
        try {
            const response = await this.axiosInstance.get(`/${id}`);
            const label = response.data;
            return {
                labelId: label.labelId,
                name: label.name,
                color: this.getColorForLabel(label.name)
            };
        } catch (error) {
            console.error('Error fetching label:', error.response?.data || error.message);
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
            console.error('Error creating label:', error.response?.data || error.message);
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
            console.error('Error updating label:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteLabel(id) {
        try {
            const response = await this.axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting label:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getLabelTasks(labelId) {
        try {
            const response = await this.axiosInstance.get(`/${labelId}/tasks`);
            return response.data;
        } catch (error) {
            console.error('Error fetching label tasks:', error.response?.data || error.message);
            throw error;
        }
    }

    static getColorForLabel(name) {
        const labelColors = {
            'High': '#ff0000',    // Red
            'Medium': '#ffff00',  // Yellow
            'Low': '#00ff00'      // Green
        };
        return labelColors[name] || '#666666';
    }
}

export const labelApi = LabelService;
