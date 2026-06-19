/* Lime Studios brand asset generator — sage + cream, minimal.
   Renders icon (500x500) + banner (3360x840) PNGs from inline SVG via sharp. */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = __dirname;
fs.mkdirSync(outDir, { recursive: true });

const CREAM = '#F2EEE3';
const SAGE = '#5A6E52';
const SAGE_MID = '#7E9170';
const SAGE_LT = '#A9B89E';
const INK = '#2B3327';

const iconSvg = `<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="500" fill="${CREAM}"/>
  <circle cx="250" cy="205" r="150" fill="${SAGE}"/>
  <g fill="${CREAM}">
    <rect x="200" y="200" width="24" height="58" rx="8"/>
    <rect x="238" y="178" width="24" height="80" rx="8"/>
    <rect x="276" y="150" width="24" height="108" rx="8"/>
  </g>
  <path d="M288 150 C 312 132, 314 104, 296 92 C 282 108, 276 134, 288 150 Z" fill="${SAGE_LT}"/>
  <path d="M288 150 C 292 128, 296 112, 300 100" stroke="${SAGE}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <text x="250" y="432" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="42" font-weight="600" letter-spacing="4" fill="${INK}">LIME STUDIOS</text>
</svg>`;

const bannerSvg = `<svg width="3360" height="840" viewBox="0 0 3360 840" xmlns="http://www.w3.org/2000/svg">
  <rect width="3360" height="840" fill="${CREAM}"/>
  <rect x="0" y="834" width="3360" height="6" fill="${SAGE}"/>
  <g transform="translate(300,420)">
    <circle cx="0" cy="0" r="180" fill="${SAGE}"/>
    <g fill="${CREAM}">
      <rect x="-60" y="-6" width="28" height="70" rx="9"/>
      <rect x="-16" y="-32" width="28" height="96" rx="9"/>
      <rect x="28" y="-64" width="28" height="128" rx="9"/>
    </g>
    <path d="M42 -64 C 70 -86, 72 -120, 50 -134 C 34 -116, 28 -86, 42 -64 Z" fill="${SAGE_LT}"/>
    <path d="M42 -64 C 48 -92, 52 -112, 56 -128" stroke="${CREAM}" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>
  <text x="560" y="402" font-family="Segoe UI, Arial, sans-serif" font-size="172" font-weight="600" fill="${INK}" letter-spacing="1">Lime Studios</text>
  <text x="566" y="496" font-family="Segoe UI, Arial, sans-serif" font-size="50" font-weight="400" fill="${SAGE_MID}" letter-spacing="4">Finance planners that make your money make sense</text>
  <g transform="translate(2520,250)">
    <rect x="0" y="0" width="640" height="360" rx="28" fill="#FFFFFF" opacity="0.6"/>
    <rect x="0" y="0" width="640" height="360" rx="28" fill="none" stroke="${SAGE_LT}" stroke-width="2"/>
    <g fill="${SAGE_MID}">
      <rect x="48" y="210" width="46" height="100" rx="8"/>
      <rect x="118" y="170" width="46" height="140" rx="8"/>
      <rect x="188" y="120" width="46" height="190" rx="8"/>
      <rect x="258" y="90" width="46" height="220" rx="8"/>
    </g>
    <circle cx="470" cy="168" r="78" fill="none" stroke="#E3DECF" stroke-width="26"/>
    <circle cx="470" cy="168" r="78" fill="none" stroke="${SAGE}" stroke-width="26" stroke-dasharray="330 200" stroke-linecap="round" transform="rotate(-90 470 168)"/>
    <g fill="#CFD6C4">
      <rect x="360" y="276" width="220" height="14" rx="7"/>
      <rect x="360" y="302" width="160" height="14" rx="7"/>
    </g>
  </g>
</svg>`;

fs.writeFileSync(path.join(outDir, 'lime-studios-icon.svg'), iconSvg);
fs.writeFileSync(path.join(outDir, 'lime-studios-banner.svg'), bannerSvg);

(async () => {
  await sharp(Buffer.from(iconSvg), { density: 384 }).resize(500, 500).png().toFile(path.join(outDir, 'lime-studios-icon.png'));
  await sharp(Buffer.from(bannerSvg), { density: 144 }).resize(3360, 840).png().toFile(path.join(outDir, 'lime-studios-banner.png'));
  console.log('OK: assets written to ' + outDir);
})().catch(e => { console.error('FAIL', e); process.exit(1); });
