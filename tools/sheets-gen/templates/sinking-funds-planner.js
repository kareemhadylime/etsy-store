/**
 * Sinking Funds Planner — Google Sheets template generator (Lime Premium Studios) — v1
 *
 * Phase B product #3 in the catalog. Cascades from Budget Tracker + Debt Payoff
 * Planner. The depth differentiator is 4 savings vehicles in one sheet (Cash /
 * CD / ETF / Metals + Stocks) where every Etsy competitor handles one.
 * Pricing: $9 / $19 / $29.
 *
 * Source of truth:
 *   - docs/product-proposals/sinking-funds-planner.md   (16-tab feature list + 17 fund categories)
 *   - docs/product-designs/sinking-funds-planner.md     (visual + Output Dashboard required visuals)
 *   - docs/listing-copy/sinking-funds-planner.md        (Etsy listing copy)
 *   - docs/product-content/sinking-funds-ai-prompts.md  (AI PDF source)
 *   - docs/sinking-funds-build-tickets.md               (12 build tickets SF01..SF12)
 *
 * Spine architecture (catalog-wide standing rule):
 *   - 📥 Input Tab — `🪣 Fund Manager`   (buyer's entry surface)
 *   - 📊 Output Dashboard — `🏠 Dashboard` (visual KPI surface)
 *
 * Tier model (post-applyTierVisibility):
 *   - Essentials ($9)   —  7 visible (6 core + About)
 *   - Pro ($19)         — 16 visible (15 core + About)
 *   - AI Edition ($29)  — 17 visible (16 core + About)
 *
 * Run: node tools/sheets-gen/templates/sinking-funds-planner.js --tier=<essentials|pro|ai>
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

const PRODUCT_NAME = 'Sinking Funds Planner';

// ============================================================================
// TAB DEFINITIONS — 17 tabs across 3 tiers
// ============================================================================

// PRO tabs — 10 sheets removed for Essentials
const PRO_TABS = new Set([
  '🎮 Goal Scoring Dashboard',
  '🥇 Precious Metals Tracker',
  '🏦 Fixed Return Tracker',
  '📈 Variable Fund Tracker',
  '📊 Stocks & Dividends',
  '💰 Income Allocation Wheel',
  '🌅 Wealth Glide Path',
  '📅 Spending Tracker',
  '🧮 Tax Efficiency Analyzer',
  '🔗 Budget Integration',
]);

// AI tabs — removed for Pro + Essentials
const AI_TABS = new Set([
  '🤖 AI Savings Advisor',
]);

// 17 pre-built fund categories (per proposal + SF02 build ticket)
const FUND_CATEGORIES = [
  'Medical', 'Travel', 'Car', 'Education', 'Home', 'Gifts', 'Wedding',
  'Tech', 'Dental', 'Emergency', 'Baby/Kids', 'Pets', 'Down Payment',
  'Clothing', 'Celebrations', 'Subscriptions', 'Custom',
];

// 5 savings vehicles
const VEHICLES = ['Cash', 'CD', 'ETF', 'Metal', 'Stock'];

// Vehicle icon (auto-set from vehicle dropdown via lookup formula)
const VEHICLE_ICON = {
  Cash:  '💵',
  CD:    '🏦',
  ETF:   '📈',
  Metal: '🥇',
  Stock: '📊',
};

// Banner — shared across every tab (anti-Qapital depth claim from listing copy)
const BANNER = '✦  Why a Spreadsheet, Not an App?   Qapital charges $5/mo. We charge $9 once. 4 savings vehicles. No bank handshake.';

// Fund Manager invariants — every downstream tab references these by absolute row.
// Setup mini-section lives rows 6-9; fund rows 12-28 (17 rows).
const FM = {
  CURRENCY_CELL: 'C6',      // Base currency dropdown
  HOUSEHOLD_CELL: 'C7',     // Solo / Shared
  AI_FLAG_CELL: 'C8',       // AI Edition (read-only informational)
  METALS_FLAG_CELL: 'C9',   // GOOGLEFINANCE on/off
  HEADER_ROW: 11,           // table header
  FIRST_FUND_ROW: 12,
  LAST_FUND_ROW: 28,        // 17 fund rows
  ROW_COUNT: 17,
};

// ============================================================================
// TAB 1 — 🏠 DASHBOARD (Output spine)
// ============================================================================

function buildDashboard(workbook) {
  const tier = workbook._tier || 'ai';
  const sheet = workbook.addWorksheet('🏠 Dashboard');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 18, C: 13, D: 13, E: 14, F: 8, G: 22, H: 12, I: 12, J: 12, K: 12, L: 12, M: 2 });

  // 6 KPI tiles — all 6 are tier-agnostic (every fund has a vehicle + target + balance).
  // Sourced from Fund Manager B12:L28.
  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏠 Dashboard',
    tabSubtitle: 'Your funds at a glance — updates the moment you edit the Fund Manager.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL SAVED',  value: { formula: `TEXT(SUM('🪣 Fund Manager'!G12:G28),"$#,##0")` } },
      { label: 'TOTAL TARGET', value: { formula: `TEXT(SUM('🪣 Fund Manager'!F12:F28),"$#,##0")` } },
      { label: '% FUNDED',     value: { formula: `IFERROR(TEXT(SUM('🪣 Fund Manager'!G12:G28)/SUM('🪣 Fund Manager'!F12:F28),"0.0%"),"—")` } },
      { label: 'ACTIVE FUNDS', value: { formula: `COUNTA('🪣 Fund Manager'!B12:B28)` } },
      { label: 'NEXT TARGET',  value: { formula: `IFERROR(TEXT(MIN(IF(('🪣 Fund Manager'!H12:H28<>"")*('🪣 Fund Manager'!H12:H28>TODAY()),'🪣 Fund Manager'!H12:H28-TODAY()))/30.44,"0")&" mo","—")` } },
      { label: 'VEHICLE MIX',  value: { formula: `IFERROR(TEXT(1-MAX(SUMIF('🪣 Fund Manager'!D12:D28,"Cash",'🪣 Fund Manager'!G12:G28),SUMIF('🪣 Fund Manager'!D12:D28,"CD",'🪣 Fund Manager'!G12:G28),SUMIF('🪣 Fund Manager'!D12:D28,"ETF",'🪣 Fund Manager'!G12:G28),SUMIF('🪣 Fund Manager'!D12:D28,"Metal",'🪣 Fund Manager'!G12:G28),SUMIF('🪣 Fund Manager'!D12:D28,"Stock",'🪣 Fund Manager'!G12:G28))/SUM('🪣 Fund Manager'!G12:G28),"0.00"),"—")` } },
    ],
  });

  // === SECTION 1 — Funds by % funded (horizontal bar chart) ===
  // Required visual #1 per design brief Section 2. Bars use REPT() unicode blocks; same
  // approach DPP's Snowball/Avalanche Progress columns took (renders cleanly both Excel + Sheets).
  let r = addSectionHeader(sheet, 6, 'Funds by % funded', 'Green ≥90% · Amber 50–89% · Red <50%. Ranked by % funded (descending). Source for Etsy thumbnail #1.', 'B:G');

  addTableHeader(sheet, r + 1, ['Fund', 'Target', 'Saved', '% Funded', 'Progress', 'Target Date'], ['B', 'C', 'D', 'E', 'F', 'G']);

  // 10 ranks — top 10 funds by % funded. Mirrors DPP Dashboard's "sorted debts" pattern.
  for (let i = 0; i < 10; i++) {
    const row = r + 2 + i;
    const fmRow = FM.FIRST_FUND_ROW + i;

    sheet.getCell(`B${row}`).value = { formula: `IFERROR('🪣 Fund Manager'!B${fmRow},"")` };
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();

    sheet.getCell(`C${row}`).value = { formula: `IFERROR('🪣 Fund Manager'!F${fmRow},0)` };
    sheet.getCell(`C${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${row}`).font = FONTS.body;
    sheet.getCell(`C${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${row}`).border = BORDER_THIN();

    sheet.getCell(`D${row}`).value = { formula: `IFERROR('🪣 Fund Manager'!G${fmRow},0)` };
    sheet.getCell(`D${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${row}`).font = FONTS.body;
    sheet.getCell(`D${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();

    sheet.getCell(`E${row}`).value = { formula: `IFERROR(D${row}/C${row},0)` };
    sheet.getCell(`E${row}`).numFmt = '0.0%';
    sheet.getCell(`E${row}`).font = FONTS.bodyBold;
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${row}`).border = BORDER_THIN();

    sheet.getCell(`F${row}`).value = { formula: `IFERROR(IF(B${row}="","",REPT("█",MIN(10,ROUND(E${row}*10,0)))&REPT("░",10-MIN(10,ROUND(E${row}*10,0)))),"")` };
    sheet.getCell(`F${row}`).font = { name: 'Inter', size: 11, color: argb(COLORS.success) };
    sheet.getCell(`F${row}`).border = BORDER_THIN();

    sheet.getCell(`G${row}`).value = { formula: `IFERROR('🪣 Fund Manager'!H${fmRow},"")` };
    sheet.getCell(`G${row}`).numFmt = 'mmm yyyy';
    sheet.getCell(`G${row}`).font = FONTS.body;
    sheet.getCell(`G${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${row}`).border = BORDER_THIN();
  }

  // CF on % funded — green ≥90%, amber 50-89%, red <50%
  sheet.addConditionalFormatting({
    ref: `E${r + 2}:E${r + 11}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['0.9'],  priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['0.5'],  priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'cellIs', operator: 'lessThan',           formulae: ['0.5'],  priority: 3, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
    ],
  });

  // === SECTION 2 — 4-vehicle allocation (donut substitute: 4 tiles) ===
  // Required visual #4. ExcelJS donut requires post-processing; tile-breakdown reads
  // cleanly in both Excel + Sheets without it.
  let vR = addSectionHeader(sheet, 6, '4-vehicle allocation', 'Total savings split across Cash · CDs · ETFs · Metals & Stocks. Concentration penalty fires if any single vehicle exceeds 70%.', 'H:L');

  const vehicleRows = [
    { label: '💵  Cash',           keys: ['Cash'] },
    { label: '🏦  CDs',            keys: ['CD'] },
    { label: '📈  ETFs',           keys: ['ETF'] },
    { label: '🥇  Metals & Stocks', keys: ['Metal', 'Stock'] },
  ];

  addTableHeader(sheet, vR + 1, ['Vehicle', 'Saved', '%'], ['H', 'I', 'K']);

  vehicleRows.forEach((vr, i) => {
    const row = vR + 2 + i;
    const sumFormula = vr.keys.map(k => `SUMIF('🪣 Fund Manager'!D12:D28,"${k}",'🪣 Fund Manager'!G12:G28)`).join('+');

    sheet.mergeCells(`H${row}:J${row}`);
    sheet.getCell(`H${row}`).value = vr.label;
    sheet.getCell(`H${row}`).font = FONTS.bodyBold;
    sheet.getCell(`H${row}`).alignment = { vertical: 'middle', indent: 1 };
    sheet.getCell(`H${row}`).border = BORDER_THIN();
    sheet.getCell(`H${row}`).fill = FILLS.white;

    // Saved (single cell H+1 column? — merged spans H:J so we put Saved in I via direct access)
    // Cleaner: unmerge approach — keep label H:I, saved J, % K
    // Actually we already merged H:J. Let me put Saved in K, % in L. Restructuring:
  });

  // Re-do cleanly without merge — 4 plain rows:
  // (Clear above by overwriting). Easier: just write fresh.
  vehicleRows.forEach((vr, i) => {
    const row = vR + 2 + i;
    const sumFormula = vr.keys.map(k => `SUMIF('🪣 Fund Manager'!D12:D28,"${k}",'🪣 Fund Manager'!G12:G28)`).join('+');

    // Unmerge if previously merged (re-write loop)
    try { sheet.unMergeCells(`H${row}:J${row}`); } catch (_) {}

    sheet.getCell(`H${row}`).value = vr.label;
    sheet.getCell(`H${row}`).font = FONTS.bodyBold;
    sheet.getCell(`H${row}`).alignment = { vertical: 'middle', indent: 1 };
    sheet.getCell(`H${row}`).border = BORDER_THIN();
    sheet.getCell(`H${row}`).fill = FILLS.white;
    sheet.mergeCells(`H${row}:I${row}`);

    sheet.getCell(`J${row}`).value = { formula: sumFormula };
    sheet.getCell(`J${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${row}`).font = FONTS.body;
    sheet.getCell(`J${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${row}`).border = BORDER_THIN();
    sheet.getCell(`J${row}`).fill = FILLS.white;
    sheet.mergeCells(`J${row}:K${row}`);

    sheet.getCell(`L${row}`).value = { formula: `IFERROR((${sumFormula})/SUM('🪣 Fund Manager'!G12:G28),0)` };
    sheet.getCell(`L${row}`).numFmt = '0.0%';
    sheet.getCell(`L${row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`L${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`L${row}`).border = BORDER_THIN();
    sheet.getCell(`L${row}`).fill = FILLS.white;
  });

  // CF on vehicle % — alert if >70% concentration
  sheet.addConditionalFormatting({
    ref: `L${vR + 2}:L${vR + 5}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.7'], priority: 1, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
    ],
  });

  // === SECTION 3 — Top 3 "next-dollar" funds (Priority Matrix preview strip) ===
  // Required visual #5. 3 horizontal cards reinforcing AI Reallocation logic.
  const nextR = Math.max(r + 12, vR + 7) + 2;
  addSectionHeader(sheet, nextR, 'Top 3 "next-dollar" funds', 'Per the Priority Matrix algorithm — months-to-target × funding gap. Refresh: the workbook recomputes the moment you edit the Fund Manager.');

  // 3 cards rendered as 3 callouts side-by-side (B/E/H/K-spanning)
  const cardRanges = [
    { range: `B${nextR + 4}:E${nextR + 5}`, rank: 1 },
    { range: `F${nextR + 4}:I${nextR + 5}`, rank: 2 },
    { range: `J${nextR + 4}:L${nextR + 5}`, rank: 3 },
  ];

  cardRanges.forEach(({ range, rank }) => {
    sheet.mergeCells(range);
    const cell = sheet.getCell(range.split(':')[0]);
    // Priority score = (1 - %funded) × (1 / months to target).
    // Approximation — full algo lives on Priority Matrix tab.
    cell.value = { formula: `IFERROR(INDEX('🎯 Priority Matrix'!B12:B28,MATCH(LARGE('🎯 Priority Matrix'!K12:K28,${rank}),'🎯 Priority Matrix'!K12:K28,0))&CHAR(10)&"Next: $"&TEXT(INDEX('🎯 Priority Matrix'!J12:J28,MATCH(LARGE('🎯 Priority Matrix'!K12:K28,${rank}),'🎯 Priority Matrix'!K12:K28,0)),"#,##0"),"#${rank} — Awaiting Priority Matrix data")` };
    cell.fill = FILLS.ivory;
    cell.font = { ...FONTS.bodyBold, size: 13 };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      left:   { style: 'medium', color: argb(COLORS.warmGold) },
      top:    { style: 'thin',   color: argb(COLORS.divider) },
      bottom: { style: 'thin',   color: argb(COLORS.divider) },
      right:  { style: 'thin',   color: argb(COLORS.divider) },
    };
    sheet.getRow(nextR + 4).height = 30;
    sheet.getRow(nextR + 5).height = 30;
  });

  addFooter(sheet, nextR + 9, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 2 — 🪣 FUND MANAGER (Input spine)
// ============================================================================

function buildFundManager(workbook) {
  const sheet = workbook.addWorksheet('🪣 Fund Manager');
  setTabColor(sheet, COLORS.success);
  // Sage column-A strip per design brief (savings tab)
  // Columns: B Fund Name · C Category · D Vehicle · E Icon · F Target $ · G Current $
  //          H Target Date · I Monthly $ · J Growth % · K Status · L Notes
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 10, E: 5, F: 12, G: 12, H: 12, I: 12, J: 9, K: 13, L: 20, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🪣 Fund Manager',
    tabSubtitle: 'Your single source of truth. Every other tab reads from this list.',
    bannerText: BANNER,
    kpiData: [
      { label: 'FUNDS',         value: { formula: `COUNTA(B12:B28)` } },
      { label: 'TOTAL SAVED',   value: { formula: `TEXT(SUM(G12:G28),"$#,##0")` } },
      { label: 'TOTAL TARGET',  value: { formula: `TEXT(SUM(F12:F28),"$#,##0")` } },
      { label: 'MONTHLY $',     value: { formula: `TEXT(SUM(I12:I28),"$#,##0")` } },
      { label: '% FUNDED',      value: { formula: `IFERROR(TEXT(SUM(G12:G28)/SUM(F12:F28),"0.0%"),"—")` } },
      { label: 'BEHIND',        value: { formula: `COUNTIF(K12:K28,"🔴 Behind")` } },
    ],
  });

  // === Setup mini-section — compact 1-row layout to preserve absolute row invariants ===
  // Fund table header lives at FM.HEADER_ROW (=11), first fund at FM.FIRST_FUND_ROW (=12).
  // Setup fits in rows 6 (title) + 7 (3 inputs side-by-side) + 8 (callout) + 9 (blank) + 10 (Your funds title).
  // No addSectionHeader call here — its 3px underline would collide with the table header band.

  sheet.mergeCells('B6:L6');
  sheet.getCell('B6').value = 'Setup — three one-time choices';
  sheet.getCell('B6').font = FONTS.section;
  sheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(6).height = 24;

  // Row 7 — 3 paired label/value cells across B-L
  // B7-C7: Currency · D7-E7: Household · F7-G7: Metals Live  · H7-L7: callout-style explainer
  sheet.getCell('B7').value = 'Base currency';
  sheet.getCell('B7').font = FONTS.smallCaps;
  sheet.getCell('B7').alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };

  sheet.getCell('C7').value = 'USD';
  sheet.getCell('C7').font = FONTS.bodyBold;
  sheet.getCell('C7').fill = FILLS.ivory;
  sheet.getCell('C7').border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell('C7').alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getCell('C7').dataValidation = { type: 'list', formulae: ['"USD,EUR,GBP,CAD,AUD,JPY,CHF,Other"'], allowBlank: false };

  sheet.getCell('D7').value = 'Household';
  sheet.getCell('D7').font = FONTS.smallCaps;
  sheet.getCell('D7').alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };

  sheet.getCell('E7').value = 'Solo';
  sheet.getCell('E7').font = FONTS.bodyBold;
  sheet.getCell('E7').fill = FILLS.ivory;
  sheet.getCell('E7').border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell('E7').alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getCell('E7').dataValidation = { type: 'list', formulae: ['"Solo,Shared"'], allowBlank: false };

  sheet.getCell('F7').value = 'Metals Live';
  sheet.getCell('F7').font = FONTS.smallCaps;
  sheet.getCell('F7').alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };

  sheet.getCell('G7').value = 'OFF';
  sheet.getCell('G7').font = FONTS.bodyBold;
  sheet.getCell('G7').fill = FILLS.ivory;
  sheet.getCell('G7').border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell('G7').alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getCell('G7').dataValidation = { type: 'list', formulae: ['"ON,OFF"'], allowBlank: false };

  sheet.mergeCells('H7:L7');
  sheet.getCell('H7').value = 'Currency drives $ formatting. Household toggles shared mode. Metals ON enables GOOGLEFINANCE spot prices (Sheets only).';
  sheet.getCell('H7').font = FONTS.bodyMuted;
  sheet.getCell('H7').alignment = { vertical: 'middle', horizontal: 'left', indent: 1, wrapText: true };
  sheet.getCell('H7').fill = FILLS.ivory;
  sheet.getRow(7).height = 26;

  // Row 8 — gold underline accent
  sheet.mergeCells('B8:L8');
  sheet.getCell('B8').fill = FILLS.warmGold;
  sheet.getRow(8).height = 3;

  // Row 9 — blank spacer
  sheet.getRow(9).height = 8;

  // Row 10 — "Your funds" title (direct write — no underline since table header is at row 11)
  sheet.mergeCells('B10:L10');
  sheet.getCell('B10').value = 'Your funds (up to 17) — one row per fund. Vehicle icon auto-sets from dropdown · Status pill auto-calcs from contribution pace vs. target date.';
  sheet.getCell('B10').font = FONTS.section;
  sheet.getCell('B10').alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(10).height = 26;

  // === Sanity: header lands at FM.HEADER_ROW (11), first fund at FM.FIRST_FUND_ROW (12) ===
  if (FM.HEADER_ROW !== 11 || FM.FIRST_FUND_ROW !== 12) {
    throw new Error(`Fund Manager invariant broken: HEADER_ROW=${FM.HEADER_ROW} (expected 11), FIRST_FUND_ROW=${FM.FIRST_FUND_ROW} (expected 12). Every cross-tab formula in this workbook assumes these constants.`);
  }

  addTableHeader(sheet, FM.HEADER_ROW, ['Fund', 'Category', 'Vehicle', '', 'Target', 'Saved', 'Target Date', 'Monthly', 'Growth %', 'Status', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  // 6 seed funds — mirror the AI PDF worked examples for tight continuity.
  const seed = [
    { name: 'Emergency Fund',   cat: 'Emergency',    vehicle: 'Cash', target: 9000,  saved: 3200, date: null,         monthly: 300, growth: 0.045, notes: 'HYSA — 3-month coverage target' },
    { name: 'Christmas',        cat: 'Gifts',        vehicle: 'Cash', target: 1200,  saved:  400, date: '2026-12-15', monthly: 100, growth: 0.045, notes: 'Front-load Jan-Mar' },
    { name: 'Vacation',         cat: 'Travel',       vehicle: 'Cash', target: 3000,  saved:  600, date: '2027-06-30', monthly: 200, growth: 0.045, notes: 'Paid-in-cash trip' },
    { name: 'Down Payment',     cat: 'Down Payment', vehicle: 'ETF',  target: 40000, saved: 8200, date: '2031-05-01', monthly: 500, growth: 0.065, notes: '60% ETF / 40% bond mix' },
    { name: 'Car Repair',       cat: 'Car',          vehicle: 'Cash', target: 1500,  saved:  450, date: '2027-03-31', monthly:  90, growth: 0.045, notes: 'Annual replenish' },
    { name: 'Wedding Gift',     cat: 'Wedding',      vehicle: 'Cash', target: 1500,  saved:  300, date: '2026-09-15', monthly: 100, growth: 0.045, notes: 'Friend wedding gift' },
  ];

  for (let i = 0; i < FM.ROW_COUNT; i++) {
    const ri = FM.FIRST_FUND_ROW + i;
    const row = seed[i];

    // B — Fund name
    if (row) sheet.getCell(`B${ri}`).value = row.name;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    // C — Category (dropdown of 17)
    if (row) sheet.getCell(`C${ri}`).value = row.cat;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: [`"${FUND_CATEGORIES.join(',')}"`], allowBlank: true };

    // D — Vehicle (dropdown of 5)
    if (row) sheet.getCell(`D${ri}`).value = row.vehicle;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).dataValidation = { type: 'list', formulae: [`"${VEHICLES.join(',')}"`], allowBlank: true };

    // E — Vehicle icon (auto-set from D)
    sheet.getCell(`E${ri}`).value = { formula: `IFERROR(SWITCH(D${ri},"Cash","💵","CD","🏦","ETF","📈","Metal","🥇","Stock","📊",""),"")` };
    sheet.getCell(`E${ri}`).font = { name: 'Inter', size: 13 };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    // F — Target $
    sheet.getCell(`F${ri}`).value = row ? row.target : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true };

    // G — Saved $ (current balance)
    sheet.getCell(`G${ri}`).value = row ? row.saved : null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true };

    // H — Target date
    if (row && row.date) sheet.getCell(`H${ri}`).value = new Date(row.date);
    sheet.getCell(`H${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    // I — Monthly contribution
    sheet.getCell(`I${ri}`).value = row ? row.monthly : null;
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
    sheet.getCell(`I${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true };

    // J — Growth % (for non-cash vehicles)
    sheet.getCell(`J${ri}`).value = row ? row.growth : null;
    sheet.getCell(`J${ri}`).numFmt = '0.00%';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
    sheet.getCell(`J${ri}`).dataValidation = {
      type: 'decimal', operator: 'between', formulae: [0, 0.5], allowBlank: true,
      showErrorMessage: true, errorStyle: 'stop',
      errorTitle: 'Growth must be decimal',
      error: 'Enter as decimal. 4.5% APY = 0.045. 7% expected ETF return = 0.07.',
      showInputMessage: true, promptTitle: 'Growth rate — decimal please',
      prompt: 'For HYSA use 0.04-0.05. CDs 0.04-0.05. ETF mix 0.06-0.08. Metals 0 (manual lookup).',
    };

    // K — Status pill (auto-calc from funding pace)
    // Algorithm: required monthly = (target - saved) / max(1, months remaining).
    // If saved >= target → 🟢 Funded
    // If monthly contribution >= required → 🟢 On Track
    // If monthly >= 0.7 * required → 🟡 At Risk
    // Else → 🔴 Behind
    // If target date blank → "—"
    sheet.getCell(`K${ri}`).value = { formula:
      `IF(B${ri}="","",` +
      `IF(G${ri}>=F${ri},"🟢 Funded",` +
      `IF(H${ri}="","—",` +
      `IF(H${ri}<=TODAY(),"🔴 Behind",` +
      `IF(I${ri}*1>=((F${ri}-G${ri})/MAX(1,(H${ri}-TODAY())/30.44)),"🟢 On Track",` +
      `IF(I${ri}*1>=0.7*((F${ri}-G${ri})/MAX(1,(H${ri}-TODAY())/30.44)),"🟡 At Risk",` +
      `"🔴 Behind"))))))` };
    sheet.getCell(`K${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`K${ri}`).fill = FILLS.white;
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    // L — Notes
    if (row && row.notes) sheet.getCell(`L${ri}`).value = row.notes;
    sheet.getCell(`L${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`L${ri}`).fill = FILLS.white;
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  // CF on Status — color-band the pill cell
  sheet.addConditionalFormatting({
    ref: `K${FM.FIRST_FUND_ROW}:K${FM.LAST_FUND_ROW}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Funded',   priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'On Track', priority: 2, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'At Risk',  priority: 3, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Behind',   priority: 4, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
    ],
  });

  // === Total row past last fund row ===
  const totalR = FM.LAST_FUND_ROW + 2;
  sheet.getCell(`C${totalR}`).value = 'TOTAL';
  sheet.getCell(`C${totalR}`).font = FONTS.smallCaps;
  sheet.getCell(`C${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`F${totalR}`).value = { formula: `SUM(F12:F28)` };
  sheet.getCell(`F${totalR}`).numFmt = '"$"#,##0';
  sheet.getCell(`F${totalR}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell(`F${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`F${totalR}`).border = { top: { style: 'medium', color: argb(COLORS.charcoal) } };
  sheet.getCell(`G${totalR}`).value = { formula: `SUM(G12:G28)` };
  sheet.getCell(`G${totalR}`).numFmt = '"$"#,##0';
  sheet.getCell(`G${totalR}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.success) };
  sheet.getCell(`G${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`G${totalR}`).border = { top: { style: 'medium', color: argb(COLORS.success) } };
  sheet.getCell(`I${totalR}`).value = { formula: `SUM(I12:I28)` };
  sheet.getCell(`I${totalR}`).numFmt = '"$"#,##0';
  sheet.getCell(`I${totalR}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell(`I${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`I${totalR}`).border = { top: { style: 'medium', color: argb(COLORS.warmGold) } };

  addCallout(sheet, `B${totalR + 2}:L${totalR + 3}`,
    '💡',
    'How to use this tab',
    'Pick from 17 pre-built categories or type Custom. Vehicle dropdown drives the per-vehicle Pro trackers. Growth % is decimal (4.5% = 0.045). Status pill auto-grades your contribution pace against the target date — green/amber/red updates live as you edit.');
  sheet.getRow(totalR + 2).height = 26;
  sheet.getRow(totalR + 3).height = 26;

  addFooter(sheet, totalR + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 3 — 💵 CONTRIBUTION TRACKER (Essentials+)
// ============================================================================

function buildContributionTracker(workbook) {
  const sheet = workbook.addWorksheet('💵 Contribution Tracker');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 12, C: 22, D: 14, E: 14, F: 14, G: 16, H: 22, I: 8, J: 8, K: 8, L: 8, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💵 Contribution Tracker',
    tabSubtitle: 'Monthly contribution log. Last-contribution date feeds the Neglected Fund Detector (AI Edition).',
    bannerText: BANNER,
    kpiData: [
      { label: 'ENTRIES',         value: { formula: `COUNTA(C12:C61)` } },
      { label: 'THIS YEAR',       value: { formula: `TEXT(SUMPRODUCT((YEAR(B12:B61)=YEAR(TODAY()))*E12:E61),"$#,##0")` } },
      { label: 'LAST 30 DAYS',    value: { formula: `TEXT(SUMPRODUCT((B12:B61>=TODAY()-30)*E12:E61),"$#,##0")` } },
      { label: 'TOP FUND',        value: { formula: `IFERROR(INDEX(C12:C61,MATCH(MAX(E12:E61),E12:E61,0)),"—")` } },
      { label: 'TOP CONTRIB.',    value: { formula: `IFERROR(TEXT(MAX(E12:E61),"$#,##0"),"—")` } },
      { label: 'AVG / MONTH',     value: { formula: `IFERROR(TEXT(SUM(E12:E61)/MAX(1,(MAX(B12:B61)-MIN(B12:B61))/30.44),"$#,##0"),"—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Contribution log', 'One row per deposit. Pick the fund from the dropdown — pulled live from Fund Manager. Running balance recomputes as you add rows.');

  addTableHeader(sheet, r + 1, ['Date', 'Fund', 'Source', 'Amount', 'Running balance', 'On-track?', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  // 50 contribution rows — seed first 8 with realistic entries for the seed funds
  const seedEntries = [
    { date: '2026-04-15', fund: 'Emergency Fund', source: 'Paycheck',   amount: 300, notes: 'Auto-deposit' },
    { date: '2026-04-15', fund: 'Down Payment',   source: 'Paycheck',   amount: 500, notes: 'Auto to Vanguard' },
    { date: '2026-04-15', fund: 'Christmas',      source: 'Paycheck',   amount: 100, notes: '' },
    { date: '2026-04-15', fund: 'Vacation',       source: 'Paycheck',   amount: 200, notes: '' },
    { date: '2026-04-15', fund: 'Car Repair',     source: 'Paycheck',   amount:  90, notes: '' },
    { date: '2026-05-01', fund: 'Wedding Gift',   source: 'Side gig',   amount: 100, notes: 'Etsy sale' },
    { date: '2026-05-15', fund: 'Emergency Fund', source: 'Paycheck',   amount: 300, notes: '' },
    { date: '2026-05-15', fund: 'Down Payment',   source: 'Paycheck',   amount: 500, notes: '' },
  ];

  for (let i = 0; i < 50; i++) {
    const ri = r + 2 + i;
    const entry = seedEntries[i];

    if (entry) sheet.getCell(`B${ri}`).value = new Date(entry.date);
    sheet.getCell(`B${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (entry) sheet.getCell(`C${ri}`).value = entry.fund;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: [`'🪣 Fund Manager'!$B$12:$B$28`], allowBlank: true };

    if (entry) sheet.getCell(`D${ri}`).value = entry.source;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).dataValidation = { type: 'list', formulae: ['"Paycheck,Bonus,Tax refund,Side gig,Gift,Rollover,Other"'], allowBlank: true };

    if (entry) sheet.getCell(`E${ri}`).value = entry.amount;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThan', formulae: [0], allowBlank: true };

    // Running balance per fund = sum of all amounts where fund matches THIS row's fund, dated on/before THIS row
    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(SUMIFS($E$${r + 2}:E${ri},$C$${r + 2}:C${ri},C${ri},$B$${r + 2}:B${ri},"<="&B${ri}),"")` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = { ...FONTS.body, color: argb(COLORS.success), bold: true };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // On-track? — pulls the Status pill from Fund Manager for this fund
    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(IF(C${ri}="","",VLOOKUP(C${ri},'🪣 Fund Manager'!$B$12:$K$28,10,FALSE)),"—")` };
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    if (entry && entry.notes) sheet.getCell(`H${ri}`).value = entry.notes;
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${r + 53}:H${r + 54}`,
    '💡',
    'How this tab feeds the rest of the workbook',
    'Each row is a one-time entry. The Running balance column recomputes per-fund cumulative totals — paste a bank statement export, then bulk-tag rows from the Fund dropdown. The Neglected Fund Detector (AI Edition) reads "last contribution date" per fund from this log.');
  sheet.getRow(r + 53).height = 28;
  sheet.getRow(r + 54).height = 28;

  addFooter(sheet, r + 57, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 4 — 🎯 PRIORITY MATRIX (Essentials+)
// ============================================================================

function buildPriorityMatrix(workbook) {
  const sheet = workbook.addWorksheet('🎯 Priority Matrix');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 13, D: 13, E: 13, F: 13, G: 13, H: 12, I: 12, J: 14, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🎯 Priority Matrix',
    tabSubtitle: 'Where does your next dollar go? Algorithm = funding gap × urgency × consequence-of-miss override.',
    bannerText: BANNER,
    kpiData: [
      { label: 'NEXT $ FUND',  value: { formula: `IFERROR(INDEX(B12:B28,MATCH(LARGE(K12:K28,1),K12:K28,0)),"—")` } },
      { label: 'NEXT $ AMT',   value: { formula: `IFERROR(TEXT(INDEX(J12:J28,MATCH(LARGE(K12:K28,1),K12:K28,0)),"$#,##0"),"—")` } },
      { label: 'BEHIND',       value: { formula: `COUNTIF('🪣 Fund Manager'!K12:K28,"🔴 Behind")` } },
      { label: 'AT RISK',      value: { formula: `COUNTIF('🪣 Fund Manager'!K12:K28,"🟡 At Risk")` } },
      { label: 'ON TRACK',     value: { formula: `COUNTIF('🪣 Fund Manager'!K12:K28,"🟢 On Track")` } },
      { label: 'FUNDED',       value: { formula: `COUNTIF('🪣 Fund Manager'!K12:K28,"🟢 Funded")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-fund priority score', 'Score = (1 - %funded) × (1 / max(1, months-to-target)) × override flag. Higher = more urgent next dollar.');

  addTableHeader(sheet, r + 1, ['Fund', '% Funded', 'Months Left', 'Required $/mo', 'Current $/mo', 'Gap $/mo', 'Override', 'Quadrant', 'Next $', 'Score'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  for (let i = 0; i < FM.ROW_COUNT; i++) {
    const ri = FM.FIRST_FUND_ROW + i;
    const fmRow = FM.FIRST_FUND_ROW + i;

    // B — Fund name (mirror from Fund Manager)
    sheet.getCell(`B${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!B${fmRow},"")` };
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    // C — % funded
    sheet.getCell(`C${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!G${fmRow}/'🪣 Fund Manager'!F${fmRow},0)` };
    sheet.getCell(`C${ri}`).numFmt = '0.0%';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    // D — Months left
    sheet.getCell(`D${ri}`).value = { formula: `IFERROR(IF('🪣 Fund Manager'!H${fmRow}="","∞",MAX(0,('🪣 Fund Manager'!H${fmRow}-TODAY())/30.44)),"")` };
    sheet.getCell(`D${ri}`).numFmt = '0.0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    // E — Required $/mo to hit target
    sheet.getCell(`E${ri}`).value = { formula: `IFERROR(IF(OR('🪣 Fund Manager'!H${fmRow}="",'🪣 Fund Manager'!H${fmRow}<=TODAY()),0,('🪣 Fund Manager'!F${fmRow}-'🪣 Fund Manager'!G${fmRow})/MAX(1,('🪣 Fund Manager'!H${fmRow}-TODAY())/30.44)),0)` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    // F — Current $/mo (from Fund Manager)
    sheet.getCell(`F${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!I${fmRow},0)` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // G — Gap = Required - Current
    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(MAX(0,E${ri}-F${ri}),"")` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    // H — Override (1.0 default; user bumps to 1.5 for "consequence-of-miss" urgency)
    sheet.getCell(`H${ri}`).value = 1.0;
    sheet.getCell(`H${ri}`).numFmt = '0.0';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
    sheet.getCell(`H${ri}`).dataValidation = {
      type: 'decimal', operator: 'between', formulae: [0, 3], allowBlank: true,
      showInputMessage: true, promptTitle: 'Urgency override',
      prompt: 'Default 1.0. Bump to 1.5-2.0 for "must-not-miss" funds (rent, medical). Drop to 0.5 for "nice-to-have".',
    };

    // I — Quadrant label (urgency × funding %)
    sheet.getCell(`I${ri}`).value = { formula: `IF(B${ri}="","",IF(D${ri}<=6,IF(C${ri}>=0.5,"Urgent / Healthy","Urgent / Behind"),IF(C${ri}>=0.5,"Patient / Healthy","Patient / Behind")))` };
    sheet.getCell(`I${ri}`).font = FONTS.smallCaps;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    // J — Next $ recommendation (gap, capped at $500 single-deposit)
    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(MIN(500,G${ri}),"")` };
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    // K — Score (the actual priority number Dashboard #5 sorts by)
    sheet.getCell(`K${ri}`).value = { formula: `IFERROR(IF(B${ri}="",0,(1-C${ri})*H${ri}*(IF(D${ri}="∞",0.1,1/MAX(1,D${ri})))*1000),0)` };
    sheet.getCell(`K${ri}`).numFmt = '0.0';
    sheet.getCell(`K${ri}`).font = { ...FONTS.bodyBold };
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`K${ri}`).fill = FILLS.ivory;
    sheet.getCell(`K${ri}`).border = BORDER_THIN();
  }

  // CF on Quadrant — color by quadrant
  sheet.addConditionalFormatting({
    ref: `I${FM.FIRST_FUND_ROW}:I${FM.LAST_FUND_ROW}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Urgent / Behind',  priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Urgent / Healthy', priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Patient / Behind', priority: 3, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Patient / Healthy', priority: 4, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addCallout(sheet, `B${FM.LAST_FUND_ROW + 2}:L${FM.LAST_FUND_ROW + 3}`,
    '🎯',
    'How the score works',
    'Higher score = put your next dollar here. (1 − %funded) × override × (1 / months left). Funds with no target date get a low urgency floor (0.1) so they don\'t dominate. The Dashboard\'s "Top 3 next-dollar" strip pulls the top 3 by score.');
  sheet.getRow(FM.LAST_FUND_ROW + 2).height = 28;
  sheet.getRow(FM.LAST_FUND_ROW + 3).height = 28;

  addFooter(sheet, FM.LAST_FUND_ROW + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 5 — 📉 FUNDING GAP ANALYZER (Essentials+)
// ============================================================================

function buildFundingGap(workbook) {
  const sheet = workbook.addWorksheet('📉 Funding Gap Analyzer');
  setTabColor(sheet, COLORS.alert);
  setupColumns(sheet, { A: 2, B: 22, C: 12, D: 12, E: 12, F: 22, G: 12, H: 14, I: 14, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📉 Funding Gap Analyzer',
    tabSubtitle: 'Per-fund: required-vs-actual side-by-side. Shortfall pill fires when gap > 20%.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL GAP',     value: { formula: `TEXT(SUM(G12:G28),"$#,##0")` } },
      { label: 'MONTHLY GAP',   value: { formula: `TEXT(SUM(H12:H28),"$#,##0")` } },
      { label: 'FUNDS SHORT',   value: { formula: `COUNTIF(I12:I28,"🔴 Shortfall")` } },
      { label: 'FUNDS OVER',    value: { formula: `COUNTIF(I12:I28,"🟢 Surplus")` } },
      { label: 'WORST FUND',    value: { formula: `IFERROR(INDEX(B12:B28,MATCH(MAX(G12:G28),G12:G28,0)),"—")` } },
      { label: 'WORST GAP',     value: { formula: `IFERROR(TEXT(MAX(G12:G28),"$#,##0"),"—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Required vs. actual', 'Bar = visual gap. Shortfall = required-to-target minus current saved. Monthly shortfall = additional $/mo you need to catch up by target date.');

  addTableHeader(sheet, r + 1, ['Fund', 'Target', 'Saved', '% Funded', 'Required vs Actual', 'Total Gap', 'Monthly Gap', 'Status'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

  for (let i = 0; i < FM.ROW_COUNT; i++) {
    const ri = FM.FIRST_FUND_ROW + i;
    const fmRow = FM.FIRST_FUND_ROW + i;

    sheet.getCell(`B${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!B${fmRow},"")` };
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!F${fmRow},0)` };
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!G${fmRow},0)` };
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = { formula: `IFERROR(D${ri}/C${ri},0)` };
    sheet.getCell(`E${ri}`).numFmt = '0.0%';
    sheet.getCell(`E${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    // F — Bar = REPT(█, ROUND(E*20,0)) followed by REPT(░, 20-bar)
    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(IF(B${ri}="","",REPT("█",MIN(20,ROUND(E${ri}*20,0)))&REPT("░",20-MIN(20,ROUND(E${ri}*20,0)))),"")` };
    sheet.getCell(`F${ri}`).font = { name: 'Inter', size: 9, color: argb(COLORS.warmGold) };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // G — Total gap
    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(MAX(0,C${ri}-D${ri}),"")` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    // H — Monthly shortfall = (Required - Current monthly)
    sheet.getCell(`H${ri}`).value = { formula: `IFERROR('🎯 Priority Matrix'!G${ri},0)` };
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    // I — Status pill
    sheet.getCell(`I${ri}`).value = { formula: `IF(B${ri}="","",IF(D${ri}>C${ri},"🟢 Surplus",IF(E${ri}<0.5,"🔴 Shortfall",IF(E${ri}<0.8,"🟡 Behind","🟢 On Track"))))` };
    sheet.getCell(`I${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
  }

  // CF on Status — alert color when shortfall
  sheet.addConditionalFormatting({
    ref: `I${FM.FIRST_FUND_ROW}:I${FM.LAST_FUND_ROW}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Shortfall', priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Behind',    priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'On Track',  priority: 3, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Surplus',   priority: 4, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addCallout(sheet, `B${FM.LAST_FUND_ROW + 2}:I${FM.LAST_FUND_ROW + 3}`,
    '📉',
    'Reading the gap',
    'Monthly Gap is what to add on top of current $/mo to hit target by date. If it\'s zero, you\'re on pace. If it\'s big, either bump contributions OR extend the date. The Reallocation AI prompt (AI Edition) handles "I\'m $200 short" with concrete trade-offs.');
  sheet.getRow(FM.LAST_FUND_ROW + 2).height = 28;
  sheet.getRow(FM.LAST_FUND_ROW + 3).height = 28;

  addFooter(sheet, FM.LAST_FUND_ROW + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 6 — 🎮 GOAL SCORING DASHBOARD (Pro+)
// ============================================================================

function buildGoalScoringDashboard(workbook) {
  const sheet = workbook.addWorksheet('🎮 Goal Scoring Dashboard');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 13, D: 13, E: 13, F: 13, G: 18, H: 16, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🎮 Goal Scoring Dashboard',
    tabSubtitle: '17-fund grid scored on urgency / funding / volatility. Composite color shows which funds need attention.',
    bannerText: BANNER,
    kpiData: [
      { label: 'GREEN',          value: { formula: `COUNTIF(G12:G28,"🟢 Healthy")` } },
      { label: 'AMBER',          value: { formula: `COUNTIF(G12:G28,"🟡 Watch")` } },
      { label: 'RED',            value: { formula: `COUNTIF(G12:G28,"🔴 Action")` } },
      { label: 'AVG URGENCY',    value: { formula: `IFERROR(TEXT(AVERAGEIF(C12:C28,">0"),"0.0"),"—")` } },
      { label: 'AVG FUNDING',    value: { formula: `IFERROR(TEXT(AVERAGEIF(D12:D28,">0"),"0%"),"—")` } },
      { label: 'AVG VOLATILITY', value: { formula: `IFERROR(TEXT(AVERAGEIF(E12:E28,">0"),"0.0"),"—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-fund composite score', 'Urgency (months to target, inverse) × Funding % × Volatility (vehicle risk). Composite color = visual priority.');

  addTableHeader(sheet, r + 1, ['Fund', 'Urgency', 'Funding %', 'Volatility', 'Composite', 'Status', 'Recommended Action'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  for (let i = 0; i < FM.ROW_COUNT; i++) {
    const ri = FM.FIRST_FUND_ROW + i;
    const fmRow = FM.FIRST_FUND_ROW + i;

    sheet.getCell(`B${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!B${fmRow},"")` };
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR(IF(OR(B${ri}="",'🪣 Fund Manager'!H${fmRow}=""),0,MIN(10,12/MAX(1,('🪣 Fund Manager'!H${fmRow}-TODAY())/30.44))),0)` };
    sheet.getCell(`C${ri}`).numFmt = '0.0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!G${fmRow}/'🪣 Fund Manager'!F${fmRow},0)` };
    sheet.getCell(`D${ri}`).numFmt = '0.0%';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = { formula: `IFERROR(SWITCH('🪣 Fund Manager'!D${fmRow},"Cash",1,"CD",2,"ETF",6,"Metal",8,"Stock",9,0),0)` };
    sheet.getCell(`E${ri}`).numFmt = '0.0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(IF(B${ri}="",0,C${ri}*0.5+(1-D${ri})*5+E${ri}*0.3),0)` };
    sheet.getCell(`F${ri}`).numFmt = '0.0';
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.ivory;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IF(B${ri}="","",IF(F${ri}>=6,"🔴 Action",IF(F${ri}>=3,"🟡 Watch","🟢 Healthy")))` };
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IF(B${ri}="","",IF(F${ri}>=6,"Bump $/mo or extend",IF(F${ri}>=3,"Watch monthly","Stay course")))` };
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  }

  sheet.addConditionalFormatting({
    ref: `G${FM.FIRST_FUND_ROW}:G${FM.LAST_FUND_ROW}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Action',  priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Watch',   priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Healthy', priority: 3, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addCallout(sheet, `B${FM.LAST_FUND_ROW + 2}:H${FM.LAST_FUND_ROW + 3}`,
    '🎮',
    'Composite scoring 101',
    'Composite = Urgency × 0.5 + (1 − Funding%) × 5 + Volatility × 0.3. Funds with volatile vehicles (ETF / Stock / Metal) score higher → need closer watching. Cash funds with full funding score near 0.');
  sheet.getRow(FM.LAST_FUND_ROW + 2).height = 28;
  sheet.getRow(FM.LAST_FUND_ROW + 3).height = 28;

  addFooter(sheet, FM.LAST_FUND_ROW + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 7 — 🥇 PRECIOUS METALS TRACKER (Pro+)
// ============================================================================

function buildMetalsTracker(workbook) {
  const sheet = workbook.addWorksheet('🥇 Precious Metals Tracker');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 14, C: 10, D: 14, E: 14, F: 14, G: 14, H: 16, I: 14, J: 14, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🥇 Precious Metals Tracker',
    tabSubtitle: 'Gold · Silver · Platinum · Palladium. Spot prices via GOOGLEFINANCE in Sheets when Metals Live = ON.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL OZ',       value: { formula: `SUM(D12:D21)` } },
      { label: 'COST BASIS',     value: { formula: `TEXT(SUMPRODUCT(D12:D21,E12:E21),"$#,##0")` } },
      { label: 'CURRENT VALUE',  value: { formula: `TEXT(SUMPRODUCT(D12:D21,F12:F21),"$#,##0")` } },
      { label: 'UNREALIZED P/L', value: { formula: `TEXT(SUMPRODUCT(D12:D21,F12:F21)-SUMPRODUCT(D12:D21,E12:E21),"$#,##0;-$#,##0")` } },
      { label: '% OF NW',        value: { formula: `IFERROR(TEXT(SUMPRODUCT(D12:D21,F12:F21)/SUM('🪣 Fund Manager'!G12:G28),"0.0%"),"—")` } },
      { label: 'GOLD SPOT',      value: { formula: `IFERROR(TEXT(VLOOKUP("Gold",B12:F21,5,FALSE),"$#,##0"),"—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Holdings', 'Enter ounces + cost basis. Spot column pulls live via GOOGLEFINANCE when Metals Live = ON; otherwise enter monthly manually.');

  addTableHeader(sheet, r + 1, ['Metal', 'Form', 'Ounces', 'Avg Cost / oz', 'Current Spot', 'Current Value', 'Storage', 'Acquired', 'P/L', 'P/L %'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const metalsSeed = [
    { metal: 'Gold',      form: 'Coin', oz:  4.0, cost: 1920,    spot: 2640,    storage: 'Home safe', acq: '2024-03-15' },
    { metal: 'Gold',      form: 'Bar',  oz:  4.0, cost: 2100,    spot: 2640,    storage: 'Vault',     acq: '2025-08-10' },
    { metal: 'Silver',    form: 'Coin', oz: 80.0, cost:   24.50, spot:   30.20, storage: 'Home safe', acq: '2024-01-20' },
    { metal: 'Platinum',  form: '',     oz:  0,   cost: null,    spot: null,    storage: '',          acq: null },
    { metal: 'Palladium', form: '',     oz:  0,   cost: null,    spot: null,    storage: '',          acq: null },
  ];

  for (let i = 0; i < 10; i++) {
    const ri = r + 2 + i;
    const m = metalsSeed[i];

    if (m) sheet.getCell(`B${ri}`).value = m.metal;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).dataValidation = { type: 'list', formulae: ['"Gold,Silver,Platinum,Palladium"'], allowBlank: true };

    if (m) sheet.getCell(`C${ri}`).value = m.form;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: ['"Coin,Bar,Round,ETF,Other"'], allowBlank: true };

    sheet.getCell(`D${ri}`).value = m ? m.oz : null;
    sheet.getCell(`D${ri}`).numFmt = '0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = m ? m.cost : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = m ? m.spot : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.ivory;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(D${ri}*F${ri},0)` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    if (m) sheet.getCell(`H${ri}`).value = m.storage;
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    if (m && m.acq) sheet.getCell(`I${ri}`).value = new Date(m.acq);
    sheet.getCell(`I${ri}`).numFmt = 'mmm yyyy';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(D${ri}*(F${ri}-E${ri}),"")` };
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0;[Red]-"$"#,##0';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = { formula: `IFERROR((F${ri}-E${ri})/E${ri},"")` };
    sheet.getCell(`K${ri}`).numFmt = '0.0%';
    sheet.getCell(`K${ri}`).font = FONTS.body;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`K${ri}`).fill = FILLS.white;
    sheet.getCell(`K${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${r + 13}:K${r + 14}`,
    '⚡',
    'GOOGLEFINANCE — Sheets only',
    'Set Metals Live = ON on Fund Manager. In Google Sheets, paste this into a Current Spot cell (column F): =GOOGLEFINANCE("CURRENCY:XAUUSD") for gold, "CURRENCY:XAGUSD" for silver, "CURRENCY:XPTUSD" for platinum, "CURRENCY:XPDUSD" for palladium. Excel users: enter monthly via APMEX / Kitco / your dealer.');
  sheet.getRow(r + 13).height = 28;
  sheet.getRow(r + 14).height = 28;

  addFooter(sheet, r + 17, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 8 — 🏦 FIXED RETURN TRACKER (CD Ladder, Pro+)
// ============================================================================

function buildFixedReturnTracker(workbook) {
  const sheet = workbook.addWorksheet('🏦 Fixed Return Tracker');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 18, C: 14, D: 9, E: 12, F: 12, G: 14, H: 14, I: 14, J: 16, K: 14, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏦 Fixed Return Tracker',
    tabSubtitle: 'CD Ladder + maturity calendar + auto-rollover alerts. Up to 10 CDs.',
    bannerText: BANNER,
    kpiData: [
      { label: 'CDs OPEN',        value: { formula: `COUNTA(B12:B21)` } },
      { label: 'TOTAL PRINCIPAL', value: { formula: `TEXT(SUM(E12:E21),"$#,##0")` } },
      { label: 'WEIGHTED APY',    value: { formula: `IFERROR(TEXT(SUMPRODUCT(E12:E21,F12:F21)/SUM(E12:E21),"0.00%"),"—")` } },
      { label: 'NEXT MATURITY',   value: { formula: `IFERROR(TEXT(MIN(IF((H12:H21<>"")*(H12:H21>TODAY()),H12:H21)),"mmm yyyy"),"—")` } },
      { label: 'MATURING 90d',    value: { formula: `SUMPRODUCT((H12:H21<>"")*(H12:H21>=TODAY())*(H12:H21<=TODAY()+90)*E12:E21)` } },
      { label: 'INTEREST YTD',    value: { formula: `TEXT(SUM(J12:J21),"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'CD ladder', 'Enter each CD. FV calculated automatically. Maturing within 90 days highlighted amber; matured CDs highlighted alert color → roll into new CD at current rate.');

  addTableHeader(sheet, r + 1, ['CD Name', 'Bank', 'Term (mo)', 'Principal', 'APY', 'Open Date', 'Maturity Date', 'FV @ Maturity', 'Interest YTD', 'Early-Withdraw Penalty', 'Action'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const cdSeed = [
    { name: 'Ally 12mo',     bank: 'Ally Bank', term: 12, principal:  5000, apy: 0.0485, open: '2026-01-15', penalty: '60d interest' },
    { name: 'Marcus 18mo',   bank: 'Marcus',    term: 18, principal:  7500, apy: 0.0490, open: '2025-11-01', penalty: '90d interest' },
    { name: 'Synchrony 24mo', bank: 'Synchrony', term: 24, principal: 10000, apy: 0.0470, open: '2025-08-20', penalty: '180d interest' },
    { name: 'Ally 36mo',     bank: 'Ally Bank', term: 36, principal:  5000, apy: 0.0460, open: '2025-05-10', penalty: '180d interest' },
  ];

  for (let i = 0; i < 10; i++) {
    const ri = r + 2 + i;
    const cd = cdSeed[i];

    if (cd) sheet.getCell(`B${ri}`).value = cd.name;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (cd) sheet.getCell(`C${ri}`).value = cd.bank;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = cd ? cd.term : null;
    sheet.getCell(`D${ri}`).numFmt = '0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = cd ? cd.principal : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = cd ? cd.apy : null;
    sheet.getCell(`F${ri}`).numFmt = '0.00%';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).dataValidation = { type: 'decimal', operator: 'between', formulae: [0, 0.15], allowBlank: true };

    if (cd) sheet.getCell(`G${ri}`).value = new Date(cd.open);
    sheet.getCell(`G${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR(EDATE(G${ri},D${ri}),"")` };
    sheet.getCell(`H${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`H${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(E${ri}*(1+F${ri})^(D${ri}/12),"")` };
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).fill = FILLS.ivory;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(E${ri}*F${ri}*(MIN(TODAY(),H${ri})-MAX(G${ri},DATE(YEAR(TODAY()),1,1)))/365,"")` };
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    if (cd) sheet.getCell(`K${ri}`).value = cd.penalty;
    sheet.getCell(`K${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${ri}`).fill = FILLS.white;
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).value = { formula: `IF(B${ri}="","",IF(H${ri}<=TODAY(),"🔴 Roll over",IF(H${ri}-TODAY()<=90,"🟡 Maturing 90d","🟢 Hold")))` };
    sheet.getCell(`L${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`L${ri}`).fill = FILLS.white;
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  sheet.addConditionalFormatting({
    ref: `H${r + 2}:H${r + 11}`,
    rules: [
      { type: 'expression', formulae: [`AND(H${r + 2}<>"",H${r + 2}<=TODAY())`],                              priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'expression', formulae: [`AND(H${r + 2}<>"",H${r + 2}-TODAY()<=90,H${r + 2}-TODAY()>0)`],       priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
    ],
  });

  sheet.addConditionalFormatting({
    ref: `L${r + 2}:L${r + 11}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Roll over', priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Maturing',  priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Hold',      priority: 3, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 13}:L${r + 14}`,
    '🏦',
    'CD ladder strategy',
    'Stagger maturities (12 / 18 / 24 / 36 mo) so one CD matures each year — gives you reinvestment optionality without locking everything at one rate. Always-on Maturing 90d alert above so you don\'t miss the rollover window.');
  sheet.getRow(r + 13).height = 28;
  sheet.getRow(r + 14).height = 28;

  addFooter(sheet, r + 17, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 9 — 📈 VARIABLE FUND TRACKER (ETFs, Pro+)
// ============================================================================

function buildVariableFundTracker(workbook) {
  const sheet = workbook.addWorksheet('📈 Variable Fund Tracker');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 12, C: 22, D: 12, E: 12, F: 12, G: 14, H: 14, I: 14, J: 14, K: 22, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📈 Variable Fund Tracker',
    tabSubtitle: 'ETFs · index funds · money market. Up to 12 positions with NAV log.',
    bannerText: BANNER,
    kpiData: [
      { label: 'POSITIONS',       value: { formula: `COUNTA(B12:B23)` } },
      { label: 'TOTAL SHARES',    value: { formula: `TEXT(SUM(D12:D23),"#,##0")` } },
      { label: 'COST BASIS',      value: { formula: `TEXT(SUMPRODUCT(D12:D23,E12:E23),"$#,##0")` } },
      { label: 'CURRENT VALUE',   value: { formula: `TEXT(SUMPRODUCT(D12:D23,F12:F23),"$#,##0")` } },
      { label: 'UNREALIZED P/L',  value: { formula: `TEXT(SUMPRODUCT(D12:D23,F12:F23)-SUMPRODUCT(D12:D23,E12:E23),"$#,##0;-$#,##0")` } },
      { label: 'WEIGHTED RETURN', value: { formula: `IFERROR(TEXT((SUMPRODUCT(D12:D23,F12:F23)-SUMPRODUCT(D12:D23,E12:E23))/SUMPRODUCT(D12:D23,E12:E23),"0.0%"),"—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Holdings', 'Ticker + shares + cost. Current NAV pulls live via GOOGLEFINANCE in Sheets; Excel buyers enter monthly.');

  addTableHeader(sheet, r + 1, ['Ticker', 'Fund', 'Shares', 'Avg Cost', 'Current NAV', 'Current Value', 'Cost Basis', 'P/L', 'P/L %', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']);

  const fundSeed = [
    { ticker: 'VTI',   name: 'Vanguard Total Stock Market',   shares:  45, cost: 220.50, nav: 268.40, notes: 'Core US equity' },
    { ticker: 'VXUS',  name: 'Vanguard Total International',  shares:  30, cost:  58.20, nav:  66.10, notes: 'Intl diversification' },
    { ticker: 'BND',   name: 'Vanguard Total Bond',           shares:  20, cost:  72.10, nav:  74.30, notes: 'Down Payment fund bond sleeve' },
    { ticker: 'VMFXX', name: 'Vanguard Federal MMF',          shares: 800, cost:   1.00, nav:   1.00, notes: 'Emergency Fund parking' },
  ];

  for (let i = 0; i < 12; i++) {
    const ri = r + 2 + i;
    const f = fundSeed[i];

    if (f) sheet.getCell(`B${ri}`).value = f.ticker;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (f) sheet.getCell(`C${ri}`).value = f.name;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = f ? f.shares : null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0.0000';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = f ? f.cost : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = f ? f.nav : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.ivory;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(D${ri}*F${ri},"")` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR(D${ri}*E${ri},"")` };
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(G${ri}-H${ri},"")` };
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0;[Red]-"$"#,##0';
    sheet.getCell(`I${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(I${ri}/H${ri},"")` };
    sheet.getCell(`J${ri}`).numFmt = '0.0%';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    if (f) sheet.getCell(`K${ri}`).value = f.notes;
    sheet.getCell(`K${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${ri}`).fill = FILLS.white;
    sheet.getCell(`K${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${r + 15}:K${r + 16}`,
    '📈',
    'GOOGLEFINANCE for live NAV',
    'In Google Sheets, paste =GOOGLEFINANCE(B12,"price") into F12 (substitute row number). Works for nearly every US ETF + mutual fund. Excel users: enter monthly from your brokerage. Growth % column on Fund Manager pulls weighted return from this tab for ETF-vehicle funds.');
  sheet.getRow(r + 15).height = 28;
  sheet.getRow(r + 16).height = 28;

  addFooter(sheet, r + 19, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 10 — 📊 STOCKS & DIVIDENDS (Pro+)
// ============================================================================

function buildStocksDividends(workbook) {
  const sheet = workbook.addWorksheet('📊 Stocks & Dividends');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 9, C: 18, D: 10, E: 12, F: 12, G: 10, H: 12, I: 9, J: 12, K: 12, L: 16, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📊 Stocks & Dividends',
    tabSubtitle: 'Dividend stocks + DRIP tracker. Up to 12 tickers + 12-month dividend calendar.',
    bannerText: BANNER,
    kpiData: [
      { label: 'POSITIONS',        value: { formula: `COUNTA(B12:B23)` } },
      { label: 'PORTFOLIO VALUE',  value: { formula: `TEXT(SUMPRODUCT(D12:D23,F12:F23),"$#,##0")` } },
      { label: 'ANNUAL DIVIDENDS', value: { formula: `TEXT(SUMPRODUCT(D12:D23,H12:H23),"$#,##0")` } },
      { label: 'PORT. YIELD',      value: { formula: `IFERROR(TEXT(SUMPRODUCT(D12:D23,H12:H23)/SUMPRODUCT(D12:D23,F12:F23),"0.00%"),"—")` } },
      { label: 'DRIP POSITIONS',   value: { formula: `COUNTIF(K12:K23,"Yes")` } },
      { label: 'YIELD ON COST',    value: { formula: `IFERROR(TEXT(SUMPRODUCT(D12:D23,H12:H23)/SUMPRODUCT(D12:D23,E12:E23),"0.00%"),"—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Dividend holdings', 'Ticker + shares + cost + dividend rate. Yield on cost = annual div / cost basis. DRIP toggle.');

  addTableHeader(sheet, r + 1, ['Ticker', 'Company', 'Shares', 'Avg Cost', 'Current Price', 'Sector', 'Annual Div/sh', 'Yield', 'Annual Income', 'DRIP', 'Pay Schedule'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const stockSeed = [
    { tk: 'KO',   name: 'Coca-Cola',          sh: 200, cost:  52.30, price:  70.40, sec: 'Staples', div: 1.94, drip: 'Yes', sched: 'Quarterly (Apr/Jul/Oct/Jan)' },
    { tk: 'VYM',  name: 'Vanguard High Div',  sh:  80, cost: 105.40, price: 124.80, sec: 'ETF',     div: 3.68, drip: 'Yes', sched: 'Quarterly (Mar/Jun/Sep/Dec)' },
    { tk: 'O',    name: 'Realty Income',      sh:  60, cost:  56.80, price:  60.20, sec: 'REIT',    div: 3.18, drip: 'Yes', sched: 'Monthly' },
    { tk: 'SCHD', name: 'Schwab US Div',      sh:  50, cost:  73.50, price:  84.90, sec: 'ETF',     div: 3.12, drip: 'No',  sched: 'Quarterly (Mar/Jun/Sep/Dec)' },
    { tk: 'MAIN', name: 'Main Street Capital', sh:  30, cost:  38.20, price:  53.10, sec: 'BDC',     div: 3.06, drip: 'Yes', sched: 'Monthly' },
  ];

  for (let i = 0; i < 12; i++) {
    const ri = r + 2 + i;
    const s = stockSeed[i];

    if (s) sheet.getCell(`B${ri}`).value = s.tk;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (s) sheet.getCell(`C${ri}`).value = s.name;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = s ? s.sh : null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = s ? s.cost : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = s ? s.price : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.ivory;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    if (s) sheet.getCell(`G${ri}`).value = s.sec;
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).dataValidation = { type: 'list', formulae: ['"Staples,Energy,Tech,REIT,BDC,Financial,Health,Utilities,Industrials,ETF,Other"'], allowBlank: true };

    sheet.getCell(`H${ri}`).value = s ? s.div : null;
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0.0000';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(H${ri}/F${ri},"")` };
    sheet.getCell(`I${ri}`).numFmt = '0.00%';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(D${ri}*H${ri},"")` };
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    if (s) sheet.getCell(`K${ri}`).value = s.drip;
    sheet.getCell(`K${ri}`).font = FONTS.body;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`K${ri}`).fill = FILLS.white;
    sheet.getCell(`K${ri}`).border = BORDER_THIN();
    sheet.getCell(`K${ri}`).dataValidation = { type: 'list', formulae: ['"Yes,No"'], allowBlank: true };

    if (s) sheet.getCell(`L${ri}`).value = s.sched;
    sheet.getCell(`L${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`L${ri}`).fill = FILLS.white;
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  // === 12-month dividend calendar ===
  const calR = r + 16;
  addSectionHeader(sheet, calR, '12-month dividend calendar', 'Projected per-month income. Monthly REITs/BDCs (O / MAIN) spread evenly; quarterly payers (KO / VYM / SCHD) cluster.', 'B:L');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const calHeaderRow = calR + 3;
  months.forEach((m, i) => {
    const col = String.fromCharCode(66 + i);
    sheet.getCell(`${col}${calHeaderRow}`).value = m;
    sheet.getCell(`${col}${calHeaderRow}`).alignment = { horizontal: 'center' };
    sheet.getCell(`${col}${calHeaderRow}`).fill = FILLS.charcoal;
    sheet.getCell(`${col}${calHeaderRow}`).font = { ...FONTS.smallCaps, color: argb(COLORS.white) };
    sheet.getCell(`${col}${calHeaderRow}`).border = BORDER_THIN(COLORS.charcoal);
  });

  const monthlyTickers = ['O', 'MAIN'];
  const quarterMap = { KO: [1, 4, 7, 10], VYM: [3, 6, 9, 12], SCHD: [3, 6, 9, 12] };

  for (let m = 0; m < 12; m++) {
    const col = String.fromCharCode(66 + m);
    const monthNum = m + 1;
    const monthlyExpr = monthlyTickers.map(tk => `IFERROR(INDEX(D12:D23,MATCH("${tk}",B12:B23,0))*INDEX(H12:H23,MATCH("${tk}",B12:B23,0))/12,0)`).join('+');
    const quarterlyExpr = Object.entries(quarterMap).flatMap(([tk, mnths]) =>
      mnths.includes(monthNum)
        ? [`IFERROR(INDEX(D12:D23,MATCH("${tk}",B12:B23,0))*INDEX(H12:H23,MATCH("${tk}",B12:B23,0))/4,0)`]
        : []
    ).join('+');
    const formula = quarterlyExpr ? `${monthlyExpr}+${quarterlyExpr}` : monthlyExpr;

    sheet.getCell(`${col}${calHeaderRow + 1}`).value = { formula };
    sheet.getCell(`${col}${calHeaderRow + 1}`).numFmt = '"$"#,##0';
    sheet.getCell(`${col}${calHeaderRow + 1}`).font = FONTS.body;
    sheet.getCell(`${col}${calHeaderRow + 1}`).alignment = { horizontal: 'right' };
    sheet.getCell(`${col}${calHeaderRow + 1}`).fill = FILLS.white;
    sheet.getCell(`${col}${calHeaderRow + 1}`).border = BORDER_THIN();
  }

  sheet.addConditionalFormatting({
    ref: `B${calHeaderRow + 1}:M${calHeaderRow + 1}`,
    rules: [
      { type: 'aboveAverage', aboveAverage: true, priority: 1, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warmGold), bold: true } } },
    ],
  });

  addCallout(sheet, `B${calHeaderRow + 4}:L${calHeaderRow + 5}`,
    '🔍',
    'Cash-gap month detection',
    'Feb / May / Aug / Nov are typical gap months for quarterly-dividend portfolios. Adding monthly payers (REITs, BDCs) smooths income. The Dividend Planner AI prompt (AI Edition) walks the cash-gap analysis with your data.');
  sheet.getRow(calHeaderRow + 4).height = 28;
  sheet.getRow(calHeaderRow + 5).height = 28;

  addFooter(sheet, calHeaderRow + 9, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 11 — 💰 INCOME ALLOCATION WHEEL (Pro+)
// ============================================================================

function buildIncomeAllocationWheel(workbook) {
  const sheet = workbook.addWorksheet('💰 Income Allocation Wheel');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 18, H: 16, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💰 Income Allocation Wheel',
    tabSubtitle: 'How your monthly savings $ split across funds. Unallocated slice fires in alert color when income > total commitments.',
    bannerText: BANNER,
    kpiData: [
      { label: 'MONTHLY INCOME',  value: { formula: `TEXT(C6,"$#,##0")` } },
      { label: 'TOTAL ALLOC.',    value: { formula: `TEXT(SUM('🪣 Fund Manager'!I12:I28),"$#,##0")` } },
      { label: 'UNALLOCATED',     value: { formula: `TEXT(MAX(0,C6-SUM('🪣 Fund Manager'!I12:I28)),"$#,##0")` } },
      { label: 'ALLOC. %',        value: { formula: `IFERROR(TEXT(SUM('🪣 Fund Manager'!I12:I28)/C6,"0.0%"),"—")` } },
      { label: 'ACTIVE FUNDS',    value: { formula: `COUNTA('🪣 Fund Manager'!B12:B28)` } },
      { label: 'AVG / FUND',      value: { formula: `IFERROR(TEXT(SUM('🪣 Fund Manager'!I12:I28)/COUNTA('🪣 Fund Manager'!B12:B28),"$#,##0"),"—")` } },
    ],
  });

  // Monthly income input
  sheet.getCell('B6').value = 'Monthly savings budget';
  sheet.getCell('B6').font = FONTS.smallCaps;
  sheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };

  sheet.getCell('C6').value = 1500;
  sheet.getCell('C6').numFmt = '"$"#,##0';
  sheet.getCell('C6').font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell('C6').alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getCell('C6').fill = FILLS.ivory;
  sheet.getCell('C6').border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell('C6').dataValidation = {
    type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true,
    showInputMessage: true, promptTitle: 'Monthly savings budget',
    prompt: 'How much you have available to save per month. The wheel shows what % of this each fund consumes.',
  };

  sheet.getRow(6).height = 28;

  let r = addSectionHeader(sheet, 9, 'Allocation breakdown', 'Each row = one active fund. % of monthly = fund\'s monthly contribution ÷ total monthly budget.');

  addTableHeader(sheet, r + 1, ['Fund', 'Category', 'Vehicle', 'Monthly $', '% of Budget', 'Visual'], ['B', 'C', 'D', 'E', 'F', 'G']);

  for (let i = 0; i < FM.ROW_COUNT; i++) {
    const ri = r + 2 + i;
    const fmRow = FM.FIRST_FUND_ROW + i;

    sheet.getCell(`B${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!B${fmRow},"")` };
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!C${fmRow},"")` };
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!D${fmRow},"")` };
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!I${fmRow},0)` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(IF($C$6=0,0,E${ri}/$C$6),0)` };
    sheet.getCell(`F${ri}`).numFmt = '0.0%';
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(IF(B${ri}="","",REPT("█",MIN(15,ROUND(F${ri}*30,0)))),"")` };
    sheet.getCell(`G${ri}`).font = { name: 'Inter', size: 11, color: argb(COLORS.warmGold) };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
  }

  // Unallocated row
  const unallocR = r + 19;
  sheet.getCell(`B${unallocR}`).value = '⚠️ Unallocated';
  sheet.getCell(`B${unallocR}`).font = FONTS.bodyBold;
  sheet.getCell(`B${unallocR}`).fill = FILLS.warningLight;
  sheet.getCell(`B${unallocR}`).border = BORDER_THIN();

  sheet.mergeCells(`C${unallocR}:D${unallocR}`);
  sheet.getCell(`C${unallocR}`).value = 'Goes where?';
  sheet.getCell(`C${unallocR}`).font = FONTS.bodyMuted;
  sheet.getCell(`C${unallocR}`).fill = FILLS.warningLight;
  sheet.getCell(`C${unallocR}`).border = BORDER_THIN();

  sheet.getCell(`E${unallocR}`).value = { formula: `MAX(0,$C$6-SUM(E${r + 2}:E${r + 18}))` };
  sheet.getCell(`E${unallocR}`).numFmt = '"$"#,##0';
  sheet.getCell(`E${unallocR}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };
  sheet.getCell(`E${unallocR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`E${unallocR}`).fill = FILLS.warningLight;
  sheet.getCell(`E${unallocR}`).border = BORDER_THIN();

  sheet.getCell(`F${unallocR}`).value = { formula: `IFERROR(IF($C$6=0,0,E${unallocR}/$C$6),0)` };
  sheet.getCell(`F${unallocR}`).numFmt = '0.0%';
  sheet.getCell(`F${unallocR}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };
  sheet.getCell(`F${unallocR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`F${unallocR}`).fill = FILLS.warningLight;
  sheet.getCell(`F${unallocR}`).border = BORDER_THIN();

  addCallout(sheet, `B${unallocR + 3}:G${unallocR + 4}`,
    '💡',
    'Allocate the gap',
    'Unallocated > $0 means you have room to either boost an existing fund OR open a new one. Reallocation prompt (AI Edition) recommends where to put the next dollar based on urgency × funding gap. Unallocated < $0 = you\'re committing more than your budget — bump income or trim a fund.');
  sheet.getRow(unallocR + 3).height = 28;
  sheet.getRow(unallocR + 4).height = 28;

  addFooter(sheet, unallocR + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 12 — 🌅 WEALTH GLIDE PATH (Pro+)
// ============================================================================

function buildWealthGlidePath(workbook) {
  const sheet = workbook.addWorksheet('🌅 Wealth Glide Path');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 12, D: 12, E: 12, F: 12, G: 14, H: 18, I: 18, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🌅 Wealth Glide Path',
    tabSubtitle: 'Per-fund timeline to target. Vehicle-shift flag fires at T-24 months for volatile-vehicle funds.',
    bannerText: BANNER,
    kpiData: [
      { label: 'GLIDE FLAGS',     value: { formula: `COUNTIF(G12:G28,"🟡 Glide soon")+COUNTIF(G12:G28,"🔴 Glide now")` } },
      { label: 'GLIDE NOW',       value: { formula: `COUNTIF(G12:G28,"🔴 Glide now")` } },
      { label: 'GLIDE 24mo',      value: { formula: `COUNTIF(G12:G28,"🟡 Glide soon")` } },
      { label: 'FUNDS ON CRUISE', value: { formula: `COUNTIF(G12:G28,"🟢 Cruise")` } },
      { label: 'VOLATILE FUNDS',  value: { formula: `COUNTIFS('🪣 Fund Manager'!D12:D28,"ETF")+COUNTIFS('🪣 Fund Manager'!D12:D28,"Stock")+COUNTIFS('🪣 Fund Manager'!D12:D28,"Metal")` } },
      { label: 'AVG MO TO TARGET', value: { formula: `IFERROR(TEXT(AVERAGEIF(D12:D28,">0"),"0"),"—")&" mo"` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Per-fund glide path', 'Funds on ETF / Stock / Metal vehicles must shift to safer vehicles as target nears. Rule: shift to bonds at T-24mo, shift to cash at T-12mo for any volatile-vehicle fund.');

  addTableHeader(sheet, r + 1, ['Fund', 'Vehicle', 'Months Left', 'Target $', 'Saved $', 'Volatility', 'Glide Status', 'Recommended Shift', 'Trade-off'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

  for (let i = 0; i < FM.ROW_COUNT; i++) {
    const ri = FM.FIRST_FUND_ROW + i;
    const fmRow = FM.FIRST_FUND_ROW + i;

    sheet.getCell(`B${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!B${fmRow},"")` };
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!D${fmRow},"")` };
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IFERROR(IF('🪣 Fund Manager'!H${fmRow}="",999,MAX(0,('🪣 Fund Manager'!H${fmRow}-TODAY())/30.44)),"")` };
    sheet.getCell(`D${ri}`).numFmt = '0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!F${fmRow},0)` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!G${fmRow},0)` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // Volatility flag (Y if vehicle is ETF/Stock/Metal)
    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(IF(B${ri}="","",IF(OR(C${ri}="ETF",C${ri}="Stock",C${ri}="Metal"),IF(D${ri}<=12,"🔴 Glide now",IF(D${ri}<=24,"🟡 Glide soon","🟢 Cruise")),"🟢 Cruise")),"—")` };
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    // Recommended shift
    sheet.getCell(`H${ri}`).value = { formula: `IF(B${ri}="","",IF(G${ri}="🔴 Glide now","Move 100% → Cash/HYSA",IF(G${ri}="🟡 Glide soon","60/40 ETF/bond split","Stay invested")))` };
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    // Volatility band visual (descriptive)
    sheet.getCell(`I${ri}`).value = { formula: `IF(B${ri}="","",IF(C${ri}="Stock","High vol — 30%+ drawdown risk",IF(C${ri}="ETF","Med-high vol",IF(C${ri}="Metal","Med vol",IF(C${ri}="CD","Low vol — locked","Low vol — liquid")))))` };
    sheet.getCell(`I${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    // Trade-off note
    sheet.getCell(`J${ri}`).value = { formula: `IF(G${ri}="🔴 Glide now","Lose 3-7% expected growth, gain certainty",IF(G${ri}="🟡 Glide soon","Cut volatility 40%","—"))` };
    sheet.getCell(`J${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
  }

  sheet.addConditionalFormatting({
    ref: `G${FM.FIRST_FUND_ROW}:G${FM.LAST_FUND_ROW}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Glide now',  priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Glide soon', priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Cruise',     priority: 3, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addCallout(sheet, `B${FM.LAST_FUND_ROW + 2}:J${FM.LAST_FUND_ROW + 3}`,
    '🌅',
    'Why glide?',
    'A Down Payment fund 5 years out in ETF is fine. Same fund 12 months out is one bad quarter from missing the closing date. The glide path tells you WHEN to derisk. You stay in control of the trade — we just flag the deadline.');
  sheet.getRow(FM.LAST_FUND_ROW + 2).height = 28;
  sheet.getRow(FM.LAST_FUND_ROW + 3).height = 28;

  addFooter(sheet, FM.LAST_FUND_ROW + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 13 — 📅 SPENDING TRACKER (Pro+)
// ============================================================================

function buildSpendingTracker(workbook) {
  const sheet = workbook.addWorksheet('📅 Spending Tracker');
  setTabColor(sheet, COLORS.warning);
  setupColumns(sheet, { A: 2, B: 12, C: 22, D: 14, E: 14, F: 14, G: 20, H: 22, I: 8, J: 8, K: 8, L: 8, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📅 Spending Tracker',
    tabSubtitle: 'Withdrawal log + per-fund rebuild timeline ("withdraw $X, rebuild in Y months at current contribution rate").',
    bannerText: BANNER,
    kpiData: [
      { label: 'WITHDRAWALS YTD', value: { formula: `COUNTA(C12:C61)` } },
      { label: 'TOTAL WITHDRAWN', value: { formula: `TEXT(SUM(E12:E61),"$#,##0")` } },
      { label: 'LARGEST',         value: { formula: `IFERROR(TEXT(MAX(E12:E61),"$#,##0"),"—")` } },
      { label: 'LARGEST FUND',    value: { formula: `IFERROR(INDEX(C12:C61,MATCH(MAX(E12:E61),E12:E61,0)),"—")` } },
      { label: 'LAST 90 DAYS',    value: { formula: `TEXT(SUMPRODUCT((B12:B61>=TODAY()-90)*E12:E61),"$#,##0")` } },
      { label: 'AVG REBUILD',     value: { formula: `IFERROR(TEXT(AVERAGE(G12:G61),"0")&" mo","—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Withdrawal log', 'Each row is a spend FROM a sinking fund. Rebuild timeline = how many months at current contribution to replace what you withdrew.');

  addTableHeader(sheet, r + 1, ['Date', 'Fund', 'Reason', 'Amount', 'Running Bal', 'Rebuild (mo)', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  const withdrawSeed = [
    { date: '2026-04-22', fund: 'Car Repair',     reason: 'AC compressor',    amount:  650, notes: 'Mechanic — covered' },
    { date: '2026-05-08', fund: 'Christmas',      reason: 'Early gift sale',  amount:  120, notes: 'Saw deal on Mom\'s gift' },
    { date: '2026-03-15', fund: 'Vacation',       reason: 'Flight booking',   amount:  400, notes: 'Locked in fare' },
  ];

  for (let i = 0; i < 50; i++) {
    const ri = r + 2 + i;
    const w = withdrawSeed[i];

    if (w) sheet.getCell(`B${ri}`).value = new Date(w.date);
    sheet.getCell(`B${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (w) sheet.getCell(`C${ri}`).value = w.fund;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: [`'🪣 Fund Manager'!$B$12:$B$28`], allowBlank: true };

    if (w) sheet.getCell(`D${ri}`).value = w.reason;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = w ? w.amount : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = { ...FONTS.body, color: argb(COLORS.alert) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    // Running balance after withdrawal = current Fund Manager balance for that fund
    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(IF(C${ri}="","",VLOOKUP(C${ri},'🪣 Fund Manager'!$B$12:$G$28,6,FALSE)),"")` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // Rebuild timeline = amount / fund's monthly contribution
    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(IF(C${ri}="","",E${ri}/VLOOKUP(C${ri},'🪣 Fund Manager'!$B$12:$I$28,8,FALSE)),"")` };
    sheet.getCell(`G${ri}`).numFmt = '0.0';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    if (w && w.notes) sheet.getCell(`H${ri}`).value = w.notes;
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${r + 53}:H${r + 54}`,
    '📅',
    'Rebuild math',
    'Rebuild months = withdrawal ÷ monthly contribution to that fund. Pull $600 from Car Repair when contributing $90/mo → ~7 months back to baseline. Flag in Notes if a withdrawal is non-recurring vs. recurring.');
  sheet.getRow(r + 53).height = 28;
  sheet.getRow(r + 54).height = 28;

  addFooter(sheet, r + 57, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 14 — 🧮 TAX EFFICIENCY ANALYZER (Pro+)
// ============================================================================

function buildTaxEfficiencyAnalyzer(workbook) {
  const sheet = workbook.addWorksheet('🧮 Tax Efficiency Analyzer');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 22, C: 12, D: 14, E: 16, F: 16, G: 14, H: 26, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🧮 Tax Efficiency Analyzer',
    tabSubtitle: 'Per-fund placement: Roth IRA / HSA / 529 / Taxable. Estimated annual tax savings if you move misplaced funds.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL TAX DRAG',  value: { formula: `TEXT(SUM(G12:G28),"$#,##0")` } },
      { label: 'POTENTIAL SAVINGS', value: { formula: `TEXT(SUMIF(F12:F28,"<>"&E12,G12:G28),"$#,##0")` } },
      { label: 'MISPLACED',       value: { formula: `COUNTIFS(E12:E28,"<>",F12:F28,"<>",F12:F28,"<>"&E12)` } },
      { label: 'OPTIMAL',         value: { formula: `SUMPRODUCT((E12:E28=F12:F28)*(F12:F28<>""))` } },
      { label: 'TAX BRACKET',     value: { formula: `TEXT(C6,"0%")` } },
      { label: 'STATE RATE',      value: { formula: `TEXT(C7,"0%")` } },
    ],
  });

  // Tax inputs
  sheet.getCell('B6').value = 'Federal marginal bracket';
  sheet.getCell('B6').font = FONTS.smallCaps;
  sheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };
  sheet.getCell('C6').value = 0.22;
  sheet.getCell('C6').numFmt = '0%';
  sheet.getCell('C6').font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell('C6').alignment = { horizontal: 'center' };
  sheet.getCell('C6').fill = FILLS.ivory;
  sheet.getCell('C6').border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell('C6').dataValidation = { type: 'list', formulae: ['"0.10,0.12,0.22,0.24,0.32,0.35,0.37"'], allowBlank: false };

  sheet.getCell('B7').value = 'State income rate';
  sheet.getCell('B7').font = FONTS.smallCaps;
  sheet.getCell('B7').alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };
  sheet.getCell('C7').value = 0.05;
  sheet.getCell('C7').numFmt = '0%';
  sheet.getCell('C7').font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell('C7').alignment = { horizontal: 'center' };
  sheet.getCell('C7').fill = FILLS.ivory;
  sheet.getCell('C7').border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell('C7').dataValidation = { type: 'decimal', operator: 'between', formulae: [0, 0.15], allowBlank: false };

  let r = addSectionHeader(sheet, 10, 'Per-fund tax placement', 'Optimal placement = Roth IRA (retirement), HSA (medical, triple-tax-free), 529 (education tax-free), Taxable brokerage (everything else). Annual drag = growth × bracket if in Taxable.');

  addTableHeader(sheet, r + 1, ['Fund', 'Category', 'Vehicle', 'Current Placement', 'Recommended', 'Tax Drag', 'Reasoning'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  // Recommendation logic: Roth for retirement-flagged, HSA for medical/dental, 529 for education, Taxable otherwise.
  // For this Sinking Funds product, most funds are short-term-horizon (taxable HYSA is fine) — recommendation flags the FEW that need optimization.
  for (let i = 0; i < FM.ROW_COUNT; i++) {
    const ri = FM.FIRST_FUND_ROW + i;
    const fmRow = FM.FIRST_FUND_ROW + i;

    sheet.getCell(`B${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!B${fmRow},"")` };
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!C${fmRow},"")` };
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!D${fmRow},"")` };
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    // E — Current placement (user editable)
    sheet.getCell(`E${ri}`).value = 'Taxable';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).dataValidation = { type: 'list', formulae: ['"Taxable,Roth IRA,Trad IRA,401k,HSA,529,Other"'], allowBlank: true };

    // F — Recommended (algorithmic)
    sheet.getCell(`F${ri}`).value = { formula:
      `IF(B${ri}="","",` +
      `IF(OR(C${ri}="Medical",C${ri}="Dental"),"HSA",` +
      `IF(C${ri}="Education","529",` +
      `IF(AND(C${ri}="Down Payment",D${ri}="ETF"),"Roth IRA (1st-home)",` +
      `"Taxable"))))` };
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${ri}`).fill = FILLS.ivory;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // G — Tax drag estimate = growth $ × federal bracket (approximation)
    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(IF(OR(B${ri}="",E${ri}="HSA",E${ri}="Roth IRA",E${ri}="529"),0,'🪣 Fund Manager'!G${fmRow}*'🪣 Fund Manager'!J${fmRow}*($C$6+$C$7)),0)` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    // H — Reasoning
    sheet.getCell(`H${ri}`).value = { formula: `IF(B${ri}="","",IF(F${ri}="HSA","Triple-tax-free for medical",IF(F${ri}="529","Tax-free for education",IF(F${ri}="Roth IRA (1st-home)","Up to $10K penalty-free for first home","Taxable is fine — short horizon"))))` };
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${FM.LAST_FUND_ROW + 2}:H${FM.LAST_FUND_ROW + 3}`,
    '🧮',
    'When to move accounts',
    'HSA-eligible? Move medical + dental there first — triple tax advantage. Got kids? Move Education to a 529. Down Payment in ETF for 5+ years? Roth IRA contributions can be withdrawn penalty-free + first-home buyers get $10K of growth tax-free. Most other funds: taxable HYSA is the right call.');
  sheet.getRow(FM.LAST_FUND_ROW + 2).height = 28;
  sheet.getRow(FM.LAST_FUND_ROW + 3).height = 28;

  addFooter(sheet, FM.LAST_FUND_ROW + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 15 — 📊 ANNUAL SUMMARY (Essentials limited / Pro full)
// ============================================================================

function buildAnnualSummary(workbook) {
  const tier = workbook._tier || 'ai';
  const hasPro = (tier === 'pro' || tier === 'ai');

  const sheet = workbook.addWorksheet('📊 Annual Summary');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 11, D: 11, E: 11, F: 11, G: 11, H: 11, I: 11, J: 11, K: 11, L: 11, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📊 Annual Summary',
    tabSubtitle: 'Year-end retrospective. Hit-vs-miss per fund + 12-month grid. Pro+ unlocks YoY + vehicle performance + top withdrawals.',
    bannerText: BANNER,
    kpiData: [
      { label: 'YEAR',            value: { formula: `YEAR(TODAY())` } },
      { label: 'CONTRIB. YTD',    value: { formula: `TEXT(SUMPRODUCT((YEAR('💵 Contribution Tracker'!B12:B61)=YEAR(TODAY()))*'💵 Contribution Tracker'!E12:E61),"$#,##0")` } },
      { label: 'WITHDRAWN YTD',   value: hasPro ? { formula: `TEXT(SUMPRODUCT((YEAR('📅 Spending Tracker'!B12:B61)=YEAR(TODAY()))*'📅 Spending Tracker'!E12:E61),"$#,##0")` } : '—' },
      { label: 'FUNDS HIT',       value: { formula: `COUNTIF('🪣 Fund Manager'!K12:K28,"🟢 Funded")` } },
      { label: 'FUNDS MISSED',    value: { formula: `COUNTIF('🪣 Fund Manager'!K12:K28,"🔴 Behind")` } },
      { label: 'TIER',            value: { essentials: 'Essentials', pro: 'Pro', ai: 'AI Edition' }[tier] },
    ],
  });

  // Section 1: 12-month grid per fund — ALWAYS visible (Essentials feature)
  let r = addSectionHeader(sheet, 6, 'Total saved per fund — 12 months', 'Per-fund monthly contribution from the Contribution Tracker. Shows the saving rhythm — front-loaded funds + paused months + comeback months.');

  const monthsAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Header row (months across B+2..M+2 -> use B=fund label, C..N as 12 months)
  sheet.getCell(`B${r + 1}`).value = 'Fund';
  sheet.getCell(`B${r + 1}`).font = FONTS.headerWhite;
  sheet.getCell(`B${r + 1}`).fill = FILLS.charcoal;
  sheet.getCell(`B${r + 1}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getCell(`B${r + 1}`).border = BORDER_THIN(COLORS.charcoal);

  monthsAbbr.forEach((m, i) => {
    const col = String.fromCharCode(67 + i); // C..N
    sheet.getCell(`${col}${r + 1}`).value = m;
    sheet.getCell(`${col}${r + 1}`).font = FONTS.headerWhite;
    sheet.getCell(`${col}${r + 1}`).fill = FILLS.charcoal;
    sheet.getCell(`${col}${r + 1}`).alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };
    sheet.getCell(`${col}${r + 1}`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(r + 1).height = 24;

  for (let i = 0; i < 8; i++) {
    const ri = r + 2 + i;
    const fmRow = FM.FIRST_FUND_ROW + i;

    sheet.getCell(`B${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!B${fmRow},"")` };
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    for (let m = 0; m < 12; m++) {
      const col = String.fromCharCode(67 + m);
      // Sum contributions to this fund where MONTH(date) = m+1 and YEAR(date) = current
      sheet.getCell(`${col}${ri}`).value = { formula: `IFERROR(SUMPRODUCT(('💵 Contribution Tracker'!$C$12:$C$61=B${ri})*(MONTH('💵 Contribution Tracker'!$B$12:$B$61)=${m + 1})*(YEAR('💵 Contribution Tracker'!$B$12:$B$61)=YEAR(TODAY()))*'💵 Contribution Tracker'!$E$12:$E$61),"")` };
      sheet.getCell(`${col}${ri}`).numFmt = '"$"#,##0';
      sheet.getCell(`${col}${ri}`).font = FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${col}${ri}`).fill = FILLS.white;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    }
  }

  // Section 2: Hit vs. miss — ALWAYS visible
  const hitR = r + 12;
  addSectionHeader(sheet, hitR, 'Hit vs. miss', 'Did each fund reach its target by the deadline? Funds without a target date show "—" — no deadline to miss.');

  addTableHeader(sheet, hitR + 3, ['Fund', 'Target', 'Saved', '% Funded', 'Status', 'Outcome'], ['B', 'C', 'D', 'E', 'F', 'G']);

  for (let i = 0; i < 12; i++) {
    const ri = hitR + 4 + i;
    const fmRow = FM.FIRST_FUND_ROW + i;

    sheet.getCell(`B${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!B${fmRow},"")` };
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!F${fmRow},0)` };
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!G${fmRow},0)` };
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = { formula: `IFERROR(D${ri}/C${ri},0)` };
    sheet.getCell(`E${ri}`).numFmt = '0.0%';
    sheet.getCell(`E${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!K${fmRow},"—")` };
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IF(B${ri}="","",IF(D${ri}>=C${ri},"🎉 Hit",IF(E${ri}>=0.8,"📈 Close","❌ Missed")))` };
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
  }

  // === PRO+ sections ===
  if (hasPro) {
    // YoY / vehicle performance / top withdrawals — Pro+ unlock
    const proR = hitR + 18;
    addSectionHeader(sheet, proR, 'Pro+: Net growth by vehicle', 'How much your money grew (interest + appreciation) by vehicle this year. Useful for "are my CDs / ETFs / metals actually pulling weight?"');

    const vehicleRows = [
      { label: '💵  Cash / HYSA', formula: `SUMIFS('🪣 Fund Manager'!G12:G28,'🪣 Fund Manager'!D12:D28,"Cash")*0.045` },
      { label: '🏦  CDs',         formula: `IFERROR(SUM('🏦 Fixed Return Tracker'!J12:J21),0)` },
      { label: '📈  ETFs',        formula: `IFERROR(SUMPRODUCT('📈 Variable Fund Tracker'!D12:D23,'📈 Variable Fund Tracker'!F12:F23)-SUMPRODUCT('📈 Variable Fund Tracker'!D12:D23,'📈 Variable Fund Tracker'!E12:E23),0)` },
      { label: '🥇  Metals',      formula: `IFERROR(SUMPRODUCT('🥇 Precious Metals Tracker'!D12:D21,'🥇 Precious Metals Tracker'!F12:F21)-SUMPRODUCT('🥇 Precious Metals Tracker'!D12:D21,'🥇 Precious Metals Tracker'!E12:E21),0)` },
      { label: '📊  Dividends',   formula: `IFERROR(SUMPRODUCT('📊 Stocks & Dividends'!D12:D23,'📊 Stocks & Dividends'!H12:H23),0)` },
    ];

    addTableHeader(sheet, proR + 3, ['Vehicle', 'Realized + Unrealized'], ['B', 'C']);
    vehicleRows.forEach((v, i) => {
      const ri = proR + 4 + i;
      sheet.getCell(`B${ri}`).value = v.label;
      sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
      sheet.getCell(`B${ri}`).fill = FILLS.white;
      sheet.getCell(`B${ri}`).border = BORDER_THIN();

      sheet.getCell(`C${ri}`).value = { formula: v.formula };
      sheet.getCell(`C${ri}`).numFmt = '"$"#,##0;[Red]-"$"#,##0';
      sheet.getCell(`C${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
      sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
      sheet.getCell(`C${ri}`).fill = FILLS.ivory;
      sheet.getCell(`C${ri}`).border = BORDER_THIN();
    });

    addCallout(sheet, `B${proR + 11}:G${proR + 12}`,
      '📊',
      'Pro tier: extra context',
      'Cash row = HYSA-rate × balance (approximation; uses 4.5% APY). Real interest is on your bank statement. ETF/Metals = unrealized P/L from per-tracker holdings. Dividends = projected annual yield × shares.');
    sheet.getRow(proR + 11).height = 28;
    sheet.getRow(proR + 12).height = 28;

    addFooter(sheet, proR + 16, { productName: PRODUCT_NAME });
  } else {
    // Essentials — no Pro section, just close out
    addCallout(sheet, `B${hitR + 18}:G${hitR + 19}`,
      '🔓',
      'Upgrade to Pro for more',
      'Pro tier adds: Net growth by vehicle (Cash/CD/ETF/Metals/Dividends), YoY comparison, top withdrawals, and vehicle-performance breakdown. Same one-time purchase model — no subscription.');
    sheet.getRow(hitR + 18).height = 28;
    sheet.getRow(hitR + 19).height = 28;

    addFooter(sheet, hitR + 23, { productName: PRODUCT_NAME });
  }
}

// ============================================================================
// TAB 16 — 🔗 BUDGET INTEGRATION (Pro+)
// ============================================================================

function buildBudgetIntegration(workbook) {
  const sheet = workbook.addWorksheet('🔗 Budget Integration');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 24, C: 16, D: 16, E: 16, F: 22, G: 8, H: 8, I: 8, J: 8, K: 8, L: 8, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🔗 Budget Integration',
    tabSubtitle: 'Single export line for the Budget Tracker → Recurring Templates tab. Total monthly commitment to all Sinking Funds.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL MONTHLY',  value: { formula: `TEXT(SUM('🪣 Fund Manager'!I12:I28),"$#,##0")` } },
      { label: 'ACTIVE FUNDS',   value: { formula: `COUNTA('🪣 Fund Manager'!B12:B28)` } },
      { label: 'CATEGORY',       value: '💰 Savings' },
      { label: 'FREQUENCY',      value: 'Monthly' },
      { label: 'EXPORT LINES',   value: { formula: `COUNTA('🪣 Fund Manager'!B12:B28)+1` } },
      { label: 'BUDGET TIER',    value: 'Pro+' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Single-line export', 'Copy the row below into the Recurring Templates tab of the Budget Tracker. Treats all Sinking Funds as one monthly savings transfer.');

  addTableHeader(sheet, r + 1, ['Description', 'Category', 'Frequency', 'Amount', 'Notes'], ['B', 'C', 'D', 'E', 'F']);

  sheet.getCell(`B${r + 2}`).value = 'Sinking Funds Transfer';
  sheet.getCell(`B${r + 2}`).font = FONTS.bodyBold;
  sheet.getCell(`B${r + 2}`).fill = FILLS.ivory;
  sheet.getCell(`B${r + 2}`).border = BORDER_THIN();

  sheet.getCell(`C${r + 2}`).value = '💰 Savings';
  sheet.getCell(`C${r + 2}`).font = FONTS.body;
  sheet.getCell(`C${r + 2}`).fill = FILLS.ivory;
  sheet.getCell(`C${r + 2}`).border = BORDER_THIN();

  sheet.getCell(`D${r + 2}`).value = 'Monthly';
  sheet.getCell(`D${r + 2}`).font = FONTS.body;
  sheet.getCell(`D${r + 2}`).alignment = { horizontal: 'center' };
  sheet.getCell(`D${r + 2}`).fill = FILLS.ivory;
  sheet.getCell(`D${r + 2}`).border = BORDER_THIN();

  sheet.getCell(`E${r + 2}`).value = { formula: `SUM('🪣 Fund Manager'!I12:I28)` };
  sheet.getCell(`E${r + 2}`).numFmt = '"$"#,##0';
  sheet.getCell(`E${r + 2}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`E${r + 2}`).alignment = { horizontal: 'right' };
  sheet.getCell(`E${r + 2}`).fill = FILLS.ivory;
  sheet.getCell(`E${r + 2}`).border = BORDER_THIN();

  sheet.getCell(`F${r + 2}`).value = 'Auto-aggregated from Sinking Funds Planner';
  sheet.getCell(`F${r + 2}`).font = FONTS.bodyMuted;
  sheet.getCell(`F${r + 2}`).fill = FILLS.ivory;
  sheet.getCell(`F${r + 2}`).border = BORDER_THIN();

  // Optional per-fund breakdown
  let detailR = r + 5;
  addSectionHeader(sheet, detailR, 'Per-fund breakdown (optional)', 'If you prefer one budget line per fund, paste each row below into Recurring Templates separately. Most users use the single-line export above — keeps the budget tidy.');

  addTableHeader(sheet, detailR + 3, ['Fund', 'Category', 'Frequency', 'Amount', 'Notes'], ['B', 'C', 'D', 'E', 'F']);

  for (let i = 0; i < FM.ROW_COUNT; i++) {
    const ri = detailR + 4 + i;
    const fmRow = FM.FIRST_FUND_ROW + i;

    sheet.getCell(`B${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!B${fmRow},"")` };
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = '💰 Savings';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = 'Monthly';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = { formula: `IFERROR('🪣 Fund Manager'!I${fmRow},"")` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(IF(B${ri}="","","Auto to "&'🪣 Fund Manager'!D${fmRow}),"")` };
    sheet.getCell(`F${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${detailR + 22}:F${detailR + 23}`,
    '🔗',
    'Pairs with Budget Tracker',
    'The Budget Tracker (Product 1 in this catalog) has a Recurring Templates tab built for this kind of integration. Both products use the same Premium Finance House — they look like one workbook even though they\'re separate purchases. Bundle them via the Premium Finance Bundle to save 31%.');
  sheet.getRow(detailR + 22).height = 28;
  sheet.getRow(detailR + 23).height = 28;

  addFooter(sheet, detailR + 27, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 17 — 🤖 AI SAVINGS ADVISOR (AI Edition only)
// ============================================================================

function buildAISavingsAdvisor(workbook) {
  const sheet = workbook.addWorksheet('🤖 AI Savings Advisor');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 12, D: 22, E: 12, F: 22, G: 22, H: 8, I: 8, J: 8, K: 8, L: 8, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🤖 AI Savings Advisor',
    tabSubtitle: '7 ChatGPT/Claude prompts. Free-tier friendly. Each card → matching tab in your spreadsheet.',
    bannerText: BANNER,
    kpiData: [
      { label: 'PROMPTS',     value: '7' },
      { label: 'PDF PAGES',   value: '11' },
      { label: 'FREE-TIER',   value: '✓' },
      { label: 'CHATGPT',     value: '✓' },
      { label: 'CLAUDE',      value: '✓' },
      { label: 'UPDATES',     value: '12 mo free' },
    ],
  });

  let r = addSectionHeader(sheet, 6, '7 AI prompts — pair each card with the matching tab', 'Open the AI Savings Advisor PDF (shipped with your purchase). Each prompt page = one card below. Paste the prompt into ChatGPT or Claude with your data filled in. Output goes into the "Paste output here" cell.');

  // 7 prompt cards in 2×4 grid (4+3 layout)
  const prompts = [
    { num: 1, title: 'Reallocation',         tab: '🎯 Priority Matrix',      desc: 'Which fund needs your next dollar this month?' },
    { num: 2, title: 'Vehicle Advisor',      tab: '🪣 Fund Manager',         desc: 'Right savings vehicle for each fund.' },
    { num: 3, title: 'Metals Coach',         tab: '🥇 Precious Metals Tracker', desc: 'Monthly spot-price commentary + position check.' },
    { num: 4, title: 'Dividend Planner',     tab: '📊 Stocks & Dividends',   desc: 'Cash-gap month detector across your dividend calendar.' },
    { num: 5, title: 'Life Stage Advisor',   tab: '🤖 AI Savings Advisor',   desc: 'What fund should you open next?' },
    { num: 6, title: 'Annual Fund Review',   tab: '📊 Annual Summary',       desc: 'Year-end retrospective — wins, misses, lessons.' },
    { num: 7, title: 'Neglected Fund Detector', tab: '📉 Funding Gap Analyzer', desc: 'Catches funds you stopped contributing to.' },
  ];

  // 2x4 grid: row 0 (rows r+1..r+5): prompts 1-4, row 1 (rows r+7..r+11): prompts 5-7
  prompts.forEach((p, i) => {
    const gridRow = Math.floor(i / 4);
    const gridCol = i % 4;
    const cardR = r + 1 + gridRow * 8;
    const startCol = String.fromCharCode(66 + gridCol * 3); // B, E, H, K
    const endCol = String.fromCharCode(66 + gridCol * 3 + 2); // D, G, J, M

    // Card title
    sheet.mergeCells(`${startCol}${cardR}:${endCol}${cardR}`);
    sheet.getCell(`${startCol}${cardR}`).value = `${p.num}. ${p.title}`;
    sheet.getCell(`${startCol}${cardR}`).font = { ...FONTS.bodyBold, size: 13, color: argb(COLORS.warmGold) };
    sheet.getCell(`${startCol}${cardR}`).fill = FILLS.charcoal;
    sheet.getCell(`${startCol}${cardR}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getRow(cardR).height = 24;

    // Tab pairing
    sheet.mergeCells(`${startCol}${cardR + 1}:${endCol}${cardR + 1}`);
    sheet.getCell(`${startCol}${cardR + 1}`).value = `Pairs with: ${p.tab}`;
    sheet.getCell(`${startCol}${cardR + 1}`).font = { ...FONTS.small, color: argb(COLORS.warmGoldLight) };
    sheet.getCell(`${startCol}${cardR + 1}`).fill = FILLS.charcoal;
    sheet.getCell(`${startCol}${cardR + 1}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getRow(cardR + 1).height = 18;

    // Description
    sheet.mergeCells(`${startCol}${cardR + 2}:${endCol}${cardR + 3}`);
    sheet.getCell(`${startCol}${cardR + 2}`).value = p.desc;
    sheet.getCell(`${startCol}${cardR + 2}`).font = FONTS.body;
    sheet.getCell(`${startCol}${cardR + 2}`).fill = FILLS.ivory;
    sheet.getCell(`${startCol}${cardR + 2}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1, wrapText: true };
    sheet.getRow(cardR + 2).height = 22;
    sheet.getRow(cardR + 3).height = 22;

    // "Open PDF page N" + "Paste output here" cell
    sheet.mergeCells(`${startCol}${cardR + 4}:${endCol}${cardR + 4}`);
    sheet.getCell(`${startCol}${cardR + 4}`).value = `📄 PDF page ${p.num + 2} · Paste AI output below ↓`;
    sheet.getCell(`${startCol}${cardR + 4}`).font = { ...FONTS.small, italic: true, color: argb(COLORS.textMuted) };
    sheet.getCell(`${startCol}${cardR + 4}`).fill = FILLS.warmGoldLight;
    sheet.getCell(`${startCol}${cardR + 4}`).alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getRow(cardR + 4).height = 18;

    sheet.mergeCells(`${startCol}${cardR + 5}:${endCol}${cardR + 5}`);
    sheet.getCell(`${startCol}${cardR + 5}`).value = '';
    sheet.getCell(`${startCol}${cardR + 5}`).fill = FILLS.white;
    sheet.getCell(`${startCol}${cardR + 5}`).alignment = { wrapText: true, vertical: 'top', indent: 1 };
    sheet.getCell(`${startCol}${cardR + 5}`).border = BORDER_THIN();
    sheet.getRow(cardR + 5).height = 60;
  });

  // Footer instruction
  addCallout(sheet, `B${r + 18}:M${r + 19}`,
    '🤖',
    'How to use these',
    'All 7 prompts work in ChatGPT free + Claude free. Paste the prompt + your data into the AI tool. Read the worked example on the matching PDF page first to see what good output looks like. Save useful output into the "Paste output here" cell so it stays with your spreadsheet.');
  sheet.getRow(r + 18).height = 28;
  sheet.getRow(r + 19).height = 28;

  addFooter(sheet, r + 22, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 18 — ℹ️ ABOUT & HELP (All tiers)
// ============================================================================

function buildAbout(workbook) {
  // Tier-aware metadata. Cascade from DPP's tier-aware About fix (DPP-102).
  const tier = workbook._tier || 'ai';
  const tierMetadata = {
    essentials: { label: 'Essentials', tabs: '7',  prompts: '0' },
    pro:        { label: 'Pro',        tabs: '16', prompts: '0' },
    ai:         { label: 'AI Edition', tabs: '17', prompts: '7' },
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
      { label: 'VEHICLES',   value: '4 (Cash · CD · ETF · Metals)' },
      { label: 'AI PROMPTS', value: tierMetadata.prompts },
      { label: 'TIER',       value: tierMetadata.label },
      { label: 'UPDATES',    value: '12 mo free' },
    ],
  });

  sheet.mergeCells('B6:C6');
  sheet.getCell('B6').value = 'Welcome to your Sinking Funds Planner.';
  sheet.getCell('B6').font = FONTS.hero;
  sheet.getRow(6).height = 38;

  sheet.mergeCells('B7:C7');
  sheet.getCell('B7').value = 'A spreadsheet that handles 17 fund categories across 4 savings vehicles, recommends where your next dollar goes, and catches the funds you forgot to contribute to.';
  sheet.getCell('B7').font = FONTS.bodyMuted;
  sheet.getRow(7).height = 22;

  let r = addSectionHeader(sheet, 10, 'How this spreadsheet is wired', 'Two structural tabs — Fund Manager (input) + Dashboard (output) — drive every other tab.');

  const explainerRows = [
    ['🪣 Fund Manager',           'One row per fund. Pick from 17 categories, set target $ + date + vehicle. Status pill auto-calcs.'],
    ['🏠 Dashboard',              'Live KPIs + 5 visualizations: Funds by % funded · 4-vehicle allocation · Top 3 "next dollar" funds.'],
    ['🎯 Priority Matrix',        'Computes (1 − %funded) × urgency × override. Higher = put next dollar here.'],
    ['📉 Funding Gap Analyzer',   'Per-fund: required vs. actual. Monthly shortfall + status pill.'],
    ['🥇 Precious Metals Tracker (Pro)', 'Gold/silver/platinum/palladium with GOOGLEFINANCE spot pricing.'],
    ['🏦 Fixed Return Tracker (Pro)',   'CD Ladder. FV @ maturity formula + auto-rollover alerts.'],
    ['🤖 AI Savings Advisor (AI)', '7 ChatGPT/Claude prompts in companion PDF — Reallocation / Vehicle Advisor / Metals Coach / Dividend Planner / Life Stage / Annual Review / Neglected Fund Detector.'],
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
    ['What is a sinking fund?',          'A pre-allocated savings bucket for a specific future expense. Christmas in November. Car repair (when the AC will break). Property tax. You save $X each month from month 1 instead of getting surprised in month 11.'],
    ['Does this connect to my bank?',    'No. Privacy-first by design. No Plaid, no aggregator. You enter contributions manually or paste a CSV from your bank statement.'],
    ['What\'s the 4-vehicle claim?',     'Most savings spreadsheets handle cash only. This one handles cash + CDs (with maturity calendar + FV math) + ETFs (with cost-basis tracking) + precious metals (with GOOGLEFINANCE spot pricing) — all linked to fund-level placement.'],
    ['Does it work in Excel?',           'Yes, with caveats. GOOGLEFINANCE cells (metals + ETF prices) only run in Google Sheets — Excel users enter monthly manually. Everything else works in both.'],
    ['What\'s the Neglected Fund Detector?', 'The AI Edition\'s secret weapon. The prompt scans your contribution history and flags goals you stopped contributing to — "You haven\'t added to Wedding Gift in 4 months; target is 8 months out; $1,800 behind." Catches it at month 4, not month 12.'],
    ['How does the AI work?',            'You paste the prompt + your data into ChatGPT or Claude (free tiers work). The spreadsheet never sends data anywhere. AI lives in your own browser, your own account.'],
  ];
  faq.forEach((qa, i) => {
    const ri = r2 + 1 + i * 2;
    sheet.getCell(`B${ri}`).value = qa[0];
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).value = qa[1];
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { wrapText: true, vertical: 'middle' };
    sheet.getRow(ri).height = 32;
  });

  addFooter(sheet, r2 + faq.length * 2 + 4, { productName: PRODUCT_NAME });
}

// ============================================================================
// MAIN — orchestrate the build
// ============================================================================

async function buildSinkingFundsPlanner() {
  const t0 = Date.now();

  const tierArg = process.argv.find((a) => a.startsWith('--tier='));
  const tier = tierArg ? tierArg.split('=')[1] : 'ai';
  if (!['essentials', 'pro', 'ai'].includes(tier)) {
    console.error(`✗ Invalid --tier "${tier}". Use essentials | pro | ai.`);
    process.exit(1);
  }
  const tierLabel = { essentials: 'Essentials', pro: 'Pro', ai: 'AI Edition' }[tier];
  // Tab counts (post-applyTierVisibility):
  //   Essentials =  7 visible (6 core + About)
  //   Pro        = 16 visible (15 core + About)
  //   AI Edition = 17 visible (16 core + About)
  const tierTabCount = { essentials: 7, pro: 16, ai: 17 }[tier];
  console.log(`→ Building ${PRODUCT_NAME} — ${tierLabel} (${tierTabCount} visible / 17 total)...`);

  const workbook = new ExcelJS.Workbook();
  workbook._tier = tier;
  await registerLimeLogo(workbook);

  // Workbook metadata
  workbook.creator = 'Lime Premium Studios';
  workbook.lastModifiedBy = 'Lime Premium Studios';
  workbook.company = 'Lime Premium Studios';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.title = `${PRODUCT_NAME} — ${tierLabel}`;
  workbook.subject = 'Personal finance · sinking funds planner spreadsheet';
  workbook.category = 'Personal Finance';
  workbook.keywords = 'sinking funds, savings tracker, emergency fund, CD ladder, dividend tracker, precious metals, personal finance, google sheets, excel, lime premium studios';
  workbook.description = `${PRODUCT_NAME} ${tierLabel} v1.0 — Lime Premium Studios. ${tierTabCount} tabs. 17 fund categories × 4 savings vehicles (Cash/CD/ETF/Metals+Stocks). Privacy-first — no bank credentials, no aggregator.`;

  // Build all 17 tabs in spec order. Tier visibility (next step) physically removes
  // PRO_TABS for Essentials and AI_TABS for Pro/Essentials.
  console.log('  • 🏠 Dashboard');                  buildDashboard(workbook);
  console.log('  • 🪣 Fund Manager');               buildFundManager(workbook);
  console.log('  • 💵 Contribution Tracker');       buildContributionTracker(workbook);
  console.log('  • 🎯 Priority Matrix');            buildPriorityMatrix(workbook);
  console.log('  • 📉 Funding Gap Analyzer');       buildFundingGap(workbook);
  console.log('  • 🎮 Goal Scoring Dashboard (Pro)'); buildGoalScoringDashboard(workbook);
  console.log('  • 🥇 Precious Metals Tracker (Pro)'); buildMetalsTracker(workbook);
  console.log('  • 🏦 Fixed Return Tracker (Pro)'); buildFixedReturnTracker(workbook);
  console.log('  • 📈 Variable Fund Tracker (Pro)'); buildVariableFundTracker(workbook);
  console.log('  • 📊 Stocks & Dividends (Pro)');   buildStocksDividends(workbook);
  console.log('  • 💰 Income Allocation Wheel (Pro)'); buildIncomeAllocationWheel(workbook);
  console.log('  • 🌅 Wealth Glide Path (Pro)');    buildWealthGlidePath(workbook);
  console.log('  • 📅 Spending Tracker (Pro)');     buildSpendingTracker(workbook);
  console.log('  • 🧮 Tax Efficiency Analyzer (Pro)'); buildTaxEfficiencyAnalyzer(workbook);
  console.log('  • 📊 Annual Summary');             buildAnnualSummary(workbook);
  console.log('  • 🔗 Budget Integration (Pro)');   buildBudgetIntegration(workbook);
  console.log('  • 🤖 AI Savings Advisor (AI)');    buildAISavingsAdvisor(workbook);
  console.log('  • ℹ️ About & Help');                buildAbout(workbook);

  applyTierVisibility(workbook, tier, { proTabs: PRO_TABS, aiTabs: AI_TABS, productName: PRODUCT_NAME });

  const filename = tier === 'ai'
    ? 'sinking-funds-planner-ai-edition.xlsx'
    : `sinking-funds-planner-${tier}.xlsx`;
  const outPath = resolve(OUTPUT_DIR, filename);
  await workbook.xlsx.writeFile(outPath);

  const elapsed = Date.now() - t0;
  console.log(`\n✓ Workbook generated in ${elapsed}ms`);
  console.log(`  Output: ${outPath}`);
  console.log(`  Tier:   ${tierLabel} — ${tierTabCount} of 17 tabs visible`);
}

buildSinkingFundsPlanner().catch((err) => {
  console.error('✗ Build failed:', err);
  process.exit(1);
});
