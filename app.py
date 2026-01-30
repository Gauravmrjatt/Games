from flask import Flask, render_template, url_for, flash, redirect, request, jsonify
from models import db, User, Game, Score
from forms import RegistrationForm, LoginForm, GameForm
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, current_user, logout_user, login_required
from sqlalchemy import func
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245' # Should be env var in prod
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db.init_app(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route("/")
@app.route("/home")
def home():
    games = Game.query.all()
    return render_template('home.html', games=games)

@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        # First user is admin
        if User.query.count() == 0:
            user.is_admin = True
            
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You can now log in', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route("/game/<slug>")
@login_required
def play_game(slug):
    game_obj = Game.query.filter_by(slug=slug).first_or_404()
    # Get high scores for this game
    top_scores = Score.query.filter_by(game_id=game_obj.id).order_by(Score.score.desc()).limit(5).all()
    
    # Get user's high score
    user_high_score = db.session.query(func.max(Score.score)).filter_by(user_id=current_user.id, game_id=game_obj.id).scalar()
    
    return render_template('game.html', title=game_obj.title, game=game_obj, top_scores=top_scores, user_high_score=user_high_score)

@app.route("/submit_score", methods=['POST'])
@login_required
def submit_score():
    data = request.get_json()
    score_val = data.get('score')
    game_id = data.get('game_id')
    
    if score_val is None or game_id is None:
        return jsonify({'success': False, 'message': 'Invalid data'}), 400
        
    score = Score(score=score_val, user_id=current_user.id, game_id=game_id)
    db.session.add(score)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Score submitted', 'new_score': score_val})

@app.route("/leaderboard")
@login_required
def leaderboard():
    # Global leaderboard (top 20 scores across all games)
    scores = Score.query.order_by(Score.score.desc()).limit(20).all()
    return render_template('leaderboard.html', title='Leaderboard', scores=scores)

@app.route("/profile")
@login_required
def profile():
    # Get user's high scores for each game
    user_scores = db.session.query(
        Game.title, 
        func.max(Score.score).label('high_score'),
        func.count(Score.id).label('games_played')
    ).join(Score).filter(Score.user_id == current_user.id).group_by(Game.id).all()
    
    return render_template('profile.html', title='Profile', user_scores=user_scores)

@app.route("/admin", methods=['GET', 'POST'])
@login_required
def admin():
    if not current_user.is_admin:
        flash('You do not have access to this page.', 'danger')
        return redirect(url_for('home'))
    
    form = GameForm()
    if form.validate_on_submit():
        game = Game(title=form.title.data, 
                    description=form.description.data,
                    slug=form.slug.data,
                    script_file=form.script_file.data)
        db.session.add(game)
        db.session.commit()
        flash('Game added successfully!', 'success')
        return redirect(url_for('admin'))
        
    games = Game.query.all()
    return render_template('admin.html', title='Admin Dashboard', form=form, games=games)

@app.route("/delete_game/<int:game_id>", methods=['POST'])
@login_required
def delete_game(game_id):
    if not current_user.is_admin:
        return redirect(url_for('home'))
    
    game = Game.query.get_or_404(game_id)
    db.session.delete(game)
    db.session.commit()
    flash('Game deleted successfully!', 'success')
    return redirect(url_for('admin'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
