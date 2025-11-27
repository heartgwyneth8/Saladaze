// Application State
let cart = JSON.parse(localStorage.getItem('saladaze_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('saladaze_current_user')) || null;

// Add this function to cancel orders
function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
        return;
    }

    const allOrders = JSON.parse(localStorage.getItem('saladaze_orders') || '[]');
    const orderIndex = allOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        // Check if order can be cancelled (only pending or preparing orders)
        const order = allOrders[orderIndex];
        if (order.status === 'completed' || order.status === 'cancelled') {
            showToast('This order cannot be cancelled.');
            return;
        }
        
        if (order.status === 'ready') {
            showToast('Order is already ready for pickup/delivery and cannot be cancelled.');
            return;
        }
        
        // Update order status
        allOrders[orderIndex].status = 'cancelled';
        allOrders[orderIndex].cancelledAt = new Date().toISOString();
        
        // Save back to localStorage
        localStorage.setItem('saladaze_orders', JSON.stringify(allOrders));
        
        // Show success message
        showToast('Order cancelled successfully!');
        
        // Refresh the tracking view
        showOrderTracking();
        
        // Trigger storage event for staff page
        window.dispatchEvent(new Event('storage'));
    } else {
        showToast('Order not found.');
    }
}

// Helper function for status background colors
function getStatusBackground(status) {
    const colors = {
        'pending': '#6c757d',
        'preparing': '#fd7e14',
        'ready': '#17a2b8',
        'completed': '#28a745',
        'cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
}

// Menu Database
const menuItems = {
    salads: {
        caesar: {
            name: "Caesar Salad",
            price: 8.99,
            description: "Crisp romaine lettuce with parmesan, croutons, and classic Caesar dressing",
            image: "images/caesar-salad.jpg"
        },
        greek: {
            name: "Greek Salad",
            price: 9.49,
            description: "Fresh vegetables with feta cheese, olives, and Greek vinaigrette",
            image: "images/greek-salad.jpg"
        },
        cobb: {
            name: "Cobb Salad",
            price: 10.99,
            description: "Hearty salad with chicken, bacon, eggs, avocado, and blue cheese",
            image: "images/cobb-salad.jpg"
        },
        asian: {
            name: "Asian Chicken Salad",
            price: 9.99,
            description: "Crunchy salad with chicken, mandarin oranges, and sesame ginger dressing",
            image: "images/asian-salad.jpg"
        },
        mediterranean: {
            name: "Mediterranean Salad",
            price: 8.99,
            description: "Fresh vegetables with feta cheese, olives, and Greek vinaigrette",
            image: "images/mediterranean-salad.jpg"
        },
        mixed: {
            name: "Mixed Salad",
            price: 13.99,
            description: "Crisp lettuce varieties, romaine and spring greens, sliced cucumber, cherry tomatoes, and shaved carrots",
            image: "images/mixed-salad.jpg"
        },
        gainoa: {
            name: "Gainoa Salad",
            price: 13.99,
            description: "Mixed greens, cannellini beans, ripe cherry tomatoes, Kalamata olives, shaved Parmesan, and red wine vinaigrette",
            image: "images/gainoa-salad.jpg"
        },
        green: {
            name: "Green Salad",
            price: 13.99,
            description: "Spring mix, romaine, butter lettuce, and your choice of dressing",
            image: "images/green-salad.jpg"
        },
        southwest: {
            name: "Southwest Salad",
            price: 9.49,
            description: "Zesty salad with corn, black beans, avocado, and chipotle dressing",
            image: "images/southwest-salad.jpg"
        }
    },
    wraps: {
        chicken: {
            name: "Grilled Chicken Wrap",
            price: 8.99,
            description: "Grilled chicken, lettuce, tomato, and mayo in a whole wheat wrap",
            image: "images/chicken-wrap.jpg"
        },
        veggie: {
            name: "Veggie Wrap",
            price: 7.99,
            description: "Fresh vegetables, hummus, and greens in a spinach wrap",
            image: "images/veggie-wrap.jpg"
        },
        turkey: {
            name: "Turkey Club Wrap",
            price: 9.49,
            description: "Turkey, bacon, lettuce, tomato, and ranch in a flour tortilla",
            image: "images/turkey-wrap.jpg"
        },
        buffalo: {
            name: "Buffalo Chicken Wrap",
            price: 9.99,
            description: "Spicy buffalo chicken with celery, carrots, and blue cheese dressing",
            image: "images/buffalo-wrap.jpg"
        },
        caesar: {
            name: "Caesar Wrap",
            price: 8.49,
            description: "Grilled chicken, romaine, parmesan, and Caesar dressing in a wrap",
            image: "images/caesar-wrap.jpg"
        },
        falafel: {
            name: "Falafel Wrap",
            price: 8.99,
            description: "Crispy falafel with tahini sauce, lettuce, and tomatoes",
            image: "images/falafel-wrap.jpg"
        }
    },
    drinks: {
        lemonade: {
            name: "Fresh Lemonade",
            price: 3.99,
            description: "Freshly squeezed lemonade with mint",
            image: "images/lemonade.jpg"
        },
        iced_tea: {
            name: "Iced Tea",
            price: 2.99,
            description: "Fresh brewed iced tea, sweetened or unsweetened",
            image: "images/iced-tea.jpg"
        },
        smoothie: {
            name: "Berry Smoothie",
            price: 5.99,
            description: "Mixed berries, yogurt, and honey blended to perfection",
            image: "images/smoothie.jpg"
        },
        water: {
            name: "Bottled Water",
            price: 1.99,
            description: "Pure spring water",
            image: "images/water.jpg"
        },
        green_juice: {
            name: "Green Juice",
            price: 6.49,
            description: "Kale, spinach, apple, and lemon juice",
            image: "images/green-juice.jpg"
        },
        coffee: {
            name: "Iced Coffee",
            price: 3.49,
            description: "Fresh brewed iced coffee with your choice of milk",
            image: "images/coffee.jpg"
        },
        mango_lassi: {
            name: "Mango Lassi",
            price: 4.99,
            description: "Traditional yogurt-based mango drink",
            image: "images/mango-lassi.jpg"
        },
        coconut_water: {
            name: "Coconut Water",
            price: 3.99,
            description: "Fresh coconut water with pulp",
            image: "images/coconut-water.jpg"
        }
    }
};

// Add this debug function to check orders
function debugOrders() {
    const allOrders = JSON.parse(localStorage.getItem('saladaze_orders') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    console.log('All orders in localStorage:', allOrders);
    console.log('Current user:', currentUser);
    console.log('User email:', currentUser.email);
    
    const userOrders = allOrders.filter(order => 
        order.customerEmail === currentUser.email || 
        order.customerName === currentUser.name
    );
    
    console.log('Filtered user orders:', userOrders);
    
    return userOrders;
}

function showOrderTracking() {
    // Get current user's orders using debug function first
    const userOrders = debugOrders();
    
    // Create tracking modal
    const existingModal = document.querySelector('.tracking-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'tracking-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="tracking-content" style="
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        ">
            <div class="tracking-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #e0e0e0;
                padding-bottom: 16px;
            ">
                <h3 style="margin: 0; color: #2d5a27;">Track My Order</h3>
                <button class="close-tracking" onclick="closeOrderTracking()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.2s ease;"
                    onmouseover="this.style.color='#2d5a27'" onmouseout="this.style.color='#666'">×</button>
            </div>
            <div class="tracking-body">
                ${userOrders.length > 0 ? 
                    userOrders.map(order => {
                        console.log('Rendering order:', order);
                        return createOrderTrackingCard(order);
                    }).join('') 
                    : `
                    <div style="text-align: center; padding: 40px 20px; color: var(--text-light);">
                        <i class="fas fa-truck" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                        <h3 style="color: var(--text-light); margin-bottom: 8px;">No Orders Found</h3>
                        <p>You haven't placed any orders yet.</p>
                        <p style="font-size: 14px; margin-top: 8px;">Your orders will appear here after you place an order.</p>
                    </div>
                `}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.tracking-content').style.transform = 'translateY(0)';
    }, 10);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeOrderTracking();
        }
    });
}

// FIXED: Login status management
function checkLoginStatus() {
    // Clear all old login systems first
    const oldUser = localStorage.getItem('currentUser');
    const oldIsLoggedIn = localStorage.getItem('isLoggedIn');
    const oldUserEmail = localStorage.getItem('userEmail');
    
    // Get the current user from the main system
    const currentUser = JSON.parse(localStorage.getItem('saladaze_current_user') || 'null');
    
    const authBtn = document.getElementById('authBtn');
    const authText = document.getElementById('authText');
    
    if (!authBtn || !authText) {
        console.log('Auth elements not found');
        return;
    }
    
    if (currentUser) {
        // User is logged in through the main system
        window.currentUser = currentUser;
        
        // Update profile UI
        updateUserInterface();
        
    } else {
        // User is not logged in - clear everything
        authText.textContent = 'Login';
        window.currentUser = null;
        
        // Clear any old login data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('currentUser');
    }
}

function handleIntegratedLogout() {
    // Clear all login systems
    localStorage.removeItem('saladaze_current_user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('currentUser');
    window.currentUser = null;
    
    window.location.reload();
}

function handleIntegratedLogout() {
    // Clear all login systems
    localStorage.removeItem('saladaze_current_user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('currentUser');
    window.currentUser = null;
    
    window.location.reload();
}

// Initialize app
function initializeApp() {
    setupNavigation();
    setupCategoryTabs();
    renderMenu();
    setupCartFunctionality();
    setupModals();
    checkLoginStatus();
    updateUserInterface();
    updateCartCount(); // Initialize cart count
    
    // Listen for menu changes from staff page
    window.addEventListener('storage', function(e) {
        if (e.key === 'saladaze_menu') {
            renderMenu();
        }
        if (e.key === 'saladaze_cart') {
            // Update cart from localStorage
            cart = JSON.parse(localStorage.getItem('saladaze_cart')) || [];
            updateCartCount();
            updateCartDisplay();
            updateCartSummary();
        }
    });

    // Also listen for custom storage events (for same-page updates)
    window.addEventListener('saladaze_menu_updated', function() {
        renderMenu();
    });
}

// Setup category navigation
function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected category
            document.querySelectorAll('.menu-category').forEach(cat => {
                cat.classList.remove('active');
            });
            document.getElementById(category + 'Category').classList.add('active');
        });
    });
}

// Render the menu
function renderMenu() {
    // Load staff menu from localStorage
    const staffMenu = JSON.parse(localStorage.getItem('saladaze_menu') || '[]');
    renderStaffItems(staffMenu);
}

function renderStaffItems(staffMenu) {
    // FIXED: Filter to only show published items (published !== false)
    const publishedItems = staffMenu.filter(item => item.published !== false);
    
    console.log('Rendering staff items:', publishedItems.length);
    
    // Clear all category containers first
    const containers = {
        salads: document.querySelector('.salad-bowls-grid'),
        wraps: document.getElementById('wrapsGrid'),
        drinks: document.getElementById('drinksGrid')
    };
    
    // Clear containers
    Object.values(containers).forEach(c => {
        if (c) c.innerHTML = '';
    });
    
    // Add published items
    publishedItems.forEach(item => {
        // FIXED: Map category names properly
        let category = item.category || 'salads';
        if (category === 'salad-bowls') category = 'salads';
        
        const container = containers[category];
        
        if (container) {
            const card = document.createElement('div');
            card.className = 'menu-item-card';
            card.setAttribute('data-custom-id', item.id);
            
            card.innerHTML = `
                <div class="item-image">
                    <img src="${item.image || 'images/default-food.jpg'}" alt="${item.name}" class="item-img">
                    <div class="image-overlay"></div>
                </div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    ${item.size ? `<div class="item-size">${item.size}</div>` : ''}
                    <p class="item-description">${item.desc || item.description || ''}</p>
                    ${item.tags ? `<div class="item-tags">${item.tags.map(tag => `<span class="item-tag">${tag}</span>`).join('')}</div>` : ''}
                    <div class="item-footer">
                        <span class="item-price">₱${(parseFloat(item.price)||0).toFixed(2)}</span>
                        <button class="btn btn-primary add-to-cart-btn" data-custom-id="${item.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>`;
            container.appendChild(card);
        }
    });

    // FIXED: Wire add buttons for staff items with proper event handling
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        // Remove existing listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const id = this.getAttribute('data-custom-id');
            addMenuItemToCart(id);
        });
    });
}

// FIXED: Add menu item to cart function
function addMenuItemToCart(customId) {
    const menu = JSON.parse(localStorage.getItem('saladaze_menu') || '[]');
    const item = menu.find(m => String(m.id) === String(customId));
    
    if (!item) {
        showToast('Item not found');
        return;
    }
    
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('saladaze_cart')) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => String(cartItem.id) === String(customId));
    
    if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
        // Add new item to cart
        const cartItem = {
            id: item.id,
            name: item.name,
            price: parseFloat(item.price) || 0,
            category: item.category || 'custom',
            quantity: 1,
            image: item.image || 'images/default-food.jpg'
        };
        cart.push(cartItem);
    }
    
    // Save cart to localStorage
    localStorage.setItem('saladaze_cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    updateCartDisplay();
    updateCartSummary();
    showToast(`${item.name} added to cart`);
}

// FIXED: Update cart count function
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('saladaze_cart')) || [];
    const totalItems = cart.reduce((count, item) => count + (item.quantity || 1), 0);
    
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// FIXED: Update cart display function
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('saladaze_cart')) || [];
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Select an item to get started!</p>
            </div>
        `;
        return;
    }
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-image">
                    <img src="${item.image || 'images/default-food.jpg'}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₱${item.price.toFixed(2)} each</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, -1)">-</button>
                        <span class="quantity">${item.quantity || 1}</span>
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
            <div class="cart-item-total">
                ₱${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    
    updateCartSummary();
}

// FIXED: Update cart item quantity function
function updateCartItemQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('saladaze_cart')) || [];
    
    if (cart[index]) {
        cart[index].quantity = (cart[index].quantity || 1) + change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem('saladaze_cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        updateCartSummary();
    }
}

// FIXED: Remove from cart function
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('saladaze_cart')) || [];
    
    if (cart[index]) {
        const itemName = cart[index].name;
        cart.splice(index, 1);
        localStorage.setItem('saladaze_cart', JSON.stringify(cart));
        
        updateCartCount();
        updateCartDisplay();
        updateCartSummary();
        showToast(`${itemName} removed from cart`);
    }
}

// FIXED: Update cart summary function
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('saladaze_cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    const subtotalElement = document.getElementById('subtotalAmount');
    const taxElement = document.getElementById('taxAmount');
    const totalElement = document.getElementById('totalAmount');

    if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
    if (taxElement) taxElement.textContent = tax.toFixed(2);
    if (totalElement) totalElement.textContent = total.toFixed(2);
}

function proceedToCheckout() {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('saladaze_cart')) || [];
    
    // FIXED: Check BOTH user storage locations
    const saladazeUser = JSON.parse(localStorage.getItem('saladaze_current_user') || 'null');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    // Use the user that actually has data
    const loggedInUser = currentUser || saladazeUser;
    
    console.log('Cart before checkout:', cart);
    console.log('Saladaze User:', saladazeUser);
    console.log('Current User:', currentUser);
    console.log('Using User:', loggedInUser);
    
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }

    // FIXED: Get address from the correct user object
    let customerAddress = 'No address provided';
    
    console.log('🔍 Checking user addresses for order:');
    console.log('User object being used:', loggedInUser);
    
    if (loggedInUser && loggedInUser.addresses && loggedInUser.addresses.length > 0) {
        const address = loggedInUser.addresses[0];
        console.log('First address found:', address);
        
        // Check if all required fields exist and are not empty
        if (address.street && address.street.trim() !== '' && address.city && address.city.trim() !== '') {
            customerAddress = `${address.street}, ${address.city}`;
            if (address.region && address.region.trim() !== '') {
                customerAddress += `, ${address.region}`;
            }
            if (address.postalCode && address.postalCode.trim() !== '') {
                customerAddress += ` ${address.postalCode}`;
            }
            console.log('✅ Formatted address for order:', customerAddress);
        } else {
            console.log('❌ Address fields are empty:', {
                street: address.street,
                city: address.city,
                region: address.region,
                postalCode: address.postalCode
            });
        }
    } else {
        console.log('❌ No addresses found in user data');
        console.log('User has addresses array:', loggedInUser?.addresses);
    }

    // Create order object with proper user data
    const order = {
        id: 'order_' + Date.now(),
        items: JSON.parse(JSON.stringify(cart)), // Deep copy
        total: calculateTotal(cart),
        status: 'pending',
        timestamp: new Date().toISOString(),
        customerName: loggedInUser ? (loggedInUser.name || loggedInUser.fullName) : 'Guest',
        customerEmail: loggedInUser ? loggedInUser.email : 'guest@example.com',
        customerPhone: loggedInUser ? loggedInUser.phone : '',
        address: customerAddress,
        paymentMethod: 'Cash',
        createdAt: new Date().toISOString()
    };

    console.log('✅ New order created with address:', order.address);
    console.log('📦 Full order object:', order);

    // Get existing orders from localStorage
    let orders = [];
    try {
        const storedOrders = localStorage.getItem('saladaze_orders');
        if (storedOrders) {
            orders = JSON.parse(storedOrders);
        }
    } catch (error) {
        console.error('Error reading existing orders:', error);
        orders = [];
    }

    // Add new order
    orders.push(order);
    
    // Save back to localStorage
    localStorage.setItem('saladaze_orders', JSON.stringify(orders));
    console.log('✅ Orders saved to localStorage. Total orders:', orders.length);

    // Clear cart
    localStorage.removeItem('saladaze_cart');
    
    // Update UI
    updateCartCount();
    updateCartDisplay();
    updateCartSummary();
    
    // Show success message
    showToast(`Order placed successfully! Order #${order.id}`);
    
    // Switch back to menu
    switchToMenu();

    // Trigger storage event for staff page
    window.dispatchEvent(new Event('storage'));
}

// Add this function to debug user addresses
function debugUserAddresses() {
    const loggedInUser = JSON.parse(localStorage.getItem('saladaze_current_user') || localStorage.getItem('currentUser') || 'null');
    console.log('🔍 Debugging user addresses:');
    console.log('User object:', loggedInUser);
    
    if (loggedInUser && loggedInUser.addresses) {
        console.log('User addresses array:', loggedInUser.addresses);
        if (loggedInUser.addresses.length > 0) {
            loggedInUser.addresses.forEach((addr, index) => {
                console.log(`Address ${index + 1}:`, addr);
                console.log(`  - Street: ${addr.street}`);
                console.log(`  - City: ${addr.city}`);
                console.log(`  - Region: ${addr.region}`);
                console.log(`  - Postal Code: ${addr.postalCode}`);
            });
        } else {
            console.log('❌ User has empty addresses array');
        }
    } else {
        console.log('❌ User has no addresses property');
    }
    
    return loggedInUser;
}

function calculateTotal(cart) {
    return cart.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
    }, 0);
}

function switchToMenu() {
    document.getElementById('menuSection').classList.add('active');
    document.getElementById('cartSection').classList.remove('active');
    document.getElementById('menuBtn').classList.add('active');
    document.getElementById('cartBtn').classList.remove('active');
}

// Cart Functionality
function setupCartFunctionality() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            proceedToCheckout();
        });
    }
    
    // Initialize cart display
    updateCartDisplay();
    updateCartSummary();
}

// FIXED: Modal setup with proper event handling
function setupModals() {
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    // Remove any existing event listeners and add new ones
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        // Clone and replace to remove old event listeners
        const newAuthBtn = authBtn.cloneNode(true);
        authBtn.parentNode.replaceChild(newAuthBtn, authBtn);
        
        newAuthBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const currentUser = JSON.parse(localStorage.getItem('saladaze_current_user') || localStorage.getItem('currentUser') || 'null');
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            
            if (currentUser || isLoggedIn === 'true') {
                showUserDropdown(this);
            } else {
                document.getElementById('loginModal').style.display = 'block';
                document.getElementById('loginModal').classList.add('active');
            }
        });
    }
    
    // Switch between login/register modals
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('registerModal').style.display = 'block';
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('registerModal').style.display = 'none';
            document.getElementById('loginModal').style.display = 'block';
        });
    }
    
    // Close buttons
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('registerModal').style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('registerModal').style.display = 'none';
        }
    });
    
    // Form submissions - FIXED with proper integration
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleIntegratedLoginForm();
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegisterForm();
        });
    }
}

// FIXED: Login form handler
function handleIntegratedLoginForm() {
    const emailInput = document.querySelector('#loginForm input[type="email"]');
    const passwordInput = document.querySelector('#loginForm input[type="password"]');
    
    if (!emailInput || !passwordInput) {
        console.error('Login form inputs not found');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (email && password) {
        // For demo purposes - in real app, validate against your user database
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        const userData = {
            name: email.split('@')[0],
            email: email,
            phone: ""
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        window.currentUser = userData;
        
        // Close modal and update UI
        document.getElementById('loginModal').style.display = 'none';
        checkLoginStatus();
        updateUserInterface();
        showToast('Login successful!');
        
        // Clear form
        emailInput.value = '';
        passwordInput.value = '';
    }
}

// FIXED: Register form handler
function handleRegisterForm() {
    const nameInput = document.querySelector('#registerForm input[type="text"]');
    const emailInput = document.querySelector('#registerForm input[type="email"]');
    const passwordInput = document.querySelector('#registerForm input[type="password"]');
    
    if (!nameInput || !emailInput || !passwordInput) {
        console.error('Register form inputs not found');
        return;
    }
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (name && email && password) {
        // Store user data
        const userData = {
            name: name,
            email: email,
            phone: ""
        };
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        window.currentUser = userData;
        
        // Close modal and update UI
        document.getElementById('registerModal').style.display = 'none';
        checkLoginStatus();
        updateUserInterface();
        showToast('Registration successful!');
        
        // Clear form
        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
    }
}

// FIXED: User interface update
function updateUserInterface() {
    const authBtn = document.getElementById('authBtn');
    const authText = document.getElementById('authText');
    
    if (!authBtn || !authText) return;
    
    const currentUser = JSON.parse(localStorage.getItem('saladaze_current_user') || localStorage.getItem('currentUser') || 'null');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (currentUser || isLoggedIn === 'true') {
        // User is logged in - show profile
        authBtn.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
            </div>
        `;
        
        // Update click handler for dropdown
        authBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            showUserDropdown(this);
        };
    } else {
        // User is not logged in - show login button
        authBtn.innerHTML = '<i class="fas fa-user"></i> Login';
        authBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('loginModal').style.display = 'block';
            document.getElementById('loginModal').classList.add('active');
        };
    }
}

// FIXED: Show user dropdown
function showUserDropdown(button) {
    // Remove existing dropdown
    const existingDropdown = document.querySelector('.user-dropdown');
    if (existingDropdown) existingDropdown.remove();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    
    dropdown.innerHTML = `
        <div class="dropdown-profile">
            <div class="profile-header">
                <div class="user-avatar large">
                    <i class="fas fa-user"></i>
                </div>
                <div class="profile-info">
                    <div class="profile-name">${currentUser.name || 'User'}</div>
                    <div class="profile-email">${currentUser.email || ''}</div>
                </div>
            </div>
            
            <div class="profile-links">
    <a href="#" class="profile-link" onclick="showOrderTracking(); return false;">
        <i class="fas fa-truck"></i>
        <span>Track My Order</span>
    </a>
    <a href="#" class="profile-link" onclick="showSettings('account'); return false;">
        <i class="fas fa-user-cog"></i>
        <span>Account Settings</span>
    </a>
    <a href="#" class="profile-link" onclick="showSettings('payment'); return false;">
        <i class="fas fa-credit-card"></i>
        <span>Payment Methods</span>
    </a>
    <a href="#" class="profile-link" onclick="showSettings('address'); return false;">
        <i class="fas fa-map-marker-alt"></i>
        <span>Shipping Address</span>
    </a>
</div>
        </div>
        
        <div class="dropdown-item logout-item" onclick="handleIntegratedLogout()">
            <i class="fas fa-sign-out-alt"></i>
            <span>Log Out</span>
        </div>
    `;
    
    // Position dropdown - FIXED POSITIONING
    document.body.appendChild(dropdown);
    
    const rect = button.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.top = (rect.bottom + window.scrollY + 8) + 'px';
    dropdown.style.right = (window.innerWidth - rect.right) + 'px';
    dropdown.style.zIndex = '10000';
    
    // Add animation
    dropdown.style.opacity = '0';
    dropdown.style.transform = 'translateY(-10px)';
    dropdown.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0)';
    }, 10);
    
    // Close dropdown when clicking outside
    setTimeout(() => {
        const closeDropdown = function(e) {
            if (!dropdown.contains(e.target) && !button.contains(e.target)) {
                // Add fade-out animation
                dropdown.style.opacity = '0';
                dropdown.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    if (dropdown.parentNode) {
                        dropdown.remove();
                    }
                    document.removeEventListener('click', closeDropdown);
                }, 300);
            }
        };
        document.addEventListener('click', closeDropdown);
    }, 100);
}

// Navigation
function setupNavigation() {
    const menuBtn = document.getElementById('menuBtn');
    const cartBtn = document.getElementById('cartBtn');
    
    if (menuBtn) menuBtn.addEventListener('click', showMenu);
    if (cartBtn) cartBtn.addEventListener('click', showCart);
}

function showMenu() {
    document.getElementById('menuSection').classList.add('active');
    document.getElementById('cartSection').classList.remove('active');
    document.getElementById('menuBtn').classList.add('active');
    document.getElementById('cartBtn').classList.remove('active');
}

function showCart() {
    document.getElementById('cartSection').classList.add('active');
    document.getElementById('menuSection').classList.remove('active');
    document.getElementById('cartBtn').classList.add('active');
    document.getElementById('menuBtn').classList.remove('active');
    updateCartDisplay();
}

// FIXED: Toast notification with upper position
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100%);
            background: #2d5a27;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s ease;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 90%;
            text-align: center;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-100%)';
    }, 3000);
}

// Enhanced Settings Modal Functions
// FIXED: Enhanced Settings Modal Functions
function showSettings(section = 'account') {
    // Create settings modal
    const existingModal = document.querySelector('.settings-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    modal.innerHTML = `
    <div class="settings-content" style="
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        transform: translateY(-20px);
        transition: transform 0.3s ease;
    ">
        <div class="settings-header" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 16px;
        ">
            <h3 style="margin: 0; color: #2d5a27;">${getSettingsTitle(section)}</h3>
            <button class="close-settings" onclick="closeSettings()" style="
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s ease;"
                onmouseover="this.style.color='#2d5a27'" onmouseout="this.style.color='#666'">×</button>
        </div>
        <div class="settings-body">
            ${getSettingsContent(section, currentUser)}
        </div>
    </div>
`;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.settings-content').style.transform = 'translateY(0)';
    }, 10);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeSettings();
        }
    });
}

// FIXED: Close settings function
function closeSettings() {
    const modal = document.querySelector('.settings-modal');
    if (!modal) return;
    
    // Add fade-out animation
    modal.style.opacity = '0';
    const content = modal.querySelector('.settings-content');
    if (content) content.style.transform = 'translateY(-20px)';
    
    // Remove after animation
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

function getSettingsTitle(section) {
    const titles = {
        'account': 'Account Settings',
        'payment': 'Payment Methods',
        'address': 'Shipping Address'
    };
    return titles[section] || 'Settings';
}

function getSettingsContent(section, currentUser) {
    switch(section) {
        case 'account':
            return `
                <div class="settings-section">
                    <h4>Personal Information</h4>
                    <input type="text" id="accountName" class="settings-input" placeholder="Full Name" value="${currentUser.name || ''}">
                    <input type="email" id="accountEmail" class="settings-input" placeholder="Email Address" value="${currentUser.email || ''}">
                    <input type="tel" id="accountPhone" class="settings-input" placeholder="Phone Number" value="${currentUser.phone || ''}">
                </div>
                <div class="settings-actions">
                    <button class="settings-btn secondary" onclick="closeSettings()">Cancel</button>
                    <button class="settings-btn primary" onclick="saveAccountSettings()">Save Changes</button>
                </div>
            `;
            
        case 'payment':
            return `
                <div class="settings-section">
                    <h4>Payment Methods</h4>
                    <p style="color: var(--text-light); margin-bottom: 16px;">Select your preferred payment method:</p>
                    <div class="payment-options">
                        <label class="payment-option">
                            <input type="radio" name="payment" value="cod">
                            <span class="payment-content">
                                <i class="fas fa-money-bill-wave"></i>
                                <span class="payment-label">Cash on Delivery</span>
                            </span>
                        </label>
                    </div>
                </div>
                <div class="settings-actions">
                    <button class="settings-btn secondary" onclick="closeSettings()">Cancel</button>
                    <button class="settings-btn primary" onclick="savePaymentMethod()">Save Payment Method</button>
                </div>
            `;
            
        case 'address':
    const addresses = currentUser.addresses || [];
    return `
        <div class="settings-section">
            <h4>Shipping Address</h4>
            <p style="color: var(--text-light); margin-bottom: 16px;">Manage your delivery addresses.</p>
            
            <div class="address-list">
                ${addresses.length > 0 ? addresses.map((addr, index) => `
                    <div class="address-item">
                        <div class="address-content">
                            <div class="address-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="address-details">
                                <div class="address-text">${addr.street}</div>
                                <div class="address-text">${addr.city}, ${addr.region} ${addr.postalCode}</div>
                            </div>
                        </div>
                        <div class="address-actions">
                            <button class="address-btn delete-btn" onclick="deleteAddress(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('') : `
                    <div class="empty-address">
                        <i class="fas fa-map-marker-alt"></i>
                        <p>No addresses saved</p>
                    </div>
                `}
            </div>
            
            <div class="address-form" style="display: none;">
                <h4 class="form-title">Add New Address</h4>
                <div class="form-group">
                    <input type="text" id="addressStreet" class="settings-input" placeholder="Street Address" required>
                    <input type="text" id="addressCity" class="settings-input" placeholder="City" required>
                    <div class="form-row">
                        <input type="text" id="addressRegion" class="settings-input" placeholder="Region" required>
                        <input type="text" id="addressPostal" class="settings-input" placeholder="Postal Code" required>
                    </div>
                </div>
            </div>
        </div>
        <div class="settings-actions">
            <button type="button" class="settings-btn secondary" onclick="toggleAddressForm()">
                <span class="btn-text">Add New Address</span>
            </button>
            <button type="button" class="settings-btn primary save-address-btn" onclick="saveAddress()" style="display: none;">
                Save Address
            </button>
        </div>
    `;   
        default:
            return `<p>Settings content for ${section} would appear here.</p>`;
    }
}

function getStatusColor(status) {
    const colors = {
        'completed': '#28a745',
        'preparing': '#ffc107',
        'delivered': '#17a2b8',
        'cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
}

// Fix close button not working + animated save
function closeSettings() {
    const modal = document.querySelector('.settings-modal');
    if (!modal) return;
    modal.style.opacity = '0';
    const content = modal.querySelector('.settings-content');
    if (content) content.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
    }, 300);
}

// Supporting functions for settings
function saveAccountSettings() {
    const name = document.getElementById('accountName').value;
    const email = document.getElementById('accountEmail').value;
    const phone = document.getElementById('accountPhone').value;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone;
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Add save animation
    const saveBtn = document.querySelector('.settings-btn.primary');
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    saveBtn.style.background = '#28a745';
    
    setTimeout(() => {
        closeSettings();
        showToast('Account settings saved successfully!');
    }, 1000);
}

function savePaymentMethod() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        showToast('Please select a payment method');
        return;
    }
    
    const paymentMethod = selectedPayment.value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    currentUser.paymentMethod = paymentMethod;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Add save animation
    const saveBtn = document.querySelector('.settings-btn.primary');
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    saveBtn.style.background = '#28a745';
    
    setTimeout(() => {
        closeSettings();
        showToast('Payment method saved successfully!');
    }, 1000);
}

// FIXED: Save address function
function saveAddress() {
    const street = document.getElementById('addressStreet')?.value?.trim();
    const city = document.getElementById('addressCity')?.value?.trim();
    const region = document.getElementById('addressRegion')?.value?.trim();
    const postalCode = document.getElementById('addressPostal')?.value?.trim();
    
    if (!street || !city || !region || !postalCode) {
        showToast('Please fill in all address fields');
        return;
    }
    
    const address = {
        street, 
        city, 
        region, 
        postalCode 
    };
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.addresses) {
        currentUser.addresses = [];
    }
    currentUser.addresses.push(address);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    console.log('✅ Address saved to user:', address);
    
    // Add save animation
    const saveBtn = document.querySelector('.save-address-btn');
    if (saveBtn) {
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        saveBtn.style.background = '#28a745';
    }
    
    setTimeout(() => {
        // Refresh the address settings view
        showSettings('address');
        showToast('Address saved successfully!');
    }, 1000);
}

// FIXED: Toggle address form function
function toggleAddressForm() {
    const form = document.querySelector('.address-form');
    const addBtn = document.querySelector('.settings-btn.secondary');
    const saveBtn = document.querySelector('.save-address-btn');
    
    if (!form || !addBtn) return;
    
    const btnTexts = addBtn.querySelectorAll('.btn-text');
    
    if (form.style.display === 'none' || !form.style.display) {
        form.style.display = 'block';
        if (saveBtn) saveBtn.style.display = 'block';
        if (btnTexts.length >= 2) {
            btnTexts[0].style.display = 'none';
            btnTexts[1].style.display = 'block';
        }
        addBtn.textContent = 'Cancel';
    } else {
        form.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'none';
        if (btnTexts.length >= 2) {
            btnTexts[0].style.display = 'block';
            btnTexts[1].style.display = 'none';
        }
        addBtn.textContent = 'Add New Address';
    }
}

function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        currentUser.addresses.splice(index, 1);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showSettings('address');
        showToast('Address deleted successfully!');
    }
}

// Order Tracking Functionality
function showOrderTracking() {
    // Get current user's orders
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const allOrders = JSON.parse(localStorage.getItem('saladaze_orders') || '[]');
    
    // Filter orders for current user
    const userOrders = allOrders.filter(order => 
        order.customerEmail === currentUser.email || 
        order.customerName === currentUser.name
    ).sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
    
    // Create tracking modal
    const existingModal = document.querySelector('.tracking-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'tracking-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="tracking-content" style="
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        ">
            <div class="tracking-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #e0e0e0;
                padding-bottom: 16px;
            ">
                <h3 style="margin: 0; color: #2d5a27;">Track My Order</h3>
                <button class="close-tracking" onclick="closeOrderTracking()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.2s ease;"
                    onmouseover="this.style.color='#2d5a27'" onmouseout="this.style.color='#666'">×</button>
            </div>
            <div class="tracking-body">
                ${userOrders.length > 0 ? 
                    userOrders.map(order => createOrderTrackingCard(order)).join('') 
                    : `
                    <div style="text-align: center; padding: 40px 20px; color: var(--text-light);">
                        <i class="fas fa-truck" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                        <h3 style="color: var(--text-light); margin-bottom: 8px;">No Orders Found</h3>
                        <p>You haven't placed any orders yet.</p>
                        <p style="font-size: 14px; margin-top: 8px;">Your orders will appear here after you place an order.</p>
                    </div>
                `}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.tracking-content').style.transform = 'translateY(0)';
    }, 10);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeOrderTracking();
        }
    });
}

function createOrderTrackingCard(order) {
    const statusSteps = [
        { status: 'pending', label: 'Order Placed', icon: 'fa-clipboard-list' },
        { status: 'preparing', label: 'Preparing', icon: 'fa-utensils' },
        { status: 'ready', label: 'Ready', icon: 'fa-check' },
        { status: 'completed', label: 'Completed', icon: 'fa-flag-checkered' }
    ];
    
    const currentStatusIndex = statusSteps.findIndex(step => step.status === order.status);

    console.log('Creating card for order:', order);
    
    // Check if order can be cancelled (only pending or preparing orders)
    const canCancel = ['pending', 'preparing'].includes(order.status);

    // Calculate estimated delivery time for ready orders
    const estimatedDelivery = calculateDeliveryTime(order);
    
    return `
        <div class="order-tracking-card" style="
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 16px;
            background: white;
        ">
            <div class="order-header" style="
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 16px;
            ">
                <div>
                    <h4 style="margin: 0 0 8px 0; color: var(--text-dark);">Order #${order.id}</h4>
                    <p style="margin: 0; color: var(--text-light); font-size: 14px;">
                        Placed on ${new Date(order.timestamp || order.createdAt).toLocaleDateString()} at ${new Date(order.timestamp || order.createdAt).toLocaleTimeString()}
                    </p>
                </div>
                <div class="order-status ${order.status || 'pending'}" style="
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                ">
                    ${(order.status || 'pending').toUpperCase()}
                </div>
            </div>
            
            <!-- DELIVERY TIME ESTIMATE FOR READY ORDERS -->
            ${order.status === 'ready' ? `
                <div class="delivery-estimate" style="
                    margin-bottom: 16px;
                    padding: 12px;
                    background: #e7f3ff;
                    border: 1px solid #b3d9ff;
                    border-radius: 6px;
                ">
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <i class="fas fa-truck" style="color: #0066cc; margin-right: 8px;"></i>
                        <strong style="color: #0066cc;">On the Way!</strong>
                    </div>
                    <div style="color: #0066cc; font-size: 14px;">
                        <strong>Estimated Delivery:</strong> ${estimatedDelivery.time}
                    </div>
                    <div style="color: #0066cc; font-size: 12px; margin-top: 4px;">
                        <strong>Store Location:</strong> Kumintang Ilaya, Batangas City
                    </div>
                    <div style="color: #0066cc; font-size: 12px;">
                        <strong>Delivery Time:</strong> ${estimatedDelivery.minutes} minutes
                    </div>
                </div>
            ` : ''}
            
            <div class="order-items" style="margin-bottom: 16px;">
                <p style="margin: 0 0 8px 0; font-weight: 500; color: var(--text-dark);">Items:</p>
                ${order.items ? order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px;">
                        <span>${item.name} x${item.quantity || 1}</span>
                        <span>₱${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                `).join('') : ''}
                <div style="border-top: 1px solid var(--border-color); margin-top: 8px; padding-top: 8px; font-weight: 600;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Total:</span>
                        <span>₱${order.total ? order.total.toFixed(2) : '0.00'}</span>
                    </div>
                </div>
            </div>
            
            <div class="tracking-progress" style="margin-top: 20px;">
                <p style="margin: 0 0 12px 0; font-weight: 500; color: var(--text-dark);">Order Progress:</p>
                <div class="progress-steps" style="display: flex; justify-content: space-between; position: relative;">
                    ${statusSteps.map((step, index) => {
                        const isCompleted = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        
                        return `
                            <div class="progress-step" style="
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                flex: 1;
                                position: relative;
                                z-index: 2;
                            ">
                                <div class="step-icon" style="
                                    width: 40px;
                                    height: 40px;
                                    border-radius: 50%;
                                    background: ${isCompleted ? '#2d5a27' : '#e0e0e0'};
                                    color: white;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    margin-bottom: 8px;
                                    transition: all 0.3s ease;
                                    ${isCurrent ? 'transform: scale(1.1); box-shadow: 0 0 0 3px rgba(45, 90, 39, 0.2);' : ''}
                                ">
                                    <i class="fas ${step.icon}" style="font-size: 16px;"></i>
                                </div>
                                <span class="step-label" style="
                                    font-size: 12px;
                                    font-weight: ${isCurrent ? '600' : '400'};
                                    color: ${isCompleted ? '#2d5a27' : '#666'};
                                    text-align: center;
                                ">${step.label}</span>
                            </div>
                            ${index < statusSteps.length - 1 ? `
                                <div class="progress-line" style="
                                    position: absolute;
                                    top: 20px;
                                    left: ${(index * 25) + 12.5}%;
                                    width: 25%;
                                    height: 2px;
                                    background: ${index < currentStatusIndex ? '#2d5a27' : '#e0e0e0'};
                                    z-index: 1;
                                "></div>
                            ` : ''}
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- CANCEL ORDER BUTTON -->
            ${canCancel ? `
                <div class="order-actions" style="margin-top: 20px; text-align: center; padding-top: 16px; border-top: 1px solid var(--border-color);">
                    <button class="cancel-order-btn" onclick="cancelOrder('${order.id}')" 
                            style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.3s ease;">
                        <i class="fas fa-times-circle"></i> Cancel Order
                    </button>
                    <p style="font-size: 12px; color: var(--text-light); margin-top: 8px; margin-bottom: 0;">
                        You can cancel your order while it's still being prepared
                    </p>
                </div>
            ` : ''}
            
            ${order.status === 'completed' ? `
                <div class="completion-message" style="
                    margin-top: 16px;
                    padding: 12px;
                    background: #d4edda;
                    border: 1px solid #c3e6cb;
                    border-radius: 6px;
                    text-align: center;
                ">
                    <i class="fas fa-check-circle" style="color: #155724; margin-right: 8px;"></i>
                    <span style="color: #155724; font-weight: 500;">Order completed! Thank you for your purchase.</span>
                </div>
            ` : ''}
            
            ${order.status === 'cancelled' ? `
                <div class="cancellation-message" style="
                    margin-top: 16px;
                    padding: 12px;
                    background: #f8d7da;
                    border: 1px solid #f5c6cb;
                    border-radius: 6px;
                    text-align: center;
                ">
                    <i class="fas fa-times-circle" style="color: #721c24; margin-right: 8px;"></i>
                    <span style="color: #721c24; font-weight: 500;">This order has been cancelled.</span>
                </div>
            ` : ''}
        </div>
    `;
}

// Add this function to calculate delivery time based on store location
function calculateDeliveryTime(order) {
    const now = new Date();
    
    // Delivery time estimates based on areas around Kumintang Ilaya, Batangas City
    const deliveryTimes = {
        'Kumintang Ilaya': 10, // Same area
        'Kumintang Ibaba': 15, // Nearby area
        'Batangas Proper': 20, // City center
        'Sto. Domingo': 25, // Nearby barangay
        'Bolbok': 30, // Nearby area
        'Pallocan': 35, // Nearby area
        'Gulod': 40, // Nearby area
        'Other Areas': 45 // Default for other locations
    };

// Get customer's area from address or use default
    let customerArea = 'Other Areas';
    if (order.address && order.address.includes('Kumintang Ilaya')) {
        customerArea = 'Kumintang Ilaya';
    } else if (order.address && order.address.includes('Kumintang Ibaba')) {
        customerArea = 'Kumintang Ibaba';
    } else if (order.address && order.address.includes('Batangas Proper')) {
        customerArea = 'Batangas Proper';
    } else if (order.address && order.address.includes('Sto. Domingo')) {
        customerArea = 'Sto. Domingo';
    } else if (order.address && order.address.includes('Bolbok')) {
        customerArea = 'Bolbok';
    } else if (order.address && order.address.includes('Pallocan')) {
        customerArea = 'Pallocan';
    } else if (order.address && order.address.includes('Gulod')) {
        customerArea = 'Gulod';
    }

    // Get delivery minutes for the area
    const deliveryMinutes = deliveryTimes[customerArea] || 45;
    
    // Calculate estimated arrival time
    const estimatedTime = new Date(now.getTime() + deliveryMinutes * 60000);
    
    return {
        minutes: deliveryMinutes,
        time: estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        area: customerArea
    };
}

function closeOrderTracking() {
    const modal = document.querySelector('.tracking-modal');
    if (!modal) return;
    
    // Add fade-out animation
    modal.style.opacity = '0';
    const content = modal.querySelector('.tracking-content');
    if (content) content.style.transform = 'translateY(-20px)';
    
    // Remove after animation
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// User Authentication and Profile Management
class UserAuth {
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
        // Check for logged-in user in localStorage
        this.currentUser = JSON.parse(localStorage.getItem('saladaze_current_user')) || null;
        
        // If no current user but there are users in the system, use the first one (for demo)
        if (!this.currentUser) {
            const users = JSON.parse(localStorage.getItem('saladaze_users') || '[]');
            if (users.length > 0) {
                this.currentUser = users[0];
                this.saveCurrentUser();
            }
        }
    }

    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('saladaze_current_user', JSON.stringify(this.currentUser));
        }
    }

    updateUserProfileDisplay() {
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (this.currentUser) {
            // Update profile elements
            if (userAvatar) userAvatar.textContent = this.currentUser.name.charAt(0);
            if (userName) userName.textContent = this.currentUser.name;
            if (userEmail) userEmail.textContent = this.currentUser.email;

            // Show/hide login/logout buttons
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
        } else {
            // No user logged in
            if (userAvatar) userAvatar.textContent = '?';
            if (userName) userName.textContent = 'Guest';
            if (userEmail) userEmail.textContent = 'Please log in';

            if (loginBtn) loginBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

    setupAuthListeners() {
        // Listen for login events
        document.addEventListener('userLoggedIn', (e) => {
            this.currentUser = e.detail.user;
            this.saveCurrentUser();
            this.updateUserProfileDisplay();
        });

        // Listen for logout events
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Listen for storage changes (when admin updates users)
        window.addEventListener('storage', (e) => {
            if (e.key === 'saladaze_users' || e.key === 'saladaze_current_user') {
                this.loadCurrentUser();
                this.updateUserProfileDisplay();
            }
        });
    }

    login(user) {
        this.currentUser = user;
        this.saveCurrentUser();
        this.updateUserProfileDisplay();
        
        // Dispatch event for other components to listen to
        document.dispatchEvent(new CustomEvent('userLoggedIn', { 
            detail: { user: this.currentUser } 
        }));
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('saladaze_current_user');
        this.updateUserProfileDisplay();
        
        // Dispatch event for other components to listen to
        document.dispatchEvent(new CustomEvent('userLoggedOut'));
        
        // Redirect to login page or refresh
        window.location.reload();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Initialize user authentication
let userAuth;

document.addEventListener('DOMContentLoaded', function() {
    userAuth = new UserAuth();
    
    // Make it globally available
    window.userAuth = userAuth;
});