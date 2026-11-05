# Kenya Deals Hub – Jumia Force Affiliate Website

Static multi-page site for GitHub Pages (no build step).

## Upload to GitHub
Upload everything **except** the `admin-local/` folder (the `.gitignore` already skips it if you use git).
Then Settings → Pages → `main` branch, `/ (root)`, and tick **Enforce HTTPS**. Turn on 2FA on your GitHub account.

## Edit products
1. Open `admin-local/admin.html` on your computer (it is private and never goes online).
2. Click **Load products.json**, add or edit products, click **Download products.json**.
3. Upload the new `products.json` to GitHub.

For each product, paste your own Jumia Force affiliate link in the "affiliate link" field. If it is empty, the button uses the main link in Settings.

## Before going live
- Replace `YOURUSERNAME.github.io/YOUR-REPO` in `robots.txt` and `sitemap.xml` with your real site address.
- Check the "Top Seller" / "Hot Seller" badges are true, and review the Privacy page.
- Do not store passwords or secrets in any file in this repo; everything is public.
