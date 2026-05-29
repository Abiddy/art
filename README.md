# Anam Siddiqui — Art Portfolio

A minimalist artist portfolio website inspired by [Njideka Akunyili Crosby's site](https://www.njidekaakunyilicrosby.com/), with a built-in CMS for easy content management.

## Sections

- **Home** — Full-screen hero image with artist name
- **About** — Portrait + biographical text
- **Selected Works** — Gallery of artworks with titles and descriptions
- **Public Projects** — Gallery of public installations

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
- Public Projects — same as Selected Works

Uploaded images are saved to `public/uploads/`. All text and image URLs are stored in `data/content.json`.

## Tech stack

- Next.js 15 (App Router)
- Tailwind CSS
- File-based content storage (no database required)
