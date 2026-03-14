/**
 * Shared button class lists for non-navbar site buttons.
 * Styled to match the navbar Contact button: rounded-full (pill), blue-600, font-semibold, shadow-sm, hover:bg-blue-700.
 * See PROJECT_RULES.md → Button styling (site-wide, non-navbar).
 */

/** Primary: matches Contact button (pill, solid blue). Use for Make Appointment, Submit, Subscribe, Learn More. */
export const BTN_PRIMARY =
  "rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

/** Primary, larger (e.g. hero CTA). Same pill style as Contact, more padding. */
export const BTN_PRIMARY_LARGE =
  "rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

/** Secondary / outline: pill shape to match Contact. Use for Leave a review, carousel arrows. */
export const BTN_SECONDARY =
  "rounded-full border-2 border-blue-600 bg-white px-5 py-2 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

/** Icon-only primary (e.g. footer social). Pill shape to match Contact. */
export const BTN_ICON_PRIMARY =
  "flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

/** Icon-only secondary (e.g. carousel prev/next). Pill shape to match. */
export const BTN_ICON_SECONDARY =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-white text-blue-600 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
