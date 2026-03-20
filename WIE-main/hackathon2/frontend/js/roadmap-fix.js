// roadmap-fix.js - Complete Roadmap Navigation
console.log("✅ roadmap-fix.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.id === 'logout-btn') {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = 'index.html';
            } else {
                window.location.href = this.getAttribute('href');
            }
        });
    });
    
    // Handle logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = 'index.html';
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
    
    // Profile menu dropdown
    const profileMenu = document.getElementById('profile-menu');
    const dropdown = document.getElementById('profile-dropdown');
    if (profileMenu && dropdown) {
        profileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', function() {
            dropdown.style.display = 'none';
        });
    }
    
    console.log("Roadmap-fix: Navigation setup complete");
});