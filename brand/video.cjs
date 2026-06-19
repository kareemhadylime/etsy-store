/* Lime Studios — Featured shop video (8s, 1080x1080, silent, loop-friendly).
   Renders frames via sharp, encodes MP4 via ffmpeg. Run: node video.cjs */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CREAM = '#F2EEE3', CARD = '#FBFAF5', SAGE = '#5A6E52', SAGE_MID = '#7E9170',
  SAGE_LT = '#A9B89E', INK = '#2B3327', MUTE = '#6E7A66', GOLD = '#D9B36A', CLAY = '#C57B57';
const FONT = "Segoe UI, Arial, sans-serif";
const S = 1080, FPS = 30, DUR = 8.0, N = Math.round(FPS * DUR);

const framesDir = path.join(__dirname, '.video-frames');
fs.rmSync(framesDir, { recursive: true, force: true });
fs.mkdirSync(framesDir, { recursive: true });

const clamp01 = x => Math.max(0, Math.min(1, x));
const smooth = t => t * t * (3 - 2 * t);
const seg = (a, b, t) => smooth(clamp01((t - a) / (b - a)));
const fade = (ia, ib, oa, ob, t) => seg(ia, ib, t) * (1 - seg(oa, ob, t));

function emblem(cx, cy, s, grow) {
  const bars = [[-22, 24], [-8, 34], [6, 44]].map(([x, fh]) => {
    const h = fh * grow; return `<rect x="${x}" y="${(22 - h).toFixed(1)}" width="9" height="${h.toFixed(1)}" rx="3"/>`;
  }).join('');
  const leaf = Math.max(0, (grow - 0.7) / 0.3);
  return `<g transform="translate(${cx},${cy}) scale(${s})">
    <circle r="50" fill="${SAGE}"/>
    <g fill="${CREAM}">${bars}</g>
    <path d="M14 -22 C 24 -30, 25 -42, 17 -47 C 11 -39, 8 -30, 14 -22 Z" fill="${SAGE_LT}" opacity="${leaf.toFixed(2)}"/>
  </g>`;
}
function arc(cx, cy, r, w, a0, a1, color) {
  const TAU = Math.PI * 2, s = a0 * TAU - Math.PI / 2, e = a1 * TAU - Math.PI / 2;
  const x0 = cx + r * Math.cos(s), y0 = cy + r * Math.sin(s), x1 = cx + r * Math.cos(e), y1 = cy + r * Math.sin(e);
  const large = a1 - a0 > 0.5 ? 1 : 0;
  return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${w}"/>`;
}

function frame(t) {
  const p = [`<rect width="${S}" height="${S}" fill="${CREAM}"/>`];

  // Scene 1 — logo build
  const s1 = fade(0, 0.5, 2.6, 3.0, t);
  if (s1 > 0.002) {
    const sc = (0.6 + 0.4 * seg(0, 0.9, t)) * 2.4;
    const grow = seg(0.5, 1.4, t);
    p.push(`<g opacity="${s1.toFixed(3)}">${emblem(540, 410, sc, grow)}
      <text x="540" y="650" text-anchor="middle" font-family="${FONT}" font-size="98" font-weight="700" fill="${INK}" opacity="${seg(1.0, 1.7, t).toFixed(3)}">Lime Studios</text>
      <text x="540" y="716" text-anchor="middle" font-family="${FONT}" font-size="34" fill="${MUTE}" opacity="${seg(1.7, 2.4, t).toFixed(3)}">Finance planners that make your money make sense</text>
    </g>`);
  }

  // Scene 2 — live dashboard
  const s2 = fade(3.0, 3.3, 5.3, 5.6, t);
  if (s2 > 0.002) {
    const bg = seg(3.3, 4.3, t), sweep = seg(3.4, 4.7, t), cu = seg(3.6, 4.9, t);
    const saved = Math.round(2260 * cu).toLocaleString();
    const dcx = 770, dcy = 480, dr = 96;
    const vals = [0.5, 0.68, 0.55, 0.82, 0.95];
    const by = 800, bh = 200, bx = 200;
    const bars = vals.map((v, i) => { const h = bh * v * bg; return `<rect x="${bx + i * 84}" y="${(by - h).toFixed(1)}" width="54" height="${h.toFixed(1)}" rx="8" fill="${i === vals.length - 1 ? SAGE : SAGE_MID}"/>`; }).join('');
    const ring = sweep > 0.002 ? arc(dcx, dcy, dr, 38, 0, Math.max(0.0001, sweep * 0.78), SAGE) : '';
    p.push(`<g opacity="${s2.toFixed(3)}">
      <text x="540" y="230" text-anchor="middle" font-family="${FONT}" font-size="58" font-weight="700" fill="${INK}" opacity="${seg(3.3, 3.9, t).toFixed(3)}">Your numbers, instantly visual</text>
      <rect x="150" y="300" width="780" height="540" rx="30" fill="${CARD}" stroke="${SAGE_LT}" stroke-width="2"/>
      <text x="210" y="420" font-family="${FONT}" font-size="34" fill="${MUTE}">Saved this month</text>
      <text x="210" y="508" font-family="${FONT}" font-size="92" font-weight="700" fill="${INK}">$${saved}</text>
      <circle cx="${dcx}" cy="${dcy}" r="${dr}" fill="none" stroke="#E3DECF" stroke-width="38"/>${ring}
      ${bars}
    </g>`);
  }

  // Scene 3 — promise end card
  const s3 = seg(5.6, 5.9, t);
  if (s3 > 0.002) {
    const pop = (0.9 + 0.1 * seg(5.6, 6.3, t)) * 2.2;
    p.push(`<g opacity="${s3.toFixed(3)}">${emblem(540, 360, pop, 1)}
      <text x="540" y="560" text-anchor="middle" font-family="${FONT}" font-size="72" font-weight="800" fill="${INK}">Buy once. Own it forever.</text>
      <text x="540" y="628" text-anchor="middle" font-family="${FONT}" font-size="38" fill="${SAGE_MID}">Lime Studios · limestudiosco.etsy.com</text>
    </g>`);
  }

  return `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg">${p.join('')}</svg>`;
}

(async () => {
  for (let i = 0; i < N; i++) {
    const t = i / FPS;
    const png = path.join(framesDir, 'f' + String(i).padStart(4, '0') + '.png');
    await sharp(Buffer.from(frame(t))).png().toFile(png);
    if (i % 60 === 0) console.log('frame', i, '/', N);
  }
  console.log('encoding...');
  const out = path.join(__dirname, 'lime-studios-shop-video.mp4');
  execFileSync('ffmpeg', ['-y', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log('OK video ->', out);
})().catch(e => { console.error('FAIL', e); process.exit(1); });
