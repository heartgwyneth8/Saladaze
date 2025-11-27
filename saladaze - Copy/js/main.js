// Video Hero Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in and redirect to customer page
    /*const currentUser = JSON.parse(localStorage.getItem('saladaze_current_user') || 'null');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (currentUser || isLoggedIn === 'true') {
        // Add transition effect
        document.body.style.opacity = '0.8';
        document.body.style.transition = 'opacity 0.5s ease';
        
        // Redirect to customer page after short delay
        setTimeout(() => {
            window.location.href = 'customer.html';
        }, 500);
        return; // Stop execution here since we're redirecting
    } */

    // Rest of your existing video hero code...
    const videoHero = document.querySelector('.video-hero');
    const video = document.getElementById('heroVideo');
    const videoFallback = document.querySelector('.video-fallback');
    
    // Your existing video code...
});

// Landing Page Login Functions
function updateLandingPageLoginUI() {
    const loginBtn = document.querySelector('.btn-secondary');
    if (!loginBtn) return;
    
    // Check if user is logged in using the saladaze system
    const currentUser = JSON.parse(localStorage.getItem('saladaze_current_user'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (currentUser || isLoggedIn === 'true') {
        // User is logged in - show logout
        loginBtn.textContent = 'Logout';
        loginBtn.onclick = handleLandingPageLogout;
    } else {
        // User is not logged in - show login
        loginBtn.textContent = 'Login';
        loginBtn.onclick = function() {
            // Add transition effect
            document.body.style.opacity = '0.8';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 300);
        };
    }
}

function handleLandingPageLogout() {
    // Add transition effect
    document.body.style.opacity = '0.8';
    document.body.style.transition = 'opacity 0.3s ease';
    
    // Clear both login systems
    setTimeout(() => {
        localStorage.removeItem('saladaze_current_user');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('currentUser');
        window.location.reload();
    }, 300);
}