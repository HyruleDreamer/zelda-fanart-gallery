const fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const vm = require('node:vm'), assert = require('node:assert/strict');
const { build } = require('./build-site.cjs');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'hyrule-site-test-'));
try {
  const source = path.join(temp, 'source');
  fs.mkdirSync(source);
  for (const name of ['index.html', 'guide.html', '.nojekyll', 'assets', 'data', 'images', 'thumbnails']) {
    fs.cpSync(path.join(root, name), path.join(source, name), { recursive: true });
  }
  const filename = 'link-and-zelda & moon.png';
  const original = Buffer.from('test-only-original');
  fs.writeFileSync(path.join(source, 'images/silent-world', filename), original);
  fs.writeFileSync(path.join(source, 'thumbnails/silent-world', filename + '.webp'), 'test-only-preview');
  const output = path.join(temp, 'site');
  const automatic = build(source, output);
  assert.equal(automatic.length, 1);
  assert.equal(automatic[0].title, 'link and zelda & moon');
  assert.deepEqual(fs.readFileSync(path.join(output, 'images/silent-world', filename)), original);
  assert.ok(fs.existsSync(path.join(output, 'thumbnails/silent-world', filename + '.webp')));
  assert.ok(!fs.existsSync(path.join(output, '.github')));
  assert.ok(!fs.existsSync(path.join(output, 'scripts')));
  const generated = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(output, 'data/automatic.js'), 'utf8'), generated);
  assert.equal(generated.window.AUTO_ILLUSTRATIONS[0].filename, filename);

  const nodes = new Map();
  function node() { return {children: [], events: {}, style: {setProperty() {}}, classList: {add() {}},
    append(...values) {this.children.push(...values);}, replaceChildren() {this.children = [];},
    setAttribute() {}, addEventListener(name, fn) {this.events[name] = fn;}, focus() {}, showModal() {}}; }
  const context = {window: {addEventListener() {}}, document: {getElementById(id) {if (!nodes.has(id)) nodes.set(id, node()); return nodes.get(id);}, createElement: node},
    location: {hash: '#story=silent-world'}, history: {replaceState() {}}, URL, encodeURIComponent, setTimeout, clearTimeout};
  vm.runInNewContext(fs.readFileSync(path.join(output, 'data/gallery.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(path.join(output, 'data/automatic.js'), 'utf8'), context);
  assert.equal(context.window.GALLERY_DATA.stories.length, 11);
  const curated = {story: 'silent-world', filename, title: 'A custom title', alt: 'Link & Zelda under a "moon"'};
  context.window.GALLERY_DATA.illustrations.push(curated);
  nodes.set('search', {value: '', addEventListener() {}});
  vm.runInNewContext(fs.readFileSync(path.join(output, 'assets/gallery.js'), 'utf8'), context);
  assert.equal(nodes.get('gallery').children.length, 1, 'Custom entry overrides the automatic entry');
  const helpers = context.window.GalleryHelpers;
  const html = helpers.embed(curated);
  assert.ok(html.includes('style="max-width:100%;height:auto;"'));
  assert.ok(html.includes('alt="Link &amp; Zelda under a &quot;moon&quot;"'));
  assert.ok(html.includes('/images/silent-world/link-and-zelda%20%26%20moon.png'));
  assert.ok(!html.includes('/thumbnails/'));
  const button = nodes.get('gallery').children[0].children[0];
  assert.equal(button.children[0].children[0].src, helpers.path(curated, true));
  button.events.click();
  assert.equal(nodes.get('full-image').src, helpers.path(curated));
  assert.equal(nodes.get('direct-url').value, helpers.direct(curated));

  fs.unlinkSync(path.join(source, 'thumbnails/silent-world', filename + '.webp'));
  assert.throws(() => build(source, path.join(temp, 'incomplete')), /Missing generated preview/);
  console.log('PASS: complete package; automatic entries; custom overrides; 11 collections; responsive escaped AO3 HTML; original URLs; missing-preview failure.');
} finally {
  if (path.dirname(temp) !== path.resolve(os.tmpdir()) || !path.basename(temp).startsWith('hyrule-site-test-')) throw Error('Unexpected temporary path');
  fs.rmSync(temp, {recursive: true, force: true});
}
