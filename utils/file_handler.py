import os
import uuid
import time
from datetime import datetime
from flask import current_app
from werkzeug.utils import secure_filename

def save_upload(file):
    """
    Save an uploaded file to the upload directory
    
    Args:
        file: The file object from request.files
        
    Returns:
        str: The filename of the saved file
    """
    filename = secure_filename(file.filename)
    # Add a unique identifier to prevent filename collisions
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)
    return unique_filename

def get_temp_path(prefix='temp', extension='.png'):
    """
    Generate a path for a temporary file
    
    Args:
        prefix (str): Prefix for the filename
        extension (str): File extension
        
    Returns:
        str: The path to the temporary file
    """
    temp_filename = f"{prefix}_{uuid.uuid4().hex}{extension}"
    return os.path.join(current_app.config['TEMP_FOLDER'], temp_filename)

def cleanup_temp_files():
    """
    Remove temporary files that are older than the configured lifetime
    """
    now = datetime.now()
    temp_folder = current_app.config['TEMP_FOLDER']
    lifetime = current_app.config['TEMP_FILE_LIFETIME']
    
    for filename in os.listdir(temp_folder):
        file_path = os.path.join(temp_folder, filename)
        
        # Skip if not a file
        if not os.path.isfile(file_path):
            continue
            
        # Check file age
        file_time = datetime.fromtimestamp(os.path.getmtime(file_path))
        if now - file_time > lifetime:
            try:
                os.remove(file_path)
            except Exception as e:
                current_app.logger.error(f"Error removing temp file {file_path}: {e}")

def get_file_path(filename):
    """
    Get the full path to a file in the upload directory
    
    Args:
        filename (str): The filename
        
    Returns:
        str: The full path to the file
    """
    return os.path.join(current_app.config['UPLOAD_FOLDER'], filename)

def get_file_extension(filename):
    """
    Get the extension of a file
    
    Args:
        filename (str): The filename
        
    Returns:
        str: The file extension
    """
    return os.path.splitext(filename)[1].lower()
