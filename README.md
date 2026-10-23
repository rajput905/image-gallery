# Responsive Image Gallery

A filterable, paginated image gallery with a full-screen lightbox viewer. Three columns on desktop, two on tablet, one on mobile. Built with vanilla HTML, CSS and JavaScript.

## Features

- 12 photos across three categories: Nature, City, Coast
- Pill-shaped filter buttons with `aria-pressed` state
- "Load more" pagination (6 images per batch) with keyboard focus management
- Native `<dialog>` lightbox with `showModal()` — no library needed
- Arrow-key navigation and backdrop-click-to-close in the lightbox
- Focus returns to the originating thumbnail after closing
- Hover caption with gradient overlay (always visible on touch screens)
- Staggered rise animation on new cards
- Image fallback: if Unsplash fails, swaps to Picsum via capture-phase error listener
- `prefers-reduced-motion` support

## Tech Stack

- HTML5 (`<dialog>`, `<figure>`, semantic elements, ARIA attributes)
- CSS3 (Grid, custom properties, keyframe animations, `::backdrop`)
- JavaScript (IIFE, event delegation, `showModal()`, keyboard events)
- Images: Unsplash (primary), Picsum Photos (fallback)

## Files

| File | Purpose |
| :--- | :--- |
| `index.html` | Gallery grid, filter bar, lightbox dialog, footer |
| `style.css` | Grid layout, lightbox styling, responsive breakpoints |
| `script.js` | Photo data, rendering, filtering, pagination, lightbox logic |

## Run Locally

Open `index.html` in any browser.
