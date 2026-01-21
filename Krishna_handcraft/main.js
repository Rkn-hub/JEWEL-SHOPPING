// The Vrinda Creation - Main JavaScript File
// Handles all interactive functionality across the website

// ============================================
// CART FUNCTIONALITY
// ============================================

// Cart data structure
let cart = JSON.parse(localStorage.getItem('vrindaCart')) || [];
console.log('🛒 Cart initialized with:', cart.length, 'items:', cart);

// Update cart count in header
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count, [class*="cart"] span');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    console.log(`🔢 Updating cart count to ${totalItems} (found ${cartCountElements.length} elements)`);

    cartCountElements.forEach((el, index) => {
        if (el.classList.contains('cart-count') || el.textContent.match(/^\d+$/)) {
            el.textContent = totalItems;
            console.log(`✅ Updated element ${index} to show ${totalItems}`);
        }
    });
}

// Add item to cart
function addToCart(product) {
    console.log('🛒 Adding to cart:', product.name, '- ₹' + product.price);

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
        console.log('📈 Increased quantity to:', existingItem.quantity);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            quantity: 1
        });
        console.log('➕ Added new item to cart');
    }

    console.log('📊 Cart now has', cart.length, 'unique items');
    saveUserCart(cart);

    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveUserCart(cart);
    updateCartCount();
    renderCart();
    showNotification('Item removed from cart');
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveUserCart(cart);
            renderCart();
        }
    }
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Render cart items
function renderCart() {
    console.log('🎨 renderCart called');
    const cartContainer = document.querySelector('#cartItemsList');
    const subtotalElement = document.querySelector('#cartSubtotal');
    const cartCountElement = document.querySelector('.cart-count');

    console.log('📦 Cart container found:', !!cartContainer);
    console.log('💰 Subtotal element found:', !!subtotalElement);
    console.log('🔢 Cart count element found:', !!cartCountElement);
    console.log('📋 Current cart:', cart);

    if (!cartContainer) {
        console.error('❌ Cart container not found!');
        return;
    }

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <li class="py-12 text-center">
                <div class="flex flex-col items-center gap-4">
                    <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">shopping_cart</span>
                    <div>
                        <p class="text-slate-500 dark:text-slate-400 text-lg mb-2">Your cart is empty</p>
                        <p class="text-slate-400 dark:text-slate-500 text-sm">Add some beautiful jewelry to get started</p>
                    </div>
                    <a href="products.html" class="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                        <span class="material-symbols-outlined text-[20px]">shopping_bag</span>
                        <span>Browse Products</span>
                    </a>
                </div>
            </li>
        `;
        if (subtotalElement) subtotalElement.textContent = '₹0.00';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <li class="flex py-6">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-gray-800 shadow-sm">
                <div class="h-full w-full bg-cover bg-center" style="background-image: url('${item.image}');"></div>
            </div>
            <div class="ml-4 flex flex-1 flex-col">
                <div>
                    <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                        <h3><a class="hover:text-primary transition-colors" href="product-detail.html">${item.name}</a></h3>
                        <p class="ml-4 font-semibold tracking-tight">₹${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${item.description}</p>
                </div>
                <div class="flex flex-1 items-end justify-between text-sm">
                    <div class="flex items-center rounded-lg border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5">
                        <button onclick="updateQuantity('${item.id}', -1)" class="px-3 py-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">−</button>
                        <input class="w-8 p-0 text-center bg-transparent border-none text-gray-900 dark:text-white focus:ring-0 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" readonly type="number" value="${item.quantity}"/>
                        <button onclick="updateQuantity('${item.id}', 1)" class="px-3 py-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">+</button>
                    </div>
                    <button onclick="removeFromCart('${item.id}')" class="font-medium text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors flex items-center gap-1" type="button">
                        <span class="material-symbols-outlined text-[20px]">delete</span>
                        <span class="sr-only">Remove</span>
                    </button>
                </div>
            </div>
        </li>
    `).join('');

    if (subtotalElement) {
        subtotalElement.textContent = `₹${calculateTotal().toFixed(2)}`;
    }

    // Also update checkout page if on it
    if (window.location.pathname.includes('checkout.html')) {
        updateCheckoutSummary();
    }
}

function updateCheckoutSummary() {
    const summaryItemsContainer = document.querySelector('.space-y-4 .flex.gap-4')?.parentElement;
    const subtotalSummary = document.querySelector('.space-y-3.pt-4 .flex.justify-between:nth-child(1) span:last-child');
    const totalSummary = document.querySelector('.flex.justify-between.text-lg.font-semibold span:last-child');

    if (!summaryItemsContainer || cart.length === 0) return;

    // Render items
    summaryItemsContainer.innerHTML = cart.map(item => `
        <div class="flex gap-4">
            <div class="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img class="w-full h-full object-cover" src="${item.image}" alt="${item.name}" />
            </div>
            <div class="flex-1">
                <h4 class="font-medium text-slate-900 dark:text-white">${item.name}</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">${item.description}</p>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-sm text-slate-600 dark:text-slate-400">Qty: ${item.quantity}</span>
                    <span class="font-semibold text-primary">₹${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            </div>
        </div>
    `).join('');

    const subtotal = calculateTotal();
    const shipping = 150; // Mock shipping
    const tax = subtotal * 0.05; // Mock tax 5%
    const total = subtotal + shipping + tax;

    if (subtotalSummary) subtotalSummary.textContent = `₹${subtotal.toLocaleString()}`;
    if (totalSummary) totalSummary.textContent = `₹${total.toLocaleString()}`;
}

async function placeOrder() {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (!user) {
        showNotification('Please log in to complete your order', 4000);
        sessionStorage.setItem('intendedUrl', 'checkout.html');
        window.location.href = 'login.html';
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty', 4000);
        return;
    }

    const subtotal = calculateTotal();
    const shipping = 150;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    // Get address info (simplifying for now, in real app would get from form)
    const street = document.querySelector('input[placeholder="Enter your address"]')?.value || 'Demo Address';
    const city = document.querySelector('input[placeholder="City"]')?.value || 'Demo City';
    const state = document.querySelector('select')?.value || 'Maharashtra';
    const pin = document.querySelector('input[placeholder="000000"]')?.value || '000000';

    try {
        const { data: order, error: orderError } = await window.supabaseClient
            .from('orders')
            .insert([{
                user_id: user.id,
                total_amount: total,
                status: 'pending',
                shipping_address: `${street}, ${city}, ${state} - ${pin}`
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        // Insert order items
        const orderItems = cart.map(item => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price_at_time: item.price
        }));

        const { error: itemsError } = await window.supabaseClient
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        // Clear cart
        cart = [];
        saveUserCart(cart);
        updateCartCount();

        showNotification('Order placed successfully!', 3000);
        setTimeout(() => {
            window.location.href = 'order-confirmation.html?id=' + order.id;
        }, 1500);

    } catch (error) {
        console.error('❌ Error placing order:', error);
        showNotification('Failed to place order: ' + error.message, 5000);
    }
}

// ============================================
// PRODUCT FETCHING & RENDERING
// ============================================

window.currentProducts = [];

async function loadProductsFromSupabase() {
    if (!window.supabaseClient) {
        console.warn('⚠️ Supabase client not found - falling back to static content if available.');
        return;
    }

    console.log('📦 Fetching products from Supabase...');
    const { data, error } = await window.supabaseClient
        .from('products')
        .select('*');

    if (error) {
        console.error('❌ Error fetching products:', error);
        return;
    }

    currentProducts = data;
    console.log(`✅ Loaded ${currentProducts.length} products`);

    // Render on products.html if container exists
    const grid = document.getElementById('products-grid');
    if (grid) {
        renderProducts(grid, currentProducts);
    }

    // Render on index.html if container exists
    const featuredGrid = document.getElementById('featured-products-grid');
    if (featuredGrid) {
        renderProducts(featuredGrid, currentProducts.slice(0, 4));
    }
}

function renderProducts(container, products) {
    if (!container) return;

    container.innerHTML = products.map((product, index) => `
        <div class="product-card group relative flex flex-col cursor-pointer" onclick="window.location.href='product-detail.html?id=${product.id}'">
            <div class="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style="background-image: url('${product.image_url}')">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                </div>
                <div class="absolute bottom-4 left-4 right-4 product-info">
                    <button onclick="event.stopPropagation(); quickAddToCart('${product.id}')"
                        class="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
                        Quick Add
                    </button>
                </div>
            </div>
            <div class="mt-4 flex flex-col gap-1 px-1">
                <div class="flex justify-between items-start">
                    <h3 class="text-base font-medium text-slate-900 dark:text-white">${product.name}</h3>
                    <p class="text-sm font-medium text-slate-500 dark:text-slate-400">₹${product.price.toLocaleString()}</p>
                </div>
                <p class="text-xs text-slate-400 dark:text-slate-500">${product.description}</p>
            </div>
        </div>
    `).join('');
}

function quickAddToCart(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (product) {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url,
            description: product.description,
            quantity: 1
        });
    }
}

// ============================================
// PRODUCT QUICK ADD (LEGACY/FALLBACK)
// ============================================

function setupQuickAddButtons() {
    // If we have dynamic products, this is handled by quickAddToCart
    if (currentProducts.length > 0) return;

    console.log('🔧 Setting up legacy Quick Add buttons...');
    // ... existing legacy code if needed ...
}
// ============================================
// NOTIFICATIONS
// ============================================

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

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slide-out {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    .animate-slide-in {
        animation: slide-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// ============================================
// NAVIGATION
// ============================================

// Cart button click handler
function setupCartButton() {
    document.querySelectorAll('[class*="shopping_bag"]').forEach(icon => {
        const button = icon.closest('button, a');
        if (button && !button.href) {
            button.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }
    });
}

// Search button click handler
function setupSearchButton() {
    document.querySelectorAll('[class*="search"]').forEach(icon => {
        const button = icon.closest('button, a');
        if (button && icon.textContent === 'search') {
            // If it's a link, let it navigate normally
            if (button.tagName === 'A') {
                return;
            }

            // If it's a button, show search modal or redirect
            button.addEventListener('click', () => {
                showQuickSearchModal();
            });
        }
    });
}

// Quick search modal for header search
function showQuickSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-32 px-4';
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl">
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold">Search Products</h2>
                    <button onclick="closeQuickSearchModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <span class="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>
                
                <div class="relative mb-6">
                    <input type="text" placeholder="Search for jewelry, beads, materials..." 
                        class="w-full px-6 py-4 pr-14 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg"
                        id="quickSearchInput" autofocus />
                    <button onclick="performQuickSearch()" 
                        class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors">
                        <span class="material-symbols-outlined">search</span>
                    </button>
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="performQuickSearch('beaded necklaces')" class="p-3 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-colors">
                        <div class="font-medium">Beaded Necklaces</div>
                        <div class="text-sm text-slate-500">Handcrafted designs</div>
                    </button>
                    <button onclick="performQuickSearch('wire earrings')" class="p-3 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-colors">
                        <div class="font-medium">Wire Earrings</div>
                        <div class="text-sm text-slate-500">Elegant styles</div>
                    </button>
                    <button onclick="performQuickSearch('macramé bracelets')" class="p-3 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-colors">
                        <div class="font-medium">Macramé Bracelets</div>
                        <div class="text-sm text-slate-500">Natural materials</div>
                    </button>
                    <button onclick="performQuickSearch('custom orders')" class="p-3 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-colors">
                        <div class="font-medium">Custom Orders</div>
                        <div class="text-sm text-slate-500">Personalized jewelry</div>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeQuickSearchModal();
        }
    });

    // Add enter key functionality
    const quickSearchInput = document.getElementById('quickSearchInput');
    quickSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performQuickSearch();
        }
    });
}

function closeQuickSearchModal() {
    const modal = document.querySelector('.fixed.inset-0.bg-black\\/50');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function performQuickSearch(searchTerm = null) {
    const query = searchTerm || document.getElementById('quickSearchInput')?.value.trim();

    if (!query) {
        showNotification('Please enter a search term');
        return;
    }

    // Close modal if open
    closeQuickSearchModal();

    // Redirect to search page with query
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}

// Checkout button
function setupCheckoutButton() {
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent.trim() === 'Checkout') {
            button.addEventListener('click', () => {
                if (cart.length === 0) {
                    showNotification('Your cart is empty!');
                } else {
                    window.location.href = 'checkout.html';
                }
            });
        }
        if (button.textContent.trim() === 'Continue Shopping') {
            button.addEventListener('click', () => {
                window.location.href = 'products.html';
            });
        }
    });
}

// ============================================
// DARK MODE TOGGLE
// ============================================

function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    if (isDark) {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('vrindaTheme', 'light');
        showNotification('Switched to light theme');
    } else {
        html.classList.remove('light');
        html.classList.add('dark');
        localStorage.setItem('vrindaTheme', 'dark');
        showNotification('Switched to dark theme');
    }

    // Update theme toggle icons
    updateThemeToggleIcons();
}

// Update theme toggle icons across the page
function updateThemeToggleIcons() {
    const isDark = document.documentElement.classList.contains('dark');

    // Update all theme toggle buttons
    document.querySelectorAll('button[onclick="toggleDarkMode()"]').forEach(button => {
        const darkIcon = button.querySelector('.dark\\:hidden');
        const lightIcon = button.querySelector('.hidden.dark\\:block');

        if (darkIcon && lightIcon) {
            if (isDark) {
                darkIcon.classList.add('hidden');
                darkIcon.classList.remove('dark:hidden');
                lightIcon.classList.remove('hidden');
                lightIcon.classList.add('dark:block');
            } else {
                darkIcon.classList.remove('hidden');
                darkIcon.classList.add('dark:hidden');
                lightIcon.classList.add('hidden');
                lightIcon.classList.remove('dark:block');
            }
        }
    });
}

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('vrindaTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }

    // Update icons after theme is set
    setTimeout(updateThemeToggleIcons, 100);
}

// Listen for system theme changes
function setupSystemThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem('vrindaTheme');

        // Only auto-switch if user hasn't manually set a preference
        if (!savedTheme) {
            if (e.matches) {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
            } else {
                document.documentElement.classList.add('light');
                document.documentElement.classList.remove('dark');
            }
            updateThemeToggleIcons();
        }
    });
}

// Add keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
function setupThemeKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleDarkMode();
        }
    });
}

// ============================================
// FORM VALIDATION
// ============================================

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[\d\s\+\-\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function setupFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const emailInputs = form.querySelectorAll('input[type="email"]');
            const phoneInputs = form.querySelectorAll('input[type="tel"]');
            const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');

            // Validate required fields
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('border-red-500');
                } else {
                    input.classList.remove('border-red-500');
                }
            });

            // Validate email
            emailInputs.forEach(input => {
                if (input.value && !validateEmail(input.value)) {
                    isValid = false;
                    input.classList.add('border-red-500');
                    showNotification('Please enter a valid email address');
                } else {
                    input.classList.remove('border-red-500');
                }
            });

            // Validate phone
            phoneInputs.forEach(input => {
                if (input.value && !validatePhone(input.value)) {
                    isValid = false;
                    input.classList.add('border-red-500');
                    showNotification('Please enter a valid phone number');
                } else {
                    input.classList.remove('border-red-500');
                }
            });

            if (isValid) {
                showNotification('Form submitted successfully!');
                // Here you would normally send the form data to a server
                setTimeout(() => {
                    form.reset();
                }, 1000);
            } else {
                showNotification('Please fill in all required fields correctly');
            }
        });
    });
}

// ============================================
// FAQ ACCORDION
// ============================================

function setupFAQAccordion() {
    const faqButtons = document.querySelectorAll('.faq-question, [class*="faq"] button');

    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const icon = button.querySelector('.material-symbols-outlined');

            if (answer && answer.classList.contains('hidden')) {
                answer.classList.remove('hidden');
                if (icon) icon.textContent = 'remove';
            } else if (answer) {
                answer.classList.add('hidden');
                if (icon) icon.textContent = 'add';
            }
        });
    });
}

// ============================================
// PRODUCT DETAIL PAGE
// ============================================

function setupProductDetailPage() {
    // Quantity controls
    const minusBtn = document.querySelector('button[onclick*="decreaseQuantity"]');
    const plusBtn = document.querySelector('button[onclick*="increaseQuantity"]');
    const quantityInput = document.querySelector('input[type="number"]');

    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', () => {
            const current = parseInt(quantityInput.value);
            if (current > 1) quantityInput.value = current - 1;
        });

        plusBtn.addEventListener('click', () => {
            const current = parseInt(quantityInput.value);
            quantityInput.value = current + 1;
        });
    }

    // Add to bag button
    const buttons = document.querySelectorAll('button');
    const addToBagBtn = Array.from(buttons).find(btn =>
        btn.textContent.includes('Add to Bag') || btn.innerText.includes('Add to Bag')
    );

    if (addToBagBtn) {
        addToBagBtn.addEventListener('click', () => {
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            const productName = document.querySelector('h1')?.textContent || 'Product';
            const priceElement = document.querySelector('[class*="price"]');
            const price = priceElement ? parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')) : 0;

            for (let i = 0; i < quantity; i++) {
                addToCart({
                    id: `product-${Date.now()}-${i}`,
                    name: productName,
                    price: price,
                    description: 'Handcrafted jewelry',
                    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f'
                });
            }
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    console.log('Current page:', window.location.pathname);

    // Initialize theme
    initTheme();

    // Setup theme functionality
    setupSystemThemeListener();
    setupThemeKeyboardShortcut();

    // Update cart count
    console.log('Updating cart count on page load');
    updateCartCount();

    // Setup all interactive elements
    console.log('Setting up interactive elements');
    setupQuickAddButtons();
    setupCartButton();
    setupSearchButton();
    setupCheckoutButton();
    setupFormValidation();
    setupFAQAccordion();
    setupProductDetailPage();
    setupReceiptAndMapButtons();
    setupSearchFunctionality();
    setupProductsPageSearch();

    // Render cart if on cart page
    if (window.location.pathname.includes('cart.html')) {
        console.log('🛒 On cart page, rendering cart...');
        console.log('📦 Current cart contents:', cart);
        renderCart();
    }

    // Product card click to detail
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                window.location.href = 'product-detail.html';
            }
        });
    });
});

// ============================================
// RECEIPT DOWNLOAD FUNCTIONALITY
// ============================================

function generateReceipt() {
    const orderData = {
        orderNumber: 'VRC-482910',
        date: new Date().toLocaleDateString('en-IN'),
        items: [
            { name: 'Bohemian Dreams Necklace', price: 1250, quantity: 1 },
            { name: 'Wire Elegance Earrings', price: 850, quantity: 1 },
            { name: 'Macramé Harmony Bracelet', price: 750, quantity: 1 }
        ],
        subtotal: 2850,
        shipping: 0,
        tax: 0,
        total: 2850,
        customerInfo: {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            address: '123 Main Street, Mumbai, Maharashtra 400001'
        }
    };

    const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Receipt - ${orderData.orderNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; border-bottom: 2px solid #E07A5F; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { color: #E07A5F; font-size: 24px; font-weight: bold; }
                .order-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .items-table th, .items-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                .items-table th { background: #E07A5F; color: white; }
                .total-section { text-align: right; font-size: 18px; font-weight: bold; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">The Vrinda Creation</div>
                <p>Handcrafted Beaded Jewelry</p>
                <p>Email: thevrindacreation@gmail.com | Phone: +91 8384074307</p>
            </div>
            
            <div class="order-info">
                <h3>Order Details</h3>
                <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
                <p><strong>Date:</strong> ${orderData.date}</p>
                <p><strong>Customer:</strong> ${orderData.customerInfo.name}</p>
                <p><strong>Email:</strong> ${orderData.customerInfo.email}</p>
                <p><strong>Shipping Address:</strong> ${orderData.customerInfo.address}</p>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderData.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>₹${item.price}</td>
                            <td>₹${item.price * item.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="total-section">
                <p>Subtotal: ₹${orderData.subtotal}</p>
                <p>Shipping: ₹${orderData.shipping}</p>
                <p>Tax: ₹${orderData.tax}</p>
                <hr>
                <p><strong>Total: ₹${orderData.total}</strong></p>
            </div>

            <div class="footer">
                <p>Thank you for your purchase!</p>
                <p>For any queries, contact us at thevrindacreation@gmail.com</p>
                <p>© 2024 The Vrinda Creation. All rights reserved.</p>
            </div>
        </body>
        </html>
    `;

    return receiptHTML;
}

function downloadReceipt() {
    // First try to generate HTML receipt
    const receiptHTML = generateReceipt();
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-VRC-482910-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('Receipt downloaded successfully!');

    // Also offer to print the receipt
    setTimeout(() => {
        if (confirm('Would you like to print the receipt as well?')) {
            printReceipt();
        }
    }, 1000);
}

function printReceipt() {
    const receiptHTML = generateReceipt();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

// ============================================
// LIVE MAP TRACKING FUNCTIONALITY
// ============================================

function openLiveMap() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 class="text-2xl font-bold">Live Package Tracking</h2>
                <button onclick="closeLiveMap()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <span class="material-symbols-outlined text-[24px]">close</span>
                </button>
            </div>
            
            <div class="p-6">
                <div class="mb-6">
                    <div class="flex items-center gap-3 mb-2">
                        <span class="w-3 h-3 bg-primary rounded-full animate-pulse"></span>
                        <span class="font-semibold">Order #VRC-482910</span>
                        <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">In Transit</span>
                    </div>
                    <p class="text-slate-600 dark:text-slate-400">Estimated delivery: October 24, 2024 by 6:00 PM</p>
                </div>

                <!-- Map Container -->
                <div class="bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-700 dark:to-slate-600 rounded-xl h-80 mb-6 relative overflow-hidden border border-slate-200 dark:border-slate-600">
                    <!-- Map Background -->
                    <div class="absolute inset-0 opacity-20">
                        <svg viewBox="0 0 400 300" class="w-full h-full">
                            <path d="M50,150 Q100,100 150,150 T250,150 Q300,120 350,150" stroke="#E07A5F" stroke-width="2" fill="none" opacity="0.5"/>
                            <path d="M20,200 L380,200" stroke="#81B29A" stroke-width="1" fill="none" opacity="0.3"/>
                            <path d="M200,20 L200,280" stroke="#81B29A" stroke-width="1" fill="none" opacity="0.3"/>
                        </svg>
                    </div>
                    
                    <!-- Current Location -->
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                                <span class="material-symbols-outlined text-primary text-[32px]">local_shipping</span>
                            </div>
                            <div class="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg border border-slate-200 dark:border-slate-600">
                                <p class="font-semibold mb-1">Current Location</p>
                                <p class="text-sm text-slate-600 dark:text-slate-400">Mumbai Distribution Center</p>
                                <p class="text-xs text-slate-500 mt-1">Last updated: 2 hours ago</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Route Progress -->
                    <div class="absolute bottom-4 left-4 right-4">
                        <div class="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg border border-slate-200 dark:border-slate-600">
                            <div class="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
                                <span>Mumbai</span>
                                <span>Your Location</span>
                            </div>
                            <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                <div class="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000" style="width: 65%"></div>
                            </div>
                            <p class="text-xs text-slate-500 mt-1">65% Complete • Approximately 4 hours remaining</p>
                        </div>
                    </div>
                </div>

                <!-- Tracking Timeline -->
                <div class="space-y-4">
                    <h3 class="font-semibold mb-4 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">timeline</span>
                        Tracking History
                    </h3>
                    
                    <div class="flex items-start gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div class="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                        <div class="flex-1">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="font-medium text-blue-700 dark:text-blue-400">In Transit</p>
                                    <p class="text-sm text-slate-600 dark:text-slate-400">Mumbai Distribution Center → Your City</p>
                                    <p class="text-xs text-slate-500">Today, 2:30 PM</p>
                                </div>
                                <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">Current</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-start gap-4 p-3 rounded-lg">
                        <div class="w-3 h-3 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                            <p class="font-medium">Dispatched</p>
                            <p class="text-sm text-slate-600 dark:text-slate-400">The Vrinda Creation Workshop, Mumbai</p>
                            <p class="text-xs text-slate-500">Yesterday, 11:45 AM</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start gap-4 p-3 rounded-lg">
                        <div class="w-3 h-3 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                            <p class="font-medium">Order Confirmed & Crafted</p>
                            <p class="text-sm text-slate-600 dark:text-slate-400">Payment received, jewelry handcrafted with love</p>
                            <p class="text-xs text-slate-500">2 days ago, 3:15 PM</p>
                        </div>
                    </div>
                </div>

                <!-- Delivery Details -->
                <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="material-symbols-outlined text-primary">home</span>
                            <p class="font-medium">Delivery Address</p>
                        </div>
                        <p class="text-sm text-slate-600 dark:text-slate-400">123 Main Street<br>Mumbai, Maharashtra 400001<br>India</p>
                    </div>
                    
                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="material-symbols-outlined text-primary">schedule</span>
                            <p class="font-medium">Delivery Window</p>
                        </div>
                        <p class="text-sm text-slate-600 dark:text-slate-400">October 24, 2024<br>Between 2:00 PM - 6:00 PM<br>Signature required</p>
                    </div>
                </div>

                <!-- Contact Support -->
                <div class="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary">support_agent</span>
                        <div class="flex-1">
                            <p class="font-medium">Need Help with Your Delivery?</p>
                            <p class="text-sm text-slate-600 dark:text-slate-400">Our support team is here to help with any delivery concerns or questions</p>
                        </div>
                        <div class="flex gap-2">
                            <a href="tel:+918384074307" class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                                Call Us
                            </a>
                            <a href="contact.html" class="border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLiveMap();
        }
    });

    // Simulate real-time updates
    setTimeout(() => {
        const progressBar = modal.querySelector('[style*="width: 65%"]');
        if (progressBar) {
            progressBar.style.width = '67%';
            const progressText = modal.querySelector('p:contains("65% Complete")');
            if (progressText) {
                progressText.textContent = '67% Complete • Approximately 3.5 hours remaining';
            }
        }
    }, 5000);
}

function closeLiveMap() {
    const modal = document.querySelector('.fixed.inset-0.bg-black\\/50');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// ============================================
// SETUP RECEIPT AND MAP BUTTONS
// ============================================

function setupReceiptAndMapButtons() {
    // Setup download receipt button
    document.querySelectorAll('a').forEach(link => {
        if (link.textContent.includes('Download Receipt')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                downloadReceipt();
            });
        }
    });

    // Setup view live map button
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent.includes('View Live Map')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openLiveMap();
            });
        }
    });

    // Setup register now button
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent.includes('Register Now')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'profile.html';
            });
        }
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

// Sample product database for search
const productDatabase = [
    {
        id: 1,
        name: "Bohemian Dreams Necklace",
        category: "necklaces",
        material: "glass",
        price: 1250,
        description: "Beautiful handcrafted necklace with turquoise and wooden beads",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        tags: ["bohemian", "necklace", "turquoise", "wooden", "beads", "handcrafted"],
        popular: true,
        dateAdded: "2024-01-15"
    },
    {
        id: 2,
        name: "Wire-Wrapped Elegance Earrings",
        category: "earrings",
        material: "metal",
        price: 850,
        description: "Elegant wire-wrapped earrings with glass beads",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        tags: ["wire", "wrapped", "earrings", "glass", "beads", "elegant"],
        popular: true,
        dateAdded: "2024-01-10"
    },
    {
        id: 3,
        name: "Macramé Harmony Bracelet",
        category: "bracelets",
        material: "stone",
        price: 750,
        description: "Natural stone bracelet with macramé cord design",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        tags: ["macramé", "bracelet", "stone", "natural", "cord", "harmony"],
        popular: true,
        dateAdded: "2024-01-08"
    },
    {
        id: 4,
        name: "Festival Statement Necklace",
        category: "necklaces",
        material: "ceramic",
        price: 1650,
        description: "Bold statement necklace with colorful ceramic beads",
        image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        tags: ["festival", "statement", "necklace", "colorful", "ceramic", "bold"],
        popular: false,
        dateAdded: "2024-01-12"
    },
    {
        id: 5,
        name: "Delicate Pearl Earrings",
        category: "earrings",
        material: "glass",
        price: 650,
        description: "Delicate pearl-like glass bead earrings",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        tags: ["delicate", "pearl", "earrings", "glass", "beads", "elegant"],
        popular: false,
        dateAdded: "2024-01-05"
    },
    {
        id: 6,
        name: "Wooden Bead Bracelet Set",
        category: "bracelets",
        material: "wood",
        price: 450,
        description: "Set of three wooden bead bracelets in natural tones",
        image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        tags: ["wooden", "bracelet", "set", "natural", "beads", "earth"],
        popular: true,
        dateAdded: "2024-01-03"
    },
    {
        id: 7,
        name: "Crystal Healing Ring",
        category: "rings",
        material: "stone",
        price: 950,
        description: "Healing crystal ring with adjustable band",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        tags: ["crystal", "healing", "ring", "stone", "adjustable", "spiritual"],
        popular: false,
        dateAdded: "2024-01-01"
    },
    {
        id: 8,
        name: "Vintage Glass Necklace",
        category: "necklaces",
        material: "glass",
        price: 1150,
        description: "Vintage-inspired glass bead necklace with antique finish",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        tags: ["vintage", "glass", "necklace", "antique", "beads", "classic"],
        popular: false,
        dateAdded: "2023-12-28"
    }
];

let currentSearchResults = [];
let currentPage = 1;
const resultsPerPage = 8;

// Perform search function
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

    if (!searchTerm) {
        showNotification('Please enter a search term');
        return;
    }

    // Show loading state
    showSearchLoading();

    // Simulate API delay
    setTimeout(() => {
        const results = searchProducts(searchTerm);
        displaySearchResults(results, searchTerm);
    }, 500);
}

// Search products function
function searchProducts(searchTerm, filters = {}) {
    let results = productDatabase.filter(product => {
        // Text search
        const matchesText = product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        // Category filter
        const matchesCategory = !filters.category || product.category === filters.category;

        // Material filter
        const matchesMaterial = !filters.material || product.material === filters.material;

        // Price filter
        let matchesPrice = true;
        if (filters.price) {
            if (filters.price === '0-500') {
                matchesPrice = product.price <= 500;
            } else if (filters.price === '500-1000') {
                matchesPrice = product.price > 500 && product.price <= 1000;
            } else if (filters.price === '1000-2000') {
                matchesPrice = product.price > 1000 && product.price <= 2000;
            } else if (filters.price === '2000+') {
                matchesPrice = product.price > 2000;
            }
        }

        return matchesText && matchesCategory && matchesMaterial && matchesPrice;
    });

    // Sort results
    if (filters.sort) {
        switch (filters.sort) {
            case 'price-low':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                results.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                results.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            case 'popular':
                results.sort((a, b) => b.popular - a.popular);
                break;
            default: // relevance
                // Keep original order (relevance-based)
                break;
        }
    }

    return results;
}

// Display search results
function displaySearchResults(results, searchTerm) {
    currentSearchResults = results;
    currentPage = 1;

    // Hide default content and show results
    document.getElementById('defaultContent').classList.add('hidden');
    document.getElementById('searchFilters').classList.remove('hidden');

    if (results.length === 0) {
        document.getElementById('searchResults').classList.add('hidden');
        document.getElementById('noResults').classList.remove('hidden');
        return;
    }

    document.getElementById('noResults').classList.add('hidden');
    document.getElementById('searchResults').classList.remove('hidden');

    // Update results count
    document.getElementById('resultsCount').textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for "${searchTerm}"`;

    // Display results
    renderResults();
}

// Render results function
function renderResults() {
    const resultsGrid = document.getElementById('resultsGrid');
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const pageResults = currentSearchResults.slice(0, endIndex);

    resultsGrid.innerHTML = pageResults.map(product => `
        <div class="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
            <div class="relative aspect-square overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="addToCart({id: '${product.id}', name: '${product.name}', price: ${product.price}, image: '${product.image}', description: '${product.description}'})" 
                        class="w-10 h-10 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors">
                        <span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    </button>
                </div>
                ${product.popular ? '<div class="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">Popular</div>' : ''}
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2 group-hover:text-primary transition-colors">${product.name}</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-primary">₹${product.price}</span>
                    <a href="product-detail.html" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">View Details</a>
                </div>
            </div>
        </div>
    `).join('');

    // Show/hide load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (endIndex >= currentSearchResults.length) {
        loadMoreBtn.classList.add('hidden');
    } else {
        loadMoreBtn.classList.remove('hidden');
    }
}

// Load more results
function loadMoreResults() {
    currentPage++;
    renderResults();
}

// Quick search function
function quickSearch(term) {
    document.getElementById('searchInput').value = term;
    performSearch();
}

// Apply filters function
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

    if (!searchTerm) {
        showNotification('Please enter a search term first');
        return;
    }

    const filters = {
        category: document.getElementById('categoryFilter').value,
        material: document.getElementById('materialFilter').value,
        price: document.getElementById('priceFilter').value,
        sort: document.getElementById('sortFilter').value
    };

    showSearchLoading();

    setTimeout(() => {
        const results = searchProducts(searchTerm, filters);
        displaySearchResults(results, searchTerm);
    }, 300);
}

// Clear filters function
function clearFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('materialFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('sortFilter').value = 'relevance';

    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchTerm) {
        applyFilters();
    }
}

// Show search loading state
function showSearchLoading() {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = Array(4).fill().map(() => `
        <div class="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse">
            <div class="aspect-square bg-slate-200 dark:bg-slate-700"></div>
            <div class="p-4">
                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-3 w-3/4"></div>
                <div class="flex justify-between items-center">
                    <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                    <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// Search suggestions and autocomplete
const searchSuggestions = [
    'beaded necklaces', 'wire earrings', 'macramé bracelets', 'custom orders',
    'glass beads', 'wooden beads', 'stone beads', 'ceramic beads',
    'bohemian jewelry', 'vintage style', 'handcrafted', 'artisan made',
    'festival jewelry', 'statement pieces', 'delicate earrings', 'healing crystals'
];

function showSearchSuggestions(input, query) {
    if (!query || query.length < 2) {
        hideSearchSuggestions();
        return;
    }

    const suggestions = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (suggestions.length === 0) {
        hideSearchSuggestions();
        return;
    }

    let suggestionsContainer = document.getElementById('searchSuggestions');

    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'searchSuggestions';
        suggestionsContainer.className = 'absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-2 shadow-lg z-50 max-h-60 overflow-y-auto';
        input.parentElement.appendChild(suggestionsContainer);
    }

    suggestionsContainer.innerHTML = suggestions.map(suggestion => `
        <button onclick="selectSuggestion('${suggestion}')" 
            class="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0">
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                <span class="text-sm">${suggestion}</span>
            </div>
        </button>
    `).join('');
}

function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.remove();
    }
}

function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = suggestion;
        performSearch();
    }
    hideSearchSuggestions();
}

// Enhanced search functionality setup
function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        // Make the input container relative for suggestions
        searchInput.parentElement.style.position = 'relative';

        // Enter key search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                hideSearchSuggestions();
                performSearch();
            }
        });

        // Show suggestions on input
        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            showSearchSuggestions(searchInput, value);

            // Auto-search for longer queries
            if (value.length >= 3) {
                clearTimeout(searchInput.searchTimeout);
                searchInput.searchTimeout = setTimeout(() => {
                    performSearch();
                }, 800);
            } else if (value.length === 0) {
                // Reset to default view
                document.getElementById('defaultContent').classList.remove('hidden');
                document.getElementById('searchFilters').classList.add('hidden');
                document.getElementById('searchResults').classList.add('hidden');
                document.getElementById('noResults').classList.add('hidden');
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.parentElement.contains(e.target)) {
                hideSearchSuggestions();
            }
        });

        // Check for URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        if (searchQuery) {
            searchInput.value = searchQuery;
            performSearch();
        }
    }

    // Setup filter change listeners
    ['categoryFilter', 'materialFilter', 'priceFilter', 'sortFilter'].forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', () => {
                const searchTerm = document.getElementById('searchInput').value.trim();
                if (searchTerm) {
                    applyFilters();
                }
            });
        }
    });
}

// Theme change from settings page
function changeThemeFromSettings(theme) {
    const html = document.documentElement;

    if (theme === 'light') {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('vrindaTheme', 'light');
        showNotification('Theme set to light mode');
    } else if (theme === 'dark') {
        html.classList.remove('light');
        html.classList.add('dark');
        localStorage.setItem('vrindaTheme', 'dark');
        showNotification('Theme set to dark mode');
    } else if (theme === 'system') {
        localStorage.removeItem('vrindaTheme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (prefersDark) {
            html.classList.remove('light');
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
            html.classList.add('light');
        }
        showNotification('Theme set to follow system preference');
    }

    updateThemeToggleIcons();
}

// Initialize settings page theme selector
function initSettingsThemeSelector() {
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        const savedTheme = localStorage.getItem('vrindaTheme');
        if (savedTheme) {
            themeSelect.value = savedTheme;
        } else {
            themeSelect.value = 'system';
        }
    }
}

// Search in products page
function searchInProducts() {
    const searchTerm = document.getElementById('productsSearchInput')?.value.trim();

    if (!searchTerm) {
        showNotification('Please enter a search term');
        return;
    }

    // Redirect to search page with query
    window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
}

// Setup products page search
function setupProductsPageSearch() {
    const productsSearchInput = document.getElementById('productsSearchInput');

    if (productsSearchInput) {
        // Enter key search
        productsSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchInProducts();
            }
        });
    }

    // Initialize settings page theme selector
    initSettingsThemeSelector();
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleDarkMode = toggleDarkMode;
window.changeThemeFromSettings = changeThemeFromSettings;
window.showNotification = showNotification;
window.downloadReceipt = downloadReceipt;
window.printReceipt = printReceipt;
window.openLiveMap = openLiveMap;
window.closeLiveMap = closeLiveMap;
window.performSearch = performSearch;
window.quickSearch = quickSearch;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.loadMoreResults = loadMoreResults;
window.showQuickSearchModal = showQuickSearchModal;
window.closeQuickSearchModal = closeQuickSearchModal;
window.performQuickSearch = performQuickSearch;
window.searchInProducts = searchInProducts;
window.selectSuggestion = selectSuggestion;

// ============================================
// AUTHENTICATION INTEGRATION
// ============================================

// User-specific cart functions (safe fallbacks)
function getUserCart() {
    try {
        const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
        const cartKey = user ? `vrindaCart_${user.id}` : 'vrindaCart';
        return JSON.parse(localStorage.getItem(cartKey)) || [];
    } catch (error) {
        console.log('Using default cart (auth not available)');
        return JSON.parse(localStorage.getItem('vrindaCart')) || [];
    }
}

function saveUserCart(cartData) {
    try {
        const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
        const cartKey = user ? `vrindaCart_${user.id}` : 'vrindaCart';
        localStorage.setItem(cartKey, JSON.stringify(cartData));
    } catch (error) {
        console.log('Saving to default cart (auth not available)');
        localStorage.setItem('vrindaCart', JSON.stringify(cartData));
    }
}

// Update profile page with user data
function updateProfilePageData() {
    if (typeof getCurrentUser !== 'function') return;

    const user = getCurrentUser();
    if (!user) return;

    // Update profile header
    const userFullName = document.getElementById('userFullName');
    const userEmail = document.getElementById('userEmail');
    const memberSince = document.getElementById('memberSince');

    if (userFullName) {
        userFullName.textContent = `${user.firstName} ${user.lastName}`;
    }

    if (userEmail) {
        userEmail.textContent = user.email;
    }

    if (memberSince) {
        const joinDate = new Date(user.joinDate);
        const options = { year: 'numeric', month: 'long' };
        memberSince.textContent = `Member since ${joinDate.toLocaleDateString('en-US', options)}`;
    }

    // Update avatar initials
    const avatarElements = document.querySelectorAll('.w-24.h-24.rounded-full');
    if (avatarElements.length > 0) {
        avatarElements.forEach(avatar => {
            if (avatar.textContent.trim().length <= 3) {
                avatar.textContent = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
            }
        });
    }
}

async function fetchUserOrders() {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (!user) return;

    // Use a more specific selector for the orders section
    const ordersHeader = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.includes('Recent Orders'));
    if (!ordersHeader) return;

    try {
        const { data: orders, error } = await window.supabaseClient
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products (*)
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!orders || orders.length === 0) {
            // Render "No Orders" state
            const noOrdersDiv = document.createElement('div');
            noOrdersDiv.className = 'text-center py-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm';
            noOrdersDiv.innerHTML = `
                <div class="flex flex-col items-center">
                    <span class="material-symbols-outlined text-slate-400 text-5xl mb-4">shopping_basket</span>
                    <p class="text-slate-500 mb-4">You haven't placed any orders yet.</p>
                    <a href="products.html" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">Start Shopping</a>
                </div>
            `;

            // Clear existing hardcoded orders
            let sibling = ordersHeader.nextElementSibling;
            while (sibling && !sibling.querySelector('a[href*="order-confirmation.html"]')) {
                const next = sibling.nextElementSibling;
                sibling.remove();
                sibling = next;
            }
            ordersHeader.after(noOrdersDiv);
            return;
        }

        // Render orders
        const ordersListHtml = orders.map(order => {
            const date = new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            const firstItem = order.order_items[0];
            const itemCount = order.order_items.length;

            return `
                <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-4">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                            <p class="text-sm text-slate-600 dark:text-slate-400">Order #${order.id.slice(0, 8).toUpperCase()}</p>
                            <p class="font-medium">Placed on ${date}</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="px-4 py-2 bg-${order.status === 'delivered' ? 'green' : 'blue'}-100 dark:bg-${order.status === 'delivered' ? 'green' : 'blue'}-900/30 text-${order.status === 'delivered' ? 'green' : 'blue'}-700 dark:text-${order.status === 'delivered' ? 'green' : 'blue'}-400 rounded-full text-sm font-medium">
                                ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <button class="text-primary font-medium hover:underline">View Details</button>
                        </div>
                    </div>
                    ${firstItem ? `
                    <div class="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <img src="${firstItem.products?.image_url || 'https://via.placeholder.com/100'}"
                            alt="Product" class="w-16 h-16 rounded-lg object-cover" />
                        <div class="flex-1">
                            <p class="font-medium">${firstItem.products?.name || 'Handcrafted Item'}</p>
                            <p class="text-sm text-slate-600 dark:text-slate-400">
                                ${itemCount > 1 ? `+ ${itemCount - 1} more items` : `Quantity: ${firstItem.quantity}`}
                            </p>
                        </div>
                        <p class="font-bold">₹${order.total_amount.toLocaleString()}</p>
                    </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        // Replace orders section
        let sibling = ordersHeader.nextElementSibling;
        while (sibling && !sibling.querySelector('a[href*="order-confirmation.html"]')) {
            const next = sibling.nextElementSibling;
            sibling.remove();
            sibling = next;
        }

        const listDiv = document.createElement('div');
        listDiv.innerHTML = ordersListHtml;
        ordersHeader.after(listDiv);

        // Update stats
        const totalOrdersStat = document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-xl.p-6.shadow-sm:nth-child(1) p.text-2xl.font-bold');
        if (totalOrdersStat) totalOrdersStat.textContent = orders.length;

        const inTransitStat = document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-xl.p-6.shadow-sm:nth-child(4) p.text-2xl.font-bold');
        if (inTransitStat) inTransitStat.textContent = orders.filter(o => ['pending', 'in_transit', 'processing'].includes(o.status)).length;

    } catch (error) {
        console.error('❌ Error fetching orders:', error);
    }
}

// Edit profile function
async function editProfile() {
    const user = getCurrentUser();
    if (!user) return;

    // Logic for showing a modal or redirecting to an edit page
    // For now, let's assume we use a simple prompt for testing or show a notification
    console.log('✏️ Editing profile for:', user.email);

    // In a real implementation, this would open a modal with fields
    // This is a placeholder for the actual UI logic
    showNotification('Edit Profile modal would open here to update details in Supabase');
}

// Initialize authentication and content integration
document.addEventListener('DOMContentLoaded', () => {
    // Load products from Supabase
    loadProductsFromSupabase();

    // Update cart for logged-in user (safe check)
    try {
        if (typeof getCurrentUser === 'function') {
            const user = getCurrentUser();
            if (user) {
                // Only override cart if user is actually logged in
                console.log('👤 User logged in, loading user-specific cart');
                cart = getUserCart();
            } else {
                console.log('👤 No user logged in, keeping default cart');
            }
            updateCartCount();
        }
    } catch (error) {
        console.log('Auth integration not available, using default cart');
    }

    // Update profile page if we're on it
    if (window.location.pathname.includes('profile.html')) {
        updateProfilePageData();
        fetchUserOrders();
    }
});

// Export functions
window.editProfile = editProfile;