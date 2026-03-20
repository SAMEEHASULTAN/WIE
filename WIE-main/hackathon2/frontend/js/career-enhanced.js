// career-enhanced.js - Complete Career Analysis with Resume Parsing, Skill Classification, Match Analysis, and Roadmap Generation

console.log("✅ career-enhanced.js loaded");

let resumeData = null;
let resumeText = '';
let userProfile = null;
let currentMatchAnalysis = null;
let selectedMonths = 6;

// Skill classification database
const skillCategories = {
    technical: ['python', 'java', 'javascript', 'sql', 'aws', 'docker', 'kubernetes', 'react', 'angular', 'node.js', 'django', 'flask', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'typescript', 'html', 'css', 'mongodb', 'postgresql', 'mysql', 'oracle', 'git', 'linux', 'devops', 'machine learning', 'ai', 'data science', 'tableau', 'power bi', 'excel', 'spark', 'hadoop'],
    soft: ['communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking', 'time management', 'adaptability', 'creativity', 'emotional intelligence', 'conflict resolution', 'negotiation', 'presentation', 'public speaking', 'writing', 'collaboration', 'organization', 'analytical', 'decision making', 'interpersonal'],
    creative: ['design', 'graphic design', 'ui/ux', 'photography', 'video editing', 'illustration', 'animation', 'content creation', 'writing', 'copywriting', 'storytelling', 'art', 'crafting'],
    business: ['marketing', 'sales', 'project management', 'agile', 'scrum', 'product management', 'business development', 'strategy', 'analytics', 'finance', 'accounting', 'hr', 'recruitment', 'operations', 'supply chain']
};

// Role requirements database
const roleRequirements = {
    "software developer": {
        required: ["Python", "JavaScript", "Git", "Problem Solving", "SQL"],
        preferred: ["React", "Node.js", "AWS", "Docker"],
        salary_range: "8-15 LPA",
        level: "mid"
    },
    "senior software engineer": {
        required: ["Python", "JavaScript", "System Design", "Leadership", "AWS"],
        preferred: ["React", "Node.js", "Docker", "Kubernetes", "Mentoring"],
        salary_range: "18-30 LPA",
        level: "senior"
    },
    "full stack developer": {
        required: ["JavaScript", "React", "Node.js", "SQL", "Git"],
        preferred: ["Python", "MongoDB", "AWS", "TypeScript"],
        salary_range: "10-20 LPA",
        level: "mid"
    },
    "data scientist": {
        required: ["Python", "Machine Learning", "SQL", "Statistics", "Data Visualization"],
        preferred: ["TensorFlow", "PyTorch", "Big Data", "AWS"],
        salary_range: "12-25 LPA",
        level: "senior"
    },
    "data analyst": {
        required: ["SQL", "Excel", "Data Visualization", "Python", "Statistics"],
        preferred: ["Tableau", "Power BI", "R", "Machine Learning"],
        salary_range: "6-12 LPA",
        level: "entry"
    },
    "project manager": {
        required: ["Project Management", "Agile", "Communication", "Leadership", "Risk Management"],
        preferred: ["PMP", "Scrum", "JIRA", "Budget Management"],
        salary_range: "12-22 LPA",
        level: "mid"
    },
    "digital marketing manager": {
        required: ["SEO", "Google Analytics", "Social Media", "Content Strategy", "Email Marketing"],
        preferred: ["PPC", "Facebook Ads", "Marketing Automation", "CRM"],
        salary_range: "8-15 LPA",
        level: "mid"
    },
    "product manager": {
        required: ["Product Strategy", "User Research", "Agile", "Data Analysis", "Communication"],
        preferred: ["Roadmapping", "A/B Testing", "Market Analysis", "Leadership"],
        salary_range: "15-25 LPA",
        level: "senior"
    },
    "database administrator": {
        required: ["SQL", "Database Design", "Backup Recovery", "Performance Tuning", "Oracle/MySQL"],
        preferred: ["Cloud Databases", "MongoDB", "PostgreSQL", "Automation"],
        salary_range: "8-16 LPA",
        level: "mid"
    },
    "ui/ux designer": {
        required: ["Figma", "User Research", "Prototyping", "Wireframing", "Design Systems"],
        preferred: ["Adobe XD", "HTML/CSS", "Usability Testing", "Animation"],
        salary_range: "6-14 LPA",
        level: "mid"
    }
};

// Mentors database
const mentorsList = [
    {
        name: "NIIT",
        type: "institute",
        mode: "offline",
        location: "Multiple Cities",
        courses: ["Full Stack Development", "Data Science", "Cloud Computing"],
        contact: "1800-3000-6448",
        website: "www.niit.com",
        rating: 4.5
    },
    {
        name: "Aptech",
        type: "institute",
        mode: "offline",
        location: "Multiple Cities",
        courses: ["Software Engineering", "Digital Marketing", "Animation"],
        contact: "1800-102-0000",
        website: "www.aptech.ac.in",
        rating: 4.3
    },
    {
        name: "CSC Academy",
        type: "institute",
        mode: "both",
        location: "Pan India",
        courses: ["IT Training", "Digital Literacy", "Skill Development"],
        contact: "1800-123-4567",
        website: "www.cscacademy.org",
        rating: 4.4
    },
    {
        name: "UpGrad",
        type: "institute",
        mode: "online",
        location: "Online",
        courses: ["Data Science", "Machine Learning", "MBA", "Software Development"],
        contact: "1800-210-2020",
        website: "www.upgrad.com",
        rating: 4.6
    },
    {
        name: "Great Learning",
        type: "institute",
        mode: "online",
        location: "Online",
        courses: ["Data Science", "AI", "Cloud Computing", "Digital Marketing"],
        contact: "1800-120-3440",
        website: "www.greatlearning.in",
        rating: 4.5
    },
    {
        name: "Simplilearn",
        type: "institute",
        mode: "online",
        location: "Online",
        courses: ["PMP", "DevOps", "Data Science", "Cybersecurity"],
        contact: "1800-212-7688",
        website: "www.simplilearn.com",
        rating: 4.4
    },
    {
        name: "IIM Skills",
        type: "institute",
        mode: "online",
        location: "Online",
        courses: ["Digital Marketing", "Content Writing", "Data Analytics"],
        contact: "1800-123-4567",
        website: "www.iimskills.com",
        rating: 4.3
    },
    {
        name: "Code Academy",
        type: "institute",
        mode: "online",
        location: "Online",
        courses: ["Web Development", "Python", "JavaScript", "React"],
        contact: "online@codeacademy.com",
        website: "www.codeacademy.com",
        rating: 4.7
    },
    {
        name: "Coursera",
        type: "institute",
        mode: "online",
        location: "Online",
        courses: ["Professional Certificates", "Specializations", "Degree Programs"],
        contact: "support@coursera.org",
        website: "www.coursera.org",
        rating: 4.8
    },
    {
        name: "edX",
        type: "institute",
        mode: "online",
        location: "Online",
        courses: ["MicroMasters", "Professional Certificates", "University Programs"],
        contact: "info@edx.org",
        website: "www.edx.org",
        rating: 4.7
    },
    {
        name: "Tata STRIVE",
        type: "institute",
        mode: "both",
        location: "Multiple Cities",
        courses: ["Skill Development", "Employment Training", "Entrepreneurship"],
        contact: "1800-209-9111",
        website: "www.tatastrive.com",
        rating: 4.6
    },
    {
        name: "Microsoft Learn",
        type: "institute",
        mode: "online",
        location: "Online",
        courses: ["Azure", "AI", "Data Science", "Developer Tools"],
        contact: "learn@microsoft.com",
        website: "learn.microsoft.com",
        rating: 4.8
    }
];

document.addEventListener('DOMContentLoaded', () => {
    setupResumeUpload();
    setupCareerAnalysis();
    setupMentorsFilter();
    loadUserProfile();
});

function setupResumeUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('resume-file');
    const browseBtn = document.getElementById('browse-resume');
    const uploadedInfo = document.getElementById('uploaded-info');
    const fileName = document.getElementById('file-name');
    const removeFile = document.getElementById('remove-file');
    
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
        resetUpload();
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
        
        showStatus('Analyzing your resume with AI...', 'info');
        
        const analysis = await analyzeResumeContent(resumeText);
        resumeData = analysis;
        
        displayResumeAnalysis(analysis);
        
        showStatus('Resume analysis complete!', 'success');
        
        document.getElementById('desired-position-section').style.display = 'block';
        document.getElementById('desired-position-section').scrollIntoView({ behavior: 'smooth' });
    };
    reader.readAsText(file);
}

async function analyzeResumeContent(text) {
    const lowerText = text.toLowerCase();
    
    // Extract skills with categories
    const detectedSkills = {
        technical: [],
        soft: [],
        creative: [],
        business: []
    };
    
    for (const [category, skills] of Object.entries(skillCategories)) {
        for (const skill of skills) {
            if (lowerText.includes(skill.toLowerCase())) {
                detectedSkills[category].push(skill);
            }
        }
    }
    
    // Remove duplicates
    for (const category in detectedSkills) {
        detectedSkills[category] = [...new Set(detectedSkills[category])];
    }
    
    const allSkills = [...detectedSkills.technical, ...detectedSkills.soft, ...detectedSkills.creative, ...detectedSkills.business];
    
    // Extract experience
    let experience = 0;
    const expPatterns = [
        /(\d+)\s*(?:years?|yrs?)/i,
        /experience.*?(\d+)/i,
        /(\d+)\s*\+?\s*(?:years?|yrs?)/i
    ];
    for (const pattern of expPatterns) {
        const match = lowerText.match(pattern);
        if (match) {
            experience = parseInt(match[1]);
            break;
        }
    }
    
    // Extract name
    let name = "Candidate";
    const lines = text.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line && line.length < 50 && !line.includes('@') && !line.includes('http') && !line.includes('resume') && !line.includes('curriculum')) {
            name = line;
            break;
        }
    }
    
    // Detect career path based on skills
    let suggestedRole = "General Professional";
    if (detectedSkills.technical.some(s => ['python', 'java', 'javascript', 'react'].includes(s.toLowerCase()))) {
        suggestedRole = "Software Developer";
    } else if (detectedSkills.technical.some(s => ['sql', 'mysql', 'postgresql'].includes(s.toLowerCase()))) {
        suggestedRole = "Database Administrator";
    } else if (detectedSkills.business.some(s => ['marketing', 'social media', 'seo'].includes(s.toLowerCase()))) {
        suggestedRole = "Digital Marketing Manager";
    } else if (detectedSkills.technical.some(s => ['data analysis', 'tableau', 'excel'].includes(s.toLowerCase()))) {
        suggestedRole = "Data Analyst";
    } else if (detectedSkills.soft.some(s => ['project management', 'agile'].includes(s.toLowerCase()))) {
        suggestedRole = "Project Manager";
    }
    
    return {
        name: name,
        skills: detectedSkills,
        allSkills: allSkills,
        experience_years: experience || 3,
        suggested_role: suggestedRole,
        education: extractEducation(text)
    };
}

function extractEducation(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('b.tech') || lowerText.includes('b.e')) return "Bachelor's in Engineering";
    if (lowerText.includes('mca')) return "MCA";
    if (lowerText.includes('mba')) return "MBA";
    if (lowerText.includes('b.sc')) return "Bachelor's in Science";
    if (lowerText.includes('m.sc')) return "Master's in Science";
    return "Bachelor's Degree";
}

function displayResumeAnalysis(data) {
    const analysisDiv = document.getElementById('resume-analysis');
    const contentDiv = document.getElementById('analysis-content');
    
    // Generate skills HTML by category
    let skillsHtml = '';
    const categories = [
        { name: 'Technical Skills', key: 'technical', icon: 'fas fa-code', color: 'technical' },
        { name: 'Soft Skills', key: 'soft', icon: 'fas fa-handshake', color: 'soft' },
        { name: 'Creative Skills', key: 'creative', icon: 'fas fa-palette', color: 'creative' },
        { name: 'Business Skills', key: 'business', icon: 'fas fa-chart-line', color: 'business' }
    ];
    
    for (const cat of categories) {
        if (data.skills[cat.key] && data.skills[cat.key].length > 0) {
            skillsHtml += `
                <div style="margin-bottom: 1rem;">
                    <strong><i class="${cat.icon}"></i> ${cat.name} (${data.skills[cat.key].length}):</strong>
                    <div class="skills-detected">
                        ${data.skills[cat.key].map(s => `<span class="skill-badge ${cat.color}">${s}</span>`).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    contentDiv.innerHTML = `
        <div class="match-highlight">
            <h3>📄 Resume Analysis Results</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Experience:</strong> ${data.experience_years} years</p>
            <p><strong>Education:</strong> ${data.education}</p>
            <p><strong>AI-Suggested Role:</strong> <span class="match-percentage">${data.suggested_role}</span></p>
        </div>
        
        <div style="margin-top: 1.5rem;">
            <h4>📊 Skills Detected (${data.allSkills.length} total)</h4>
            ${skillsHtml}
        </div>
        
        <div style="margin-top: 1rem; font-size: 0.85rem; color: var(--text-secondary);">
            <i class="fas fa-robot"></i> AI-powered analysis based on resume content
        </div>
    `;
    
    analysisDiv.style.display = 'block';
    
    // Pre-fill desired position
    const desiredPosition = document.getElementById('desired-position');
    if (desiredPosition) {
        desiredPosition.value = data.suggested_role;
    }
}

function setupCareerAnalysis() {
    const analyzeBtn = document.getElementById('analyze-match');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeMatchPercentage);
    }
    
    const generateBtn = document.getElementById('generate-roadmap-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateRoadmap);
    }
    
    // Time selector
    const timeOptions = document.querySelectorAll('.time-option');
    timeOptions.forEach(option => {
        option.addEventListener('click', () => {
            timeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedMonths = parseInt(option.dataset.months);
        });
        if (option.dataset.months === '6') {
            option.classList.add('selected');
        }
    });
}

async function analyzeMatchPercentage() {
    if (!resumeData) {
        showStatus('Please upload your resume first', 'error');
        return;
    }
    
    const desiredRole = document.getElementById('desired-position').value.trim();
    const expectedSalary = document.getElementById('expected-salary').value;
    const preferredLocation = document.getElementById('preferred-location').value;
    
    if (!desiredRole) {
        showStatus('Please enter your desired position', 'error');
        return;
    }
    
    showStatus('Analyzing match percentage...', 'info');
    
    // Find matching role requirements
    let matchedRole = null;
    let matchScore = 0;
    let roleKey = null;
    
    for (const [key, requirements] of Object.entries(roleRequirements)) {
        if (desiredRole.toLowerCase().includes(key) || key.includes(desiredRole.toLowerCase())) {
            roleKey = key;
            matchedRole = requirements;
            break;
        }
    }
    
    if (!matchedRole) {
        // Generate dynamic requirements
        matchedRole = generateDynamicRequirements(desiredRole);
        roleKey = desiredRole;
    }
    
    // Calculate match percentage
    const currentSkills = resumeData.allSkills.map(s => s.toLowerCase());
    const requiredSkills = matchedRole.required.map(s => s.toLowerCase());
    const preferredSkills = matchedRole.preferred ? matchedRole.preferred.map(s => s.toLowerCase()) : [];
    
    const matchedRequired = requiredSkills.filter(skill => 
        currentSkills.some(cs => cs.includes(skill) || skill.includes(cs))
    );
    
    const matchedPreferred = preferredSkills.filter(skill => 
        currentSkills.some(cs => cs.includes(skill) || skill.includes(cs))
    );
    
    const matchPercentage = Math.round((matchedRequired.length / requiredSkills.length) * 100);
    const missingSkills = requiredSkills.filter(skill => 
        !currentSkills.some(cs => cs.includes(skill) || skill.includes(cs))
    );
    
    // Store for roadmap generation
    currentMatchAnalysis = {
        role: desiredRole,
        requiredSkills: requiredSkills,
        missingSkills: missingSkills,
        matchPercentage: matchPercentage,
        salaryRange: matchedRole.salary_range,
        level: matchedRole.level
    };
    
    // Display match analysis
    const matchDiv = document.getElementById('match-analysis');
    const matchContent = document.getElementById('match-content');
    
    let matchColor = '';
    let matchMessage = '';
    if (matchPercentage >= 70) {
        matchColor = '#10B981';
        matchMessage = 'Great match! You\'re well-prepared for this role.';
    } else if (matchPercentage >= 40) {
        matchColor = '#F59E0B';
        matchMessage = 'Good potential. Focus on developing missing skills.';
    } else {
        matchColor = '#EF4444';
        matchMessage = 'You may need significant upskilling for this role.';
    }
    
    matchContent.innerHTML = `
        <div class="match-highlight" style="border-left: 4px solid ${matchColor};">
            <div style="font-size: 3rem; font-weight: 700; color: ${matchColor};">${matchPercentage}%</div>
            <p><strong>Match Score</strong></p>
            <p>${matchMessage}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
            <div><strong>🎯 Desired Role:</strong> ${desiredRole}</div>
            <div><strong>💰 Expected Salary:</strong> ${expectedSalary || matchedRole.salary_range}</div>
            <div><strong>📍 Location:</strong> ${preferredLocation || 'Flexible'}</div>
            <div><strong>📊 Experience Level:</strong> ${matchedRole.level || 'Mid-Level'}</div>
        </div>
        
        <div class="skill-match">
            <h4>✅ Skills You Have (${matchedRequired.length}/${requiredSkills.length})</h4>
            <div class="skills-detected">
                ${matchedRequired.map(s => `<span class="skill-badge">${s}</span>`).join('')}
            </div>
        </div>
        
        <div class="skill-match">
            <h4>📚 Skills You Need to Develop (${missingSkills.length})</h4>
            <div class="skills-detected">
                ${missingSkills.map(s => `<span class="skill-badge" style="background: rgba(239, 68, 68, 0.1);">${s}</span>`).join('')}
            </div>
        </div>
        
        ${matchedRole.preferred ? `
        <div class="skill-match">
            <h4>⭐ Preferred Skills (Nice to Have)</h4>
            <div class="skills-detected">
                ${matchedRole.preferred.map(s => `<span class="skill-badge">${s}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        
        <div style="margin-top: 1rem; padding: 1rem; background: var(--background); border-radius: var(--border-radius);">
            <strong>💡 AI Recommendation:</strong><br>
            ${matchPercentage >= 70 ? 
                'You have a strong foundation! Focus on interview preparation and showcasing your experience.' :
                matchPercentage >= 40 ?
                `Focus on learning ${missingSkills.slice(0, 3).join(', ')} to improve your chances.` :
                `Consider starting with ${missingSkills[0] || 'foundational courses'} to build core skills.`
            }
        </div>
    `;
    
    matchDiv.style.display = 'block';
    
    // Show missing skills section
    const missingSkillsDiv = document.getElementById('missing-skills-section');
    const missingContent = document.getElementById('missing-skills-content');
    
    missingContent.innerHTML = `
        <p>Based on your match analysis, here are the skills you should focus on developing:</p>
        <div class="skills-grid" style="margin-top: 1rem;">
            ${missingSkills.map(skill => `
                <div class="skill-card">
                    <h3>${skill}</h3>
                    <div class="skill-meta">
                        <span class="trending">🔥 High Priority</span>
                    </div>
                    <button class="btn-small" onclick="alert('Learning resources for ${skill} will be added to your roadmap')">
                        Add to Roadmap
                    </button>
                </div>
            `).join('')}
        </div>
    `;
    
    missingSkillsDiv.style.display = 'block';
    missingSkillsDiv.scrollIntoView({ behavior: 'smooth' });
    
    showStatus('Match analysis complete!', 'success');
}

function generateDynamicRequirements(role) {
    const keywords = role.toLowerCase().split(' ');
    const required = ['Communication', 'Problem Solving', 'Teamwork'];
    const preferred = [];
    
    if (keywords.some(k => ['developer', 'engineer', 'programmer'].includes(k))) {
        required.push('Programming Basics', 'Git', 'SQL');
        preferred.push('JavaScript', 'Python');
    }
    if (keywords.some(k => ['data', 'analytics', 'analysis'].includes(k))) {
        required.push('Excel', 'SQL', 'Data Visualization');
        preferred.push('Python', 'Tableau');
    }
    if (keywords.some(k => ['marketing', 'social', 'digital'].includes(k))) {
        required.push('SEO', 'Social Media', 'Content Writing');
        preferred.push('Google Analytics', 'Email Marketing');
    }
    if (keywords.some(k => ['manager', 'lead', 'head'].includes(k))) {
        required.push('Leadership', 'Project Management', 'Communication');
        preferred.push('Agile', 'Strategic Planning');
    }
    
    return {
        required: [...new Set(required)],
        preferred: [...new Set(preferred)],
        salary_range: "8-15 LPA",
        level: "mid"
    };
}

function generateRoadmap() {
    if (!currentMatchAnalysis) {
        showStatus('Please analyze match first', 'error');
        return;
    }
    
    const missingSkills = currentMatchAnalysis.missingSkills;
    const targetRole = currentMatchAnalysis.role;
    const months = selectedMonths;
    
    showStatus(`Generating ${months}-month personalized roadmap...`, 'info');
    
    const roadmap = [];
    const skillsPerMonth = Math.ceil(missingSkills.length / months);
    
    let skillIndex = 0;
    for (let month = 1; month <= months; month++) {
        const monthSkills = [];
        for (let i = 0; i < skillsPerMonth && skillIndex < missingSkills.length; i++) {
            monthSkills.push(missingSkills[skillIndex]);
            skillIndex++;
        }
        
        if (monthSkills.length > 0 || month <= months) {
            roadmap.push({
                month: month,
                skills: monthSkills.length > 0 ? monthSkills : ['Review and Practice', 'Project Work'],
                duration: "4 weeks",
                resources: getResourcesForSkills(monthSkills),
                practiceTasks: getPracticeTasks(monthSkills),
                certification: month === months ? `Professional Certification in ${targetRole}` : getCertificationForSkill(monthSkills[0])
            });
        }
    }
    
    // Display roadmap
    const roadmapDiv = document.getElementById('generated-roadmap');
    const roadmapContent = document.getElementById('roadmap-content');
    
    let roadmapHtml = `
        <div style="margin-bottom: 1rem;">
            <div class="match-highlight">
                <h3>🎯 Your ${months}-Month Learning Journey</h3>
                <p>Target Role: <strong>${targetRole}</strong> | ${months} months | ${missingSkills.length} skills to develop</p>
            </div>
        </div>
        <div class="roadmap-timeline">
    `;
    
    for (const milestone of roadmap) {
        const statusClass = milestone.skills[0] === 'Review and Practice' ? 'pending' : 'pending';
        roadmapHtml += `
            <div class="roadmap-milestone">
                <div class="milestone-header">
                    <div class="milestone-number">${milestone.month}</div>
                    <div class="milestone-status ${statusClass}">${milestone.skills[0] === 'Review and Practice' ? 'In Progress' : 'Upcoming'}</div>
                </div>
                <h3>Month ${milestone.month}: ${milestone.skills.join(' + ')}</h3>
                <p><i class="far fa-clock"></i> ${milestone.duration}</p>
                
                <details>
                    <summary><i class="fas fa-book"></i> Learning Resources</summary>
                    <ul>
                        ${milestone.resources.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </details>
                
                <details>
                    <summary><i class="fas fa-laptop-code"></i> Practice Tasks</summary>
                    <ul>
                        ${milestone.practiceTasks.map(t => `<li>${t}</li>`).join('')}
                    </ul>
                </details>
                
                ${milestone.certification ? `
                <details>
                    <summary><i class="fas fa-certificate"></i> Certification Opportunity</summary>
                    <p>${milestone.certification}</p>
                </details>
                ` : ''}
                
                <div style="margin-top: 1rem;">
                    <button class="btn-small mark-milestone" data-month="${milestone.month}" onclick="markMilestoneComplete(${milestone.month})">
                        <i class="far fa-check-circle"></i> Mark Complete
                    </button>
                </div>
            </div>
        `;
    }
    
    roadmapHtml += `</div>`;
    
    roadmapContent.innerHTML = roadmapHtml;
    roadmapDiv.style.display = 'block';
    roadmapDiv.scrollIntoView({ behavior: 'smooth' });
    
    showStatus('Personalized roadmap generated!', 'success');
}

function getResourcesForSkills(skills) {
    const resources = [];
    for (const skill of skills) {
        if (skill.toLowerCase().includes('python')) resources.push('Python for Everybody - Coursera');
        else if (skill.toLowerCase().includes('sql')) resources.push('SQL Tutorial - W3Schools');
        else if (skill.toLowerCase().includes('javascript')) resources.push('JavaScript - The Odin Project');
        else if (skill.toLowerCase().includes('react')) resources.push('React Official Tutorial');
        else if (skill.toLowerCase().includes('aws')) resources.push('AWS Training & Certification');
        else if (skill.toLowerCase().includes('data')) resources.push('Google Data Analytics Certificate');
        else if (skill.toLowerCase().includes('marketing')) resources.push('Google Digital Marketing Course');
        else if (skill.toLowerCase().includes('project')) resources.push('Google Project Management Certificate');
        else resources.push(`Learn ${skill} - Online Courses & Documentation`);
    }
    return [...new Set(resources)].slice(0, 3);
}

function getPracticeTasks(skills) {
    const tasks = [];
    for (const skill of skills) {
        if (skill.toLowerCase().includes('python')) tasks.push('Build a data analysis project');
        else if (skill.toLowerCase().includes('sql')) tasks.push('Create and optimize database queries');
        else if (skill.toLowerCase().includes('javascript')) tasks.push('Build an interactive web app');
        else if (skill.toLowerCase().includes('react')) tasks.push('Create a component-based application');
        else if (skill.toLowerCase().includes('data')) tasks.push('Analyze a dataset and create visualizations');
        else tasks.push(`Complete a hands-on project using ${skill}`);
    }
    return [...new Set(tasks)].slice(0, 2);
}

function getCertificationForSkill(skill) {
    if (!skill) return null;
    const certs = {
        'python': 'PCAP - Certified Python Programmer',
        'sql': 'Oracle SQL Certification',
        'javascript': 'JavaScript Developer Certificate',
        'react': 'Meta Front-End Developer Certificate',
        'aws': 'AWS Certified Cloud Practitioner',
        'data': 'Google Data Analytics Certificate',
        'marketing': 'Google Digital Marketing Certificate',
        'project': 'PMP Certification'
    };
    for (const [key, cert] of Object.entries(certs)) {
        if (skill.toLowerCase().includes(key)) return cert;
    }
    return `${skill} Professional Certificate`;
}

function setupMentorsFilter() {
    displayMentors('all');
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayMentors(btn.dataset.type);
        });
    });
}

function displayMentors(type) {
    const container = document.getElementById('mentors-list');
    let filteredMentors = mentorsList;
    
    if (type === 'online') {
        filteredMentors = mentorsList.filter(m => m.mode === 'online');
    } else if (type === 'offline') {
        filteredMentors = mentorsList.filter(m => m.mode === 'offline');
    } else if (type === 'institute') {
        filteredMentors = mentorsList.filter(m => m.type === 'institute');
    }
    
    container.innerHTML = filteredMentors.map(mentor => `
        <div class="mentor-card">
            <div class="mentor-header">
                <div class="mentor-institution">${mentor.name}</div>
                <div class="rating">
                    ${'★'.repeat(Math.floor(mentor.rating))}${'☆'.repeat(5 - Math.floor(mentor.rating))}
                    <span style="font-size: 0.8rem;">(${mentor.rating})</span>
                </div>
            </div>
            <div><i class="fas ${mentor.mode === 'online' ? 'fa-wifi' : 'fa-building'}"></i> ${mentor.mode === 'online' ? 'Online Coaching' : mentor.mode === 'offline' ? 'Offline Training' : 'Both Online & Offline'}</div>
            <div><i class="fas fa-map-marker-alt"></i> ${mentor.location}</div>
            <div class="mentor-courses">
                ${mentor.courses.map(course => `<span class="course-badge">${course}</span>`).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                <div><i class="fas fa-phone"></i> ${mentor.contact}</div>
                <button class="contact-btn" onclick="window.open('https://${mentor.website}', '_blank')">Visit Website</button>
            </div>
        </div>
    `).join('');
}

function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    const avatar = document.getElementById('profile-avatar');
    const userFullname = document.getElementById('user-fullname');
    
    if (user.firstName) {
        if (avatar) avatar.textContent = (user.firstName[0] + (user.lastName?.[0] || '')).toUpperCase();
        if (userFullname) userFullname.textContent = `${user.firstName} ${user.lastName || ''}`.trim();
    }
}

function resetUpload() {
    resumeData = null;
    resumeText = '';
    currentMatchAnalysis = null;
    
    const uploadArea = document.getElementById('upload-area');
    const uploadedInfo = document.getElementById('uploaded-info');
    const resumeAnalysis = document.getElementById('resume-analysis');
    const desiredSection = document.getElementById('desired-position-section');
    const matchAnalysis = document.getElementById('match-analysis');
    const missingSection = document.getElementById('missing-skills-section');
    const roadmapDiv = document.getElementById('generated-roadmap');
    const fileInput = document.getElementById('resume-file');
    
    if (uploadArea) uploadArea.style.display = 'block';
    if (uploadedInfo) uploadedInfo.style.display = 'none';
    if (resumeAnalysis) resumeAnalysis.style.display = 'none';
    if (desiredSection) desiredSection.style.display = 'none';
    if (matchAnalysis) matchAnalysis.style.display = 'none';
    if (missingSection) missingSection.style.display = 'none';
    if (roadmapDiv) roadmapDiv.style.display = 'none';
    if (fileInput) fileInput.value = '';
    
    showStatus('Resume cleared', 'info');
}

function markMilestoneComplete(month) {
    const milestone = document.querySelector(`.roadmap-milestone .milestone-header .milestone-number:contains('${month}')`).closest('.roadmap-milestone');
    if (milestone) {
        const statusSpan = milestone.querySelector('.milestone-status');
        if (statusSpan) {
            statusSpan.textContent = 'Completed';
            statusSpan.classList.remove('pending');
            statusSpan.classList.add('completed');
        }
        const btn = milestone.querySelector('.mark-milestone');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-check"></i> Completed';
        }
        showStatus(`Month ${month} marked as complete! Keep going! 🎉`, 'success');
    }
}

function showStatus(message, type) {
    let container = document.getElementById('status-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'status-container';
        container.style.cssText = 'position:fixed;top:80px;right:20px;z-index:10000';
        document.body.appendChild(container);
    }
    
    const colors = { success: '#10B981', error: '#EF4444', info: '#38BDF8' };
    const notif = document.createElement('div');
    notif.style.cssText = `background:white;padding:12px 20px;border-radius:50px;box-shadow:0 5px 15px rgba(0,0,0,0.2);margin-bottom:10px;display:flex;align-items:center;gap:10px;border-left:4px solid ${colors[type]}`;
    notif.innerHTML = `<span style="color:${colors[type]}">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span><span>${message}</span>`;
    container.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// Make functions global for onclick handlers
window.markMilestoneComplete = markMilestoneComplete;
window.showStatus = showStatus;