// theme.js - Fixed Dark Mode Toggle for all pages
console.log("✅ theme.js loaded");

class ThemeManager {
    constructor() {
        this.init();
        this.setupThemeToggle();
    }
    
    init() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            this.updateAllIcons('fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            this.updateAllIcons('fa-moon');
        }
    }
    
    updateAllIcons(iconClass) {
        const icons = document.querySelectorAll('#theme-icon');
        icons.forEach(icon => {
            icon.classList.remove('fa-moon', 'fa-sun');
            icon.classList.add(iconClass);
        });
    }
    
    setupThemeToggle() {
        // Use event delegation to handle dynamically added elements
        document.addEventListener('click', (e) => {
            const themeIcon = e.target.closest('#theme-icon');
            if (themeIcon) {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Also find existing icons and ensure they work
        const existingIcons = document.querySelectorAll('#theme-icon');
        existingIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        });
    }
    
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            this.updateAllIcons('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            this.updateAllIcons('fa-moon');
        }
        
        // Force re-render for any dynamic content
        this.forceChartRedraw();
    }
    
    forceChartRedraw() {
        // If charts exist, trigger resize to fix any rendering issues
        if (window.dashboard && window.dashboard.charts) {
            Object.values(window.dashboard.charts).forEach(chart => {
                if (chart && chart.resize) {
                    setTimeout(() => chart.resize(), 100);
                }
            });
        }
    }
    
    addToggleToElement(parentElement) {
        if (!parentElement.querySelector('.theme-toggle')) {
            const themeToggle = document.createElement('div');
            themeToggle.className = 'theme-toggle';
            const currentIcon = document.body.classList.contains('dark-mode') ? 'fa-sun' : 'fa-moon';
            themeToggle.innerHTML = `<i class="fas ${currentIcon}" id="theme-icon"></i>`;
            parentElement.insertBefore(themeToggle, parentElement.firstChild);
            
            // Add click listener to the new icon
            const newIcon = themeToggle.querySelector('#theme-icon');
            if (newIcon) {
                newIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleTheme();
                });
            }
        }
    }
}

// Initialize theme manager
let themeManager;
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
    
    // Add theme toggle to dashboard header if present
    const dashboardHeader = document.querySelector('.dashboard-header .profile-menu');
    if (dashboardHeader && !dashboardHeader.querySelector('.theme-toggle')) {
        themeManager.addToggleToElement(dashboardHeader);
    }
    
    // Add theme toggle to navbar if present
    const navButtons = document.querySelector('.nav-buttons');
    if (navButtons && !navButtons.querySelector('.theme-toggle')) {
        themeManager.addToggleToElement(navButtons);
    }
});

// Export for use in other files
window.themeManager = themeManager;