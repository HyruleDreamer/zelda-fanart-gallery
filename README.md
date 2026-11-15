# Stories Beyond Hyrule

An illustrated Zelda fanfiction archive by **HyruleDreamer**. Plain HTML, CSS, and JavaScript; no build, backend, database, API key, tracking, or external fonts. Hosting is intended for GitHub Pages at `https://HyruleDreamer.github.io/zelda-fanart-gallery/`.

## Preview first

Download the review branch with **Code → Download ZIP**. Extract it, then double-click **index.html**. The site works from your computer, including filtering and search. Copy buttons show a manual copy box if your browser blocks clipboard access. No site has been published automatically.

## Add your first illustration

1. On GitHub, open `images/silent-world/` (or your story’s folder). Choose **Add file → Upload files**. Upload your original, such as `moonlit-reunion.png`, then save.
2. Click the repository’s **Actions** tab. Wait for **Generate illustration thumbnails** to show a green check. GitHub automatically saves a smaller WebP copy in `thumbnails/silent-world/moonlit-reunion.png.webp`. You do not need to resize or upload a second image.
3. Open **data/gallery.js**, click the pencil, and replace the hidden example’s details with your own. Remove `example: true` after uploading the original. Save your changes.
4. After publication, wait for GitHub Pages to deploy the change. Open the correct story in the gallery.

Example entry (instructional only; these files are not included):

```js
{
  id: "moonlit-reunion",
  story: "silent-world",
  title: "Moonlit reunion",
  chapter: 1,
  description: "A quiet reunion beneath the moon.",
  alt: "Describe the people, setting, and action actually shown.",
  filename: "moonlit-reunion.png"
}
```

Separate entries with commas. Use double quotes around text; write an internal double quote as `\"`. Chapter and description are optional. You normally omit `thumbnail`: the gallery finds the generated preview automatically. Existing custom `thumbnail` filenames still work if you upload those custom files yourself; remove the field to use automatic previews. The story id must match the stories list. Filenames are case-sensitive. Lowercase names with hyphens are easiest. PNG, JPG/JPEG, WebP, GIF, and AVIF are supported. Browser uploads must be under 25 MiB per file; smaller originals are better for readers. Keep your originals backed up separately.

## Automatic thumbnails — no image editing required

A **GitHub Actions workflow** is an instruction that GitHub runs for you. This one creates image previews, not a website deployment. It uses GitHub’s built-in temporary token; you do not need an API key, paid image service, or Python on your computer.

- Upload originals to `images/<story-id>/` on **review/stories-beyond-hyrule** while reviewing. The workflow runs on that branch, and later on `main` only if you approve a merge.
- Wait for the green check in **Actions → Generate illustration thumbnails**, then add or update the illustration in `data/gallery.js`. That is the only data file you edit.
- Each generated thumbnail is up to **500 pixels wide**, keeps the complete artwork without cropping, and is never enlarged if the original is smaller. Portraits may be taller than 500 pixels. EXIF orientation is respected. Transparent artwork stays transparent. Animated GIF/WebP previews use their first frame; opening the original retains the original animation.
- The complete original filename is retained before the extra `.webp`: `scene.png` becomes `scene.png.webp`, while `scene.jpg` becomes `scene.jpg.webp`. This prevents collisions. Your original files are never resized, overwritten, renamed, or stripped of metadata.
- Generated previews have unnecessary metadata removed. If the encoder lacks WebP support, it writes PNG instead (`scene.png.png`); the gallery tries that fallback automatically. Current browsers support WebP; this is an encoder fallback, not legacy-browser detection.
- The gallery lazy-loads only previews. Clicking opens the original; **Copy Image URL** and **Copy AO3 HTML** always point to `images/`, never to `thumbnails/`.
- Replacing an original with a new file of the same name refreshes its thumbnail. Repeat runs do not create commits when previews are unchanged. Old previews are retained when originals are removed, so this automation never deletes your files.

If GitHub asks to enable Actions for the repository, do so when you are ready to use automatic previews. If a run says it cannot push, check **Settings → Actions → General → Workflow permissions → Read and write permissions**. Repository rules may still prevent automated commits; the workflow will show a failed run rather than bypass those rules. It saves only thumbnail changes to the same branch, using HyruleDreamer and the confirmed GitHub noreply email for both commit identities. It never merges branches or enables Pages.

**If a run fails:** open the red run in Actions and read the failed step. Check that the uploaded file is a real supported image. After fixing it, upload it again or choose **Re-run all jobs** on the failed run. A placeholder remains clickable so you can still open the original. To regenerate everything manually, use **Actions → Generate illustration thumbnails → Run workflow**, selecting the branch you want. GitHub shows this manual button only once the workflow exists on the default branch; before that, uploading a new original or re-running an existing run works on the review branch.

**After you eventually publish:** wait for thumbnail generation to finish *before* saving your metadata edit. GitHub’s built-in token does not trigger another Pages build when the workflow saves thumbnails. Your subsequent metadata edit triggers the normal Pages build with the previews included. If you replaced artwork without editing metadata, make a small meaningful description update after the green check, or re-run the latest Pages deployment from Actions. No deployment is enabled by this feature. [GitHub explains token-triggered workflow behavior here](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).

Optional developer commands (not needed for normal uploads): `python -m pip install -r scripts/requirements.txt`, then `python scripts/generate_thumbnails.py`. Tests: `python -m unittest discover -s scripts -p 'test_*.py'`.

The supplied example has `example: true`, so it never requests nonexistent images. Initially all eleven stories show clearly labeled CSS placeholders, not artwork. A title search searches actual illustrations only. Selecting a collection never shows art from other stories. The lightbox opens originals only on request.

## Publish when you are ready

1. Review the proposed changes. Approve and merge the review branch into **main**.
2. Open **Settings → Pages** in the repository.
3. Under Build and deployment, select **Deploy from a branch**.
4. Select **main** and **/ (root)**, then **Save**.
5. Wait for GitHub’s successful deployment message, then visit the site address above.

No Pages workflow or automatic publishing configuration is included. All site links use relative paths, so the `/zelda-fanart-gallery/` project path works. `.nojekyll` tells Pages to serve the static files as supplied.

## Embed in AO3

1. Open an illustration on the published site.
2. Click **Copy AO3 HTML**.
3. In AO3, switch the chapter editor to **HTML**, paste the code, and preview.

The **Copy image URL** button gives just the original image address. Both buttons always use the final Pages address from `siteUrl` in `data/gallery.js`, never your local preview, a GitHub blob link, or a temporary link. HTML attributes are escaped. The image URLs only work after Pages is enabled and the images are deployed. Test the direct URL in your browser before embedding.

For responsive AO3 images you can optionally add `style="max-width:100%;height:auto;"` to the image element. Verify the result using AO3’s chapter preview.

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
scripts/                   Thumbnail generator, dependency version, and tests
.github/workflows/         Automatic thumbnail generation; no publishing job
.nojekyll                  Static GitHub Pages support
```

The website cannot save uploads: a static site has no authenticated GitHub access or backend. Use GitHub’s actual upload interface. There is no pretend upload button.

## Accessibility and privacy

Use meaningful alt text. Native dialogs support keyboard focus containment and Escape; focus returns to the opening card. Reduced-motion preferences are respected. Previews lazy-load and retain their proportions; originals load only in the viewer. No third-party scripts or network font requests are used.

Public identity: **HyruleDreamer** only. Keep personal contact details out of metadata and remove identifying EXIF/location details from images before uploading. Check GitHub email privacy before making future edits. Public images are downloadable by visitors.

## Troubleshooting

- **Art is missing:** match the filename’s capital letters, story id, and extension; upload the original; remove `example: true`; check commas in the data file.
- **Preview is missing:** wait for the green thumbnail workflow check. Remove an old custom `thumbnail` field to use automatic names. The original is intentionally not downloaded to replace a missing thumbnail.
- **AO3 image does not load:** enable Pages, wait for deployment, and test the copied direct link. Do not paste a `github.com/.../blob/...` link.
- **Old image still appears:** wait for deployment and refresh your browser. Keep the filename unchanged to preserve old embeds.
- **Copy is blocked:** copy the text from the manual copy dialog.

Unofficial fan project. The Legend of Zelda belongs to Nintendo. All uploaded illustrations remain subject to their creators’ rights.
