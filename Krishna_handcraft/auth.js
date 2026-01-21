// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Get local session info as a fallback or for quick checks
function getLocalUser() {
    const userSession = localStorage.getItem('vrindaUserSession');
    if (userSession) {
        try {
            return JSON.parse(userSession).user;
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Check if user is logged in
function isLoggedIn() {
    return getLocalUser() !== null;
}

// Get current logged-in user (reactive)
function getCurrentUser() {
    return getLocalUser();
}

// Login function (Async)
async function login(email, password, rememberMe = false) {
    if (!supabase) throw new Error('Supabase not initialized');

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) throw error;

    // Fetch profile data for the user
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

    const sessionUser = {
        id: data.user.id,
        email: data.user.email,
        firstName: profile?.first_name || 'User',
        lastName: profile?.last_name || '',
        phone: profile?.phone || '',
        role: profile?.role || 'customer', // Default role
        joinDate: data.user.created_at
    };

    saveUserSession(sessionUser, rememberMe);
    return sessionUser;
}

async function updateUserProfile(profileData) {
    if (!supabase) throw new Error('Supabase not initialized');

    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
        .from('profiles')
        .update({
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            phone: profileData.phone,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

    if (error) throw error;

    // Update local session
    const updatedUser = {
        ...user,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone
    };
    saveUserSession(updatedUser, true);
    return updatedUser;
}

// Register function (Async)
async function register(userData) {
    if (!supabase) throw new Error('Supabase not initialized');

    const { email, password, firstName, lastName, phone, newsletter = false } = userData;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                phone: phone
            }
        }
    });

    if (error) throw error;

    // Profiles are often handled via database triggers in Supabase,
    // but we'll ensure it exists or create it if needed in a real app.
    // For now, assume the user is created successfully.

    const sessionUser = {
        id: data.user.id,
        email: data.user.email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        role: 'customer'
    };

    saveUserSession(sessionUser, false);
    return sessionUser;
}

// Save user session locally for persistence across page loads
function saveUserSession(user, rememberMe = false) {
    const session = {
        user: user,
        timestamp: new Date().toISOString(),
        rememberMe: rememberMe
    };
    localStorage.setItem('vrindaUserSession', JSON.stringify(session));
    if (rememberMe) {
        localStorage.setItem('vrindaRememberUser', user.email);
    }
}

// Logout function
async function logout() {
    if (supabase) {
        await supabase.auth.signOut();
    }
    localStorage.removeItem('vrindaUserSession');
    window.location.href = 'index.html';
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function isValidPhone(phone) {
    // Basic phone validation (adjust regex based on your requirements)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

// ============================================
// PASSWORD UTILITIES
// ============================================

function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = document.getElementById(fieldId + 'ToggleIcon');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.textContent = 'visibility_off';
    } else {
        passwordField.type = 'password';
        toggleIcon.textContent = 'visibility';
    }
}

function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    if (!strengthBar || !strengthText) return;

    let strength = 0;
    let strengthLabel = 'Weak';

    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Character variety checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Determine strength level
    if (strength <= 2) {
        strengthLabel = 'Weak';
        strengthBar.className = 'password-strength strength-weak';
    } else if (strength <= 3) {
        strengthLabel = 'Fair';
        strengthBar.className = 'password-strength strength-fair';
    } else if (strength <= 4) {
        strengthLabel = 'Good';
        strengthBar.className = 'password-strength strength-good';
    } else {
        strengthLabel = 'Strong';
        strengthBar.className = 'password-strength strength-strong';
    }

    strengthText.textContent = strengthLabel;
}

function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageElement = document.getElementById('passwordMatchMessage');

    if (!messageElement) return;

    if (confirmPassword.length === 0) {
        messageElement.classList.add('hidden');
        return;
    }

    if (password === confirmPassword) {
        messageElement.textContent = 'Passwords match';
        messageElement.className = 'mt-1 text-xs text-green-600';
        messageElement.classList.remove('hidden');
    } else {
        messageElement.textContent = 'Passwords do not match';
        messageElement.className = 'mt-1 text-xs text-red-600';
        messageElement.classList.remove('hidden');
    }
}

// ============================================
// FORM HANDLERS
// ============================================

// Login form handler
async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value.trim();
    const password = form.password.value;
    const rememberMe = form.rememberMe?.checked || false;

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="animate-spin mr-2">⌛</span> Signing in...';

    try {
        const user = await login(email, password, rememberMe);

        showNotification('Login successful! Welcome back, ' + user.firstName, 3000);

        // Redirect based on user role
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                // Redirect to intended page or home
                const intendedUrl = sessionStorage.getItem('intendedUrl') || 'index.html';
                sessionStorage.removeItem('intendedUrl');
                window.location.href = intendedUrl;
            }
        }, 1500);

    } catch (error) {
        showNotification(error.message || 'Login failed', 4000);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Shake the form on error
        form.classList.add('animate-pulse');
        setTimeout(() => {
            form.classList.remove('animate-pulse');
        }, 500);
    }
}

// Register form handler
async function handleRegister(event) {
    event.preventDefault();

    const form = event.target;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // Check password match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 4000);
        return;
    }

    // Check terms agreement
    if (!form.agreeTerms.checked) {
        showNotification('Please agree to the Terms of Service and Privacy Policy', 4000);
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="animate-spin mr-2">⌛</span> Creating account...';

    const userData = {
        email: form.email.value.trim(),
        password: password,
        firstName: form.firstName.value.trim(),
        lastName: form.lastName.value.trim(),
        phone: form.phone.value.trim(),
        newsletter: form.newsletter?.checked || false
    };

    try {
        const user = await register(userData);

        showNotification('Account created successfully! Please check your email for confirmation.', 5000);

        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);

    } catch (error) {
        showNotification(error.message || 'Registration failed', 4000);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Shake the form on error
        form.classList.add('animate-pulse');
        setTimeout(() => {
            form.classList.remove('animate-pulse');
        }, 500);
    }
}

// Forgot password handler
async function handleForgotPassword(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.resetEmail.value.trim();

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 4000);
        return;
    }

    if (!supabase) {
        showNotification('Supabase not initialized', 4000);
        return;
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html',
        });

        if (error) throw error;

        showNotification('Password reset link sent to your email!', 3000);
        closeForgotPassword();
    } catch (error) {
        showNotification(error.message || 'Failed to send reset email', 4000);
    }
}

// ============================================
// SOCIAL LOGIN FUNCTIONS
// ============================================

function loginWithGoogle() {
    // In a real app, this would integrate with Google OAuth
    showNotification('Google login would be implemented here', 3000);
}

function loginWithFacebook() {
    // In a real app, this would integrate with Facebook Login
    showNotification('Facebook login would be implemented here', 3000);
}

function registerWithGoogle() {
    // In a real app, this would integrate with Google OAuth
    showNotification('Google registration would be implemented here', 3000);
}

function registerWithFacebook() {
    // In a real app, this would integrate with Facebook Login
    showNotification('Facebook registration would be implemented here', 3000);
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function showForgotPassword() {
    document.getElementById('forgotPasswordModal').classList.remove('hidden');
}

function closeForgotPassword() {
    document.getElementById('forgotPasswordModal').classList.add('hidden');
    document.getElementById('forgotPasswordForm').reset();
}

// ============================================
// USER INTERFACE UPDATES
// ============================================

// Update navigation based on login status
function updateNavigation() {
    const user = getCurrentUser();
    const profileButtons = document.querySelectorAll('[class*="person"], .profile-btn, .user-menu');

    profileButtons.forEach(button => {
        if (user) {
            // User is logged in - update button to show user menu
            button.onclick = () => showUserMenu();
            button.title = `Logged in as ${user.firstName}`;
        } else {
            // User is not logged in - redirect to login
            button.onclick = () => {
                sessionStorage.setItem('intendedUrl', window.location.href);
                window.location.href = 'login.html';
            };
            button.title = 'Login to your account';
        }
    });
}

// Show user menu dropdown
function showUserMenu() {
    const user = getCurrentUser();
    if (!user) return;

    // Create user menu modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4 pt-20';
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 min-w-[250px]">
            <div class="p-4 border-b border-slate-200 dark:border-slate-700">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                        ${user.firstName.charAt(0)}${user.lastName.charAt(0)}
                    </div>
                    <div>
                        <p class="font-medium text-slate-900 dark:text-white">${user.firstName} ${user.lastName}</p>
                        <p class="text-sm text-slate-500 dark:text-slate-400">${user.email}</p>
                    </div>
                </div>
            </div>
            <div class="p-2">
                <a href="profile.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">person</span>
                    <span>My Profile</span>
                </a>
                <a href="order-confirmation.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">shopping_bag</span>
                    <span>My Orders</span>
                </a>
                <a href="settings.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">settings</span>
                    <span>Settings</span>
                </a>
                ${user.role === 'admin' ? `
                <a href="admin-dashboard.html" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                    <span>Admin Dashboard</span>
                </a>
                ` : ''}
                <hr class="my-2 border-slate-200 dark:border-slate-700">
                <button onclick="logout()" class="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">logout</span>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// ============================================
// PROTECTED ROUTES
// ============================================

// Check if page requires authentication
function checkAuthRequired() {
    const protectedPages = ['profile.html', 'settings.html', 'checkout.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
        sessionStorage.setItem('intendedUrl', window.location.href);
        window.location.href = 'login.html';
        return false;
    }

    return true;
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Listen for auth state changes from Supabase
    if (typeof supabase !== 'undefined' && supabase) {
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔄 Auth state changed:', event);

            if (event === 'SIGNED_IN' && session) {
                // Fetch full profile if not already in session
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                const sessionUser = {
                    id: session.user.id,
                    email: session.user.email,
                    firstName: profile?.first_name || session.user.user_metadata?.first_name || 'User',
                    lastName: profile?.last_name || session.user.user_metadata?.last_name || '',
                    phone: profile?.phone || session.user.user_metadata?.phone || '',
                    role: profile?.role || 'customer',
                    joinDate: session.user.created_at
                };
                saveUserSession(sessionUser, true);
                updateNavigation();
            } else if (event === 'SIGNED_OUT') {
                localStorage.removeItem('vrindaUserSession');
                updateNavigation();
            }
        });
    }

    // Check authentication for protected pages
    checkAuthRequired();

    // Update navigation based on login status
    updateNavigation();

    // Setup form handlers
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);

        // Pre-fill remembered email
        const rememberedEmail = localStorage.getItem('vrindaRememberUser');
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }

    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.fixed.inset-0');
            modals.forEach(modal => {
                if (modal.id === 'forgotPasswordModal') {
                    closeForgotPassword();
                }
            });
        }
    });

    // Update user info in profile page
    if (window.location.pathname.includes('profile.html')) {
        updateProfilePage();
    }
});

// Update profile page with user data
function updateProfilePage() {
    const user = getCurrentUser();
    if (!user) return;

    // Update form fields with user data
    const fields = {
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email,
        'phone': user.phone
    };

    Object.entries(fields).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
        }
    });
}

// Export functions for global use
window.login = login;
window.register = register;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.isLoggedIn = isLoggedIn;
window.togglePassword = togglePassword;
window.checkPasswordStrength = checkPasswordStrength;
window.checkPasswordMatch = checkPasswordMatch;
window.showForgotPassword = showForgotPassword;
window.closeForgotPassword = closeForgotPassword;
window.loginWithGoogle = loginWithGoogle;
window.loginWithFacebook = loginWithFacebook;
window.registerWithGoogle = registerWithGoogle;
window.registerWithFacebook = registerWithFacebook;
window.showUserMenu = showUserMenu;