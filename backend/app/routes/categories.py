from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Category, User
from app.extensions import db

categories_bp = Blueprint('categories', __name__, url_prefix='/categories')

# GET /categories - public
@categories_bp.route('', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{"id": cat.id, "name": cat.name} for cat in categories]), 200


# POST /categories - admin only
@categories_bp.route('', methods=['POST'])
@jwt_required()
def create_category():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != "admin":
        return jsonify({"error": "Admin privileges required"}), 403

    data = request.json
    name = data.get("name")

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    if Category.query.filter_by(name=name).first():
        return jsonify({"error": "Category already exists"}), 409

    category = Category(name=name)
    db.session.add(category)
    db.session.commit()
    return jsonify({"message": "Category created", "id": category.id}), 201


# DELETE /categories/<id> - admin only
@categories_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != "admin":
        return jsonify({"error": "Admin privileges required"}), 403

    category = Category.query.get(id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Category deleted"}), 200
