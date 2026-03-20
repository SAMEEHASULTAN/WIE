// ai-service.js - Complete with Gemini AI and JSearch API

console.log("✅ ai-service.js loaded");

class AIService {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // !!! IMPORTANT: Replace with your actual Gemini API key from Google AI Studio !!!
        this.geminiApiKey = 'AIzaSyCcfzkzFA4pqWQbN0R1uaULHlPkvbac6Nk'; // <-- PUT YOUR GEMINI API KEY HERE
        
        // !!! IMPORTANT: Replace with your actual RapidAPI key from https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch !!!
        this.jsearchKey = 'c908487722msh9e501e6608da515p131ed5jsnb57983055943'; // <-- PUT YOUR JSEARCH API KEY HERE
        this.jsearchHost = 'jsearch.p.rapidapi.com';
        
        this.initGemini();
    }
    
    initGemini() {
        if (this.geminiApiKey && this.geminiApiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
            // Initialize Gemini API
            console.log('Gemini API configured');
            this.geminiEnabled = true;
        } else {
            console.warn('⚠️ Gemini API key not set. AI features will use fallback data.');
            this.geminiEnabled = false;
        }
    }
    
    async callGemini(prompt) {
        if (!this.geminiEnabled) {
            console.log('Gemini not enabled, using fallback');
            return null;
        }
        
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    return data.candidates[0].content.parts[0].text;
                }
            }
            return null;
        } catch (error) {
            console.error('Gemini API error:', error);
            return null;
        }
    }
    
    async analyzeResumeWithAI(resumeText) {
        if (!this.geminiEnabled) {
            return this.parseResumeLocally(resumeText);
        }
        
        const prompt = `Analyze this resume and extract key information. Return ONLY valid JSON, no other text.

Resume:
${resumeText.substring(0, 4000)}

Return JSON with exactly these keys:
{
    "name": "Full name",
    "skills": {
        "technical": ["skill1", "skill2"],
        "soft": ["skill1", "skill2"],
        "creative": ["skill1", "skill2"],
        "business": ["skill1", "skill2"]
    },
    "allSkills": ["skill1", "skill2"],
    "experience_years": number,
    "education": "degree name",
    "suggested_role": "suggested job role"
}`;

        try {
            const result = await this.callGemini(prompt);
            if (result) {
                const parsed = this.parseJSON(result);
                if (parsed && parsed.skills) {
                    return parsed;
                }
            }
            return this.parseResumeLocally(resumeText);
        } catch (error) {
            console.error('Gemini analysis error:', error);
            return this.parseResumeLocally(resumeText);
        }
    }
    
    parseResumeLocally(text) {
        const lowerText = text.toLowerCase();
        
        const skillCategories = {
            technical: ['python', 'java', 'javascript', 'sql', 'aws', 'docker', 'kubernetes', 'react', 'angular', 'node.js', 'django', 'flask', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'typescript', 'html', 'css', 'mongodb', 'postgresql', 'mysql', 'oracle', 'git', 'linux', 'devops', 'machine learning', 'ai', 'data science', 'tableau', 'power bi', 'excel', 'spark', 'hadoop'],
            soft: ['communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking', 'time management', 'adaptability', 'creativity', 'emotional intelligence', 'conflict resolution', 'negotiation', 'presentation', 'public speaking', 'writing', 'collaboration', 'organization', 'analytical', 'decision making', 'interpersonal'],
            creative: ['design', 'graphic design', 'ui/ux', 'photography', 'video editing', 'illustration', 'animation', 'content creation', 'writing', 'copywriting', 'storytelling', 'art', 'crafting'],
            business: ['marketing', 'sales', 'project management', 'agile', 'scrum', 'product management', 'business development', 'strategy', 'analytics', 'finance', 'accounting', 'hr', 'recruitment', 'operations', 'supply chain']
        };
        
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
        
        for (const category in detectedSkills) {
            detectedSkills[category] = [...new Set(detectedSkills[category])];
        }
        
        const allSkills = [...detectedSkills.technical, ...detectedSkills.soft, ...detectedSkills.creative, ...detectedSkills.business];
        
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
        
        let name = "Candidate";
        const lines = text.split('\n');
        for (let line of lines) {
            line = line.trim();
            if (line && line.length < 50 && !line.includes('@') && !line.includes('http') && !line.includes('resume') && !line.includes('curriculum')) {
                name = line;
                break;
            }
        }
        
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
            education: this.extractEducation(text),
            suggested_role: suggestedRole
        };
    }
    
    extractEducation(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('b.tech') || lowerText.includes('b.e')) return "Bachelor's in Engineering";
        if (lowerText.includes('mca')) return "MCA";
        if (lowerText.includes('mba')) return "MBA";
        if (lowerText.includes('b.sc')) return "Bachelor's in Science";
        if (lowerText.includes('m.sc')) return "Master's in Science";
        return "Bachelor's Degree";
    }
    
    async analyzeCareerGap(skills, targetRole, breakYear, availableTime) {
        if (this.geminiEnabled) {
            const prompt = `Analyze career gap for a professional returning to work.
            
Current skills: ${skills.join(', ')}
Target role: ${targetRole}
Career break started: ${breakYear}
Current year: ${new Date().getFullYear()}
Available time: ${availableTime} months

Return ONLY valid JSON with these keys:
{
    "emerged_skills": ["skill1", "skill2"],
    "skills_to_learn": ["skill1", "skill2"],
    "priority_skills": ["skill1", "skill2"],
    "estimated_time": "X months",
    "trends": ["trend1", "trend2"],
    "certifications": ["cert1", "cert2"],
    "roadmap": [{"month": 1, "skills": ["skill1"], "duration": "4 weeks", "resources": ["resource1"], "practice_tasks": ["task1"]}]
}`;
            
            const result = await this.callGemini(prompt);
            if (result) {
                const parsed = this.parseJSON(result);
                if (parsed) return parsed;
            }
        }
        
        return this.getFallbackCareerGap(skills, targetRole, breakYear, availableTime);
    }
    
    getFallbackCareerGap(skills, targetRole, breakYear, availableTime) {
        const currentYear = new Date().getFullYear();
        const breakDuration = currentYear - breakYear;
        
        const skillsToLearn = [];
        const emergedSkills = [];
        
        if (breakYear <= 2020) {
            emergedSkills.push("Cloud Computing", "DevOps", "AI/ML Basics");
            skillsToLearn.push("Python", "AWS", "Docker");
        }
        if (breakYear <= 2022) {
            emergedSkills.push("Remote Collaboration", "Agile", "Data Analytics");
            skillsToLearn.push("Kubernetes", "React", "Node.js");
        }
        if (breakYear <= 2024) {
            emergedSkills.push("Generative AI", "Prompt Engineering", "Low-Code Platforms");
            skillsToLearn.push("LangChain", "Vector Databases", "AI Integration");
        }
        
        const roadmap = [];
        const months = Math.min(availableTime, 12);
        const skillsPerMonth = Math.ceil(skillsToLearn.length / months);
        
        for (let i = 0; i < months; i++) {
            const monthSkills = skillsToLearn.slice(i * skillsPerMonth, (i + 1) * skillsPerMonth);
            if (monthSkills.length > 0) {
                roadmap.push({
                    month: i + 1,
                    skills: monthSkills,
                    duration: "4 weeks",
                    resources: monthSkills.map(s => `Online course for ${s}`),
                    practice_tasks: [`Build a project using ${monthSkills.join(' and ')}`]
                });
            }
        }
        
        return {
            emerged_skills: emergedSkills,
            skills_to_learn: skillsToLearn,
            priority_skills: skillsToLearn.slice(0, 3),
            estimated_time: `${months} months`,
            trends: ["AI Integration", "Cloud Computing", "Data-Driven Decisions"],
            certifications: [`${targetRole} Certification`, "AWS Cloud Practitioner"],
            roadmap: roadmap
        };
    }
    
    async generateBusinessIdeas(skills, budget, timeAvailability, location) {
        if (this.geminiEnabled) {
            const prompt = `Generate 5 personalized micro-business ideas for a woman with these skills: ${skills.join(', ')}
            
Constraints:
- Budget: ${budget}
- Time availability: ${timeAvailability}
- Location: ${location}

Return ONLY valid JSON array with 5 objects, each having:
{
    "title": "Business name",
    "description": "Brief description",
    "startup_cost": "estimated cost range",
    "expected_profit": "monthly profit range",
    "time_to_start": "estimated time",
    "target_customers": "who will buy",
    "execution_plan": ["step1", "step2", "step3"],
    "required_tools": ["tool1", "tool2"],
    "marketing_strategy": ["strategy1", "strategy2"],
    "best_match_score": number between 0-100
}`;
            
            const result = await this.callGemini(prompt);
            if (result) {
                const parsed = this.parseJSON(result);
                if (parsed && Array.isArray(parsed)) return parsed;
            }
        }
        
        return this.getFallbackBusinessIdeas(skills);
    }
    
    getFallbackBusinessIdeas(skills) {
        return [
            {
                title: "Virtual Assistant Services",
                description: "Provide administrative, creative, or technical support to businesses remotely.",
                startup_cost: "₹5,000 - ₹15,000",
                expected_profit: "₹15,000 - ₹40,000/month",
                time_to_start: "1-2 weeks",
                target_customers: "Small business owners, entrepreneurs",
                execution_plan: ["Set up professional workspace", "Create service packages", "Network with potential clients"],
                required_tools: ["Computer", "Internet", "Phone"],
                marketing_strategy: ["LinkedIn networking", "Referral program"],
                best_match_score: 85
            },
            {
                title: "Social Media Management",
                description: "Help small businesses grow their online presence.",
                startup_cost: "₹10,000 - ₹20,000",
                expected_profit: "₹20,000 - ₹50,000/month",
                time_to_start: "2-3 weeks",
                target_customers: "Small businesses, startups",
                execution_plan: ["Build portfolio", "Create service packages", "Reach out to local businesses"],
                required_tools: ["Smartphone", "Canva", "Scheduling tools"],
                marketing_strategy: ["Showcase your own growth", "Offer free audit"],
                best_match_score: 80
            }
        ];
    }
    
    async searchJobs(keywords, location) {
        if (this.jsearchKey && this.jsearchKey !== 'YOUR_RAPIDAPI_KEY_HERE') {
            try {
                const query = `${keywords} in ${location}`;
                const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': this.jsearchKey,
                        'X-RapidAPI-Host': this.jsearchHost
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return this.formatJobResults(data.data || []);
                }
            } catch (error) {
                console.error('JSearch API error:', error);
            }
        }
        
        return this.getFallbackJobs(keywords);
    }
    
    formatJobResults(jobs) {
        return jobs.map(job => ({
            title: job.job_title,
            company: job.employer_name,
            location: job.job_city || job.job_country,
            salary: job.job_min_salary ? `${job.job_min_salary} - ${job.job_max_salary} ${job.job_salary_currency}` : 'Competitive',
            description: job.job_description?.substring(0, 200) || 'Click to view full details',
            apply_link: job.job_apply_link,
            posted: job.job_posted_at_datetime
        }));
    }
    
    getFallbackJobs(keywords) {
        return [
            { title: `${keywords} Developer`, company: 'Tech Solutions Inc', location: 'Remote', salary: '8-15 LPA', description: `Looking for experienced ${keywords} developers. Full-time remote position.`, apply_link: '#', posted: '2024-01-01' },
            { title: `Senior ${keywords} Engineer`, company: 'Innovation Labs', location: 'Bangalore', salary: '12-20 LPA', description: `Lead development team working on cutting-edge projects using ${keywords}.`, apply_link: '#', posted: '2024-01-02' }
        ];
    }
    
    parseJSON(text) {
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(text);
        } catch {
            return null;
        }
    }
}

window.aiService = new AIService();