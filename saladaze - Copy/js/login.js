// js/login.js - Fixed version
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Hide error message initially
    errorMessage.style.display = 'none';

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value;

        // Simple validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        // Check credentials against localStorage
        attemptLogin(email, password);
    });

    function attemptLogin(email, password) {
        const loginBtn = loginForm.querySelector('.login-btn');
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;

        // Get users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('saladaze_users') || '[]');
        
        // Find user by email
        const user = existingUsers.find(u => u.email === email);
        
        setTimeout(() => {
            if (user) {
                // Check password (decode from base64)
                const decodedPassword = atob(user.password);
                if (decodedPassword === password) {
                    // Store current user session
                    localStorage.setItem('saladaze_current_user', JSON.stringify({
                        id: user.id,
                        name: user.fullName,
                        email: user.email,
                        phone: user.phone
                    }));
                    
                    showSuccess('Login successful! Redirecting...');
                    
                    setTimeout(() => {
                        window.location.href = 'customer.html';
                    }, 1000);
                } else {
                    showError('Invalid email or password. Please try again.');
                    resetButton(loginBtn);
                }
            } else {
                showError('No account found with this email. Please sign up first.');
                resetButton(loginBtn);
            }
        }, 1000);
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.background = '#ffebee';
        errorMessage.style.color = '#c62828';
        errorMessage.style.padding = '0.75rem';
        errorMessage.style.borderRadius = '8px';
        errorMessage.style.marginBottom = '1rem';
    }

    function showSuccess(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.background = '#e8f5e8';
        errorMessage.style.color = '#2d5a27';
        errorMessage.style.padding = '0.75rem';
        errorMessage.style.borderRadius = '8px';
        errorMessage.style.marginBottom = '1rem';
    }

    function resetButton(button) {
        button.textContent = 'Login to Account';
        button.disabled = false;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});