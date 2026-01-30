from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    scores = db.relationship('Score', backref='player', lazy=True)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    script_file = db.Column(db.String(50), nullable=False) # e.g., 'snake.js'
    scores = db.relationship('Score', backref='game_played', lazy=True)

    def __repr__(self):
        return f"Game('{self.title}')"

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)

    def __repr__(self):
        return f"Score('{self.score}', '{self.date_posted}')"
