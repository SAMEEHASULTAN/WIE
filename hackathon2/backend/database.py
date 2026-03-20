from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Create SQLAlchemy instance
db = SQLAlchemy()
migrate = Migrate()

def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)
    migrate.init_app(app, db)
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Database tables created successfully!")