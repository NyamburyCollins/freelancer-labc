from flask import Blueprint, request, jsonify
from .models import db, User, Skill

routes_bp = Blueprint('routes', __name__, url_prefix='/api')

@routes_bp.route('/')
def home():
    return jsonify({'message': 'Welcome to the Skill Freelance API'})

@routes_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': user.id, 'username': user.username, 'email': user.email} for user in users])

@routes_bp.route('/skills', methods=['GET'])
def get_skills():
    skills = Skill.query.all()
    return jsonify([{'id': skill.id, 'name': skill.name, 'description': skill.description} for skill in skills])
