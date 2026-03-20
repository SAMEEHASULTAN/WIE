console.log("✅ business.js loaded - Enhanced with custom skills and location");

class BusinessGenerator {
    constructor() {
        this.selectedSkills = new Set();
        this.customSkills = new Set();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadUserSkills();
    }
    
    setupEventListeners() {
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
        
        // Add custom skill
        document.getElementById('add-custom-skill-btn')?.addEventListener('click', () => {
            const customSkillInput = document.getElementById('custom-skill-input');
            const skill = customSkillInput?.value.trim();
            if (skill && !this.customSkills.has(skill) && !this.selectedSkills.has(skill)) {
                this.customSkills.add(skill);
                this.addCustomSkillChip(skill);
                customSkillInput.value = '';
            }
        });
        
        // Custom skill input enter key
        document.getElementById('custom-skill-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('add-custom-skill-btn').click();
            }
        });
        
        // Generate ideas
        document.getElementById('generate-ideas')?.addEventListener('click', () => this.generateIdeas());
        document.getElementById('regenerate-ideas')?.addEventListener('click', () => this.generateIdeas());
        
        // Modal close
        document.querySelector('#business-modal .close')?.addEventListener('click', () => {
            document.getElementById('business-modal')?.classList.remove('active');
        });
        
        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }
    
    addCustomSkillChip(skill) {
        const container = document.getElementById('custom-skills-container');
        const chip = document.createElement('div');
        chip.className = 'chip selected';
        chip.dataset.skill = skill;
        chip.textContent = skill;
        chip.addEventListener('click', () => {
            this.customSkills.delete(skill);
            chip.remove();
        });
        container.appendChild(chip);
        this.selectedSkills.add(skill);
    }
    
    async loadUserSkills() {
        try {
            const response = await fetch(`http://localhost:5000/api/skills`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                const skills = await response.json();
                skills.forEach(skill => this.selectedSkills.add(skill.name));
                document.querySelectorAll('#business-skills .chip').forEach(chip => {
                    if (this.selectedSkills.has(chip.dataset.skill)) {
                        chip.classList.add('selected');
                    }
                });
            }
        } catch (error) {
            console.log('Using default skills');
        }
    }
    
    async generateIdeas() {
        const allSkills = [...this.selectedSkills];
        const budget = document.getElementById('budget')?.value || 'Medium';
        const timeAvailability = document.getElementById('time-availability')?.value || 'Full-time';
        const location = document.getElementById('location-input')?.value || 'Urban';
        
        if (allSkills.length === 0) {
            alert('Please select or add at least one skill');
            return;
        }
        
        const grid = document.getElementById('business-ideas-grid');
        grid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> 🤖 AI is generating personalized business ideas for you...</div>';
        document.getElementById('results-section').style.display = 'block';
        
        const ideas = await window.aiService.generateBusinessIdeas(allSkills, budget, timeAvailability, location, []);
        this.displayIdeas(ideas);
    }
    
    displayIdeas(ideas) {
        const grid = document.getElementById('business-ideas-grid');
        if (!grid) return;
        
        grid.innerHTML = ideas.map(idea => `
            <div class="business-card" onclick="window.businessGenerator.showDetails(${JSON.stringify(idea).replace(/</g, '\\u003c')})">
                ${idea.best_match_score > 70 ? '<div class="best-match-badge">🏆 Best Match</div>' : ''}
                <h3>${this.escapeHtml(idea.title)}</h3>
                <p>${this.escapeHtml(idea.description)}</p>
                <div class="business-meta">
                    <div><span>Startup Cost</span><strong>${idea.startup_cost}</strong></div>
                    <div><span>Expected Profit</span><strong>${idea.expected_profit}</strong></div>
                    <div><span>Time to Start</span><strong>${idea.time_to_start}</strong></div>
                </div>
                <div class="match-score">Match Score: ${idea.best_match_score}%</div>
                <div class="business-actions">
                    <button class="btn-secondary" onclick="event.stopPropagation(); window.businessGenerator.showDetails(${JSON.stringify(idea).replace(/</g, '\\u003c')})">View Details</button>
                    <button class="btn-icon" onclick="event.stopPropagation(); window.businessGenerator.saveIdea(${JSON.stringify(idea).replace(/</g, '\\u003c')})"><i class="far fa-bookmark"></i></button>
                </div>
            </div>
        `).join('');
    }
    
    showDetails(idea) {
        const modal = document.getElementById('business-modal');
        const details = document.getElementById('business-details');
        
        details.innerHTML = `
            <div class="business-detail">
                <h2>${this.escapeHtml(idea.title)}</h2>
                <p>${this.escapeHtml(idea.description)}</p>
                <div class="detail-section"><h3>Quick Overview</h3><div class="overview-grid"><div><strong>Startup Cost</strong><span>${idea.startup_cost}</span></div><div><strong>Profit</strong><span>${idea.expected_profit}</span></div><div><strong>Time to Start</strong><span>${idea.time_to_start}</span></div><div><strong>Target Customers</strong><span>${idea.target_customers}</span></div></div></div>
                <div class="detail-section"><h3>Execution Plan</h3><ol>${idea.execution_plan.map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}</ol></div>
                <div class="detail-section"><h3>Tools & Resources</h3><ul>${idea.required_tools.map(t => `<li>${this.escapeHtml(t)}</li>`).join('')}</ul></div>
                <div class="detail-section"><h3>Marketing Strategy</h3><ul>${idea.marketing_strategy.map(m => `<li>${this.escapeHtml(m)}</li>`).join('')}</ul></div>
                <div class="detail-actions"><button class="btn-primary" onclick="window.businessGenerator.saveIdea(${JSON.stringify(idea).replace(/</g, '\\u003c')})">Save Idea</button><button class="btn-secondary close-modal">Close</button></div>
            </div>
        `;
        
        details.querySelector('.close-modal')?.addEventListener('click', () => modal.classList.remove('active'));
        modal.classList.add('active');
    }
    
    saveIdea(idea) {
        let saved = JSON.parse(localStorage.getItem('savedBusinessIdeas') || '[]');
        if (!saved.some(i => i.title === idea.title)) {
            saved.push({ ...idea, savedAt: new Date().toISOString() });
            localStorage.setItem('savedBusinessIdeas', JSON.stringify(saved));
            alert('✅ Business idea saved!');
        } else {
            alert('This idea is already saved!');
        }
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.businessGenerator = new BusinessGenerator();