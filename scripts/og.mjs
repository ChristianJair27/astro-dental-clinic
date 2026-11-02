// Genera public/og.png (1200x630) a partir de site.ts. Uso: npm run og
// sharp viene incluido con Astro.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/config/site.ts', import.meta.url), 'utf8');
const pick = (key) => src.match(new RegExp(`${key}:\\s*'([^']+)'`))?.[1] ?? '';
const name = pick('name');
const heading = pick('heading');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const wrap = (text, max) => {
  const lines = [''];
  for (const w of text.split(' ')) {
    if ((lines.at(-1) + ' ' + w).trim().length > max) lines.push(w);
    else lines[lines.length - 1] = (lines.at(-1) + ' ' + w).trim();
  }
  return lines;
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#10403c"/><stop offset="1" stop-color="#12857b"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="80" y="140" font-family="Segoe UI, Arial, sans-serif" font-size="36" font-weight="700" fill="#dcefeb">${esc(name)}</text>
  ${wrap(heading, 30)
    .map((l, i) => `<text x="80" y="${260 + i * 80}" font-family="Segoe UI, Arial, sans-serif" font-size="68" font-weight="800" fill="#ffffff">${esc(l)}</text>`)
    .join('')}
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(new URL('../public/og.png', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
console.log('public/og.png generado');
