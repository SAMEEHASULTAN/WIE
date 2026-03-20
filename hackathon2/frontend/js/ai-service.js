// ai-service.js - Complete with JSearch API
console.log("✅ ai-service.js loaded");

class AIService {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
        // !!! IMPORTANT: Replace with your actual RapidAPI key from https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch !!!
        this.jsearchKey = 'c908487722msh9e501e6608da515p131ed5jsnb57983055943'; // <-- PUT YOUR KEY HERE
        this.jsearchHost = 'jsearch.p.rapidapi.com';
        
        // Check if API key is set
        if (this.jsearchKey === 'YOUR_RAPIDAPI_KEY_HERE' || this.jsearchKey === '') {
            console.warn('⚠️ JSearch API key not set. Job search will use fallback data. Get free key from https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch');
        }
    }
    
    // ==================== RESUME PARSING ====================
    parseResume(resumeText) {
        const lowerText = resumeText.toLowerCase();
        
        // Technical Skills Detection
        const technicalSkills = {
            programming: ['python', 'java', 'javascript', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'typescript', 'go', 'rust'],
            web: ['html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring'],
            database: ['sql', 'mysql', 'postgresql', 'mongodb', 'oracle', 'redis', 'cassandra', 'firebase'],
            cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'devops'],
            data: ['python', 'pandas', 'numpy', 'tensorflow', 'machine learning', 'data analysis', 'tableau', 'power bi', 'excel'],
            testing: ['selenium', 'junit', 'pytest', 'qa', 'quality assurance']
        };
        
        // Soft Skills Detection
        const softSkills = [
            'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
            'time management', 'adaptability', 'creativity', 'emotional intelligence', 'conflict resolution',
            'negotiation', 'presentation', 'public speaking', 'writing', 'collaboration', 'organization'
        ];
        
        // Extract Technical Skills
        const detectedTechSkills = [];
        for (const [category, skills] of Object.entries(technicalSkills)) {
            for (const skill of skills) {
                if (lowerText.includes(skill.toLowerCase())) {
                    detectedTechSkills.push(skill);
                }
            }
        }
        
        // Extract Soft Skills
        const detectedSoftSkills = [];
        for (const skill of softSkills) {
            if (lowerText.includes(skill.toLowerCase())) {
                detectedSoftSkills.push(skill);
            }
        }
        
        // Extract Experience
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
        
        // Extract Education
        let education = "Not specified";
        const eduKeywords = ['b.tech', 'b.e', 'bachelor', 'master', 'm.tech', 'mca', 'mba', 'phd', 'b.sc', 'm.sc'];
        for (const edu of eduKeywords) {
            if (lowerText.includes(edu)) {
                education = edu.toUpperCase();
                break;
            }
        }
        
        // Extract Name
        let name = "Candidate";
        const lines = resumeText.split('\n');
        for (let line of lines) {
            line = line.trim();
            if (line && line.length < 50 && !line.includes('@') && !line.includes('http') && !line.includes('resume')) {
                name = line;
                break;
            }
        }
        
        // Detect Career Path
        let careerPath = "Professional";
        if (detectedTechSkills.some(s => ['python', 'java', 'javascript', 'react', 'node'].includes(s))) {
            careerPath = "Software Developer";
        } else if (detectedTechSkills.some(s => ['sql', 'mysql', 'postgresql', 'mongodb'].includes(s))) {
            careerPath = "Database Administrator";
        } else if (detectedTechSkills.some(s => ['excel', 'tableau', 'power bi', 'data analysis'].includes(s))) {
            careerPath = "Data Analyst";
        } else if (detectedSoftSkills.some(s => ['marketing', 'social media', 'seo'].includes(s))) {
            careerPath = "Digital Marketing";
        } else if (detectedSoftSkills.some(s => ['project management', 'agile', 'scrum'].includes(s))) {
            careerPath = "Project Manager";
        }
        
        // Recommended Roles
        const recommendedRoles = [];
        if (detectedTechSkills.some(s => ['python', 'java', 'javascript'].includes(s))) {
            recommendedRoles.push("Software Developer", "Full Stack Developer");
        }
        if (detectedTechSkills.some(s => ['sql', 'mysql', 'postgresql'].includes(s))) {
            recommendedRoles.push("Database Administrator", "Data Engineer");
        }
        if (detectedTechSkills.some(s => ['excel', 'tableau', 'data analysis'].includes(s))) {
            recommendedRoles.push("Data Analyst", "Business Analyst");
        }
        if (detectedSoftSkills.some(s => ['marketing', 'social media'].includes(s))) {
            recommendedRoles.push("Digital Marketing Specialist", "Social Media Manager");
        }
        if (detectedSoftSkills.some(s => ['project management', 'agile'].includes(s))) {
            recommendedRoles.push("Project Manager", "Scrum Master");
        }
        if (recommendedRoles.length === 0) {
            recommendedRoles.push("Team Lead", "Operations Manager", "Business Development Executive");
        }
        
        return {
            name: name,
            skills: {
                technical: [...new Set(detectedTechSkills)],
                soft: [...new Set(detectedSoftSkills)]
            },
            allSkills: [...new Set([...detectedTechSkills, ...detectedSoftSkills])],
            experience_years: experience || 3,
            education: education,
            career_path: careerPath,
            strengths: detectedSoftSkills.slice(0, 5),
            recommended_roles: recommendedRoles,
            raw_analysis: {
                technical_skills_count: detectedTechSkills.length,
                soft_skills_count: detectedSoftSkills.length,
                experience_level: experience >= 8 ? "Senior" : experience >= 4 ? "Mid-Level" : "Entry-Level"
            }
        };
    }
    
    // ==================== BUSINESS IDEAS GENERATION ====================
    generateBusinessIdeas(skills, budget, timeAvailability, location, customSkills = []) {
        const allSkills = [...skills, ...customSkills].map(s => s.toLowerCase());
        
        const businessDatabase = [
            {
                title: "Virtual Assistant Services",
                description: "Provide administrative, creative, or technical support to businesses remotely.",
                matchKeywords: ["communication", "organization", "computer", "writing", "customer service"],
                startup_cost: budget === 'Low' ? "₹5,000 - ₹10,000" : budget === 'Medium' ? "₹10,000 - ₹20,000" : "₹20,000 - ₹35,000",
                expected_profit: "₹15,000 - ₹40,000/month",
                time_to_start: "1-2 weeks",
                target_customers: "Small business owners, entrepreneurs, busy professionals",
                execution_plan: [
                    "Set up a professional workspace with good internet",
                    "Create a business website or profile on freelance platforms",
                    "Define your service packages",
                    "Network with potential clients",
                    "Start with 2-3 clients and expand through referrals"
                ],
                required_tools: ["Computer/Laptop", "High-speed internet", "Smartphone", "Microsoft Office"],
                marketing_strategy: ["LinkedIn networking", "Facebook groups", "Referral discount program"]
            },
            {
                title: "Social Media Management",
                description: "Help small businesses grow their online presence by managing their social media accounts.",
                matchKeywords: ["social media", "marketing", "content", "writing", "design", "instagram"],
                startup_cost: budget === 'Low' ? "₹10,000 - ₹15,000" : budget === 'Medium' ? "₹15,000 - ₹30,000" : "₹30,000 - ₹50,000",
                expected_profit: "₹20,000 - ₹60,000/month",
                time_to_start: "2-4 weeks",
                target_customers: "Small businesses, startups, local shops",
                execution_plan: [
                    "Build your own social media portfolio",
                    "Create sample content for different industries",
                    "Learn social media tools (Canva, Buffer, Later)",
                    "Define service packages",
                    "Reach out to local businesses with proposals"
                ],
                required_tools: ["Smartphone with good camera", "Canva", "Scheduling tools", "Analytics tools"],
                marketing_strategy: ["Showcase your own social media growth", "Offer free social media audit", "Create case studies"]
            },
            {
                title: "Online Tutoring & Coaching",
                description: "Share your expertise by teaching students or coaching professionals.",
                matchKeywords: ["teaching", "training", "communication", "education", "coaching"],
                startup_cost: "₹2,000 - ₹8,000",
                expected_profit: "₹10,000 - ₹50,000/month",
                time_to_start: "1-2 weeks",
                target_customers: "Students, professionals, exam aspirants",
                execution_plan: [
                    "Identify your teaching subjects",
                    "Create structured lesson plans",
                    "Set up online teaching space",
                    "Register on tutoring platforms",
                    "Offer free demo sessions",
                    "Collect testimonials"
                ],
                required_tools: ["Computer with webcam", "Good internet", "Digital whiteboard", "Headset"],
                marketing_strategy: ["Create educational content on YouTube", "Partner with schools", "Referral discounts"]
            },
            {
                title: "Handmade Crafts Business",
                description: "Create and sell unique handmade products like jewelry, candles, home decor.",
                matchKeywords: ["craft", "design", "art", "creative", "handmade", "sewing", "painting"],
                startup_cost: budget === 'Low' ? "₹3,000 - ₹8,000" : budget === 'Medium' ? "₹8,000 - ₹15,000" : "₹15,000 - ₹30,000",
                expected_profit: "₹5,000 - ₹30,000/month",
                time_to_start: "1-3 weeks",
                target_customers: "Gift shoppers, home decor enthusiasts, event planners",
                execution_plan: [
                    "Choose your product niche",
                    "Source high-quality raw materials",
                    "Create sample products",
                    "Set up Instagram and Facebook shop",
                    "Join online marketplaces",
                    "Participate in local craft fairs"
                ],
                required_tools: ["Craft supplies", "Good camera", "Packaging materials", "Basic accounting"],
                marketing_strategy: ["Instagram Reels", "Collaborate with influencers", "Offer customization"]
            },
            {
                title: "Content Writing Services",
                description: "Create engaging content for blogs, websites, social media, and marketing materials.",
                matchKeywords: ["writing", "content", "blog", "copywriting", "editing", "seo"],
                startup_cost: "₹2,000 - ₹10,000",
                expected_profit: "₹10,000 - ₹40,000/month",
                time_to_start: "1-2 weeks",
                target_customers: "Bloggers, businesses, marketing agencies",
                execution_plan: [
                    "Create a portfolio of writing samples",
                    "Choose your niche",
                    "Set up profiles on freelance platforms",
                    "Create a professional website",
                    "Network with marketing agencies"
                ],
                required_tools: ["Computer", "Grammarly", "SEO tools", "Content management systems"],
                marketing_strategy: ["Share writing tips on LinkedIn", "Guest post on popular blogs", "Offer free content audit"]
            },
            {
                title: "Web Development Services",
                description: "Build websites and web applications for small businesses and entrepreneurs.",
                matchKeywords: ["programming", "coding", "web", "html", "css", "javascript", "developer"],
                startup_cost: budget === 'Low' ? "₹5,000 - ₹15,000" : budget === 'Medium' ? "₹15,000 - ₹30,000" : "₹30,000 - ₹60,000",
                expected_profit: "₹20,000 - ₹80,000/month",
                time_to_start: "2-4 weeks",
                target_customers: "Small businesses, startups, entrepreneurs",
                execution_plan: [
                    "Build a portfolio of sample websites",
                    "Learn popular frameworks",
                    "Set up development environment",
                    "Create service packages",
                    "Network with local businesses"
                ],
                required_tools: ["Computer", "Code editor", "Design tools", "Hosting accounts"],
                marketing_strategy: ["Showcase portfolio on GitHub", "Offer free website audit", "Partner with agencies"]
            }
        ];
        
        // Calculate match score
        const scoredIdeas = businessDatabase.map(business => {
            let matchScore = 30;
            allSkills.forEach(skill => {
                if (business.matchKeywords.some(keyword => skill.includes(keyword))) {
                    matchScore += 15;
                }
                if (business.title.toLowerCase().includes(skill)) {
                    matchScore += 10;
                }
            });
            return { ...business, best_match_score: Math.min(matchScore, 100) };
        });
        
        return scoredIdeas.sort((a, b) => b.best_match_score - a.best_match_score).slice(0, 6);
    }
    
    // ==================== JOB SEARCH ====================
    async searchJobs(keywords, location) {
        // If API key is not set, use fallback data
        if (!this.jsearchKey || this.jsearchKey === 'YOUR_RAPIDAPI_KEY_HERE') {
            console.log('Using fallback job data (API key not configured)');
            return this.getFallbackJobs(keywords);
        }
        
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
            } else if (response.status === 401) {
                console.error('Invalid JSearch API key. Please get a valid key from https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch');
                return this.getFallbackJobs(keywords);
            } else {
                return this.getFallbackJobs(keywords);
            }
        } catch (error) {
            console.error('JSearch API error:', error);
            return this.getFallbackJobs(keywords);
        }
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
        const jobs = [
            { title: `${keywords} Developer`, company: 'Tech Solutions Inc', location: 'Remote', salary: '8-15 LPA', description: 'Looking for experienced developers with ${keywords} skills. Full-time remote position.', apply_link: '#', posted: '2024-01-01' },
            { title: `Senior ${keywords} Engineer`, company: 'Innovation Labs', location: 'Bangalore', salary: '12-20 LPA', description: 'Lead development team working on cutting-edge projects using ${keywords}.', apply_link: '#', posted: '2024-01-02' },
            { title: `${keywords} Specialist`, company: 'Digital Agency', location: 'Mumbai', salary: '6-10 LPA', description: 'Entry level position for passionate ${keywords} professionals.', apply_link: '#', posted: '2024-01-03' },
            { title: `${keywords} Consultant`, company: 'Global Tech Corp', location: 'Hyderabad', salary: '10-18 LPA', description: 'Seeking experienced ${keywords} consultant for client projects.', apply_link: '#', posted: '2024-01-04' },
            { title: `${keywords} Analyst`, company: 'Data Insights Ltd', location: 'Chennai', salary: '5-9 LPA', description: 'Junior position for ${keywords} enthusiasts. Training provided.', apply_link: '#', posted: '2024-01-05' }
        ];
        
        // Customize job titles based on keywords
        return jobs.map(job => ({
            ...job,
            title: job.title.replace('${keywords}', keywords),
            description: job.description.replace('${keywords}', keywords)
        }));
    }
    
    // ==================== CAREER GAP ANALYSIS ====================
    async analyzeCareerGap(skills, targetRole, breakYear, availableTime) {
        const currentYear = new Date().getFullYear();
        
        const roleSkills = {
            "Software Developer": ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes", "Git"],
            "Data Analyst": ["Python", "SQL", "Pandas", "Tableau", "Excel", "Statistics", "Machine Learning"],
            "Project Manager": ["Agile", "Scrum", "JIRA", "Leadership", "Risk Management", "Communication"],
            "Digital Marketing": ["SEO", "Google Analytics", "Social Media", "Content Strategy", "Email Marketing"],
            "Database Administrator": ["SQL", "Oracle", "MongoDB", "PostgreSQL", "Cloud Databases", "Backup Recovery"]
        };
        
        const skillsToLearn = roleSkills[targetRole] || roleSkills["Software Developer"];
        
        const roadmap = [];
        for (let i = 1; i <= Math.min(availableTime, 12); i++) {
            const monthSkills = skillsToLearn.slice((i-1)*2, i*2);
            if (monthSkills.length > 0) {
                roadmap.push({
                    month: i,
                    skills: monthSkills,
                    duration: "4 weeks",
                    resources: monthSkills.map(s => `Online course for ${s}`),
                    practice_tasks: [`Build a project using ${monthSkills.join(' and ')}`]
                });
            }
        }
        
        const emergedSkills = [];
        if (breakYear <= 2020) emergedSkills.push("Cloud Computing", "DevOps", "AI/ML Basics");
        if (breakYear <= 2022) emergedSkills.push("Remote Collaboration", "Agile", "Data Analytics");
        if (breakYear <= 2024) emergedSkills.push("Generative AI", "Prompt Engineering", "Low-Code Platforms");
        
        return {
            emerged_skills: emergedSkills,
            skills_to_learn: skillsToLearn.slice(0, 8),
            priority_skills: skillsToLearn.slice(0, 3),
            estimated_time: `${Math.min(availableTime, 12)} months`,
            trends: ["AI Integration", "Cloud Migration", "Data-Driven Decisions"],
            certifications: [`${targetRole} Certification`, "AWS Cloud Practitioner"],
            roadmap: roadmap
        };
    }
    
    // ==================== RESUME ANALYSIS ====================
    async analyzeResumeWithAI(resumeText) {
        return this.parseResume(resumeText);
    }
    
    async analyzeResume(resumeText) {
        return this.parseResume(resumeText);
    }
    
    async generateRoadmap(targetRole, missingSkills, timeAvailable) {
        return this.analyzeCareerGap(missingSkills, targetRole, 2020, timeAvailable);
    }
    
    async generateBusinessIdeasWithAI(skills, budget, timeAvailability, location) {
        return this.generateBusinessIdeas(skills, budget, timeAvailability, location);
    }
}

// Initialize AI Service
window.aiService = new AIService();