

from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()


class User(db.Model):

    __tablename__ = 'users'

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True
    )

    password = db.Column(
        db.Text,
        nullable=False
    )

    user_image = db.Column(
        db.Text,
        default="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
    )

    email = db.Column(
        db.Text,
        nullable=False,
        unique=True
    )

    favoriteslist = db.relationship(
        'FavoriteStock', backref="users", cascade="all, delete-orphan")

    # favorites = db.relationship('stocks', secondary="FavoriteStock" backref='users')

    @classmethod
    def signup(cls, username, password, user_image, email):
        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            password=hashed_pwd,
            user_image=user_image,
            email=email
        )

        db.session.add(user)
        return user

    @classmethod
    def authenticate(cls, username, password):
        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user
        return False


# class Stock(db.Model):
#     __tablename__ = 'stocks'

#     id = db.Column(
#         db.Integer,
#         primary_key=True
#     )

#     stock_name = db.Column(
#         db.Text,
#         unique=True
#     )

#     symbol = db.Column(
#         db.Text,
#         nullable=False,
#         unique=True
#     )


class FavoriteStock(db.Model):
    __tablename__ = 'Favorites'

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    symbol = db.Column(
        db.Text,
        primary_key=True
    )

    userid = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)


def connect_db(app):
    """Connect this database to provided Flask app.

    You should call this in your Flask app.
    """

    db.app = app
    db.init_app(app)
