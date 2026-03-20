// Learning Roadmap JavaScript
class LearningRoadmap {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        this.completedSteps = new Set();
        
        if (!this.token || !this.user) {
            window.location.href = '/';
            return;
        }
        
        this.init();
    }
    
    init() {
        this.updateUserInfo();
        this.setupEventListeners();
        this.loadRoadmap();
    }
    
    updateUserInfo() {
        const avatar = document.getElementById('profile-avatar');
        if (avatar && this.user) {
            const initials = (this.user.firstName?.[0] || '') + (this.user.lastName?.[0] || '');
            avatar.textContent = initials || 'U';
        }
    }
    
    setupEventListeners() {
        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });
        
        // Mobile menu toggle
        document.getElementById('menu-toggle')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
        
        // Load saved progress from localStorage
        const saved = localStorage.getItem('roadmap_progress');
        if (saved) {
            this.completedSteps = new Set(JSON.parse(saved));
        }
    }
    
    async loadRoadmap() {
        try {
            const response = await fetch(`${this.baseURL}/roadmap`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                const roadmap = await response.json();
                this.displayRoadmap(roadmap);
            } else {
                // Fallback to mock data
                this.displayMockRoadmap();
            }
        } catch (error) {
            console.error('Error loading roadmap:', error);
            this.displayMockRoadmap();
        }
    }
    
    displayRoadmap(roadmap) {
        const timeline = document.getElementById('timeline');
        const totalSteps = roadmap.length;
        const completedCount = this.completedSteps.size;
        
        timeline.innerHTML = roadmap.map((step, index) => {
            const isCompleted = this.completedSteps.has(step.id);
            const status = isCompleted ? 'completed' : 'pending';
            
            return `
                <div class="timeline-item ${status}" data-step-id="${step.id}">
                    <div class="timeline-marker">
                        ${isCompleted ? '<i class="fas fa-check-circle"></i>' : index + 1}
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <h3>${step.skill}</h3>
                            <span class="category-badge">${step.category}</span>
                        </div>
                        <p class="duration"><i class="far fa-clock"></i> ${step.duration}</p>
                        <div class="resources">
                            <h4>Resources:</h4>
                            <ul>
                                ${step.resources.map(resource => `<li>${resource}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="step-actions">
                            <button class="btn-secondary view-resources" data-step='${JSON.stringify(step)}'>
                                <i class="fas fa-external-link-alt"></i> View Resources
                            </button>
                            <button class="btn-primary mark-complete" ${isCompleted ? 'disabled' : ''}>
                                <i class="fas fa-check"></i>
                                ${isCompleted ? 'Completed' : 'Mark Complete'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Update stats
        document.getElementById('completed-count').textContent = completedCount;
        document.getElementById('in-progress-count').textContent = totalSteps - completedCount;
        document.getElementById('total-steps').textContent = totalSteps;
        
        // Update progress circle
        const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
        this.updateProgressCircle(progress);
        document.querySelector('.progress-text').textContent = `${Math.round(progress)}%`;
        
        // Add event listeners
        this.addStepEventListeners();
    }
    
    displayMockRoadmap() {
        const mockRoadmap = [
            {
                id: 'technical-0',
                category: 'Technical',
                skill: 'Programming Basics',
                resources: ['Online courses', 'Coding bootcamps', 'Practice exercises'],
                duration: '1 month'
            },
            {
                id: 'technical-1',
                category: 'Technical',
                skill: 'Web Development Fundamentals',
                resources: ['HTML/CSS tutorials', 'JavaScript basics', 'Build a simple website'],
                duration: '2 months'
            },
            {
                id: 'soft-0',
                category: 'Soft Skills',
                skill: 'Communication Skills',
                resources: ['Public speaking course', 'Business writing', 'Presentation skills'],
                duration: '1 month'
            },
            {
                id: 'business-0',
                category: 'Business',
                skill: 'Marketing Basics',
                resources: ['Digital marketing', 'Social media strategy', 'Content creation'],
                duration: '1.5 months'
            }
        ];
        
        this.displayRoadmap(mockRoadmap);
    }
    
    addStepEventListeners() {
        // Mark complete buttons
        document.querySelectorAll('.mark-complete:not([disabled])').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const timelineItem = e.target.closest('.timeline-item');
                const stepId = timelineItem.dataset.stepId;
                
                try {
                    const response = await fetch(`${this.baseURL}/roadmap/complete`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.token}`
                        },
                        body: JSON.stringify({ stepId })
                    });
                    
                    if (response.ok) {
                        this.completedSteps.add(stepId);
                        localStorage.setItem('roadmap_progress', JSON.stringify(Array.from(this.completedSteps)));
                        
                        // Update UI
                        timelineItem.classList.add('completed');
                        timelineItem.querySelector('.timeline-marker').innerHTML = '<i class="fas fa-check-circle"></i>';
                        btn.disabled = true;
                        btn.innerHTML = '<i class="fas fa-check"></i> Completed';
                        
                        // Update stats
                        this.updateStats();
                        
                        auth.showNotification('Step completed! Great progress!', 'success');
                    }
                } catch (error) {
                    console.error('Error marking step complete:', error);
                    auth.showNotification('Failed to update progress', 'error');
                }
            });
        });
        
        // View resources buttons
        document.querySelectorAll('.view-resources').forEach(btn => {
            btn.addEventListener('click', () => {
                const step = JSON.parse(btn.dataset.step);
                this.showResources(step);
            });
        });
    }
    
    showResources(step) {
        const modal = document.getElementById('resource-modal');
        const details = document.getElementById('resource-details');
        
        details.innerHTML = `
            <div class="resource-detail">
                <h2>${step.skill}</h2>
                <p class="category">${step.category} • ${step.duration}</p>
                
                <h3>Learning Resources</h3>
                <ul class="resources-list">
                    ${step.resources.map(resource => `
                        <li>
                            <i class="fas fa-link"></i>
                            <a href="#" target="_blank">${resource}</a>
                        </li>
                    `).join('')}
                </ul>
                
                <h3>Practice Tasks</h3>
                <ul class="tasks-list">
                    <li>Complete a mini-project using this skill</li>
                    <li>Take an online assessment</li>
                    <li>Teach someone else what you learned</li>
                </ul>
                
                <div class="resource-actions">
                    <button class="btn-primary start-learning">Start Learning</button>
                    <button class="btn-secondary close-modal">Close</button>
                </div>
            </div>
        `;
        
        // Close button
        details.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        // Start learning button
        details.querySelector('.start-learning').addEventListener('click', () => {
            auth.showNotification('Resources opened in new tab!', 'success');
            // In real app, open actual resource links
        });
        
        modal.classList.add('active');
    }
    
    updateStats() {
        const totalSteps = parseInt(document.getElementById('total-steps').textContent);
        const completedCount = this.completedSteps.size;
        const inProgressCount = totalSteps - completedCount;
        const progress = (completedCount / totalSteps) * 100;
        
        document.getElementById('completed-count').textContent = completedCount;
        document.getElementById('in-progress-count').textContent = inProgressCount;
        
        this.updateProgressCircle(progress);
        document.querySelector('.progress-text').textContent = `${Math.round(progress)}%`;
    }
    
    updateProgressCircle(progress) {
        const circle = document.querySelector('.progress-bar');
        if (circle) {
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (progress / 100) * circumference;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
        }
    }
}

// Initialize roadmap
document.addEventListener('DOMContentLoaded', () => {
    window.learningRoadmap = new LearningRoadmap();
});