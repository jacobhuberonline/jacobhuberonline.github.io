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

`check` validates Astro and TypeScript. `verify` requires every public page, checks navigation, local links, assets, canonical/social metadata, unique titles/descriptions/headings, valid JSON-LD, sitemap coverage, and crawl rules. It also confirms that Blog, LapQuest, forms, and excluded personal pages or environment files are absent from the published output.

## Publishing

The GitHub Actions workflow in `.github/workflows/deploy.yml` follows Astro's official GitHub Pages guide:

- Pushes to `main` install dependencies, check types, build, verify, and publish `dist/`.
- Pull requests targeting `main` run the same build checks without publishing.
- A manual run is available from **Actions → Build and deploy to GitHub Pages → Run workflow**.
- Repository **Settings → Pages → Source** must be **GitHub Actions**.

No personal access token, Resend key, database, or environment file is required. Deployment uses GitHub's built-in workflow identity. A failed build or check prevents publishing that change.

The repository is `jacobhuberonline/jacobhuberonline.github.io`. The public site origin is `https://huberbuilds.com`, with `base` kept as `/` in `astro.config.mjs`. `src/lib/paths.ts` prefixes internal links and public assets with Astro's configured base. GitHub **Settings → Pages** uses `huberbuilds.com` as the custom domain with **Enforce HTTPS** enabled. This GitHub Actions deployment does not require a `CNAME` file.

Cloudflare manages the domain's DNS. Both `@` and `www` have DNS-only `CNAME` records pointing to `jacobhuberonline.github.io`; Cloudflare flattens the root record to GitHub's IP addresses. GitHub redirects `www` and the original GitHub Pages address to the custom domain. Keep the `_github-pages-challenge-jacobhuberonline` TXT record in place to preserve GitHub's domain ownership verification.

## Content and pages

| URL | Source |
| --- | --- |
| `/` — services and introduction | `src/pages/index.astro` |
| `/about/` — background and interests | `src/pages/about.astro` |
| `/experience/` — resume and work history | `src/pages/experience.astro` |
| `/projects/` | `src/pages/projects.astro`, `src/data/projects.ts` |
| `/services/` — website and software services | `src/pages/services.astro` |
| `/services/websites/` — business websites and redesigns | `src/pages/services/websites.astro` |
| `/services/automation/` — workflow and business process automation | `src/pages/services/automation.astro` |
| `/contact/` — email and social links | `src/pages/contact.astro` |
| Custom not-found page | `src/pages/404.astro` |

Shared navigation, metadata, and footer live in `src/layouts/BaseLayout.astro`. The cream, peach, and green palette, rounded cards, and responsive layout use Tailwind CSS 3 and `src/styles/global.css`. The Experience page includes a print-friendly résumé view. Contact offers email links with suggested subjects and a copy-email button; email is sent through the visitor's own mail app.

Blog pages and the contact form are deferred. Existing Markdown posts remain in `content/posts/` for the later blog implementation and are not published. LapQuest and one-off personal pages are excluded; their previous implementations remain in Git history.

## Search discovery

- `src/lib/seo.ts` lists the indexable pages and describes the public WebSite, Person, WebPage, and Service entities. Add new public routes there; the build verifier catches sitemap omissions.
- `/sitemap.xml` and `/robots.txt` are generated at build time from the canonical site configuration. The 404 page is marked `noindex` and omitted from the sitemap. No fabricated modification dates are emitted.
- Titles, descriptions, and structured data describe the visible services. Keep the portfolio factual and add useful project details as new work is completed. Do not add invented reviews, outcomes, or city pages with duplicated content.
- After a successful production deployment, the workflow submits public sitemap URLs to IndexNow. Its root key file is intentionally public, not an account credential. This notifies participating search engines; receipt does not guarantee crawling or indexing. Notification failure leaves the deployed site intact and creates a workflow warning.

To check the live sitemap and key without submitting, or to resubmit after a notification failure:

```sh
node scripts/submit-indexnow.mjs --dry-run
node scripts/submit-indexnow.mjs
```

In Google Search Console, verify ownership of `huberbuilds.com` and submit `https://huberbuilds.com/sitemap.xml`. Use indexing and performance reports to see which service queries earn impressions, clicks, and enquiries. Bing Webmaster Tools can also track discovery and search performance. Those account dashboards require the owner's sign-in; the site does not embed their credentials.

Google's AI search features use the same crawlable, helpful content as traditional search. No special AI file or AI-specific schema is required, and neither structured data nor submissions guarantee rankings or citations.

## Documentation

- [Astro: migrate from Next.js](https://docs.astro.build/en/guides/migrate-to-astro/from-nextjs/)
- [Astro: deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [IndexNow: submission protocol](https://www.indexnow.org/documentation)
