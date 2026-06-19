/* Lime Studios — Featured photos for the Etsy "About your shop" gallery.
   Renders 5 on-brand 1600x1200 PNGs (sage + cream). Run: node featured.cjs */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'featured');
fs.mkdirSync(outDir, { recursive: true });

const CREAM = '#F2EEE3';
const CARD = '#FBFAF5';
const SAGE = '#5A6E52';
const SAGE_MID = '#7E9170';
const SAGE_LT = '#A9B89E';
const INK = '#2B3327';
const MUTE = '#6E7A66';
const GOLD = '#D9B36A';
const CLAY = '#C57B57';
const SLATE = '#6E8BA3';
const FONT = "Segoe UI, Arial, sans-serif";
const W = 1600, H = 1200;

// emblem centered at (x,y); base radius 50 * s
function emblem(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <circle cx="0" cy="0" r="50" fill="${SAGE}"/>
    <g fill="${CREAM}">
      <rect x="-22" y="-2" width="9" height="24" rx="3"/>
      <rect x="-8" y="-12" width="9" height="34" rx="3"/>
      <rect x="6" y="-22" width="9" height="44" rx="3"/>
    </g>
    <path d="M14 -22 C 24 -30, 25 -42, 17 -47 C 11 -39, 8 -30, 14 -22 Z" fill="${SAGE_LT}"/>
  </g>`;
}
function footer() {
  return `${emblem(110, H - 80, 0.7)}
    <text x="155" y="${H - 70}" font-family="${FONT}" font-size="34" font-weight="600" fill="${INK}">Lime Studios</text>
    <text x="${W - 90}" y="${H - 70}" text-anchor="end" font-family="${FONT}" font-size="28" fill="${MUTE}">limestudiosco.etsy.com</text>`;
}
function wrap(inner) {
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${CREAM}"/>
    ${inner}
    ${footer()}
  </svg>`;
}

// ---- 1. How it works ----
function photo1() {
  const steps = [
    { n: '1', t: 'Enter', d: 'Type your numbers into one clean Input tab.', icon: iconPencil },
    { n: '2', t: 'See', d: 'A colourful Dashboard shows where you stand.', icon: iconChart },
    { n: '3', t: 'Decide', d: 'Know exactly what to do next.', icon: iconTarget },
  ];
  const cardW = 400, gap = 60, total = cardW * 3 + gap * 2, x0 = (W - total) / 2, y = 360, cardH = 460;
  const cards = steps.map((s, i) => {
    const x = x0 + i * (cardW + gap);
    return `<g>
      <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="26" fill="${CARD}" stroke="${SAGE_LT}" stroke-width="2"/>
      <circle cx="${x + cardW / 2}" cy="${y + 120}" r="64" fill="${SAGE}"/>
      ${s.icon(x + cardW / 2, y + 120)}
      <text x="${x + cardW / 2}" y="${y + 250}" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="700" letter-spacing="3" fill="${SAGE_MID}">${s.n} · ${s.t.toUpperCase()}</text>
      ${wrapText(s.d, x + cardW / 2, y + 312, 300, 30, INK, 600)}
    </g>`;
  }).join('');
  return wrap(`
    <text x="${W / 2}" y="180" text-anchor="middle" font-family="${FONT}" font-size="76" font-weight="700" fill="${INK}">Ten honest minutes</text>
    <text x="${W / 2}" y="248" text-anchor="middle" font-family="${FONT}" font-size="36" fill="${MUTE}">From numbers to a plan — in three simple steps.</text>
    ${cards}`);
}
function iconPencil(cx, cy) {
  return `<g transform="translate(${cx - 30},${cy - 30})" fill="none" stroke="${CREAM}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 50 L40 16 L52 28 L18 62 L4 64 Z" fill="${CREAM}" stroke="none"/>
    <rect x="40" y="6" width="14" height="14" rx="3" transform="rotate(45 47 13)" fill="${CREAM}" stroke="none"/>
    <line x1="2" y1="64" x2="58" y2="64" stroke="${SAGE_LT}"/>
  </g>`;
}
function iconChart(cx, cy) {
  return `<g transform="translate(${cx - 30},${cy - 28})" fill="${CREAM}">
    <rect x="2" y="34" width="13" height="22" rx="3"/>
    <rect x="22" y="20" width="13" height="36" rx="3"/>
    <rect x="42" y="6" width="13" height="50" rx="3"/>
  </g>`;
}
function iconTarget(cx, cy) {
  return `<g transform="translate(${cx},${cy})" fill="none" stroke="${CREAM}" stroke-width="6">
    <circle r="30"/><circle r="16"/><circle r="3" fill="${CREAM}"/>
  </g>`;
}

// ---- 2. Range ----
function photo2() {
  const cats = ['Budgeting', 'Debt Payoff', 'Sinking Funds', 'Net Worth', 'Investments', 'Family & Education', 'Zakat', 'Weddings', 'Small Business'];
  const cols = 3, cw = 420, ch = 180, gx = 40, gy = 36;
  const totalW = cols * cw + (cols - 1) * gx, x0 = (W - totalW) / 2, y0 = 320;
  const chips = cats.map((c, i) => {
    const r = Math.floor(i / cols), col = i % cols;
    const x = x0 + col * (cw + gx), yy = y0 + r * (ch + gy);
    return `<g>
      <rect x="${x}" y="${yy}" width="${cw}" height="${ch}" rx="22" fill="${CARD}" stroke="${SAGE_LT}" stroke-width="2"/>
      <circle cx="${x + 70}" cy="${yy + ch / 2}" r="34" fill="${SAGE}" opacity="0.14"/>
      <circle cx="${x + 70}" cy="${yy + ch / 2}" r="10" fill="${SAGE}"/>
      <text x="${x + 130}" y="${yy + ch / 2 + 11}" font-family="${FONT}" font-size="34" font-weight="600" fill="${INK}">${esc(c)}</text>
    </g>`;
  }).join('');
  return wrap(`
    <text x="${W / 2}" y="170" text-anchor="middle" font-family="${FONT}" font-size="70" font-weight="700" fill="${INK}">One shop, the whole money journey</text>
    <text x="${W / 2}" y="236" text-anchor="middle" font-family="${FONT}" font-size="34" fill="${MUTE}">Every tool you need, in one calm, consistent system.</text>
    ${chips}`);
}

// ---- 3. Editions ----
function photo3() {
  const eds = [
    { t: 'Essentials', d: 'A clean start. Everything you need, nothing you don’t.', hi: false },
    { t: 'Pro', d: 'Deeper control — more breakdowns, more scenarios.', hi: false },
    { t: 'AI Edition', d: 'Reads your numbers and hands you a personalised next step.', hi: true },
  ];
  const cw = 420, gap = 50, totW = cw * 3 + gap * 2, x0 = (W - totW) / 2, y = 340, chH = 480;
  const cards = eds.map((e, i) => {
    const x = x0 + i * (cw + gap);
    const bg = e.hi ? SAGE : CARD, fg = e.hi ? CREAM : INK, sub = e.hi ? '#E7ECE0' : MUTE;
    return `<g>
      <rect x="${x}" y="${y}" width="${cw}" height="${chH}" rx="26" fill="${bg}" stroke="${e.hi ? SAGE : SAGE_LT}" stroke-width="2"/>
      ${e.hi ? `<rect x="${x + cw / 2 - 70}" y="${y + 40}" width="140" height="40" rx="20" fill="${GOLD}"/><text x="${x + cw / 2}" y="${y + 67}" text-anchor="middle" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="2" fill="${INK}">SMARTEST</text>` : ''}
      <text x="${x + cw / 2}" y="${y + 180}" text-anchor="middle" font-family="${FONT}" font-size="50" font-weight="700" fill="${fg}">${e.t}</text>
      <line x1="${x + 80}" y1="${y + 220}" x2="${x + cw - 80}" y2="${y + 220}" stroke="${e.hi ? '#7E9170' : SAGE_LT}" stroke-width="2"/>
      ${wrapText(e.d, x + cw / 2, y + 290, 320, 32, sub, 500)}
    </g>`;
  }).join('');
  return wrap(`
    <text x="${W / 2}" y="180" text-anchor="middle" font-family="${FONT}" font-size="76" font-weight="700" fill="${INK}">Three editions. Your call.</text>
    <text x="${W / 2}" y="248" text-anchor="middle" font-family="${FONT}" font-size="36" fill="${MUTE}">Start simple, upgrade when you want more.</text>
    ${cards}`);
}

// ---- 4. Dashboard mock ----
function photo4() {
  const fx = 150, fy = 250, fw = 1300, fh = 820;
  const kpis = [
    { l: 'Income', v: '$7,500', c: SAGE },
    { l: 'Spent', v: '$5,240', c: CLAY },
    { l: 'Saved', v: '$2,260', c: GOLD },
  ];
  const kw = 380, kgap = 30, kx0 = fx + 40, ky = fy + 90;
  const kpiSvg = kpis.map((k, i) => {
    const x = kx0 + i * (kw + kgap);
    return `<g>
      <rect x="${x}" y="${ky}" width="${kw}" height="150" rx="18" fill="${CREAM}"/>
      <rect x="${x}" y="${ky}" width="10" height="150" rx="5" fill="${k.c}"/>
      <text x="${x + 36}" y="${ky + 56}" font-family="${FONT}" font-size="30" fill="${MUTE}">${k.l}</text>
      <text x="${x + 36}" y="${ky + 116}" font-family="${FONT}" font-size="58" font-weight="700" fill="${INK}">${k.v}</text>
    </g>`;
  }).join('');
  // donut
  const dcx = fx + 230, dcy = fy + 520, dr = 120;
  const segs = [[SAGE, 0, 0.42], [CLAY, 0.42, 0.70], [GOLD, 0.70, 0.86], [SLATE, 0.86, 1]];
  const donut = segs.map(([c, a, b]) => arc(dcx, dcy, dr, 54, a, b, c)).join('');
  // bars
  const bx = fx + 540, by = fy + 620, bh = 230;
  const vals = [0.45, 0.62, 0.5, 0.78, 0.66, 0.9];
  const bars = vals.map((v, i) => {
    const x = bx + i * 64, h = bh * v;
    return `<rect x="${x}" y="${by - h}" width="40" height="${h}" rx="7" fill="${i === vals.length - 1 ? SAGE : SAGE_MID}"/>`;
  }).join('');
  // line/area trend
  const lx = fx + 960, ly = fy + 620, lw = 300, lh = 230;
  const pts = [0.2, 0.35, 0.3, 0.5, 0.62, 0.58, 0.8].map((v, i, a) => [lx + (lw * i) / (a.length - 1), ly - lh * v]);
  const linePath = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(0) + ' ' + p[1].toFixed(0)).join(' ');
  const areaPath = `M${pts[0][0]} ${ly} ` + pts.map(p => `L${p[0].toFixed(0)} ${p[1].toFixed(0)}`).join(' ') + ` L${pts[pts.length - 1][0]} ${ly} Z`;
  return wrap(`
    <text x="${W / 2}" y="150" text-anchor="middle" font-family="${FONT}" font-size="70" font-weight="700" fill="${INK}">Your numbers, instantly visual</text>
    <rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="30" fill="${CARD}" stroke="${SAGE_LT}" stroke-width="2"/>
    <circle cx="${fx + 34}" cy="${fy + 36}" r="8" fill="#D9655B"/><circle cx="${fx + 62}" cy="${fy + 36}" r="8" fill="${GOLD}"/><circle cx="${fx + 90}" cy="${fy + 36}" r="8" fill="${SAGE_MID}"/>
    <text x="${fx + fw - 40}" y="${fy + 46}" text-anchor="end" font-family="${FONT}" font-size="26" font-weight="600" fill="${MUTE}">Budget Dashboard · June</text>
    ${kpiSvg}
    <text x="${dcx}" y="${fy + 330}" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="600" fill="${MUTE}">Where it goes</text>
    ${donut}
    <text x="${dcx}" y="${dcy + 14}" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="700" fill="${INK}">100%</text>
    <text x="${bx}" y="${fy + 330}" font-family="${FONT}" font-size="28" font-weight="600" fill="${MUTE}">Spending by month</text>
    ${bars}
    <text x="${lx}" y="${fy + 330}" font-family="${FONT}" font-size="28" font-weight="600" fill="${MUTE}">Savings trend</text>
    <path d="${areaPath}" fill="${SAGE}" opacity="0.12"/>
    <path d="${linePath}" fill="none" stroke="${SAGE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map(p => `<circle cx="${p[0].toFixed(0)}" cy="${p[1].toFixed(0)}" r="6" fill="${SAGE}"/>`).join('')}
  `);
}
function arc(cx, cy, r, width, a0, a1, color) {
  const TAU = Math.PI * 2;
  const s = a0 * TAU - Math.PI / 2, e = a1 * TAU - Math.PI / 2;
  const x0 = cx + r * Math.cos(s), y0 = cy + r * Math.sin(s);
  const x1 = cx + r * Math.cos(e), y1 = cy + r * Math.sin(e);
  const large = a1 - a0 > 0.5 ? 1 : 0;
  return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
}

// ---- 5. Promise ----
function photo5() {
  const pills = ['No subscriptions', 'No broken formulas', 'Built for real currencies'];
  const pw = 420, gap = 30, totW = pw * 3 + gap * 2, x0 = (W - totW) / 2, py = 720;
  const pillSvg = pills.map((p, i) => {
    const x = x0 + i * (pw + gap);
    return `<g><rect x="${x}" y="${py}" width="${pw}" height="92" rx="46" fill="${CARD}" stroke="${SAGE_LT}" stroke-width="2"/>
      <circle cx="${x + 52}" cy="${py + 46}" r="16" fill="${SAGE}"/>
      <path d="M${x + 44} ${py + 46} l6 7 l12 -14" fill="none" stroke="${CREAM}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="${x + 86}" y="${py + 57}" font-family="${FONT}" font-size="32" font-weight="600" fill="${INK}">${p}</text></g>`;
  }).join('');
  return wrap(`
    ${emblem(W / 2, 290, 1.7)}
    <text x="${W / 2}" y="500" text-anchor="middle" font-family="${FONT}" font-size="92" font-weight="800" fill="${INK}">Buy once. Own it forever.</text>
    <text x="${W / 2}" y="575" text-anchor="middle" font-family="${FONT}" font-size="38" fill="${MUTE}">Tools built like systems — honest, durable, and yours to keep.</text>
    ${pillSvg}`);
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// naive word-wrap into <text> tspans, centered
function wrapText(str, cx, y, maxW, size, color, weight) {
  const words = str.split(' ');
  const lines = [];
  let cur = '';
  const cpl = Math.floor(maxW / (size * 0.52));
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > cpl) { lines.push(cur.trim()); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return `<text x="${cx}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${color}">` +
    lines.map((l, i) => `<tspan x="${cx}" dy="${i ? size * 1.3 : 0}">${esc(l)}</tspan>`).join('') + `</text>`;
}

const photos = [
  ['featured-1-how-it-works', photo1()],
  ['featured-2-range', photo2()],
  ['featured-3-editions', photo3()],
  ['featured-4-dashboard', photo4()],
  ['featured-5-promise', photo5()],
];

(async () => {
  for (const [name, svg] of photos) {
    fs.writeFileSync(path.join(outDir, name + '.svg'), svg);
    await sharp(Buffer.from(svg)).resize(W, H).png().toFile(path.join(outDir, name + '.png'));
    console.log('wrote', name);
  }
  console.log('OK featured photos ->', outDir);
})().catch(e => { console.error('FAIL', e); process.exit(1); });
