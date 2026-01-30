from app import app, db, Game, User
import os

def seed_games():
    with app.app_context():
        # List of new games
        new_games = [
            {
                'title': 'Target Practice',
                'description': 'Test your reflexes! Click the targets as fast as you can in 30 seconds.',
                'slug': 'target-practice',
                'script_file': 'target.js'
            },
            {
                'title': 'Simon Says',
                'description': 'Watch the pattern and repeat it. How long of a sequence can you remember?',
                'slug': 'simon-says',
                'script_file': 'simon.js'
            },
            {
                'title': 'Whack-a-Mole',
                'description': 'The classic arcade game. Hit the moles before they hide!',
                'slug': 'whack-a-mole',
                'script_file': 'mole.js'
            },
            {
                'title': 'Math Sprint',
                'description': 'Solve as many math problems as possible in 60 seconds.',
                'slug': 'math-sprint',
                'script_file': 'math.js'
            }
        ]

        print("Seeding games...")
        for game_data in new_games:
            existing = Game.query.filter_by(slug=game_data['slug']).first()
            if not existing:
                game = Game(
                    title=game_data['title'],
                    description=game_data['description'],
                    slug=game_data['slug'],
                    script_file=game_data['script_file']
                )
                db.session.add(game)
                print(f"Added: {game_data['title']}")
            else:
                print(f"Skipped (Exists): {game_data['title']}")
        
        db.session.commit()
        print("Database update complete!")

if __name__ == '__main__':
    seed_games()