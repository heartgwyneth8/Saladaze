// Admin Dashboard Class
class AdminDashboard {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('saladaze_current_user')) || null;
        this.currentCategory = 'all';
        this.salesChart = null;
        this.initialize();
        this.setupOrderChangeListener();
    }

    initialize() {
        this.initializeEventListeners();
        this.initializeNavigation();
        this.loadDashboardData();
        this.loadMenuItems();
        this.loadUsers();
        this.initializeSalesChart();
        this.setupUserChangeListener();
    }

    initializeEventListeners() {
        // Category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.currentCategory = category;
                this.filterMenuItems(category);
                
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Search functionality
        const menuSearch = document.getElementById('menu-search');
        if (menuSearch) {
            menuSearch.addEventListener('input', (e) => {
                this.filterMenuItems(this.currentCategory, e.target.value);
            });
        }

        const userSearch = document.getElementById('user-search');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => {
                this.filterUsers(e.target.value);
            });
        }

        // Analytics period filter
        const analyticsPeriod = document.getElementById('analytics-period');
        if (analyticsPeriod) {
            analyticsPeriod.addEventListener('change', (e) => {
            // You can implement period filtering here
            this.loadAnalyticsData();
        });
        }
        // Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    });
}

        // Modal events
        this.initializeModals();

        // Quick actions
        this.initializeQuickActions();

        // Event delegation for menu item buttons
        this.setupEventDelegation();
    }

    setupEventDelegation() {
        // Use event delegation for dynamically created buttons
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Edit button
            if (target.closest('.edit-btn')) {
                const button = target.closest('.edit-btn');
                const itemId = button.getAttribute('data-id');
                console.log('Edit button clicked for:', itemId);
                if (itemId) {
                    this.editMenuItem(itemId);
                }
                return;
            }
            
            // Availability button
            if (target.closest('.availability-btn')) {
                const button = target.closest('.availability-btn');
                const itemId = button.getAttribute('data-id');
                console.log('Availability button clicked for:', itemId);
                if (itemId) {
                    this.toggleItemAvailability(itemId);
                }
                return;
            }
            
            // Delete button
            if (target.closest('.delete-btn')) {
                const button = target.closest('.delete-btn');
                const itemId = button.getAttribute('data-id');
                console.log('Delete button clicked for:', itemId);
                if (itemId) {
                    this.deleteMenuItem(itemId);
                }
                return;
            }
        });
    }

    initializeQuickActions() {
        const quickActionCards = document.querySelectorAll('.quick-action-card');
        quickActionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const section = card.getAttribute('data-section');
                console.log('Quick action clicked:', section);
                if (section) {
                    this.showSection(section);
                }
            });
        });
    }

    initializeModals() {
        // Add Item Modal
        const addItemBtn = document.getElementById('add-menu-item');
        const cancelAddBtn = document.getElementById('cancel-add');
        const closeModalBtns = document.querySelectorAll('.close');

        if (addItemBtn) {
            addItemBtn.addEventListener('click', () => this.showAddItemModal());
        }

        if (cancelAddBtn) {
            cancelAddBtn.addEventListener('click', () => this.closeAddItemModal());
        }

        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Cancel Edit button
        const cancelEditBtn = document.getElementById('cancel-edit');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => this.closeEditItemModal());
        }

        // Form submissions
        const addItemForm = document.getElementById('add-item-form');
        if (addItemForm) {
            addItemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveMenuItem();
            });
        }

        const editItemForm = document.getElementById('edit-item-form');
        if (editItemForm) {
            editItemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateMenuItem();
            });
        }

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    setupUserChangeListener() {
        // Listen for user changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'saladaze_current_user') {
                this.loadUsers();
                if (document.getElementById('user-management').classList.contains('active')) {
                    this.loadUsers();
                }
            }
        });
    }

    initializeNavigation() {
        const navItems = document.querySelectorAll('.nav-link');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                navItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
                
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

        this.showSection('dashboard');
    }

    showSection(section) {
    console.log('Showing section:', section);
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    const target = document.getElementById(section);
    if (target) {
        target.classList.add('active');
        this.updateHeaderContent(section);
        
        // Load section-specific data
        switch(section) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'analytics':
                this.loadAnalyticsData();
                break;
            case 'menu-management':
                this.loadMenuItems();
                break;
            case 'user-management':
                this.loadUsers();
                break;
        }
    }
}

    updateHeaderContent(section) {
        const sectionData = {
            'dashboard': {
                title: 'Dashboard',
                description: 'Welcome to Saladaze Admin Panel',
                button: ''
            },
            'menu-management': {
                title: 'Menu Management',
                description: 'Manage menu items and availability',
                button: ''
            },
            'user-management': {
                title: 'Current User Account',
                description: 'Viewing currently logged-in user information',
                button: ''
            },
            'analytics': {
                title: 'Analytics',
                description: 'Sales and performance analytics',
                button: ''
            }
        };
        
        const data = sectionData[section] || sectionData['dashboard'];
        const sectionTitle = document.getElementById('section-title');
        const sectionDescription = document.getElementById('section-description');
        const headerActions = document.getElementById('header-actions');
        
        if (sectionTitle) sectionTitle.textContent = data.title;
        if (sectionDescription) sectionDescription.textContent = data.description;
        if (headerActions) headerActions.innerHTML = data.button;

        // Re-attach event listeners for dynamically added buttons
        if (section === 'menu-management') {
            const addMenuItemBtn = document.getElementById('add-menu-item');
            if (addMenuItemBtn) {
                addMenuItemBtn.addEventListener('click', () => this.showAddItemModal());
            }
        }
    }

    // Dashboard Methods
    // Dashboard Methods - Updated Revenue Calculation
loadDashboardData() {
    const orders = JSON.parse(localStorage.getItem('saladaze_orders') || '[]');
    const today = new Date().toDateString();
    
    // Calculate today's revenue from COMPLETED orders only
    const todayRevenue = orders
        .filter(order => {
            const orderDate = new Date(order.timestamp || order.createdAt).toDateString();
            return orderDate === today && order.status === 'completed';
        })
        .reduce((total, order) => total + (order.total || 0), 0);

    // Calculate total revenue from ALL completed orders
    const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((total, order) => total + (order.total || 0), 0);

    // Update dashboard stats
    const totalOrdersEl = document.getElementById('total-orders');
    const pendingOrdersEl = document.getElementById('pending-orders');
    const revenueTodayEl = document.getElementById('revenue-today');
    
    if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
    if (pendingOrdersEl) pendingOrdersEl.textContent = orders.filter(order => order.status === 'pending').length;
    if (revenueTodayEl) revenueTodayEl.textContent = `₱${todayRevenue.toFixed(2)}`;

    // Load recent activity
    this.loadRecentActivity(orders);
    
    // Update total revenue if you have that element
    const totalRevenueEl = document.getElementById('total-revenue');
    if (totalRevenueEl) {
        totalRevenueEl.textContent = `₱${totalRevenue.toFixed(2)}`;
    }
}

// Analytics Methods - Updated Revenue Calculation
updateTodaySummary(orders) {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
        new Date(order.timestamp || order.createdAt).toDateString() === today
    );
    
    // Only count completed orders for revenue
    const completedOrders = todayOrders.filter(order => order.status === 'completed');
    const todayRevenue = completedOrders.reduce((total, order) => total + (order.total || 0), 0);
    
    const avgOrderValue = completedOrders.length > 0 ? todayRevenue / completedOrders.length : 0;
    const completionRate = todayOrders.length > 0 ? (completedOrders.length / todayOrders.length) * 100 : 0;

    const todayOrdersEl = document.getElementById('today-orders');
    const todayRevenueEl = document.getElementById('today-revenue');
    const avgOrderValueEl = document.getElementById('avg-order-value');
    const completionRateEl = document.getElementById('completion-rate');

    if (todayOrdersEl) todayOrdersEl.textContent = todayOrders.length;
    if (todayRevenueEl) todayRevenueEl.textContent = `₱${todayRevenue.toFixed(2)}`;
    if (avgOrderValueEl) avgOrderValueEl.textContent = `₱${avgOrderValue.toFixed(2)}`;
    if (completionRateEl) completionRateEl.textContent = `${completionRate.toFixed(1)}%`;
}

updateSalesChart(orders) {
    if (!this.salesChart) return;

    // Generate last 7 days data - only count COMPLETED orders for revenue
    const days = [];
    const revenue = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toDateString();
        
        const dayOrders = orders.filter(order => 
            new Date(order.timestamp || order.createdAt).toDateString() === dateString && 
            order.status === 'completed' // Only completed orders count for revenue
        );
        
        const dayRevenue = dayOrders.reduce((total, order) => total + (order.total || 0), 0);
        
        days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        revenue.push(dayRevenue);
    }
    
    this.salesChart.data.labels = days;
    this.salesChart.data.datasets[0].data = revenue;
    this.salesChart.update();
}

// Add this method to calculate monthly revenue
calculateMonthlyRevenue(orders) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenue = orders
        .filter(order => {
            const orderDate = new Date(order.timestamp || order.createdAt);
            return orderDate.getMonth() === currentMonth && 
                   orderDate.getFullYear() === currentYear &&
                   order.status === 'completed';
        })
        .reduce((total, order) => total + (order.total || 0), 0);
    
    return monthlyRevenue;
}

// Add this to listen for order changes
setupOrderChangeListener() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'saladaze_orders') {
            // Reload data when orders change
            this.loadDashboardData();
            if (document.getElementById('analytics').classList.contains('active')) {
                this.loadAnalyticsData();
            }
        }
    });
}

// Update analytics to show monthly revenue
loadAnalyticsData() {
    const orders = JSON.parse(localStorage.getItem('saladaze_orders') || '[]');
    const menu = JSON.parse(localStorage.getItem('saladaze_menu') || '[]');
    
    // Update revenue summary
    this.updateRevenueSummary(orders);
    
    // Update sales chart
    this.updateSalesChart(orders);
    
    // Update top items
    this.updateTopItems(orders, menu);
    
    // Update order metrics
    this.updateOrderMetrics(orders);
}

// Add this method for revenue summary
updateRevenueSummary(orders) {
    const today = new Date().toDateString();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Today's revenue
    const todayRevenue = orders
        .filter(order => {
            const orderDate = new Date(order.timestamp || order.createdAt).toDateString();
            return orderDate === today && order.status === 'completed';
        })
        .reduce((total, order) => total + (order.total || 0), 0);
    
    // Weekly revenue
    const weeklyRevenue = orders
        .filter(order => {
            const orderDate = new Date(order.timestamp || order.createdAt);
            return orderDate >= oneWeekAgo && order.status === 'completed';
        })
        .reduce((total, order) => total + (order.total || 0), 0);
    
    // Monthly revenue
    const monthlyRevenue = orders
        .filter(order => {
            const orderDate = new Date(order.timestamp || order.createdAt);
            return orderDate >= oneMonthAgo && order.status === 'completed';
        })
        .reduce((total, order) => total + (order.total || 0), 0);
    
    // Total revenue
    const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((total, order) => total + (order.total || 0), 0);
    
    // Update elements
    const todayRevenueEl = document.getElementById('today-revenue');
    const weeklyRevenueEl = document.getElementById('weekly-revenue');
    const monthlyRevenueEl = document.getElementById('monthly-revenue');
    const totalRevenueEl = document.getElementById('total-revenue');
    
    if (todayRevenueEl) todayRevenueEl.textContent = `₱${todayRevenue.toFixed(2)}`;
    if (weeklyRevenueEl) weeklyRevenueEl.textContent = `₱${weeklyRevenue.toFixed(2)}`;
    if (monthlyRevenueEl) monthlyRevenueEl.textContent = `₱${monthlyRevenue.toFixed(2)}`;
    if (totalRevenueEl) totalRevenueEl.textContent = `₱${totalRevenue.toFixed(2)}`;
}

// Add this method for order metrics
updateOrderMetrics(orders) {
    const today = new Date().toDateString();
    
    // Today's orders
    const todayOrders = orders.filter(order => 
        new Date(order.timestamp || order.createdAt).toDateString() === today
    );
    
    // Completed orders for average calculation
    const completedOrders = orders.filter(order => order.status === 'completed');
    const totalRevenue = completedOrders.reduce((total, order) => total + (order.total || 0), 0);
    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    
    // Completion rate
    const completionRate = orders.length > 0 ? 
        (completedOrders.length / orders.length) * 100 : 0;
    
    // Update elements
    const todayOrdersEl = document.getElementById('today-orders');
    const avgOrderValueEl = document.getElementById('avg-order-value');
    const completionRateEl = document.getElementById('completion-rate');
    const totalOrdersEl = document.getElementById('total-orders-count');
    
    if (todayOrdersEl) todayOrdersEl.textContent = todayOrders.length;
    if (avgOrderValueEl) avgOrderValueEl.textContent = `₱${avgOrderValue.toFixed(2)}`;
    if (completionRateEl) completionRateEl.textContent = `${completionRate.toFixed(1)}%`;
    if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
}

    loadRecentActivity(orders) {
        const container = document.getElementById('recent-activity');
        if (!container) return;

        const recentOrders = orders
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);

        if (recentOrders.length === 0) {
            container.innerHTML = '<p class="empty-state">No recent activity</p>';
            return;
        }

        container.innerHTML = recentOrders.map(order => `
            <div class="activity-item">
                <div class="activity-type">New Order - ${order.status.toUpperCase()}</div>
                <div class="activity-details">Order #${order.id} - ${order.customer || 'Customer'}</div>
                <div class="activity-time">${new Date(order.timestamp).toLocaleString()}</div>
            </div>
        `).join('');
    }

    // Menu Management Methods
    loadMenuItems() {
        const menu = JSON.parse(localStorage.getItem('saladaze_menu') || '[]');
        this.displayMenuItems(menu);
    }

    displayMenuItems(menu) {
        const container = document.getElementById('menu-items-list');
        if (!container) return;
        
        if (menu.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-utensils"></i>
                    <h3>No Menu Items</h3>
                    <p>Get started by adding your first menu item</p>
                </div>`;
            return;
        }

        container.innerHTML = menu.map(item => `
            <div class="menu-item-card">
                <div class="menu-item-header">
                    <h3 class="menu-item-name">${item.name}</h3>
                    <div class="menu-item-price">₱${item.price.toFixed(2)}</div>
                </div>
                <div class="menu-item-category">${this.formatCategory(item.category)}</div>
                <p class="menu-item-description">${item.description || 'No description available'}</p>
                <div class="menu-item-actions">
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${item.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-secondary btn-sm availability-btn" data-id="${item.id}">
                        <i class="fas fa-eye${item.available === false ? '-slash' : ''}"></i> 
                        ${item.available === false ? 'Unavailable' : 'Available'}
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    filterMenuItems(category, searchTerm = '') {
        let menu = JSON.parse(localStorage.getItem('saladaze_menu') || '[]');
        
        if (category !== 'all') {
            menu = menu.filter(item => item.category === category);
        }
        
        if (searchTerm) {
            menu = menu.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        this.displayMenuItems(menu);
    }

    showAddItemModal() {
        const modal = document.getElementById('add-item-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.getElementById('add-item-form').reset();
        }
    }

    closeAddItemModal() {
        const modal = document.getElementById('add-item-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    saveMenuItem() {
        const name = document.getElementById('item-name').value.trim();
        const price = parseFloat(document.getElementById('item-price').value) || 0;
        const category = document.getElementById('item-category').value;
        const description = document.getElementById('item-description').value.trim();
        const image = document.getElementById('item-image').value.trim();

        if (!name || !category) {
            this.showNotification('Please provide item name and category', 'error');
            return;
        }

        if (price <= 0) {
            this.showNotification('Please enter a valid price', 'error');
            return;
        }
        
        const menu = JSON.parse(localStorage.getItem('saladaze_menu') || '[]');
        const newItem = { 
            id: 'item_' + Date.now(),
            name, 
            price, 
            category, 
            description,
            image: image || 'images/default-food.jpg',
            available: true,
            createdAt: new Date().toISOString()
        };
        
        menu.push(newItem);
        localStorage.setItem('saladaze_menu', JSON.stringify(menu));
        
        this.closeAddItemModal();
        this.loadMenuItems();
        this.showNotification('Menu item added successfully!', 'success');
        
        // Refresh customer menu
        window.dispatchEvent(new Event('storage'));
    }

    editMenuItem(itemId) {
        console.log('Editing item:', itemId);
        const menu = JSON.parse(localStorage.getItem('saladaze_menu') || '[]');
        const item = menu.find(m => m.id === itemId);
        
        if (item) {
            document.getElementById('edit-item-id').value = item.id;
            document.getElementById('edit-item-name').value = item.name;
            document.getElementById('edit-item-price').value = item.price;
            document.getElementById('edit-item-category').value = item.category;
            document.getElementById('edit-item-description').value = item.description || '';
            document.getElementById('edit-item-image').value = item.image || '';
            
            const modal = document.getElementById('edit-item-modal');
            if (modal) {
                modal.style.display = 'flex';
            }
        } else {
            this.showNotification('Menu item not found', 'error');
        }
    }

    closeEditItemModal() {
        const modal = document.getElementById('edit-item-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    updateMenuItem() {
        const itemId = document.getElementById('edit-item-id').value;
        const name = document.getElementById('edit-item-name').value.trim();
        const price = parseFloat(document.getElementById('edit-item-price').value) || 0;
        const category = document.getElementById('edit-item-category').value;
        const description = document.getElementById('edit-item-description').value.trim();
        const image = document.getElementById('edit-item-image').value.trim();

        if (!name || !category) {
            this.showNotification('Please provide item name and category', 'error');
            return;
        }

        if (price <= 0) {
            this.showNotification('Please enter a valid price', 'error');
            return;
        }
        
        const menu = JSON.parse(localStorage.getItem('saladaze_menu') || '[]');
        const itemIndex = menu.findIndex(m => m.id === itemId);
        
        if (itemIndex !== -1) {
            menu[itemIndex] = {
                ...menu[itemIndex],
                name,
                price,
                category,
                description,
                image: image || 'images/default-food.jpg'
            };
            
            localStorage.setItem('saladaze_menu', JSON.stringify(menu));
            this.closeEditItemModal();
            this.loadMenuItems();
            this.showNotification('Menu item updated successfully!', 'success');
            
            // Refresh customer menu
            window.dispatchEvent(new Event('storage'));
        } else {
            this.showNotification('Menu item not found', 'error');
        }
    }

    toggleItemAvailability(itemId) {
        console.log('Toggling availability for item:', itemId);
        const menu = JSON.parse(localStorage.getItem('saladaze_menu') || '[]');
        const item = menu.find(m => m.id === itemId);
        
        if (item) {
            item.available = !item.available;
            localStorage.setItem('saladaze_menu', JSON.stringify(menu));
            this.loadMenuItems();
            
            const status = item.available ? 'available' : 'unavailable';
            this.showNotification(`Item marked as ${status}!`, 'success');
            
            // Refresh customer menu
            window.dispatchEvent(new Event('storage'));
        } else {
            this.showNotification('Menu item not found', 'error');
        }
    }

    deleteMenuItem(itemId) {
        console.log('Deleting item:', itemId);
        if (!confirm('Are you sure you want to delete this menu item?')) return;
        
        let menu = JSON.parse(localStorage.getItem('saladaze_menu') || '[]');
        const initialLength = menu.length;
        menu = menu.filter(m => m.id !== itemId);
        
        if (menu.length < initialLength) {
            localStorage.setItem('saladaze_menu', JSON.stringify(menu));
            this.loadMenuItems();
            this.showNotification('Menu item deleted successfully!', 'success');
            
            // Refresh customer menu
            window.dispatchEvent(new Event('storage'));
        } else {
            this.showNotification('Menu item not found', 'error');
        }
    }

    // User Management Methods
loadUsers() {
    // Get ALL users from localStorage (not just current user)
    const allUsers = JSON.parse(localStorage.getItem('saladaze_users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('saladaze_current_user')) || this.currentUser;
    
    // Combine all users with current user if not already in the list
    const users = [...allUsers];
    if (currentUser && !users.some(user => user.email === currentUser.email)) {
        users.push(currentUser);
    }
    
    this.displayUsers(users);
}

displayUsers(users) {
        const container = document.getElementById('users-list');
        if (!container) return;

        if (users.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No Users Found</h3>
                    <p>No user accounts have been created yet</p>
                </div>`;
            return;
        }

        container.innerHTML = users.map(user => {
            const orderCount = this.getUserOrderCount(user.email);
            const totalSpent = this.getUserTotalSpent(user.email);
            const isCurrentUser = user.email === (this.currentUser?.email || JSON.parse(localStorage.getItem('saladaze_current_user') || '{}').email);
            
            return `
            <div class="user-management-item">
                <div class="user-info">
                    <div class="user-avatar-small">${user.name?.charAt(0) || user.fullName?.charAt(0) || 'U'}</div>
                    <div class="user-details">
                        <h4>${user.name || user.fullName || 'Unknown User'} ${isCurrentUser ? '(Currently Logged In)' : ''}</h4>
                        <p>${user.email}</p>
                        <span class="user-role-badge">${user.role || 'customer'}</span>
                        <span class="status-indicator active">Active</span>
                    </div>
                </div>
                <div class="user-stats">
                    <div class="user-stat">${orderCount} orders</div>
                    <div class="user-stat">₱${totalSpent.toFixed(2)} spent</div>
                    <div class="user-stat">${this.getUserJoinDate(user.createdAt)}</div>
                </div>
                <div class="user-actions">
                    ${isCurrentUser ? '<span class="text-muted">Currently Active Session</span>' : ''}
                </div>
            </div>
            `;
        }).join('');
    }

    filterUsers(searchTerm) {
        // In single user system, search doesn't do much but we'll keep it
        this.loadUsers();
    }

    getUserOrderCount(userEmail) {
        const orders = JSON.parse(localStorage.getItem('saladaze_orders') || '[]');
        // Match by customerEmail if available, otherwise match by exact email
        return orders.filter(order => {
            return order.customerEmail === userEmail || (order.customerEmail === '' && userEmail === this.currentUser?.email);
        }).length;
    }

    getUserTotalSpent(userEmail) {
        const orders = JSON.parse(localStorage.getItem('saladaze_orders') || '[]');
        // Match by customerEmail if available, otherwise match by exact email
        const userOrders = orders.filter(order => {
            return order.customerEmail === userEmail || (order.customerEmail === '' && userEmail === this.currentUser?.email);
        });
        return userOrders.reduce((total, order) => total + (order.total || 0), 0);
    }

    getUserJoinDate(createdAt) {
        if (!createdAt) return 'Recently joined';
        
        const joinDate = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - joinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Joined today';
        if (diffDays < 7) return `Joined ${diffDays} days ago`;
        if (diffDays < 30) return `Joined ${Math.ceil(diffDays / 7)} weeks ago`;
        
        return `Joined ${joinDate.toLocaleDateString()}`;
    }

    // Analytics Methods
    initializeSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        this.salesChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Daily Revenue',
                    data: [],
                    borderColor: '#2d5a27',
                    backgroundColor: 'rgba(45, 90, 39, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#333333'
                        },
                        ticks: {
                            color: '#cccccc'
                        }
                    },
                    y: {
                        grid: {
                            color: '#333333'
                        },
                        ticks: {
                            color: '#cccccc',
                            callback: function(value) {
                                return '₱' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    updateTodaySummary(orders) {
        const today = new Date().toDateString();
        const todayOrders = orders.filter(order => 
            new Date(order.timestamp).toDateString() === today
        );
        const completedOrders = todayOrders.filter(order => order.status === 'completed');
        const todayRevenue = completedOrders.reduce((total, order) => total + (order.total || 0), 0);
        const avgOrderValue = completedOrders.length > 0 ? todayRevenue / completedOrders.length : 0;
        const completionRate = todayOrders.length > 0 ? (completedOrders.length / todayOrders.length) * 100 : 0;

        const todayOrdersEl = document.getElementById('today-orders');
        const todayRevenueEl = document.getElementById('today-revenue');
        const avgOrderValueEl = document.getElementById('avg-order-value');
        const completionRateEl = document.getElementById('completion-rate');

        if (todayOrdersEl) todayOrdersEl.textContent = todayOrders.length;
        if (todayRevenueEl) todayRevenueEl.textContent = `₱${todayRevenue.toFixed(2)}`;
        if (avgOrderValueEl) avgOrderValueEl.textContent = `₱${avgOrderValue.toFixed(2)}`;
        if (completionRateEl) completionRateEl.textContent = `${completionRate.toFixed(1)}%`;
    }

    updateSalesChart(orders) {
        if (!this.salesChart) return;

        // Generate last 7 days data
        const days = [];
        const revenue = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toDateString();
            
            const dayOrders = orders.filter(order => 
                new Date(order.timestamp).toDateString() === dateString && 
                order.status === 'completed'
            );
            
            const dayRevenue = dayOrders.reduce((total, order) => total + (order.total || 0), 0);
            
            days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            revenue.push(dayRevenue);
        }
        
        this.salesChart.data.labels = days;
        this.salesChart.data.datasets[0].data = revenue;
        this.salesChart.update();
    }

    updateTopItems(orders, menu) {
        const container = document.getElementById('top-items-list');
        if (!container) return;

        const itemSales = {};
        
        orders.forEach(order => {
            if (order.status === 'completed') {
                order.items?.forEach(item => {
                    if (!itemSales[item.id]) {
                        itemSales[item.id] = {
                            id: item.id,
                            name: item.name,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    itemSales[item.id].quantity += item.quantity || 1;
                    itemSales[item.id].revenue += (item.price || 0) * (item.quantity || 1);
                });
            }
        });
        
        const topItems = Object.values(itemSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        
        if (topItems.length === 0) {
            container.innerHTML = '<div class="empty-state">No sales data available</div>';
            return;
        }
        
        container.innerHTML = topItems.map((item, index) => `
            <div class="top-item-card">
                <div class="top-item-info">
                    <div class="top-item-rank">${index + 1}</div>
                    <div class="top-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.quantity} orders</p>
                    </div>
                </div>
                <div class="top-item-stats">
                    <div class="top-item-sales">₱${item.revenue.toFixed(2)}</div>
                    <div class="top-item-orders">${item.quantity} sold</div>
                </div>
            </div>
        `).join('');
    }

    // Utility Methods
    formatCategory(category) {
        const categoryMap = {
            'salads': 'Salad Bowls',
            'wraps': 'Wraps',
            'drinks': 'Drinks'
        };
        return categoryMap[category] || category;
    }

    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

function staffLogout() {
    localStorage.removeItem('currentStaff');
    window.location.href = 'shared.html';
}
function showSection(section) {
    if (window.adminDashboard) {
        window.adminDashboard.showSection(section);
    }
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    window.adminDashboard = new AdminDashboard();
});
