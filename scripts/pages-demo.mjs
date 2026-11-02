// Post-build step for the GitHub Pages demo of an R505 template.
// The templates are built for a site at "/" (client domain). On Pages they live under "/<repo>/",
// so this rewrites root-relative URLs in the generated HTML, adds a visible "demo" badge
// (the business, numbers and testimonials are fictional) and keeps the demo out of search engines.
//
// Usage: node scripts/pages-demo.mjs <distDir> <basePath> <repoUrl>
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const [dist = 'dist', base = '/', repoUrl = ''] = process.argv.slice(2)
const prefix = base.endsWith('/') ? base : `${base}/`
const baseName = prefix.slice(1) // "repo/"
const origin = 'https://christianjair27.github.io/'

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const rootRelative = new RegExp(`((?:href|src|action|poster|data-src)=["'])/(?!/|${esc(baseName)})`, 'g')
const absoluteOrigin = new RegExp(`${esc(origin)}(?!${esc(baseName)})`, 'g')

const badge = `<div style="position:fixed;left:12px;bottom:12px;z-index:2147483000;font:600 12px/1.2 system-ui,sans-serif;background:#111827;color:#fff;padding:8px 12px;border-radius:999px;box-shadow:0 4px 16px rgba(0,0,0,.25)">Plantilla demo · negocio ficticio · <a href="https://revolution505.com" style="color:#93c5fd">Revolution505</a>${repoUrl ? ` · <a href="${repoUrl}" style="color:#93c5fd">código</a>` : ''}</div>`

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) yield* htmlFiles(p)
    else if (entry.name.endsWith('.html')) yield p
  }
}

let count = 0
for await (const file of htmlFiles(dist)) {
  let html = await readFile(file, 'utf8')
  html = html.replace(rootRelative, `$1${prefix}`).replace(absoluteOrigin, `${origin}${baseName}`)
  html = html.replace(/<meta name="robots"[^>]*>/g, '')
  html = html.replace('</head>', '<meta name="robots" content="noindex, nofollow"></head>')
  html = html.replace(/<body([^>]*)>/, `<body$1>${badge}`)
  await writeFile(file, html)
  count++
}
console.log(`pages-demo: rewrote ${count} HTML files for ${prefix}`)
