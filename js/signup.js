
const password = document.getElementById('user-pass');
const confirmedpass = document.getElementById('confirmed-pass');
const error = document.getElementById('error-message');
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');   

// Checking th password and confirmed password
confirmedpass.addEventListener('input', () => {
    if(password.value !== confirmedpass.value && confirmedpass.value !== ''){
        error.style.display = 'block';
        error.style.fontSize = '15px';
        error.style.color = 'red';
    } else {
        error.style.display = 'none';
    }
});

// Switching between sign up and sign in forms
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});