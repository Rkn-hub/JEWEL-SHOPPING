// Admin Dashboard JavaScript
// Handles all admin functionality including data management, charts, and interactions

// ============================================
// SAMPLE DATA
// ============================================

// Sample orders data
const ordersData = [];

// Sample users data
const usersData = [];

// Sample products data
const productsData = [
    {
        id: 1,
        name: 'Bohemian Dreams Necklace',
        price: 1250,
        category: 'necklaces',
        material: 'glass',
        description: 'Beautiful handcrafted necklace with turquoise and wooden beads',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        stock: 15,
        sales: 45
    },
    {
        id: 2,
        name: 'Wire-Wrapped Elegance Earrings',
        price: 850,
        category: 'earrings',
        material: 'metal',
        description: 'Elegant wire-wrapped earrings with glass beads',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        stock: 23,
        sales: 32
    },
    {
        id: 3,
        name: 'Macramé Harmony Bracelet',
        price: 750,
        category: 'bracelets',
        material: 'stone',
        description: 'Natural stone bracelet with macramé cord design',
        image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        stock: 18,
        sales: 28
    },
    {
        id: 4,
        name: 'Festival Statement Necklace',
        price: 1650,
        category: 'necklaces',
        material: 'ceramic',
        description: 'Bold statement necklace with colorful ceramic beads',
        image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        stock: 8,
        sales: 15
    },
    {
        id: 5,
        name: 'Delicate Pearl Earrings',
        price: 650,
        category: 'earrings',
        material: 'glass',
        description: 'Delicate pearl-like glass bead earrings',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        stock: 30,
        sales: 52
    },
    {
        id: 6,
        name: 'Wooden Bead Bracelet Set',
        price: 450,
        category: 'bracelets',
        material: 'wood',
        description: 'Set of three wooden bead bracelets in natural tones',
        image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        stock: 25,
        sales: 38
    }
];

// ============================================
// NAVIGATION & UI FUNCTIONS
// ============================================

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active');
        targetSection.classList.add('slide-in');
    }

    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active', 'bg-primary', 'text-white');
        item.classList.add('text-slate-700', 'dark:text-slate-300');
    });

    const activeNavItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active', 'bg-primary', 'text-white');
        activeNavItem.classList.remove('text-slate-700', 'dark:text-slate-300');
    }

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        orders: 'Orders Management',
        products: 'Products Management',
        users: 'Users Management',
        analytics: 'Analytics & Reports',
        settings: 'Settings'
    };

    document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';

    // Load section-specific data
    switch (sectionName) {
        case 'orders':
            loadOrdersTable();
            break;
        case 'products':
            loadProductsGrid();
            break;
        case 'users':
            loadUsersTable();
            break;
        case 'analytics':
            loadAnalyticsCharts();
            break;
    }
}

// Toggle sidebar for mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
}

// ============================================
// ORDERS MANAGEMENT
// ============================================

function loadOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    if (ordersData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center gap-4">
                        <div class="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <span class="material-symbols-outlined text-slate-400 text-[32px]">shopping_cart</span>
                        </div>
                        <div>
                            <p class="text-slate-600 dark:text-slate-400 font-medium mb-1">No orders yet</p>
                            <p class="text-sm text-slate-500">Orders will appear here when customers start purchasing</p>
                        </div>
                        <a href="../index.html" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
                            View Website
                        </a>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = ordersData.map(order => `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" class="rounded border-slate-300 dark:border-slate-600">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div>
                    <div class="text-sm font-medium text-slate-900 dark:text-white">${order.id}</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">${order.date}</div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div>
                    <div class="text-sm font-medium text-slate-900 dark:text-white">${order.customer.name}</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">${order.customer.email}</div>
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-slate-900 dark:text-white">
                    ${order.products.map(p => `${p.name} (${p.quantity})`).join(', ')}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-slate-900 dark:text-white">₹${order.total.toLocaleString()}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                    <button onclick="viewOrderDetails('${order.id}')" class="text-primary hover:text-primary/80">
                        <span class="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button onclick="editOrderStatus('${order.id}')" class="text-blue-600 hover:text-blue-800">
                        <span class="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button onclick="deleteOrder('${order.id}')" class="text-red-600 hover:text-red-800">
                        <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getStatusColor(status) {
    const colors = {
        pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
        processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
        shipped: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400',
        delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
        cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
    };
    return colors[status] || colors.pending;
}

function viewOrderDetails(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');

    content.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h4 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Order Information</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-slate-600 dark:text-slate-400">Order ID:</span>
                        <span class="font-medium text-slate-900 dark:text-white">${order.id}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600 dark:text-slate-400">Date:</span>
                        <span class="font-medium text-slate-900 dark:text-white">${order.date}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600 dark:text-slate-400">Status:</span>
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600 dark:text-slate-400">Total:</span>
                        <span class="font-bold text-primary">₹${order.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Customer Information</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-slate-600 dark:text-slate-400">Name:</span>
                        <span class="font-medium text-slate-900 dark:text-white">${order.customer.name}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600 dark:text-slate-400">Email:</span>
                        <span class="font-medium text-slate-900 dark:text-white">${order.customer.email}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600 dark:text-slate-400">Phone:</span>
                        <span class="font-medium text-slate-900 dark:text-white">${order.customer.phone}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-6">
            <h4 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Shipping Address</h4>
            <p class="text-slate-600 dark:text-slate-400">${order.address}</p>
        </div>
        
        <div class="mt-6">
            <h4 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Order Items</h4>
            <div class="space-y-3">
                ${order.products.map(product => `
                    <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                            <div class="font-medium text-slate-900 dark:text-white">${product.name}</div>
                            <div class="text-sm text-slate-600 dark:text-slate-400">Quantity: ${product.quantity}</div>
                        </div>
                        <div class="font-medium text-slate-900 dark:text-white">₹${(product.price * product.quantity).toLocaleString()}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="mt-6 flex gap-3">
            <button onclick="updateOrderStatus('${order.id}', 'processing')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Mark as Processing
            </button>
            <button onclick="updateOrderStatus('${order.id}', 'shipped')" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Mark as Shipped
            </button>
            <button onclick="updateOrderStatus('${order.id}', 'delivered')" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Mark as Delivered
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeOrderDetailsModal() {
    document.getElementById('orderDetailsModal').classList.add('hidden');
}

function updateOrderStatus(orderId, newStatus) {
    const order = ordersData.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        loadOrdersTable();
        closeOrderDetailsModal();
        showNotification(`Order ${orderId} status updated to ${newStatus}`);
    }
}

function editOrderStatus(orderId) {
    // This would open a status edit modal in a real implementation
    const newStatus = prompt('Enter new status (pending, processing, shipped, delivered, cancelled):');
    if (newStatus && ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
        updateOrderStatus(orderId, newStatus);
    }
}

function deleteOrder(orderId) {
    if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
        const index = ordersData.findIndex(o => o.id === orderId);
        if (index > -1) {
            ordersData.splice(index, 1);
            loadOrdersTable();
            showNotification(`Order ${orderId} deleted successfully`);
        }
    }
}

function exportOrders() {
    // In a real implementation, this would generate and download a CSV/Excel file
    showNotification('Orders exported successfully!');
}

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

function loadProductsGrid() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = productsData.map(product => `
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
            <div class="aspect-square overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
            </div>
            <div class="p-4">
                <h4 class="font-semibold text-slate-900 dark:text-white mb-2">${product.name}</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">${product.description}</p>
                <div class="flex justify-between items-center mb-3">
                    <span class="text-lg font-bold text-primary">₹${product.price.toLocaleString()}</span>
                    <span class="text-sm text-slate-600 dark:text-slate-400">Stock: ${product.stock}</span>
                </div>
                <div class="flex justify-between items-center mb-3">
                    <span class="text-sm text-slate-600 dark:text-slate-400">Sales: ${product.sales}</span>
                    <span class="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full">
                        ${product.category}
                    </span>
                </div>
                <div class="flex gap-2">
                    <button onclick="editProduct(${product.id})" class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Edit
                    </button>
                    <button onclick="deleteProduct(${product.id})" class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        <span class="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openAddProductModal() {
    document.getElementById('addProductModal').classList.remove('hidden');
}

function closeAddProductModal() {
    document.getElementById('addProductModal').classList.add('hidden');
}

// Image handling
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('imagePreview');
            const container = document.getElementById('imagePreviewContainer');
            const uploadLabel = event.target.closest('label');

            preview.src = e.target.result;
            container.classList.remove('hidden');
            uploadLabel.classList.add('hidden');
        }
        reader.readAsDataURL(file);
    }
}

function removeImage() {
    const fileInput = document.querySelector('input[type="file"]');
    const preview = document.getElementById('imagePreview');
    const container = document.getElementById('imagePreviewContainer');
    const uploadLabel = container.previousElementSibling;

    fileInput.value = '';
    preview.src = '';
    container.classList.add('hidden');
    uploadLabel.classList.remove('hidden');
}

function addProduct(event) {
    event.preventDefault();
    const form = event.target;

    // Get image from preview if available
    const imagePreview = document.getElementById('imagePreview');
    const hasImage = imagePreview.src && !document.getElementById('imagePreviewContainer').classList.contains('hidden');

    const newProduct = {
        id: productsData.length + 1,
        name: form.elements[0].value,
        price: parseInt(form.elements[1].value),
        description: form.elements[2].value,
        category: form.elements[3].value.toLowerCase(),
        material: form.elements[4].value.toLowerCase(),
        image: hasImage ? imagePreview.src : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        stock: Math.floor(Math.random() * 50) + 10,
        sales: 0
    };

    productsData.push(newProduct);
    loadProductsGrid();
    closeAddProductModal();
    form.reset();
    removeImage(); // Reset upload field
    showNotification('Product added successfully!');
}

function editProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // In a real implementation, this would open an edit modal with pre-filled data
    const newName = prompt('Enter new product name:', product.name);
    if (newName) {
        product.name = newName;
        loadProductsGrid();
        showNotification('Product updated successfully!');
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const index = productsData.findIndex(p => p.id === productId);
        if (index > -1) {
            productsData.splice(index, 1);
            loadProductsGrid();
            showNotification('Product deleted successfully!');
        }
    }
}

// ============================================
// USERS MANAGEMENT
// ============================================

function loadUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    if (usersData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center gap-4">
                        <div class="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <span class="material-symbols-outlined text-slate-400 text-[32px]">people</span>
                        </div>
                        <div>
                            <p class="text-slate-600 dark:text-slate-400 font-medium mb-1">No customers yet</p>
                            <p class="text-sm text-slate-500">Customer accounts will appear here when users register</p>
                        </div>
                        <a href="../register.html" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
                            Registration Page
                        </a>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = usersData.map(user => `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                        ${user.avatar}
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-slate-900 dark:text-white">${user.name}</div>
                        <div class="text-sm text-slate-500 dark:text-slate-400">ID: ${user.id}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-900 dark:text-white">${user.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-900 dark:text-white">${user.orders}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-slate-900 dark:text-white">₹${user.totalSpent.toLocaleString()}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'}">
                    ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-600 dark:text-slate-400">${user.joined}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                    <button onclick="viewUserDetails(${user.id})" class="text-primary hover:text-primary/80">
                        <span class="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button onclick="editUser(${user.id})" class="text-blue-600 hover:text-blue-800">
                        <span class="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button onclick="toggleUserStatus(${user.id})" class="text-yellow-600 hover:text-yellow-800">
                        <span class="material-symbols-outlined text-[20px]">toggle_on</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function viewUserDetails(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;

    alert(`User Details:\nName: ${user.name}\nEmail: ${user.email}\nOrders: ${user.orders}\nTotal Spent: ₹${user.totalSpent}\nStatus: ${user.status}\nJoined: ${user.joined}`);
}

function editUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;

    const newName = prompt('Enter new user name:', user.name);
    if (newName) {
        user.name = newName;
        loadUsersTable();
        showNotification('User updated successfully!');
    }
}

function toggleUserStatus(userId) {
    const user = usersData.find(u => u.id === userId);
    if (user) {
        user.status = user.status === 'active' ? 'inactive' : 'active';
        loadUsersTable();
        showNotification(`User status changed to ${user.status}`);
    }
}

function exportUsers() {
    showNotification('Users exported successfully!');
}

// ============================================
// CHARTS & ANALYTICS
// ============================================

let salesChart, ordersChart, revenueChart, topProductsChart;

function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        salesChart = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Sales',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: '#E07A5F',
                    backgroundColor: 'rgba(224, 122, 95, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#334155'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b'
                        },
                        grid: {
                            color: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0'
                        }
                    },
                    x: {
                        ticks: {
                            color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b'
                        },
                        grid: {
                            color: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0'
                        }
                    }
                }
            }
        });
    }

    // Orders Chart
    const ordersCtx = document.getElementById('ordersChart');
    if (ordersCtx) {
        ordersChart = new Chart(ordersCtx, {
            type: 'doughnut',
            data: {
                labels: ['Delivered', 'Processing', 'Shipped', 'Pending'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#334155'
                        }
                    }
                }
            }
        });
    }
}

function loadAnalyticsCharts() {
    setTimeout(() => {
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx && !revenueChart) {
            revenueChart = new Chart(revenueCtx, {
                type: 'bar',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Revenue',
                        data: [0, 0, 0, 0],
                        backgroundColor: '#81B29A'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#334155'
                            }
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b'
                            },
                            grid: {
                                color: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0'
                            }
                        },
                        x: {
                            ticks: {
                                color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b'
                            },
                            grid: {
                                color: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0'
                            }
                        }
                    }
                }
            });
        }

        // Top Products Chart
        const topProductsCtx = document.getElementById('topProductsChart');
        if (topProductsCtx && !topProductsChart) {
            topProductsChart = new Chart(topProductsCtx, {
                type: 'horizontalBar',
                data: {
                    labels: ['No Sales Yet', '', '', ''],
                    datasets: [{
                        label: 'Sales',
                        data: [0, 0, 0, 0],
                        backgroundColor: '#3D5A80'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#334155'
                            }
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b'
                            },
                            grid: {
                                color: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0'
                            }
                        },
                        x: {
                            ticks: {
                                color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b'
                            },
                            grid: {
                                color: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0'
                            }
                        }
                    }
                }
            });
        }
    }, 100);
}

// ============================================
// SETTINGS & UTILITIES
// ============================================

function saveSettings() {
    showNotification('Settings saved successfully!');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}

// Notification function (reuse from main.js)
function showNotification(message, duration = 3000) {
    // Remove existing notification
    const existing = document.querySelector('.vrinda-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'vrinda-notification fixed top-24 right-6 bg-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slide-out 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize charts
    initializeCharts();

    // Load default section data
    loadOrdersTable();

    // Set up theme toggle functionality (inherited from main.js)
    // The toggleDarkMode function is already available from main.js

    // Update charts when theme changes
    const originalToggleDarkMode = window.toggleDarkMode || function () {
        // Fallback if main.js didn't export it
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            html.classList.add('light');
            localStorage.setItem('vrindaTheme', 'light');
        } else {
            html.classList.remove('light');
            html.classList.add('dark');
            localStorage.setItem('vrindaTheme', 'dark');
        }
    };

    window.toggleDarkMode = function () {
        if (typeof originalToggleDarkMode === 'function') {
            originalToggleDarkMode();
        }

        // Update chart colors after theme change
        setTimeout(() => {
            const isDark = document.documentElement.classList.contains('dark');
            const textColor = isDark ? '#e2e8f0' : '#334155';
            const gridColor = isDark ? '#334155' : '#e2e8f0';
            const tickColor = isDark ? '#94a3b8' : '#64748b';

            [salesChart, ordersChart, revenueChart, topProductsChart].forEach(chart => {
                if (chart) {
                    if (chart.options.plugins?.legend?.labels) {
                        chart.options.plugins.legend.labels.color = textColor;
                    }
                    if (chart.options.scales?.y) {
                        chart.options.scales.y.ticks.color = tickColor;
                        chart.options.scales.y.grid.color = gridColor;
                    }
                    if (chart.options.scales?.x) {
                        chart.options.scales.x.ticks.color = tickColor;
                        chart.options.scales.x.grid.color = gridColor;
                    }
                    chart.update();
                }
            });
        }, 100);
    };

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
            closeAddProductModal();
            closeOrderDetailsModal();
        }
    });

    // Handle sidebar clicks on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 1024 && !document.getElementById('sidebar').contains(e.target) && !e.target.closest('[onclick="toggleSidebar()"]')) {
            document.getElementById('sidebar').classList.add('-translate-x-full');
        }
    });
});
// ============================================
// REAL-TIME DATA SYNC
// ============================================

// Sync users from authentication system
function syncUsersFromAuth() {
    if (typeof usersDatabase !== 'undefined') {
        // Clear existing users data (except admin)
        usersData.length = 0;

        // Add all customer users from auth system
        usersDatabase.forEach(user => {
            if (user.role === 'customer') {
                usersData.push({
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    orders: user.orders ? user.orders.length : 0,
                    totalSpent: user.orders ? user.orders.reduce((sum, order) => sum + (order.total || 0), 0) : 0,
                    status: user.isActive ? 'active' : 'inactive',
                    joined: user.joinDate,
                    avatar: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                });
            }
        });

        // Update dashboard stats
        updateDashboardStats();

        // Reload users table if we're on that section
        if (document.getElementById('users-section')?.classList.contains('active')) {
            loadUsersTable();
        }
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    // Update user count
    const totalUsers = usersData.length;
    const userCountElements = document.querySelectorAll('.text-2xl.font-bold');
    if (userCountElements[2]) {
        userCountElements[2].textContent = totalUsers;
        const userStatusElement = userCountElements[2].nextElementSibling;
        if (userStatusElement) {
            if (totalUsers === 0) {
                userStatusElement.textContent = 'No customers yet';
                userStatusElement.className = 'text-sm text-slate-500';
            } else {
                userStatusElement.textContent = `${totalUsers} customer${totalUsers !== 1 ? 's' : ''} registered`;
                userStatusElement.className = 'text-sm text-green-600';
            }
        }
    }

    // Update orders count
    const totalOrders = ordersData.length;
    if (userCountElements[0]) {
        userCountElements[0].textContent = totalOrders;
        const orderStatusElement = userCountElements[0].nextElementSibling;
        if (orderStatusElement) {
            if (totalOrders === 0) {
                orderStatusElement.textContent = 'Start taking orders!';
                orderStatusElement.className = 'text-sm text-slate-500';
            } else {
                orderStatusElement.textContent = `${totalOrders} order${totalOrders !== 1 ? 's' : ''} received`;
                orderStatusElement.className = 'text-sm text-green-600';
            }
        }
    }

    // Update revenue
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
    if (userCountElements[1]) {
        userCountElements[1].textContent = `₹${totalRevenue.toLocaleString()}`;
        const revenueStatusElement = userCountElements[1].nextElementSibling;
        if (revenueStatusElement) {
            if (totalRevenue === 0) {
                revenueStatusElement.textContent = 'Ready to grow!';
                revenueStatusElement.className = 'text-sm text-slate-500';
            } else {
                revenueStatusElement.textContent = `Revenue generated`;
                revenueStatusElement.className = 'text-sm text-green-600';
            }
        }
    }
}

// Add new order (called when orders are placed)
function addNewOrder(orderData) {
    const newOrder = {
        id: `VRC-${String(ordersData.length + 1).padStart(3, '0')}`,
        customer: orderData.customer,
        products: orderData.products,
        total: orderData.total,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        address: orderData.address
    };

    ordersData.push(newOrder);
    updateDashboardStats();

    // Reload orders table if we're on that section
    if (document.getElementById('orders-section')?.classList.contains('active')) {
        loadOrdersTable();
    }

    return newOrder;
}

// Initialize real-time sync
document.addEventListener('DOMContentLoaded', () => {
    // Sync users on page load
    setTimeout(syncUsersFromAuth, 1000);

    // Set up periodic sync (every 30 seconds)
    setInterval(syncUsersFromAuth, 30000);
});

// Export functions for external use
window.syncUsersFromAuth = syncUsersFromAuth;
window.addNewOrder = addNewOrder;