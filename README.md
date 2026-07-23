# Pinder's Painters — Website

Professional painters & decorators in Cornwall. Static website hosted on **GitHub Pages**
with the custom domain **www.pinderspainters.co.uk**.

Rebuilt from the original WordPress custom-HTML blocks into a clean, maintainable,
mobile-responsive static site: separated HTML / CSS / JS, a shared header and footer,
CSS design tokens, and progressive-enhancement JavaScript.

---

## Project structure

```
PindersPainters.github.io/
├── index.html                              # Homepage
├── contractor-services.html                # Contractor labour supply
├── residential-services.html               # Residential painting (+ FAQ accordion)
├── projects.html                           # Portfolio (+ filter buttons)
├── blog.html                               # Blog listing
├── why-work-with-us.html                   # Why choose us
├── contact.html                            # Contact + enquiry form
├── blog-winter-painting-tips-cornwall.html # Blog post 1
├── blog-exterior-painting-guide-cornwall.html
├── blog-spring-decorating-cornwall.html
├── blog-interior-window-frames-cornwall.html
├── css/
│   └── styles.css                          # All styles + design tokens (:root variables)
├── js/
│   └── scripts.js                          # Nav, FAQ, filters, form validation
├── images/                                 # (Placeholder for future local images)
├── favicon.svg                             # Site icon
├── CNAME                                   # Custom domain for GitHub Pages
├── robots.txt
├── sitemap.xml
└── README.md
```

> **Images:** Photos currently load from the existing WordPress media library
> (`https://pinderspainters.co.uk/wp-content/uploads/…`), so they display immediately.
> To make the site fully self-contained, download those images into `images/` and update
> the `src` / `og:image` paths to `images/…`.

---

## Editing the site

- **Colours, spacing, fonts:** edit the CSS variables in the `:root` block at the top of
  `css/styles.css` (e.g. `--pp-navy`, `--pp-orange`, `--pp-wrap`). They cascade everywhere.
- **Header / footer:** these are duplicated in each `.html` file (there is no build step).
  If you change one, apply the same change to every page so navigation stays consistent.
- **Add a blog post:** copy an existing `blog-*.html` file, update the content and `<head>`
  meta, then add a matching card to `blog.html` and a `<url>` entry to `sitemap.xml`.
- **Add a project:** copy a `.pp-proj-card` block in `projects.html`; set
  `data-category="contractor"` or `data-category="residential"` so filtering works.

---

## Local preview

From this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Contact form

`contact.html` includes a validated enquiry form. Validation (required fields, email/phone
format) runs client-side in `js/scripts.js`. **It does not yet send email** — until a form
backend is connected it validates and shows an on-screen confirmation.

To receive submissions by email, use a free service such as **Formspree**:

1. Create an account at <https://formspree.io> and a new form; copy your form ID.
2. In `contact.html`, change the `<form>` tag to:
   ```html
   <form id="pp-contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
3. Submissions will then be emailed to you. (The script automatically lets a real `action`
   submit normally instead of showing the placeholder confirmation.)

---

## Deployment (GitHub Pages)

> **Account note:** these instructions assume you are pushing to a GitHub account named
> **PindersPainters**. Because the repo is named `PindersPainters.github.io`, GitHub serves
> it automatically as a *user site*. If you instead push to a different account, either name
> the repo `<that-account>.github.io`, or keep this name as a *project site* — the custom
> domain (below) works either way.

From this folder:

```bash
git init
git add .
git commit -m "Initial commit: Pinder's Painters website"
git branch -M main
git remote add origin https://github.com/PindersPainters/PindersPainters.github.io.git
git push -u origin main
```

Then in the repository on GitHub:

1. **Settings → Pages**
2. **Build and deployment → Source:** *Deploy from a branch*
3. **Branch:** `main`, folder `/ (root)` → **Save**
4. Under **Custom domain**, enter `www.pinderspainters.co.uk` → **Save**
   (the `CNAME` file already sets this; GitHub will verify it).
5. Once DNS has propagated, tick **Enforce HTTPS**.

The site auto-redeploys on every push to `main`.

The default URL is `https://PindersPainters.github.io/`, which redirects to the custom
domain once DNS is configured.

---

## DNS configuration for www.pinderspainters.co.uk

Log in to your **domain registrar** (e.g. GoDaddy, Namecheap, 123-reg, Cloudflare) and open
the DNS settings for `pinderspainters.co.uk`.

### 1. Point `www` to GitHub Pages (CNAME record)

| Type  | Host / Name | Value                       | TTL     |
|-------|-------------|-----------------------------|---------|
| CNAME | `www`       | `pinderspainters.github.io.`| Default |

*(Value is the GitHub Pages host — `<account>.github.io`. Include the trailing dot if your
registrar requires it.)*

### 2. Point the apex/root domain to GitHub Pages (A + AAAA records)

So that `pinderspainters.co.uk` (without `www`) also works and redirects to `www`:

| Type | Host / Name | Value             |
|------|-------------|-------------------|
| A    | `@`         | `185.199.108.153` |
| A    | `@`         | `185.199.109.153` |
| A    | `@`         | `185.199.110.153` |
| A    | `@`         | `185.199.111.153` |
| AAAA | `@`         | `2606:50c0:8000::153` |
| AAAA | `@`         | `2606:50c0:8001::153` |
| AAAA | `@`         | `2606:50c0:8002::153` |
| AAAA | `@`         | `2606:50c0:8003::153` |

- Remove any old A records / parking records pointing at the previous host.
- If the registrar only allows a `www` CNAME and an apex forward, set the apex to
  **forward/redirect** to `https://www.pinderspainters.co.uk`.
- DNS changes can take from a few minutes up to 48 hours to propagate.
- In **Settings → Pages**, keep the custom domain as `www.pinderspainters.co.uk` and enable
  **Enforce HTTPS** once the certificate has been issued.

> These are GitHub's official Pages IP addresses at time of writing; if GitHub Pages
> documentation lists different apex IPs in future, use those.

---

## Accessibility & SEO

- Semantic HTML5 landmarks (`header`, `nav`, `main`, `footer`, `article`), skip link,
  visible keyboard focus, `aria-current` on the active nav item, `aria-expanded` on the
  mobile menu and FAQ, `alt` text on all images, decorative icons marked `aria-hidden`.
- Per-page `<title>`, meta description, keywords, canonical URL, and Open Graph tags.
- `HousePainter` structured data on the homepage, plus `sitemap.xml` and `robots.txt`.
