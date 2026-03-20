// dashboard-fix.js - Navigation and UI Fixes Only
console.log("✅ dashboard-fix.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    console.log("Dashboard-fix: Setting up navigation");
    
    // Sidebar navigation - ensure all links work
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        // Remove any existing listeners to avoid duplicates
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            console.log("Navigating to:", href);
            
            if (this.id === 'logout-btn') {
                handleDashboardLogout();
            } else if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
    
    // Handle logout button specifically
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        
        newLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleDashboardLogout();
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        const newToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);
        
        newToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Profile menu dropdown fix
    const profileMenu = document.getElementById('profile-menu');
    const dropdown = document.getElementById('profile-dropdown');
    if (profileMenu && dropdown) {
        const newProfileMenu = profileMenu.cloneNode(true);
        profileMenu.parentNode.replaceChild(newProfileMenu, profileMenu);
        
        newProfileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', function() {
            dropdown.style.display = 'none';
        });
    }
    
    // Update user name in welcome card
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    const userNameSpan = document.getElementById('user-name');
    if (userNameSpan && user.firstName) {
        userNameSpan.textContent = user.firstName;
    }
    
    // Update profile avatar and name in dropdown
    const avatar = document.getElementById('profile-avatar');
    const userFullname = document.getElementById('user-fullname');
    if (avatar && user.firstName) {
        const initials = (user.firstName[0] || 'U') + (user.lastName?.[0] || '');
        avatar.textContent = initials;
    }
    if (userFullname && user.firstName) {
        userFullname.textContent = `${user.firstName} ${user.lastName || ''}`.trim();
    }
    
    console.log("Dashboard-fix: Navigation setup complete");
});

function handleDashboardLogout() {
    console.log("Logging out from dashboard");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Show notification if available
    if (window.auth && typeof window.auth.showNotification === 'function') {
        window.auth.showNotification('Logged out successfully', 'success');
    }
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}