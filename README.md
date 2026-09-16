# Jacob Huber — Personal Site

A personal introduction and portfolio for Jacob Huber: software engineering experience, selected projects, website services, and ways to get in touch. Built with Astro and published as a static site on GitHub Pages.

**Site:** https://jacobhuberonline.github.io/

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

`check` validates Astro and TypeScript. `verify` requires every portfolio page, checks navigation, local links, assets, and canonical/social metadata, and catches URLs left under an old base path. It also confirms that Blog, LapQuest, forms, and excluded personal pages or environment files are absent from the published output.

## Publishing

The GitHub Actions workflow in `.github/workflows/deploy.yml` follows Astro's official GitHub Pages guide:

- Pushes to `main` install dependencies, check types, build, verify, and publish `dist/`.
- Pull requests targeting `main` run the same build checks without publishing.
- A manual run is available from **Actions → Build and deploy to GitHub Pages → Run workflow**.
- Repository **Settings → Pages → Source** must be **GitHub Actions**.

No personal access token, Resend key, database, or environment file is required. Deployment uses GitHub's built-in workflow identity. A failed build or check prevents publishing that change.

The repository is `jacobhuberonline/jacobhuberonline.github.io`, which publishes the site at the root of `jacobhuberonline.github.io`. The site origin and root path are set in `astro.config.mjs`. `src/lib/paths.ts` prefixes internal links and public assets with Astro's configured base. If adding a custom domain later, update `site`, keep `base` as `/`, and configure the domain in GitHub Pages before publishing.

## Content and pages

| URL | Source |
| --- | --- |
| `/` — personal introduction | `src/pages/index.astro` |
| `/about/` — background and interests | `src/pages/about.astro` |
| `/experience/` — resume and work history | `src/pages/experience.astro` |
| `/projects/` | `src/pages/projects.astro`, `src/data/projects.ts` |
| `/services/` — website and software services | `src/pages/services.astro` |
| `/contact/` — email and social links | `src/pages/contact.astro` |
| Custom not-found page | `src/pages/404.astro` |

Shared navigation, metadata, and footer live in `src/layouts/BaseLayout.astro`. The warm light palette and responsive editorial layout use Tailwind CSS 3 and `src/styles/global.css`. The Experience page includes a print-friendly résumé view.

Blog pages and the contact form are deferred. Existing Markdown posts remain in `content/posts/` for the later blog implementation and are not published. LapQuest and one-off personal pages are excluded; their previous implementations remain in Git history.

## Documentation

- [Astro: migrate from Next.js](https://docs.astro.build/en/guides/migrate-to-astro/from-nextjs/)
- [Astro: deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
