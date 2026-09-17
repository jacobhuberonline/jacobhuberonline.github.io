# Huber Builds — Jacob Huber

Business website design, redesigns, and workflow automation by Jacob Huber, serving local and nationwide clients. The portfolio, background, and résumé support those services. Built with Astro and published as a static site on GitHub Pages.

**Site:** https://huberbuilds.com/

## Local development

Use Node.js 24 LTS (`.nvmrc` is included).

```sh
npm ci
npm run dev
```

Open the local address printed by Astro. The site uses the root path (`/`) both locally and on GitHub Pages so links and images can be checked before publishing.

## Verify a production build

```sh
npm run check
npm run build
npm run verify
npm run preview
```

`check` validates Astro and TypeScript. `verify` requires every public page, checks navigation, local links, assets, canonical/social metadata, unique titles/descriptions/headings, valid JSON-LD, sitemap coverage, and crawl rules. It also checks document language, unrestricted mobile zoom, the skip link and main landmark, unique element IDs, label/ARIA references, image alternatives and dimensions, and responsive sources for large images. It checks the configured contact form and confirms that Blog, LapQuest, excluded personal pages, and environment files are absent from the published output. When testing an enabled form, set the same `PUBLIC_CONTACT_ENDPOINT` for both `build` and `verify`.

## Publishing

The GitHub Actions workflow in `.github/workflows/deploy.yml` follows Astro's official GitHub Pages guide:

- Pushes to `main` install dependencies, check types, build, verify, and publish `dist/`.
- Pull requests targeting `main` run the same build checks without publishing.
- A manual run is available from **Actions → Build and deploy to GitHub Pages → Run workflow**.
- Repository **Settings → Pages → Source** must be **GitHub Actions**.

Site deployment uses GitHub's built-in workflow identity. A failed build or check prevents publishing that change. The optional contact form uses a separately deployed Cloudflare Worker and a Resend secret; neither the secret nor server code is included in the static site.

The repository is `jacobhuberonline/jacobhuberonline.github.io`. The public site origin is `https://huberbuilds.com`, with `base` kept as `/` in `astro.config.mjs`. `src/lib/paths.ts` prefixes internal links and public assets with Astro's configured base. GitHub **Settings → Pages** uses `huberbuilds.com` as the custom domain with **Enforce HTTPS** enabled. This GitHub Actions deployment does not require a `CNAME` file.

Cloudflare manages the domain's DNS. Both `@` and `www` have DNS-only `CNAME` records pointing to `jacobhuberonline.github.io`; Cloudflare flattens the root record to GitHub's IP addresses. GitHub redirects `www` and the original GitHub Pages address to the custom domain. Keep the `_github-pages-challenge-jacobhuberonline` TXT record in place to preserve GitHub's domain ownership verification.

## Content and pages

| URL | Source |
| --- | --- |
| `/` — services and introduction | `src/pages/index.astro` |
| `/about/` — background and interests | `src/pages/about.astro` |
| `/experience/` — resume and work history | `src/pages/experience.astro` |
| `/projects/` | `src/pages/projects.astro`, `src/data/projects.ts` |
| `/projects/krh-design-co/`, `/projects/vest-first-responder/` — draft project stories | `src/pages/projects/[slug].astro`, `src/data/project-stories.ts` |
| `/services/` — website and software services | `src/pages/services.astro` |
| `/services/websites/` — business websites and redesigns | `src/pages/services/websites.astro` |
| `/services/automation/` — workflow and business process automation | `src/pages/services/automation.astro` |
| `/contact/` — project enquiries, email, and social links | `src/pages/contact.astro`, `src/components/ContactForm.astro` |
| Custom not-found page | `src/pages/404.astro` |

Shared navigation, metadata, and footer live in `src/layouts/BaseLayout.astro`. The cream, peach, and green palette, rounded cards, and responsive layout use Tailwind CSS 3 and `src/styles/global.css`. The Experience page includes a print-friendly résumé view. Contact offers an on-page enquiry form when its endpoint is configured, with email and copy-email fallbacks. Service links preselect the project type. Visitors are told Jacob usually replies within 1 business day.

The three service offers are defined in `src/data/services.ts` and rendered by `src/components/ServiceOffers.astro` on the overview and relevant detail pages. The homepage uses the same offer names and descriptions. `src/components/ProjectPlanning.astro` shares timeline guidance and client preparation lists across the service pages, with a short summary on Contact. Keep timing and the client's role visible; preparation checklists use native, collapsed `<details>` so visitors can choose when to read them. Small websites use a 1–2 week planning estimate from the agreed start once materials and access are ready, with a first-draft target of 1–2 business days for straightforward sites. Automation estimates depend on the workflow and integrations. These are planning estimates, not guaranteed turnaround times. Ownership, running costs, and optional support are explained in `/services/#project-details`. Each quote defines scope, revisions, timing, payment, and delivery support. Contact messages are sent only when a visitor submits the form; the email fallback opens an editable draft.

Blog pages are deferred. Existing Markdown posts remain in `content/posts/` for the later blog implementation and are not published. LapQuest and one-off personal pages are excluded; their previous implementations remain in Git history.

Future service ideas are tracked in GitHub Issues. [Logo previews with an option to purchase (#2)](https://github.com/jacobhuberonline/jacobhuberonline.github.io/issues/2) records the proposed image-generation and checkout flow; it is not an available service yet.

## Project stories

The homepage introduces the featured sites, the portfolio links to longer stories, and website services links to their design choices. Both stories currently contain explicitly labeled illustrative copy requested as a placeholder. The real screenshots and the approved KRH testimonial remain distinct from that copy. No invented numerical outcomes or new client quotes are included.

Replace the challenge, decisions, and outcome in `src/data/project-stories.ts` when the actual stories arrive. Useful source material: the original problem, constraints, choices and tradeoffs, client feedback during the build, and observed changes after launch. Confirm any results or quotes before presenting them as facts.

Draft story pages use `noindex` and are excluded from the sitemap and search notifications. Once a story is verified, update its draft labels and metadata, make its `noindex` conditional in `src/pages/projects/[slug].astro`, add its route to `src/lib/seo.ts`, and move its route from the placeholder list to the normal required routes in `scripts/verify-build.mjs`. Keep a visible draft notice and `noindex` on any story still awaiting real details.

## Automation example

The automation service page leads with the real VEST certificate workflow described by Jacob: a post-training form sends participant details to Google Sheets, a script creates a certificate matched to the participant and training level, and the certificate is emailed. The shared content lives in `src/data/automation.ts`; `src/components/CertificateWorkflow.astro` presents the four steps. Homepage/portfolio previews and the VEST project page link to `/services/automation/#vest-certificates`.

This factual workflow is separate from the placeholder VEST website story. The exact certificate-template app, output file format, trigger behavior, volumes, and measured savings are not yet confirmed, so the copy does not assert them. It also does not claim a particular price for the VEST implementation. The $1,500 starting offer explains the scope of a new custom workflow: planning, connecting tools, agreed tests and failure cases, setup, and handover. The contact-cleanup demo remains a small illustration of input checking in an optional disclosure below the real example and project scope. Its existing `#automation-demo` link opens the disclosure when JavaScript is available; the summary can also be opened with mouse or keyboard.

## Contact form and Resend

GitHub Pages serves static files, so `workers/contact/index.ts` handles email on Cloudflare. It sends plain-text enquiries to `jhuber.mail@icloud.com` through Resend, with the visitor's address in `reply_to`. The recipient is fixed server-side; visitors cannot choose recipients or the sender. There is no database or automatic email to visitors.

The Worker validates fields and payload size, checks allowed browser origins, uses a honeypot and a Cloudflare rate-limit binding (5 attempts per minute per IP), and keeps the Resend key server-side. Rate limits are best-effort per Cloudflare location, not a global quota; shared IP addresses share the limit. Origin checks are not bot authentication. If targeted spam develops, add a server-verified challenge such as Turnstile. Retries of the same unchanged submission reuse a Resend idempotency key. Errors retain the visitor's message and offer a prefilled email fallback. Logs contain error categories/status codes, not submitted messages or provider response bodies.

To activate production sending:

1. Verify `huberbuilds.com` as a sending domain in Resend. The configured sender is `enquiries@huberbuilds.com`; change `RESEND_FROM_EMAIL` in `workers/contact/wrangler.jsonc` if using another verified sender.
2. Run `npx wrangler login` for the Cloudflare account managing the domain. Check that rate-limit namespace `1001` is not used by another Worker; choose another positive integer if needed.
3. Run `npm run contact:deploy`. This creates the contact Worker and the `contact.huberbuilds.com` custom domain, without changing the website's GitHub Pages DNS records. Until the secret is present, the Worker returns an unavailable response.
4. Run `npx wrangler secret put RESEND_API_KEY --config workers/contact/wrangler.jsonc` and enter a Resend sending key scoped to the verified domain. Never put this secret in a `PUBLIC_` variable or in GitHub Pages build variables.
5. Verify delivery with an explicitly approved test enquiry before enabling the public form. In repository **Settings → Secrets and variables → Actions → Variables**, set `PUBLIC_CONTACT_ENDPOINT` to `https://contact.huberbuilds.com/contact`, then run the existing Pages deployment workflow. The workflow passes this public endpoint to both the build and verifier.

With no endpoint configured, the existing email-draft contact flow remains available. Remove the variable and rebuild to return to that flow. With JavaScript disabled, visitors still have direct email contact. The Worker is deployed separately from the site; changes to `workers/contact/` require `npm run contact:deploy`.

For local development, copy `workers/contact/.dev.vars.example` to `workers/contact/.dev.vars`, provide a sending key and verified sender, and run `npm run contact:dev`. Start Astro in another terminal with `PUBLIC_CONTACT_ENDPOINT=http://localhost:8787/contact npm run dev`. The local secret file is ignored by Git. This local configuration sends real email when the form is submitted; automated tests mock Resend and send nothing.

Validation: `npm test` covers validation, fixed recipient/reply-to, idempotency, CORS, rate limiting, oversized input, provider errors, and missing configuration. `npx wrangler deploy --config workers/contact/wrangler.jsonc --dry-run` checks the Worker bundle without deploying. In a local browser, also check empty/invalid fields, service preselection, keyboard navigation, narrow layouts, success, and a stopped/offline endpoint; failure must preserve typed text and offer email.

Provider references: [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email), [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys), [Cloudflare rate limits](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), and [Worker custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

## Search discovery

- `src/lib/seo.ts` lists the indexable pages and describes the public WebSite, Person, WebPage, and Service entities. Add new public routes there; the build verifier catches sitemap omissions.
- `/sitemap.xml` and `/robots.txt` are generated at build time from the canonical site configuration. The 404 page is marked `noindex` and omitted from the sitemap. No fabricated modification dates are emitted.
- Titles, descriptions, and structured data describe the visible services. Keep the portfolio factual and add useful project details as new work is completed. Do not add invented reviews, outcomes, or city pages with duplicated content.
- The homepage title identifies Edwardsville, Illinois; visible service-area copy also covers St. Louis and nationwide work. About and Contact use their specific Schema.org page types and link to the person or business they describe. Keep business identity and service areas consistent with the visible content.
- After a successful production deployment, the workflow submits public sitemap URLs to IndexNow. Its root key file is intentionally public, not an account credential. This notifies participating search engines; receipt does not guarantee crawling or indexing. Notification failure leaves the deployed site intact and creates a workflow warning.

To check the live sitemap and key without submitting, or to resubmit after a notification failure:

```sh
node scripts/submit-indexnow.mjs --dry-run
node scripts/submit-indexnow.mjs
```

In Google Search Console, verify ownership of `huberbuilds.com` and submit `https://huberbuilds.com/sitemap.xml`. Use indexing and performance reports to see which service queries earn impressions, clicks, and enquiries. Bing Webmaster Tools can also track discovery and search performance. Those account dashboards require the owner's sign-in; the site does not embed their credentials.

Google's AI search features use the same crawlable, helpful content as traditional search. No special AI file or AI-specific schema is required, and neither structured data nor submissions guarantee rankings or citations.

Preparation lists and FAQs remain in the static HTML when collapsed. Important prices, timing, and the verified VEST workflow stay visible. Public pages allow search snippets, while draft stories remain labeled and excluded from indexing. Responsive project screenshots let smaller screens download smaller files. Fragment navigation uses the shared `html` scroll padding in `src/styles/global.css`; do not add the header offset again with component scroll margins.

For a release check, run [PageSpeed Insights](https://pagespeed.web.dev/) on the homepage and key enquiry/service pages. Also check keyboard navigation, the skip link, mobile-menu Escape behavior, disclosure controls, form validation without sending an email, direct section links, and reflow at 320 CSS pixels. Lighthouse scores are lab measurements; Search Console and real visitor data are needed to assess indexing, rankings, and field Core Web Vitals.

## Documentation

- [Astro: migrate from Next.js](https://docs.astro.build/en/guides/migrate-to-astro/from-nextjs/)
- [Astro: deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [IndexNow: submission protocol](https://www.indexnow.org/documentation)
