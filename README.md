# Cris & Vini — Dusk Ocean Wedding Letter

A bilingual, mobile-friendly Save the Date website with an envelope-opening interaction, cream stationery, dusk-blue typography, muted rose wax seal, subtle Kai & Yuki line art, your photographs, and an early-attendance form.

**Wedding date:** 24 April 2027  
**Destination:** Northeastern Brazil — Salvador or Ilhéus (to be confirmed)  
**Important:** this is an early indication of attendance, not the final RSVP.

## What is included?
- `index.html` — English landing page (useful for GitHub Pages project sites)
- `en/index.html` — English version
- `pt/index.html` — Brazilian Portuguese version
- `assets/styles.css` — responsive Dusk Ocean design
- `assets/script.js` — envelope-opening animation and form submission
- `assets/photos/cris-vini.jpg` — selected main portrait
- `assets/photos/our-adventures.jpg` — bridge photograph for the story section
- `backend/Code.gs` — optional Google Apps Script endpoint for private Google Sheets storage

## Step 1 — Create the GitHub repository
1. Sign in to GitHub and open https://github.com/new
2. Repository name suggestion: `cris-vini-wedding` (short, memorable, no spaces).
3. Choose **Public** (GitHub Pages is available for public repositories on the free plan; do not put guest information or secrets in this repository).
4. Select **Add a README file** if you like; then click **Create repository**.
5. Upload the website files as described in the setup guide you are following. Upload the *contents* of this kit, not the ZIP itself.

## Step 2 — Add files to the repository
On the new repository page, choose **Add file → Upload files**. Extract this ZIP on your computer first, then drag all files and folders from the extracted folder into the upload area. Make sure `index.html`, `.nojekyll`, `assets`, `en`, `pt`, and `backend` appear at repository root. Commit the files to the `main` branch.

If the browser uploader does not preserve empty directories, that is fine; every directory here has files except the marker file at root.

## Step 3 — Enable GitHub Pages
1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`, then click **Save**.
4. Wait for the Pages deployment to finish. Your URL will look like `https://YOUR-USERNAME.github.io/cris-vini-wedding/`.
5. Test the English homepage, `/en/`, and `/pt/` on desktop and mobile.

## Step 4 — Connect the response form privately
GitHub Pages only hosts static files; it cannot store submissions on its own. This starter uses Google Apps Script to write guest replies into a Google Sheet. The spreadsheet can remain private, but the endpoint URL is visible in the website code and can receive spam. For a larger guest list, consider a form provider with anti-spam controls.

1. Sign into the Google account where you want to store replies.
2. Create a Google Sheet named `Cris & Vini — Wedding Responses`. Keep its sharing restricted to you and anyone you explicitly trust.
3. In the sheet, open **Extensions → Apps Script**.
4. Replace the editor code with the contents of `backend/Code.gs`, then save.
5. Choose **Deploy → New deployment → Web app**.
6. Set **Execute as** to **Me**. Set **Who has access** to **Anyone** so guests can reply without signing in. This makes the web endpoint public; do not make the Sheet public.
7. Deploy and approve the permissions. Copy the Web app URL ending in `/exec`.
8. Open `assets/script.js` in your repository and replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with the copied URL. Commit the change.
9. Test with a dummy response and verify the row appears in your private Sheet before sending the site to guests. The browser uses `no-cors`, so its thank-you message cannot independently verify that a row was written; always test the sheet itself.
10. If you change the Apps Script later, use **Deploy → Manage deployments → Edit → New version**.

The script creates the response spreadsheet automatically on the first valid submission if it cannot find a saved spreadsheet ID. If you already created a sheet and want the script to use that exact sheet, add its ID as a Script Property named `SPREADSHEET_ID` (Apps Script → Project Settings → Script properties). If you don't set this property, the script creates its own private spreadsheet.

## Privacy and anti-spam notes
- The website is public, so only use photographs you are comfortable sharing with guests.
- Never commit guest lists, exported responses, passwords, API keys, or private tokens to GitHub.
- Keep the response spreadsheet private.
- Because the public endpoint can be spammed, check responses regularly. For stronger protection, use a service with spam controls, or add rate limiting/CAPTCHA before sending the invitation widely.
- Collect only details needed for early planning. Tell guests why you are collecting them, as the form does.

## Before sharing with guests
- [ ] GitHub Pages URL loads over HTTPS.
- [ ] Envelope opens on desktop and mobile.
- [ ] English and Portuguese language links work.
- [ ] Date and destination wording are correct.
- [ ] Google Apps Script endpoint is connected.
- [ ] Test reply appears in the private Google Sheet.
- [ ] You understand that the destination is still shown as Salvador or Ilhéus.
- [ ] Final RSVP will be collected later, after resort and travel details are confirmed.

## Change the copy or date later
Edit `index.html`, `en/index.html`, or `pt/index.html`. The styles are shared through `assets/styles.css`. Image files are stored under `assets/photos/`; keep their filenames unchanged unless you also update the HTML.


## Updated art direction
The wedding visual identity is dusk-inspired, not gold-dominant: deep ocean blue `#2F3F56`, sea blue `#6A8CA0`, mist `#BFD0D6`, dusk rose `#D8A7B0`, peach glow `#F2C2A6`, and soft gold `#C6A66B` used only as a restrained accent. The opening envelope scene uses a dusk-sky and ocean gradient. The monogram and cat line-art remain delicate navy symbols inspired by the separate symbol reference.
