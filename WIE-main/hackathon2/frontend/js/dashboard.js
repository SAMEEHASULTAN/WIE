// dashboard.js - Main Dashboard Functionality (Fixed with proper chart sizing)
console.log("✅ dashboard.js loaded");

class Dashboard {
    constructor() {
        console.log("✅ Dashboard constructor called");
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
        this.charts = {};
        
        if (!this.token || !this.user) {
            console.log("No user logged in");
            // Don't redirect immediately, allow demo mode
        }
        
        this.init();
    }
    
    init() {
        console.log("Dashboard init called");
        this.updateUserInfo();
        this.loadDashboardData();
        this.setupEventListeners();
        // Delay chart initialization to ensure canvas is ready
        setTimeout(() => {
            this.initCharts();
        }, 100);
    }
    
    updateUserInfo() {
        const avatar = document.getElementById('profile-avatar');
        if (avatar && this.user.firstName) {
            const initials = (this.user.firstName?.[0] || '') + (this.user.lastName?.[0] || '');
            avatar.textContent = initials || 'U';
        }
        
        const userNameSpan = document.getElementById('user-name');
        if (userNameSpan && this.user.firstName) {
            userNameSpan.textContent = this.user.firstName;
        }
        
        const userFullname = document.getElementById('user-fullname');
        if (userFullname && this.user.firstName) {
            userFullname.textContent = `${this.user.firstName} ${this.user.lastName || ''}`.trim();
        }
    }
    
    setupEventListeners() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
        
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
        
        const profileMenu = document.getElementById('profile-menu');
        const dropdown = document.getElementById('profile-dropdown');
        if (profileMenu && dropdown) {
            profileMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });
            
            document.addEventListener('click', () => {
                dropdown.style.display = 'none';
            });
        }
        
        const dropdownLogin = document.getElementById('dropdown-login');
        const dropdownSignup = document.getElementById('dropdown-signup');
        const dropdownLogout = document.getElementById('dropdown-logout');
        
        if (dropdownLogin) {
            dropdownLogin.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        if (dropdownSignup) {
            dropdownSignup.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        if (dropdownLogout) {
            dropdownLogout.addEventListener('click', () => {
                this.handleLogout();
            });
        }
        
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                const text = card.querySelector('h3')?.textContent || '';
                if (text.includes('Career Restart') || text.includes('Restart Career')) {
                    window.location.href = 'career-restart.html';
                } else if (text.includes('Business') || text.includes('Start Business')) {
                    window.location.href = 'business-generator.html';
                } else if (text.includes('Roadmap') || text.includes('Learn')) {
                    window.location.href = 'roadmap.html';
                } else if (text.includes('Community') || text.includes('Join')) {
                    window.location.href = 'community.html';
                }
            });
            card.style.cursor = 'pointer';
        });
        
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            card.addEventListener('click', () => {
                const label = card.querySelector('.metric-label')?.textContent || '';
                if (label.includes('Skill')) {
                    window.location.href = 'skills.html';
                } else if (label.includes('Job')) {
                    window.location.href = 'career-restart.html';
                } else if (label.includes('Business')) {
                    window.location.href = 'business-generator.html';
                }
            });
            card.style.cursor = 'pointer';
        });
        
        const charts = document.querySelectorAll('.chart-container');
        charts.forEach(chart => {
            chart.addEventListener('click', () => {
                const title = chart.querySelector('h3')?.textContent || '';
                if (title.includes('Skill Growth') || title.includes('Skill Distribution')) {
                    window.location.href = 'skills.html';
                } else if (title.includes('In-Demand')) {
                    window.location.href = 'career-restart.html';
                }
            });
            chart.style.cursor = 'pointer';
        });
        
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        this.searchResources(query);
                    }
                }
            });
        }
    }
    
    async loadDashboardData() {
        try {
            const response = await fetch(`${this.baseURL}/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.updateMetrics(data.metrics);
                if (data.recent_activity) {
                    this.updateRecentActivity(data.recent_activity);
                }
            } else if (response.status === 401) {
                // Not logged in, use demo data
                this.loadMockData();
            } else {
                this.loadMockData();
            }
        } catch (error) {
            console.log('API not available, loading mock data');
            this.loadMockData();
        }
    }
    
    loadMockData() {
        const metrics = {
            skill_progress: 65,
            job_readiness: 45,
            business_readiness: 70
        };
        this.updateMetrics(metrics);
        
        const recentActivity = [
            { action: 'Completed onboarding', date: '2 days ago' },
            { action: 'Added 3 new skills', date: '5 days ago' },
            { action: 'Saved a business idea', date: '1 week ago' }
        ];
        this.updateRecentActivity(recentActivity);
    }
    
    updateMetrics(metrics) {
        const metricCards = document.querySelectorAll('.metric-card');
        if (metricCards.length >= 3) {
            const skillValue = metricCards[0]?.querySelector('.metric-value');
            const jobValue = metricCards[1]?.querySelector('.metric-value');
            const businessValue = metricCards[2]?.querySelector('.metric-value');
            const skillFill = metricCards[0]?.querySelector('.progress-fill');
            const jobFill = metricCards[1]?.querySelector('.progress-fill');
            const businessFill = metricCards[2]?.querySelector('.progress-fill');
            
            if (skillValue) skillValue.textContent = `${metrics.skill_progress}%`;
            if (jobValue) jobValue.textContent = `${metrics.job_readiness}%`;
            if (businessValue) businessValue.textContent = `${metrics.business_readiness}%`;
            if (skillFill) skillFill.style.width = `${metrics.skill_progress}%`;
            if (jobFill) jobFill.style.width = `${metrics.job_readiness}%`;
            if (businessFill) businessFill.style.width = `${metrics.business_readiness}%`;
        }
    }
    
    updateRecentActivity(activities) {
        console.log('Recent activities:', activities);
    }
    
    initCharts() {
        // Destroy existing charts if they exist
        if (this.charts.skillGrowth) {
            this.charts.skillGrowth.destroy();
        }
        if (this.charts.skillDistribution) {
            this.charts.skillDistribution.destroy();
        }
        if (this.charts.skillDemand) {
            this.charts.skillDemand.destroy();
        }
        
        // Get canvas elements
        const skillGrowthCanvas = document.getElementById('skillGrowthChart');
        const distributionCanvas = document.getElementById('skillDistributionChart');
        const demandCanvas = document.getElementById('skillDemandChart');
        
        // Set fixed height for charts
        if (skillGrowthCanvas) {
            skillGrowthCanvas.style.height = '300px';
            skillGrowthCanvas.style.width = '100%';
        }
        if (distributionCanvas) {
            distributionCanvas.style.height = '300px';
            distributionCanvas.style.width = '100%';
        }
        if (demandCanvas) {
            demandCanvas.style.height = '300px';
            demandCanvas.style.width = '100%';
        }
        
        // Skill Growth Chart (Line)
        if (skillGrowthCanvas && skillGrowthCanvas.getContext) {
            this.charts.skillGrowth = new Chart(skillGrowthCanvas, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Skill Progress',
                        data: [30, 45, 55, 65],
                        borderColor: '#7F56D9',
                        backgroundColor: 'rgba(127, 86, 217, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#7F56D9',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#fff',
                            bodyColor: '#ddd'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Progress (%)',
                                font: { size: 12 }
                            },
                            grid: { color: 'rgba(0,0,0,0.05)' }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Weeks',
                                font: { size: 12 }
                            },
                            grid: { display: false }
                        }
                    }
                }
            });
        }
        
        // Skill Distribution Chart (Doughnut)
        if (distributionCanvas && distributionCanvas.getContext) {
            this.charts.skillDistribution = new Chart(distributionCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['Technical', 'Soft Skills', 'Creative', 'Business'],
                    datasets: [{
                        data: [4, 3, 2, 1],
                        backgroundColor: ['#7F56D9', '#F9A8D4', '#38BDF8', '#10B981'],
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1.2,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 15,
                                font: { size: 11 }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value} skills (${percentage}%)`;
                                }
                            }
                        }
                    },
                    cutout: '60%'
                }
            });
        }
        
        // Skill Demand Chart (Bar)
        if (demandCanvas && demandCanvas.getContext) {
            this.charts.skillDemand = new Chart(demandCanvas, {
                type: 'bar',
                data: {
                    labels: ['Digital Marketing', 'Data Analysis', 'Content Writing', 'Project Management', 'Web Development'],
                    datasets: [{
                        label: 'Demand (%)',
                        data: [95, 88, 82, 78, 75],
                        backgroundColor: '#7F56D9',
                        borderRadius: 8,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1.5,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            callbacks: {
                                label: function(context) {
                                    return `Demand: ${context.raw}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Demand Percentage (%)',
                                font: { size: 12 }
                            },
                            grid: { color: 'rgba(0,0,0,0.05)' }
                        },
                        x: {
                            ticks: {
                                font: { size: 10 },
                                maxRotation: 45,
                                minRotation: 45
                            },
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    }
    
    searchResources(query) {
        console.log('Searching for:', query);
        alert(`Searching for "${query}"\n\nResults will appear here soon!`);
    }
    
    handleLogout() {
        console.log("Logging out");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM ready, creating Dashboard instance");
    if (!window.dashboard) {
        window.dashboard = new Dashboard();
    }
});