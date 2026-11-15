// Package one complete snapshot: originals, generated previews, and gallery metadata.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function build(root, output) {
  root = path.resolve(root);
  output = path.resolve(output);
  if (output === root || root.startsWith(output + path.sep)) throw Error('Output must not contain the source');
  if (fs.existsSync(output)) throw Error('Use a new, empty build directory');
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'data/gallery.js'), 'utf8'), context, { timeout: 1000 });
  const data = context.window.GALLERY_DATA;
  const automatic = [];
  const supported = /\.(png|jpe?g|webp|gif|avif)$/i;
  for (const story of data.stories) {
    if (!/^[a-z0-9-]+$/.test(story.id)) throw Error('Invalid story id');
    const folder = path.join(root, 'images', story.id);
    if (!fs.existsSync(folder)) continue;
    if (fs.lstatSync(folder).isSymbolicLink()) throw Error('Image folders cannot be symlinks');
    for (const filename of fs.readdirSync(folder).sort()) {
      const source = path.join(folder, filename);
      if (!supported.test(filename)) continue;
      if (fs.lstatSync(source).isSymbolicLink()) throw Error('Images cannot be symlinks');
      if (!fs.statSync(source).isFile()) continue;
      const title = filename.replace(supported, '').replace(/[-_]+/g, ' ').trim() || 'Illustration';
      automatic.push({ id: `${story.id}/${filename}`, story: story.id, filename, title,
        alt: `${title} — ${story.title} illustration` });
      if (!['.webp', '.png'].some(ext => fs.existsSync(path.join(root, 'thumbnails', story.id, filename + ext)))) {
        throw Error(`Missing generated preview for ${story.id}/${filename}`);
      }
    }
  }
  fs.mkdirSync(output, { recursive: true });
  for (const name of ['index.html', 'guide.html', '.nojekyll', 'assets', 'data', 'images', 'thumbnails']) {
    fs.cpSync(path.join(root, name), path.join(output, name), { recursive: true, dereference: false,
      filter: source => { if (fs.lstatSync(source).isSymbolicLink()) throw Error('Site files cannot be symlinks'); return !source.endsWith('.gitkeep'); } });
  }
  fs.writeFileSync(path.join(output, 'data/automatic.js'),
    '// Generated from original image files. Custom entries in gallery.js take precedence.\nwindow.AUTO_ILLUSTRATIONS = ' + JSON.stringify(automatic, null, 2) + ';\n');
  console.log(`Prepared site with ${data.stories.length} collections and ${automatic.length} uploaded originals.`);
  return automatic;
}
module.exports = { build };
if (require.main === module) build(process.argv[2] || path.join(__dirname, '..'), process.argv[3] || path.join(__dirname, '../_site'));
