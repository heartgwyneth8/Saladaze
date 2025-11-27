// Staff & Admin Login System
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('staffAdminLoginForm');
    
    // Check if user is already logged in
    checkExistingLogin();
    
    // Create default admin account if none exists
    initializeDefaultAccounts();
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleStaffAdminLogin();
    });
});

function checkExistingLogin() {
    const currentStaff = JSON.parse(localStorage.getItem('currentStaff'));
    if (currentStaff) {
        // User is already logged in, redirect to appropriate dashboard
        if (currentStaff.role === 'admin') {
            window.location.href = 'admin.html';  // Changed to admin.html
        } else {
            window.location.href = 'staff.html';
        }
    }
}

function initializeDefaultAccounts() {
    // Check if admin accounts exist, if not create default admin
    let adminAccounts = JSON.parse(localStorage.getItem('adminAccounts')) || [];
    let staffAccounts = JSON.parse(localStorage.getItem('staffAccounts')) || [];
    
    console.log('Current admin accounts:', adminAccounts);
    console.log('Current staff accounts:', staffAccounts);
    
    if (adminAccounts.length === 0) {
        const defaultAdmin = {
            id: 'admin_001',
            name: 'System Administrator',
            email: 'admin@saladaze.com',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        
        adminAccounts.push(defaultAdmin);
        localStorage.setItem('adminAccounts', JSON.stringify(adminAccounts));
        console.log('Default admin account created:', defaultAdmin);
    }
    
    // Create default staff account if none exists
    if (staffAccounts.length === 0) {
        const defaultStaff = {
            id: 'staff_001',
            name: 'Kitchen Staff',
            email: 'staff@saladaze.com',
            password: 'staff123',
            role: 'staff',
            createdAt: new Date().toISOString()
        };
        
        staffAccounts.push(defaultStaff);
        localStorage.setItem('staffAccounts', JSON.stringify(staffAccounts));
        console.log('Default staff account created:', defaultStaff);
    }
    
    // Debug: Check what's in storage
    console.log('Final admin accounts:', JSON.parse(localStorage.getItem('adminAccounts')));
    console.log('Final staff accounts:', JSON.parse(localStorage.getItem('staffAccounts')));
}

function handleStaffAdminLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    console.log('Login attempt with:', email, password);

    // Check admin accounts
    const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts')) || [];
    const staffAccounts = JSON.parse(localStorage.getItem('staffAccounts')) || [];

    console.log('Admin accounts from storage:', adminAccounts);
    console.log('Staff accounts from storage:', staffAccounts);

    // Check if user exists in admin accounts
    let user = adminAccounts.find(acc => {
        console.log('Checking admin:', acc.email, '==', email, '&&', acc.password, '==', password);
        return acc.email === email && acc.password === password;
    });
    let userRole = 'staff';
    
    if (user) {
        userRole = 'admin';
        console.log('User found in admin accounts:', user);
    } else {
        // If not admin, check staff accounts
        user = staffAccounts.find(acc => {
            console.log('Checking staff:', acc.email, '==', email, '&&', acc.password, '==', password);
            return acc.email === email && acc.password === password;
        });
        userRole = 'staff';
        console.log('User found in staff accounts:', user);
    }

    if (user) {
        console.log('Login successful for user:', user);
        
        const userData = {
            ...user,
            role: userRole,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentStaff', JSON.stringify(userData));
        
        console.log('Redirecting to:', userRole === 'admin' ? 'admin.html' : 'staff.html');
        
        if (userRole === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'staff.html';
        }
    } else {
        console.log('Login failed - no matching account found');
        console.log('Available admin emails:', adminAccounts.map(acc => acc.email));
        console.log('Available staff emails:', staffAccounts.map(acc => acc.email));
        alert('Invalid email or password. Please try again.');
    }
}

function staffLogout() {
    localStorage.removeItem('currentStaff');
    window.location.href = 'login.html';
}