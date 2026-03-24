# The Urology Place Website Rules

## Page layout: static background, window, and sliding page

Use this pattern for full-page experiences (e.g. Home, About Us, In-Office Anesthesia) so the hero feels like a fixed backdrop and the rest of the page scrolls over it.

- **Static background:** The hero section uses a full-bleed background image with `backgroundAttachment: "fixed"`, `backgroundSize: "cover"`, and `backgroundPosition` (e.g. `"center"` or `"center 30%"`). This keeps the image fixed in the viewport while the user scrolls.
- **Hero (window):** A single `<section>` with `relative`, `min-h-[Xvh]`, and inline `style={{ backgroundImage: "url(...)", backgroundAttachment: "fixed", ... }}`. Add an overlay (e.g. `absolute inset-0 bg-slate-900/45`) for text contrast. Hero content lives in a `relative z-10` container (e.g. title, subtitle).
- **Sliding page:** All content below the hero is the “sliding page”: one or more sections with solid backgrounds (`bg-white`, `bg-slate-50/50`, etc.). Give the first of these sections rounded top corners (e.g. `rounded-t-2xl` or `rounded-t-3xl`) so it reads as a card/window sliding over the static background.
- **Structure:** `<main>` contains (1) hero section with fixed background, then (2) content sections with borders/backgrounds that scroll over the hero. Do not wrap the sliding content in an extra full-height container; let it flow naturally so the fixed background stays visible behind the hero viewport only.

## UI / Design
- Mobile-first responsive design
- Clean professional medical aesthetic
- White background with blue and slate accents
- Clear typography hierarchy
- Generous whitespace
- Rounded buttons
- Avoid excessive animation
- Maintain trust-oriented medical design

### Button styling (site-wide, non-navbar)

All non-navbar site buttons must match the **navbar Contact button** look so the site feels cohesive. Do not change the navbar Contact button, mobile menu triggers, or dropdowns—only style content/footer buttons to resemble Contact.

- **Reference:** Navbar Contact uses `rounded-full` (pill), `bg-blue-600`, `px-5 py-2`, `text-sm font-semibold text-white`, `shadow-sm transition hover:bg-blue-700`. Site buttons should use the same shape, colors, and behavior.
- **Shape:** Use **rounded-full** (full-pill) for all site buttons so they match the Contact button.
- **Primary (major actions):** Same as Contact: `rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700`. Add `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` for accessibility. For larger CTAs (e.g. hero), use `px-6 py-3 text-base` but keep rounded-full and other tokens.
- **Secondary / outline (less prominent):** Pill shape to match: `rounded-full border-2 border-blue-600 bg-white text-blue-600`, same font-semibold and padding, `hover:bg-blue-50`, same focus ring. Use for: Leave a review, carousel prev/next.
- **Consistency:** Same font weight (semibold), transition, hover (primary: hover:bg-blue-700; secondary: hover:bg-blue-50), and focus ring across all content buttons. Keep hero, section, form, and footer CTAs visually aligned with the navbar Contact style.
- **Avoid:** One-off button styling or switching to rounded-lg; keep the pill look site-wide for content buttons.
- **Implementation:** Reuse a shared class list (e.g. `app/lib/button-styles.ts`) so all Home page and Footer buttons use the same design tokens as the Contact button.

## Navigation
- Desktop: horizontal nav with dropdown menus
- Mobile: hamburger menu with slide-out navigation
- Navigation should remain consistent across pages

## Code Quality
- Prefer reusable React components
- Avoid duplicated JSX and repeated nav definitions
- Keep Tailwind classes readable
- Maintain clear folder structure
- Keep logic simple and maintainable

### YouTube embeds (player only)

- **Component:** All embedded YouTube **players** on the site must use `YouTubeEmbed` from `@/app/components/youtube-embed.tsx`. Do not paste raw `<iframe>` markup for YouTube on new pages.
- **Props:** Pass `videoId` and a short, descriptive `title` for accessibility. Optional `className` wraps the aspect-ratio container (e.g. `rounded-2xl shadow-md ring-1 ring-slate-200`). Optional `embedSearchParams` adjusts the query string; default is `rel=0&modestbranding=1` (pass `""` if you need no params).
- **Links vs embeds:** Links to YouTube channels or watch URLs stay normal `<a>` / `next/link`. Only **inline video players** use `YouTubeEmbed`.
- **Non-YouTube iframes:** Maps and other providers stay as their own iframes (e.g. Google Maps in `footer.tsx`).

## Performance
- Optimize images
- Avoid unnecessary client-side JS
- Use Next.js best practices for SEO