// Single User Authentication System
class SingleUserAuth {
    constructor() {
        this.currentUser = null;
        this.initialize();
    }

    initialize() {
        this.loadCurrentUser();
        this.updateUserProfileDisplay();
        this.setupAuthListeners();
    }

    loadCurrentUser() {
        // Only load the single current user - no fallback to other users
        this.currentUser = JSON.parse(localStorage.getItem('saladaze_current_user')) || null;
    }

    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('saladaze_current_user', JSON.stringify(this.currentUser));
        }
    }

    clearAllUsers() {
        // Remove ALL user data except the current user
        localStorage.removeItem('saladaze_users'); // Remove the users array
        // Keep only saladaze_current_user
    }

    updateUserProfileDisplay() {
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userProfileSection = document.getElementById('user-profile-section');

        if (this.currentUser) {
            // User is logged in
            if (userAvatar) userAvatar.textContent = this.currentUser.name.charAt(0);
            if (userName) userName.textContent = this.currentUser.name;
            if (userEmail) userEmail.textContent = this.currentUser.email;

            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (userProfileSection) userProfileSection.style.display = 'flex';
        } else {
            // No user logged in
            if (userAvatar) userAvatar.textContent = '?';
            if (userName) userName.textContent = 'Guest';
            if (userEmail) userEmail.textContent = 'Please log in';

            if (loginBtn) loginBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userProfileSection) userProfileSection.style.display = 'flex';
        }
    }

    setupAuthListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Login button (redirect to login page)
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }

        // Listen for login events from other pages
        window.addEventListener('storage', (e) => {
            if (e.key === 'saladaze_current_user') {
                this.loadCurrentUser();
                this.updateUserProfileDisplay();
            }
        });
    }

    login(user) {
        // Clear any previous user data
        this.clearAllUsers();
        
        // Set new user as current
        this.currentUser = user;
        this.saveCurrentUser();
        this.updateUserProfileDisplay();
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('userLoggedIn', { 
            detail: { user: this.currentUser } 
        }));

        console.log('User logged in:', this.currentUser.name);
    }

    logout() {
        // Completely remove user data
        this.currentUser = null;
        localStorage.removeItem('saladaze_current_user');
        this.clearAllUsers();
        this.updateUserProfileDisplay();
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('userLoggedOut'));
        
        console.log('User logged out');
        
        // Refresh page to show guest state
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Initialize single user auth
let userAuth;

document.addEventListener('DOMContentLoaded', function() {
    userAuth = new SingleUserAuth();
    window.userAuth = userAuth;
});