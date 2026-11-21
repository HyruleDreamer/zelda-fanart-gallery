"""Create separate previews; never write to images/. Run from any directory."""
from pathlib import Path
import argparse
import io
import sys
from PIL import Image, ImageOps, features

SUPPORTED = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'}


def generate(root: Path) -> int:
    originals = root / 'images'
    previews = root / 'thumbnails'
    use_webp = features.check('webp')
    extension, image_format = ('.webp', 'WEBP') if use_webp else ('.png', 'PNG')
    failures = 0
    if not use_webp:
        print('WebP encoder unavailable; generating PNG previews instead.')
    # Exactly one story folder deep, matching gallery metadata. No symlink traversal.
    for source in sorted(originals.glob('*/*')):
        if (source.is_symlink() or source.parent.is_symlink()
                or not source.is_file() or source.suffix.lower() not in SUPPORTED):
            continue
        destination = previews / source.parent.name / (source.name + extension)
        try:
            if previews.is_symlink() or destination.parent.is_symlink() or destination.is_symlink():
                raise ValueError('Thumbnail paths must not be symbolic links')
            with Image.open(source) as original:
                # Animated illustrations use the first frame for their preview only.
                image = ImageOps.exif_transpose(original).convert('RGBA')
                width = min(500, image.width)  # Never enlarge small artwork.
                height = max(1, round(image.height * width / image.width))
                if image.size != (width, height):
                    image = image.resize((width, height), Image.Resampling.LANCZOS)
                # Clear EXIF/location data from previews; originals remain byte-for-byte intact.
                image.info.clear()
                output = io.BytesIO()
                options = {'quality': 85, 'method': 6} if use_webp else {'optimize': True}
                image.save(output, format=image_format, **options)
            content = output.getvalue()
            if not destination.exists() or destination.read_bytes() != content:
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_bytes(content)
                # Escape only the log text for consoles without Polish-character support.
                # Filesystem paths and gallery filenames remain exactly as uploaded.
                print(f'Generated {str(destination.relative_to(root))!a} ({width} x {height})')
        except Exception as error:
            failures += 1
            print(f'Could not process {str(source.relative_to(root))!a}: {error!a}', file=sys.stderr)
    return failures


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    sys.exit(1 if generate(args.root.resolve()) else 0)
