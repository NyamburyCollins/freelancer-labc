# app/routes/users.py

from flask import Blueprint, request, jsonify
from app.models import User
from app.extensions import db
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError

users_bp = Blueprint("users", __name__, url_prefix="/users")

# GET /users/<id>
@users_bp.route("/<int:id>", methods=["GET"])
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
        "role": user.role
    })

# PATCH /users/<id>
@users_bp.route("/<int:id>", methods=["PATCH"])
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    if "bio" in data:
        user.bio = data["bio"]
    if "email" in data:
        user.email = data["email"]

    try:
        db.session.commit()
        return jsonify({"message": "User updated successfully"})
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already in use"}), 400

# PUT /users/<id>/reset-password
@users_bp.route("/<int:id>/reset-password", methods=["PUT"])
def reset_password(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    new_password = data.get("password")

    if not new_password or len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"})

# DELETE /users/<id>
@users_bp.route("/<int:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {id} deleted"})
