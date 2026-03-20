// Dashboard JavaScript
class Dashboard {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        
        if (!this.token || !this.user) {
            window.location.href = '/';
            return;
        }
        
        this.init();
    }
    
    async init() {
        this.updateUserInfo();
        this.setupEventListeners();
        await this.loadDashboardData();
    }
    
    updateUserInfo() {
        // Update profile avatar
        const avatar = document.getElementById('profile-avatar');
        if (avatar && this.user) {
            const initials = (this.user.firstName?.[0] || '') + (this.user.lastName?.[0] || '');
            avatar.textContent = initials || 'U';
        }
        
        // Update welcome message
        const userName = document.getElementById('user-name');
        if (userName && this.user) {
            userName.textContent = this.user.firstName || 'User';
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
        
        // Profile menu
        document.getElementById('profile-menu')?.addEventListener('click', () => {
            // Add profile dropdown functionality
        });
    }
    
    async loadDashboardData() {
        try {
            const response = await fetch(`${this.baseURL}/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to load dashboard data');
            }
            
            const data = await response.json();
            this.renderMetrics(data.metrics);
            this.renderCharts(data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            auth.showNotification('Failed to load dashboard data', 'error');
        }
    }
    
    renderMetrics(metrics) {
        const container = document.getElementById('metric-cards');
        if (!container) return;
        
        container.innerHTML = `
            <div class="metric-card">
                <div class="metric-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="metric-value">${metrics.skill_progress}%</div>
                <div class="metric-label">Skill Progress</div>
                <div class="progress-bar mini">
                    <div class="progress-fill" style="width: ${metrics.skill_progress}%"></div>
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="metric-value">${metrics.job_readiness}%</div>
                <div class="metric-label">Job Readiness</div>
                <div class="progress-bar mini">
                    <div class="progress-fill" style="width: ${metrics.job_readiness}%"></div>
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-icon">
                    <i class="fas fa-store"></i>
                </div>
                <div class="metric-value">${metrics.business_readiness}%</div>
                <div class="metric-label">Business Readiness</div>
                <div class="progress-bar mini">
                    <div class="progress-fill" style="width: ${metrics.business_readiness}%"></div>
                </div>
            </div>
        `;
    }
    
    renderCharts(data) {
        // Skill Growth Chart (Line)
        if (document.getElementById('skillGrowthChart')) {
            new Chart(document.getElementById('skillGrowthChart'), {
                type: 'line',
                data: {
                    labels: data.skill_growth.labels,
                    datasets: [{
                        label: 'Skill Progress',
                        data: data.skill_growth.values,
                        borderColor: '#7F56D9',
                        backgroundColor: 'rgba(127, 86, 217, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
        
        // Skill Distribution Chart (Pie)
        if (document.getElementById('skillDistributionChart')) {
            new Chart(document.getElementById('skillDistributionChart'), {
                type: 'doughnut',
                data: {
                    labels: Object.keys(data.skill_distribution),
                    datasets: [{
                        data: Object.values(data.skill_distribution),
                        backgroundColor: [
                            '#7F56D9',
                            '#F9A8D4',
                            '#38BDF8',
                            '#10B981'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
        
        // Skill Demand Chart (Bar)
        if (document.getElementById('skillDemandChart')) {
            new Chart(document.getElementById('skillDemandChart'), {
                type: 'bar',
                data: {
                    labels: data.skill_demand.labels,
                    datasets: [{
                        label: 'Demand (%)',
                        data: data.skill_demand.values,
                        backgroundColor: '#7F56D9',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});