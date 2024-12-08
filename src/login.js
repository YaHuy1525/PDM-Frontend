import { userApi } from './Service/userService';

export class LoginPage {
    constructor() {
        this.container = document.getElementById('container');
        this.registerBtn = document.getElementById('register');
        this.loginBtn = document.getElementById('login');
        this.loginForm = document.querySelector('.login-form');
        this.registerForm = document.querySelector('.register-form');
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.registerBtn.addEventListener('click', () => {
            this.container.classList.add("active");
        });

        this.loginBtn.addEventListener('click', () => {
            this.container.classList.remove("active");
        });

        // Handle login
        this.loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = this.loginForm.querySelector('#username').value;
            const password = this.loginForm.querySelector('#user-pass').value;

            try {
                const response = await userApi.login(username, password);
                // Store user data in localStorage
                // Data needed to be stored in localStorage in order to directly access main page next time using the app
                localStorage.setItem('userToken', 'authenticated');
                localStorage.setItem('userId', response.userId);
                localStorage.setItem('username', response.username);
                localStorage.setItem('fullname', response.fullname);
                window.location.href = '/';
            } catch (error) {
                alert('Login failed: ' + (error.message || 'Invalid credentials'));
            }
        });

        // Password validation for registration
        const password = document.getElementById('user-pass');
        const confirmedpass = document.getElementById('confirmed-pass');
        const error = document.getElementById('error-message');

        confirmedpass.addEventListener('input', () => {
            if(password.value !== confirmedpass.value && confirmedpass.value !== '') {
                error.style.display = 'block';
            } else {
                error.style.display = 'none';
            }
        });

        this.registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('user-email').value;
            const password = document.getElementById('user-pass').value;
            const confirmedPassword = document.getElementById('confirmed-pass').value;

            if (password !== confirmedPassword) {
                alert('Passwords do not match!');
                return;
            }

            try {
                await userApi.register({
                    username: username,
                    password: password,
                    fullname: fullName,
                    email: email
                });
                alert('Registration successful! Please login.');
                this.container.classList.remove("active");
            } catch (error) {
                alert('Registration failed: ' + (error.response?.data?.message || error.message || 'Please try again'));
            }
        });
    }
}
