// career-fix.js - Navigation and Basic UI Fixes
console.log("✅ career-fix.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    console.log("Career-fix: Setting up navigation and basic handlers");
    
    // Make sidebar navigation work
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            console.log("Navigating to:", href);
            
            if (this.id === 'logout-btn') {
                handleLogout();
            } else if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
    
    // Handle logout button specifically
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Make sure all action buttons have at least basic functionality
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        if (!card.hasAttribute('onclick')) {
            card.addEventListener('click', function() {
                const text = this.querySelector('h3')?.textContent || '';
                if (text.includes('Restart Career')) {
                    window.location.href = 'career-restart.html';
                } else if (text.includes('Start Business')) {
                    window.location.href = 'business-generator.html';
                } else if (text.includes('Learn New Skills')) {
                    window.location.href = 'roadmap.html';
                } else if (text.includes('Join Community')) {
                    window.location.href = 'community.html';
                }
            });
            card.style.cursor = 'pointer';
        }
    });
    
    // Profile menu click (can be enhanced later)
    const profileMenu = document.getElementById('profile-menu');
    if (profileMenu) {
        profileMenu.addEventListener('click', function() {
            console.log("Profile menu clicked");
            // Could open profile dropdown here
        });
    }
    
    // Search bar functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    alert(`Searching for: ${query}\nSearch feature coming soon!`);
                }
            }
        });
    }
    
    console.log("Career-fix: Navigation setup complete");
});

// Global logout function
function handleLogout() {
    console.log("Logging out");
    
    // Clear all storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Show notification if auth exists
    if (window.auth && typeof window.auth.showNotification === 'function') {
        window.auth.showNotification('Logged out successfully', 'success');
    } else {
        alert('Logged out successfully');
    }
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Helper function to get user initials for avatar
function getUserInitials() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName[0] || 'U') + (lastName[0] || '');
}

// Update profile avatar if exists
document.addEventListener('DOMContentLoaded', function() {
    const avatar = document.getElementById('profile-avatar');
    if (avatar && avatar.textContent === 'JD') {
        avatar.textContent = getUserInitials();
    }
});

// Add CSS for notifications if not exists
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

console.log("✅ career-fix.js fully loaded");