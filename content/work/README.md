# Writing posts

Every folder here is one case study, shown at `/en/work/<folder-name>` and `/fr/work/<folder-name>`.

## Add a post

1. Copy `_template/` to a new folder, e.g. `content/work/my-tool/`.
2. Edit `en.mdx`: fill the frontmatter (the block between `---`) and write the body in markdown.
3. Delete `draft: true` when it's ready.
4. Optional: add `fr.mdx` with the same frontmatter keys translated. Without it, the French site shows the English post.

That's it. The post appears on the home page (sorted by `order`), in the ⌘K palette, the terminal (`ls projects`) and the sitemap.

Check it locally with `npm run dev`, then commit and push.

## What you can use in the body

- Normal markdown, plus tables and task lists (GitHub style).
- `<Pipeline>` with `<Stage label="..." sub="..." />` children draws the architecture sketch. Wrap stages in `<Lane title="...">` for several rows.
- `<Results />` prints the `results` from the frontmatter as a grid.
- `<Note>...</Note>` for a highlighted aside.

Images: put them in `public/work/<folder-name>/` and use `![alt text](/work/<folder-name>/file.png)`.

## Frontmatter keys

| key | required | what it does |
| --- | --- | --- |
| `title` | yes | Post title |
| `kind` | yes | `security` or `product`: which home-page list it goes in |
| `year` | yes | Shown next to the title, e.g. `"2026"` or `2025–26` |
| `summary` | yes | One-liner for the home page and link previews |
| `order` | no | Sort position, lower first |
| `status` | no | Small tag, e.g. `Work in progress` |
| `why` | no | Shown at the top of the post |
| `note` | no | Side note under the title |
| `stack` | no | List of technologies |
| `cover` | no | Screenshot path, e.g. `/work/<folder>/cover.webp`. Used in the hover preview and at the top of the post |
| `repo`, `live` | no | Links |
| `results` | no | List of `{ value, label }` for `<Results />` and the home page |
| `draft` | no | `true` hides the post everywhere |
