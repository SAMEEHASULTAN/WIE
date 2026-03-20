// roadmap-fix.js
console.log("✅ roadmap-fix.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.id === 'logout-btn') {
                handleLogout();
            } else {
                window.location.href = this.getAttribute('href');
            }
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
    
    // Make timeline items clickable
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn-primary') && !e.target.classList.contains('btn-secondary')) {
                const skill = this.querySelector('h3')?.textContent || 'Step';
                alert(`View details for: ${skill}\n\nLearning resources and practice tasks would be shown here.`);
            }
        });
    });
    
    // Mark complete buttons
    document.querySelectorAll('.mark-complete').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.timeline-item');
            if (!this.disabled) {
                item.classList.add('completed');
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-check"></i> Completed';
                updateProgress();
                
                // Show success message
                const skill = item.querySelector('h3')?.textContent || 'Step';
                alert(`🎉 Congratulations! You've completed: ${skill}`);
            }
        });
    });
    
    // View resources buttons
    document.querySelectorAll('.view-resources').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const skill = this.closest('.timeline-item')?.querySelector('h3')?.textContent || 'this skill';
            alert(`📚 Learning Resources for ${skill}:\n\n• Online Courses\n• Video Tutorials\n• Practice Exercises\n• Community Discussions\n\nLinks would be provided here.`);
        });
    });
    
    // Initialize progress
    updateProgress();
});

function updateProgress() {
    const total = document.querySelectorAll('.timeline-item').length;
    const completed = document.querySelectorAll('.timeline-item.completed').length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    
    // Update progress text
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `${Math.round(progress)}%`;
    }
    
    // Update progress circle
    const circle = document.querySelector('.progress-bar');
    if (circle) {
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (progress / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    }
    
    // Update stats
    document.getElementById('completed-count').textContent = completed;
    document.getElementById('in-progress-count').textContent = total - completed;
    document.getElementById('total-steps').textContent = total;
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}