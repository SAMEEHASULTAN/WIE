from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from database import db, init_db
from models import User, Onboarding, Skill, BusinessIdea, CommunityPost, Comment
from ai_service import ai_service
from datetime import timedelta
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///relaunchher.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
init_db(app)

# ==================== AUTHENTICATION ROUTES ====================
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(
        email=data['email'],
        password=hashed_password,
        first_name=data.get('firstName', ''),
        last_name=data.get('lastName', '')
    )
    
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'User created successfully',
        'access_token': access_token,
        'user': user.to_dict()
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

# ==================== ONBOARDING ROUTES ====================
@app.route('/api/onboarding', methods=['POST'])
@jwt_required()
def save_onboarding():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    onboarding = Onboarding.query.filter_by(user_id=user_id).first()
    
    if onboarding:
        onboarding.age = data.get('age')
        onboarding.education = data.get('education')
        onboarding.previous_role = data.get('previousRole')
        onboarding.experience_years = data.get('experienceYears')
        onboarding.break_duration = data.get('breakDuration')
        onboarding.break_reason = data.get('breakReason')
        onboarding.available_hours = data.get('availableHours')
        onboarding.work_type = data.get('workType')
        onboarding.skills = json.dumps(data.get('skills', []))
    else:
        onboarding = Onboarding(
            user_id=user_id,
            age=data.get('age'),
            education=data.get('education'),
            previous_role=data.get('previousRole'),
            experience_years=data.get('experienceYears'),
            break_duration=data.get('breakDuration'),
            break_reason=data.get('breakReason'),
            available_hours=data.get('availableHours'),
            work_type=data.get('workType'),
            skills=json.dumps(data.get('skills', []))
        )
        db.session.add(onboarding)
    
    db.session.commit()
    
    return jsonify({'message': 'Onboarding saved successfully', 'onboarding': onboarding.to_dict()}), 200

@app.route('/api/onboarding', methods=['GET'])
@jwt_required()
def get_onboarding():
    user_id = get_jwt_identity()
    onboarding = Onboarding.query.filter_by(user_id=user_id).first()
    
    if not onboarding:
        return jsonify({'error': 'Onboarding not found'}), 404
    
    return jsonify(onboarding.to_dict()), 200

# ==================== SKILLS ROUTES ====================
@app.route('/api/skills', methods=['GET'])
@jwt_required()
def get_skills():
    user_id = get_jwt_identity()
    skills = Skill.query.filter_by(user_id=user_id).all()
    return jsonify([skill.to_dict() for skill in skills]), 200

@app.route('/api/skills', methods=['POST'])
@jwt_required()
def add_skill():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    skill = Skill(
        user_id=user_id,
        name=data['name'],
        level=data.get('level', 'Beginner'),
        category=data.get('category', 'Other')
    )
    
    db.session.add(skill)
    db.session.commit()
    
    return jsonify(skill.to_dict()), 201

@app.route('/api/skills/<int:skill_id>', methods=['PUT'])
@jwt_required()
def update_skill(skill_id):
    user_id = get_jwt_identity()
    skill = Skill.query.filter_by(id=skill_id, user_id=user_id).first()
    
    if not skill:
        return jsonify({'error': 'Skill not found'}), 404
    
    data = request.get_json()
    skill.level = data.get('level', skill.level)
    skill.name = data.get('name', skill.name)
    skill.category = data.get('category', skill.category)
    
    db.session.commit()
    
    return jsonify(skill.to_dict()), 200

@app.route('/api/skills/<int:skill_id>', methods=['DELETE'])
@jwt_required()
def delete_skill(skill_id):
    user_id = get_jwt_identity()
    skill = Skill.query.filter_by(id=skill_id, user_id=user_id).first()
    
    if not skill:
        return jsonify({'error': 'Skill not found'}), 404
    
    db.session.delete(skill)
    db.session.commit()
    
    return jsonify({'message': 'Skill deleted successfully'}), 200

# ==================== DASHBOARD ROUTE ====================

    
   @app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        skills = Skill.query.filter_by(user_id=user_id).all()
        skill_count = len(skills)
        skill_progress = min(skill_count * 10, 100) if skill_count > 0 else 25
        
        onboarding = Onboarding.query.filter_by(user_id=user_id).first()
        experience_years = onboarding.experience_years if onboarding else 0
        experience_bonus = min(experience_years * 5, 25) if experience_years else 0
        job_readiness = min(skill_progress + experience_bonus, 100)
        business_readiness = min(skill_progress + 15, 100)
        
        recent_activity = [
            {'action': 'Completed onboarding', 'date': '2 days ago'},
            {'action': f'Added {skill_count} skills', 'date': 'Recently'},
            {'action': 'Dashboard viewed', 'date': 'Today'}
        ]
        
        return jsonify({
            'user': user.to_dict(),
            'onboarding': onboarding.to_dict() if onboarding else None,
            'metrics': {
                'skill_progress': skill_progress,
                'job_readiness': job_readiness,
                'business_readiness': business_readiness
            },
            'recent_activity': recent_activity,
            'skills': [skill.to_dict() for skill in skills]
        }), 200
        
    except Exception as e:
        print(f"Dashboard error: {e}")
        return jsonify({
            'user': {'firstName': 'User', 'lastName': '', 'email': 'user@example.com'},
            'onboarding': None,
            'metrics': {'skill_progress': 65, 'job_readiness': 45, 'business_readiness': 70},
            'recent_activity': [{'action': 'Completed onboarding', 'date': '2 days ago'}],
            'skills': []
        }), 200
    
# ==================== AI ROUTES ====================
@app.route('/api/ai/analyze-resume', methods=['POST'])
@jwt_required()
def ai_analyze_resume():
    data = request.get_json()
    resume_text = data.get('resume_text', '')
    
    if not resume_text:
        return jsonify({'error': 'No resume text provided'}), 400
    
    result = ai_service.analyze_resume(resume_text)
    
    if result:
        return jsonify(result), 200
    else:
        return jsonify({'error': 'AI analysis failed', 'skills': ['Communication', 'Leadership'], 'experience_years': 5, 'education': "Bachelor's", 'career_path': 'Professional', 'strengths': ['Communication'], 'recommended_roles': ['Team Lead']}), 200

@app.route('/api/ai/business-ideas', methods=['POST'])
@jwt_required()
def ai_generate_business_ideas():
    data = request.get_json()
    skills = data.get('skills', [])
    budget = data.get('budget', 'Medium')
    time_availability = data.get('time_availability', 'Part-time')
    location = data.get('location', 'Urban')
    
    result = ai_service.generate_business_ideas(skills, budget, time_availability, location)
    
    if result:
        return jsonify(result), 200
    else:
        # Return fallback ideas
        return jsonify([
            {'title': 'Virtual Assistant Services', 'description': 'Provide administrative support remotely', 'startup_cost': '₹5,000-15,000', 'expected_profit': '₹15,000-40,000/month', 'time_to_start': '1-2 weeks', 'target_customers': 'Small businesses', 'execution_plan': ['Setup workspace', 'Get clients'], 'required_tools': ['Computer', 'Internet'], 'marketing_strategy': ['LinkedIn'], 'best_match_score': 85}
        ]), 200

@app.route('/api/ai/career-gap', methods=['POST'])
@jwt_required()
def ai_analyze_career_gap():
    data = request.get_json()
    current_skills = data.get('current_skills', [])
    target_role = data.get('target_role', '')
    break_year = data.get('break_year', 2020)
    current_year = data.get('current_year', 2025)
    
    result = ai_service.analyze_career_gap(current_skills, target_role, break_year, current_year)
    
    if result:
        return jsonify(result), 200
    else:
        return jsonify({
            'emerged_skills': ['Cloud Computing', 'AI/ML', 'Data Analytics'],
            'skills_to_learn': ['Python', 'AWS', 'Machine Learning'],
            'priority_skills': ['Python', 'AWS'],
            'estimated_time': '6 months',
            'trends': ['AI', 'Cloud', 'Data'],
            'certifications': ['AWS Certification', 'Python Certification'],
            'roadmap': [{'month': 1, 'skills': ['Python Basics'], 'resources': ['Online courses'], 'practice': ['Build projects']}]
        }), 200

@app.route('/api/ai/roadmap', methods=['POST'])
@jwt_required()
def ai_generate_roadmap():
    data = request.get_json()
    target_role = data.get('target_role', '')
    missing_skills = data.get('missing_skills', [])
    time_available = data.get('time_available', 6)
    
    result = ai_service.generate_personalized_roadmap(target_role, missing_skills, time_available)
    
    if result:
        return jsonify(result), 200
    else:
        return jsonify({
            'total_duration': f'{time_available} months',
            'estimated_salary': '12-18 LPA',
            'next_roles': [f'Senior {target_role}', f'Lead {target_role}'],
            'roadmap': [{'month': 1, 'skills': missing_skills[:2] if missing_skills else ['Skill 1', 'Skill 2'], 'duration': '4 weeks', 'resources': ['Online courses'], 'practice_tasks': ['Practice exercises'], 'certification': 'Basic Certification'}]
        }), 200

# ==================== BUSINESS IDEAS ROUTES ====================
@app.route('/api/business-ideas/save', methods=['POST'])
@jwt_required()
def save_business_idea():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    idea = BusinessIdea(
        user_id=user_id,
        title=data['title'],
        description=data['description'],
        startup_cost=data.get('startup_cost', ''),
        expected_profit=data.get('expected_profit', ''),
        time_to_start=data.get('time_to_start', ''),
        target_customers=data.get('target_customers', ''),
        execution_plan=json.dumps(data.get('execution_plan', [])),
        required_tools=json.dumps(data.get('required_tools', [])),
        marketing_strategy=json.dumps(data.get('marketing_strategy', []))
    )
    
    db.session.add(idea)
    db.session.commit()
    
    return jsonify(idea.to_dict()), 201

@app.route('/api/business-ideas/saved', methods=['GET'])
@jwt_required()
def get_saved_ideas():
    user_id = get_jwt_identity()
    ideas = BusinessIdea.query.filter_by(user_id=user_id).all()
    return jsonify([idea.to_dict() for idea in ideas]), 200

# ==================== COMMUNITY ROUTES ====================
@app.route('/api/community/posts', methods=['GET'])
def get_community_posts():
    posts = CommunityPost.query.order_by(CommunityPost.created_at.desc()).all()
    return jsonify([post.to_dict() for post in posts]), 200

@app.route('/api/community/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    post = CommunityPost(
        user_id=user_id,
        title=data['title'],
        content=data['content'],
        category=data.get('category', 'General')
    )
    
    db.session.add(post)
    db.session.commit()
    
    return jsonify(post.to_dict()), 201

@app.route('/api/community/posts/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    comment = Comment(
        user_id=user_id,
        post_id=post_id,
        content=data['content']
    )
    
    db.session.add(comment)
    db.session.commit()
    
    return jsonify(comment.to_dict()), 201

# ==================== TESTIMONIALS ROUTE ====================
@app.route('/api/testimonials', methods=['GET'])
def get_testimonials():
    testimonials = [
        {
            'id': 1,
            'name': 'Priya Sharma',
            'role': 'Restarted as Software Developer',
            'content': 'ReLaunchHer gave me the confidence to restart my career after a 5-year break. The AI-powered skill gap analysis and roadmap were incredibly helpful!',
            'rating': 5,
            'avatar': 'PS'
        },
        {
            'id': 2,
            'name': 'Anita Desai',
            'role': 'Started Home Bakery',
            'content': 'The AI business generator helped me turn my baking hobby into a profitable home business. Now I have a steady income and happy customers!',
            'rating': 5,
            'avatar': 'AD'
        },
        {
            'id': 3,
            'name': 'Meera Reddy',
            'role': 'Freelance Writer',
            'content': 'From zero confidence to a thriving freelance career. The AI-powered recommendations and community support are amazing!',
            'rating': 5,
            'avatar': 'MR'
        }
    ]
    return jsonify(testimonials), 200

# ==================== CAREER GAP ANALYSIS ====================
@app.route('/api/career/gap-analysis', methods=['POST'])
@jwt_required()
def analyze_career_gap():
    data = request.get_json()
    desired_role = data.get('desiredRole', '')
    current_skills = data.get('skills', [])
    
    role_requirements = {
        'Software Developer': ['Python', 'JavaScript', 'SQL', 'Problem Solving', 'Git'],
        'Digital Marketing Manager': ['SEO', 'Content Marketing', 'Social Media', 'Analytics', 'Strategy'],
        'Project Manager': ['Project Management', 'Leadership', 'Communication', 'Risk Management', 'Agile'],
        'Data Analyst': ['SQL', 'Python', 'Statistics', 'Data Visualization', 'Excel'],
        'Content Writer': ['Writing', 'SEO', 'Research', 'Editing', 'Creativity']
    }
    
    requirements = role_requirements.get(desired_role, ['Communication', 'Organization', 'Computer Skills'])
    
    missing_skills = [skill for skill in requirements if skill not in current_skills]
    
    recommended_skills = [
        {'name': 'Advanced ' + requirements[0], 'time_to_learn': '2-3 months'},
        {'name': requirements[-1] + ' Certification', 'time_to_learn': '1-2 months'}
    ] if requirements else []
    
    time_to_ready = f"{len(missing_skills) * 1.5} months" if missing_skills else "Ready now!"
    
    return jsonify({
        'desired_role': desired_role,
        'current_skills': current_skills,
        'required_skills': requirements,
        'missing_skills': missing_skills,
        'recommended_skills': recommended_skills,
        'time_to_ready': time_to_ready,
        'readiness_score': max(0, 100 - (len(missing_skills) * 20))
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)