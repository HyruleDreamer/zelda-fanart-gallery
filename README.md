# Stories Beyond Hyrule

An illustrated Zelda fanfiction archive by **HyruleDreamer**. Plain HTML, CSS, and JavaScript; no local installation, backend, database, API key, tracking, or external fonts. GitHub prepares the static website automatically. Hosting is intended for GitHub Pages at `https://HyruleDreamer.github.io/zelda-fanart-gallery/`.

## Preview first

Download the review branch with **Code → Download ZIP**. Extract it, then double-click **index.html**. The site works from your computer, including filtering and search. Copy buttons show a manual copy box if your browser blocks clipboard access. No site has been published automatically.

## Add an illustration — just upload your original

1. On GitHub, choose the story folder under **images/**, such as **images/silent-world/**. During review, use **review/stories-beyond-hyrule**. After the site is approved and published, use **main**.
2. Choose **Add file → Upload files**, upload your original, and save. Use a descriptive filename, for example **link-and-zelda-under-the-moon.png**.
3. That is enough. Once publishing is enabled, GitHub prepares the thumbnail and a gallery entry automatically, then publishes everything together. Allow a few minutes, then refresh your gallery.

You do not need to resize anything, upload thumbnails, open the Actions tab, edit a data file for every upload, or start a second deployment. Uploading to the review branch never publishes anything.

The automatic title comes from the filename: `link-and-zelda-under-the-moon.png` becomes “link and zelda under the moon.” The automatic alt text combines that descriptive title with the story name. Choose filenames that describe what the illustration actually shows. For a richer description, chapter number, or custom title, optionally add an entry to **data/gallery.js**:

```js
{
  id: "moonlit-reunion",
  story: "silent-world",
  title: "Moonlit reunion",
  chapter: 1,
  description: "A quiet reunion beneath the moon.",
  alt: "Link and Zelda stand beneath a full moon beside a flowering tree.",
  filename: "link-and-zelda-under-the-moon.png"
}
```

This sample is instructional; no artwork is supplied. A custom entry takes precedence over the automatic entry for the same story and filename, so you will not get duplicates. Separate entries with commas. Chapter and description are optional. The hidden example remains hidden until you replace its details and remove `example: true`. Custom entries also let you control alt text precisely.

PNG, JPG/JPEG, WebP, GIF, and AVIF originals are supported. Spell filenames exactly, including capital letters. Files uploaded through GitHub’s browser interface must be below 25 MiB. Smaller originals are easier for readers to open. Keep your original files backed up separately.

## How automatic previews work

The workflow creates a separate thumbnail up to **500 pixels wide**, without cropping, changing proportions, or enlarging small artwork. It respects rotation and transparency. Animated GIF/WebP previews use the first frame; opening the original retains its animation. Originals remain byte-for-byte unchanged.

The preview for `images/silent-world/scene.png` is `thumbnails/silent-world/scene.png.webp`. Keeping the original extension avoids collisions with `scene.jpg`. If the encoder lacks WebP support it creates a PNG fallback. The gallery loads previews lazily; opening a card and both copy buttons always use the original image.

**Thumbnails and automatic entries are generated in the website package, not committed back to your branch.** This removes the extra commit/deployment problem. The package contains the originals, thumbnails, and current metadata from one upload. No personal token, external image host, or additional service is needed. The workflow does not create commits or change the source branch.

If you download the source ZIP before publishing, automatic entries and previews are not generated in that source download. Existing manually entered illustrations can still open. The full generated website is available in a successful workflow run’s **github-pages** artifact (a download package); extracting it and then its `artifact.tar` lets you preview the exact prepared site. This is optional and not part of normal uploads.

If you previously supplied a custom `thumbnail` name, remove it to use automatic previews, or keep uploading that custom thumbnail yourself. Missing previews show a clickable placeholder rather than downloading the large original into the grid.

If an upload does not appear after a few minutes, refresh the site and check that it was uploaded to the correct story folder on main. Check the filename and file type. A failed image prevents deployment of an incomplete package; the previous published site remains available. The optional diagnostic view is **Actions → Prepare gallery and publish when enabled**. You can ask for help with a failed run; normal uploads do not require interacting with it.

Optional developer commands: install `scripts/requirements.txt`, run `python scripts/generate_thumbnails.py`, then `node scripts/build-site.cjs`. The complete website appears in `_site/`. Tests: `python -m unittest discover -s scripts -p 'test_*.py'` and `node scripts/test-site.cjs`.

## Publish when you are ready — one-time setup

Nothing is published during review. The review branch only prepares and tests a website package. The workflow never enables Pages itself.

After you approve merging into main and are ready to publish:

1. Merge the approved pull request into **main**.
2. Open **Settings → Pages** and choose **GitHub Actions** as the publishing source. Do not choose “Deploy from a branch.” This one-time setting gives the prepared workflow permission to publish the complete package.
3. Upload your first illustration to its story folder on main, or save a small description change in data/gallery.js. That normal change starts the first deployment. No manual Actions run is needed.
4. Wait a few minutes, then visit **https://HyruleDreamer.github.io/zelda-fanart-gallery/**.

From then on, uploading or replacing an illustration, or saving metadata changes, automatically prepares and publishes the whole website in one run. Upload and metadata edits may happen in either order; each change rebuilds the current complete site. Filenames, folders, and asset links work under the project path.

For a previously configured site, switch the Pages source to **GitHub Actions** once. The deployment job runs only on main and only when the Pages API confirms that the owner already enabled this source. Disabled Pages and review branches do not deploy. Missing permissions or image-processing errors fail closed; they do not enable hosting or publish an incomplete site.

## Embed in AO3

1. Open an illustration on the published site.
2. Click **Copy AO3 HTML**.
3. In AO3, switch the chapter editor to **HTML**, paste the code, and preview.

The **Copy image URL** button gives just the original image address. Both buttons always use the final Pages address from `siteUrl` in `data/gallery.js`, never your local preview, a GitHub blob link, or a temporary link. HTML attributes are escaped. The image URLs only work after Pages is enabled and the images are deployed. Test the direct URL in your browser before embedding.

The copied HTML already includes `style="max-width:100%;height:auto;"`, so images shrink to fit narrow screens while keeping their proportions. Meaningful alt text and the original image URL are preserved. Verify the result using AO3’s chapter preview.

## Keep old AO3 links working

Do not rename or delete an embedded image, move its folder, or rename the repository or GitHub account. These URLs are stable as long as the files and hosting location remain in place; they are not guaranteed permanent. To update art without changing its address, replace the file with one of the same name. Deployment and browser caches may take time to update.

## Add a story

In `data/gallery.js`, add a story such as `{ id: "new-story", title: "New Story" }` to `stories`. Use only lowercase letters, numbers, and hyphens in the unique id. Upload images to `images/new-story/`; the workflow creates its thumbnail folder automatically. Set `story: "new-story"` on its illustrations. Menus and counts update automatically.

## Files

```text
index.html                 Homepage, collection filters, viewer
guide.html                 Illustrated archive maintenance guide
assets/style.css           Responsive design, CSS-only scenery/placeholders
assets/gallery.js          Gallery behavior and copy buttons
data/gallery.js            THE ONE FILE to edit for stories and image details
images/<story-id>/         Original images; .gitkeep preserves empty folders
thumbnails/<story-id>/     Small previews; .gitkeep preserves empty folders
data/automatic.js          Empty source placeholder; upload entries generated in the website package
scripts/                   Thumbnail generation, site packaging, safeguards, and tests
.github/workflows/         Prepare all assets together; publish main only after Pages is enabled
.nojekyll                  Static GitHub Pages support
```

The website cannot save uploads: a static site has no authenticated GitHub access or backend. Use GitHub’s actual upload interface. Uploaded images automatically receive gallery entries during packaging. There is no pretend upload button.

## Accessibility and privacy

Use meaningful alt text. Native dialogs support keyboard focus containment and Escape; focus returns to the opening card. Reduced-motion preferences are respected. Previews lazy-load and retain their proportions; originals load only in the viewer. No third-party scripts or network font requests are used.

Public identity: **HyruleDreamer** only. Keep personal contact details out of metadata and remove identifying EXIF/location details from images before uploading. Check GitHub email privacy before making future edits. Public images are downloadable by visitors.

## Troubleshooting

- **Art is missing:** match the filename’s capital letters, story id, and extension; upload the original; remove `example: true`; check commas in the data file.
- **Preview is missing:** allow a few minutes for the automatic website update. Remove an old custom `thumbnail` field to use automatic names. The original is intentionally not downloaded to replace a missing thumbnail.
- **AO3 image does not load:** enable Pages, wait for deployment, and test the copied direct link. Do not paste a `github.com/.../blob/...` link.
- **Old image still appears:** wait for deployment and refresh your browser. Keep the filename unchanged to preserve old embeds.
- **Copy is blocked:** copy the text from the manual copy dialog.

Unofficial fan project. The Legend of Zelda belongs to Nintendo. All uploaded illustrations remain subject to their creators’ rights.
