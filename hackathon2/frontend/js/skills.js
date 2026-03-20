// skills-fix.js
console.log("✅ skills-fix.js loaded");

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
    
    // Add skill button
    const addSkillBtn = document.getElementById('add-skill');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function() {
            const name = document.getElementById('skill-name').value.trim();
            const category = document.getElementById('skill-category').value;
            const level = document.querySelector('input[name="skill-level"]:checked')?.value;
            
            if (!name) {
                alert('Please enter a skill name');
                return;
            }
            
            if (!level) {
                alert('Please select a proficiency level');
                return;
            }
            
            // Add skill card
            const grid = document.getElementById('skills-grid');
            const emptyState = grid.querySelector('.empty-state');
            if (emptyState) {
                grid.innerHTML = '';
            }
            
            const card = document.createElement('div');
            card.className = 'skill-card';
            card.innerHTML = `
                <div class="skill-header">
                    <h3>${name}</h3>
                    <span class="skill-level ${level.toLowerCase()}">${level}</span>
                </div>
                <div class="skill-category">
                    <i class="fas fa-tag"></i>
                    <span>${category}</span>
                </div>
                <div class="skill-actions">
                    <button class="btn-icon edit-skill" title="Edit Skill">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-skill" title="Delete Skill">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            grid.appendChild(card);
            
            // Update categories
            updateCategories();
            
            // Clear input
            document.getElementById('skill-name').value = '';
            document.querySelector('input[name="skill-level"][value="Beginner"]').checked = true;
            
            alert('Skill added successfully!');
        });
    }
    
    // Handle delete and edit skills
    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-skill')) {
            if (confirm('Are you sure you want to delete this skill?')) {
                e.target.closest('.skill-card').remove();
                updateCategories();
                
                // Show empty state if no skills left
                const grid = document.getElementById('skills-grid');
                if (grid.children.length === 0) {
                    grid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-code"></i>
                            <h3>No skills added yet</h3>
                            <p>Add your first skill using the form above!</p>
                        </div>
                    `;
                }
            }
        }
        
        if (e.target.closest('.edit-skill')) {
            const card = e.target.closest('.skill-card');
            const name = card.querySelector('h3').textContent;
            alert(`Edit skill: ${name}\n\nIn the full version, you could edit this skill's details.`);
        }
    });
    
    // Enter key in skill name
    const skillInput = document.getElementById('skill-name');
    if (skillInput) {
        skillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('add-skill').click();
            }
        });
    }
});

function updateCategories() {
    const categories = {};
    document.querySelectorAll('.skill-card').forEach(card => {
        const category = card.querySelector('.skill-category span').textContent;
        categories[category] = (categories[category] || 0) + 1;
    });
    
    const grid = document.getElementById('categories-grid');
    if (Object.keys(categories).length === 0) {
        grid.innerHTML = '';
        return;
    }
    
    grid.innerHTML = Object.entries(categories).map(([category, count]) => `
        <div class="category-card">
            <h3>${category}</h3>
            <p class="count">${count} skill${count > 1 ? 's' : ''}</p>
            <div class="category-skills">
                ${Array.from(document.querySelectorAll('.skill-card')).filter(card => 
                    card.querySelector('.skill-category span').textContent === category
                ).map(card => 
                    `<span class="skill-badge">${card.querySelector('h3').textContent}</span>`
                ).join('')}
            </div>
        </div>
    `).join('');
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}