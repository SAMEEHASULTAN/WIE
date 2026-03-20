// dashboard-fix.js - Makes dashboard navigation work
console.log("✅ dashboard-fix.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    console.log("Setting up dashboard navigation");
    
    // Make all sidebar navigation links work
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            console.log("Navigating to:", href);
            
            // Don't navigate if it's the logout button
            if (this.id === 'logout-btn') {
                handleLogout();
                return;
            }
            
            // Navigate to the page
            window.location.href = href;
        });
    });
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Make action cards clickable
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            // Try to find where this card should navigate
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
    });
    
    // Make metric cards interactive
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('click', function() {
            const label = this.querySelector('.metric-label')?.textContent || '';
            if (label.includes('Skill Progress')) {
                window.location.href = 'skills.html';
            } else if (label.includes('Job Readiness')) {
                window.location.href = 'career-restart.html';
            } else if (label.includes('Business Readiness')) {
                window.location.href = 'business-generator.html';
            }
        });
        card.style.cursor = 'pointer';
    });
    
    // Make chart containers clickable
    const charts = document.querySelectorAll('.chart-container');
    charts.forEach(chart => {
        chart.addEventListener('click', function() {
            const title = this.querySelector('h3')?.textContent || '';
            if (title.includes('Skill Growth') || title.includes('Skill Distribution')) {
                window.location.href = 'skills.html';
            } else if (title.includes('In-Demand Skills')) {
                window.location.href = 'career-restart.html';
            }
        });
        chart.style.cursor = 'pointer';
    });
    
    // Make welcome card clickable
    const welcomeCard = document.querySelector('.welcome-card');
    if (welcomeCard) {
        welcomeCard.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
        welcomeCard.style.cursor = 'pointer';
    }
});

function handleLogout() {
    console.log("Logging out");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}