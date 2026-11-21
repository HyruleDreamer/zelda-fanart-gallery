"""Temporary test artwork is never added to the gallery."""
import hashlib
import io
from contextlib import redirect_stdout
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from PIL import Image
from generate_thumbnails import generate


class ThumbnailTests(unittest.TestCase):
    def test_polish_filenames_preserve_originals_and_generate_real_webp(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            folder = root / 'images' / 'courtship-first-then-invasion-taxes-later'
            folder.mkdir(parents=True)
            names = ['Fresk Światła i Cienia.png',
                     'Księżycowy pojedynek w starożytnym fresku.png',
                     'Starożytna ceremonia ślubna Hyrule.png']
            for name in names:
                Image.new('RGB', (1200, 800), 'blue').save(folder / name)
            hashes = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in folder.iterdir()}
            # Even an ASCII-only Windows console must not turn successful writes into errors.
            with io.TextIOWrapper(io.BytesIO(), encoding='ascii') as console:
                with redirect_stdout(console):
                    self.assertEqual(generate(root), 0)
            for name in names:
                preview = root / 'thumbnails' / folder.name / (name + '.webp')
                with Image.open(preview) as image:
                    self.assertEqual(image.size, (500, 333))
                    self.assertEqual(image.format, 'WEBP')
            self.assertEqual(hashes, {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in folder.iterdir()})

    def test_dimensions_preservation_collisions_and_idempotence(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            folder = root / 'images' / 'silent-world'
            folder.mkdir(parents=True)
            for name, size in [('scene.png', (1600, 800)), ('scene.jpg', (800, 1600)),
                               ('small.png', (120, 60)), ('space & quote.png', (1000, 600))]:
                Image.new('RGB', size, 'red').save(folder / name)
            original_hashes = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in folder.iterdir()}
            self.assertEqual(generate(root), 0)
            for name, size in [('scene.png.webp', (500, 250)), ('scene.jpg.webp', (500, 1000)),
                               ('small.png.webp', (120, 60)), ('space & quote.png.webp', (500, 300))]:
                with Image.open(root / 'thumbnails' / 'silent-world' / name) as image:
                    self.assertEqual(image.size, size)
                    self.assertEqual(image.format, 'WEBP')
            self.assertEqual(original_hashes, {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in folder.iterdir()})
            times = {p: p.stat().st_mtime_ns for p in (root / 'thumbnails').rglob('*.webp')}
            self.assertEqual(generate(root), 0)
            self.assertEqual(times, {p: p.stat().st_mtime_ns for p in times})
            Image.new('RGB', (1000, 1000), 'blue').save(folder / 'scene.png')
            self.assertEqual(generate(root), 0)
            with Image.open(root / 'thumbnails/silent-world/scene.png.webp') as image:
                self.assertEqual(image.size, (500, 500))

    def test_orientation_transparency_and_png_fallback(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            folder = root / 'images' / 'written-love'
            folder.mkdir(parents=True)
            Image.new('RGBA', (1000, 600), (255, 0, 0, 0)).save(folder / 'transparent.png')
            exif = Image.Exif()
            exif[274] = 6
            Image.new('RGB', (1200, 600)).save(folder / 'rotated.jpg', exif=exif)
            with patch('generate_thumbnails.features.check', return_value=False):
                self.assertEqual(generate(root), 0)
            with Image.open(root / 'thumbnails/written-love/rotated.jpg.png') as image:
                self.assertEqual(image.size, (500, 1000))
            with Image.open(root / 'thumbnails/written-love/transparent.png.png') as image:
                self.assertEqual(image.getpixel((0, 0))[3], 0)

    def test_invalid_artwork_fails_without_modifying_original(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            folder = root / 'images' / 'silent-world'
            folder.mkdir(parents=True)
            source = folder / 'invalid.png'
            source.write_bytes(b'not an image')
            self.assertEqual(generate(root), 1)
            self.assertEqual(source.read_bytes(), b'not an image')


if __name__ == '__main__':
    unittest.main()
