# Self-hosted fonts

Noto fonts for Hindi (Devanagari) and Bengali, loaded with `next/font/local` in
`src/app/[locale]/layout.tsx`. They are self-hosted so the build does not have
to download them from Google Fonts.

Each file is the variable-weight (400–600) script subset served by Google Fonts
(`fonts.googleapis.com/css2?family=<Family>:wght@400..600`), downloaded 2026-11-14:

| File                          | Family                | Source                               |
|-------------------------------|-----------------------|--------------------------------------|
| `noto-sans-devanagari.woff2`  | Noto Sans Devanagari  | https://github.com/notofonts/devanagari |
| `noto-serif-devanagari.woff2` | Noto Serif Devanagari | https://github.com/notofonts/devanagari |
| `noto-sans-bengali.woff2`     | Noto Sans Bengali     | https://github.com/notofonts/bengali    |
| `noto-serif-bengali.woff2`    | Noto Serif Bengali    | https://github.com/notofonts/bengali    |

Copyright 2022 The Noto Project Authors. Licensed under the SIL Open Font
License 1.1 — see `OFL.txt`.

To update: fetch the CSS URL above with a current browser user agent, download
the `/* devanagari */` or `/* bengali */` file, and copy its `unicode-range`
into the matching `declarations` entries in the layout if it changed.
