/* Lime Studios — Etsy delivery PDFs ("Start Here" / your-download one-pagers).
   One US-Letter page per listing, sage+cream brand. Render: node gen-delivery.mjs
   Real links: drop tools/pdf-gen/delivery-links.json = { "<slug>": { "<file>": "<url>" } } */
import puppeteer from 'puppeteer';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, 'output');
const linksPath = resolve(__dirname, 'delivery-links.json');
const LINKS = existsSync(linksPath) ? JSON.parse(readFileSync(linksPath, 'utf8')) : {};

const CREAM = '#F2EEE3', CARD = '#FBFAF5', SAGE = '#5A6E52', SAGE_MID = '#7E9170', SAGE_LT = '#A9B89E', INK = '#2B3327', MUTE = '#6E7A66', GOLD = '#D9B36A';

const PRODUCTS = [
  { slug: 'delivery-finance-bundle-ai', name: 'Premium Finance Bundle', edition: 'AI Edition', price: '$119',
    blurb: 'Five AI-Edition finance spreadsheets plus your AI Planning Guide — everything wired to work together.',
    files: [
      ['Budget Tracker — AI Edition', 'sheet'], ['Debt Payoff Planner — AI Edition', 'sheet'],
      ['Sinking Funds Planner — AI Edition', 'sheet'], ['Net Worth Tracker — AI Edition', 'sheet'],
      ['Small Business Finance Kit — AI Edition', 'sheet'], ['AI Planning Guide', 'pdf'], ['Setup Wizard', 'pdf'],
      ['Quick-start (1-pager)', 'pdf'], ['Cross-product reference diagram', 'pdf'],
    ] },
  { slug: 'delivery-life-bundle-ai', name: 'Premium Life Bundle', edition: 'AI Edition', price: '$149',
    blurb: 'Six AI-Edition spreadsheets — the full finance set plus Wedding — and your AI Planning Guide.',
    files: [
      ['Budget Tracker — AI Edition', 'sheet'], ['Debt Payoff Planner — AI Edition', 'sheet'],
      ['Sinking Funds Planner — AI Edition', 'sheet'], ['Net Worth Tracker — AI Edition', 'sheet'],
      ['Small Business Finance Kit — AI Edition', 'sheet'], ['Wedding Budget & Planner — AI Edition', 'sheet'],
      ['AI Planning Guide', 'pdf'], ['Setup Wizard', 'pdf'],
      ['Quick-start (1-pager)', 'pdf'], ['Cross-product reference diagram', 'pdf'],
    ] },
  { slug: 'delivery-wedding', name: 'Wedding Budget Spreadsheet + Planner', edition: '', price: '$19 / $34 / $49',
    blurb: 'Your wedding planning spreadsheet for the tier you purchased — up to 22 tabs on the AI Edition tier.',
    files: [
      ['Wedding Budget & Planner (your tier)', 'sheet'], ['Day-of Schedule', 'pdf'],
      ['AI Planning Guide (AI Edition only)', 'pdf'],
    ] },
];

function emblem(px) {
  return `<svg width="${px}" height="${px}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="${SAGE}"/>
    <g fill="${CREAM}"><rect x="28" y="48" width="9" height="24" rx="3"/><rect x="42" y="38" width="9" height="34" rx="3"/><rect x="56" y="28" width="9" height="44" rx="3"/></g>
    <path d="M64 28 C 76 18, 78 4, 68 -2 C 60 10, 56 20, 64 28 Z" transform="translate(0,6)" fill="${SAGE_LT}"/>
  </svg>`;
}
function linkRow(slug, file) {
  const [name, kind] = file;
  const url = LINKS[slug]?.[name];
  const icon = kind === 'pdf' ? '📄' : '📊';
  const box = url
    ? `<a class="lk" href="${url}">${url.length > 64 ? url.slice(0, 62) + '…' : url}</a>`
    : `<span class="lk ph">🔗 paste your ${kind === 'pdf' ? 'file' : 'Make-a-Copy'} link here</span>`;
  return `<div class="row"><div class="fn"><span class="ic">${icon}</span>${name}</div>${box}</div>`;
}
function page(p) {
  const ed = p.edition ? `<span class="chip">${p.edition}</span>` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { size: Letter; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 8.5in; height: 11in; font-family: 'Segoe UI', Arial, sans-serif; color: ${INK}; background: ${CREAM}; -webkit-print-color-adjust: exact; }
    .wrap { padding: 0.5in 0.6in; height: 11in; display: flex; flex-direction: column; }
    .top { display: flex; align-items: center; gap: 12px; border-bottom: 2px solid ${SAGE_LT}; padding-bottom: 14px; }
    .wm { font-size: 20px; font-weight: 700; letter-spacing: .5px; }
    .tag { margin-left: auto; font-size: 12px; color: ${MUTE}; }
    .titlerow { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 16px; }
    h1 { font-size: 32px; font-weight: 800; line-height: 1.08; }
    .chip { display: inline-block; vertical-align: middle; background: ${SAGE}; color: ${CREAM}; font-size: 13px; font-weight: 700; padding: 3px 11px; border-radius: 20px; margin-left: 8px; }
    .pricechip { background: ${GOLD}; color: ${INK}; font-weight: 800; font-size: 16px; padding: 5px 14px; border-radius: 22px; white-space: nowrap; }
    .sub { color: ${MUTE}; font-size: 14px; margin-top: 7px; }
    .blurb { font-size: 14.5px; margin-top: 10px; background: ${CARD}; border: 1px solid ${SAGE_LT}; border-radius: 12px; padding: 10px 15px; }
    h2 { font-size: 15px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: ${SAGE_MID}; margin: 13px 0 6px; }
    .steps { display: flex; gap: 12px; }
    .step { flex: 1; background: ${CARD}; border: 1px solid ${SAGE_LT}; border-radius: 12px; padding: 10px 13px; }
    .step b { display: block; font-size: 14px; margin-bottom: 3px; }
    .step p { font-size: 12.5px; color: ${MUTE}; line-height: 1.4; }
    .row { display: flex; align-items: center; gap: 10px; padding: 4px 0; border-bottom: 1px dashed ${SAGE_LT}; }
    .fn { font-size: 13.5px; font-weight: 600; width: 3.2in; }
    .ic { margin-right: 7px; }
    .lk { font-size: 12px; flex: 1; padding: 5px 11px; border-radius: 8px; }
    .lk.ph { border: 1.5px dashed ${SAGE_LT}; color: ${MUTE}; background: #fff; }
    a.lk { color: ${SAGE}; background: #fff; border: 1px solid ${SAGE_LT}; word-break: break-all; text-decoration: none; }
    ol { margin: 2px 0 0 20px; } ol li { font-size: 13px; margin: 3px 0; }
    .foot { margin-top: auto; border-top: 2px solid ${SAGE_LT}; padding-top: 12px; display: flex; align-items: center; gap: 12px; }
    .foot .msg { font-size: 12.5px; color: ${INK}; }
    .foot .msg b { color: ${SAGE}; }
    .foot .url { margin-left: auto; font-size: 12px; color: ${MUTE}; }
  </style></head><body><div class="wrap">
    <div class="top">${emblem(34)}<span class="wm">Lime Studios</span><span class="tag">limestudiosco.etsy.com</span></div>
    <div class="titlerow"><h1>${p.name}${ed ? ' ' + ed : ''}</h1><span class="pricechip">${p.price}</span></div>
    <div class="sub">Thank you for your order — your files are ready. Here's how to open them.</div>
    <div class="blurb">${p.blurb}</div>
    <h2>Get your files — 2 steps</h2>
    <div class="steps">
      <div class="step"><b>1 · Make a copy</b><p>Open each link below and click <b>File → Make a Copy</b> (or the "Make a Copy" button). It saves to your own Google Drive — yours forever.</p></div>
      <div class="step"><b>2 · Prefer Excel?</b><p>Inside the sheet, choose <b>File → Download → Microsoft Excel (.xlsx)</b>. Works in Excel, Numbers, and LibreOffice too.</p></div>
    </div>
    <h2>Your links</h2>
    ${p.files.map((f) => linkRow(p.slug, f)).join('')}
    <h2>First 10 honest minutes</h2>
    <ol>
      <li>Open the <b>Setup</b> tab and enter your basics (dates, amounts, goals).</li>
      <li>Type your numbers into the clean <b>Input</b> tab — the colour-coded <b>Dashboard</b> updates itself.</li>
      <li>Open the <b>AI Planning Guide</b> and paste a prompt + your data into any AI assistant for a personalised next step.</li>
    </ol>
    <div class="foot">${emblem(26)}<div class="msg">Anything not working? <b>Message me on Etsy</b> — I read every note. Buy once, own it forever.<br>— Karim Hady · Lime Studios</div><div class="url">v1 · 2026</div></div>
  </div></body></html>`;
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
try {
  const pg = await browser.newPage();
  for (const p of PRODUCTS) {
    const html = page(p);
    const htmlPath = resolve(OUT, p.slug + '.html');
    writeFileSync(htmlPath, html);
    await pg.goto('file://' + htmlPath, { waitUntil: 'load' });
    await pg.evaluateHandle('document.fonts.ready');
    await pg.pdf({ path: resolve(OUT, p.slug + '.pdf'), format: 'Letter', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true });
    console.log('✓ ' + p.slug + '.pdf');
  }
} finally { await browser.close(); }
console.log('done — ' + PRODUCTS.length + ' delivery PDFs in ' + OUT);
