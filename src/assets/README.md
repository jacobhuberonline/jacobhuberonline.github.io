# Social sharing graphic

`huber-builds-social.svg` is the editable vector source for the 1200 × 630 sharing card. It uses the site's cream, forest, and peach palette, original geometry, and system sans-serif type.

Reproduce the PNG from the repository root with Node 24 and the installed `sharp` dependency:

```sh
node --input-type=module -e "import sharp from 'sharp'; await sharp('src/assets/huber-builds-social.svg').png().toFile('public/images/huber-builds-social.png');"
```

The rendered PNG is committed so social crawlers receive a stable raster image. After changing the artwork, render and inspect the PNG, then keep its dimensions and alternative text in `src/layouts/BaseLayout.astro` accurate. Font rendering can vary between operating systems.
