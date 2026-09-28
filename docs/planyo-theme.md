# Theming the Planyo widget to match Astro Kings

The booking widget on `#booking` is Planyo's own page loaded in an `<iframe>`.
Browsers **block our site from restyling anything inside it** (cross-origin
security), so the dark/coral look has to be applied **inside Planyo's own
dashboard**. Do it once there and the embedded widget instantly matches the site
— no code change needed on our side.

## Where to paste this

1. Log in to the Planyo dashboard (calendar **22300**, Astro Kings Nottingham).
2. **Settings → Site settings** (sometimes "Look & feel" / "Design").
   - Set the colour scheme to a **dark** base if the option exists.
   - Find the **Custom CSS** box and paste the CSS below.
3. **Remove the big logo block** (the white box with the Astro Kings logo shown
   above the pitch list): Settings → Site settings → **Logo / header** → clear
   the logo image, or hide it with the CSS below.
4. Save and reload `#booking` on the site — the iframe will show the new look.

> Planyo class/ID names vary a little by account and template. If a rule doesn't
> bite, right-click the element **inside the widget → Inspect**, read its real
> class, and swap it into the matching rule. The broad `body`, link and button
> rules below do most of the work regardless.

## Paste-ready CSS

```css
/* ---- Astro Kings theme for the Planyo booking widget ---- */
:root{
  --ak-bg:      #06090A;   /* page background   */
  --ak-surface: #10151a;   /* cards / panels    */
  --ak-ink:     #F4F6F7;   /* main text         */
  --ak-muted:   #9AA3A7;   /* secondary text    */
  --ak-accent:  #E8645A;   /* coral buttons/links */
  --ak-line:    rgba(255,255,255,.12);
}

/* base */
body, .planyo, #planyo, .planyo-content, .site-content {
  background: var(--ak-bg) !important;
  color: var(--ak-ink) !important;
  font-family: 'Readex Pro', system-ui, -apple-system, sans-serif !important;
}
h1,h2,h3,h4, .planyo h1, .planyo h2, .planyo h3 { color: var(--ak-ink) !important; }
p, td, th, label, span, li, div { color: inherit; }
small, .muted, .comment { color: var(--ak-muted) !important; }

/* hide the big logo block above the pitch list */
.planyo-logo, .site-logo, img[src*="logo"], .header-logo { display: none !important; }

/* links */
a, a:visited { color: var(--ak-accent) !important; }
a:hover { opacity: .85; }

/* panels / list rows / calendar cells */
.resource, .resource-row, .panel, .box, table, .calendar, .cal, td, th {
  background: transparent !important;
  border-color: var(--ak-line) !important;
}
.resource, .resource-row, .panel, .box {
  background: var(--ak-surface) !important;
  border: 1px solid var(--ak-line) !important;
  border-radius: 16px !important;
}

/* ALL buttons → coral pill with dark text */
button, input[type="submit"], input[type="button"], .button, a.button, .btn {
  background: var(--ak-accent) !important;
  color: #0b0b0b !important;
  border: 0 !important;
  border-radius: 999px !important;
  padding: 10px 18px !important;
  font-weight: 600 !important;
  box-shadow: none !important;
}
button:hover, input[type="submit"]:hover, .button:hover, .btn:hover { filter: brightness(1.08); }

/* secondary / "Details" style buttons → outlined */
.button-secondary, .btn-secondary, a.details, .details {
  background: transparent !important;
  color: var(--ak-ink) !important;
  border: 1px solid var(--ak-line) !important;
}

/* form fields */
input[type="text"], input[type="email"], input[type="tel"], input[type="number"],
input[type="date"], select, textarea {
  background: rgba(255,255,255,.05) !important;
  color: var(--ak-ink) !important;
  border: 1px solid var(--ak-line) !important;
  border-radius: 10px !important;
}
input::placeholder, textarea::placeholder { color: rgba(244,246,247,.4) !important; }

/* selected / available / booked states in the calendar (tune to taste) */
.available, .free   { background: rgba(232,100,90,.14) !important; }
.selected, .chosen  { background: var(--ak-accent) !important; color:#0b0b0b !important; }
.unavailable, .booked { background: rgba(255,255,255,.05) !important; color: var(--ak-muted) !important; }
```

## After it's themed

Nothing changes in this repo — the same iframe just looks native. If Planyo ever
gives us the **resource_id for each pitch**, add them to
`PLANYO_PITCH_RESOURCE` in `src/lib/config.js` and the site's pitch picker will
deep-link each card straight to that pitch.
