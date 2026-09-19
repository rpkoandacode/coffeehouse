const loginButton = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

loginButton.addEventListener('click', async () => {

    const email =
        document.getElementById('admin-email').value.trim();

    const password =
        document.getElementById('admin-password').value;

    loginError.textContent = '';

    if (!email || !password) {
        loginError.textContent =
            'Please enter your email and password.';
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    try {

        await firebase.auth().signInWithEmailAndPassword(
            email,
            password
        );

        window.location.href = 'admin.html';

    } catch (error) {

        console.error(error);

        loginError.textContent =
            'Invalid email or password.';

        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }

});