from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Service, User, Category
from app.extensions import db

services_bp = Blueprint('services', __name__, url_prefix='/services')

# GET /services
@services_bp.route('', methods=['GET'])
def get_services():
    services = Service.query.all()
    return jsonify([{
        "id": s.id,
        "title": s.title,
        "description": s.description,
        "budget": s.budget,
        "status": s.status,
        "client_id": s.client_id,
        "categories": [c.name for c in s.categories]
    } for s in services]), 200


# GET /services/<id>
@services_bp.route('/<int:id>', methods=['GET'])
def get_service(id):
    service = Service.query.get(id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    return jsonify({
        "id": service.id,
        "title": service.title,
        "description": service.description,
        "budget": service.budget,
        "status": service.status,
        "client_id": service.client_id,
        "categories": [c.name for c in service.categories]
    })


# POST /services
@services_bp.route('', methods=['POST'])
@jwt_required()
def create_service():
    data = request.json
    title = data.get("title")
    description = data.get("description")
    budget = data.get("budget")
    category_names = data.get("categories", [])
    
    if not title or not description or not budget:
        return jsonify({"error": "Missing required fields"}), 400
    if budget <= 0:
        return jsonify({"error": "Budget must be greater than 0"}), 400

    user_id = get_jwt_identity()
    client = User.query.get(user_id)
    if not client or client.role != "client":
        return jsonify({"error": "Only clients can create services"}), 403

    service = Service(title=title, description=description, budget=budget, client=client)

    for name in category_names:
        cat = Category.query.filter_by(name=name).first()
        if cat:
            service.categories.append(cat)

    db.session.add(service)
    db.session.commit()

    return jsonify({"message": "Service created", "id": service.id}), 201


# PATCH /services/<id>
@services_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_service(id):
    service = Service.query.get(id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    user_id = get_jwt_identity()
    if service.client_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    if "title" in data:
        service.title = data["title"]
    if "description" in data:
        service.description = data["description"]
    if "budget" in data:
        if data["budget"] <= 0:
            return jsonify({"error": "Budget must be greater than 0"}), 400
        service.budget = data["budget"]
    if "status" in data:
        service.status = data["status"]

    db.session.commit()
    return jsonify({"message": "Service updated"}), 200


# DELETE /services/<id>
@services_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_service(id):
    service = Service.query.get(id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    user_id = get_jwt_identity()
    if service.client_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Service deleted"}), 200
