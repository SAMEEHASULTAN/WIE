from database import db
from datetime import datetime
import json

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    onboarding = db.relationship('Onboarding', backref='user', uselist=False)
    skills = db.relationship('Skill', backref='user', lazy=True)
    saved_ideas = db.relationship('BusinessIdea', backref='user', lazy=True)
    posts = db.relationship('CommunityPost', backref='user', lazy=True)
    comments = db.relationship('Comment', backref='user', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'fullName': f"{self.first_name} {self.last_name}".strip(),
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }

class Onboarding(db.Model):
    __tablename__ = 'onboarding'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    age = db.Column(db.Integer)
    education = db.Column(db.String(100))
    previous_role = db.Column(db.String(100))
    experience_years = db.Column(db.Float)
    break_duration = db.Column(db.String(50))
    break_reason = db.Column(db.Text)
    available_hours = db.Column(db.Integer)
    work_type = db.Column(db.String(50))
    skills = db.Column(db.Text, default='[]')  # JSON array of skills
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_skills_list(self):
        return json.loads(self.skills) if self.skills else []
    
    def set_skills_list(self, skills_list):
        self.skills = json.dumps(skills_list)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'age': self.age,
            'education': self.education,
            'previousRole': self.previous_role,
            'experienceYears': self.experience_years,
            'breakDuration': self.break_duration,
            'breakReason': self.break_reason,
            'availableHours': self.available_hours,
            'workType': self.work_type,
            'skills': self.get_skills_list()
        }

class Skill(db.Model):
    __tablename__ = 'skills'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String(100), nullable=False)
    level = db.Column(db.String(20), default='Beginner')  # Beginner, Intermediate, Advanced
    category = db.Column(db.String(50), default='Other')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'level': self.level,
            'category': self.category
        }

class BusinessIdea(db.Model):
    __tablename__ = 'business_ideas'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    startup_cost = db.Column(db.String(100))
    expected_profit = db.Column(db.String(100))
    time_to_start = db.Column(db.String(100))
    target_customers = db.Column(db.Text)
    execution_plan = db.Column(db.Text, default='[]')  # JSON array
    required_tools = db.Column(db.Text, default='[]')  # JSON array
    marketing_strategy = db.Column(db.Text, default='[]')  # JSON array
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_execution_plan(self):
        return json.loads(self.execution_plan) if self.execution_plan else []
    
    def get_required_tools(self):
        return json.loads(self.required_tools) if self.required_tools else []
    
    def get_marketing_strategy(self):
        return json.loads(self.marketing_strategy) if self.marketing_strategy else []
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'startupCost': self.startup_cost,
            'expectedProfit': self.expected_profit,
            'timeToStart': self.time_to_start,
            'targetCustomers': self.target_customers,
            'executionPlan': self.get_execution_plan(),
            'requiredTools': self.get_required_tools(),
            'marketingStrategy': self.get_marketing_strategy(),
            'savedAt': self.saved_at.isoformat() if self.saved_at else None
        }

class CommunityPost(db.Model):
    __tablename__ = 'community_posts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default='General')
    likes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    comments = db.relationship('Comment', backref='post', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category': self.category,
            'likes': self.likes,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'user': self.user.to_dict() if self.user else None,
            'comments': [comment.to_dict() for comment in self.comments]
        }

class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('community_posts.id'))
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'user': self.user.to_dict() if self.user else None
        }