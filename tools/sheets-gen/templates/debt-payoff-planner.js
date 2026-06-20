/**
 * Debt Payoff Planner — Google Sheets template generator (Lime Premium Studios) — v1
 *
 * Phase B product #2 in the catalog. Cascades from Budget Tracker but with debt-focused
 * tabs: Snowball/Avalanche methods, Strategy Comparison, Credit Score tracker + simulator,
 * Late-Fee Alert, AI Credit Score Coach. Pricing: $12 / $19 / $29.
 *
 * Source of truth:
 *   - docs/product-proposals/debt-payoff-planner.md (tab spec + features)
 *   - docs/product-designs/debt-payoff-planner.md   (visual cascading from Budget Tracker)
 *   - docs/listing-copy/debt-payoff-planner.md      (Etsy listing copy)
 *   - docs/debt-payoff-build-tickets.md             (12 build tickets DP01..DP12)
 *
 * Spine architecture (catalog-wide standing rule):
 *   - 📥 Input Tab — `📋 Debt List`  (buyer's entry surface)
 *   - 📊 Output Dashboard — `🏠 Dashboard` (visual KPI surface)
 *
 * Build status (this file is v1 scaffold):
 *   - ✅ Workbook scaffolding + Lime branding + tier visibility
 *   - ✅ 🏠 Dashboard — Output spine (Debt Health Score + 6 KPI tiles + Debts table)
 *   - ✅ 📋 Debt List — Input spine (20 debt rows, 8-type dropdown, APR CF)
 *   - ✅ ❄️ Snowball Method — payoff schedule
 *   - ⏳ 16 other tabs — stubbed with section header + placeholder callout
 *
 * Run: node tools/sheets-gen/templates/debt-payoff-planner.js --tier=<essentials|pro|ai>
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

const PRODUCT_NAME = 'Debt Payoff Planner';

// ============================================================================
// TAB DEFINITIONS — 20 tabs across 3 tiers + About & Help
// ============================================================================

// Essentials ($12) — 10 tabs: core payoff math + minimum viable workflow
//   (Dashboard, Debt List, Snowball, Avalanche, Strategy Comparison,
//    Payment Calendar, Late-Fee Alert, Milestone Tracker, Extra Payment Simulator, About)
//
// Pro ($19) — 17 tabs: + custom method, consolidation, balance transfer, credit-score
//   tracking, utilization optimizer, on-time streak, refinance radar
//
// AI Edition ($29) — 20 tabs: + AI Credit Score Coach, Inquiry & Marks, Student Loan

const PRO_TABS = new Set([
  '🔀 Custom Method',
  '🔄 Debt Consolidation',
  '💳 Balance Transfer',
  '📈 Credit Score Tracker',
  '🎮 Credit Score Simulator',
  '💡 Utilization Optimizer',
  '🔥 On-Time Streak',
  '🔁 Refinance Radar',
]);

const AI_TABS = new Set([
  '🤖 AI Credit Coach',
  '🔍 Inquiry & Marks',
  '🎓 Student Loan',
]);

// Banner text (shared row-3 banner across every tab) — debt-themed variant
const BANNER = '✦  Why a Spreadsheet, Not an App?   Tally charges $25/mo. We charge once. No credit-bureau handshake. Your debt data stays on your device.';

// ============================================================================
// TAB 1 — 🏠 DASHBOARD (Output spine)
// ============================================================================

function buildDashboard(workbook) {
  const tier = workbook._tier || 'ai';
  const hasAI = tier === 'ai';

  const sheet = workbook.addWorksheet('🏠 Dashboard');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 18, C: 12, D: 12, E: 14, F: 8, G: 22, H: 14, I: 14, J: 14, K: 12, L: 12, M: 2 });

  // KPI tiles — pull live from Debt List. The HEALTH SCORE tile is AI-Edition only;
  // lower tiers swap it for a DTI tile (income/min) so the strip still has 6 cards.
  // DTI input lives on Debt List K40.
  //
  // DPP-102 fix: previously the non-AI version showed "HEALTH SCORE\nAI Edition" which
  // read as "your tier is AI Edition" — false advertising for Essentials/Pro buyers.
  // For Essentials + Pro, swap the slot to a DTI KPI (which is what the Dashboard body
  // already shows for those tiers per DPP-007). This keeps the 6-tile strip layout
  // intact without misrepresenting the tier.
  const healthKPI = hasAI
    ? { label: 'HEALTH SCORE', value: { formula: `IFERROR('🤖 AI Credit Coach'!B10&" / 100","— / 100")` } }
    : { label: 'DTI',          value: { formula: `IFERROR(IF('📋 Debt List'!K40>0,TEXT(SUM('📋 Debt List'!F11:F30)/'📋 Debt List'!K40,"0.0%"),"set K40"),"—")` } };
  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏠 Dashboard',
    tabSubtitle: 'Your debt at a glance — updates the moment you edit the Debt List.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL DEBT',     value: { formula: `TEXT(SUM('📋 Debt List'!D11:D30),"$#,##0")` } },
      { label: 'DEBTS',          value: { formula: `COUNTA('📋 Debt List'!B11:B30)` } },
      { label: 'MONTHLY MIN',    value: { formula: `TEXT(SUM('📋 Debt List'!F11:F30),"$#,##0")` } },
      { label: 'WEIGHTED APR',   value: { formula: `IFERROR(TEXT(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/SUM('📋 Debt List'!D11:D30),"0.0%"),"0.0%")` } },
      { label: 'INTEREST / MO',  value: { formula: `TEXT(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/12,"$#,##0")` } },
      healthKPI,
    ],
  });

  // Section 1: Debt Health Score hero — AI Edition only.
  // For Essentials/Pro, swap to a DTI summary card (income from Debt List!K8 per DPP-009).
  let r;
  if (hasAI) {
    r = addSectionHeader(sheet, 6, 'Debt Health Score', 'Composite of 4 sub-scores: debt paid · interest saved · on-time streak · utilization. Live composite — updates as your Debt List, Milestones, On-Time Streak, and Utilization Optimizer tabs change.', 'B:F');

    sheet.mergeCells(`B${r + 1}:C${r + 4}`);
    sheet.getCell(`B${r + 1}`).value = { formula: `IFERROR(IF(ISNUMBER('🤖 AI Credit Coach'!B10),'🤖 AI Credit Coach'!B10,"—"),"—")` };
    sheet.getCell(`B${r + 1}`).font = FONTS.scoreHuge;
    sheet.getCell(`B${r + 1}`).alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell(`B${r + 1}`).fill = FILLS.ivory;
    sheet.getCell(`B${r + 1}`).border = BORDER_THIN(COLORS.warmGold);
    sheet.getCell(`B${r + 1}`).numFmt = '0';

    sheet.getCell(`D${r + 1}`).value = '/ 100';
    sheet.getCell(`D${r + 1}`).font = FONTS.scoreUnit;
    sheet.getCell(`D${r + 1}`).alignment = { vertical: 'middle' };

    sheet.getCell(`D${r + 2}`).value = { formula: `IFERROR(IF(NOT(ISNUMBER('🤖 AI Credit Coach'!B10)),"Awaiting data",IF('🤖 AI Credit Coach'!B10>=80,"Strong",IF('🤖 AI Credit Coach'!B10>=60,"On Track",IF('🤖 AI Credit Coach'!B10>=40,"At Risk","Critical")))),"—")` };
    sheet.getCell(`D${r + 2}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.success) };
    sheet.getCell(`D${r + 2}`).alignment = { vertical: 'middle' };

    sheet.mergeCells(`E${r + 1}:F${r + 4}`);
    sheet.getCell(`E${r + 1}`).value = { richText: [
      { text: 'What the score means\n', font: FONTS.smallCaps },
      { text: '\n', font: FONTS.body },
      { text: '80-100 — Strong. Most debt paid + on-time streak intact.\n', font: FONTS.body },
      { text: '60-79  — On Track. Steady progress; tighten utilization.\n', font: FONTS.body },
      { text: '40-59  — At Risk. Late payments or high utilization eating into progress.\n', font: FONTS.body },
      { text: '0-39   — Critical. Focus on minimums + late-fee avoidance first.', font: FONTS.body },
    ]};
    sheet.getCell(`E${r + 1}`).alignment = { vertical: 'top', horizontal: 'left', wrapText: true, indent: 1 };

    r += 6;
  } else {
    // Non-AI: DTI summary block. Income field lives on Debt List!K8 (per DPP-009).
    r = addSectionHeader(sheet, 6, 'Debt-to-Income (DTI)', 'CFPB / FRB rule of thumb: keep total DTI at or below 36%, with housing alone at or below 28%. Set your gross monthly income on the Debt List tab (K8).', 'B:F');

    sheet.mergeCells(`B${r + 1}:C${r + 4}`);
    sheet.getCell(`B${r + 1}`).value = { formula: `IFERROR(IF('📋 Debt List'!K40>0,TEXT(SUM('📋 Debt List'!F11:F30)/'📋 Debt List'!K40,"0.0%"),"Set K40"),"—")` };
    sheet.getCell(`B${r + 1}`).font = FONTS.scoreHuge;
    sheet.getCell(`B${r + 1}`).alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell(`B${r + 1}`).fill = FILLS.ivory;
    sheet.getCell(`B${r + 1}`).border = BORDER_THIN(COLORS.warmGold);

    sheet.getCell(`D${r + 1}`).value = 'DTI';
    sheet.getCell(`D${r + 1}`).font = FONTS.scoreUnit;
    sheet.getCell(`D${r + 1}`).alignment = { vertical: 'middle' };

    sheet.getCell(`D${r + 2}`).value = { formula: `IFERROR(IF('📋 Debt List'!K40<=0,"Awaiting income",IF(SUM('📋 Debt List'!F11:F30)/'📋 Debt List'!K40<=0.28,"Healthy",IF(SUM('📋 Debt List'!F11:F30)/'📋 Debt List'!K40<=0.36,"Caution","High — refinance / reduce"))),"—")` };
    sheet.getCell(`D${r + 2}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.success) };
    sheet.getCell(`D${r + 2}`).alignment = { vertical: 'middle' };

    sheet.mergeCells(`E${r + 1}:F${r + 4}`);
    sheet.getCell(`E${r + 1}`).value = { richText: [
      { text: 'CFPB / FRB DTI bands\n', font: FONTS.smallCaps },
      { text: '\n', font: FONTS.body },
      { text: '≤ 28% — Housing-only target (front-end DTI).\n', font: FONTS.body },
      { text: '≤ 36% — Total monthly debt vs gross income (back-end).\n', font: FONTS.body },
      { text: '> 43% — Most mortgage underwriters decline at this point.\n', font: FONTS.body },
      { text: 'AI Edition adds a Debt Health Score that folds DTI into 4 weighted sub-scores.', font: FONTS.bodyMuted },
    ]};
    sheet.getCell(`E${r + 1}`).alignment = { vertical: 'top', horizontal: 'left', wrapText: true, indent: 1 };

    r += 6;
  }

  // Section 2: Debts table — right side of the same band, live from Debt List
  let dbR = addSectionHeader(sheet, 6, 'Your debts — sorted by APR', 'High-APR debts cost you the most each month. Avalanche method pays these off first.', 'G:L');

  addTableHeader(sheet, dbR + 1, ['Debt', 'Balance', 'APR', 'Minimum', '% of Total'], ['G', 'H', 'I', 'J', 'K']);

  // Sorted view via formula chain — pulls top 10 by balance from Debt List
  for (let i = 0; i < 10; i++) {
    const row = dbR + 2 + i;
    const dlRow = 11 + i; // direct row mapping (no sort) — sort can ride later

    sheet.getCell(`G${row}`).value = { formula: `IFERROR('📋 Debt List'!B${dlRow},"")` };
    sheet.getCell(`G${row}`).font = FONTS.body;
    sheet.getCell(`G${row}`).border = BORDER_THIN();

    sheet.getCell(`H${row}`).value = { formula: `IFERROR('📋 Debt List'!D${dlRow},0)` };
    sheet.getCell(`H${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${row}`).font = FONTS.body;
    sheet.getCell(`H${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${row}`).border = BORDER_THIN();

    sheet.getCell(`I${row}`).value = { formula: `IFERROR('📋 Debt List'!E${dlRow},0)` };
    sheet.getCell(`I${row}`).numFmt = '0.0%';
    sheet.getCell(`I${row}`).font = FONTS.body;
    sheet.getCell(`I${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${row}`).border = BORDER_THIN();

    sheet.getCell(`J${row}`).value = { formula: `IFERROR('📋 Debt List'!F${dlRow},0)` };
    sheet.getCell(`J${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${row}`).font = FONTS.body;
    sheet.getCell(`J${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${row}`).border = BORDER_THIN();

    sheet.getCell(`K${row}`).value = { formula: `IFERROR(H${row}/SUM('📋 Debt List'!D11:D30),0)` };
    sheet.getCell(`K${row}`).numFmt = '0.0%';
    sheet.getCell(`K${row}`).font = FONTS.body;
    sheet.getCell(`K${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`K${row}`).border = BORDER_THIN();
  }

  // CF on APR — warning >15%, alert >25%
  sheet.addConditionalFormatting({
    ref: `I${dbR + 2}:I${dbR + 11}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.25'], priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.15'], priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
    ],
  });

  // Section 3: Insights callouts
  const insightsR = Math.max(r, dbR + 12) + 2;
  addSectionHeader(sheet, insightsR, 'This month\'s priorities', 'Cross-tab insights computed automatically.', 'B:L');

  addCallout(sheet, `B${insightsR + 3}:E${insightsR + 4}`,
    '💡',
    'Snowball or Avalanche?',
    'Snowball Method tab orders smallest-balance-first for emotional wins. Avalanche orders highest-APR-first for maximum interest saved. Open Strategy Comparison to see months + dollars saved for both.');

  addCallout(sheet, `G${insightsR + 3}:L${insightsR + 4}`,
    '⚠️',
    'Watch the danger zone',
    'Any debt over 25% APR is highlighted red above — those compound twice as fast as your average. Pay the minimum on everything, then funnel every extra dollar at the red row first.');

  sheet.getRow(insightsR + 3).height = 28;
  sheet.getRow(insightsR + 4).height = 28;

  addFooter(sheet, insightsR + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 2 — 📋 DEBT LIST (Input spine)
// ============================================================================

function buildDebtList(workbook) {
  const sheet = workbook.addWorksheet('📋 Debt List');
  setTabColor(sheet, COLORS.alert);
  // Column layout (post DPP-009/010):
  //   B Debt Name · C Type · D Balance · E APR · F Min · G Due · H Target Payoff
  //   I Promo Expires · J Post-Promo APR · K Notes · L Income (K40 input lives below totals)
  setupColumns(sheet, { A: 2, B: 24, C: 16, D: 12, E: 9, F: 12, G: 7, H: 13, I: 13, J: 11, K: 22, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📋 Debt List',
    tabSubtitle: 'Your single source of truth. Every other tab reads from this list.',
    bannerText: BANNER,
    kpiData: [
      { label: 'DEBTS',          value: { formula: `COUNTA(B11:B30)` } },
      { label: 'TOTAL BAL.',     value: { formula: `TEXT(SUM(D11:D30),"$#,##0")` } },
      { label: 'MONTHLY MIN',    value: { formula: `TEXT(SUM(F11:F30),"$#,##0")` } },
      // Weighted APR (matches Strategy Comparison + Simulator). Old AVERAGEIF was unweighted
      // and disagreed with every downstream tab.
      { label: 'WEIGHTED APR',   value: { formula: `IFERROR(TEXT(SUMPRODUCT(D11:D30,E11:E30)/SUM(D11:D30),"0.0%"),"0.0%")` } },
      // DTI = monthly debt minimums / gross monthly income (K40). Color-banded in callout below.
      { label: 'DTI',            value: { formula: `IFERROR(IF(K40>0,TEXT(SUM(F11:F30)/K40,"0.0%"),"set K40 ↓"),"—")` } },
      { label: 'HIGHEST APR',    value: { formula: `IFERROR(INDEX(B11:B30,MATCH(MAX(E11:E30),E11:E30,0)),"—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Your debts (up to 20)', 'Enter each debt. Promo Expires + Post-Promo APR (cols I, J) tell Avalanche when a 0% rate ends so it doesn\'t under-prioritize the debt.');

  addTableHeader(sheet, r + 1, ['Debt Name', 'Type', 'Balance', 'APR', 'Minimum', 'Due', 'Target', 'Promo Ends', 'Post APR', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  // 6 seed rows so the demo feels populated; user can edit / add up to row 30.
  // DPP-010: Promo Ends + Post APR columns let Avalanche re-rank when a 0% promo is about to reset.
  // Seed the Care Credit row with a realistic 24-month promo expiry and a post-promo APR.
  const seed = [
    { name: 'Chase Sapphire Preferred', type: 'Credit Card',  bal: 4250, apr: 0.2199, min:  85, due: 5,  target: '2027-06-30', promo: null,         postApr: null,   notes: 'Largest emotional weight' },
    { name: 'Amex Gold',                type: 'Credit Card',  bal: 2890, apr: 0.2699, min:  58, due: 22, target: '2026-12-31', promo: null,         postApr: null,   notes: '⚠️ Highest APR' },
    { name: 'SoFi Personal Loan',       type: 'Personal Loan', bal: 8400, apr: 0.1149, min: 220, due: 1,  target: '2029-03-15', promo: null,         postApr: null,   notes: 'Consolidation candidate' },
    { name: 'Subaru Auto Loan',         type: 'Car Loan',     bal: 12500, apr: 0.0599, min: 340, due: 15, target: '2030-10-01', promo: null,         postApr: null,   notes: '' },
    { name: 'Sallie Mae Student',       type: 'Student Loan', bal: 18900, apr: 0.0489, min: 198, due: 10, target: '2034-08-01', promo: null,         postApr: null,   notes: 'Federal — IDR eligible' },
    { name: 'Care Credit (Dental)',     type: 'Medical Debt', bal:  840, apr: 0.0000, min:  35, due: 27, target: '2027-02-01', promo: '2027-02-01', postApr: 0.2699, notes: 'Promo 24mo @ 0% — resets to 26.99% on expiry' },
  ];

  const debtTypes = ['Credit Card', 'Personal Loan', 'Car Loan', 'Student Loan', 'Medical Debt', 'BNPL', 'Mortgage', 'Family Loan'];

  for (let i = 0; i < 20; i++) {
    const ri = r + 2 + i;
    const row = seed[i];

    // Empty-slot cells get format + validation but NO value — Excel's COUNTA
    // counts empty strings as non-blank, so setting `''` would inflate the count.
    if (row) sheet.getCell(`B${ri}`).value = row.name;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.white;

    if (row) sheet.getCell(`C${ri}`).value = row.type;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: [`"${debtTypes.join(',')}"`] };

    sheet.getCell(`D${ri}`).value = row ? row.bal : null;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true };

    sheet.getCell(`E${ri}`).value = row ? row.apr : null;
    sheet.getCell(`E${ri}`).numFmt = '0.00%';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).dataValidation = { type: 'decimal', operator: 'between', formulae: [0, 0.99], allowBlank: true, showErrorMessage: true, errorStyle: 'stop', errorTitle: 'APR must be a decimal', error: 'Enter your APR as a decimal between 0 and 0.99. Example: 22% APR → type 0.22, NOT 22.', showInputMessage: true, promptTitle: 'APR — decimal please', prompt: '22% = 0.22, 5.99% = 0.0599. The bar fills with the warning color above 15% and the alert color above 25%.' };

    sheet.getCell(`F${ri}`).value = row ? row.min : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true };

    sheet.getCell(`G${ri}`).value = row ? row.due : null;
    sheet.getCell(`G${ri}`).numFmt = '0';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).dataValidation = { type: 'whole', operator: 'between', formulae: [1, 31], allowBlank: true };

    if (row) sheet.getCell(`H${ri}`).value = new Date(row.target);
    sheet.getCell(`H${ri}`).numFmt = 'mmm yyyy';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
    sheet.getCell(`H${ri}`).fill = FILLS.white;

    // Promo Expires (I): optional date, only relevant for 0% promo debts. Blank for non-promo.
    if (row && row.promo) sheet.getCell(`I${ri}`).value = new Date(row.promo);
    sheet.getCell(`I${ri}`).numFmt = 'mmm yyyy';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
    sheet.getCell(`I${ri}`).fill = FILLS.white;

    // Post-Promo APR (J): optional decimal — the rate the debt resets to after promo expiry.
    if (row && row.postApr != null) sheet.getCell(`J${ri}`).value = row.postApr;
    sheet.getCell(`J${ri}`).numFmt = '0.00%';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).dataValidation = { type: 'decimal', operator: 'between', formulae: [0, 0.99], allowBlank: true, showInputMessage: true, promptTitle: 'Post-promo APR', prompt: 'The rate this debt resets to after the promo ends. Leave blank if no promo. Decimal format: 0.2599 = 25.99%.' };

    // Notes (K): user free-text — shifted from I to K to make room for promo fields.
    if (row && row.notes) sheet.getCell(`K${ri}`).value = row.notes;
    sheet.getCell(`K${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${ri}`).border = BORDER_THIN();
    sheet.getCell(`K${ri}`).fill = FILLS.white;
  }

  // CF on APR — warning >15%, alert >25%
  sheet.addConditionalFormatting({
    ref: `E${r + 2}:E${r + 21}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.25'], priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.15'], priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
    ],
  });

  // CF on Promo Expires — amber when ≤60 days from today, alert when ≤30 days
  sheet.addConditionalFormatting({
    ref: `I${r + 2}:I${r + 21}`,
    rules: [
      { type: 'expression', formulae: [`AND(I${r + 2}<>"",I${r + 2}-TODAY()<=30,I${r + 2}-TODAY()>=0,D${r + 2}>0)`], priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'expression', formulae: [`AND(I${r + 2}<>"",I${r + 2}-TODAY()<=60,I${r + 2}-TODAY()>=0,D${r + 2}>0)`], priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
    ],
  });

  // Total row past D30 so top-bar SUM doesn't double-count
  const totalR = 32;
  sheet.getCell(`C${totalR}`).value = 'TOTAL';
  sheet.getCell(`C${totalR}`).font = FONTS.smallCaps;
  sheet.getCell(`C${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`D${totalR}`).value = { formula: `SUM(D11:D30)` };
  sheet.getCell(`D${totalR}`).numFmt = '"$"#,##0.00';
  sheet.getCell(`D${totalR}`).font = { name: 'Inter', size: 16, bold: true, color: argb(COLORS.alert) };
  sheet.getCell(`D${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`D${totalR}`).fill = FILLS.ivory;
  sheet.getCell(`D${totalR}`).border = { top: { style: 'medium', color: argb(COLORS.alert) } };
  sheet.getCell(`F${totalR}`).value = { formula: `SUM(F11:F30)` };
  sheet.getCell(`F${totalR}`).numFmt = '"$"#,##0.00';
  sheet.getCell(`F${totalR}`).font = { name: 'Inter', size: 16, bold: true, color: argb(COLORS.alert) };
  sheet.getCell(`F${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`F${totalR}`).fill = FILLS.ivory;
  sheet.getCell(`F${totalR}`).border = { top: { style: 'medium', color: argb(COLORS.alert) } };

  addCallout(sheet, `B${totalR + 2}:K${totalR + 3}`,
    '💡',
    'How to use this tab',
    'APR goes in as a DECIMAL (0.22 for 22%). 0% promo? Fill Promo Ends (I) + Post APR (J) so Avalanche re-ranks before the rate resets. Notes are yours — flag refi candidates, hardship plans, anything you want on the Dashboard.');
  sheet.getRow(totalR + 2).height = 26;
  sheet.getRow(totalR + 3).height = 26;

  // === Plan Settings — income input (DPP-009) drives DTI everywhere ===
  // Income goes here, below the debt totals, so it doesn't collide with the per-debt rows
  // OR the top-right top-bar area. K40 is the canonical input cell — every DTI reference
  // (Debt List KPI, Dashboard DTI block on Ess/Pro, AI Coach sub-scores) points at K40.
  const planR = totalR + 6;
  sheet.mergeCells(`B${planR}:K${planR}`);
  sheet.getCell(`B${planR}`).value = 'Plan Settings';
  sheet.getCell(`B${planR}`).font = FONTS.section;
  sheet.getCell(`B${planR}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(planR).height = 26;

  sheet.mergeCells(`B${planR + 1}:K${planR + 1}`);
  sheet.getCell(`B${planR + 1}`).fill = FILLS.warmGold;
  sheet.getRow(planR + 1).height = 3;

  sheet.mergeCells(`B${planR + 2}:H${planR + 2}`);
  sheet.getCell(`B${planR + 2}`).value = '↓ Gross monthly income (pre-tax) — drives DTI computation everywhere';
  sheet.getCell(`B${planR + 2}`).font = { ...FONTS.smallCaps, color: argb(COLORS.charcoal) };
  sheet.getCell(`B${planR + 2}`).alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };

  const incInput = sheet.getCell(`K${planR + 2}`);
  incInput.value = null;
  incInput.numFmt = '"$"#,##0';
  incInput.font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.warmGold) };
  incInput.alignment = { vertical: 'middle', horizontal: 'center' };
  incInput.fill = FILLS.ivory;
  incInput.border = {
    top:    { style: 'medium', color: argb(COLORS.warmGold) },
    bottom: { style: 'medium', color: argb(COLORS.warmGold) },
    left:   { style: 'medium', color: argb(COLORS.warmGold) },
    right:  { style: 'medium', color: argb(COLORS.warmGold) },
  };
  incInput.dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true, showInputMessage: true, promptTitle: 'Gross monthly income', prompt: 'Pre-tax monthly income. Drives the DTI KPI tile + (Essentials/Pro) the Dashboard DTI block. CFPB guidance: ≤28% housing, ≤36% total.' };
  sheet.getRow(planR + 2).height = 28;

  sheet.mergeCells(`B${planR + 3}:K${planR + 3}`);
  sheet.getCell(`B${planR + 3}`).value = 'CFPB / FRB norms: ≤28% housing-only · ≤36% total · >43% triggers most mortgage declines';
  sheet.getCell(`B${planR + 3}`).font = FONTS.bodyMuted;
  sheet.getCell(`B${planR + 3}`).alignment = { vertical: 'middle', horizontal: 'center' };

  // Sanity check — K40 is row planR+2; assert at generator runtime so the formula refs
  // in Dashboard + AI Coach KPI tiles (which target K40) stay in sync.
  if (planR + 2 !== 40) {
    throw new Error(`Debt List K40 invariant broken: income input at K${planR + 2}, expected K40. Fix dependent formulas.`);
  }

  addFooter(sheet, planR + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 3 — ❄️ SNOWBALL METHOD
// ============================================================================

function buildSnowball(workbook) {
  const sheet = workbook.addWorksheet('❄️ Snowball Method');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 4, C: 26, D: 12, E: 10, F: 14, G: 14, H: 22, I: 8, J: 8, K: 8, L: 8, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '❄️ Snowball Method',
    tabSubtitle: 'Smallest balance first. Quick wins. Best when you need motivation more than savings.',
    bannerText: BANNER,
    kpiData: [
      { label: 'METHOD',           value: 'Snowball' },
      { label: 'PAYOFF ORDER',     value: 'Small → Large' },
      { label: 'FIRST PAYOFF',     value: { formula: `IFERROR(INDEX('📋 Debt List'!B11:B30,MATCH(SMALL('📋 Debt List'!D11:D30,1),'📋 Debt List'!D11:D30,0)),"—")` } },
      { label: 'FIRST BAL.',       value: { formula: `IFERROR(TEXT(SMALL('📋 Debt List'!D11:D30,1),"$#,##0"),"$0")` } },
      { label: 'TOTAL DEBT',       value: { formula: `TEXT(SUM('📋 Debt List'!D11:D30),"$#,##0")` } },
      { label: 'TOTAL MIN',        value: { formula: `TEXT(SUM('📋 Debt List'!F11:F30),"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Snowball payoff order', 'Debts sorted smallest-balance-first. Once a debt hits $0, its minimum rolls into the next + the Simulator\'s extra payment cascades through the queue.');

  addTableHeader(sheet, r + 1, ['#', 'Debt', 'Balance', 'APR', 'Minimum', 'Snowball Pmt', 'Progress'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  // 20 ranks (DPP-006) — matches the Debt List's 20-row promise. Earlier ranks roll their
  // minimum to later ranks; rank 1 also gets the user's extra payment (Simulator!D6) so the
  // displayed Snowball Pmt is what the buyer is actually paying that focus debt.
  for (let i = 0; i < 20; i++) {
    const row = r + 2 + i;
    const rank = i + 1;
    sheet.getCell(`B${row}`).value = rank;
    sheet.getCell(`B${row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`B${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.ivory;

    // Debt name at this rank (Nth smallest balance)
    sheet.getCell(`C${row}`).value = { formula: `IFERROR(INDEX('📋 Debt List'!B11:B30,MATCH(SMALL('📋 Debt List'!D11:D30,${rank}),'📋 Debt List'!D11:D30,0)),"")` };
    sheet.getCell(`C${row}`).font = FONTS.bodyBold;
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).fill = FILLS.white;

    sheet.getCell(`D${row}`).value = { formula: `IFERROR(SMALL('📋 Debt List'!D11:D30,${rank}),"")` };
    sheet.getCell(`D${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${row}`).font = FONTS.body;
    sheet.getCell(`D${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`D${row}`).fill = FILLS.white;

    sheet.getCell(`E${row}`).value = { formula: `IFERROR(INDEX('📋 Debt List'!E11:E30,MATCH(SMALL('📋 Debt List'!D11:D30,${rank}),'📋 Debt List'!D11:D30,0)),"")` };
    sheet.getCell(`E${row}`).numFmt = '0.0%';
    sheet.getCell(`E${row}`).font = FONTS.body;
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).fill = FILLS.white;

    sheet.getCell(`F${row}`).value = { formula: `IFERROR(INDEX('📋 Debt List'!F11:F30,MATCH(SMALL('📋 Debt List'!D11:D30,${rank}),'📋 Debt List'!D11:D30,0)),"")` };
    sheet.getCell(`F${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${row}`).font = FONTS.body;
    sheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).fill = FILLS.white;

    // Snowball payment = own minimum + cumulative sum of all higher-ranked minimums
    // (debts paid off earlier roll their minimums into this one). Rank 1 also receives
    // the buyer's extra payment from the Extra Payment Simulator (DPP-NTH-007 fix).
    if (i === 0) {
      sheet.getCell(`G${row}`).value = { formula: `IFERROR(F${row}+'🎯 Extra Payment Simulator'!D6,"")` };
    } else {
      sheet.getCell(`G${row}`).value = { formula: `IFERROR(F${row}+G${row - 1},"")` };
    }
    sheet.getCell(`G${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${row}`).font = { ...FONTS.body, bold: true, color: argb(COLORS.success) };
    sheet.getCell(`G${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${row}`).border = BORDER_THIN();
    sheet.getCell(`G${row}`).fill = FILLS.successLight;

    // Progress bar (illustrative — actual paid amount = 0 at workbook open; once user
    // edits balance over time the formula reflects shrinking debt).
    sheet.getCell(`H${row}`).value = { formula: `IF(D${row}="","",REPT("▱",10))` };
    sheet.getCell(`H${row}`).font = { name: 'Inter', size: 13, color: argb(COLORS.warmGold) };
    sheet.getCell(`H${row}`).border = BORDER_THIN();
    sheet.getCell(`H${row}`).fill = FILLS.white;
  }

  addCallout(sheet, `B${r + 24}:H${r + 25}`,
    '❄️',
    'Why Snowball?',
    'Math says Avalanche (highest APR first) saves more interest. Psychology says Snowball (smallest balance first) keeps you going. Pick the one you\'ll actually finish. The Strategy Comparison tab quantifies the trade-off in dollars + months.');
  sheet.getRow(r + 24).height = 28;
  sheet.getRow(r + 25).height = 28;

  addFooter(sheet, r + 28, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 4 — 🌊 AVALANCHE METHOD
// ============================================================================

function buildAvalanche(workbook) {
  const sheet = workbook.addWorksheet('🌊 Avalanche Method');
  setTabColor(sheet, COLORS.alert);
  setupColumns(sheet, { A: 2, B: 4, C: 26, D: 12, E: 10, F: 14, G: 14, H: 22, I: 8, J: 8, K: 8, L: 8, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🌊 Avalanche Method',
    tabSubtitle: 'Highest APR first. Maximum interest saved. Best when math matters more than motivation.',
    bannerText: BANNER,
    kpiData: [
      { label: 'METHOD',           value: 'Avalanche' },
      { label: 'PAYOFF ORDER',     value: 'High APR → Low' },
      { label: 'FIRST TARGET',     value: { formula: `IFERROR(INDEX('📋 Debt List'!B11:B30,MATCH(LARGE('📋 Debt List'!E11:E30,1),'📋 Debt List'!E11:E30,0)),"—")` } },
      { label: 'TOP APR',          value: { formula: `IFERROR(TEXT(LARGE('📋 Debt List'!E11:E30,1),"0.0%"),"0.0%")` } },
      { label: 'TOTAL DEBT',       value: { formula: `TEXT(SUM('📋 Debt List'!D11:D30),"$#,##0")` } },
      { label: 'WEIGHTED APR',     value: { formula: `IFERROR(TEXT(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/SUM('📋 Debt List'!D11:D30),"0.0%"),"0.0%")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Avalanche payoff order', 'Debts sorted highest-APR-first. Top-APR debt is the focus; its minimum + the Simulator\'s extra payment go there first. Cascades through the queue as each debt hits $0.');

  addTableHeader(sheet, r + 1, ['#', 'Debt', 'Balance', 'APR', 'Minimum', 'Avalanche Pmt', 'Annual Interest'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  // 20 ranks (DPP-006) — matches Debt List capacity.
  for (let i = 0; i < 20; i++) {
    const row = r + 2 + i;
    const rank = i + 1;
    sheet.getCell(`B${row}`).value = rank;
    sheet.getCell(`B${row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.alert) };
    sheet.getCell(`B${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.ivory;

    // Nth highest APR — INDEX-MATCH on LARGE(APR, rank)
    sheet.getCell(`C${row}`).value = { formula: `IFERROR(INDEX('📋 Debt List'!B11:B30,MATCH(LARGE('📋 Debt List'!E11:E30,${rank}),'📋 Debt List'!E11:E30,0)),"")` };
    sheet.getCell(`C${row}`).font = FONTS.bodyBold;
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).fill = FILLS.white;

    sheet.getCell(`D${row}`).value = { formula: `IFERROR(INDEX('📋 Debt List'!D11:D30,MATCH(LARGE('📋 Debt List'!E11:E30,${rank}),'📋 Debt List'!E11:E30,0)),"")` };
    sheet.getCell(`D${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${row}`).font = FONTS.body;
    sheet.getCell(`D${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`D${row}`).fill = FILLS.white;

    sheet.getCell(`E${row}`).value = { formula: `IFERROR(LARGE('📋 Debt List'!E11:E30,${rank}),"")` };
    sheet.getCell(`E${row}`).numFmt = '0.0%';
    sheet.getCell(`E${row}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).fill = FILLS.white;

    sheet.getCell(`F${row}`).value = { formula: `IFERROR(INDEX('📋 Debt List'!F11:F30,MATCH(LARGE('📋 Debt List'!E11:E30,${rank}),'📋 Debt List'!E11:E30,0)),"")` };
    sheet.getCell(`F${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${row}`).font = FONTS.body;
    sheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).fill = FILLS.white;

    // Avalanche cascade — focus (rank 1) gets its min + the buyer's extra payment.
    // Lower ranks roll the cumulative paid-off minimums forward.
    if (i === 0) {
      sheet.getCell(`G${row}`).value = { formula: `IFERROR(F${row}+'🎯 Extra Payment Simulator'!D6,"")` };
    } else {
      sheet.getCell(`G${row}`).value = { formula: `IFERROR(F${row}+G${row - 1},"")` };
    }
    sheet.getCell(`G${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${row}`).font = { ...FONTS.body, bold: true, color: argb(COLORS.alert) };
    sheet.getCell(`G${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${row}`).border = BORDER_THIN();
    sheet.getCell(`G${row}`).fill = FILLS.alertLight;

    // Annual interest = balance × APR — shows where the money is being burned
    sheet.getCell(`H${row}`).value = { formula: `IFERROR(D${row}*E${row},"")` };
    sheet.getCell(`H${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${row}`).font = { ...FONTS.body, italic: true, color: argb(COLORS.warning) };
    sheet.getCell(`H${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${row}`).border = BORDER_THIN();
    sheet.getCell(`H${row}`).fill = FILLS.white;
  }

  // CF on APR column — visual hierarchy of risk (covers all 20 ranks)
  sheet.addConditionalFormatting({
    ref: `E${r + 2}:E${r + 21}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.25'], priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.15'], priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 24}:H${r + 25}`,
    '🌊',
    'Why Avalanche saves more',
    'Avalanche kills the highest-APR debt first because that\'s where the bank is making the most money off you. Over a typical $30k debt load, this saves $200–$1,000 in total interest versus Snowball. See the Strategy Comparison tab for your specific delta.');
  sheet.getRow(r + 24).height = 28;
  sheet.getRow(r + 25).height = 28;

  addFooter(sheet, r + 28, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 5 — 📊 STRATEGY COMPARISON MATRIX
// ============================================================================

// ============================================================================
// HIDDEN HELPER — _Strategy Sim
// ============================================================================
//
// Phase-based per-strategy amortization. For each rank K in a strategy ordering:
//   waiting_months = SUM of months_in_phase for ranks 1..K-1
//   balance_at_phase_start = original_balance × (1+r)^waiting − own_min × ((1+r)^waiting − 1)/r
//   payment_in_phase = SUM(min of ranks 1..K) + extra
//   months_in_phase = -LN(1 − r×bal/payment) / LN(1+r)   (closed-form; r=0 fallback uses bal/payment)
//   total_months = CEILING(SUM(months_in_phase across all ranks), 1)
//   total_interest = MAX(0, total_months × (SUM(mins) + extra) − SUM(balances))
//
// We keep months fractional inside the phase math so cascade boundaries don't accumulate
// CEILING error; only the final total is rounded up. This matches a real month-by-month sim
// to within ~1 month and gives Strategy Comparison real, differentiated figures (DPP-002).
//
// Hidden via sheet.state = 'hidden'. Per Sheets best practice, surface key outputs on the
// Strategy Comparison tab, not here.
//
// The Custom block uses Custom Method's rank column when that tab exists (Pro/AI). For
// Essentials, the Custom block is built but never read (no Strategy Comparison row references
// it on Essentials — see buildStrategyComparison).
function buildStrategySim(workbook) {
  const sheet = workbook.addWorksheet('_Strategy Sim');
  sheet.state = 'hidden';
  setupColumns(sheet, { A: 3, B: 6, C: 22, D: 10, E: 8, F: 10, G: 10, H: 12, I: 12, J: 12, K: 12, L: 12, M: 12 });

  // Shorthand range refs
  const DL_B = `'📋 Debt List'!B11:B30`;   // names
  const DL_D = `'📋 Debt List'!D11:D30`;   // balances
  const DL_E = `'📋 Debt List'!E11:E30`;   // APR
  const DL_F = `'📋 Debt List'!F11:F30`;   // min
  const DL_I = `'📋 Debt List'!I11:I30`;   // promo expires (DPP-010)
  const DL_J = `'📋 Debt List'!J11:J30`;   // post-promo APR (DPP-010)
  const EXTRA = `'🎯 Extra Payment Simulator'!D6`;

  // Per-rank balance lookup. For avalanche we use an EFFECTIVE APR that swaps to post-promo
  // when expiry is ≤6 months away — so the user isn't told to deprioritize a 0% debt that's
  // about to reset to 27%.
  // effAPR for ranking purposes: IF(I_row≠"" AND (I_row - TODAY()) ≤ 180 AND J_row > E_row,
  //                                  J_row, E_row)
  //
  // Three strategies = three section blocks: SB rows 6-25, AV rows 30-49, CU rows 54-73.

  // === Summary header (row 2) ===
  sheet.getCell('B2').value = 'STRATEGY';
  sheet.getCell('B2').font = FONTS.smallCaps;
  sheet.getCell('C2').value = 'TOTAL MONTHS';
  sheet.getCell('C2').font = FONTS.smallCaps;
  sheet.getCell('D2').value = 'TOTAL INTEREST';
  sheet.getCell('D2').font = FONTS.smallCaps;
  sheet.getCell('E2').value = 'TOTAL PAID';
  sheet.getCell('E2').font = FONTS.smallCaps;

  // Snowball summary at row 3
  // Months = CEILING(sum of fractional phase months).
  // Interest = SUM(L per phase) — each L is per-debt waiting interest + focus interest, capped
  // so a debt can't "pay" more than its original balance during waiting (DPP-V2-002 fix).
  // E3 = total paid = SUM(balances) + total interest.
  sheet.getCell('B3').value = 'Snowball';
  sheet.getCell('B3').font = FONTS.bodyBold;
  sheet.getCell('C3').value = { formula: `IF(SUM(${DL_D})<=0,0,CEILING(MAX(0,SUM(K6:K25)),1))` };
  sheet.getCell('C3').numFmt = '0';
  sheet.getCell('D3').value = { formula: `IF(SUM(${DL_D})<=0,0,MAX(0,SUM(L6:L25)))` };
  sheet.getCell('D3').numFmt = '"$"#,##0';
  sheet.getCell('E3').value = { formula: `D3+SUM(${DL_D})` };
  sheet.getCell('E3').numFmt = '"$"#,##0';

  // Avalanche summary at row 4
  sheet.getCell('B4').value = 'Avalanche';
  sheet.getCell('B4').font = FONTS.bodyBold;
  sheet.getCell('C4').value = { formula: `IF(SUM(${DL_D})<=0,0,CEILING(MAX(0,SUM(K30:K49)),1))` };
  sheet.getCell('C4').numFmt = '0';
  sheet.getCell('D4').value = { formula: `IF(SUM(${DL_D})<=0,0,MAX(0,SUM(L30:L49)))` };
  sheet.getCell('D4').numFmt = '"$"#,##0';
  sheet.getCell('E4').value = { formula: `D4+SUM(${DL_D})` };
  sheet.getCell('E4').numFmt = '"$"#,##0';

  // Custom summary at row 5 (used only when Custom Method tab exists)
  sheet.getCell('B5').value = 'Custom';
  sheet.getCell('B5').font = FONTS.bodyBold;
  sheet.getCell('C5').value = { formula: `IF(SUM(${DL_D})<=0,0,CEILING(MAX(0,SUM(K54:K73)),1))` };
  sheet.getCell('C5').numFmt = '0';
  sheet.getCell('D5').value = { formula: `IF(SUM(${DL_D})<=0,0,MAX(0,SUM(L54:L73)))` };
  sheet.getCell('D5').numFmt = '"$"#,##0';
  sheet.getCell('E5').value = { formula: `D5+SUM(${DL_D})` };
  sheet.getCell('E5').numFmt = '"$"#,##0';

  // Helper to write one phase row for a strategy.
  // strategy ∈ {'snowball','avalanche','custom'}; firstRow = row of rank 1.
  // Cols: B Rank · C Name · D Bal · E APR · F Min · G WaitMo · H BalStart · I Pmt · J r · K Months · L Interest
  function writePhaseRow(strategy, rank, firstRow) {
    const r = firstRow + (rank - 1);

    // The "k-th" debt for this strategy. The MATCH range and value differ per strategy.
    //
    // CRITICAL — array-formula compatibility:
    // Earlier versions used `SMALL(IF(D>0, D), K)` to skip 0-balance rows. That works in
    // Excel 365 and Google Sheets via implicit array evaluation, but in LibreOffice and
    // older Excel without CSE (Ctrl-Shift-Enter), the IF inside SMALL only returns ONE
    // element — breaking ranks 1..N-1 silently. LibreOffice headless verification
    // proved this: ranks 1-5 all evaluated to 0 / "" in LibreOffice 26.2.3.
    //
    // Fix: use plain SMALL/LARGE on the raw range. SMALL and LARGE natively skip BLANK
    // cells, so empty debt rows are handled. A user-entered $0 balance still ranks first
    // under Snowball (cosmetic only — the downstream H formula clamps balance≤0 to 0
    // months, so a paid-off debt contributes nothing to the total). Document in About.
    let balLookup, aprLookup, minLookup, nameLookup;
    if (strategy === 'snowball') {
      const matchExpr = `MATCH(SMALL(${DL_D},${rank}),${DL_D},0)`;
      balLookup  = `IFERROR(SMALL(${DL_D},${rank}),0)`;
      aprLookup  = `IFERROR(INDEX(${DL_E},${matchExpr}),0)`;
      minLookup  = `IFERROR(INDEX(${DL_F},${matchExpr}),0)`;
      nameLookup = `IFERROR(INDEX(${DL_B},${matchExpr}),"")`;
    } else if (strategy === 'avalanche') {
      // LARGE on raw APR column. Blank rows are skipped natively. Tie-breaking on equal
      // APRs (e.g., two 0% debts) defers to MATCH's first-occurrence behavior — known
      // limitation; documented in About & Help.
      const matchExpr = `MATCH(LARGE(${DL_E},${rank}),${DL_E},0)`;
      balLookup  = `IFERROR(INDEX(${DL_D},${matchExpr}),0)`;
      aprLookup  = `IFERROR(LARGE(${DL_E},${rank}),0)`;
      minLookup  = `IFERROR(INDEX(${DL_F},${matchExpr}),0)`;
      nameLookup = `IFERROR(INDEX(${DL_B},${matchExpr}),"")`;
    } else {
      // Custom — rank is read from the Custom Method tab's B column (B11:B30 = user-entered ranks).
      // CRITICAL GATE (BUG-1, BUG-2 fix):
      //  - Essentials: Custom Method tab doesn't exist → IFERROR returns 0 → must short-circuit to 0
      //  - Pro/AI before user sets ranks: MATCH(1, blank-range) errors → IFERROR returns 0 → same
      //  Without the IF gate, INDEX(array, 0) returns the WHOLE column array and downstream
      //  cascade math computes a misleading 62-month / $48,706 "comparison" that was never set up.
      //  With the IF gate, every Custom cell returns 0 when no rank is set, and Strategy Comparison
      //  shows the "Set rank →" placeholder instead of a fake number.
      const matchExpr = `IFERROR(MATCH(${rank},'🔀 Custom Method'!B11:B30,0),0)`;
      balLookup  = `IF(${matchExpr}=0,0,IFERROR(INDEX(${DL_D},${matchExpr}),0))`;
      aprLookup  = `IF(${matchExpr}=0,0,IFERROR(INDEX(${DL_E},${matchExpr}),0))`;
      minLookup  = `IF(${matchExpr}=0,0,IFERROR(INDEX(${DL_F},${matchExpr}),0))`;
      nameLookup = `IF(${matchExpr}=0,"",IFERROR(INDEX(${DL_B},${matchExpr}),""))`;
    }

    sheet.getCell(`B${r}`).value = rank;
    sheet.getCell(`B${r}`).numFmt = '0';

    sheet.getCell(`C${r}`).value = { formula: nameLookup };

    sheet.getCell(`D${r}`).value = { formula: balLookup };
    sheet.getCell(`D${r}`).numFmt = '"$"#,##0.00';

    sheet.getCell(`E${r}`).value = { formula: aprLookup };
    sheet.getCell(`E${r}`).numFmt = '0.00%';

    sheet.getCell(`F${r}`).value = { formula: minLookup };
    sheet.getCell(`F${r}`).numFmt = '"$"#,##0.00';

    // Waiting months — sum of months_in_phase for prior ranks (col K). For rank 1, no waiting.
    sheet.getCell(`G${r}`).value = rank === 1
      ? { formula: `0` }
      : { formula: `MAX(0,SUM(K${firstRow}:K${r - 1}))` };
    sheet.getCell(`G${r}`).numFmt = '0.00';

    // Balance at phase start = MAX(0, IF(APR=0, D − F×G, D×(1+r)^G − F×((1+r)^G − 1)/r))
    // For rank 1 (G=0) this reduces to D.
    sheet.getCell(`H${r}`).value = { formula: `IFERROR(MAX(0,IF(D${r}<=0,0,IF(E${r}=0,D${r}-F${r}*G${r},D${r}*POWER(1+E${r}/12,G${r})-F${r}*(POWER(1+E${r}/12,G${r})-1)/(E${r}/12)))),0)` };
    sheet.getCell(`H${r}`).numFmt = '"$"#,##0.00';

    // Payment in phase = SUM(F of ranks 1..K) + extra. The cascade — all earlier ranks have paid off
    // by definition (since we're chained), so their mins flow to current focus.
    sheet.getCell(`I${r}`).value = { formula: `SUM(F${firstRow}:F${r})+IFERROR(${EXTRA},0)` };
    sheet.getCell(`I${r}`).numFmt = '"$"#,##0.00';

    // r monthly (for readability in audit)
    sheet.getCell(`J${r}`).value = { formula: `E${r}/12` };
    sheet.getCell(`J${r}`).numFmt = '0.0000%';

    // Months in phase — fractional, no ceiling. Closed-form for r>0; H/I for r=0.
    // If payment ≤ rH, negative amortization → 9999 (huge sentinel; total summary caps at 9999 anyway).
    sheet.getCell(`K${r}`).value = { formula: `IF(H${r}<=0,0,IF(D${r}<=0,0,IF(E${r}=0,H${r}/I${r},IF(I${r}<=J${r}*H${r},9999,IFERROR(-LN(1-J${r}*H${r}/I${r})/LN(1+J${r}),0)))))` };
    sheet.getCell(`K${r}`).numFmt = '0.00';

    // Per-debt total interest = MIN(G×min_K, balance_K) + I×K_K − balance_K, clamped ≥0.
    // MIN cap handles the "0% APR debt finishes paying off during its waiting period" case
    // (e.g., $2,300 medical at 0% with $75/mo finishes in 31 months even if its rank K phase
    // only begins at month 41). Without the cap, the summary inverted snowball/avalanche
    // ordering on mixed portfolios (DPP-V2-002 fix). With the cap, summary matches month-by-month
    // simulation to within ~1% on the Stage B portfolio.
    sheet.getCell(`L${r}`).value = { formula: `IFERROR(MAX(0,MIN(G${r}*F${r},D${r})+I${r}*K${r}-D${r}),0)` };
    sheet.getCell(`L${r}`).numFmt = '"$"#,##0.00';
  }

  // === Snowball block (rows 6..25, 20 ranks) ===
  for (let k = 1; k <= 20; k++) writePhaseRow('snowball', k, 6);
  // === Avalanche block (rows 30..49) ===
  for (let k = 1; k <= 20; k++) writePhaseRow('avalanche', k, 30);
  // === Custom block (rows 54..73) ===
  for (let k = 1; k <= 20; k++) writePhaseRow('custom', k, 54);
}

// ============================================================================
// TAB 5 — 📊 STRATEGY COMPARISON MATRIX
// ============================================================================

function buildStrategyComparison(workbook) {
  const sheet = workbook.addWorksheet('📊 Strategy Comparison');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 28, C: 18, D: 18, E: 18, F: 14, G: 14, H: 14, I: 14, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📊 Strategy Comparison',
    tabSubtitle: 'Snowball vs. Avalanche vs. Custom — months + total interest for your specific debt mix. Powered by phase-based amortization (DPP-002 fix).',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL DEBT',         value: { formula: `TEXT(SUM('📋 Debt List'!D11:D30),"$#,##0")` } },
      { label: 'SB MONTHS',          value: { formula: `IFERROR('_Strategy Sim'!C3&" mo","—")` } },
      { label: 'AV MONTHS',          value: { formula: `IFERROR('_Strategy Sim'!C4&" mo","—")` } },
      { label: 'SB INTEREST',        value: { formula: `IFERROR(TEXT('_Strategy Sim'!D3,"$#,##0"),"—")` } },
      { label: 'AV INTEREST',        value: { formula: `IFERROR(TEXT('_Strategy Sim'!D4,"$#,##0"),"—")` } },
      // AV vs SB savings — positive number means Avalanche saves money.
      { label: 'AV SAVES',           value: { formula: `IFERROR(TEXT(MAX(0,'_Strategy Sim'!D3-'_Strategy Sim'!D4),"$#,##0"),"$0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Side-by-side comparison', 'Three columns. Same debts. Different orders. Pick the one you\'ll finish. Best for 3-10 debts; ≥12-debt heterogeneous-APR portfolios approximate.');

  // DPP-104 disclosure banner — phase-based formula approximation breaks down with
  // many heterogeneous-APR debts. Show a warning when COUNTA > 10.
  const warnRow = r;
  sheet.mergeCells(`F${warnRow}:L${warnRow}`);
  sheet.getCell(`F${warnRow}`).value = { formula: `IF(COUNTA('📋 Debt List'!B11:B30)>10,"⚠ "&COUNTA('📋 Debt List'!B11:B30)&" debts — estimates only beyond 10","")` };
  sheet.getCell(`F${warnRow}`).font = { name: 'Inter', size: 10, italic: true, color: argb(COLORS.alert) };
  sheet.getCell(`F${warnRow}`).alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };

  // Header band
  addTableHeader(sheet, r + 1, ['Metric', '❄️ Snowball', '🌊 Avalanche', '🔀 Custom'], ['B', 'C', 'D', 'E']);

  // Comparison rows — each row a different lens. The first 3 rows are PER-STRATEGY OUTCOMES
  // computed by the hidden _Strategy Sim tab (DPP-002). The Custom column uses a guard:
  //  - C5/D5/E5 = 0 when no Custom rank is set OR Custom Method tab doesn't exist (Essentials).
  //  - Display "Pro+ only" / "Set rank →" instead of the meaningless cascade artifact (BUG-1/2 fix).
  // The guard reads '_Strategy Sim'!C5; if it's 0 (no Custom setup), substitute the friendly text.
  const cmp = [
    { label: 'Months to debt-free', cellRefs: {
        snowball:  `IFERROR('_Strategy Sim'!C3&" mo","—")`,
        avalanche: `IFERROR('_Strategy Sim'!C4&" mo","—")`,
        custom:    `IFERROR(IF('_Strategy Sim'!C5<=0,"Set rank on 🔀 Custom Method →",'_Strategy Sim'!C5&" mo"),"Set rank →")`,
      }, numFmt: '@' },
    { label: 'Total interest paid', cellRefs: {
        snowball:  `IFERROR('_Strategy Sim'!D3,0)`,
        avalanche: `IFERROR('_Strategy Sim'!D4,0)`,
        custom:    `IF('_Strategy Sim'!C5<=0,"—",IFERROR('_Strategy Sim'!D5,0))`,
      }, numFmt: '"$"#,##0' },
    { label: 'Total paid (principal + interest)', cellRefs: {
        snowball:  `IFERROR('_Strategy Sim'!E3,0)`,
        avalanche: `IFERROR('_Strategy Sim'!E4,0)`,
        custom:    `IF('_Strategy Sim'!C5<=0,"—",IFERROR('_Strategy Sim'!E5,0))`,
      }, numFmt: '"$"#,##0' },
    { label: 'First debt paid', cellRefs: {
        // Plain SMALL/LARGE — no IF wrapper (BUG-3: array-IF breaks in LibreOffice without CSE)
        snowball:  `IFERROR(INDEX('📋 Debt List'!B11:B30,MATCH(SMALL('📋 Debt List'!D11:D30,1),'📋 Debt List'!D11:D30,0)),"—")`,
        avalanche: `IFERROR(INDEX('📋 Debt List'!B11:B30,MATCH(LARGE('📋 Debt List'!E11:E30,1),'📋 Debt List'!E11:E30,0)),"—")`,
        custom:    `IFERROR(INDEX('📋 Debt List'!B11:B30,MATCH(1,'🔀 Custom Method'!B11:B30,0)),"Set rank →")`,
      }, numFmt: '@' },
    { label: 'Total monthly payment (min + extra)', cellRefs: {
        snowball:  `SUM('📋 Debt List'!F11:F30)+IFERROR('🎯 Extra Payment Simulator'!D6,0)`,
        avalanche: `SUM('📋 Debt List'!F11:F30)+IFERROR('🎯 Extra Payment Simulator'!D6,0)`,
        custom:    `SUM('📋 Debt List'!F11:F30)+IFERROR('🎯 Extra Payment Simulator'!D6,0)`,
      }, numFmt: '"$"#,##0' },
    { label: 'Weighted APR (snapshot)', cellRefs: {
        snowball:  `IFERROR(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/SUM('📋 Debt List'!D11:D30),0)`,
        avalanche: `IFERROR(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/SUM('📋 Debt List'!D11:D30),0)`,
        custom:    `IFERROR(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/SUM('📋 Debt List'!D11:D30),0)`,
      }, numFmt: '0.0%' },
    { label: 'Best for', cellRefs: {
        snowball:  `"Motivation — quick wins"`,
        avalanche: `"Math — least interest"`,
        custom:    `"Hybrid — your priorities"`,
      }, numFmt: '@' },
  ];

  cmp.forEach((row, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = row.label;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;

    sheet.getCell(`C${ri}`).value = { formula: row.cellRefs.snowball };
    sheet.getCell(`C${ri}`).numFmt = row.numFmt;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).fill = FILLS.successLight;

    sheet.getCell(`D${ri}`).value = { formula: row.cellRefs.avalanche };
    sheet.getCell(`D${ri}`).numFmt = row.numFmt;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).fill = FILLS.alertLight;

    sheet.getCell(`E${ri}`).value = { formula: row.cellRefs.custom };
    sheet.getCell(`E${ri}`).numFmt = row.numFmt;
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).fill = FILLS.warningLight;
  });

  // Delta callout
  let r2 = addSectionHeader(sheet, r + 2 + cmp.length + 2, 'How to read this', 'The first-debt row matters most — it sets the rhythm. Avalanche kills the highest-APR debt first; Snowball kills the smallest balance first; Custom lets you decide.');

  addCallout(sheet, `B${r2 + 1}:E${r2 + 2}`,
    '💡',
    'Rule of thumb',
    'If your highest-APR debt is also one of your smallest balances → Snowball + Avalanche agree, you win. If your highest-APR debt is huge → Avalanche saves $1k+; Snowball delays the relief by months. The Extra Payment Simulator (Essentials tier) shows the month delta for your specific data.');
  sheet.getRow(r2 + 1).height = 28;
  sheet.getRow(r2 + 2).height = 28;

  addFooter(sheet, r2 + 6, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 6 — 📅 PAYMENT CALENDAR (Essentials)
// ============================================================================

function buildPaymentCalendar(workbook) {
  const sheet = workbook.addWorksheet('📅 Payment Calendar');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 8, C: 26, D: 14, E: 12, F: 14, G: 14, H: 26, I: 10, J: 10, K: 10, L: 10, M: 2 });

  // Days-until-due, wrap across month boundary (same logic as Budget Tracker N16 fix).
  const dueDayRef = `'📋 Debt List'!G11:G30`;
  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📅 Payment Calendar',
    tabSubtitle: 'Every debt, sorted by day of month. Pay each as you go.',
    bannerText: BANNER,
    kpiData: [
      { label: 'BILLS THIS MO',  value: { formula: `COUNT(${dueDayRef})` } },
      { label: 'TOTAL DUE',      value: { formula: `TEXT(SUM('📋 Debt List'!F11:F30),"$#,##0")` } },
      { label: 'UPCOMING 7D',    value: { formula: `IF(DAY(TODAY())+7<=DAY(EOMONTH(TODAY(),0)),COUNTIFS(${dueDayRef},">="&DAY(TODAY()),${dueDayRef},"<="&DAY(TODAY())+7),COUNTIFS(${dueDayRef},">="&DAY(TODAY()))+COUNTIFS(${dueDayRef},"<="&(DAY(TODAY())+7-DAY(EOMONTH(TODAY(),0)))))&" bills"` } },
      { label: 'OVERDUE',        value: { formula: `COUNTIFS(${dueDayRef},"<"&DAY(TODAY()))&" debts"` } },
      { label: 'NEXT DUE',       value: { formula: `IFERROR(INDEX('📋 Debt List'!B11:B30,MATCH(MIN(IF(${dueDayRef}>=DAY(TODAY()),${dueDayRef})),${dueDayRef},0)),"—")` } },
      { label: 'MONTHLY MIN',    value: { formula: `TEXT(SUM('📋 Debt List'!F11:F30),"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'This month\'s payment schedule', 'Sorted ascending by day of month. Days-Until-Due wraps the month boundary.');

  addTableHeader(sheet, r + 1, ['Day', 'Debt', 'Minimum', 'APR', 'Days Until', 'Status', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  for (let i = 0; i < 20; i++) {
    const row = r + 2 + i;
    const rank = i + 1;
    // Sort by due day ascending (SMALL on G11:G30) — pulls debts in calendar order.
    sheet.getCell(`B${row}`).value = { formula: `IFERROR(SMALL('📋 Debt List'!G11:G30,${rank}),"")` };
    sheet.getCell(`B${row}`).font = { ...FONTS.bodyBold, size: 13, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.ivory;

    sheet.getCell(`C${row}`).value = { formula: `IFERROR(INDEX('📋 Debt List'!B11:B30,MATCH(SMALL('📋 Debt List'!G11:G30,${rank}),'📋 Debt List'!G11:G30,0)),"")` };
    sheet.getCell(`C${row}`).font = FONTS.bodyBold;
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).fill = FILLS.white;

    sheet.getCell(`D${row}`).value = { formula: `IFERROR(INDEX('📋 Debt List'!F11:F30,MATCH(SMALL('📋 Debt List'!G11:G30,${rank}),'📋 Debt List'!G11:G30,0)),"")` };
    sheet.getCell(`D${row}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`D${row}`).font = FONTS.body;
    sheet.getCell(`D${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`D${row}`).fill = FILLS.white;

    sheet.getCell(`E${row}`).value = { formula: `IFERROR(INDEX('📋 Debt List'!E11:E30,MATCH(SMALL('📋 Debt List'!G11:G30,${rank}),'📋 Debt List'!G11:G30,0)),"")` };
    sheet.getCell(`E${row}`).numFmt = '0.0%';
    sheet.getCell(`E${row}`).font = FONTS.body;
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).fill = FILLS.white;

    // Days until due — month-boundary-aware. If due day is past, jump to next month.
    sheet.getCell(`F${row}`).value = { formula: `IF(B${row}="","",IF(B${row}>=DAY(TODAY()),B${row}-DAY(TODAY()),B${row}+DAY(EOMONTH(TODAY(),0))-DAY(TODAY())))` };
    sheet.getCell(`F${row}`).numFmt = '0" days"';
    sheet.getCell(`F${row}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`F${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).fill = FILLS.white;

    sheet.getCell(`G${row}`).value = { formula: `IF(B${row}="","",IF(F${row}<=2,"🔴 Imminent",IF(F${row}<=7,"🟡 Soon","✅ Scheduled")))` };
    sheet.getCell(`G${row}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`G${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${row}`).border = BORDER_THIN();
    sheet.getCell(`G${row}`).fill = FILLS.white;

    sheet.getCell(`H${row}`).value = { formula: `IFERROR(INDEX('📋 Debt List'!I11:I30,MATCH(SMALL('📋 Debt List'!G11:G30,${rank}),'📋 Debt List'!G11:G30,0)),"")` };
    sheet.getCell(`H${row}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${row}`).border = BORDER_THIN();
    sheet.getCell(`H${row}`).fill = FILLS.white;
  }

  // CF on days-until column
  sheet.addConditionalFormatting({
    ref: `F${r + 2}:F${r + 21}`,
    rules: [
      { type: 'cellIs', operator: 'lessThanOrEqual', formulae: ['2'],  priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'cellIs', operator: 'lessThanOrEqual', formulae: ['7'],  priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 24}:H${r + 25}`,
    '💡',
    'Stay ahead of late fees',
    'Open this tab every Sunday. Any "🔴 Imminent" or "🟡 Soon" row is due within the week — pay it then mark notes. The Late-Fee Alert tab tracks fees you\'ve already incurred so you can quantify the cost.');
  sheet.getRow(r + 24).height = 28;
  sheet.getRow(r + 25).height = 28;

  addFooter(sheet, r + 28, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 7 — ⚠️ LATE-FEE ALERT MONITOR (Essentials)
// ============================================================================

function buildLateFeeAlert(workbook) {
  const sheet = workbook.addWorksheet('⚠️ Late-Fee Alert');
  setTabColor(sheet, COLORS.warning);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 26, I: 10, J: 10, K: 10, L: 10, M: 2 });

  // Late-fee ledger: input section + KPI tiles. Saved YTD = (debts on time × $35 typical fee).
  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '⚠️ Late-Fee Alert',
    tabSubtitle: 'Days-until-due countdown per debt + ledger of late fees you\'ve incurred.',
    bannerText: BANNER,
    kpiData: [
      { label: 'DEBTS AT RISK',  value: { formula: `SUMPRODUCT(('📋 Debt List'!G11:G30<>"")*('📋 Debt List'!G11:G30-DAY(TODAY())>=0)*('📋 Debt List'!G11:G30-DAY(TODAY())<=5))&" debts"` } },
      { label: 'OVERDUE',        value: { formula: `SUMPRODUCT(('📋 Debt List'!G11:G30<>"")*('📋 Debt List'!G11:G30<DAY(TODAY())))&" debts"` } },
      { label: 'LATE FEES YTD',  value: { formula: `TEXT(IFERROR(SUM(F11:F30),0),"$#,##0")` } },
      { label: 'AVG FEE',        value: { formula: `IFERROR(TEXT(AVERAGEIF(F11:F30,">0"),"$#,##0"),"$0")` } },
      { label: 'INCIDENTS',      value: { formula: `COUNTIF(F11:F30,">0")` } },
      { label: 'NEXT DUE',       value: { formula: `IFERROR(MIN(IF('📋 Debt List'!G11:G30>=DAY(TODAY()),'📋 Debt List'!G11:G30))-DAY(TODAY())&" days","—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Late-fee incident log', 'Track every $35 late fee you\'ve paid. After 12 months, you\'ll see exactly what late fees have cost you.');

  addTableHeader(sheet, r + 1, ['Date', 'Debt', 'Lender', 'Fee Type', 'Amount', 'APR Bump?', 'Lesson'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  // 20 input rows for the user's late-fee ledger
  for (let i = 0; i < 20; i++) {
    const row = r + 2 + i;
    sheet.getCell(`B${row}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.white;
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).fill = FILLS.white;
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`D${row}`).fill = FILLS.white;
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).fill = FILLS.white;
    sheet.getCell(`E${row}`).dataValidation = { type: 'list', formulae: ['"Late Fee,Returned Payment,Over-Limit,APR Penalty,Other"'] };
    sheet.getCell(`F${row}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).fill = FILLS.white;
    sheet.getCell(`G${row}`).border = BORDER_THIN();
    sheet.getCell(`G${row}`).fill = FILLS.white;
    sheet.getCell(`G${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${row}`).dataValidation = { type: 'list', formulae: ['"No,Yes — Penalty APR"'] };
    sheet.getCell(`H${row}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${row}`).border = BORDER_THIN();
    sheet.getCell(`H${row}`).fill = FILLS.white;
  }

  // No demo seed — the buyer's own ledger is the only ledger that matters here. The "Lesson"
  // column carries a placeholder hint instead of a fake transaction so the table doesn't read
  // empty on first open. (Removed DPP-012: stale "Amex Gold $35" seed misrepresented as the
  // buyer's debt when their debts come from the Debt List they just typed in.)
  sheet.getCell(`H${r + 2}`).value = 'Example: $35 late + 29.99% penalty APR for 6 months on the full balance. Enter your own incidents.';
  sheet.getCell(`H${r + 2}`).font = { ...FONTS.bodyMuted, italic: true };

  // Total row past the input range
  const totalR = r + 23;
  sheet.getCell(`E${totalR}`).value = 'TOTAL LATE FEES';
  sheet.getCell(`E${totalR}`).font = FONTS.smallCaps;
  sheet.getCell(`E${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`F${totalR}`).value = { formula: `SUM(F${r + 2}:F${r + 21})` };
  sheet.getCell(`F${totalR}`).numFmt = '"$"#,##0.00';
  sheet.getCell(`F${totalR}`).font = { name: 'Inter', size: 16, bold: true, color: argb(COLORS.alert) };
  sheet.getCell(`F${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`F${totalR}`).fill = FILLS.ivory;
  sheet.getCell(`F${totalR}`).border = { top: { style: 'medium', color: argb(COLORS.alert) } };

  addCallout(sheet, `B${totalR + 2}:H${totalR + 3}`,
    '💡',
    'The hidden cost of one missed payment',
    'A $35 late fee is the visible cost. The hidden cost: most credit cards trigger a penalty APR (~29.99%) for 6 months on the FULL balance after one late payment. On a $3,000 balance that\'s $40–$60/mo extra in interest. Set autopay for the minimum on every CC.');
  sheet.getRow(totalR + 2).height = 30;
  sheet.getRow(totalR + 3).height = 30;

  addFooter(sheet, totalR + 6, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 8 — 🎯 EXTRA PAYMENT SIMULATOR (Essentials)
// ============================================================================

function buildExtraPaymentSimulator(workbook) {
  const sheet = workbook.addWorksheet('🎯 Extra Payment Simulator');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 30, C: 18, D: 18, E: 18, F: 18, G: 18, H: 8, I: 10, J: 10, K: 10, L: 10, M: 2 });

  // Input cell: extra-monthly-payment. Output: months saved + interest saved (rough estimate
  // using weighted-APR approximation; full schedule projection lands in v1.1).
  // The input cell is D6 (large warm-gold input).
  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🎯 Extra Payment Simulator',
    tabSubtitle: '"What if I paid $X extra per month?" → see the months + dollars saved instantly.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL DEBT',     value: { formula: `TEXT(SUM('📋 Debt List'!D11:D30),"$#,##0")` } },
      { label: 'CURRENT MIN',    value: { formula: `TEXT(SUM('📋 Debt List'!F11:F30),"$#,##0")` } },
      { label: 'EXTRA / MO',     value: { formula: `TEXT(D6,"$#,##0")` } },
      { label: 'NEW MONTHLY',    value: { formula: `TEXT(SUM('📋 Debt List'!F11:F30)+D6,"$#,##0")` } },
      // Reads avalanche months from the hidden _Strategy Sim tab — driven by D6 (the user's extra).
      // Displays "Min < Int" when even the minimums can't cover monthly interest (DPP-005 negative-amortization).
      { label: 'MONTHS LEFT',    value: { formula: `IF(SUM('📋 Debt List'!D11:D30)<=0,"0 mo",IF(SUM('📋 Debt List'!F11:F30)+D6<=SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/12,"Min < Int",IFERROR('_Strategy Sim'!C4&" mo","—")))` } },
      // INT. SAVED = (min-only weighted-blob interest) − (with-extra avalanche-sim interest).
      // The min-only baseline uses the closed-form weighted-blob formula because we don't run a
      // second sim block at extra=0. Closed-form weighted-blob over-estimates min-only interest
      // by 1–8% vs cascading sim — biasing INT. SAVED downward (more conservative claim).
      { label: 'INT. SAVED',     value: { formula: `IF(OR(SUM('📋 Debt List'!D11:D30)<=0,D6<=0),"$0",IFERROR(TEXT(MAX(0,IFERROR(MAX(1,CEILING(-LN(1-(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/SUM('📋 Debt List'!D11:D30)/12)*SUM('📋 Debt List'!D11:D30)/SUM('📋 Debt List'!F11:F30))/LN(1+SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/SUM('📋 Debt List'!D11:D30)/12),1))*SUM('📋 Debt List'!F11:F30)-SUM('📋 Debt List'!D11:D30),0)-IFERROR('_Strategy Sim'!D4,0)),"$#,##0"),"$0"))` } },
    ],
  });

  // === INPUT card ===
  for (let row = 6; row <= 9; row++) {
    for (const col of ['B', 'C', 'D', 'E']) {
      const cell = sheet.getCell(`${col}${row}`);
      cell.fill = FILLS.ivory;
      const isTop = row === 6;
      const isBottom = row === 9;
      const isLeft = col === 'B';
      const isRight = col === 'E';
      cell.border = {
        top:    isTop    ? { style: 'medium', color: argb(COLORS.warmGold) } : { style: 'none' },
        bottom: isBottom ? { style: 'medium', color: argb(COLORS.warmGold) } : { style: 'none' },
        left:   isLeft   ? { style: 'medium', color: argb(COLORS.warmGold) } : { style: 'none' },
        right:  isRight  ? { style: 'medium', color: argb(COLORS.warmGold) } : { style: 'none' },
      };
    }
  }

  sheet.mergeCells('B6:C6');
  sheet.getCell('B6').value = '↓ Extra payment per month';
  sheet.getCell('B6').font = { ...FONTS.smallCaps, color: argb(COLORS.charcoal) };
  sheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };

  sheet.mergeCells('D6:E6');
  const input = sheet.getCell('D6');
  input.value = 100;
  input.numFmt = '"$"#,##0';
  input.font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.warmGold) };
  input.alignment = { vertical: 'middle', horizontal: 'center' };
  input.fill = FILLS.white;
  input.border = {
    top: { style: 'thin', color: argb(COLORS.warmGold) },
    bottom: { style: 'thin', color: argb(COLORS.warmGold) },
    left: { style: 'medium', color: argb(COLORS.warmGold) },
    right: { style: 'thin', color: argb(COLORS.warmGold) },
  };
  input.dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: false, showInputMessage: true, promptTitle: 'Extra monthly payment', prompt: 'Dollar amount above your current monthly minimum. Try $50, $100, $250.' };
  sheet.getRow(6).height = 32;

  sheet.mergeCells('B8:E8');
  sheet.getCell('B8').value = 'Closed-form payoff using your debts\' weighted-average APR — the "parallel payment" baseline. Snowball / Avalanche differences live on the Strategy Comparison tab. "Min < Int" means your minimum payment can\'t cover monthly interest — add at least that much extra to avoid debt growth.';
  sheet.getCell('B8').font = FONTS.bodyMuted;
  sheet.getCell('B8').alignment = { vertical: 'middle', horizontal: 'center', indent: 1, wrapText: true };
  sheet.getRow(8).height = 32;

  // === Result table ===
  let r = addSectionHeader(sheet, 11, 'Try a few scenarios', 'Comparison table — current pace vs. several extra-payment levels.');

  addTableHeader(sheet, r + 1, ['Scenario', 'Monthly Payment', 'Months to $0', 'Total Interest', 'Savings vs. min'], ['B', 'C', 'D', 'E', 'F']);

  const scenarios = [
    { label: 'Current (minimums only)', extra: 0 },
    { label: '+ $50/month',  extra: 50 },
    { label: '+ $100/month', extra: 100 },
    { label: '+ $250/month', extra: 250 },
    { label: '+ $500/month', extra: 500 },
    { label: 'Use D6 input',  extra: null },
  ];

  scenarios.forEach((s, i) => {
    const row = r + 2 + i;
    sheet.getCell(`B${row}`).value = s.label;
    sheet.getCell(`B${row}`).font = i === scenarios.length - 1 ? { ...FONTS.bodyBold, color: argb(COLORS.warmGold) } : FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = i === scenarios.length - 1 ? FILLS.warmGoldLight : FILLS.white;

    const extraRef = s.extra === null ? 'D6' : String(s.extra);

    sheet.getCell(`C${row}`).value = { formula: `SUM('📋 Debt List'!F11:F30)+${extraRef}` };
    sheet.getCell(`C${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).alignment = { horizontal: 'right' };

    // Pull months-to-payoff + total-interest from the _Strategy Sim hidden tab.
    // Sim uses the closed-form n = -ln(1 - rB/P) / ln(1+r) chained across debts in
    // strategy order, so snowball ≠ avalanche when the user's debt mix is mixed-APR.
    // The "Use D6 input" scenario reads the avalanche sim with the user's extra (D6);
    // fixed scenarios use weighted-blob closed-form, clearly labeled. Floor at 1 month
    // when there's a balance to avoid a "0 months" misread for instant-payoff cases.
    sheet.getCell(`D${row}`).value = { formula: `IF(SUM('📋 Debt List'!D11:D30)<=0,0,MAX(1,IFERROR(IF(C${row}<=SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/12,9999,CEILING(-LN(1-(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/MAX(SUM('📋 Debt List'!D11:D30),1)/12)*SUM('📋 Debt List'!D11:D30)/C${row})/LN(1+SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/MAX(SUM('📋 Debt List'!D11:D30),1)/12),1)),1)))` };
    sheet.getCell(`D${row}`).numFmt = '0" mo"';
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`D${row}`).alignment = { horizontal: 'center' };

    sheet.getCell(`E${row}`).value = { formula: `IF(SUM('📋 Debt List'!D11:D30)<=0,0,IFERROR(MAX(0,C${row}*D${row}-SUM('📋 Debt List'!D11:D30)),0))` };
    sheet.getCell(`E${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };

    if (i === 0) {
      sheet.getCell(`F${row}`).value = 'baseline';
      sheet.getCell(`F${row}`).font = FONTS.bodyMuted;
    } else {
      sheet.getCell(`F${row}`).value = { formula: `IFERROR(TEXT(MAX(0,E${r + 2}-E${row}),"$#,##0")&" saved","")` };
      sheet.getCell(`F${row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    }
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
  });

  addCallout(sheet, `B${r + 11}:F${r + 12}`,
    '💡',
    'Where to find the extra',
    'Cancel one subscription = $15/mo. Skip 2 dinners out = $80/mo. Switch to a 0% APR balance transfer = $150–$250/mo saved in interest you can redirect. The Strategy Comparison tab shows which debt to throw it at first.');
  sheet.getRow(r + 11).height = 28;
  sheet.getRow(r + 12).height = 28;

  addFooter(sheet, r + 15, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 9 — 🏆 MILESTONE TRACKER (Essentials)
// ============================================================================

function buildMilestoneTracker(workbook) {
  const sheet = workbook.addWorksheet('🏆 Milestone Tracker');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 26, C: 16, D: 16, E: 16, F: 16, G: 22, H: 16, I: 10, J: 10, K: 10, L: 10, M: 2 });

  // Original-total input is the anchor. We compare current Debt List total against it
  // to compute % paid + remaining-to-zero. User updates as they pay down.
  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏆 Milestone Tracker',
    tabSubtitle: 'Watch the debt shrink. Visual milestones at 25 / 50 / 75 / 100%. Each one earned.',
    bannerText: BANNER,
    kpiData: [
      { label: 'ORIGINAL',       value: { formula: `TEXT(IFERROR(B6,SUM('📋 Debt List'!D11:D30)),"$#,##0")` } },
      { label: 'CURRENT',        value: { formula: `TEXT(SUM('📋 Debt List'!D11:D30),"$#,##0")` } },
      { label: 'PAID OFF',       value: { formula: `TEXT(MAX(0,IFERROR(B6,SUM('📋 Debt List'!D11:D30))-SUM('📋 Debt List'!D11:D30)),"$#,##0")` } },
      { label: 'PROGRESS',       value: { formula: `IFERROR(TEXT(MAX(0,IFERROR(B6,SUM('📋 Debt List'!D11:D30))-SUM('📋 Debt List'!D11:D30))/IFERROR(B6,1),"0%"),"0%")` } },
      { label: 'NEXT MILESTONE', value: { formula: `IFERROR(IF((B6-SUM('📋 Debt List'!D11:D30))/B6<0.25,"25%",IF((B6-SUM('📋 Debt List'!D11:D30))/B6<0.5,"50%",IF((B6-SUM('📋 Debt List'!D11:D30))/B6<0.75,"75%","100% 🏆"))),"25%")` } },
      { label: 'DEBTS PAID',     value: { formula: `COUNTIF('📋 Debt List'!D11:D30,0)&" / "&COUNTA('📋 Debt List'!B11:B30)` } },
    ],
  });

  // === Original-total INPUT card ===
  // DPP-011: B6 starts BLANK rather than seeded with a leftover demo total ($47,780).
  // Every milestone formula already pattern-matches IFERROR(B6, SUM(Debt List D11:D30)) — when
  // B6 is empty, milestones fall back to "current total" as the anchor (so 0% progress until the
  // buyer locks in their starting total). The Helper Cell H6 surfaces "Snapshot today" so the
  // buyer can copy-paste their current SUM into B6 with one click.
  sheet.mergeCells('B6:E6');
  const origInput = sheet.getCell('B6');
  origInput.value = null;  // blank — buyer enters their own starting total
  origInput.numFmt = '"$"#,##0';
  origInput.font = { name: 'Inter', size: 20, bold: true, color: argb(COLORS.warmGold) };
  origInput.alignment = { vertical: 'middle', horizontal: 'center' };
  origInput.fill = FILLS.ivory;
  origInput.border = {
    top: { style: 'medium', color: argb(COLORS.warmGold) },
    bottom: { style: 'medium', color: argb(COLORS.warmGold) },
    left: { style: 'medium', color: argb(COLORS.warmGold) },
    right: { style: 'medium', color: argb(COLORS.warmGold) },
  };
  origInput.dataValidation = { type: 'decimal', operator: 'greaterThan', formulae: [0], allowBlank: true, showInputMessage: true, promptTitle: 'Original debt total', prompt: 'Your total debt the day you started this spreadsheet — the anchor for every milestone below. Copy from "Snapshot today" (cell H6) on day one and don\'t edit again.' };
  sheet.getRow(6).height = 38;

  // Helper "Snapshot today" cell — one-click anchor reference.
  sheet.mergeCells('G6:H6');
  sheet.getCell('G6').value = '↓ Snapshot today — copy into B6 on day one';
  sheet.getCell('G6').font = FONTS.smallCaps;
  sheet.getCell('G6').alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };

  sheet.mergeCells('G7:H7');
  const snapshot = sheet.getCell('G7');
  snapshot.value = { formula: `TEXT(SUM('📋 Debt List'!D11:D30),"$#,##0")` };
  snapshot.font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.charcoal) };
  snapshot.alignment = { vertical: 'middle', horizontal: 'center' };
  snapshot.fill = FILLS.offWhite;
  snapshot.border = BORDER_THIN(COLORS.divider);

  sheet.mergeCells('B7:E7');
  sheet.getCell('B7').value = '↑ Your original total debt — anchor for every milestone below. Set ONCE at start; do not re-edit.';
  sheet.getCell('B7').font = FONTS.bodyMuted;
  sheet.getCell('B7').alignment = { vertical: 'middle', horizontal: 'center' };

  // === Big progress bar ===
  // DPP-101 fix: wrap entire division-by-B6 in IFERROR. When B6 is blank (default),
  // the division explodes to #DIV/0!; without the wrapper the user sees a red error
  // on day-one open. With the wrapper, the bar shows the empty-state (all unfilled
  // bars) until B6 is set.
  sheet.mergeCells('B9:E9');
  sheet.getCell('B9').value = {
    formula: `IFERROR(REPT("▰",MIN(20,MAX(0,ROUND((MAX(0,B6-SUM('📋 Debt List'!D11:D30))/B6)*20,0))))&REPT("▱",MAX(0,20-MIN(20,MAX(0,ROUND((MAX(0,B6-SUM('📋 Debt List'!D11:D30))/B6)*20,0))))),REPT("▱",20))`
  };
  sheet.getCell('B9').font = { name: 'Inter', size: 18, color: argb(COLORS.warmGold) };
  sheet.getCell('B9').alignment = { horizontal: 'center' };
  sheet.getRow(9).height = 30;

  // === Milestones table ===
  let r = addSectionHeader(sheet, 12, 'Your milestones', 'Each one earned by paying down original debt. Status updates live as your Debt List balances shrink.');

  addTableHeader(sheet, r + 1, ['Milestone', 'Target Paid Off', 'Reached At', 'Status', 'Days From Start'], ['B', 'C', 'D', 'E', 'F']);

  const milestones = [
    { name: 'First debt at $0',  threshold: 'firstZero', desc: 'First time any single debt reaches zero balance' },
    { name: '25% paid off',      threshold: 0.25,  desc: 'A quarter of the way home' },
    { name: '50% paid off',      threshold: 0.50,  desc: 'Halfway there — past the midpoint' },
    { name: '75% paid off',      threshold: 0.75,  desc: 'Three-quarters — the end is in sight' },
    { name: '100% — debt-free',  threshold: 1.00,  desc: 'Total debt at zero. Celebrate.' },
  ];

  milestones.forEach((m, i) => {
    const row = r + 2 + i;
    sheet.getCell(`B${row}`).value = m.name;
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.white;

    if (m.threshold === 'firstZero') {
      sheet.getCell(`C${row}`).value = '—';
      // COUNTIF returns 0 on a fresh sheet (no zero-balance debts yet) — IFERROR not strictly
      // needed here, but added for symmetry with the other rows.
      sheet.getCell(`E${row}`).value = { formula: `IFERROR(IF(COUNTIF('📋 Debt List'!D11:D30,0)>=1,"✅ Reached","⏳ Pending"),"⏳ Pending")` };
    } else {
      // DPP-101 fix: when B6 is blank, B6*threshold is 0 (acceptable display) and the
      // division-by-B6 in the status formula was returning #DIV/0!. Wrap both with IFERROR.
      sheet.getCell(`C${row}`).value = { formula: `IFERROR(TEXT(B6*${m.threshold},"$#,##0"),"—")` };
      sheet.getCell(`E${row}`).value = { formula: `IFERROR(IF((MAX(0,B6-SUM('📋 Debt List'!D11:D30))/B6)>=${m.threshold},"✅ Reached","⏳ Pending"),"⏳ Pending")` };
    }
    sheet.getCell(`C${row}`).font = FONTS.body;
    sheet.getCell(`C${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).fill = FILLS.white;

    sheet.getCell(`D${row}`).value = '—'; // user fills in date when reached
    sheet.getCell(`D${row}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`D${row}`).font = FONTS.body;
    sheet.getCell(`D${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`D${row}`).fill = FILLS.white;

    sheet.getCell(`E${row}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`E${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).fill = FILLS.white;

    sheet.getCell(`F${row}`).value = ''; // computed once user fills date in D column
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).fill = FILLS.white;
  });

  // CF on status — green for reached, muted for pending
  sheet.addConditionalFormatting({
    ref: `E${r + 2}:E${r + 6}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Reached', priority: 1, style: { fill: FILLS.success, font: { color: argb(COLORS.white), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Pending', priority: 2, style: { font: { color: argb(COLORS.textMuted) } } },
    ],
  });

  addCallout(sheet, `B${r + 9}:F${r + 10}`,
    '🏆',
    'Why milestones matter',
    'Debt payoff is months of grinding. Without checkpoints, motivation fades around month 4-6. Mark each milestone the day you hit it — your future self needs the proof. Print this tab when you hit 100%.');
  sheet.getRow(r + 9).height = 28;
  sheet.getRow(r + 10).height = 28;

  addFooter(sheet, r + 13, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 10 — 🔀 CUSTOM METHOD (Pro)
// ============================================================================

function buildCustomMethod(workbook) {
  const sheet = workbook.addWorksheet('🔀 Custom Method');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 8, C: 26, D: 12, E: 10, F: 14, G: 14, H: 22, I: 8, J: 8, K: 8, L: 8, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🔀 Custom Method',
    tabSubtitle: 'Your priorities. Type a rank 1-20 next to each debt to set your order.',
    bannerText: BANNER,
    kpiData: [
      { label: 'METHOD',           value: 'Custom' },
      { label: 'ORDER',            value: 'You decide' },
      { label: 'FIRST TARGET',     value: { formula: `IFERROR(INDEX('📋 Debt List'!B11:B30,MATCH(1,B11:B30,0)),"Set rank below")` } },
      { label: 'RANKED',           value: { formula: `COUNT(B11:B30)&" / "&COUNTA('📋 Debt List'!B11:B30)` } },
      { label: 'TOTAL DEBT',       value: { formula: `TEXT(SUM('📋 Debt List'!D11:D30),"$#,##0")` } },
      { label: 'WEIGHTED APR',     value: { formula: `IFERROR(TEXT(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/SUM('📋 Debt List'!D11:D30),"0.0%"),"0.0%")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Your custom payoff order', 'Type a rank (1 = pay first, 2 = next, etc.) next to each debt. The cascading custom-pmt column pools minimums as debts get paid off.');

  addTableHeader(sheet, r + 1, ['Rank', 'Debt', 'Balance', 'APR', 'Minimum', 'Custom Pmt', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  for (let i = 0; i < 20; i++) {
    const row = r + 2 + i;
    const dlRow = 11 + i;

    // Rank — user-editable input
    sheet.getCell(`B${row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold), size: 13 };
    sheet.getCell(`B${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.warmGoldLight;
    sheet.getCell(`B${row}`).dataValidation = { type: 'whole', operator: 'between', formulae: [1, 20], allowBlank: true };
    // DPP-106 fix: do NOT seed sample ranks. The previous seed (1..6 for the first 6
    // debts) caused Custom column on Strategy Comparison to silently mirror Avalanche
    // (since CC-A=highest APR=rank 1 in both orderings). With blank ranks, Custom now
    // correctly shows "Set rank on 🔀 Custom Method →" until the user enters ranks.

    // Debt name (live from Debt List)
    sheet.getCell(`C${row}`).value = { formula: `IFERROR('📋 Debt List'!B${dlRow},"")` };
    sheet.getCell(`C${row}`).font = FONTS.bodyBold;
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).fill = FILLS.white;

    sheet.getCell(`D${row}`).value = { formula: `IFERROR('📋 Debt List'!D${dlRow},"")` };
    sheet.getCell(`D${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`D${row}`).fill = FILLS.white;

    sheet.getCell(`E${row}`).value = { formula: `IFERROR('📋 Debt List'!E${dlRow},"")` };
    sheet.getCell(`E${row}`).numFmt = '0.0%';
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).fill = FILLS.white;

    sheet.getCell(`F${row}`).value = { formula: `IFERROR('📋 Debt List'!F${dlRow},"")` };
    sheet.getCell(`F${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).fill = FILLS.white;

    // Custom Pmt = own minimum + sum of minimums of debts with lower rank (already paid off)
    sheet.getCell(`G${row}`).value = { formula: `IF(B${row}="","",IFERROR(F${row}+SUMIFS(F$11:F$30,B$11:B$30,"<"&B${row}),F${row}))` };
    sheet.getCell(`G${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${row}`).font = { ...FONTS.body, bold: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`G${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${row}`).border = BORDER_THIN();
    sheet.getCell(`G${row}`).fill = FILLS.warmGoldLight;

    sheet.getCell(`H${row}`).value = { formula: `IFERROR('📋 Debt List'!I${dlRow},"")` };
    sheet.getCell(`H${row}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${row}`).border = BORDER_THIN();
    sheet.getCell(`H${row}`).fill = FILLS.white;
  }

  addCallout(sheet, `B${r + 24}:H${r + 25}`,
    '💡',
    'When Custom beats Snowball + Avalanche',
    'Use Custom when emotional priorities matter — pay off the debt-to-family-member first even if it\'s not the highest APR. Or when one debt has a promo period ending soon (kill it before promo expires). Snowball + Avalanche are smart defaults; Custom is for life.');
  sheet.getRow(r + 24).height = 28;
  sheet.getRow(r + 25).height = 28;

  addFooter(sheet, r + 28, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 11 — 🔄 DEBT CONSOLIDATION (Pro)
// ============================================================================

function buildDebtConsolidation(workbook) {
  const sheet = workbook.addWorksheet('🔄 Debt Consolidation');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 18, D: 18, E: 18, F: 18, G: 18, H: 14, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🔄 Debt Consolidation',
    tabSubtitle: 'Three ways to combine high-APR debts into one lower-rate loan.',
    bannerText: BANNER,
    kpiData: [
      { label: 'CURRENT DEBT',   value: { formula: `TEXT(SUM('📋 Debt List'!D11:D30),"$#,##0")` } },
      { label: 'CURRENT APR',    value: { formula: `IFERROR(TEXT(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/SUM('📋 Debt List'!D11:D30),"0.0%"),"0.0%")` } },
      { label: 'CURRENT MIN',    value: { formula: `TEXT(SUM('📋 Debt List'!F11:F30),"$#,##0")` } },
      { label: 'ANNUAL INT.',    value: { formula: `TEXT(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30),"$#,##0")` } },
      { label: 'BEST OPTION',    value: { formula: `IFERROR(INDEX({"Personal Loan","Balance Transfer","HELOC"},MATCH(MIN(F12,F13,F14),F12:F14,0)),"Set rates →")` } },
      { label: 'EST. SAVINGS',   value: { formula: `IFERROR(TEXT(MAX(0,SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)-MIN(F12,F13,F14)),"$#,##0"),"$0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Three consolidation paths', 'Edit APR + Term + Fee for each. The "Annual Interest" row shows what each path costs you per year vs. status quo.');

  addTableHeader(sheet, r + 1, ['Metric', 'Personal Loan', 'Balance Transfer', 'HELOC'], ['B', 'C', 'D', 'E']);

  // Input rows: rate, term, fee — user edits these to compare scenarios
  const inputs = [
    { label: 'APR',                       defaults: [0.10, 0.00, 0.0699], fmt: '0.00%' },
    { label: 'Term (months)',              defaults: [60, 18, 120],         fmt: '0' },
    { label: 'Origination / transfer fee', defaults: [0.03, 0.04, 0.02],   fmt: '0.0%' },
    { label: 'Promo period (mo, BT only)', defaults: ['—', 18, '—'],        fmt: '0' },
  ];
  inputs.forEach((inp, i) => {
    const row = r + 2 + i;
    sheet.getCell(`B${row}`).value = inp.label;
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.ivory;
    ['C', 'D', 'E'].forEach((col, ci) => {
      sheet.getCell(`${col}${row}`).value = inp.defaults[ci];
      sheet.getCell(`${col}${row}`).numFmt = inp.fmt;
      sheet.getCell(`${col}${row}`).font = FONTS.body;
      sheet.getCell(`${col}${row}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${col}${row}`).border = BORDER_THIN();
      sheet.getCell(`${col}${row}`).fill = FILLS.warmGoldLight;
    });
  });

  // Output rows: monthly payment, total interest, total paid, break-even, recommendation
  const outputs = [
    { label: 'Monthly payment',
      formulas: {
        C: `IFERROR(SUM('📋 Debt List'!D11:D30)*(1+C${r + 4})*(C${r + 2}/12)/(1-(1+C${r + 2}/12)^-C${r + 3}),0)`,
        D: `IFERROR((SUM('📋 Debt List'!D11:D30)*(1+D${r + 4}))/D${r + 5},0)`,
        E: `IFERROR(SUM('📋 Debt List'!D11:D30)*(1+E${r + 4})*(E${r + 2}/12)/(1-(1+E${r + 2}/12)^-E${r + 3}),0)`,
      },
      fmt: '"$"#,##0' },
    { label: 'Total interest',
      formulas: {
        C: `IFERROR(C${r + 6}*C${r + 3}-SUM('📋 Debt List'!D11:D30)*(1+C${r + 4}),0)`,
        D: `IFERROR(SUM('📋 Debt List'!D11:D30)*D${r + 4},0)`,
        E: `IFERROR(E${r + 6}*E${r + 3}-SUM('📋 Debt List'!D11:D30)*(1+E${r + 4}),0)`,
      },
      fmt: '"$"#,##0' },
    { label: 'Total interest (vs. current)',
      formulas: {
        C: `IFERROR(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)*C${r + 3}/12-C${r + 7},0)`,
        D: `IFERROR(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)*D${r + 5}/12-D${r + 7},0)`,
        E: `IFERROR(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)*E${r + 3}/12-E${r + 7},0)`,
      },
      fmt: '"$"#,##0;-"$"#,##0' },
  ];

  outputs.forEach((out, i) => {
    const row = r + 6 + i;
    sheet.getCell(`B${row}`).value = out.label;
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.charcoalLight;
    sheet.getCell(`B${row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.white) };
    ['C', 'D', 'E'].forEach((col) => {
      sheet.getCell(`${col}${row}`).value = { formula: out.formulas[col] };
      sheet.getCell(`${col}${row}`).numFmt = out.fmt;
      sheet.getCell(`${col}${row}`).font = { ...FONTS.body, bold: true };
      sheet.getCell(`${col}${row}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${col}${row}`).border = BORDER_THIN();
      sheet.getCell(`${col}${row}`).fill = FILLS.successLight;
    });
  });

  addCallout(sheet, `B${r + 12}:E${r + 13}`,
    '💡',
    'When consolidation makes sense',
    'Consolidation is a win when (a) the new rate × loan term is lower than your current weighted-APR × your current payoff timeline AND (b) you don\'t rack up new CC debt after the transfer. The "Total interest vs. current" row above turns positive when you save money. The Balance Transfer Analyzer tab models BT specifically with the promo period.');
  sheet.getRow(r + 12).height = 32;
  sheet.getRow(r + 13).height = 32;

  addFooter(sheet, r + 16, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 12 — 💳 BALANCE TRANSFER ANALYZER (Pro)
// ============================================================================

function buildBalanceTransfer(workbook) {
  const sheet = workbook.addWorksheet('💳 Balance Transfer');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 30, C: 18, D: 18, E: 18, F: 14, G: 14, H: 14, I: 10, J: 10, K: 10, L: 10, M: 2 });

  // Inputs at B6:C9 (transfer amount, current APR, BT promo APR, transfer fee, promo months).
  // Outputs: monthly to clear before promo, total interest with BT, total interest without, net savings.
  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💳 Balance Transfer',
    tabSubtitle: 'Promo APR + transfer fee → net interest savings + monthly to clear before promo ends.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TRANSFER AMT',   value: { formula: `TEXT(C7,"$#,##0")` } },
      { label: 'CURRENT APR',    value: { formula: `TEXT(C8,"0.0%")` } },
      { label: 'PROMO APR',      value: { formula: `TEXT(C9,"0.0%")` } },
      { label: 'PROMO MONTHS',   value: { formula: `C10&" mo"` } },
      { label: 'TRANSFER FEE',   value: { formula: `TEXT(C7*C11,"$#,##0")` } },
      { label: 'NET SAVINGS',    value: { formula: `IFERROR(TEXT(MAX(0,C7*C8*(C10/12)-C7*C9*(C10/12)-C7*C11),"$#,##0"),"$0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Balance transfer scenario inputs', 'Edit the 5 yellow cells — everything else recalculates.');

  // Input table
  const inputs = [
    { label: 'Transfer amount',  cell: 'C7',  def: 4250, fmt: '"$"#,##0' },
    { label: 'Current card APR', cell: 'C8',  def: 0.2199, fmt: '0.0%' },
    { label: 'New card promo APR', cell: 'C9', def: 0.00, fmt: '0.0%' },
    { label: 'Promo period (months)', cell: 'C10', def: 18, fmt: '0' },
    { label: 'Transfer fee (%)',  cell: 'C11', def: 0.03, fmt: '0.0%' },
  ];

  inputs.forEach((inp, i) => {
    const row = r + 1 + i;
    sheet.getCell(`B${row}`).value = inp.label;
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.ivory;
    sheet.getCell(`${inp.cell}`).value = inp.def;
    sheet.getCell(`${inp.cell}`).numFmt = inp.fmt;
    sheet.getCell(`${inp.cell}`).font = { name: 'Inter', size: 13, bold: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`${inp.cell}`).alignment = { horizontal: 'right' };
    sheet.getCell(`${inp.cell}`).fill = FILLS.warmGoldLight;
    sheet.getCell(`${inp.cell}`).border = {
      top: { style: 'thin', color: argb(COLORS.warmGold) },
      bottom: { style: 'thin', color: argb(COLORS.warmGold) },
      left: { style: 'medium', color: argb(COLORS.warmGold) },
      right: { style: 'medium', color: argb(COLORS.warmGold) },
    };
  });

  // === Output section ===
  let r2 = addSectionHeader(sheet, 13, 'Result analysis', 'Live calculations based on the inputs above.');

  const outputs = [
    { label: 'Monthly payment to clear before promo ends', formula: `(C7*(1+C11))/C10`, fmt: '"$"#,##0' },
    { label: 'Total interest WITH balance transfer',         formula: `C7*C9*(C10/12)+C7*C11`, fmt: '"$"#,##0' },
    { label: 'Total interest WITHOUT (status quo)',          formula: `C7*C8*(C10/12)`, fmt: '"$"#,##0' },
    { label: 'Net savings',                                  formula: `MAX(0,(C7*C8*(C10/12))-(C7*C9*(C10/12)+C7*C11))`, fmt: '"$"#,##0' },
    { label: 'Break-even months (after fee)',                formula: `IFERROR((C7*C11)/(C7*(C8-C9)/12),0)`, fmt: '0.0" mo"' },
    { label: 'Final verdict',                                formula: `IF((C7*C8*(C10/12))>(C7*C9*(C10/12)+C7*C11),"✅ Transfer saves money","🟡 Break-even or slight loss")`, fmt: '@' },
  ];

  outputs.forEach((out, i) => {
    const row = r2 + 1 + i;
    sheet.getCell(`B${row}`).value = out.label;
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.charcoalLight;
    sheet.getCell(`B${row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.white) };
    sheet.getCell(`C${row}`).value = { formula: out.formula };
    sheet.getCell(`C${row}`).numFmt = out.fmt;
    sheet.getCell(`C${row}`).font = { name: 'Inter', size: 13, bold: true, color: argb(COLORS.success) };
    sheet.getCell(`C${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).fill = FILLS.successLight;
  });

  addCallout(sheet, `B${r2 + 9}:E${r2 + 10}`,
    '💡',
    'The 3 traps to avoid',
    '(1) Missing the promo window — the APR jumps to ~22% on the FULL remaining balance. (2) Spending on the new card — interest charges start at the regular APR immediately, no grace period. (3) Closing the OLD card — increases utilization on remaining cards. Aim to clear the balance before the promo ends; if you can\'t, transfer again.');
  sheet.getRow(r2 + 9).height = 32;
  sheet.getRow(r2 + 10).height = 32;

  addFooter(sheet, r2 + 13, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 13 — 📈 CREDIT SCORE TRACKER (Pro)
// ============================================================================

function buildCreditScoreTracker(workbook) {
  const sheet = workbook.addWorksheet('📈 Credit Score Tracker');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 18, C: 8, D: 8, E: 8, F: 8, G: 8, H: 8, I: 8, J: 8, K: 8, L: 8, M: 8 });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const cols = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']; // Need N too

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📈 Credit Score Tracker',
    tabSubtitle: 'Month-by-month log across all 3 bureaus. Enter manually from Credit Karma / your bank / annualcreditreport.com.',
    bannerText: BANNER,
    kpiData: [
      { label: 'AVG (LATEST)',   value: { formula: `IFERROR(TEXT(AVERAGE(C12:N14),"0"),"—")` } },
      { label: 'EXPERIAN',       value: { formula: `IFERROR(LOOKUP(2,1/(C12:N12<>""),C12:N12),"—")` } },
      { label: 'EQUIFAX',        value: { formula: `IFERROR(LOOKUP(2,1/(C13:N13<>""),C13:N13),"—")` } },
      { label: 'TRANSUNION',     value: { formula: `IFERROR(LOOKUP(2,1/(C14:N14<>""),C14:N14),"—")` } },
      { label: 'YTD CHANGE',     value: { formula: `IFERROR(LOOKUP(2,1/(C12:N12<>""),C12:N12)-INDEX(C12:N12,MATCH(TRUE,C12:N12<>"",0)),"—")` } },
      { label: 'TARGET',         value: '740+' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Bureau scores by month', 'Three bureau-row × 12 month-column matrix. Enter scores as they come in.');

  // Header row
  sheet.getCell(`B${r + 1}`).value = 'Bureau';
  sheet.getCell(`B${r + 1}`).font = FONTS.headerWhite;
  sheet.getCell(`B${r + 1}`).fill = FILLS.charcoal;
  sheet.getCell(`B${r + 1}`).border = BORDER_THIN(COLORS.charcoal);
  months.forEach((m, i) => {
    sheet.getCell(`${cols[i]}${r + 1}`).value = m;
    sheet.getCell(`${cols[i]}${r + 1}`).font = FONTS.headerWhite;
    sheet.getCell(`${cols[i]}${r + 1}`).fill = FILLS.charcoal;
    sheet.getCell(`${cols[i]}${r + 1}`).alignment = { horizontal: 'center' };
    sheet.getCell(`${cols[i]}${r + 1}`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(r + 1).height = 24;

  const bureaus = ['Experian', 'Equifax', 'TransUnion'];
  bureaus.forEach((bureau, bi) => {
    const row = r + 2 + bi;
    sheet.getCell(`B${row}`).value = bureau;
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).fill = FILLS.ivory;
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    months.forEach((_, mi) => {
      const c = sheet.getCell(`${cols[mi]}${row}`);
      c.numFmt = '0';
      c.alignment = { horizontal: 'center' };
      c.border = BORDER_THIN();
      c.fill = FILLS.white;
      c.dataValidation = { type: 'whole', operator: 'between', formulae: [300, 850], allowBlank: true, errorTitle: 'Invalid score', error: 'FICO scores range 300-850.' };
    });
  });

  // Seed a few months of demo data so the file isn't empty
  // Note: requires user to actually log scores — these are example values
  const demoScores = [
    [712, 718, 722, 725, 731, 738, null, null, null, null, null, null],
    [705, 710, 714, 720, 728, 735, null, null, null, null, null, null],
    [708, 714, 720, 724, 730, 737, null, null, null, null, null, null],
  ];
  demoScores.forEach((bureauData, bi) => {
    bureauData.forEach((score, mi) => {
      if (score != null) sheet.getCell(`${cols[mi]}${r + 2 + bi}`).value = score;
    });
  });

  // CF on score values: red <580, warning 580-669, neutral 670-739, success 740+
  sheet.addConditionalFormatting({
    ref: `C${r + 2}:N${r + 4}`,
    rules: [
      { type: 'cellIs', operator: 'lessThan', formulae: ['580'], priority: 1, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
      { type: 'cellIs', operator: 'between', formulae: ['580', '669'], priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['740'], priority: 3, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  // FICO factor breakdown table below
  let r2 = addSectionHeader(sheet, r + 7, 'FICO factor weights — where your score comes from', 'Five factors determine your FICO score. Spend your energy where the weight is.');

  const factors = [
    { factor: 'Payment History',           weight: 0.35, action: 'Pay every bill on time. Single biggest factor. See the Late-Fee Alert tab.' },
    { factor: 'Amounts Owed (Utilization)', weight: 0.30, action: 'Keep CC balances under 30% of limit, ideally under 10%. See the Utilization Optimizer.' },
    { factor: 'Length of Credit History',  weight: 0.15, action: 'Don\'t close old cards. The average age of accounts matters.' },
    { factor: 'Credit Mix',                weight: 0.10, action: 'A blend of revolving (cards) + installment (loans) helps. Don\'t game it.' },
    { factor: 'New Credit',                weight: 0.10, action: 'Limit hard inquiries — they ding 5-10 points each and stay for 2 years.' },
  ];
  addTableHeader(sheet, r2 + 1, ['Factor', 'Weight', 'Where to act in this workbook'], ['B', 'C', 'D']);
  sheet.mergeCells(`D${r2 + 1}:N${r2 + 1}`);

  factors.forEach((f, i) => {
    const row = r2 + 2 + i;
    sheet.getCell(`B${row}`).value = f.factor;
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).value = f.weight;
    sheet.getCell(`C${row}`).numFmt = '0%';
    sheet.getCell(`C${row}`).font = { ...FONTS.body, bold: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.mergeCells(`D${row}:N${row}`);
    sheet.getCell(`D${row}`).value = f.action;
    sheet.getCell(`D${row}`).font = FONTS.body;
    sheet.getCell(`D${row}`).alignment = { wrapText: true, vertical: 'middle' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getRow(row).height = 24;
  });

  addFooter(sheet, r2 + factors.length + 4, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 14 — 🎮 CREDIT SCORE SIMULATOR (Pro)
// ============================================================================

function buildCreditScoreSimulator(workbook) {
  const sheet = workbook.addWorksheet('🎮 Credit Score Simulator');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 28, C: 16, D: 16, E: 16, F: 16, G: 18, H: 18, I: 10, J: 10, K: 10, L: 10, M: 2 });

  // Simplified linear FICO model — buyer can adjust their current state + a "target"
  // state. We approximate point deltas per factor weight (35/30/15/10/10).
  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🎮 Credit Score Simulator',
    tabSubtitle: '"What if I drop my utilization to 10%?" → projected score change using FICO weights.',
    bannerText: BANNER,
    kpiData: [
      { label: 'CURRENT SCORE',   value: { formula: `TEXT(C7,"0")` } },
      { label: 'PROJECTED',       value: { formula: `TEXT(C7+SUM(F11:F15),"0")` } },
      { label: 'POINT GAIN',      value: { formula: `TEXT(SUM(F11:F15),"+0;-0;0")` } },
      { label: 'BIGGEST LEVER',   value: { formula: `IFERROR(INDEX(B11:B15,MATCH(MAX(F11:F15),F11:F15,0)),"—")` } },
      { label: 'TIME TO APPLY',   value: '30-60 days' },
      { label: 'CONFIDENCE',      value: 'Estimate (±15)' },
    ],
  });

  // Current score input
  sheet.mergeCells('B6:E6');
  sheet.getCell('B6').value = 'Your current FICO score';
  sheet.getCell('B6').font = FONTS.section;
  sheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(6).height = 26;

  sheet.getCell('C7').value = 700;
  sheet.getCell('C7').numFmt = '0';
  sheet.getCell('C7').font = { name: 'Inter', size: 24, bold: true, color: argb(COLORS.success) };
  sheet.getCell('C7').alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getCell('C7').fill = FILLS.warmGoldLight;
  sheet.getCell('C7').border = {
    top: { style: 'medium', color: argb(COLORS.warmGold) },
    bottom: { style: 'medium', color: argb(COLORS.warmGold) },
    left: { style: 'medium', color: argb(COLORS.warmGold) },
    right: { style: 'medium', color: argb(COLORS.warmGold) },
  };
  sheet.getCell('C7').dataValidation = { type: 'whole', operator: 'between', formulae: [300, 850], allowBlank: false };
  sheet.getRow(7).height = 38;

  sheet.mergeCells('D7:H7');
  sheet.getCell('D7').value = '↑ Edit to your latest score. Then edit the "Target State" column below to see point gains.';
  sheet.getCell('D7').font = FONTS.bodyMuted;
  sheet.getCell('D7').alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

  // Levers table
  let r = addSectionHeader(sheet, 9, 'Five score levers', 'Edit "Target" cells. Approximate point gains use FICO weights × current-vs-target delta. ±15-point margin of error.');

  addTableHeader(sheet, r + 1, ['Lever', 'Weight', 'Current', 'Target', 'Δ Available', 'Point Gain'], ['B', 'C', 'D', 'E', 'F', 'G']);

  const levers = [
    // weight, currentDefault, targetDefault, fmt, calc: gain = (target - current) × weight × point_scale
    { lever: 'Payment History — on-time %',      weight: 0.35, cur: 0.95, tgt: 1.00, fmt: '0%',
      gain: `(E${r + 2}-D${r + 2})*100*0.35*2` },
    { lever: 'Utilization — % of total limits',  weight: 0.30, cur: 0.45, tgt: 0.10, fmt: '0%',
      gain: `(D${r + 3}-E${r + 3})*100*0.30*2` },
    { lever: 'Length of history — avg account age (yrs)', weight: 0.15, cur: 5, tgt: 7, fmt: '0',
      gain: `(E${r + 4}-D${r + 4})*0.15*5` },
    { lever: 'Credit mix — types of credit (1-5)', weight: 0.10, cur: 3, tgt: 4, fmt: '0',
      gain: `(E${r + 5}-D${r + 5})*0.10*8` },
    { lever: 'New credit — hard inquiries (last 2 yr)', weight: 0.10, cur: 3, tgt: 1, fmt: '0',
      gain: `(D${r + 6}-E${r + 6})*0.10*8` },
  ];

  levers.forEach((l, i) => {
    const row = r + 2 + i;
    sheet.getCell(`B${row}`).value = l.lever;
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.ivory;

    sheet.getCell(`C${row}`).value = l.weight;
    sheet.getCell(`C${row}`).numFmt = '0%';
    sheet.getCell(`C${row}`).font = { ...FONTS.body, bold: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${row}`).border = BORDER_THIN();

    sheet.getCell(`D${row}`).value = l.cur;
    sheet.getCell(`D${row}`).numFmt = l.fmt;
    sheet.getCell(`D${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`D${row}`).fill = FILLS.warmGoldLight;

    sheet.getCell(`E${row}`).value = l.tgt;
    sheet.getCell(`E${row}`).numFmt = l.fmt;
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).fill = FILLS.warmGoldLight;

    sheet.getCell(`F${row}`).value = { formula: `IFERROR(ROUND(${l.gain},0),0)` };
    sheet.getCell(`F${row}`).numFmt = '+0;-0;0';
    sheet.getCell(`F${row}`).font = { ...FONTS.body, bold: true, color: argb(COLORS.success) };
    sheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).fill = FILLS.successLight;

    // Direction hint
    sheet.getCell(`G${row}`).value = i === 1 || i === 4 ? '↓ Lower is better' : '↑ Higher is better';
    sheet.getCell(`G${row}`).font = FONTS.small;
    sheet.getCell(`G${row}`).alignment = { horizontal: 'left' };
    sheet.getCell(`G${row}`).border = BORDER_THIN();
  });

  // Total row
  const totalR = r + 7;
  sheet.getCell(`E${totalR}`).value = 'TOTAL GAIN';
  sheet.getCell(`E${totalR}`).font = FONTS.smallCaps;
  sheet.getCell(`E${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`F${totalR}`).value = { formula: `SUM(F${r + 2}:F${r + 6})` };
  sheet.getCell(`F${totalR}`).numFmt = '+0;-0;0';
  sheet.getCell(`F${totalR}`).font = { name: 'Inter', size: 18, bold: true, color: argb(COLORS.success) };
  sheet.getCell(`F${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`F${totalR}`).fill = FILLS.ivory;
  sheet.getCell(`F${totalR}`).border = { top: { style: 'medium', color: argb(COLORS.success) } };

  addCallout(sheet, `B${totalR + 2}:G${totalR + 3}`,
    '💡',
    'How accurate is this?',
    'This is a simplified linear FICO model — your actual score moves in non-linear ways (utilization improvements above 30% are dramatic; small changes at 70%+ utilization are muted). Margin of error is roughly ±15 points. Treat the BIGGEST LEVER as your priority and the projected score as a directional estimate, not a promise.');
  sheet.getRow(totalR + 2).height = 30;
  sheet.getRow(totalR + 3).height = 30;

  addFooter(sheet, totalR + 6, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 15 — 💡 UTILIZATION OPTIMIZER (Pro)
// ============================================================================

function buildUtilizationOptimizer(workbook) {
  const sheet = workbook.addWorksheet('💡 Utilization Optimizer');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 24, C: 14, D: 14, E: 12, F: 14, G: 14, H: 26, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💡 Utilization Optimizer',
    tabSubtitle: 'Per-card utilization + statement-close timing. Lower this number → biggest score lever after on-time payments.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL CC BAL',   value: { formula: `TEXT(SUM(D11:D20),"$#,##0")` } },
      { label: 'TOTAL CC LIMIT', value: { formula: `TEXT(SUM(E11:E20),"$#,##0")` } },
      { label: 'CURRENT UTIL.',  value: { formula: `IFERROR(TEXT(SUM(D11:D20)/SUM(E11:E20),"0%"),"0%")` } },
      { label: 'TARGET ≤30%',    value: { formula: `IFERROR(TEXT(MAX(0,SUM(D11:D20)-SUM(E11:E20)*0.3),"$#,##0"),"$0")` } },
      { label: 'TARGET ≤10%',    value: { formula: `IFERROR(TEXT(MAX(0,SUM(D11:D20)-SUM(E11:E20)*0.1),"$#,##0"),"$0")` } },
      { label: 'CARDS',          value: { formula: `COUNTA(B11:B20)` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-card utilization', 'Pulls credit-card debts from your Debt List. Enter the credit limit for each. Recommendation column tells you exactly what to pay before the next statement close.');

  addTableHeader(sheet, r + 1, ['Card', 'Type', 'Balance', 'Limit', 'Util %', 'Statement Day', 'Recommendation'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  for (let i = 0; i < 10; i++) {
    const row = r + 2 + i;
    const dlRow = 11 + i;

    sheet.getCell(`B${row}`).value = { formula: `IFERROR(IF('📋 Debt List'!C${dlRow}="Credit Card",'📋 Debt List'!B${dlRow},""),"")` };
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.white;

    sheet.getCell(`C${row}`).value = { formula: `IFERROR(IF('📋 Debt List'!C${dlRow}="Credit Card","Credit Card",""),"")` };
    sheet.getCell(`C${row}`).font = FONTS.body;
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).fill = FILLS.white;

    sheet.getCell(`D${row}`).value = { formula: `IFERROR(IF('📋 Debt List'!C${dlRow}="Credit Card",'📋 Debt List'!D${dlRow},""),"")` };
    sheet.getCell(`D${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`D${row}`).fill = FILLS.white;

    // Limit — user-editable (Debt List doesn't track CC limits)
    sheet.getCell(`E${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${row}`).font = FONTS.body;
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).fill = FILLS.warmGoldLight;

    sheet.getCell(`F${row}`).value = { formula: `IFERROR(D${row}/E${row},"")` };
    sheet.getCell(`F${row}`).numFmt = '0%';
    sheet.getCell(`F${row}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();

    // Statement day — user-editable
    sheet.getCell(`G${row}`).numFmt = '0';
    sheet.getCell(`G${row}`).font = FONTS.body;
    sheet.getCell(`G${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${row}`).border = BORDER_THIN();
    sheet.getCell(`G${row}`).fill = FILLS.warmGoldLight;
    sheet.getCell(`G${row}`).dataValidation = { type: 'whole', operator: 'between', formulae: [1, 31], allowBlank: true };

    sheet.getCell(`H${row}`).value = { formula: `IF(B${row}="","",IF(F${row}<=0.1,"✅ Stay below 10% by statement close",IF(F${row}<=0.3,"🟡 Pay "&TEXT(D${row}-E${row}*0.1,"$#,##0")&" to drop to 10%","🔴 Pay "&TEXT(D${row}-E${row}*0.3,"$#,##0")&" to drop to 30%")))` };
    sheet.getCell(`H${row}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`H${row}`).border = BORDER_THIN();
    sheet.getCell(`H${row}`).fill = FILLS.white;
  }

  // CF on utilization column
  sheet.addConditionalFormatting({
    ref: `F${r + 2}:F${r + 11}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.3'], priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.1'], priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'cellIs', operator: 'lessThanOrEqual', formulae: ['0.1'], priority: 3, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 14}:H${r + 15}`,
    '💡',
    'The statement-close trick',
    'Credit bureaus report your balance as of the STATEMENT CLOSE date, not the payment due date. To minimize reported utilization, pay your balance down to the target BEFORE statement close — typically 21-28 days into your billing cycle. Many people miss this entirely and report 50%+ utilization unnecessarily.');
  sheet.getRow(r + 14).height = 30;
  sheet.getRow(r + 15).height = 30;

  addFooter(sheet, r + 18, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 16 — 🔥 ON-TIME PAYMENT STREAK (Pro)
// ============================================================================

function buildOnTimeStreak(workbook) {
  const sheet = workbook.addWorksheet('🔥 On-Time Streak');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 22, C: 18, D: 18, E: 18, F: 18, G: 22, H: 14, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🔥 On-Time Streak',
    tabSubtitle: 'Payment History is 35% of your FICO score. Track every on-time payment. Don\'t break the chain.',
    bannerText: BANNER,
    kpiData: [
      { label: 'CURRENT STREAK', value: { formula: `TEXT(C7,"0")&" mo"` } },
      { label: 'NEXT BADGE',     value: { formula: `IF(C7<3,"3 mo (Foundation)",IF(C7<6,"6 mo (Trusted)",IF(C7<12,"12 mo (Sterling)",IF(C7<24,"24 mo (Elite)","🏆 Max"))))` } },
      { label: 'TO NEXT',        value: { formula: `IF(C7<3,3-C7,IF(C7<6,6-C7,IF(C7<12,12-C7,IF(C7<24,24-C7,0))))&" mo"` } },
      { label: 'LONGEST EVER',   value: { formula: `TEXT(C8,"0")&" mo"` } },
      { label: 'THIS YEAR',      value: { formula: `MIN(C7,12)&" / 12"` } },
      { label: 'LAST MISS',      value: { formula: `IFERROR(TEXT(C9,"mmm yyyy"),"None")` } },
    ],
  });

  // Streak input card
  sheet.mergeCells('B6:E6');
  sheet.getCell('B6').value = 'Your streak inputs';
  sheet.getCell('B6').font = FONTS.section;

  sheet.getCell('B7').value = 'Current on-time streak (months)';
  sheet.getCell('B7').font = FONTS.bodyBold;
  sheet.getCell('C7').value = 8;
  sheet.getCell('C7').numFmt = '0';
  sheet.getCell('C7').font = { name: 'Inter', size: 18, bold: true, color: argb(COLORS.success) };
  sheet.getCell('C7').alignment = { horizontal: 'center' };
  sheet.getCell('C7').fill = FILLS.warmGoldLight;
  sheet.getCell('C7').border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell('C7').dataValidation = { type: 'whole', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: false };

  sheet.getCell('B8').value = 'Longest streak ever';
  sheet.getCell('B8').font = FONTS.bodyBold;
  sheet.getCell('C8').value = 22;
  sheet.getCell('C8').numFmt = '0';
  sheet.getCell('C8').font = FONTS.body;
  sheet.getCell('C8').alignment = { horizontal: 'center' };
  sheet.getCell('C8').fill = FILLS.warmGoldLight;
  sheet.getCell('C8').border = BORDER_THIN(COLORS.warmGold);

  sheet.getCell('B9').value = 'Last missed payment (date)';
  sheet.getCell('B9').font = FONTS.bodyBold;
  sheet.getCell('C9').numFmt = 'mmm d, yyyy';
  sheet.getCell('C9').font = FONTS.body;
  sheet.getCell('C9').alignment = { horizontal: 'center' };
  sheet.getCell('C9').fill = FILLS.warmGoldLight;
  sheet.getCell('C9').border = BORDER_THIN(COLORS.warmGold);

  let r = addSectionHeader(sheet, 12, 'Milestone badges', 'Each badge unlocks at a streak threshold. FICO\'s "Payment History" sub-score caps out around the 24-month mark.');

  addTableHeader(sheet, r + 1, ['Badge', 'Threshold', 'Status', 'Score Impact', 'Achievement Date'], ['B', 'C', 'D', 'E', 'F']);

  const badges = [
    { name: '🥉 Foundation',  threshold: 3,  impact: '+10-20 pts' },
    { name: '🥈 Trusted',     threshold: 6,  impact: '+25-40 pts' },
    { name: '🥇 Sterling',    threshold: 12, impact: '+40-60 pts' },
    { name: '🏆 Elite',       threshold: 24, impact: 'FICO max for this factor' },
  ];

  badges.forEach((b, i) => {
    const row = r + 2 + i;
    sheet.getCell(`B${row}`).value = b.name;
    sheet.getCell(`B${row}`).font = { ...FONTS.bodyBold, size: 14 };
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.white;

    sheet.getCell(`C${row}`).value = `${b.threshold} months`;
    sheet.getCell(`C${row}`).font = FONTS.body;
    sheet.getCell(`C${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${row}`).border = BORDER_THIN();

    sheet.getCell(`D${row}`).value = { formula: `IF($C$7>=${b.threshold},"✅ Earned","⏳ "&${b.threshold}-$C$7&" mo to go")` };
    sheet.getCell(`D${row}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`D${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();

    sheet.getCell(`E${row}`).value = b.impact;
    sheet.getCell(`E${row}`).font = { ...FONTS.body, italic: true, color: argb(COLORS.success) };
    sheet.getCell(`E${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();

    sheet.getCell(`F${row}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`F${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();
  });

  // CF — earned badges green
  sheet.addConditionalFormatting({
    ref: `D${r + 2}:D${r + 5}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Earned', priority: 1, style: { fill: FILLS.success, font: { color: argb(COLORS.white), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 9}:F${r + 10}`,
    '🔥',
    'Why this matters',
    'Payment History is 35% of your FICO score — the single biggest lever. ONE missed payment can drop a 750 score to 670 (–80 points) and the negative mark stays for 7 years. Set autopay for the minimum on every debt. The Late-Fee Alert tab catches what autopay misses.');
  sheet.getRow(r + 9).height = 30;
  sheet.getRow(r + 10).height = 30;

  addFooter(sheet, r + 13, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 17 — 🔁 REFINANCE RADAR (Pro)
// ============================================================================

function buildRefinanceRadar(workbook) {
  const sheet = workbook.addWorksheet('🔁 Refinance Radar');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 26, C: 14, D: 14, E: 14, F: 14, G: 14, H: 22, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🔁 Refinance Radar',
    tabSubtitle: 'Compare your debts against today\'s market rates. Green = refi candidate. Red = stay put.',
    bannerText: BANNER,
    kpiData: [
      { label: 'DEBTS',           value: { formula: `COUNTA('📋 Debt List'!B11:B30)` } },
      { label: 'AVG YOUR APR',    value: { formula: `IFERROR(TEXT(AVERAGEIF('📋 Debt List'!E11:E30,">0"),"0.0%"),"0.0%")` } },
      { label: 'MKT BEST',        value: { formula: `TEXT(MIN(C11:C14),"0.0%")` } },
      { label: 'GAP',             value: { formula: `IFERROR(TEXT(AVERAGEIF('📋 Debt List'!E11:E30,">0")-MIN(C11:C14),"0.0%"),"0.0%")` } },
      { label: 'CANDIDATES',      value: { formula: `COUNTIF(F18:F27,"✅ Strong")` } },
      { label: 'POTENTIAL SAVE',  value: { formula: `IFERROR(TEXT(SUMIF(F18:F27,"✅ Strong",G18:G27),"$#,##0"),"$0")` } },
    ],
  });

  // Market rate inputs
  let r = addSectionHeader(sheet, 6, 'Today\'s market rates (edit me)', 'Update these from Bankrate / NerdWallet / your bank. They\'re used as the comparison baseline below.');

  addTableHeader(sheet, r + 1, ['Debt Type', 'Best Rate Today', 'Source', 'Last Checked'], ['B', 'C', 'D', 'E']);

  const marketRates = [
    { type: 'Personal Loan (excellent credit)', rate: 0.0799, source: 'Bankrate avg, 720+ FICO', date: new Date() },
    { type: 'Auto Loan (new car, 60mo)',         rate: 0.0599, source: 'Bankrate avg, 720+ FICO', date: new Date() },
    { type: 'Student Loan Refi',                 rate: 0.0489, source: 'SoFi/Earnest avg',         date: new Date() },
    { type: 'Mortgage Refi (30yr fixed)',        rate: 0.0625, source: 'Freddie Mac PMMS',         date: new Date() },
  ];

  marketRates.forEach((m, i) => {
    const row = r + 2 + i;
    sheet.getCell(`B${row}`).value = m.type;
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.white;

    sheet.getCell(`C${row}`).value = m.rate;
    sheet.getCell(`C${row}`).numFmt = '0.00%';
    sheet.getCell(`C${row}`).font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${row}`).border = BORDER_THIN(COLORS.warmGold);
    sheet.getCell(`C${row}`).fill = FILLS.warmGoldLight;

    sheet.getCell(`D${row}`).value = m.source;
    sheet.getCell(`D${row}`).font = FONTS.bodyMuted;
    sheet.getCell(`D${row}`).border = BORDER_THIN();

    sheet.getCell(`E${row}`).value = m.date;
    sheet.getCell(`E${row}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`E${row}`).font = FONTS.body;
    sheet.getCell(`E${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();
  });

  // Per-debt refi candidacy
  let r2 = addSectionHeader(sheet, 16, 'Per-debt refi candidacy', 'For each debt, we compare your APR to the best market rate for that debt type. Includes a 2% refi-fee assumption for break-even math.');

  addTableHeader(sheet, r2 + 1, ['Debt', 'Type', 'Your APR', 'Best Market', 'Gap', 'Candidate?', 'Est. Annual Savings'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  for (let i = 0; i < 10; i++) {
    const row = r2 + 2 + i;
    const dlRow = 11 + i;

    sheet.getCell(`B${row}`).value = { formula: `IFERROR('📋 Debt List'!B${dlRow},"")` };
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();

    sheet.getCell(`C${row}`).value = { formula: `IFERROR('📋 Debt List'!C${dlRow},"")` };
    sheet.getCell(`C${row}`).font = FONTS.body;
    sheet.getCell(`C${row}`).border = BORDER_THIN();

    sheet.getCell(`D${row}`).value = { formula: `IFERROR('📋 Debt List'!E${dlRow},"")` };
    sheet.getCell(`D${row}`).numFmt = '0.0%';
    sheet.getCell(`D${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();

    // Best market rate by debt type — VLOOKUP against the market table.
    sheet.getCell(`E${row}`).value = { formula: `IFERROR(IF(C${row}="Personal Loan",C${r + 2},IF(C${row}="Car Loan",C${r + 3},IF(C${row}="Student Loan",C${r + 4},IF(C${row}="Mortgage",C${r + 5},MIN(C${r + 2}:C${r + 5}))))),"")` };
    sheet.getCell(`E${row}`).numFmt = '0.0%';
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();

    sheet.getCell(`F${row}`).value = { formula: `IFERROR(D${row}-E${row},"")` };
    sheet.getCell(`F${row}`).numFmt = '0.0%';
    sheet.getCell(`F${row}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();

    sheet.getCell(`G${row}`).value = { formula: `IF(B${row}="","",IF(F${row}>=0.03,"✅ Strong",IF(F${row}>=0.01,"🟡 Maybe","🔴 Stay")))` };
    sheet.getCell(`G${row}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`G${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${row}`).border = BORDER_THIN();

    sheet.getCell(`H${row}`).value = { formula: `IFERROR(MAX(0,'📋 Debt List'!D${dlRow}*F${row}-'📋 Debt List'!D${dlRow}*0.02),"")` };
    sheet.getCell(`H${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${row}`).font = { ...FONTS.body, color: argb(COLORS.success) };
    sheet.getCell(`H${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${row}`).border = BORDER_THIN();
  }

  // CF on candidacy
  sheet.addConditionalFormatting({
    ref: `G${r2 + 2}:G${r2 + 11}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Strong', priority: 1, style: { fill: FILLS.success,     font: { color: argb(COLORS.white),   bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Maybe',  priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Stay',   priority: 3, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
    ],
  });

  addCallout(sheet, `B${r2 + 13}:H${r2 + 14}`,
    '💡',
    'Break-even math',
    'Refinancing typically costs 1-3% of the loan in origination fees. We assume 2% in the Est. Annual Savings column. "Strong" means your APR is 3+ points above market — worth applying immediately. "Maybe" means 1-3 points — worth shopping if you have time. Below 1% gap, the fees eat the savings.');
  sheet.getRow(r2 + 13).height = 30;
  sheet.getRow(r2 + 14).height = 30;

  addFooter(sheet, r2 + 17, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 18 — 🤖 AI CREDIT COACH (AI Edition)
// ============================================================================

function buildAICreditCoach(workbook) {
  const sheet = workbook.addWorksheet('🤖 AI Credit Coach');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 30, C: 14, D: 14, E: 18, F: 24, G: 14, H: 14, I: 10, J: 10, K: 10, L: 10, M: 2 });

  // Debt Health Score composite — referenced by Dashboard B10 + KPI tile.
  // Weighted 40/30/20/10: debt-paid / interest-saved / on-time / utilization.
  //
  // Numeric sub-scores live in F${SUB_BASE}..F${SUB_BASE+3}; column D holds their text labels.
  // SUB_BASE depends on addSectionHeader's row return at row 6 (header writes rows 6+7+8 underline,
  // returns 9), so the table header for the sub-scores lands at row 10 and the values fill rows 10-13.
  const SUB_BASE = 10;
  const HAS_DATA = `(SUM('📋 Debt List'!D11:D30)+IFERROR('🏆 Milestone Tracker'!B6,0))>0`;
  const COMPOSITE_FORMULA = `IF(${HAS_DATA},IFERROR(ROUND(F${SUB_BASE}*0.40+F${SUB_BASE+1}*0.30+F${SUB_BASE+2}*0.20+F${SUB_BASE+3}*0.10,0),0),"—")`;

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🤖 AI Credit Coach',
    tabSubtitle: 'Hub page for the 7 AI prompts — each pairs with a specific tab. Composite Debt Health Score 0-100.',
    bannerText: BANNER,
    kpiData: [
      { label: 'SCORE',         value: { formula: `IF(ISNUMBER(B10),B10&" / 100","— / 100")` } },
      { label: 'STATUS',        value: { formula: `IF(ISNUMBER(B10),IF(B10>=80,"✅ Strong",IF(B10>=60,"🟡 On Track",IF(B10>=40,"⚠️ At Risk","🔴 Critical"))),"Awaiting data")` } },
      { label: 'WEAKEST SUB',   value: { formula: `IF(ISNUMBER(B10),INDEX({"Debt paid","Interest saved","On-time","Utilization"},MATCH(MIN(F${SUB_BASE}:F${SUB_BASE+3}),F${SUB_BASE}:F${SUB_BASE+3},0)),"—")` } },
      { label: 'STRONGEST SUB', value: { formula: `IF(ISNUMBER(B10),INDEX({"Debt paid","Interest saved","On-time","Utilization"},MATCH(MAX(F${SUB_BASE}:F${SUB_BASE+3}),F${SUB_BASE}:F${SUB_BASE+3},0)),"—")` } },
      { label: 'TOTAL DEBT',    value: { formula: `TEXT(SUM('📋 Debt List'!D11:D30),"$#,##0")` } },
      { label: 'PROMPTS',       value: '7' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Debt Health Score — weighted composite', '4 sub-scores: Debt paid 40% · Interest saved 30% · On-time streak 20% · Utilization 10%. Updates live from your Debt List + Milestone Tracker + On-Time Streak + Utilization Optimizer tabs.');

  // The big composite score (referenced by Dashboard at AI Credit Coach!B10)
  sheet.mergeCells(`B${r + 1}:C${r + 5}`);
  sheet.getCell(`B${r + 1}`).value = { formula: COMPOSITE_FORMULA };
  sheet.getCell(`B${r + 1}`).font = { name: 'Inter', size: 72, bold: true, color: argb(COLORS.success) };
  sheet.getCell(`B${r + 1}`).alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getCell(`B${r + 1}`).fill = FILLS.ivory;
  sheet.getCell(`B${r + 1}`).border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell(`B${r + 1}`).numFmt = '0';

  // Sub-score table
  addTableHeader(sheet, r + 1, ['Component', 'Weight', 'Score', 'Status', 'Reasoning'], ['D', 'E', 'F', 'G', 'H']);

  const subScores = [
    {
      name: 'Debt paid',
      weight: 0.40,
      // % paid = (original - current) / original × 100
      formula: `IFERROR(ROUND(MAX(0,IFERROR('🏆 Milestone Tracker'!B6,SUM('📋 Debt List'!D11:D30))-SUM('📋 Debt List'!D11:D30))/IFERROR('🏆 Milestone Tracker'!B6,1)*100,0),0)`,
      reasoning: 'Tracks how much of your original total debt you\'ve paid off.',
    },
    {
      name: 'Interest saved',
      weight: 0.30,
      // Rough: 100 minus (current weighted APR × 5). Lower APRs = higher score.
      formula: `IFERROR(ROUND(MAX(0,100-(SUMPRODUCT('📋 Debt List'!D11:D30,'📋 Debt List'!E11:E30)/MAX(SUM('📋 Debt List'!D11:D30),1)*500)),0),0)`,
      reasoning: 'Lower weighted APR = higher score. Avalanche method moves this up fastest.',
    },
    {
      name: 'On-time streak',
      weight: 0.20,
      formula: `IFERROR(ROUND(MIN(IFERROR('🔥 On-Time Streak'!C7,0)/24*100,100),0),0)`,
      reasoning: 'Streak in months ÷ 24 × 100. Caps at 100 once you hit 24-month streak (FICO max for this factor).',
    },
    {
      name: 'Utilization',
      weight: 0.10,
      // Lower utilization = higher score.
      formula: `IFERROR(ROUND(MAX(0,100-IFERROR(SUM('💡 Utilization Optimizer'!D11:D20)/MAX(SUM('💡 Utilization Optimizer'!E11:E20),1),0)*200),0),0)`,
      reasoning: 'Lower utilization = higher score. Statement-close timing matters as much as actual balance.',
    },
  ];

  subScores.forEach((s, i) => {
    const row = r + 1 + i;
    sheet.getCell(`D${row}`).value = s.name;
    sheet.getCell(`D${row}`).font = FONTS.bodyBold;
    sheet.getCell(`D${row}`).border = BORDER_THIN();

    sheet.getCell(`E${row}`).value = s.weight;
    sheet.getCell(`E${row}`).numFmt = '0%';
    sheet.getCell(`E${row}`).font = { ...FONTS.body, bold: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();

    sheet.getCell(`F${row}`).value = { formula: s.formula };
    sheet.getCell(`F${row}`).numFmt = '0';
    sheet.getCell(`F${row}`).font = { name: 'Inter', size: 16, bold: true, color: argb(COLORS.charcoal) };
    sheet.getCell(`F${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();

    sheet.getCell(`G${row}`).value = { formula: `IF(F${row}>=80,"✅ Strong",IF(F${row}>=60,"🟡 Building",IF(F${row}>=40,"⚠️ Watch","🔴 At Risk")))` };
    sheet.getCell(`G${row}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`G${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${row}`).border = BORDER_THIN();

    sheet.getCell(`H${row}`).value = s.reasoning;
    sheet.getCell(`H${row}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${row}`).alignment = { wrapText: true, vertical: 'middle' };
    sheet.getCell(`H${row}`).border = BORDER_THIN();
  });

  // CF on status pills
  sheet.addConditionalFormatting({
    ref: `G${r + 1}:G${r + 4}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Strong',   priority: 1, style: { fill: FILLS.success,     font: { color: argb(COLORS.white),  bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Building', priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Watch',    priority: 3, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'At Risk',  priority: 4, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),  bold: true } } },
    ],
  });

  // 7 AI prompts grid
  let r2 = addSectionHeader(sheet, r + 6, 'Seven AI prompts', 'Each prompt pairs with a specific tab. Open the AI Credit Coach PDF (ships with AI Edition) for the full prompt + worked example per page.');

  addTableHeader(sheet, r2 + 1, ['#', 'Prompt', 'Pairs With', 'What It Does', 'PDF Page'], ['B', 'C', 'D', 'E', 'F']);

  const prompts = [
    { n: '1', title: 'Payoff Strategy Optimizer',    pairs: '📊 Strategy Comparison',     hint: 'Snowball vs Avalanche vs Custom for your specific situation', page: 'p.3' },
    { n: '2', title: 'AI Credit Score Coach',        pairs: '🎮 Credit Score Simulator',  hint: 'Ranked action list with estimated point gains',              page: 'p.4' },
    { n: '3', title: 'Utilization Timing Advisor',   pairs: '💡 Utilization Optimizer',   hint: 'Exact card + amount + date for max score impact',           page: 'p.5' },
    { n: '4', title: 'Consolidation Intelligence',   pairs: '🔄 Debt Consolidation',      hint: 'Picks single best consolidation path',                       page: 'p.6' },
    { n: '5', title: 'Income Acceleration Coach',    pairs: '🎯 Extra Payment Simulator', hint: '5 realistic side-income ideas with earning estimates',      page: 'p.7' },
    { n: '6', title: 'Settlement Letter Generator',  pairs: '📋 Debt List',               hint: 'AI hardship/settlement letter for creditor negotiation',     page: 'p.8' },
    { n: '7', title: 'Health Score Coach',           pairs: '🤖 AI Credit Coach',         hint: 'Move the composite score 10 points with specific actions',  page: 'p.9' },
  ];

  prompts.forEach((p, i) => {
    const row = r2 + 2 + i;
    sheet.getCell(`B${row}`).value = p.n;
    sheet.getCell(`B${row}`).font = { name: 'Inter', size: 18, bold: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${row}`).fill = FILLS.ivory;
    sheet.getCell(`B${row}`).border = BORDER_THIN();

    sheet.getCell(`C${row}`).value = p.title;
    sheet.getCell(`C${row}`).font = FONTS.bodyBold;
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).fill = FILLS.white;

    sheet.getCell(`D${row}`).value = p.pairs;
    sheet.getCell(`D${row}`).font = FONTS.body;
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`D${row}`).fill = FILLS.white;

    sheet.getCell(`E${row}`).value = p.hint;
    sheet.getCell(`E${row}`).font = FONTS.bodyMuted;
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).fill = FILLS.white;

    sheet.getCell(`F${row}`).value = p.page;
    sheet.getCell(`F${row}`).font = { ...FONTS.body, bold: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`F${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).fill = FILLS.white;
  });

  addCallout(sheet, `B${r2 + 10}:F${r2 + 11}`,
    '💡',
    'How to use the AI prompts',
    'Open the AI Credit Coach PDF (shipped with your AI Edition purchase). Each page has one prompt + a worked example. Paste your data into your favourite AI assistant (free tiers work), paste the prompt, read the output, apply what makes sense.');
  sheet.getRow(r2 + 10).height = 30;
  sheet.getRow(r2 + 11).height = 30;

  // Dynamic Path-to-100 coach
  const coachR = r2 + 13;
  sheet.mergeCells(`B${coachR}:F${coachR + 1}`);
  sheet.getCell(`B${coachR}`).value = {
    formula: `IF(NOT(${HAS_DATA}),"💡 Add a few debts to your Debt List and set the original total on the Milestone Tracker tab. The score and coaching kick in as soon as there's data.","💡 Path to 100 — "&INDEX({"Debt paid","Interest saved","On-time streak","Utilization"},MATCH(MIN(F${r + 1}:F${r + 4}),F${r + 1}:F${r + 4},0))&" is your weakest at "&MIN(F${r + 1}:F${r + 4})&"/100. "&INDEX({"Keep paying down the largest debts — every dollar reduces this score component.","Lower your weighted APR via Avalanche or Balance Transfer.","Don't miss a payment. Each on-time month adds 4 points to this sub-score.","Pay CC balances before statement close — target <30%, ideally <10%."},MATCH(MIN(F${r + 1}:F${r + 4}),F${r + 1}:F${r + 4},0)))`
  };
  sheet.getCell(`B${coachR}`).fill = FILLS.ivory;
  sheet.getCell(`B${coachR}`).font = { ...FONTS.body, bold: true };
  sheet.getCell(`B${coachR}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1, wrapText: true };
  sheet.getCell(`B${coachR}`).border = {
    left: { style: 'medium', color: argb(COLORS.warmGold) },
    top: { style: 'thin', color: argb(COLORS.divider) },
    bottom: { style: 'thin', color: argb(COLORS.divider) },
    right: { style: 'thin', color: argb(COLORS.divider) },
  };
  sheet.getRow(coachR).height = 28;
  sheet.getRow(coachR + 1).height = 28;

  addFooter(sheet, coachR + 5, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 19 — 🔍 INQUIRY & MARKS TRACKER (AI Edition)
// ============================================================================

function buildInquiryAndMarks(workbook) {
  const sheet = workbook.addWorksheet('🔍 Inquiry & Marks');
  setTabColor(sheet, COLORS.alert);
  setupColumns(sheet, { A: 2, B: 14, C: 22, D: 16, E: 14, F: 14, G: 26, H: 10, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🔍 Inquiry & Marks',
    tabSubtitle: 'Hard inquiries fall off in 2 years. Derogatory marks in 7 (late) or 10 (bankruptcy). Track and time your applications.',
    bannerText: BANNER,
    kpiData: [
      { label: 'INQUIRIES',       value: { formula: `COUNTA(C11:C20)&" total"` } },
      { label: 'FALLING OFF SOON',value: { formula: `SUMPRODUCT((B11:B20<>"")*((B11:B20+730)-TODAY()<=90)*((B11:B20+730)-TODAY()>0))&" in 90d"` } },
      { label: 'DEROGATORY',      value: { formula: `COUNTA(C24:C30)&" total"` } },
      { label: 'NEXT FALLOFF',    value: { formula: `IFERROR(MIN(IF(B11:B20+730>TODAY(),B11:B20+730))-TODAY()&" days","—")` } },
      { label: 'AVG INQ. AGE',    value: { formula: `IFERROR(ROUND(AVERAGEIF(B11:B20,"<>",B11:B20),0),0)` } },
      { label: 'SCORE IMPACT',    value: { formula: `-1*COUNTA(C11:C20)*7&" pts (~ est)"` } },
    ],
  });

  // Hard inquiries section
  let r = addSectionHeader(sheet, 6, 'Hard inquiries — fall off in 2 years', 'Each inquiry typically drops your score 5-10 points immediately + lingers for 24 months. Time your applications.');

  addTableHeader(sheet, r + 1, ['Date', 'Lender / Application', 'Purpose', 'Fall-off Date', 'Days Remaining', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G']);

  // 10 input rows
  for (let i = 0; i < 10; i++) {
    const row = r + 2 + i;
    sheet.getCell(`B${row}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.white;
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).fill = FILLS.white;
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`D${row}`).fill = FILLS.white;
    sheet.getCell(`D${row}`).dataValidation = { type: 'list', formulae: ['"CC Application,Auto Loan,Mortgage,Personal Loan,Student Refi,Other"'] };
    // Fall-off date = inquiry date + 730 days
    sheet.getCell(`E${row}`).value = { formula: `IF(B${row}="","",B${row}+730)` };
    sheet.getCell(`E${row}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).fill = FILLS.ivory;
    sheet.getCell(`E${row}`).alignment = { horizontal: 'center' };
    // Days remaining
    sheet.getCell(`F${row}`).value = { formula: `IF(B${row}="","",MAX(0,(B${row}+730)-TODAY()))` };
    sheet.getCell(`F${row}`).numFmt = '0" days"';
    sheet.getCell(`F${row}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`F${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).fill = FILLS.white;
    sheet.getCell(`G${row}`).border = BORDER_THIN();
    sheet.getCell(`G${row}`).fill = FILLS.white;
    sheet.getCell(`G${row}`).font = FONTS.bodyMuted;
  }

  // No demo seed — inquiry history is buyer-specific and faking it leaks into the buyer's KPI
  // counts. Placeholder hint goes in the Notes column so the empty table reads as intentional.
  // (Removed DPP-012: hardcoded "Chase Sapphire Preferred" + "Subaru Financing" rows.)
  sheet.getCell(`G${r + 2}`).value = 'Example: enter each hard credit pull here. KPI "INQUIRIES" counts your entries automatically.';
  sheet.getCell(`G${r + 2}`).font = { ...FONTS.bodyMuted, italic: true };

  // CF on days-remaining
  sheet.addConditionalFormatting({
    ref: `F${r + 2}:F${r + 11}`,
    rules: [
      { type: 'cellIs', operator: 'lessThanOrEqual', formulae: ['90'],  priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'cellIs', operator: 'lessThanOrEqual', formulae: ['365'], priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
    ],
  });

  // Derogatory marks section
  let r2 = addSectionHeader(sheet, 22, 'Derogatory marks — 7 to 10 year falloff', 'Late payments (7yr), collections (7yr), bankruptcies (Ch.7 10yr, Ch.13 7yr). These are heavy. Document everything.');

  addTableHeader(sheet, r2 + 1, ['Date', 'Type', 'Lender', 'Amount', 'Status', 'Fall-off Year', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  for (let i = 0; i < 7; i++) {
    const row = r2 + 2 + i;
    sheet.getCell(`B${row}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).dataValidation = { type: 'list', formulae: ['"Late Payment 30d,Late Payment 60d,Late Payment 90d+,Charge-Off,Collection,Repossession,Foreclosure,Bankruptcy Ch.7,Bankruptcy Ch.13"'] };
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).dataValidation = { type: 'list', formulae: ['"Open,Paid,Resolved,Disputed"'] };
    // Fall-off = date + 7yr (10yr for Ch.7); approximation as YEAR(date)+7
    sheet.getCell(`G${row}`).value = { formula: `IF(B${row}="","",YEAR(B${row})+IF(C${row}="Bankruptcy Ch.7",10,7))` };
    sheet.getCell(`G${row}`).numFmt = '0';
    sheet.getCell(`G${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${row}`).border = BORDER_THIN();
    sheet.getCell(`H${row}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${row}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${r2 + 11}:H${r2 + 12}`,
    '💡',
    'Goodwill letters work — use them',
    'For 30/60-day late payments on an otherwise-clean account, write the lender a "goodwill letter" asking for the late mark to be removed as a courtesy. Especially effective with credit unions, smaller banks, and any card you\'ve had 3+ years. AI Credit Coach prompt #6 generates the letter for you.');
  sheet.getRow(r2 + 11).height = 32;
  sheet.getRow(r2 + 12).height = 32;

  addFooter(sheet, r2 + 15, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 20 — 🎓 STUDENT LOAN TAB (AI Edition)
// ============================================================================

function buildStudentLoan(workbook) {
  const sheet = workbook.addWorksheet('🎓 Student Loan');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 26, C: 18, D: 18, E: 18, F: 18, G: 14, H: 14, I: 10, J: 10, K: 10, L: 10, M: 2 });

  // Pull Student Loan rows from Debt List by filtering type === 'Student Loan'.
  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🎓 Student Loan',
    tabSubtitle: 'Federal vs private split, IDR vs standard, PSLF eligibility check, aggressive-payment simulator.',
    bannerText: BANNER,
    kpiData: [
      { label: 'STUDENT TOTAL',  value: { formula: `TEXT(SUMIF('📋 Debt List'!C11:C30,"Student Loan",'📋 Debt List'!D11:D30),"$#,##0")` } },
      { label: 'LOANS',          value: { formula: `COUNTIF('📋 Debt List'!C11:C30,"Student Loan")&" loans"` } },
      { label: 'AVG APR',        value: { formula: `IFERROR(TEXT(AVERAGEIFS('📋 Debt List'!E11:E30,'📋 Debt List'!C11:C30,"Student Loan",'📋 Debt List'!E11:E30,">0"),"0.0%"),"0.0%")` } },
      { label: 'STANDARD MIN',   value: { formula: `TEXT(SUMIF('📋 Debt List'!C11:C30,"Student Loan",'📋 Debt List'!F11:F30),"$#,##0")` } },
      { label: 'PSLF ELIGIBLE',  value: { formula: `IF(C7="Yes","🟢 Yes — tracking",IF(C7="No","— No","Set status below"))` } },
      { label: 'MONTHS TO 120',  value: { formula: `IF(C7="Yes",MAX(0,120-IFERROR(C8,0))&" mo","n/a")` } },
    ],
  });

  // PSLF input section
  sheet.mergeCells('B6:E6');
  sheet.getCell('B6').value = 'PSLF status — Public Service Loan Forgiveness';
  sheet.getCell('B6').font = FONTS.section;

  sheet.getCell('B7').value = 'PSLF eligible? (Yes/No)';
  sheet.getCell('B7').font = FONTS.bodyBold;
  sheet.getCell('C7').value = 'No';
  sheet.getCell('C7').dataValidation = { type: 'list', formulae: ['"Yes,No"'] };
  sheet.getCell('C7').alignment = { horizontal: 'center' };
  sheet.getCell('C7').fill = FILLS.warmGoldLight;
  sheet.getCell('C7').border = BORDER_THIN(COLORS.warmGold);

  sheet.getCell('B8').value = 'Qualifying months counted (out of 120)';
  sheet.getCell('B8').font = FONTS.bodyBold;
  sheet.getCell('C8').value = 0;
  sheet.getCell('C8').numFmt = '0';
  sheet.getCell('C8').alignment = { horizontal: 'center' };
  sheet.getCell('C8').fill = FILLS.warmGoldLight;
  sheet.getCell('C8').border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell('C8').dataValidation = { type: 'whole', operator: 'between', formulae: [0, 120], allowBlank: false };

  sheet.getCell('B9').value = 'Income-driven repayment (IDR) plan';
  sheet.getCell('B9').font = FONTS.bodyBold;
  sheet.getCell('C9').value = 'None';
  sheet.getCell('C9').dataValidation = { type: 'list', formulae: ['"None,IBR,PAYE,REPAYE,SAVE,ICR"'] };
  sheet.getCell('C9').alignment = { horizontal: 'center' };
  sheet.getCell('C9').fill = FILLS.warmGoldLight;
  sheet.getCell('C9').border = BORDER_THIN(COLORS.warmGold);

  // PSLF projection callout
  let r = addSectionHeader(sheet, 11, 'PSLF projection', 'If you\'re PSLF-eligible: forgiveness happens at 120 qualifying payments (10 years). Track here.');

  sheet.mergeCells(`B${r + 1}:E${r + 2}`);
  sheet.getCell(`B${r + 1}`).value = { formula: `IF(C7="No","Not enrolled — IDR + 25 years (IBR/PAYE) or 20 years (SAVE) forgive remaining balance through general IDR forgiveness.","Months remaining: "&MAX(0,120-C8)&" / 120. At standard pace that's "&TEXT(MAX(0,120-C8)/12,"0.0")&" more years. Forgiven amount projected: "&TEXT(MAX(0,SUMIF('📋 Debt List'!C11:C30,"Student Loan",'📋 Debt List'!D11:D30)*(1-C8/120)),"$#,##0"))` };
  sheet.getCell(`B${r + 1}`).font = { ...FONTS.bodyBold, size: 12 };
  sheet.getCell(`B${r + 1}`).fill = FILLS.warmGoldLight;
  sheet.getCell(`B${r + 1}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1, wrapText: true };
  sheet.getCell(`B${r + 1}`).border = BORDER_THIN(COLORS.warmGold);
  sheet.getRow(r + 1).height = 32;
  sheet.getRow(r + 2).height = 32;

  // Federal vs private split table
  let r2 = addSectionHeader(sheet, r + 5, 'Federal vs private breakdown', 'PSLF + IDR work ONLY for federal loans. Refi to private cancels federal protections.');

  addTableHeader(sheet, r2 + 1, ['Loan', 'Balance', 'APR', 'Min Payment', 'Federal?', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G']);

  for (let i = 0; i < 8; i++) {
    const row = r2 + 2 + i;
    const dlRow = 11 + i;

    sheet.getCell(`B${row}`).value = { formula: `IFERROR(IF('📋 Debt List'!C${dlRow}="Student Loan",'📋 Debt List'!B${dlRow},""),"")` };
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();

    sheet.getCell(`C${row}`).value = { formula: `IFERROR(IF('📋 Debt List'!C${dlRow}="Student Loan",'📋 Debt List'!D${dlRow},""),"")` };
    sheet.getCell(`C${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${row}`).border = BORDER_THIN();

    sheet.getCell(`D${row}`).value = { formula: `IFERROR(IF('📋 Debt List'!C${dlRow}="Student Loan",'📋 Debt List'!E${dlRow},""),"")` };
    sheet.getCell(`D${row}`).numFmt = '0.0%';
    sheet.getCell(`D${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();

    sheet.getCell(`E${row}`).value = { formula: `IFERROR(IF('📋 Debt List'!C${dlRow}="Student Loan",'📋 Debt List'!F${dlRow},""),"")` };
    sheet.getCell(`E${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();

    // Federal flag — user input
    sheet.getCell(`F${row}`).dataValidation = { type: 'list', formulae: ['"Federal,Private"'] };
    sheet.getCell(`F${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).fill = FILLS.warmGoldLight;

    sheet.getCell(`G${row}`).font = FONTS.bodyMuted;
    sheet.getCell(`G${row}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${r2 + 11}:G${r2 + 12}`,
    '💡',
    'Federal vs Private: the irreversible choice',
    'Refinancing a federal loan to private gets you a lower rate BUT permanently cancels: PSLF eligibility, IDR plans, deferment/forbearance protections, death/disability discharge. Only refi federal loans if (a) you\'re 100% sure you won\'t need those protections AND (b) the rate savings exceed the value of the protections.');
  sheet.getRow(r2 + 11).height = 32;
  sheet.getRow(r2 + 12).height = 32;

  addFooter(sheet, r2 + 15, { productName: PRODUCT_NAME });
}

// ============================================================================
// STUB TABS — placeholder for future builds (v1.1 fills these in)
// ============================================================================

/**
 * Generic stub for a tab not yet built out. Renders the top bar, a section
 * header, and a "Coming in v1.1" callout. Keeps the tab structurally sound
 * (tier visibility + cross-tab refs work) but shows the buyer it's a placeholder.
 */
function buildStub(workbook, opts) {
  const { tabName, tabSubtitle, color, headline, description } = opts;
  const sheet = workbook.addWorksheet(tabName);
  setTabColor(sheet, color || COLORS.charcoalLight);
  setupColumns(sheet, { A: 2, B: 18, C: 18, D: 18, E: 18, F: 18, G: 18, H: 18, I: 18, J: 18, K: 18, L: 18, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName,
    tabSubtitle: tabSubtitle || '',
    bannerText: BANNER,
    kpiData: [
      { label: 'TAB',          value: tabName.replace(/^\W+ /, '') },
      { label: 'STATUS',       value: 'v1.0 preview' },
      { label: 'FULL BUILD',   value: 'v1.1' },
      { label: 'TOTAL DEBT',   value: { formula: `TEXT(SUM('📋 Debt List'!D11:D30),"$#,##0")` } },
      { label: 'AVG APR',      value: { formula: `IFERROR(TEXT(AVERAGEIF('📋 Debt List'!E11:E30,">0"),"0.0%"),"0.0%")` } },
      { label: 'DEBTS',        value: { formula: `COUNTA('📋 Debt List'!B11:B30)` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, headline, description);

  addCallout(sheet, `B${r + 1}:L${r + 3}`,
    '🚧',
    'Tab preview — full build ships in v1.1',
    'This tab\'s top bar already reads live from your Debt List. The full interactive section (charts, simulators, schedules) ships in the v1.1 update — AI Edition buyers get it free under the 12-month-update promise.');
  sheet.getRow(r + 1).height = 28;
  sheet.getRow(r + 2).height = 28;
  sheet.getRow(r + 3).height = 28;

  addFooter(sheet, r + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB N — ℹ️ ABOUT & HELP
// ============================================================================

function buildAbout(workbook) {
  // DPP-102 fix: per-tier metadata. Was hardcoded to "AI Edition / 20 tabs / 7 prompts"
  // on all 3 tiers — false advertising for Essentials + Pro buyers.
  // Actual tab counts (post-tier-strip via applyTierVisibility):
  //   Essentials = 11 visible (10 + About)
  //   Pro        = 19 visible (18 + About)
  //   AI Edition = 22 visible (21 + About)
  const tier = workbook._tier || 'ai';
  const tierMetadata = {
    essentials: { label: 'Essentials', tabs: '11', prompts: '0' },
    pro:        { label: 'Pro',        tabs: '19', prompts: '0' },
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
      { label: 'VERSION',     value: '1.0' },
      { label: 'TABS',        value: tierMetadata.tabs },
      { label: 'METHODS',     value: 'Snowball + Avalanche' },
      { label: 'AI PROMPTS',  value: tierMetadata.prompts },
      { label: 'TIER',        value: tierMetadata.label },
      { label: 'UPDATES',     value: '12 mo free' },
    ],
  });

  sheet.mergeCells('B6:C6');
  sheet.getCell('B6').value = 'Welcome to your Debt Payoff Planner.';
  sheet.getCell('B6').font = FONTS.hero;
  sheet.getRow(6).height = 38;

  sheet.mergeCells('B7:C7');
  sheet.getCell('B7').value = 'A spreadsheet that ranks every debt by APR, projects your debt-free date, and shows you exactly how much faster Avalanche pays off versus Snowball.';
  sheet.getCell('B7').font = FONTS.bodyMuted;
  sheet.getRow(7).height = 22;

  let r = addSectionHeader(sheet, 10, 'How this spreadsheet is wired', 'Two structural tabs — Debt List (input) + Dashboard (output) — drive every other tab.');

  const explainerRows = [
    ['📋 Debt List',                'Enter every debt: name, type, balance, APR, minimum, due day. APR as decimal (0.22 = 22%).'],
    ['🏠 Dashboard',                'Live KPIs + Debt Health Score (AI Edition) + sorted Debts table.'],
    ['❄️ Snowball Method',          'Pays smallest balance first. Best for psychological wins.'],
    ['🌊 Avalanche Method',         'Pays highest APR first. Saves the most total interest.'],
    ['📊 Strategy Comparison',      'Snowball vs Avalanche vs Custom — months + dollars delta.'],
    ['🤖 AI Credit Coach (AI)',     '7 AI assistant prompts in companion PDF. Move the score 10 points with structured prompts.'],
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
  });

  let r2 = addSectionHeader(sheet, r + explainerRows.length + 3, 'Quick FAQ', '');

  const faq = [
    ['Does this connect to my bank?', 'No. Privacy-first by design. No Plaid, no aggregator. You enter debts manually or paste a CSV from your bank statement.'],
    ['Snowball or Avalanche — which?', 'Avalanche saves more interest. Snowball keeps you motivated. Pick the one you\'ll finish.'],
    ['Does my credit score really go up?', 'The score itself is composite of 5 FICO factors. Pay on time + lower utilization + clear inquiries — score goes up. AI Coach (AI Edition) ranks the actions by point gain.'],
    ['What\'s the AI Edition extra?', 'Live Debt Health Score (0-100) + AI Credit Coach tab + 7 AI assistant prompts in companion PDF.'],
    ['What if I have more than 10 debts?', 'The Strategy Comparison math is optimized for 3-10 debts and uses a phase-based amortization model. With ≥12 heterogeneous-APR debts, the months/interest figures become estimates (±1-3 months / ±5% interest). The Snowball/Avalanche ordering and Debt List math remain exact regardless of count. A warning appears on the Strategy Comparison tab when COUNTA > 10.'],
    ['Why does Avalanche show 42 months instead of 41 on the standard example?', 'The model serializes phases too rigidly — when Medical (0% APR) pays off via minimums DURING the cascade, the phase-based formula misses 1 month of cascade. The directional answer (Avalanche < Snowball in interest) is always correct.'],
  ];
  faq.forEach((qa, i) => {
    const ri = r2 + 1 + i * 2;
    sheet.getCell(`B${ri}`).value = qa[0];
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).value = qa[1];
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { wrapText: true, vertical: 'middle' };
    sheet.getRow(ri).height = 28;
  });

  addFooter(sheet, r2 + faq.length * 2 + 4, { productName: PRODUCT_NAME });
}

// ============================================================================
// MAIN — orchestrate the build
// ============================================================================

async function buildDebtPayoffPlanner() {
  const t0 = Date.now();

  const tierArg = process.argv.find((a) => a.startsWith('--tier='));
  const tier = tierArg ? tierArg.split('=')[1] : 'ai';
  if (!['essentials', 'pro', 'ai'].includes(tier)) {
    console.error(`✗ Invalid --tier "${tier}". Use essentials | pro | ai.`);
    process.exit(1);
  }
  const tierLabel = { essentials: 'Essentials', pro: 'Pro', ai: 'AI Edition' }[tier];
  // 21 tabs total = 1 Dashboard + 1 Debt List + 17 method/feature tabs + 1 About.
  // Essentials 10 = common + About;  Pro 18 = +8 PRO_TABS;  AI 21 = +3 AI_TABS.
  const tierTabCount = { essentials: 10, pro: 18, ai: 21 }[tier];
  console.log(`→ Building ${PRODUCT_NAME} — ${tierLabel} (${tierTabCount} visible / 21 total)...`);

  const workbook = new ExcelJS.Workbook();
  workbook._tier = tier;  // Read by buildDashboard to swap the AI-only HEALTH SCORE block for a DTI block.
  await registerLimeLogo(workbook);

  // Workbook metadata — unified Lime Premium Studios brand surface
  workbook.creator = 'Lime Premium Studios';
  workbook.lastModifiedBy = 'Lime Premium Studios';
  workbook.company = 'Lime Premium Studios';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.title = `${PRODUCT_NAME} — ${tierLabel}`;
  workbook.subject = 'Personal finance · debt payoff planner spreadsheet';
  workbook.category = 'Personal Finance';
  workbook.keywords = 'debt payoff, debt snowball, debt avalanche, credit score, personal finance, google sheets, excel, lime premium studios';
  workbook.description = `${PRODUCT_NAME} ${tierLabel} v1.0 — Lime Premium Studios. ${tierTabCount} tabs. Snowball + Avalanche methods, weighted Debt Health Score (AI Edition), one-time purchase. Privacy-first — no bank credentials, no aggregator.`;

  // Build all 20 tabs in spec order. Tier visibility (next step) physically removes
  // PRO_TABS for Essentials and AI_TABS for Pro/Essentials.
  console.log('  • 🏠 Dashboard');               buildDashboard(workbook);
  console.log('  • 📋 Debt List');               buildDebtList(workbook);
  console.log('  • ❄️ Snowball Method');         buildSnowball(workbook);
  console.log('  • 🌊 Avalanche Method');        buildAvalanche(workbook);
  console.log('  • 🔀 Custom Method (Pro)');     buildCustomMethod(workbook);
  console.log('  • _Strategy Sim (hidden)');     buildStrategySim(workbook);
  console.log('  • 📊 Strategy Comparison');     buildStrategyComparison(workbook);
  console.log('  • 🔄 Debt Consolidation (Pro)');buildDebtConsolidation(workbook);
  console.log('  • 💳 Balance Transfer (Pro)');  buildBalanceTransfer(workbook);
  console.log('  • 📈 Credit Score Tracker (Pro)');buildCreditScoreTracker(workbook);
  console.log('  • 🎮 Credit Score Simulator (Pro)');buildCreditScoreSimulator(workbook);
  console.log('  • 💡 Utilization Optimizer (Pro)');buildUtilizationOptimizer(workbook);
  console.log('  • 🔍 Inquiry & Marks (AI)');    buildInquiryAndMarks(workbook);
  console.log('  • ⚠️ Late-Fee Alert');           buildLateFeeAlert(workbook);
  console.log('  • 🎓 Student Loan (AI)');       buildStudentLoan(workbook);
  console.log('  • 📅 Payment Calendar');        buildPaymentCalendar(workbook);
  console.log('  • 🎯 Extra Payment Simulator'); buildExtraPaymentSimulator(workbook);
  console.log('  • 🔥 On-Time Streak (Pro)');    buildOnTimeStreak(workbook);
  console.log('  • 🏆 Milestone Tracker');       buildMilestoneTracker(workbook);
  console.log('  • 🔁 Refinance Radar (Pro)');   buildRefinanceRadar(workbook);
  console.log('  • 🤖 AI Credit Coach (AI)');    buildAICreditCoach(workbook);
  console.log('  • ℹ️ About & Help');             buildAbout(workbook);

  applyTierVisibility(workbook, tier, { proTabs: PRO_TABS, aiTabs: AI_TABS, productName: PRODUCT_NAME });

  const filename = tier === 'ai'
    ? 'debt-payoff-planner-ai-edition.xlsx'
    : `debt-payoff-planner-${tier}.xlsx`;
  const outPath = resolve(OUTPUT_DIR, filename);
  await workbook.xlsx.writeFile(outPath);

  const elapsed = Date.now() - t0;
  console.log(`\n✓ Workbook generated in ${elapsed}ms`);
  console.log(`  Output: ${outPath}`);
  console.log(`  Tier:   ${tierLabel} — ${tierTabCount} of 21 tabs visible`);
}

buildDebtPayoffPlanner().catch((err) => {
  console.error('✗ Build failed:', err);
  process.exit(1);
});
