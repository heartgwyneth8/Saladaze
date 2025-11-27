// js/register.js 
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        hideMessages();

        if (!validateForm(fullName, email, password, confirmPassword, phone)) {
            return;
        }

        attemptRegistration(fullName, email, phone, password);
    });

    function validateForm(fullName, email, password, confirmPassword, phone) {
        if (!fullName || !email || !password || !confirmPassword) {
            showError('Please fill in all required fields');
            return false;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return false;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return false;
        }

        return true;
    }

    function attemptRegistration(fullName, email, phone, password) {
        const registerBtn = registerForm.querySelector('.login-btn');
        registerBtn.textContent = 'Creating Account...';
        registerBtn.disabled = true;

        setTimeout(() => {
            const existingUsers = JSON.parse(localStorage.getItem('saladaze_users') || '[]');
            const userExists = existingUsers.some(user => user.email === email);
            
            if (userExists) {
                showError('An account with this email already exists');
                resetButton(registerBtn);
                return;
            }

            // Create new user
            const newUser = {
                id: generateUserId(),
                fullName,
                email,
                phone: phone || '',
                password: btoa(password),
                createdAt: new Date().toISOString()
            };

            // Save to localStorage
            existingUsers.push(newUser);
            localStorage.setItem('saladaze_users', JSON.stringify(existingUsers));

            // AUTO LOGIN: Store current user session immediately
            localStorage.setItem('saladaze_current_user', JSON.stringify({
                id: newUser.id,
                name: newUser.fullName,
                email: newUser.email,
                phone: newUser.phone
            }));

            showSuccess('Account created successfully! Redirecting...');
            
            // Redirect directly to customer page
            setTimeout(() => {
                window.location.href = 'customer.html';
            }, 1500);

        }, 1000);
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
    }

    function hideMessages() {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    }

    function resetButton(button) {
        button.textContent = 'Create Account';
        button.disabled = false;
    }

    function generateUserId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});