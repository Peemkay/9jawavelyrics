import uuid
from PIL import Image, ImageDraw, ImageFont
from flask import current_app
from .file_handler import get_file_path, save_upload

def process_image(filename, operations):
    """
    Apply a series of operations to an image

    Args:
        filename (str): The filename of the image to process
        operations (list): A list of operations to apply

    Returns:
        str: The filename of the processed image
    """
    img_path = get_file_path(filename)
    img = Image.open(img_path)

    for op in operations:
        op_type = op.get('type')
        params = op.get('params', {})

        if op_type == 'text':
            img = _add_text(img, **params)
        elif op_type == 'overlay':
            overlay_path = get_file_path(params.get('overlay_filename'))
            img = _add_overlay(img, overlay_path, **params)
        elif op_type == 'crop':
            img = _crop_image(img, **params)
        elif op_type == 'resize':
            img = _resize_image(img, **params)
        elif op_type == 'background':
            operation = params.get('operation', 'remove')
            if operation == 'remove':
                img = _remove_background(img)
            elif operation == 'replace':
                bg_color = params.get('color', (0, 0, 0))
                img = _replace_background(img, bg_color)
            elif operation == 'color':
                color = params.get('color', (0, 0, 0))
                img = _colorize_background(img, color)

    # Save the processed image
    result_filename = f"processed_{uuid.uuid4().hex}_{filename}"
    result_path = get_file_path(result_filename)
    img.save(result_path)

    return result_filename

def add_text(filename, text, position, font, size, color):
    """
    Add text to an image

    Args:
        filename (str): The filename of the image
        text (str): The text to add
        position (str): The position as "x,y"
        font (str): The font name
        size (int): The font size
        color (str): The color as "r,g,b"

    Returns:
        str: The filename of the processed image
    """
    img_path = get_file_path(filename)
    img = Image.open(img_path)

    # Parse position and color
    x, y = map(int, position.split(','))
    r, g, b = map(int, color.split(','))

    # Add text to image
    img = _add_text(img, text, (x, y), font, size, (r, g, b))

    # Save the processed image
    result_filename = f"text_{uuid.uuid4().hex}_{filename}"
    result_path = get_file_path(result_filename)
    img.save(result_path)

    return result_filename

def add_overlay(base_filename, overlay_file, position, size, opacity):
    """
    Add an overlay (logo/image) to an image

    Args:
        base_filename (str): The filename of the base image
        overlay_file: The overlay file object
        position (str): The position as "x,y"
        size (str): The size as "width,height"
        opacity (float): The opacity (0-1)

    Returns:
        str: The filename of the processed image
    """
    # Save the overlay file
    overlay_filename = save_upload(overlay_file)
    overlay_path = get_file_path(overlay_filename)

    # Open the base image
    base_path = get_file_path(base_filename)
    base_img = Image.open(base_path)

    # Parse position and size
    x, y = map(int, position.split(','))
    width, height = map(int, size.split(','))

    # Add overlay to image
    base_img = _add_overlay(base_img, overlay_path, (x, y), (width, height), opacity)

    # Save the processed image
    result_filename = f"overlay_{uuid.uuid4().hex}_{base_filename}"
    result_path = get_file_path(result_filename)
    base_img.save(result_path)

    return result_filename

def crop_image(filename, coords):
    """
    Crop an image

    Args:
        filename (str): The filename of the image
        coords (dict): The crop coordinates (left, top, right, bottom)

    Returns:
        str: The filename of the cropped image
    """
    img_path = get_file_path(filename)
    img = Image.open(img_path)

    # Crop the image
    left = coords.get('left', 0)
    top = coords.get('top', 0)
    right = coords.get('right', img.width)
    bottom = coords.get('bottom', img.height)

    img = _crop_image(img, (left, top, right, bottom))

    # Save the processed image
    result_filename = f"crop_{uuid.uuid4().hex}_{filename}"
    result_path = get_file_path(result_filename)
    img.save(result_path)

    return result_filename

def resize_image(filename, width, height):
    """
    Resize an image

    Args:
        filename (str): The filename of the image
        width (int): The new width
        height (int): The new height

    Returns:
        str: The filename of the resized image
    """
    img_path = get_file_path(filename)
    img = Image.open(img_path)

    # Resize the image
    img = _resize_image(img, (width, height))

    # Save the processed image
    result_filename = f"resize_{uuid.uuid4().hex}_{filename}"
    result_path = get_file_path(result_filename)
    img.save(result_path)

    return result_filename

def edit_background(filename, operation, params):
    """
    Edit the background of an image

    Args:
        filename (str): The filename of the image
        operation (str): The operation to perform (remove, replace, color)
        params (dict): Parameters for the operation

    Returns:
        str: The filename of the processed image
    """
    img_path = get_file_path(filename)
    img = Image.open(img_path)

    # Process the background
    if operation == 'remove':
        img = _remove_background(img)
    elif operation == 'replace':
        bg_color = params.get('color', (0, 0, 0))
        img = _replace_background(img, bg_color)
    elif operation == 'color':
        color = params.get('color', (0, 0, 0))
        img = _colorize_background(img, color)

    # Save the processed image
    result_filename = f"bg_{uuid.uuid4().hex}_{filename}"
    result_path = get_file_path(result_filename)
    img.save(result_path)

    return result_filename

# Private helper functions

def _add_text(img, text, position, font_name, font_size, color):
    """Add text to an image"""
    draw = ImageDraw.Draw(img)

    # Try to load the specified font, fall back to default
    try:
        font = ImageFont.truetype(font_name, font_size)
    except:
        font = ImageFont.truetype(current_app.config['DEFAULT_FONT'], font_size)

    draw.text(position, text, font=font, fill=color)
    return img

def _add_overlay(base_img, overlay_path, position, size, opacity=1.0):
    """Add an overlay to an image"""
    overlay = Image.open(overlay_path)

    # Resize the overlay
    overlay = overlay.resize(size, Image.LANCZOS)

    # If the overlay has transparency, use it
    if overlay.mode == 'RGBA':
        # Create a new image with the same size as the base
        new_img = Image.new('RGBA', base_img.size)

        # Paste the base image
        new_img.paste(base_img, (0, 0))

        # Apply opacity to the overlay
        if opacity < 1.0:
            overlay_data = overlay.getdata()
            new_data = []
            for item in overlay_data:
                # Apply opacity to the alpha channel
                new_data.append((item[0], item[1], item[2], int(item[3] * opacity)))
            overlay.putdata(new_data)

        # Paste the overlay
        new_img.paste(overlay, position, overlay)

        # Convert back to RGB if the base was RGB
        if base_img.mode == 'RGB':
            new_img = new_img.convert('RGB')

        return new_img
    else:
        # If no transparency, convert to RGBA
        overlay = overlay.convert('RGBA')
        return _add_overlay(base_img, overlay, position, size, opacity)

def _crop_image(img, box):
    """Crop an image"""
    return img.crop(box)

def _resize_image(img, size):
    """Resize an image"""
    return img.resize(size, Image.LANCZOS)

def _remove_background(img):
    """Simple background removal using edge detection (placeholder)"""
    # Convert to RGBA if not already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # Create a simple mask based on edge detection
    # This is a placeholder for the actual background removal
    # In a real implementation, we would use more sophisticated techniques

    # Create a copy of the image with transparent background
    result = Image.new('RGBA', img.size, (0, 0, 0, 0))

    # Create a simple mask (this is just a placeholder)
    # In a real implementation, we would use more sophisticated techniques
    width, height = img.size
    center_x, center_y = width // 2, height // 2
    radius = min(width, height) // 3

    # Copy the center portion of the image
    for y in range(height):
        for x in range(width):
            # Simple circular mask
            distance = ((x - center_x) ** 2 + (y - center_y) ** 2) ** 0.5
            if distance < radius:
                pixel = img.getpixel((x, y))
                result.putpixel((x, y), pixel)

    return result

def _replace_background(img, bg_color):
    """Replace the background with a solid color"""
    # First remove the background
    img_no_bg = _remove_background(img)

    # Create a new image with the background color
    bg = Image.new('RGBA', img.size, bg_color)

    # Paste the foreground onto the background
    bg.paste(img_no_bg, (0, 0), img_no_bg)

    return bg

def _colorize_background(img, color):
    """Colorize the background of an image"""
    # First remove the background
    img_no_bg = _remove_background(img)

    # Create a new image with the background color
    bg = Image.new('RGBA', img.size, color)

    # Paste the foreground onto the background
    bg.paste(img_no_bg, (0, 0), img_no_bg)

    return bg
