// Spice Route Kitchen - shared script, loaded on every page.
'use strict';

/* ---------- 1. Dark / Light mode (remembered in localStorage) ---------- */
const THEME_KEY = 'sr-theme';
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

// Saves the choice, updates the page and the button label/icon.
const applyTheme = (theme, save = true) => {
  root.setAttribute('data-theme', theme);
  if (save) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage blocked: ignore */ }
  }
  if (themeBtn) {
    const isDark = theme === 'dark';
    themeBtn.textContent = isDark ? '☀' : '☾';
    themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeBtn.setAttribute('aria-pressed', String(isDark));
  }
};
// The small inline script in <head> already set data-theme, so just sync the button.
applyTheme(root.getAttribute('data-theme') || 'light', false);
themeBtn?.addEventListener('click', () => {
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ---------- 2. Hamburger menu (phones) ---------- */
const menuBtn = document.getElementById('menuToggle');
const navList = document.getElementById('navLinks');
menuBtn?.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? '✕' : '☰';
});
// Close the menu when a link is chosen or Escape is pressed.
navList?.addEventListener('click', (e) => {
  if (e.target.closest('a')) { navList.classList.remove('open'); menuBtn.textContent = '☰'; menuBtn.setAttribute('aria-expanded', 'false'); }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navList?.classList.contains('open')) menuBtn.click();
});

/* ---------- 3. Back to top button ---------- */
const topBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  topBtn?.classList.toggle('show', window.scrollY > 500);
}, { passive: true });
topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- 4. Footer year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- 5. Gallery lightbox (gallery page only) ---------- */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = lightbox.querySelector('img');
  const lbCap = lightbox.querySelector('figcaption');
  const closeBtn = lightbox.querySelector('.close');
  let lastFocus = null;

  const openLightbox = (btn) => {
    const img = btn.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = btn.dataset.caption || img.alt;
    lightbox.classList.add('open');
    lastFocus = btn;
    closeBtn.focus();
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lastFocus?.focus();
  };
  document.querySelectorAll('.gallery button').forEach((b) => b.addEventListener('click', () => openLightbox(b)));
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

/* ---------- 6. Booking form: live validation with custom messages ---------- */
const form = document.getElementById('bookingForm');
if (form) {
  const success = document.getElementById('formSuccess');

  // Do not allow booking in the past: set min date to today (local time).
  const dateInput = form.elements.date;
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
  dateInput.min = today;

  // Returns a friendly message for the first problem found, or '' if the field is fine.
  const messageFor = (el) => {
    const v = el.validity;
    if (v.valid) return '';
    const name = el.dataset.label || 'This field';
    if (v.valueMissing) return `${name} is required.`;
    if (v.typeMismatch) return `Please enter a valid ${el.type}.`;
    if (v.patternMismatch) return el.dataset.patternMsg || 'Please match the requested format.';
    if (v.tooShort) return `Please write at least ${el.minLength} characters (you have ${el.value.length}).`;
    if (v.rangeUnderflow) {
      if (el.type === 'date') return 'Please pick today or a future date.';
      if (el.type === 'time') return 'We open at 12 pm.';
      return `The minimum is ${el.min}.`;
    }
    if (v.rangeOverflow) return el.type === 'time' ? 'Our last table is at 10:30 pm.' : `The maximum is ${el.max}. For larger groups, please call us.`;
    return 'Please check this field.';
  };

  // Shows or clears the message under one field.
  const showState = (el) => {
    const field = el.closest('.field');
    const out = field.querySelector('.error-msg');
    const msg = messageFor(el);
    out.textContent = msg;
    field.classList.toggle('invalid', msg !== '');
    field.classList.toggle('valid', msg === '' && el.value !== '');
  };

  const inputs = [...form.querySelectorAll('input:not([type=radio]):not([type=checkbox]), select, textarea')];
  inputs.forEach((el) => {
    el.addEventListener('blur', () => showState(el));
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('invalid')) showState(el); });
  });

  // Live character counter for the notes box.
  const notes = form.elements.notes;
  const counter = document.getElementById('notesCount');
  notes?.addEventListener('input', () => { counter.textContent = `${notes.value.length} / ${notes.maxLength}`; });

  // Clear the green/red states and messages when the form is reset.
  form.addEventListener('reset', () => {
    form.querySelectorAll('.field').forEach((f) => f.classList.remove('valid', 'invalid'));
    form.querySelectorAll('.error-msg').forEach((m) => { m.textContent = ''; });
    success.classList.remove('show');
    if (counter) counter.textContent = `0 / ${notes.maxLength}`;
  });

  // Radio group and checkbox need their own messages.
  const seatError = document.getElementById('seatError');
  const termsError = document.getElementById('termsError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();               // demo only: no server, so we stay on the page
    let firstBad = null;
    inputs.forEach((el) => {
      showState(el);
      if (!el.validity.valid && !firstBad) firstBad = el;
    });
    const seatOk = form.querySelector('input[name="seating"]:checked');
    seatError.textContent = seatOk ? '' : 'Please choose where you would like to sit.';
    const termsOk = form.elements.terms.checked;
    termsError.textContent = termsOk ? '' : 'Please accept the booking policy.';

    if (firstBad || !seatOk || !termsOk) {
      (firstBad || form.querySelector('input[name="seating"]')).focus();
      success.classList.remove('show');
      return;
    }
    const d = new Date(form.elements.date.value + 'T00:00');
    const pretty = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    success.textContent = `Thank you, ${form.elements.fullName.value.trim()}! Table for ${form.elements.guests.value} on ${pretty} at ${form.elements.time.value} is requested. We will confirm by email.`;
    success.classList.add('show');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form.reset();
    form.querySelectorAll('.field').forEach((f) => f.classList.remove('valid', 'invalid'));
    if (counter) counter.textContent = `0 / ${notes.maxLength}`;
  });
}

/* ---------- 7. Print button (menu page) ---------- */
document.getElementById('printBtn')?.addEventListener('click', () => window.print());
