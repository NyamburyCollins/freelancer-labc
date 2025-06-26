from flask import Blueprint

# Import blueprints from individual route files
from .auth import auth_bp
from .users import users_bp
from .services import services_bp
from .categories import categories_bp

# Define the parent blueprint FIRST
routes_bp = Blueprint("routes", __name__)

# Register child blueprints to the parent
routes_bp.register_blueprint(auth_bp)
routes_bp.register_blueprint(users_bp)
routes_bp.register_blueprint(services_bp)
routes_bp.register_blueprint(categories_bp)

