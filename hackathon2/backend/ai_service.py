# ai_service.py - Google Gemini AI Integration
import google.generativeai as genai
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("✅ Google Gemini API configured successfully")
else:
    print("⚠️ No Gemini API key found. AI features will use fallback data.")

class AIService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro') if GEMINI_API_KEY else None
    
    def analyze_resume(self, resume_text):
        """Extract skills, experience, and career path from resume using AI"""
        if not self.model:
            return self._fallback_analysis(resume_text)
        
        prompt = f"""
        Analyze this resume and extract key information. Return ONLY valid JSON, no other text.
        
        Resume:
        {resume_text[:4000]}
        
        Return JSON with exactly these keys:
        {{
            "skills": ["skill1", "skill2", ...],
            "experience_years": number,
            "education": "degree name",
            "career_path": "current/proposed career path",
            "strengths": ["strength1", "strength2", ...],
            "recommended_roles": ["role1", "role2", ...]
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            result = self._parse_json(response.text)
            if result:
                return result
            return self._fallback_analysis(resume_text)
        except Exception as e:
            print(f"AI analysis error: {e}")
            return self._fallback_analysis(resume_text)
    
    def generate_business_ideas(self, skills, budget, time_availability, location):
        """Generate personalized business ideas using AI"""
        if not self.model:
            return self._fallback_business_ideas(skills)
        
        prompt = f"""
        Generate 5 personalized micro-business ideas for a woman with these skills: {skills}
        
        Constraints:
        - Budget: {budget}
        - Time availability: {time_availability}
        - Location: {location}
        
        Return ONLY valid JSON array with 5 objects, each having:
        {{
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
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            result = self._parse_json(response.text)
            if result and isinstance(result, list):
                return result
            return self._fallback_business_ideas(skills)
        except Exception as e:
            print(f"Business ideas error: {e}")
            return self._fallback_business_ideas(skills)
    
    def analyze_career_gap(self, current_skills, target_role, break_year, current_year):
        """Analyze skill gap and provide learning roadmap"""
        if not self.model:
            return self._fallback_career_gap(current_skills, target_role, break_year)
        
        prompt = f"""
        Analyze career gap for a professional returning to work.
        
        Current skills: {current_skills}
        Target role: {target_role}
        Career break started: {break_year}
        Current year: {current_year}
        Break duration: {current_year - break_year} years
        
        Return ONLY valid JSON with these keys:
        {{
            "emerged_skills": ["skill1", "skill2", ...],
            "skills_to_learn": ["skill1", "skill2", ...],
            "priority_skills": ["most important skills first"],
            "estimated_time": "X months",
            "trends": ["trend1", "trend2", ...],
            "certifications": ["cert1", "cert2", ...],
            "roadmap": [
                {{
                    "month": 1,
                    "skills": ["skill to learn"],
                    "resources": ["resource1", "resource2"],
                    "practice": ["task1", "task2"]
                }}
            ]
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            result = self._parse_json(response.text)
            if result:
                return result
            return self._fallback_career_gap(current_skills, target_role, break_year)
        except Exception as e:
            print(f"Career gap error: {e}")
            return self._fallback_career_gap(current_skills, target_role, break_year)
    
    def generate_personalized_roadmap(self, target_role, missing_skills, time_available):
        """Generate detailed learning roadmap"""
        if not self.model:
            return self._fallback_roadmap(target_role, missing_skills, time_available)
        
        prompt = f"""
        Create a detailed learning roadmap.
        
        Target role: {target_role}
        Skills to learn: {missing_skills}
        Time available: {time_available} months
        
        Return ONLY valid JSON with this structure:
        {{
            "total_duration": "{time_available} months",
            "estimated_salary": "salary range",
            "next_roles": ["role1", "role2"],
            "roadmap": [
                {{
                    "month": 1,
                    "skills": ["skill1", "skill2"],
                    "duration": "X weeks",
                    "resources": ["course1", "book1"],
                    "practice_tasks": ["task1", "task2"],
                    "certification": "cert name"
                }}
            ]
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            result = self._parse_json(response.text)
            if result:
                return result
            return self._fallback_roadmap(target_role, missing_skills, time_available)
        except Exception as e:
            print(f"Roadmap error: {e}")
            return self._fallback_roadmap(target_role, missing_skills, time_available)
    
    def _parse_json(self, text):
        """Extract JSON from AI response"""
        json_match = re.search(r'\{.*\}|\[.*\]', text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group())
            except:
                pass
        
        cleaned = text.strip()
        if cleaned.startswith('```json'):
            cleaned = cleaned[7:]
        if cleaned.startswith('```'):
            cleaned = cleaned[3:]
        if cleaned.endswith('```'):
            cleaned = cleaned[:-3]
        
        try:
            return json.loads(cleaned)
        except:
            return None
    
    def _fallback_analysis(self, text):
        return {
            "skills": ["Communication", "Leadership", "Problem Solving"],
            "experience_years": 5,
            "education": "Bachelor's Degree",
            "career_path": "Professional",
            "strengths": ["Communication", "Teamwork"],
            "recommended_roles": ["Team Lead", "Project Manager"]
        }
    
    def _fallback_business_ideas(self, skills):
        return [
            {
                "title": "Virtual Assistant Services",
                "description": "Provide administrative, creative, or technical support to businesses and entrepreneurs remotely.",
                "startup_cost": "₹5,000 - ₹15,000",
                "expected_profit": "₹15,000 - ₹40,000/month",
                "time_to_start": "1-2 weeks",
                "target_customers": "Small business owners, entrepreneurs",
                "execution_plan": ["Set up a professional workspace", "Create service packages", "Network with potential clients"],
                "required_tools": ["Computer", "Internet connection", "Phone"],
                "marketing_strategy": ["LinkedIn networking", "Referral program"],
                "best_match_score": 85
            },
            {
                "title": "Handmade Crafts Business",
                "description": "Create and sell handmade products like jewelry, home decor, candles, or personalized gifts.",
                "startup_cost": "₹3,000 - ₹10,000",
                "expected_profit": "₹5,000 - ₹30,000/month",
                "time_to_start": "1-3 weeks",
                "target_customers": "Gift shoppers, home decor enthusiasts",
                "execution_plan": ["Choose your product niche", "Source raw materials", "Create sample products"],
                "required_tools": ["Craft supplies", "Camera for photos", "Packaging materials"],
                "marketing_strategy": ["Instagram marketing", "Craft fairs"],
                "best_match_score": 78
            },
            {
                "title": "Online Tutoring",
                "description": "Share your knowledge by teaching students online in subjects you excel at.",
                "startup_cost": "₹2,000 - ₹8,000",
                "expected_profit": "₹10,000 - ₹50,000/month",
                "time_to_start": "1 week",
                "target_customers": "School students, college students",
                "execution_plan": ["Create lesson plans", "Set up online teaching space", "Market your services"],
                "required_tools": ["Computer", "Webcam", "Digital whiteboard"],
                "marketing_strategy": ["Social media promotion", "Referral discounts"],
                "best_match_score": 72
            }
        ]
    
    def _fallback_career_gap(self, skills, role, year):
        return {
            "emerged_skills": ["Cloud Computing", "AI/ML Integration", "Data Analytics"],
            "skills_to_learn": ["Python", "AWS", "Machine Learning"],
            "priority_skills": ["Python", "Cloud Computing"],
            "estimated_time": "6 months",
            "trends": ["AI-Powered Solutions", "Cloud Migration", "Data-Driven Decision Making"],
            "certifications": ["AWS Certified Practitioner", "Python Programming"],
            "roadmap": [
                {"month": 1, "skills": ["Python Basics"], "resources": ["Python for Everybody"], "practice": ["Build a simple calculator"]},
                {"month": 2, "skills": ["Advanced Python"], "resources": ["Data Structures in Python"], "practice": ["Solve coding problems"]}
            ]
        }
    
    def _fallback_roadmap(self, role, skills, time):
        return {
            "total_duration": f"{time} months",
            "estimated_salary": "12-18 LPA",
            "next_roles": [f"Senior {role}", f"Lead {role}"],
            "roadmap": [
                {"month": 1, "skills": skills[:2] if len(skills) >= 2 else skills, "duration": "4 weeks", "resources": ["Online courses"], "practice_tasks": ["Practice exercises"], "certification": "Basic Certification"}
            ]
        }

ai_service = AIService()