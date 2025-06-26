from . import db
from werkzeug.security import generate_password_hash, check_password_hash

# Association table for Many-to-Many: Service <-> Category
service_categories = db.Table(
    'service_categories',
    db.Column('service_id', db.Integer, db.ForeignKey('services.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.Text)
    role = db.Column(db.String(20), nullable=False)  # 'client', 'freelancer', or 'admin'

    # Relationships
    services = db.relationship('Service', backref='client', lazy=True)
    applications = db.relationship('Application', backref='freelancer', lazy=True)

    def set_password(self, password):
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long.")
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Service(db.Model):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    budget = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="open")
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relationships
    applications = db.relationship('Application', backref='service', lazy=True)
    categories = db.relationship('Category', secondary=service_categories, backref='services', lazy='subquery')

    def validate_budget(self):
        if self.budget <= 0:
            raise ValueError("Budget must be greater than 0")


class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20), default='pending')
    message = db.Column(db.Text, nullable=False)

    freelancer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)

    __table_args__ = (
        db.UniqueConstraint('freelancer_id', 'service_id', name='unique_application'),
    )


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
