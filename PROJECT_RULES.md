# The Urology Place Website Rules

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

## Performance
- Optimize images
- Avoid unnecessary client-side JS
- Use Next.js best practices for SEO