# Spice Route Kitchen - Restaurant Website

A multi-page website for a fictional Indian restaurant in Pune. Built for **Web Technology CA - Assignment 1** using only HTML, CSS and JavaScript (no frameworks).

**Live site:** _add your Vercel / Netlify link here_
**Repository:** _add your GitHub link here_

## Pages
| Page | File | What it shows |
|------|------|---------------|
| Home | `index.html` | Hero, three signature dishes, about section, booking call-to-action |
| Menu | `menu.html` | Menu table (thead / tbody / tfoot, `rowspan`, `colspan`), print button |
| Gallery | `gallery.html` | 8 images with lightbox, audio player |
| Book a table | `contact.html` | Reservation form (10 field types), opening-hours table, Google Map iframe |

All pages share one stylesheet (`style.css`) and one script (`script.js`).

## Required features checklist
- Semantic HTML5: `header`, `nav`, `main`, `section`, `article`, `footer`
- Table with `thead`, `tbody`, 11 rows, `rowspan` and `colspan`
- Form with text, email, tel, number, date, time, select, radio, checkbox and textarea; every field has a `label`; built-in validation with `required`, `pattern`, `min`, `max` and `minlength`
- 8 images with meaningful `alt` text, 1 `audio` element with controls, 1 `iframe` (Google Maps)
- Flexbox and Grid layout, media queries for phone, tablet and laptop
- Navbar with the current page highlighted (`aria-current="page"`) and a footer on every page

## Extra features
- **Dark / Light mode** toggle that remembers your choice in `localStorage` and applies it on every page before it paints (no flash). On the first visit it follows the system setting.
- Mobile hamburger menu opened and closed with JavaScript
- Live form validation with custom messages under each field, plus a character counter
- Gallery lightbox (close with the button, Escape or a click outside)
- Back to top button and sticky navbar
- Print-friendly menu page

## Project structure
```
index.html  menu.html  gallery.html  contact.html
style.css
script.js
images/   (SVG illustrations)
audio/    restaurant-ambience.wav
README.md
```

## How to run
Open `index.html` in a browser, or use the VS Code Live Server extension.

## How to deploy
1. Create a GitHub repository and push this folder (commit regularly with clear messages).
2. On Netlify or Vercel choose "Import from Git" and select the repository.
3. No build command is needed. The publish directory is the repository root.

## Notes
- The restaurant name, address, phone and email are made up. Replace them in each page's footer and on the contact page.
- The reservation form is a front-end demo. It validates input and shows a confirmation, but does not send data anywhere.
- All images are original SVG illustrations. You can replace them with your own photos; keep the `alt` text meaningful.
