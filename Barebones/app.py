from flask import Flask, render_template, redirect, request, url_for, session
from werkzeug.utils import secure_filename
import os

# Initialize Flask application and set configuration for uploads
app = Flask(__name__, static_url_path='/uploads', static_folder='uploads')
app.config['UPLOAD_FOLDER'] = 'uploads'  # Set the folder for uploads
app.secret_key = 'your_super_secret_key'  # Secret key for session management

# Define allowed extensions for file uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Helper function to check if file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Landing page route
@app.route('/', methods=['GET'])
def landing():
    return render_template('landing.html')

# User login authentication route (currently a stub redirecting to homepage)
@app.route('/login', methods=['POST'])
def authenticate():
    return redirect('/homepage')

# User homepage route
@app.route('/homepage', methods=['GET'])
def homepage():
    return render_template('homepage.html', show_navbar=True)

# Admin login route
@app.route('/admin_login', methods=['GET'])
def admin_login():
    return render_template('admin_login.html')

# Admin authentication route (currently a stub redirecting to admin login)
@app.route('/admin_authenticate', methods=['POST'])
def admin_authenticate():
    return redirect('/admin_login')

# User profile view route
@app.route('/profile_view', methods=['GET'])
    # Retrieve session variables to populate the profile page
def profile_view():
    name = session.get('name', '')
    preferred_name = session.get('preferredName', '')
    school = session.get('school', '')
    image_filename = session.get('image_filename', '')
    committees = session.get('committees', '')
    statement = session.get('statement', '')
    return render_template('profile_view.html', show_navbar=True, name=name, preferredName=preferred_name, school=school, image_filename=image_filename, committees=committees, statement=statement)

# Route to show form for updating name and picture
@app.route('/name_and_picture', methods=['GET'])
def name_and_picture_form():
    return render_template('name_and_picture.html', show_navbar=True)

# Route to handle updates to the user's profile, including picture
@app.route('/update_profile', methods=['POST'])
def update_profile():
     # Handle profile picture upload
    file = request.files.get('profilePicture', None)
    if file and file.filename != '' and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        session['image_filename'] = file_path

    # Update other profile fields in session if they exist
    if request.form.get('username', '').strip():
        session['name'] = request.form['username']

    if request.form.get('preferredName', '').strip():
        session['preferredName'] = request.form['preferredName']

    if request.form.get('school', '').strip():
        session['school'] = request.form['school']

    return redirect(url_for('profile_view'))

# Route to show form for updating user's statement
@app.route('/statement', methods=['GET'])
def statement_form():
    return render_template('statement.html', show_navbar=True)

# Route to handle updates to the user's statement
@app.route('/update_statement', methods=['POST'])
def update_statement():
    user_statement = request.form.get('userStatement')
    if user_statement:
        session['statement'] = user_statement
    return redirect('/profile_view')

# Route to show form for updating user's committee preferences
@app.route('/committees', methods=['GET'])
def committees():
    return render_template('committees.html', show_navbar=True)

# Route to handle updates to the user's committee preferences
@app.route('/update_committees', methods=['POST'])
def update_committees():
    committees = request.form.get('committees')
    session['committees'] = committees
    return redirect('/profile_view')

# User logout route, redirecting to landing page
@app.route('/logout', methods=['GET'])
def logout():
    return redirect('/')

# Start the Flask app
if __name__ == "__main__":
    app.run(debug=True)
