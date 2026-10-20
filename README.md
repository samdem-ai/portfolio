# portfolio

My personal site. I'm Samy, a cybersecurity engineer from Algiers (ESTIN 2026). Mostly malware analysis, reverse engineering and DFIR, plus some web stuff on the side.

The site is in English and French, has a page per project, my malware lab write-ups, and a printable CV.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. It redirects to `/en` or `/fr` depending on your browser language.

`npm run build` for a production build, `npm run lint` before pushing.

## Stack

- Next.js 16 (App Router) with TypeScript
- Tailwind CSS v4
- MDX for the project write-ups
- GSAP and Lenis for the scroll and page animations

No CMS, no database. Everything lives in the repo.

## Where things are

```
app/[lang]/        pages (home, work, about, lab, uses, resume)
components/        UI, plus motion/ for the animated bits and shell/ for the terminal
content/           my profile, experience, smaller projects, malware samples
content/work/      one folder per project write-up (en.mdx, fr.mdx)
lib/dictionary.ts  all the interface text, EN and FR
public/            CVs, screenshots, the illustration
```

## Adding a project

Copy `content/work/_template/` to a new folder, fill in the frontmatter, write the post, and delete the `draft: true` line. It shows up on the home page, in the work list and in the sitemap on its own. If there's no `fr.mdx`, the French site just shows the English version.

More detail in [content/work/README.md](content/work/README.md).

## Easter eggs

There are a few. Try the keyboard.

## Credits

The illustration of me is built from [Open Peeps](https://www.openpeeps.com/) by Pablo Stanley, released under CC0. I put it together from their parts (hair, face, beard and the laptop body) and swapped the logo on the laptop.
