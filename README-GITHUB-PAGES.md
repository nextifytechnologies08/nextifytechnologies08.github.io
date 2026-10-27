# Deploy Nextify Technologies to GitHub Pages (`your-username.github.io`)

**ટૂંકમાં (ગુજરાતીમાં):** GitHub Pages ફક્ત static files (HTML/CSS/JS) serve કરે છે — PHP નહિ. એટલે આ folder માં PHP પહેલેથી HTML માં convert કરેલું છે, અને contact form હવે Formspree (free service) વાપરે છે. નીચે આપેલા steps પ્રમાણે કરો.

---

## What's in this folder (exact file names)

```
index.html             ← homepage
services.html
products.html
blog.html
career.html
contact.html
faq.html
terms.html
privacy-policy.html
404.html               ← GitHub Pages shows this automatically on a broken link
.nojekyll               ← tells GitHub Pages not to run Jekyll (keeps assets/ working as-is)
assets/
  css/style.css
  js/main.js            ← you edit ONE line here to connect the contact form
  images/                ← put logo.png, logo-white.png, favicon.png here
README-GITHUB-PAGES.md  ← this file
```

This is a ready-to-push static export. It was generated from the original
PHP project (which still has the editable `includes/config.php` etc.) —
keep that PHP version as your "source", and re-export to this folder
whenever you change something (ask me any time and I'll regenerate it).

---

## Step 1 — Connect the contact form (Formspree, free)

GitHub Pages can't run PHP, so the contact/careers forms post to
[Formspree](https://formspree.io) instead:

1. Go to **formspree.io** → sign up free → **New Form**.
2. Copy the endpoint it gives you — looks like `https://formspree.io/f/xxxxxxxx`.
3. Open `assets/js/main.js` in this folder, find this line near the top:
   ```js
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/your_form_id'; // ← replace after signup, see README-GITHUB-PAGES.md
   ```
   Replace `your_form_id` with your real endpoint.
4. Save the file. Both the Contact page and the Careers "Apply now" form
   use this same line.

Until you do this, the forms show a friendly "Form is not connected yet"
message instead of silently failing — so nothing looks broken either way.

## Step 2 — Add your logo (optional, works without it)

Drop these into `assets/images/`:
- `logo.png` (light header)
- `logo-white.png` (dark footer)
- `favicon.png` (browser tab icon)

Until you add them, the header/footer automatically show a styled
"Nextify Technologies" text mark, so the site looks fine either way.

## Step 3 — Create the GitHub repository

For a **user/organization site** living at `https://your-username.github.io`,
the repository name must be **exactly** `your-username.github.io`
(replace `your-username` with your real GitHub username).

On github.com:
1. Click **New repository**.
2. Repository name: `your-username.github.io`
3. Keep it **Public**, don't add a README/gitignore (we already have files).
4. Click **Create repository**.

## Step 4 — Push these exact files to it

Open a terminal **inside this folder** (the one with `index.html` in it)
and run:

```bash
git init
git add .
git commit -m "Initial deploy: Nextify Technologies site"
git branch -M main
git remote add origin https://github.com/your-username/your-username.github.io.git
git push -u origin main
```

Replace `your-username` in the remote URL with your actual GitHub username
(two places — the folder name you created in Step 3, and here).

## Step 5 — Turn on Pages (usually automatic)

For a repo named `your-username.github.io`, GitHub Pages is usually enabled
automatically from the `main` branch. To check or turn it on manually:

1. On GitHub, open your repo → **Settings** → **Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)` → **Save**.
4. Wait 1–2 minutes, then visit **`https://your-username.github.io`**.

## If you'd rather deploy it as a *project* site instead

If you want it at `https://your-username.github.io/nextify-technologies`
instead of your root domain, use any repo name you like (e.g.
`nextify-technologies`), push the same files the same way, then in
**Settings → Pages** pick branch `main`, folder `/ (root)`. GitHub will
give you the project URL automatically.

## Updating the site later

1. Edit the `.html`/`.css`/`.js` files in this folder directly (or ask me
   to change the original PHP source and re-export).
2. From inside the folder:
   ```bash
   git add .
   git commit -m "Update site content"
   git push
   ```
3. GitHub Pages redeploys automatically within a minute or two.

## Custom domain (optional)

If you later buy a domain (e.g. `nextifytechnologies.com`):
1. Add a file named exactly `CNAME` (no extension) in this folder containing
   just the domain: `nextifytechnologies.com`
2. Point your domain's DNS to GitHub Pages (GitHub's docs: *Managing a
   custom domain for your GitHub Pages site*).
3. Commit and push the `CNAME` file along with everything else.
