import axios from 'axios';

class UserService {
    static baseURL = 'http://localhost:8080/api/users';
    
    static axiosInstance = axios.create({
        baseURL: this.baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    static async getAllUsers() {
        try {
            const response = await this.axiosInstance.get('');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getUserById(id) {
        try {
            const response = await this.axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createUser(user) {
        try {
            const response = await this.axiosInstance.post('', {
                username: user.username,
                password: user.password,
                fullname: user.fullname,
                email: user.email,
                profilePicture: user.profilePicture
            });
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateUser(id, user) {
        try {
            const response = await this.axiosInstance.put(`/${id}`, {
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                profilePicture: user.profilePicture
            });
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteUser(id) {
        try {
            const response = await this.axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getUserTasks(userId) {
        try {
            const response = await this.axiosInstance.get(`/${userId}/tasks`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user tasks:', error.response?.data || error.message);
            throw error;
        }
    }

    static async login(username, password) {
        try {
            const response = await this.axiosInstance.post('/login', {
                username,
                password
            });
            return response.data;
        } catch (error) {
            console.error('Error during login:', error.response?.data || error.message);
            throw error;
        }
    }

    static async register(user) {
        try {
            const response = await this.axiosInstance.post('/register', {
                username: user.username,
                password: user.password,
                fullname: user.fullname,
                email: user.email
            });
            return response.data;
        } catch (error) {
            console.error('Error during registration:', error.response?.data || error.message);
            throw error;
        }
    }
}

export const userApi = UserService;
