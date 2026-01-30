from app import app, db, Game, User, bcrypt

def seed():
    with app.app_context():
        db.create_all()
        
        # Check if game exists
        if not Game.query.filter_by(slug='clicker').first():
            clicker = Game(
                title='10 Second Click Challenge',
                description='How fast can you click in 10 seconds? Test your speed!',
                slug='clicker',
                script_file='clicker.js'
            )
            db.session.add(clicker)
            print("Added Clicker game.")
            
        # Create admin user if not exists
        if not User.query.filter_by(username='admin').first():
            hashed_pw = bcrypt.generate_password_hash('admin123').decode('utf-8')
            admin = User(username='admin', email='admin@example.com', password=hashed_pw, is_admin=True)
            db.session.add(admin)
            print("Added Admin user (admin/admin123).")
            
        db.session.commit()
        print("Database seeded!")

if __name__ == '__main__':
    seed()