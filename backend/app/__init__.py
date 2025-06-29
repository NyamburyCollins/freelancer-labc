from flask import Flask
from .extensions import db, migrate

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)

    from .routes import routes_bp  # ✅ Import routes

    app.register_blueprint(routes_bp)  # ✅ Register blueprint

    return app
