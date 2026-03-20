// Theme Toggle Functionality
console.log("✅ theme.js loaded");

class ThemeManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            const icon = document.getElementById('theme-icon');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
        
        this.setupToggle();
    }
    
    setupToggle() {
        const toggleBtn = document.getElementById('theme-icon');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                
                if (document.body.classList.contains('dark-mode')) {
                    toggleBtn.classList.remove('fa-moon');
                    toggleBtn.classList.add('fa-sun');
                    localStorage.setItem('theme', 'dark');
                } else {
                    toggleBtn.classList.remove('fa-sun');
                    toggleBtn.classList.add('fa-moon');
                    localStorage.setItem('theme', 'light');
                }
            });
        }
    }
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});
// Theme Toggle Functionality
console.log("✅ theme.js loaded");

class ThemeManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            const icon = document.getElementById('theme-icon');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
        
        this.setupToggle();
    }
    
    setupToggle() {
        const toggleBtn = document.getElementById('theme-icon');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.classList.toggle('dark-mode');
                
                if (document.body.classList.contains('dark-mode')) {
                    toggleBtn.classList.remove('fa-moon');
                    toggleBtn.classList.add('fa-sun');
                    localStorage.setItem('theme', 'dark');
                } else {
                    toggleBtn.classList.remove('fa-sun');
                    toggleBtn.classList.add('fa-moon');
                    localStorage.setItem('theme', 'light');
                }
            });
        }
    }
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    if (!window.themeManager) {
        window.themeManager = new ThemeManager();
    }
});