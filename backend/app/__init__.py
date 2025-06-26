from flask import Flask
from .extensions import db, migrate  # ✅ Use centralized extension imports

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Import and register all models so Flask-Migrate can detect them
    from . import models  # for migration auto-detection

    # Register blueprints
    from .routes import routes_bp
    app.register_blueprint(routes_bp)

    return app
