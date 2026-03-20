// career-enhanced.js - Complete with Dynamic Analysis
console.log("✅ career-enhanced.js loaded");

let resumeData = null;
let resumeText = '';

document.addEventListener('DOMContentLoaded', () => {
    setupResumeUpload();
    setupCareerAnalysis();
    setupJobSearch();
    setupDynamicSkillAnalysis(); // New function for dynamic skill analysis
});

function setupResumeUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('resume-file');
    const browseBtn = document.getElementById('browse-resume');
    const uploadedInfo = document.getElementById('uploaded-info');
    const fileName = document.getElementById('file-name');
    const removeFile = document.getElementById('remove-file');
    const breakSection = document.getElementById('break-section');
    
    if (uploadArea) {
        uploadArea.onclick = () => fileInput?.click();
        uploadArea.ondragover = (e) => { e.preventDefault(); uploadArea.style.borderColor = 'var(--primary)'; };
        uploadArea.ondragleave = () => uploadArea.style.borderColor = '#e5e7eb';
        uploadArea.ondrop = (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#e5e7eb';
            handleFileUpload(e.dataTransfer.files[0]);
        };
    }
    
    browseBtn?.addEventListener('click', (e) => { e.stopPropagation(); fileInput?.click(); });
    
    fileInput?.addEventListener('change', (e) => {
        if (e.target.files[0]) handleFileUpload(e.target.files[0]);
    });
    
    removeFile?.addEventListener('click', () => {
        resumeData = null;
        resumeText = '';
        uploadedInfo.style.display = 'none';
        uploadArea.style.display = 'block';
        breakSection.style.display = 'none';
        document.getElementById('dynamic-results').style.display = 'none';
        fileInput.value = '';
    });
}

async function handleFileUpload(file) {
    const fileNameSpan = document.getElementById('file-name');
    const uploadArea = document.getElementById('upload-area');
    const uploadedInfo = document.getElementById('uploaded-info');
    
    fileNameSpan.textContent = file.name;
    uploadArea.style.display = 'none';
    uploadedInfo.style.display = 'flex';
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        resumeText = e.target.result;
        
        const statusDiv = document.getElementById('ai-status') || createAIStatusDiv();
        statusDiv.innerHTML = '<div class="ai-loading"><i class="fas fa-spinner fa-spin"></i> Analyzing your resume...</div>';
        
        const analysis = await window.aiService.analyzeResumeWithAI(resumeText);
        resumeData = analysis;
        
        displayResumeAnalysis(analysis);
        
        statusDiv.innerHTML = '<div class="ai-success"><i class="fas fa-check-circle"></i> Resume analysis complete!</div>';
        setTimeout(() => { statusDiv.innerHTML = ''; }, 3000);
        
        document.getElementById('break-section').style.display = 'block';
        document.getElementById('break-section').scrollIntoView({ behavior: 'smooth' });
    };
    reader.readAsText(file);
}

function displayResumeAnalysis(data) {
    const breakSection = document.getElementById('break-section');
    const existingSummary = document.querySelector('.resume-analysis-summary');
    if (existingSummary) existingSummary.remove();
    
    const summary = document.createElement('div');
    summary.className = 'resume-analysis-summary';
    summary.innerHTML = `
        <h3><i class="fas fa-robot"></i> Resume Analysis Results</h3>
        <div><strong>Name:</strong> ${data.name || 'Not specified'}</div>
        <div class="summary-stats">
            <div><strong>Experience</strong><p>${data.experience_years || '?'} years</p></div>
            <div><strong>Education</strong><p>${data.education || 'Not specified'}</p></div>
            <div><strong>Career Path</strong><p>${data.career_path || 'Professional'}</p></div>
        </div>
        
        <div><strong>🖥️ Technical Skills Found (${data.skills?.technical?.length || 0}):</strong></div>
        <div class="skills-detected technical-skills">
            ${(data.skills?.technical || []).map(s => `<span class="skill-badge tech">${s}</span>`).join('') || 'No technical skills detected'}
        </div>
        
        <div style="margin-top: 1rem;"><strong>🤝 Soft Skills Found (${data.skills?.soft?.length || 0}):</strong></div>
        <div class="skills-detected soft-skills">
            ${(data.skills?.soft || []).map(s => `<span class="skill-badge soft">${s}</span>`).join('') || 'No soft skills detected'}
        </div>
        
        <div style="margin-top: 1rem;"><strong>📋 Recommended Job Roles:</strong></div>
        <div class="recommended-roles">
            ${(data.recommended_roles || []).map(r => `<span class="role-badge">${r}</span>`).join('')}
        </div>
        
        <div style="margin-top: 1rem;"><strong>💪 Key Strengths:</strong> ${(data.strengths || []).join(', ') || 'Analysis in progress'}</div>
        <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
            <i class="fas fa-chart-line"></i> Experience Level: ${data.raw_analysis?.experience_level || 'Mid-Level'}
        </div>
    `;
    breakSection.insertBefore(summary, breakSection.firstChild);
    
    // Pre-fill target role with first recommended role
    const targetRoleInput = document.getElementById('target-role');
    if (targetRoleInput && data.recommended_roles?.[0]) {
        targetRoleInput.value = data.recommended_roles[0];
    }
    
    // Also pre-fill the dynamic skill analysis input
    const dynamicRoleInput = document.getElementById('dynamic-desired-role');
    if (dynamicRoleInput && data.recommended_roles?.[0]) {
        dynamicRoleInput.value = data.recommended_roles[0];
    }
}

// NEW: Dynamic Skill Gap Analysis Function
function setupDynamicSkillAnalysis() {
    // Replace the static dropdown with an input field
    const analysisCard = document.querySelector('.analysis-card');
    if (analysisCard) {
        const existingSelect = document.getElementById('desired-role');
        if (existingSelect) {
            // Replace select with input
            const inputHTML = `
                <div class="form-group">
                    <label>Desired Job Role (Enter any role)</label>
                    <input type="text" id="dynamic-desired-role" class="dynamic-role-input" placeholder="e.g., Full Stack Developer, Data Scientist, Product Manager" value="${resumeData?.recommended_roles?.[0] || ''}">
                    <small>Enter any job title you're targeting</small>
                </div>
            `;
            existingSelect.parentElement.innerHTML = inputHTML;
            
            // Update analyze button
            const analyzeBtn = document.getElementById('analyze-gap');
            if (analyzeBtn) {
                const newAnalyzeBtn = analyzeBtn.cloneNode(true);
                analyzeBtn.parentNode.replaceChild(newAnalyzeBtn, analyzeBtn);
                newAnalyzeBtn.addEventListener('click', performDynamicSkillAnalysis);
            }
        }
    }
}

async function performDynamicSkillAnalysis() {
    const targetRole = document.getElementById('dynamic-desired-role')?.value.trim();
    
    if (!targetRole) {
        alert('Please enter a desired job role');
        return;
    }
    
    // Get skills from resume
    const currentSkills = resumeData?.allSkills || ['Communication', 'Leadership', 'Problem Solving'];
    
    // Define required skills for common roles (extensible)
    const roleRequirements = {
        // Technical Roles
        "software developer": ["Python", "JavaScript", "React", "Node.js", "Git", "SQL", "REST APIs", "Problem Solving"],
        "full stack developer": ["Python", "JavaScript", "React", "Node.js", "HTML/CSS", "MongoDB", "Git", "REST APIs"],
        "frontend developer": ["JavaScript", "React", "HTML/CSS", "TypeScript", "Responsive Design", "Git"],
        "backend developer": ["Python", "Java", "Node.js", "SQL", "REST APIs", "Docker", "Git"],
        "data scientist": ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow", "Data Visualization", "Pandas"],
        "data analyst": ["SQL", "Python", "Excel", "Tableau", "Statistics", "Data Visualization", "Pandas"],
        "database administrator": ["SQL", "Oracle", "MySQL", "PostgreSQL", "Database Design", "Backup Recovery", "Performance Tuning"],
        
        // Management Roles
        "project manager": ["Agile", "Scrum", "JIRA", "Leadership", "Risk Management", "Communication", "Stakeholder Management"],
        "product manager": ["Product Strategy", "User Research", "Agile", "Data Analysis", "Communication", "Market Research"],
        "scrum master": ["Agile", "Scrum", "Facilitation", "Conflict Resolution", "JIRA", "Team Coaching"],
        
        // Marketing Roles
        "digital marketing manager": ["SEO", "Google Analytics", "Social Media", "Content Strategy", "Email Marketing", "PPC"],
        "social media manager": ["Social Media", "Content Creation", "Analytics", "Community Management", "Canva", "Copywriting"],
        "content writer": ["Writing", "SEO", "Research", "Editing", "Content Strategy", "Grammar", "Creativity"],
        
        // Design Roles
        "ui/ux designer": ["Figma", "User Research", "Prototyping", "Wireframing", "Usability Testing", "Adobe XD"],
        "graphic designer": ["Adobe Photoshop", "Illustrator", "Canva", "Typography", "Branding", "Creativity"],
        
        // Business Roles
        "business analyst": ["SQL", "Data Analysis", "Excel", "Requirements Gathering", "Stakeholder Management", "Communication"],
        "operations manager": ["Process Optimization", "Team Management", "Data Analysis", "Project Management", "Communication"]
    };
    
    // Find matching role requirements (case insensitive)
    let requiredSkills = [];
    let matchedRole = null;
    
    for (let [role, skills] of Object.entries(roleRequirements)) {
        if (targetRole.toLowerCase().includes(role) || role.includes(targetRole.toLowerCase())) {
            requiredSkills = skills;
            matchedRole = role;
            break;
        }
    }
    
    // If no exact match, generate dynamic requirements based on role name
    if (requiredSkills.length === 0) {
        requiredSkills = generateDynamicRequirements(targetRole);
    }
    
    // Calculate missing skills
    const missingSkills = requiredSkills.filter(skill => 
        !currentSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
    );
    
    const matchedSkills = requiredSkills.filter(skill => 
        currentSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
    );
    
    // Calculate readiness score
    const readinessScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);
    
    // Display results
    const results = document.getElementById('analysis-results');
    results.style.display = 'block';
    
    document.getElementById('your-skills').innerHTML = currentSkills.map(s => `<span class="skill-tag">${s}</span>`).join('');
    document.getElementById('required-skills').innerHTML = requiredSkills.map(s => `<span class="skill-tag required">${s}</span>`).join('');
    
    document.getElementById('missing-skills').innerHTML = missingSkills.map(s => `
        <div class="missing-skill">
            <span>${s}</span>
            <button class="btn-small" onclick="alert('Start learning ${s}')">Learn Now</button>
        </div>
    `).join('') || '<p>🎉 Great! You have all the required skills!</p>';
    
    document.getElementById('time-to-ready').textContent = `${Math.ceil(missingSkills.length * 1.5)} months`;
    document.getElementById('readiness-score').textContent = `${readinessScore}%`;
    
    // Update score circle color
    const scoreCircle = document.getElementById('readiness-score');
    if (scoreCircle) {
        if (readinessScore >= 70) scoreCircle.style.background = 'linear-gradient(135deg, #10B981, #34D399)';
        else if (readinessScore >= 40) scoreCircle.style.background = 'linear-gradient(135deg, #F59E0B, #FBBF24)';
        else scoreCircle.style.background = 'linear-gradient(135deg, #EF4444, #F87171)';
    }
    
    // Also update recommendations section
    const recommendationsDiv = document.querySelector('.recommendations') || createRecommendationsDiv();
    if (recommendationsDiv) {
        recommendationsDiv.innerHTML = `
            <h4>🎯 Personalized Recommendations</h4>
            <div class="recommendation-list">
                ${missingSkills.slice(0, 5).map(skill => `
                    <div class="recommendation-item">
                        <h5>${skill}</h5>
                        <p>Recommended learning path: ${getLearningPath(skill)}</p>
                        <button class="btn-small" onclick="alert('Start learning ${skill}')">Start Learning</button>
                    </div>
                `).join('')}
                ${missingSkills.length === 0 ? '<p>You\'re ready for this role! Consider applying for positions.</p>' : ''}
            </div>
        `;
    }
    
    // Scroll to results
    results.scrollIntoView({ behavior: 'smooth' });
}

function generateDynamicRequirements(role) {
    // Generate skills based on role keywords
    const keywords = role.toLowerCase().split(' ');
    const baseSkills = [];
    
    // Technical keywords
    if (keywords.some(k => ['developer', 'engineer', 'programmer', 'coding'].includes(k))) {
        baseSkills.push('Python', 'JavaScript', 'Git', 'Problem Solving', 'REST APIs');
        if (keywords.includes('frontend')) baseSkills.push('React', 'HTML/CSS');
        if (keywords.includes('backend')) baseSkills.push('Node.js', 'SQL', 'Database Design');
        if (keywords.includes('full')) baseSkills.push('React', 'Node.js', 'MongoDB');
        if (keywords.includes('data')) baseSkills.push('SQL', 'Python', 'Data Analysis');
    }
    
    // Management keywords
    if (keywords.some(k => ['manager', 'lead', 'director', 'head'].includes(k))) {
        baseSkills.push('Leadership', 'Communication', 'Project Management', 'Strategic Planning');
        if (keywords.includes('product')) baseSkills.push('Product Strategy', 'User Research');
        if (keywords.includes('project')) baseSkills.push('Agile', 'Scrum', 'Risk Management');
    }
    
    // Marketing keywords
    if (keywords.some(k => ['marketing', 'social media', 'seo', 'content'].includes(k))) {
        baseSkills.push('Digital Marketing', 'SEO', 'Social Media Strategy', 'Content Creation', 'Analytics');
        if (keywords.includes('social')) baseSkills.push('Instagram', 'Facebook Ads', 'Community Management');
        if (keywords.includes('content')) baseSkills.push('Writing', 'Editing', 'Content Strategy');
    }
    
    // Design keywords
    if (keywords.some(k => ['design', 'ui', 'ux', 'graphic'].includes(k))) {
        baseSkills.push('Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping');
        if (keywords.includes('ui') || keywords.includes('ux')) baseSkills.push('Wireframing', 'Usability Testing');
        if (keywords.includes('graphic')) baseSkills.push('Photoshop', 'Illustrator', 'Typography');
    }
    
    // Add soft skills if none were added
    if (baseSkills.length === 0) {
        baseSkills.push('Communication', 'Teamwork', 'Problem Solving', 'Adaptability', 'Time Management');
    }
    
    return [...new Set(baseSkills)];
}

function getLearningPath(skill) {
    const paths = {
        "Python": "Start with Python basics, then move to data structures, then practice with projects",
        "JavaScript": "Learn ES6, DOM manipulation, then frameworks like React",
        "React": "Master JavaScript first, then learn React hooks, state management",
        "SQL": "Start with basic queries, then joins, subqueries, and optimization",
        "AWS": "Begin with cloud fundamentals, then specific services like EC2, S3",
        "Leadership": "Read management books, take online courses, seek mentorship",
        "Communication": "Practice presentations, join Toastmasters, take communication courses",
        "SEO": "Learn keyword research, on-page optimization, link building strategies",
        "Figma": "Start with basics, then learn components, prototyping, and design systems"
    };
    return paths[skill] || "Start with online courses, then practice with real projects";
}

function createRecommendationsDiv() {
    const results = document.getElementById('analysis-results');
    if (!results) return null;
    
    let recDiv = document.querySelector('.recommendations');
    if (!recDiv) {
        recDiv = document.createElement('div');
        recDiv.className = 'recommendations';
        results.appendChild(recDiv);
    }
    return recDiv;
}

function setupCareerAnalysis() {
    // Career break analysis
    document.getElementById('analyze-break')?.addEventListener('click', async () => {
        const breakYear = document.getElementById('break-year').value;
        const breakMonths = document.getElementById('break-months').value;
        const targetRole = document.getElementById('target-role').value;
        const targetLocation = document.getElementById('target-location').value;
        const timeAvail = parseInt(document.getElementById('available-time').value);
        
        if (!breakYear || !breakMonths || !targetRole) {
            alert('Please fill all required fields');
            return;
        }
        
        const currentSkills = resumeData?.allSkills || ['Communication', 'Leadership', 'Problem Solving'];
        
        const statusDiv = document.getElementById('ai-status') || createAIStatusDiv();
        statusDiv.innerHTML = '<div class="ai-loading"><i class="fas fa-spinner fa-spin"></i> AI analyzing career gap...</div>';
        
        const gap = await window.aiService.analyzeCareerGap(currentSkills, targetRole, parseInt(breakYear), timeAvail);
        
        statusDiv.innerHTML = '<div class="ai-success"><i class="fas fa-check-circle"></i> Career analysis complete!</div>';
        setTimeout(() => { statusDiv.innerHTML = ''; }, 3000);
        
        displayFullResults(gap, breakYear, breakMonths, targetRole, targetLocation, timeAvail);
    });
}

function displayFullResults(gap, breakYear, breakMonths, targetRole, targetLocation, timeAvail) {
    const dynamicResults = document.getElementById('dynamic-results');
    dynamicResults.style.display = 'block';
    
    // Evolution Timeline
    document.getElementById('evolution-timeline').innerHTML = `
        <div class="timeline-item highlight"><div class="timeline-year">${breakYear}</div><div class="timeline-content"><strong>Career Break Started</strong><p>${breakMonths} months</p></div></div>
        <div class="timeline-item"><div class="timeline-year">Now</div><div class="timeline-content"><strong>Skills that emerged during your break:</strong><p>${gap.emerged_skills?.join(' • ') || 'Cloud Computing, AI/ML, Data Analytics'}</p></div></div>
    `;
    
    // Missing Skills
    document.getElementById('missing-skills-grid').innerHTML = (gap.skills_to_learn || ['Python', 'AWS', 'Machine Learning']).map(s => `
        <div class="skill-card"><h3>${s}</h3><div class="skill-meta"><span class="trending">${gap.priority_skills?.includes(s) ? '🔥 Priority' : '📚 Recommended'}</span></div><button class="btn-small" onclick="alert('Start learning ${s}')">Start Learning</button></div>
    `).join('');
    
    // Emerging Trends
    document.getElementById('trends-container').innerHTML = (gap.trends || ['AI-Powered Solutions', 'Cloud Migration', 'Data-Driven Decisions']).map(t => `
        <div class="trend-card"><i class="fas fa-chart-line"></i><h4>${t}</h4><p>Emerging trend in ${targetRole}</p></div>
    `).join('');
    
    // FULL ROADMAP - Show ALL months up to timeAvail
    const roadmapItems = gap.roadmap || [];
    let roadmapHtml = '';
    
    for (let i = 1; i <= timeAvail; i++) {
        const monthData = roadmapItems.find(item => item.month === i);
        if (monthData) {
            roadmapHtml += `
                <div class="roadmap-item">
                    <div class="roadmap-month">Month ${monthData.month}</div>
                    <div class="roadmap-content">
                        <h4>${monthData.skills?.join(' + ') || 'Skill Development'}</h4>
                        <p><i class="far fa-clock"></i> ${monthData.duration || '4 weeks'}</p>
                        <details><summary>📚 Resources</summary><ul>${(monthData.resources || []).map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul></details>
                        <details><summary>💻 Practice Tasks</summary><ul>${(monthData.practice_tasks || []).map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul></details>
                    </div>
                </div>
            `;
        } else {
            // Generate placeholder for missing months
            const placeholderSkills = gap.skills_to_learn?.slice((i-1)*2, i*2) || [`Skill ${i}`];
            roadmapHtml += `
                <div class="roadmap-item">
                    <div class="roadmap-month">Month ${i}</div>
                    <div class="roadmap-content">
                        <h4>${placeholderSkills.join(' + ')}</h4>
                        <p><i class="far fa-clock"></i> 4 weeks</p>
                        <details><summary>📚 Resources</summary><ul><li>Continue learning from recommended courses</li></ul></details>
                        <details><summary>💻 Practice Tasks</summary><ul><li>Build projects and practice regularly</li></ul></details>
                    </div>
                </div>
            `;
        }
    }
    
    document.getElementById('roadmap-timeline').innerHTML = roadmapHtml;
    
    // Summary
    const summary = document.createElement('div');
    summary.className = 'career-summary';
    summary.innerHTML = `
        <h3>🤖 AI Career Roadmap (${timeAvail} Month Complete Plan)</h3>
        <div class="summary-grid">
            <div><label>Target Role</label><span>${targetRole}</span></div>
            <div><label>Location</label><span>${targetLocation || 'Flexible'}</span></div>
            <div><label>Total Duration</label><span>${gap.estimated_time || timeAvail + ' months'}</span></div>
            <div><label>Skills to Learn</label><span>${gap.skills_to_learn?.length || 0}</span></div>
        </div>
        ${gap.certifications ? `<div class="certifications-suggested"><h4>📜 Recommended Certifications</h4><ul>${gap.certifications.map(c => `<li><i class="fas fa-certificate"></i> ${c}</li>`).join('')}</ul></div>` : ''}
        <div class="ai-powered-note"><i class="fas fa-robot"></i> Powered by AI - Personalized ${timeAvail} Month Learning Plan</div>
    `;
    
    const existingSummary = dynamicResults.querySelector('.career-summary');
    if (existingSummary) existingSummary.remove();
    dynamicResults.insertBefore(summary, dynamicResults.firstChild);
    dynamicResults.scrollIntoView({ behavior: 'smooth' });
}

function setupJobSearch() {
    const careerSection = document.querySelector('.analysis-section');
    if (careerSection && !document.getElementById('job-search-section')) {
        const jobSearchHTML = `
            <div id="job-search-section" class="job-search-section">
                <div class="job-search-header">
                    <h3><i class="fas fa-briefcase"></i> Real Job Search (Powered by JSearch)</h3>
                    <div class="job-search-input">
                        <input type="text" id="job-search-query" placeholder="Enter job title (e.g., Software Developer)">
                        <input type="text" id="job-search-location" placeholder="Location (e.g., Chennai, India)">
                        <button class="btn-primary" id="search-jobs-btn">Search Jobs</button>
                    </div>
                </div>
                <div id="job-results" class="job-results"></div>
            </div>
        `;
        careerSection.insertAdjacentHTML('afterend', jobSearchHTML);
        
        document.getElementById('search-jobs-btn')?.addEventListener('click', searchJobs);
        document.getElementById('job-search-query')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchJobs();
        });
        
        if (resumeData?.recommended_roles?.[0]) {
            document.getElementById('job-search-query').value = resumeData.recommended_roles[0];
        }
    }
}

async function searchJobs() {
    const query = document.getElementById('job-search-query').value.trim();
    const location = document.getElementById('job-search-location').value.trim() || 'India';
    
    if (!query) {
        alert('Please enter a job title to search');
        return;
    }
    
    const resultsDiv = document.getElementById('job-results');
    resultsDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching for jobs...</div>';
    
    try {
        const jobs = await window.aiService.searchJobs(query, location);
        
        if (jobs.length === 0) {
            resultsDiv.innerHTML = '<p>No jobs found. Try a different search term or location.</p>';
        } else {
            resultsDiv.innerHTML = jobs.map(job => `
                <div class="job-card">
                    <div class="job-title">${escapeHtml(job.title)}</div>
                    <div class="job-company">${escapeHtml(job.company)}</div>
                    <div>
                        <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(job.location)}</span>
                        <span class="job-salary"><i class="fas fa-rupee-sign"></i> ${escapeHtml(job.salary)}</span>
                    </div>
                    <div class="job-description">${escapeHtml(job.description)}</div>
                    <a href="${job.apply_link}" target="_blank" class="job-apply-btn">Apply Now</a>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Job search error:', error);
        resultsDiv.innerHTML = '<p>Error searching jobs. Please try again later.</p>';
    }
}

function createAIStatusDiv() {
    let div = document.getElementById('ai-status');
    if (!div) {
        div = document.createElement('div');
        div.id = 'ai-status';
        div.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 9999;';
        document.body.appendChild(div);
    }
    return div;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}