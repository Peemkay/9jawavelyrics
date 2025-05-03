import os
from datetime import timedelta

# Flask configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-9jaWaveLyrics')
DEBUG = os.environ.get('FLASK_DEBUG', 'True') == 'True'

# File upload settings
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
TEMP_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'temp')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

# Image processing settings
DEFAULT_FONT = 'arial.ttf'
DEFAULT_FONT_SIZE = 24
DEFAULT_FONT_COLOR = (255, 255, 255)  # White
TEMP_FILE_LIFETIME = timedelta(hours=1)  # Clean up temp files after 1 hour

# Application settings
APP_NAME = '9jaWaveLyrics Artwork Maker'
APP_DESCRIPTION = 'Create beautiful album artwork for music distribution'
APP_VERSION = '1.0.0'
