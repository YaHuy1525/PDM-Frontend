import axios from 'axios';

class UserService {
    static baseURL = 'http://localhost:8080/api/users';
    
    static axiosInstance = axios.create({
        baseURL: this.baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    static async getUserByUsername(username) {
        try {
            const response = await this.axiosInstance.get(`/username/${username}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error.response?.data || error.message);
            throw error;
        }
    }

    static async login(username, password) {
        try {
            // Get user from database by username
            const user = await this.getUserByUsername(username);
            if (user && user.password === password) {
                // Update last login time in database
                const updatedUser = await this.updateUser(user.userId, {
                    ...user,
                    lastLogin: new Date()
                });
                
                // Store minimal user info in localStorage
                const userInfo = {
                    userId: updatedUser.userId,
                    username: updatedUser.username,
                    fullname: updatedUser.fullname
                };
                localStorage.setItem('userToken', 'authenticated');
                localStorage.setItem('userId', userInfo.userId);
                localStorage.setItem('username', userInfo.username);
                localStorage.setItem('fullname', userInfo.fullname);
                
                return userInfo;
            }
            throw new Error('Invalid credentials');
        } catch (error) {
            console.error('Error during login:', error.response?.data || error.message);
            throw error;
        }
    }

    static async register(user) {
        try {
            const response = await this.axiosInstance.post('', {
                username: user.username,
                password: user.password,
                fullname: user.fullname,
                email: user.email,
                profilePicture: '',
                tasks: []
            });
            return response.data;
        } catch (error) {
            console.error('Error creating user');
            throw error;
        }
    }

    static async updateUser(id, user) {
        try {
            const response = await this.axiosInstance.put(`/${id}`, {
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                profilePicture: user.profilePicture || '',
                lastLogin: new Date()
            });
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error.response?.data || error.message);
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
}

export const userApi = UserService;
