# Anam Siddiqui — Art Portfolio

A minimalist artist portfolio website inspired by [Njideka Akunyili Crosby's site](https://www.njidekaakunyilicrosby.com/), with a built-in CMS for easy content management.

## Sections

- **Home** — Full-screen hero image with artist name
- **About** — Portrait + biographical text
- **Selected Works** — Gallery of artworks with titles and descriptions
- **Projects** — Square grid of public installations

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site.

## Admin CMS

Visit [http://localhost:3000/admin](http://localhost:3000/admin) to manage all content.

**Default password:** `admin123`

Set a custom password via environment variable:

```bash
ADMIN_PASSWORD=your-secure-password npm run dev
```

### What you can edit

- Home hero image and artist name
- About portrait and bio text
- Selected Works — add/remove items, upload images, edit titles & descriptions
- Projects — same row editor, displayed as square cropped grid

Uploaded images and site content are stored in **Vercel Blob** when `BLOB_READ_WRITE_TOKEN` is set (automatic on Vercel after connecting your Blob store). Locally, files fall back to `public/uploads/` and `data/content.json`.

## Deploying on Vercel

1. Push this repo to GitHub and import it in Vercel
2. Create a **Blob** store (Public) and connect it to the project — Vercel adds `BLOB_READ_WRITE_TOKEN` automatically
3. Add `ADMIN_PASSWORD` in Vercel → Settings → Environment Variables
4. Redeploy

After deploy, `/admin` uploads and saves persist in production.

## Tech stack

- Next.js 15 (App Router)
- Tailwind CSS
- File-based content storage (no database required)
