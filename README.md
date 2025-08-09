# Shadows & Light — Starter (Next.js, Azure Static Web Apps)

A minimal Next.js site with an elegant “shadows & light” theme and simple JSON-based content for **Gigs** and **Media**. 
This deploys cleanly to **Azure Static Web Apps** and can be upgraded to a headless CMS (Sanity) later.

## Quick  start
1. Upload these files to a new GitHub repository.
2. In Azure Portal, create **Static Web App**:
   - Source: GitHub → select your repo and branch
   - Build preset: **Next.js**
   - App location: `/`
   - Output location: `.next`
3. Azure will create a GitHub Action → first build → your site goes live on an Azure URL.

## Editing content (no CMS yet)
- Update gigs: `site-data/gigs.json`
- Photos: `site-data/photos.json`
- Videos: `site-data/videos.json` (use YouTube links)
- Audio: `site-data/audio.json` (file or stream URLs)

Commit changes to `main` → GitHub Actions rebuild → site updates automatically.

## Pages
- `/` — Home
- `/gigs` — Upcoming gigs (filterable, sorted client-side)
- `/media` — Photos / Videos / Audio

## Upgrade to a CMS (later)
When you're ready:
1. Create a Sanity project.
2. Add schemas for Gig, Photo, Video, Audio.
3. Replace the JSON imports with Sanity queries in the pages.
4. Deploy Studio at `/studio` to edit content in a web UI.

## Scripts
- `npm run dev` — local dev
- `npm run build` — production build
- `npm start` — run the production server

## License
MIT
