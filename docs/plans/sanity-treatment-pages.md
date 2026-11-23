# Sanity Treatment Pages — Five-Phase Implementation Plan

Status: **Phase 5 local verification completed. Waiting for approval before deployment and production testing.**

This document is the implementation plan for a reusable, Sanity-managed treatment page system. It preserves the technical findings from the repository audit and the follow-up contact-form inspection.

**Do not start a phase, or continue from one phase to the next, without explicit approval.** After each phase is completed, update the progress tracker and record the verification results in [Phase log](#phase-log) before asking to proceed.

The Vercel Hobby commercial-use discussion is set aside. It is not an approval gate and does not block planning or development. Hosting-efficiency requirements in this plan still apply: ordinary visits must stay on the CDN, and existing static pages must not become per-request dynamic renders.

---

## Progress tracker

Update this table when a phase starts, when it finishes, and when verification is recorded. Initial state is Not Started.

| Phase | Name | Status | Started | Completed | Verification recorded |
| --- | --- | --- | --- | --- | --- |
| 1 | Sanity schemas and content model | Completed | 2026-11-22 | 2026-11-22 | Yes |
| 2 | Reusable Next.js treatment template | Completed | 2026-11-22 | 2026-11-23 | Yes |
| 3 | Caching, revalidation, and publishing | Completed | 2026-11-23 | 2026-11-23 | Yes |
| 4 | Navigation, SEO, and site integration | Completed | 2026-11-23 | 2026-11-23 | Yes |
| 5 | Testing, verification, and launch | In Progress | 2026-11-23 | — | Yes, local only |

Allowed status values: `Not Started`, `In Progress`, `Blocked`, `Completed`.

### Phase log

After each completed phase, append a subsection here. Include:

- Phase number and date
- What shipped (files and schema or route names)
- Verification steps that were actually run
- Results (build route table, cache headers, form checks, screenshots or URLs as appropriate)
- Acceptance criteria met or not met
- Rollback status (not needed, or what was reverted)
- Approval to start the next phase (pending until the reviewer says so)

No phases had been logged before Phase 1.

### Phase 1 — 2026-11-22

**What shipped**

- Document type `treatmentPage` and block types `treatmentRichText`, `treatmentImage`, `treatmentYouTube`, `treatmentFaq`, `treatmentComparisonTable`, `treatmentCallToAction`, `treatmentRelated`, and `treatmentTwoColumn` in `studio/schemaTypes/treatmentPage/`.
- Registered those types in `studio/schemaTypes/index.ts`. Existing types `post`, `author`, `teamMember`, `teamCategory`, `homeAnnouncement`, and `privacyPolicy` stay registered.
- Added a “Treatment pages” list in `studio/structure/index.ts`. The read-only Pages inventory is unchanged.
- Local validator: `scripts/treatment-page-schema.test.ts`, run with `npm run test:treatment-schema`.

No public route, hardcoded treatment page, contact form component, or API route was edited. No treatment document was created or published. Nothing was deployed.

**Verification actually run**

- `npm run test:treatment-schema` — 12 passed, 0 failed. This compiles the Studio schema and runs Sanity’s document validator locally. It does not write to the dataset.
- `npx tsc --noEmit --incremental false` — passed.
- `npx eslint` on `studio/schemaTypes/index.ts`, `studio/schemaTypes/treatmentPage`, `studio/structure/index.ts`, and `scripts/treatment-page-schema.test.ts` — passed.
- Portable Text styles and lists on rich text and the two-column band match the blog post body (`normal`, `h1`–`h6`, `blockquote`, bullet, and numbered lists). Treatment links are a site path or `https://` address.

**Results against the Phase 1 checks**

- An incomplete document fails validation (title, slug, section, and hero).
- A hero image without alt text, and a hero without a title, fail validation.
- Slugs that resolve to `/men/vasectomy` or `/women/bulkamid-for-stress-incontinence` fail validation. `/men/erectile-dysfunction` and `/men/male-sexual-dysfunction/erectile-dysfunction` do not collide with a static page. The dynamic inventory row `/patient-resources/blog/[slug]` is ignored for that collision check and is rejected as a manual related-page address.
- A Women page cannot use a Men parent hub.
- `defaultAppointmentReason` options are exactly `APPOINTMENT_REASON_OPTIONS`, including `Erectile Dysfunction Treatment` and `Other`. A value outside that list fails validation. An empty value passes.
- `showContactForm` defaults to true. `visibility` defaults to `unlisted`. `previousPaths` is hidden and read-only.
- A fixture with hero, rich text, image, YouTube id, FAQ, comparison table, button, related path, two-column team reference, SEO, form toggle, and reason `Urinary Incontinence` passes validation.
- The same section, parent, and slug fails when another document already uses it. The check excludes the current draft id and published id.

**Acceptance criteria**

Met for the schema: a Treatment document can describe a temporary Bulkamid-style page, including section, hero, blocks, SEO, the form toggle, and a listed reason. The live Bulkamid route was not edited, so the hardcoded page is unchanged. The check was the local validator, not a document saved in the production dataset.

**Not done, on purpose**

- Studio was not opened in a browser, and no draft was saved in the production dataset.
- The schema is only in this repo. Hosted Studio will not show Treatment pages until this code is deployed. That deploy was not part of this phase.

**Rollback**

Not needed. No dataset documents and no deployment were created.

**Approval to start Phase 2**

Approved on 2026-11-22. The result is in the Phase 2 log below.

### Phase 1 adjustment — 2026-11-22 — FAQ answers

**What changed**

- `treatmentFaq` answers are no longer a plain text field. Each answer is Portable Text from `treatmentBasicPortableTextBlock()` in `studio/schemaTypes/treatmentPage/portableText.ts`.
- Allowed content: paragraphs (`normal`), bold (`strong`), bulleted lists, numbered lists, and links.
- Links use the same rule as body text and buttons: a site path starting with `/`, or an `https://` address (`siteLinkError`). `http://` and `javascript:` links fail validation.
- The answer array allows only the `block` member. Headings, other text styles, images, and an HTML block are not offered. There is still no `html` schema type.
- Body rich text and the two-column band are unchanged and still match the blog post body.
- Men and Women categories, approved parent paths, unlisted as the default visibility, `APPOINTMENT_REASON_OPTIONS`, and the route-collision checks are unchanged.
- No treatment document was created or published. Nothing was deployed, committed, or pushed. Phase 2 was not started.

**Verification actually run**

- `npm run test:treatment-schema` — 13 passed, 0 failed. This compiles the Studio schema and runs Sanity’s document validator locally. It does not write to the dataset.
- `npx tsc --noEmit --incremental false` — passed.
- `npx eslint` on `studio/schemaTypes/index.ts`, `studio/schemaTypes/treatmentPage`, `studio/structure/index.ts`, and `scripts/treatment-page-schema.test.ts` — passed.

**Results**

- The compiled FAQ answer block offers style `normal`, lists `bullet` and `number`, decorator `strong`, and the `link` annotation. Its only array member is `block`.
- A fixture answer with a paragraph, bold text, a bulleted list, a numbered list, an internal path, and an `https://` link passes validation.
- A plain string answer fails validation. An empty answer fails validation.
- An FAQ link of `http://example.com` or `javascript:alert(1)` fails validation.
- The Bulkamid-style fixture, now with a Portable Text FAQ answer, still passes. The earlier collision, parent, reason, and visibility checks still pass.

**Phase 2 without a production deploy**

Yes. Phase 2 can be developed and tested on this machine without deploying this schema.

The schema is TypeScript in this repo. Studio is mounted inside the Next.js app at `/studio` and reads that code. This repo does not deploy a separate Sanity schema. `npm run dev` serves the updated Studio locally, and `npm run test:treatment-schema` validates documents in memory.

Render the Phase 2 template from fixtures with that same document shape. Do not create or publish treatment documents in order to test it. Local Studio and the public client both use project `5zd6me01`, dataset `production`. Saving from local Studio writes to that dataset, and publishing makes the document readable by the public client. The production website still has no treatment catch-all, so a published document would not appear on the live site until Phase 2 routes are deployed. Hosted Studio on the production site will not show Treatment pages until the app itself is deployed.

Leave production undeployed until the full CMS implementation is ready for testing.

### Phase 2 — 2026-11-23

**What shipped**

- Required catch-alls `app/men/[...slug]/page.tsx` and `app/women/[...slug]/page.tsx`. Concrete pages such as `/men/vasectomy` and `/women/bulkamid-for-stress-incontinence` still win. `/men` and `/women` stay on their own index files.
- Shared loader and rendering: `app/lib/treatment-pages.ts`, `app/lib/treatment-page-load.ts`, `app/lib/treatment-page-metadata.ts`, `app/lib/treatment-images.ts`, `app/lib/treatment-links.ts`, and `app/components/treatment-page/`.
- Blocks rendered from the Phase 1 shape: rich text, images, YouTube, Portable Text FAQ answers, comparison tables, calls to action, related treatments, and two-column image or team bands. Unknown block types are skipped and logged by type name.
- `ContactFormTemplate` accepts an optional `defaultAppointmentReason`. A listed value is selected. An omitted or unlisted value still uses `getDefaultAppointmentReasonForPage(pageName)`. `ContactFormFields`, `/api/contact`, and `PAGE_TO_DEFAULT_REASON` were not edited.
- Local fixtures in `app/lib/treatment-page-fixtures.ts`, used only when `NODE_ENV` is not `production` and `TREATMENT_PAGE_FIXTURES=1`. Production ignores that variable. Tests inject a fetcher and do not call `client.fetch`.
- `scripts/generate-route-inventory.mjs` marks the two catch-alls as managed dynamic routes. `studio/routeInventory.generated.ts` was regenerated (78 routes). Hardcoded treatment rows stay static.
- `npm run test:treatment-template` runs `scripts/treatment-page-template.test.tsx`. No dependency was added.

No webhook, `revalidate` export, cache tag, `generateStaticParams`, navbar change, sitemap change, or layout fetch was added. No treatment document was created, edited, or published in project `5zd6me01`, dataset `production`. Nothing was deployed, committed, or pushed.

**Verification actually run**

- `npm run test:treatment-template` — 13 passed, 0 failed.
- `npm run test:treatment-schema` — 13 passed, 0 failed. Local validator only. It does not write to the dataset.
- `npm run test:contact-route` — 24 passed, 0 failed. Email, CRM, rate limit, and reCAPTCHA are stubbed.
- `npx tsc --noEmit --incremental false` — passed after the path-array type was narrowed.
- `npx eslint` on the new treatment files, `contact-form-template.tsx`, and `scripts/generate-route-inventory.mjs` — passed.
- `npm run routes:generate`, then the prebuild `routes:check` — inventory up to date.
- `npm run build` — passed when the existing blog `generateStaticParams` could reach Sanity. That call reads published blog posts. It does not write treatment documents. The sandboxed build failed first with `ENOTFOUND 5zd6me01.api.sanity.io` for the blog route, which is an existing network requirement, not a treatment-route failure.
- Fixture server: `TREATMENT_PAGE_FIXTURES=1 npm run dev -- --port 3000`. Browser checks on `/men/erectile-dysfunction`, plus HTTP checks of the other fixtures and the hardcoded routes. The fixture server was stopped afterward, and `npm run dev` was restarted without that variable.

**Results**

- Build route table: `/men/[...slug]` and `/women/[...slug]` are `ƒ` Dynamic. `/women/bulkamid-for-stress-incontinence`, `/men/vasectomy`, `/men`, and `/women` stay `○` Static. Blog `[slug]` stays `●` SSG. There is no treatment ISR marker. That waits for Phase 3.
- `/men/ed-previous-address` returns 307 to `/men/erectile-dysfunction`.
- `/women/form-hidden-preview` renders the CMS template and no appointment select. The hero links to `/patient-resources/contact-us`.
- `/men/invalid-reason-preview` selects General Urology. The stored string `Made Up Reason` is not an option. `/men/title-mapped-reason` selects Vasectomy. `/men/general-reason-fallback` selects General Urology.
- The parented fixture category is `Men > Male Sexual Dysfunction`.
- Unlisted fixtures emit `<meta name="robots" content="noindex"/>`. Hero and body images are direct `cdn.sanity.io` URLs (`w=1600` and `w=1200`) with `unoptimized`. The share image is cropped to 1200×630. `/_next/image` on the page is the existing logo only.
- Browser, desktop: the fixture hero uses the shared dark hero and Make Appointment button. The reason select loaded as Erectile Dysfunction Treatment, changed to Kidney Stones, then to Other, which revealed Other Appointment Reason. FAQ text includes bold, a bullet, a numbered item, and safe links.
- Browser, phone width: the same hero wraps under the existing mobile navbar. The hamburger, title, subtitle, and button stay in one column.
- `/women/bulkamid-for-stress-incontinence` has no `data-treatment-page` attribute. Its title and Urinary Incontinence reason are the hardcoded page. `/men/vasectomy` and `/men` are also outside the CMS template. The navbar is still the hardcoded tree.

**Acceptance criteria**

Met. The fixture renders the shared form with the configured reason selected, and the visitor can change it, including Other. Hardcoded pages are unchanged. Static files win over the catch-all.

**Deviation**

Both catch-alls export `dynamic = "force-dynamic"` and `dynamicParams = true`. The plan’s Phase 2 check allows the build to list them as dynamic or ISR. `force-dynamic` keeps `next build` from querying Sanity for these routes and from caching an empty 404. It is not the Phase 3 cache. Phase 3 must remove it and add `revalidate = 86400` plus tags before any production deploy. Until then, a deployed catch-all would run a function and call Sanity on every visit.

**Not done, on purpose**

- No `app/api/revalidate/route.ts`, cache tags, or `generateStaticParams`.
- Navbar, Men and Women grids, sitemap, and layout were not changed.
- No production Sanity document was created, saved, edited, or published.

**Unrelated observations, left unchanged**

- `@sanity/image-url` prints that its default export is deprecated when the shared client in `lib/sanity.ts` loads. That client was not edited.
- During the first fixture compile, the Next.js dev overlay once cited a hydration mismatch at the contact form honeypot. A fresh load of the fixture, and the hardcoded Bulkamid page, did not show it again. `contact-form-fields.tsx` was not edited.
- `bulkamid-website-and-social-copy.md` is already deleted in the working tree. Phase 2 did not delete it.

**Rollback**

Not needed. No dataset documents and no deployment were created. Reverting the new routes, the inventory update, and the optional form prop would remove the template. Static pages would remain the files they already are.

**Approval to start Phase 3**

Approved on 2026-11-23. The result is in the Phase 3 log below.

### Phase 3 — 2026-11-23

**What shipped**

- Removed `dynamic = "force-dynamic"` from `app/men/[...slug]/page.tsx` and `app/women/[...slug]/page.tsx`. Both export `revalidate = 86400`, `dynamicParams = true`, and `generateStaticParams()`.
- Cached published reads in `app/lib/treatment-page-load.ts` and `app/lib/treatment-cache.ts`. The page query uses `useCdn: false` and `next: { revalidate: 86400, tags: ["treatment-page", "treatment-page:${path}"] }`. The global client in `lib/sanity.ts` is unchanged.
- `generateStaticParams()` returns `[]` when Sanity throws. A thrown page fetch is still not turned into `notFound()`. A successful empty result is a 404 and can be cached until the next invalidation.
- Webhook route `app/api/revalidate/route.ts`, with the decision logic in `app/lib/treatment-revalidate.ts`. It accepts a request only when `parseBody` reports `isValidSignature === true` for `SANITY_REVALIDATE_SECRET`. It then calls `revalidatePath` for the current path, `previousPaths`, `/men` or `/women`, the parent hub when one exists, and `/sitemap.xml`, plus `revalidateTag("treatment-page", "max")` and `revalidateTag("treatment-nav", "max")`.
- Studio publish wrapper `studio/actions/publishTreatmentPage.ts`. For `treatmentPage` only, it appends the previously published path to `previousPaths` when the section, parent, or slug changes, then calls the normal Publish action. `studio/sanity.config.ts` registers that wrapper. Other document types are unchanged.
- `npm run test:treatment-revalidate` runs `scripts/treatment-page-revalidate.test.ts`. No dependency was added.

No navbar, Men or Women grid, sitemap, or root-layout fetch was added. No treatment document was created, edited, published, or deleted in project `5zd6me01`, dataset `production`. No production webhook was created, and `SANITY_REVALIDATE_SECRET` was not set in Vercel. Nothing was deployed, committed, or pushed.

**Verification actually run**

- `npm run test:treatment-revalidate` — 9 passed, 0 failed. Signed fixture payloads only. It does not call Sanity.
- `npm run test:treatment-template` — 13 passed, 0 failed.
- `npm run test:treatment-schema` — 13 passed, 0 failed. Local validator only. It does not write to the dataset.
- `npm run test:contact-route` — 24 passed, 0 failed. Email, CRM, rate limit, and reCAPTCHA are stubbed.
- `npx tsc --noEmit --incremental false` — passed.
- `npx eslint` on the Phase 3 files — passed.
- `npm run build` — passed. `prebuild` reported the route inventory up to date. The build reads published blog posts and published treatment pages. It does not write treatment documents. There are still no published treatment pages, so `generateStaticParams()` returned no paths.
- Local `next start` after that build. Header checks for an unpublished Men path, an unpublished Women path, `/women/bulkamid-for-stress-incontinence`, `/men/vasectomy`, `/men`, and `/women`. An unsigned `POST /api/revalidate` was also sent. The server was stopped afterward.

**Results**

- Build route table: `/men/[...slug]` and `/women/[...slug]` are `●` SSG, not `ƒ`. `/women/bulkamid-for-stress-incontinence`, `/men/vasectomy`, `/men`, and `/women` stay `○` Static. Blog `[slug]` stays `●` SSG. `/api/revalidate` is `ƒ`, which is the route handler. The Revalidate column is blank on the two catch-all rows because no treatment path was prerendered. The compiled route still exports `revalidate` as `86400`.
- Local production response for `GET /men/erectile-dysfunction`: the first response was `404`, `x-nextjs-cache: MISS`. The second was `404`, `x-nextjs-cache: HIT`, `Cache-Control: s-maxage=86400, stale-while-revalidate=31449600`. The HTML was the site 404, not the CMS template. `GET /women/not-a-published-treatment` repeated that MISS-then-HIT pattern with the same `s-maxage=86400` header.
- `GET /women/bulkamid-for-stress-incontinence` was `200`, `x-nextjs-cache: HIT`, `Cache-Control: s-maxage=31536000`. The HTML contains Bulkamid and does not contain `data-treatment-page`. `GET /men/vasectomy` was `200`, `x-nextjs-cache: HIT`, `Cache-Control: s-maxage=31536000`.
- `x-nextjs-stale-time: 300` appeared on the CMS 404 and on the static pages. That is Next’s client-router stale hint. It is not the 24-hour fallback. The fallback is the `s-maxage=86400` on the generated treatment response.
- Unsigned `POST /api/revalidate` returned `401` and `{"revalidated":false}`. The response did not echo the posted document.
- Signed-payload tests, without a network call: a create and an in-place edit return 200 and revalidate the page, `/men` or `/women`, and `/sitemap.xml`. A slug and parent change revalidates the old path, the new path, and the hub. The existing fixture still redirects `/men/ed-previous-address` to `/men/erectile-dysfunction`. A delete revalidates the removed path and its previous paths. Draft ids and other document types return 200 and do not revalidate. A missing secret, a blank secret, a wrong secret, a tampered signature, and a missing signature header return 401 and do not revalidate. Those calls use `revalidateTag(tag, "max")`.
- A thrown Sanity error still rejects inside `loadTreatmentPage`. `generateStaticParams()` returns `[]` when its fetch throws, and that failure is not turned into `notFound()`.

**Caching and revalidation, local versus Vercel**

Verified locally:

- The catch-alls are not per-request dynamic routes.
- A generated treatment response carries a 24-hour `s-maxage`. The second request for the same unpublished path was `x-nextjs-cache: HIT`.
- Hardcoded pages keep a one-year static cache header and do not use the treatment `s-maxage`.
- The webhook handler rejects unsigned requests and, in unit tests, revalidates only after a valid signature.

Not verified locally, and not claimed:

- `x-vercel-cache: HIT`. `next start` does not add that header. Only a Vercel deployment can.
- A second visit to a published 200 treatment page. No treatment document exists, so the cached local response is a 404. Publishing a page was not part of this phase.
- Sanity API usage before and after the repeat request. The first local miss reads the production dataset. The HIT does not re-render the route. The usage dashboard was not opened, so no request count is recorded here.
- Delivery from Sanity’s webhook service. The endpoint is implemented and covered by signed unit tests. No production webhook exists yet.

**Required production configuration**

Do this only after an approved deploy. Do not commit the secret.

- Webhook URL: `https://theurologyplace.com/api/revalidate`. Use the apex host. `www` is documented as redirecting there, and a redirected POST can drop the signed body. Confirm the chosen host serves this route without redirecting before enabling the webhook.
- Method: `POST`.
- Dataset: `production`. Trigger on Create, Update, and Delete. Leave draft and version events off. Unpublish arrives as Delete.
- Filter: `_type == "treatmentPage" && !(_id in path("drafts.**"))`.
- Projection:

```
{
  "_id": _id,
  "_type": _type,
  "operation": delta::operation(),
  "before": before(){
    section,
    parentPath,
    "slug": slug.current,
    previousPaths
  },
  "after": after(){
    section,
    parentPath,
    "slug": slug.current,
    previousPaths
  }
}
```

- Environment variable: `SANITY_REVALIDATE_SECRET`. Set the same value in Vercel and in the Sanity webhook secret field. The name is listed blank in `.env.example`. The route does not accept the secret in the URL.
- Authentication: Sanity sends `sanity-webhook-signature` as `t=<millisecond timestamp>,v1=<signature>`. `parseBody` checks the HMAC over the raw body. The route accepts the request only when `isValidSignature === true`. A missing secret, a missing header, or a bad signature returns 401. Drafts and other types return 200 so Sanity does not retry them. The document body is not logged and is not returned.
- Events that revalidate: publishing a treatment page, editing one, changing its slug, section, or parent, unpublishing it, and deleting it. The Studio action records the old path on publish. The webhook projection’s `before()` path covers the same change even when the page is deleted.
- How to verify before enabling it for staff: deploy with the secret set, send one unsigned POST and confirm 401, then send one signed POST (or Sanity’s first delivery attempt) and confirm `200` with `{"revalidated":true}`. After that, publish one unlisted test document only when that write is approved. The next visit should regenerate once, and the following visit should be `x-vercel-cache: HIT`. This phase did not perform those production steps.

**Acceptance criteria**

Met for the code and the local cache check. A new slug does not require a code change: `dynamicParams` stays true, and a signed publish payload revalidates the new path without a deploy. A second request for an unchanged generated path was a local cache hit. Hardcoded treatment URLs stayed on their files.

Not yet met in production, on purpose: a real unlisted document was not published, and `x-vercel-cache` was not observed. Those checks wait for an approved deploy and an approved content write.

**Deviations**

- The build labels the catch-alls `●` and leaves the Revalidate column blank while no treatment paths are prerendered. The runtime header on a generated response is still `s-maxage=86400`. This is not `ƒ`.
- `generateStaticParams()` skips a path that the inventory already lists as a static page, so a colliding document is not prerendered behind Bulkamid or Vasectomy. The static file would win anyway.
- The handler also accepts a flat published document, which covers a webhook whose projection was left empty on create or update. Delete and slug changes need the `before()` / `after()` projection above. An empty projection on delete may not include the old path, and the 24-hour fallback is then the safety net.
- A body that is not valid JSON returns 400 and does not revalidate, including when the signature is also bad, because `parseBody` throws before the 401 branch. Valid JSON with a bad signature returns 401.
- Production `parseBody` waits up to three seconds after a valid signature so the later page read can see the published document. Tests pass `waitForContentLake: false`.

**Unrelated observations, left unchanged**

- `@sanity/image-url` still prints that its default export is deprecated when the shared client loads. `lib/sanity.ts` was not edited.
- `bulkamid-website-and-social-copy.md` remains deleted in the working tree from before this phase.

**Rollback**

Not needed. No dataset documents, webhook, secret, or deployment were created. Removing the route, the cache options, and the Studio action would return the catch-alls to the Phase 2 behavior. Static pages would remain the files they already are.

**Approval to start Phase 4**

Approved on 2026-11-23. The result is in the Phase 4 log below.

### Phase 4 — 2026-11-23

**What shipped**

- `app/lib/treatment-nav.ts` merges public CMS links into a copy of the hardcoded tree, builds top-level service cards, and lists sitemap paths. The query selects menu label, title, card description, section, parent, slug, sort order, and visibility. It does not select body, hero, or portable text. The fetch options are `useCdn: false` and `next: { revalidate: 86400, tags: ["treatment-nav"] }`.
- `app/lib/treatment-nav-load.ts` performs that cached read. A thrown Sanity error returns `[]`, so the hardcoded menu still renders. Drafts, unlisted rows, and paths that already belong to a static page are dropped. Production ignores `TREATMENT_PAGE_FIXTURES`.
- `app/components/site-navbar.tsx` is the server wrapper. `app/layout.tsx` renders it. The layout does not call `cookies()`, `headers()`, `searchParams`, `client.fetch`, or `force-dynamic`.
- `app/components/navbar.tsx` accepts the CMS links and appends them with `mergeTreatmentNav`. The hardcoded labels, order, and addresses are unchanged. The navbar does not call Sanity.
- `app/men/page.tsx` and `app/women/page.tsx` append public top-level CMS cards after the existing `SERVICES` arrays, using the same card markup. Parented pages stay out of those grids.
- `app/sitemap.ts` appends public CMS paths after the existing static and blog entries. The sitemap host stays `https://www.theurologyplace.com`. `revalidate` stays `3600`. Canonicals still come from `pageMetadata()`.
- `npm run test:treatment-nav` runs `scripts/treatment-nav.test.ts`. No dependency was added.

The Phase 3 webhook was not changed. It already calls `revalidateTag("treatment-nav", "max")` and `revalidatePath` for the page, `/men` or `/women`, the parent hub, and `/sitemap.xml`. It does not call `revalidatePath("/", "layout")`. No treatment document was created, edited, or published in project `5zd6me01`, dataset `production`. Nothing was deployed, committed, or pushed.

**Verification actually run**

- `npm run test:treatment-schema` — 13 passed, 0 failed. Local validator only. It does not write to the dataset.
- `npm run test:treatment-template` — 13 passed, 0 failed.
- `npm run test:treatment-revalidate` — 9 passed, 0 failed. Signed fixture payloads only. It does not call Sanity.
- `npm run test:contact-route` — 24 passed, 0 failed. Email, CRM, rate limit, and reCAPTCHA are stubbed.
- `npm run test:treatment-nav` — 5 passed, 0 failed. Mocked rows only. It does not call Sanity.
- `npx tsc --noEmit --incremental false` — passed.
- `npx eslint` on the Phase 4 files — passed, with one existing warning on the mobile `<aside>` `aria-modal` attribute in `app/components/navbar.tsx`. That attribute was already there and was not changed.
- `npm run build` before the phase, then again after it. `prebuild` reported the route inventory up to date. The after build reads published blog posts and the public nav projection. It does not write treatment documents. There are still no published treatment pages, so the nav result is empty.
- Local `next start` before the phase and after it. Header checks for `/`, `/men/vasectomy` (ten times), `/women/bulkamid-for-stress-incontinence` (ten times), `/men`, `/women`, one blog post, and `/sitemap.xml`. The server was stopped afterward.
- Browser checks on the after build: the Men menu expands to the existing links and ends at Kidney Stones; `/men` shows the existing eleven service cards; `/women` shows the existing five cards; `/men/vasectomy` is the hardcoded page with Vasectomy selected; `/women/bulkamid-for-stress-incontinence` is the hardcoded page with Urinary Incontinence selected.

**Route table**

Symbols are unchanged. No existing route became `ƒ`.

| Route | Before | After |
| --- | --- | --- |
| `/` | `○` Static, revalidate 1m | `○` Static, revalidate 1m |
| `/about-us` | `○` Static, revalidate 5m | `○` Static, revalidate 5m |
| `/patient-resources/privacy-policy-hipaa` | `○` Static, revalidate 5m | `○` Static, revalidate 5m |
| `/men/vasectomy` | `○` Static, no revalidate column | `○` Static, revalidate 1d |
| `/women/bulkamid-for-stress-incontinence` | `○` Static, no revalidate column | `○` Static, revalidate 1d |
| `/men` | `○` Static, no revalidate column | `○` Static, revalidate 1d |
| `/women` | `○` Static, no revalidate column | `○` Static, revalidate 1d |
| `/patient-resources/blog/[slug]` | `●` SSG, no revalidate column | `●` SSG, revalidate 1d |
| `/men/[...slug]` and `/women/[...slug]` | `●` SSG | `●` SSG |
| `/sitemap.xml` | `○` Static, revalidate 1h | `○` Static, revalidate 1h |
| `/patient-resources/blog` | `ƒ` Dynamic | `ƒ` Dynamic |
| `/api/contact`, `/api/revalidate`, `/studio/[[...tool]]` | `ƒ` Dynamic | `ƒ` Dynamic |

The 1-day marker is the shared nav fetch. Pages that already had a shorter `revalidate` kept that shorter time. Pages that had no revalidate now use 86400 seconds because the root layout read is part of their prerender. They stay prerendered. They are not rendered on every request.

**Cache headers, local `next start`**

Before this phase:

- `GET /` — `200`, `x-nextjs-cache: STALE`, `Cache-Control: s-maxage=60, stale-while-revalidate=31535940`. The page was already older than its 60-second window.
- `GET /men/vasectomy` and `GET /women/bulkamid-for-stress-incontinence` — `200`, `x-nextjs-cache: HIT`, `Cache-Control: s-maxage=31536000`, `x-nextjs-prerender: 1`.
- `GET /men` and `GET /women` — the same one-year HIT.
- `GET /patient-resources/blog/meet-your-provider-chris-garcia-fnp` — the same one-year HIT.
- `GET /sitemap.xml` — `200`, `x-nextjs-cache: HIT`, `Cache-Control: public, max-age=0, must-revalidate`. The prerender manifest still recorded a 3600-second revalidate.

After this phase:

- `GET /` — `200`, `x-nextjs-cache: HIT` on both requests, `Cache-Control: s-maxage=60, stale-while-revalidate=31535940`.
- Ten requests each to `/men/vasectomy` and `/women/bulkamid-for-stress-incontinence` — every response was `200`, `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1`, `Cache-Control: s-maxage=86400, stale-while-revalidate=31449600`.
- `GET /men` and `GET /women` — the same 24-hour HIT.
- The same blog post — the same 24-hour HIT.
- `GET /sitemap.xml` — still `HIT` with `Cache-Control: public, max-age=0, must-revalidate`. The prerender manifest records `initialRevalidateSeconds: 3600` and the cache tag `treatment-nav`.

The compiled page metadata for `/men/vasectomy` includes the tag `treatment-nav`. A signed publish already invalidates that tag, so the next request after a publish can refresh the menu. A repeat request while the entry is fresh is a cache hit and does not run the page again. `x-vercel-cache` is not set by `next start`.

**Page checks**

- `/men/vasectomy` HTML contains Vasectomy, its canonical is `https://theurologyplace.com/men/vasectomy`, and it does not contain `data-treatment-page` or `href="/men/erectile-dysfunction"`.
- `/women/bulkamid-for-stress-incontinence` HTML contains Bulkamid and Urinary Incontinence, and it does not contain `data-treatment-page`.
- `/men` and `/women` still list only the hardcoded cards. No public CMS document exists, so no extra card is rendered.
- `/sitemap.xml` uses `https://www.theurologyplace.com` and includes `/men/vasectomy` and `/women/bulkamid-for-stress-incontinence`. It does not include `/men/erectile-dysfunction` or `/women/form-hidden-preview`.

**Acceptance criteria**

Met for the code, the tests, and the local cache check. Public rows are appended under Men, Women, or the matching hub, and top-level public rows are added to the section grids and the sitemap. Unlisted and draft rows are excluded. Hardcoded links stay in place. Existing treatment URLs still resolve to their files. No existing route became a per-request dynamic render.

Not yet met with a live document, on purpose: no public treatment page was published, so the running site does not yet show a new menu link. That check waits for an approved content write.

**Deviations**

- The Sanity read lives in `app/lib/treatment-nav-load.ts` rather than in `app/lib/treatment-nav.ts`. The navbar is a client component and imports only the merge function. Putting `client.fetch` in the same module would ship the Sanity client to the browser.
- The loader does not import `server-only`. That package throws when the node test runner loads it. The navbar source test rejects `client.fetch` and `getTreatmentNav` in the client file.
- Previously static pages, including hardcoded treatment pages and blog posts, now show a 1-day revalidate because they share the cached nav read. That is the ISR outcome the plan allows. It is not `ƒ`.

**Unrelated observations, left unchanged**

- `@sanity/image-url` still prints that its default export is deprecated when the shared client loads. `lib/sanity.ts` was not edited.
- The mobile navigation aside still has the existing `aria-modal` warning.

**Rollback**

Not needed. No dataset documents and no deployment were created. Removing the layout wrapper, the navbar prop, the section-card append, and the sitemap query would return the hardcoded trees. Static pages would prerender without the 1-day nav lifetime.

**Approval to start Phase 5**

Approved on 2026-11-23 for local verification only. Deployment, production webhooks, and production content writes were not approved. The local result is in the Phase 5 log below.

### Phase 5 local verification — 2026-11-23

**Scope**

Local verification only. No treatment document was created, edited, published, or deleted in project `5zd6me01`, dataset `production`. Nothing was deployed, committed, or pushed. No production webhook or `SANITY_REVALIDATE_SECRET` was configured. The contact form was not submitted, and no patient information was sent to the production CRM.

The running-app check for public navigation used a temporary local override: `visibility: "public"` was set on the erectile-dysfunction fixture and the parented hub fixture in `app/lib/treatment-page-fixtures.ts`, the fixture dev server was exercised, and both lines were removed before this log was written. The file again has no public fixture. Production ignores `TREATMENT_PAGE_FIXTURES`, so that override could not affect a production server.

**What was verified**

- The CMS template renders rich text, a body image, a YouTube embed, a formatted FAQ, a comparison table, a button, related links, and both two-column bands.
- The shared contact form preselects the configured reason. A visitor can change it, including to Other, which reveals Other Appointment Reason. The form was not submitted.
- Empty and invalid stored reasons resolve to a listed option. A hidden form omits the select and points the hero button at `/patient-resources/contact-us`.
- Public fixture rows appear in the Men menu, under the matching hub, on the Men service grid when they have no parent, and in the sitemap. Unlisted fixture rows stay out of those surfaces and emit `noindex`.
- Bulkamid and Vasectomy still render from their own files. Their source files were not edited.
- Metadata, canonicals, and sitemap hosts match `pageMetadata()` and the existing sitemap host.
- Existing routes stay prerendered. Repeat requests on a local production server are cache hits.

**Verification actually run**

- `npm run test:treatment-schema` — 13 passed, 0 failed. Local validator only. It does not write to the dataset.
- `npm run test:treatment-template` — 13 passed, 0 failed.
- `npm run test:treatment-revalidate` — 9 passed, 0 failed. Signed fixture payloads only. It does not call Sanity.
- `npm run test:treatment-nav` — 5 passed, 0 failed. Mocked rows only. It does not call Sanity.
- `npm run test:contact-route` — 24 passed, 0 failed. Email, CRM, rate limit, and reCAPTCHA are stubbed.
- `npm run test:contact-crm` — 25 passed, 0 failed. Apps Script is stubbed.
- `npm run test:derived-view-refresh` — 14 passed, 0 failed.
- `npm run test:kella-workflow` — 5 passed, 0 failed.
- `npm run test:workflow-status-validation` — 5 passed, 0 failed.
- `npm run test:archive-cold-storage` — 20 passed, 1 failed. The failure is recorded under unrelated observations. It is not a treatment-page failure.
- `npx tsc --noEmit --incremental false` — passed.
- ESLint on the treatment schema, template, cache, navigation, webhook, sitemap, and form-template files — 0 errors, 1 warning. The warning is the existing `aria-modal` attribute on the mobile `<aside>` in `app/components/navbar.tsx`. That attribute was already there.
- `npx eslint .` — 9 errors and 1,347 warnings. The errors are in existing files (`app/components/about-us-team.tsx`, `app/studio/[[...tool]]/page.tsx`, `lib/sanity.ts`) and in `studio/dist` vendor output. The warning count is dominated by `studio/dist`. Those files were not part of this work and were not changed.
- `npm run build` — passed. `prebuild` reported the route inventory up to date. The build reads published blog posts and the public nav projection. It does not write treatment documents. There are still no published treatment pages, so the catch-alls prerender no paths.
- Local `next start` on port 3010 after that build. Header checks for an unpublished Men path, an unpublished Women path, `/women/bulkamid-for-stress-incontinence` ten times, `/men/vasectomy` ten times, `/`, `/men`, `/women`, one blog post, `/sitemap.xml`, and `/about-us`. An unsigned `POST /api/revalidate` was also sent. The server was stopped afterward.
- Fixture dev server, `TREATMENT_PAGE_FIXTURES=1`, on port 3020. HTTP checks of every fixture, the redirect, the hardcoded pages, the section grids, and `/sitemap.xml`. Browser checks of the erectile-dysfunction fixture, the Men menu, the Male Sexual Dysfunction submenu, and the live Bulkamid page. The form was changed and was not submitted. The server was stopped afterward, and the temporary public visibility was removed.

**Route table**

No existing route is `ƒ` except the routes that were already dynamic. The catch-alls stay `●` SSG. The Revalidate column is blank on those two rows because no treatment path was prerendered. A generated response still carries `s-maxage=86400`.

| Route | This build |
| --- | --- |
| `/` | `○` Static, revalidate 1m |
| `/about-us` | `○` Static, revalidate 5m |
| `/patient-resources/privacy-policy-hipaa` | `○` Static, revalidate 5m |
| `/men/vasectomy` | `○` Static, revalidate 1d |
| `/women/bulkamid-for-stress-incontinence` | `○` Static, revalidate 1d |
| `/men` | `○` Static, revalidate 1d |
| `/women` | `○` Static, revalidate 1d |
| `/patient-resources/blog/[slug]` | `●` SSG, revalidate 1d |
| `/men/[...slug]` and `/women/[...slug]` | `●` SSG |
| `/sitemap.xml` | `○` Static, revalidate 1h |
| `/patient-resources/blog` | `ƒ` Dynamic |
| `/api/contact`, `/api/revalidate`, `/studio/[[...tool]]` | `ƒ` Dynamic |

**Cache headers, local `next start`**

- `GET /men/erectile-dysfunction` — first response `404`, `x-nextjs-cache: MISS`, `x-nextjs-prerender: 1`, `Cache-Control: s-maxage=86400, stale-while-revalidate=31449600`. The second response was `404`, `x-nextjs-cache: HIT`, with the same cache header. The HTML is the site 404. It does not contain `data-treatment-page`.
- `GET /women/not-a-published-treatment` — the same MISS-then-HIT 404 pattern and the same 24-hour header.
- Ten requests to `/women/bulkamid-for-stress-incontinence` — every response was `200`, `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1`, `Cache-Control: s-maxage=86400, stale-while-revalidate=31449600`.
- Ten requests to `/men/vasectomy` — the same 24-hour HIT.
- `GET /` — `200`, `x-nextjs-cache: HIT`, `Cache-Control: s-maxage=60, stale-while-revalidate=31535940`.
- `GET /about-us` — `200`, HIT, `s-maxage=300`.
- `GET /men` and `GET /women` — `200`, HIT, `s-maxage=86400`.
- `GET /patient-resources/blog/meet-your-provider-chris-garcia-fnp` — `200`, HIT, `s-maxage=86400`.
- `GET /sitemap.xml` — `200`, HIT, `Cache-Control: public, max-age=0, must-revalidate`. The prerender manifest records `initialRevalidateSeconds: 3600` and the cache tag `treatment-nav`.
- Compiled page metadata for `/`, `/men`, `/women`, `/men/vasectomy`, and `/women/bulkamid-for-stress-incontinence` includes the tag `treatment-nav`.
- `x-nextjs-stale-time: 300` appeared on the page responses. That is Next’s client-router stale hint. It is not the 24-hour fallback.
- Unsigned `POST /api/revalidate` returned `401` and `{"revalidated":false}`.
- `GET /men/ed-previous-address` and `GET /women/bulkamid-cms-preview` were `404` on this production server. Fixture redirects and fixture copy are not served when `NODE_ENV` is production.

`x-vercel-cache` is not set by `next start`. A published 200 CMS page was not cached locally because no treatment document exists and production ignores fixtures. The cached local CMS response is the 404 above. The fetch options in code and in the revalidate tests remain `revalidate: 86400` with tags `treatment-page`, `treatment-page:${path}`, and `treatment-nav`.

**Fixture and browser results**

On the fixture dev server, with the two temporary public rows:

- `/men/erectile-dysfunction` returned 200 and `data-treatment-page="cms"`. The hero background is a `cdn.sanity.io` URL with `w=1600`. Body and team images are direct `cdn.sanity.io` URLs (`w=1200` and `w=800`) rendered with `unoptimized`. The page includes the rich-text heading, bold text, bullet, internal path, and `https://` link; the image caption; the YouTube id and title; both two-column bands, including Dr. Naveen Kella; the comparison table; the FAQ with a paragraph, `<strong>Ask the clinic</strong>`, a bullet, a numbered item, an internal path, and an `https://` link; the Contact the clinic button; and the related Male Sexual Dysfunction and Bulkamid CMS preview links.
- The appointment select loaded as Erectile Dysfunction Treatment. It was changed to Kidney Stones, then to Other. Other Appointment Reason appeared (`name="otherAppointmentReason"`). The form was not submitted.
- Canonical `https://theurologyplace.com/men/erectile-dysfunction`. Title and Open Graph title `Erectile Dysfunction Treatment in San Antonio | The Urology Place`. Description matches the fixture SEO description. Open Graph image is the share asset at `w=1200&h=630&fit=crop`. The public fixture has no `noindex` robots tag.
- `/women/bulkamid-cms-preview` selects Urinary Incontinence, is `noindex`, and its canonical is `https://theurologyplace.com/women/bulkamid-cms-preview`.
- `/women/form-hidden-preview` has no `appointmentReason` field. The hero links to `/patient-resources/contact-us`. It is `noindex`.
- `/men/invalid-reason-preview` selects General Urology. `Made Up Reason` is not an `<option>`. The string appears only in the React flight payload of the fixture document.
- `/men/title-mapped-reason` selects Vasectomy. `/men/general-reason-fallback` selects General Urology.
- `/men/male-sexual-dysfunction/erectile-dysfunction-options` selects Erectile Dysfunction Treatment and sets category `Men > Male Sexual Dysfunction`.
- `/men/ed-previous-address` returns 307 to `/men/erectile-dysfunction`.
- The Men menu keeps the hardcoded order and appends Erectile Dysfunction after Kidney Stones. Under Male Sexual Dysfunction, the hardcoded children stay first, including Varicocele, and Erectile dysfunction options is appended. The Women menu stays Hematuria, Emsella, Bulkamid for Stress Incontinence, Hormone Replacement Therapy, and Kidney Stones. Unlisted fixtures are absent.
- `/men` adds one service card, Erectile Dysfunction, after the existing eleven cards. The parented page is not a card. `/women` does not add a card.
- `/sitemap.xml` uses `https://www.theurologyplace.com`. It includes the two temporary public paths, `/men/vasectomy`, and `/women/bulkamid-for-stress-incontinence`. It does not include the unlisted fixtures.
- `/women/bulkamid-for-stress-incontinence` is the hardcoded page. The browser title is Bulkamid for Stress Incontinence, the reason is Urinary Incontinence, and the page does not use the CMS template. `/men/vasectomy` HTML contains Vasectomy, its canonical is `https://theurologyplace.com/men/vasectomy`, and it does not contain `data-treatment-page`.

**Production host, read only**

No POST was sent to production.

- `https://www.theurologyplace.com/` returns `308` to `https://theurologyplace.com/`.
- `https://www.theurologyplace.com/api/revalidate` returns `308` to `https://theurologyplace.com/api/revalidate`.
- `https://theurologyplace.com/api/revalidate` returns `404` today. The route is not deployed.
- `https://theurologyplace.com/men/vasectomy` returns `200` with `x-vercel-cache: HIT`. That is the current live site, which does not include this code.

`SANITY_REVALIDATE_SECRET` is not set in `.env.local`. `.env.example` lists the name blank and says not to commit a real secret.

**Required production configuration, not done**

Do this only after an approved deploy. Do not commit the secret.

- Webhook URL: `https://theurologyplace.com/api/revalidate`. Use the apex host. `www` currently returns `308` to the apex, and a redirected POST can drop the signed body. After deploy, confirm the apex path answers this route without a redirect before enabling the webhook. Today that path is a 404 because the route is not deployed.
- Method: `POST`.
- Dataset: `production`. Trigger on Create, Update, and Delete. Leave draft and version events off. Unpublish arrives as Delete.
- Filter: `_type == "treatmentPage" && !(_id in path("drafts.**"))`.
- Projection:

```
{
  "_id": _id,
  "_type": _type,
  "operation": delta::operation(),
  "before": before(){
    section,
    parentPath,
    "slug": slug.current,
    previousPaths
  },
  "after": after(){
    section,
    parentPath,
    "slug": slug.current,
    previousPaths
  }
}
```

- Environment variable: `SANITY_REVALIDATE_SECRET`. Set the same value in Vercel Production and in the Sanity webhook secret field. The route does not accept the secret in the URL.
- Authentication: Sanity sends `sanity-webhook-signature` as `t=<millisecond timestamp>,v1=<signature>`. `parseBody` checks the HMAC over the raw body. The route accepts the request only when `isValidSignature === true`.
- After the secret is set, send one unsigned POST and confirm `401` and `{"revalidated":false}`. Then send one signed POST, or use Sanity’s first delivery attempt, and confirm `200` and `{"revalidated":true}`.
- Deploy this app so hosted Studio shows Treatment pages. This repo does not have a separate schema deploy. Saving from local Studio writes to the production dataset, so staff should not save a treatment document until that write is approved.
- No Sanity read token is added to the public site.

**Proposed live test, after approval**

Use temporary documents only. Do not use `/women/bulkamid-for-stress-incontinence` or `/men/vasectomy`.

1. Deploy with `SANITY_REVALIDATE_SECRET` set in Vercel, then create the webhook with the settings above. Confirm an unsigned POST returns 401 before creating a document.
2. In Studio, create an unlisted Women page at `/women/bulkamid-cms-preview` with a hero, rich text, image, YouTube id, formatted FAQ, comparison table, button, SEO, the contact form on, and reason `Urinary Incontinence`. Publish it. Open the URL with no further deploy. Confirm the reason, then change it, including to Other. Do not submit the form unless a synthetic CRM write is separately approved. Compare desktop and mobile layout with the live Bulkamid page.
3. Publish one disposable public Men page at `/men/cms-treatment-test` with reason `Erectile Dysfunction Treatment` and no parent. Confirm it appears at the end of Men, as a card on `/men`, and in `/sitemap.xml`, with a canonical on `https://theurologyplace.com`. Confirm an unlisted page is absent from those surfaces.
4. On the new public URL, record `curl -sI` twice. The second response should be `x-vercel-cache: HIT`. Record Sanity API usage and Vercel function count for that window. Repeat views should add neither. Repeat `/men/vasectomy` and the live Bulkamid URL ten times and confirm those repeats are also `HIT`.
5. Edit the preview title and confirm the webhook returns 200 and the next visit shows the edit. Change the slug and confirm the old path redirects. Unpublish both documents and confirm 404, menu removal, and sitemap removal. Leave both unpublished.

**Launch checklist**

The checklist in section 8 stays unchecked. The system is not launched. Local evidence covers the schema, template, form, cache headers, navigation rules, and hardcoded-page priority. Production CDN headers, a real publish, and unpublished test documents in the dataset wait for approval.

**Acceptance criteria**

Met for local verification. The fixture template renders the required blocks and the shared form. The visitor can change the reason, including Other. Hardcoded pages stay on their files. Public rows enter the menu, the section grid, and the sitemap. Unlisted rows do not. Existing routes stay prerendered, and repeat local production requests are cache hits.

Not met, on purpose: no production document was published, `x-vercel-cache` was not observed for a CMS 200, and the launch checklist is not complete.

**Unrelated observations, left unchanged**

- `npm run test:archive-cold-storage` failed `open lead and follow up split keeps adjacent workflows` in `scripts/archive-cold-storage.test.mjs`. The assertion expected `archivedCount` 1 and received 2. That test and the CRM scripts are outside the treatment-page change set and were not modified.
- `@sanity/image-url` still prints that its default export is deprecated when the shared client loads. `lib/sanity.ts` was not edited.
- The browser dev overlay reported a hydration mismatch on the contact-form honeypot. The diff is `data-cursor-ref` attributes added by the browser tool before hydration. It is not a product mismatch. `contact-form-fields.tsx` was not edited.
- `bulkamid-website-and-social-copy.md` remains deleted in the working tree from before this phase.

**Rollback**

Not needed. No dataset documents, webhook, secret, or deployment were created. The temporary fixture visibility was reverted.

**Approval to deploy or run production testing**

Pending. Do not deploy, create the webhook, or publish a treatment document until that is explicitly approved.

---

## 1. Implementation overview

Ship one Sanity document type, `treatmentPage`, and two cached catch-all routes:

- `app/men/[...slug]/page.tsx`
- `app/women/[...slug]/page.tsx`

After that deployment, clinic staff can create, edit, and publish **new** Men and Women treatment pages from Studio without another Git commit or Vercel deployment.

Existing hardcoded treatment pages stay in place and stay fully functional. Next.js serves a concrete `page.tsx` ahead of a catch-all, so `/women/bulkamid-for-stress-incontinence` continues to hit `app/women/bulkamid-for-stress-incontinence/page.tsx`. The live Bulkamid page is not replaced, removed, or migrated in this project. A CMS copy may be created later at a temporary unlisted slug for visual comparison only.

Ordinary visits are served from Vercel’s CDN. Sanity is called when a page is generated or regenerated: at deploy, after a publish webhook, or after a 24-hour fallback. Repeat views of an unchanged page must not call Sanity and must not execute a Function.

The public Sanity client in `lib/sanity.ts` stays `useCdn: false` and keeps no read token, so the site only sees published documents.

Work is sequential. Each phase has its own checkpoint. Later phases do not begin automatically.

### What this release includes

- New treatment pages under Men and Women, including an optional existing hub parent.
- Reusable blocks: rich text, images, YouTube, FAQs, comparison tables, buttons, calls to action, related treatments, and a two-column band.
- Navbar, Men/Women section listings, and sitemap updates for **public** CMS pages.
- The existing patient contact form, with a CMS toggle and a preselected appointment reason chosen from the application’s current allow-list.
- Cached rendering, on-demand revalidation, and tests that existing static pages do not become dynamic per request.

### What this release excludes

- Migrating the existing treatment catalog.
- Replacing or editing the live Bulkamid route.
- A second contact form, or any change to validation, reCAPTCHA, honeypot, rate limiting, staff email, or CRM ingest.
- Draft preview mode (it would require a read token and dynamic rendering).
- New interactive widgets (circumcision photo gate, Rezūm Vidscrip / `hls.js`, tabs, clinical-study filters, financing widgets).
- Changing the blog index, which already fetches Sanity on each view because it awaits `searchParams`.
- Enabling Cache Components.
- The Vercel Hobby commercial-use discussion.

---

## 2. Technical findings this plan is based on

Re-inspected before the plan was written. Stack and behavior below are from this repository, not assumptions.

### Stack

Confirmed in `package.json` and `next.config.ts`:

- Next.js `16.1.6`, React `19.2.3`, Tailwind CSS 4
- Sanity Studio `5.20.0` mounted at `/studio` (`studio/sanity.config.ts`, `basePath: '/studio'`)
- `next-sanity` `12.1.6`, `@sanity/client` `7.20.0`
- Project `urology-place-web`, project id `5zd6me01`, dataset `production`, API version `2025-03-25`
- `next.config.ts` sets redirects, a `noindex` header for `/studio`, and styled-components compilation. It does not set `cacheComponents`, `images.remotePatterns`, or a custom cache handler.
- There is no `middleware.ts`.

### Sanity client and current caching

```8:13:lib/sanity.ts
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})
```

`useCdn: false` sends queries to the live API (`api.sanity.io`), not the API CDN. No API token is configured. Calls do not pass `cache` or `next.revalidate`. In Next.js 16, a fetch without those options is not stored in the fetch cache at request time. Route-level `revalidate` is what keeps some current Sanity pages on ISR.

| Route | What Sanity owns | Caching in the repo |
| --- | --- | --- |
| `/` (`app/page.tsx`) | “What’s New” slider | `revalidate = 60` |
| `/about-us` | Team members | `revalidate = 300` |
| `/patient-resources/privacy-policy-hipaa` | Policy body | `revalidate = 300` |
| `/patient-resources/blog` | Full listing | No `revalidate`. Awaits `searchParams`, so it renders dynamically and queries Sanity on each view |
| `/patient-resources/blog/[slug]` | Full article | `generateStaticParams()` only. No `revalidate`. File comment says production HTML updates on the next deploy unless revalidation is configured |
| `app/sitemap.ts` | Blog URLs added to the file inventory | `revalidate = 3600` |

There is no webhook, no `revalidatePath`, and no `revalidateTag` anywhere in the repo today.

Sanity usage read during the assessment (calendar month through the 2026-11-23 UTC snapshot): about 19,791 uncached API requests of 250,000 included, 0 CDN requests of 1,000,000, about 1.4 GB bandwidth of 100 GB, 36 documents, about 20 MB of assets. The plan name (Free vs Growth) was not returned by the API. Studio traffic is excluded from those quotas. Free hard-stops at the cap; Growth bills overage. Confirm the plan name in project settings before relying on overage behavior. That confirmation is informational. It does not block the phases.

Published Vercel Hobby included amounts used as the efficiency budget (pricing docs at the time of the assessment; this repo cannot show actual usage): 1 million function invocations, 4 CPU-hours, 360 GB-hours memory, 100 GB fast data transfer, 10 GB fast origin transfer, 1 million CDN requests, and 5,000 image transformations per month. Exceeding a Hobby limit pauses that feature until the window resets.

A hardcoded treatment page today is built HTML served from the CDN. Sanity is not called. That is the baseline to preserve.

### Routes and Studio inventory

Almost every public URL is a static file. The only dynamic page route today is `app/patient-resources/blog/[slug]/page.tsx`.

`scripts/generate-route-inventory.mjs` walks `app/**/page.tsx` at build time. `prebuild` runs `routes:check` and fails if `studio/routeInventory.generated.ts` is stale. Any path containing `[` is `kind: "dynamic"`. `app/sitemap.ts` emits `kind === "static"` plus blog posts, so a catch-all path will not be emitted as a public URL.

Studio’s Pages pane (`studio/structure/index.ts`, `studio/components/pagesPane.tsx`) is a read-only inventory of those files. It does not create documents. New treatment pages will be Treatment documents, not new rows typed into that pane. The generator’s `SANITY_STATUS` map still needs an entry for the two new routes so the pane describes them accurately.

Registered schema types today (`studio/schemaTypes/index.ts`): `post`, `author`, `teamMember`, `teamCategory`, `homeAnnouncement`, `privacyPolicy`.

### Navigation and section listings

`app/components/navbar.tsx` is a client component with a hardcoded tree. `app/layout.tsx` renders it on every page and does not fetch Sanity. `/men` and `/women` repeat their own `SERVICES` arrays (`app/men/page.tsx`, `app/women/page.tsx`). The footer does not list treatments.

Existing nesting the parent list must cover:

- `/men/{slug}` and `/women/{slug}`
- Men hubs: `prostate-cancer`, `prostate-cancer/radiation-treatments`, `enlarged-prostate`, `bladder-cancer`, `male-sexual-dysfunction`
- Women hub: `hormone-replacement-therapy`

Hub bodies such as `app/men/male-sexual-dysfunction/page.tsx` are hardcoded content pages, not generated card grids. This release does not rewrite them.

### Presentation pieces to reuse

- `app/lib/hero.ts` — hero window and type tokens. Bulkamid uses `HERO_IMAGE_SECTION`, `HERO_TITLE_ON_IMAGE`, `HERO_SUBTITLE_ON_IMAGE`.
- `app/lib/button-styles.ts` — `BTN_MAKE_APPOINTMENT_HERO`, `BTN_PRIMARY`.
- `app/lib/site-metadata.ts` — `pageMetadata()` sets title, description, canonical, Open Graph, and Twitter. Canonical host is `https://theurologyplace.com`. `clinicShareImage()` substitutes the default share image and rejects clinical-patient filenames.
- `app/components/youtube-embed.tsx` — `YouTubeEmbed` takes `videoId` and `title`.
- `app/components/bulkamid-faq-accordion.tsx` — visual pattern for a data-driven FAQ. Questions stay hardcoded in that file; the new accordion takes props.
- `@portabletext/react` is already used by the blog.
- Blog images go through `urlFor()` and `next/image` with `unoptimized`.

Sitemap host is `https://www.theurologyplace.com` (`app/sitemap.ts`). Robots sitemap URL matches that host (`app/robots.ts`). This project does not change either host. New sitemap entries use the sitemap file’s existing host. Page canonicals keep using `pageMetadata()`.

### Contact form — how preselection works today

`ContactFormTemplate` (`app/components/contact-form-template.tsx`) accepts `pageName`, optional `headingOverride`, `serviceName`, `category`, `sourcePath`, `variant` (`"page"` or `"embedded"`), and `idPrefix`. It does **not** accept a default appointment reason.

It always does this:

```ts
const defaultAppointmentReason = getDefaultAppointmentReasonForPage(pageName);
```

and passes that into `ContactFormFields`.

`ContactFormFields` (`app/components/contact-form-fields.tsx`) already accepts `defaultAppointmentReason: AppointmentReasonOption`. It initializes select state from that prop, and a `useEffect` resets the select when the prop changes. The control is a normal `<select>` whose options are `APPOINTMENT_REASON_OPTIONS`. It is disabled only while a submission is in flight. `onChange` updates the selection, so visitors can change the reason. `"Other"` reveals the existing conditional detail field. The same pattern exists for best-time `"Other"`.

`getDefaultAppointmentReasonForPage` (`app/lib/contact-form-defaults.ts`) normalizes `pageName` and looks it up in `PAGE_TO_DEFAULT_REASON`. If there is no match, it returns `"General Urology"`.

Bulkamid calls the template like this (`app/women/bulkamid-for-stress-incontinence/page.tsx`):

```tsx
<ContactFormTemplate
  variant="embedded"
  pageName="Bulkamid for Stress Incontinence"
  serviceName="Bulkamid for Stress Incontinence"
  category="Women"
  sourcePath="/women/bulkamid-for-stress-incontinence"
  idPrefix="women-bulkamid"
/>
```

`"bulkamid for stress incontinence"` maps to `"Urinary Incontinence"`. A new page titled `"Erectile Dysfunction"` does **not** match the existing key `"male sexual dysfunction"` (which maps to `"Erectile Dysfunction Treatment"`). Without an explicit prop, that page would preselect General Urology.

The allow-list, in order, is `APPOINTMENT_REASON_OPTIONS`:

- General Urology
- Hematuria
- Prostate Cancer
- Vanquish (Water Vapor Ablation)
- Circumcision
- Enlarged Prostate
- Prostatic Artery Embolization (PAE)
- Elevated PSA
- Bladder Cancer
- Erectile Dysfunction Treatment
- CaverStem
- Peyronie's Disease
- GAINSWave
- Varicocele
- Vasectomy
- Low Testosterone
- Urinary Incontinence
- Kidney Stones
- Hormone Replacement Therapy
- Other

`validateAndNormalizeContact` in `app/lib/contact-validation.ts` rejects any `appointmentReason` that is not in that list, before email or CRM ingest. The API route `app/api/contact/route.ts` imports validation through `app/lib/contact-submission.ts` (which re-exports it), then enforces honeypot, rate limit, and reCAPTCHA, and sends the staff email plus the Apps Script CRM ingest in `app/lib/contact-crm.ts`. The email-body helper is still named `buildTrelloCardDescription`. The live sink is the CRM client and the staff email. This project leaves that path unchanged.

`"Erectile Dysfunction Treatment"` is already on the allow-list. A CMS page can preselect it with no code change. A reason that is not on the list requires adding the string to `APPOINTMENT_REASON_OPTIONS` and deploying. Until that deploy, staff choose the closest existing option or `"Other"`. `"Other"` remains the literal submitted reason; the visitor’s description is the existing conditional field.

### Next.js 16 revalidation API

Installed types require a second argument:

```ts
export declare function revalidateTag(tag: string, profile: string | CacheLifeConfig): undefined;
```

The runtime warns if `revalidateTag` is called with one argument. `updateTag` throws inside a route handler (`updateTag can only be called from within a Server Action`). Webhook handlers must call `revalidateTag(tag, "max")`. `"max"` is stale-while-revalidate. `revalidatePath` still invalidates a specific URL so the next request regenerates it. `revalidatePath` does not rebuild the page inside the webhook.

`next-sanity` already exports `parseBody` from `next-sanity/webhook`:

```ts
parseBody(req, secret?, waitForContentLakeEventualConsistency?) => Promise<{ isValidSignature: boolean | null, body }>
```

If a secret is passed, `isValidSignature` is a boolean. The route must accept the request only when it is `true`.

### Revision from the first assessment

The first assessment’s caching recommendation still holds: ISR, `dynamicParams: true`, explicit fetch tags, a signed webhook, a 24-hour fallback, resized Sanity images with `unoptimized`, and catch-all routes that defer to static files.

Three findings change the design:

1. **Contact form.** The first assessment only toggled `ContactFormTemplate` visibility. The template cannot preselect a Sanity-chosen reason until it accepts an optional prop. `ContactFormFields` already can.
2. **`revalidateTag` in 16.1.6** must be called with a cache profile. The webhook uses `revalidateTag(tag, "max")`.
3. **Submission sink.** Preserve `app/api/contact/route.ts` as it exists (validation, honeypot, rate limit, reCAPTCHA, staff email, Apps Script CRM). Do not add a Trello client and do not add a second form.

---

## 3. Updated architecture

### 3.1 Content model

One document type, `treatmentPage`. Staff do not choose a layout type.

| Field | Purpose |
| --- | --- |
| `title` | Page heading and the form’s `pageName`. Required. |
| `slug` | Leaf URL segment, generated from the title. Pattern `^[a-z0-9]+(?:-[a-z0-9]+)*$`, max 80. |
| `section` | `men` or `women`. This is the website section. |
| `parentPath` | Optional hub chosen from a fixed list of existing folders. Empty means `/men/{slug}` or `/women/{slug}`. |
| `menuLabel` | Navbar label. Defaults to the title. |
| `cardDescription` | Short text for the Men or Women service card. Max 200 characters. |
| `sortOrder` | Order among CMS links only. Hardcoded links stay in their current order. |
| `visibility` | `public` or `unlisted`. Unlisted pages can be opened by URL for the Bulkamid trial and stay out of the navbar, section grids, and sitemap. Default `unlisted`. |
| `hero` | Image with alt, title, subtitle. The appointment button uses `BTN_MAKE_APPOINTMENT_HERO`. |
| `seoTitle`, `seoDescription`, `shareImage` | Passed through the existing `pageMetadata()`. |
| `body` | Ordered blocks, listed below. |
| `showContactForm` | Boolean, default true. |
| `defaultAppointmentReason` | Optional list drawn from `APPOINTMENT_REASON_OPTIONS`. |
| `previousPaths` | Full paths saved when section, parent, or slug changes. Editors do not type these. |

`section` and `defaultAppointmentReason` stay separate fields.

Example for the requested erectile-dysfunction page:

- `section`: `men`
- `parentPath`: empty, or `male-sexual-dysfunction` if it should sit under that hub
- `slug`: `erectile-dysfunction`
- `showContactForm`: true
- `defaultAppointmentReason`: `Erectile Dysfunction Treatment`

The page title does not have to equal the reason string.

Parent choices for the first release, taken from the current navbar tree:

- Men: none, `prostate-cancer`, `prostate-cancer/radiation-treatments`, `enlarged-prostate`, `bladder-cancer`, `male-sexual-dysfunction`
- Women: none, `hormone-replacement-therapy`

A free-typed parent would create URLs with no hub page. A CMS page cannot be the parent of another CMS page in this release. Adding a new hub folder remains a code change.

### 3.2 Blocks

Editors stack these. Styling stays in the React components.

- **Rich text.** Same Portable Text style as `studio/schemaTypes/postType.ts`: headings, paragraphs, lists, bold, and links. Links are root-relative paths or `https` URLs.
- **Image.** Required alt, optional caption.
- **YouTube.** Video id, title, and caption. Rendered with `YouTubeEmbed`. The dataset stores an id, not a video file.
- **FAQ.** A question string and a Portable Text answer, rendered by one new accordion modeled on `app/components/bulkamid-faq-accordion.tsx`. Answers allow paragraphs, bold text, bulleted and numbered lists, and the same site-path or `https` links as rich text. Headings, images, and raw HTML are not part of an answer.
- **Comparison table.** Caption, column headings, and rows. This covers the Bulkamid Emsella table (`app/women/bulkamid-for-stress-incontinence/page.tsx`).
- **Button or call to action.** Label plus an internal path or `https` URL, using `BTN_PRIMARY`.
- **Related treatment.** A reference to another `treatmentPage`, or a manual path that already exists in `studio/routeInventory.generated.ts`.
- **Two-column band.** Text beside an image or a `teamMember` reference. This lets the trial page reproduce Bulkamid’s team and “Step One” bands.

Raw HTML is not a block. The phone number stays the existing clinic helper used by Bulkamid, so a page cannot publish a different number.

### 3.3 Appointment reason — one list, three-step fallback

Studio imports `APPOINTMENT_REASON_OPTIONS` from `app/lib/contact-form-defaults.ts`. That file has no Next.js imports, so the schema and the form share one list. There is no second copy to drift. Do not retype the options into the schema.

`ContactFormTemplate` gains an optional `defaultAppointmentReason?: AppointmentReasonOption`. Existing call sites omit it and keep today’s behavior. No existing treatment page file is edited.

When a CMS page renders:

1. If the stored value is one of `APPOINTMENT_REASON_OPTIONS`, pass it to the template.
2. If the field is empty or the value is not in that list, call `getDefaultAppointmentReasonForPage(title)`.
3. That function already returns `"General Urology"` when the title has no entry in `PAGE_TO_DEFAULT_REASON`.

Never pass an unknown string into `ContactFormFields`. An unknown value would not match an `<option>`, and a later submit would fail server validation or, worse, would need a bypass. This design does not add a bypass.

The browser posts to the current `/api/contact` route. Client and server validation stay in `validateContactForClient` and `validateAndNormalizeContact`.

If staff need a reason that is not already listed, a developer adds it to `APPOINTMENT_REASON_OPTIONS` and deploys. The select, the API, and the Studio list all update from that one array. Until that deploy, staff use the closest existing option or `"Other"`.

`showContactForm` defaults to true. When it is false, the page does not render the form, and the hero appointment button links to `/patient-resources/contact-us`. When it is true, the hero button scrolls to the on-page form.

Hidden form metadata stays separate from the reason:

- `pageName` and `serviceName`: treatment title
- `category`: `Men` or `Women`, plus the hub label when a parent is set (same style as today’s `"Men"` / `"Women"` values)
- `sourcePath`: the public pathname

### 3.4 Routes and coexistence with hardcoded pages

`app/men/[...slug]/page.tsx` and `app/women/[...slug]/page.tsx` are **required** catch-alls, so they do not replace `/men` or `/women`.

A request for `/women/bulkamid-for-stress-incontinence` still hits the static file. Do not delete or edit that file, or any other existing treatment `page.tsx`, in this project.

The GROQ query loads one published document by section plus full path.

- Zero matches calls `notFound()`.
- More than one match also calls `notFound()` and logs the document ids, so a duplicate cannot silently win with `[0]`.
- A path stored in `previousPaths` issues `redirect()` to the current path.
- A thrown Sanity error is not turned into a 404. `notFound()` runs only when the query succeeds and the published document is missing. A regeneration error should leave the last good cache in place.

`generateStaticParams()` returns published section and slug pairs. On a Sanity failure it returns `[]`, so a content outage cannot fail the deploy. `dynamicParams` stays `true`, so a slug created after the build is allowed. `generateStaticParams` warms known pages after a deploy. It is not the only way a slug can exist. Do not copy the blog slug route, which has `generateStaticParams` and no `revalidate`.

Adding the two catch-all files requires `npm run routes:generate` so `routes:check` passes. Mark them `managed` in the generator’s `SANITY_STATUS` map. Collision checks must ignore the dynamic inventory entries `/men/[...slug]` and `/women/[...slug]` and reject any full path that the inventory lists as `kind: "static"`.

Draft preview is out of this release. Staff review an `unlisted` published page instead. Unpublished drafts stay off the site because the public client has no token.

### 3.5 Navigation, listings, and sitemap

Hardcoded navbar order is preserved. A pure function `mergeTreatmentNav(staticTree, cmsItems)` only appends.

- A parented public page is inserted under the matching hub.
- A top-level public page is appended to Men or Women.
- Existing labels, order, and hrefs stay as they are.
- `/men` and `/women` append public **top-level** CMS pages to their `SERVICES` arrays, using the same card markup.
- Parented pages show under the hub in the navbar. Hardcoded hub bodies are not given a new Sanity fetch in this release.
- `app/sitemap.ts` adds public treatment paths beside the existing blog query.
- Unlisted and unpublished documents are absent from the nav query, the grids, and the sitemap. Unlisted pages also emit `robots: noindex`.

The navbar data is a small projection, not the page body: menu label, section, parent path, slug, and sort order, for `visibility == "public"` only. It is fetched in a server wrapper around `Navbar` with:

```ts
next: { revalidate: 86400, tags: ["treatment-nav"] }
```

On fetch failure the wrapper passes an empty list and the current navbar renders. The layout must not read `cookies()`, `headers()`, or `searchParams`, and must not export `dynamic = "force-dynamic"`.

This is the one place a cached fetch is shared by existing pages. It can move a fully static route to ISR in the build table. That is acceptable only while those routes stay CDN-cacheable. Phase 4 fails if any existing route becomes the per-request dynamic symbol `ƒ`.

Do not call `revalidatePath("/", "layout")` on publish. That would invalidate every page. Publish handling is specified in Phase 3.

### 3.6 Caching and publishing

On both treatment routes:

- `export const revalidate = 86400`
- `export const dynamicParams = true`
- Treatment fetch: `client.fetch(query, params, { next: { revalidate: 86400, tags: ["treatment-page", "treatment-page:${path}"] } })`
- Keep `useCdn: false` on that fetch so a regeneration sees the document that was just published. This call is rare and stays on the API quota.
- Do not flip the global client in `lib/sanity.ts` to `useCdn: true`. That would change homepage, About, privacy policy, and blog behavior.

Webhook route: `app/api/revalidate/route.ts`.

- `parseBody(req, process.env.SANITY_REVALIDATE_SECRET)` from `next-sanity/webhook`
- Accept only when `isValidSignature === true`
- Handle `_type == "treatmentPage"`
- Ignore ids that start with `drafts.`
- Do not log the document body
- Return 401 on a bad signature
- Return 200 on ignored types so Sanity does not retry forever

On publish, unpublish, or delete:

- `revalidatePath` for the current path and any `previousPaths`
- `revalidatePath` for `/men` or `/women`, and for the parent hub path when one exists
- `revalidatePath("/sitemap.xml")`
- `revalidateTag("treatment-nav", "max")`
- `revalidateTag("treatment-page", "max")`

The next request after `revalidatePath` regenerates that URL once. Later requests are CDN hits until the next edit or the 24-hour fallback.

| Action | Deployment | Result |
| --- | --- | --- |
| Edit a CMS page that is already cached | None | Webhook invalidates that URL, the section hub, the sitemap, and the nav tag. The next visit regenerates once. Later visitors get cached HTML. |
| Publish a brand-new slug | None | `dynamicParams` allows it. The first request renders and caches it. |
| Change slug, section, or parent | None, once `previousPaths` contains the old path | Old path redirects. Both paths, the affected hubs, the nav tag, and the sitemap are revalidated. A redirect that must live in `next.config.ts` still needs a deploy. |
| Unpublish or delete | None | Next request finds no published document, returns 404, and that 404 is cached until the next invalidation. The public nav query no longer returns it. |

A Studio document action, added in Phase 3, appends the previously published full path to `previousPaths` when section, parent, or slug changes. Editors do not type this field.

### 3.7 Images and video

- Hero images are CSS `background-image` URLs, matching Bulkamid, so they do not enter the image optimizer.
- Body images use `urlFor()` with a bounded width (hero background around 1600, body around 1200, share image 1200×630) and `next/image` with `unoptimized`, matching the blog.
- Do not add `images.remotePatterns` in `next.config.ts`. Turning remote optimization on would spend the Hobby image-transformation allowance.
- Do not upload video files to the dataset. YouTube ids keep that traffic off Sanity bandwidth and Vercel.

### 3.8 Resource rules for ordinary visits

A normal visit to an unchanged treatment page:

- is served from Vercel’s CDN
- does not run a Serverless Function
- does not call Sanity

The unavoidable cost is regeneration: one function invocation and one live API request for the page that changed, plus the section hub, sitemap, and nav tag when those are requested next. Publishing a few times a month is the intended cost. Short-interval ISR on every treatment URL, or a dynamic render on every visit, is not.

The shared navbar fetch is cached for 24 hours and tagged. It must stay a small projection. An uncached fetch in `app/layout.tsx` would run for every page that shares the layout and would fail Phase 4.

Excluded because they spend quota on ordinary traffic:

- Copying the blog index pattern onto treatment pages
- A 60-second `revalidate` on treatment URLs
- `cacheComponents` (this repo does not use them; with Cache Components, `dynamicParams` is removed)
- A browser-side Sanity query from the navbar
- Draft mode with a read token

---

## 4. Phased implementation plan

Each phase below is a checkpoint. Implement it, verify it, update the [progress tracker](#progress-tracker) and [phase log](#phase-log), and stop for review.

### Phase 1: Sanity schemas and content model

**Objective.** Give staff a Treatment document that can describe a Bulkamid-style page, including form visibility and a valid default reason, before any public route exists.

**Files affected.**

- New: `studio/schemaTypes/treatmentPageType.ts` (document and block types; may be split into a folder if that stays easier to read)
- Modify: `studio/schemaTypes/index.ts`
- Modify: `studio/structure/index.ts` (a “Treatment pages” list)
- Read-only imports: `studio/routeInventory.generated.ts`, `app/lib/contact-form-defaults.ts`

**Planned changes.**

- Required title, slug, section, hero title, and hero image alt.
- Slug uniqueness for the same section and parent, checked in Studio validation.
- Reject a full path that `routeInventory.generated.ts` already lists as `kind: "static"`. Ignore dynamic inventory entries.
- `defaultAppointmentReason` options are `APPOINTMENT_REASON_OPTIONS`. The field is optional. Its description states that the website section and the appointment reason are different, and names `Erectile Dysfunction Treatment` as the existing value for an erectile-dysfunction page.
- `showContactForm` defaults to true. Description: turn it off only when this page should not embed the patient form.
- `visibility` defaults to `unlisted`, so a first save cannot enter the public menu before someone chooses Public.
- `previousPaths` is hidden and read-only. The publish action that fills it arrives in Phase 3.
- Field descriptions use plain language.
- No raw HTML block, no video-file field, no free-text appointment reason.

**Dependencies.** None. Confirm the parent-path list and the unlisted default before building.

**Potential risks.**

- Editors can create documents that have no public URL until Phase 2.
- Studio validation runs in the browser, so the route still has to reject collisions in Phase 2.
- The options import is safe only because `contact-form-defaults.ts` does not import Next.js. Use a relative import if the Studio CLI cannot resolve `@/`.

**Verification steps.**

- An incomplete document cannot be published.
- A slug that matches `/men/vasectomy` or `/women/bulkamid-for-stress-incontinence` cannot be published.
- The reason dropdown shows the exact strings from `APPOINTMENT_REASON_OPTIONS`, including `Erectile Dysfunction Treatment` and `Other`, and does not offer a custom value.
- The public site is unchanged. Hardcoded treatment pages are not modified.

**Acceptance criteria.** A draft Treatment can be created for a temporary Bulkamid-style slug with section, hero, blocks, SEO, form toggle, and a listed reason. The live site still serves the hardcoded Bulkamid page.

**Rollback.** Revert the schema registration and redeploy. Draft documents can stay unpublished in the dataset.

**Estimated effort.** Medium. About 1–2 days.

### Phase 2: Reusable Next.js treatment template

**Objective.** Render one published document with the current visual system and the current contact form, including a preselected reason.

**Files affected.**

- New: `app/men/[...slug]/page.tsx`
- New: `app/women/[...slug]/page.tsx`
- New: `app/lib/treatment-pages.ts` (path building, reason resolution, fetch, types)
- New: `app/components/treatment-page/` — `TreatmentPageView`, rich text, FAQ accordion, comparison table, call to action, two-column band
- Modify: `app/components/contact-form-template.tsx` (optional prop only)
- Modify: `scripts/generate-route-inventory.mjs`
- Regenerate: `studio/routeInventory.generated.ts`

**Reuse without changes.**

- `app/components/contact-form-fields.tsx`
- `app/components/youtube-embed.tsx`
- `pageMetadata`, `canonicalUrl`, `clinicShareImage`
- `app/lib/hero.ts`
- `app/lib/button-styles.ts`
- `urlFor`
- `@portabletext/react`
- The clinic phone helper already used by Bulkamid
- `app/api/contact/route.ts` and the validation, reCAPTCHA, honeypot, rate-limit, email, and CRM modules

**Do not edit** existing treatment page files, including `app/women/bulkamid-for-stress-incontinence/page.tsx`, and do not edit `PAGE_TO_DEFAULT_REASON` to special-case CMS titles.

**Planned changes.**

- Both routes call one loader. It builds the path from section, parent, and slug, fetches the published document, and renders `TreatmentPageView`.
- Hero uses the shared hero tokens. The image is a CSS background. The appointment button scrolls to the form when `showContactForm` is true, and links to `/patient-resources/contact-us` when it is false.
- Body blocks map to the new components. Unknown block types are skipped and logged by type name.
- FAQ answers are Portable Text (paragraphs, bold, lists, and links), not a plain string. Render them with `@portabletext/react`. Do not pass the answer through an HTML parser.
- When `showContactForm` is true, render `ContactFormTemplate` with `variant="embedded"`, `pageName` and `serviceName` set to the title, `category` set from section and parent, `sourcePath` set to the pathname, a stable `idPrefix`, and `defaultAppointmentReason` set only after the allow-list check.
- Template prop behavior: if the prop is present and included in `APPOINTMENT_REASON_OPTIONS`, use it; otherwise keep `getDefaultAppointmentReasonForPage(pageName)`.
- `generateMetadata` uses `pageMetadata()`. Unlisted pages set `robots` to noindex. A missing share image uses `clinicShareImage()`.
- Missing title or a confirmed empty query calls `notFound()`. A thrown Sanity error is not converted into a 404.
- A matching `previousPaths` entry redirects to the current path. The array may still be empty until Phase 3.
- Sanity images use bounded `urlFor()` URLs and `unoptimized`.

**Dependencies.** Phase 1 approved and logged. The schema already lives in this repo, so local template work does not require a production deploy or a Sanity schema deploy. The phase log entry “Phase 1 adjustment — 2026-11-22 — FAQ answers” records that check. Do not create or publish treatment documents in the `production` dataset for local testing. Hosted Studio shows the schema only after the app is deployed.

**Potential risks.**

- Visual drift from Bulkamid.
- A catch-all that handles `/men` or `/women`.
- Passing an unvalidated string into the select.

**Verification steps.**

- Render an unlisted fixture with hero, text, image, YouTube, FAQ, table, and button.
- The reason select shows the configured option on load.
- Changing it to another option, including `Other`, updates the field and reveals the conditional input.
- An empty reason uses the title map, then General Urology.
- An invalid stored value is ignored.
- Bulkamid’s live route still shows Urinary Incontinence, because its file is unchanged and its `pageName` is still `Bulkamid for Stress Incontinence`.
- `npm run routes:check` passes.
- The build lists the two catch-alls as dynamic or ISR and lists `/women/bulkamid-for-stress-incontinence` as static.

**Acceptance criteria.** The fixture renders the shared form with the configured reason selected. The visitor can change it. Hardcoded pages are unchanged. Static files win over the catch-all.

**Rollback.** Revert the new routes, the inventory update, and the optional prop, then redeploy. Static pages remain the files they already are.

**Estimated effort.** Medium-high. About 2–3 days.

### Phase 3: Caching, revalidation, and publishing

**Objective.** Make a published page reachable without another deploy, and make later edits refresh that page without a Sanity call on every visit.

**Files affected.**

- New: `app/api/revalidate/route.ts`
- Modify: the treatment loader and both catch-all route files
- New Studio document action that appends the old full path to `previousPaths` when section, parent, or slug changes at publish
- Environment: `SANITY_REVALIDATE_SECRET` in Vercel and in the Sanity webhook. The secret is not committed.

**Planned changes.**

- Apply the caching and webhook behavior in [section 3.6](#36-caching-and-publishing).
- `generateStaticParams()` returns `[]` if Sanity is unavailable.
- Webhook ignores drafts and other document types.
- Slug-change redirect uses `previousPaths`.
- Unpublish or delete revalidates the path; the next successful query that finds nothing returns 404.

**Dependencies.** Phase 2 approved and logged. Production hostname for the webhook confirmed. A Sanity project admin can create the webhook. The secret is stored in Vercel.

**Potential risks.**

- An open revalidate endpoint if the signature check is skipped.
- A missed webhook. The 24-hour fallback covers it. There is no second queue.
- A Sanity error during regeneration stored as a cached 404.
- Stale nav for one request after `revalidateTag(..., "max")`. That is expected stale-while-revalidate, not a per-visit refetch.

**Verification steps.**

- Build output shows the treatment routes as ISR, not as per-request dynamic routes (`ƒ`).
- Publish an unlisted test document with no Git commit and no Vercel deployment.
- The first request renders it. The second response carries `x-vercel-cache: HIT`.
- Sanity API usage increases by the regeneration, not by the second request.
- Edit the title, confirm the webhook returns 200, and confirm the following request shows the new title.
- Unpublish and confirm the next request is 404.
- Change the slug and confirm the old path redirects.
- Repeat a request to `/women/bulkamid-for-stress-incontinence` and confirm it never hits the catch-all.
- Record the `curl -sI` headers and the before/after Sanity and Vercel counts in the phase log.

**Acceptance criteria.** A new unlisted page is reachable after publish with no deploy. A second unchanged visit does not call Sanity. Existing static treatment URLs stay on their files.

**Rollback.** Disable the Sanity webhook, remove the secret, and revert the route and fetch options. Redeploy. Pages already cached expire on the fallback window or on that redeploy.

**Estimated effort.** Medium. About 1–2 days, plus webhook setup.

### Phase 4: Navigation, SEO, and site integration

**Objective.** Put public CMS pages into the navbar, the Men and Women grids, and the sitemap, without making existing static pages render dynamically on every request.

**Files affected.**

- New: `app/lib/treatment-nav.ts`
- Modify: `app/components/navbar.tsx` (optional CMS links prop; hardcoded tree unchanged)
- Modify: `app/layout.tsx` (server wrapper that passes the cached projection)
- Modify: `app/men/page.tsx` and `app/women/page.tsx` (append top-level public CMS cards)
- Modify: `app/sitemap.ts`
- Unchanged: `app/robots.ts`

**Planned changes.**

- Implement the merge, listing, sitemap, and layout-fetch rules in [section 3.5](#35-navigation-listings-and-sitemap).
- Canonicals and Open Graph stay on `pageMetadata()`.
- Unlisted pages stay noindex and out of nav, grids, and sitemap.

**Navbar caching safeguards.**

- The layout fetch includes `next: { revalidate: 86400, tags: ["treatment-nav"] }`.
- The query selects only nav fields for `visibility == "public"`. It does not load body, hero images, or portable text.
- Fetch failure passes `[]` and the hardcoded navbar still renders.
- No `cookies()`, `headers()`, `searchParams`, or `force-dynamic` in the layout or the navbar wrapper.
- Publish uses `revalidateTag("treatment-nav", "max")` plus path revalidation for the edited URL, the section page, and the sitemap. It does not call `revalidatePath("/", "layout")`.
- Phase 4 stops if the build marks any existing static route as `ƒ`.

**Dependencies.** Phase 3 approved and logged, so the nav tag is invalidated on publish. Otherwise new links wait for the 24-hour fallback.

**Potential risks.**

- A cached fetch in the root layout moving fully static routes to ISR. Acceptable only when the second request is a CDN hit.
- A fetch without `revalidate`, or any dynamic API in the layout, running a function for every page on the site.

**Verification steps.**

Record the `next build` route table **before** this phase and **after** it, for at least:

- `/`
- `/men/vasectomy`
- `/women/bulkamid-for-stress-incontinence`
- `/men`
- `/women`
- one blog post, `/patient-resources/blog/[slug]`

Fail the phase if any existing route that was static becomes `ƒ`.

Then, after deploy:

- Ten requests to `/men/vasectomy`. After the first, `x-vercel-cache` is `HIT`. Sanity API usage does not rise with those repeats.
- The same check on `/women/bulkamid-for-stress-incontinence`.
- Publish a public test page and confirm it appears in the correct menu, on `/men` or `/women` if it has no parent, and in `/sitemap.xml` after sitemap revalidation.
- Confirm the Bulkamid URL is still the hardcoded page.
- Confirm an unlisted page is absent from the menu, the grid, and the sitemap.
- Record the before/after route table and the cache headers in the phase log.

ISR (`◐` or the build’s equivalent revalidate marker) on a previously static page is allowed only with those cache-hit results. Per-request dynamic rendering is not.

**Acceptance criteria.** A public page appears in the correct menu and in the sitemap without a deploy. An unlisted page does not. Existing URLs, including Bulkamid, still respond as they do today. No existing static page becomes a per-request dynamic render.

**Rollback.** Revert the layout fetch, navbar prop, section-page query, and sitemap query, then redeploy. The hardcoded trees return.

**Estimated effort.** Medium. About 1–2 days.

### Phase 5: Testing, verification, and launch

**Objective.** Run the full staff workflow on a temporary page and compare it with live Bulkamid without replacing that URL.

**Files affected.** No new application files expected. One or two Treatment documents in the `production` dataset. A Studio staff note is written into the repo only if the reviewer asks for it.

**Test documents.**

1. Recreate Bulkamid’s content at an unlisted path such as `/women/bulkamid-cms-preview`. Do not use `/women/bulkamid-for-stress-incontinence`.
2. After the visual check, publish a disposable public document such as `/men/cms-treatment-test` to prove the menu and sitemap.
3. Unpublish both at the end of the phase.

**Walkthrough.**

1. Create the preview page entirely in Studio: section Women, unlisted, hero, body, image, YouTube id, FAQ, comparison table, button, SEO.
2. Turn the contact form on and set the reason to `Urinary Incontinence`, the value Bulkamid uses today.
3. Publish. Confirm the preview URL loads with no code change and no deployment.
4. Confirm the reason is selected on load, then change it, including to `Other`, and confirm the extra field appears.
5. Submit through the existing workflow without exposing patient information. Run `npm run test:contact-route` first. That test stubs email, CRM, rate limit, and reCAPTCHA. A production CRM write with a synthetic name (`CMS Form Test`) happens only if the reviewer approves that write. Do not type real patient information, and do not log the payload.
6. Compare desktop and mobile layout with the live Bulkamid page: hero, table, FAQ, video, form.
7. Publish the disposable Men page with reason `Erectile Dysfunction Treatment`. Confirm the menu, `/men` grid, canonical, Open Graph, and sitemap. Then unpublish it and confirm 404, menu removal, and sitemap removal.
8. Edit the preview page, confirm revalidation, and record Vercel function count and Sanity API count for that window.
9. Load hardcoded pages, including Bulkamid, and confirm their content and cache headers.
10. Update the progress tracker and phase log. Leave both test documents unpublished.

**Dependencies.** Phases 1–4 accepted and logged.

**Potential risks.**

- A production form test creating a real CRM lead. Prefer the route test unless a production write is explicitly approved.
- A public test URL being indexed before noindex is confirmed. The Bulkamid comparison page stays `unlisted`.
- Leaving the test documents published.

**Verification steps.** The walkthrough above, plus the acceptance matrix in section 6. Record results in the phase log.

**Acceptance criteria.** The launch checklist in section 8 is complete. The live Bulkamid route is still the hardcoded file. Both test documents are unpublished.

**Rollback.** Unpublish the test documents. If a cache problem appears, disable the webhook. Code rollback is a revert of the phase that caused it, plus a redeploy.

**Estimated effort.** About 1–2 days, most of it content entry and verification.

---

## 5. Checkpoints and approval gates

Each phase is deployed and reviewed on its own. The next phase waits for explicit approval. Update the tracker and phase log before requesting that approval.

| Gate | What is being approved | Stop if |
| --- | --- | --- |
| Before Phase 1 | Parent list, unlisted-by-default, shared reason list | The reason list would be copied into Sanity by hand |
| After Phase 1 | Studio can describe a page and cannot collide with a static URL | A duplicate of the Bulkamid path can be published |
| After Phase 2 | Template, form preselection, and static-route priority | Bulkamid’s URL renders the CMS template, or an invalid reason can be submitted |
| After Phase 3 | Webhook, ISR, and the cache-header check | The second visit calls Sanity, or the route is per-request dynamic |
| After Phase 4 | Nav, grids, sitemap, and the static-page build comparison | Any existing static route becomes `ƒ` |
| After Phase 5 | Launch | Test documents are still public, or a hardcoded page changed |

---

## 6. Acceptance test matrix

| Test | Expected result | How to verify |
| --- | --- | --- |
| Editor creates a treatment | Document saves with title, slug, section, hero, body, and SEO | Studio, no code change |
| Section assignment | Men and Women are the only section values | Schema list |
| Publish without a deploy | New unlisted URL returns 200 after publish | Browser; Vercel deployment list unchanged |
| Hardcoded pages stay hardcoded | Bulkamid and `/men/vasectomy` content unchanged; their source files were not edited | Build table and visual check |
| Form can be shown | `showContactForm` renders the existing `ContactFormTemplate` | Preview page |
| Form can be hidden | No form fields; hero button goes to `/patient-resources/contact-us` | Toggle off and republish |
| Default reason | `Erectile Dysfunction Treatment` is the selected option on load | Inspect the select |
| Visitor can change it | Another option, including `Other`, sticks and shows the conditional field | Manual change |
| Empty reason | Title map runs, then General Urology | Leave the field empty |
| Invalid stored value | Value is ignored; select shows a listed option | Resolver check against `APPOINTMENT_REASON_OPTIONS` |
| Shared validation | API still rejects a reason outside the list | `npm run test:contact-route` |
| Security and delivery path | Honeypot, rate limit, reCAPTCHA, staff email, and Apps Script CRM ingest stay on `/api/contact` | Route test; no new form endpoint |
| Repeat visit | Second request is `x-vercel-cache: HIT` and does not add a Sanity API call | `curl -sI` and Sanity usage |
| Existing pages stay cacheable | `/men/vasectomy` and live Bulkamid are not `ƒ`; repeated requests are CDN hits | Build table and response headers |
| Edit refreshes the edited page | Webhook 200; next visit shows the edit | Vercel function count stays tied to requested URLs, not to all traffic |
| Images | Hero is a CSS background; body images use a width-limited `cdn.sanity.io` URL with `unoptimized` | HTML source |
| No new paid dependency | Webhook signing uses `next-sanity/webhook`, already installed | `package.json` unchanged except if a phase explicitly requires otherwise |
| Nav | Public page appears under the right section or hub; hardcoded order unchanged | Desktop and mobile menu |
| Section grid | Top-level public page appears on `/men` or `/women` | Page cards |
| Sitemap | Public URL present; unlisted URL absent | `/sitemap.xml` |
| Canonical and Open Graph | `pageMetadata()` title, description, canonical, and share image | View source |
| Existing URLs | Static files still win, including Bulkamid | Direct request |
| Unpublish | 404; removed from menu, grid, and sitemap | After webhook |

---

## 7. Vercel and Sanity resource protection

### How pages are served

Treatment HTML is generated at build or on the first request after publish, then stored on the CDN. A cache hit does not run a Function and does not call Sanity.

The navbar query is the same kind of cached fetch: one small projection, tag `treatment-nav`, 24-hour fallback. It is not the full page body. If that fetch is omitted or uncached, every page that uses the root layout pays for it. Phase 4 exists to prove that did not happen.

### How a publish updates the site

One webhook invocation, then the next visit to the edited URL regenerates that page. The section page, sitemap, and nav tag refresh with it. A few publishes a month sit inside the included Hobby amounts listed in section 2. Regeneration uses the live API (`useCdn: false` on that fetch) so an edit is not served from a stale Sanity CDN copy. Ordinary HITs do not.

### Images and bandwidth

`next.config.ts` has no `images.remotePatterns`. Sanity images keep `unoptimized`. `urlFor()` requests a bounded width. YouTube stays an embed id. Video files are not part of the schema.

### How to prove ordinary visits stay cheap

1. Save the `next build` route table before Phase 4 and after it.
2. Fail Phase 4 if an existing static route becomes `ƒ`.
3. `curl -sI` the CMS URL twice and record `x-vercel-cache`. The second response must be `HIT` when the page has not changed.
4. `curl -sI` `/men/vasectomy` and `/women/bulkamid-for-stress-incontinence` ten times. Repeats must be `HIT`.
5. Compare Sanity API usage and Vercel function invocations across that window. Repeat views should add neither.
6. After one publish, the function count should move by the pages actually requested next, not by total site traffic.
7. Record these results in the phase log. Do not treat a local `next dev` refresh as evidence. The dev server refetches; production cache headers are the evidence.

A layout fetch can change a fully static route to ISR with a long lifetime. Those pages remain CDN responses. They regenerate after the tag is invalidated or the fallback elapses, and only when someone requests them. That is the extra cost of showing new treatments in the shared menu. Per-request dynamic rendering is a failed phase.

### Informational limit, not a gate

Sanity’s plan name (Free vs Growth) was not in the API response during the assessment. Confirm it in project settings so an overrun is understood. Free hard-stops public API access at the included cap; Growth bills overage. Current usage was far under the shared included amounts. This confirmation does not block development.

---

## 8. Risk assessment

| Risk | Prevention | Detection | Response |
| --- | --- | --- | --- |
| Next.js 16 treats a layout fetch as dynamic | Explicit `revalidate` and tags; no cookies, headers, or `searchParams` in the layout | Build symbol `ƒ`; `x-vercel-cache` never `HIT` | Remove the layout fetch and stop the phase |
| `revalidateTag` called with one argument | Call `revalidateTag(tag, "max")` from the route handler | Runtime deprecation warning; stale pages | Correct the call |
| Webhook missed or delayed | 24-hour `revalidate`; signature required | Edit still old after a few minutes; route returns 401 | Replay from Sanity; check the secret |
| Static file hides a CMS document with the same path | Studio validation against `routeInventory.generated.ts`; route collision check | Visitor still sees the hardcoded page | Choose a new slug. Replacing Bulkamid is a later project |
| Shared layout regenerates every page on each publish | Revalidate the edited path, the section page, the sitemap, and the nav tag. Do not call `revalidatePath("/", "layout")` | Function count jumps by the full page count on one edit | Narrow the tags |
| Sanity API growth | Cached fetches; treatment pages do not copy the blog index | Usage climbs with traffic rather than with publishes | Find the uncached fetch and add a tag |
| Reason mismatch | One imported option list; resolver drops unknown values; API rejects unknown values | Select shows General Urology unexpectedly, or API returns invalid reason | Fix the stored value. Add a new reason only in `APPOINTMENT_REASON_OPTIONS`, then deploy |
| Navbar order changes | Merge function appends only | Visual diff of the menu | Revert the merge |
| Incomplete CMS document | Required fields in Studio; `notFound()` when the published document is missing | 404 or a skipped block in logs | Finish the document and publish again |
| Sanity outage during regeneration stored as 404 | `notFound()` only when the query succeeds and returns nothing | A good page becomes 404 during an API error | Throw and keep the last good cache |
| SEO regression | `pageMetadata()`, unlisted noindex, sitemap filter, static files win | View source and sitemap diff | Unpublish or revert Phase 4 |
| Local versus production | Judge production by the webhook and `x-vercel-cache` | Content looks instant locally and stale on Vercel | Wait for the webhook; do not add `force-dynamic` to “fix” it |
| Test page indexed | Default `unlisted`, noindex, omitted from sitemap | URL appears in sitemap | Unpublish |
| Patient information in the CMS or in logs | Form posts to the existing API; webhook logs ids only; tests use a fake name or the stubbed route test | Patient text in a document or log | Unpublish and delete the document |
| Publishing the catch-all over a static URL | Required catch-all plus static-file priority; inventory collision check | Bulkamid URL renders CMS content | Revert the route if the static file was removed; otherwise unpublish the colliding document |

### Confirm before implementation

These are setup facts, not commercial-plan gates.

- Production hostname the webhook should call.
- A project admin to create the Sanity webhook, and `SANITY_REVALIDATE_SECRET` stored in Vercel. Do not commit the secret.
- No Sanity read token is added to the public site.
- Parent-path list and unlisted-by-default, as written in this plan, unless the reviewer changes them before Phase 1.
- Whether a production CRM write with a fake name is allowed during Phase 5. `npm run test:contact-route` can cover validation without that write.
- Existing reCAPTCHA keys used by `/api/contact` stay as they are. This work does not rotate them.
- Sanity plan name, for quota awareness only.

---

## 9. Estimated effort

Ranges assume one developer who already knows this repo. Review pauses add calendar time because phases do not run on their own.

| Phase | Complexity | Effort |
| --- | --- | --- |
| 1. Schemas | Medium | 1–2 days |
| 2. Template and form prop | Medium-high | 2–3 days |
| 3. Cache and webhook | Medium | 1–2 days |
| 4. Nav, grids, sitemap | Medium | 1–2 days |
| 5. Trial and launch checks | Medium | 1–2 days |
| Total | | About 6–11 days |

Migrating the existing catalog is not in this estimate.

---

## 10. Launch checklist

All of the following must be true before the system is considered launched. Record the evidence in the Phase 5 log entry.

- [ ] `treatmentPage` exists with title, slug, section, optional parent, hero, SEO, blocks, related pages, form toggle, and default reason.
- [ ] The reason list is `APPOINTMENT_REASON_OPTIONS`, imported, not retyped.
- [ ] Section and appointment reason are different fields.
- [ ] Unknown reasons never reach the select or the API as the selected value.
- [ ] A new reason that is not in the list is a change to `APPOINTMENT_REASON_OPTIONS` plus a deploy. `Other` remains available until then.
- [ ] `ContactFormTemplate` keeps current behavior when the new prop is omitted.
- [ ] `ContactFormFields`, `/api/contact`, reCAPTCHA, honeypot, rate limit, validation, email, and CRM ingest are unchanged.
- [ ] Visitors can change the preselected reason, including to `Other`.
- [ ] An empty reason falls back through the title map to General Urology.
- [ ] Men and Women catch-alls render CMS pages.
- [ ] Every existing static treatment file still wins, including Bulkamid. Those files were not modified.
- [ ] Hero, type, FAQ, table, YouTube, buttons, and the form match the current design system.
- [ ] Images are resized Sanity URLs with `unoptimized`. No video files are uploaded.
- [ ] Public pages enter the navbar, the correct section grid, and the sitemap after publish.
- [ ] Unlisted and unpublished pages stay out of those surfaces. Unpublished URLs return 404.
- [ ] Canonicals and Open Graph come from `pageMetadata()`.
- [ ] Slug changes redirect from `previousPaths`.
- [ ] A second visit to an unchanged CMS page is a CDN hit and does not call Sanity.
- [ ] Existing static routes were compared in the build table and were not converted to per-request dynamic rendering. Cache headers for `/men/vasectomy` and live Bulkamid were recorded.
- [ ] No new paid service was added.
- [ ] The progress tracker marks all five phases Completed, and each phase log has verification results.
- [ ] Test documents are unpublished, and the live Bulkamid route is still the hardcoded page.

---

## 11. Requirement: update this document after every phase

Whoever completes a phase must, in the same change as the phase or in the wrap-up immediately after verification:

1. Set that phase’s status, started date, and completed date in the progress tracker.
2. Append a phase-log entry with the verification that was actually run and the results.
3. Leave the next phase as Not Started until the reviewer approves it.
4. If a phase is blocked, set status to Blocked and write the blocker in the log. Do not start the next phase to work around it.

This file is the record of approval. Chat summaries do not replace the tracker or the log.
