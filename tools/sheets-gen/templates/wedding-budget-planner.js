/**
 * Wedding Budget & Planner — Google Sheets template generator (Lime Premium Studios) — v1
 *
 * Product 9 in the catalog. Cascades the Premium Finance House pattern
 * (Budget Tracker → Debt Payoff → Sinking Funds → Net Worth → Small Business
 * → Family → Investment Portfolio → Zakat Calculator → Wedding).
 *
 * Per-product brand override per design brief §1: dusty rose + matte black
 * + ivory + sage / amber / burgundy status tier. Warm-gold base accent is
 * retained on the top-bar / footer / underlines (parent-brand continuity)
 * but per-product accents (DUSTY_ROSE / DEEP_MAUVE / SAGE / AMBER / BURGUNDY)
 * drive headline cells, status pills, and dashboard visuals.
 *
 * Pricing: $19 / $34 / $49 (lower-alternative rule applied 2026-05-11).
 *
 * Source of truth:
 *   - docs/product-proposals/wedding-budget-planner.md (22-tab feature list)
 *   - docs/product-designs/wedding-budget-planner.md   (palette + visuals)
 *   - docs/product-content/wedding-ai-prompts.md       (12-pg AI PDF source)
 *
 * Spine architecture (catalog-wide standing rule):
 *   - 📥 Input Tab    — `🧭 Setup Wizard` (date / guests / venue / budget /
 *                                          region / currency / income / religion)
 *   - 📊 Output Dashboard — `🏠 Budget Dashboard` (5 visuals per brief §2:
 *       (a) Spent-vs-remaining donut with days-to-wedding center
 *       (b) Stacked bar — spend by category vs target (14 categories)
 *       (c) Ranked bar — top 5 vendors by spend
 *       (d) Line — cumulative spend trajectory vs target curve
 *       (e) RSVP-progress meter (yes/no/pending) )
 *
 * Tier model (post-applyTierVisibility):
 *   - Essentials ($19) — 12 tabs visible (the spine + 10 core planners)
 *   - Pro ($34)        — 16 tabs visible (+ Cost Per Guest / Vendor Comparison /
 *                                         Bridal Party / Gift Registry)
 *   - AI Edition ($49) — 22 tabs visible (+ AI Co-Pilot hub + 5 dedicated AI tabs)
 *
 * Cultural variants: Master Timeline embeds optional Muslim-Walima / Hindu-
 * multi-day sections at AI tier (callout-style), driven by the religion
 * dropdown on Setup Wizard. Avoids stereotype motifs per brief §5.
 *
 * Run: node tools/sheets-gen/templates/wedding-budget-planner.js --tier=<essentials|pro|ai>
 */

import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';

import * as PFS from '../lib/premium-finance-studio.js';
const { COLORS, FONTS, FILLS, BORDER_THIN, argb,
        addTopBar, addSectionHeader, addCallout, addTableHeader, addFooter,
        setTabColor, setupColumns, registerLimeLogo, applyTierVisibility } = PFS;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = resolve(__dirname, '..', 'output');
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

const PRODUCT_NAME = 'Wedding Budget & Planner';

// ============================================================================
// PER-PRODUCT BRAND OVERRIDES (per design brief §1)
// ============================================================================

const DUSTY_ROSE     = 'FFC9A0A0';
const DUSTY_ROSE_LT  = 'FFEDD8D8';
const DEEP_MAUVE     = 'FF8B5A6B';
const DEEP_MAUVE_LT  = 'FFE2D2D9';
const SAGE           = 'FF8FA98F';
const SAGE_LT        = 'FFDDE6DD';
const AMBER_WED      = 'FFD4A574';
const AMBER_WED_LT   = 'FFF1E2CE';
const BURGUNDY       = 'FF8B3A3A';
const BURGUNDY_LT    = 'FFE6CECE';
const IVORY_WED      = 'FFFAF6F1';
const MATTE_BLACK    = 'FF1A1A1A';
const WARM_GRAY      = 'FFE8E2DA';

const FILL_DUSTY     = { type: 'pattern', pattern: 'solid', fgColor: argb(DUSTY_ROSE) };
const FILL_DUSTY_LT  = { type: 'pattern', pattern: 'solid', fgColor: argb(DUSTY_ROSE_LT) };
const FILL_MAUVE     = { type: 'pattern', pattern: 'solid', fgColor: argb(DEEP_MAUVE) };
const FILL_MAUVE_LT  = { type: 'pattern', pattern: 'solid', fgColor: argb(DEEP_MAUVE_LT) };
const FILL_SAGE      = { type: 'pattern', pattern: 'solid', fgColor: argb(SAGE) };
const FILL_SAGE_LT   = { type: 'pattern', pattern: 'solid', fgColor: argb(SAGE_LT) };
const FILL_AMBER_LT  = { type: 'pattern', pattern: 'solid', fgColor: argb(AMBER_WED_LT) };
const FILL_BURG_LT   = { type: 'pattern', pattern: 'solid', fgColor: argb(BURGUNDY_LT) };
const FILL_IVORY     = { type: 'pattern', pattern: 'solid', fgColor: argb(IVORY_WED) };

// ============================================================================
// TAB SETS — 22 tabs across 3 tiers
// ============================================================================

// Pro tabs — 4 sheets hidden for Essentials
const PRO_TABS = new Set([
  '👤 Cost Per Guest',
  '⚖️ Vendor Comparison',
  '💐 Bridal Party',
  '🎁 Gift Registry',
]);

// AI tabs — hidden for Pro + Essentials
const AI_TABS = new Set([
  '🤖 AI Wedding Co-Pilot',
  '✂️ Guest List Optimizer',
  '🔍 Vendor Cost Intelligence',
  '🧩 Seating Constraint Solver',
  '📩 RSVP Reminder Scripts',
  '🚨 Day-of Crisis Playbook',
]);

// Banner — rotates per tab from this 3-message library (design brief §2)
const BANNERS = {
  privacy: '✦  Privacy-first   Your guest list never touches our servers. No Plaid, no SaaS account, no cloud sync. Your wedding data stays in your Drive.',
  noSub:   '✦  No subscription   Wedding apps charge $20/mo × 18 months = $360. This is $19 once. Own it. Update it. Reuse it.',
  whyXls:  '✦  Why a spreadsheet, not an app?   Pay once, own forever, methodology-agnostic. Works for Muslim / Christian / Jewish / secular / interfaith.',
};
const BANNER = BANNERS.noSub;

// Seed persona — Amelia & Daniel, Austin TX, Oct 12 2026, 120 guests, $32K cap
const PERSONA = {
  partnerA: 'Amelia',
  partnerB: 'Daniel',
  weddingDate: new Date(2026, 9, 12),     // Oct 12, 2026
  guestCount: 120,
  venueType: 'Outdoor / barn',
  budgetCap: 32000,
  region: 'Austin, TX',
  currency: 'USD',
  householdIncome: 145000,
  religion: 'Interfaith / secular',
  planningMonths: 13,
};

// Setup Wizard — every downstream tab references these by absolute cell.
// Layout designed so the cell refs below are stable.
const SETUP = {
  WEDDING_DATE:   "'🧭 Setup Wizard'!E10",
  GUEST_COUNT:    "'🧭 Setup Wizard'!E12",
  VENUE_TYPE:     "'🧭 Setup Wizard'!E14",
  BUDGET_CAP:     "'🧭 Setup Wizard'!E16",
  REGION:         "'🧭 Setup Wizard'!E18",
  CURRENCY:       "'🧭 Setup Wizard'!E20",
  INCOME:         "'🧭 Setup Wizard'!E22",
  RELIGION:       "'🧭 Setup Wizard'!E24",
  PLANNING_MO:    "'🧭 Setup Wizard'!E26",
  PARTNER_A:      "'🧭 Setup Wizard'!E28",
  PARTNER_B:      "'🧭 Setup Wizard'!E30",
};

// Budget Categories — 14 pre-built per proposal (Tab #3)
const CATEGORIES = [
  { name: 'Venue + Rentals',       defaultPct: 0.32 },
  { name: 'Catering + Bar',        defaultPct: 0.22 },
  { name: 'Photography + Video',   defaultPct: 0.12 },
  { name: 'Attire + Beauty',       defaultPct: 0.07 },
  { name: 'Flowers + Decor',       defaultPct: 0.08 },
  { name: 'Music + Entertainment', defaultPct: 0.06 },
  { name: 'Rings',                 defaultPct: 0.03 },
  { name: 'Stationery + Print',    defaultPct: 0.02 },
  { name: 'Transport + Lodging',   defaultPct: 0.02 },
  { name: 'Hair + Makeup',         defaultPct: 0.02 },
  { name: 'Favors + Gifts',        defaultPct: 0.01 },
  { name: 'Officiant + Ceremony',  defaultPct: 0.01 },
  { name: 'Honeymoon',             defaultPct: 0.00 },
  { name: 'Contingency (5–10%)',   defaultPct: 0.02 },
];

// Vendor Tracker — invariants for downstream pulls
const VENDOR = {
  HEADER_ROW: 8,
  FIRST_ROW:  9,
  LAST_ROW:   28,        // 20 vendor rows
  TOTAL_ROW:  30,
};

// Guest List — invariants
const GUEST = {
  HEADER_ROW: 8,
  FIRST_ROW:  9,
  LAST_ROW:   58,        // 50 guest rows
  TOTAL_ROW:  60,
};

// Number format helpers
const FMT_USD   = '"$"#,##0';
const FMT_USD_C = '"$"#,##0.00';
const FMT_PCT   = '0.0%';
const FMT_INT   = '#,##0';
const FMT_DATE  = 'mmm d, yyyy';

export { PRODUCT_NAME, PRO_TABS, AI_TABS };  // for QA tooling

// ============================================================================
// SMALL HELPERS — wedding-specific (reused across tabs)
// ============================================================================

function setCell(sheet, addr, value, opts = {}) {
  const { font, fill, num, align, border = true, indent = 0 } = opts;
  const cell = sheet.getCell(addr);
  cell.value = value;
  if (font) cell.font = font;
  if (fill) cell.fill = fill;
  if (num)  cell.numFmt = num;
  if (align) cell.alignment = { ...align, indent: indent || align.indent };
  if (border) cell.border = BORDER_THIN();
  return cell;
}

function dustyRoseBand(sheet, row, text, colSpan) {
  const [c1, c2] = (colSpan || 'A:M').split(':');
  sheet.mergeCells(`${c1}${row}:${c2}${row}`);
  const cell = sheet.getCell(`${c1}${row}`);
  cell.value = text;
  cell.font = { name: 'Inter', size: 10, bold: true, italic: true, color: argb(COLORS.white) };
  cell.fill = FILL_DUSTY;
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(row).height = 20;
  return row + 1;
}

function bigTile(sheet, range, label, valueFormula, palette) {
  sheet.mergeCells(range);
  const cell = sheet.getCell(range.split(':')[0]);
  const fillMap = { dusty: FILL_DUSTY, mauve: FILL_MAUVE, sage: FILL_SAGE,
                    ivory: FILL_IVORY, dustyLt: FILL_DUSTY_LT, sageLt: FILL_SAGE_LT };
  const p = palette || 'dusty';
  const fill = fillMap[p];
  const fontColor = (p === 'dusty' || p === 'mauve' || p === 'sage') ? COLORS.white : COLORS.charcoal;
  cell.value = typeof valueFormula === 'string'
    ? { formula: `"${label}"&CHAR(10)&(${valueFormula})` }
    : valueFormula;
  cell.font = { name: 'Inter', size: 14, bold: true, color: argb(fontColor) };
  cell.fill = fill;
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  cell.border = BORDER_THIN(MATTE_BLACK);
}

function repBar(formula, maxChars, ch) {
  const m = maxChars || 40;
  const c = ch || '█';
  return `REPT("${c}",MIN(${m},MAX(0,ROUND((${formula})*${m},0))))`;
}

// ============================================================================
// END HELPERS — TAB BUILDERS BELOW
// ============================================================================
// ============================================================================
// TAB 1 — 🧭 SETUP WIZARD (Input spine — all tiers)
// ============================================================================

function buildSetupWizard(workbook) {
  const sheet = workbook.addWorksheet('🧭 Setup Wizard');
  setTabColor(sheet, DUSTY_ROSE);
  setupColumns(sheet, { A: 2, B: 26, C: 6, D: 6, E: 22, F: 4, G: 16, H: 16, I: 16, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🧭 Setup Wizard',
    tabSubtitle: 'One-time setup — these answers drive every downstream tab. Edit later if plans shift.',
    bannerText: BANNERS.privacy,
    kpiData: [
      { label: 'WEDDING DATE',  value: { formula: `TEXT(E10,"${FMT_DATE}")` } },
      { label: 'DAYS TO GO',    value: { formula: `MAX(0,E10-TODAY())&" days"` } },
      { label: 'GUEST COUNT',   value: { formula: `E12&" guests"` } },
      { label: 'BUDGET CAP',    value: { formula: `TEXT(E16,"${FMT_USD}")` } },
      { label: 'PER-GUEST AVG', value: { formula: `TEXT(IFERROR(E16/MAX(1,E12),0),"${FMT_USD}")` } },
      { label: 'REGION',        value: { formula: `E18` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'The basics — fill these in once',
    'Six required answers. Three optional. Everything else flows from here.', 'B:L');

  const fields = [
    { row: 10, label: 'Wedding date',           value: PERSONA.weddingDate, num: FMT_DATE, hint: 'The date you say "I do." Drives all timeline countdowns.' },
    { row: 12, label: 'Guest count (target)',   value: PERSONA.guestCount,                hint: 'Best estimate. Refine on the Guest List tab.' },
    { row: 14, label: 'Venue type',             value: PERSONA.venueType,                 hint: 'Outdoor / barn / hotel / restaurant / private estate / destination', validation: ['Outdoor / barn', 'Hotel / ballroom', 'Restaurant', 'Private estate / home', 'Destination', 'Place of worship + reception venue', 'Other'] },
    { row: 16, label: 'Total budget (cap)',     value: PERSONA.budgetCap, num: FMT_USD,   hint: 'The number you will not go over. US average ~$30K (The Knot, 2024).' },
    { row: 18, label: 'Region / city',          value: PERSONA.region,                    hint: 'Drives AI cost-intelligence comparisons. Format: "City, State".' },
    { row: 20, label: 'Base currency',          value: PERSONA.currency,                  hint: 'Three-letter code. USD / EUR / GBP / CAD / AUD / AED / EGP / INR ...', validation: ['USD','EUR','GBP','CAD','AUD','AED','SAR','EGP','INR','JPY','MXN','BRL'] },
    { row: 22, label: 'Household income (opt.)',value: PERSONA.householdIncome, num: FMT_USD, hint: 'Optional. Used only for AI saving-pace prompts. Never leaves the sheet.' },
    { row: 24, label: 'Religion / tradition',   value: PERSONA.religion,                  hint: 'Drives optional cultural-variant timeline sections (AI Edition).', validation: ['Christian','Catholic','Jewish','Muslim','Hindu','Sikh','Buddhist','Interfaith / secular','Civil / nondenominational','Other'] },
    { row: 26, label: 'Months from today',      value: { formula: `MAX(0,DATEDIF(TODAY(),E10,"m"))` }, hint: 'Auto-derived. Drives Master Timeline ribbon (12-mo / 6-mo / 3-mo / 1-mo).' },
    { row: 28, label: 'Partner A — name',       value: PERSONA.partnerA,                  hint: 'For speech / vow / negotiation script personalization.' },
    { row: 30, label: 'Partner B — name',       value: PERSONA.partnerB,                  hint: 'For speech / vow / negotiation script personalization.' },
  ];

  fields.forEach(f => {
    sheet.getCell(`B${f.row}`).value = f.label;
    sheet.getCell(`B${f.row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${f.row}`).alignment = { horizontal: 'right', indent: 1, vertical: 'middle' };

    const cell = sheet.getCell(`E${f.row}`);
    cell.value = f.value;
    cell.font = { name: 'Inter', size: 13, bold: true, color: argb(DEEP_MAUVE) };
    cell.fill = FILL_DUSTY_LT;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = BORDER_THIN(DEEP_MAUVE);
    if (f.num) cell.numFmt = f.num;
    if (f.validation) {
      cell.dataValidation = { type: 'list', formulae: [`"${f.validation.join(',')}"`], allowBlank: false };
    }

    sheet.mergeCells(`G${f.row}:L${f.row}`);
    const hint = sheet.getCell(`G${f.row}`);
    hint.value = f.hint;
    hint.font = { ...FONTS.bodyMuted, size: 10 };
    hint.alignment = { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true };

    sheet.getRow(f.row).height = 26;
  });

  [11,13,15,17,19,21,23,25,27,29].forEach(rr => sheet.getRow(rr).height = 6);

  r = addSectionHeader(sheet, 33, 'Why a spreadsheet, not an app?',
    'Three reasons couples switch back to spreadsheets after burning out on subscriptions.', 'B:L');

  const reasons = [
    ['🔒 Privacy-first',       'Guest list, vendor contracts, household income — none of it touches a server. Lives in your Google Drive.'],
    ['💸 No subscription',     'Wedding-planning SaaS averages $20/mo. Over 13 months of planning (US average), that is $260+. This is $19. Once.'],
    ['🤝 Methodology-agnostic', 'Works for Muslim mahr, Hindu multi-day, Jewish ketubah, secular elopement. The AI prompts adapt to your tradition — we do not assume one.'],
  ];
  reasons.forEach((row, i) => {
    const ri = r + 1 + i;
    sheet.getCell(`B${ri}`).value = row[0];
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
    sheet.mergeCells(`C${ri}:L${ri}`);
    sheet.getCell(`C${ri}`).value = row[1];
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true };
    sheet.getRow(ri).height = 28;
  });

  r = addSectionHeader(sheet, r + 6, 'Quick FAQ', 'Three questions buyers ask first.', 'B:L');

  const faq = [
    ['Does this work in Excel + Google Sheets?',
     'Yes — both. Excel keeps the file on your Mac/PC. Google Sheets adds real-time co-edit (the killer feature for couples + parents + planner working together on the same file). We recommend Google Sheets for the collaborative use case.'],
    ['Will the AI prompts work in ChatGPT free tier?',
     'All 8 AI prompts (AI Edition) work in ChatGPT free tier OR Claude free tier — your choice. No API key, no plug-in, no monthly fee. You paste a prompt + your data into your AI tool of choice. The spreadsheet contains the prompt template + a worked example so you know what good output looks like.'],
    ['What does this NOT do?',
     'Does not print invitations — pair with a designer / Etsy stationer / Canva. Does not auto-collect RSVPs — you fill them in (Why: prevents SaaS lock-in; works across religions and platforms). Does not book vendors for you — you negotiate (Why: nobody knows your trade-offs better than you).'],
  ];
  faq.forEach((qa, i) => {
    const ri = r + 1 + i * 2;
    sheet.getCell(`B${ri}`).value = qa[0];
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { vertical: 'top', horizontal: 'left', indent: 1, wrapText: true };
    sheet.mergeCells(`C${ri}:L${ri}`);
    sheet.getCell(`C${ri}`).value = qa[1];
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { vertical: 'top', horizontal: 'left', indent: 1, wrapText: true };
    sheet.getRow(ri).height = 50;
    sheet.getRow(ri + 1).height = 6;
  });

  addFooter(sheet, r + faq.length * 2 + 3, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 2 — 🏠 BUDGET DASHBOARD (Output spine — all tiers)
// ============================================================================

function buildBudgetDashboard(workbook) {
  const sheet = workbook.addWorksheet('🏠 Budget Dashboard');
  setTabColor(sheet, DEEP_MAUVE);
  setupColumns(sheet, { A: 2, B: 20, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏠 Budget Dashboard',
    tabSubtitle: 'Recomputes the moment you edit Setup Wizard, Budget Categories, or Vendor Tracker.',
    bannerText: BANNERS.whyXls,
    kpiData: [
      { label: 'BUDGET CAP',  value: { formula: `TEXT(${SETUP.BUDGET_CAP},"${FMT_USD}")` } },
      { label: 'SPENT',       value: { formula: `TEXT(SUM('💰 Budget Categories'!E10:E23),"${FMT_USD}")` } },
      { label: '% USED',      value: { formula: `TEXT(IFERROR(SUM('💰 Budget Categories'!E10:E23)/${SETUP.BUDGET_CAP},0),"0.0%")` } },
      { label: 'DAYS TO GO',  value: { formula: `MAX(0,${SETUP.WEDDING_DATE}-TODAY())&" days"` } },
      { label: 'GUESTS RSVPd', value: { formula: `COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Yes")&" / "&${SETUP.GUEST_COUNT}` } },
      { label: 'TOP VENDOR',  value: { formula: `IFERROR(INDEX('🤝 Vendor Tracker'!B${VENDOR.FIRST_ROW}:B${VENDOR.LAST_ROW},MATCH(MAX('🤝 Vendor Tracker'!F${VENDOR.FIRST_ROW}:F${VENDOR.LAST_ROW}),'🤝 Vendor Tracker'!F${VENDOR.FIRST_ROW}:F${VENDOR.LAST_ROW},0)),"—")` } },
    ],
  });

  // === VISUAL #1 — Spent-vs-remaining donut with days-to-wedding center ===
  let r = addSectionHeader(sheet, 6, 'Spent vs. remaining', 'The headline number. Center = days to wedding.', 'B:L');

  bigTile(sheet, `B${r + 1}:E${r + 4}`,
    'BUDGET HEALTH',
    `IF(SUM('💰 Budget Categories'!E10:E23)>${SETUP.BUDGET_CAP},"⚠ OVER BUDGET",IF(SUM('💰 Budget Categories'!E10:E23)/MAX(1,${SETUP.BUDGET_CAP})>0.9,"◐ NEAR CAP","✓ ON TRACK"))`,
    'sage');

  // Center: days to wedding
  sheet.mergeCells(`F${r + 1}:H${r + 4}`);
  const days = sheet.getCell(`F${r + 1}`);
  days.value = { formula: `MAX(0,${SETUP.WEDDING_DATE}-TODAY())&CHAR(10)&"days to wedding"` };
  days.font = { name: 'Inter', size: 32, bold: true, color: argb(DEEP_MAUVE) };
  days.fill = FILL_IVORY;
  days.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  days.border = BORDER_THIN(DEEP_MAUVE);

  bigTile(sheet, `I${r + 1}:L${r + 2}`,
    'SPENT',
    `TEXT(SUM('💰 Budget Categories'!E10:E23),"${FMT_USD}")`, 'mauve');

  bigTile(sheet, `I${r + 3}:L${r + 4}`,
    'REMAINING',
    `TEXT(MAX(0,${SETUP.BUDGET_CAP}-SUM('💰 Budget Categories'!E10:E23)),"${FMT_USD}")`, 'dustyLt');

  for (let i = 0; i <= 4; i++) sheet.getRow(r + i).height = 28;

  // CF: BUDGET HEALTH cell — green / amber / burgundy based on text
  sheet.addConditionalFormatting({
    ref: `B${r + 1}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'OVER',     priority: 1, style: { font: { color: argb(BURGUNDY), bold: true }, fill: FILL_BURG_LT } },
      { type: 'containsText', operator: 'containsText', text: 'NEAR CAP', priority: 2, style: { font: { color: argb(AMBER_WED), bold: true }, fill: FILL_AMBER_LT } },
    ],
  });

  // === VISUAL #2 — Stacked bar: spend by category vs target ===
  r = addSectionHeader(sheet, r + 7, 'Spend by category vs. target',
    'The 14 pre-built categories. Bars show actual spend as a fraction of target. Conditional fill: sage = under, amber = at/near, burgundy = over.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Category', 'Target', 'Spent', 'Progress', '% of Target', 'Status'],
    ['B', 'C', 'D', 'E', 'F', 'G']);

  for (let i = 0; i < CATEGORIES.length; i++) {
    const ri = r + 2 + i;
    const catRow = 10 + i;  // Budget Categories tab — rows 10..23

    setCell(sheet, `B${ri}`, { formula: `'💰 Budget Categories'!B${catRow}` },
      { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });

    setCell(sheet, `C${ri}`, { formula: `'💰 Budget Categories'!D${catRow}` },
      { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right', vertical: 'middle' } });

    setCell(sheet, `D${ri}`, { formula: `'💰 Budget Categories'!E${catRow}` },
      { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, num: FMT_USD, align: { horizontal: 'right', vertical: 'middle' } });

    // Progress bar via REPT
    setCell(sheet, `E${ri}`,
      { formula: `${repBar(`'💰 Budget Categories'!E${catRow}/MAX(1,'💰 Budget Categories'!D${catRow})`, 24)}` },
      { font: { name: 'Inter', size: 11, color: argb(SAGE) }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });

    setCell(sheet, `F${ri}`,
      { formula: `IFERROR('💰 Budget Categories'!E${catRow}/MAX(1,'💰 Budget Categories'!D${catRow}),0)` },
      { font: FONTS.body, num: FMT_PCT, align: { horizontal: 'right', vertical: 'middle' } });

    setCell(sheet, `G${ri}`,
      { formula: `IF('💰 Budget Categories'!E${catRow}>'💰 Budget Categories'!D${catRow},"⚠ Over",IF('💰 Budget Categories'!E${catRow}/MAX(1,'💰 Budget Categories'!D${catRow})>0.9,"◐ Near","✓ Under"))` },
      { font: { ...FONTS.bodyBold }, align: { horizontal: 'center', vertical: 'middle' } });
  }

  // CF for status column G
  const gStart = r + 2;
  const gEnd = r + 1 + CATEGORIES.length;
  sheet.addConditionalFormatting({
    ref: `G${gStart}:G${gEnd}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Over',  priority: 1, style: { font: { color: argb(BURGUNDY), bold: true }, fill: FILL_BURG_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Near',  priority: 2, style: { font: { color: argb(AMBER_WED), bold: true }, fill: FILL_AMBER_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Under', priority: 3, style: { font: { color: argb(SAGE),     bold: true }, fill: FILL_SAGE_LT } },
    ],
  });

  r = r + 2 + CATEGORIES.length;

  // === VISUAL #3 — Top 5 vendors by spend (ranked bar) ===
  r = addSectionHeader(sheet, r + 2, 'Top 5 vendors by spend',
    'Helps you see where the dollars are concentrated. From the Vendor Tracker tab.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Rank', 'Vendor', 'Category', 'Total Spend', 'Share of Budget'],
    ['B', 'C', 'D', 'E', 'F']);

  for (let i = 0; i < 5; i++) {
    const ri = r + 2 + i;
    setCell(sheet, `B${ri}`, `#${i + 1}`,
      { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, align: { horizontal: 'center', vertical: 'middle' } });

    // Vendor name pulled by LARGE() rank over Vendor Tracker total column
    setCell(sheet, `C${ri}`,
      { formula: `IFERROR(INDEX('🤝 Vendor Tracker'!B${VENDOR.FIRST_ROW}:B${VENDOR.LAST_ROW},MATCH(LARGE('🤝 Vendor Tracker'!F${VENDOR.FIRST_ROW}:F${VENDOR.LAST_ROW},${i + 1}),'🤝 Vendor Tracker'!F${VENDOR.FIRST_ROW}:F${VENDOR.LAST_ROW},0)),"—")` },
      { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });

    setCell(sheet, `D${ri}`,
      { formula: `IFERROR(INDEX('🤝 Vendor Tracker'!C${VENDOR.FIRST_ROW}:C${VENDOR.LAST_ROW},MATCH(LARGE('🤝 Vendor Tracker'!F${VENDOR.FIRST_ROW}:F${VENDOR.LAST_ROW},${i + 1}),'🤝 Vendor Tracker'!F${VENDOR.FIRST_ROW}:F${VENDOR.LAST_ROW},0)),"—")` },
      { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });

    setCell(sheet, `E${ri}`,
      { formula: `IFERROR(LARGE('🤝 Vendor Tracker'!F${VENDOR.FIRST_ROW}:F${VENDOR.LAST_ROW},${i + 1}),0)` },
      { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, num: FMT_USD, align: { horizontal: 'right', vertical: 'middle' } });

    setCell(sheet, `F${ri}`,
      { formula: `IFERROR(LARGE('🤝 Vendor Tracker'!F${VENDOR.FIRST_ROW}:F${VENDOR.LAST_ROW},${i + 1})/MAX(1,${SETUP.BUDGET_CAP}),0)` },
      { font: FONTS.body, num: FMT_PCT, align: { horizontal: 'right', vertical: 'middle' } });
  }

  r = r + 7;

  // === VISUAL #4 — RSVP-progress meter ===
  r = addSectionHeader(sheet, r + 1, 'RSVP progress', 'Yes / no / pending across the entire Guest List.', 'B:L');

  const rsvpCats = [
    { label: 'Yes',     formula: `COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Yes")`,     palette: 'sage' },
    { label: 'Maybe',   formula: `COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Maybe")`,   palette: 'ivory' },
    { label: 'No',      formula: `COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"No")`,      palette: 'dustyLt' },
    { label: 'Pending', formula: `COUNTBLANK('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW})`,         palette: 'mauve' },
  ];
  rsvpCats.forEach((rc, i) => {
    const col = ['B','D','F','H'][i];
    const next = ['C','E','G','I'][i];
    bigTile(sheet, `${col}${r + 1}:${next}${r + 3}`, rc.label.toUpperCase(),
      `${rc.formula}&" guests"`, rc.palette);
  });

  bigTile(sheet, `J${r + 1}:L${r + 3}`, 'RESPONSE RATE',
    `TEXT((COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Yes")+COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"No")+COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Maybe"))/MAX(1,${SETUP.GUEST_COUNT}),"0%")`,
    'dusty');

  for (let i = 1; i <= 3; i++) sheet.getRow(r + i).height = 24;

  r = r + 5;

  // === VISUAL #5 — Cumulative trajectory text ===
  r = addSectionHeader(sheet, r + 1, 'Trajectory — current pace',
    'Are you spending evenly toward your wedding date, or front-loading?', 'B:L');

  setCell(sheet, `B${r + 1}`, 'Expected by today (linear pace)',
    { font: FONTS.bodyBold, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
  setCell(sheet, `E${r + 1}`,
    { formula: `${SETUP.BUDGET_CAP}*(1-MAX(0,${SETUP.WEDDING_DATE}-TODAY())/MAX(1,${SETUP.WEDDING_DATE}-(${SETUP.WEDDING_DATE}-DATEDIF(TODAY(),${SETUP.WEDDING_DATE},"d")*1)))` },
    { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right' } });

  setCell(sheet, `B${r + 2}`, 'Actual spent today',
    { font: FONTS.bodyBold, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
  setCell(sheet, `E${r + 2}`, { formula: `SUM('💰 Budget Categories'!E10:E23)` },
    { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, num: FMT_USD, align: { horizontal: 'right' } });

  setCell(sheet, `B${r + 3}`, 'Pace status',
    { font: FONTS.bodyBold, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
  setCell(sheet, `E${r + 3}`,
    { formula: `IF(SUM('💰 Budget Categories'!E10:E23)>${SETUP.BUDGET_CAP}*0.95,"⚠ Front-loaded — slow",IF(SUM('💰 Budget Categories'!E10:E23)<${SETUP.BUDGET_CAP}*0.3,"◐ Light pace — OK","✓ Even pace"))` },
    { font: { ...FONTS.bodyBold, color: argb(SAGE) }, align: { horizontal: 'center' } });

  addCallout(sheet, `B${r + 5}:L${r + 6}`,
    '💸',
    'No subscription. No upsells.',
    'Wedding-planning SaaS averages $20/mo. Over the 13-month US-average engagement (The Knot 2024), that is $260+. This spreadsheet is $19. Once. Yours to keep, share, reuse for the next wedding in the family.');
  sheet.getRow(r + 5).height = 30; sheet.getRow(r + 6).height = 30;

  addFooter(sheet, r + 9, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 3 — 💰 BUDGET CATEGORIES (all tiers)
// ============================================================================

function buildBudgetCategories(workbook) {
  const sheet = workbook.addWorksheet('💰 Budget Categories');
  setTabColor(sheet, DUSTY_ROSE);
  setupColumns(sheet, { A: 2, B: 28, C: 10, D: 14, E: 14, F: 14, G: 14, H: 16, I: 16, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💰 Budget Categories',
    tabSubtitle: 'Pre-built with US-average percentage allocations. Tweak any cell — totals update live.',
    bannerText: BANNERS.noSub,
    kpiData: [
      { label: 'BUDGET CAP', value: { formula: `TEXT(${SETUP.BUDGET_CAP},"${FMT_USD}")` } },
      { label: 'ALLOCATED', value: { formula: `TEXT(SUM(D10:D23),"${FMT_USD}")` } },
      { label: 'SPENT',     value: { formula: `TEXT(SUM(E10:E23),"${FMT_USD}")` } },
      { label: 'OVER/UNDER',value: { formula: `TEXT(SUM(E10:E23)-SUM(D10:D23),"${FMT_USD};\\-${FMT_USD}")` } },
      { label: 'CATS USED', value: { formula: `COUNTIF(E10:E23,">0")` } },
      { label: '% OF CAP',  value: { formula: `TEXT(IFERROR(SUM(E10:E23)/${SETUP.BUDGET_CAP},0),"0%")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Category-by-category breakdown',
    '14 categories sized to a US-average wedding. Edit the % column to reweight, or override Target $ directly.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Category', 'Default %', 'Your %', 'Target $', 'Spent $', 'Remaining', '% Spent', 'Notes', 'Status'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

  // Seed sample spend per category (Amelia & Daniel) — varied to show all 3 status colors
  const seedSpend = [
    9800,   // Venue + Rentals (target ~$10,240 — 32%)
    5200,   // Catering + Bar  (target ~$7,040 — 22%) — under
    4100,   // Photo + Video   (target ~$3,840 — 12%) — over
    1200,   // Attire          (target ~$2,240 — 7%)
    2700,   // Flowers + Decor (target ~$2,560 — 8%) — near
    1850,   // Music + Entmt   (target ~$1,920 — 6%)
    1100,   // Rings           (target ~$960 — 3%)
    380,    // Stationery
    420,    // Transport
    520,    // Hair + Makeup
    180,    // Favors
    300,    // Officiant
    0,      // Honeymoon
    0,      // Contingency
  ];

  CATEGORIES.forEach((cat, i) => {
    const ri = 10 + i;

    setCell(sheet, `B${ri}`, cat.name,
      { font: FONTS.bodyBold, fill: FILL_IVORY, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });

    setCell(sheet, `C${ri}`, cat.defaultPct,
      { font: { ...FONTS.body, color: argb(COLORS.textMuted) }, num: FMT_PCT, align: { horizontal: 'right' } });

    // Your % — defaults to default
    setCell(sheet, `D${ri}`, cat.defaultPct,
      { font: FONTS.body, num: FMT_PCT, align: { horizontal: 'right' } });
    // (we treat column D as %, then derive Target $ implicitly — but design is cleaner if D is the dollar target)
    // Override pattern: put Target $ formula at D directly
    setCell(sheet, `D${ri}`, { formula: `C${ri}*${SETUP.BUDGET_CAP}` },
      { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right' } });

    setCell(sheet, `E${ri}`, seedSpend[i] || 0,
      { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, num: FMT_USD, align: { horizontal: 'right' } });

    setCell(sheet, `F${ri}`, { formula: `D${ri}-E${ri}` },
      { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right' } });

    setCell(sheet, `G${ri}`, { formula: `IFERROR(E${ri}/MAX(1,D${ri}),0)` },
      { font: FONTS.body, num: FMT_PCT, align: { horizontal: 'right' } });

    setCell(sheet, `H${ri}`, '',
      { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, wrapText: true } });
    setCell(sheet, `I${ri}`, '',
      { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, wrapText: true } });

    setCell(sheet, `J${ri}`,
      { formula: `IF(E${ri}>D${ri},"⚠ Over",IF(E${ri}/MAX(1,D${ri})>0.9,"◐ Near","✓ Under"))` },
      { font: FONTS.bodyBold, align: { horizontal: 'center' } });
  });

  // Totals row 25
  setCell(sheet, `B25`, 'TOTAL',
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, align: { horizontal: 'left', indent: 1 } });
  setCell(sheet, `C25`, { formula: `SUM(C10:C23)` },
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, num: FMT_PCT, align: { horizontal: 'right' } });
  setCell(sheet, `D25`, { formula: `SUM(D10:D23)` },
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, num: FMT_USD, align: { horizontal: 'right' } });
  setCell(sheet, `E25`, { formula: `SUM(E10:E23)` },
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, num: FMT_USD, align: { horizontal: 'right' } });
  setCell(sheet, `F25`, { formula: `SUM(F10:F23)` },
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, num: FMT_USD, align: { horizontal: 'right' } });

  // CF for status column J
  sheet.addConditionalFormatting({
    ref: `J10:J23`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Over',  priority: 1, style: { font: { color: argb(BURGUNDY), bold: true }, fill: FILL_BURG_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Near',  priority: 2, style: { font: { color: argb(AMBER_WED), bold: true }, fill: FILL_AMBER_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Under', priority: 3, style: { font: { color: argb(SAGE),     bold: true }, fill: FILL_SAGE_LT } },
    ],
  });

  addCallout(sheet, `B28:L29`,
    '💡',
    'How the % column works',
    'Column C is the default % for a US-average wedding. Column D auto-computes target $ as C × budget cap. To override, type a dollar amount directly into D — it will replace the formula. Restore the formula by entering "=C10*' + PERSONA.budgetCap + '" again.');
  sheet.getRow(28).height = 30; sheet.getRow(29).height = 30;

  addFooter(sheet, 32, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 4 — 🤝 VENDOR TRACKER (all tiers)
// ============================================================================

function buildVendorTracker(workbook) {
  const sheet = workbook.addWorksheet('🤝 Vendor Tracker');
  setTabColor(sheet, DEEP_MAUVE);
  setupColumns(sheet, { A: 2, B: 22, C: 16, D: 18, E: 14, F: 14, G: 14, H: 14, I: 14, J: 22, K: 16, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🤝 Vendor Tracker',
    tabSubtitle: 'Every vendor with deposit, balance, due date, contract link, and status. The single source of truth for who owes whom what.',
    bannerText: BANNERS.privacy,
    kpiData: [
      { label: 'VENDORS',     value: { formula: `COUNTA(B${VENDOR.FIRST_ROW}:B${VENDOR.LAST_ROW})` } },
      { label: 'DEPOSITS PAID', value: { formula: `TEXT(SUM(E${VENDOR.FIRST_ROW}:E${VENDOR.LAST_ROW}),"${FMT_USD}")` } },
      { label: 'BALANCE DUE', value: { formula: `TEXT(SUM(F${VENDOR.FIRST_ROW}:F${VENDOR.LAST_ROW})-SUM(E${VENDOR.FIRST_ROW}:E${VENDOR.LAST_ROW}),"${FMT_USD}")` } },
      { label: 'TOTAL COMMIT', value: { formula: `TEXT(SUM(F${VENDOR.FIRST_ROW}:F${VENDOR.LAST_ROW}),"${FMT_USD}")` } },
      { label: 'OVERDUE',     value: { formula: `COUNTIFS(G${VENDOR.FIRST_ROW}:G${VENDOR.LAST_ROW},"<"&TODAY(),F${VENDOR.FIRST_ROW}:F${VENDOR.LAST_ROW},">"&0)&" vendors"` } },
      { label: 'SIGNED',      value: { formula: `COUNTIF(I${VENDOR.FIRST_ROW}:I${VENDOR.LAST_ROW},"Signed")&" / "&COUNTA(B${VENDOR.FIRST_ROW}:B${VENDOR.LAST_ROW})` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Vendor master list',
    'Status options: Inquiring / Quoted / Signed / Paid in Full / Cancelled. Contract Link = paste the URL to your signed PDF or Google Drive folder.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Vendor', 'Category', 'Contact', 'Deposit Paid', 'Total Cost', 'Next Due', 'Due Date', 'Status', 'Contract Link', 'Notes', 'Days Left'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  // Sample vendor seed — 8 vendors (Amelia & Daniel persona)
  const sampleVendors = [
    ['The Barn at Pecan Springs',     'Venue + Rentals',       'Maya Lopez',         3000, 9800,  3500, new Date(2026, 7, 15),  'Signed',     '', 'Includes tables/chairs/parking'],
    ['Hill Country Catering Co.',     'Catering + Bar',        'Diego Reyes',        1500, 5200,  3700, new Date(2026, 8, 28),  'Signed',     '', 'Bar service add-on +$800'],
    ['Emma Carter Photography',       'Photography + Video',   'Emma Carter',        1200, 4200,  3000, new Date(2026, 9, 5),   'Signed',     '', '2 shooters, 8hr, 600 photos'],
    ['Lone Star Lens (video)',        'Photography + Video',    'Sam Park',           0,    1600,  1600, new Date(2026, 9, 5),   'Quoted',     '', 'Optional add-on — decide by July'],
    ['Wildflower Studio (florals)',   'Flowers + Decor',        'Rosa Vela',          800,  2700,  1900, new Date(2026, 9, 1),   'Signed',     '', 'Seasonal arrangements'],
    ['DJ Marco — Sound + Light',      'Music + Entertainment',  'Marco Diaz',         600,  1850,  1250, new Date(2026, 9, 1),   'Signed',     '', 'Ceremony + reception + uplights'],
    ['Petals + Pearls Hair/Makeup',   'Hair + Makeup',          'Lina Tanaka',        100,  520,   420,  new Date(2026, 9, 10),  'Signed',     '', '4 services'],
    ['Sweet Tier Cakes',              'Catering + Bar',         'Pat O\'Connell',     200,  650,   450,  new Date(2026, 9, 1),   'Quoted',     '', '3-tier, gluten-free option'],
  ];
  sampleVendors.forEach((v, i) => {
    const ri = VENDOR.FIRST_ROW + i;
    setCell(sheet, `B${ri}`, v[0],
      { font: FONTS.bodyBold, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, v[1],
      { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `D${ri}`, v[2],
      { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `E${ri}`, v[3],
      { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right', vertical: 'middle' } });
    setCell(sheet, `F${ri}`, v[4],
      { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, num: FMT_USD, align: { horizontal: 'right', vertical: 'middle' } });
    setCell(sheet, `G${ri}`, v[5],
      { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right', vertical: 'middle' } });
    setCell(sheet, `H${ri}`, v[6],
      { font: FONTS.body, num: FMT_DATE, align: { horizontal: 'center', vertical: 'middle' } });
    setCell(sheet, `I${ri}`, v[7],
      { font: { ...FONTS.bodyBold }, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`I${ri}`).dataValidation = {
      type: 'list',
      formulae: ['"Inquiring,Quoted,Signed,Paid in Full,Cancelled"'],
      allowBlank: true,
    };
    setCell(sheet, `J${ri}`, v[8],
      { font: { ...FONTS.body, color: argb(DEEP_MAUVE) }, align: { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true } });
    setCell(sheet, `K${ri}`, v[9],
      { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true } });
    setCell(sheet, `L${ri}`,
      { formula: `IF(H${ri}="","—",H${ri}-TODAY()&" d")` },
      { font: FONTS.body, align: { horizontal: 'center', vertical: 'middle' } });
  });

  // Empty rows 17-28 — keep table structure
  for (let i = sampleVendors.length; i < (VENDOR.LAST_ROW - VENDOR.FIRST_ROW + 1); i++) {
    const ri = VENDOR.FIRST_ROW + i;
    ['B','C','D','J','K'].forEach(col => setCell(sheet, `${col}${ri}`, '',
      { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } }));
    setCell(sheet, `E${ri}`, '', { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right' } });
    setCell(sheet, `F${ri}`, '', { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right' } });
    setCell(sheet, `G${ri}`, '', { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right' } });
    setCell(sheet, `H${ri}`, '', { font: FONTS.body, num: FMT_DATE, align: { horizontal: 'center' } });
    setCell(sheet, `I${ri}`, '', { font: FONTS.body, align: { horizontal: 'center' } });
    sheet.getCell(`I${ri}`).dataValidation = {
      type: 'list',
      formulae: ['"Inquiring,Quoted,Signed,Paid in Full,Cancelled"'],
      allowBlank: true,
    };
    setCell(sheet, `L${ri}`, '', { font: FONTS.body, align: { horizontal: 'center' } });
  }

  // Total row 30
  setCell(sheet, `B${VENDOR.TOTAL_ROW}`, 'TOTAL',
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, align: { horizontal: 'left', indent: 1 } });
  ['E','F','G'].forEach(col => {
    setCell(sheet, `${col}${VENDOR.TOTAL_ROW}`, { formula: `SUM(${col}${VENDOR.FIRST_ROW}:${col}${VENDOR.LAST_ROW})` },
      { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, num: FMT_USD, align: { horizontal: 'right' } });
  });

  // CF on Status column I
  sheet.addConditionalFormatting({
    ref: `I${VENDOR.FIRST_ROW}:I${VENDOR.LAST_ROW}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Cancelled',    priority: 1, style: { font: { color: argb(BURGUNDY), bold: true }, fill: FILL_BURG_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Paid in Full', priority: 2, style: { font: { color: argb(SAGE),     bold: true }, fill: FILL_SAGE_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Signed',       priority: 3, style: { font: { color: argb(DEEP_MAUVE), bold: true }, fill: FILL_MAUVE_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Quoted',       priority: 4, style: { font: { color: argb(AMBER_WED), bold: true }, fill: FILL_AMBER_LT } },
    ],
  });

  // CF on Due Date column H — burgundy if past, amber if next 14 days
  sheet.addConditionalFormatting({
    ref: `H${VENDOR.FIRST_ROW}:H${VENDOR.LAST_ROW}`,
    rules: [
      { type: 'cellIs', operator: 'lessThan', formulae: ['TODAY()'], priority: 1,
        style: { font: { color: argb(BURGUNDY), bold: true }, fill: FILL_BURG_LT } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['TODAY()+14'], priority: 2,
        style: { font: { color: argb(AMBER_WED), bold: true }, fill: FILL_AMBER_LT } },
    ],
  });

  addFooter(sheet, VENDOR.TOTAL_ROW + 3, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 5 — 👥 GUEST LIST (all tiers)
// ============================================================================

function buildGuestList(workbook) {
  const sheet = workbook.addWorksheet('👥 Guest List');
  setTabColor(sheet, SAGE);
  setupColumns(sheet, { A: 2, B: 22, C: 8, D: 16, E: 14, F: 8, G: 10, H: 8, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '👥 Guest List',
    tabSubtitle: 'Side / relationship / RSVP / +1 / dietary / kids. Drives the RSVP Tracker, Seating Chart, and Cost-Per-Guest tab.',
    bannerText: BANNERS.privacy,
    kpiData: [
      { label: 'INVITED',   value: { formula: `COUNTA(B${GUEST.FIRST_ROW}:B${GUEST.LAST_ROW})` } },
      { label: 'RSVPd YES', value: { formula: `COUNTIF(G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Yes")` } },
      { label: 'PLUS-ONES', value: { formula: `COUNTIF(H${GUEST.FIRST_ROW}:H${GUEST.LAST_ROW},"Yes")` } },
      { label: 'KIDS',      value: { formula: `COUNTIF(I${GUEST.FIRST_ROW}:I${GUEST.LAST_ROW},"Yes")` } },
      { label: 'HIS SIDE',  value: { formula: `COUNTIF(C${GUEST.FIRST_ROW}:C${GUEST.LAST_ROW},"His")` } },
      { label: 'HERS SIDE', value: { formula: `COUNTIF(C${GUEST.FIRST_ROW}:C${GUEST.LAST_ROW},"Hers")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Guest master list',
    'RSVP options: Yes / No / Maybe / (blank = pending). "Must" column marks guests who cannot be cut from the list — flows into the AI Guest List Optimizer.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Name', 'Side', 'Relationship', 'Group / Table', '#', 'RSVP', '+1', 'Kids', 'Dietary', 'Address (optional)', 'Must', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']);

  // Sample 14 guests
  const sampleGuests = [
    ['Sarah Chen',      'Hers',  'College roommate',     'College Friends', 1, 'Yes',   'Yes', 'No',  'Vegetarian',          '',           'Y'],
    ['Mike Davis',      'His',   'High school friend',   'High School',     1, 'No',    'No',  'No',  '',                    '',           ''],
    ['Aunt Linda',      'His',   'Aunt',                 'His Family',      1, 'Yes',   'No',  'No',  '',                    '',           'Y'],
    ['Tom & Kate',      'Joint', 'Former colleagues',    'Work',            2, 'Maybe', 'Yes', 'No',  '',                    '',           ''],
    ['Grandma Pat',     'Hers',  'Grandmother',          'Hers Family',     1, 'Yes',   'No',  'No',  'Soft food, low-salt', '',           'Y'],
    ['Cousin Daniel',   'His',   'Cousin (kid)',         'Kids Table',      1, 'Yes',   'No',  'Yes', '',                    '',           ''],
    ['Cousin Mia',      'His',   'Cousin (kid)',         'Kids Table',      1, 'Yes',   'No',  'Yes', '',                    '',           ''],
    ['Uncle Bill',      'His',   'Uncle',                'His Family',      1, 'Yes',   'Yes', 'No',  '',                    '',           ''],
    ['Aunt Rose',       'Hers',  'Aunt',                 'Hers Family',     1, 'Yes',   'Yes', 'No',  'Gluten-free',         '',           ''],
    ['Jess Park',       'Hers',  'Gym friend',           'Friends',         1, '',      'Yes', 'No',  '',                    '',           ''],
    ['Marcus Holloway', 'His',   'Best man',             'Wedding Party',   1, 'Yes',   'Yes', 'No',  '',                    '',           'Y'],
    ['Priya Sharma',    'Hers',  'Maid of honor',        'Wedding Party',   1, 'Yes',   'Yes', 'No',  '',                    '',           'Y'],
    ['Dad — Robert',    'Hers',  'Father of bride',      'Head Table',      1, 'Yes',   'Yes', 'No',  '',                    '',           'Y'],
    ['Mom — Carol',     'Hers',  'Mother of bride',      'Head Table',      1, 'Yes',   'No',  'No',  '',                    '',           'Y'],
  ];
  sampleGuests.forEach((g, i) => {
    const ri = GUEST.FIRST_ROW + i;
    setCell(sheet, `B${ri}`, g[0], { font: FONTS.bodyBold, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, g[1], { font: FONTS.body, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: ['"His,Hers,Joint"'], allowBlank: true };
    setCell(sheet, `D${ri}`, g[2], { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `E${ri}`, g[3], { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `F${ri}`, g[4], { font: FONTS.body, num: FMT_INT, align: { horizontal: 'right', vertical: 'middle' } });
    setCell(sheet, `G${ri}`, g[5], { font: FONTS.bodyBold, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`G${ri}`).dataValidation = { type: 'list', formulae: ['"Yes,No,Maybe"'], allowBlank: true };
    setCell(sheet, `H${ri}`, g[6], { font: FONTS.body, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`H${ri}`).dataValidation = { type: 'list', formulae: ['"Yes,No"'], allowBlank: true };
    setCell(sheet, `I${ri}`, g[7], { font: FONTS.body, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`I${ri}`).dataValidation = { type: 'list', formulae: ['"Yes,No"'], allowBlank: true };
    setCell(sheet, `J${ri}`, g[8], { font: { ...FONTS.body, color: argb(DEEP_MAUVE) }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `K${ri}`, g[9], { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `L${ri}`, g[10], { font: FONTS.bodyBold, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`L${ri}`).dataValidation = { type: 'list', formulae: ['"Y,N"'], allowBlank: true };
  });

  // Empty rows
  for (let i = sampleGuests.length; i < (GUEST.LAST_ROW - GUEST.FIRST_ROW + 1); i++) {
    const ri = GUEST.FIRST_ROW + i;
    ['B','D','E','J','K'].forEach(col => setCell(sheet, `${col}${ri}`, '', { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } }));
    setCell(sheet, `C${ri}`, '', { font: FONTS.body, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: ['"His,Hers,Joint"'], allowBlank: true };
    setCell(sheet, `F${ri}`, '', { font: FONTS.body, num: FMT_INT, align: { horizontal: 'right' } });
    setCell(sheet, `G${ri}`, '', { font: FONTS.bodyBold, align: { horizontal: 'center' } });
    sheet.getCell(`G${ri}`).dataValidation = { type: 'list', formulae: ['"Yes,No,Maybe"'], allowBlank: true };
    setCell(sheet, `H${ri}`, '', { font: FONTS.body, align: { horizontal: 'center' } });
    sheet.getCell(`H${ri}`).dataValidation = { type: 'list', formulae: ['"Yes,No"'], allowBlank: true };
    setCell(sheet, `I${ri}`, '', { font: FONTS.body, align: { horizontal: 'center' } });
    sheet.getCell(`I${ri}`).dataValidation = { type: 'list', formulae: ['"Yes,No"'], allowBlank: true };
    setCell(sheet, `L${ri}`, '', { font: FONTS.bodyBold, align: { horizontal: 'center' } });
    sheet.getCell(`L${ri}`).dataValidation = { type: 'list', formulae: ['"Y,N"'], allowBlank: true };
  }

  setCell(sheet, `B${GUEST.TOTAL_ROW}`, 'TOTAL HEADCOUNT',
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, align: { horizontal: 'left', indent: 1 } });
  setCell(sheet, `F${GUEST.TOTAL_ROW}`,
    { formula: `SUM(F${GUEST.FIRST_ROW}:F${GUEST.LAST_ROW})+COUNTIF(H${GUEST.FIRST_ROW}:H${GUEST.LAST_ROW},"Yes")` },
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, num: FMT_INT, align: { horizontal: 'right' } });

  // CF on RSVP column G
  sheet.addConditionalFormatting({
    ref: `G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Yes',   priority: 1, style: { font: { color: argb(SAGE),     bold: true }, fill: FILL_SAGE_LT } },
      { type: 'containsText', operator: 'containsText', text: 'No',    priority: 2, style: { font: { color: argb(BURGUNDY), bold: true }, fill: FILL_BURG_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Maybe', priority: 3, style: { font: { color: argb(AMBER_WED), bold: true }, fill: FILL_AMBER_LT } },
    ],
  });

  addFooter(sheet, GUEST.TOTAL_ROW + 3, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 6 — 📬 RSVP TRACKER (all tiers)
// ============================================================================

function buildRsvpTracker(workbook) {
  const sheet = workbook.addWorksheet('📬 RSVP Tracker');
  setTabColor(sheet, AMBER_WED);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📬 RSVP Tracker',
    tabSubtitle: 'Aggregates the Guest List. Per-event counts (ceremony / reception / rehearsal). Drives final headcount for catering.',
    bannerText: BANNERS.noSub,
    kpiData: [
      { label: 'INVITED',    value: { formula: `COUNTA('👥 Guest List'!B${GUEST.FIRST_ROW}:B${GUEST.LAST_ROW})` } },
      { label: 'YES',        value: { formula: `COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Yes")` } },
      { label: 'NO',         value: { formula: `COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"No")` } },
      { label: 'MAYBE',      value: { formula: `COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Maybe")` } },
      { label: 'PENDING',    value: { formula: `COUNTBLANK('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW})-(${GUEST.LAST_ROW}-${GUEST.FIRST_ROW}+1-COUNTA('👥 Guest List'!B${GUEST.FIRST_ROW}:B${GUEST.LAST_ROW}))` } },
      { label: 'DEADLINE',   value: { formula: `TEXT(${SETUP.WEDDING_DATE}-30,"${FMT_DATE}")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'RSVP at a glance',
    'Aggregate counts from the Guest List. Set RSVP deadline = wedding date − 30 days by industry convention.', 'B:L');

  // Per-event RSVP table — ceremony / reception / rehearsal (sample static counts)
  addTableHeader(sheet, r + 1,
    ['Event', 'Invited', 'Yes', 'No', 'Maybe', 'Pending', 'Response %'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  const events = [
    { name: 'Ceremony',  invited: PERSONA.guestCount, yes: 84, no: 8, maybe: 6 },
    { name: 'Reception', invited: PERSONA.guestCount, yes: 84, no: 8, maybe: 6 },
    { name: 'Rehearsal Dinner (immediate family + wedding party)', invited: 22, yes: 18, no: 2, maybe: 0 },
    { name: 'Day-After Brunch (optional)', invited: 60, yes: 22, no: 4, maybe: 8 },
  ];
  events.forEach((e, i) => {
    const ri = r + 2 + i;
    setCell(sheet, `B${ri}`, e.name,
      { font: FONTS.bodyBold, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, e.invited, { font: FONTS.body, num: FMT_INT, align: { horizontal: 'right' } });
    setCell(sheet, `D${ri}`, e.yes,
      { font: { ...FONTS.bodyBold, color: argb(SAGE) }, num: FMT_INT, align: { horizontal: 'right' } });
    setCell(sheet, `E${ri}`, e.no,
      { font: { ...FONTS.bodyBold, color: argb(BURGUNDY) }, num: FMT_INT, align: { horizontal: 'right' } });
    setCell(sheet, `F${ri}`, e.maybe,
      { font: { ...FONTS.bodyBold, color: argb(AMBER_WED) }, num: FMT_INT, align: { horizontal: 'right' } });
    setCell(sheet, `G${ri}`, { formula: `MAX(0,C${ri}-D${ri}-E${ri}-F${ri})` },
      { font: { ...FONTS.body, color: argb(COLORS.textMuted) }, num: FMT_INT, align: { horizontal: 'right' } });
    setCell(sheet, `H${ri}`, { formula: `IFERROR((D${ri}+E${ri}+F${ri})/MAX(1,C${ri}),0)` },
      { font: FONTS.body, num: FMT_PCT, align: { horizontal: 'right' } });
  });

  r = r + 2 + events.length;

  // === Section 2 — Dietary roll-up ===
  r = addSectionHeader(sheet, r + 2, 'Dietary requirements roll-up',
    'Counts pulled from the Guest List dietary column. Hand this to your caterer.', 'B:L');

  const dietaryRows = [
    { label: 'Vegetarian',          formula: `COUNTIF('👥 Guest List'!J${GUEST.FIRST_ROW}:J${GUEST.LAST_ROW},"*Vegetarian*")` },
    { label: 'Vegan',               formula: `COUNTIF('👥 Guest List'!J${GUEST.FIRST_ROW}:J${GUEST.LAST_ROW},"*Vegan*")` },
    { label: 'Gluten-free',         formula: `COUNTIF('👥 Guest List'!J${GUEST.FIRST_ROW}:J${GUEST.LAST_ROW},"*Gluten-free*")` },
    { label: 'Halal',               formula: `COUNTIF('👥 Guest List'!J${GUEST.FIRST_ROW}:J${GUEST.LAST_ROW},"*Halal*")` },
    { label: 'Kosher',              formula: `COUNTIF('👥 Guest List'!J${GUEST.FIRST_ROW}:J${GUEST.LAST_ROW},"*Kosher*")` },
    { label: 'Nut allergy',         formula: `COUNTIF('👥 Guest List'!J${GUEST.FIRST_ROW}:J${GUEST.LAST_ROW},"*Nut*")` },
    { label: 'Other (see notes)',   formula: `COUNTIFS('👥 Guest List'!J${GUEST.FIRST_ROW}:J${GUEST.LAST_ROW},"<>",'👥 Guest List'!J${GUEST.FIRST_ROW}:J${GUEST.LAST_ROW},"<>Vegetarian",'👥 Guest List'!J${GUEST.FIRST_ROW}:J${GUEST.LAST_ROW},"<>Vegan")` },
  ];
  addTableHeader(sheet, r + 1, ['Requirement', 'Count'], ['B', 'C']);
  dietaryRows.forEach((d, i) => {
    const ri = r + 2 + i;
    setCell(sheet, `B${ri}`, d.label, { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, { formula: d.formula }, { font: FONTS.bodyBold, num: FMT_INT, align: { horizontal: 'right' } });
  });

  r = r + 2 + dietaryRows.length;

  addCallout(sheet, `B${r + 2}:L${r + 3}`,
    '📩',
    'No auto-RSVP collection here — by design',
    'Wedding apps that auto-collect RSVPs lock you into their platform and their data policies. Our approach: paste-in or hand-enter. AI Edition includes 3 polite reminder scripts (30 / 14 / 7 days out) that you send via your preferred medium (text / email / handwritten).');
  sheet.getRow(r + 2).height = 30; sheet.getRow(r + 3).height = 30;

  addFooter(sheet, r + 6, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 7 — 🪑 SEATING CHART PLANNER (all tiers)
// ============================================================================

function buildSeatingChart(workbook) {
  const sheet = workbook.addWorksheet('🪑 Seating Chart Planner');
  setTabColor(sheet, SAGE);
  setupColumns(sheet, { A: 2, B: 14, C: 8, D: 22, E: 22, F: 22, G: 22, H: 22, I: 22, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🪑 Seating Chart Planner',
    tabSubtitle: 'Paper-style seating planner. Set table count + capacity, then write guest names in cells. Pairs with the AI Seating Constraint Solver.',
    bannerText: BANNERS.whyXls,
    kpiData: [
      { label: 'TABLES',         value: { formula: `12` } },
      { label: 'CAPACITY/TABLE', value: { formula: `8` } },
      { label: 'TOTAL SEATS',    value: { formula: `12*8` } },
      { label: 'GUESTS RSVPd',   value: { formula: `COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Yes")+COUNTIFS('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Yes",'👥 Guest List'!H${GUEST.FIRST_ROW}:H${GUEST.LAST_ROW},"Yes")` } },
      { label: 'OPEN SEATS',     value: { formula: `12*8-(COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Yes")+COUNTIFS('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Yes",'👥 Guest List'!H${GUEST.FIRST_ROW}:H${GUEST.LAST_ROW},"Yes"))` } },
      { label: 'STATUS',         value: { formula: `IF(12*8>(COUNTIF('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Yes")+COUNTIFS('👥 Guest List'!G${GUEST.FIRST_ROW}:G${GUEST.LAST_ROW},"Yes",'👥 Guest List'!H${GUEST.FIRST_ROW}:H${GUEST.LAST_ROW},"Yes")),"✓ Fits","⚠ Add a table")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Table layout — 12 tables × 8 seats',
    'Each table gets a vibe name + seat list. Use comma-separated names. Move a guest by retyping the name into a different table.', 'B:L');

  // 12 tables in a 3-column grid (4 rows × 3 tables)
  const tableData = [
    { num: 1,  vibe: 'Head Table',        seats: 'Amelia, Daniel, Priya Sharma, Marcus Holloway, Dad — Robert, Mom — Carol, Grandma Pat, +1' },
    { num: 2,  vibe: 'His Family Core',   seats: 'Aunt Linda, Uncle Bill, +1, +1, Cousin (adult), Cousin (adult), +1, +1' },
    { num: 3,  vibe: 'Hers Family Core',  seats: 'Aunt Rose, +1, Cousin Sasha, +1, Cousin Lin, +1, Uncle Jay, +1' },
    { num: 4,  vibe: 'College Friends',   seats: 'Sarah Chen, +1, Roommate B, +1, Roommate C, +1, Roommate D, +1' },
    { num: 5,  vibe: 'High School',       seats: 'Mike Davis, Friend B, Friend C, +1, Friend E, +1, Friend G, +1' },
    { num: 6,  vibe: 'Work — His',        seats: 'Colleague A, +1, Colleague B, +1, Colleague C, +1, Colleague D, +1' },
    { num: 7,  vibe: 'Work — Hers',       seats: 'Colleague E, +1, Colleague F, +1, Colleague G, +1, Colleague H, +1' },
    { num: 8,  vibe: 'Neighbors',         seats: 'Neighbor A, +1, Neighbor B, +1, Neighbor C, +1, Neighbor D, +1' },
    { num: 9,  vibe: 'Plus-Ones & Mix',   seats: '(open seating block — fill closer to date)' },
    { num: 10, vibe: 'Friends — Mixed',   seats: 'Jess Park, +1, Tom & Kate, Friend Y, +1, Friend Z, +1, +1' },
    { num: 11, vibe: 'Kids Table',        seats: 'Cousin Daniel, Cousin Mia, Kid C, Kid D, (designated adult), —, —, —' },
    { num: 12, vibe: 'Officiant + VIP',   seats: 'Officiant, +1, Photographer break seat, DJ break seat, —, —, —, —' },
  ];

  // Lay out as 4 rows × 3 columns
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const idx = row * 3 + col;
      const t = tableData[idx];
      const colStart = ['B','E','H'][col];
      const colEnd   = ['D','G','J'][col];
      const blockR = r + 1 + row * 4;

      // Table header band
      sheet.mergeCells(`${colStart}${blockR}:${colEnd}${blockR}`);
      const head = sheet.getCell(`${colStart}${blockR}`);
      head.value = `Table ${t.num} · ${t.vibe}`;
      head.font = { ...FONTS.bodyBold, color: argb(COLORS.white) };
      head.fill = FILL_MAUVE;
      head.alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
      head.border = BORDER_THIN(MATTE_BLACK);
      sheet.getRow(blockR).height = 22;

      // Seat list cell (merged 3 rows tall)
      sheet.mergeCells(`${colStart}${blockR + 1}:${colEnd}${blockR + 3}`);
      const seats = sheet.getCell(`${colStart}${blockR + 1}`);
      seats.value = t.seats;
      seats.font = { ...FONTS.body, size: 10 };
      seats.fill = FILL_IVORY;
      seats.alignment = { horizontal: 'left', indent: 1, vertical: 'top', wrapText: true };
      seats.border = BORDER_THIN(WARM_GRAY);
      sheet.getRow(blockR + 1).height = 22;
      sheet.getRow(blockR + 2).height = 22;
      sheet.getRow(blockR + 3).height = 22;
    }
  }

  r = r + 1 + 4 * 4;

  addCallout(sheet, `B${r + 2}:L${r + 3}`,
    '🧩',
    'Have constraints? (X cannot sit near Y, Z needs accessibility)',
    'AI Edition includes a Seating Constraint Solver tab — paste your constraints + this layout into ChatGPT or Claude, get back a constraint-satisfying seating plan in 30 seconds.');
  sheet.getRow(r + 2).height = 30; sheet.getRow(r + 3).height = 30;

  addFooter(sheet, r + 6, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 8 — 📅 MASTER TIMELINE (all tiers; cultural variants embedded at AI tier)
// ============================================================================

function buildMasterTimeline(workbook) {
  const sheet = workbook.addWorksheet('📅 Master Timeline');
  setTabColor(sheet, DEEP_MAUVE);
  setupColumns(sheet, { A: 2, B: 16, C: 38, D: 14, E: 14, F: 14, G: 14, H: 14, I: 16, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📅 Master Timeline',
    tabSubtitle: '12-month / 6-month / 3-month / 1-month / week-of / day-of checklists. Driven by the Wedding Date on Setup Wizard.',
    bannerText: BANNERS.whyXls,
    kpiData: [
      { label: 'WEDDING DATE',  value: { formula: `TEXT(${SETUP.WEDDING_DATE},"${FMT_DATE}")` } },
      { label: 'MO TO GO',      value: { formula: `MAX(0,DATEDIF(TODAY(),${SETUP.WEDDING_DATE},"m"))&" mo"` } },
      { label: 'COMPLETE',      value: { formula: `COUNTIF(D10:D80,"✓")&" / "&COUNTA(C10:C80)` } },
      { label: 'NEXT MILESTONE',value: { formula: `IF(MAX(0,DATEDIF(TODAY(),${SETUP.WEDDING_DATE},"m"))>9,"12-mo block",IF(MAX(0,DATEDIF(TODAY(),${SETUP.WEDDING_DATE},"m"))>5,"6-mo block",IF(MAX(0,DATEDIF(TODAY(),${SETUP.WEDDING_DATE},"m"))>2,"3-mo block",IF(MAX(0,DATEDIF(TODAY(),${SETUP.WEDDING_DATE},"m"))>0,"1-mo block","Week of / day of"))))` } },
      { label: 'TRADITION',     value: { formula: `${SETUP.RELIGION}` } },
      { label: 'CHECKLIST',     value: 'Universal + tradition' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Universal checklist — works for every wedding',
    'Phase blocks: 12-mo / 9-mo / 6-mo / 3-mo / 1-mo / week-of / day-of. Check off as you go.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Phase', 'Task', '✓', 'Target Date', 'Owner', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G']);

  // Universal timeline — 50+ tasks across 7 phases
  const tasks = [
    ['12 months out', 'Set the wedding date',                                          '✓', new Date(2025, 9, 12),  'Both',     ''],
    ['12 months out', 'Set the total budget (cap)',                                    '✓', new Date(2025, 9, 20),  'Both',     ''],
    ['12 months out', 'Make the guest list (target count)',                            '✓', new Date(2025, 10, 1),  'Both',     ''],
    ['12 months out', 'Tour 3 venues, choose one',                                     '✓', new Date(2025, 10, 15), 'Both',     ''],
    ['12 months out', 'Sign venue contract + deposit',                                 '✓', new Date(2025, 10, 30), 'Both',     ''],
    ['12 months out', 'Hire wedding planner OR commit to DIY',                         '',  new Date(2025, 11, 5),  'Both',     ''],
    ['12 months out', 'Book photographer',                                             '✓', new Date(2025, 11, 15), 'Both',     ''],
    ['12 months out', 'Book videographer (optional)',                                  '',  new Date(2025, 11, 20), 'Both',     ''],
    ['9 months out',  'Book caterer + tasting',                                        '✓', new Date(2026, 0, 15),  'Both',     ''],
    ['9 months out',  'Book DJ / band / live music',                                   '✓', new Date(2026, 0, 28),  'Both',     ''],
    ['9 months out',  'Send save-the-dates',                                           '✓', new Date(2026, 1, 12),  'Both',     ''],
    ['9 months out',  'Book florist',                                                  '✓', new Date(2026, 2, 1),   'Both',     ''],
    ['9 months out',  'Bridal attire shopping + first fitting',                        '✓', new Date(2026, 2, 14),  'Bride',    ''],
    ['6 months out',  'Order rings',                                                   '✓', new Date(2026, 3, 12),  'Both',     ''],
    ['6 months out',  'Book hair + makeup',                                            '✓', new Date(2026, 3, 20),  'Bride',    ''],
    ['6 months out',  'Engagement photos (optional)',                                  '',  new Date(2026, 4, 1),   'Both',     ''],
    ['6 months out',  'Officiant booked + ceremony script drafted',                    '',  new Date(2026, 4, 15),  'Both',     ''],
    ['6 months out',  'Honeymoon booked (flights + hotel)',                            '',  new Date(2026, 4, 30),  'Both',     ''],
    ['6 months out',  'Order invitations + RSVP cards',                                '',  new Date(2026, 5, 10),  'Both',     ''],
    ['3 months out',  'Send invitations',                                              '',  new Date(2026, 6, 12),  'Both',     ''],
    ['3 months out',  'Final menu tasting + sign-off',                                 '',  new Date(2026, 6, 20),  'Both',     ''],
    ['3 months out',  'Cake / dessert tasting + order',                                '',  new Date(2026, 6, 25),  'Both',     ''],
    ['3 months out',  'Order wedding party gifts',                                     '',  new Date(2026, 7, 1),   'Both',     ''],
    ['3 months out',  'Confirm transportation (limo / shuttle)',                       '',  new Date(2026, 7, 10),  'Both',     ''],
    ['3 months out',  'Write wedding vows (start draft)',                              '',  new Date(2026, 7, 20),  'Both',     ''],
    ['1 month out',   'Collect RSVPs (deadline = wedding − 30)',                       '',  new Date(2026, 8, 12),  'Both',     'RSVP scripts on AI tab'],
    ['1 month out',   'Final headcount to caterer',                                    '',  new Date(2026, 8, 20),  'Both',     ''],
    ['1 month out',   'Apply for marriage license',                                    '',  new Date(2026, 8, 22),  'Both',     ''],
    ['1 month out',   'Final dress / suit fittings',                                   '',  new Date(2026, 8, 25),  'Both',     ''],
    ['1 month out',   'Seating chart finalized',                                       '',  new Date(2026, 8, 28),  'Both',     ''],
    ['1 month out',   'Day-of timeline shared with vendors',                           '',  new Date(2026, 9, 1),   'Both',     ''],
    ['1 week out',    'Confirm every vendor call (15-min calls)',                      '',  new Date(2026, 9, 5),   'Both',     ''],
    ['1 week out',    'Pack emergency kit (sewing / pain / stain)',                    '',  new Date(2026, 9, 7),   'Bride',    ''],
    ['1 week out',    'Rehearsal dinner',                                              '',  new Date(2026, 9, 10),  'Both',     ''],
    ['Day of',        'Hair + makeup (morning)',                                       '',  new Date(2026, 9, 12),  'Bride',    ''],
    ['Day of',        'First-look photos (if doing)',                                  '',  new Date(2026, 9, 12),  'Both',     ''],
    ['Day of',        'Ceremony',                                                       '',  new Date(2026, 9, 12),  'Both',     ''],
    ['Day of',        'Reception',                                                      '',  new Date(2026, 9, 12),  'Both',     ''],
    ['Day of',        'Pay final balances (envelopes ready)',                          '',  new Date(2026, 9, 12),  'Best man', 'Cash + check envelopes'],
    ['After',         'Send thank-you notes',                                          '',  new Date(2026, 10, 12), 'Both',     ''],
    ['After',         'Apply for marriage certificate copies',                         '',  new Date(2026, 9, 26),  'Both',     ''],
    ['After',         'Annual Reflection (1-year mark)',                               '',  new Date(2027, 9, 12),  'Both',     'See 💌 Annual Reflection tab'],
  ];
  tasks.forEach((t, i) => {
    const ri = 10 + i;
    setCell(sheet, `B${ri}`, t[0],
      { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, t[1],
      { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true } });
    setCell(sheet, `D${ri}`, t[2],
      { font: { ...FONTS.bodyBold, color: argb(SAGE) }, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`D${ri}`).dataValidation = { type: 'list', formulae: ['"✓, "'], allowBlank: true };
    setCell(sheet, `E${ri}`, t[3], { font: FONTS.body, num: FMT_DATE, align: { horizontal: 'center', vertical: 'middle' } });
    setCell(sheet, `F${ri}`, t[4], { font: FONTS.body, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`F${ri}`).dataValidation = { type: 'list', formulae: ['"Both,Bride,Groom,Parents,Planner,Best man,Maid of honor,Officiant"'], allowBlank: true };
    setCell(sheet, `G${ri}`, t[5], { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true } });
  });

  // Highlight checked rows
  sheet.addConditionalFormatting({
    ref: `B10:G${10 + tasks.length - 1}`,
    rules: [
      { type: 'expression', formulae: [`$D10="✓"`], priority: 1,
        style: { font: { color: argb(COLORS.textMuted), italic: true }, fill: FILL_SAGE_LT } },
    ],
  });

  let nextR = 10 + tasks.length + 2;

  // === Section 2 — Cultural variant ribbons (always visible; render content based on religion) ===
  nextR = addSectionHeader(sheet, nextR + 1, 'Optional — tradition-specific milestones',
    'Driven by the religion / tradition picker on Setup Wizard. Common cultural milestones are listed below. Pick the ones that apply.', 'B:L');

  const culturalRows = [
    ['Christian',           'Premarital counseling sessions (6–8 weeks before ceremony) — booked with officiant or pastor.'],
    ['Catholic',            'Pre-Cana / FOCCUS inventory (3–6 months out). Marriage prep + dispensations if interfaith.'],
    ['Jewish',              'Ketubah signing (day-of, pre-ceremony) — calligrapher booked ~3 months out. Chuppah arrangements.'],
    ['Muslim',              'Walima reception (post-Nikah). Mahr (gift) agreed in writing. Imam booked. Halal catering.'],
    ['Hindu',               'Multi-day functions (Mehndi / Sangeet / Haldi / wedding day). Pandit booked 6+ months out.'],
    ['Sikh',                'Anand Karaj at gurdwara (morning ceremony). Granthi booked. Langar (community meal) arranged.'],
    ['Buddhist',            'Monastic blessing (date set by lunar calendar). Optional dana (offerings) for monastics.'],
    ['Interfaith / secular','Officiant who can blend traditions. Ceremony script written 6 months out.'],
  ];
  addTableHeader(sheet, nextR + 1, ['Tradition', 'Milestone(s)'], ['B', 'C']);
  culturalRows.forEach((cr, i) => {
    const ri = nextR + 2 + i;
    sheet.mergeCells(`C${ri}:L${ri}`);
    setCell(sheet, `B${ri}`, cr[0],
      { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, cr[1],
      { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true } });
    sheet.getRow(ri).height = 26;
  });

  addCallout(sheet, `B${nextR + 11}:L${nextR + 12}`,
    '🤝',
    'No single tradition assumed',
    'Every wedding is different. The universal checklist works for any tradition; the table above highlights tradition-specific milestones to layer on. The AI Co-Pilot prompts (AI Edition) adapt to the religion you set on Setup Wizard.');
  sheet.getRow(nextR + 11).height = 30; sheet.getRow(nextR + 12).height = 30;

  addFooter(sheet, nextR + 15, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 9 — ⏰ DAY-OF SCHEDULE (all tiers)
// ============================================================================

function buildDayOfSchedule(workbook) {
  const sheet = workbook.addWorksheet('⏰ Day-of Schedule');
  setTabColor(sheet, DUSTY_ROSE);
  setupColumns(sheet, { A: 2, B: 14, C: 36, D: 16, E: 16, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '⏰ Day-of Schedule',
    tabSubtitle: 'Minute-by-minute timeline. Share this with every vendor, the wedding party, and the day-of coordinator.',
    bannerText: BANNERS.noSub,
    kpiData: [
      { label: 'WEDDING DATE',  value: { formula: `TEXT(${SETUP.WEDDING_DATE},"${FMT_DATE}")` } },
      { label: 'CEREMONY',      value: '4:30 PM' },
      { label: 'RECEPTION',     value: '6:00 PM' },
      { label: 'LAST CALL',     value: '10:30 PM' },
      { label: 'EVENT END',     value: '11:00 PM' },
      { label: 'BUFFER',        value: '15 min/blk' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Day-of timeline — minute-by-minute',
    'Standard 5-hour reception structure. Adjust times to match your venue contract.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Time', 'Event', 'Lead', 'Location', 'Owner'],
    ['B', 'C', 'D', 'E', 'F']);

  const schedule = [
    ['7:00 AM',  'Bride wakes, breakfast + hydration',         'Bride',           'Suite',                  'Maid of honor'],
    ['8:30 AM',  'Hair stylist arrives',                       'Hair team',       'Suite',                  'Maid of honor'],
    ['9:30 AM',  'Makeup artist arrives',                      'Makeup team',     'Suite',                  'Maid of honor'],
    ['11:00 AM', 'Bridesmaids in attire / pre-photos',         'Bridesmaids',     'Suite',                  'Photographer'],
    ['12:00 PM', 'Lunch (light, scheduled)',                   'All',             'Suite + groomsmen room', 'Best man'],
    ['1:00 PM',  'Bride in dress + jewelry',                   'Bride',           'Suite',                  'Maid of honor'],
    ['1:30 PM',  'First-look photos (if doing)',               'Couple + photog', 'Venue grounds',          'Photographer'],
    ['2:30 PM',  'Wedding party + family portraits',           'Wedding party',   'Venue grounds',          'Photographer'],
    ['3:30 PM',  'Couple hidden / final touches',              'Bride + groom',   'Suite / groomsmen room', 'Coordinator'],
    ['4:00 PM',  'Guests seated for ceremony',                 'Guests',          'Ceremony space',         'Ushers'],
    ['4:30 PM',  'CEREMONY begins',                            'Officiant',       'Ceremony space',         'Officiant'],
    ['5:00 PM',  'Ceremony ends / receiving line',             'Couple',          'Ceremony exit',          'Coordinator'],
    ['5:00 PM',  'Cocktail hour begins',                       'Guests',          'Cocktail area',          'Bar staff'],
    ['5:30 PM',  'Couple + family extended portraits',         'Couple',          'Venue grounds',          'Photographer'],
    ['6:00 PM',  'Reception entrance — couple introduced',     'DJ',              'Reception hall',         'DJ'],
    ['6:15 PM',  'First dance',                                'Couple',          'Reception hall',         'DJ'],
    ['6:30 PM',  'Welcome toast (father of bride OR officiant)','Robert',         'Reception hall',         'Robert'],
    ['6:45 PM',  'Dinner served',                              'Catering team',   'Reception hall',         'Caterer'],
    ['7:30 PM',  'Toasts: best man + maid of honor',           'Marcus + Priya',  'Reception hall',         'DJ'],
    ['8:00 PM',  'Couple\'s dance with parents',               'Couple + parents','Reception hall',         'DJ'],
    ['8:30 PM',  'Open dancing begins',                        'All',             'Reception hall',         'DJ'],
    ['9:30 PM',  'Cake cutting',                               'Couple',          'Reception hall',         'Caterer'],
    ['10:00 PM', 'Bouquet / garter toss (optional)',           'Couple',          'Reception hall',         'DJ'],
    ['10:30 PM', 'Last call at bar',                           'Bar staff',       'Bar',                    'Bar manager'],
    ['10:50 PM', 'Last song',                                  'DJ',              'Reception hall',         'DJ'],
    ['11:00 PM', 'Sparkler / petal exit',                      'Couple',          'Venue front',            'Coordinator'],
    ['11:15 PM', 'Vendor break-down begins',                   'Caterer + DJ',    'Reception hall',         'Coordinator'],
  ];
  schedule.forEach((s, i) => {
    const ri = r + 2 + i;
    setCell(sheet, `B${ri}`, s[0],
      { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, align: { horizontal: 'center', vertical: 'middle' } });
    setCell(sheet, `C${ri}`, s[1],
      { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true } });
    setCell(sheet, `D${ri}`, s[2],
      { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `E${ri}`, s[3],
      { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `F${ri}`, s[4],
      { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
  });

  addCallout(sheet, `B${r + 2 + schedule.length + 2}:L${r + 2 + schedule.length + 3}`,
    '🚨',
    'Day-of Crisis Playbook (AI Edition)',
    'No matter how detailed your timeline, something will go sideways. AI Edition includes a Day-of Crisis Playbook tab with 12 pre-written scripts for common day-of disasters (vendor late / wardrobe / weather / uninvited guest / lost item). Calm + actionable, never "stay positive!"');
  sheet.getRow(r + 2 + schedule.length + 2).height = 30;
  sheet.getRow(r + 2 + schedule.length + 3).height = 30;

  addFooter(sheet, r + 2 + schedule.length + 6, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 10 — 📞 VENDOR CONTACT SHEET (all tiers)
// ============================================================================

function buildVendorContactSheet(workbook) {
  const sheet = workbook.addWorksheet('📞 Vendor Contact Sheet');
  setTabColor(sheet, AMBER_WED);
  setupColumns(sheet, { A: 2, B: 22, C: 18, D: 18, E: 22, F: 22, G: 16, H: 18, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📞 Vendor Contact Sheet',
    tabSubtitle: 'Printable single-page reference for the day-of coordinator and the wedding party. Print this; tape it to a clipboard.',
    bannerText: BANNERS.whyXls,
    kpiData: [
      { label: 'VENDORS',       value: { formula: `COUNTA('🤝 Vendor Tracker'!B${VENDOR.FIRST_ROW}:B${VENDOR.LAST_ROW})` } },
      { label: 'PHOTOG/VIDEO',  value: { formula: `COUNTIFS('🤝 Vendor Tracker'!C${VENDOR.FIRST_ROW}:C${VENDOR.LAST_ROW},"Photography + Video")` } },
      { label: 'CATERING',      value: { formula: `COUNTIFS('🤝 Vendor Tracker'!C${VENDOR.FIRST_ROW}:C${VENDOR.LAST_ROW},"Catering + Bar")` } },
      { label: 'FLORAL',        value: { formula: `COUNTIFS('🤝 Vendor Tracker'!C${VENDOR.FIRST_ROW}:C${VENDOR.LAST_ROW},"Flowers + Decor")` } },
      { label: 'MUSIC',         value: { formula: `COUNTIFS('🤝 Vendor Tracker'!C${VENDOR.FIRST_ROW}:C${VENDOR.LAST_ROW},"Music + Entertainment")` } },
      { label: 'PRINT-READY',   value: '✓' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Vendor + key person contact list',
    'Everyone you need to reach on the day. Pulled from Vendor Tracker + wedding-party data below.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Role / Vendor', 'Contact name', 'Phone', 'Email', 'Arrival window', 'Backup contact'],
    ['B', 'C', 'D', 'E', 'F', 'G']);

  // Pull rows 1-8 from Vendor Tracker
  for (let i = 0; i < 8; i++) {
    const ri = r + 2 + i;
    const vr = VENDOR.FIRST_ROW + i;
    setCell(sheet, `B${ri}`, { formula: `'🤝 Vendor Tracker'!B${vr}` },
      { font: FONTS.bodyBold, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, { formula: `'🤝 Vendor Tracker'!D${vr}` },
      { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `D${ri}`, '', { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `E${ri}`, '', { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `F${ri}`, '', { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `G${ri}`, '', { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
  }
  // Sample phone + arrival data for the first few
  const samples = [
    [r + 2,  '(512) 555-0142', 'maya@pecansprings.com',  '8:00 AM (setup)',     'Maya Lopez'],
    [r + 3,  '(512) 555-0188', 'diego@hillcountrycc.com', '2:00 PM',             'Diego Reyes'],
    [r + 4,  '(512) 555-0204', 'emma@emmacarterphoto.com','12:30 PM (first-look)', 'Emma Carter'],
    [r + 5,  '(512) 555-0287', 'sam@lonestarlens.com',   '3:00 PM',             'Sam Park'],
    [r + 6,  '(512) 555-0319', 'rosa@wildflowerstudio.com','9:00 AM (setup)',   'Rosa Vela'],
    [r + 7,  '(512) 555-0356', 'marco@djmarco.com',      '4:00 PM',             'Marco Diaz'],
  ];
  samples.forEach(s => {
    setCell(sheet, `D${s[0]}`, s[1], { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `E${s[0]}`, s[2], { font: { ...FONTS.body, color: argb(DEEP_MAUVE) }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `F${s[0]}`, s[3], { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `G${s[0]}`, s[4], { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
  });

  r = r + 2 + 8;

  // === Section 2 — Wedding party + key family ===
  r = addSectionHeader(sheet, r + 2, 'Key people — wedding party + family',
    'Phone numbers for the people who can solve a crisis without bothering the couple.', 'B:L');

  addTableHeader(sheet, r + 1, ['Role', 'Name', 'Phone', 'Email', 'Notes'],
    ['B', 'C', 'D', 'E', 'F']);

  const keyPeople = [
    ['Maid of honor',          'Priya Sharma',     '(415) 555-0148', 'priya.s@example.com',    'Authority to solve crises'],
    ['Best man',               'Marcus Holloway',  '(415) 555-0182', 'marcus.h@example.com',   'Has cash envelopes'],
    ['Father of bride',        'Robert (Hers)',    '(415) 555-0210', 'robert@example.com',     'Welcome toast'],
    ['Mother of bride',        'Carol (Hers)',     '(415) 555-0211', 'carol@example.com',      ''],
    ['Father of groom',        'James (His)',      '(415) 555-0244', 'james@example.com',      ''],
    ['Mother of groom',        'Sandra (His)',     '(415) 555-0245', 'sandra@example.com',     ''],
    ['Officiant',              'TBD',              '',               '',                       ''],
    ['Day-of coordinator',     'TBD (hire)',       '',               '',                       ''],
  ];
  keyPeople.forEach((p, i) => {
    const ri = r + 2 + i;
    setCell(sheet, `B${ri}`, p[0], { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, p[1], { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `D${ri}`, p[2], { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `E${ri}`, p[3], { font: { ...FONTS.body, color: argb(DEEP_MAUVE) }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `F${ri}`, p[4], { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
  });

  addCallout(sheet, `B${r + 2 + keyPeople.length + 2}:L${r + 2 + keyPeople.length + 3}`,
    '🖨️',
    'Print this tab',
    'File → Print → fit to one page. Tape to a clipboard, give to the day-of coordinator. Phones get lost; printed lists do not. (Save a PDF copy to your Drive too, of course.)');
  sheet.getRow(r + 2 + keyPeople.length + 2).height = 30;
  sheet.getRow(r + 2 + keyPeople.length + 3).height = 30;

  addFooter(sheet, r + 2 + keyPeople.length + 6, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 11 — ✈️ HONEYMOON BUDGET (all tiers)
// ============================================================================

function buildHoneymoonBudget(workbook) {
  const sheet = workbook.addWorksheet('✈️ Honeymoon Budget');
  setTabColor(sheet, SAGE);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '✈️ Honeymoon Budget',
    tabSubtitle: 'Separate budget for the honeymoon — flights, hotel, activities, dining, savings target.',
    bannerText: BANNERS.privacy,
    kpiData: [
      { label: 'TRIP BUDGET',  value: { formula: `TEXT(F18,"${FMT_USD}")` } },
      { label: 'BOOKED',       value: { formula: `TEXT(SUM(F10:F16),"${FMT_USD}")` } },
      { label: 'REMAINING',    value: { formula: `TEXT(MAX(0,F18-SUM(F10:F16)),"${FMT_USD}")` } },
      { label: 'DESTINATION',  value: { formula: `C8` } },
      { label: 'DEPART',       value: { formula: `TEXT(D8,"${FMT_DATE}")` } },
      { label: 'RETURN',       value: { formula: `TEXT(E8,"${FMT_DATE}")` } },
    ],
  });

  // Trip params row
  setCell(sheet, `B8`, 'Trip',
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: FILL_MAUVE, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
  setCell(sheet, `C8`, 'Lisbon + Algarve',
    { font: { ...FONTS.bodyBold }, fill: FILL_IVORY, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
  setCell(sheet, `D8`, new Date(2026, 9, 15),
    { font: FONTS.body, fill: FILL_IVORY, num: FMT_DATE, align: { horizontal: 'center', vertical: 'middle' } });
  setCell(sheet, `E8`, new Date(2026, 9, 25),
    { font: FONTS.body, fill: FILL_IVORY, num: FMT_DATE, align: { horizontal: 'center', vertical: 'middle' } });
  sheet.getRow(8).height = 24;

  let r = addSectionHeader(sheet, 6, 'Honeymoon budget breakdown',
    '7 line items + a target. Adjust to your trip. AI Co-Pilot can suggest a budget split by destination.', 'B:L');

  addTableHeader(sheet, 9, ['Line item', 'Notes', 'Estimate', '', 'Booked', 'Per person', 'Status'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  const honeymoonLines = [
    ['Flights (round-trip × 2)',    'AUS → LIS direct',           1800, 1750, ],
    ['Hotel — Lisbon (3 nights)',   'Boutique, breakfast incl.',  900,  900,  ],
    ['Hotel — Algarve (5 nights)',  'Cliffside w/ breakfast',     1400, 0,    ],
    ['Rental car (10 days)',        'Compact + insurance',        450,  0,    ],
    ['Food + drink',                '~$120/day × 10 = $1,200',    1200, 0,    ],
    ['Activities + tours',          'Wine tour / surf lesson',    500,  0,    ],
    ['Buffer / contingency',        '~10%',                       550,  0,    ],
  ];
  honeymoonLines.forEach((row, i) => {
    const ri = 10 + i;
    setCell(sheet, `B${ri}`, row[0], { font: FONTS.bodyBold, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, row[1], { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `D${ri}`, row[2], { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right', vertical: 'middle' } });
    setCell(sheet, `E${ri}`, '', { font: FONTS.body, align: { horizontal: 'right', vertical: 'middle' } });
    setCell(sheet, `F${ri}`, row[3], { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, num: FMT_USD, align: { horizontal: 'right', vertical: 'middle' } });
    setCell(sheet, `G${ri}`, { formula: `D${ri}/2` }, { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right', vertical: 'middle' } });
    setCell(sheet, `H${ri}`, { formula: `IF(F${ri}>=D${ri},"✓ Booked",IF(F${ri}>0,"◐ Partial","— Open"))` },
      { font: FONTS.bodyBold, align: { horizontal: 'center' } });
  });

  // Totals
  setCell(sheet, `B18`, 'TARGET',
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, align: { horizontal: 'left', indent: 1 } });
  setCell(sheet, `D18`, { formula: `SUM(D10:D16)` },
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, num: FMT_USD, align: { horizontal: 'right' } });
  setCell(sheet, `F18`, { formula: `SUM(F10:F16)` },
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, num: FMT_USD, align: { horizontal: 'right' } });
  setCell(sheet, `G18`, { formula: `D18/2` },
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, num: FMT_USD, align: { horizontal: 'right' } });

  // === Section 2 — Honeymoon savings tracker ===
  r = addSectionHeader(sheet, 21, 'Savings tracker — monthly contributions toward the target',
    '6-month run-up. Add a monthly transfer to a sinking fund. (Reuses the same pattern as our Sinking Funds Planner.)', 'B:L');

  addTableHeader(sheet, r + 1, ['Month', 'Contribution', 'Cumulative', 'Target by date', '% to target'],
    ['B', 'C', 'D', 'E', 'F']);

  const savings = [
    ['Apr 2026',  800],
    ['May 2026',  800],
    ['Jun 2026',  800],
    ['Jul 2026',  900],
    ['Aug 2026',  900],
    ['Sep 2026', 1000],
  ];
  let cum = 0;
  savings.forEach((s, i) => {
    cum += s[1];
    const ri = r + 2 + i;
    setCell(sheet, `B${ri}`, s[0], { font: FONTS.bodyBold, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, s[1], { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right' } });
    setCell(sheet, `D${ri}`, cum,  { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, num: FMT_USD, align: { horizontal: 'right' } });
    setCell(sheet, `E${ri}`, { formula: `D18*(${i + 1}/${savings.length})` },
      { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right' } });
    setCell(sheet, `F${ri}`, { formula: `IFERROR(D${ri}/MAX(1,D18),0)` },
      { font: FONTS.body, num: FMT_PCT, align: { horizontal: 'right' } });
  });

  addFooter(sheet, r + 2 + savings.length + 3, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 12 — 💌 ANNUAL REFLECTION (all tiers)
// ============================================================================

function buildAnnualReflection(workbook) {
  const sheet = workbook.addWorksheet('💌 Annual Reflection');
  setTabColor(sheet, DUSTY_ROSE);
  setupColumns(sheet, { A: 2, B: 28, C: 60, D: 6, E: 6, F: 6, G: 6, H: 6, I: 6, J: 6, K: 6, L: 6, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💌 Annual Reflection',
    tabSubtitle: 'A 1-year-after retrospective. Open this on your first anniversary; write what you remember.',
    bannerText: BANNERS.whyXls,
    kpiData: [
      { label: 'WEDDING DATE',   value: { formula: `TEXT(${SETUP.WEDDING_DATE},"${FMT_DATE}")` } },
      { label: 'ANNIV. DATE',    value: { formula: `TEXT(EDATE(${SETUP.WEDDING_DATE},12),"${FMT_DATE}")` } },
      { label: 'DAYS SINCE',     value: { formula: `MAX(0,TODAY()-${SETUP.WEDDING_DATE})&" days"` } },
      { label: 'SECTIONS',       value: '7' },
      { label: 'TIME NEEDED',    value: '20 min' },
      { label: 'PARTNER A + B',  value: { formula: `${SETUP.PARTNER_A}&" + "&${SETUP.PARTNER_B}` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'What went well, what we would change',
    'Seven prompts. 1–3 sentences each. Future-you will be grateful.', 'B:L');

  const prompts = [
    ['One moment we would relive forever',           'The thing that stopped time. Don\'t describe it well — just name it. You\'ll remember the rest.'],
    ['One vendor we would book again instantly',     'Name + category + the specific reason. Used by future-friends planning their wedding.'],
    ['One thing we would absolutely change',         'What we burned money on / what we stressed about / what we wish we had skipped.'],
    ['Best advice someone gave us, in retrospect',   'Maybe ignored at the time. Capture it now while you can still hear it in their voice.'],
    ['Best decision we made for our wedding',        'Not someone else\'s decision. Yours. The one you fought for.'],
    ['What surprised us about being married vs engaged','Honest answer. Not "everything is perfect." Specific.'],
    ['Letter to next year\'s us',                    'One paragraph. Open this on your second anniversary.'],
  ];
  prompts.forEach((p, i) => {
    const ri = r + 1 + i * 3;
    setCell(sheet, `B${ri}`, p[0],
      { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, align: { vertical: 'top', horizontal: 'left', indent: 1, wrapText: true } });
    setCell(sheet, `C${ri}`, p[1],
      { font: { ...FONTS.bodyMuted, size: 10 }, align: { vertical: 'top', horizontal: 'left', indent: 1, wrapText: true } });
    // Answer cell
    setCell(sheet, `C${ri + 1}`, '',
      { font: FONTS.body, fill: FILL_IVORY, align: { vertical: 'top', horizontal: 'left', indent: 1, wrapText: true } });
    sheet.getRow(ri).height = 22;
    sheet.getRow(ri + 1).height = 56;
    sheet.getRow(ri + 2).height = 8;
  });

  r = r + 1 + prompts.length * 3 + 2;

  addCallout(sheet, `B${r}:L${r + 1}`,
    '✨',
    'This sheet is yours forever',
    'Open it on your 1st anniversary. Open it on your 5th. Show it to your kids at their wedding. The spreadsheet does not expire, does not require an account, does not depend on a company being in business.');
  sheet.getRow(r).height = 30; sheet.getRow(r + 1).height = 30;

  addFooter(sheet, r + 4, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 13 — 👤 COST PER GUEST (Pro+)
// ============================================================================

function buildCostPerGuest(workbook) {
  const sheet = workbook.addWorksheet('👤 Cost Per Guest');
  setTabColor(sheet, DEEP_MAUVE);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '👤 Cost Per Guest',
    tabSubtitle: 'Total budget ÷ guest count, plus a what-if slider for guest cuts.',
    bannerText: BANNERS.whyXls,
    kpiData: [
      { label: 'BUDGET CAP',    value: { formula: `TEXT(${SETUP.BUDGET_CAP},"${FMT_USD}")` } },
      { label: 'GUEST COUNT',   value: { formula: `${SETUP.GUEST_COUNT}&" guests"` } },
      { label: 'COST / GUEST',  value: { formula: `TEXT(IFERROR(${SETUP.BUDGET_CAP}/MAX(1,${SETUP.GUEST_COUNT}),0),"${FMT_USD}")` } },
      { label: 'PER COUPLE',    value: { formula: `TEXT(IFERROR(${SETUP.BUDGET_CAP}/MAX(1,${SETUP.GUEST_COUNT})*2,0),"${FMT_USD}")` } },
      { label: 'WHAT-IF',       value: { formula: `"Cut "&E12&" = save "&TEXT(E12*E14,"${FMT_USD}")` } },
      { label: 'NEW PER-GUEST', value: { formula: `TEXT(IFERROR(${SETUP.BUDGET_CAP}/MAX(1,${SETUP.GUEST_COUNT}-E12),0),"${FMT_USD}")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Variable-cost-per-guest categories',
    'Catering / bar / favors / cake scale linearly with guest count. Venue / photography / florals largely do not.', 'B:L');

  addTableHeader(sheet, 9, ['Category', 'Total', 'Variable?', 'Per-guest cost', 'Notes'],
    ['B', 'C', 'D', 'E', 'F']);

  const cpgRows = [
    { name: 'Catering + Bar',     total: 5200,  variable: 'Yes', notes: '~$43/head food + $5 bar' },
    { name: 'Cake / dessert',     total: 650,   variable: 'Yes', notes: '~$5.50/head' },
    { name: 'Favors',             total: 180,   variable: 'Yes', notes: '~$1.50/favor' },
    { name: 'Stationery',         total: 380,   variable: 'Yes', notes: '~$3/invitation + RSVP' },
    { name: 'Venue + Rentals',    total: 9800,  variable: 'No',  notes: 'Flat — not per guest' },
    { name: 'Photography + Video',total: 4200,  variable: 'No',  notes: 'Flat — not per guest' },
    { name: 'Flowers + Decor',    total: 2700,  variable: 'No',  notes: 'Centerpieces scale with table count, not seats' },
    { name: 'Music + Entmt',      total: 1850,  variable: 'No',  notes: 'Flat — not per guest' },
  ];
  cpgRows.forEach((row, i) => {
    const ri = 10 + i;
    setCell(sheet, `B${ri}`, row.name,    { font: FONTS.bodyBold, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, row.total,    { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right' } });
    setCell(sheet, `D${ri}`, row.variable, { font: FONTS.body, align: { horizontal: 'center' } });
    setCell(sheet, `E${ri}`,
      { formula: `IF(D${ri}="Yes",C${ri}/MAX(1,${SETUP.GUEST_COUNT}),0)` },
      { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, num: FMT_USD_C, align: { horizontal: 'right' } });
    setCell(sheet, `F${ri}`, row.notes, { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
  });

  // What-if slider — input cell at E12 (shared with KPI top-bar formula)
  r = addSectionHeader(sheet, 20, 'What-if — cut N guests',
    'Set the cut count below. The KPI tiles up top recompute live.', 'B:L');

  setCell(sheet, `B${r + 1}`, 'Cut this many guests',
    { font: FONTS.bodyBold, align: { horizontal: 'right', indent: 1, vertical: 'middle' } });
  // Pin slider cell to E12 to match top-bar formula
  setCell(sheet, `E12`, 20,
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: FILL_MAUVE, align: { horizontal: 'center', vertical: 'middle' } });
  sheet.getCell(`E12`).dataValidation = {
    type: 'whole', operator: 'between', formulae: [0, 200], allowBlank: false,
    showInputMessage: true, prompt: 'Enter any number between 0 and 200',
  };

  // Variable cost per guest cell — referenced by KPI
  setCell(sheet, `B${r + 2}`, 'Per-guest variable savings',
    { font: FONTS.bodyBold, align: { horizontal: 'right', indent: 1, vertical: 'middle' } });
  setCell(sheet, `E14`,
    { formula: `SUMIF(D10:D17,"Yes",E10:E17)` },
    { font: { ...FONTS.bodyBold, color: argb(SAGE) }, num: FMT_USD_C, align: { horizontal: 'right' } });

  addCallout(sheet, `B${r + 4}:L${r + 5}`,
    '🤖',
    'AI Guest List Optimizer (AI Edition)',
    'Cut fairly across both sides. Paste your guest list + a target cut count, get back a cut list with rationale and side-balance check. AI Edition tab includes the prompt template + a worked example.');
  sheet.getRow(r + 4).height = 30; sheet.getRow(r + 5).height = 30;

  addFooter(sheet, r + 8, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 14 — ⚖️ VENDOR COMPARISON (Pro+)
// ============================================================================

function buildVendorComparison(workbook) {
  const sheet = workbook.addWorksheet('⚖️ Vendor Comparison');
  setTabColor(sheet, AMBER_WED);
  setupColumns(sheet, { A: 2, B: 22, C: 16, D: 16, E: 16, F: 16, G: 16, H: 16, I: 16, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '⚖️ Vendor Comparison',
    tabSubtitle: 'Side-by-side 3-way comparison: price, deliverables, reviews, gut-feel. Score and pick.',
    bannerText: BANNERS.noSub,
    kpiData: [
      { label: 'CATEGORIES',  value: '3 sample' },
      { label: 'OPTIONS',     value: '3 / category' },
      { label: 'SCORE BASIS', value: 'price 40% · deliverables 35% · reviews 15% · gut 10%' },
      { label: 'TOP PICK',    value: { formula: `IFERROR(INDEX(C5:E5,MATCH(MAX(C15:E15),C15:E15,0)),"—")` } },
      { label: 'TOP SCORE',   value: { formula: `MAX(C15:E15)` } },
      { label: 'WHAT NEXT',   value: 'Re-quote / negotiate' },
    ],
  });

  // Header row 4 — category label
  setCell(sheet, `B4`, 'CATEGORY: Photography',
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: FILL_MAUVE, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });

  // Vendor names row 5
  setCell(sheet, `B5`, 'Vendor →',
    { font: FONTS.bodyBold, fill: FILL_IVORY, align: { horizontal: 'right', indent: 1, vertical: 'middle' } });
  ['Emma Carter Photo', 'Lone Star Lens', 'Hill Country Films'].forEach((name, i) => {
    setCell(sheet, `${['C','D','E'][i]}5`, name,
      { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, fill: FILL_DUSTY_LT, align: { horizontal: 'center', vertical: 'middle' } });
  });

  // Comparison rows
  const compareRows = [
    { label: 'Total price',           values: [4200, 2900, 5800], num: FMT_USD,    score: 'price' },
    { label: 'Hours covered',         values: ['8 hr', '6 hr', '10 hr'] },
    { label: 'Shooters',              values: [2, 1, 2] },
    { label: 'Photos delivered',      values: ['~600', '~300', '~800'] },
    { label: 'Video included?',       values: ['No', 'No', 'Yes'] },
    { label: 'Reviews — Google',      values: ['4.9 / 130', '4.7 / 28', '4.8 / 95'] },
    { label: 'Reviews — Knot/WW',     values: ['5.0 / 60', '4.6 / 11', '4.7 / 42'] },
    { label: 'Engagement shoot inc?', values: ['Yes', 'No', 'Yes'] },
    { label: 'Deposit %',             values: ['30%', '50%', '25%'] },
    { label: 'Rights to images',      values: ['Personal use + print', 'Personal use only', 'Personal use + print'] },
    { label: 'Gut-feel score / 10',   values: [8, 6, 7] },
  ];
  compareRows.forEach((row, i) => {
    const ri = 6 + i;
    setCell(sheet, `B${ri}`, row.label, { font: FONTS.bodyBold, align: { horizontal: 'right', indent: 1, vertical: 'middle' } });
    row.values.forEach((v, ci) => {
      setCell(sheet, `${['C','D','E'][ci]}${ri}`, v,
        { font: FONTS.body, num: row.num || undefined, align: { horizontal: 'center', vertical: 'middle' } });
    });
  });

  // Score row at 15+5 = row 17 — weighted-scored
  setCell(sheet, `B17`, 'Score (auto)',
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, align: { horizontal: 'right', indent: 1, vertical: 'middle' } });
  // Move scores to row 15 (KPI references C15:E15)
  setCell(sheet, `B15`, 'Score (auto)',
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, align: { horizontal: 'right', indent: 1, vertical: 'middle' } });
  ['C','D','E'].forEach((col, i) => {
    // Price score: lower is better
    setCell(sheet, `${col}15`,
      { formula: `IFERROR(40*(MIN(C6:E6)/${col}6)+35*((${i === 0 ? 8 : i === 1 ? 5 : 9})/10)+15*(${i === 0 ? 4.95 : i === 1 ? 4.65 : 4.75}/5)+10*(${col}16/10),0)` },
      { font: { ...FONTS.bodyBold, color: argb(SAGE) }, num: '0.0', align: { horizontal: 'center' } });
  });

  // Recommendation row
  setCell(sheet, `B18`, 'Recommendation',
    { font: FONTS.bodyBold, align: { horizontal: 'right', indent: 1, vertical: 'middle' } });
  setCell(sheet, `C18`,
    { formula: `IF(C15=MAX(C15:E15),"✓ TOP PICK","—")` },
    { font: { ...FONTS.bodyBold, color: argb(SAGE) }, align: { horizontal: 'center', vertical: 'middle' } });
  setCell(sheet, `D18`,
    { formula: `IF(D15=MAX(C15:E15),"✓ TOP PICK","—")` },
    { font: { ...FONTS.bodyBold, color: argb(SAGE) }, align: { horizontal: 'center', vertical: 'middle' } });
  setCell(sheet, `E18`,
    { formula: `IF(E15=MAX(C15:E15),"✓ TOP PICK","—")` },
    { font: { ...FONTS.bodyBold, color: argb(SAGE) }, align: { horizontal: 'center', vertical: 'middle' } });

  // CF on score row 15
  sheet.addConditionalFormatting({
    ref: `C15:E15`,
    rules: [{ type: 'top10', priority: 1, rank: 1, percent: false, bottom: false,
              style: { font: { color: argb(COLORS.white), bold: true }, fill: FILL_SAGE } }],
  });

  // Notes row
  setCell(sheet, `B20`, 'Notes',
    { font: FONTS.bodyBold, align: { horizontal: 'right', indent: 1, vertical: 'top' } });
  ['C','D','E'].forEach((col, i) => {
    const notes = [
      'Award-winning, top reviews — at-market price for region+season. Best deliverables.',
      'Below market — under-booking or new. Single shooter risky for 120 guests.',
      'Above market — bundled video adds floor. Strong portfolio but bundled.',
    ];
    setCell(sheet, `${col}20`, notes[i],
      { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, vertical: 'top', wrapText: true } });
  });
  sheet.getRow(20).height = 50;

  addCallout(sheet, `B22:L23`,
    '🔍',
    'AI Vendor Cost Intelligence (AI Edition)',
    'Paste these quotes into ChatGPT or Claude with the AI Vendor Cost Intelligence prompt. AI tells you above / at / below market, lists missing deliverables, and gives you 2 questions to ask before signing.');
  sheet.getRow(22).height = 30; sheet.getRow(23).height = 30;

  addFooter(sheet, 26, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 15 — 💐 BRIDAL PARTY (Pro+)
// ============================================================================

function buildBridalParty(workbook) {
  const sheet = workbook.addWorksheet('💐 Bridal Party');
  setTabColor(sheet, SAGE);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 22, E: 16, F: 16, G: 16, H: 16, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '💐 Bridal Party',
    tabSubtitle: 'Bridesmaids / groomsmen / officiant / readers. Attire status, gift, role, address.',
    bannerText: BANNERS.privacy,
    kpiData: [
      { label: 'PARTY SIZE',     value: { formula: `COUNTA(B10:B25)` } },
      { label: 'ATTIRE READY',   value: { formula: `COUNTIF(E10:E25,"Ready")&" / "&COUNTA(B10:B25)` } },
      { label: 'GIFTS BOUGHT',   value: { formula: `COUNTIF(F10:F25,"Bought")&" / "&COUNTA(B10:B25)` } },
      { label: 'CONFIRMED ROLE', value: { formula: `COUNTA(D10:D25)&" / "&COUNTA(B10:B25)` } },
      { label: 'SHOWER PLANNED', value: 'See notes' },
      { label: 'BUDGET — GIFTS', value: { formula: `TEXT(SUM(G10:G25),"${FMT_USD}")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Bridal party roster',
    'Roles: Maid of Honor / Best Man / Bridesmaid / Groomsman / Reader / Officiant. Attire status drives the day-of dress + suit prep timeline.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Name', 'Side', 'Role', 'Attire status', 'Gift bought?', 'Gift budget', 'Address', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

  const partyRows = [
    ['Priya Sharma',     'Hers',  'Maid of Honor',  'Ready',     'Bought',  120, '',  ''],
    ['Marcus Holloway',  'His',   'Best Man',       'Ready',     'Bought',  120, '',  ''],
    ['Sasha Chen',       'Hers',  'Bridesmaid',     'Ready',     'Pending', 80,  '',  ''],
    ['Lin Park',         'Hers',  'Bridesmaid',     'Ordered',   'Pending', 80,  '',  ''],
    ['Olivia Mendez',    'Hers',  'Bridesmaid',     'In fitting','Pending', 80,  '',  'Pregnancy — re-measure 6/15'],
    ['Wes Hassan',       'His',   'Groomsman',      'Ready',     'Bought',  80,  '',  ''],
    ['Diego Vargas',     'His',   'Groomsman',      'Ready',     'Pending', 80,  '',  ''],
    ['Theo Reyes',       'His',   'Groomsman',      'In fitting','Pending', 80,  '',  ''],
    ['Marcia Lyle',      'Hers',  'Reader',         'Ready',     'Bought',  40,  '',  'Reading: love letter excerpt'],
    ['Jordan Hayes',     'His',   'Reader',         'Ready',     'Bought',  40,  '',  ''],
    ['Officiant — TBD',  'Joint', 'Officiant',      '—',         '—',       100, '',  'Honorarium'],
  ];
  partyRows.forEach((row, i) => {
    const ri = r + 2 + i;
    setCell(sheet, `B${ri}`, row[0], { font: FONTS.bodyBold, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, row[1], { font: FONTS.body, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: ['"His,Hers,Joint"'], allowBlank: true };
    setCell(sheet, `D${ri}`, row[2], { font: { ...FONTS.body, color: argb(DEEP_MAUVE) }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    sheet.getCell(`D${ri}`).dataValidation = { type: 'list', formulae: ['"Maid of Honor,Best Man,Bridesmaid,Groomsman,Reader,Officiant,Flower Girl,Ring Bearer"'], allowBlank: true };
    setCell(sheet, `E${ri}`, row[3], { font: FONTS.bodyBold, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`E${ri}`).dataValidation = { type: 'list', formulae: ['"Ordered,In fitting,Ready,Issue,—"'], allowBlank: true };
    setCell(sheet, `F${ri}`, row[4], { font: FONTS.bodyBold, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`F${ri}`).dataValidation = { type: 'list', formulae: ['"Pending,Bought,Wrapped,Given,—"'], allowBlank: true };
    setCell(sheet, `G${ri}`, row[5], { font: FONTS.body, num: FMT_USD, align: { horizontal: 'right' } });
    setCell(sheet, `H${ri}`, row[6], { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true } });
    setCell(sheet, `I${ri}`, row[7], { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true } });
  });

  // CF on attire status
  sheet.addConditionalFormatting({
    ref: `E${r + 2}:E${r + 1 + partyRows.length}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Ready',      priority: 1, style: { font: { color: argb(SAGE), bold: true }, fill: FILL_SAGE_LT } },
      { type: 'containsText', operator: 'containsText', text: 'In fitting', priority: 2, style: { font: { color: argb(AMBER_WED), bold: true }, fill: FILL_AMBER_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Issue',      priority: 3, style: { font: { color: argb(BURGUNDY), bold: true }, fill: FILL_BURG_LT } },
    ],
  });

  // CF on gifts
  sheet.addConditionalFormatting({
    ref: `F${r + 2}:F${r + 1 + partyRows.length}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Given',   priority: 1, style: { font: { color: argb(SAGE), bold: true }, fill: FILL_SAGE_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Wrapped', priority: 2, style: { font: { color: argb(SAGE), bold: true }, fill: FILL_SAGE_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Bought',  priority: 3, style: { font: { color: argb(DEEP_MAUVE), bold: true }, fill: FILL_MAUVE_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Pending', priority: 4, style: { font: { color: argb(AMBER_WED), bold: true }, fill: FILL_AMBER_LT } },
    ],
  });

  // Totals
  setCell(sheet, `B${r + 2 + partyRows.length + 1}`, 'GIFT BUDGET TOTAL',
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, align: { horizontal: 'left', indent: 1 } });
  setCell(sheet, `G${r + 2 + partyRows.length + 1}`, { formula: `SUM(G${r + 2}:G${r + 1 + partyRows.length})` },
    { font: { ...FONTS.bodyBold, color: argb(COLORS.white) }, fill: { type: 'pattern', pattern: 'solid', fgColor: argb(MATTE_BLACK) }, num: FMT_USD, align: { horizontal: 'right' } });

  addFooter(sheet, r + 2 + partyRows.length + 5, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 16 — 🎁 GIFT REGISTRY (Pro+)
// ============================================================================

function buildGiftRegistry(workbook) {
  const sheet = workbook.addWorksheet('🎁 Gift Registry');
  setTabColor(sheet, DUSTY_ROSE);
  setupColumns(sheet, { A: 2, B: 22, C: 16, D: 22, E: 14, F: 18, G: 18, H: 14, I: 14, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '🎁 Gift Registry',
    tabSubtitle: 'Store / item / link / price / who bought it / thank-you sent. Works across Amazon / Zola / Crate&Barrel / cash funds.',
    bannerText: BANNERS.privacy,
    kpiData: [
      { label: 'ITEMS',           value: { formula: `COUNTA(B10:B30)` } },
      { label: 'PURCHASED',       value: { formula: `COUNTIF(F10:F30,"<>")` } },
      { label: 'TOTAL VALUE',     value: { formula: `TEXT(SUM(E10:E30),"${FMT_USD}")` } },
      { label: 'PURCHASED VALUE', value: { formula: `TEXT(SUMIF(F10:F30,"<>",E10:E30),"${FMT_USD}")` } },
      { label: 'THX SENT',        value: { formula: `COUNTIF(H10:H30,"Sent")&" / "&COUNTIF(F10:F30,"<>")` } },
      { label: 'AVG PRICE',       value: { formula: `TEXT(IFERROR(SUM(E10:E30)/MAX(1,COUNTA(B10:B30)),0),"${FMT_USD}")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Registry items',
    'Add items here. Use the Link column for the registry URL. Thank-you status: Drafted / Sent / Reciprocated.', 'B:L');

  addTableHeader(sheet, 9,
    ['Item', 'Store', 'Link / SKU', 'Price', 'Purchased by', 'Date purchased', 'Thank-you', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

  const registryItems = [
    ['Le Creuset Dutch Oven',     'Crate & Barrel',  'crateandbarrel.com/le-creuset',     380, 'Aunt Linda',     new Date(2026, 8, 14), 'Sent',     ''],
    ['KitchenAid Stand Mixer',    'Williams Sonoma', 'williams-sonoma.com/kitchenaid',    450, 'Mike + Sara',    new Date(2026, 8, 16), 'Drafted',  ''],
    ['Pendleton Wool Blanket',    'Pendleton',       'pendleton-usa.com/blanket-x',       260, 'Marcus H.',      new Date(2026, 8, 20), 'Sent',     ''],
    ['Honeymoon — Lisbon hotel',  'Zola cash fund',  'withjoy.com/registry/honeymoon',    900, 'Various',        new Date(2026, 8, 25), 'Sent',     'Cash fund — split across givers'],
    ['Towel set (6-piece)',       'Macy\'s',         'macys.com/towel-set-x',             140, 'Cousin Daniel',  new Date(2026, 9, 1),  'Sent',     ''],
    ['Bedding — King set',        'Brooklinen',      'brooklinen.com/king-set',           290, '',               '',                      'Pending',  ''],
    ['Espresso machine',          'Breville',        'breville.com/barista-pro',          600, '',               '',                      'Pending',  ''],
    ['Yeti cooler (large)',       'Yeti',            'yeti.com/tundra-65',                400, '',               '',                      'Pending',  ''],
    ['Cast-iron skillet set',     'Lodge',           'lodgecastiron.com/set',              80, 'Aunt Rose',      new Date(2026, 8, 19), 'Drafted',  ''],
    ['Chef\'s knife set',         'Made In',         'madeincookware.com/knife-set',      280, '',               '',                      'Pending',  ''],
  ];
  registryItems.forEach((row, i) => {
    const ri = 10 + i;
    setCell(sheet, `B${ri}`, row[0], { font: FONTS.bodyBold, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `C${ri}`, row[1], { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `D${ri}`, row[2], { font: { ...FONTS.body, color: argb(DEEP_MAUVE) }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `E${ri}`, row[3], { font: { ...FONTS.bodyBold }, num: FMT_USD, align: { horizontal: 'right' } });
    setCell(sheet, `F${ri}`, row[4], { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    setCell(sheet, `G${ri}`, row[5], { font: FONTS.body, num: FMT_DATE, align: { horizontal: 'center', vertical: 'middle' } });
    setCell(sheet, `H${ri}`, row[6], { font: FONTS.bodyBold, align: { horizontal: 'center', vertical: 'middle' } });
    sheet.getCell(`H${ri}`).dataValidation = { type: 'list', formulae: ['"Pending,Drafted,Sent,Reciprocated"'], allowBlank: true };
    setCell(sheet, `I${ri}`, row[7], { font: { ...FONTS.bodyMuted, size: 10 }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
  });

  // CF on thank-you status
  sheet.addConditionalFormatting({
    ref: `H10:H30`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Sent',          priority: 1, style: { font: { color: argb(SAGE), bold: true }, fill: FILL_SAGE_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Drafted',       priority: 2, style: { font: { color: argb(DEEP_MAUVE), bold: true }, fill: FILL_MAUVE_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Pending',       priority: 3, style: { font: { color: argb(AMBER_WED), bold: true }, fill: FILL_AMBER_LT } },
      { type: 'containsText', operator: 'containsText', text: 'Reciprocated',  priority: 4, style: { font: { color: argb(SAGE), bold: true }, fill: FILL_SAGE_LT } },
    ],
  });

  addCallout(sheet, `B32:L33`,
    '💌',
    'Thank-you notes — 3-month convention',
    'Industry norm: send thank-yous within 3 months of receiving the gift (not the wedding). Track here so nothing gets missed. Cash funds count too — a heartfelt note matters.');
  sheet.getRow(32).height = 30; sheet.getRow(33).height = 30;

  addFooter(sheet, 36, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 17 — 🤖 AI WEDDING CO-PILOT HUB (AI Edition only — all 8 prompt cards)
// ============================================================================

function buildAICoPilotHub(workbook) {
  const sheet = workbook.addWorksheet('🤖 AI Wedding Co-Pilot');
  setTabColor(sheet, MATTE_BLACK);
  setupColumns(sheet, { A: 2, B: 20, C: 20, D: 20, E: 20, F: 20, G: 20, H: 20, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🤖 AI Wedding Co-Pilot',
    tabSubtitle: '8 ChatGPT/Claude prompts. Works in free tiers — no API key. Each prompt pairs with a tab below.',
    bannerText: BANNERS.whyXls,
    kpiData: [
      { label: 'PROMPTS',     value: '8' },
      { label: 'AI TOOLS',    value: 'ChatGPT / Claude' },
      { label: 'API KEY?',    value: 'No' },
      { label: 'COST',        value: 'Free tier' },
      { label: 'PDF',         value: '12-page companion' },
      { label: 'PERSONAS',    value: { formula: `${SETUP.PARTNER_A}&" + "&${SETUP.PARTNER_B}` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, '8 prompt cards — 2 × 4 grid',
    'Click a card to jump to that prompt\'s tab (linked tabs marked with ↗). Cards without a linked tab are in the AI Co-Pilot PDF only.', 'B:L');

  const cards = [
    { title: '1. Guest List Optimizer',     tab: "'✂️ Guest List Optimizer'!A1",
      summary: 'Cut N guests fairly across both sides. Respects must-attend flags.', linked: true },
    { title: '2. Vendor Cost Intelligence', tab: "'🔍 Vendor Cost Intelligence'!A1",
      summary: 'Paste 2–4 quotes. AI says above/at/below market, lists missing deliverables.', linked: true },
    { title: '3. Seating Constraint Solver',tab: "'🧩 Seating Constraint Solver'!A1",
      summary: 'X can\'t sit near Y, Z needs accessibility. AI gives a constraint-satisfying plan.', linked: true },
    { title: '4. RSVP Reminder Scripts',    tab: "'📩 RSVP Reminder Scripts'!A1",
      summary: '3 polite escalation scripts (30 / 14 / 7 days out). Tone-tunable.', linked: true },
    { title: '5. Wedding Vows Drafter',     tab: '',
      summary: '3 drafts in your tone, drawing on your story. PDF page 7. (No dedicated tab — paste-only.)', linked: false },
    { title: '6. Day-of Crisis Playbook',   tab: "'🚨 Day-of Crisis Playbook'!A1",
      summary: '12 pre-written scripts. Vendor late / wardrobe / family / weather / uninvited.', linked: true },
    { title: '7. Vendor Negotiation Scripts', tab: '',
      summary: 'Email script + 2 fallbacks + walk-away point. PDF page 9.', linked: false },
    { title: '8. Speech Drafter',           tab: '',
      summary: 'Best man / maid of honor / parent — 4-part structured. PDF page 10.', linked: false },
  ];

  // Lay out 4 rows × 2 columns
  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const row = Math.floor(i / 2);
    const col = i % 2;
    const colStart = col === 0 ? 'B' : 'F';
    const colEnd   = col === 0 ? 'E' : 'I';
    const rowStart = r + 1 + row * 3;

    // Card header
    sheet.mergeCells(`${colStart}${rowStart}:${colEnd}${rowStart}`);
    const head = sheet.getCell(`${colStart}${rowStart}`);
    head.value = c.title + (c.linked ? ' ↗' : '');
    head.font = { ...FONTS.bodyBold, color: argb(COLORS.white), size: 13 };
    head.fill = c.linked ? FILL_MAUVE : FILL_DUSTY;
    head.alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
    head.border = BORDER_THIN(MATTE_BLACK);
    if (c.tab) head.value = { formula: `HYPERLINK("#"&"${c.tab}","${c.title} ↗")` };
    sheet.getRow(rowStart).height = 28;

    // Card body
    sheet.mergeCells(`${colStart}${rowStart + 1}:${colEnd}${rowStart + 1}`);
    const body = sheet.getCell(`${colStart}${rowStart + 1}`);
    body.value = c.summary;
    body.font = FONTS.body;
    body.fill = FILL_IVORY;
    body.alignment = { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true };
    body.border = BORDER_THIN(WARM_GRAY);
    sheet.getRow(rowStart + 1).height = 36;

    // Spacer
    sheet.getRow(rowStart + 2).height = 6;
  }

  r = r + 1 + 4 * 3 + 1;

  addCallout(sheet, `B${r}:L${r + 1}`,
    '📄',
    'Companion PDF — `AI Wedding Co-Pilot` (12 pages)',
    'All 8 prompts ship as a separate PDF with full prompt templates + worked examples. Open the PDF + the matching tab side-by-side, fill in placeholders, paste into ChatGPT or Claude. Free tiers work.');
  sheet.getRow(r).height = 30; sheet.getRow(r + 1).height = 30;

  r = addSectionHeader(sheet, r + 4, 'Which AI should I use?',
    'Both work in their free tiers. Different strengths.', 'B:L');

  const aiTips = [
    ['ChatGPT (free)', 'Best for: Speech Drafter, Vendor Negotiation, RSVP Reminders, Vows Drafter. Strength: conversational tone, easy to revise. Limit: ~3–4K word context per message.'],
    ['Claude (free)',  'Best for: Guest List Optimizer, Seating Constraint Solver, Vendor Cost Intelligence. Strength: longer inputs in one message, clean table output. Limit: per-day message cap on free tier.'],
    ['Paid tiers',     'Worth it if you\'ll use the prompts heavily over 2–3 months. Skip if one-off use — free tiers do the job.'],
  ];
  aiTips.forEach((t, i) => {
    const ri = r + 1 + i;
    setCell(sheet, `B${ri}`, t[0], { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, align: { horizontal: 'left', indent: 1, vertical: 'middle' } });
    sheet.mergeCells(`C${ri}:L${ri}`);
    setCell(sheet, `C${ri}`, t[1], { font: FONTS.body, align: { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true } });
    sheet.getRow(ri).height = 32;
  });

  addFooter(sheet, r + 1 + aiTips.length + 3, { productName: PRODUCT_NAME });
}

// ============================================================================
// AI TAB HELPER — every prompt tab has the same structure (top bar + prompt
// card + worked example + tab-callout chip). Shared to avoid repetition.
// ============================================================================

function buildAIPromptTab(workbook, opts) {
  const { name, tabColor, title, tabPairs, intro, promptText, exampleInput, exampleOutput, footer } = opts;
  const sheet = workbook.addWorksheet(name);
  setTabColor(sheet, tabColor);
  setupColumns(sheet, { A: 2, B: 14, C: 76, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: name,
    tabSubtitle: intro,
    bannerText: BANNERS.privacy,
    kpiData: [
      { label: 'PROMPT',      value: title },
      { label: 'AI TOOL',     value: 'ChatGPT / Claude (free tier)' },
      { label: 'PAIRS WITH',  value: tabPairs },
      { label: 'TIME',        value: '~3 min' },
      { label: 'OUTPUT',      value: 'Structured' },
      { label: 'PDF PAGE',    value: footer || '' },
    ],
  });

  // Big tab-pair chip
  sheet.mergeCells('B6:L6');
  const chip = sheet.getCell('B6');
  chip.value = `Pairs with: ${tabPairs}`;
  chip.font = { name: 'Inter', size: 11, bold: true, color: argb(COLORS.white) };
  chip.fill = FILL_DUSTY;
  chip.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(6).height = 24;

  let r = addSectionHeader(sheet, 8, title,
    'Copy-paste-ready. Replace the [PLACEHOLDERS] with your data, then paste into ChatGPT or Claude.', 'B:L');

  // Prompt card
  setCell(sheet, `B${r + 1}`, '📋 PROMPT',
    { font: { ...FONTS.bodyBold, color: argb(DEEP_MAUVE) }, align: { horizontal: 'left', indent: 1, vertical: 'top' } });
  sheet.mergeCells(`C${r + 1}:L${r + 1}`);
  setCell(sheet, `C${r + 1}`, promptText,
    { font: { name: 'Consolas', size: 10, color: argb(COLORS.charcoal) }, fill: FILL_IVORY,
      align: { horizontal: 'left', indent: 1, vertical: 'top', wrapText: true } });
  sheet.getRow(r + 1).height = 360;

  // Worked example — input
  setCell(sheet, `B${r + 3}`, '🔬 EXAMPLE INPUT',
    { font: { ...FONTS.bodyBold, color: argb(SAGE) }, align: { horizontal: 'left', indent: 1, vertical: 'top' } });
  sheet.mergeCells(`C${r + 3}:L${r + 3}`);
  setCell(sheet, `C${r + 3}`, exampleInput,
    { font: { ...FONTS.body, size: 10 }, fill: FILL_SAGE_LT,
      align: { horizontal: 'left', indent: 1, vertical: 'top', wrapText: true } });
  sheet.getRow(r + 3).height = 130;

  // Worked example — output
  setCell(sheet, `B${r + 5}`, '✓ EXAMPLE OUTPUT',
    { font: { ...FONTS.bodyBold, color: argb(SAGE) }, align: { horizontal: 'left', indent: 1, vertical: 'top' } });
  sheet.mergeCells(`C${r + 5}:L${r + 5}`);
  setCell(sheet, `C${r + 5}`, exampleOutput,
    { font: { ...FONTS.body, size: 10 }, fill: FILL_SAGE_LT,
      align: { horizontal: 'left', indent: 1, vertical: 'top', wrapText: true } });
  sheet.getRow(r + 5).height = 180;

  addFooter(sheet, r + 8, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 18 — ✂️ AI GUEST LIST OPTIMIZER (AI only)
// ============================================================================

function buildAIGuestListOptimizer(workbook) {
  buildAIPromptTab(workbook, {
    name: '✂️ Guest List Optimizer',
    tabColor: DUSTY_ROSE,
    title: 'Cut N guests fairly across both sides',
    tabPairs: '👥 Guest List + 🤖 AI Wedding Co-Pilot',
    intro: 'Paste your guest list + a target cut count. AI returns a cut list with rationale, side-balance check, and budget impact.',
    footer: 'PDF page 3 / 12',
    promptText:
`You are helping me cut my wedding guest list fairly. Here is the situation:

CURRENT COUNT: [number] guests
TARGET COUNT: [number] guests (I need to cut [N] people)
WEDDING DATE: [date]
BUDGET CONSTRAINT: [optional — e.g., "$30k cap, $200/head average"]

Here is my guest list (paste from the 👥 Guest List tab — name, side, relationship, must-attend flag):

[PASTE GUEST LIST HERE]

Rules I want you to follow:
- Cut equally from both sides where possible.
- Never cut a "must-attend" person (those marked Y in the Must column).
- Prefer to cut acquaintances and plus-ones over family.
- Treat "joint" friends as cuttable from neither side preferentially.
- If both members of a couple are on the list, treat them as one unit.

Return a table with three columns:
1. Person/couple to cut
2. Side (his/hers/joint)
3. Rationale (one sentence)

Then give me a one-paragraph summary of total people cut, side balance, and estimated budget impact at $200/head.`,
    exampleInput:
`Current: 140 · Target: 120 · Need to cut 20
Wedding: Oct 12, 2026 · $32k cap, ~$200/head

Guests (excerpt):
- Mike Davis | his | high school friend | (not must-attend)
- Sarah Chen | hers | college roommate | must-attend
- Tom & Kate | joint | colleagues from old job | (not must-attend)
- Aunt Linda | his | aunt | must-attend
- Jess Park | his | gym friend | (not must-attend)
... [continue list]`,
    exampleOutput:
`| Cut | Side | Why |
|---|---|---|
| Mike Davis | his | High school friend, no recent contact |
| Jess Park | his | Gym friend — connection is current but not deep |
| Tom & Kate | joint | Former colleagues; haven't seen in 2+ years |
| Coworker A + plus-one | hers | Work-only relationship, recent hire |
| Coworker B + plus-one | his | Work-only relationship |
| Mom's friend C + plus-one | hers | Mom's friend, not yours |
... [continues]

SUMMARY:
Total cut: 20 guests (10 each side — perfectly balanced).
Budget impact: ~$4,000 saved at $200/head.
Side balance: even. Suggest a courtesy heads-up to Mike + Jess before they hear it secondhand.`,
  });
}

// ============================================================================
// TAB 19 — 🔍 AI VENDOR COST INTELLIGENCE (AI only)
// ============================================================================

function buildAIVendorCostIntelligence(workbook) {
  buildAIPromptTab(workbook, {
    name: '🔍 Vendor Cost Intelligence',
    tabColor: AMBER_WED,
    title: 'Above market, at market, below market — and what to ask before signing',
    tabPairs: '🤝 Vendor Tracker + ⚖️ Vendor Comparison',
    intro: 'Paste 2–4 vendor quotes. AI flags pricing vs market, lists missing deliverables, gives questions to ask before signing.',
    footer: 'PDF page 4 / 12',
    promptText:
`You are helping me evaluate vendor quotes for my wedding. Tell me which are fair, which are red-flagged, and what questions to ask before signing.

VENDOR CATEGORY: [photography / catering / florist / DJ / videography / venue / hair-makeup / etc.]
REGION: [city, state OR metro area]
SEASON: [spring / summer / fall / winter] / [peak or off-peak month if known]
GUEST COUNT: [number]

QUOTES (paste 2–4 from your 🤝 Vendor Tracker tab):

QUOTE 1
  Vendor name: [name]
  Total price: $[amount]
  What's included: [deliverables]
  Travel fee: [yes/no — $amount]
  Deposit required: [%]

QUOTE 2
  [same fields]

[Add more quotes as needed]

For each quote, tell me:
1. Is the total price ABOVE, AT, or BELOW fair market for that region + season + category?
2. What's missing from the deliverables that competitors usually include?
3. Two specific questions I should ask before signing.
4. One red flag I should look for in the contract.

Then rank the quotes 1 (best value) to N (worst value) and tell me which one you'd pick and why.`,
    exampleInput:
`Category: Photography · Region: Austin, TX · Season: October (peak) · Guests: 120
Quote 1: Emma Carter Photo — $4,200 — 8hr, 2 shooters, ~600 edited, gallery, USB
Quote 2: Lone Star Lens — $2,900 — 6hr, 1 shooter, ~300 edited, gallery only
Quote 3: Hill Country Films — $5,800 — 10hr, 2 shooters, video add-on, ~800 edited`,
    exampleOutput:
`Quote 1 — AT MARKET. Austin peak-season comp for 2-shooter, 8hr is $3,800–$4,500. Missing: engagement shoot add-on (often $500 elsewhere). Ask: (1) Print release vs. usage rights? (2) Backup-shooter policy if Emma is sick? Red flag: deposit > 50% is unusual.

Quote 2 — BELOW MARKET. Either she's new or underbooking. Missing: 2nd shooter (matters for 120-guest event). Ask: (1) How many weddings shot this year? (2) Sample full gallery, not just highlights. Red flag: edits-only-300 is light for the price.

Quote 3 — ABOVE MARKET. Adding video raises floor to $5,000+. Missing: probably nothing. Ask: (1) Same team for video + photo, or subcontracted? (2) Drone permit included? Red flag: bundled video sometimes means weaker photo work.

RANK: 1 = Emma Carter, 2 = Hill Country Films, 3 = Lone Star Lens.
Pick: Emma Carter. Strongest deliverables-to-price ratio, market-fair, established.`,
  });
}

// __END_OF_FILE_SENTINEL__
