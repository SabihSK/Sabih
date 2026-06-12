# Sheikh Muhammad Sabih Portfolio

Static responsive portfolio website for Sheikh Muhammad Sabih, focused on Flutter, AI applications, Python backend work, data engineering, and production mobile app delivery.

The site is built with plain HTML, CSS, and JavaScript, so it works well on GitHub Pages or any static hosting service.

## Live Sections

- Hero with headline, call-to-action buttons, portrait, and portfolio stats.
- Profile and About sections with contact details and full profile download.
- Services for mobile apps, AI systems, backend APIs, and data workflows.
- Resume Experience section updated from `my_cvs/Profile.pdf`.
- Work highlights and selected projects.
- Education, certifications, skills, and CV download links.
- Contact form that opens a pre-filled email draft.

## Project Structure

```text
.
├── index.html
├── styles.css
├── script.js
├── README.md
├── assets/
│   ├── favicon.svg
│   ├── hero-workspace.png
│   ├── sabih_picture.png
│   ├── sabih-portrait.png
│   └── site-icon.svg
└── my_cvs/
    ├── Profile.pdf
    ├── Sabih_AI_Dev_CV.pdf
    ├── Sabih_Flutter_Dev_CV.pdf
    └── Sabih_Python_Dev_CV.pdf
```

## Run Locally

Because this is a static site, you can open `index.html` directly in a browser.

For a more accurate local preview, run a small HTTP server from the project root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Main Files

- `index.html`: Page content, section structure, navigation links, CV download links, and contact form markup.
- `styles.css`: Full responsive visual design, layout rules, mobile/tablet hamburger menu, cards, sections, and typography.
- `script.js`: Smooth anchor scrolling, hamburger menu open/close behavior, and contact form mailto handling.
- `assets/`: Images, portrait files, and site icons used by the UI.
- `my_cvs/`: Downloadable resume/profile PDFs linked from the site.

## Navigation

The top navigation links to these page anchors:

- `#about`
- `#expertise`
- `#resume`
- `#work`
- `#projects`
- `#contact`

On tablet and mobile widths, the navigation collapses into a hamburger button. The button toggles the `.is-open` class on `.nav-links` and updates `aria-expanded` for accessibility.

## Contact Form

The contact form does not require a backend. On submit, `script.js` validates the fields and opens the visitor's email app with a pre-filled message:

```text
mailto:sabih.sk1@gmail.com
```

This works on GitHub Pages and other static hosts.

## Updating Content

- Update hero, About, Resume, Work, Projects, Skills, Certifications, and Contact text in `index.html`.
- Update colors, spacing, layout, and responsive behavior in `styles.css`.
- Replace images in `assets/` while keeping the same filenames if you do not want to edit references.
- Replace PDFs in `my_cvs/` while keeping the same filenames if you do not want to update download links.
- Update Resume Experience content from `my_cvs/Profile.pdf` when the profile changes.

## Deployment on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to repository `Settings > Pages`.
3. Set source to `Deploy from a branch`.
4. Choose the `main` branch and `/root`.
5. Save and wait for GitHub Pages to publish.

## Deployment on Other Static Hosts

This project can also be deployed to Netlify, Vercel, Cloudflare Pages, Firebase Hosting, or any static file host.

Use the project root as the publish directory. No build command is required.

## Verification Checklist

Before publishing, check:

- `index.html` opens without console errors.
- Header navigation scrolls to the correct sections.
- Hamburger menu opens and closes on tablet/mobile.
- CV download links point to existing files in `my_cvs/`.
- Contact form opens an email draft.
- Images load correctly from `assets/`.
- Layout looks clean around desktop, tablet, and mobile widths.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Static hosting compatible

