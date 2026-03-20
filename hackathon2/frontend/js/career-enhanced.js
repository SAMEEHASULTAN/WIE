// Enhanced Career Analysis
console.log("✅ career-enhanced.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('resume-file');
    const browseBtn = document.getElementById('browse-resume');
    const uploadedInfo = document.getElementById('uploaded-info');
    const fileName = document.getElementById('file-name');
    const removeFile = document.getElementById('remove-file');
    const breakSection = document.getElementById('break-section');
    const dynamicResults = document.getElementById('dynamic-results');
    const analyzeBreakBtn = document.getElementById('analyze-break');
    
    let uploadedResumeData = null;
    
    // File upload handling
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
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
            if (file) handleFileUpload(file);
        });
    }
    
    if (browseBtn) {
        browseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleFileUpload(file);
        });
    }
    
    if (removeFile) {
        removeFile.addEventListener('click', () => {
            uploadedResumeData = null;
            uploadedInfo.style.display = 'none';
            uploadArea.style.display = 'block';
            breakSection.style.display = 'none';
            dynamicResults.style.display = 'none';
            fileInput.value = '';
            
            // Reset form fields
            document.getElementById('break-year').value = '';
            document.getElementById('break-months').value = '';
            document.getElementById('target-role').value = '';
            document.getElementById('target-location').value = '';
            document.getElementById('available-time').value = '6';
            document.getElementById('time-value').textContent = '6';
        });
    }
    
    async function handleFileUpload(file) {
        // Check file type
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!validTypes.includes(file.type) && !file.name.endsWith('.txt')) {
            auth.showNotification('Please upload PDF, DOC, DOCX, or TXT files only', 'error');
            return;
        }
        
        fileName.textContent = file.name;
        uploadArea.style.display = 'none';
        uploadedInfo.style.display = 'flex';
        
        // Show loading
        auth.showNotification('Analyzing resume...', 'info');
        
        try {
            // Simulate resume analysis with delay
            setTimeout(() => {
                // Mock resume analysis result
                uploadedResumeData = {
                    name: "Priya Sharma",
                    skills: ["SQL", "Database Management", "Oracle", "MySQL", "Team Leadership", "Project Management"],
                    experience: 8,
                    education: "B.Tech Computer Science",
                    careerPath: "Database Administrator"
                };
                
                // Pre-fill target role based on detected career path
                const targetRoleInput = document.getElementById('target-role');
                if (targetRoleInput) {
                    targetRoleInput.value = uploadedResumeData.careerPath;
                }
                
                breakSection.style.display = 'block';
                auth.showNotification('Resume analyzed successfully!', 'success');
                
                // Scroll to break section
                breakSection.scrollIntoView({ behavior: 'smooth' });
            }, 2000);
            
        } catch (error) {
            console.error('Error analyzing resume:', error);
            auth.showNotification('Error analyzing resume. Please try again.', 'error');
            uploadArea.style.display = 'block';
            uploadedInfo.style.display = 'none';
        }
    }
    
    // Break analysis
    if (analyzeBreakBtn) {
        analyzeBreakBtn.addEventListener('click', () => {
            const breakYear = document.getElementById('break-year').value;
            const breakMonths = document.getElementById('break-months').value;
            const targetRole = document.getElementById('target-role').value;
            const targetLocation = document.getElementById('target-location').value;
            const availableTime = document.getElementById('available-time').value;
            
            if (!breakYear) {
                auth.showNotification('Please select when you took a break', 'error');
                return;
            }
            
            if (!breakMonths || breakMonths < 1) {
                auth.showNotification('Please enter break duration in months', 'error');
                return;
            }
            
            if (!targetRole) {
                auth.showNotification('Please enter your target role', 'error');
                return;
            }
            
            // Show loading
            auth.showNotification('Analyzing career gap...', 'info');
            
            setTimeout(() => {
                // Calculate gap using resume analyzer
                const currentSkills = uploadedResumeData?.skills || ["SQL", "Communication", "Team Management"];
                const gap = window.resumeAnalyzer.calculateSkillGap(
                    currentSkills,
                    targetRole,
                    parseInt(breakYear)
                );
                
                const roadmap = window.resumeAnalyzer.generateRoadmap(
                    targetRole,
                    gap.gap,
                    parseInt(availableTime),
                    targetLocation || "Not specified",
                    currentSkills
                );
                
                displayResults(gap, roadmap, breakYear, breakMonths);
                auth.showNotification('Career gap analysis complete!', 'success');
            }, 1500);
        });
    }
    
    // Range slider
    const timeSlider = document.getElementById('available-time');
    const timeValue = document.getElementById('time-value');
    if (timeSlider && timeValue) {
        timeSlider.addEventListener('input', () => {
            timeValue.textContent = timeSlider.value;
        });
    }
    
    function displayResults(gap, roadmap, breakYear, breakMonths) {
        dynamicResults.style.display = 'block';
        
        // Display evolution timeline
        const evolutionContainer = document.getElementById('evolution-timeline');
        if (evolutionContainer) {
            let timelineHtml = '';
            let year = parseInt(breakYear);
            const currentYear = new Date().getFullYear();
            
            // Add break year
            timelineHtml += `
                <div class="timeline-item highlight">
                    <div class="timeline-year">${year}</div>
                    <div class="timeline-content">
                        <strong>Career Break Started</strong>
                        <p>You took a break of ${breakMonths} months</p>
                    </div>
                </div>
            `;
            
            // Add evolution years
            for (let y = year + 1; y <= currentYear; y++) {
                const yearSkills = gap.evolution.find(e => e.year === y)?.skills || [];
                if (yearSkills.length > 0) {
                    timelineHtml += `
                        <div class="timeline-item">
                            <div class="timeline-year">${y}</div>
                            <div class="timeline-content">
                                <strong>New skills emerged:</strong>
                                <p>${yearSkills.slice(0, 3).join(' • ')}</p>
                            </div>
                        </div>
                    `;
                } else {
                    timelineHtml += `
                        <div class="timeline-item">
                            <div class="timeline-year">${y}</div>
                            <div class="timeline-content">
                                <p>Technology continued to evolve</p>
                            </div>
                        </div>
                    `;
                }
            }
            
            evolutionContainer.innerHTML = timelineHtml;
        }
        
        // Display missing skills
        const skillsGrid = document.getElementById('missing-skills-grid');
        if (skillsGrid) {
            skillsGrid.innerHTML = gap.gap.map(skill => `
                <div class="skill-card">
                    <h3>${skill}</h3>
                    <div class="skill-meta">
                        <span class="trending">🔥 High Demand</span>
                        <span class="demand">${Math.floor(Math.random() * 30 + 70)}% Growth</span>
                    </div>
                    <p class="skill-description">Essential for ${roadmap.targetRole} roles in ${new Date().getFullYear()}</p>
                    <button class="btn-small learn-now" onclick="window.location.href='roadmap.html'">
                        Start Learning
                    </button>
                </div>
            `).join('');
        }
        
        // Display emerging trends
        const trendsContainer = document.getElementById('trends-container');
        if (trendsContainer) {
            trendsContainer.innerHTML = gap.emergingTrends.map(trend => `
                <div class="trend-card">
                    <i class="fas fa-rocket"></i>
                    <h4>${trend}</h4>
                    <p>Emerging trend in ${roadmap.targetRole}</p>
                </div>
            `).join('');
        }
        
        // Display roadmap
        const roadmapContainer = document.getElementById('roadmap-timeline');
        if (roadmapContainer) {
            roadmapContainer.innerHTML = roadmap.roadmap.map(item => `
                <div class="roadmap-item">
                    <div class="roadmap-month">Month ${item.month}</div>
                    <div class="roadmap-content">
                        <h4>${item.skills.join(' + ')}</h4>
                        <p><i class="far fa-clock"></i> ${item.duration}</p>
                        
                        <details>
                            <summary>📚 Learning Resources</summary>
                            <ul>
                                ${item.resources.map(r => `<li>${r}</li>`).join('')}
                            </ul>
                        </details>
                        
                        <details>
                            <summary>💻 Practice Tasks</summary>
                            <ul>
                                ${item.practice.map(p => `<li>${p}</li>`).join('')}
                            </ul>
                        </details>
                        
                        ${item.certification ? `
                            <div class="certification-badge">
                                <i class="fas fa-certificate"></i> ${item.certification}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }
        
        // Add career summary
        const summaryHtml = `
            <div class="career-summary">
                <h3>🎯 Career Roadmap Summary</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <label>Target Role</label>
                        <span>${roadmap.targetRole}</span>
                    </div>
                    <div class="summary-item">
                        <label>Location</label>
                        <span>${roadmap.targetLocation || 'Flexible'}</span>
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
                    <div class="summary-item">
                        <label>Break Duration</label>
                        <span>${gap.breakDuration} years</span>
                    </div>
                </div>
                
                <div class="next-roles">
                    <h4>Potential Next Roles</h4>
                    <div class="role-tags">
                        ${roadmap.nextRoles?.map(role => `<span class="role-tag">${role}</span>`).join('')}
                    </div>
                </div>
                
                <div class="certifications-suggested">
                    <h4>Recommended Certifications</h4>
                    <ul>
                        ${roadmap.certifications?.map(cert => `<li><i class="fas fa-check-circle"></i> ${cert}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        // Insert summary at the beginning of dynamic results
        const firstChild = dynamicResults.firstChild;
        const summaryDiv = document.createElement('div');
        summaryDiv.innerHTML = summaryHtml;
        dynamicResults.insertBefore(summaryDiv, firstChild);
        
        // Scroll to results
        dynamicResults.scrollIntoView({ behavior: 'smooth' });
    }
});