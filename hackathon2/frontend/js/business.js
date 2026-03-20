// Business Generator JavaScript
class BusinessGenerator {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        this.selectedSkills = new Set();
        
        if (!this.token || !this.user) {
            window.location.href = '/';
            return;
        }
        
        this.init();
    }
    
    init() {
        this.updateUserInfo();
        this.setupEventListeners();
        this.loadUserSkills();
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
        
        // Skills chips
        document.querySelectorAll('#business-skills .chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const skill = chip.dataset.skill;
                if (this.selectedSkills.has(skill)) {
                    this.selectedSkills.delete(skill);
                    chip.classList.remove('selected');
                } else {
                    this.selectedSkills.add(skill);
                    chip.classList.add('selected');
                }
            });
        });
        
        // Generate ideas
        document.getElementById('generate-ideas')?.addEventListener('click', () => {
            this.generateIdeas();
        });
        
        // Regenerate ideas
        document.getElementById('regenerate-ideas')?.addEventListener('click', () => {
            this.generateIdeas();
        });
        
        // Close modal
        document.querySelectorAll('#business-modal .close').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('business-modal').classList.remove('active');
            });
        });
    }
    
    async loadUserSkills() {
        try {
            const response = await fetch(`${this.baseURL}/skills`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                const skills = await response.json();
                skills.forEach(skill => {
                    this.selectedSkills.add(skill.name);
                });
                
                // Update chips
                document.querySelectorAll('#business-skills .chip').forEach(chip => {
                    if (this.selectedSkills.has(chip.dataset.skill)) {
                        chip.classList.add('selected');
                    }
                });
            }
        } catch (error) {
            console.error('Error loading skills:', error);
        }
    }
    
    async generateIdeas() {
        if (this.selectedSkills.size === 0) {
            auth.showNotification('Please select at least one skill', 'error');
            return;
        }
        
        const budget = document.getElementById('budget').value;
        const timeAvailability = document.getElementById('time-availability').value;
        const location = document.querySelector('input[name="location"]:checked').value;
        
        try {
            const response = await fetch(`${this.baseURL}/business-ideas/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    skills: Array.from(this.selectedSkills),
                    budget,
                    timeAvailability,
                    location
                })
            });
            
            if (response.ok) {
                const ideas = await response.json();
                this.displayIdeas(ideas);
            } else {
                auth.showNotification('Failed to generate ideas', 'error');
            }
        } catch (error) {
            console.error('Error generating ideas:', error);
            auth.showNotification('Network error', 'error');
        }
    }
    
    displayIdeas(ideas) {
        const resultsSection = document.getElementById('results-section');
        const grid = document.getElementById('business-ideas-grid');
        
        resultsSection.style.display = 'block';
        
        grid.innerHTML = ideas.map(idea => `
            <div class="business-card" data-idea='${JSON.stringify(idea)}'>
                ${idea.best_match_score > 70 ? '<div class="best-match-badge">Best Match</div>' : ''}
                <h3 class="business-title">${idea.title}</h3>
                <p class="business-desc">${idea.description}</p>
                <div class="business-meta">
                    <div class="meta-item">
                        <span class="meta-label">Startup Cost</span>
                        <span class="meta-value">${idea.startup_cost}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Expected Profit</span>
                        <span class="meta-value">${idea.expected_profit}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Time to Start</span>
                        <span class="meta-value">${idea.time_to_start}</span>
                    </div>
                </div>
                <div class="business-actions">
                    <button class="btn-secondary view-details">View Details</button>
                    <button class="btn-icon save-idea" title="Save Idea">
                        <i class="far fa-bookmark"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to cards
        grid.querySelectorAll('.business-card').forEach(card => {
            const viewBtn = card.querySelector('.view-details');
            viewBtn.addEventListener('click', () => {
                const ideaData = JSON.parse(card.dataset.idea);
                this.showIdeaDetails(ideaData);
            });
            
            const saveBtn = card.querySelector('.save-idea');
            saveBtn.addEventListener('click', () => {
                const ideaData = JSON.parse(card.dataset.idea);
                this.saveIdea(ideaData);
            });
        });
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showIdeaDetails(idea) {
        const modal = document.getElementById('business-modal');
        const details = document.getElementById('business-details');
        
        details.innerHTML = `
            <div class="business-detail">
                <h2>${idea.title}</h2>
                <p class="description">${idea.description}</p>
                
                <div class="detail-section">
                    <h3>Quick Overview</h3>
                    <div class="overview-grid">
                        <div class="overview-item">
                            <strong>Startup Cost:</strong>
                            <span>${idea.startup_cost}</span>
                        </div>
                        <div class="overview-item">
                            <strong>Expected Profit:</strong>
                            <span>${idea.expected_profit}</span>
                        </div>
                        <div class="overview-item">
                            <strong>Time to Start:</strong>
                            <span>${idea.time_to_start}</span>
                        </div>
                        <div class="overview-item">
                            <strong>Target Customers:</strong>
                            <span>${idea.target_customers}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Step-by-Step Execution Plan</h3>
                    <ol class="execution-list">
                        ${idea.execution_plan.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                <div class="detail-section">
                    <h3>Required Tools & Resources</h3>
                    <ul class="tools-list">
                        ${idea.required_tools.map(tool => `<li>${tool}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h3>Marketing Strategy</h3>
                    <ul class="marketing-list">
                        ${idea.marketing_strategy.map(strategy => `<li>${strategy}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h3>Profit Calculator</h3>
                    <div class="profit-calculator">
                        <div class="form-group">
                            <label>Number of Customers per Month</label>
                            <input type="number" id="customers" value="10" min="1">
                        </div>
                        <div class="form-group">
                            <label>Average Price per Customer (₹)</label>
                            <input type="number" id="price" value="1000" min="1">
                        </div>
                        <div class="result">
                            <strong>Estimated Monthly Profit:</strong>
                            <span id="monthly-profit">₹10,000</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-actions">
                    <button class="btn-primary save-idea-btn">Save This Idea</button>
                    <button class="btn-secondary close-modal">Close</button>
                </div>
            </div>
        `;
        
        // Add calculator functionality
        const customersInput = details.querySelector('#customers');
        const priceInput = details.querySelector('#price');
        const profitSpan = details.querySelector('#monthly-profit');
        
        const calculateProfit = () => {
            const customers = parseInt(customersInput.value) || 0;
            const price = parseInt(priceInput.value) || 0;
            const profit = customers * price;
            profitSpan.textContent = `₹${profit.toLocaleString('en-IN')}`;
        };
        
        customersInput.addEventListener('input', calculateProfit);
        priceInput.addEventListener('input', calculateProfit);
        
        // Save idea button
        details.querySelector('.save-idea-btn').addEventListener('click', () => {
            this.saveIdea(idea);
        });
        
        // Close button
        details.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.classList.add('active');
    }
    
    async saveIdea(idea) {
        try {
            const response = await fetch(`${this.baseURL}/business-ideas/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(idea)
            });
            
            if (response.ok) {
                auth.showNotification('Idea saved successfully!', 'success');
                
                // Update bookmark icon
                const saveBtn = document.querySelector(`[data-idea='${JSON.stringify(idea)}'] .save-idea i`);
                if (saveBtn) {
                    saveBtn.classList.remove('far');
                    saveBtn.classList.add('fas');
                }
            } else {
                auth.showNotification('Failed to save idea', 'error');
            }
        } catch (error) {
            console.error('Error saving idea:', error);
            auth.showNotification('Network error', 'error');
        }
    }
}

// Initialize business generator
document.addEventListener('DOMContentLoaded', () => {
    window.businessGenerator = new BusinessGenerator();
});