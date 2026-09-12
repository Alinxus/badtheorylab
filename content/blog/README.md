# Posts

One markdown file per post. The filename is the URL, so `range-before-representation.md`
serves at `/blog/range-before-representation`.

Frontmatter:

```yaml
---
title: "Required. Shown as the headline."
date: 2026-09-12          # required, sorts newest first
tag: Research             # optional, defaults to Note
author: Bad Theory Labs   # optional
excerpt: "Optional. Shown on the index card and used for link previews."
image: /blog/name.jpg     # optional, goes in public/blog
imageAlt: "Optional."
draft: true               # optional, hides it everywhere
---
```

Everything under the frontmatter is markdown. Tables, code blocks, blockquotes and
lists are all styled. Reading time is counted from the body, so it does not need setting.

Nothing needs a rebuild step beyond the normal one. Add the file, commit, deploy.
