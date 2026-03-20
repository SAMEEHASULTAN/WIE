// career-fix.js
console.log("✅ career-fix.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    // Make sidebar navigation work
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
    
    // Make analyze button work
    const analyzeBtn = document.getElementById('analyze-gap');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            const role = document.getElementById('desired-role').value;
            if (!role) {
                alert('Please select a desired job role');
                return;
            }
            document.getElementById('analysis-results').style.display = 'block';
            
            // Populate with demo data
            document.getElementById('your-skills').innerHTML = '<span class="skill-tag">Communication</span><span class="skill-tag">Leadership</span>';
            document.getElementById('required-skills').innerHTML = '<span class="skill-tag">Python</span><span class="skill-tag">JavaScript</span><span class="skill-tag">SQL</span>';
            document.getElementById('missing-skills').innerHTML = `
                <div class="missing-skill">
                    <span>Python</span>
                    <a href="#" class="btn-small">Learn Now</a>
                </div>
                <div class="missing-skill">
                    <span>JavaScript</span>
                    <a href="#" class="btn-small">Learn Now</a>
                </div>
            `;
            document.getElementById('time-to-ready').textContent = '3 months';
            document.getElementById('readiness-score').textContent = '65%';
        });
    }
    
    // Make generate resume work
    const generateBtn = document.getElementById('generate-resume');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const name = document.getElementById('resume-name').value || 'Your Name';
            document.getElementById('resume-preview').innerHTML = `
                <div class="resume-paper">
                    <h2>${name}</h2>
                    <div class="contact-info">
                        <span>${document.getElementById('resume-email').value || 'email@example.com'}</span> |
                        <span>${document.getElementById('resume-phone').value || 'phone number'}</span> |
                        <span>${document.getElementById('resume-location').value || 'location'}</span>
                    </div>
                    <div class="resume-section">
                        <h3>Professional Summary</h3>
                        <p>${document.getElementById('resume-summary').value || 'Experienced professional seeking to restart career...'}</p>
                    </div>
                </div>
            `;
            alert('Resume generated! Check the preview section.');
        });
    }
    
    // Add experience button
    const addExpBtn = document.getElementById('add-experience');
    if (addExpBtn) {
        addExpBtn.addEventListener('click', function() {
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
            entry.querySelector('.remove-entry').addEventListener('click', () => entry.remove());
            container.appendChild(entry);
        });
    }
    
    // Add education button
    const addEduBtn = document.getElementById('add-education');
    if (addEduBtn) {
        addEduBtn.addEventListener('click', function() {
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
            entry.querySelector('.remove-entry').addEventListener('click', () => entry.remove());
            container.appendChild(entry);
        });
    }
    
    // Resume skills chips
    document.querySelectorAll('#resume-skills .chip').forEach(chip => {
        chip.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
    
    // Accordion functionality
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });
});

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}