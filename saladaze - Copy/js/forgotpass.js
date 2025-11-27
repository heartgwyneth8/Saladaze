// Forgot Password form handling
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();

        // Validation
        if (!email) {
            showError('Please enter your email address.');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        // Simulate API call
        showSuccess('Sending reset link to your email...');
        forgotPasswordForm.querySelector('.auth-btn').disabled = true;

        setTimeout(() => {
            // In real app, this would send an actual email
            showSuccess('Password reset link has been sent to your email! Check your inbox and spam folder.');
            
            // Re-enable button after 5 seconds
            setTimeout(() => {
                forgotPasswordForm.querySelector('.auth-btn').disabled = false;
            }, 5000);
            
        }, 2000);
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
    }

    // Hide messages when user starts typing
    document.getElementById('email').addEventListener('input', function() {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    });
});