// Career Restart JavaScript
class CareerRestart {
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
        
        // Analyze gap button
        document.getElementById('analyze-gap')?.addEventListener('click', () => {
            this.analyzeGap();
        });
        
        // Add experience entry
        document.getElementById('add-experience')?.addEventListener('click', () => {
            this.addExperienceEntry();
        });
        
        // Add education entry
        document.getElementById('add-education')?.addEventListener('click', () => {
            this.addEducationEntry();
        });
        
        // Generate resume
        document.getElementById('generate-resume')?.addEventListener('click', () => {
            this.generateResume();
        });
        
        // Skills chips
        document.querySelectorAll('#resume-skills .chip').forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('selected');
            });
        });
        
        // Accordion
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                item.classList.toggle('active');
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
                this.userSkills = skills.map(s => s.name);
            }
        } catch (error) {
            console.error('Error loading skills:', error);
        }
    }
    
    async analyzeGap() {
        const desiredRole = document.getElementById('desired-role').value;
        
        if (!desiredRole) {
            auth.showNotification('Please select a desired role', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${this.baseURL}/career/gap-analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    desiredRole,
                    skills: this.userSkills || []
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.displayAnalysisResults(data);
            } else {
                auth.showNotification('Failed to analyze gap', 'error');
            }
        } catch (error) {
            console.error('Error analyzing gap:', error);
            auth.showNotification('Network error', 'error');
        }
    }
    
    displayAnalysisResults(data) {
        const results = document.getElementById('analysis-results');
        results.style.display = 'block';
        
        // Update readiness score
        const scoreCircle = document.getElementById('readiness-score');
        scoreCircle.textContent = data.readiness_score + '%';
        
        // Your skills
        const yourSkills = document.getElementById('your-skills');
        yourSkills.innerHTML = data.current_skills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('') || '<span class="no-skills">No skills added yet</span>';
        
        // Required skills
        const requiredSkills = document.getElementById('required-skills');
        requiredSkills.innerHTML = data.required_skills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
        
        // Missing skills
        const missingSkills = document.getElementById('missing-skills');
        missingSkills.innerHTML = data.missing_skills.map(skill => 
            `<div class="missing-skill">
                <span>${skill}</span>
                <a href="#" class="btn-small">Learn Now</a>
            </div>`
        ).join('') || '<p>Great! You have all required skills!</p>';
        
        // Recommendations
        const recommendations = document.getElementById('recommendations');
        recommendations.innerHTML = data.recommended_skills.map(rec => 
            `<div class="recommendation-item">
                <h5>${rec.name}</h5>
                <p>Estimated time: ${rec.time_to_learn}</p>
                <a href="#" class="btn-small">Start Learning</a>
            </div>`
        ).join('');
        
        // Time to ready
        document.getElementById('time-to-ready').textContent = data.time_to_ready;
        
        // Scroll to results
        results.scrollIntoView({ behavior: 'smooth' });
    }
    
    addExperienceEntry() {
        const container = document.getElementById('experience-entries');
        const entry = document.createElement('div');
        entry.className = 'experience-entry';
        entry.innerHTML = `
            <input type="text" placeholder="Job Title">
            <input type="text" placeholder="Company">
            <input type="text" placeholder="Years">
            <button type="button" class="btn-icon remove-entry">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        entry.querySelector('.remove-entry').addEventListener('click', () => {
            entry.remove();
        });
        
        container.appendChild(entry);
    }
    
    addEducationEntry() {
        const container = document.getElementById('education-entries');
        const entry = document.createElement('div');
        entry.className = 'education-entry';
        entry.innerHTML = `
            <input type="text" placeholder="Degree">
            <input type="text" placeholder="Institution">
            <input type="text" placeholder="Year">
            <button type="button" class="btn-icon remove-entry">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        entry.querySelector('.remove-entry').addEventListener('click', () => {
            entry.remove();
        });
        
        container.appendChild(entry);
    }
    
    generateResume() {
        const name = document.getElementById('resume-name').value;
        const email = document.getElementById('resume-email').value;
        const phone = document.getElementById('resume-phone').value;
        const location = document.getElementById('resume-location').value;
        const summary = document.getElementById('resume-summary').value;
        
        // Get selected skills
        const selectedSkills = [];
        document.querySelectorAll('#resume-skills .chip.selected').forEach(chip => {
            selectedSkills.push(chip.dataset.skill);
        });
        
        // Get experience entries
        const experiences = [];
        document.querySelectorAll('#experience-entries .experience-entry').forEach(entry => {
            const inputs = entry.querySelectorAll('input');
            if (inputs[0].value) {
                experiences.push({
                    title: inputs[0].value,
                    company: inputs[1].value,
                    years: inputs[2].value
                });
            }
        });
        
        // Get education entries
        const education = [];
        document.querySelectorAll('#education-entries .education-entry').forEach(entry => {
            const inputs = entry.querySelectorAll('input');
            if (inputs[0].value) {
                education.push({
                    degree: inputs[0].value,
                    institution: inputs[1].value,
                    year: inputs[2].value
                });
            }
        });
        
        // Generate preview
        const preview = document.getElementById('resume-preview');
        preview.innerHTML = `
            <div class="resume-paper">
                <h2>${name || 'Your Name'}</h2>
                <div class="contact-info">
                    <span>${email || 'email@example.com'}</span> |
                    <span>${phone || 'phone number'}</span> |
                    <span>${location || 'location'}</span>
                </div>
                
                <div class="resume-section">
                    <h3>Professional Summary</h3>
                    <p>${summary || 'Your professional summary...'}</p>
                </div>
                
                <div class="resume-section">
                    <h3>Skills</h3>
                    <div class="skills-list">
                        ${selectedSkills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
                    </div>
                </div>
                
                <div class="resume-section">
                    <h3>Work Experience</h3>
                    ${experiences.map(exp => `
                        <div class="experience-item">
                            <h4>${exp.title}</h4>
                            <p>${exp.company} | ${exp.years}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="resume-section">
                    <h3>Education</h3>
                    ${education.map(edu => `
                        <div class="education-item">
                            <h4>${edu.degree}</h4>
                            <p>${edu.institution} | ${edu.year}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        auth.showNotification('Resume generated successfully!', 'success');
    }
}

// Initialize career restart
document.addEventListener('DOMContentLoaded', () => {
    window.careerRestart = new CareerRestart();
});