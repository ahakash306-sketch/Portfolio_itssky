# itssky.co.in portfolio

Static portfolio and Studio admin panel, ready for GitHub Pages. No build step or
server-side code is required.

## Repository structure

- `index.html` — portfolio homepage
- `works/*/index.html` — the five case-study renderers
- `admin.html` — Studio content editor
- `content.json` — published CMS content
- `cms.js`, `case-data.js`, `image-slot.js`, `support.js` — site runtime
- `portfolio-knowledge.js` — predefined conversational answers, evidence and follow-ups
- `conversation.js`, `conversation.css` — guided homepage interaction and presentation
- `*-refinements.css` and `*-refinements.js` — responsive UI and interaction refinements
- `assets/` and `uploads/` — referenced site media
- `robots.txt`, `sitemap.xml`, `og_image.jpg` — search and sharing assets

## Edit and publish content

1. Open `/admin.html` on the same site origin as the portfolio.
2. Edit Home page, Work, SEO & sharing, or a case study.
3. Preview a case study using its **Open this case study** link.
4. Select **Export content.json**.
5. Replace the repository's root `content.json` with the downloaded file and commit.

The site reads `content.json` on load. Drafts remain in the current browser until
exported. The exported filename and repository filename are both exactly
`content.json`.

## Add a case study

In Studio, open **Work** and select **Add entry**. Choose one template:

- **Basic case study** — the structure used by Kriyam, Proteger and Goodbook
- **Detailed case study** — the WorkSpace long-form structure
- **MVPs and ideas** — the BUSEit structure

Each entry has separate **Card** and **Case study page** tabs. New entries begin as
Coming soon. Clear that setting when the case study is ready to open from the home
page.

New entries reuse the matching case-study renderer through their generated preview
URL; no new physical folder is required.

## Media

Choosing media in Studio embeds it in `content.json`, which is convenient for small
assets and portable previews. For larger images or video, add the file to `uploads/`
and enter its repository path, such as `uploads/project-cover.jpg`, to keep the JSON
file small.

## Deploy

Upload the contents of this folder to the root of the GitHub Pages repository. Keep
the folder structure unchanged. If the repository already has newer published
content, back up its `content.json` before replacing files.

The admin page is public on static hosting. It cannot change the repository by
itself; publishing still requires committing the exported `content.json`.
# Conversational portfolio

The homepage is a static chat-style interface. Five recruiter-focused paths remain below the text field throughout the conversation and return short answers, named project evidence, contextual follow-ups, and links to the full case studies. Typed questions use local intent matching, including partial phrases and simple spelling mistakes. Unknown questions return three relevant suggested paths. The experience does not use a microphone, call an AI service, or invent answers outside `portfolio-knowledge.js`. The full original portfolio remains available at `explore.html`, including the journey panel.

The existing admin export workflow is unchanged: edit in `admin.html`, export `content.json`, replace it in the repository, and commit. Open previews through an HTTP server rather than directly as local files. Draft preview links retain preview mode when opening a case study or the full portfolio.
