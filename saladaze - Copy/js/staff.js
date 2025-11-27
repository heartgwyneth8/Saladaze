// Staff Dashboard - Order Management Only
class StaffOrderManager {
    constructor() {
        this.orders = [];
        this.currentSection = 'orders';
        this.filters = {
            status: 'all',
            search: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.loadOrders();
        this.setupRealTimeUpdates();
        this.updateDashboardStats();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.nav-link').getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Search
        const searchInput = document.getElementById('orderSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.filterOrders();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.filterOrders();
            });
        }
    }

// Add this method to your StaffOrderManager class
setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

// DEBUG: Helper function to get customer address - with detailed logging
getCustomerAddress(order) {
    console.log('🔍 DEBUG Order structure for address:', order);
    
    // Check all possible address locations
    const possibleAddressFields = [
        'address',
        'deliveryAddress', 
        'shippingAddress',
        'customerAddress',
        'delivery_address',
        'shipping_address'
    ];
    
    for (const field of possibleAddressFields) {
        if (order[field] && order[field] !== 'No address provided' && order[field] !== '') {
            console.log(`✅ Found address in field: ${field} - ${order[field]}`);
            return order[field];
        }
    }
    
    // Check if address is in customer object
    if (order.customer && order.customer.address) {
        console.log('✅ Found address in customer.address:', order.customer.address);
        return order.customer.address;
    }
    
    // Check for address components
    if (order.street && order.city) {
        const address = `${order.street}, ${order.city}, ${order.region || order.state || ''} ${order.postalCode || order.zipCode || ''}`.trim();
        console.log('✅ Built address from components:', address);
        return address;
    }
    
    console.log('❌ No address found in order object');
    return 'No address provided';
}

    setupRealTimeUpdates() {
        // Listen for new orders from customer page
        window.addEventListener('storage', (e) => {
            if (e.key === 'saladaze_orders') {
                this.loadOrders();
            }
        });

        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.loadOrders();
        }, 30000);
    }

    loadOrders() {
    try {
        const storedOrders = localStorage.getItem('saladaze_orders');
        this.orders = storedOrders ? JSON.parse(storedOrders) : [];
        
        // DEBUG: Check all orders for addresses
        this.debugAllOrdersAddresses();
        
        // Sort by timestamp (newest first)
        this.orders.sort((a, b) => {
            const dateA = new Date(a.timestamp || a.createdAt);
            const dateB = new Date(b.timestamp || b.createdAt);
            return dateB - dateA;
        });

        this.updateDashboardStats();
        this.displayOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
        this.orders = [];
    }
}
    // Add this debug function to check all orders
debugAllOrders() {
    const storedOrders = localStorage.getItem('saladaze_orders');
    console.log('📦 All orders in localStorage:', storedOrders);
    
    if (storedOrders) {
        const orders = JSON.parse(storedOrders);
        console.log('📦 Parsed orders:', orders);
        
        orders.forEach((order, index) => {
            console.log(`📦 Order ${index + 1}:`, order);
            console.log(`   - ID: ${order.id}`);
            console.log(`   - Address field: ${order.address}`);
            console.log(`   - Has addresses array: ${!!order.addresses}`);
            console.log(`   - Customer name: ${order.customerName}`);
        });
    }
}

// Add this function to staff.js to debug all orders
debugAllOrdersAddresses() {
    const storedOrders = localStorage.getItem('saladaze_orders');
    if (!storedOrders) {
        console.log('❌ No orders found in localStorage');
        return;
    }
    
    const orders = JSON.parse(storedOrders);
    console.log('=== ALL ORDERS DEBUG ===');
    console.log('Total orders:', orders.length);
    
    orders.forEach((order, index) => {
        console.log(`--- Order ${index + 1} (${order.id}) ---`);
        console.log('Status:', order.status);
        console.log('Customer:', order.customerName);
        
        // Check address field directly
        if (order.address) {
            console.log('📍 Address field:', order.address);
        } else {
            console.log('📍 Address field: NOT FOUND');
        }
        
        // Check if there are any address-related fields
        const addressFields = Object.keys(order).filter(key => 
            key.toLowerCase().includes('address') || 
            key.toLowerCase().includes('street') || 
            key.toLowerCase().includes('city')
        );
        
        if (addressFields.length > 0) {
            console.log('📍 Address-related fields found:', addressFields);
            addressFields.forEach(field => {
                console.log(`   ${field}:`, order[field]);
            });
        } else {
            console.log('📍 No address-related fields found');
        }
        
        console.log('---');
    });
    console.log('=== END ALL ORDERS DEBUG ===');
}

    updateDashboardStats() {
        const totalOrders = this.orders.length;
        const pendingOrders = this.orders.filter(order => order.status === 'pending' || !order.status).length;
        const activeOrders = this.orders.filter(order => order.status === 'preparing' || order.status === 'ready').length;
        
        // Today's orders
        const today = new Date().toDateString();
        const todayOrders = this.orders.filter(order => {
            const orderDate = new Date(order.timestamp || order.createdAt).toDateString();
            return orderDate === today;
        }).length;
        
        const completedToday = this.orders.filter(order => {
            const orderDate = new Date(order.timestamp || order.createdAt).toDateString();
            return orderDate === today && order.status === 'completed';
        }).length;

        // Latest order
        const latestOrder = this.orders[0];
        const latestOrderText = latestOrder ? `Order #${latestOrder.id} - ${latestOrder.customerName || 'Customer'}` : 'No recent orders';
        const latestOrderTime = latestOrder ? this.formatTime(new Date(latestOrder.timestamp || latestOrder.createdAt)) : '-';

        // Update DOM elements
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('pendingOrders').textContent = pendingOrders;
        document.getElementById('activeOrders').textContent = activeOrders;
        document.getElementById('todayOrders').textContent = todayOrders;
        document.getElementById('completedToday').textContent = completedToday;
        document.getElementById('latestOrder').textContent = latestOrderText;
        document.getElementById('latestOrderTime').textContent = latestOrderTime;
    }
getCustomerName(order) {
    console.log('🔍 DEBUG Order structure for customer name:', order);
    
    // Check all possible customer name locations
    if (order.customerName && order.customerName !== 'Guest') {
        return order.customerName;
    }
    
    if (order.customer && order.customer.name) {
        return order.customer.name;
    }
    
    if (order.user && order.user.name) {
        return order.user.name;
    }
    
    if (order.userName) {
        return order.userName;
    }
    
    // Check if name is in customer object with different field names
    if (order.customer) {
        const nameFields = ['name', 'fullName', 'firstName', 'username'];
        for (const field of nameFields) {
            if (order.customer[field]) {
                return order.customer[field];
            }
        }
    }
    
    return 'Guest';
}
    displayOrders() {
        if (this.currentSection === 'orders') {
            this.displayAllOrders();
        } else if (this.currentSection === 'update-status') {
            this.displayStatusUpdate();
        }
    }

    displayAllOrders() {
        const container = document.getElementById('ordersContainer');
        if (!container) return;

        const filteredOrders = this.filterOrdersByCriteria(this.orders);
        
        if (filteredOrders.length === 0) {
            container.innerHTML = this.getEmptyState('No orders found', 'No orders match your current filters');
            return;
        }

        container.innerHTML = filteredOrders.map(order => this.createOrderCard(order)).join('');
        this.attachOrderEventListeners();
    }

    displayStatusUpdate() {
        const container = document.getElementById('statusUpdateGrid');
        if (!container) return;

        const pendingOrders = this.orders.filter(order => 
            ['pending', 'preparing', 'ready'].includes(order.status || 'pending')
        ).slice(0, 6); // Show max 6 orders

        if (pendingOrders.length === 0) {
            container.innerHTML = this.getEmptyState('No orders to update', 'All orders are completed or cancelled');
            return;
        }

        container.innerHTML = pendingOrders.map(order => this.createStatusCard(order)).join('');
        this.attachOrderEventListeners();
    }

    createOrderCard(order) {
    const orderTime = new Date(order.timestamp || order.createdAt);
    const now = new Date();
    const timeDiff = (now - orderTime) / (1000 * 60); // minutes
    const isRecent = timeDiff < 30; // Less than 30 minutes old
    const isUrgent = timeDiff > 45; // More than 45 minutes old

    let priorityClass = '';
    if (isUrgent) priorityClass = 'urgent';
    else if (isRecent) priorityClass = 'priority';

    // FIXED: Use the new functions
    const customerName = this.getCustomerName(order);
    const customerAddress = this.getCustomerAddress(order);
    const paymentMethod = order.paymentMethod || 'Cash';

    return `
        <div class="order-management-item ${priorityClass}" data-order-id="${order.id}">
            <div class="order-info">
                <div class="order-header">
                    <div>
                        <h3>Order #${order.id}</h3>
                        <div class="order-details">
                            <div><strong>Customer:</strong> ${customerName}</div>
                            <div><strong>Address:</strong> ${customerAddress}</div>
                            <div><strong>Payment:</strong> ${paymentMethod}</div>
                            <div><strong>Time:</strong> ${this.formatDateTime(order.timestamp || order.createdAt)}</div>
                        </div>
                    </div>
                    <div class="order-status ${order.status || 'pending'}">
                        ${(order.status || 'pending').toUpperCase()}
                    </div>
                </div>
                
                <div class="order-items">
                    <h4>Order Items:</h4>
                    ${order.items ? order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x${item.quantity || 1}</span>
                            <span>₱${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                    `).join('') : 'No items'}
                </div>
                
                <div class="order-total">
                    <strong>Total: ₱${order.total ? order.total.toFixed(2) : '0.00'}</strong>
                </div>
                
                <div class="quick-actions">
                    ${this.getStatusButtons(order.status || 'pending', order.id)}
                </div>
            </div>
        </div>
    `;
}

createStatusCard(order) {
    // FIXED: Use the new functions
    const customerName = this.getCustomerName(order);
    const customerAddress = this.getCustomerAddress(order);
    const paymentMethod = order.paymentMethod || 'Cash';

    return `
        <div class="status-card">
            <div class="status-card-header">
                <div class="status-card-title">
                    Order #${order.id}
                </div>
                <div class="order-status ${order.status || 'pending'}">
                    ${(order.status || 'pending').toUpperCase()}
                </div>
            </div>
            
            <div class="order-details">
                <div><strong>Customer:</strong> ${customerName}</div>
                <div><strong>Address:</strong> ${customerAddress}</div>
                <div><strong>Payment:</strong> ${paymentMethod}</div>
                <div><strong>Time:</strong> ${this.formatTime(new Date(order.timestamp || order.createdAt))}</div>
            </div>
            
            <div class="order-items">
                ${order.items ? order.items.slice(0, 3).map(item => `
                    <div class="order-item">
                        <span>${item.name} x${item.quantity || 1}</span>
                        <span>₱${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                `).join('') : ''}
                ${order.items && order.items.length > 3 ? 
                    `<div class="order-item"><span>+${order.items.length - 3} more items</span></div>` : ''}
            </div>
            
            <div class="order-total">
                <strong>Total: ₱${order.total ? order.total.toFixed(2) : '0.00'}</strong>
            </div>
            
            <div class="status-actions">
                ${this.getStatusButtons(order.status || 'pending', order.id)}
            </div>
        </div>
    `;
}

    getStatusButtons(currentStatus, orderId) {
        const statusFlow = {
            'pending': [
                { status: 'preparing', text: 'Start Preparing', class: 'btn-primary', icon: 'fa-utensils' },
                { status: 'cancelled', text: 'Cancel Order', class: 'btn-danger', icon: 'fa-times' }
            ],
            'preparing': [
                { status: 'ready', text: 'Mark as Ready', class: 'btn-success', icon: 'fa-check' },
                { status: 'cancelled', text: 'Cancel Order', class: 'btn-danger', icon: 'fa-times' }
            ],
            'ready': [
                { status: 'completed', text: 'Complete Order', class: 'btn-success', icon: 'fa-flag-checkered' }
            ]
        };

        const availableActions = statusFlow[currentStatus] || [];
        
        return availableActions.map(action => `
            <button class="btn btn-sm ${action.class} status-btn" 
                    data-order-id="${orderId}" 
                    data-status="${action.status}">
                <i class="fas ${action.icon}"></i> ${action.text}
            </button>
        `).join('');
    }

    attachOrderEventListeners() {
        // Status update buttons
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.closest('.status-btn').getAttribute('data-order-id');
                const newStatus = e.target.closest('.status-btn').getAttribute('data-status');
                this.updateOrderStatus(orderId, newStatus);
            });
        });
    }

    updateOrderStatus(orderId, newStatus) {
        const orderIndex = this.orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            // Update the order
            this.orders[orderIndex].status = newStatus;
            this.orders[orderIndex].updatedAt = new Date().toISOString();
            this.orders[orderIndex].updatedBy = 'staff';
            
            // Save back to localStorage
            localStorage.setItem('saladaze_orders', JSON.stringify(this.orders));
            
            // Show confirmation
            this.showToast(`Order #${orderId} status updated to ${newStatus}`);
            
            // Reload display
            this.loadOrders();
            
            // Trigger event for other pages
            window.dispatchEvent(new Event('storage'));
        }
    }

    filterOrdersByCriteria(orders) {
        return orders.filter(order => {
            // Status filter
            if (this.filters.status !== 'all' && order.status !== this.filters.status) {
                return false;
            }
            
            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                const orderText = [
                    order.id,
                    order.customerName,
                    order.customerEmail,
                    ...(order.items ? order.items.map(item => item.name) : [])
                ].join(' ').toLowerCase();
                
                if (!orderText.includes(searchTerm)) return false;
            }
            
            return true;
        });
    }

    filterOrders() {
        this.displayAllOrders();
    }

    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section and activate nav link
        document.getElementById(section + '-section').classList.add('active');
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // Hide overview grid for update-status section only
        const overviewGrid = document.getElementById('overviewGrid');
        if (section === 'update-status') {
            overviewGrid.style.display = 'none';
        } else {
            overviewGrid.style.display = 'grid';
        }
        
        this.currentSection = section;
        this.displayOrders();
    }

    getEmptyState(title, message) {
        return `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    }

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString();
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    showToast(message) {
        // Create or reuse toast element
        let toast = document.getElementById('staff-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'staff-toast';
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                padding: 12px 24px;
                border-radius: 6px;
                z-index: 10000;
                opacity: 0;
                transition: all 0.3s ease;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.opacity = '1';
        
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
    }
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            
            // Add overlay when sidebar is open
            if (sidebar.classList.contains('active')) {
                addMobileOverlay();
            } else {
                removeMobileOverlay();
            }
        });
        
        // Close sidebar when clicking on overlay or main content
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }
    
    function addMobileOverlay() {
        let overlay = document.querySelector('.mobile-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'mobile-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 999;
                display: block;
            `;
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', closeMobileMenu);
        }
    }
    
    function removeMobileOverlay() {
        const overlay = document.querySelector('.mobile-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    function closeMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
        removeMobileOverlay();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.staffManager = new StaffOrderManager();
    setupMobileMenu(); // Add this line
});

// Global functions
function refreshOrders() {
    if (window.staffManager) {
        window.staffManager.loadOrders();
        window.staffManager.showToast('Orders refreshed');
    }
}

function goToCustomerPage() {
    window.location.href = 'customer.html';
}

// Add this function to staff.js
function staffLogout() {
    localStorage.removeItem('currentStaff');
    window.location.href = 'shared.html';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.staffManager = new StaffOrderManager();
});