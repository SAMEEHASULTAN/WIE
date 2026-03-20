// career.js - Main Career Restart Class with Enhanced Features
console.log("✅ career.js loaded");

class CareerRestart {
    constructor() {
        console.log("✅ CareerRestart constructor called");
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        this.resumeData = null;
        
        this.init();
    }
    
    init() {
        console.log("✅ CareerRestart init called");
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        console.log("Setting up career page event listeners");
        
        // Add experience button
        const addExpBtn = document.getElementById('add-experience');
        if (addExpBtn) {
            addExpBtn.addEventListener('click', () => this.addExperienceEntry());
        }
        
        // Add education button
        const addEduBtn = document.getElementById('add-education');
        if (addEduBtn) {
            addEduBtn.addEventListener('click', () => this.addEducationEntry());
        }
        
        // Generate resume button
        const generateBtn = document.getElementById('generate-resume');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateResume());
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
                if (item) {
                    item.classList.toggle('active');
                }
            });
        });
        
        // Quick analyze button
        const analyzeBtn = document.getElementById('analyze-gap');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.quickAnalyze());
        }
        
        // File upload handling
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('resume-file');
        const browseBtn = document.getElementById('browse-resume');
        
        if (uploadArea) {
            uploadArea.addEventListener('click', () => fileInput?.click());
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--primary)';
                uploadArea.style.backgroundColor = 'rgba(127, 86, 217, 0.05)';
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = 'var(--primary)';
                uploadArea.style.backgroundColor = 'transparent';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--primary)';
                uploadArea.style.backgroundColor = 'transparent';
                const file = e.dataTransfer.files[0];
                if (file) this.handleFileUpload(file);
            });
        }
        
        if (browseBtn) {
            browseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput?.click();
            });
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) this.handleFileUpload(file);
            });
        }
        
        // Remove file button
        const removeFile = document.getElementById('remove-file');
        if (removeFile) {
            removeFile.addEventListener('click', () => this.resetUpload());
        }
        
        // Analyze break button
        const analyzeBreakBtn = document.getElementById('analyze-break');
        if (analyzeBreakBtn) {
            analyzeBreakBtn.addEventListener('click', () => this.analyzeCareerBreak());
        }
        
        // Range slider
        const timeSlider = document.getElementById('available-time');
        const timeValue = document.getElementById('time-value');
        if (timeSlider && timeValue) {
            timeSlider.addEventListener('input', () => {
                timeValue.textContent = timeSlider.value;
            });
        }
    }
    
    addExperienceEntry() {
        const container = document.getElementById('experience-entries');
        if (container) {
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
        }
    }
    
    addEducationEntry() {
        const container = document.getElementById('education-entries');
        if (container) {
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
        }
    }
    
    generateResume() {
        const name = document.getElementById('resume-name')?.value || 'Your Name';
        const email = document.getElementById('resume-email')?.value || 'email@example.com';
        const phone = document.getElementById('resume-phone')?.value || 'phone number';
        const location = document.getElementById('resume-location')?.value || 'location';
        const summary = document.getElementById('resume-summary')?.value || 'Experienced professional seeking to restart career...';
        
        const preview = document.getElementById('resume-preview');
        if (preview) {
            preview.innerHTML = `
                <div class="resume-paper">
                    <h2>${name}</h2>
                    <div class="contact-info">
                        <span>${email}</span> |
                        <span>${phone}</span> |
                        <span>${location}</span>
                    </div>
                    <div class="resume-section">
                        <h3>Professional Summary</h3>
                        <p>${summary}</p>
                    </div>
                </div>
            `;
        }
        
        this.showNotification('Resume generated successfully!', 'success');
    }
    
    quickAnalyze() {
        const role = document.getElementById('desired-role')?.value;
        if (!role) {
            this.showNotification('Please select a desired job role', 'error');
            return;
        }
        
        const results = document.getElementById('analysis-results');
        if (results) {
            results.style.display = 'block';
            
            // Populate with demo data
            document.getElementById('your-skills').innerHTML = `
                <span class="skill-tag">Communication</span>
                <span class="skill-tag">Leadership</span>
                <span class="skill-tag">Project Management</span>
            `;
            
            document.getElementById('required-skills').innerHTML = `
                <span class="skill-tag">Python</span>
                <span class="skill-tag">JavaScript</span>
                <span class="skill-tag">SQL</span>
                <span class="skill-tag">AWS</span>
            `;
            
            document.getElementById('missing-skills').innerHTML = `
                <div class="missing-skill">
                    <span>Python</span>
                    <a href="#" class="btn-small">Learn Now</a>
                </div>
                <div class="missing-skill">
                    <span>JavaScript</span>
                    <a href="#" class="btn-small">Learn Now</a>
                </div>
                <div class="missing-skill">
                    <span>AWS</span>
                    <a href="#" class="btn-small">Learn Now</a>
                </div>
            `;
            
            document.getElementById('time-to-ready').textContent = '3 months';
            document.getElementById('readiness-score').textContent = '65%';
        }
    }
    
    handleFileUpload(file) {
        // Check file type
        const validTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                           'text/plain'];
        
        if (!validTypes.includes(file.type) && !file.name.endsWith('.txt')) {
            this.showNotification('Please upload PDF, DOC, DOCX, or TXT files only', 'error');
            return;
        }
        
        const fileName = document.getElementById('file-name');
        const uploadArea = document.getElementById('upload-area');
        const uploadedInfo = document.getElementById('uploaded-info');
        const breakSection = document.getElementById('break-section');
        
        if (fileName) fileName.textContent = file.name;
        if (uploadArea) uploadArea.style.display = 'none';
        if (uploadedInfo) uploadedInfo.style.display = 'flex';
        
        this.showNotification('Analyzing resume...', 'info');
        
        // Simulate resume analysis
        setTimeout(() => {
            this.resumeData = {
                name: "Priya Sharma",
                skills: ["SQL", "Database Management", "Oracle", "MySQL", "Team Leadership"],
                experience: 8,
                education: "B.Tech Computer Science",
                careerPath: "Database Administrator"
            };
            
            const targetRole = document.getElementById('target-role');
            if (targetRole) {
                targetRole.value = this.resumeData.careerPath;
            }
            
            if (breakSection) breakSection.style.display = 'block';
            
            this.showNotification('Resume analyzed successfully!', 'success');
            breakSection?.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    }
    
    resetUpload() {
        this.resumeData = null;
        
        const uploadArea = document.getElementById('upload-area');
        const uploadedInfo = document.getElementById('uploaded-info');
        const breakSection = document.getElementById('break-section');
        const fileInput = document.getElementById('resume-file');
        const dynamicResults = document.getElementById('dynamic-results');
        
        if (uploadArea) uploadArea.style.display = 'block';
        if (uploadedInfo) uploadedInfo.style.display = 'none';
        if (breakSection) breakSection.style.display = 'none';
        if (dynamicResults) dynamicResults.style.display = 'none';
        if (fileInput) fileInput.value = '';
        
        // Reset form fields
        const breakYear = document.getElementById('break-year');
        const breakMonths = document.getElementById('break-months');
        const targetRole = document.getElementById('target-role');
        const targetLocation = document.getElementById('target-location');
        const availableTime = document.getElementById('available-time');
        const timeValue = document.getElementById('time-value');
        
        if (breakYear) breakYear.value = '';
        if (breakMonths) breakMonths.value = '';
        if (targetRole) targetRole.value = '';
        if (targetLocation) targetLocation.value = '';
        if (availableTime) availableTime.value = '6';
        if (timeValue) timeValue.textContent = '6';
    }
    
    analyzeCareerBreak() {
        const breakYear = document.getElementById('break-year')?.value;
        const breakMonths = document.getElementById('break-months')?.value;
        const targetRole = document.getElementById('target-role')?.value;
        const targetLocation = document.getElementById('target-location')?.value;
        const availableTime = document.getElementById('available-time')?.value;
        
        if (!breakYear) {
            this.showNotification('Please select when you took a break', 'error');
            return;
        }
        
        if (!breakMonths || breakMonths < 1) {
            this.showNotification('Please enter break duration in months', 'error');
            return;
        }
        
        if (!targetRole) {
            this.showNotification('Please enter your target role', 'error');
            return;
        }
        
        this.showNotification('Analyzing career gap...', 'info');
        
        setTimeout(() => {
            const currentSkills = this.resumeData?.skills || 
                ["SQL", "Communication", "Team Management", "Excel"];
            
            const gap = this.calculateSkillGap(
                currentSkills,
                targetRole,
                parseInt(breakYear)
            );
            
            const roadmap = this.generateRoadmap(
                targetRole,
                gap.gap,
                parseInt(availableTime),
                targetLocation || "Not specified",
                currentSkills
            );
            
            this.displayResults(gap, roadmap, breakYear, breakMonths);
            this.showNotification('Career gap analysis complete!', 'success');
        }, 1500);
    }
    
    calculateSkillGap(currentSkills, targetRole, breakYear) {
        const currentYear = new Date().getFullYear();
        const breakDuration = currentYear - breakYear;
        
        // Mock skills database
        const skillsDatabase = {
            "Database Administrator": {
                "2015": ["Oracle", "SQL Server", "MySQL"],
                "2018": ["MongoDB", "PostgreSQL", "Redis"],
                "2020": ["DynamoDB", "Snowflake", "Cloud Databases"],
                "2023": ["Vector Databases", "AI-powered DB", "Edge Databases"]
            },
            "Software Developer": {
                "2015": ["Java", "C#", "PHP"],
                "2018": ["Python", "Node.js", "React"],
                "2020": ["Docker", "Kubernetes", "Microservices"],
                "2023": ["AI Integration", "LangChain", "RAG Systems"]
            },
            "Data Analyst": {
                "2015": ["Excel", "SQL", "Tableau"],
                "2018": ["Python", "Pandas", "Power BI"],
                "2020": ["Machine Learning", "Big Data", "Spark"],
                "2023": ["AI Analytics", "AutoML", "Data Ethics"]
            },
            "Digital Marketing": {
                "2015": ["SEO", "Email Marketing", "Social Media"],
                "2018": ["Google Analytics", "Facebook Ads", "Marketing Automation"],
                "2020": ["Programmatic Advertising", "Influencer Marketing"],
                "2023": ["AI Marketing", "Generative AI", "Voice Search"]
            }
        };
        
        const roleSkills = skillsDatabase[targetRole] || skillsDatabase["Software Developer"];
        
        // Find new skills that emerged during break
        const newSkills = [];
        const evolution = [];
        
        for (let year = breakYear + 1; year <= currentYear; year++) {
            const yearStr = year.toString();
            if (roleSkills[yearStr]) {
                newSkills.push(...roleSkills[yearStr]);
                evolution.push({
                    year: year,
                    skills: roleSkills[yearStr]
                });
            }
        }
        
        const uniqueNewSkills = [...new Set(newSkills)];
        const gap = uniqueNewSkills.filter(skill => 
            !currentSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        );
        
        return {
            gap: gap.slice(0, 6),
            breakDuration: breakDuration,
            breakYear: breakYear,
            evolution: evolution,
            emergingTrends: this.getEmergingTrends(targetRole),
            estimatedTimeToLearn: this.estimateLearningTime(gap.length)
        };
    }
    
    getEmergingTrends(role) {
        const trends = {
            "Database Administrator": [
                "Cloud-native databases",
                "AI-powered database optimization",
                "Vector databases for AI",
                "Database as a Service (DBaaS)"
            ],
            "Software Developer": [
                "AI-assisted development",
                "Low-code platforms",
                "Edge computing",
                "WebAssembly"
            ],
            "Data Analyst": [
                "AI-powered analytics",
                "Real-time data processing",
                "Data storytelling",
                "Automated insights"
            ],
            "Digital Marketing": [
                "Generative AI marketing",
                "Voice search optimization",
                "AR/VR marketing",
                "Hyper-personalization"
            ]
        };
        return trends[role] || ["AI Integration", "Cloud Computing", "Data Analytics"];
    }
    
    estimateLearningTime(skillCount) {
        if (skillCount <= 3) return "2-3 months";
        if (skillCount <= 6) return "4-6 months";
        return "8-12 months";
    }
    
    generateRoadmap(targetRole, missingSkills, timeAvailable, targetLocation, currentSkills) {
        const roadmap = [];
        const skillsPerMonth = Math.ceil(missingSkills.length / timeAvailable);
        
        let skillIndex = 0;
        for (let month = 1; month <= timeAvailable; month++) {
            const monthSkills = [];
            for (let i = 0; i < skillsPerMonth && skillIndex < missingSkills.length; i++) {
                monthSkills.push(missingSkills[skillIndex]);
                skillIndex++;
            }
            
            if (monthSkills.length > 0) {
                roadmap.push({
                    month: month,
                    skills: monthSkills,
                    duration: "1 month",
                    resources: monthSkills.map(s => `Online courses for ${s}`),
                    practice: monthSkills.map(s => `Practice projects with ${s}`)
                });
            }
        }
        
        return {
            roadmap: roadmap,
            totalDuration: `${timeAvailable} months`,
            targetRole: targetRole,
            targetLocation: targetLocation,
            salaryEstimate: "12-18 LPA",
            nextRoles: ["Senior " + targetRole, "Team Lead", "Consultant"],
            certifications: [targetRole + " Certification", "Cloud Certification"]
        };
    }
    
    displayResults(gap, roadmap, breakYear, breakMonths) {
        const dynamicResults = document.getElementById('dynamic-results');
        if (!dynamicResults) return;
        
        dynamicResults.style.display = 'block';
        
        // Evolution Timeline
        const evolutionContainer = document.getElementById('evolution-timeline');
        if (evolutionContainer) {
            let timelineHtml = `
                <div class="timeline-item highlight">
                    <div class="timeline-year">${breakYear}</div>
                    <div class="timeline-content">
                        <strong>Career Break Started</strong>
                        <p>Duration: ${breakMonths} months</p>
                    </div>
                </div>
            `;
            
            gap.evolution.forEach(item => {
                timelineHtml += `
                    <div class="timeline-item">
                        <div class="timeline-year">${item.year}</div>
                        <div class="timeline-content">
                            <strong>New skills emerged:</strong>
                            <p>${item.skills.slice(0, 3).join(' • ')}</p>
                        </div>
                    </div>
                `;
            });
            
            evolutionContainer.innerHTML = timelineHtml;
        }
        
        // Missing Skills Grid
        const skillsGrid = document.getElementById('missing-skills-grid');
        if (skillsGrid) {
            skillsGrid.innerHTML = gap.gap.map(skill => `
                <div class="skill-card">
                    <h3>${skill}</h3>
                    <div class="skill-meta">
                        <span class="trending">🔥 High Demand</span>
                        <span class="demand">${Math.floor(Math.random() * 30 + 70)}% Growth</span>
                    </div>
                    <button class="btn-small learn-now" onclick="window.location.href='roadmap.html'">
                        Start Learning
                    </button>
                </div>
            `).join('');
        }
        
        // Emerging Trends
        const trendsContainer = document.getElementById('trends-container');
        if (trendsContainer) {
            trendsContainer.innerHTML = gap.emergingTrends.map(trend => `
                <div class="trend-card">
                    <i class="fas fa-rocket"></i>
                    <h4>${trend}</h4>
                </div>
            `).join('');
        }
        
        // Roadmap Timeline
        const roadmapContainer = document.getElementById('roadmap-timeline');
        if (roadmapContainer) {
            roadmapContainer.innerHTML = roadmap.roadmap.map(item => `
                <div class="roadmap-item">
                    <div class="roadmap-month">Month ${item.month}</div>
                    <div class="roadmap-content">
                        <h4>${item.skills.join(' + ')}</h4>
                        <p><i class="far fa-clock"></i> ${item.duration}</p>
                        <details>
                            <summary>📚 Resources</summary>
                            <ul>
                                ${item.resources.map(r => `<li>${r}</li>`).join('')}
                            </ul>
                        </details>
                    </div>
                </div>
            `).join('');
        }
        
        // Add Summary
        const summaryHtml = `
            <div class="career-summary">
                <h3>🎯 Career Roadmap Summary</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <label>Target Role</label>
                        <span>${roadmap.targetRole}</span>
                    </div>
                    <div class="summary-item">
                        <label>Total Duration</label>
                        <span>${roadmap.totalDuration}</span>
                    </div>
                    <div class="summary-item">
                        <label>Expected Salary</label>
                        <span class="salary">${roadmap.salaryEstimate}</span>
                    </div>
                    <div class="summary-item">
                        <label>Skills to Learn</label>
                        <span>${gap.gap.length} new skills</span>
                    </div>
                </div>
            </div>
        `;
        
        // Insert summary at the beginning
        const firstChild = dynamicResults.firstChild;
        const summaryDiv = document.createElement('div');
        summaryDiv.innerHTML = summaryHtml;
        dynamicResults.insertBefore(summaryDiv, firstChild);
    }
    
    showNotification(message, type = 'info') {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
            `;
            document.body.appendChild(container);
        }
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: white;
            padding: 15px 25px;
            border-radius: 50px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
            border-left: 4px solid ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#38BDF8'};
        `;
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        notification.innerHTML = `
            <span style="color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#38BDF8'}; font-weight: bold;">${icon}</span>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM ready, creating CareerRestart instance");
    if (!window.careerRestart) {
        window.careerRestart = new CareerRestart();
    }
});