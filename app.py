import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from utils.image_processor import process_image, add_text, add_overlay, crop_image, resize_image, edit_background
from utils.file_handler import save_upload, get_temp_path, cleanup_temp_files

# Initialize Flask app
app = Flask(__name__)
app.config.from_pyfile('config.py')

# Ensure upload directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['TEMP_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/editor')
def editor():
    """Render the editor page"""
    return render_template('editor.html')

@app.route('/about')
def about():
    """Render the about page"""
    return render_template('about.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file uploads"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = save_upload(file)
        return jsonify({'filename': filename, 'path': f'/uploads/{filename}'})
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/process', methods=['POST'])
def process():
    """Process image with requested operations"""
    data = request.json
    
    if 'filename' not in data:
        return jsonify({'error': 'No filename provided'}), 400
    
    filename = data['filename']
    operations = data.get('operations', [])
    
    try:
        result_filename = process_image(filename, operations)
        return jsonify({'result': f'/uploads/{result_filename}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/add-text', methods=['POST'])
def add_text_to_image():
    """Add text to an image"""
    data = request.json
    
    if not all(k in data for k in ['filename', 'text', 'position', 'font', 'size', 'color']):
        return jsonify({'error': 'Missing required parameters'}), 400
    
    try:
        result_filename = add_text(
            data['filename'], 
            data['text'], 
            data['position'], 
            data['font'], 
            data['size'], 
            data['color']
        )
        return jsonify({'result': f'/uploads/{result_filename}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/add-overlay', methods=['POST'])
def add_overlay_to_image():
    """Add an overlay (logo/image) to an image"""
    if 'overlay' not in request.files:
        return jsonify({'error': 'No overlay file provided'}), 400
    
    if 'filename' not in request.form:
        return jsonify({'error': 'No base image filename provided'}), 400
    
    try:
        overlay_file = request.files['overlay']
        base_filename = request.form['filename']
        position = request.form.get('position', '0,0')
        size = request.form.get('size', '100,100')
        opacity = float(request.form.get('opacity', 1.0))
        
        result_filename = add_overlay(base_filename, overlay_file, position, size, opacity)
        return jsonify({'result': f'/uploads/{result_filename}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/crop', methods=['POST'])
def crop():
    """Crop an image"""
    data = request.json
    
    if not all(k in data for k in ['filename', 'coords']):
        return jsonify({'error': 'Missing required parameters'}), 400
    
    try:
        result_filename = crop_image(data['filename'], data['coords'])
        return jsonify({'result': f'/uploads/{result_filename}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/resize', methods=['POST'])
def resize():
    """Resize an image"""
    data = request.json
    
    if not all(k in data for k in ['filename', 'width', 'height']):
        return jsonify({'error': 'Missing required parameters'}), 400
    
    try:
        result_filename = resize_image(
            data['filename'], 
            int(data['width']), 
            int(data['height'])
        )
        return jsonify({'result': f'/uploads/{result_filename}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/edit-background', methods=['POST'])
def edit_bg():
    """Edit the background of an image"""
    data = request.json
    
    if 'filename' not in data:
        return jsonify({'error': 'No filename provided'}), 400
    
    try:
        operation = data.get('operation', 'remove')
        params = data.get('params', {})
        
        result_filename = edit_background(data['filename'], operation, params)
        return jsonify({'result': f'/uploads/{result_filename}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download/<filename>')
def download_file(filename):
    """Download the processed image"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

def allowed_file(filename):
    """Check if the file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.teardown_appcontext
def cleanup(exception=None):
    """Clean up temporary files"""
    cleanup_temp_files()

if __name__ == '__main__':
    app.run(debug=True)
