// Resume Analyzer with AI-like capabilities
console.log("✅ resume-analyzer.js loaded");

class ResumeAnalyzer {
    constructor() {
        this.skillsDatabase = {
            "Database Administrator": {
                "2015": ["Oracle", "SQL Server", "MySQL", "DB2", "Data Modeling"],
                "2016": ["PostgreSQL", "MariaDB", "Replication", "Backup Recovery"],
                "2017": ["MongoDB", "Cassandra", "NoSQL", "Redis"],
                "2018": ["Cloud Databases", "AWS RDS", "Azure SQL", "Google Cloud SQL"],
                "2019": ["DynamoDB", "BigQuery", "Snowflake", "Redshift"],
                "2020": ["Data Lakes", "Lake Formation", "Glue", "Athena"],
                "2021": ["Automated Scaling", "Performance Tuning", "Query Optimization"],
                "2022": ["Multi-cloud", "Database Migration", "Hybrid Cloud"],
                "2023": ["Vector Databases", "Pinecone", "Weaviate", "Milvus"],
                "2024": ["AI-powered DB", "Autonomous Database", "Edge Databases"]
            },
            "Software Developer": {
                "2015": ["Java", "C#", "PHP", "JavaScript", "jQuery"],
                "2016": ["AngularJS", "React", "Node.js", "Express"],
                "2017": ["Python", "Django", "Flask", "Vue.js"],
                "2018": ["Docker", "Kubernetes", "Microservices", "DevOps"],
                "2019": ["AWS", "Azure", "GCP", "Serverless"],
                "2020": ["TypeScript", "Next.js", "GraphQL", "Prisma"],
                "2021": ["CI/CD", "GitHub Actions", "Jenkins", "Terraform"],
                "2022": ["WebAssembly", "Rust", "Go", "Performance"],
                "2023": ["AI/ML Integration", "LangChain", "Prompt Engineering", "LLMs"],
                "2024": ["AI Agents", "RAG Systems", "Vector Search", "Fine-tuning"]
            },
            "Data Analyst": {
                "2015": ["Excel", "SQL", "Tableau", "QlikView"],
                "2016": ["Python", "Pandas", "NumPy", "Matplotlib"],
                "2017": ["R", "ggplot2", "Statistics", "SPSS"],
                "2018": ["Power BI", "DAX", "Power Query", "SSAS"],
                "2019": ["Big Data", "Hadoop", "Spark", "Hive"],
                "2020": ["Machine Learning", "Scikit-learn", "TensorFlow", "Keras"],
                "2021": ["Data Visualization", "D3.js", "Plotly", "Seaborn"],
                "2022": ["Data Storytelling", "Business Intelligence", "Dashboarding"],
                "2023": ["Predictive Analytics", "Forecasting", "Time Series"],
                "2024": ["AI Analytics", "AutoML", "Data Ethics", "Privacy"]
            },
            "Digital Marketing": {
                "2015": ["SEO", "Email Marketing", "Social Media", "Content Writing"],
                "2016": ["Google Analytics", "AdWords", "Facebook Ads", "PPC"],
                "2017": ["Marketing Automation", "HubSpot", "Marketo", "Mailchimp"],
                "2018": ["CRM", "Salesforce", "Lead Generation", "Conversion"],
                "2019": ["Data Analysis", "ROI Tracking", "Attribution Modeling"],
                "2020": ["Programmatic Advertising", "DSP", "SSP", "Ad Exchanges"],
                "2021": ["Influencer Marketing", "User Generated Content", "Community"],
                "2022": ["Marketing Analytics", "Cohort Analysis", "LTV"],
                "2023": ["AI Marketing Tools", "ChatGPT Marketing", "Personalization"],
                "2024": ["Generative AI Marketing", "Voice Search", "AR Marketing"]
            }
        };
        
        this.careerPaths = {
            "Database Administrator": {
                "nextRoles": ["Cloud Database Architect", "Data Engineer", "Data Platform Manager", "Database Consultant"],
                "salary": {
                    "entry": "6-8 LPA",
                    "mid": "12-18 LPA",
                    "senior": "20-35 LPA",
                    "expert": "35-50 LPA"
                },
                "certifications": ["AWS Database Specialty", "Google Cloud Database", "MongoDB Certification", "Oracle Certified Professional"]
            },
            "Software Developer": {
                "nextRoles": ["Technical Lead", "Software Architect", "Engineering Manager", "DevOps Engineer"],
                "salary": {
                    "entry": "5-8 LPA",
                    "mid": "10-20 LPA",
                    "senior": "22-35 LPA",
                    "expert": "40-60 LPA"
                },
                "certifications": ["AWS Developer", "Google Cloud Developer", "Microsoft Certified", "Kubernetes Certification"]
            },
            "Data Analyst": {
                "nextRoles": ["Data Scientist", "Business Intelligence Analyst", "Analytics Manager", "Data Engineer"],
                "salary": {
                    "entry": "4-7 LPA",
                    "mid": "8-15 LPA",
                    "senior": "16-25 LPA",
                    "expert": "28-40 LPA"
                },
                "certifications": ["Google Data Analytics", "Microsoft Data Analyst", "Tableau Desktop Specialist"]
            },
            "Digital Marketing": {
                "nextRoles": ["Marketing Manager", "Digital Strategy Head", "Brand Manager", "Growth Hacker"],
                "salary": {
                    "entry": "3-6 LPA",
                    "mid": "7-12 LPA",
                    "senior": "15-25 LPA",
                    "expert": "28-40 LPA"
                },
                "certifications": ["Google Analytics Certified", "HubSpot Marketing", "Facebook Blueprint"]
            }
        };
    }
    
    async analyzeResume(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const extractedSkills = this.extractSkills(content);
                const careerPath = this.detectCareerPath(content);
                
                resolve({
                    skills: extractedSkills,
                    careerPath: careerPath,
                    experience: this.extractExperience(content),
                    education: this.extractEducation(content),
                    name: this.extractName(content)
                });
            };
            reader.readAsText(file);
        });
    }
    
    extractSkills(content) {
        const lowerContent = content.toLowerCase();
        const allSkills = [
            "SQL", "Python", "Java", "JavaScript", "Excel", "Tableau", "AWS", 
            "MongoDB", "Oracle", "MySQL", "PostgreSQL", "React", "Node.js",
            "Django", "Flask", "Docker", "Kubernetes", "Machine Learning",
            "Data Analysis", "Marketing", "SEO", "Content Writing", "Leadership",
            "Project Management", "Communication", "Team Management"
        ];
        
        return allSkills.filter(skill => 
            lowerContent.includes(skill.toLowerCase())
        ).slice(0, 8);
    }
    
    detectCareerPath(content) {
        const lowerContent = content.toLowerCase();
        if (lowerContent.includes("database") || lowerContent.includes("dba") || lowerContent.includes("sql")) {
            return "Database Administrator";
        } else if (lowerContent.includes("developer") || lowerContent.includes("programming") || lowerContent.includes("coding")) {
            return "Software Developer";
        } else if (lowerContent.includes("data") || lowerContent.includes("analytics") || lowerContent.includes("analysis")) {
            return "Data Analyst";
        } else if (lowerContent.includes("marketing") || lowerContent.includes("social media") || lowerContent.includes("seo")) {
            return "Digital Marketing";
        }
        return "General Professional";
    }
    
    extractExperience(content) {
        const expMatch = content.match(/(\d+)\s*(?:years?|yrs?)/i);
        return expMatch ? parseInt(expMatch[1]) : 5;
    }
    
    extractEducation(content) {
        const lowerContent = content.toLowerCase();
        if (lowerContent.includes("b.tech") || lowerContent.includes("be ")) return "Bachelor's in Engineering";
        if (lowerContent.includes("mca")) return "MCA";
        if (lowerContent.includes("mba")) return "MBA";
        if (lowerContent.includes("b.sc") || lowerContent.includes("bachelor")) return "Bachelor's Degree";
        if (lowerContent.includes("m.sc") || lowerContent.includes("master")) return "Master's Degree";
        return "Bachelor's Degree";
    }
    
    extractName(content) {
        const lines = content.split('\n');
        for (let line of lines) {
            line = line.trim();
            if (line && line.length < 50 && !line.includes('@') && !line.includes('http')) {
                return line;
            }
        }
        return "Candidate";
    }
    
    calculateSkillGap(currentSkills, targetRole, breakYear) {
        const currentYear = new Date().getFullYear();
        const breakDuration = currentYear - breakYear;
        
        const roleSkills = this.skillsDatabase[targetRole] || this.skillsDatabase["Software Developer"];
        
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
            gap: gap.slice(0, 8),
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
                "Vector databases for AI applications",
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
        if (skillCount <= 10) return "8-12 months";
        return "12-15 months";
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
                    resources: this.getLearningResources(monthSkills),
                    practice: this.getPracticeTasks(monthSkills),
                    certification: this.getCertification(monthSkills[0])
                });
            }
        }
        
        if (timeAvailable > missingSkills.length) {
            roadmap.push({
                month: timeAvailable,
                skills: ["Interview Preparation", "Resume Building", "Portfolio Creation"],
                duration: "1 month",
                resources: ["Mock Interviews", "Resume Templates", "Portfolio Examples"],
                practice: ["Practice with common questions", "Build project portfolio", "Network on LinkedIn"],
                certification: "Job Ready"
            });
        }
        
        const careerInfo = this.careerPaths[targetRole] || this.careerPaths["Software Developer"];
        let salaryEstimate = careerInfo.salary.mid;
        if (timeAvailable < 4) salaryEstimate = careerInfo.salary.entry;
        else if (timeAvailable > 8) salaryEstimate = careerInfo.salary.senior;
        
        return {
            roadmap: roadmap,
            totalDuration: `${timeAvailable} months`,
            targetRole: targetRole,
            targetLocation: targetLocation,
            salaryEstimate: salaryEstimate,
            nextRoles: careerInfo.nextRoles,
            certifications: careerInfo.certifications
        };
    }
    
    getLearningResources(skills) {
        const resources = [];
        skills.forEach(skill => {
            if (skill.includes("Python")) resources.push("Python for Everybody (Coursera)");
            else if (skill.includes("AWS")) resources.push("AWS Training & Certification");
            else if (skill.includes("MongoDB")) resources.push("MongoDB University");
            else if (skill.includes("React")) resources.push("React Documentation + Tutorials");
            else if (skill.includes("Docker")) resources.push("Docker Mastery Course");
            else if (skill.includes("Kubernetes")) resources.push("CKAD Certification Path");
            else if (skill.includes("Machine Learning")) resources.push("Andrew Ng's ML Course");
            else if (skill.includes("Data")) resources.push("Google Data Analytics Professional Certificate");
            else resources.push(`${skill} - Online Courses & Documentation`);
        });
        return [...new Set(resources)].slice(0, 3);
    }
    
    getPracticeTasks(skills) {
        const tasks = [];
        skills.forEach(skill => {
            if (skill.includes("Python")) tasks.push("Build a data analysis project with Python");
            else if (skill.includes("AWS")) tasks.push("Deploy a sample application on AWS");
            else if (skill.includes("MongoDB")) tasks.push("Design a database schema for an e-commerce site");
            else if (skill.includes("React")) tasks.push("Create a responsive dashboard with React");
            else if (skill.includes("Docker")) tasks.push("Containerize a web application");
            else if (skill.includes("SQL")) tasks.push("Optimize complex queries for performance");
            else tasks.push(`Complete a hands-on project using ${skill}`);
        });
        return [...new Set(tasks)].slice(0, 3);
    }
    
    getCertification(skill) {
        const certs = {
            "AWS": "AWS Certified Solutions Architect",
            "Python": "PCAP - Certified Python Programmer",
            "MongoDB": "MongoDB Certified Developer",
            "React": "Meta Front-End Developer Certificate",
            "Docker": "Docker Certified Associate",
            "Kubernetes": "CKA - Certified Kubernetes Administrator",
            "Machine Learning": "TensorFlow Developer Certificate",
            "Data Analysis": "Google Data Analytics Certificate",
            "Project Management": "PMP Certification",
            "Scrum": "Certified ScrumMaster"
        };
        
        for (let key in certs) {
            if (skill.includes(key)) {
                return certs[key];
            }
        }
        return `${skill} Professional Certificate`;
    }
}

window.resumeAnalyzer = new ResumeAnalyzer();