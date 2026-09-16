# Jacob Huber — Personal Site

An Astro portfolio with static pages and React islands for the baby schedule and Psyduck collection.

**Site:** https://jacobhuberonline.github.io/personal-site/

## Local development

Use Node.js 24 LTS (`.nvmrc` is included).

```sh
npm ci
npm run dev
```

Open the `/personal-site/` address printed by Astro. The same base path is used locally and on GitHub Pages so links and images can be checked before publishing.

## Verify a production build

```sh
npm run check
npm run build
npm run verify
npm run preview
```

`check` validates Astro and TypeScript. `verify` checks the generated pages, local links, assets, metadata, and the schedule redirect. It also confirms that Blog, LapQuest, forms, and environment files are absent from the published output.

## Publishing

The GitHub Actions workflow in `.github/workflows/deploy.yml` follows Astro's official GitHub Pages guide:

- Pushes to `main` install dependencies, check types, build, verify, and publish `dist/`.
- Pull requests targeting `main` run the same build checks without publishing.
- A manual run is available from **Actions → Build and deploy to GitHub Pages → Run workflow**.
- Repository **Settings → Pages → Source** must be **GitHub Actions**.

No personal access token, Resend key, database, or environment file is required. Deployment uses GitHub's built-in workflow identity. A failed build or check prevents publishing that change.

The site origin and project path are set in `astro.config.mjs`. `src/lib/paths.ts` prefixes internal links and public assets with Astro's configured base. If adding a custom domain later, update `site`, change `base` to `/`, and configure the domain in GitHub Pages before publishing.

## Content and pages

| URL (after `/personal-site`) | Source |
| --- | --- |
| `/` — Home and Services | `src/pages/index.astro` |
| `/projects/` | `src/pages/projects.astro`, `src/data/projects.ts` |
| `/about/` | `src/pages/about.astro` |
| `/contact/` — email and social links | `src/pages/contact.astro` |
| `/family/baby/` | `src/pages/family/baby.astro`, `src/components/ScheduleClient.tsx` |
| `/family/schedule/` — legacy redirect | `src/pages/family/schedule.astro` |
| `/psyduck-collection/` | `src/pages/psyduck-collection.astro`, `src/data/psyduckCollection.ts` |
| `/missingcat/` | `src/pages/missingcat.astro` |

Shared navigation, metadata, system color theme, and footer live in `src/layouts/BaseLayout.astro`. Styling uses Tailwind CSS 3 and `src/styles/global.css`.

Blog pages and the contact form are deferred. Existing Markdown posts remain in `content/posts/` for the later blog implementation and are not published. LapQuest is excluded; its previous implementation remains in Git history before the Astro migration.

## Documentation

- [Astro: migrate from Next.js](https://docs.astro.build/en/guides/migrate-to-astro/from-nextjs/)
- [Astro: deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Astro: React integration](https://docs.astro.build/en/guides/integrations-guide/react/)
