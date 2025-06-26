from app import create_app
from app.extensions import db
from app.models import User, Service, Application, Category
from sqlalchemy import text

app = create_app()

with app.app_context():
    print("🔄 Resetting database...")

    # Clear all tables in proper order
    db.session.execute(text("DELETE FROM service_categories"))  # Join table
    Application.query.delete()
    Service.query.delete()
    Category.query.delete()
    User.query.delete()

    # ✅ Create users
    print("👤 Creating users...")
    client = User(username="client1", email="client1@example.com", role="client")
    client.set_password("clientpass")

    freelancer = User(username="freelancer1", email="freelancer1@example.com", role="freelancer")
    freelancer.set_password("freelancerpass")

    db.session.add_all([client, freelancer])
    db.session.commit()

    # ✅ Create categories
    print("🏷️ Creating categories...")
    dev = Category(name="Development")
    design = Category(name="Design")

    db.session.add_all([dev, design])
    db.session.commit()

    # ✅ Create a service and link it to category
    print("🛠️ Creating a service...")
    service = Service(
        title="Build a Portfolio Website",
        description="Need a clean, responsive website built with React or HTML/CSS.",
        budget=300.00,
        status="open",
        client_id=client.id
    )
    service.categories.append(dev)

    db.session.add(service)
    db.session.commit()

    # ✅ Create an application
    print("📨 Creating an application...")
    application = Application(
        status="pending",
        message="I can build a stunning portfolio in 3 days.",
        freelancer_id=freelancer.id,
        service_id=service.id
    )

    db.session.add(application)
    db.session.commit()

    print("✅ Database seeded successfully!")
