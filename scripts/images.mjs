// Genera imágenes PLACEHOLDER locales (sin fotos externas) en src/assets/. Uso: npm run images
// Reemplaza src/assets/especialista.png por la foto real del especialista (vertical, ~4:5, mín. 800 px de ancho).
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const out = (name) => fileURLToPath(new URL(`../src/assets/${name}`, import.meta.url));

const portrait = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dcefeb"/><stop offset="1" stop-color="#f3ecdf"/></linearGradient>
    <linearGradient id="coat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eef5f3"/></linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <circle cx="640" cy="170" r="190" fill="#b7ddd5" opacity=".45"/>
  <circle cx="120" cy="860" r="220" fill="#ffffff" opacity=".35"/>
  <!-- cuerpo / bata -->
  <path d="M150 1000c0-210 110-330 250-330s250 120 250 330z" fill="url(#coat)" stroke="#b7ddd5" stroke-width="4"/>
  <path d="M400 680l-70 120 70 200 70-200z" fill="#12857b"/>
  <path d="M330 690l70 120-30 190M470 690l-70 120 30 190" fill="none" stroke="#b7ddd5" stroke-width="4"/>
  <!-- cuello y cabeza -->
  <rect x="360" y="600" width="80" height="90" rx="30" fill="#c99a7c"/>
  <ellipse cx="400" cy="480" rx="130" ry="150" fill="#d8ad8f"/>
  <path d="M270 470c0-120 60-190 130-190s130 70 130 190c-20-60-60-95-130-100-70 5-110 40-130 100z" fill="#3b2f2a"/>
  <!-- estetoscopio -->
  <path d="M330 700c-10 90 20 150 70 150s80-60 70-150" fill="none" stroke="#10403c" stroke-width="10" stroke-linecap="round"/>
  <circle cx="400" cy="858" r="18" fill="#10403c"/>
  <rect x="40" y="40" width="260" height="56" rx="28" fill="#ffffff" opacity=".9"/><text x="170" y="78" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="600" fill="#10403c">Foto de ejemplo</text>
</svg>`;

await sharp(Buffer.from(portrait)).png({ compressionLevel: 9 }).toFile(out('especialista.png'));
console.log('src/assets/especialista.png generado');
