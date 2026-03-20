from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from database import db, init_db
from models import User, Onboarding, Skill, BusinessIdea, CommunityPost, Comment
from datetime import timedelta
import os
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

# Authentication Routes
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Check if user exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    # Create new user
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(
        email=data['email'],
        password=hashed_password,
        first_name=data.get('firstName', ''),
        last_name=data.get('lastName', '')
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Create access token
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

# Onboarding Routes
@app.route('/api/onboarding', methods=['POST'])
@jwt_required()
def save_onboarding():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    onboarding = Onboarding.query.filter_by(user_id=user_id).first()
    
    if onboarding:
        # Update existing
        onboarding.age = data.get('age')
        onboarding.education = data.get('education')
        onboarding.previous_role = data.get('previousRole')
        onboarding.experience_years = data.get('experienceYears')
        onboarding.break_duration = data.get('breakDuration')
        onboarding.break_reason = data.get('breakReason')
        onboarding.available_hours = data.get('availableHours')
        onboarding.work_type = data.get('workType')
        onboarding.skills = data.get('skills', [])
    else:
        # Create new
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
            skills=data.get('skills', [])
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

# Skills Routes
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

# Business Ideas Routes
@app.route('/api/business-ideas/generate', methods=['POST'])
@jwt_required()
def generate_business_ideas():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    skills = data.get('skills', [])
    budget = data.get('budget', 'Medium')
    time_availability = data.get('timeAvailability', 'Part-time')
    location = data.get('location', 'Urban')
    
    # Generate ideas based on inputs
    ideas = generate_ideas_based_on_criteria(skills, budget, time_availability, location)
    
    return jsonify(ideas), 200

def generate_ideas_based_on_criteria(skills, budget, time_availability, location):
    """Generate business ideas based on user criteria"""
    
    # Predefined business ideas with matching criteria
    all_ideas = [
        {
            "id": 1,
            "title": "Virtual Assistant Services",
            "description": "Provide administrative, creative, or technical support to businesses and entrepreneurs remotely.",
            "matching_skills": ["Communication", "Organization", "Computer Skills", "Time Management"],
            "budget_level": "Low",
            "time_requirement": "Flexible",
            "location_type": "Any",
            "startup_cost": "₹5,000 - ₹15,000",
            "expected_profit": "₹15,000 - ₹40,000/month",
            "time_to_start": "1-2 weeks",
            "target_customers": "Small business owners, entrepreneurs, busy professionals",
            "best_match_score": 0,
            "execution_plan": [
                "Set up a professional workspace at home",
                "Create a business website/profile",
                "Define your service packages",
                "Register on freelance platforms",
                "Network with potential clients",
                "Start with 2-3 clients and expand"
            ],
            "required_tools": ["Computer", "Internet connection", "Phone", "Basic software (MS Office/Google Suite)", "Project management tools"],
            "marketing_strategy": [
                "LinkedIn networking",
                "Facebook groups for entrepreneurs",
                "Referral program",
                "Free consultation offers"
            ]
        },
        {
            "id": 2,
            "title": "Handmade Crafts & Artisan Products",
            "description": "Create and sell handmade products like jewelry, home decor, candles, or personalized gifts.",
            "matching_skills": ["Creativity", "Crafting", "Attention to Detail", "Design"],
            "budget_level": "Low",
            "time_requirement": "Part-time",
            "location_type": "Any",
            "startup_cost": "₹3,000 - ₹10,000",
            "expected_profit": "₹5,000 - ₹30,000/month",
            "time_to_start": "1-3 weeks",
            "target_customers": "Gift shoppers, home decor enthusiasts, event planners",
            "best_match_score": 0,
            "execution_plan": [
                "Choose your product niche",
                "Source raw materials",
                "Create sample products",
                "Set up Instagram and Facebook shop",
                "Join online marketplaces (Etsy, Amazon Handmade)",
                "Participate in local craft fairs"
            ],
            "required_tools": ["Craft supplies", "Camera for photos", "Packaging materials", "Basic accounting knowledge"],
            "marketing_strategy": [
                "Instagram marketing",
                "Collaborate with influencers",
                "Offer customization",
                "Build email list"
            ]
        },
        {
            "id": 3,
            "title": "Online Tutoring & Coaching",
            "description": "Share your knowledge by teaching students online in subjects you excel at.",
            "matching_skills": ["Teaching", "Communication", "Subject Expertise", "Patience"],
            "budget_level": "Low",
            "time_requirement": "Part-time",
            "location_type": "Any",
            "startup_cost": "₹2,000 - ₹8,000",
            "expected_profit": "₹10,000 - ₹50,000/month",
            "time_to_start": "1 week",
            "target_customers": "School students, college students, adult learners",
            "best_match_score": 0,
            "execution_plan": [
                "Identify your teaching subjects",
                "Create lesson plans",
                "Set up online teaching space",
                "Register on tutoring platforms",
                "Offer free trial sessions",
                "Collect testimonials"
            ],
            "required_tools": ["Computer", "Good internet", "Webcam", "Headset", "Digital whiteboard"],
            "marketing_strategy": [
                "Social media promotion",
                "Partner with schools",
                "Referral discounts",
                "YouTube content creation"
            ]
        },
        {
            "id": 4,
            "title": "Social Media Management",
            "description": "Help small businesses grow their online presence by managing their social media accounts.",
            "matching_skills": ["Social Media", "Content Creation", "Copywriting", "Analytics"],
            "budget_level": "Medium",
            "time_requirement": "Part-time",
            "location_type": "Any",
            "startup_cost": "₹10,000 - ₹25,000",
            "expected_profit": "₹20,000 - ₹60,000/month",
            "time_to_start": "2-4 weeks",
            "target_customers": "Small businesses, startups, local shops, service providers",
            "best_match_score": 0,
            "execution_plan": [
                "Build your own social media presence",
                "Create sample content portfolio",
                "Learn social media tools",
                "Define service packages",
                "Reach out to local businesses",
                "Start with 3-5 clients"
            ],
            "required_tools": ["Smartphone", "Canva/design tools", "Scheduling tools", "Analytics tools"],
            "marketing_strategy": [
                "Content marketing",
                "Free social media audit",
                "Case studies",
                "Networking events"
            ]
        },
        {
            "id": 5,
            "title": "Healthy Food & Snacks Business",
            "description": "Prepare and deliver healthy, homemade snacks and meals to health-conscious customers.",
            "matching_skills": ["Cooking", "Nutrition Knowledge", "Creativity", "Time Management"],
            "budget_level": "Medium",
            "time_requirement": "Full-time",
            "location_type": "Urban",
            "startup_cost": "₹15,000 - ₹40,000",
            "expected_profit": "₹15,000 - ₹70,000/month",
            "time_to_start": "3-5 weeks",
            "target_customers": "Working professionals, fitness enthusiasts, families",
            "best_match_score": 0,
            "execution_plan": [
                "Get FSSAI registration",
                "Develop menu and recipes",
                "Source quality ingredients",
                "Set up home kitchen",
                "Create delivery system",
                "Build customer base through referrals"
            ],
            "required_tools": ["Kitchen equipment", "Packaging materials", "Delivery setup", "Inventory management"],
            "marketing_strategy": [
                "WhatsApp groups",
                "Corporate tie-ups",
                "Sample distribution",
                "Subscription model"
            ]
        }
    ]
    
    # Calculate best match score for each idea
    for idea in all_ideas:
        # Calculate skill match (40% weight)
        matching_skills_count = len(set(skills) & set(idea['matching_skills']))
        skill_match_score = (matching_skills_count / len(idea['matching_skills'])) * 40
        
        # Budget match (20% weight)
        budget_match = 20 if idea['budget_level'] == budget else 10
        
        # Time match (20% weight)
        time_match = 20 if idea['time_requirement'] == time_availability else 10
        
        # Location match (20% weight)
        location_match = 20 if idea['location_type'] == location or idea['location_type'] == 'Any' else 10
        
        idea['best_match_score'] = skill_match_score + budget_match + time_match + location_match
    
    # Sort by best match score and return top 5
    all_ideas.sort(key=lambda x: x['best_match_score'], reverse=True)
    
    return all_ideas[:5]

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
        execution_plan=data.get('execution_plan', []),
        required_tools=data.get('required_tools', []),
        marketing_strategy=data.get('marketing_strategy', [])
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

# Community Routes
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

# Dashboard Data
@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    user_id = get_jwt_identity()
    
    user = User.query.get(user_id)
    onboarding = Onboarding.query.filter_by(user_id=user_id).first()
    skills = Skill.query.filter_by(user_id=user_id).all()
    
    # Calculate progress metrics
    skill_progress = calculate_skill_progress(skills)
    job_readiness = calculate_job_readiness(skills, onboarding)
    business_readiness = calculate_business_readiness(skills, onboarding)
    
    # Skill growth data (mock)
    skill_growth = {
        'labels': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        'values': [30, 45, 60, skill_progress]
    }
    
    # Skill distribution
    skill_distribution = get_skill_distribution(skills)
    
    # Skill demand data (mock)
    skill_demand = get_skill_demand_data()
    
    return jsonify({
        'user': user.to_dict(),
        'onboarding': onboarding.to_dict() if onboarding else None,
        'metrics': {
            'skill_progress': skill_progress,
            'job_readiness': job_readiness,
            'business_readiness': business_readiness
        },
        'skill_growth': skill_growth,
        'skill_distribution': skill_distribution,
        'skill_demand': skill_demand,
        'recent_activity': get_recent_activity(user_id)
    }), 200

def calculate_skill_progress(skills):
    if not skills:
        return 0
    
    level_scores = {'Beginner': 30, 'Intermediate': 60, 'Advanced': 90}
    total = sum(level_scores.get(skill.level, 0) for skill in skills)
    return min(round(total / len(skills)), 100)

def calculate_job_readiness(skills, onboarding):
    if not skills or not onboarding:
        return 25
    
    # Simple calculation based on skills and experience
    base_score = calculate_skill_progress(skills)
    experience_bonus = min(onboarding.experience_years * 5, 20)
    
    return min(base_score + experience_bonus, 100)

def calculate_business_readiness(skills, onboarding):
    if not skills:
        return 20
    
    # Business readiness calculation
    entrepreneurial_skills = ['Leadership', 'Marketing', 'Finance', 'Communication']
    relevant_skills = sum(1 for skill in skills if skill.name in entrepreneurial_skills)
    
    return min(20 + (relevant_skills * 15), 100)

def get_skill_distribution(skills):
    distribution = {'Technical': 0, 'Soft': 0, 'Creative': 0, 'Business': 0}
    
    skill_categories = {
        'Technical': ['Python', 'JavaScript', 'Data Analysis', 'Web Development', 'Programming'],
        'Soft': ['Communication', 'Leadership', 'Time Management', 'Problem Solving'],
        'Creative': ['Design', 'Writing', 'Photography', 'Content Creation'],
        'Business': ['Marketing', 'Finance', 'Sales', 'Project Management']
    }
    
    for skill in skills:
        for category, category_skills in skill_categories.items():
            if skill.name in category_skills:
                distribution[category] += 1
                break
    
    return distribution

def get_skill_demand_data():
    return {
        'labels': ['Digital Marketing', 'Data Analysis', 'Content Writing', 'Project Management', 'Web Development'],
        'values': [95, 88, 82, 78, 75]
    }

def get_recent_activity(user_id):
    # Mock recent activity data
    return [
        {'action': 'Completed onboarding', 'date': '2 days ago'},
        {'action': 'Added 3 new skills', 'date': '5 days ago'},
        {'action': 'Saved business idea', 'date': '1 week ago'}
    ]

# Career Gap Analysis
@app.route('/api/career/gap-analysis', methods=['POST'])
@jwt_required()
def analyze_career_gap():
    data = request.get_json()
    desired_role = data.get('desiredRole', '')
    current_skills = data.get('skills', [])
    
    # Mock role requirements
    role_requirements = {
        'Software Developer': ['Python', 'JavaScript', 'SQL', 'Problem Solving', 'Teamwork'],
        'Digital Marketing Manager': ['SEO', 'Content Marketing', 'Social Media', 'Analytics', 'Strategy'],
        'Project Manager': ['Project Management', 'Leadership', 'Communication', 'Risk Management', 'Budgeting'],
        'Data Analyst': ['SQL', 'Python', 'Statistics', 'Data Visualization', 'Excel'],
        'Content Writer': ['Writing', 'SEO', 'Research', 'Editing', 'Creativity']
    }
    
    requirements = role_requirements.get(desired_role, ['Communication', 'Organization', 'Computer Skills'])
    
    # Find missing skills
    missing_skills = [skill for skill in requirements if skill not in current_skills]
    
    # Recommended skills (next level)
    recommended_skills = [
        {'name': 'Advanced ' + requirements[0], 'time_to_learn': '2-3 months'},
        {'name': requirements[-1] + ' Certification', 'time_to_learn': '1-2 months'}
    ] if requirements else []
    
    # Time to become job-ready
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

# Learning Roadmap
@app.route('/api/roadmap', methods=['GET'])
@jwt_required()
def get_roadmap():
    user_id = get_jwt_identity()
    skills = Skill.query.filter_by(user_id=user_id).all()
    
    # Generate personalized roadmap based on skills
    roadmap = generate_personalized_roadmap(skills)
    
    return jsonify(roadmap), 200

def generate_personalized_roadmap(skills):
    """Generate a personalized learning roadmap based on user's skills"""
    
    skill_names = [skill.name for skill in skills]
    
    # Define learning paths for different skill categories
    learning_paths = {
        'Technical': {
            'beginner': [
                {'skill': 'Programming Basics', 'resources': ['Online courses', 'Coding bootcamps'], 'duration': '1 month'},
                {'skill': 'Web Development Fundamentals', 'resources': ['HTML/CSS tutorials', 'JavaScript basics'], 'duration': '2 months'}
            ],
            'intermediate': [
                {'skill': 'Advanced Programming', 'resources': ['Algorithm courses', 'System design'], 'duration': '2 months'},
                {'skill': 'Framework Mastery', 'resources': ['React/Angular', 'Backend frameworks'], 'duration': '3 months'}
            ],
            'advanced': [
                {'skill': 'Architecture & Design', 'resources': ['Design patterns', 'Scalability'], 'duration': '2 months'},
                {'skill': 'Team Leadership', 'resources': ['Tech lead skills', 'Mentoring'], 'duration': '2 months'}
            ]
        },
        'Business': {
            'beginner': [
                {'skill': 'Business Fundamentals', 'resources': ['Business basics', 'Entrepreneurship 101'], 'duration': '1 month'},
                {'skill': 'Marketing Basics', 'resources': ['Digital marketing', 'Social media'], 'duration': '1.5 months'}
            ],
            'intermediate': [
                {'skill': 'Strategic Planning', 'resources': ['Business strategy', 'Growth hacking'], 'duration': '2 months'},
                {'skill': 'Financial Management', 'resources': ['Accounting', 'Financial planning'], 'duration': '2 months'}
            ]
        },
        'Soft Skills': {
            'beginner': [
                {'skill': 'Communication Skills', 'resources': ['Public speaking', 'Business writing'], 'duration': '1 month'},
                {'skill': 'Time Management', 'resources': ['Productivity tools', 'Prioritization'], 'duration': '2 weeks'}
            ],
            'intermediate': [
                {'skill': 'Leadership', 'resources': ['Team management', 'Decision making'], 'duration': '2 months'},
                {'skill': 'Negotiation', 'resources': ['Negotiation techniques', 'Conflict resolution'], 'duration': '1.5 months'}
            ]
        }
    }
    
    # Determine user's level in each category
    user_level = {
        'Technical': 'beginner',
        'Business': 'beginner',
        'Soft Skills': 'beginner'
    }
    
    # Assign levels based on skills
    for skill in skills:
        if skill.level == 'Advanced':
            if skill.category in user_level:
                user_level[skill.category] = 'advanced'
        elif skill.level == 'Intermediate':
            if skill.category in user_level and user_level[skill.category] == 'beginner':
                user_level[skill.category] = 'intermediate'
    
    # Build roadmap
    roadmap = []
    for category, level in user_level.items():
        if category in learning_paths:
            path = learning_paths[category].get(level, [])
            roadmap.extend([
                {
                    'id': f"{category.lower()}-{i}",
                    'category': category,
                    'skill': step['skill'],
                    'resources': step['resources'],
                    'duration': step['duration'],
                    'completed': False
                }
                for i, step in enumerate(path)
            ])
    
    return roadmap

@app.route('/api/roadmap/complete', methods=['POST'])
@jwt_required()
def mark_roadmap_complete():
    data = request.get_json()
    step_id = data.get('stepId')
    
    # In a real app, you'd store completion status in database
    # For now, just return success
    
    return jsonify({'message': 'Step marked as completed', 'stepId': step_id}), 200

# Review and Feedback
@app.route('/api/reviews', methods=['POST'])
@jwt_required()
def submit_review():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Store review in database (implement if needed)
    
    return jsonify({'message': 'Thank you for your feedback!'}), 200

@app.route('/api/testimonials', methods=['GET'])
def get_testimonials():
    # Mock testimonials
    testimonials = [
        {
            'id': 1,
            'name': 'Priya Sharma',
            'role': 'Restarted as Software Developer',
            'content': 'ReLaunchHer gave me the confidence to restart my career after a 5-year break. The skill gap analysis and roadmap were incredibly helpful!',
            'rating': 5,
            'avatar': 'PS'
        },
        {
            'id': 2,
            'name': 'Anita Desai',
            'role': 'Started Home Bakery',
            'content': 'The business generator helped me turn my baking hobby into a profitable home business. Now I have a steady income and happy customers!',
            'rating': 5,
            'avatar': 'AD'
        },
        {
            'id': 3,
            'name': 'Meera Reddy',
            'role': 'Freelance Writer',
            'content': 'From zero confidence to a thriving freelance career. The community support and resources are amazing. Highly recommended!',
            'rating': 5,
            'avatar': 'MR'
        }
    ]
    
    return jsonify(testimonials), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)