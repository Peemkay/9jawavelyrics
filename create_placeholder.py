from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('static/img', exist_ok=True)

# Create a placeholder album artwork image
def create_album_artwork():
    # Create a new image with a solid background
    width, height = 800, 800
    image = Image.new('RGB', (width, height), color=(98, 0, 234))

    # Create a drawing context
    draw = ImageDraw.Draw(image)

    # Draw a rectangle in the center
    rect_width, rect_height = width // 2, height // 2
    rect_left = (width - rect_width) // 2
    rect_top = (height - rect_height) // 2
    draw.rectangle(
        (rect_left, rect_top, rect_left + rect_width, rect_top + rect_height),
        fill=(255, 255, 255, 128),
        outline=(255, 255, 255)
    )

    # Add text
    font_size = 40
    try:
        font = ImageFont.load_default()
    except:
        pass

    draw.text(
        (width // 2, height // 2 - 30),
        "9jaWaveLyrics",
        font=font,
        fill=(0, 0, 0)
    )

    draw.text(
        (width // 2, height // 2 + 30),
        "Album Artwork",
        font=font,
        fill=(0, 0, 0)
    )

    # Save the image
    image.save('static/img/hero-image.png')
    print("Placeholder image created at static/img/hero-image.png")

if __name__ == "__main__":
    create_album_artwork()
