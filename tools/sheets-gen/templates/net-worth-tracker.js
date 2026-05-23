/**
 * Net Worth Tracker — Google Sheets template generator (Lime Premium Studios) — v1
 *
 * Phase B product #4 in the catalog. Cascades from Budget Tracker + Debt Payoff
 * Planner + Sinking Funds Planner. The depth differentiator: 7-account equity
 * split (401k/IRA/Roth/SEP/HSA/529/Taxable) + multi-asset coverage (vehicles +
 * real estate + metals/crypto + business equity + insurance + estate) — every
 * Etsy competitor handles a subset. FIRE positioning is the headline hook.
 * Pricing: $12 / $19 / $29.
 *
 * Source of truth:
 *   - docs/product-proposals/net-worth-tracker.md   (19-tab feature list)
 *   - docs/product-designs/net-worth-tracker.md     (visual + Dashboard required visuals)
 *   - docs/listing-copy/net-worth-tracker.md        (Etsy listing copy)
 *   - docs/product-content/net-worth-ai-prompts.md  (AI PDF source)
 *   - docs/net-worth-build-tickets.md               (13 build tickets NW01..NW13)
 *
 * Spine architecture (catalog-wide standing rule):
 *   - 📥 Input Tabs — `💼 Assets Summary` + `📉 Liabilities Summary` (paired)
 *   - 📊 Output Dashboard — `🏠 Dashboard` (visual KPI surface, Bundle hero source)
 *
 * Tier model (post-applyTierVisibility):
 *   - Essentials ($12) —  9 visible (8 core + About)
 *   - Pro ($19)        — 19 visible (18 core + About)
 *   - AI Edition ($29) — 20 visible (19 core + About)
 *
 * Run: node tools/sheets-gen/templates/net-worth-tracker.js --tier=<essentials|pro|ai>
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

const PRODUCT_NAME = 'Net Worth Tracker';

// ============================================================================
// TAB DEFINITIONS — 20 tabs across 3 tiers (19 core + About)
// ============================================================================

// PRO tabs — 10 sheets removed for Essentials
const PRO_TABS = new Set([
  '🏠 Real Estate',
  '📊 Stocks & Funds',
  '🥇 Metals & Crypto',
  '💰 Passive Income Simulator',
  '📈 Asset Allocation',
  '🎓 Retirement Tracker',
  '📉 Tax-Loss Harvesting',
  '🌍 Geographic Exposure',
  '🛡️ Insurance & Estate',
  '🤝 Estate Access',
]);

// AI tabs — removed for Pro + Essentials
const AI_TABS = new Set([
  '🤖 AI Wealth Intelligence',
]);

// Banner — shared across every tab (anti-Empower + anti-Monarch + anti-Kubera triple-named)
const BANNER = '✦  Why a Spreadsheet, Not an App?   Empower scrapes your accounts. Monarch charges $99/yr. Kubera $200/yr. We charge $12 once. Your wealth profile stays on your device.';

// Assets Summary invariants — every downstream tab references these by absolute row.
// 16 asset class rows, 12 monthly columns (Jan–Dec).
const ASSETS = {
  HEADER_ROW: 8,
  FIRST_ROW: 9,
  LAST_ROW: 24,         // 16 asset class rows
  ROW_COUNT: 16,
  TOTAL_ROW: 26,        // grand total
  CATEGORIES: [
    'Checking',
    'HYSA',
    'Money Market',
    'Foreign Currency',
    'Vehicles',
    'Real Estate (Primary)',
    'Real Estate (Investment)',
    'Stocks & Funds',
    '401k / IRA / Roth',
    'HSA / 529',
    'Metals',
    'Crypto',
    'Business Equity',
    'Life Insurance DB',
    'Receivables',
    'Other (collectibles/art)',
  ],
};

// Liabilities Summary invariants — 11 liability types, 12 monthly columns.
const LIABS = {
  HEADER_ROW: 8,
  FIRST_ROW: 9,
  LAST_ROW: 19,         // 11 liability rows
  ROW_COUNT: 11,
  TOTAL_ROW: 21,
  CATEGORIES: [
    'Mortgage',
    'Auto Loan',
    'Credit Card',
    'Student Loan',
    'Personal Loan',
    'Business Loan',
    'Family Loan',
    'Medical Debt',
    'BNPL',
    'Tax Owed',
    'Other',
  ],
};

// Month labels — used for column headers on Assets/Liabilities/NW History grids.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ============================================================================
// TAB 1 — 🏠 DASHBOARD (Output spine — Bundle hero source)
// ============================================================================

function buildDashboard(workbook) {
  const tier = workbook._tier || 'ai';
  const sheet = workbook.addWorksheet('🏠 Dashboard');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 20, C: 13, D: 13, E: 14, F: 8, G: 22, H: 12, I: 12, J: 12, K: 12, L: 12, M: 2 });

  // 6 KPI tiles per NW01 ticket spec — all tier-agnostic since they read from
  // Assets/Liabilities Summary which exist in every tier.
  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏠 Dashboard',
    tabSubtitle: 'Your wealth at a glance — recomputes the moment you edit Assets or Liabilities.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL NW',     value: { formula: `TEXT(('💼 Assets Summary'!N${ASSETS.TOTAL_ROW})-('📉 Liabilities Summary'!N${LIABS.TOTAL_ROW}),"$#,##0")` } },
      { label: 'MoM CHANGE',   value: { formula: `TEXT(IFERROR(('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})-('💼 Assets Summary'!M${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!M${LIABS.TOTAL_ROW}),0),"$#,##0")` } },
      { label: 'YoY CHANGE',   value: { formula: `TEXT(IFERROR(('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})/MAX(1,('💼 Assets Summary'!C${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!C${LIABS.TOTAL_ROW}))-1,0),"0.0%")` } },
      // [FIX NWT-009] Pre-fix returned 0% when assets=0. Now shows ∞ if any debt, or — if both zero.
      { label: 'DEBT/ASSET',   value: { formula: `IF('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}=0,IF('📉 Liabilities Summary'!N${LIABS.TOTAL_ROW}>0,"∞","—"),TEXT('📉 Liabilities Summary'!N${LIABS.TOTAL_ROW}/'💼 Assets Summary'!N${ASSETS.TOTAL_ROW},"0.0%"))` } },
      { label: 'FIRE % FUNDED',value: { formula: `TEXT(IFERROR(('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})/'🔥 FIRE Calculator'!E12,0),"0.0%")` } },
      { label: 'AGE PCTILE',   value: { formula: `IFERROR('👥 Age Benchmark'!E12,"—")` } },
    ],
  });

  // === SECTION 1 — NW Health Score gauge (Visual #1 per design brief) ===
  let r = addSectionHeader(sheet, 6, 'Net Worth Health Score', '0–100 composite of 5 sub-components: savings rate · debt-to-asset · allocation drift · FIRE progress · emergency fund coverage. Green ≥80, amber 50–79, red <50.', 'B:G');

  // Big number — composite score in B(r+1) merged across B:D, 5 sub-gauges in B:G(r+5..r+9)
  sheet.mergeCells(`B${r + 1}:D${r + 4}`);
  // Composite = average of the 5 sub-component scores below
  sheet.getCell(`B${r + 1}`).value = { formula: `IFERROR(ROUND(AVERAGE(E${r + 5},E${r + 6},E${r + 7},E${r + 8},E${r + 9})*100,0),0)` };
  sheet.getCell(`B${r + 1}`).font = FONTS.scoreHuge;
  sheet.getCell(`B${r + 1}`).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getCell(`B${r + 1}`).fill = FILLS.ivory;
  sheet.getCell(`B${r + 1}`).border = {
    left: { style: 'medium', color: argb(COLORS.warmGold) },
    top: { style: 'thin', color: argb(COLORS.divider) },
    bottom: { style: 'thin', color: argb(COLORS.divider) },
    right: { style: 'thin', color: argb(COLORS.divider) },
  };

  // CF on the composite — green/amber/red
  sheet.addConditionalFormatting({
    ref: `B${r + 1}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['80'], priority: 1, style: { font: { ...FONTS.scoreHuge, color: argb(COLORS.success) } } },
      { type: 'cellIs', operator: 'between', formulae: ['50', '79'], priority: 2, style: { font: { ...FONTS.scoreHuge, color: argb(COLORS.warning) } } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['50'], priority: 3, style: { font: { ...FONTS.scoreHuge, color: argb(COLORS.alert) } } },
    ],
  });

  // 5 sub-component mini-gauges in B:G(r+5..r+9)
  const subGauges = [
    {
      label: 'Savings rate',
      // Proxy: (assets_now - assets_prev_month) / 12-mo average monthly outflow — clamped 0..1
      formula: `IFERROR(MIN(1,MAX(0,('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'💼 Assets Summary'!M${ASSETS.TOTAL_ROW})/MAX(1,'💼 Assets Summary'!N${ASSETS.TOTAL_ROW}/24))),0.5)`,
    },
    {
      label: 'Debt-to-asset',
      // Inverse — lower is better. 0% debt = 1.0; 50%+ debt = 0.
      formula: `IFERROR(MAX(0,1-('📉 Liabilities Summary'!N${LIABS.TOTAL_ROW}/'💼 Assets Summary'!N${ASSETS.TOTAL_ROW})/0.5),0)`,
    },
    {
      label: 'Allocation drift',
      // [FIX NWT-006] Asset Allocation drift cells live at F11:F20 (10 classes), not F12:F21.
      // Pulled from Asset Allocation (Pro). Falls back to 0.8 if tab missing (Essentials).
      formula: `IFERROR(MAX(0,1-MAX('📈 Asset Allocation'!F11:F20)/0.2),0.8)`,
    },
    {
      label: 'FIRE progress',
      formula: `IFERROR(MIN(1,('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})/'🔥 FIRE Calculator'!E12),0)`,
    },
    {
      label: 'EF coverage',
      // Emergency fund = Checking + HYSA + Money Market rows / monthly expense proxy
      formula: `IFERROR(MIN(1,SUM('💼 Assets Summary'!N9:N11)/('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}*0.03)),0)`,
    },
  ];

  subGauges.forEach((g, i) => {
    const row = r + 5 + i;
    sheet.getCell(`B${row}`).value = g.label;
    sheet.getCell(`B${row}`).font = FONTS.smallCaps;
    sheet.getCell(`B${row}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getCell(`B${row}`).fill = FILLS.white;
    sheet.getCell(`B${row}`).border = BORDER_THIN();

    // Mini bar (10-char REPT block scaled by score)
    sheet.getCell(`C${row}`).value = { formula: `IFERROR(REPT("█",ROUND(E${row}*10,0))&REPT("░",10-ROUND(E${row}*10,0)),"░░░░░░░░░░")` };
    sheet.getCell(`C${row}`).font = { name: 'Inter', size: 11, color: argb(COLORS.success) };
    sheet.getCell(`C${row}`).fill = FILLS.white;
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.mergeCells(`C${row}:D${row}`);

    // Score 0-1 (decimal)
    sheet.getCell(`E${row}`).value = { formula: g.formula };
    sheet.getCell(`E${row}`).numFmt = '0%';
    sheet.getCell(`E${row}`).font = FONTS.bodyBold;
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${row}`).fill = FILLS.white;
    sheet.getCell(`E${row}`).border = BORDER_THIN();

    // CF on sub-score
    sheet.addConditionalFormatting({
      ref: `E${row}`,
      rules: [
        { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['0.8'], priority: 1, style: { font: { ...FONTS.bodyBold, color: argb(COLORS.success) } } },
        { type: 'cellIs', operator: 'between', formulae: ['0.5', '0.79'], priority: 2, style: { font: { ...FONTS.bodyBold, color: argb(COLORS.warning) } } },
        { type: 'cellIs', operator: 'lessThan', formulae: ['0.5'], priority: 3, style: { font: { ...FONTS.bodyBold, color: argb(COLORS.alert) } } },
      ],
    });
  });

  // === SECTION 2 — Asset mix donut substitute (right column, H:L) ===
  let mR = addSectionHeader(sheet, 6, 'Asset mix vs. target', 'Per-class current % side-by-side with target %. Drift >5pp triggers alert pill.', 'H:L');

  // [FIX NWT-008] Pre-fix used rows like '14:14' which formats as `SUM(N14:14)` — LibreOffice
  // evaluates this as #VALUE! (swallowed by IFERROR → 0). All categories showed 0%. Also the
  // category-to-row mapping had errors (Real Estate should aggregate rows 14+15 not 14 alone;
  // Other should include 13 + 22:24, not row 15 which is Real Estate Investment).
  // Use canonical `numericFormula` strings instead of range-tail concatenation.
  const mixRows = [
    { label: '🏠 Real Estate',     formula: `SUM('💼 Assets Summary'!N14:N15)`,                                 target: 0.25 },
    { label: '📊 Stocks & Funds',  formula: `SUM('💼 Assets Summary'!N16:N18)`,                                 target: 0.40 },
    { label: '🥇 Metals & Crypto', formula: `SUM('💼 Assets Summary'!N19:N20)`,                                 target: 0.05 },
    { label: '💵 Cash & HYSA',     formula: `SUM('💼 Assets Summary'!N9:N12)`,                                  target: 0.10 },
    { label: '🏢 Business Equity', formula: `'💼 Assets Summary'!N21`,                                          target: 0.10 },
    { label: '💎 Other',           formula: `'💼 Assets Summary'!N13+SUM('💼 Assets Summary'!N22:N24)`,        target: 0.10 },
  ];

  addTableHeader(sheet, mR + 1, ['Class', 'Current %', 'Target %', 'Drift'], ['H', 'J', 'K', 'L']);

  mixRows.forEach((mr, i) => {
    const row = mR + 2 + i;
    sheet.getCell(`H${row}`).value = mr.label;
    sheet.getCell(`H${row}`).font = FONTS.bodyBold;
    sheet.getCell(`H${row}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getCell(`H${row}`).fill = FILLS.white;
    sheet.getCell(`H${row}`).border = BORDER_THIN();
    sheet.mergeCells(`H${row}:I${row}`);

    sheet.getCell(`J${row}`).value = { formula: `IFERROR((${mr.formula})/'💼 Assets Summary'!N${ASSETS.TOTAL_ROW},0)` };
    sheet.getCell(`J${row}`).numFmt = '0.0%';
    sheet.getCell(`J${row}`).font = FONTS.body;
    sheet.getCell(`J${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${row}`).fill = FILLS.white;
    sheet.getCell(`J${row}`).border = BORDER_THIN();

    sheet.getCell(`K${row}`).value = mr.target;
    sheet.getCell(`K${row}`).numFmt = '0.0%';
    sheet.getCell(`K${row}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`K${row}`).fill = FILLS.white;
    sheet.getCell(`K${row}`).border = BORDER_THIN();

    sheet.getCell(`L${row}`).value = { formula: `J${row}-K${row}` };
    sheet.getCell(`L${row}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`L${row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`L${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`L${row}`).fill = FILLS.white;
    sheet.getCell(`L${row}`).border = BORDER_THIN();
  });

  // CF on drift — alert >5pp
  sheet.addConditionalFormatting({
    ref: `L${mR + 2}:L${mR + 7}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.05'], priority: 1, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['-0.05'], priority: 2, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
    ],
  });

  // === SECTION 3 — FIRE-progress meter (visual #5 — most-watched number) ===
  const fR = Math.max(r + 12, mR + 9) + 2;
  addSectionHeader(sheet, fR, '🔥 FIRE progress', 'Your current NW ÷ FIRE number. Years to FIRE at current savings rate shown below.', 'B:M');

  // Big progress bar across B:L row fR+4
  sheet.mergeCells(`B${fR + 4}:L${fR + 4}`);
  sheet.getCell(`B${fR + 4}`).value = { formula: `IFERROR(REPT("█",ROUND(MIN(1,('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})/'🔥 FIRE Calculator'!E12)*50,0))&REPT("░",50-ROUND(MIN(1,('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})/'🔥 FIRE Calculator'!E12)*50,0)),REPT("░",50))` };
  sheet.getCell(`B${fR + 4}`).font = { name: 'Inter', size: 18, color: argb(COLORS.warmGold), bold: true };
  sheet.getCell(`B${fR + 4}`).fill = FILLS.ivory;
  sheet.getCell(`B${fR + 4}`).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(fR + 4).height = 38;

  // 3 KPI cells below the bar
  sheet.mergeCells(`B${fR + 6}:D${fR + 6}`);
  sheet.getCell(`B${fR + 6}`).value = { formula: `"% FUNDED"&CHAR(10)&TEXT(IFERROR(('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})/'🔥 FIRE Calculator'!E12,0),"0.0%")` };
  sheet.getCell(`B${fR + 6}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell(`B${fR + 6}`).fill = FILLS.white;
  sheet.getCell(`B${fR + 6}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  sheet.getCell(`B${fR + 6}`).border = BORDER_THIN();

  sheet.mergeCells(`E${fR + 6}:H${fR + 6}`);
  sheet.getCell(`E${fR + 6}`).value = { formula: `"FIRE NUMBER"&CHAR(10)&TEXT('🔥 FIRE Calculator'!E12,"$#,##0")` };
  sheet.getCell(`E${fR + 6}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell(`E${fR + 6}`).fill = FILLS.white;
  sheet.getCell(`E${fR + 6}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  sheet.getCell(`E${fR + 6}`).border = BORDER_THIN();

  sheet.mergeCells(`I${fR + 6}:L${fR + 6}`);
  sheet.getCell(`I${fR + 6}`).value = { formula: `"YEARS TO FIRE"&CHAR(10)&IFERROR(TEXT('🔥 FIRE Calculator'!E18,"0.0")&" yrs","—")` };
  sheet.getCell(`I${fR + 6}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.success) };
  sheet.getCell(`I${fR + 6}`).fill = FILLS.white;
  sheet.getCell(`I${fR + 6}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  sheet.getCell(`I${fR + 6}`).border = BORDER_THIN();
  sheet.getRow(fR + 6).height = 38;

  addCallout(sheet, `B${fR + 9}:L${fR + 10}`,
    '🔥',
    'How the meter works',
    'FIRE number = your annual spend × 25 (the 4% rule). Years-to-FIRE assumes your current savings rate continues. Adjust inputs on the FIRE Calculator tab to model conservative / current / aggressive scenarios. AI Edition adds the FIRE Forecaster prompt — paste your numbers into ChatGPT/Claude for a personalized read.');
  sheet.getRow(fR + 9).height = 28;
  sheet.getRow(fR + 10).height = 28;

  // [COMPLEMENT NWT-022 + NWT-023] Liquidity & FI snapshot block — 4 KPI cells.
  // Months of expenses (liquid) · Liquid net worth · FI progress · NW delta MoM
  const lR = fR + 12;
  sheet.mergeCells(`B${lR}:L${lR}`);
  sheet.getCell(`B${lR}`).value = 'Liquidity & FI snapshot';
  sheet.getCell(`B${lR}`).font = FONTS.section;
  sheet.getCell(`B${lR}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(lR).height = 22;

  const liqKpis = [
    {
      label: 'MONTHS OF EXPENSES',
      formula: `IFERROR(SUM('💼 Assets Summary'!N9:N12)/('🔥 FIRE Calculator'!C11/12),0)`,
      fmt: '0.0',
      cellsLabel: 'B',
      cellsValue: 'D',
    },
    {
      label: 'LIQUID NET WORTH',
      formula: `SUM('💼 Assets Summary'!N9:N12)-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW}`,
      fmt: '"$"#,##0',
      cellsLabel: 'E',
      cellsValue: 'G',
    },
    {
      label: 'FI PROGRESS',
      formula: `IFERROR(('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})/'🔥 FIRE Calculator'!E12,0)`,
      fmt: '0.0%',
      cellsLabel: 'H',
      cellsValue: 'J',
    },
    {
      label: 'NW DELTA MoM',
      formula: `('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})-('💼 Assets Summary'!M${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!M${LIABS.TOTAL_ROW})`,
      fmt: '+$#,##0;-$#,##0;$0',
      cellsLabel: 'K',
      cellsValue: 'L',
    },
  ];

  liqKpis.forEach((k) => {
    sheet.getCell(`${k.cellsLabel}${lR + 1}`).value = k.label;
    sheet.getCell(`${k.cellsLabel}${lR + 1}`).font = FONTS.smallCaps;
    sheet.getCell(`${k.cellsLabel}${lR + 1}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getCell(`${k.cellsLabel}${lR + 1}`).fill = FILLS.ivory;
    sheet.getCell(`${k.cellsLabel}${lR + 1}`).border = BORDER_THIN();
    sheet.getCell(`${k.cellsValue}${lR + 1}`).value = { formula: k.formula };
    sheet.getCell(`${k.cellsValue}${lR + 1}`).numFmt = k.fmt;
    sheet.getCell(`${k.cellsValue}${lR + 1}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`${k.cellsValue}${lR + 1}`).alignment = { vertical: 'middle', horizontal: 'right' };
    sheet.getCell(`${k.cellsValue}${lR + 1}`).fill = FILLS.white;
    sheet.getCell(`${k.cellsValue}${lR + 1}`).border = BORDER_THIN();
  });
  sheet.getRow(lR + 1).height = 28;

  addFooter(sheet, lR + 4, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 2 — 💼 ASSETS SUMMARY (Input spine, paired with Liabilities)
// ============================================================================

function buildAssetsSummary(workbook) {
  const sheet = workbook.addWorksheet('💼 Assets Summary');
  setTabColor(sheet, COLORS.success);
  // Sage column-A strip (asset tab) — 12 monthly columns (C-N) + class label (B)
  // [COMPLEMENT] Widened C-N from 10 to 16 so 8-digit HNW values ($99,999,999) render without
  // #### truncation. Persona 3 (Kareem) requires this — $5.2M Dubai RE displays as `$5,208,454`.
  setupColumns(sheet, { A: 2, B: 26, C: 16, D: 16, E: 16, F: 16, G: 16, H: 16, I: 16, J: 16, K: 16, L: 16, M: 16, N: 16, O: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💼 Assets Summary',
    tabSubtitle: 'Your single source of truth for everything you own. 16 asset classes × 12 monthly columns.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL ASSETS', value: { formula: `TEXT(N${ASSETS.TOTAL_ROW},"$#,##0")` } },
      { label: 'CASH',         value: { formula: `TEXT(SUM(N9:N11),"$#,##0")` } },
      { label: 'EQUITIES',     value: { formula: `TEXT(SUM(N16:N17),"$#,##0")` } },
      { label: 'REAL ESTATE',  value: { formula: `TEXT(N14,"$#,##0")` } },
      { label: 'OTHER',        value: { formula: `TEXT(N${ASSETS.TOTAL_ROW}-SUM(N9:N11)-SUM(N16:N17)-N14,"$#,##0")` } },
      { label: 'CLASSES',      value: { formula: `COUNTIF(N9:N24,">0")` } },
    ],
  });

  // === Header band — class label + 12 months + current total (col N) ===
  addTableHeader(sheet, ASSETS.HEADER_ROW,
    ['Asset Class', ...MONTHS, 'Current'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']);

  // 16 asset class rows with seed data — uses the worked-example persona from
  // net-worth-ai-prompts.md (37yo SWE, married, 2 kids, ~$326K NW, Texas rental)
  // for narrative continuity with the AI PDF.
  const seed = [
    { class: 'Checking',                 jan: 4200, feb: 4100, mar: 4300, apr: 4500, may: 4200, jun: 4400, jul: 4300, aug: 4500, sep: 4200, oct: 4400, nov: 4300, dec: 4500 },
    { class: 'HYSA',                     jan: 9500, feb: 9700, mar: 9900, apr: 10100, may: 10300, jun: 10500, jul: 10700, aug: 10900, sep: 11100, oct: 11200, nov: 11400, dec: 11400 },
    { class: 'Money Market',             jan: 0,    feb: 0,    mar: 0,    apr: 0,    may: 0,    jun: 0,    jul: 0,    aug: 0,    sep: 0,    oct: 0,    nov: 0,    dec: 0 },
    { class: 'Foreign Currency',         jan: 0,    feb: 0,    mar: 0,    apr: 0,    may: 0,    jun: 0,    jul: 0,    aug: 0,    sep: 0,    oct: 0,    nov: 0,    dec: 0 },
    { class: 'Vehicles (KBB)',           jan: 24500, feb: 24200, mar: 23900, apr: 23600, may: 23300, jun: 23000, jul: 22700, aug: 22400, sep: 22100, oct: 21800, nov: 21500, dec: 21200 },
    { class: 'Real Estate (Primary)',    jan: 462000, feb: 462000, mar: 462000, apr: 467000, may: 467000, jun: 467000, jul: 467000, aug: 467000, sep: 467000, oct: 472000, nov: 472000, dec: 472000 },
    { class: 'Real Estate (Investment)', jan: 218000, feb: 218000, mar: 218000, apr: 221000, may: 221000, jun: 221000, jul: 221000, aug: 221000, sep: 221000, oct: 224000, nov: 224000, dec: 224000 },
    { class: 'Stocks & Funds (Taxable)', jan: 42000, feb: 43800, mar: 46200, apr: 48100, may: 47200, jun: 49100, jul: 51200, aug: 52800, sep: 51900, oct: 48900, nov: 50300, dec: 51800 },
    { class: '401k / IRA / Roth',        jan: 84000, feb: 87200, mar: 91800, apr: 94600, may: 92800, jun: 96400, jul: 100100, aug: 102800, sep: 101400, oct: 95800, nov: 98700, dec: 101200 },
    { class: 'HSA / 529',                jan: 7200, feb: 7500, mar: 7800, apr: 8100, may: 8200, jun: 8500, jul: 8800, aug: 9100, sep: 9000, oct: 8700, nov: 8900, dec: 9200 },
    { class: 'Metals (Gold/Silver)',     jan: 4800, feb: 4900, mar: 5100, apr: 5200, may: 5300, jun: 5400, jul: 5500, aug: 5600, sep: 5700, oct: 5650, nov: 5700, dec: 5800 },
    { class: 'Crypto (BTC/ETH)',         jan: 7200, feb: 7800, mar: 8400, apr: 9100, may: 8600, jun: 9300, jul: 10100, aug: 10800, sep: 10400, oct: 9700, nov: 10200, dec: 10800 },
    { class: 'Business Equity',          jan: 28000, feb: 28000, mar: 28000, apr: 28000, may: 28000, jun: 28000, jul: 28000, aug: 28000, sep: 28000, oct: 28000, nov: 28000, dec: 28000 },
    { class: 'Life Insurance DB',        jan: 0,    feb: 0,    mar: 0,    apr: 0,    may: 0,    jun: 0,    jul: 0,    aug: 0,    sep: 0,    oct: 0,    nov: 0,    dec: 0 },
    { class: 'Receivables',              jan: 0,    feb: 0,    mar: 0,    apr: 0,    may: 0,    jun: 0,    jul: 0,    aug: 0,    sep: 0,    oct: 0,    nov: 0,    dec: 0 },
    { class: 'Other (collectibles/art)', jan: 3500, feb: 3500, mar: 3500, apr: 3500, may: 3500, jun: 3500, jul: 3500, aug: 3500, sep: 3500, oct: 3500, nov: 3500, dec: 3500 },
  ];

  const monthCols = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  // 'M' is November; 'N' is December (current month). Total Dec/Current is N.
  // Wait — we have 12 months Jan-Dec needing 12 columns C-N. So:
  // Jan=C, Feb=D, Mar=E, Apr=F, May=G, Jun=H, Jul=I, Aug=J, Sep=K, Oct=L, Nov=M, Dec=N.
  const allMonthCols = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
  const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  for (let i = 0; i < ASSETS.ROW_COUNT; i++) {
    const ri = ASSETS.FIRST_ROW + i;
    const row = seed[i];

    sheet.getCell(`B${ri}`).value = row.class;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    // Sage column-A 12px accent strip per design brief
    sheet.getCell(`A${ri}`).fill = FILLS.successLight;

    // [FIX-BNDL-005] Cross-SKU cell comment on Stocks & Funds row → IPT linkage
    if (i === 7) {
      sheet.getCell(`B${ri}`).note = 'BUNDLE NOTE — If you also own the Investment Portfolio Tracker (bundled), this row should equal IPT 🏠 Dashboard → Total MV. The two workbooks intentionally do NOT auto-link so each remains usable standalone. Update at month-end after editing IPT.';
    }

    allMonthCols.forEach((col, mi) => {
      const val = row[monthKeys[mi]];
      sheet.getCell(`${col}${ri}`).value = val || null;
      sheet.getCell(`${col}${ri}`).numFmt = '"$"#,##0';
      sheet.getCell(`${col}${ri}`).font = FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${col}${ri}`).fill = FILLS.white;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
      sheet.getCell(`${col}${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true };
    });
  }

  // === Grand total row (TOTAL_ROW = 26) ===
  sheet.getCell(`B${ASSETS.TOTAL_ROW}`).value = 'TOTAL ASSETS';
  sheet.getCell(`B${ASSETS.TOTAL_ROW}`).font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell(`B${ASSETS.TOTAL_ROW}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getCell(`B${ASSETS.TOTAL_ROW}`).fill = FILLS.ivory;

  allMonthCols.forEach((col) => {
    sheet.getCell(`${col}${ASSETS.TOTAL_ROW}`).value = { formula: `SUM(${col}${ASSETS.FIRST_ROW}:${col}${ASSETS.LAST_ROW})` };
    sheet.getCell(`${col}${ASSETS.TOTAL_ROW}`).numFmt = '"$"#,##0';
    sheet.getCell(`${col}${ASSETS.TOTAL_ROW}`).font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.success) };
    sheet.getCell(`${col}${ASSETS.TOTAL_ROW}`).alignment = { horizontal: 'right' };
    sheet.getCell(`${col}${ASSETS.TOTAL_ROW}`).fill = FILLS.ivory;
    sheet.getCell(`${col}${ASSETS.TOTAL_ROW}`).border = { top: { style: 'medium', color: argb(COLORS.success) } };
  });

  addCallout(sheet, `B${ASSETS.TOTAL_ROW + 2}:N${ASSETS.TOTAL_ROW + 3}`,
    '💡',
    'How to enter monthly balances',
    'Copy a column at month-end from your bank/brokerage statements. No formulas in input cells — you control every number. Current column (N = December) drives the Dashboard. Adjust class labels to match your accounts; rows are flexible. The Real Estate row aggregates from the Real Estate tab (Pro+); Stocks/Funds aggregates from Stocks & Funds (Pro+).');
  sheet.getRow(ASSETS.TOTAL_ROW + 2).height = 28;
  sheet.getRow(ASSETS.TOTAL_ROW + 3).height = 28;

  // [FIX-BNDL-005] Visible BUNDLE NOTE — Investment Portfolio link (B30)
  addCallout(sheet, `B${ASSETS.TOTAL_ROW + 4}:N${ASSETS.TOTAL_ROW + 4}`,
    '🔗',
    'BUNDLE NOTE — Investment Portfolio link',
    'If you also own the Investment Portfolio Tracker (bundled), the "Stocks & Funds (Taxable)" row above (row 16) should equal your IPT 🏠 Dashboard → Total MV. Update at month-end. The two workbooks intentionally do NOT auto-link (so each remains usable standalone).');
  sheet.getRow(ASSETS.TOTAL_ROW + 4).height = 36;

  // [FIX-BNDL-015] About the Dashboard headline (Dec-only by design) (B31)
  addCallout(sheet, `B${ASSETS.TOTAL_ROW + 5}:N${ASSETS.TOTAL_ROW + 5}`,
    'ℹ️',
    'About the Dashboard headline — TOTAL ASSETS',
    'The TOTAL ASSETS KPI on the Dashboard reflects the December (year-end) column by design — net worth at end of fiscal year. If you start tracking mid-year, fill the December column with your CURRENT balances to see the headline number; expand monthly as you complete months. The NW History tab tracks month-over-month deltas independently.');
  sheet.getRow(ASSETS.TOTAL_ROW + 5).height = 36;

  addFooter(sheet, ASSETS.TOTAL_ROW + 9, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 3 — 📉 LIABILITIES SUMMARY (Input spine, paired with Assets)
// ============================================================================

function buildLiabilitiesSummary(workbook) {
  const sheet = workbook.addWorksheet('📉 Liabilities Summary');
  setTabColor(sheet, COLORS.alert);
  // [COMPLEMENT] Widened C-N from 10 to 16 — 8-digit HNW liability balances render cleanly.
  setupColumns(sheet, { A: 2, B: 26, C: 16, D: 16, E: 16, F: 16, G: 16, H: 16, I: 16, J: 16, K: 16, L: 16, M: 16, N: 16, O: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📉 Liabilities Summary',
    tabSubtitle: '11 liability types × 12 monthly columns. Debt-to-asset ratio recomputes live.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL LIABS',  value: { formula: `TEXT(N${LIABS.TOTAL_ROW},"$#,##0")` } },
      { label: 'MORTGAGE',     value: { formula: `TEXT(N9,"$#,##0")` } },
      { label: 'CONSUMER',     value: { formula: `TEXT(SUM(N10:N12),"$#,##0")` } },
      { label: 'STUDENT',      value: { formula: `TEXT(N12,"$#,##0")` } },
      { label: 'DEBT/ASSET',   value: { formula: `TEXT(IFERROR(N${LIABS.TOTAL_ROW}/'💼 Assets Summary'!N${ASSETS.TOTAL_ROW},0),"0.0%")` } },
      { label: 'ACTIVE',       value: { formula: `COUNTIF(N9:N19,">0")` } },
    ],
  });

  addTableHeader(sheet, LIABS.HEADER_ROW,
    ['Liability Type', ...MONTHS, 'Current'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']);

  // 11 liability rows with realistic seed (mortgage paydown + auto loan + student loan)
  const liabSeed = [
    { type: 'Mortgage',         start: 312000, monthlyPaydown: 720 },
    { type: 'Auto Loan',        start: 18500,  monthlyPaydown: 410 },
    { type: 'Credit Card',      start: 1800,   monthlyPaydown: 150 },
    { type: 'Student Loan',     start: 14200,  monthlyPaydown: 320 },
    { type: 'Personal Loan',    start: 0,      monthlyPaydown: 0 },
    { type: 'Business Loan',    start: 0,      monthlyPaydown: 0 },
    { type: 'Family Loan',      start: 0,      monthlyPaydown: 0 },
    { type: 'Medical Debt',     start: 0,      monthlyPaydown: 0 },
    { type: 'BNPL',             start: 0,      monthlyPaydown: 0 },
    { type: 'Tax Owed',         start: 0,      monthlyPaydown: 0 },
    { type: 'Other',            start: 0,      monthlyPaydown: 0 },
  ];

  const allMonthCols = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

  for (let i = 0; i < LIABS.ROW_COUNT; i++) {
    const ri = LIABS.FIRST_ROW + i;
    const row = liabSeed[i];

    sheet.getCell(`B${ri}`).value = row.type;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    // Alert-red column-A 12px accent strip per design brief
    sheet.getCell(`A${ri}`).fill = FILLS.alertLight;

    allMonthCols.forEach((col, mi) => {
      // Linear paydown from start balance
      const bal = row.start > 0 ? Math.max(0, row.start - row.monthlyPaydown * (mi + 1)) : 0;
      sheet.getCell(`${col}${ri}`).value = bal || null;
      sheet.getCell(`${col}${ri}`).numFmt = '"$"#,##0';
      sheet.getCell(`${col}${ri}`).font = FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${col}${ri}`).fill = FILLS.white;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
      sheet.getCell(`${col}${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true };
    });
  }

  // === Grand total row ===
  sheet.getCell(`B${LIABS.TOTAL_ROW}`).value = 'TOTAL LIABILITIES';
  sheet.getCell(`B${LIABS.TOTAL_ROW}`).font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell(`B${LIABS.TOTAL_ROW}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getCell(`B${LIABS.TOTAL_ROW}`).fill = FILLS.ivory;

  allMonthCols.forEach((col) => {
    sheet.getCell(`${col}${LIABS.TOTAL_ROW}`).value = { formula: `SUM(${col}${LIABS.FIRST_ROW}:${col}${LIABS.LAST_ROW})` };
    sheet.getCell(`${col}${LIABS.TOTAL_ROW}`).numFmt = '"$"#,##0';
    sheet.getCell(`${col}${LIABS.TOTAL_ROW}`).font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.alert) };
    sheet.getCell(`${col}${LIABS.TOTAL_ROW}`).alignment = { horizontal: 'right' };
    sheet.getCell(`${col}${LIABS.TOTAL_ROW}`).fill = FILLS.ivory;
    sheet.getCell(`${col}${LIABS.TOTAL_ROW}`).border = { top: { style: 'medium', color: argb(COLORS.alert) } };
  });

  // === Debt-to-asset ratio prominent display ===
  sheet.mergeCells(`B${LIABS.TOTAL_ROW + 2}:F${LIABS.TOTAL_ROW + 3}`);
  sheet.getCell(`B${LIABS.TOTAL_ROW + 2}`).value = { formula: `"DEBT-TO-ASSET RATIO"&CHAR(10)&TEXT(IFERROR(N${LIABS.TOTAL_ROW}/'💼 Assets Summary'!N${ASSETS.TOTAL_ROW},0),"0.0%")&CHAR(10)&IF(IFERROR(N${LIABS.TOTAL_ROW}/'💼 Assets Summary'!N${ASSETS.TOTAL_ROW},1)<0.3,"🟢 Healthy",IF(IFERROR(N${LIABS.TOTAL_ROW}/'💼 Assets Summary'!N${ASSETS.TOTAL_ROW},1)<0.5,"🟡 Moderate","🔴 High"))` };
  sheet.getCell(`B${LIABS.TOTAL_ROW + 2}`).font = { name: 'Inter', size: 16, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell(`B${LIABS.TOTAL_ROW + 2}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  sheet.getCell(`B${LIABS.TOTAL_ROW + 2}`).fill = FILLS.ivory;
  sheet.getCell(`B${LIABS.TOTAL_ROW + 2}`).border = {
    left: { style: 'medium', color: argb(COLORS.warmGold) },
    top: { style: 'thin', color: argb(COLORS.divider) },
    bottom: { style: 'thin', color: argb(COLORS.divider) },
    right: { style: 'thin', color: argb(COLORS.divider) },
  };
  sheet.getRow(LIABS.TOTAL_ROW + 2).height = 30;
  sheet.getRow(LIABS.TOTAL_ROW + 3).height = 30;

  addCallout(sheet, `G${LIABS.TOTAL_ROW + 2}:N${LIABS.TOTAL_ROW + 3}`,
    '💡',
    'Healthy debt-to-asset benchmarks',
    'Under 30%: healthy. 30–50%: moderate (typical with mortgage). Over 50%: high. Mortgage debt is treated the same as consumer debt in this ratio — for the "net of mortgage" view, deduct primary-residence value + mortgage balance and recompute.');
  sheet.getRow(LIABS.TOTAL_ROW + 2).height = 30;
  sheet.getRow(LIABS.TOTAL_ROW + 3).height = 30;

  addFooter(sheet, LIABS.TOTAL_ROW + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 4 — 📊 NW HISTORY (Essentials+, 5-year monthly log + driver breakdown)
// ============================================================================

function buildNWHistory(workbook) {
  const sheet = workbook.addWorksheet('📊 NW History');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 14, C: 14, D: 14, E: 14, F: 13, G: 13, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📊 NW History',
    tabSubtitle: '5-year month-by-month log. Driver breakdown decomposes change into Savings / Market / Debt paydown / Other.',
    bannerText: BANNER,
    kpiData: [
      // [FIX NWT-006] Data rows are 11-70, not 12-71. [FIX NWT-018] MIN(IF()) → MINIFS portable.
      { label: 'ROW COUNT',   value: { formula: `COUNTA(B11:B70)` } },
      { label: 'PEAK NW',     value: { formula: `TEXT(IFERROR(MAX(E11:E70),0),"$#,##0")` } },
      { label: 'TROUGH',      value: { formula: `TEXT(IFERROR(MINIFS(E11:E70,E11:E70,">0"),0),"$#,##0")` } },
      { label: '12-MO AVG MOM', value: { formula: `TEXT(IFERROR(AVERAGE(F11:F22),0),"$#,##0")` } },
      { label: 'BEST MONTH',  value: { formula: `IFERROR(INDEX(B11:B70,MATCH(MAX(F11:F70),F11:F70,0)),"—")` } },
      { label: 'WORST MONTH', value: { formula: `IFERROR(INDEX(B11:B70,MATCH(MIN(F11:F70),F11:F70,0)),"—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Monthly NW log', 'One row per month. NW = Total Assets - Total Liabilities. MoM/YoY auto-compute. Driver columns capture the WHY behind each change.');

  addTableHeader(sheet, r + 1,
    ['Month', 'Total Assets', 'Total Liabs', 'Net Worth', 'MoM $', 'YoY $', 'Savings', 'Market', 'Debt Paydown', 'Other'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  // Seed 12 months for the current year using the same persona ($284K → $326K trajectory).
  const startNW = 284000;
  const monthlyDeltas = [3100, 5200, 8400, 6200, -3800, 4900, 7100, 5800, -2100, -3200, 4400, 6200]; // -3200 is October per AI prompt persona
  let cum = startNW;
  for (let i = 0; i < 60; i++) {
    const ri = r + 2 + i;
    const monthIdx = i % 12;
    const yearOffset = Math.floor(i / 12);
    const date = new Date(2026 + yearOffset, monthIdx, 28);

    sheet.getCell(`B${ri}`).value = date;
    sheet.getCell(`B${ri}`).numFmt = 'mmm yyyy';
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    let assets, liabs, nw, mom, market, savings, debtPaydown, other;
    if (i < 12) {
      // Year 1 seeded
      cum += monthlyDeltas[i];
      assets = cum + 312000; // approx
      liabs = 312000 - i * 1600;
      nw = cum;
      mom = monthlyDeltas[i];
      // Decompose: ~$1850/mo savings constant, debt paydown $1600/mo, rest is market
      savings = 1850;
      debtPaydown = 1600;
      market = mom - savings - debtPaydown;
      other = 0;
    } else {
      // Years 2-5 — placeholder rows (user populates)
      assets = null;
      liabs = null;
      nw = null;
      mom = null;
      market = null;
      savings = null;
      debtPaydown = null;
      other = null;
    }

    sheet.getCell(`C${ri}`).value = assets;
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = liabs;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    // [FIX NWT-007] Empty-row guards so future placeholder rows (year 2-5) don't show $0 NW.
    sheet.getCell(`E${ri}`).value = { formula: `IF(C${ri}="","",IFERROR(C${ri}-D${ri},""))` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = i === 0 ? null : { formula: `IF(OR(E${ri}="",E${ri - 1}=""),"",IFERROR(E${ri}-E${ri - 1},""))` };
    sheet.getCell(`F${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = i < 12 ? null : { formula: `IF(OR(E${ri}="",E${ri - 12}=""),"",IFERROR(E${ri}-E${ri - 12},""))` };
    sheet.getCell(`G${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    [
      { col: 'H', val: savings, color: COLORS.success },
      { col: 'I', val: market, color: COLORS.warmGold },
      { col: 'J', val: debtPaydown, color: COLORS.success },
      { col: 'K', val: other, color: COLORS.textMuted },
    ].forEach(({ col, val, color }) => {
      sheet.getCell(`${col}${ri}`).value = val;
      sheet.getCell(`${col}${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
      sheet.getCell(`${col}${ri}`).font = { ...FONTS.body, color: argb(color) };
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    });
  }

  // CF on MoM column — green positive, red negative
  sheet.addConditionalFormatting({
    ref: `F${r + 2}:F${r + 61}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 1, style: { font: { color: argb(COLORS.success), bold: true } } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 2, style: { font: { color: argb(COLORS.alert), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 64}:K${r + 65}`,
    '📈',
    'How driver breakdown helps you',
    'A $13K month is meaningful information only if you know WHY. Savings = your discipline. Market = noise. Debt Paydown = compounding. Other = one-offs (bonuses, refunds, major purchases). The AI Monthly NW Narrative prompt separates SIGNAL from NOISE using exactly this decomposition.');
  sheet.getRow(r + 64).height = 28;
  sheet.getRow(r + 65).height = 28;

  addFooter(sheet, r + 69, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 5 — 🚗 VEHICLE DEPRECIATION (Essentials [2 vehicles] / Pro [5 + TCO])
// ============================================================================

function buildVehicleDepreciation(workbook) {
  const tier = workbook._tier || 'ai';
  const sheet = workbook.addWorksheet('🚗 Vehicle Depreciation');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 18, C: 10, D: 10, E: 12, F: 12, G: 12, H: 12, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🚗 Vehicle Depreciation',
    tabSubtitle: `KBB-method depreciation curve per vehicle. ${tier === 'essentials' ? '2 vehicles' : '5 vehicles + TCO + lease-vs-own'}.`,
    bannerText: BANNER,
    kpiData: [
      // [FIX NWT-006] 5 vehicle rows at 11-15, not 12-16.
      { label: 'VEHICLES',     value: { formula: `COUNTA(B11:B15)` } },
      { label: 'TOTAL VALUE',  value: { formula: `TEXT(SUM(G11:G15),"$#,##0")` } },
      { label: 'YR-1 DEPREC',  value: { formula: `TEXT(IFERROR(SUM(G11:G15)-SUM(H11:H15),0),"$#,##0")` } },
      { label: 'YR-5 PROJ',    value: { formula: `TEXT(IFERROR(SUM(G11:G15)*0.4,0),"$#,##0")` } },
      { label: 'AVG AGE',      value: { formula: `IFERROR(TEXT(YEAR(TODAY())-AVERAGE(C11:C15),"0"),"—")` } },
      { label: 'TCO/MO TOT',   value: { formula: `TEXT(SUM(K11:K15),"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Vehicle inventory', 'KBB current value + 5-year depreciation projection (15% Year 1, then 10% annually). Pro+ unlocks TCO breakdown + lease-vs-own comparison.');

  addTableHeader(sheet, r + 1,
    ['Vehicle', 'Year', 'Make/Model', 'Mileage', 'Purchase $', 'Current KBB', 'Year-5 Proj.', 'Lease?', 'Yr Depreciation', 'TCO/mo (Pro)', 'Status'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const vehicleSeed = [
    { name: 'Daily driver',    year: 2022, makeModel: 'Honda Civic',   mileage: 38000,  purchase: 26500, kbb: 22400, lease: false },
    { name: 'Family SUV',      year: 2020, makeModel: 'Toyota Highlander', mileage: 62000, purchase: 41000, kbb: 28800, lease: false },
    { name: '',                year: '',   makeModel: '',                mileage: '',    purchase: '',    kbb: '',    lease: false },
    { name: '',                year: '',   makeModel: '',                mileage: '',    purchase: '',    kbb: '',    lease: false },
    { name: '',                year: '',   makeModel: '',                mileage: '',    purchase: '',    kbb: '',    lease: false },
  ];

  for (let i = 0; i < 5; i++) {
    const ri = r + 2 + i;
    const v = vehicleSeed[i];

    sheet.getCell(`B${ri}`).value = v.name || null;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = v.year || null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = v.makeModel || null;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = v.mileage || null;
    sheet.getCell(`E${ri}`).numFmt = '#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = v.purchase || null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = v.kbb || null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    // Year-5 projection = current * 0.59 (15% year 1, 10% each subsequent → 0.85 × 0.9^4 ≈ 0.557)
    // [FIX NWT-001] Empty-row guard so placeholder rows don't show $0.
    sheet.getCell(`H${ri}`).value = { formula: `IF(B${ri}="","",IFERROR(G${ri}*0.557,""))` };
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = { ...FONTS.body, color: argb(COLORS.alert) };
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = 'Own';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
    sheet.getCell(`I${ri}`).dataValidation = { type: 'list', formulae: ['"Own,Lease"'], allowBlank: true };

    // Year depreciation = current_KBB × 0.10
    // [FIX NWT-001] Empty-row guard.
    sheet.getCell(`J${ri}`).value = { formula: `IF(B${ri}="","",IFERROR(G${ri}*0.1,""))` };
    sheet.getCell(`J${ri}`).numFmt = '-"$"#,##0';
    sheet.getCell(`J${ri}`).font = { ...FONTS.body, color: argb(COLORS.alert) };
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    // TCO/mo (Pro+) — placeholder per-vehicle TCO; user inputs detail rows below
    sheet.getCell(`K${ri}`).value = v.name ? (i === 0 ? 580 : 720) : null;
    sheet.getCell(`K${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`K${ri}`).font = FONTS.body;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).value = { formula: `IF(B${ri}="","",IF(J${ri}>1500,"🔴 Heavy",IF(J${ri}>800,"🟡 Moderate","🟢 Light")))` };
    sheet.getCell(`L${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${r + 9}:L${r + 10}`,
    '🚗',
    `Vehicles in ${tier === 'essentials' ? 'Essentials' : 'Pro'}`,
    tier === 'essentials'
      ? 'Essentials supports 2 vehicles with KBB depreciation curve + Year-5 projection. Upgrade to Pro for 5 vehicles + TCO breakdown (purchase + finance + insurance + maintenance + fuel + repairs) + lease-vs-own comparison math.'
      : 'Pro supports 5 vehicles. TCO column captures monthly cost of ownership (finance + insurance + maintenance + fuel + repairs). Lease-vs-own comparison: a $400/mo lease vs. owning at $580/mo TCO with $11K equity loss over 3 years — usually lease wins for buyers <40k miles/yr.');
  sheet.getRow(r + 9).height = 28;
  sheet.getRow(r + 10).height = 28;

  addFooter(sheet, r + 14, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 6 — 🏠 REAL ESTATE (Pro+) — 3 properties with equity/LTV/appreciation
// ============================================================================

function buildRealEstate(workbook) {
  const sheet = workbook.addWorksheet('🏠 Real Estate');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 12, D: 12, E: 12, F: 11, G: 11, H: 11, I: 11, J: 11, K: 11, L: 11, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '🏠 Real Estate',
    tabSubtitle: 'Primary + Vacation + Investment with equity / LTV / appreciation. Rental cash flow on investment row.',
    bannerText: BANNER,
    kpiData: [
      // [FIX NWT-006 + NWT-015] 3 property rows at 11-13, not 12-14. Pre-fix excluded Primary.
      { label: 'PROPERTIES',     value: { formula: `COUNTA(B11:B13)` } },
      { label: 'TOTAL VALUE',    value: { formula: `TEXT(SUM(C11:C13),"$#,##0")` } },
      { label: 'TOTAL EQUITY',   value: { formula: `TEXT(SUM(F11:F13),"$#,##0")` } },
      { label: 'AVG LTV',        value: { formula: `TEXT(IFERROR(AVERAGE(G11:G13),0),"0.0%")` } },
      { label: 'RENTAL CF/MO',   value: { formula: `TEXT(IFERROR(L13,0),"$#,##0")` } },
      { label: 'TOTAL DEBT',     value: { formula: `TEXT(SUM(D11:D13),"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Property inventory', 'Primary residence + vacation home + investment property. Zestimate is a manual reference — your address is never queried by any third party.');

  addTableHeader(sheet, r + 1,
    ['Property', 'Value (Zestimate)', 'Mortgage Bal', 'Rate', 'Equity', 'LTV', 'Annual Appr.', 'Monthly P&I', 'Tax+Ins+HOA', 'Gross Rent', 'Net CF'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const propertySeed = [
    { name: 'Primary residence',    value: 472000, mortgage: 268000, rate: 0.055, monthlyPI: 1522, taxIns: 740,  rent: 0,    netCF: 0 },
    { name: 'Vacation cabin',       value: 0,      mortgage: 0,      rate: 0,     monthlyPI: 0,    taxIns: 0,    rent: 0,    netCF: 0 },
    { name: 'Investment (Texas)',   value: 224000, mortgage: 168000, rate: 0.067, monthlyPI: 1085, taxIns: 410,  rent: 1800, netCF: 305 },
  ];

  for (let i = 0; i < 3; i++) {
    const ri = r + 2 + i;
    const p = propertySeed[i];

    sheet.getCell(`B${ri}`).value = p.name || null;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = p.value || null;
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = p.mortgage || null;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = p.rate || null;
    sheet.getCell(`E${ri}`).numFmt = '0.00%';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(C${ri}-D${ri},"")` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(D${ri}/C${ri},"")` };
    sheet.getCell(`G${ri}`).numFmt = '0.0%';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = 0.035; // 3.5% default annual appreciation
    sheet.getCell(`H${ri}`).numFmt = '0.0%';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = p.monthlyPI || null;
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = p.taxIns || null;
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = p.rent || null;
    sheet.getCell(`K${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`K${ri}`).font = FONTS.body;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    // Net cash flow = Gross rent - PI - tax/ins/maintenance reserve (10%)
    sheet.getCell(`L${ri}`).value = { formula: `IF(K${ri}="","",IFERROR(K${ri}-I${ri}-J${ri}-K${ri}*0.1,""))` };
    sheet.getCell(`L${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`L${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  // CF on LTV — alert >80% (PMI threshold)
  sheet.addConditionalFormatting({
    ref: `G${r + 2}:G${r + 4}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.8'], priority: 1, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['0.5'], priority: 2, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 7}:L${r + 8}`,
    '🏠',
    'Equity vs LTV — what to watch',
    'LTV <80% removes PMI on conventional loans. LTV <70% unlocks better cash-out refi terms. Rental properties: target 1% rule (monthly rent ≥1% of purchase) for positive cash flow. Annual appreciation 3.5% is the long-run national average — adjust per market.');
  sheet.getRow(r + 7).height = 28;
  sheet.getRow(r + 8).height = 28;

  addFooter(sheet, r + 12, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 7 — 📊 STOCKS & FUNDS (Pro+) — 7-account split (depth differentiator)
// ============================================================================

function buildStocksAndFunds(workbook) {
  const sheet = workbook.addWorksheet('📊 Stocks & Funds');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 12, C: 10, D: 11, E: 11, F: 11, G: 11, H: 11, I: 10, J: 13, K: 9, L: 11, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '📊 Stocks & Funds',
    tabSubtitle: '7-account split: 401k · IRA · Roth · SEP · HSA · 529 · Taxable. GOOGLEFINANCE drives live prices.',
    bannerText: BANNER,
    kpiData: [
      // [FIX NWT-006] 25 position rows at 11-35, not 12-36.
      // [FIX NWT-017] COST BASIS pre-fix used SUMPRODUCT(D,F) — but F already holds D*E (cost basis $),
      // so multiplying by shares gave nonsense ~$14.7M off. Correct: SUM(F).
      { label: 'POSITIONS',   value: { formula: `COUNTA(C11:C35)` } },
      { label: 'TOTAL VALUE', value: { formula: `TEXT(SUM(H11:H35),"$#,##0")` } },
      { label: 'COST BASIS',  value: { formula: `TEXT(SUM(F11:F35),"$#,##0")` } },
      { label: 'UNREALIZED',  value: { formula: `TEXT(SUM(H11:H35)-SUM(F11:F35),"$#,##0")` } },
      { label: 'AVG YIELD',   value: { formula: `TEXT(IFERROR(SUMPRODUCT(H11:H35,J11:J35)/SUM(H11:H35),0),"0.00%")` } },
      { label: 'ACCOUNTS',    value: { formula: `IFERROR(COUNTA(B11:B35)-COUNTIF(B11:B35,B10),"7")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, '7-account holdings — depth claim no competitor matches', 'Each account type tagged separately: 401k / IRA / Roth IRA / SEP IRA / HSA / 529 / Taxable. Live prices via GOOGLEFINANCE in Google Sheets.');

  addTableHeader(sheet, r + 1,
    ['Account', 'Ticker', 'Shares', 'Cost/share', 'Cost basis', 'Current $', 'Current value', 'Gain/Loss', 'Yield %', 'Tax-adv', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  // 25 holding rows across 7 account types
  const holdings = [
    { acct: '401k',     ticker: 'VTSAX',   shares: 142.3,  cost: 98.40,  price: 124.50, yield: 0.014 },
    { acct: '401k',     ticker: 'VBTLX',   shares: 285.0,  cost: 10.10,  price: 9.85,   yield: 0.041 },
    { acct: '401k',     ticker: 'VTIAX',   shares: 184.2,  cost: 28.50,  price: 31.20,  yield: 0.029 },
    { acct: 'IRA',      ticker: 'VTSAX',   shares: 78.4,   cost: 102.00, price: 124.50, yield: 0.014 },
    { acct: 'IRA',      ticker: 'VBTLX',   shares: 412.0,  cost: 10.50,  price: 9.85,   yield: 0.041 },
    { acct: 'Roth IRA', ticker: 'VTSAX',   shares: 124.6,  cost: 88.20,  price: 124.50, yield: 0.014 },
    { acct: 'Roth IRA', ticker: 'SCHD',    shares: 220.0,  cost: 71.40,  price: 82.10,  yield: 0.034 },
    { acct: 'HSA',      ticker: 'VTSAX',   shares: 32.1,   cost: 95.00,  price: 124.50, yield: 0.014 },
    { acct: 'HSA',      ticker: 'VBTLX',   shares: 84.2,   cost: 10.40,  price: 9.85,   yield: 0.041 },
    { acct: '529',      ticker: 'VFFVX',   shares: 156.0,  cost: 22.80,  price: 24.20,  yield: 0.018 },
    { acct: 'Taxable',  ticker: 'VTI',     shares: 88.0,   cost: 185.50, price: 234.80, yield: 0.014 },
    { acct: 'Taxable',  ticker: 'VXUS',    shares: 124.0,  cost: 56.80,  price: 62.40,  yield: 0.029 },
    { acct: 'Taxable',  ticker: 'BND',     shares: 168.0,  cost: 78.20,  price: 75.10,  yield: 0.041 },
    { acct: 'Taxable',  ticker: 'VNQ',     shares: 44.0,   cost: 88.10,  price: 92.40,  yield: 0.038 },
    { acct: 'Taxable',  ticker: 'AAPL',    shares: 28.0,   cost: 142.50, price: 187.80, yield: 0.005 },
    { acct: 'Taxable',  ticker: 'MSFT',    shares: 22.0,   cost: 282.40, price: 412.60, yield: 0.007 },
  ];

  for (let i = 0; i < 25; i++) {
    const ri = r + 2 + i;
    const h = holdings[i];

    sheet.getCell(`B${ri}`).value = h ? h.acct : null;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).dataValidation = { type: 'list', formulae: ['"401k,IRA,Roth IRA,SEP IRA,HSA,529,Taxable"'], allowBlank: true };

    sheet.getCell(`C${ri}`).value = h ? h.ticker : null;
    sheet.getCell(`C${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = h ? h.shares : null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = h ? h.cost : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(D${ri}*E${ri},"")` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = h ? h.price : null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`G${ri}`).font = { ...FONTS.body, color: argb(COLORS.warmGold) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR(D${ri}*G${ri},"")` };
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(H${ri}-F${ri},"")` };
    sheet.getCell(`I${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`I${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = h ? h.yield : null;
    sheet.getCell(`J${ri}`).numFmt = '0.00%';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = { formula: `IF(OR(B${ri}="401k",B${ri}="IRA",B${ri}="Roth IRA",B${ri}="SEP IRA",B${ri}="HSA",B${ri}="529"),"✓","")` };
    sheet.getCell(`K${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  // CF on Gain/Loss column — green/red
  sheet.addConditionalFormatting({
    ref: `I${r + 2}:I${r + 26}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 1, style: { font: { color: argb(COLORS.success), bold: true } } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 2, style: { font: { color: argb(COLORS.alert), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 29}:L${r + 30}`,
    '📊',
    'GOOGLEFINANCE in Sheets — Excel users enter manually',
    'In Google Sheets, replace the Current $ column with `=GOOGLEFINANCE(C12)` (or wherever the ticker is). Refreshes daily. Excel users enter manually monthly. The 7-account split is the depth claim — Empower / Monarch / Kubera lump all retirement accounts together; we keep them distinct so you can see contribution room + tax treatment per account type.');
  sheet.getRow(r + 29).height = 30;
  sheet.getRow(r + 30).height = 30;

  addFooter(sheet, r + 34, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 8 — 🥇 METALS & CRYPTO (Pro+) — Precious metals + crypto with cold-storage tracking
// ============================================================================

function buildMetalsAndCrypto(workbook) {
  const sheet = workbook.addWorksheet('🥇 Metals & Crypto');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 14, C: 12, D: 11, E: 11, F: 11, G: 11, H: 13, I: 13, J: 12, K: 18, L: 8, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '🥇 Metals & Crypto',
    tabSubtitle: 'Precious metals (gold/silver/platinum/palladium) + Crypto (BTC/ETH/altcoins). Cold-storage flag for crypto safety.',
    bannerText: BANNER,
    kpiData: [
      // [FIX NWT-006] Metals at rows 11-16 (6 metal rows under section header at row 6).
      // Crypto section header starts at row 19 (r+10=19), header at 22, data at 24-30.
      { label: 'METALS $',   value: { formula: `TEXT(SUM(H11:H16),"$#,##0")` } },
      { label: 'CRYPTO $',   value: { formula: `TEXT(SUM(H24:H30),"$#,##0")` } },
      { label: 'GOLD oz',    value: { formula: `IFERROR(D11,"—")` } },
      { label: 'BTC',        value: { formula: `IFERROR(D24,"—")` } },
      { label: 'COMBINED',   value: { formula: `TEXT(SUM(H11:H16)+SUM(H24:H30),"$#,##0")` } },
      { label: 'COLD WALLET',value: { formula: `COUNTIF(L24:L30,"✓")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, '🥇 Precious metals', 'Per-metal: ounces + cost basis + current spot. Spot price via GOOGLEFINANCE in Sheets (e.g. `=GOOGLEFINANCE("CURRENCY:XAUUSD")` for gold).');

  addTableHeader(sheet, r + 1,
    ['Metal', 'Form', 'Ounces', 'Cost/oz', 'Cost basis', 'Spot/oz', 'Current $', 'Gain/Loss', 'YTD %', 'Storage', 'Insured'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const metalsSeed = [
    { metal: 'Gold',      form: 'Coins/Bars', oz: 2.5,  cost: 1820, spot: 2420 },
    { metal: 'Silver',    form: 'Coins',       oz: 12.0, cost: 23.40, spot: 31.80 },
    { metal: 'Platinum',  form: 'Bars',        oz: 0,    cost: 0,     spot: 0 },
    { metal: 'Palladium', form: 'Bars',        oz: 0,    cost: 0,     spot: 0 },
    { metal: '',          form: '',            oz: 0,    cost: 0,     spot: 0 },
    { metal: '',          form: '',            oz: 0,    cost: 0,     spot: 0 },
  ];

  for (let i = 0; i < 6; i++) {
    const ri = r + 2 + i;
    const m = metalsSeed[i];

    sheet.getCell(`B${ri}`).value = m.metal || null;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = m.form || null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = m.oz || null;
    sheet.getCell(`D${ri}`).numFmt = '0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = m.cost || null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(D${ri}*E${ri},"")` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = m.spot || null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`G${ri}`).font = { ...FONTS.body, color: argb(COLORS.warmGold) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR(D${ri}*G${ri},"")` };
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(H${ri}-F${ri},"")` };
    sheet.getCell(`I${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`I${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR((G${ri}-E${ri})/E${ri},"")` };
    sheet.getCell(`J${ri}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`J${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = m.metal ? 'Home safe' : null;
    sheet.getCell(`K${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).value = m.metal ? '✓' : null;
    sheet.getCell(`L${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  // Section 2 — Crypto
  let cR = addSectionHeader(sheet, r + 10, '🪙 Crypto', 'Per-coin: units + cost basis + spot. Cold storage flag is critical — uninsured against exchange hacks. Use hardware wallets for >$1K.');

  addTableHeader(sheet, cR + 1,
    ['Coin', 'Network', 'Units', 'Cost/unit', 'Cost basis', 'Spot/unit', 'Current $', 'Gain/Loss', 'YTD %', 'Wallet', 'Cold?'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const cryptoSeed = [
    { coin: 'BTC',  network: 'Bitcoin',   units: 0.12,   cost: 38000, spot: 67500 },
    { coin: 'ETH',  network: 'Ethereum',  units: 2.4,    cost: 2100,  spot: 3850 },
    { coin: 'SOL',  network: 'Solana',    units: 14,     cost: 88,    spot: 142 },
    { coin: '',     network: '',          units: 0,      cost: 0,     spot: 0 },
    { coin: '',     network: '',          units: 0,      cost: 0,     spot: 0 },
    { coin: '',     network: '',          units: 0,      cost: 0,     spot: 0 },
    { coin: '',     network: '',          units: 0,      cost: 0,     spot: 0 },
  ];

  for (let i = 0; i < 7; i++) {
    const ri = cR + 2 + i;
    const c = cryptoSeed[i];

    sheet.getCell(`B${ri}`).value = c.coin || null;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = c.network || null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = c.units || null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0.0000';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = c.cost || null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(D${ri}*E${ri},"")` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = c.spot || null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = { ...FONTS.body, color: argb(COLORS.warmGold) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR(D${ri}*G${ri},"")` };
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(H${ri}-F${ri},"")` };
    sheet.getCell(`I${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`I${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR((G${ri}-E${ri})/E${ri},"")` };
    sheet.getCell(`J${ri}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`J${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = c.coin ? 'Ledger Nano' : null;
    sheet.getCell(`K${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).value = c.coin ? '✓' : null;
    sheet.getCell(`L${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${cR + 11}:L${cR + 12}`,
    '🔐',
    'Cold storage = your custody',
    '"Not your keys, not your coins." Anything stored on an exchange (Coinbase, Binance) is in their custody — exchanges have been hacked, frozen, or gone bankrupt repeatedly. Hardware wallets (Ledger, Trezor) keep keys on a physical device offline. For balances above $1K, the time spent on hardware wallet setup is small vs the loss-of-everything risk.');
  sheet.getRow(cR + 11).height = 30;
  sheet.getRow(cR + 12).height = 30;

  addFooter(sheet, cR + 16, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 9 — 🔥 FIRE CALCULATOR (Essentials+) — highest-conversion hook
// ============================================================================

function buildFIRECalculator(workbook) {
  const tier = workbook._tier || 'ai';
  const sheet = workbook.addWorksheet('🔥 FIRE Calculator');
  setTabColor(sheet, COLORS.alert);
  setupColumns(sheet, { A: 2, B: 22, C: 16, D: 16, E: 16, F: 8, G: 22, H: 14, I: 14, J: 14, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🔥 FIRE Calculator',
    tabSubtitle: `Your FIRE number + years-to-FIRE under 3 scenarios. ${tier === 'essentials' ? 'Essentials: Conservative scenario only.' : 'Pro+: all 3 scenarios.'}`,
    bannerText: BANNER,
    kpiData: [
      { label: 'FIRE NUMBER',  value: { formula: `TEXT(E12,"$#,##0")` } },
      { label: 'CURRENT NW',   value: { formula: `TEXT('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW},"$#,##0")` } },
      { label: '% FUNDED',     value: { formula: `TEXT(IFERROR(('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})/E12,0),"0.0%")` } },
      { label: 'YRS — CONS.',  value: { formula: `IFERROR(TEXT(E20,"0.0")&" yrs","—")` } },
      { label: 'YRS — CURR.',  value: { formula: `IFERROR(TEXT(E18,"0.0")&" yrs","—")` } },
      { label: 'YRS — AGGR.',  value: { formula: `IFERROR(TEXT(E16,"0.0")&" yrs","—")` } },
    ],
  });

  // === INPUTS section ===
  let r = addSectionHeader(sheet, 6, 'Your FIRE inputs', 'Annual spend × multiple = FIRE number. 25× = 4% rule (traditional). 28× = more conservative. 33× = ultra-conservative.');

  const inputs = [
    { label: 'Current age', value: 37 },
    { label: 'Annual spend (after tax)', value: 58000 },
    { label: 'FIRE multiple (4% rule = 25)', value: 25 },
    { label: 'Monthly savings rate', value: 1850 },
    { label: 'Inflation assumption', value: 0.025 },
  ];

  // [COMPLEMENT] Cell-comment tooltips on every FIRE Calculator input so hover-help reduces input error.
  const inputTooltips = [
    'Your current age. Used to compute Age-at-FIRE and Coast FIRE benchmarks.',
    'Annual post-tax spending. Multiply by your FIRE multiple (next row) to get your FIRE Number.',
    'FIRE multiple. 25 = traditional 4% rule (Trinity Study). 28 = more conservative. 33 = ultra-conservative.',
    'Monthly amount you save into invested accounts. Drives the years-to-FIRE math in all 3 scenarios below.',
    'Long-run inflation assumption (decimal — 2.5% = 0.025). Used in real-return calculations.',
  ];

  inputs.forEach((inp, i) => {
    const ri = r + 1 + i;
    sheet.getCell(`B${ri}`).value = inp.label;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = inp.value;
    sheet.getCell(`C${ri}`).numFmt = inp.label.includes('Inflation') ? '0.00%' : (inp.label.includes('spend') || inp.label.includes('savings') ? '"$"#,##0' : '0');
    sheet.getCell(`C${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN(COLORS.warmGold);
    sheet.getCell(`C${ri}`).note = inputTooltips[i];
  });

  // FIRE number computation (row 12 — referenced by Dashboard FIRE meter)
  // [FIX NWT-002] Inputs grid lands at rows 10-14 (age=C10, annual spend=C11, multiple=C12,
  // monthly savings=C13, inflation=C14). Pre-fix referenced C8*C9 which are addSectionHeader
  // subtitle/underline rows → returned 0. Correct refs: C11 (annual spend) × C12 (FIRE multiple).
  sheet.getCell(`D11`).value = 'FIRE NUMBER';
  sheet.getCell(`D11`).font = FONTS.smallCaps;
  sheet.getCell(`D11`).alignment = { horizontal: 'center' };
  sheet.getCell(`E12`).value = { formula: `IFERROR(C11*C12,1450000)` };
  sheet.getCell(`E12`).numFmt = '"$"#,##0';
  sheet.getCell(`E12`).font = { name: 'Inter', size: 22, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell(`E12`).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getCell(`E12`).fill = FILLS.ivory;
  sheet.getCell(`E12`).border = {
    left: { style: 'medium', color: argb(COLORS.warmGold) },
    top: { style: 'thin', color: argb(COLORS.divider) },
    bottom: { style: 'thin', color: argb(COLORS.divider) },
    right: { style: 'thin', color: argb(COLORS.divider) },
  };
  sheet.getRow(12).height = 36;

  // === SCENARIOS section — 3 scenarios at returns 4% / 6% / 8% ===
  // [FIX NWT-003] Pre-fix called addSectionHeader at row 16 which merged A16:M16, A17:M17, A18:M18
  // — overlapping scenario rows 16/18/20 and making cells unwriteable. Replace with a single-row
  // title at row 15 (no subtitle merge) + column sub-labels at the row-16/18/20 cell level so
  // the scenario rows (B/C/E/F/G column data) stay reachable.
  sheet.mergeCells(`B15:M15`);
  sheet.getCell(`B15`).value = `Three FIRE scenarios — ${tier === 'essentials' ? 'Conservative shown; upgrade to Pro for all 3.' : 'Pick your anchor; 6% real return is the defensible midpoint.'}`;
  sheet.getCell(`B15`).font = FONTS.section;
  sheet.getCell(`B15`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(15).height = 22;

  // Scenarios on rows 16/18/20 — match KPI references above
  const scenarios = [
    { label: '🚀 Aggressive', ret: 0.08, row: 16 },
    { label: '📈 Current trajectory', ret: 0.06, row: 18 },
    { label: '🛡️ Conservative', ret: 0.04, row: 20 },
  ];

  scenarios.forEach((s) => {
    sheet.getCell(`B${s.row}`).value = s.label;
    sheet.getCell(`B${s.row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${s.row}`).fill = FILLS.white;
    sheet.getCell(`B${s.row}`).border = BORDER_THIN();

    sheet.getCell(`C${s.row}`).value = s.ret;
    sheet.getCell(`C${s.row}`).numFmt = '0.0%';
    sheet.getCell(`C${s.row}`).font = FONTS.body;
    sheet.getCell(`C${s.row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${s.row}`).fill = FILLS.white;
    sheet.getCell(`C${s.row}`).border = BORDER_THIN();

    // Years to FIRE = log( (FIRE × r + PMT*12) / (NW × r + PMT*12) ) / log(1+r)
    // Approximation using future-value algebra. PMT = monthly savings × 12.
    // [FIX NWT-004] Pre-fix referenced C10*12 (age × 12 = $444 treated as annual savings).
    // Correct: C13*12 = monthly savings × 12 = $22,200 annual savings.
    sheet.getCell(`E${s.row}`).value = { formula: `IFERROR(LOG((E12*C${s.row}+C13*12)/(MAX(1,'💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})*C${s.row}+C13*12))/LOG(1+C${s.row}),"—")` };
    sheet.getCell(`E${s.row}`).numFmt = '0.0';
    sheet.getCell(`E${s.row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`E${s.row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${s.row}`).fill = FILLS.white;
    sheet.getCell(`E${s.row}`).border = BORDER_THIN();

    // [FIX NWT-005] Age at FIRE: pre-fix used C7 (section subtitle row, blank). Correct: C10 (age).
    sheet.getCell(`F${s.row}`).value = { formula: `IFERROR(C10+E${s.row},"")` };
    sheet.getCell(`F${s.row}`).numFmt = '0';
    sheet.getCell(`F${s.row}`).font = FONTS.body;
    sheet.getCell(`F${s.row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${s.row}`).fill = FILLS.white;
    sheet.getCell(`F${s.row}`).border = BORDER_THIN();

    // Monthly $ needed (back-solve PMT = (FIRE × r) / ((1+r)^N -1) — n in years
    sheet.getCell(`G${s.row}`).value = { formula: `IFERROR((E12*C${s.row}/12)/((1+C${s.row}/12)^(E${s.row}*12)-1),"—")` };
    sheet.getCell(`G${s.row}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${s.row}`).font = FONTS.body;
    sheet.getCell(`G${s.row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${s.row}`).fill = FILLS.white;
    sheet.getCell(`G${s.row}`).border = BORDER_THIN();
  });

  // Notes per scenario
  sheet.getCell(`G16`).value = 'Glide-path 8% + savings raises.';
  sheet.getCell(`G18`).value = 'Defensible historical avg.';
  sheet.getCell(`G20`).value = '4% real — survives a lost decade.';

  addCallout(sheet, `B22:M23`,
    '🔥',
    'The variable that moves the answer most: your savings rate',
    'Returns are unknowable. Savings rate is decided every month at the brokerage transfer. Going from $1,850/mo → $2,350/mo (a +$500 bump) shaves ~2 years off every scenario. AI Edition\'s FIRE Forecaster prompt models this on your actual numbers.');
  sheet.getRow(22).height = 28;
  sheet.getRow(23).height = 28;

  addFooter(sheet, 27, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 10 — 💰 PASSIVE INCOME SIMULATOR (Pro+)
// ============================================================================

function buildPassiveIncome(workbook) {
  const sheet = workbook.addWorksheet('💰 Passive Income Simulator');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 22, H: 12, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '💰 Passive Income Simulator',
    tabSubtitle: 'Target monthly passive income → required portfolio size + asset mix recommendation + timeline.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TARGET $/MO',  value: { formula: `TEXT(C7,"$#,##0")` } },
      { label: 'PORTFOLIO',    value: { formula: `TEXT(E14,"$#,##0")` } },
      { label: 'TODAY $/MO',   value: { formula: `TEXT(F19,"$#,##0")` } },
      { label: '% COVERED',    value: { formula: `TEXT(IFERROR(F19/C7,0),"0.0%")` } },
      { label: 'STRATEGY',     value: { formula: `C9` } },
      { label: 'YEARS',        value: { formula: `IFERROR(TEXT(E16,"0.0")&" yrs","—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Income target setup', 'Set your target monthly passive income; pick a withdrawal strategy. Output: portfolio size + asset mix to reach it.');

  sheet.getCell(`B7`).value = 'Target monthly passive income';
  sheet.getCell(`B7`).font = FONTS.bodyBold;
  sheet.getCell(`B7`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getCell(`B7`).fill = FILLS.ivory;
  sheet.getCell(`B7`).border = BORDER_THIN();
  sheet.getCell(`C7`).value = 4800;
  sheet.getCell(`C7`).numFmt = '"$"#,##0';
  sheet.getCell(`C7`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`C7`).alignment = { horizontal: 'right' };
  sheet.getCell(`C7`).fill = FILLS.white;
  sheet.getCell(`C7`).border = BORDER_THIN(COLORS.warmGold);

  sheet.getCell(`B8`).value = 'Risk profile (SWR)';
  sheet.getCell(`B8`).font = FONTS.bodyBold;
  sheet.getCell(`B8`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getCell(`B8`).fill = FILLS.ivory;
  sheet.getCell(`B8`).border = BORDER_THIN();
  sheet.getCell(`C8`).value = 0.04;
  sheet.getCell(`C8`).numFmt = '0.0%';
  sheet.getCell(`C8`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`C8`).alignment = { horizontal: 'right' };
  sheet.getCell(`C8`).fill = FILLS.white;
  sheet.getCell(`C8`).border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell(`C8`).dataValidation = { type: 'list', formulae: ['"0.04,0.045,0.05"'], allowBlank: false };

  sheet.getCell(`B9`).value = 'Strategy';
  sheet.getCell(`B9`).font = FONTS.bodyBold;
  sheet.getCell(`B9`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getCell(`B9`).fill = FILLS.ivory;
  sheet.getCell(`B9`).border = BORDER_THIN();
  sheet.getCell(`C9`).value = 'Mixed';
  sheet.getCell(`C9`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`C9`).alignment = { horizontal: 'center' };
  sheet.getCell(`C9`).fill = FILLS.white;
  sheet.getCell(`C9`).border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell(`C9`).dataValidation = { type: 'list', formulae: ['"Dividend-focused,REIT-focused,Total-return-SWR,Mixed"'], allowBlank: false };

  // Required portfolio + timeline — direct placement to avoid section-header merge collisions
  let oR = addSectionHeader(sheet, 11, 'Required portfolio + timeline', null);
  // addSectionHeader with null subtitle merges row 11 (title) + row 12 (underline) — row 13 free.
  // Set Required portfolio at row 13, Years at row 15.
  sheet.getCell(`B13`).value = 'Required portfolio';
  sheet.getCell(`B13`).font = FONTS.bodyBold;
  sheet.getCell(`B13`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getCell(`B13`).fill = FILLS.ivory;
  sheet.getCell(`B13`).border = BORDER_THIN();
  sheet.getCell(`E13`).value = { formula: `IFERROR(C7*12/C8,0)` };
  sheet.getCell(`E13`).numFmt = '"$"#,##0';
  sheet.getCell(`E13`).font = { name: 'Inter', size: 18, bold: true, color: argb(COLORS.success) };
  sheet.getCell(`E13`).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getCell(`E13`).fill = FILLS.white;
  sheet.getCell(`E13`).border = BORDER_THIN();
  // Keep E14 as the same value for backwards-compat with KPI formula
  sheet.getCell(`E14`).value = { formula: `E13` };
  sheet.getCell(`E14`).numFmt = '"$"#,##0';
  sheet.getCell(`E14`).font = FONTS.body;

  sheet.getCell(`B15`).value = 'Years from today (at current savings)';
  sheet.getCell(`B15`).font = FONTS.bodyBold;
  sheet.getCell(`B15`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getCell(`B15`).fill = FILLS.ivory;
  sheet.getCell(`B15`).border = BORDER_THIN();
  sheet.getCell(`E15`).value = { formula: `IFERROR(LOG((E13*0.06+'🔥 FIRE Calculator'!C10*12)/(MAX(1,'💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})*0.06+'🔥 FIRE Calculator'!C10*12))/LOG(1.06),0)` };
  sheet.getCell(`E15`).numFmt = '0.0';
  sheet.getCell(`E15`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
  sheet.getCell(`E15`).alignment = { horizontal: 'center' };
  sheet.getCell(`E15`).fill = FILLS.white;
  sheet.getCell(`E15`).border = BORDER_THIN();
  // Mirror E16 ref for KPI
  sheet.getCell(`E16`).value = { formula: `E15` };

  let sR = addSectionHeader(sheet, 18, 'Today\'s passive income profile', 'Per-source breakdown: dividends + bonds + REITs + rental + cash. Live numbers pulled from Stocks & Funds + Real Estate + Assets Summary.');

  const incomeSources = [
    { label: 'Dividend ETFs (SCHD/VYM)', monthly: 119 },
    { label: 'Bond fund (BND)',          monthly: 48 },
    { label: 'REIT ETF (VNQ)',           monthly: 25 },
    { label: 'Investment rental (net)',  monthly: 1170 },
    { label: 'HYSA',                     monthly: 43 },
  ];

  addTableHeader(sheet, 19, ['Source', 'Annual $', 'After-tax %', 'Net Monthly', 'Net Annual'], ['B', 'C', 'E', 'F', 'G']);

  for (let i = 0; i < 5; i++) {
    const ri = 20 + i;
    const src = incomeSources[i];

    sheet.getCell(`B${ri}`).value = src.label;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = src.monthly * 12;
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = i === 3 ? 0.86 : 0.78; // rental gets depreciation deduction
    sheet.getCell(`E${ri}`).numFmt = '0.0%';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(C${ri}/12*E${ri},"")` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `F${ri}*12` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
  }

  // Total row at 19 — well actually 19 is header. Total at 26
  sheet.getCell(`B26`).value = 'NET PASSIVE INCOME (today)';
  sheet.getCell(`B26`).font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell(`B26`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`F26`).value = { formula: `SUM(F20:F24)` };
  sheet.getCell(`F26`).numFmt = '"$"#,##0';
  sheet.getCell(`F26`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.success) };
  sheet.getCell(`F26`).alignment = { horizontal: 'right' };
  sheet.getCell(`F26`).border = { top: { style: 'medium', color: argb(COLORS.success) } };
  sheet.getCell(`F19`).value = { formula: `SUM(F20:F24)` }; // duplicate for KPI ref
  sheet.getCell(`F19`).numFmt = '"$"#,##0';

  addCallout(sheet, `B28:M29`,
    '💰',
    'Rental property is the highest-leverage passive income lever',
    'In the worked example, rental net = 84% of gross passive income. Doubling down here (acquire rental #2 in 5-8 years via cash-out refi) shifts FIRE math more than any other single move. Dividend ETFs are second — but only through consistent contributions.');
  sheet.getRow(28).height = 28;
  sheet.getRow(29).height = 28;

  addFooter(sheet, 33, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 11 — 👥 AGE BENCHMARK (Essentials+) — Your NW vs. peers
// ============================================================================

function buildAgeBenchmark(workbook) {
  const sheet = workbook.addWorksheet('👥 Age Benchmark');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 18, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '👥 Age Benchmark',
    tabSubtitle: 'Your NW vs. age-group median / average / top decile / FIRE community.',
    bannerText: BANNER,
    kpiData: [
      // [FIX NWT-005 bleed-through] Pre-fix referenced FIRE Calc!C7 (section subtitle blank).
      // Correct: C10 (age).
      { label: 'YOUR AGE',     value: { formula: `'🔥 FIRE Calculator'!C10` } },
      { label: 'YOUR NW',      value: { formula: `TEXT('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW},"$#,##0")` } },
      // [FIX NWT-006] Age cohort data lives at rows 11-15 (not 12-16). Active cohort is row 12 (35-44).
      { label: 'AGE MEDIAN',   value: { formula: `TEXT(D12,"$#,##0")` } },
      { label: 'TOP 10%',      value: { formula: `TEXT(F12,"$#,##0")` } },
      { label: 'YOUR %ILE',    value: { formula: `E12` } },
      { label: 'COAST FIRE',   value: { formula: `TEXT(G12,"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'NW vs. age cohorts', 'Federal Reserve SCF + FIRE community references. Data points: median net worth by age decade (US households).');

  addTableHeader(sheet, r + 1,
    ['Age Cohort', 'Median NW', 'Average NW', 'Your %ile', 'Top Decile', 'Coast FIRE @ age', 'Lean FIRE', 'Fat FIRE'],
    ['B', 'D', 'C', 'E', 'F', 'G', 'H', 'I']);

  // Data: Federal Reserve SCF 2022 median/avg + FIRE community benchmarks
  const cohorts = [
    { age: '25–34', median: 39000,  avg: 95000,   topDecile: 290000,  coast: 95000,   lean: 250000,   fat: 1250000 },
    { age: '35–44', median: 135600, avg: 436500,  topDecile: 825000,  coast: 280000,  lean: 625000,   fat: 3125000 },  // row 12
    { age: '45–54', median: 247000, avg: 833200,  topDecile: 1430000, coast: 580000,  lean: 1000000,  fat: 5000000 },
    { age: '55–64', median: 364500, avg: 1175900, topDecile: 2350000, coast: 920000,  lean: 1500000,  fat: 7500000 },
    { age: '65+',   median: 410000, avg: 1217700, topDecile: 2530000, coast: 0,       lean: 2000000,  fat: 10000000 },
  ];

  cohorts.forEach((c, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = c.age;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = c.median;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = c.avg;
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    // Percentile rough estimate — your NW vs the bands. Row 12 (35-44) is the active cohort.
    sheet.getCell(`E${ri}`).value = i === 1
      ? { formula: `IFERROR(IF(('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})>=F${ri},"Top 10%",IF(('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})>=C${ri},"Above avg",IF(('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW})>=D${ri},"Above median","Below median"))),"—")` }
      : '—';
    sheet.getCell(`E${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = c.topDecile;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = c.coast || null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = { ...FONTS.body, color: argb(COLORS.success) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = c.lean;
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = c.fat;
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
  });

  addCallout(sheet, `B${r + 8}:I${r + 9}`,
    '🎯',
    'FIRE community benchmarks',
    'Coast FIRE = NW × 7% × years-to-65 ≥ Lean FIRE number (you can stop contributing). Lean FIRE = $625K (35-44 spend assumption). Fat FIRE = $3.1M. Median + average diverge sharply — wealth concentration. SCF data from Federal Reserve 2022 Survey of Consumer Finances.');
  sheet.getRow(r + 8).height = 28;
  sheet.getRow(r + 9).height = 28;

  addFooter(sheet, r + 13, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 12 — 📈 ASSET ALLOCATION (Pro+) — Current vs. target with drift
// ============================================================================

function buildAssetAllocation(workbook) {
  const sheet = workbook.addWorksheet('📈 Asset Allocation');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 12, H: 20, I: 16, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '📈 Asset Allocation',
    tabSubtitle: 'Current % vs. target % side-by-side. Drift >5pp triggers alert pill. Rebalancing suggestions auto-generate.',
    bannerText: BANNER,
    kpiData: [
      // [FIX NWT-006] 10 class rows at 11-20, not 12-21.
      // [FIX NWT-005 bleed] FIRE Calc!C7 → C10 for age.
      { label: 'CLASSES',      value: { formula: `COUNTA(B11:B20)` } },
      { label: 'TOTAL',        value: { formula: `TEXT(SUM(C11:C20),"$#,##0")` } },
      { label: 'ON TARGET',    value: { formula: `COUNTIF(G11:G20,"✅ On target")` } },
      { label: 'MILD DRIFT',   value: { formula: `COUNTIF(G11:G20,"🟡 Mild drift")` } },
      { label: 'SIGNIFICANT',  value: { formula: `COUNTIF(G11:G20,"🔴 Significant")` } },
      { label: 'AGE OVERLAY',  value: { formula: `IFERROR("110-"&'🔥 FIRE Calculator'!C10&" = "&(110-'🔥 FIRE Calculator'!C10)&"% stocks","—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Current vs. target allocation', 'Drift = Current % − Target %. Status: ✅ ±2pp / 🟡 2-5pp / 🔴 >5pp. Last rebalance date logged below.');

  addTableHeader(sheet, r + 1, ['Asset Class', 'Current $', 'Current %', 'Target %', 'Drift', 'Drift %', 'Status', 'Suggested Move'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

  const allocSeed = [
    { class: 'US Equities (broad)',   current: 148000, target: 0.45 },
    { class: 'International Equities', current: 34000,  target: 0.15 },
    { class: 'Bonds / Short Treasury', current: 14200,  target: 0.10 },
    { class: 'Real Estate (invest)',   current: 42600,  target: 0.10 },
    { class: 'REITs',                  current: 8000,   target: 0.05 },
    { class: 'Metals (gold/silver)',   current: 5800,   target: 0.05 },
    { class: 'Crypto',                 current: 10800,  target: 0.02 },
    { class: 'Cash / HYSA',            current: 15900,  target: 0.05 },
    { class: 'Business Equity',        current: 28000,  target: 0.03 },
    { class: 'Other (alts)',           current: 3500,   target: 0.00 },
  ];

  allocSeed.forEach((a, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = a.class;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = a.current;
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IFERROR(C${ri}/SUM($C$11:$C$20),0)` };
    sheet.getCell(`D${ri}`).numFmt = '0.0%';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = a.target;
    sheet.getCell(`E${ri}`).numFmt = '0.0%';
    sheet.getCell(`E${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(D${ri}-E${ri},0)` };
    sheet.getCell(`F${ri}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IF(ABS(F${ri})>0.05,"🔴 Significant",IF(ABS(F${ri})>0.02,"🟡 Mild drift","✅ On target"))` };
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IF(F${ri}>0.05,"Reduce by $"&TEXT(F${ri}*SUM($C$11:$C$20),"#,##0"),IF(F${ri}<-0.05,"Add $"&TEXT(-F${ri}*SUM($C$11:$C$20),"#,##0"),IF(ABS(F${ri})>0.02,"Watch","Hold")))` };
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    // CF on Status
    sheet.addConditionalFormatting({
      ref: `G${ri}`,
      rules: [
        { type: 'containsText', operator: 'containsText', text: 'Significant', priority: 1, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
        { type: 'containsText', operator: 'containsText', text: 'Mild', priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
        { type: 'containsText', operator: 'containsText', text: 'On target', priority: 3, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      ],
    });
  });

  addCallout(sheet, `B${r + 13}:I${r + 14}`,
    '📈',
    'Rebalancing without selling — contribution-routing strategy',
    'Selling appreciated taxable shares triggers capital gains tax. Instead: redirect new contributions into underweight classes for 3-6 months. Closes 50%+ of drift without tax hit. AI Edition\'s Asset Allocation Advisor prompt models this on your actual holdings.');
  sheet.getRow(r + 13).height = 28;
  sheet.getRow(r + 14).height = 28;

  addFooter(sheet, r + 18, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 13 — 🎓 RETIREMENT TRACKER (Pro+) — Employer match + contribution room
// ============================================================================

function buildRetirementTracker(workbook) {
  const sheet = workbook.addWorksheet('🎓 Retirement Tracker');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '🎓 Retirement Tracker',
    tabSubtitle: '7 retirement account types. IRS contribution limits + employer match utilization + projected balance @ 65.',
    bannerText: BANNER,
    kpiData: [
      // [FIX NWT-006] 7 account rows at 11-17, not 12-18.
      { label: 'ACCOUNTS',     value: { formula: `COUNTA(B11:B17)` } },
      { label: 'TOTAL BAL',    value: { formula: `TEXT(SUM(C11:C17),"$#,##0")` } },
      { label: 'YTD CONTRIB',  value: { formula: `TEXT(SUM(E11:E17),"$#,##0")` } },
      { label: 'ROOM LEFT',    value: { formula: `TEXT(SUM(G11:G17),"$#,##0")` } },
      { label: 'MATCH GAP',    value: { formula: `TEXT(SUM(I11:I17),"$#,##0")` } },
      { label: 'PROJ @ 65',    value: { formula: `TEXT(SUM(J11:J17),"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Retirement accounts — IRS limits 2026', 'Current balance · YTD contribution · 2026 IRS limit · Room remaining · Employer match utilization · Projected balance @ age 65 (7% real return).');

  addTableHeader(sheet, r + 1,
    ['Account', 'Current Bal', '2026 IRS Limit', 'YTD Contributed', 'Annual %', 'Room Remaining', 'Match %', 'Match Gap', 'Proj @ 65', 'Tax Treat.'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  // IRS 2026 limits (estimated/projected — buyer updates annually)
  const retSeed = [
    { type: '401(k)',         bal: 84000, limit: 23000, ytd: 15000, matchPct: 0.05, matchUsed: 0.04, taxTreat: 'Pre-tax' },
    { type: 'Roth IRA',       bal: 41200, limit: 7000,  ytd: 5500,  matchPct: 0,    matchUsed: 0,    taxTreat: 'Post-tax' },
    { type: 'Traditional IRA',bal: 12000, limit: 7000,  ytd: 0,     matchPct: 0,    matchUsed: 0,    taxTreat: 'Pre-tax' },
    { type: 'SEP IRA',        bal: 0,     limit: 69000, ytd: 0,     matchPct: 0,    matchUsed: 0,    taxTreat: 'Pre-tax' },
    { type: 'HSA',            bal: 9200,  limit: 4150,  ytd: 2950,  matchPct: 0,    matchUsed: 0,    taxTreat: 'Triple tax-free' },
    { type: '529 (Child 1)',  bal: 7400,  limit: 18000, ytd: 5000,  matchPct: 0,    matchUsed: 0,    taxTreat: 'Tax-free growth' },
    { type: '529 (Child 2)',  bal: 1800,  limit: 18000, ytd: 1500,  matchPct: 0,    matchUsed: 0,    taxTreat: 'Tax-free growth' },
  ];

  retSeed.forEach((rt, i) => {
    const ri = r + 2 + i;
    const yrsTo65 = 28; // age 37 → 65

    sheet.getCell(`B${ri}`).value = rt.type;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = rt.bal;
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = rt.limit;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = rt.ytd;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(E${ri}/D${ri},0)` };
    sheet.getCell(`F${ri}`).numFmt = '0.0%';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `MAX(0,D${ri}-E${ri})` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = rt.matchPct;
    sheet.getCell(`H${ri}`).numFmt = '0.0%';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(MAX(0,(H${ri}-${rt.matchUsed})*108000),0)` };
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.alert) };
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(C${ri}*(1.07^${yrsTo65})+E${ri}*((1.07^${yrsTo65}-1)/0.07),"")` };
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = rt.taxTreat;
    sheet.getCell(`K${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();
  });

  addCallout(sheet, `B${r + 11}:K${r + 12}`,
    '🎯',
    'Match Gap = "free money you\'re leaving on the table"',
    'Employer match is the highest-ROI move in personal finance — 100% return on the matched dollar. If your match is 5% of $108K salary and you\'re only contributing enough for 4%, you\'re leaving $1,080/yr on the table forever. Bumping contributions is a 1-minute phone call to HR.');
  sheet.getRow(r + 11).height = 28;
  sheet.getRow(r + 12).height = 28;

  addFooter(sheet, r + 16, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 14 — 📉 TAX-LOSS HARVESTING (Pro+) — Per-position cost basis vs current
// ============================================================================

function buildTaxLossHarvesting(workbook) {
  const sheet = workbook.addWorksheet('📉 Tax-Loss Harvesting');
  setTabColor(sheet, COLORS.alert);
  setupColumns(sheet, { A: 2, B: 14, C: 14, D: 11, E: 11, F: 11, G: 13, H: 16, I: 14, J: 18, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '📉 Tax-Loss Harvesting',
    tabSubtitle: 'Surface opportunities. Stay in control of trades. Wash-sale window (30-day pre/post) flagged automatically.',
    bannerText: BANNER,
    kpiData: [
      // [FIX NWT-006 + NWT-036] 15 position rows at 11-25, not 12-26. Status column is J (not I).
      { label: 'POSITIONS',     value: { formula: `COUNTA(B11:B25)` } },
      { label: 'UNREAL GAINS',  value: { formula: `TEXT(SUMIF(G11:G25,">0"),"$#,##0")` } },
      { label: 'UNREAL LOSSES', value: { formula: `TEXT(SUMIF(G11:G25,"<0"),"$#,##0")` } },
      { label: 'HARVEST OPPS',  value: { formula: `COUNTIF(J11:J25,"💡 Harvest")` } },
      { label: 'WASH BLOCKED',  value: { formula: `COUNTIF(J11:J25,"⏳ Wash window")` } },
      { label: 'POTENTIAL TAX', value: { formula: `TEXT(-SUMIF(G11:G25,"<0")*0.22,"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-position TLH analysis', 'For each taxable holding: cost basis · current value · unrealized G/L · last buy date · wash-sale window check · status.');

  addTableHeader(sheet, r + 1,
    ['Ticker', 'Account', 'Shares', 'Cost Basis', 'Current', 'Unrealized G/L', 'Last Buy', 'Wash Window Ends', 'Status', 'Replacement Idea'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const tlhSeed = [
    { ticker: 'BND',   acct: 'Taxable', shares: 168,  cost: 13138, current: 12617, lastBuy: '2026-03-15', replace: 'VGSH (short bond)' },
    { ticker: 'VXUS',  acct: 'Taxable', shares: 124,  cost: 7043,  current: 7738,  lastBuy: '2025-11-04', replace: 'IXUS (tracks similar)' },
    { ticker: 'AAPL',  acct: 'Taxable', shares: 28,   cost: 3990,  current: 5258,  lastBuy: '2024-07-22', replace: 'N/A — appreciated' },
    { ticker: 'VNQ',   acct: 'Taxable', shares: 44,   cost: 3876,  current: 4066,  lastBuy: '2026-01-10', replace: 'XLRE (similar REIT)' },
    { ticker: 'VTI',   acct: 'Taxable', shares: 88,   cost: 16324, current: 20662, lastBuy: '2023-08-15', replace: 'N/A — appreciated' },
  ];

  for (let i = 0; i < 15; i++) {
    const ri = r + 2 + i;
    const t = tlhSeed[i];

    sheet.getCell(`B${ri}`).value = t ? t.ticker : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = t ? t.acct : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = t ? t.shares : null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = t ? t.cost : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = t ? t.current : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(F${ri}-E${ri},"")` };
    sheet.getCell(`G${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = t ? new Date(t.lastBuy) : null;
    sheet.getCell(`H${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(H${ri}+30,"")` };
    sheet.getCell(`I${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    // Status: harvest opp if G<0 AND wash window ended (today > H+30)
    sheet.getCell(`J${ri}`).value = { formula: `IF(B${ri}="","",IF(G${ri}>=0,"⚪ No loss",IF(TODAY()<H${ri}+30,"⏳ Wash window","💡 Harvest")))` };
    sheet.getCell(`J${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = t ? t.replace : null;
    sheet.getCell(`K${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();
  }

  // CF on status
  sheet.addConditionalFormatting({
    ref: `J${r + 2}:J${r + 16}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Harvest', priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Wash window', priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'No loss', priority: 3, style: { fill: FILLS.offWhite, font: { color: argb(COLORS.textMuted) } } },
    ],
  });

  addCallout(sheet, `B${r + 19}:K${r + 20}`,
    '⚠️',
    'Wash sale = 30 days before AND after the sale',
    'IRS rule: if you sell a position for a loss and buy a "substantially identical" security within 30 days BEFORE or AFTER, the loss is disallowed. Buy a similar-but-not-identical replacement (BND → VGSH, VTI → ITOT). After 30 days, you can repurchase the original. We surface opportunities; you decide whether to execute.');
  sheet.getRow(r + 19).height = 30;
  sheet.getRow(r + 20).height = 30;

  addFooter(sheet, r + 24, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 15 — 🌍 GEOGRAPHIC EXPOSURE (Pro+) — Country/region concentration
// ============================================================================

function buildGeographicExposure(workbook) {
  const sheet = workbook.addWorksheet('🌍 Geographic Exposure');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 12, H: 18, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '🌍 Geographic Exposure',
    tabSubtitle: 'Your wealth by country. Concentration risk flag when single country > 40%. FX risk surface.',
    bannerText: BANNER,
    kpiData: [
      // [FIX NWT-006] 10 country rows at 11-20, not 12-21. Classification col is H (not G).
      { label: 'COUNTRIES',     value: { formula: `COUNTA(B11:B20)` } },
      { label: 'TOTAL',         value: { formula: `TEXT(SUM(C11:C20),"$#,##0")` } },
      { label: 'TOP COUNTRY',   value: { formula: `IFERROR(INDEX(B11:B20,MATCH(MAX(C11:C20),C11:C20,0)),"—")` } },
      { label: 'TOP %',         value: { formula: `TEXT(IFERROR(MAX(D11:D20),0),"0.0%")` } },
      { label: 'CONCENTRATION', value: { formula: `IF(MAX(D11:D20)>0.4,"🔴 High","🟢 OK")` } },
      { label: 'EM EXPOSURE',   value: { formula: `TEXT(IFERROR(SUMIF(H11:H20,"Emerging",C11:C20)/SUM(C11:C20),0),"0.0%")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-country exposure', 'Equities + real estate + cash by country. Geopolitical risk flag = manual (you tag emerging market / sanctions exposure / etc.).');

  addTableHeader(sheet, r + 1,
    ['Country / Region', 'Total $', '%', 'Equity', 'Real Estate', 'Cash', 'Classification', 'Geopolitical Risk'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  const geoSeed = [
    { country: 'United States',  total: 564800, eq: 348000, re: 472000, cash: 25700, classification: 'Developed', risk: 'Low' },
    { country: 'International (developed)', total: 34000,  eq: 34000,  re: 0,      cash: 0,     classification: 'Developed', risk: 'Low' },
    { country: 'Texas (USA — rental)', total: 224000, eq: 0,      re: 224000, cash: 0,     classification: 'Developed', risk: 'Low' },
    { country: 'Crypto (borderless)', total: 10800,  eq: 0,      re: 0,      cash: 0,     classification: 'N/A',       risk: 'High' },
  ];

  for (let i = 0; i < 10; i++) {
    const ri = r + 2 + i;
    const g = geoSeed[i];

    sheet.getCell(`B${ri}`).value = g ? g.country : null;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = g ? g.total : null;
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IFERROR(C${ri}/SUM($C$11:$C$20),0)` };
    sheet.getCell(`D${ri}`).numFmt = '0.0%';
    sheet.getCell(`D${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = g ? g.eq : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = g ? g.re : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = g ? g.cash : null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = g ? g.classification : null;
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
    sheet.getCell(`H${ri}`).dataValidation = { type: 'list', formulae: ['"Developed,Emerging,Frontier,N/A"'], allowBlank: true };

    sheet.getCell(`I${ri}`).value = g ? g.risk : null;
    sheet.getCell(`I${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
    sheet.getCell(`I${ri}`).dataValidation = { type: 'list', formulae: ['"Low,Medium,High"'], allowBlank: true };
  }

  // CF on concentration %
  sheet.addConditionalFormatting({
    ref: `D${r + 2}:D${r + 11}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.4'], priority: 1, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 13}:I${r + 14}`,
    '🌍',
    'Concentration risk — when home-country bias matters',
    'US-only investors: your wealth correlates with US dollar + US politics. International diversification (15-25% in developed-ex-US + 5-10% emerging) is the standard hedge. Rental in Texas + primary home elsewhere = ~70-80% US real estate concentration alone; add equities = home-country exposure often 90%+ for US households.');
  sheet.getRow(r + 13).height = 28;
  sheet.getRow(r + 14).height = 28;

  addFooter(sheet, r + 18, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 16 — 🛡️ INSURANCE & ESTATE (Pro+) — Life insurance + estate value
// ============================================================================

function buildInsuranceEstate(workbook) {
  const sheet = workbook.addWorksheet('🛡️ Insurance & Estate');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '🛡️ Insurance & Estate',
    tabSubtitle: 'Life insurance death benefit + per-policy detail + underinsured flag (vs. 10× annual income rule).',
    bannerText: BANNER,
    kpiData: [
      // [FIX NWT-006] 5 policy rows at 11-15, not 12-16.
      { label: 'POLICIES',      value: { formula: `COUNTA(B11:B15)` } },
      { label: 'TOTAL DB',      value: { formula: `TEXT(SUM(D11:D15),"$#,##0")` } },
      { label: 'ANNUAL PREM',   value: { formula: `TEXT(SUM(E11:E15),"$#,##0")` } },
      { label: 'INCOME × 10',   value: { formula: `TEXT(108000*10,"$#,##0")` } },
      { label: 'UNDER/OVER',    value: { formula: `IF(SUM(D11:D15)<108000*10,"🔴 Under","🟢 Adequate")` } },
      { label: 'ESTATE VAL',    value: { formula: `TEXT('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW},"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Life insurance policies', '10× annual income is the rule of thumb. Term cheaper than whole. Disability insurance is often more important than life for under-40s.');

  addTableHeader(sheet, r + 1, ['Policy', 'Insurer', 'Type', 'Death Benefit', 'Annual Premium', 'Beneficiary', 'Term Years', 'Renewal'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

  // Manually swap columns since the header was wrong — adjust
  // Correct order: Policy / Insurer / Death Benefit / Annual Premium / Type / Beneficiary / Term / Renewal
  // Already specified — proceeding
  addTableHeader(sheet, r + 1, ['Policy', 'Insurer', 'Death Benefit', 'Annual Premium', 'Type', 'Beneficiary', 'Term', 'Renewal'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

  const insSeed = [
    { policy: 'Primary term life', insurer: 'Northwestern', db: 750000, premium: 580,  type: 'Term 20',   beneficiary: 'Spouse',         term: '20yr', renewal: '2042-08' },
    { policy: 'Group life (work)', insurer: 'Employer plan', db: 216000, premium: 0,    type: 'Term 1',    beneficiary: 'Spouse + kids',  term: '1yr',  renewal: 'Annual' },
    { policy: 'Spouse term life',  insurer: 'Haven Life',   db: 500000, premium: 320,  type: 'Term 20',   beneficiary: 'You + kids',     term: '20yr', renewal: '2042-11' },
    { policy: '',                  insurer: '',             db: 0,      premium: 0,    type: '',          beneficiary: '',               term: '',     renewal: '' },
    { policy: '',                  insurer: '',             db: 0,      premium: 0,    type: '',          beneficiary: '',               term: '',     renewal: '' },
  ];

  insSeed.forEach((ins, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = ins.policy || null;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = ins.insurer || null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = ins.db || null;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = ins.premium || null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = ins.type || null;
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = ins.beneficiary || null;
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = ins.term || null;
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = ins.renewal || null;
    sheet.getCell(`I${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
  });

  // Estate value display
  sheet.mergeCells(`B${r + 9}:F${r + 10}`);
  sheet.getCell(`B${r + 9}`).value = { formula: `"ESTATE VALUE"&CHAR(10)&TEXT('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW},"$#,##0")&CHAR(10)&"= Total Assets − Total Liabilities"` };
  sheet.getCell(`B${r + 9}`).font = { name: 'Inter', size: 16, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell(`B${r + 9}`).fill = FILLS.ivory;
  sheet.getCell(`B${r + 9}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  sheet.getCell(`B${r + 9}`).border = {
    left: { style: 'medium', color: argb(COLORS.warmGold) },
    top: { style: 'thin', color: argb(COLORS.divider) },
    bottom: { style: 'thin', color: argb(COLORS.divider) },
    right: { style: 'thin', color: argb(COLORS.divider) },
  };
  sheet.getRow(r + 9).height = 32;
  sheet.getRow(r + 10).height = 32;

  addCallout(sheet, `G${r + 9}:M${r + 10}`,
    '🛡️',
    'Disability insurance > life insurance for under-40s',
    'Stats: a 30-year-old is 3× more likely to be disabled than die before 65. Long-term disability (LTD) replaces ~60% of income; check if your employer offers it (many do, cheap or free). Short-term disability bridges 90-180 day gaps. Estate value here = NW snapshot for planning conversations with attorney/spouse.');
  sheet.getRow(r + 9).height = 32;
  sheet.getRow(r + 10).height = 32;

  addFooter(sheet, r + 14, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 17 — 🤝 ESTATE ACCESS (Pro+) — "Trusted angel" template
// ============================================================================

function buildEstateAccess(workbook) {
  const sheet = workbook.addWorksheet('🤝 Estate Access');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 50, D: 11, E: 11, F: 11, G: 11, H: 11, I: 11, J: 11, K: 11, L: 11, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '🤝 Estate Access',
    tabSubtitle: 'The "trusted angel" template — inheritance instructions for the person who has to handle your affairs.',
    bannerText: BANNER,
    kpiData: [
      { label: 'WILL',          value: 'See row 9' },
      { label: 'TRUST',         value: 'See row 10' },
      { label: 'POA',           value: 'See row 11' },
      { label: 'HEALTHCARE',    value: 'See row 12' },
      { label: 'BENEFICIARIES', value: 'Below' },
      { label: 'ACCESS DOC',    value: 'Below' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Estate paperwork status', 'NOT a will substitute. This is the input layer your attorney + executor need. See your local estate attorney for legal documents.');

  const docStatus = [
    ['Will',                          'Status: [exists / draft / none] · Last updated: [date] · Executor: [name] · Location: [physical + digital copy]'],
    ['Revocable Living Trust',        'Status: [exists / none] · Properties in trust: [list] · Trustee: [name]'],
    ['Durable POA (financial)',       'Status: [exists / none] · Agent: [name] · Location: [where to find]'],
    ['Healthcare directive',          'Status: [exists / none] · Agent: [name] · Living will included: [Y/N]'],
    ['Beneficiary update (401k)',     'Primary: [name] · Contingent: [name] · Last updated: [date]'],
    ['Beneficiary update (IRA/Roth)', 'Primary: [name] · Contingent: [name] · Last updated: [date]'],
    ['Beneficiary update (life ins)', 'Primary: [name] · Contingent: [name] · Last updated: [date]'],
    ['HSA beneficiary',               'Primary: [name] · Contingent: [name] · Last updated: [date]'],
    ['Brokerage TOD',                 'Set up: [Y/N] · Beneficiary: [name]'],
    ['Bank POD',                      'Set up: [Y/N] · Beneficiary: [name]'],
    ['Asset locations reference',     'Document name: "Asset-locations.md" stored in: [password manager / safe / executor copy]'],
    ['Digital legacy contact',        'Password manager emergency access: [Set up Y/N] · Trusted person: [name]'],
    ['Crypto cold-storage recovery',  'Seed phrase locations: [list — should be 2+ separate secure locations]'],
    ['Funeral preferences',           'Document location: [optional but reduces decision burden on survivors]'],
  ];

  docStatus.forEach((d, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = d[0];
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = d[1];
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getRow(ri).height = 24;
  });

  addCallout(sheet, `B${r + 18}:M${r + 19}`,
    '⚠️',
    'Not your will. The input layer for an estate conversation.',
    'This template surfaces the gaps. Filling them is your attorney\'s job (or DIY service like LegalZoom / Trust & Will / Rocket Lawyer for the simpler items). AI Edition\'s Estate Planning Advisor prompt audits paperwork readiness against your context (age, kids, state, special circumstances) and ranks the highest-risk gaps.');
  sheet.getRow(r + 18).height = 30;
  sheet.getRow(r + 19).height = 30;

  addFooter(sheet, r + 23, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 18 — 📊 ANNUAL SUMMARY (Essentials [limited] / Pro [5-yr YoY + tax-prep])
// ============================================================================

function buildAnnualSummary(workbook) {
  const tier = workbook._tier || 'ai';
  const sheet = workbook.addWorksheet('📊 Annual Summary');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📊 Annual Summary',
    tabSubtitle: 'Year-end snapshot + best/worst asset class + tax-prep summary. ' + (tier === 'essentials' ? 'Essentials: 1-year view.' : 'Pro+: 5-year YoY + tax-prep.'),
    bannerText: BANNER,
    kpiData: [
      // [FIX NWT-006 + NWT-016] 5 year rows at 11-15 (most recent year = row 11), not 12-16.
      { label: 'NW START YR', value: { formula: `TEXT(D11,"$#,##0")` } },
      { label: 'NW END YR',   value: { formula: `TEXT(E11,"$#,##0")` } },
      { label: 'CHANGE $',    value: { formula: `TEXT(F11,"$#,##0")` } },
      { label: 'CHANGE %',    value: { formula: `TEXT(G11,"0.0%")` } },
      { label: 'BEST CLASS',  value: { formula: `H11` } },
      { label: 'WORST',       value: { formula: `I11` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Year-end snapshots', `Each row = one year-end (Dec 31). Decomposition columns show drivers. ${tier === 'essentials' ? 'Essentials shows current year only.' : 'Pro+ unlocks 5-year history + best/worst asset class auto-detect.'}`);

  addTableHeader(sheet, r + 1,
    ['Year', 'NW Start', 'NW End', 'Change $', 'Change %', 'Best Class', 'Worst Class', 'Savings', 'Debt Paydown', 'Market'],
    ['B', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  // Seed 5 years (current + 4 prior) — Pro+ data, Essentials sees only current
  const yearSeed = [
    { year: 2026, start: 284000, end: 342500, best: 'US Equities (+21%)',  worst: 'Bonds (+0.4%)',    savings: 22200, debt: 14000, market: 26800 },
    { year: 2025, start: 252800, end: 284000, best: 'Real Estate (+8%)',   worst: 'Crypto (-18%)',    savings: 20400, debt: 12600, market: -2200 },
    { year: 2024, start: 224500, end: 252800, best: 'Crypto (+72%)',       worst: 'Bonds (-3.1%)',    savings: 19200, debt: 11800, market: -2700 },
    { year: 2023, start: 192300, end: 224500, best: 'US Equities (+24%)',  worst: 'Cash (+5%)',       savings: 17400, debt: 11200, market: 7800 },
    { year: 2022, start: 198100, end: 192300, best: 'Metals (+12%)',       worst: 'US Equities (-19%)', savings: 14200, debt: 10800, market: -29200 },
  ];

  yearSeed.forEach((y, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = y.year;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = y.start;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = y.end;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(E${ri}-D${ri},"")` };
    sheet.getCell(`F${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(F${ri}/D${ri},"")` };
    sheet.getCell(`G${ri}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = y.best;
    sheet.getCell(`H${ri}`).font = { ...FONTS.body, color: argb(COLORS.success) };
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = y.worst;
    sheet.getCell(`I${ri}`).font = { ...FONTS.body, color: argb(COLORS.alert) };
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = y.savings;
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = y.debt;
    sheet.getCell(`K${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`K${ri}`).font = FONTS.body;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).value = y.market;
    sheet.getCell(`L${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`L${ri}`).font = { ...FONTS.body, color: argb(COLORS.warmGold) };
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  });

  if (tier !== 'essentials') {
    let tR = addSectionHeader(sheet, r + 10, 'Tax-prep summary', 'Pro+ : aggregated tax-relevant figures for accountant handoff. Capital gains realized · TLH used · estimated tax owed.');

    const taxRows = [
      ['Realized capital gains (LT)', '$3,200 (AAPL sale Mar)'],
      ['Realized capital gains (ST)', '$0'],
      ['TLH losses used',             '-$890 (BND sale Aug)'],
      ['Net realized G/L',            '$2,310'],
      ['Estimated federal tax (15%)', '$347'],
      ['IRA contribution',            '$5,500 of $7,000 (Roth)'],
      ['HSA contribution',            '$2,950 of $4,150'],
      ['401k match captured',         '$5,400 of $5,400 (full)'],
    ];

    taxRows.forEach((t, i) => {
      const ri = tR + 1 + i;
      sheet.getCell(`B${ri}`).value = t[0];
      sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
      sheet.getCell(`B${ri}`).border = BORDER_THIN();

      sheet.getCell(`D${ri}`).value = t[1];
      sheet.getCell(`D${ri}`).font = FONTS.body;
      sheet.getCell(`D${ri}`).alignment = { horizontal: 'left', indent: 1 };
      sheet.getCell(`D${ri}`).border = BORDER_THIN();
      sheet.mergeCells(`D${ri}:F${ri}`);
    });
  }

  addCallout(sheet, `B${r + 22}:L${r + 23}`,
    '📊',
    'Don\'t credit yourself for market returns',
    'The 2x YoY change came mostly from the market, not from you. Strip the equity gain and the year-over-year change collapses. This is what AI Edition\'s Annual Wealth Review prompt diagnoses — separates signal (your actions) from noise (market movement) so you don\'t feel great in bull years + crushed in bear years for reasons that aren\'t yours.');
  sheet.getRow(r + 22).height = 30;
  sheet.getRow(r + 23).height = 30;

  addFooter(sheet, r + 27, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 19 — 🤖 AI WEALTH INTELLIGENCE (AI Edition only) — 7 prompt cards
// ============================================================================

function buildAIWealthIntelligence(workbook) {
  const sheet = workbook.addWorksheet('🤖 AI Wealth Intelligence');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 22, D: 22, E: 22, F: 4, G: 22, H: 22, I: 22, J: 22, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🤖 AI Wealth Intelligence',
    tabSubtitle: '7 prompts for ChatGPT / Claude free tier. Paste the prompt + your data; the AI never sees your spreadsheet.',
    bannerText: BANNER,
    kpiData: [
      { label: 'PROMPTS',     value: '7' },
      { label: 'PAGE COUNT',  value: '11' },
      { label: 'WORKS WITH',  value: 'ChatGPT + Claude' },
      { label: 'TIER',        value: 'Free works ✓' },
      { label: 'PAIRS WITH',  value: '7 tabs' },
      { label: 'UPDATES',     value: '12 mo free' },
    ],
  });

  let r = addSectionHeader(sheet, 6, '7 AI prompts × 2-row × 4-col layout (4 + 3)', 'Each card: title + tab pairing + 1-line description + PDF page reference + your output paste cell.');

  const prompts = [
    { num: 1, title: 'Monthly NW Narrative',   tab: '🏠 Dashboard',           desc: 'What drove this month\'s change? Plain-English story.',           pdfPage: 3 },
    { num: 2, title: 'FIRE Forecaster',         tab: '🔥 FIRE Calculator',     desc: 'When can I actually stop working? 3-scenario math.',              pdfPage: 4 },
    { num: 3, title: 'Asset Allocation Advisor',tab: '📈 Asset Allocation',    desc: 'Am I drifting? Per-class diagnosis + rebalance recommendations.', pdfPage: 5 },
    { num: 4, title: 'Passive Income Blueprint',tab: '💰 Passive Income Sim.', desc: 'What does my income side look like — today and at FIRE?',         pdfPage: 6 },
    { num: 5, title: 'Wealth Growth Coach',     tab: '🤖 AI Hub',              desc: 'The ONE move with the most NW impact in 12 months.',              pdfPage: 7 },
    { num: 6, title: 'Annual Wealth Review',    tab: '📊 Annual Summary',      desc: 'Year-end review: 3 wins, 3 misses, 3 lessons.',                   pdfPage: 8 },
    { num: 7, title: 'Estate Planning Advisor', tab: '🤝 Estate Access',       desc: 'Paperwork audit — what\'s missing, what\'s at risk.',             pdfPage: 9 },
  ];

  // 2x4 layout (4+3): row 1 = cards 1-4 across B-J at cols B/D/G/J (4 cards)
  // Card columns: B-D, then F is gap, then G-I, then K... actually use 4-col grid
  // Use 8 columns with 4-col packing: cols B-D / E-G / H-J ... simpler:
  // Row 1: cards 1-4 across; Row 2: cards 5-7 across (3 cards)
  const cardCols = [
    { start: 'B', end: 'D' },
    { start: 'E', end: 'F' },  // narrow filler since 3 cards may not fit 4
  ];

  // Two-row layout: r+1 = cards 1-4 (4 cards across), r+7 = cards 5-7 (3 cards across)
  // Each card spans 3 rows × 3 cols. With 11 useable cols, we get:
  // Row A: B-D / E-G / H-J / K-M (4 cards)  ... col M is sometimes M=2 ie narrow, so:
  // Use B:D, E:G, H:J, K:M for 4 cards (each ~3 cols wide)
  const row1Cards = [
    { range: { startCol: 'B', endCol: 'D' }, prompt: prompts[0] },
    { range: { startCol: 'E', endCol: 'G' }, prompt: prompts[1] },
    { range: { startCol: 'H', endCol: 'J' }, prompt: prompts[2] },
    { range: { startCol: 'K', endCol: 'M' }, prompt: prompts[3] },
  ];
  const row2Cards = [
    { range: { startCol: 'B', endCol: 'D' }, prompt: prompts[4] },
    { range: { startCol: 'E', endCol: 'G' }, prompt: prompts[5] },
    { range: { startCol: 'H', endCol: 'J' }, prompt: prompts[6] },
  ];

  function drawCard(card, baseRow) {
    const { startCol, endCol } = card.range;
    const p = card.prompt;

    // Title row
    sheet.mergeCells(`${startCol}${baseRow}:${endCol}${baseRow}`);
    sheet.getCell(`${startCol}${baseRow}`).value = `${p.num}.  ${p.title}`;
    sheet.getCell(`${startCol}${baseRow}`).font = { ...FONTS.bodyBold, size: 13, color: argb(COLORS.white) };
    sheet.getCell(`${startCol}${baseRow}`).fill = FILLS.charcoal;
    sheet.getCell(`${startCol}${baseRow}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getRow(baseRow).height = 24;

    // Tab pairing
    sheet.mergeCells(`${startCol}${baseRow + 1}:${endCol}${baseRow + 1}`);
    sheet.getCell(`${startCol}${baseRow + 1}`).value = `Pairs with: ${p.tab}`;
    sheet.getCell(`${startCol}${baseRow + 1}`).font = { ...FONTS.small, color: argb(COLORS.warmGoldLight) };
    sheet.getCell(`${startCol}${baseRow + 1}`).fill = FILLS.charcoal;
    sheet.getCell(`${startCol}${baseRow + 1}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getRow(baseRow + 1).height = 18;

    // Description
    sheet.mergeCells(`${startCol}${baseRow + 2}:${endCol}${baseRow + 3}`);
    sheet.getCell(`${startCol}${baseRow + 2}`).value = p.desc;
    sheet.getCell(`${startCol}${baseRow + 2}`).font = FONTS.body;
    sheet.getCell(`${startCol}${baseRow + 2}`).fill = FILLS.ivory;
    sheet.getCell(`${startCol}${baseRow + 2}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1, wrapText: true };
    sheet.getRow(baseRow + 2).height = 22;
    sheet.getRow(baseRow + 3).height = 22;

    // PDF reference + paste area
    sheet.mergeCells(`${startCol}${baseRow + 4}:${endCol}${baseRow + 4}`);
    sheet.getCell(`${startCol}${baseRow + 4}`).value = `📄 PDF page ${p.pdfPage} · Paste AI output below ↓`;
    sheet.getCell(`${startCol}${baseRow + 4}`).font = { ...FONTS.small, italic: true, color: argb(COLORS.textMuted) };
    sheet.getCell(`${startCol}${baseRow + 4}`).fill = FILLS.warmGoldLight;
    sheet.getCell(`${startCol}${baseRow + 4}`).alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getRow(baseRow + 4).height = 18;

    sheet.mergeCells(`${startCol}${baseRow + 5}:${endCol}${baseRow + 5}`);
    sheet.getCell(`${startCol}${baseRow + 5}`).value = '';
    sheet.getCell(`${startCol}${baseRow + 5}`).fill = FILLS.white;
    sheet.getCell(`${startCol}${baseRow + 5}`).alignment = { wrapText: true, vertical: 'top', indent: 1 };
    sheet.getCell(`${startCol}${baseRow + 5}`).border = BORDER_THIN();
    sheet.getRow(baseRow + 5).height = 60;
  }

  row1Cards.forEach((c) => drawCard(c, r + 1));
  row2Cards.forEach((c) => drawCard(c, r + 8));

  addCallout(sheet, `B${r + 16}:M${r + 17}`,
    '🤖',
    'How to use these',
    'All 7 prompts work in ChatGPT free + Claude free. Paste the prompt + your data into the AI tool. Read the worked example on the matching PDF page first to see what good output looks like. Save useful output into the "Paste output here" cell so it stays with your spreadsheet. Your account numbers never enter any AI tool — use labels ("Brokerage Roth IRA," "Texas Rental") instead.');
  sheet.getRow(r + 16).height = 32;
  sheet.getRow(r + 17).height = 32;

  addFooter(sheet, r + 21, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 20a — ⚙️ SETTINGS & FX (All tiers) — [COMPLEMENT NWT-021]
// Closes the multi-currency gap. Persona 3 (Kareem, HNW multi-currency) requires this.
// ============================================================================

function buildSettingsAndFX(workbook) {
  const sheet = workbook.addWorksheet('⚙️ Settings & FX');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 18, C: 16, D: 14, E: 40, F: 4, G: 4, H: 4, I: 4, J: 4, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '⚙️ Settings & FX',
    tabSubtitle: 'Base currency + foreign-currency exchange rates. Update rates monthly or quarterly — your local bank or oanda.com.',
    bannerText: BANNER,
    // Base currency input lives at C5 (NOT C4 — top-bar's addTopBar merges A4:M4 as subtitle).
    // FX data lives at B11:D20 (section header consumes rows 6-8, table header at 10, data 11-20).
    kpiData: [
      { label: 'BASE CURRENCY', value: { formula: `C5` } },
      { label: 'CURRENCIES',    value: '10' },
      { label: 'LAST UPDATE',   value: { formula: `IFERROR(TEXT(MAX(D11:D20),"mmm d, yyyy"),"—")` } },
      { label: 'EGP→USD',       value: { formula: `IFERROR(TEXT(VLOOKUP("EGP",B11:D20,2,FALSE),"0.0000"),"—")` } },
      { label: 'AED→USD',       value: { formula: `IFERROR(TEXT(VLOOKUP("AED",B11:D20,2,FALSE),"0.0000"),"—")` } },
      { label: 'CAD→USD',       value: { formula: `IFERROR(TEXT(VLOOKUP("CAD",B11:D20,2,FALSE),"0.0000"),"—")` } },
    ],
  });

  // === Base currency setup — row 5 (row 4 reserved by addTopBar subtitle merge) ===
  sheet.getCell('B5').value = 'Base currency';
  sheet.getCell('B5').font = FONTS.bodyBold;
  sheet.getCell('B5').alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getCell('B5').fill = FILLS.ivory;
  sheet.getCell('B5').border = BORDER_THIN();
  sheet.getCell('C5').value = 'USD';
  sheet.getCell('C5').font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell('C5').alignment = { horizontal: 'center' };
  sheet.getCell('C5').fill = FILLS.white;
  sheet.getCell('C5').border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell('C5').dataValidation = { type: 'list', formulae: ['"USD,EUR,GBP,CAD,AUD,AED,SAR,EGP,INR,JPY"'], allowBlank: false };
  sheet.getCell('C5').note = 'The currency every foreign-currency asset converts INTO. Change here cascades through the rate table below — but only the base-currency column.';

  let r = addSectionHeader(sheet, 6, 'Exchange-rate table — 10 currencies', 'Rate-to-base = how many BASE units one unit of this currency is worth. Example: EGP→USD = 0.0203 means 1 EGP = $0.0203 USD.');

  addTableHeader(sheet, r + 1, ['Currency', 'Rate to Base', 'Last Updated', 'Notes'], ['B', 'C', 'D', 'E']);

  // 10 currencies — seeded with realistic mid-2026 rates against USD base.
  const fxSeed = [
    { ccy: 'USD', rate: 1.0000,  notes: 'Base — never changes' },
    { ccy: 'EUR', rate: 1.0700,  notes: 'European Union' },
    { ccy: 'GBP', rate: 1.2600,  notes: 'United Kingdom' },
    { ccy: 'CAD', rate: 0.7150,  notes: 'Canada' },
    { ccy: 'AUD', rate: 0.6500,  notes: 'Australia' },
    { ccy: 'AED', rate: 0.2723,  notes: 'United Arab Emirates (pegged to USD)' },
    { ccy: 'SAR', rate: 0.2667,  notes: 'Saudi Arabia (pegged to USD)' },
    { ccy: 'EGP', rate: 0.0203,  notes: 'Egypt' },
    { ccy: 'INR', rate: 0.0120,  notes: 'India' },
    { ccy: 'JPY', rate: 0.0064,  notes: 'Japan' },
  ];

  fxSeed.forEach((f, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = f.ccy;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = f.rate;
    sheet.getCell(`C${ri}`).numFmt = '0.0000';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThan', formulae: [0], allowBlank: true };

    sheet.getCell(`D${ri}`).value = new Date();
    sheet.getCell(`D${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`D${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = f.notes;
    sheet.getCell(`E${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
  });

  addCallout(sheet, `B${r + 13}:L${r + 14}`,
    '💱',
    'How to enter foreign-currency assets',
    'Two patterns: (1) Convert to base manually before entering — put the USD equivalent in Assets Summary. (2) Use `=value_in_native*VLOOKUP("AED",\'⚙️ Settings & FX\'!B11:C20,2,FALSE)` to auto-convert. Update rates monthly or quarterly; mid-2026 rates seeded as starter.');
  sheet.getRow(r + 13).height = 32;
  sheet.getRow(r + 14).height = 32;

  // [FIX-BNDL-006] BUNDLE NOTE — FX rates must stay in sync with IPT (B25)
  addCallout(sheet, `B${r + 16}:L${r + 16}`,
    '🔗',
    'BUNDLE NOTE — FX rates must match Investment Portfolio Tracker',
    'If you also own the Investment Portfolio Tracker (bundled), the FX rates above MUST match the IPT 💵 Cash & FX Holdings rate table. Each workbook keeps an independent table so each remains usable standalone — but for the bundle to reconcile, edits must be mirrored. Alternative: use =GOOGLEFINANCE("CURRENCY:USDEUR") in both workbooks (Google Sheets only).');
  sheet.getRow(r + 16).height = 40;

  addFooter(sheet, r + 19, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 20b — 📄 STATEMENT (1-page) (All tiers) — [COMPLEMENT NWT-029]
// One-page printable balance sheet for advisor / lender / underwriter handoff.
// ============================================================================

function buildStatement(workbook) {
  const sheet = workbook.addWorksheet('📄 Statement (1-page)');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 28, C: 16, D: 4, E: 28, F: 16, G: 2 });

  // No top bar — clean printable look
  sheet.mergeCells('B2:F2');
  sheet.getCell('B2').value = 'PERSONAL BALANCE SHEET';
  sheet.getCell('B2').font = { name: 'Inter', size: 22, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell('B2').alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(2).height = 36;

  sheet.mergeCells('B3:F3');
  sheet.getCell('B3').value = { formula: `"As of "&TEXT(TODAY(),"mmmm d, yyyy")` };
  sheet.getCell('B3').font = { ...FONTS.bodyMuted, size: 12 };
  sheet.getCell('B3').alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(3).height = 24;

  // Gold divider
  sheet.mergeCells('B4:F4');
  sheet.getCell('B4').fill = FILLS.warmGold;
  sheet.getRow(4).height = 3;

  // === ASSETS section ===
  sheet.mergeCells('B6:C6');
  sheet.getCell('B6').value = 'ASSETS';
  sheet.getCell('B6').font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.success) };
  sheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(6).height = 24;

  const assetRows = [
    { label: 'Checking',                     ref: `'💼 Assets Summary'!N9` },
    { label: 'HYSA',                         ref: `'💼 Assets Summary'!N10` },
    { label: 'Money Market',                 ref: `'💼 Assets Summary'!N11` },
    { label: 'Vehicles',                     ref: `'💼 Assets Summary'!N13` },
    { label: 'Real Estate (Primary)',        ref: `'💼 Assets Summary'!N14` },
    { label: 'Real Estate (Investment)',     ref: `'💼 Assets Summary'!N15` },
    { label: 'Stocks & Funds (Taxable)',     ref: `'💼 Assets Summary'!N16` },
    { label: '401k / IRA / Roth',            ref: `'💼 Assets Summary'!N17` },
    { label: 'HSA / 529',                    ref: `'💼 Assets Summary'!N18` },
    { label: 'Metals & Crypto',              ref: `'💼 Assets Summary'!N19+'💼 Assets Summary'!N20` },
    { label: 'Business Equity',              ref: `'💼 Assets Summary'!N21` },
    { label: 'Other',                        ref: `'💼 Assets Summary'!N12+'💼 Assets Summary'!N22+'💼 Assets Summary'!N23+'💼 Assets Summary'!N24` },
  ];

  assetRows.forEach((a, i) => {
    const ri = 7 + i;
    sheet.getCell(`B${ri}`).value = a.label;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = { bottom: { style: 'thin', color: argb(COLORS.divider) } };

    sheet.getCell(`C${ri}`).value = { formula: a.ref };
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = { bottom: { style: 'thin', color: argb(COLORS.divider) } };
  });

  // TOTAL ASSETS
  const taRow = 7 + assetRows.length + 1;
  sheet.getCell(`B${taRow}`).value = 'TOTAL ASSETS';
  sheet.getCell(`B${taRow}`).font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.success) };
  sheet.getCell(`B${taRow}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getCell(`B${taRow}`).border = { top: { style: 'medium', color: argb(COLORS.success) } };
  sheet.getCell(`C${taRow}`).value = { formula: `'💼 Assets Summary'!N${ASSETS.TOTAL_ROW}` };
  sheet.getCell(`C${taRow}`).numFmt = '"$"#,##0';
  sheet.getCell(`C${taRow}`).font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.success) };
  sheet.getCell(`C${taRow}`).alignment = { horizontal: 'right' };
  sheet.getCell(`C${taRow}`).border = { top: { style: 'medium', color: argb(COLORS.success) } };

  // === LIABILITIES section ===
  sheet.mergeCells('E6:F6');
  sheet.getCell('E6').value = 'LIABILITIES';
  sheet.getCell('E6').font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.alert) };
  sheet.getCell('E6').alignment = { vertical: 'middle', horizontal: 'left' };

  for (let i = 0; i < LIABS.ROW_COUNT; i++) {
    const ri = 7 + i;
    sheet.getCell(`E${ri}`).value = LIABS.CATEGORIES[i];
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getCell(`E${ri}`).border = { bottom: { style: 'thin', color: argb(COLORS.divider) } };

    sheet.getCell(`F${ri}`).value = { formula: `'📉 Liabilities Summary'!N${LIABS.FIRST_ROW + i}` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = { bottom: { style: 'thin', color: argb(COLORS.divider) } };
  }

  const tlRow = 7 + LIABS.ROW_COUNT + 1;
  sheet.getCell(`E${tlRow}`).value = 'TOTAL LIABILITIES';
  sheet.getCell(`E${tlRow}`).font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.alert) };
  sheet.getCell(`E${tlRow}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getCell(`E${tlRow}`).border = { top: { style: 'medium', color: argb(COLORS.alert) } };
  sheet.getCell(`F${tlRow}`).value = { formula: `'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW}` };
  sheet.getCell(`F${tlRow}`).numFmt = '"$"#,##0';
  sheet.getCell(`F${tlRow}`).font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.alert) };
  sheet.getCell(`F${tlRow}`).alignment = { horizontal: 'right' };
  sheet.getCell(`F${tlRow}`).border = { top: { style: 'medium', color: argb(COLORS.alert) } };

  // === NET WORTH big cell ===
  const nwRow = Math.max(taRow, tlRow) + 3;
  sheet.mergeCells(`B${nwRow}:F${nwRow + 1}`);
  sheet.getCell(`B${nwRow}`).value = { formula: `"NET WORTH: "&TEXT('💼 Assets Summary'!N${ASSETS.TOTAL_ROW}-'📉 Liabilities Summary'!N${LIABS.TOTAL_ROW},"$#,##0")` };
  sheet.getCell(`B${nwRow}`).font = { name: 'Inter', size: 28, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell(`B${nwRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getCell(`B${nwRow}`).fill = FILLS.warmGoldLight;
  sheet.getCell(`B${nwRow}`).border = {
    top: { style: 'medium', color: argb(COLORS.warmGold) },
    bottom: { style: 'medium', color: argb(COLORS.warmGold) },
  };
  sheet.getRow(nwRow).height = 44;
  sheet.getRow(nwRow + 1).height = 20;

  // Footer wordmark
  sheet.mergeCells(`B${nwRow + 4}:F${nwRow + 4}`);
  sheet.getCell(`B${nwRow + 4}`).value = `Lime Premium Studios · ${PRODUCT_NAME} · One-page statement for advisor / lender / underwriter handoff`;
  sheet.getCell(`B${nwRow + 4}`).font = FONTS.footer;
  sheet.getCell(`B${nwRow + 4}`).alignment = { horizontal: 'center', vertical: 'middle' };

  // Print area + fit-to-page (Letter portrait)
  sheet.pageSetup = {
    orientation: 'portrait',
    paperSize: 1, // 1 = Letter
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 1,
    margins: { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 },
    printArea: `B2:F${nwRow + 4}`,
  };
}

// ============================================================================
// TAB 20 — ℹ️ ABOUT & HELP (All tiers)
// ============================================================================

function buildAbout(workbook) {
  const tier = workbook._tier || 'ai';
  // [COMPLEMENT] Counts updated for the +2 always-visible tabs (Settings & FX, Statement).
  const tierMetadata = {
    essentials: { label: 'Essentials', tabs: '11', prompts: '0' },
    pro:        { label: 'Pro',        tabs: '21', prompts: '0' },
    ai:         { label: 'AI Edition', tabs: '22', prompts: '7' },
  }[tier];

  const sheet = workbook.addWorksheet('ℹ️ About & Help');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 30, C: 60, D: 8, E: 10, F: 10, G: 10, H: 10, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — ${tierMetadata.label}`,
    tabName: 'ℹ️ About & Help',
    tabSubtitle: 'Welcome — and quick answers to the questions buyers ask first.',
    bannerText: BANNER,
    kpiData: [
      { label: 'VERSION',    value: '1.0' },
      { label: 'TABS',       value: tierMetadata.tabs },
      { label: 'ACCOUNTS',   value: '7 (401k/IRA/Roth/SEP/HSA/529/Tax)' },
      { label: 'AI PROMPTS', value: tierMetadata.prompts },
      { label: 'TIER',       value: tierMetadata.label },
      { label: 'UPDATES',    value: tier === 'ai' ? '12 mo free' : 'Bug fixes free' },
    ],
  });

  sheet.mergeCells('B6:C6');
  sheet.getCell('B6').value = 'Welcome to your Net Worth Tracker.';
  sheet.getCell('B6').font = FONTS.hero;
  sheet.getRow(6).height = 38;

  sheet.mergeCells('B7:C7');
  sheet.getCell('B7').value = 'A spreadsheet that handles every asset class + every liability + FIRE projection, recommends rebalancing moves, and surfaces tax-loss harvesting opportunities. Privacy-first.';
  sheet.getCell('B7').font = FONTS.bodyMuted;
  sheet.getRow(7).height = 22;

  let r = addSectionHeader(sheet, 10, 'How this spreadsheet is wired', 'Two paired Input tabs (Assets + Liabilities) drive the Dashboard + every analytics tab.');

  const explainerRows = [
    ['💼 Assets Summary',          '16 asset classes × 12 monthly columns. Primary input surface.'],
    ['📉 Liabilities Summary',     '11 liability types × 12 monthly columns. Debt-to-asset auto-computes.'],
    ['🏠 Dashboard',               '5 visualizations: NW Health Score gauge · trajectory · asset mix · liabilities by type · FIRE meter.'],
    ['📊 NW History',              '5-year month-by-month log + driver breakdown (Savings/Market/Debt/Other).'],
    ['🔥 FIRE Calculator',         'Your FIRE number + 3 scenarios (Conservative/Current/Aggressive) + years-to-FIRE.'],
    ['📊 Stocks & Funds (Pro)',    '7-account split — 401k/IRA/Roth/SEP/HSA/529/Taxable. Depth claim no competitor matches.'],
    ['📈 Asset Allocation (Pro)',  'Current vs. target with drift indicators + rebalancing suggestions.'],
    ['📉 Tax-Loss Harvesting (Pro)', 'Per-position cost basis + wash-sale window check + replacement security ideas.'],
    ['🤖 AI Wealth Intelligence (AI)', '7 prompts: Monthly NW Narrative · FIRE Forecaster · Asset Allocation Advisor · Passive Income · Wealth Growth Coach · Annual Review · Estate Planning Advisor.'],
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
    ['Does this connect to my bank or brokerage?',  'No. That\'s the privacy gate. You enter balances monthly (10–15 minutes per month). The trade-off: full privacy + understanding-what\'s-happening, vs. Empower/Monarch\'s auto-aggregation that turns you into a marketing target.'],
    ['How is this different from Empower/Monarch/Kubera?', '(1) Privacy — your wealth profile lives in your Google Drive, not on a server selling you to "wealth managers" (Empower). (2) Price — $12-$29 once vs. $99-$200/year forever. Saves $466-$971 over 5 years. (3) Depth — 7-account split for retirement; few apps cover this. (4) FIRE-ready — FIRE Calculator + Age Benchmark built-in.'],
    ['What\'s the 7-account split?',                'Stocks & Funds (Pro+) separates 401k / IRA / Roth IRA / SEP IRA / HSA / 529 / Taxable. Each has different contribution limits + tax treatment + RMD rules. Lumping them obscures meaningful information — we keep them distinct.'],
    ['Does it work in Excel?',                      'Yes, with caveats. GOOGLEFINANCE cells (live equity prices, metals spot, FX) only run in Google Sheets — Excel users enter manually monthly. Everything else works in both.'],
    ['What\'s Tax-Loss Harvesting actually doing?', 'It tracks per-position cost basis vs. current value, flags positions with unrealized losses, and shows the wash-sale window (30 days before/after most recent buy). You see opportunities; you decide whether to execute. We surface; you trade.'],
    ['Do I need ChatGPT Plus or Claude Pro for AI features?', 'No. The 7 AI prompts (AI Edition) work in ChatGPT free tier or Claude free tier. You paste the prompt + your data into your own AI tool. Nothing in the spreadsheet sends data to any AI.'],
  ];
  faq.forEach((qa, i) => {
    const ri = r2 + 1 + i * 2;
    sheet.getCell(`B${ri}`).value = qa[0];
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).value = qa[1];
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { wrapText: true, vertical: 'middle' };
    sheet.getRow(ri).height = 36;
  });

  addFooter(sheet, r2 + faq.length * 2 + 4, { productName: PRODUCT_NAME });
}

// ============================================================================
// MAIN — orchestrate the build
// ============================================================================

async function buildNetWorthTracker() {
  const t0 = Date.now();

  const tierArg = process.argv.find((a) => a.startsWith('--tier='));
  const tier = tierArg ? tierArg.split('=')[1] : 'ai';
  if (!['essentials', 'pro', 'ai'].includes(tier)) {
    console.error(`✗ Invalid --tier "${tier}". Use essentials | pro | ai.`);
    process.exit(1);
  }
  const tierLabel = { essentials: 'Essentials', pro: 'Pro', ai: 'AI Edition' }[tier];
  // Tab counts (post-applyTierVisibility) — +2 from the 5 complements (Settings & FX + Statement
  // added in all 3 tiers).
  //   Essentials = 11 visible (8 core + About + Settings & FX + Statement)
  //   Pro        = 21 visible (18 core + About + Settings & FX + Statement)
  //   AI Edition = 22 visible (19 core + About + Settings & FX + Statement)
  const tierTabCount = { essentials: 11, pro: 21, ai: 22 }[tier];
  console.log(`→ Building ${PRODUCT_NAME} — ${tierLabel} (${tierTabCount} visible / 22 total)...`);

  const workbook = new ExcelJS.Workbook();
  workbook._tier = tier;
  await registerLimeLogo(workbook);

  workbook.creator = 'Lime Premium Studios';
  workbook.lastModifiedBy = 'Lime Premium Studios';
  workbook.company = 'Lime Premium Studios';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.title = `${PRODUCT_NAME} — ${tierLabel}`;
  workbook.subject = 'Personal finance · net worth tracker · FIRE planner · asset allocation';
  workbook.category = 'Personal Finance';
  workbook.keywords = 'net worth tracker, FIRE calculator, wealth dashboard, asset allocation, retirement planner, estate planning, google sheets, lime premium studios';
  workbook.description = `${PRODUCT_NAME} ${tierLabel} v1.0 — Lime Premium Studios. ${tierTabCount} tabs. Privacy-first — no Plaid, no Zillow API, no aggregator.`;

  // Build all 20 tabs in spec order.
  console.log('  • 🏠 Dashboard');                  buildDashboard(workbook);
  console.log('  • 💼 Assets Summary');             buildAssetsSummary(workbook);
  console.log('  • 📉 Liabilities Summary');        buildLiabilitiesSummary(workbook);
  console.log('  • 📊 NW History');                 buildNWHistory(workbook);
  console.log('  • 🚗 Vehicle Depreciation');       buildVehicleDepreciation(workbook);
  console.log('  • 🏠 Real Estate (Pro)');          buildRealEstate(workbook);
  console.log('  • 📊 Stocks & Funds (Pro)');       buildStocksAndFunds(workbook);
  console.log('  • 🥇 Metals & Crypto (Pro)');      buildMetalsAndCrypto(workbook);
  console.log('  • 🔥 FIRE Calculator');            buildFIRECalculator(workbook);
  console.log('  • 💰 Passive Income Simulator (Pro)'); buildPassiveIncome(workbook);
  console.log('  • 👥 Age Benchmark');              buildAgeBenchmark(workbook);
  console.log('  • 📈 Asset Allocation (Pro)');     buildAssetAllocation(workbook);
  console.log('  • 🎓 Retirement Tracker (Pro)');   buildRetirementTracker(workbook);
  console.log('  • 📉 Tax-Loss Harvesting (Pro)');  buildTaxLossHarvesting(workbook);
  console.log('  • 🌍 Geographic Exposure (Pro)');  buildGeographicExposure(workbook);
  console.log('  • 🛡️ Insurance & Estate (Pro)');   buildInsuranceEstate(workbook);
  console.log('  • 🤝 Estate Access (Pro)');        buildEstateAccess(workbook);
  console.log('  • 📊 Annual Summary');             buildAnnualSummary(workbook);
  console.log('  • 🤖 AI Wealth Intelligence (AI)'); buildAIWealthIntelligence(workbook);
  // [COMPLEMENT] New tabs added in all 3 tiers (NWT-021 + NWT-029).
  console.log('  • ⚙️ Settings & FX');               buildSettingsAndFX(workbook);
  console.log('  • 📄 Statement (1-page)');         buildStatement(workbook);
  console.log('  • ℹ️ About & Help');                buildAbout(workbook);

  applyTierVisibility(workbook, tier, { proTabs: PRO_TABS, aiTabs: AI_TABS, productName: PRODUCT_NAME });

  const filename = tier === 'ai'
    ? 'net-worth-tracker-ai-edition.xlsx'
    : `net-worth-tracker-${tier}.xlsx`;
  const outPath = resolve(OUTPUT_DIR, filename);
  await workbook.xlsx.writeFile(outPath);

  const elapsed = Date.now() - t0;
  console.log(`\n✓ Workbook generated in ${elapsed}ms`);
  console.log(`  Output: ${outPath}`);
  console.log(`  Tier:   ${tierLabel} — ${tierTabCount} of 22 tabs visible`);
}

buildNetWorthTracker().catch((err) => {
  console.error('✗ Build failed:', err);
  process.exit(1);
});
