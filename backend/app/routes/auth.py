from flask import Blueprint, request, jsonify
from app.models import User
from app.extensions import db
from werkzeug.security import check_password_hash
import jwt
import datetime
import os

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')

SECRET_KEY = os.getenv('SECRET_KEY', 'super-secret-key')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'freelancer')  # default role

    if not username or not email or not password:
        return jsonify({"error": "Username, email and password required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "Username or email already exists"}), 409

    user = User(username=username, email=email, role=role)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    payload = {
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return jsonify({"token": token, "user": {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    }}), 200
