// Skills Management JavaScript
class SkillsManager {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        this.skills = [];
        
        if (!this.token || !this.user) {
            window.location.href = '/';
            return;
        }
        
        this.init();
    }
    
    init() {
        this.updateUserInfo();
        this.setupEventListeners();
        this.loadSkills();
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
        
        // Add skill button
        document.getElementById('add-skill')?.addEventListener('click', () => {
            this.addSkill();
        });
        
        // Enter key in skill name
        document.getElementById('skill-name')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addSkill();
            }
        });
        
        // Edit skill form
        document.getElementById('edit-skill-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateSkill();
        });
        
        // Delete skill button
        document.getElementById('delete-skill')?.addEventListener('click', () => {
            this.deleteSkill();
        });
        
        // Close modal
        document.querySelectorAll('#edit-skill-modal .close').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('edit-skill-modal').classList.remove('active');
            });
        });
    }
    
    async loadSkills() {
        try {
            const response = await fetch(`${this.baseURL}/skills`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                this.skills = await response.json();
                this.displaySkills();
                this.displayCategories();
            } else {
                // Fallback to empty state
                this.displayEmptyState();
            }
        } catch (error) {
            console.error('Error loading skills:', error);
            this.displayEmptyState();
        }
    }
    
    displaySkills() {
        const grid = document.getElementById('skills-grid');
        
        if (this.skills.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-code"></i>
                    <h3>No skills added yet</h3>
                    <p>Add your first skill to get started!</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.skills.map(skill => `
            <div class="skill-card" data-skill-id="${skill.id}">
                <div class="skill-header">
                    <h3>${skill.name}</h3>
                    <span class="skill-level ${skill.level.toLowerCase()}">${skill.level}</span>
                </div>
                <div class="skill-category">
                    <i class="fas fa-tag"></i>
                    <span>${skill.category}</span>
                </div>
                <div class="skill-actions">
                    <button class="btn-icon edit-skill" title="Edit Skill">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-skill" title="Delete Skill">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        grid.querySelectorAll('.edit-skill').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.openEditModal(this.skills[index]);
            });
        });
        
        grid.querySelectorAll('.delete-skill').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.confirmDelete(this.skills[index]);
            });
        });
    }
    
    displayCategories() {
        const categories = {};
        this.skills.forEach(skill => {
            if (!categories[skill.category]) {
                categories[skill.category] = 0;
            }
            categories[skill.category]++;
        });
        
        const grid = document.getElementById('categories-grid');
        
        grid.innerHTML = Object.entries(categories).map(([category, count]) => `
            <div class="category-card">
                <h3>${category}</h3>
                <p class="count">${count} skill${count > 1 ? 's' : ''}</p>
                <div class="category-skills">
                    ${this.skills
                        .filter(s => s.category === category)
                        .map(s => `<span class="skill-badge">${s.name}</span>`)
                        .join('')}
                </div>
            </div>
        `).join('');
    }
    
    async addSkill() {
        const name = document.getElementById('skill-name').value.trim();
        const category = document.getElementById('skill-category').value;
        const level = document.querySelector('input[name="skill-level"]:checked')?.value;
        
        if (!name) {
            auth.showNotification('Please enter a skill name', 'error');
            return;
        }
        
        if (!level) {
            auth.showNotification('Please select a proficiency level', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${this.baseURL}/skills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ name, category, level })
            });
            
            if (response.ok) {
                const newSkill = await response.json();
                this.skills.push(newSkill);
                
                // Clear input
                document.getElementById('skill-name').value = '';
                
                // Refresh displays
                this.displaySkills();
                this.displayCategories();
                
                auth.showNotification('Skill added successfully!', 'success');
            } else {
                auth.showNotification('Failed to add skill', 'error');
            }
        } catch (error) {
            console.error('Error adding skill:', error);
            auth.showNotification('Network error', 'error');
        }
    }
    
    openEditModal(skill) {
        document.getElementById('edit-skill-id').value = skill.id;
        document.getElementById('edit-skill-name').value = skill.name;
        document.getElementById('edit-skill-category').value = skill.category;
        
        // Set level radio
        const levelRadios = document.querySelectorAll('input[name="edit-skill-level"]');
        levelRadios.forEach(radio => {
            if (radio.value === skill.level) {
                radio.checked = true;
            }
        });
        
        document.getElementById('edit-skill-modal').classList.add('active');
    }
    
    async updateSkill() {
        const id = document.getElementById('edit-skill-id').value;
        const name = document.getElementById('edit-skill-name').value.trim();
        const category = document.getElementById('edit-skill-category').value;
        const level = document.querySelector('input[name="edit-skill-level"]:checked')?.value;
        
        if (!name || !level) {
            auth.showNotification('Please fill all fields', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${this.baseURL}/skills/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ name, category, level })
            });
            
            if (response.ok) {
                const updatedSkill = await response.json();
                
                // Update in array
                const index = this.skills.findIndex(s => s.id === id);
                if (index !== -1) {
                    this.skills[index] = updatedSkill;
                }
                
                // Refresh displays
                this.displaySkills();
                this.displayCategories();
                
                // Close modal
                document.getElementById('edit-skill-modal').classList.remove('active');
                
                auth.showNotification('Skill updated successfully!', 'success');
            } else {
                auth.showNotification('Failed to update skill', 'error');
            }
        } catch (error) {
            console.error('Error updating skill:', error);
            auth.showNotification('Network error', 'error');
        }
    }
    
    confirmDelete(skill) {
        if (confirm(`Are you sure you want to delete "${skill.name}"?`)) {
            this.deleteSkill(skill.id);
        }
    }
    
    async deleteSkill(id) {
        try {
            const response = await fetch(`${this.baseURL}/skills/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                // Remove from array
                this.skills = this.skills.filter(s => s.id !== id);
                
                // Refresh displays
                this.displaySkills();
                this.displayCategories();
                
                // Close modal if open
                document.getElementById('edit-skill-modal').classList.remove('active');
                
                auth.showNotification('Skill deleted successfully!', 'success');
            } else {
                auth.showNotification('Failed to delete skill', 'error');
            }
        } catch (error) {
            console.error('Error deleting skill:', error);
            auth.showNotification('Network error', 'error');
        }
    }
    
    displayEmptyState() {
        const grid = document.getElementById('skills-grid');
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-code"></i>
                <h3>No skills added yet</h3>
                <p>Add your first skill using the form above!</p>
            </div>
        `;
        
        document.getElementById('categories-grid').innerHTML = '';
    }
}

// Initialize skills manager
document.addEventListener('DOMContentLoaded', () => {
    window.skillsManager = new SkillsManager();
});