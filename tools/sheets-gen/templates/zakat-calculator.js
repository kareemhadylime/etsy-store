/**
 * Zakat Calculator — Google Sheets template generator (Lime Premium Studios) — v1
 *
 * Product 8 in the catalog. Cascades the Premium Finance House pattern (Budget
 * Tracker → Debt Payoff → Sinking Funds → Net Worth → Small Business → Family
 * → Investment Portfolio). Per design brief, this product applies one subtle
 * per-product override: deep-teal #2C5F5D accent on KPI cells + section dividers
 * (<5% surface coverage; respect the brand pack — warm gold stays primary).
 * No crescent/star iconography (explicit scope exclusion).
 *
 * The depth differentiator: 18 product tabs covering every modern Zakat asset
 * (cash + gold + silver + crypto + Sukuk + EOSB + rental + agricultural + Qada
 * + Zakat al-Fitr + Family Consolidation) + Madhhab-aware ruling logic +
 * mandatory fatwa citations in the AI Advisor.
 *
 * Pricing: $9 / $19 / $29 (lowest-tier in the catalog — religious motivation =
 * low price resistance + near-zero Etsy competition).
 *
 * Source of truth:
 *   - docs/product-proposals/zakat-calculator.md           (22-tab feature list)
 *   - docs/product-content/zakat-calculator-ai-prompts.md  (12-pg AI PDF source)
 *
 * Spine architecture (catalog-wide standing rule):
 *   - 📥 Input Tab    — `📋 Wealth Inventory` + paired `⚙️ Madhhab Settings`
 *   - 📊 Output Dashboard — `🏠 Dashboard` (Nisab status gauge + Hawl meter +
 *                                          per-asset Zakat due + Fitr ribbon +
 *                                          8-category distribution donut)
 *
 * Tier model (post-applyTierVisibility):
 *   - Essentials ($9)  — 11 visible (10 core + About)
 *   - Pro ($19)        — 20 visible (19 core + About)
 *   - AI Edition ($29) — 21 visible (20 core + About)
 *
 * Run: node tools/sheets-gen/templates/zakat-calculator.js --tier=<essentials|pro|ai>
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

const PRODUCT_NAME = 'Zakat Calculator';

// Per-product override — deep teal accent for Islamic-finance association
// (used SPARINGLY: KPI cell labels + a few section-header underlines only).
const TEAL_DEEP = 'FF2C5F5D';
const TEAL_LIGHT = 'FFD4E3E2';

// ============================================================================
// TAB DEFINITIONS — 22 tabs across 3 tiers (21 core + About)
// ============================================================================

// PRO tabs — 9 sheets removed for Essentials
const PRO_TABS = new Set([
  '📅 Hawl Tracker',
  '📈 Stocks Zakat',
  '💰 Sukuk Tracker',
  '🏠 Rental Property',
  '🌾 Agricultural Zakat',
  '🏦 EOSB & Pension',
  '⏳ Qada Zakat',
  '🤝 Distribution Tracker',
  '📅 Partial Payment Plan',
  '👨‍👩‍👧 Family Consolidation',
]);

// AI tabs — removed for Pro + Essentials
const AI_TABS = new Set([
  '🤖 AI Zakat Advisor',
]);

// Banner — shared across every tab. Anti-online-calculator framing (no SaaS to
// compare against in this category — instead pitch depth + fatwa citations).
const BANNER = '✦  Why a Spreadsheet, Not an Online Calculator?   Free Zakat calculators handle 5% of your situation. 22 tabs. 4 Madhhabs. Hawl tracker. Qada history. Fatwa citations. Your wealth data stays on your device.';

// Wealth Inventory invariants — every downstream tab references these by absolute row.
// 14 asset class rows.
const INVENTORY = {
  HEADER_ROW: 8,
  FIRST_ROW: 9,
  LAST_ROW: 22,         // 14 asset class rows
  ROW_COUNT: 14,
  TOTAL_ROW: 24,
  CATEGORIES: [
    'Cash on hand',
    'Bank — Checking',
    'Bank — Savings (HYSA)',
    'Foreign currency',
    'Gold (grams, physical)',
    'Silver (grams, physical)',
    'Refundable deposits',
    'Hajj / Umrah savings',
    'Business inventory (resale)',
    'Business receivables (likely)',
    'Personal receivables (likely)',
    'Insurance cash value (Takaful)',
    'Pension — accessible portion',
    'Other Zakatable assets',
  ],
};

// Liabilities (deductions) — appears on Zakat Calculator tab as a small block.
const DEDUCTIONS = {
  FIRST_ROW: 30,
  LAST_ROW: 35,
  ROW_COUNT: 6,
  TOTAL_ROW: 37,
  CATEGORIES: [
    'Debts due within 12 lunar months',
    'Utility bills owed',
    'Rent / mortgage due',
    'Personal debts (qualifying)',
    'Business payables (operational)',
    'Other qualifying deductions',
  ],
};

// Settings & FX cell refs — Madhhab Settings + Multi-Currency tab share constants.
const SETTINGS = {
  MADHHAB_CELL: "'⚙️ Madhhab Settings'!E10",
  NISAB_METHOD_CELL: "'⚖️ Nisab Calculator'!E12",
  BASE_CURRENCY_CELL: "'🌐 Multi-Currency'!E10",
  GOLD_SPOT_CELL: "'⚖️ Nisab Calculator'!E14",
  SILVER_SPOT_CELL: "'⚖️ Nisab Calculator'!E16",
};

// Zakat rate (universal across Madhhabs — 2.5% / 1/40th)
const ZAKAT_RATE = 0.025;

// 8 eligible categories (Surah At-Tawbah 9:60) — Distribution Tracker source of truth
const DISTRIBUTION_CATEGORIES = [
  'Fuqara (extreme poor)',
  'Masakin (needy)',
  'Amileen (admin)',
  "Mu'allafah Qulubuhum",
  'Riqab (free from bondage)',
  'Gharimin (debtors)',
  'Fi Sabilillah',
  'Ibn al-Sabil (wayfarer)',
];

// ============================================================================
// TAB 1 — 🏠 DASHBOARD (Output spine — Bundle hero source)
// ============================================================================

function buildDashboard(workbook) {
  const sheet = workbook.addWorksheet('🏠 Dashboard');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 18, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏠 Dashboard',
    tabSubtitle: 'Your Zakat at a glance — recomputes the moment you edit Wealth Inventory or change Nisab method.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL ZAKATABLE', value: { formula: `TEXT(MAX(0,'📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW}-'💰 Zakat Calculator'!H${DEDUCTIONS.TOTAL_ROW}),"$#,##0")` } },
      { label: 'NISAB STATUS',    value: { formula: `IF('📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW}>='⚖️ Nisab Calculator'!E22,"✓ Above","⚠ Below")` } },
      { label: 'ZAKAT DUE',       value: { formula: `TEXT(MAX(0,('📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW}-'💰 Zakat Calculator'!H${DEDUCTIONS.TOTAL_ROW}))*${ZAKAT_RATE},"$#,##0")` } },
      { label: 'MADHHAB',         value: { formula: `${SETTINGS.MADHHAB_CELL}` } },
      { label: 'NISAB METHOD',    value: { formula: `${SETTINGS.NISAB_METHOD_CELL}` } },
      { label: 'PAID YTD',        value: { formula: `TEXT(SUM('🤝 Distribution Tracker'!F12:F19),"$#,##0")` } },
    ],
  });

  // === SECTION 1 — Nisab Status Gauge (Visual #1 per design brief) ===
  let r = addSectionHeader(sheet, 6, 'Nisab status — are you above the threshold?', 'Gold-Nisab default (Maliki/Shafi\'i/Hanbali). Hanafi typically silver. Change on ⚖️ Nisab Calculator.', 'B:L');

  // Big gauge: total Zakatable vs Nisab threshold
  sheet.mergeCells(`B${r + 1}:E${r + 4}`);
  const gauge = sheet.getCell(`B${r + 1}`);
  gauge.value = { formula: `IF('📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW}>='⚖️ Nisab Calculator'!E22,"✓ ABOVE NISAB","⚠ BELOW NISAB")` };
  gauge.font = { name: 'Inter', size: 32, bold: true, color: argb(COLORS.success) };
  gauge.alignment = { vertical: 'middle', horizontal: 'center' };
  gauge.fill = FILLS.successLight;
  gauge.border = BORDER_THIN();

  sheet.mergeCells(`F${r + 1}:I${r + 1}`);
  sheet.getCell(`F${r + 1}`).value = 'Wealth (Zakatable)';
  sheet.getCell(`F${r + 1}`).font = { name: 'Inter', size: 9, bold: true, color: argb(COLORS.textMuted) };
  sheet.getCell(`F${r + 1}`).alignment = { horizontal: 'left', indent: 1 };

  sheet.mergeCells(`F${r + 2}:I${r + 2}`);
  sheet.getCell(`F${r + 2}`).value = { formula: `TEXT('📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW},"$#,##0")` };
  sheet.getCell(`F${r + 2}`).font = { name: 'Inter', size: 22, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell(`F${r + 2}`).alignment = { horizontal: 'left', indent: 1 };

  sheet.mergeCells(`F${r + 3}:I${r + 3}`);
  sheet.getCell(`F${r + 3}`).value = 'Nisab threshold';
  sheet.getCell(`F${r + 3}`).font = { name: 'Inter', size: 9, bold: true, color: argb(COLORS.textMuted) };
  sheet.getCell(`F${r + 3}`).alignment = { horizontal: 'left', indent: 1 };

  sheet.mergeCells(`F${r + 4}:I${r + 4}`);
  sheet.getCell(`F${r + 4}`).value = { formula: `TEXT('⚖️ Nisab Calculator'!E22,"$#,##0")&" ("&${SETTINGS.NISAB_METHOD_CELL}&")"` };
  sheet.getCell(`F${r + 4}`).font = { name: 'Inter', size: 14, bold: true, color: argb(TEAL_DEEP) };
  sheet.getCell(`F${r + 4}`).alignment = { horizontal: 'left', indent: 1 };

  sheet.mergeCells(`J${r + 1}:L${r + 2}`);
  const zakatDue = sheet.getCell(`J${r + 1}`);
  zakatDue.value = { formula: `"ZAKAT DUE"&CHAR(10)&TEXT(MAX(0,('📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW}-'💰 Zakat Calculator'!H${DEDUCTIONS.TOTAL_ROW}))*${ZAKAT_RATE},"$#,##0")` };
  zakatDue.font = { name: 'Inter', size: 16, bold: true, color: argb(COLORS.white) };
  zakatDue.fill = { type: 'pattern', pattern: 'solid', fgColor: argb(TEAL_DEEP) };
  zakatDue.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  zakatDue.border = BORDER_THIN();

  sheet.mergeCells(`J${r + 3}:L${r + 4}`);
  const fitrDue = sheet.getCell(`J${r + 3}`);
  fitrDue.value = { formula: `"ZAKAT AL-FITR"&CHAR(10)&TEXT('🌙 Zakat al-Fitr'!F18,"$#,##0")&" · "&'🌙 Zakat al-Fitr'!E16&" people"` };
  fitrDue.font = { name: 'Inter', size: 11, bold: true, color: argb(COLORS.charcoal) };
  fitrDue.fill = FILLS.warmGoldLight;
  fitrDue.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  fitrDue.border = BORDER_THIN();

  for (let i = 0; i <= 4; i++) sheet.getRow(r + i).height = 28;

  // CF on gauge cell — green if above, alert if below
  sheet.addConditionalFormatting({
    ref: `B${r + 1}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'BELOW', priority: 1, style: { font: { color: argb(COLORS.alert), bold: true }, fill: FILLS.alertLight } },
    ],
  });

  // === SECTION 2 — Per-asset Zakat due breakdown (Visual #3 ranked bar) ===
  r = addSectionHeader(sheet, r + 7, 'Per-asset Zakat due — what you owe, broken out', 'Ranked descending. Helps you see which asset class drives most of the obligation.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Asset Class', 'Wealth', 'Zakatable?', 'Zakat Due', '% of Total'],
    ['B', 'C', 'D', 'E', 'F']);

  // 10 top asset-class rows pulled from Wealth Inventory
  for (let i = 0; i < 10; i++) {
    const ri = r + 2 + i;
    const inventoryRow = INVENTORY.FIRST_ROW + i;

    sheet.getCell(`B${ri}`).value = { formula: `'📋 Wealth Inventory'!B${inventoryRow}` };
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR('📋 Wealth Inventory'!N${inventoryRow},0)` };
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IF('📋 Wealth Inventory'!N${inventoryRow}>0,"✓","—")` };
    sheet.getCell(`D${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = { formula: `IFERROR('📋 Wealth Inventory'!N${inventoryRow}*${ZAKAT_RATE},0)` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR('📋 Wealth Inventory'!N${inventoryRow}/MAX(1,'📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW}),0)` };
    sheet.getCell(`F${ri}`).numFmt = '0.0%';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
  }

  // === SECTION 3 — Distribution donut (Visual #5) ===
  r = addSectionHeader(sheet, r + 14, 'Distribution by 8 eligible categories', 'Surah At-Tawbah 9:60. Tracks what you\'ve actually distributed this Hijri year. Plan on the 🤝 Distribution Tracker tab.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Category', 'Allocated %', 'Allocated $', 'Distributed $', 'Status'],
    ['B', 'C', 'D', 'E', 'F']);

  for (let i = 0; i < 8; i++) {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = DISTRIBUTION_CATEGORIES[i];
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR('🤝 Distribution Tracker'!D${12 + i},0)` };
    sheet.getCell(`C${ri}`).numFmt = '0%';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IFERROR('🤝 Distribution Tracker'!E${12 + i},0)` };
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = { formula: `IFERROR('🤝 Distribution Tracker'!F${12 + i},0)` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(IF(F${ri}>='🤝 Distribution Tracker'!E${12 + i},"✓ Met",IF('🤝 Distribution Tracker'!F${12 + i}>0,"⏳ Partial","—")),"—")` };
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
  }

  // Callouts
  addCallout(sheet, `B${r + 12}:L${r + 13}`,
    '⚖️',
    'Scholar Disclaimer',
    'Calculations and AI guidance based on mainstream scholarly positions (NZF UK, AAOIFI Standard 21, Islamic Relief, AMP India). Not a substitute for consultation with a qualified mufti for your specific situation. Mainstream rulings can differ across Madhhabs; this sheet surfaces those differences honestly.');
  sheet.getRow(r + 12).height = 30;
  sheet.getRow(r + 13).height = 30;

  addCallout(sheet, `B${r + 15}:L${r + 16}`,
    '🔒',
    'Privacy-first by design',
    'No accounts. No cloud sync. No third-party access. Your wealth profile, family details, and Madhhab selection live in your Google Drive — not on our server, not on anyone\'s server. Religious + financial sensitivity acknowledged.');
  sheet.getRow(r + 15).height = 30;
  sheet.getRow(r + 16).height = 30;

  addFooter(sheet, r + 19, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 2 — ⚙️ MADHHAB SETTINGS (Input pair — all tiers)
// ============================================================================

function buildMadhhabSettings(workbook) {
  const sheet = workbook.addWorksheet('⚙️ Madhhab Settings');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 22, F: 12, G: 12, H: 12, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '⚙️ Madhhab Settings',
    tabSubtitle: 'One-time setup — your Madhhab drives ruling logic across every downstream tab.',
    bannerText: BANNER,
    kpiData: [
      { label: 'MADHHAB', value: { formula: `E10` } },
      { label: 'HAWL MODEL', value: { formula: `IF(E10="Hanafi","Aggregate","Per-asset")` } },
      { label: 'NISAB DEFAULT', value: { formula: `IF(E10="Hanafi","Silver","Gold")` } },
      { label: 'DEBT RULE', value: { formula: `IF(E10="Hanafi","Permissive","Conservative")` } },
      { label: 'STOCKS METHOD', value: 'Choose per holding' },
      { label: 'VERSION', value: 'v1.0' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Pick your Madhhab', 'This selection drives Nisab default, Hawl tracking model, debt-deduction nuance, and several other rulings across the sheet. Pick once; stick with it across years.', 'B:L');

  sheet.getCell(`B${r + 2}`).value = 'My Madhhab:';
  sheet.getCell(`B${r + 2}`).font = FONTS.bodyBold;
  sheet.getCell(`B${r + 2}`).alignment = { horizontal: 'right', indent: 1 };

  sheet.getCell(`E${r + 2}`).value = 'Shafi\'i';
  sheet.getCell(`E${r + 2}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP), size: 14 };
  sheet.getCell(`E${r + 2}`).fill = FILLS.warmGoldLight;
  sheet.getCell(`E${r + 2}`).alignment = { horizontal: 'center' };
  sheet.getCell(`E${r + 2}`).border = BORDER_THIN();
  sheet.getCell(`E${r + 2}`).dataValidation = {
    type: 'list',
    formulae: ['"Hanafi,Maliki,Shafi\'i,Hanbali"'],
    allowBlank: false,
  };

  // === SECTION 2 — Madhhab comparison table ===
  r = addSectionHeader(sheet, r + 5, 'How your Madhhab affects rulings', 'Mainstream positions per NZF UK, AAOIFI Standard 21, AMP India. Scholars may differ; this is your starting point.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Topic', 'Hanafi', 'Maliki', 'Shafi\'i', 'Hanbali'],
    ['B', 'C', 'D', 'E', 'F']);

  const madhhabRows = [
    ['Nisab default',         'Silver',           'Gold',             'Gold',             'Gold'],
    ['Hawl model',            'Aggregate y/e',    'Per-asset',        'Per-asset',        'Per-asset'],
    ['Debt deduction',        'Permissive (12mo)','Conservative',     'Conservative',     'Conservative'],
    ['Niyyah timing',         'At payment',       'At payment',       'At Hawl OR payment', 'At payment'],
    ['Crop irrigation rate',  '10% / 5%',         '10% / 5%',         '10% / 5%',         '10% / 5%'],
    ['Family ind. liability', 'Per-person',       'Per-person',       'Per-person',       'Per-person'],
    ['Qada (missed years)',   'Required',         'Required',         'Required',         'Required'],
    ['Stocks intent toggle',  'Speculator/Div',   'Speculator/Div',   'Speculator/Div',   'Speculator/Div'],
  ];

  madhhabRows.forEach((row, i) => {
    const ri = r + 2 + i;
    row.forEach((cell, ci) => {
      const col = ['B','C','D','E','F'][ci];
      sheet.getCell(`${col}${ri}`).value = cell;
      sheet.getCell(`${col}${ri}`).font = ci === 0 ? FONTS.bodyBold : FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: ci === 0 ? 'left' : 'center', indent: ci === 0 ? 1 : 0 };
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    });
  });

  addCallout(sheet, `B${r + 12}:L${r + 13}`,
    '📚',
    'Scholarly sources cited in this sheet',
    'NZF UK (National Zakat Foundation), AAOIFI Standard 21 (Accounting and Auditing Organization for Islamic Financial Institutions), Islamic Relief Zakat Guide, AMP India (Association of Muslim Professionals). Imam Nawawi\'s Al-Majmu\' (Shafi\'i) for Qada doctrine. Surah At-Tawbah 9:60 (Quranic basis for 8 distribution categories).');
  sheet.getRow(r + 12).height = 32;
  sheet.getRow(r + 13).height = 32;

  addFooter(sheet, r + 17, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 3 — 📋 WEALTH INVENTORY (Input spine — all tiers)
// ============================================================================

function buildWealthInventory(workbook) {
  const sheet = workbook.addWorksheet('📋 Wealth Inventory');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 30, C: 12, D: 12, E: 12, F: 12, G: 12, H: 12, I: 12, J: 12, K: 12, L: 12, M: 12, N: 14, O: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📋 Wealth Inventory',
    tabSubtitle: 'Your wealth as of Hawl date. Enter values in your base currency. Gold/silver in grams flows to ⚖️ Nisab Calculator automatically.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL ZAKATABLE', value: { formula: `TEXT(N${INVENTORY.TOTAL_ROW},"$#,##0")` } },
      { label: 'NISAB METHOD',    value: { formula: `${SETTINGS.NISAB_METHOD_CELL}` } },
      { label: 'BASE CURRENCY',   value: { formula: `${SETTINGS.BASE_CURRENCY_CELL}` } },
      { label: 'ASSET CLASSES',   value: { formula: `COUNTIF(N${INVENTORY.FIRST_ROW}:N${INVENTORY.LAST_ROW},">0")` } },
      { label: 'NISAB STATUS',    value: { formula: `IF(N${INVENTORY.TOTAL_ROW}>='⚖️ Nisab Calculator'!E22,"✓ Above","⚠ Below")` } },
      { label: 'AS-OF DATE',      value: { formula: `TEXT(TODAY(),"mmm d, yyyy")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Wealth Inventory — enter values per asset class', 'Use the labels you find familiar ("Cash Account A", "Gulf EOSB") — no bank names required. Gold/Silver: enter grams; per-gram spot pulled from ⚖️ Nisab Calculator.', 'B:N');

  // Headers
  addTableHeader(sheet, r + 1,
    ['Asset class', 'Account A', 'Account B', 'Account C', 'Account D', 'Account E', 'Spot $/g', '—', '—', '—', '—', '—', 'Total (base)'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']);

  // 14 inventory rows
  for (let i = 0; i < INVENTORY.ROW_COUNT; i++) {
    const ri = INVENTORY.FIRST_ROW + i;
    const cat = INVENTORY.CATEGORIES[i];

    sheet.getCell(`B${ri}`).value = cat;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;

    // Seed values for sample persona (UAE Shafi'i ~$180K Zakatable)
    const seedRow = {
      'Cash on hand': [1200, 0, 0, 0, 0],
      'Bank — Checking': [6500, 0, 0, 0, 0],
      'Bank — Savings (HYSA)': [12000, 0, 0, 0, 0],
      'Foreign currency': [4000, 0, 0, 0, 0],
      'Gold (grams, physical)': [110, 0, 0, 0, 0],
      'Silver (grams, physical)': [600, 0, 0, 0, 0],
      'Refundable deposits': [3500, 0, 0, 0, 0],
      'Hajj / Umrah savings': [8000, 0, 0, 0, 0],
      'Business inventory (resale)': [0, 0, 0, 0, 0],
      'Business receivables (likely)': [0, 0, 0, 0, 0],
      'Personal receivables (likely)': [2500, 0, 0, 0, 0],
      'Insurance cash value (Takaful)': [0, 0, 0, 0, 0],
      'Pension — accessible portion': [40000, 0, 0, 0, 0],
      'Other Zakatable assets': [0, 0, 0, 0, 0],
    }[cat] || [0, 0, 0, 0, 0];

    // C..G — five account columns
    for (let c = 0; c < 5; c++) {
      const col = ['C','D','E','F','G'][c];
      sheet.getCell(`${col}${ri}`).value = seedRow[c] || null;
      // Gold/Silver rows hold grams; everything else holds currency
      const isMetal = cat.includes('grams');
      sheet.getCell(`${col}${ri}`).numFmt = isMetal ? '#,##0.00' : '"$"#,##0';
      sheet.getCell(`${col}${ri}`).font = FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    }

    // H — spot price column (only used by gold/silver rows; SPOT g/USD pulled from Nisab tab)
    if (cat.includes('Gold')) {
      sheet.getCell(`H${ri}`).value = { formula: `${SETTINGS.GOLD_SPOT_CELL}` };
    } else if (cat.includes('Silver')) {
      sheet.getCell(`H${ri}`).value = { formula: `${SETTINGS.SILVER_SPOT_CELL}` };
    } else {
      sheet.getCell(`H${ri}`).value = '—';
      sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    }
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    // I..M — reserved/spacer columns (kept narrow + dim for now)
    for (let c = 0; c < 5; c++) {
      const col = ['I','J','K','L','M'][c];
      sheet.getCell(`${col}${ri}`).value = null;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    }

    // N — Total in base currency. Metals: grams × spot. Cash: SUM(C:G).
    if (cat.includes('grams')) {
      sheet.getCell(`N${ri}`).value = { formula: `IFERROR((C${ri}+D${ri}+E${ri}+F${ri}+G${ri})*H${ri},0)` };
    } else {
      sheet.getCell(`N${ri}`).value = { formula: `IFERROR(SUM(C${ri}:G${ri}),0)` };
    }
    sheet.getCell(`N${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`N${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`N${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`N${ri}`).border = BORDER_THIN();
  }

  // Grand total row
  const tr = INVENTORY.TOTAL_ROW;
  sheet.getCell(`B${tr}`).value = 'TOTAL ZAKATABLE WEALTH';
  sheet.getCell(`B${tr}`).font = { ...FONTS.bodyBold, size: 12 };
  sheet.getCell(`B${tr}`).fill = FILLS.charcoal;
  sheet.getCell(`B${tr}`).font.color = argb(COLORS.white);
  sheet.getCell(`B${tr}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.mergeCells(`B${tr}:M${tr}`);

  sheet.getCell(`N${tr}`).value = { formula: `SUM(N${INVENTORY.FIRST_ROW}:N${INVENTORY.LAST_ROW})` };
  sheet.getCell(`N${tr}`).numFmt = '"$"#,##0';
  sheet.getCell(`N${tr}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell(`N${tr}`).fill = FILLS.charcoal;
  sheet.getCell(`N${tr}`).alignment = { horizontal: 'right' };
  sheet.getCell(`N${tr}`).border = BORDER_THIN();
  sheet.getRow(tr).height = 30;

  addCallout(sheet, `B${tr + 3}:N${tr + 4}`,
    '🪙',
    'Gold + Silver entered in grams',
    'The most accurate way to track precious metals for Zakat. Enter the physical weight you hold; spot price flows from ⚖️ Nisab Calculator (Google Sheets pulls live spot via GOOGLEFINANCE; Excel users update manually). 1 troy oz = 31.1g.');
  sheet.getRow(tr + 3).height = 30;
  sheet.getRow(tr + 4).height = 30;

  addCallout(sheet, `B${tr + 6}:N${tr + 7}`,
    '🏷️',
    'Label-not-leak discipline',
    'Use labels like "Cash Account A" or "Gulf EOSB" — not bank names or account numbers. The sheet doesn\'t need real identifiers to compute Zakat. If you later paste data into an AI tool (AI Edition), generic labels stay private.');
  sheet.getRow(tr + 6).height = 30;
  sheet.getRow(tr + 7).height = 30;

  addFooter(sheet, tr + 10, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 4 — ⚖️ NISAB CALCULATOR (All tiers)
// ============================================================================

function buildNisabCalculator(workbook) {
  const sheet = workbook.addWorksheet('⚖️ Nisab Calculator');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 12, D: 14, E: 14, F: 14, G: 12, H: 12, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '⚖️ Nisab Calculator',
    tabSubtitle: 'Gold (87.48g) or Silver (612.36g) threshold. Live spot via GOOGLEFINANCE (Google Sheets) or manual entry (Excel).',
    bannerText: BANNER,
    kpiData: [
      { label: 'METHOD',          value: { formula: `E12` } },
      { label: 'GOLD SPOT $/g',   value: { formula: `TEXT(E14,"$0.00")` } },
      { label: 'SILVER SPOT $/g', value: { formula: `TEXT(E16,"$0.00")` } },
      { label: 'GOLD NISAB',      value: { formula: `TEXT(E18,"$#,##0")` } },
      { label: 'SILVER NISAB',    value: { formula: `TEXT(E20,"$#,##0")` } },
      { label: 'ACTIVE NISAB',    value: { formula: `TEXT(E22,"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Pick your Nisab method', 'Hanafi default: Silver. Maliki/Shafi\'i/Hanbali default: Gold. NZF UK contemporary recommendation: Silver (more equitable; captures more wealth into obligation). Pick once, stick across years.', 'B:L');

  // Row 12: method selector
  sheet.getCell(`B12`).value = 'Nisab method:';
  sheet.getCell(`B12`).font = FONTS.bodyBold;
  sheet.getCell(`B12`).alignment = { horizontal: 'right', indent: 1 };

  sheet.getCell(`E12`).value = 'Gold';
  sheet.getCell(`E12`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
  sheet.getCell(`E12`).fill = FILLS.warmGoldLight;
  sheet.getCell(`E12`).alignment = { horizontal: 'center' };
  sheet.getCell(`E12`).border = BORDER_THIN();
  sheet.getCell(`E12`).dataValidation = {
    type: 'list',
    formulae: ['"Gold,Silver"'],
    allowBlank: false,
  };

  // Row 14: gold spot
  sheet.getCell(`B14`).value = 'Gold spot ($ / gram):';
  sheet.getCell(`B14`).font = FONTS.bodyBold;
  sheet.getCell(`B14`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E14`).value = 72.00;
  sheet.getCell(`E14`).numFmt = '"$"#,##0.00';
  sheet.getCell(`E14`).font = FONTS.body;
  sheet.getCell(`E14`).alignment = { horizontal: 'right' };
  sheet.getCell(`E14`).border = BORDER_THIN();
  sheet.getCell(`F14`).value = '← GOOGLEFINANCE("Currency:XAUUSD")/31.1';
  sheet.getCell(`F14`).font = FONTS.bodyMuted;

  // Row 16: silver spot
  sheet.getCell(`B16`).value = 'Silver spot ($ / gram):';
  sheet.getCell(`B16`).font = FONTS.bodyBold;
  sheet.getCell(`B16`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E16`).value = 0.95;
  sheet.getCell(`E16`).numFmt = '"$"#,##0.00';
  sheet.getCell(`E16`).font = FONTS.body;
  sheet.getCell(`E16`).alignment = { horizontal: 'right' };
  sheet.getCell(`E16`).border = BORDER_THIN();
  sheet.getCell(`F16`).value = '← GOOGLEFINANCE("Currency:XAGUSD")/31.1';
  sheet.getCell(`F16`).font = FONTS.bodyMuted;

  // Row 18: gold Nisab threshold
  sheet.getCell(`B18`).value = 'Gold Nisab (87.48g × spot):';
  sheet.getCell(`B18`).font = FONTS.bodyBold;
  sheet.getCell(`B18`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E18`).value = { formula: `87.48*E14` };
  sheet.getCell(`E18`).numFmt = '"$"#,##0';
  sheet.getCell(`E18`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
  sheet.getCell(`E18`).alignment = { horizontal: 'right' };
  sheet.getCell(`E18`).border = BORDER_THIN();

  // Row 20: silver Nisab threshold
  sheet.getCell(`B20`).value = 'Silver Nisab (612.36g × spot):';
  sheet.getCell(`B20`).font = FONTS.bodyBold;
  sheet.getCell(`B20`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E20`).value = { formula: `612.36*E16` };
  sheet.getCell(`E20`).numFmt = '"$"#,##0';
  sheet.getCell(`E20`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
  sheet.getCell(`E20`).alignment = { horizontal: 'right' };
  sheet.getCell(`E20`).border = BORDER_THIN();

  // Row 22: active Nisab (method-driven)
  sheet.getCell(`B22`).value = 'ACTIVE NISAB THRESHOLD:';
  sheet.getCell(`B22`).font = { ...FONTS.bodyBold, size: 13 };
  sheet.getCell(`B22`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E22`).value = { formula: `IF(E12="Silver",E20,E18)` };
  sheet.getCell(`E22`).numFmt = '"$"#,##0';
  sheet.getCell(`E22`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell(`E22`).fill = FILLS.charcoal;
  sheet.getCell(`E22`).alignment = { horizontal: 'right' };
  sheet.getCell(`E22`).border = BORDER_THIN();
  sheet.getRow(22).height = 28;

  // Comparison block
  r = addSectionHeader(sheet, 26, 'Why two methods?', 'At revelation, gold-Nisab ≈ silver-Nisab in purchasing power. Today, silver / gold ratio is ~85:1 vs historical 16:1 — silver-Nisab is ~10× lower in dollar terms.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Position', 'Method', 'Used by', 'Reasoning'],
    ['B', 'C', 'D', 'E']);

  const positions = [
    ['Hanafi tradition + NZF UK + Islamic Relief', 'Silver', 'More wealth captured', 'Captures more givers into obligation → more relief flows to the poor. Considered more equitable contemporary.'],
    ['Maliki / Shafi\'i / Hanbali tradition',      'Gold',   'Higher threshold',    'Aligns with historical purchasing-power of the threshold. Defended by traditionalists.'],
    ['AAOIFI Standard 21 §2',                      'Both',   'Tradition-led',       'Both methods valid. Madhhab tradition typically guides preference; informed choice permissible.'],
  ];

  positions.forEach((row, i) => {
    const ri = r + 2 + i;
    row.forEach((cell, ci) => {
      const col = ['B','C','D','E'][ci];
      sheet.getCell(`${col}${ri}`).value = cell;
      sheet.getCell(`${col}${ri}`).font = ci === 0 || ci === 1 ? FONTS.bodyBold : FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true, vertical: 'middle' };
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    });
    sheet.getRow(ri).height = 28;
  });

  addCallout(sheet, `B${r + 8}:L${r + 9}`,
    '⚠️',
    'Stick with one method across years',
    'Don\'t toggle gold/silver based on which produces a lower obligation — that\'s optimizer-thinking, not Zakat practice. Consistent method over years is the scholarly recommendation across all 4 Madhhabs.');
  sheet.getRow(r + 8).height = 30;
  sheet.getRow(r + 9).height = 30;

  addFooter(sheet, r + 13, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 5 — 💰 ZAKAT CALCULATOR (All tiers)
// ============================================================================

function buildZakatCalculator_(workbook) {
  const sheet = workbook.addWorksheet('💰 Zakat Calculator');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 28, C: 14, D: 12, E: 14, F: 12, G: 18, H: 16, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💰 Zakat Calculator',
    tabSubtitle: 'Zakatable wealth − qualifying deductions × 2.5%. Niyyah column for intent attribution per asset class.',
    bannerText: BANNER,
    kpiData: [
      { label: 'ZAKATABLE',        value: { formula: `TEXT('📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW},"$#,##0")` } },
      { label: 'DEDUCTIONS',       value: { formula: `TEXT(H${DEDUCTIONS.TOTAL_ROW},"$#,##0")` } },
      { label: 'NET ZAKATABLE',    value: { formula: `TEXT(MAX(0,'📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW}-H${DEDUCTIONS.TOTAL_ROW}),"$#,##0")` } },
      { label: 'RATE',             value: '2.5%' },
      { label: 'ZAKAT DUE',        value: { formula: `TEXT(MAX(0,('📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW}-H${DEDUCTIONS.TOTAL_ROW}))*${ZAKAT_RATE},"$#,##0")` } },
      { label: 'NISAB STATUS',     value: { formula: `IF('📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW}>='⚖️ Nisab Calculator'!E22,"✓ Above","⚠ Below")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-asset breakdown with Niyyah', 'Pull-through from Wealth Inventory. Niyyah column lets you attribute the intent (current year / Qada / Fitr / specific category).', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Asset class', 'Wealth (base)', 'Zakatable?', 'Rate', 'Zakat ($)', 'Niyyah', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  for (let i = 0; i < INVENTORY.ROW_COUNT; i++) {
    const ri = r + 2 + i;
    const invRow = INVENTORY.FIRST_ROW + i;

    sheet.getCell(`B${ri}`).value = { formula: `'📋 Wealth Inventory'!B${invRow}` };
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR('📋 Wealth Inventory'!N${invRow},0)` };
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IF(C${ri}>0,"✓","—")` };
    sheet.getCell(`D${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = ZAKAT_RATE;
    sheet.getCell(`E${ri}`).numFmt = '0.0%';
    sheet.getCell(`E${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(C${ri}*E${ri},0)` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = 'Current year';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).dataValidation = {
      type: 'list',
      formulae: ['"Current year,Qada (missed),Fitr,Not yet Hawl"'],
      allowBlank: true,
    };

    sheet.getCell(`H${ri}`).value = null;
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  }

  // Asset subtotal row
  const subtotalRow = r + 2 + INVENTORY.ROW_COUNT;
  sheet.getCell(`B${subtotalRow}`).value = 'Subtotal — gross Zakat on assets';
  sheet.getCell(`B${subtotalRow}`).font = FONTS.bodyBold;
  sheet.getCell(`B${subtotalRow}`).alignment = { horizontal: 'right' };
  sheet.getCell(`C${subtotalRow}`).value = { formula: `SUM(C${r + 2}:C${r + 1 + INVENTORY.ROW_COUNT})` };
  sheet.getCell(`C${subtotalRow}`).numFmt = '"$"#,##0';
  sheet.getCell(`C${subtotalRow}`).font = FONTS.bodyBold;
  sheet.getCell(`C${subtotalRow}`).alignment = { horizontal: 'right' };
  sheet.getCell(`F${subtotalRow}`).value = { formula: `SUM(F${r + 2}:F${r + 1 + INVENTORY.ROW_COUNT})` };
  sheet.getCell(`F${subtotalRow}`).numFmt = '"$"#,##0';
  sheet.getCell(`F${subtotalRow}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
  sheet.getCell(`F${subtotalRow}`).alignment = { horizontal: 'right' };

  // === DEDUCTIONS SECTION ===
  r = addSectionHeader(sheet, DEDUCTIONS.FIRST_ROW - 2, 'Qualifying deductions', 'Per NZF UK §4.1, Hanafi school is more permissive about deducting debts (within 12 months); Maliki/Shafi\'i/Hanbali more conservative. Long-term debts (mortgages > 12mo) are NOT fully deductible.', 'B:H');

  addTableHeader(sheet, DEDUCTIONS.FIRST_ROW - 1,
    ['Deduction category', 'Amount ($)', '—', '—', '—', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  for (let i = 0; i < DEDUCTIONS.ROW_COUNT; i++) {
    const ri = DEDUCTIONS.FIRST_ROW + i;
    sheet.getCell(`B${ri}`).value = DEDUCTIONS.CATEGORIES[i];
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    // Seed only the first (credit-card-debt-style) deduction
    sheet.getCell(`C${ri}`).value = i === 0 ? 0 : null;
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
  }

  sheet.getCell(`G${DEDUCTIONS.TOTAL_ROW}`).value = 'Total deductions:';
  sheet.getCell(`G${DEDUCTIONS.TOTAL_ROW}`).font = FONTS.bodyBold;
  sheet.getCell(`G${DEDUCTIONS.TOTAL_ROW}`).alignment = { horizontal: 'right' };
  sheet.getCell(`H${DEDUCTIONS.TOTAL_ROW}`).value = { formula: `SUM(C${DEDUCTIONS.FIRST_ROW}:C${DEDUCTIONS.LAST_ROW})` };
  sheet.getCell(`H${DEDUCTIONS.TOTAL_ROW}`).numFmt = '"$"#,##0';
  sheet.getCell(`H${DEDUCTIONS.TOTAL_ROW}`).font = { ...FONTS.bodyBold, size: 13, color: argb(TEAL_DEEP) };
  sheet.getCell(`H${DEDUCTIONS.TOTAL_ROW}`).alignment = { horizontal: 'right' };
  sheet.getCell(`H${DEDUCTIONS.TOTAL_ROW}`).border = BORDER_THIN();

  // FINAL ZAKAT block
  const finalRow = DEDUCTIONS.TOTAL_ROW + 3;
  sheet.mergeCells(`B${finalRow}:L${finalRow}`);
  sheet.getCell(`B${finalRow}`).value = 'FINAL ZAKAT DUE THIS HIJRI YEAR';
  sheet.getCell(`B${finalRow}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell(`B${finalRow}`).fill = FILLS.charcoal;
  sheet.getCell(`B${finalRow}`).alignment = { horizontal: 'center' };
  sheet.getRow(finalRow).height = 32;

  sheet.mergeCells(`B${finalRow + 1}:L${finalRow + 1}`);
  sheet.getCell(`B${finalRow + 1}`).value = { formula: `TEXT(MAX(0,('📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW}-H${DEDUCTIONS.TOTAL_ROW}))*${ZAKAT_RATE},"$#,##0.00")` };
  sheet.getCell(`B${finalRow + 1}`).font = { name: 'Inter', size: 36, bold: true, color: argb(TEAL_DEEP) };
  sheet.getCell(`B${finalRow + 1}`).fill = FILLS.warmGoldLight;
  sheet.getCell(`B${finalRow + 1}`).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(finalRow + 1).height = 60;

  addCallout(sheet, `B${finalRow + 4}:L${finalRow + 5}`,
    '🧾',
    'Use Niyyah honestly',
    'The Niyyah column attributes intent per asset. Set "Qada" for assets where Zakat is being made up for missed prior years. Set "Not yet Hawl" for newly acquired assets (Shafi\'i/Maliki/Hanbali per-asset Hawl). Reset annually.');
  sheet.getRow(finalRow + 4).height = 30;
  sheet.getRow(finalRow + 5).height = 30;

  addFooter(sheet, finalRow + 8, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 6 — 🌐 MULTI-CURRENCY (All tiers)
// ============================================================================

function buildMultiCurrency(workbook) {
  const sheet = workbook.addWorksheet('🌐 Multi-Currency');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 18, F: 18, G: 12, H: 12, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🌐 Multi-Currency',
    tabSubtitle: 'Convert wealth across 9 currencies. Live FX via GOOGLEFINANCE (Google Sheets) or manual entry (Excel).',
    bannerText: BANNER,
    kpiData: [
      { label: 'BASE',         value: { formula: `E10` } },
      { label: 'AS-OF',        value: { formula: `TEXT(TODAY(),"mmm d")` } },
      { label: 'CURRENCIES',   value: '9' },
      { label: 'WEALTH (BASE)',value: { formula: `TEXT('📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW},"$#,##0")` } },
      { label: 'NISAB (BASE)', value: { formula: `TEXT('⚖️ Nisab Calculator'!E22,"$#,##0")` } },
      { label: 'ZAKAT (BASE)', value: { formula: `TEXT(('📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW}-'💰 Zakat Calculator'!H${DEDUCTIONS.TOTAL_ROW})*${ZAKAT_RATE},"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Set base currency + FX rates', 'AED, SAR, EGP, MYR, GBP, USD, PKR, INR, CAD (Pro adds: TRY, IDR, NGN). Multi-Currency Converter routes Wealth Inventory through your base.', 'B:L');

  sheet.getCell(`B10`).value = 'Base currency:';
  sheet.getCell(`B10`).font = FONTS.bodyBold;
  sheet.getCell(`B10`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E10`).value = 'USD';
  sheet.getCell(`E10`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
  sheet.getCell(`E10`).fill = FILLS.warmGoldLight;
  sheet.getCell(`E10`).alignment = { horizontal: 'center' };
  sheet.getCell(`E10`).border = BORDER_THIN();
  sheet.getCell(`E10`).dataValidation = {
    type: 'list',
    formulae: ['"USD,GBP,EUR,AED,SAR,EGP,MYR,PKR,INR,CAD,TRY,IDR,NGN"'],
    allowBlank: false,
  };

  r = addSectionHeader(sheet, 13, 'FX rates (to base currency)', 'GOOGLEFINANCE pulls live FX. Excel users enter rates manually monthly.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Currency', 'Code', 'Rate (X→Base)', 'GOOGLEFINANCE formula', '—'],
    ['B', 'C', 'D', 'E', 'F']);

  const fxRows = [
    ['US Dollar',     'USD', 1.00,     '=GOOGLEFINANCE("Currency:USDUSD")'],
    ['British Pound', 'GBP', 1.27,     '=GOOGLEFINANCE("Currency:GBPUSD")'],
    ['Euro',          'EUR', 1.08,     '=GOOGLEFINANCE("Currency:EURUSD")'],
    ['UAE Dirham',    'AED', 0.272,    '=GOOGLEFINANCE("Currency:AEDUSD")'],
    ['Saudi Riyal',   'SAR', 0.267,    '=GOOGLEFINANCE("Currency:SARUSD")'],
    ['Egyptian £',    'EGP', 0.0204,   '=GOOGLEFINANCE("Currency:EGPUSD")'],
    ['Malaysian R.',  'MYR', 0.225,    '=GOOGLEFINANCE("Currency:MYRUSD")'],
    ['Pakistan Rupee','PKR', 0.0036,   '=GOOGLEFINANCE("Currency:PKRUSD")'],
    ['Indian Rupee',  'INR', 0.012,    '=GOOGLEFINANCE("Currency:INRUSD")'],
    ['Canadian $',    'CAD', 0.74,     '=GOOGLEFINANCE("Currency:CADUSD")'],
    ['Turkish Lira',  'TRY', 0.031,    '=GOOGLEFINANCE("Currency:TRYUSD")'],
    ['Indonesian R.', 'IDR', 0.000062, '=GOOGLEFINANCE("Currency:IDRUSD")'],
    ['Nigerian Naira','NGN', 0.00065,  '=GOOGLEFINANCE("Currency:NGNUSD")'],
  ];

  fxRows.forEach((row, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = row[0];
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = row[1];
    sheet.getCell(`C${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = row[2];
    sheet.getCell(`D${ri}`).numFmt = '0.000000';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = row[3];
    sheet.getCell(`E${ri}`).font = { ...FONTS.bodyMuted, name: 'JetBrains Mono', size: 9 };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
  });

  addCallout(sheet, `B${r + 17}:L${r + 18}`,
    '💱',
    'Common Zakat foot-gun: mixing currencies',
    'If you hold USD in a checking account + AED in EOSB + EGP in a savings account, convert all three to the SAME base on your Hawl date — then compute Zakat. Don\'t compute Zakat per currency and add up — FX timing matters less when computed once at base.');
  sheet.getRow(r + 17).height = 30;
  sheet.getRow(r + 18).height = 30;

  addFooter(sheet, r + 21, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 7 — 📅 HAWL TRACKER (Pro+)
// ============================================================================

function buildHawlTracker(workbook) {
  const sheet = workbook.addWorksheet('📅 Hawl Tracker');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 24, C: 16, D: 16, E: 14, F: 14, G: 14, H: 14, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📅 Hawl Tracker',
    tabSubtitle: 'Per-account 12 lunar months. Hijri ↔ Gregorian conversion. Alerts when Zakat due.',
    bannerText: BANNER,
    kpiData: [
      { label: 'MADHHAB',       value: { formula: `${SETTINGS.MADHHAB_CELL}` } },
      { label: 'HAWL MODEL',    value: { formula: `IF(${SETTINGS.MADHHAB_CELL}="Hanafi","Aggregate","Per-asset")` } },
      { label: 'ACCOUNTS',      value: { formula: `COUNTA(B12:B21)` } },
      { label: 'HAWLS COMPLETE',value: { formula: `COUNTIF(G12:G21,"✓ Complete")` } },
      { label: 'DUE THIS MONTH',value: { formula: `COUNTIF(G12:G21,"⏰ Due")` } },
      { label: 'TODAY',         value: { formula: `TEXT(TODAY(),"mmm d, yyyy")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-account Hawl tracking', 'Shafi\'i/Maliki/Hanbali — each asset class has its own 12-lunar-month anniversary. Hanafi — aggregate at year-end (use just the first row).', 'B:L');

  addTableHeader(sheet, 11,
    ['Account / Asset', 'Nisab reached on', 'Hawl due (Greg)', 'Hawl due (Hijri)', 'Days remaining', '12-mo progress', 'Status', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

  const hawlSeed = [
    ['Cash (aggregate)',         '2025-09-15', '2026-09-04', '1448-Rabi I-1'],
    ['Gulf EOSB (DC)',           '2024-03-01', '2026-02-18', '1447-Sha\'ban-12'],
    ['BTC holdings',             '2024-08-20', '2026-08-09', '1448-Safar-5'],
    ['Stocks (taxable)',         '2023-11-10', '2026-10-30', '1448-Rabi II-2'],
    ['Sukuk portfolio',          '2025-02-10', '2026-01-30', '1447-Rajab-22'],
    ['Rental property (income)', '2024-06-01', '2026-05-21', '1447-Dhul Qi\'dah-14'],
    ['',                         '',           '',           ''],
    ['',                         '',           '',           ''],
    ['',                         '',           '',           ''],
    ['',                         '',           '',           ''],
  ];

  hawlSeed.forEach((row, i) => {
    const ri = 12 + i;

    sheet.getCell(`B${ri}`).value = row[0] || null;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = row[1] || null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = row[2] || null;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = row[3] || null;
    sheet.getCell(`E${ri}`).font = { ...FONTS.body, color: argb(TEAL_DEEP) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = row[2] ? { formula: `IFERROR(DATEVALUE(D${ri})-TODAY(),"")` } : null;
    sheet.getCell(`F${ri}`).numFmt = '#,##0" days"';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = row[2] ? { formula: `IFERROR(MAX(0,MIN(1,(TODAY()-DATEVALUE(C${ri}))/(DATEVALUE(D${ri})-DATEVALUE(C${ri})))),"")` } : null;
    sheet.getCell(`G${ri}`).numFmt = '0%';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = row[2] ? { formula: `IFERROR(IF(F${ri}<0,"✓ Complete",IF(F${ri}<30,"⏰ Due",IF(F${ri}<90,"🟡 Soon","🟢 Tracking"))),"")` } : null;
    sheet.getCell(`H${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  });

  // CF on status column
  sheet.addConditionalFormatting({
    ref: `H12:H21`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Due', priority: 1, style: { font: { color: argb(COLORS.alert), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Complete', priority: 2, style: { font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Soon', priority: 3, style: { font: { color: argb(COLORS.warning), bold: true } } },
    ],
  });

  addCallout(sheet, `B24:L25`,
    '🌙',
    'Hijri year is ~354 days vs Gregorian 365',
    'Your Zakat-payment date moves ~11 days earlier each Gregorian year. After ~33 years, the cycle wraps. Track in both calendars to stay aligned with your community.');
  sheet.getRow(24).height = 30;
  sheet.getRow(25).height = 30;

  addCallout(sheet, `B27:L28`,
    '⚖️',
    'Madhhab differences',
    'Hanafi: aggregate Hawl — pick ONE date a year; all wealth Zakatable on that date regardless of acquisition time. Shafi\'i/Maliki/Hanbali: per-asset Hawl — each asset has its own anniversary. Operational tip: even per-asset adherents often align to a single date (e.g., 1st Ramadan) for convenience. AAOIFI §5.1: this consolidation is acceptable provided no asset is overdue.');
  sheet.getRow(27).height = 36;
  sheet.getRow(28).height = 36;

  addFooter(sheet, 32, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 8 — 💎 CRYPTOCURRENCY (All tiers — first-class line item per proposal)
// ============================================================================

function buildCryptocurrency(workbook) {
  const sheet = workbook.addWorksheet('💎 Cryptocurrency');
  setTabColor(sheet, COLORS.alert);
  setupColumns(sheet, { A: 2, B: 12, C: 22, D: 12, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💎 Cryptocurrency',
    tabSubtitle: 'BTC / ETH / altcoins / stablecoins / staked / LP. Mainstream consensus per NZF UK 2024 + AAOIFI 2023: Zakatable at market value at Hawl date.',
    bannerText: BANNER,
    kpiData: [
      { label: 'POSITIONS',        value: { formula: `COUNTA(B12:B25)` } },
      { label: 'TOTAL VALUE',      value: { formula: `TEXT(SUM(H12:H25),"$#,##0")` } },
      { label: 'HAWL MET',         value: { formula: `COUNTIF(I12:I25,"✓")` } },
      { label: 'ZAKATABLE $',      value: { formula: `TEXT(SUMIFS(H12:H25,I12:I25,"✓"),"$#,##0")` } },
      { label: 'CRYPTO ZAKAT',     value: { formula: `TEXT(SUMIFS(H12:H25,I12:I25,"✓")*${ZAKAT_RATE},"$#,##0")` } },
      { label: 'STABLECOIN %',     value: { formula: `TEXT(IFERROR(SUMIFS(H12:H25,F12:F25,"Stablecoin")/MAX(1,SUM(H12:H25)),0),"0%")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-coin holdings', 'Coin · Units · Cost basis avg · Spot price · Wallet/exchange label · Type (Spot / Staked / LP / Lent / Stablecoin) · Hawl status.', 'B:L');

  addTableHeader(sheet, 11,
    ['Coin', 'Wallet/exchange label', 'Units', 'Cost avg', 'Spot $', 'Type', 'Market value', 'Hawl met?', '—', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const cryptoSeed = [
    ['BTC',   'Crypto Wallet A',  0.35,    42000.00, 68000.00, 'Spot',       '✓'],
    ['ETH',   'Crypto Wallet B',  4.2,     2400.00,  3800.00,  'Staked',     '✓'],
    ['USDC',  'DeFi Wallet',      3000,    1.00,     1.00,     'Stablecoin', '✓'],
    ['ETH-USDC LP', 'Uniswap',    1,       9000.00,  9000.00,  'LP',         '⚠'],
  ];

  for (let i = 0; i < 14; i++) {
    const ri = 12 + i;
    const c = cryptoSeed[i];

    sheet.getCell(`B${ri}`).value = c ? c[0] : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = c ? c[1] : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = c ? c[2] : null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0.0000';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = c ? c[3] : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = c ? c[4] : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = { ...FONTS.body, italic: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = c ? c[5] : null;
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).dataValidation = {
      type: 'list',
      formulae: ['"Spot,Staked,LP,Lent,Stablecoin,Wrapped,Other"'],
      allowBlank: true,
    };

    sheet.getCell(`H${ri}`).value = c ? { formula: `IFERROR(D${ri}*F${ri},0)` } : null;
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = c ? c[6] : null;
    sheet.getCell(`I${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B27:L28`,
    '⚠️',
    'DeFi lending — scholars not yet at consensus',
    'BTC/ETH spot Zakat is settled scholarly consensus per NZF UK 2024 + AAOIFI 2023. DeFi lending protocols (Aave / Compound) where you lend stablecoins for yield — scholars have NOT reached consensus. NZF UK informal: treat as receivable. AMP India: reservations. If significant, verify with mufti.');
  sheet.getRow(27).height = 36;
  sheet.getRow(28).height = 36;

  addFooter(sheet, 32, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 9 — 🗂️ MUTUAL FUNDS & ETFs (All tiers — default 25% NZF-proxy)
// ============================================================================

function buildMutualFundsETFs(workbook) {
  const sheet = workbook.addWorksheet('🗂️ Mutual Funds & ETFs');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 12, C: 24, D: 14, E: 14, F: 14, G: 16, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🗂️ Mutual Funds & ETFs',
    tabSubtitle: 'Default 25% NZF-proxy. Per NZF UK §3.4: "for dividend investors holding diversified equity portfolios, the 25% market-value proxy is sound estimation."',
    bannerText: BANNER,
    kpiData: [
      { label: 'POSITIONS',     value: { formula: `COUNTA(B12:B22)` } },
      { label: 'TOTAL VALUE',   value: { formula: `TEXT(SUM(F12:F22),"$#,##0")` } },
      { label: 'AVG PROXY',     value: { formula: `TEXT(IFERROR(AVERAGE(G12:G22),0),"0%")` } },
      { label: 'ZAKATABLE',     value: { formula: `TEXT(SUMPRODUCT(F12:F22,G12:G22),"$#,##0")` } },
      { label: 'FUND ZAKAT',    value: { formula: `TEXT(SUMPRODUCT(F12:F22,G12:G22)*${ZAKAT_RATE},"$#,##0")` } },
      { label: 'PROXY DEFAULT', value: '25%' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-fund holdings + Zakatable portion', 'Method per fund: 25% NZF-proxy (default) or override with full balance-sheet share if you have the data. Speculator-intent funds get 100% market value (urud at-tijara).', 'B:L');

  addTableHeader(sheet, 11,
    ['Ticker', 'Fund name', 'Shares', 'NAV', 'Market value', 'Method', 'Zakatable %', 'Zakat $', '—', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const fundsSeed = [
    ['VTI',   'Vanguard Total Stock Market',     200, 245.00, 0.25],
    ['SCHD',  'Schwab US Dividend Equity',       180, 82.10,  0.25],
    ['BND',   'Vanguard Total Bond Market',      120, 75.10,  0.25],
    ['VXUS',  'Vanguard Total International',    150, 59.80,  0.25],
    ['IWMI',  'iShares MSCI Islamic World',      80,  72.50,  0.25],
  ];

  for (let i = 0; i < 11; i++) {
    const ri = 12 + i;
    const f = fundsSeed[i];

    sheet.getCell(`B${ri}`).value = f ? f[0] : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = f ? f[1] : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = f ? f[2] : null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = f ? f[3] : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = f ? { formula: `IFERROR(D${ri}*E${ri},0)` } : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = f ? 'NZF 25% proxy' : null;
    sheet.getCell(`G${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).dataValidation = {
      type: 'list',
      formulae: ['"NZF 25% proxy,Full balance-sheet,Speculator 100%"'],
      allowBlank: true,
    };

    sheet.getCell(`H${ri}`).value = f ? f[4] : null;
    sheet.getCell(`H${ri}`).numFmt = '0%';
    sheet.getCell(`H${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = f ? { formula: `IFERROR(F${ri}*H${ri}*${ZAKAT_RATE},0)` } : null;
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B24:L25`,
    '📊',
    'Purification (NOT Zakat — separate)',
    'For ETFs holding non-compliant industry exposure (S&P 500 etc.), purification of 5% of received dividend (per AAOIFI Shariah Standard 21 §5.5 + Islamic Relief) is recommended as separate charity. NOT counted as Zakat; goes to general welfare, NOT to the 8 eligible categories.');
  sheet.getRow(24).height = 30;
  sheet.getRow(25).height = 30;

  addFooter(sheet, 29, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 10 — 🏚️ PROPERTY RESALE & LAND (All tiers)
// ============================================================================

function buildPropertyResale(workbook) {
  const sheet = workbook.addWorksheet('🏚️ Property & Land');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 26, C: 14, D: 18, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏚️ Property & Land',
    tabSubtitle: 'Resale-intent: full market value Zakatable. Long-term hold or use-asset: NOT Zakatable. Rental: see 🏠 Rental Property tab.',
    bannerText: BANNER,
    kpiData: [
      { label: 'PROPERTIES',     value: { formula: `COUNTA(B12:B21)` } },
      { label: 'RESALE INTENT',  value: { formula: `COUNTIF(D12:D21,"Resale (Zakatable)")` } },
      { label: 'USE / LONG-TERM',value: { formula: `COUNTIF(D12:D21,"Use / long-term (not Zakatable)")` } },
      { label: 'ZAKATABLE $',    value: { formula: `TEXT(SUMIFS(F12:F21,D12:D21,"Resale (Zakatable)"),"$#,##0")` } },
      { label: 'ZAKAT DUE',      value: { formula: `TEXT(SUMIFS(F12:F21,D12:D21,"Resale (Zakatable)")*${ZAKAT_RATE},"$#,##0")` } },
      { label: 'RATE',           value: '2.5%' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-property intent classification', 'Per AAOIFI Standard 21 §5.6 + Islamic Relief: resale-intent properties/plots are treated as urud at-tijara (inventory) → Zakatable at full market value. Use-assets (primary home, family land) are NOT Zakatable.', 'B:L');

  addTableHeader(sheet, 11,
    ['Property / land', 'Acquired', 'Intent', 'Acquisition $', 'Market value', 'Zakat $', '—', '—', '—', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const propertySeed = [
    ['Primary residence',           '2018-05', 'Use / long-term (not Zakatable)', 380000, 520000],
    ['Family farm land (inherited)','2015-01', 'Use / long-term (not Zakatable)', 0,      120000],
    ['Plot purchased for resale',   '2024-08', 'Resale (Zakatable)',              45000,  62000],
  ];

  for (let i = 0; i < 10; i++) {
    const ri = 12 + i;
    const p = propertySeed[i];

    sheet.getCell(`B${ri}`).value = p ? p[0] : null;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = p ? p[1] : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = p ? p[2] : null;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).dataValidation = {
      type: 'list',
      formulae: ['"Resale (Zakatable),Use / long-term (not Zakatable)"'],
      allowBlank: true,
    };

    sheet.getCell(`E${ri}`).value = p ? p[3] : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = p ? p[4] : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = p ? { formula: `IFERROR(IF(D${ri}="Resale (Zakatable)",F${ri}*${ZAKAT_RATE},0),0)` } : null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B23:L24`,
    '🏠',
    'Primary home is NOT Zakatable',
    'Your residence is a use-asset, not a wealth-asset. Same for personal car, household goods, jewelry worn (per Hanafi/Maliki — though Shafi\'i and Hanbali differ on women\'s gold jewelry). Don\'t Zakat-tax assets you USE; Zakat applies to assets you HOLD (currency, gold, business inventory, resale intent).');
  sheet.getRow(23).height = 36;
  sheet.getRow(24).height = 36;

  addFooter(sheet, 28, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 11 — 🌙 ZAKAT AL-FITR (All tiers)
// ============================================================================

function buildZakatAlFitr(workbook) {
  const sheet = workbook.addWorksheet('🌙 Zakat al-Fitr');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 26, C: 14, D: 14, E: 18, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🌙 Zakat al-Fitr',
    tabSubtitle: 'Separate obligation paid before Eid Salah. Per family member: 2.5kg staple food OR local cash equivalent. Per NZF UK §8.',
    bannerText: BANNER,
    kpiData: [
      { label: 'COUNTRY',          value: { formula: `E10` } },
      { label: 'STAPLE FOOD',      value: { formula: `E12` } },
      { label: 'CASH/PERSON',      value: { formula: `TEXT(E14,"$#,##0.00")` } },
      { label: 'FAMILY MEMBERS',   value: { formula: `E16` } },
      { label: 'FITR DUE',         value: { formula: `TEXT(F18,"$#,##0")` } },
      { label: 'DEADLINE',         value: 'Pre-Eid Salah' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Set local equivalent + family count', 'Pay before the Eid prayer. Cash equivalent acceptable across all 4 Madhhabs (Hanafi explicit; Maliki/Shafi\'i/Hanbali allow when food distribution impractical).', 'B:L');

  sheet.getCell(`B10`).value = 'Country:';
  sheet.getCell(`B10`).font = FONTS.bodyBold;
  sheet.getCell(`B10`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E10`).value = 'United Arab Emirates';
  sheet.getCell(`E10`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
  sheet.getCell(`E10`).fill = FILLS.warmGoldLight;
  sheet.getCell(`E10`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`E10`).border = BORDER_THIN();

  sheet.getCell(`B12`).value = 'Local staple food:';
  sheet.getCell(`B12`).font = FONTS.bodyBold;
  sheet.getCell(`B12`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E12`).value = 'Rice';
  sheet.getCell(`E12`).font = FONTS.body;
  sheet.getCell(`E12`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`E12`).border = BORDER_THIN();
  sheet.getCell(`E12`).dataValidation = {
    type: 'list',
    formulae: ['"Rice,Wheat,Barley,Dates,Raisins"'],
    allowBlank: false,
  };

  sheet.getCell(`B14`).value = 'Local cash equiv per person ($):';
  sheet.getCell(`B14`).font = FONTS.bodyBold;
  sheet.getCell(`B14`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E14`).value = 22.50;
  sheet.getCell(`E14`).numFmt = '"$"#,##0.00';
  sheet.getCell(`E14`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
  sheet.getCell(`E14`).alignment = { horizontal: 'right' };
  sheet.getCell(`E14`).border = BORDER_THIN();

  sheet.getCell(`B16`).value = 'Family members:';
  sheet.getCell(`B16`).font = FONTS.bodyBold;
  sheet.getCell(`B16`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E16`).value = 4;
  sheet.getCell(`E16`).font = FONTS.body;
  sheet.getCell(`E16`).alignment = { horizontal: 'right' };
  sheet.getCell(`E16`).border = BORDER_THIN();

  sheet.getCell(`B18`).value = 'TOTAL FITR DUE:';
  sheet.getCell(`B18`).font = { ...FONTS.bodyBold, size: 14 };
  sheet.getCell(`B18`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`F18`).value = { formula: `E14*E16` };
  sheet.getCell(`F18`).numFmt = '"$"#,##0.00';
  sheet.getCell(`F18`).font = { name: 'Inter', size: 18, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell(`F18`).fill = FILLS.charcoal;
  sheet.getCell(`F18`).alignment = { horizontal: 'right' };
  sheet.getCell(`F18`).border = BORDER_THIN();
  sheet.getRow(18).height = 28;

  // Common-region reference table
  r = addSectionHeader(sheet, 22, 'Approximate local equivalents (reference)', 'Pre-Ramadan 1446. Local mosque guidance overrides. Update annually.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Country / region', 'Staple', '~Cash/person', 'Notes', '—'],
    ['B', 'C', 'D', 'E', 'F']);

  const fitrTable = [
    ['United Kingdom (NZF UK)', 'Wheat',   5.00,  '£5 per NZF UK guidance'],
    ['United States',           'Wheat',   12.00, '$12 per ISNA guidance'],
    ['United Arab Emirates',    'Rice',    22.50, 'AED 25 → ~$6.80; local mosque may differ'],
    ['Saudi Arabia',            'Rice',    20.00, 'SAR 25 → ~$6.70'],
    ['Egypt',                   'Wheat',   1.50,  'EGP 75 → ~$1.50'],
    ['India',                   'Rice',    2.50,  '₹200 → ~$2.40 per AMP India'],
    ['Pakistan',                'Wheat',   1.50,  'PKR 400 → ~$1.40'],
    ['Malaysia',                'Rice',    1.80,  'MYR 8 → ~$1.80'],
    ['Canada',                  'Wheat',   12.00, 'CAD 15 → ~$11.00 per CMCC'],
  ];

  fitrTable.forEach((row, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = row[0];
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).value = row[1];
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).value = row[2];
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).value = row[3];
    sheet.getCell(`E${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
  });

  addCallout(sheet, `B${r + 13}:L${r + 14}`,
    '⏰',
    'Pay before Eid Salah',
    'Zakat al-Fitr must reach recipients BEFORE the Eid prayer to fulfill the obligation in its proper time. Per NZF UK §8.4: pay 1-3 days before Eid for the safest practice. After Eid Salah, it becomes Sadaqah (voluntary charity), not Zakat al-Fitr.');
  sheet.getRow(r + 13).height = 30;
  sheet.getRow(r + 14).height = 30;

  addFooter(sheet, r + 17, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 12 — 📈 STOCKS ZAKAT (Pro+)
// ============================================================================

function buildStocksZakat(workbook) {
  const sheet = workbook.addWorksheet('📈 Stocks Zakat');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 12, C: 24, D: 12, E: 14, F: 14, G: 16, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📈 Stocks Zakat',
    tabSubtitle: 'Two dimensions: INTENT (Speculator vs Dividend Investor) and METHOD (Full balance-sheet vs 25% NZF-proxy). Citations: NZF UK §3.4 + AAOIFI Standard 21 §5.2.',
    bannerText: BANNER,
    kpiData: [
      { label: 'POSITIONS',     value: { formula: `COUNTA(B12:B25)` } },
      { label: 'TOTAL VALUE',   value: { formula: `TEXT(SUM(F12:F25),"$#,##0")` } },
      { label: 'SPECULATOR',    value: { formula: `COUNTIF(G12:G25,"Speculator")` } },
      { label: 'DIVIDEND',      value: { formula: `COUNTIF(G12:G25,"Dividend Investor")` } },
      { label: 'ZAKATABLE $',   value: { formula: `TEXT(SUM(I12:I25),"$#,##0")` } },
      { label: 'STOCKS ZAKAT',  value: { formula: `TEXT(SUM(I12:I25)*${ZAKAT_RATE},"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-stock intent + method', 'Speculator → 100% of market value Zakatable (urud at-tijara, AAOIFI §5.2). Dividend investor → 25% NZF-proxy default, or full balance-sheet share if you extract it.', 'B:L');

  addTableHeader(sheet, 11,
    ['Ticker', 'Company', 'Shares', 'Cost basis', 'Market value', 'Intent', 'Method', 'Zakatable %', 'Zakatable $', 'Zakat $', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const stocksSeed = [
    ['AAPL',  'Apple Inc.',          50,  128.00, 180.00, 'Speculator',        'Speculator 100%', 1.00],
    ['MSFT',  'Microsoft',           30,  240.00, 410.00, 'Dividend Investor', 'NZF 25% proxy',   0.25],
    ['JNJ',   'Johnson & Johnson',   40,  155.00, 165.00, 'Dividend Investor', 'NZF 25% proxy',   0.25],
    ['ARMCO', 'Saudi Aramco',        100, 8.50,   10.40,  'Dividend Investor', 'NZF 25% proxy',   0.25],
  ];

  for (let i = 0; i < 14; i++) {
    const ri = 12 + i;
    const s = stocksSeed[i];

    sheet.getCell(`B${ri}`).value = s ? s[0] : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = s ? s[1] : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = s ? s[2] : null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = s ? s[3] : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = s ? { formula: `IFERROR(D${ri}*${s[4]},0)` } : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = s ? s[5] : null;
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).dataValidation = {
      type: 'list',
      formulae: ['"Speculator,Dividend Investor"'],
      allowBlank: true,
    };

    sheet.getCell(`H${ri}`).value = s ? s[6] : null;
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
    sheet.getCell(`H${ri}`).dataValidation = {
      type: 'list',
      formulae: ['"Speculator 100%,NZF 25% proxy,Full balance-sheet"'],
      allowBlank: true,
    };

    sheet.getCell(`I${ri}`).value = s ? s[7] : null;
    sheet.getCell(`I${ri}`).numFmt = '0%';
    sheet.getCell(`I${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = s ? { formula: `IFERROR(F${ri}*I${ri},0)` } : null;
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = s ? { formula: `IFERROR(J${ri}*${ZAKAT_RATE},0)` } : null;
    sheet.getCell(`K${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`K${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B27:L28`,
    '🎯',
    'Don\'t flip your intent classification annually',
    'AAOIFI §5.2: "Frequent reclassification weakens the intent doctrine." Once you classify a position as Dividend Investor (25% proxy), stick with it for ≥3 years before reclassifying. The intent has to match behavior over time, not just sentiment in the moment.');
  sheet.getRow(27).height = 30;
  sheet.getRow(28).height = 30;

  addFooter(sheet, 32, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 13 — 💰 SUKUK TRACKER (Pro+)
// ============================================================================

function buildSukukTracker(workbook) {
  const sheet = workbook.addWorksheet('💰 Sukuk Tracker');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 24, C: 18, D: 14, E: 14, F: 22, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💰 Sukuk Tracker',
    tabSubtitle: 'Ijarah (rental-backed) → Zakat on rental income only. Musharakah (ownership) → like equity. Murabahah (receivable) → like receivable. AAOIFI Standard 21 §5.3.',
    bannerText: BANNER,
    kpiData: [
      { label: 'POSITIONS',     value: { formula: `COUNTA(B12:B19)` } },
      { label: 'TOTAL FACE $',  value: { formula: `TEXT(SUM(D12:D19),"$#,##0")` } },
      { label: 'IJARAH',        value: { formula: `COUNTIF(C12:C19,"Ijarah")` } },
      { label: 'MUSHARAKAH',    value: { formula: `COUNTIF(C12:C19,"Musharakah")` } },
      { label: 'MURABAHAH',     value: { formula: `COUNTIF(C12:C19,"Murabahah")` } },
      { label: 'SUKUK ZAKAT',   value: { formula: `TEXT(SUM(I12:I19),"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-Sukuk structure classification', 'Issuance prospectus tells you the structure. AUTO-RULE applies per AAOIFI Standard 21 §5.3 — verify with the prospectus.', 'B:L');

  addTableHeader(sheet, 11,
    ['Sukuk name / issuer', 'Structure', 'Face value', 'Annual rent / dist', 'Zakat treatment', 'Zakatable basis', 'Rate', 'Zakat $', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const sukukSeed = [
    ['DubaiAirports Ijarah 2031',     'Ijarah',     10000, 600,  'Rental income only', 600,    ZAKAT_RATE, 15],
    ['SaudiAramco Musharakah 2029',   'Musharakah', 12000, null, 'Full equity value',   12000,  ZAKAT_RATE, 300],
    ['IslamicDev Bank Murabahah 2027','Murabahah',  8000,  null, 'Like a receivable',   8000,   ZAKAT_RATE, 200],
  ];

  for (let i = 0; i < 8; i++) {
    const ri = 12 + i;
    const s = sukukSeed[i];

    sheet.getCell(`B${ri}`).value = s ? s[0] : null;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = s ? s[1] : null;
    sheet.getCell(`C${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = {
      type: 'list',
      formulae: ['"Ijarah,Musharakah,Murabahah,Hybrid,Other"'],
      allowBlank: true,
    };

    sheet.getCell(`D${ri}`).value = s ? s[2] : null;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = s ? s[3] : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = s ? s[4] : null;
    sheet.getCell(`F${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = s ? s[5] : null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = s ? s[6] : null;
    sheet.getCell(`H${ri}`).numFmt = '0.0%';
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = s ? s[7] : null;
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B22:L23`,
    '📜',
    'Verify structure with the issuance prospectus',
    'Don\'t guess structure from the issuer\'s name. A "Saudi Aramco Sukuk" could be Musharakah OR Ijarah OR Hybrid depending on series. Read the prospectus or fund-fact sheet — the structure determines Zakat treatment per AAOIFI §5.3.');
  sheet.getRow(22).height = 30;
  sheet.getRow(23).height = 30;

  addFooter(sheet, 27, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 14 — 🏠 RENTAL PROPERTY (Pro+)
// ============================================================================

function buildRentalProperty(workbook) {
  const sheet = workbook.addWorksheet('🏠 Rental Property');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 24, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏠 Rental Property',
    tabSubtitle: 'Zakat on annual NET RENTAL INCOME (not market value). Contemporary scholarly consensus per Islamic Relief + AAOIFI §5.6.',
    bannerText: BANNER,
    kpiData: [
      { label: 'PROPERTIES',    value: { formula: `COUNTA(B12:B19)` } },
      { label: 'GROSS RENT',    value: { formula: `TEXT(SUM(D12:D19),"$#,##0")` } },
      { label: 'EXPENSES',      value: { formula: `TEXT(SUM(E12:E19),"$#,##0")` } },
      { label: 'NET INCOME',    value: { formula: `TEXT(SUM(F12:F19),"$#,##0")` } },
      { label: 'ZAKAT RATE',    value: '2.5%' },
      { label: 'RENTAL ZAKAT',  value: { formula: `TEXT(SUM(G12:G19),"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-property rental income', 'Annual NET (gross rent − maintenance/taxes/insurance/management fees). Don\'t Zakat the property MARKET value — that\'s a minority traditional position. Modern majority position per Islamic Relief: net income only.', 'B:L');

  addTableHeader(sheet, 11,
    ['Property', 'Country', 'Gross rent / yr', 'Expenses / yr', 'Net income', 'Zakat $', '—', '—', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const rentalSeed = [
    ['Apt — Downtown Cairo', 'EG', 28000, 8000, 20000, 500],
    ['Studio — Dubai',       'AE', 18000, 4000, 14000, 350],
  ];

  for (let i = 0; i < 8; i++) {
    const ri = 12 + i;
    const p = rentalSeed[i];

    sheet.getCell(`B${ri}`).value = p ? p[0] : null;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = p ? p[1] : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = p ? p[2] : null;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = p ? p[3] : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = p ? { formula: `IFERROR(D${ri}-E${ri},0)` } : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = p ? { formula: `IFERROR(F${ri}*${ZAKAT_RATE},0)` } : null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
  }

  addFooter(sheet, 24, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 15 — 🌾 AGRICULTURAL ZAKAT (Pro+)
// ============================================================================

function buildAgriculturalZakat(workbook) {
  const sheet = workbook.addWorksheet('🌾 Agricultural Zakat');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 22, C: 16, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🌾 Agricultural Zakat',
    tabSubtitle: '10% on rain/natural irrigation. 5% on artificial/man-made irrigation. Different rate from monetary Zakat (2.5%). Threshold: 612.36 kg of staple grain.',
    bannerText: BANNER,
    kpiData: [
      { label: 'CROPS',         value: { formula: `COUNTA(B12:B19)` } },
      { label: 'TOTAL HARVEST', value: { formula: `TEXT(SUM(D12:D19),"#,##0 kg")` } },
      { label: 'ABOVE NISAB',   value: { formula: `COUNTIF(E12:E19,"✓")` } },
      { label: 'ZAKAT KG',      value: { formula: `TEXT(SUM(G12:G19),"#,##0")` } },
      { label: 'VALUE ($)',     value: { formula: `TEXT(SUM(H12:H19),"$#,##0")` } },
      { label: 'CROP ZAKAT $',  value: { formula: `TEXT(SUM(I12:I19),"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-crop calculation', 'Harvest above 612.36 kg (5 wasq) is Zakatable. Irrigation method drives rate: 10% if rain-fed; 5% if artificial; 7.5% mixed.', 'B:L');

  addTableHeader(sheet, 11,
    ['Crop', 'Irrigation', 'Harvest (kg)', 'Above Nisab?', 'Rate', 'Zakat kg', 'Value ($)', 'Zakat $', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const cropsSeed = [
    ['Wheat',  'Rain-fed',  4000, 0.10],
    ['Dates',  'Irrigated', 2500, 0.05],
    ['Olives', 'Mixed',     1200, 0.075],
  ];

  for (let i = 0; i < 8; i++) {
    const ri = 12 + i;
    const c = cropsSeed[i];

    sheet.getCell(`B${ri}`).value = c ? c[0] : null;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = c ? c[1] : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = {
      type: 'list',
      formulae: ['"Rain-fed,Irrigated,Mixed"'],
      allowBlank: true,
    };

    sheet.getCell(`D${ri}`).value = c ? c[2] : null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = c ? { formula: `IF(D${ri}>=612.36,"✓","—")` } : null;
    sheet.getCell(`E${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = c ? c[3] : null;
    sheet.getCell(`F${ri}`).numFmt = '0.0%';
    sheet.getCell(`F${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = c ? { formula: `IFERROR(IF(E${ri}="✓",D${ri}*F${ri},0),0)` } : null;
    sheet.getCell(`G${ri}`).numFmt = '#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B22:L23`,
    '🚜',
    'Agricultural Zakat is paid at harvest, not annually',
    'Unlike monetary Zakat (annual Hawl), agricultural Zakat is due at the moment of harvest — no 12-month wait. Pay in kind (grain to those in need) OR cash equivalent. AAOIFI §5.7 + Islamic Relief Zakat Guide §4.6.');
  sheet.getRow(22).height = 30;
  sheet.getRow(23).height = 30;

  addFooter(sheet, 27, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 16 — 🏦 EOSB & PENSION (Pro+)
// ============================================================================

function buildEOSB(workbook) {
  const sheet = workbook.addWorksheet('🏦 EOSB & Pension');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 22, C: 16, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏦 EOSB & Pension',
    tabSubtitle: 'Gulf-critical. DB / DC / SIPP detection. AAOIFI Standard 21 §6.3: accessible-without-penalty portion Zakatable. Locked portion NOT.',
    bannerText: BANNER,
    kpiData: [
      { label: 'SCHEMES',          value: { formula: `COUNTA(B12:B17)` } },
      { label: 'ACCESSIBLE $',     value: { formula: `TEXT(SUM(F12:F17),"$#,##0")` } },
      { label: 'LOCKED $',         value: { formula: `TEXT(SUM(G12:G17),"$#,##0")` } },
      { label: 'ZAKATABLE',        value: { formula: `TEXT(SUM(F12:F17),"$#,##0")` } },
      { label: 'PENSION ZAKAT',    value: { formula: `TEXT(SUM(I12:I17),"$#,##0")` } },
      { label: 'RATE',             value: '2.5%' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-scheme accessibility test', 'AAOIFI §6.3: "Accessible-without-penalty portion is Zakatable annually." Locked portion (DB schemes, restricted withdrawal) is NOT Zakatable until accessible. UAE/Saudi EOSB → most components accessible upon termination → Zakatable.', 'B:L');

  addTableHeader(sheet, 11,
    ['Scheme name', 'Type', 'Country', 'Vested (yrs)', 'Accessible $', 'Locked $', 'Total $', 'Zakat $', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const eosbSeed = [
    ['UAE EOSB (DC)',       'DC',  'AE', 6, 40000, 0,     40000, 1000],
    ['Saudi GOSI Pension',  'DB',  'SA', 4, 0,     22000, 22000, 0],
    ['UK SIPP (self-dir)',  'SIPP','GB', 8, 18000, 0,     18000, 450],
  ];

  for (let i = 0; i < 6; i++) {
    const ri = 12 + i;
    const e = eosbSeed[i];

    sheet.getCell(`B${ri}`).value = e ? e[0] : null;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = e ? e[1] : null;
    sheet.getCell(`C${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = {
      type: 'list',
      formulae: ['"DB,DC,SIPP,Hybrid"'],
      allowBlank: true,
    };

    sheet.getCell(`D${ri}`).value = e ? e[2] : null;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = e ? e[3] : null;
    sheet.getCell(`E${ri}`).numFmt = '#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = e ? e[4] : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = e ? e[5] : null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = e ? { formula: `F${ri}+G${ri}` } : null;
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = e ? { formula: `F${ri}*${ZAKAT_RATE}` } : null;
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B20:L21`,
    '💼',
    'EOSB Zakat is paid from OTHER cash — not from EOSB',
    'You don\'t draw from EOSB to pay its Zakat (that defeats the savings purpose). The Zakat amount comes from your current cash on the Hawl date.');
  sheet.getRow(20).height = 30;
  sheet.getRow(21).height = 30;

  addFooter(sheet, 25, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 17 — ⏳ QADA ZAKAT (Pro+)
// ============================================================================

function buildQadaZakat(workbook) {
  const sheet = workbook.addWorksheet('⏳ Qada Zakat');
  setTabColor(sheet, COLORS.warning);
  setupColumns(sheet, { A: 2, B: 16, C: 16, D: 16, E: 16, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '⏳ Qada Zakat',
    tabSubtitle: 'Make up missed Zakat from prior years. Per NZF UK §7: "obligation does not lapse with time." Per AMP India: good-faith estimation acceptable.',
    bannerText: BANNER,
    kpiData: [
      { label: 'YEARS TRACKED', value: { formula: `COUNTA(B12:B20)` } },
      { label: 'TOTAL OWED',    value: { formula: `TEXT(SUM(E12:E20),"$#,##0")` } },
      { label: 'PAID',          value: { formula: `TEXT(SUM(F12:F20),"$#,##0")` } },
      { label: 'REMAINING',     value: { formula: `TEXT(SUM(E12:E20)-SUM(F12:F20),"$#,##0")` } },
      { label: 'CLEARANCE %',   value: { formula: `TEXT(IFERROR(SUM(F12:F20)/MAX(1,SUM(E12:E20)),0),"0%")` } },
      { label: 'YEARS LEFT',    value: { formula: `COUNTIF(G12:G20,"⏳ Pending")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-year Qada tracker', 'Per NZF UK + AMP India: estimate prior-year wealth in good faith; lean toward slightly more rather than less. Track payments toward Qada separately from current-year Zakat.', 'B:L');

  addTableHeader(sheet, 11,
    ['Hijri year', 'Gregorian', 'Wealth est.', 'Zakat owed', 'Paid', 'Status', 'Notes', '—', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const qadaSeed = [
    [1442, '2021', 80000,  1750, 1750,  '✓ Cleared'],
    [1443, '2022', 120000, 2650, 2650,  '✓ Cleared'],
    [1444, '2023', 140000, 3100, 1500,  '⏳ Pending'],
    [1445, '2024', 160000, 3650, 0,     '⏳ Pending'],
  ];

  for (let i = 0; i < 9; i++) {
    const ri = 12 + i;
    const q = qadaSeed[i];

    sheet.getCell(`B${ri}`).value = q ? q[0] : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = q ? q[1] : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = q ? q[2] : null;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = q ? q[3] : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.alert) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = q ? q[4] : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = q ? q[5] : null;
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B22:L23`,
    '🌱',
    'Qada is accountability, not punishment',
    'Imam Nawawi Al-Majmu\' §6 (Shafi\'i): "Recognizing and paying is the act of return." Spread your clearance over 2-3 years if needed. Religious obligations are best fulfilled sustainably. Most practicing Muslims discover missed Zakat in their 30s-40s after building wealth without formal tracking.');
  sheet.getRow(22).height = 36;
  sheet.getRow(23).height = 36;

  addFooter(sheet, 27, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 18 — 🤝 DISTRIBUTION TRACKER (Pro+)
// ============================================================================

function buildDistributionTracker(workbook) {
  const sheet = workbook.addWorksheet('🤝 Distribution Tracker');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 24, C: 26, D: 12, E: 14, F: 14, G: 14, H: 18, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🤝 Distribution Tracker',
    tabSubtitle: '8 eligible categories per Surah At-Tawbah 9:60. Plan + track per category. 5-year history grid below.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL ZAKAT',   value: { formula: `TEXT(SUM(E12:E19),"$#,##0")` } },
      { label: 'DISTRIBUTED',   value: { formula: `TEXT(SUM(F12:F19),"$#,##0")` } },
      { label: 'PENDING',       value: { formula: `TEXT(SUM(E12:E19)-SUM(F12:F19),"$#,##0")` } },
      { label: 'CATEGORIES MET',value: { formula: `COUNTIF(G12:G19,"✓ Met")` } },
      { label: 'CATEGORIES',    value: '8' },
      { label: 'PROGRESS',      value: { formula: `TEXT(IFERROR(SUM(F12:F19)/MAX(1,SUM(E12:E19)),0),"0%")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, '8 eligible categories (Surah At-Tawbah 9:60)', 'Most contemporary scholars (NZF UK + Islamic Relief): Fuqara + Masakin should receive the largest share. Per-category allocation is your call within scholarly norms.', 'B:L');

  addTableHeader(sheet, 11,
    ['Category', 'Recipient / organization', 'Allocated %', 'Allocated $', 'Distributed $', 'Status', 'Date', '—', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const distSeed = [
    [DISTRIBUTION_CATEGORIES[0], 'Islamic Relief Worldwide',          0.30, 1500, 1500, '✓ Met', '2026-03-01'],
    [DISTRIBUTION_CATEGORIES[1], 'NZF UK',                            0.20, 1000, 1000, '✓ Met', '2026-03-01'],
    [DISTRIBUTION_CATEGORIES[2], 'Folded into admin overhead',        0.05, 250,  0,    '⏳ Pending', ''],
    [DISTRIBUTION_CATEGORIES[3], 'Local mosque new-Muslim fund',      0.05, 250,  250,  '✓ Met', '2026-03-15'],
    [DISTRIBUTION_CATEGORIES[4], 'IR Anti-Trafficking Program',       0.05, 250,  0,    '⏳ Pending', ''],
    [DISTRIBUTION_CATEGORIES[5], 'Direct via mosque committee',       0.10, 500,  500,  '✓ Met', '2026-03-15'],
    [DISTRIBUTION_CATEGORIES[6], 'Madrasa funding (AMP India)',       0.15, 750,  400,  '⏳ Partial', '2026-04-01'],
    [DISTRIBUTION_CATEGORIES[7], 'IR Refugee Programs',               0.10, 500,  0,    '⏳ Pending', ''],
  ];

  distSeed.forEach((row, i) => {
    const ri = 12 + i;
    row.forEach((val, ci) => {
      const col = ['B','C','D','E','F','G','H'][ci];
      sheet.getCell(`${col}${ri}`).value = val;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
      if (ci === 0) {
        sheet.getCell(`${col}${ri}`).font = FONTS.bodyBold;
        sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'left', indent: 1 };
      } else if (ci === 1) {
        sheet.getCell(`${col}${ri}`).font = FONTS.body;
        sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'left', indent: 1 };
      } else if (ci === 2) {
        sheet.getCell(`${col}${ri}`).numFmt = '0%';
        sheet.getCell(`${col}${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
        sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      } else if (ci === 3 || ci === 4) {
        sheet.getCell(`${col}${ri}`).numFmt = '"$"#,##0';
        sheet.getCell(`${col}${ri}`).font = ci === 4 ? { ...FONTS.bodyBold, color: argb(COLORS.success) } : FONTS.body;
        sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      } else if (ci === 5) {
        sheet.getCell(`${col}${ri}`).font = FONTS.bodyBold;
        sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'center' };
      } else if (ci === 6) {
        sheet.getCell(`${col}${ri}`).font = FONTS.bodyMuted;
        sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'center' };
      }
    });
  });

  // === 5-year history ===
  r = addSectionHeader(sheet, 23, '5-year Zakat history log', 'Per Hijri year — total Zakat, total distributed, % met. Build a personal record.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Hijri year', 'Gregorian', 'Total Zakat', 'Distributed', '% Met', 'Notes', '—', '—', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const historyYears = [
    [1442, '2021', 1750,  1750,  '100%', 'Qada paid 1446'],
    [1443, '2022', 2650,  2650,  '100%', 'Qada paid 1446'],
    [1444, '2023', 3100,  3100,  '100%', 'Current'],
    [1445, '2024', 3650,  3650,  '100%', 'Current'],
    [1446, '2025', 4500,  3650,  '81%',  '1447 carries the rest'],
  ];

  historyYears.forEach((row, i) => {
    const ri = r + 2 + i;
    row.forEach((val, ci) => {
      const col = ['B','C','D','E','F','G'][ci];
      sheet.getCell(`${col}${ri}`).value = val;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
      if (ci === 0) {
        sheet.getCell(`${col}${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
        sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'center' };
      } else if (ci === 1) {
        sheet.getCell(`${col}${ri}`).font = FONTS.body;
        sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'center' };
      } else if (ci === 2 || ci === 3) {
        sheet.getCell(`${col}${ri}`).numFmt = '"$"#,##0';
        sheet.getCell(`${col}${ri}`).font = FONTS.body;
        sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      } else if (ci === 4) {
        sheet.getCell(`${col}${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
        sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      } else {
        sheet.getCell(`${col}${ri}`).font = FONTS.bodyMuted;
        sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'left', indent: 1 };
      }
    });
  });

  addCallout(sheet, `B${r + 8}:L${r + 9}`,
    '💔',
    'Most-missed: Gharimin (debtors)',
    'Most retail Zakat-payers go to global orgs and skip Gharimin entirely. But this is where direct, person-to-person Zakat is most legitimate per Quranic basis. Use mosque committee to identify a recipient anonymously if you don\'t know anyone directly.');
  sheet.getRow(r + 8).height = 36;
  sheet.getRow(r + 9).height = 36;

  addFooter(sheet, r + 13, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 19 — 📅 PARTIAL PAYMENT PLANNER (Pro+)
// ============================================================================

function buildPartialPaymentPlanner(workbook) {
  const sheet = workbook.addWorksheet('📅 Partial Payment Plan');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 14, C: 20, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📅 Partial Payment Plan',
    tabSubtitle: 'Spread Zakat across the Hijri year (monthly equivalent). Scholarly consensus: paying Zakat in installments throughout the year is acceptable provided the total reaches the obligation by Hawl.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL ZAKAT',   value: { formula: `TEXT(E10,"$#,##0")` } },
      { label: 'MONTHLY EQUIV', value: { formula: `TEXT(E10/12,"$#,##0")` } },
      { label: 'PAID YTD',      value: { formula: `TEXT(SUM(D14:D25),"$#,##0")` } },
      { label: 'REMAINING',     value: { formula: `TEXT(E10-SUM(D14:D25),"$#,##0")` } },
      { label: 'MONTHS LEFT',   value: { formula: `12-COUNTIF(D14:D25,">0")` } },
      { label: 'ON TRACK?',     value: { formula: `IF(SUM(D14:D25)>=(E10/12)*COUNTIF(D14:D25,">0"),"✓ On track","⚠ Behind")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Total Zakat obligation for this Hijri year', 'Pulled from 💰 Zakat Calculator. Divide by 12 for monthly equivalent — or pay irregularly as cash flow allows.', 'B:L');

  sheet.getCell(`B10`).value = 'Total Zakat obligation:';
  sheet.getCell(`B10`).font = FONTS.bodyBold;
  sheet.getCell(`B10`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E10`).value = { formula: `MAX(0,('📋 Wealth Inventory'!N${INVENTORY.TOTAL_ROW}-'💰 Zakat Calculator'!H${DEDUCTIONS.TOTAL_ROW}))*${ZAKAT_RATE}` };
  sheet.getCell(`E10`).numFmt = '"$"#,##0.00';
  sheet.getCell(`E10`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell(`E10`).fill = FILLS.charcoal;
  sheet.getCell(`E10`).alignment = { horizontal: 'right' };
  sheet.getCell(`E10`).border = BORDER_THIN();

  // 12-month payment grid
  addTableHeader(sheet, 13,
    ['Month', 'Hijri month', 'Amount paid', 'Cumulative', 'Recipient', '—', '—', '—', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const hijriMonths = ['Muharram', 'Safar', 'Rabi I', 'Rabi II', 'Jumada I', 'Jumada II',
                       'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhul Qi\'dah', 'Dhul Hijjah'];

  for (let i = 0; i < 12; i++) {
    const ri = 14 + i;

    sheet.getCell(`B${ri}`).value = i + 1;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = hijriMonths[i];
    sheet.getCell(`C${ri}`).font = { ...FONTS.body, color: argb(TEAL_DEEP) };
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = i < 3 ? 375 : null;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = { formula: `SUM(D$14:D${ri})` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = null;
    sheet.getCell(`F${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
  }

  addFooter(sheet, 30, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 20 — 👨‍👩‍👧 FAMILY CONSOLIDATION (Pro+)
// ============================================================================

function buildFamilyConsolidation(workbook) {
  const sheet = workbook.addWorksheet('👨‍👩‍👧 Family Consolidation');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '👨‍👩‍👧 Family Consolidation',
    tabSubtitle: 'Per-person Zakat liability. Mainstream scholarly position across all 4 Madhhabs: each adult Muslim with wealth above Nisab has individual Zakat obligation. Joint Zakat is operational, not theological.',
    bannerText: BANNER,
    kpiData: [
      { label: 'PEOPLE',          value: { formula: `COUNTA(B12:B19)` } },
      { label: 'TOTAL WEALTH',    value: { formula: `TEXT(SUM(D12:D19),"$#,##0")` } },
      { label: 'ABOVE NISAB',     value: { formula: `COUNTIF(E12:E19,"✓")` } },
      { label: 'BELOW NISAB',     value: { formula: `COUNTIF(E12:E19,"⚠ Below")` } },
      { label: 'TOTAL ZAKAT',     value: { formula: `TEXT(SUMIFS(F12:F19,E12:E19,"✓"),"$#,##0")` } },
      { label: 'FITR (FAMILY)',   value: { formula: `TEXT('🌙 Zakat al-Fitr'!F18,"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-family-member Nisab status', 'Each adult Muslim\'s wealth is assessed independently. Spouse + adult children + dependents may each be above OR below Nisab. Combine for record-keeping, not for theological pooling.', 'B:L');

  addTableHeader(sheet, 11,
    ['Family member', 'Relationship', 'Wealth $', 'Above Nisab?', 'Zakat $', 'Already paid?', '—', '—', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const familySeed = [
    ['Adult — primary payer',  'Self',     180000, '✓',         4500, 'Partial'],
    ['Spouse',                 'Spouse',   12000,  '✓',         300,  'Yes'],
    ['Adult child (working)',  'Child',    8000,   '✓',         200,  'No'],
    ['Minor child #1',         'Dependent',2000,   '⚠ Below',   0,    'N/A'],
    ['Minor child #2',         'Dependent',1500,   '⚠ Below',   0,    'N/A'],
  ];

  for (let i = 0; i < 8; i++) {
    const ri = 12 + i;
    const f = familySeed[i];

    sheet.getCell(`B${ri}`).value = f ? f[0] : null;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = f ? f[1] : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = f ? f[2] : null;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = f ? f[3] : null;
    sheet.getCell(`E${ri}`).font = { ...FONTS.bodyBold, color: argb(f && f[3] === '✓' ? COLORS.success : COLORS.warning) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = f ? f[4] : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = f ? f[5] : null;
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B22:L23`,
    '🤝',
    'Pooling is allowed but not required',
    'You may pay your spouse\'s Zakat on their behalf with their consent + Niyyah. You may NOT pool wealth to lower individual obligations (that\'s tax-thinking, not Zakat-thinking). Each adult\'s wealth is assessed independently.');
  sheet.getRow(22).height = 30;
  sheet.getRow(23).height = 30;

  addFooter(sheet, 27, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 21 — 🤖 AI ZAKAT ADVISOR (AI Edition only)
// ============================================================================

function buildAIZakatAdvisor(workbook) {
  const sheet = workbook.addWorksheet('🤖 AI Zakat Advisor');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 26, D: 26, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🤖 AI Zakat Advisor',
    tabSubtitle: '8 AI assistant prompts citing NZF UK, AAOIFI Standard 21, Islamic Relief, AMP India. Open the companion PDF for the full prompts.',
    bannerText: BANNER,
    kpiData: [
      { label: 'PROMPTS',         value: '8' },
      { label: 'CITATIONS',       value: 'Mandatory' },
      { label: 'MADHHABS',        value: 'All 4' },
      { label: 'PERSONAS IN PDF', value: '2 (annual / complex)' },
      { label: 'PDF PAGES',       value: '12' },
      { label: 'COMPATIBLE WITH', value: 'Any AI free tier' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'AI prompt hub — pair with the companion PDF', 'Each prompt pairs with a specific tab in this sheet. Copy → paste into your favourite AI assistant → replace placeholders → read the response. Every response includes fatwa citations.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Prompt', 'Pairs with tab', 'What it does', 'Citations', '—', '—', '—', '—', '—', '—'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const prompts = [
    ['1. Setup Wizard',           '⚙️ Madhhab Settings',     'Madhhab-tailored onboarding — Nisab method, Hawl model, debt rule', 'NZF UK + AAOIFI + AMP India'],
    ['2. Crypto/DeFi Zakat',      '💎 Cryptocurrency',       'BTC + ETH staked + LP + stablecoins per position',                  'NZF UK 2024 + AAOIFI 2023'],
    ['3. Nisab Method Picker',    '⚖️ Nisab Calculator',     'Gold vs Silver pros/cons + your Madhhab default',                   'NZF UK §2 + AAOIFI §2'],
    ['4. Stocks Method Picker',   '📈 Stocks Zakat',         'Speculator vs Dividend + full vs 25% proxy per position',           'NZF UK §3.4 + AAOIFI §5.2'],
    ['5. Pension Analyser',       '🏦 EOSB & Pension',       'DB / DC / SIPP accessibility test',                                 'AAOIFI §6.3 + NZF Worldwide'],
    ['6. Distribution Planner',   '🤝 Distribution Tracker', '8 categories with verified orgs per category',                      'At-Tawbah 9:60 + IR + NZF'],
    ['7. Qada Recovery Coach',    '⏳ Qada Zakat',           '2-3 year clearance plan + emotional frame',                         'NZF UK §7 + Imam Nawawi'],
    ['8. Annual Report PDF',      '🤖 AI Zakat Advisor',     'Complete annual report + tax-deductible receipt (US/UK/CA)',        'All sources'],
  ];

  prompts.forEach((p, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = p[0];
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(TEAL_DEEP) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;

    sheet.getCell(`C${ri}`).value = p[1];
    sheet.getCell(`C${ri}`).font = { ...FONTS.body, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = p[2];
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = p[3];
    sheet.getCell(`E${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getRow(ri).height = 30;
  });

  addCallout(sheet, `B${r + 12}:L${r + 13}`,
    '📚',
    'Citations are starting points, not final fatwas',
    'The AI cites mainstream rulings from NZF UK / AAOIFI Standard 21 / Islamic Relief / AMP India. For specific edge cases — your Sukuk\'s exact structure, your pension\'s accessibility specifics, contested DeFi treatment — verify with a qualified mufti before relying on the AI\'s interpretation.');
  sheet.getRow(r + 12).height = 36;
  sheet.getRow(r + 13).height = 36;

  addCallout(sheet, `B${r + 15}:L${r + 16}`,
    '🔒',
    'Privacy discipline',
    'Use the spreadsheet labels ("Cash Account A", "Gulf EOSB") when pasting into your AI assistant. The AI doesn\'t need real identifiers to do the math. Your wealth details, family details, and Madhhab selection never leave your AI conversation.');
  sheet.getRow(r + 15).height = 36;
  sheet.getRow(r + 16).height = 36;

  addFooter(sheet, r + 19, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 22 — ℹ️ ABOUT & HELP (All tiers)
// ============================================================================

function buildAbout(workbook) {
  const tier = workbook._tier || 'ai';
  const tierMetadata = {
    essentials: { label: 'Essentials', tabs: '11', prompts: '0' },
    pro:        { label: 'Pro',        tabs: '20', prompts: '0' },
    ai:         { label: 'AI Edition', tabs: '21', prompts: '8' },
  }[tier];

  const sheet = workbook.addWorksheet('ℹ️ About & Help');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 30, C: 60, D: 8, E: 10, F: 10, G: 10, H: 10, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — ${tierMetadata.label}`,
    tabName: 'ℹ️ About & Help',
    tabSubtitle: 'Welcome — and quick answers to questions buyers ask first.',
    bannerText: BANNER,
    kpiData: [
      { label: 'VERSION',     value: '1.0' },
      { label: 'TABS',        value: tierMetadata.tabs },
      { label: 'MADHHABS',    value: '4 (Hanafi/Maliki/Shafi\'i/Hanbali)' },
      { label: 'AI PROMPTS',  value: tierMetadata.prompts },
      { label: 'TIER',        value: tierMetadata.label },
      { label: 'UPDATES',     value: tier === 'ai' ? '12 mo free (Ramadan refresh)' : 'Bug fixes free' },
    ],
  });

  sheet.mergeCells('B6:C6');
  sheet.getCell('B6').value = 'Welcome to your Zakat Calculator.';
  sheet.getCell('B6').font = FONTS.hero;
  sheet.getRow(6).height = 38;

  sheet.mergeCells('B7:C7');
  sheet.getCell('B7').value = 'The most complete Zakat companion on Etsy. 18 product tabs covering every modern asset, scholar-aware rulings across 4 Madhhabs, mandatory fatwa citations in the AI Advisor. Privacy-first.';
  sheet.getCell('B7').font = FONTS.bodyMuted;
  sheet.getRow(7).height = 22;

  let r = addSectionHeader(sheet, 10, 'How this spreadsheet is wired', 'Two paired Input surfaces (Wealth Inventory + Madhhab Settings) drive every downstream tab.');

  const explainerRows = [
    ['📋 Wealth Inventory',       '14 asset classes × 5 account columns. Primary entry surface. Gold/silver in grams.'],
    ['⚙️ Madhhab Settings',       'One-time toggle drives Nisab default, Hawl model, debt rule across all tabs.'],
    ['🏠 Dashboard',              'Nisab gauge + Zakat due + Fitr ribbon + 8-category distribution donut.'],
    ['⚖️ Nisab Calculator',       'Gold (87.48g) OR Silver (612.36g) toggle. Live spot via GOOGLEFINANCE.'],
    ['💰 Zakat Calculator',       '2.5% × (Zakatable wealth − qualifying deductions). Niyyah attribution per asset.'],
    ['📅 Hawl Tracker (Pro)',     'Per-account 12-lunar-month anniversaries. Hijri ↔ Gregorian conversion.'],
    ['📈 Stocks Zakat (Pro)',     'Speculator vs Dividend Investor × Full vs 25% proxy method per holding.'],
    ['💰 Sukuk Tracker (Pro)',    'Ijarah / Musharakah / Murabahah auto-applies AAOIFI §5.3 rule per structure.'],
    ['🏦 EOSB & Pension (Pro)',   'Gulf-critical. DB/DC/SIPP accessibility test per AAOIFI §6.3.'],
    ['⏳ Qada Zakat (Pro)',       'Cumulative tracker for missed prior years. Recovery payment plan support.'],
    ['🤝 Distribution (Pro)',     '8 eligible categories per Surah At-Tawbah 9:60 + 5-year history.'],
    ['🤖 AI Zakat Advisor (AI)',  '8 prompts: Setup Wizard · Crypto/DeFi · Nisab Picker · Stocks Picker · Pension · Distribution · Qada · Annual Report.'],
  ];
  explainerRows.forEach((er, i) => {
    const ri = r + 1 + i;
    sheet.getCell(`B${ri}`).value = er[0];
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).value = er[1];
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).alignment = { wrapText: true, vertical: 'middle' };
    sheet.getRow(ri).height = 28;
  });

  let r2 = addSectionHeader(sheet, r + explainerRows.length + 3, 'Quick FAQ', '');

  const faq = [
    ['Does this connect to my bank?',  'No. That\'s the privacy gate. You enter values manually on your Hawl date (15-20 minutes once a year). The trade-off: full privacy + religious sensitivity + understanding-what-you-owe, vs. apps that auto-aggregate but send your financial data to their server.'],
    ['How is this different from free online Zakat calculators?',  '(1) Depth — 18 product tabs covering crypto, Sukuk, EOSB, rental, agricultural, Qada. Free calculators handle 5% of modern asset complexity. (2) Madhhab-aware — 4 Madhhabs with ruling differences surfaced. (3) Citations — every AI response cites NZF UK / AAOIFI / Islamic Relief / AMP India. (4) Privacy — your wealth profile stays on your device. (5) Hawl tracker — per-account 12-lunar-month tracking, not just point-in-time.'],
    ['Which Madhhab should I select?',  'Your tradition. Hanafi → silver Nisab default + aggregate Hawl. Maliki/Shafi\'i/Hanbali → gold Nisab default + per-asset Hawl. If unsure, follow your family tradition or local mosque\'s convention.'],
    ['How do I update gold and silver spot prices?',  'Google Sheets: GOOGLEFINANCE handles it (formulae shown on ⚖️ Nisab Calculator). Excel: enter manually on your Hawl date — once a year. Check kitco.com or your local jewelry shop.'],
    ['Do I need a paid AI plan?',  'No. The 8 AI prompts (AI Edition) work on the free tier of your AI assistant. You paste prompts + your data into your own AI tool. Nothing in the spreadsheet sends data to any AI.'],
    ['Is Khums included?',  'No. This is Sunni Zakat al-Mal only. Khums (Shia framework) is a separate product. See "What This Sheet Doesn\'t Do" in the listing copy.'],
  ];
  faq.forEach((qa, i) => {
    const ri = r2 + 1 + i * 2;
    sheet.getCell(`B${ri}`).value = qa[0];
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).value = qa[1];
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { wrapText: true, vertical: 'middle' };
    sheet.getRow(ri).height = 40;
  });

  addFooter(sheet, r2 + faq.length * 2 + 4, { productName: PRODUCT_NAME });
}

// ============================================================================
// MAIN — orchestrate the build
// ============================================================================

async function buildZakatCalculator() {
  const t0 = Date.now();

  const tierArg = process.argv.find((a) => a.startsWith('--tier='));
  const tier = tierArg ? tierArg.split('=')[1] : 'ai';
  if (!['essentials', 'pro', 'ai'].includes(tier)) {
    console.error(`✗ Invalid --tier "${tier}". Use essentials | pro | ai.`);
    process.exit(1);
  }
  const tierLabel = { essentials: 'Essentials', pro: 'Pro', ai: 'AI Edition' }[tier];
  const tierTabCount = { essentials: 11, pro: 20, ai: 21 }[tier];
  console.log(`→ Building ${PRODUCT_NAME} — ${tierLabel} (${tierTabCount} visible / 21 total)...`);

  const workbook = new ExcelJS.Workbook();
  workbook._tier = tier;
  await registerLimeLogo(workbook);

  workbook.creator = 'Lime Premium Studios';
  workbook.lastModifiedBy = 'Lime Premium Studios';
  workbook.company = 'Lime Premium Studios';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.title = `${PRODUCT_NAME} — ${tierLabel}`;
  workbook.subject = 'Personal finance · Zakat calculator · Islamic finance · Nisab · Hawl tracker';
  workbook.category = 'Personal Finance · Islamic Finance';
  workbook.keywords = 'Zakat calculator, Nisab, Hawl tracker, gold silver Nisab, Madhhab, AAOIFI, NZF, Islamic Relief, AMP India, crypto Zakat, Sukuk Zakat, EOSB Zakat, google sheets, lime premium studios';
  workbook.description = `${PRODUCT_NAME} ${tierLabel} v1.0 — Lime Premium Studios. ${tierTabCount} tabs. Privacy-first — no cloud sync, no third-party access. 4 Madhhabs supported.`;

  // Build all tabs in spec order
  console.log('  • 🏠 Dashboard');               buildDashboard(workbook);
  console.log('  • ⚙️ Madhhab Settings');         buildMadhhabSettings(workbook);
  console.log('  • 📋 Wealth Inventory');         buildWealthInventory(workbook);
  console.log('  • ⚖️ Nisab Calculator');         buildNisabCalculator(workbook);
  console.log('  • 💰 Zakat Calculator');         buildZakatCalculator_(workbook);
  console.log('  • 🌐 Multi-Currency');           buildMultiCurrency(workbook);
  console.log('  • 📅 Hawl Tracker (Pro)');       buildHawlTracker(workbook);
  console.log('  • 💎 Cryptocurrency');           buildCryptocurrency(workbook);
  console.log('  • 🗂️ Mutual Funds & ETFs');      buildMutualFundsETFs(workbook);
  console.log('  • 🏚️ Property & Land');          buildPropertyResale(workbook);
  console.log('  • 🌙 Zakat al-Fitr');            buildZakatAlFitr(workbook);
  console.log('  • 📈 Stocks Zakat (Pro)');       buildStocksZakat(workbook);
  console.log('  • 💰 Sukuk Tracker (Pro)');      buildSukukTracker(workbook);
  console.log('  • 🏠 Rental Property (Pro)');    buildRentalProperty(workbook);
  console.log('  • 🌾 Agricultural Zakat (Pro)'); buildAgriculturalZakat(workbook);
  console.log('  • 🏦 EOSB & Pension (Pro)');     buildEOSB(workbook);
  console.log('  • ⏳ Qada Zakat (Pro)');         buildQadaZakat(workbook);
  console.log('  • 🤝 Distribution Tracker (Pro)'); buildDistributionTracker(workbook);
  console.log('  • 📅 Partial Payment Plan (Pro)'); buildPartialPaymentPlanner(workbook);
  console.log('  • 👨‍👩‍👧 Family Consolidation (Pro)'); buildFamilyConsolidation(workbook);
  console.log('  • 🤖 AI Zakat Advisor (AI)');    buildAIZakatAdvisor(workbook);
  console.log('  • ℹ️ About & Help');             buildAbout(workbook);

  applyTierVisibility(workbook, tier, { proTabs: PRO_TABS, aiTabs: AI_TABS, productName: PRODUCT_NAME });

  const filename = tier === 'ai'
    ? 'zakat-calculator-ai-edition.xlsx'
    : `zakat-calculator-${tier}.xlsx`;
  const outPath = resolve(OUTPUT_DIR, filename);
  await workbook.xlsx.writeFile(outPath);

  const elapsed = Date.now() - t0;
  console.log(`\n✓ Workbook generated in ${elapsed}ms`);
  console.log(`  Output: ${outPath}`);
  console.log(`  Tier:   ${tierLabel} — ${tierTabCount} of 21 tabs visible`);
}

buildZakatCalculator().catch((err) => {
  console.error('✗ Build failed:', err);
  process.exit(1);
});
