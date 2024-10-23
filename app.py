import re
from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import os

# Initialize the Flask application
app = Flask(__name__)

# Configure the SQLAlchemy database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///songs.db')  # Fallback to SQLite for local development
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

def highlight_chords(lyrics):
    chord_regex = r'(?<!\w)([A-G](?:b|#)?(?:maj|min|m|M|\+|-|dim|aug)?[0-9]*(?:sus[24]?)?(?:b|#)?[0-9]*(\/[A-G](?:b|#)?)?)(?!\w)'
    
    # Wrap chords in a span for highlighting
    highlighted_lyrics = re.sub(chord_regex, r'<span class="highlight-chord">\1</span>', lyrics)
    
    return highlighted_lyrics

# Define the Song model
class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    lyrics_chords = db.Column(db.Text, nullable=False)

# Initialize the database tables when the application starts
def create_tables():
    with app.app_context():  # Set up the application context
        try:
            db.create_all()
            print("Tables created successfully!")
        except Exception as e:
            print("Error creating tables:", e)
# Custom Jinja filter for regex matching
@app.template_filter('regex_match')
def regex_match(s, pattern):
    """Returns True if the string matches the regular expression pattern."""
    return re.match(pattern, s) is not None

# Home route to display all songs
@app.route('/')
def index():
    songs = Song.query.all()
    return render_template('index.html', songs=songs)

# Route to view song details and handle transposition
@app.route('/song/<int:song_id>')
def song_detail(song_id):
    this_song = Song.query.get(song_id)
    song = Song.query.get_or_404(song_id)
    song.lyrics_chords = highlight_chords(song.lyrics_chords)
    songs = Song.query.all()  # Fetch all songs for the sidebar
    return render_template('song_detail.html', song=song, songs=songs, this_song=this_song)

# Route to add a new song
@app.route('/add', methods=['GET', 'POST'])
def add_song():
    songs = Song.query.all()
    if request.method == 'POST':
        title = request.form['title']
        artist = request.form['artist']
        lyrics_chords = request.form['lyrics_chords']
        new_song = Song(title=title, artist=artist, lyrics_chords=lyrics_chords)
        db.session.add(new_song)
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('add_song.html', songs=songs, this_song="")

@app.route('/edit/<int:song_id>', methods=['GET', 'POST'])
def edit_song(song_id):
    song = Song.query.get_or_404(song_id)
    if request.method == 'POST':
        song.title = request.form['title']
        song.artist = request.form['artist']
        song.lyrics_chords = request.form['lyrics_chords']
        db.session.commit()
        return redirect(url_for('song_detail', song_id=song.id))
    return render_template('edit_song.html', song=song)

@app.route('/delete/<int:song_id>', methods=['POST'])
def delete_song(song_id):
    song = Song.query.get_or_404(song_id)
    db.session.delete(song)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/test')
def testpage():
    return render_template('testpage.html')

@app.route('/init_db')
def init_db():
    """Initialize the database and create tables."""
    try:
        create_tables()  # Call the function to create tables
        return "Database initialized successfully!"
    except Exception as e:
        return f"An error occurred while initializing the database: {str(e)}"


# Run the app
if __name__ == '__main__':
    create_tables()  # Create tables before the first request
    app.run(debug=True)

