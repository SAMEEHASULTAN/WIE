// profile-menu.js - Universal Profile Menu with Dropdown
console.log("✅ profile-menu.js loaded");

class ProfileMenu {
    constructor() {
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        console.log("Initializing Profile Menu");
        this.updateProfileDisplay();
        this.checkAuthStatus();
    }
    
    setupEventListeners() {
        // Toggle dropdown on profile click
        const profileMenu = document.getElementById('profile-menu');
        const dropdown = document.getElementById('profile-dropdown');
        
        if (profileMenu) {
            profileMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                if (dropdown) {
                    const isVisible = dropdown.style.display === 'block';
                    dropdown.style.display = isVisible ? 'none' : 'block';
                }
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        });
        
        // Login dropdown item
        const dropdownLogin = document.getElementById('dropdown-login');
        if (dropdownLogin) {
            dropdownLogin.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.auth && typeof window.auth.showModal === 'function') {
                    window.auth.showModal('login-modal');
                } else {
                    alert('Please login to continue');
                }
                if (dropdown) dropdown.style.display = 'none';
            });
        }
        
        // Signup dropdown item
        const dropdownSignup = document.getElementById('dropdown-signup');
        if (dropdownSignup) {
            dropdownSignup.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.auth && typeof window.auth.showModal === 'function') {
                    window.auth.showModal('signup-modal');
                } else {
                    alert('Please sign up to continue');
                }
                if (dropdown) dropdown.style.display = 'none';
            });
        }
        
        // Logout dropdown item
        const dropdownLogout = document.getElementById('dropdown-logout');
        if (dropdownLogout) {
            dropdownLogout.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleLogout();
                if (dropdown) dropdown.style.display = 'none';
            });
        }
    }
    
    updateProfileDisplay() {
        const user = this.getUser();
        const avatar = document.getElementById('profile-avatar');
        const userNameSpan = document.getElementById('user-fullname');
        
        if (user && user.firstName) {
            // User is logged in
            const initials = (user.firstName[0] || 'U') + (user.lastName?.[0] || '');
            if (avatar) avatar.textContent = initials.toUpperCase();
            if (userNameSpan) userNameSpan.textContent = `${user.firstName} ${user.lastName || ''}`.trim();
        } else {
            // User is not logged in
            if (avatar) avatar.textContent = 'U';
            if (userNameSpan) userNameSpan.textContent = 'Guest User';
        }
    }
    
    checkAuthStatus() {
        const user = this.getUser();
        const dropdownLogin = document.getElementById('dropdown-login');
        const dropdownSignup = document.getElementById('dropdown-signup');
        const dropdownLogout = document.getElementById('dropdown-logout');
        const profileName = document.getElementById('profile-name');
        
        if (user && user.firstName) {
            // User is logged in
            if (dropdownLogin) dropdownLogin.style.display = 'none';
            if (dropdownSignup) dropdownSignup.style.display = 'none';
            if (dropdownLogout) dropdownLogout.style.display = 'flex';
            if (profileName) profileName.style.display = 'flex';
        } else {
            // User is not logged in
            if (dropdownLogin) dropdownLogin.style.display = 'flex';
            if (dropdownSignup) dropdownSignup.style.display = 'flex';
            if (dropdownLogout) dropdownLogout.style.display = 'none';
            if (profileName) profileName.style.display = 'flex';
        }
    }
    
    getUser() {
        try {
            const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
            return userData ? JSON.parse(userData) : {};
        } catch {
            return {};
        }
    }
    
    handleLogout() {
        console.log("Profile menu logout triggered");
        
        // Clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        
        // Update display
        this.updateProfileDisplay();
        this.checkAuthStatus();
        
        // Show notification
        if (window.auth && typeof window.auth.showNotification === 'function') {
            window.auth.showNotification('Logged out successfully', 'success');
        } else {
            alert('Logged out successfully');
        }
        
        // Redirect to home page after logout
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }
    
    refresh() {
        this.updateProfileDisplay();
        this.checkAuthStatus();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM ready, creating ProfileMenu instance");
    if (!window.profileMenu) {
        window.profileMenu = new ProfileMenu();
    }
});

// Also initialize if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!window.profileMenu) {
            console.log("DOM already ready, creating ProfileMenu now");
            window.profileMenu = new ProfileMenu();
        }
    }, 100);
}

// Export for use in other files
window.updateProfileMenu = function() {
    if (window.profileMenu) {
        window.profileMenu.refresh();
    }
};