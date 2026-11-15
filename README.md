# Stories Beyond Hyrule

An illustrated Zelda fanfiction archive by **HyruleDreamer**. Plain HTML, CSS, and JavaScript; no build, backend, database, API key, tracking, or external fonts. Hosting is intended for GitHub Pages at `https://HyruleDreamer.github.io/zelda-fanart-gallery/`.

## Preview first

Download the review branch with **Code → Download ZIP**. Extract it, then double-click **index.html**. The site works from your computer, including filtering and search. Copy buttons show a manual copy box if your browser blocks clipboard access. No site has been published automatically.

## Add your first illustration

1. On GitHub, open `images/silent-world/` (or your story’s folder). Choose **Add file → Upload files**. Upload your original, such as `moonlit-reunion.png`, then save.
2. Create a smaller image, about 600–900 pixels wide, and upload it to `thumbnails/silent-world/`, for example `moonlit-reunion.webp`. The grid loads this instead of the large original. Without a thumbnail, a CSS placeholder is shown; opening the card loads the full image.
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
  filename: "moonlit-reunion.png",
  thumbnail: "moonlit-reunion.webp"
}
```

Separate entries with commas. Use double quotes around text; write an internal double quote as `\"`. Chapter, description, and thumbnail are optional. The story id must match the stories list. Filenames are case-sensitive. Lowercase names with hyphens are easiest. PNG, JPG/JPEG, WebP, GIF, and AVIF are supported. Browser uploads must be under 25 MiB per file; compress images to a much smaller size for readers. Keep your originals backed up separately.

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

In `data/gallery.js`, add a story such as `{ id: "new-story", title: "New Story" }` to `stories`. Use only lowercase letters, numbers, and hyphens in the unique id. Upload images to `images/new-story/` and previews to `thumbnails/new-story/`. Set `story: "new-story"` on its illustrations. Menus and counts update automatically.

## Files

```text
index.html                 Homepage, collection filters, viewer
guide.html                 Illustrated archive maintenance guide
assets/style.css           Responsive design, CSS-only scenery/placeholders
assets/gallery.js          Gallery behavior and copy buttons
data/gallery.js            THE ONE FILE to edit for stories and image details
images/<story-id>/         Original images; .gitkeep preserves empty folders
thumbnails/<story-id>/     Small previews; .gitkeep preserves empty folders
.nojekyll                  Static GitHub Pages support
```

The website cannot save uploads: a static site has no authenticated GitHub access or backend. Use GitHub’s actual upload interface. There is no pretend upload button.

## Accessibility and privacy

Use meaningful alt text. Native dialogs support keyboard focus containment and Escape; focus returns to the opening card. Reduced-motion preferences are respected. Previews lazy-load and retain their proportions; originals load only in the viewer. No third-party scripts or network font requests are used.

Public identity: **HyruleDreamer** only. Keep personal contact details out of metadata and remove identifying EXIF/location details from images before uploading. Check GitHub email privacy before making future edits. Public images are downloadable by visitors.

## Troubleshooting

- **Art is missing:** match the filename’s capital letters, story id, and extension; upload the original; remove `example: true`; check commas in the data file.
- **Preview is missing:** confirm its thumbnail name and folder. The original is intentionally not downloaded to replace a missing thumbnail.
- **AO3 image does not load:** enable Pages, wait for deployment, and test the copied direct link. Do not paste a `github.com/.../blob/...` link.
- **Old image still appears:** wait for deployment and refresh your browser. Keep the filename unchanged to preserve old embeds.
- **Copy is blocked:** copy the text from the manual copy dialog.

Unofficial fan project. The Legend of Zelda belongs to Nintendo. All uploaded illustrations remain subject to their creators’ rights.
