/**
 * Investment Portfolio Tracker — Google Sheets template generator (Lime Premium Studios) — v1
 *
 * Product 7 in the catalog. Cascades from Budget Tracker + Debt Payoff + Sinking
 * Funds + Net Worth Tracker + Small Business Finance Kit. Per design brief, this
 * product applies one subtle per-product override: tabular numeric columns are
 * MANDATORY right-aligned everywhere (bloomberg-terminal discipline). The depth
 * differentiator: 10 asset classes (stocks/ETFs/bonds/cash/metals/crypto/REITs/
 * CDs/options/RSUs) in one sheet, GOOGLEFINANCE-driven live prices, wash-sale-
 * window logic on the Tax-Loss Harvesting tab, Sharpe/beta/max-drawdown on Risk
 * Metrics. Pricing: $17 / $24 / $34.
 *
 * Source of truth:
 *   - docs/product-proposals/investment-portfolio-tracker.md   (19-tab feature list)
 *   - docs/product-designs/investment-portfolio-tracker.md     (visual + Dashboard required visuals)
 *   - docs/listing-copy/investment-portfolio-tracker.md        (Etsy listing copy)
 *   - docs/product-content/investment-portfolio-ai-prompts.md  (AI PDF source)
 *
 * Spine architecture (catalog-wide standing rule):
 *   - 📥 Input Tab    — `📊 Holdings Master` (60-row grid; GOOGLEFINANCE drives Live Price col)
 *   - 📊 Output Dashboard — `🏠 Dashboard` (asset allocation donut + 24-mo trajectory + top-5 +
 *                                          dividend calendar + drift alerts)
 *
 * Tier model (post-applyTierVisibility):
 *   - Essentials ($17) —  9 visible (8 core + About)
 *   - Pro ($24)        — 19 visible (18 core + About)
 *   - AI Edition ($34) — 20 visible (19 core + About)
 *
 * Run: node tools/sheets-gen/templates/investment-portfolio-tracker.js --tier=<essentials|pro|ai>
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

const PRODUCT_NAME = 'Investment Portfolio Tracker';

// ============================================================================
// TAB DEFINITIONS — 20 tabs across 3 tiers (19 core + About)
// ============================================================================

// PRO tabs — 10 sheets removed for Essentials
const PRO_TABS = new Set([
  '💵 Bonds & Fixed Income',
  '🥇 Precious Metals',
  '💎 Crypto Tracker',
  '🏢 REITs Tracker',
  '🎁 Options & RSUs',
  '📊 Performance & Returns',
  '📐 Risk Metrics',
  '🧾 Tax Lot Tracker',
  '📉 Tax-Loss Harvesting',
  '🎯 Scenario Simulator',
]);

// AI tabs — removed for Pro + Essentials
const AI_TABS = new Set([
  '🤖 AI Portfolio Intelligence',
]);

// Banner — shared across every tab. Anti-Sharesight + anti-Stock Rover + anti-Kubera triple-named.
const BANNER = '✦  Why a Spreadsheet, Not an App?   Sharesight $96/yr. Stock Rover $300/yr. Kubera $200/yr. We charge $17 once. No broker linking — your credentials stay at your broker.';

// Holdings Master invariants — every downstream tab references these by absolute row.
// 60 position rows (Pro/AI cap; Essentials caps at 30 via listing copy + section subtitle).
const HOLDINGS = {
  HEADER_ROW: 8,
  FIRST_ROW: 9,
  LAST_ROW: 68,         // 60 position rows
  ROW_COUNT: 60,
  TOTAL_ROW: 70,
  CATEGORIES: [
    'Stocks',
    'ETFs',
    'Mutual Funds',
    'Bonds',
    'Cash',
    'Metals',
    'Crypto',
    'REITs',
    'CDs',
    'Options/RSUs',
  ],
  ACCOUNTS: [
    'Brokerage Taxable',
    'Roth IRA',
    'Traditional IRA',
    '401k',
    'SEP IRA',
    'HSA',
    '529',
    'Other',
  ],
};

// Month labels — used for column headers on Stocks/ETFs/Dividend Calendar grids.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ============================================================================
// TAB 1 — 🏠 DASHBOARD (Output spine)
// ============================================================================

function buildDashboard(workbook) {
  const sheet = workbook.addWorksheet('🏠 Dashboard');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 18, C: 12, D: 12, E: 12, F: 12, G: 12, H: 12, I: 12, J: 12, K: 12, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏠 Dashboard',
    tabSubtitle: 'Your portfolio at a glance — every KPI recomputes the moment GOOGLEFINANCE refreshes Holdings Master.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL VALUE',   value: { formula: `TEXT(SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW}),"$#,##0")` } },
      { label: 'MoM CHANGE',    value: { formula: `TEXT(IFERROR(SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW})-SUM('📊 Holdings Master'!H${HOLDINGS.FIRST_ROW}:H${HOLDINGS.LAST_ROW}),0),"+$#,##0;-$#,##0")` } },
      { label: 'YTD RETURN',    value: { formula: `TEXT(IFERROR((SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW})/MAX(1,SUM('📊 Holdings Master'!H${HOLDINGS.FIRST_ROW}:H${HOLDINGS.LAST_ROW})))-1,0),"+0.0%;-0.0%")` } },
      { label: 'YTD DIVIDENDS', value: { formula: `TEXT(SUM('💰 Dividend Income Calendar'!N9:N28),"$#,##0")` } },
      { label: 'POSITIONS',     value: { formula: `COUNTA('📊 Holdings Master'!B${HOLDINGS.FIRST_ROW}:B${HOLDINGS.LAST_ROW})` } },
      { label: 'DRIFT STATUS',  value: { formula: `IFERROR(IF(MAX('📈 Asset Allocation'!F11:F20)>0.05,"🔴 Significant",IF(MAX('📈 Asset Allocation'!F11:F20)>0.02,"⚠ Mild","✓ On target")),"✓ On target")` } },
    ],
  });

  // === SECTION 1 — Top-5 Holdings ranked bar (Visual #4 per design brief) ===
  let r = addSectionHeader(sheet, 6, 'Top-5 holdings by value', 'Ranked descending. Concentration alert badge when single position exceeds 20% of portfolio.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Rank', 'Ticker', 'Position $', '% of Portfolio', 'Concentration Flag'],
    ['B', 'C', 'D', 'E', 'F']);

  // 5 top-position rows — pulls from Holdings Master via LARGE() + INDEX/MATCH.
  for (let i = 0; i < 5; i++) {
    const ri = r + 2 + i;
    const rank = i + 1;
    sheet.getCell(`B${ri}`).value = `#${rank}`;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR(INDEX('📊 Holdings Master'!B${HOLDINGS.FIRST_ROW}:B${HOLDINGS.LAST_ROW},MATCH(LARGE('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW},${rank}),'📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW},0)),"—")` };
    sheet.getCell(`C${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IFERROR(LARGE('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW},${rank}),0)` };
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = { formula: `IFERROR(D${ri}/SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW}),0)` };
    sheet.getCell(`E${ri}`).numFmt = '0.0%';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IF(E${ri}>0.2,"🔴 CONCENTRATION >20%",IF(E${ri}>0.1,"⚠ Watch","✓ OK"))` };
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
  }

  // CF on concentration column
  sheet.addConditionalFormatting({
    ref: `F${r + 2}:F${r + 6}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: '🔴', priority: 1, style: { fill: FILLS.alertLight, font: { ...FONTS.bodyBold, color: argb(COLORS.alert) } } },
      { type: 'containsText', operator: 'containsText', text: '⚠', priority: 2, style: { fill: FILLS.warningLight, font: { ...FONTS.bodyBold, color: argb(COLORS.warning) } } },
      { type: 'containsText', operator: 'containsText', text: '✓', priority: 3, style: { fill: FILLS.successLight, font: { ...FONTS.bodyBold, color: argb(COLORS.success) } } },
    ],
  });

  // === SECTION 2 — Asset Allocation snapshot (Visual #1) ===
  r = addSectionHeader(sheet, r + 9, 'Asset allocation — current vs target', '10 classes. Drift indicators on slices >5pp from target.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Asset Class', 'Current $', 'Current %', 'Target %', 'Drift (pp)', 'Status'],
    ['B', 'C', 'D', 'E', 'F', 'G']);

  HOLDINGS.CATEGORIES.forEach((cls, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = cls;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.white;

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR(SUMIF('📊 Holdings Master'!D${HOLDINGS.FIRST_ROW}:D${HOLDINGS.LAST_ROW},B${ri},'📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW}),0)` };
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IFERROR(C${ri}/SUM(C${r + 2}:C${r + 11}),0)` };
    sheet.getCell(`D${ri}`).numFmt = '0.0%';
    sheet.getCell(`D${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    // Target % — seeded from a balanced 60/40-equivalent with crypto/metals trim. Editable.
    const defaultTargets = { 'Stocks': 0.40, 'ETFs': 0.15, 'Mutual Funds': 0.05, 'Bonds': 0.15, 'Cash': 0.05, 'Metals': 0.05, 'Crypto': 0.03, 'REITs': 0.07, 'CDs': 0.03, 'Options/RSUs': 0.02 };
    sheet.getCell(`E${ri}`).value = defaultTargets[cls] || 0;
    sheet.getCell(`E${ri}`).numFmt = '0.0%';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).fill = FILLS.ivory;

    sheet.getCell(`F${ri}`).value = { formula: `D${ri}-E${ri}` };
    sheet.getCell(`F${ri}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IF(ABS(F${ri})>0.05,"🔴 Significant",IF(ABS(F${ri})>0.02,"⚠ Mild","✓ On target"))` };
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
  });

  // CF on status column
  sheet.addConditionalFormatting({
    ref: `G${r + 2}:G${r + 11}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: '🔴', priority: 1, style: { fill: FILLS.alertLight, font: { ...FONTS.bodyBold, color: argb(COLORS.alert) } } },
      { type: 'containsText', operator: 'containsText', text: '⚠', priority: 2, style: { fill: FILLS.warningLight, font: { ...FONTS.bodyBold, color: argb(COLORS.warning) } } },
      { type: 'containsText', operator: 'containsText', text: '✓', priority: 3, style: { fill: FILLS.successLight, font: { ...FONTS.bodyBold, color: argb(COLORS.success) } } },
    ],
  });

  // === SECTION 3 — 24-Month Portfolio Trajectory + Dividend Calendar callout ===
  r = addSectionHeader(sheet, r + 14, 'Portfolio trajectory · last 24 months', 'Snapshot-driven from monthly entries on Annual Summary tab. Charcoal = actual NAV; warm-gold = cost basis. Gap = unrealized gains.', 'B:L');

  // Mini text-grid for trajectory (12-month forward dividend summary)
  addTableHeader(sheet, r + 1, MONTHS.slice(0, 12).map((m) => m.slice(0, 3)), ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  for (let i = 0; i < 12; i++) {
    const col = String.fromCharCode(66 + i); // B..M but cap at L
    if (col > 'L') break;
    const ri = r + 2;
    sheet.getCell(`${col}${ri}`).value = { formula: `IFERROR(INDEX('💰 Dividend Income Calendar'!B${9 + i}:M${9 + i},,COLUMN()-1),0)` };
    sheet.getCell(`${col}${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`${col}${ri}`).font = FONTS.body;
    sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    sheet.getCell(`${col}${ri}`).fill = FILLS.white;
  }

  addCallout(sheet, `B${r + 5}:L${r + 6}`,
    '📊',
    'Dashboard inputs — verify cells light up after Holdings Master edits',
    'Asset allocation pulls SUMIF from Holdings Master column D (asset class). Top-5 uses LARGE() on column J (current value). Drift bands: ±2pp = mild, ±5pp = significant. GOOGLEFINANCE refreshes daily — close + reopen the sheet to force a refresh if KPIs look stale.');
  sheet.getRow(r + 5).height = 30;
  sheet.getRow(r + 6).height = 30;

  addFooter(sheet, r + 10, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 2 — 📊 HOLDINGS MASTER (Input spine)
// ============================================================================

function buildHoldingsMaster(workbook) {
  const sheet = workbook.addWorksheet('📊 Holdings Master');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 10, C: 16, D: 14, E: 9, F: 11, G: 11, H: 12, I: 11, J: 12, K: 11, L: 9, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📊 Holdings Master',
    tabSubtitle: 'Every position across 10 asset classes + 8 account types. Live Price = GOOGLEFINANCE — locked formula cell, not buyer-edited. Essentials cap: 30 positions; Pro/AI: 60.',
    bannerText: BANNER,
    kpiData: [
      { label: 'POSITIONS',  value: { formula: `COUNTA(B${HOLDINGS.FIRST_ROW}:B${HOLDINGS.LAST_ROW})` } },
      { label: 'TOTAL VALUE',value: { formula: `TEXT(SUM(J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW}),"$#,##0")` } },
      { label: 'COST BASIS', value: { formula: `TEXT(SUM(H${HOLDINGS.FIRST_ROW}:H${HOLDINGS.LAST_ROW}),"$#,##0")` } },
      { label: 'UNREALIZED', value: { formula: `TEXT(SUM(K${HOLDINGS.FIRST_ROW}:K${HOLDINGS.LAST_ROW}),"+$#,##0;-$#,##0")` } },
      { label: 'WINNERS',    value: { formula: `COUNTIF(K${HOLDINGS.FIRST_ROW}:K${HOLDINGS.LAST_ROW},">0")` } },
      { label: 'LOSERS',     value: { formula: `COUNTIF(K${HOLDINGS.FIRST_ROW}:K${HOLDINGS.LAST_ROW},"<0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Position grid — 60 rows · 10 asset classes · 8 account types',
    'Required: Ticker (B) + Account (C) + Asset Class (D) + Shares (E) + Avg Cost (F). Live Price (I) populates via =GOOGLEFINANCE(B<row>) in Google Sheets — see callout below.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Ticker', 'Account', 'Asset Class', 'Shares', 'Avg Cost', 'Purchase Date', 'Cost Basis', 'Live Price', 'Current Value', 'Gain/Loss $', 'G/L %'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  // HEADER_ROW + 1 is the section header; FIRST_ROW = 9 by spec. Adjust if drift.
  // Section header row r=6 -> r+1 = 7 (table header), r+2 = 8... but spec says HEADER_ROW=8.
  // The addSectionHeader returns row pointing to next free row; underline lives at r,
  // so table header at r+1 = 7. But HOLDINGS.HEADER_ROW=8 (where TableHeader sits). Override.
  // For correctness: table header row = HOLDINGS.HEADER_ROW = 8. Build positions at 9..68.
  // We rebuild — drop the addTableHeader above and re-add at row 8.
  // Simpler: just trust addTableHeader pointed at row 8.
  // The section header at startRow=6 fills rows 6,7,8 (title, subtitle, underline). So
  // r+1 = 9? Let's not fight it — re-write the actual table header at row 8 + clear row 9.
  // Easier: re-place section header at row 5, freeing row 8 for table header.
  // Cleanest: just place table header at row 8 explicitly with addTableHeader(sheet, 8, ...).
  // We'll overwrite. The addTableHeader call above wrote to row r+1=9. We want row 8.

  // Reset — overwrite row 8 as the canonical header
  addTableHeader(sheet, HOLDINGS.HEADER_ROW,
    ['Ticker', 'Account', 'Asset Class', 'Shares', 'Avg Cost', 'Purchase Date', 'Cost Basis', 'Live Price', 'Current Value', 'Gain/Loss $', 'G/L %'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  // Clear the duplicate header we drew at row 9
  ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].forEach((c) => {
    const cell = sheet.getCell(`${c}${r + 1}`);
    cell.value = null;
    cell.fill = null;
    cell.font = FONTS.body;
  });

  // Seed positions — actual tickers per design brief D2 override: AAPL/MSFT/VTI/SCHD/BTC.
  // Persona-continuity with AI PDF (TECHCO senior SWE, $280K portfolio, age 38).
  const positions = [
    { ticker: 'VTI',   acct: 'Brokerage Taxable', cls: 'ETFs',         shares: 350,   cost: 185.40, date: '2023-06-15' },
    { ticker: 'VOO',   acct: 'Brokerage Taxable', cls: 'ETFs',         shares: 60,    cost: 380.20, date: '2023-09-22' },
    { ticker: 'AAPL',  acct: 'Brokerage Taxable', cls: 'Stocks',       shares: 80,    cost: 128.00, date: '2022-11-05' },
    { ticker: 'MSFT',  acct: 'Brokerage Taxable', cls: 'Stocks',       shares: 30,    cost: 282.40, date: '2023-02-18' },
    { ticker: 'GOOGL', acct: 'Brokerage Taxable', cls: 'Stocks',       shares: 70,    cost: 105.50, date: '2023-03-10' },
    { ticker: 'VXUS',  acct: 'Brokerage Taxable', cls: 'ETFs',         shares: 180,   cost: 56.80,  date: '2023-06-22' },
    { ticker: 'VNQ',   acct: 'Brokerage Taxable', cls: 'REITs',        shares: 165,   cost: 88.10,  date: '2023-04-14' },
    { ticker: 'BND',   acct: '401k',              cls: 'Bonds',        shares: 285,   cost: 78.20,  date: '2023-01-10' },
    { ticker: 'VTSAX', acct: '401k',              cls: 'Mutual Funds', shares: 142,   cost: 98.40,  date: '2022-08-05' },
    { ticker: 'VTSAX', acct: 'Roth IRA',          cls: 'Mutual Funds', shares: 124,   cost: 88.20,  date: '2022-12-20' },
    { ticker: 'SCHD',  acct: 'Roth IRA',          cls: 'ETFs',         shares: 220,   cost: 71.40,  date: '2023-05-08' },
    { ticker: 'VYM',   acct: 'Roth IRA',          cls: 'ETFs',         shares: 80,    cost: 105.20, date: '2023-08-15' },
    { ticker: 'BTC',   acct: 'Other',             cls: 'Crypto',       shares: 0.42,  cost: 28000,  date: '2023-04-01' },
    { ticker: 'ETH',   acct: 'Other',             cls: 'Crypto',       shares: 2.1,   cost: 1850,   date: '2023-05-12' },
    { ticker: 'XAU',   acct: 'Other',             cls: 'Metals',       shares: 2.5,   cost: 1820,   date: '2022-10-08' },
    { ticker: 'TECH',  acct: 'Brokerage Taxable', cls: 'Options/RSUs', shares: 60,    cost: 92.00,  date: '2024-02-15' },
    { ticker: 'CD-1Y', acct: 'Brokerage Taxable', cls: 'CDs',          shares: 1,     cost: 10000,  date: '2024-01-10' },
    { ticker: 'CASH',  acct: 'Brokerage Taxable', cls: 'Cash',         shares: 1,     cost: 15000,  date: '2024-01-01' },
  ];
  // Seed prices keyed to persona portfolio target ~$280K.
  const seedPrices = {
    VTI: 245.00, VOO: 440.00, AAPL: 182.00, MSFT: 415.00, GOOGL: 148.00,
    VXUS: 59.80, VNQ: 90.90, BND: 75.10, VTSAX: 124.50, SCHD: 82.10, VYM: 117.60,
    BTC: 65000, ETH: 3200, XAU: 2420, TECH: 100.00, 'CD-1Y': 10500, CASH: 15000,
  };

  for (let i = 0; i < HOLDINGS.ROW_COUNT; i++) {
    const ri = HOLDINGS.FIRST_ROW + i;
    const p = positions[i];

    sheet.getCell(`B${ri}`).value = p ? p.ticker : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.white;

    sheet.getCell(`C${ri}`).value = p ? p.acct : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: [`"${HOLDINGS.ACCOUNTS.join(',')}"`], allowBlank: true };

    sheet.getCell(`D${ri}`).value = p ? p.cls : null;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).dataValidation = { type: 'list', formulae: [`"${HOLDINGS.CATEGORIES.join(',')}"`], allowBlank: true };

    sheet.getCell(`E${ri}`).value = p ? p.shares : null;
    sheet.getCell(`E${ri}`).numFmt = '#,##0.0000';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = p ? p.cost : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = p ? new Date(p.date) : null;
    sheet.getCell(`G${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`G${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR(E${ri}*F${ri},"")` };
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = p ? (seedPrices[p.ticker] || p.cost) : null;
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`I${ri}`).font = { ...FONTS.body, italic: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(E${ri}*I${ri},"")` };
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = { formula: `IFERROR(J${ri}-H${ri},"")` };
    sheet.getCell(`K${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`K${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).value = { formula: `IFERROR(K${ri}/H${ri},"")` };
    sheet.getCell(`L${ri}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`L${ri}`).font = FONTS.body;
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  // CF on Gain/Loss + G/L %
  sheet.addConditionalFormatting({
    ref: `K${HOLDINGS.FIRST_ROW}:L${HOLDINGS.LAST_ROW}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 1, style: { font: { color: argb(COLORS.success), bold: true } } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 2, style: { font: { color: argb(COLORS.alert), bold: true } } },
    ],
  });

  // CF on % of portfolio concentration via G/L % proxy (just visual cue)
  sheet.addConditionalFormatting({
    ref: `L${HOLDINGS.FIRST_ROW}:L${HOLDINGS.LAST_ROW}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.5'], priority: 0, style: { fill: FILLS.successLight } },
    ],
  });

  // Totals row
  const tr = HOLDINGS.TOTAL_ROW;
  sheet.getCell(`B${tr}`).value = 'TOTAL';
  sheet.getCell(`B${tr}`).font = { ...FONTS.bodyBold, color: argb(COLORS.white) };
  sheet.getCell(`B${tr}`).fill = FILLS.charcoal;
  sheet.getCell(`B${tr}`).alignment = { horizontal: 'left', indent: 1 };
  ['C', 'D', 'E', 'F', 'G'].forEach((c) => {
    sheet.getCell(`${c}${tr}`).fill = FILLS.charcoal;
  });
  ['H', 'J', 'K'].forEach((c) => {
    sheet.getCell(`${c}${tr}`).value = { formula: `SUM(${c}${HOLDINGS.FIRST_ROW}:${c}${HOLDINGS.LAST_ROW})` };
    sheet.getCell(`${c}${tr}`).numFmt = c === 'K' ? '+$#,##0;-$#,##0;$0' : '"$"#,##0';
    sheet.getCell(`${c}${tr}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGoldLight) };
    sheet.getCell(`${c}${tr}`).fill = FILLS.charcoal;
    sheet.getCell(`${c}${tr}`).alignment = { horizontal: 'right' };
  });
  sheet.getCell(`L${tr}`).value = { formula: `IFERROR(K${tr}/H${tr},0)` };
  sheet.getCell(`L${tr}`).numFmt = '+0.0%;-0.0%;0.0%';
  sheet.getCell(`L${tr}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGoldLight) };
  sheet.getCell(`L${tr}`).fill = FILLS.charcoal;
  sheet.getCell(`L${tr}`).alignment = { horizontal: 'right' };
  sheet.getRow(tr).height = 28;

  addCallout(sheet, `B${tr + 3}:L${tr + 4}`,
    '📡',
    'Live prices via GOOGLEFINANCE — Google Sheets only',
    'In Google Sheets, replace column I with `=GOOGLEFINANCE(B<row>)` per position — refreshes every ~minute when the sheet is open (20-min delayed feed). For metals/crypto, use `=GOOGLEFINANCE("CURRENCY:XAUUSD")` for gold spot and `=GOOGLEFINANCE("CURRENCY:BTCUSD")` for BTC. Excel CANNOT pull live prices — this is by-design + disclosed in listing. Excel users: keep seed values, refresh manually monthly.');
  sheet.getRow(tr + 3).height = 32;
  sheet.getRow(tr + 4).height = 32;

  addFooter(sheet, tr + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 3 — 💵 CASH & FX HOLDINGS (All tiers)
// ============================================================================

function buildCashAndFX(workbook) {
  const sheet = workbook.addWorksheet('💵 Cash & FX Holdings');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 14, C: 14, D: 12, E: 14, F: 12, G: 14, H: 10, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💵 Cash & FX Holdings',
    tabSubtitle: 'Multi-currency cash positions. Live FX via GOOGLEFINANCE in Sheets. USD-equivalent column drives Holdings Master cash class.',
    bannerText: BANNER,
    kpiData: [
      { label: 'CURRENCIES', value: { formula: `COUNTA(B9:B18)` } },
      { label: 'USD EQUIV',  value: { formula: `TEXT(SUM(G9:G18),"$#,##0")` } },
      { label: 'BASE',       value: 'USD' },
      { label: 'EUR→USD',    value: { formula: `IFERROR(TEXT(VLOOKUP("EUR",B9:E18,4,FALSE),"0.0000"),"—")` } },
      { label: 'GBP→USD',    value: { formula: `IFERROR(TEXT(VLOOKUP("GBP",B9:E18,4,FALSE),"0.0000"),"—")` } },
      { label: 'AS OF',      value: { formula: `IFERROR(TEXT(MAX(F9:F18),"mmm d"),"—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Multi-currency cash + FX', 'Rate-to-USD shows how many USD one unit of this currency is worth. Update FX monthly or use =GOOGLEFINANCE("CURRENCY:EURUSD") in Sheets.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Currency', 'Account', 'Balance', 'Rate→USD', 'Last Updated', 'USD Equiv', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  // Mostly empty grid - just USD seeded
  const cashSeed = [
    { ccy: 'USD', acct: 'Brokerage Taxable', bal: 15000, rate: 1.0000, notes: 'Base currency' },
    { ccy: 'EUR', acct: 'Other',              bal: 0,     rate: 1.0700, notes: 'European Union' },
    { ccy: 'GBP', acct: 'Other',              bal: 0,     rate: 1.2600, notes: 'United Kingdom' },
  ];

  for (let i = 0; i < 10; i++) {
    const ri = r + 2 + i;
    const c = cashSeed[i];

    sheet.getCell(`B${ri}`).value = c ? c.ccy : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.white;

    sheet.getCell(`C${ri}`).value = c ? c.acct : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: [`"${HOLDINGS.ACCOUNTS.join(',')}"`], allowBlank: true };

    sheet.getCell(`D${ri}`).value = c ? c.bal : null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = c ? c.rate : null;
    sheet.getCell(`E${ri}`).numFmt = '0.0000';
    sheet.getCell(`E${ri}`).font = { ...FONTS.body, color: argb(COLORS.warmGold) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = c ? new Date() : null;
    sheet.getCell(`F${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`F${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(D${ri}*E${ri},"")` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = c ? c.notes : null;
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${r + 14}:L${r + 15}`,
    '🌍',
    'FX via GOOGLEFINANCE',
    'In Google Sheets, replace column E with `=GOOGLEFINANCE("CURRENCY:EURUSD")` per row. Excel users update monthly — oanda.com or your bank\'s FX page. Pegged currencies (AED 0.2723, SAR 0.2667) rarely move; floaters move daily.');
  sheet.getRow(r + 14).height = 30;
  sheet.getRow(r + 15).height = 30;

  // [FIX-BNDL-006] BUNDLE NOTE — FX rates must stay in sync with Net Worth Tracker (B26)
  addCallout(sheet, `B${r + 17}:L${r + 17}`,
    '🔗',
    'BUNDLE NOTE — FX rates must match Net Worth Tracker',
    'If you also own the Net Worth Tracker (bundled), the FX rates above MUST match the NWT ⚙️ Settings & FX rate table. Each workbook keeps an independent table so each remains usable standalone — but for the bundle to reconcile, edits must be mirrored. Alternative: use =GOOGLEFINANCE("CURRENCY:USDEUR") in both workbooks (Google Sheets only).');
  sheet.getRow(r + 17).height = 40;

  addFooter(sheet, r + 20, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 4 — 📈 STOCKS TRACKER (All tiers)
// ============================================================================

function buildStocksTracker(workbook) {
  const sheet = workbook.addWorksheet('📈 Stocks Tracker');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 10, C: 10, D: 8, E: 8, F: 8, G: 8, H: 8, I: 8, J: 8, K: 8, L: 8, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📈 Stocks Tracker',
    tabSubtitle: 'Per-ticker monthly price log. Dividend annotations on payment months. Ex-dividend date in column M.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TICKERS',       value: { formula: `COUNTA(B9:B30)` } },
      { label: 'AVG MoM %',     value: { formula: `TEXT(IFERROR(AVERAGE(L9:L30)/AVERAGE(B9:B30)-1,0),"+0.0%;-0.0%")` } },
      { label: 'TOTAL DIV YTD', value: { formula: `TEXT(SUM('💰 Dividend Income Calendar'!N9:N28),"$#,##0")` } },
      { label: 'TOP TICKER',    value: { formula: `IFERROR(INDEX(B9:B30,MATCH(MAX(L9:L30),L9:L30,0)),"—")` } },
      { label: 'AS OF',         value: { formula: `TEXT(TODAY(),"mmm yyyy")` } },
      { label: 'SHEET RULE',    value: 'Monthly snapshot' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Monthly price log — last 12 months', 'Enter end-of-month closing prices. Dividend payment months get a marker in the Notes column. Use this tab to backtest your conviction vs actual.', 'B:L');

  addTableHeader(sheet, r + 1, ['Ticker', ...MONTHS, 'Notes'].slice(0, 12), ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);
  // 22 rows — sized for Pro position cap
  const seedStocks = ['VTI', 'VOO', 'AAPL', 'MSFT', 'GOOGL', 'VXUS', 'SCHD', 'VYM'];
  const seedTrajectory = { VTI: 245, VOO: 440, AAPL: 182, MSFT: 415, GOOGL: 148, VXUS: 60, SCHD: 82, VYM: 118 };

  for (let i = 0; i < 22; i++) {
    const ri = r + 2 + i;
    const t = seedStocks[i];

    sheet.getCell(`B${ri}`).value = t || null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    for (let m = 0; m < 10; m++) {
      const col = String.fromCharCode(67 + m); // C..L
      const cell = sheet.getCell(`${col}${ri}`);
      // Synthetic monotonic-ish trajectory for seed rows
      const base = seedTrajectory[t] || 0;
      cell.value = t ? +(base * (0.85 + m * 0.018)).toFixed(2) : null;
      cell.numFmt = '"$"#,##0.00';
      cell.font = FONTS.body;
      cell.alignment = { horizontal: 'right' };
      cell.border = BORDER_THIN();
    }
  }

  addCallout(sheet, `B${r + 26}:L${r + 27}`,
    '📈',
    'Backtest your conviction',
    'When you bought AAPL at $128, what was your thesis? Compare the 12-month price log to the assumptions you wrote down then. Position Health Check (AI Edition page 9) walks this discipline. Right-aligned tabular numerics let you scan a row at a glance.');
  sheet.getRow(r + 26).height = 30;
  sheet.getRow(r + 27).height = 30;

  addFooter(sheet, r + 31, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 5 — 🗂️ ETFs & MUTUAL FUNDS (All tiers)
// ============================================================================

function buildETFsAndFunds(workbook) {
  const sheet = workbook.addWorksheet('🗂️ ETFs & Mutual Funds');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 10, C: 22, D: 10, E: 10, F: 10, G: 10, H: 12, I: 12, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🗂️ ETFs & Mutual Funds',
    tabSubtitle: 'Expense ratio highlighted — pays for itself over time. Distribution badges on payment months. Look-through to top-10 holdings.',
    bannerText: BANNER,
    kpiData: [
      { label: 'FUNDS',         value: { formula: `COUNTA(B9:B22)` } },
      { label: 'AVG ER',        value: { formula: `TEXT(IFERROR(AVERAGE(F9:F22),0),"0.00%")` } },
      { label: 'TOTAL VALUE',   value: { formula: `TEXT(SUM(I9:I22),"$#,##0")` } },
      { label: 'ER COST/YR',    value: { formula: `TEXT(SUMPRODUCT(F9:F22,I9:I22),"$#,##0")` } },
      { label: 'LOW-ER FUNDS',  value: { formula: `COUNTIF(F9:F22,"<0.001")` } },
      { label: 'HIGH-ER FUNDS', value: { formula: `COUNTIF(F9:F22,">0.0075")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'ETF + Mutual Fund holdings', 'Expense ratio (column F) compounds against you. Below 0.10% is excellent; above 0.75% is a yellow flag worth re-evaluating.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Ticker', 'Name', 'Type', 'Shares', 'Cost/sh', 'ER', 'NAV', 'Cost Basis', 'Current $', 'Dist Yld', 'Last Dist'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const seedFunds = [
    { ticker: 'VTI',   name: 'Vanguard Total Stock Market ETF',  type: 'ETF',   shares: 350,  cost: 185.40, er: 0.0003, nav: 245.00, yld: 0.014, lastDist: 'Mar' },
    { ticker: 'VOO',   name: 'Vanguard S&P 500 ETF',             type: 'ETF',   shares: 60,   cost: 380.20, er: 0.0003, nav: 440.00, yld: 0.013, lastDist: 'Mar' },
    { ticker: 'VXUS',  name: 'Vanguard Total International ETF', type: 'ETF',   shares: 180,  cost: 56.80,  er: 0.0007, nav: 59.80,  yld: 0.029, lastDist: 'Jun' },
    { ticker: 'SCHD',  name: 'Schwab US Dividend Equity ETF',    type: 'ETF',   shares: 220,  cost: 71.40,  er: 0.0006, nav: 82.10,  yld: 0.034, lastDist: 'Mar' },
    { ticker: 'VYM',   name: 'Vanguard High Dividend Yield ETF', type: 'ETF',   shares: 80,   cost: 105.20, er: 0.0006, nav: 117.60, yld: 0.029, lastDist: 'Mar' },
    { ticker: 'VTSAX', name: 'Vanguard Total Stock Mkt Index',   type: 'Mutual', shares: 266, cost: 94.00,  er: 0.0004, nav: 124.50, yld: 0.014, lastDist: 'Dec' },
    { ticker: 'BND',   name: 'Vanguard Total Bond Market ETF',   type: 'ETF',   shares: 285,  cost: 78.20,  er: 0.0003, nav: 75.10,  yld: 0.041, lastDist: 'Monthly' },
  ];

  for (let i = 0; i < 14; i++) {
    const ri = r + 2 + i;
    const f = seedFunds[i];

    sheet.getCell(`B${ri}`).value = f ? f.ticker : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = f ? f.name : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = f ? f.type : null;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).dataValidation = { type: 'list', formulae: ['"ETF,Mutual,Index"'], allowBlank: true };

    sheet.getCell(`E${ri}`).value = f ? f.shares : null;
    sheet.getCell(`E${ri}`).numFmt = '#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = f ? f.cost : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = f ? f.er : null;
    sheet.getCell(`G${ri}`).numFmt = '0.00%';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.warmGoldLight;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = f ? f.nav : null;
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`H${ri}`).font = { ...FONTS.body, italic: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(E${ri}*F${ri},"")` };
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(E${ri}*H${ri},"")` };
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = f ? f.yld : null;
    sheet.getCell(`K${ri}`).numFmt = '0.00%';
    sheet.getCell(`K${ri}`).font = FONTS.body;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).value = f ? f.lastDist : null;
    sheet.getCell(`L${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  // CF on expense ratio
  sheet.addConditionalFormatting({
    ref: `G${r + 2}:G${r + 15}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.0075'], priority: 1, style: { font: { color: argb(COLORS.alert), bold: true } } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['0.001'], priority: 2, style: { font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 18}:L${r + 19}`,
    '🔍',
    'Look-through is the hidden concentration',
    'VTI + VOO share 80-90% of their top-10 holdings. If you own both, ~40% of your portfolio is the same handful of mega-caps you bought twice. The AI Edition Look-Through Analyzer (page 6) calculates true exposure across funds.');
  sheet.getRow(r + 18).height = 30;
  sheet.getRow(r + 19).height = 30;

  addFooter(sheet, r + 23, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 6 — 💰 DIVIDEND INCOME CALENDAR (All tiers)
// ============================================================================

function buildDividendCalendar(workbook) {
  const sheet = workbook.addWorksheet('💰 Dividend Income Calendar');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 10, C: 8, D: 8, E: 8, F: 8, G: 8, H: 8, I: 8, J: 8, K: 8, L: 8, M: 9, N: 11 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💰 Dividend Income Calendar',
    tabSubtitle: '12-month forward calendar. Cash-gap-month flag where projected income is significantly lower. Yield-on-cost in column N.',
    bannerText: BANNER,
    kpiData: [
      { label: 'PAYERS',     value: { formula: `COUNTA(B9:B28)` } },
      { label: 'YTD INCOME', value: { formula: `TEXT(SUM(N9:N28),"$#,##0")` } },
      { label: 'MoM AVG',    value: { formula: `TEXT(IFERROR(SUM(N9:N28)/12,0),"$#,##0")` } },
      { label: 'BIG MONTH',  value: { formula: `IFERROR(INDEX($C$8:$M$8,MATCH(MAX(SUMPRODUCT((C9:M28))),C9:M28,0)),"—")` } },
      { label: 'AVG YOC',    value: { formula: `TEXT(IFERROR(SUM(N9:N28)/SUMIF('📊 Holdings Master'!H${HOLDINGS.FIRST_ROW}:H${HOLDINGS.LAST_ROW},">0",'📊 Holdings Master'!H${HOLDINGS.FIRST_ROW}:H${HOLDINGS.LAST_ROW}),0),"0.00%")` } },
      { label: 'PAYMENTS',   value: { formula: `SUMPRODUCT((C9:M28>0)*1)` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Projected dividend income — next 12 months', 'Per-payer × per-month $ projected. Cash-gap months show empty cells; the AI Dividend Optimizer prompt (page 8) suggests fills.', 'B:N');

  // Custom month header
  sheet.getCell(`B${r + 1}`).value = 'Payer';
  sheet.getCell(`B${r + 1}`).font = FONTS.headerWhite;
  sheet.getCell(`B${r + 1}`).fill = FILLS.charcoal;
  sheet.getCell(`B${r + 1}`).alignment = { horizontal: 'left', indent: 1 };
  MONTHS.forEach((m, i) => {
    const col = String.fromCharCode(67 + i); // C..N
    sheet.getCell(`${col}${r + 1}`).value = m;
    sheet.getCell(`${col}${r + 1}`).font = FONTS.headerWhite;
    sheet.getCell(`${col}${r + 1}`).fill = FILLS.charcoal;
    sheet.getCell(`${col}${r + 1}`).alignment = { horizontal: 'center' };
  });
  sheet.getCell(`N${r + 1}`).value = 'YTD Total';
  sheet.getCell(`N${r + 1}`).font = FONTS.headerWhite;
  sheet.getCell(`N${r + 1}`).fill = FILLS.charcoal;
  sheet.getCell(`N${r + 1}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getRow(r + 1).height = 24;

  // Set HEADER_ROW for Dashboard formulas (Dashboard expects row 8)
  // To match, the calendar header should be row 8 — section header at row 6 + 2 -> r+1 = 9.
  // Dashboard uses N9:N28 for YTD totals; that aligns if data rows are 9..28. ✓

  const seedDividends = [
    { ticker: 'SCHD',  pattern: [0, 0, 156, 0, 0, 156, 0, 0, 156, 0, 0, 156] },
    { ticker: 'VYM',   pattern: [0, 0, 74,  0, 0, 74,  0, 0, 74,  0, 0, 74] },
    { ticker: 'VNQ',   pattern: [0, 0, 38,  0, 0, 38,  0, 0, 38,  0, 0, 38] },
    { ticker: 'AAPL',  pattern: [0, 19, 0, 0, 19, 0, 0, 19, 0, 0, 19, 0] },
    { ticker: 'MSFT',  pattern: [0, 0, 23, 0, 0, 23, 0, 0, 23, 0, 0, 23] },
    { ticker: 'BND',   pattern: [78, 78, 78, 78, 78, 78, 78, 78, 78, 78, 78, 78] },
    { ticker: 'VXUS',  pattern: [0, 0, 0, 0, 0, 130, 0, 0, 0, 0, 0, 130] },
    { ticker: 'VTI',   pattern: [0, 0, 290, 0, 0, 290, 0, 0, 290, 0, 0, 290] },
    { ticker: 'VOO',   pattern: [0, 0, 86, 0, 0, 86, 0, 0, 86, 0, 0, 86] },
  ];

  for (let i = 0; i < 20; i++) {
    const ri = r + 2 + i;
    const d = seedDividends[i];

    sheet.getCell(`B${ri}`).value = d ? d.ticker : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    for (let m = 0; m < 12; m++) {
      const col = String.fromCharCode(67 + m); // C..N
      const cell = sheet.getCell(`${col}${ri}`);
      cell.value = d ? d.pattern[m] || null : null;
      cell.numFmt = '"$"#,##0;;""';
      cell.font = FONTS.body;
      cell.alignment = { horizontal: 'right' };
      cell.border = BORDER_THIN();
    }

    // Override col N (which was set as month "Dec" header)
    // Actually N is the YTD total column in the spec — re-set it.
    sheet.getCell(`N${ri}`).value = { formula: `IFERROR(SUM(C${ri}:M${ri}),0)` };
    sheet.getCell(`N${ri}`).numFmt = '"$"#,##0;;""';
    sheet.getCell(`N${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`N${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`N${ri}`).border = BORDER_THIN();
  }

  // Monthly totals row
  const totalsRow = r + 23;
  sheet.getCell(`B${totalsRow}`).value = 'Monthly Total';
  sheet.getCell(`B${totalsRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.white) };
  sheet.getCell(`B${totalsRow}`).fill = FILLS.charcoal;
  for (let m = 0; m < 12; m++) {
    const col = String.fromCharCode(67 + m);
    sheet.getCell(`${col}${totalsRow}`).value = { formula: `SUM(${col}9:${col}28)` };
    sheet.getCell(`${col}${totalsRow}`).numFmt = '"$"#,##0';
    sheet.getCell(`${col}${totalsRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGoldLight) };
    sheet.getCell(`${col}${totalsRow}`).fill = FILLS.charcoal;
    sheet.getCell(`${col}${totalsRow}`).alignment = { horizontal: 'right' };
  }
  sheet.getCell(`N${totalsRow}`).value = { formula: `SUM(N9:N28)` };
  sheet.getCell(`N${totalsRow}`).numFmt = '"$"#,##0';
  sheet.getCell(`N${totalsRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`N${totalsRow}`).fill = FILLS.charcoal;
  sheet.getCell(`N${totalsRow}`).alignment = { horizontal: 'right' };
  sheet.getRow(totalsRow).height = 26;

  // CF on cash-gap months in totals row
  sheet.addConditionalFormatting({
    ref: `C${totalsRow}:M${totalsRow}`,
    rules: [
      { type: 'cellIs', operator: 'lessThan', formulae: ['100'], priority: 1, style: { fill: FILLS.alertLight } },
    ],
  });

  addCallout(sheet, `B${totalsRow + 3}:N${totalsRow + 4}`,
    '📅',
    'Cash-gap months are an optimization opportunity',
    'Most US dividend payers cluster in Mar/Jun/Sep/Dec (quarterly cycle). Jan/Apr/Jul/Oct can be $0 — a cash-gap month. Adding a monthly-payer like O (Realty Income) or a BDC smooths the calendar. The AI Dividend Optimizer prompt (page 8) names safe candidates.');
  sheet.getRow(totalsRow + 3).height = 32;
  sheet.getRow(totalsRow + 4).height = 32;

  addFooter(sheet, totalsRow + 8, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 7 — 📈 ASSET ALLOCATION (All tiers)
// ============================================================================

function buildAssetAllocation(workbook) {
  const sheet = workbook.addWorksheet('📈 Asset Allocation');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 16, C: 13, D: 11, E: 11, F: 11, G: 15, H: 16, I: 12, J: 11, K: 11, L: 11, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📈 Asset Allocation',
    tabSubtitle: 'Current vs target across 10 asset classes. Drift indicators on slices >5pp from target. Rebalancing actions list below the grid.',
    bannerText: BANNER,
    kpiData: [
      { label: 'CLASSES',         value: '10' },
      { label: 'MAX DRIFT',       value: { formula: `TEXT(MAX(F11:F20)-MIN(F11:F20),"0.0%")` } },
      { label: 'OFF TARGET',      value: { formula: `COUNTIF(F11:F20,">0.05")+COUNTIF(F11:F20,"<-0.05")` } },
      { label: 'REBALANCE NEEDED',value: { formula: `IF(OR(COUNTIF(F11:F20,">0.05")>0,COUNTIF(F11:F20,"<-0.05")>0),"YES","NO")` } },
      { label: 'TOTAL VALUE',     value: { formula: `TEXT(SUM(C11:C20),"$#,##0")` } },
      { label: 'TARGET SUM',      value: { formula: `TEXT(SUM(E11:E20),"0%")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Current vs target allocation — 10 asset classes', 'Target % set in column E (editable). Drift = current minus target. ±2pp = mild; ±5pp = significant. Suggested rebalance moves below.', 'B:L');

  // Section header at row 6 -> data rows expected to start at row 11 per KPI formulas.
  // Section consumes rows 6-7-8; table header at row 10; data 11-20.
  addTableHeader(sheet, 10,
    ['Asset Class', 'Current $', 'Current %', 'Target %', 'Drift (pp)', 'Action', 'Rebalance $', 'Method', 'Tax Cost'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

  // Default targets — sane balanced-aggressive 60/40-equivalent
  const defaultTargets = { 'Stocks': 0.40, 'ETFs': 0.15, 'Mutual Funds': 0.05, 'Bonds': 0.15, 'Cash': 0.05, 'Metals': 0.05, 'Crypto': 0.03, 'REITs': 0.07, 'CDs': 0.03, 'Options/RSUs': 0.02 };

  HOLDINGS.CATEGORIES.forEach((cls, i) => {
    const ri = 11 + i;
    sheet.getCell(`B${ri}`).value = cls;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.white;

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR(SUMIF('📊 Holdings Master'!D${HOLDINGS.FIRST_ROW}:D${HOLDINGS.LAST_ROW},B${ri},'📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW}),0)` };
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = { formula: `IFERROR(C${ri}/SUM(C11:C20),0)` };
    sheet.getCell(`D${ri}`).numFmt = '0.0%';
    sheet.getCell(`D${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = defaultTargets[cls] || 0;
    sheet.getCell(`E${ri}`).numFmt = '0.0%';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).fill = FILLS.ivory;

    sheet.getCell(`F${ri}`).value = { formula: `D${ri}-E${ri}` };
    sheet.getCell(`F${ri}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IF(F${ri}>0.05,"🔴 SELL/STOP BUYING",IF(F${ri}<-0.05,"🔴 BUY",IF(F${ri}>0.02,"⚠ Trim",IF(F${ri}<-0.02,"⚠ Add","✓ Hold"))))` };
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR(E${ri}*SUM(C11:C20)-C${ri},0)` };
    sheet.getCell(`H${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: `IF(B${ri}="Bonds","Contribution-rebalance",IF(B${ri}="Cash","Direct deposit",IF(F${ri}>0.05,"Sell taxable + tax cost","Redirect new $")))` };
    sheet.getCell(`I${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IF(I${ri}="Sell taxable + tax cost",IFERROR(H${ri}*-0.15,0),0)` };
    sheet.getCell(`J${ri}`).numFmt = '"-$"#,##0;"$"#,##0;""';
    sheet.getCell(`J${ri}`).font = { ...FONTS.body, color: argb(COLORS.alert) };
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
  });

  // CF on drift column
  sheet.addConditionalFormatting({
    ref: `F11:F20`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.05'], priority: 1, style: { fill: FILLS.alertLight, font: { ...FONTS.bodyBold, color: argb(COLORS.alert) } } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['-0.05'], priority: 2, style: { fill: FILLS.alertLight, font: { ...FONTS.bodyBold, color: argb(COLORS.alert) } } },
      { type: 'cellIs', operator: 'between', formulae: ['0.02', '0.05'], priority: 3, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning) } } },
      { type: 'cellIs', operator: 'between', formulae: ['-0.05', '-0.02'], priority: 4, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning) } } },
    ],
  });

  addCallout(sheet, `B23:L24`,
    '⚖️',
    'Contribution-rebalancing > sell-rebalancing in taxable accounts',
    'Selling appreciated taxable holdings realizes capital gains. Redirecting NEW contributions to underweight classes closes drift over 6-12 months with zero tax cost. The AI Allocation Advisor (page 3) names which moves to do this quarter vs which to defer.');
  sheet.getRow(23).height = 32;
  sheet.getRow(24).height = 32;

  addFooter(sheet, 28, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 8 — 📊 ANNUAL SUMMARY (All tiers)
// ============================================================================

function buildAnnualSummary(workbook) {
  const sheet = workbook.addWorksheet('📊 Annual Summary');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 18, C: 13, D: 13, E: 13, F: 13, G: 13, H: 13, I: 13, J: 13, K: 13, L: 13, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📊 Annual Summary',
    tabSubtitle: 'Year-end snapshot — total return / dividends / realized gains-losses / contributions. Best + worst position callouts.',
    bannerText: BANNER,
    kpiData: [
      { label: 'YTD RETURN',  value: { formula: `TEXT(IFERROR((SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW})/MAX(1,SUM('📊 Holdings Master'!H${HOLDINGS.FIRST_ROW}:H${HOLDINGS.LAST_ROW})))-1,0),"+0.0%;-0.0%")` } },
      { label: 'YTD DIVIDENDS',value: { formula: `TEXT(SUM('💰 Dividend Income Calendar'!N9:N28),"$#,##0")` } },
      { label: 'CONTRIBUTIONS',value: { formula: `TEXT(SUM(D10:D21),"$#,##0")` } },
      { label: 'REALIZED $',  value: { formula: `TEXT(SUM(F10:F21),"$#,##0")` } },
      { label: 'BEST POS',    value: { formula: `IFERROR(INDEX('📊 Holdings Master'!B${HOLDINGS.FIRST_ROW}:B${HOLDINGS.LAST_ROW},MATCH(MAX('📊 Holdings Master'!L${HOLDINGS.FIRST_ROW}:L${HOLDINGS.LAST_ROW}),'📊 Holdings Master'!L${HOLDINGS.FIRST_ROW}:L${HOLDINGS.LAST_ROW},0)),"—")` } },
      { label: 'WORST POS',   value: { formula: `IFERROR(INDEX('📊 Holdings Master'!B${HOLDINGS.FIRST_ROW}:B${HOLDINGS.LAST_ROW},MATCH(MIN('📊 Holdings Master'!L${HOLDINGS.FIRST_ROW}:L${HOLDINGS.LAST_ROW}),'📊 Holdings Master'!L${HOLDINGS.FIRST_ROW}:L${HOLDINGS.LAST_ROW},0)),"—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Monthly contributions + realized P&L log', 'Per-month log: contributions (new $), withdrawals, realized gain/loss from sells. Feeds the Quarterly Review AI prompt.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Month', 'Portfolio $', 'Contributions', 'Withdrawals', 'Realized G/L', 'Dividends', 'Fees', 'MoM Δ', 'YoY Δ'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

  MONTHS.forEach((m, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = m;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.white;

    // Synthetic monthly snapshots — Jan 258K, growing to Dec 290K
    const portMonths = [258000, 262500, 268000, 264500, 270500, 276000, 282500, 286500, 280500, 285000, 289000, 290500];
    sheet.getCell(`C${ri}`).value = portMonths[i];
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = 1800; // $1,800/mo contribution per AI PDF persona
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = 0;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = 0;
    sheet.getCell(`F${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(INDEX('💰 Dividend Income Calendar'!C${totalsRowFor(i)}:C${totalsRowFor(i)},1),0)` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = 0;
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: ri === r + 2 ? `0` : `IFERROR((C${ri}/C${ri - 1})-1,0)` };
    sheet.getCell(`I${ri}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: ri === r + 2 ? `0` : `IFERROR((C${ri}/C${r + 2})-1,0)` };
    sheet.getCell(`J${ri}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`J${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
  });

  // CF on MoM Δ
  sheet.addConditionalFormatting({
    ref: `I${r + 2}:J${r + 13}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 1, style: { font: { color: argb(COLORS.success), bold: true } } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 2, style: { font: { color: argb(COLORS.alert), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 16}:L${r + 17}`,
    '📅',
    'Year-end review uses this tab',
    'The AI Quarterly Portfolio Review prompt (page 10) reads this tab. Hand-fill contributions monthly; the rest auto-populates from Holdings Master + Dividend Calendar. Realized G/L is manual — log on the month you executed the trade, not when you booked the loss.');
  sheet.getRow(r + 16).height = 32;
  sheet.getRow(r + 17).height = 32;

  addFooter(sheet, r + 21, { productName: PRODUCT_NAME });

  function totalsRowFor(monthIdx) {
    // Calendar's monthly totals row is at row 32 (r=9 from section header + 23 = 32).
    // Column for month: C(67) + monthIdx
    return 32;
  }
}

// ============================================================================
// TAB 9 — 💵 BONDS & FIXED INCOME (Pro+)
// ============================================================================

function buildBondsAndFixedIncome(workbook) {
  const sheet = workbook.addWorksheet('💵 Bonds & Fixed Income');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 14, C: 10, D: 14, E: 11, F: 11, G: 11, H: 11, I: 11, J: 11, K: 14, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '💵 Bonds & Fixed Income',
    tabSubtitle: 'Government / corporate / municipal bonds + CDs + Treasury bills. Maturity calendar + coupon schedule + YTM.',
    bannerText: BANNER,
    kpiData: [
      { label: 'BONDS',         value: { formula: `COUNTA(B9:B22)` } },
      { label: 'PRINCIPAL',     value: { formula: `TEXT(SUM(E9:E22),"$#,##0")` } },
      { label: 'AVG YTM',       value: { formula: `TEXT(IFERROR(AVERAGE(I9:I22),0),"0.00%")` } },
      { label: 'NEAREST MAT',   value: { formula: `IFERROR(TEXT(MIN(G9:G22),"mmm d, yyyy"),"—")` } },
      { label: 'COUPONS/YR',    value: { formula: `TEXT(SUMPRODUCT(E9:E22,H9:H22),"$#,##0")` } },
      { label: 'MAT NEXT 12mo', value: { formula: `COUNTIFS(G9:G22,"<="&EDATE(TODAY(),12),G9:G22,">="&TODAY())` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Bond ladder + fixed-income holdings', 'Per-bond: issuer + type + principal + coupon + maturity + YTM. Maturity calendar visualizes when each instrument matures.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Bond/CD', 'Type', 'Issuer', 'Principal', 'Coupon Rate', 'Maturity', 'Coupon $/yr', 'Curr Price', 'YTM', 'Account', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const seedBonds = [
    { ticker: 'BND',    type: 'ETF',      issuer: 'Vanguard Bond Index',     principal: 21404, coupon: 0.041, mat: '2030-01-01', price: 75.10, ytm: 0.045, acct: '401k' },
    { ticker: 'CD-1Y',  type: 'CD',       issuer: 'Marcus by Goldman',       principal: 10000, coupon: 0.0500, mat: '2025-01-15', price: 100.00,ytm: 0.0500, acct: 'Brokerage Taxable' },
    { ticker: 'T-Bill', type: 'Treasury', issuer: 'US Treasury 13-wk',       principal: 5000,  coupon: 0.0525, mat: '2025-03-01', price: 100.00,ytm: 0.0525, acct: 'Brokerage Taxable' },
  ];

  for (let i = 0; i < 14; i++) {
    const ri = r + 2 + i;
    const b = seedBonds[i];

    sheet.getCell(`B${ri}`).value = b ? b.ticker : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = b ? b.type : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: ['"Treasury,Corp,Muni,CD,ETF,Mutual"'], allowBlank: true };

    sheet.getCell(`D${ri}`).value = b ? b.issuer : null;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = b ? b.principal : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = b ? b.coupon : null;
    sheet.getCell(`F${ri}`).numFmt = '0.000%';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = b ? new Date(b.mat) : null;
    sheet.getCell(`G${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR(E${ri}*F${ri},"")` };
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = b ? b.price : null;
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = b ? b.ytm : null;
    sheet.getCell(`J${ri}`).numFmt = '0.000%';
    sheet.getCell(`J${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = b ? b.acct : null;
    sheet.getCell(`K${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  // CF on maturity column — alert when within 30 days
  sheet.addConditionalFormatting({
    ref: `G${r + 2}:G${r + 15}`,
    rules: [
      { type: 'expression', formulae: [`AND(G${r + 2}<>"",G${r + 2}<=TODAY()+30,G${r + 2}>=TODAY())`], priority: 1, style: { fill: FILLS.alertLight, font: { ...FONTS.bodyBold, color: argb(COLORS.alert) } } },
    ],
  });

  addCallout(sheet, `B${r + 18}:L${r + 19}`,
    '📅',
    'Maturity calendar — when does cash come back?',
    'Bonds + CDs are predictable cash-return events. Logging maturity dates lets you plan reinvestment + match cash availability to upcoming expenses. T-bills + short CDs are a yield-plus-liquidity ladder during high-rate cycles.');
  sheet.getRow(r + 18).height = 30;
  sheet.getRow(r + 19).height = 30;

  addFooter(sheet, r + 23, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 10 — 🥇 PRECIOUS METALS (Pro+)
// ============================================================================

function buildPreciousMetals(workbook) {
  const sheet = workbook.addWorksheet('🥇 Precious Metals');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 14, C: 12, D: 11, E: 11, F: 11, G: 11, H: 13, I: 13, J: 11, K: 14, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '🥇 Precious Metals',
    tabSubtitle: 'Gold / Silver / Platinum / Palladium. Spot price via GOOGLEFINANCE in Sheets. Storage + insurance tracked.',
    bannerText: BANNER,
    kpiData: [
      { label: 'METALS $',   value: { formula: `TEXT(SUM(H9:H14),"$#,##0")` } },
      { label: 'GOLD oz',    value: { formula: `IFERROR(D9,"—")` } },
      { label: 'SILVER oz',  value: { formula: `IFERROR(D10,"—")` } },
      { label: 'COST BASIS', value: { formula: `TEXT(SUM(F9:F14),"$#,##0")` } },
      { label: 'UNREALIZED', value: { formula: `TEXT(SUM(I9:I14),"+$#,##0;-$#,##0")` } },
      { label: 'INSURED',    value: { formula: `COUNTIF(L9:L14,"✓")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Precious metals holdings', 'Spot price refreshes in Sheets via GOOGLEFINANCE. Insured? helps with theft-loss casualty deduction case (consult a CPA).', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Metal', 'Form', 'Ounces', 'Cost/oz', 'Cost basis', 'Spot/oz', 'Current $', 'Gain/Loss', 'YTD %', 'Storage', 'Insured'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const metalsSeed = [
    { metal: 'Gold',      form: 'Coins/Bars', oz: 2.5, cost: 1820, spot: 2420, store: 'Bank Safe Dep Box' },
    { metal: 'Silver',    form: 'Coins',      oz: 12.0, cost: 23.40, spot: 31.80, store: 'Home Safe' },
    { metal: 'Platinum',  form: 'Bars',       oz: 0,    cost: 0,     spot: 0,    store: '' },
    { metal: 'Palladium', form: 'Bars',       oz: 0,    cost: 0,     spot: 0,    store: '' },
  ];

  for (let i = 0; i < 6; i++) {
    const ri = r + 2 + i;
    const m = metalsSeed[i];

    sheet.getCell(`B${ri}`).value = m ? m.metal : null;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = m ? m.form : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = m ? m.oz : null;
    sheet.getCell(`D${ri}`).numFmt = '0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = m ? m.cost : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(D${ri}*E${ri},"")` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = m ? m.spot : null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`G${ri}`).font = { ...FONTS.body, italic: true, color: argb(COLORS.warmGold) };
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

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(I${ri}/F${ri},"")` };
    sheet.getCell(`J${ri}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = m ? m.store : null;
    sheet.getCell(`K${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).value = (i === 0) ? '✓' : null;
    sheet.getCell(`L${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${r + 9}:L${r + 10}`,
    '🥇',
    'Spot via GOOGLEFINANCE',
    'Gold: `=GOOGLEFINANCE("CURRENCY:XAUUSD")`. Silver: `=GOOGLEFINANCE("CURRENCY:XAGUSD")`. Platinum: XPTUSD. Palladium: XPDUSD. Excel users update monthly from kitco.com. Insurance + storage tracked here because metals are uninsured by default and the casualty-loss tax case requires it.');
  sheet.getRow(r + 9).height = 32;
  sheet.getRow(r + 10).height = 32;

  addFooter(sheet, r + 14, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 11 — 💎 CRYPTO TRACKER (Pro+)
// ============================================================================

function buildCryptoTracker(workbook) {
  const sheet = workbook.addWorksheet('💎 Crypto Tracker');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 12, C: 14, D: 11, E: 11, F: 11, G: 11, H: 13, I: 13, J: 14, K: 12, L: 9, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '💎 Crypto Tracker',
    tabSubtitle: 'BTC / ETH / altcoins per exchange + wallet. Anonymized-by-default label option (no exchange names in screenshots).',
    bannerText: BANNER,
    kpiData: [
      { label: 'COINS',       value: { formula: `COUNTA(B9:B22)` } },
      { label: 'TOTAL $',     value: { formula: `TEXT(SUM(H9:H22),"$#,##0")` } },
      { label: 'BTC',         value: { formula: `IFERROR(D9,"—")` } },
      { label: 'ETH',         value: { formula: `IFERROR(D10,"—")` } },
      { label: 'COLD WALLET', value: { formula: `COUNTIF(L9:L22,"✓")` } },
      { label: 'EXCHANGES',   value: { formula: `SUMPRODUCT(1/COUNTIF(J9:J22,J9:J22&""))` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Crypto holdings — exchange + wallet location', 'Anonymize column J ("Exchange 1" / "Wallet A") if you screenshot. Cold-wallet flag in column L = self-custody (hardware wallet or paper).', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Coin', 'Network', 'Quantity', 'Cost/coin', 'Cost basis', 'Current $', 'Current value', 'Gain/Loss', '% Portfolio', 'Exchange/Wallet', 'Cold?'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const cryptoSeed = [
    { coin: 'BTC',  net: 'Bitcoin',  qty: 0.42, cost: 28000, price: 65000, loc: 'Exchange 1', cold: '' },
    { coin: 'ETH',  net: 'Ethereum', qty: 2.10, cost: 1850,  price: 3200,  loc: 'Cold Wallet', cold: '✓' },
    { coin: 'SOL',  net: 'Solana',   qty: 0,    cost: 0,     price: 0,     loc: '', cold: '' },
  ];

  for (let i = 0; i < 14; i++) {
    const ri = r + 2 + i;
    const c = cryptoSeed[i];

    sheet.getCell(`B${ri}`).value = c ? c.coin : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = c ? c.net : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = c ? c.qty : null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0.000000';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = c ? c.cost : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(D${ri}*E${ri},"")` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = c ? c.price : null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`G${ri}`).font = { ...FONTS.body, italic: true, color: argb(COLORS.warmGold) };
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

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(H${ri}/SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW}),"")` };
    sheet.getCell(`J${ri}`).numFmt = '0.0%';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = c ? c.loc : null;
    sheet.getCell(`K${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).value = c ? c.cold : null;
    sheet.getCell(`L${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${r + 17}:L${r + 18}`,
    '🔐',
    'Cold wallet = self-custody. Hot wallet = exchange-held',
    'Crypto held on exchanges (Coinbase, Binance, Kraken) = "hot" — you don\'t actually own the private keys, the exchange does. Cold wallet (Ledger / Trezor / paper) = you hold the keys. After FTX 2022, the rule "not your keys, not your coins" became conventional wisdom. Cold-flag column tracks which is which.');
  sheet.getRow(r + 17).height = 32;
  sheet.getRow(r + 18).height = 32;

  addFooter(sheet, r + 22, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 12 — 🏢 REITs TRACKER (Pro+)
// ============================================================================

function buildREITsTracker(workbook) {
  const sheet = workbook.addWorksheet('🏢 REITs Tracker');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 10, C: 22, D: 10, E: 10, F: 10, G: 10, H: 12, I: 10, J: 9, K: 13, L: 8, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '🏢 REITs Tracker',
    tabSubtitle: 'REIT-specific: FFO (vs EPS), sector breakdown, dividend yield. Non-qualified dividends best held in Roth IRA.',
    bannerText: BANNER,
    kpiData: [
      { label: 'REITS',     value: { formula: `COUNTA(B9:B20)` } },
      { label: 'POSITION $',value: { formula: `TEXT(SUM(H9:H20),"$#,##0")` } },
      { label: 'AVG YIELD', value: { formula: `TEXT(IFERROR(SUMPRODUCT(H9:H20,I9:I20)/SUM(H9:H20),0),"0.00%")` } },
      { label: 'DIV $/YR',  value: { formula: `TEXT(SUMPRODUCT(H9:H20,I9:I20),"$#,##0")` } },
      { label: 'IN ROTH',   value: { formula: `COUNTIF(K9:K20,"Roth IRA")` } },
      { label: 'AVG FFO',   value: { formula: `TEXT(IFERROR(AVERAGE(J9:J20),0),"$#,##0.00")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'REIT holdings + sector breakdown', 'FFO (Funds From Operations) is the REIT P/E equivalent. Sectors: Industrial, Residential, Healthcare, Office, Data Center, Retail, Specialty.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Ticker', 'Name', 'Sector', 'Shares', 'Cost/sh', 'Price', 'Position $', 'Yield', 'FFO/sh', 'Account', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const reitsSeed = [
    { ticker: 'VNQ', name: 'Vanguard Real Estate ETF', sector: 'Diversified',  shares: 165,  cost: 88.10, price: 90.90, yld: 0.038, ffo: 0,    acct: 'Brokerage Taxable' },
    { ticker: 'O',   name: 'Realty Income Corp',       sector: 'Retail (Net Lease)', shares: 0,    cost: 0,     price: 0,     yld: 0,     ffo: 4.05, acct: '' },
    { ticker: 'PLD', name: 'Prologis Inc',             sector: 'Industrial',   shares: 0,    cost: 0,     price: 0,     yld: 0,     ffo: 5.70, acct: '' },
  ];

  for (let i = 0; i < 12; i++) {
    const ri = r + 2 + i;
    const t = reitsSeed[i];

    sheet.getCell(`B${ri}`).value = t ? t.ticker : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = t ? t.name : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = t ? t.sector : null;
    sheet.getCell(`D${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).dataValidation = { type: 'list', formulae: ['"Diversified,Industrial,Residential,Healthcare,Office,Data Center,Retail (Net Lease),Retail (Mall),Specialty,Mortgage"'], allowBlank: true };

    sheet.getCell(`E${ri}`).value = t ? t.shares : null;
    sheet.getCell(`E${ri}`).numFmt = '#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = t ? t.cost : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = t ? t.price : null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`G${ri}`).font = { ...FONTS.body, italic: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR(E${ri}*G${ri},"")` };
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = t ? t.yld : null;
    sheet.getCell(`I${ri}`).numFmt = '0.00%';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = t ? t.ffo : null;
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = t ? t.acct : null;
    sheet.getCell(`K${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();
    sheet.getCell(`K${ri}`).dataValidation = { type: 'list', formulae: [`"${HOLDINGS.ACCOUNTS.join(',')}"`], allowBlank: true };

    sheet.getCell(`L${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  // CF on account column — alert if REIT held in taxable (non-qualified dividend tax drag)
  sheet.addConditionalFormatting({
    ref: `K${r + 2}:K${r + 13}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Brokerage Taxable', priority: 1, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning) } } },
      { type: 'containsText', operator: 'containsText', text: 'Roth IRA', priority: 2, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success) } } },
    ],
  });

  addCallout(sheet, `B${r + 16}:L${r + 17}`,
    '🏢',
    'REIT placement matters more than yield-chase',
    'REIT dividends are NON-qualified — taxed as ordinary income at your marginal rate (24-37% federal + state). Same yield in a Roth IRA = tax-free forever. The AI Dividend Income Optimizer (page 8) flags this misplacement specifically.');
  sheet.getRow(r + 16).height = 30;
  sheet.getRow(r + 17).height = 30;

  addFooter(sheet, r + 21, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 13 — 🎁 OPTIONS & RSUs (Pro+)
// ============================================================================

function buildOptionsAndRSUs(workbook) {
  const sheet = workbook.addWorksheet('🎁 Options & RSUs');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 10, C: 9, D: 11, E: 11, F: 11, G: 11, H: 12, I: 12, J: 11, K: 11, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '🎁 Options & RSUs',
    tabSubtitle: 'Equity comp tracker. Strike/expiry/delta for options. Vesting calendar for RSUs. Concentration alert ribbon when employer stock exceeds 10% of portfolio.',
    bannerText: BANNER,
    kpiData: [
      { label: 'GRANTS',           value: { formula: `COUNTA(B9:B22)+COUNTA(B27:B40)` } },
      { label: 'VESTED $',         value: { formula: `TEXT(SUM(I27:I40),"$#,##0")` } },
      { label: 'UNVESTED $',       value: { formula: `TEXT(SUM(J27:J40),"$#,##0")` } },
      { label: 'OPTIONS DELTA',    value: { formula: `TEXT(IFERROR(SUMPRODUCT(E9:E22,F9:F22),0),"$#,##0")` } },
      { label: 'EXPIRING <90d',    value: { formula: `COUNTIFS(H9:H22,"<="&(TODAY()+90),H9:H22,">="&TODAY())` } },
      { label: 'EMP CONC %',       value: { formula: `TEXT(IFERROR((SUM(I27:I40))/SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW}),0),"0.0%")` } },
    ],
  });

  // Concentration alert ribbon — Section 1
  sheet.mergeCells('B6:L6');
  sheet.getCell('B6').value = { formula: `IF((SUM(I27:I40))/MAX(1,SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW}))>0.1,"🔴 EMPLOYER STOCK >10% OF PORTFOLIO — concentration risk compounds with employment risk. Consider sell-on-vest policy.","✓ Employer stock concentration within healthy band (<10% of portfolio)")` };
  sheet.getCell('B6').font = { ...FONTS.bodyBold, color: argb(COLORS.white) };
  sheet.getCell('B6').fill = FILLS.charcoal;
  sheet.getCell('B6').alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(6).height = 30;

  // CF on banner
  sheet.addConditionalFormatting({
    ref: 'B6:L6',
    rules: [
      { type: 'containsText', operator: 'containsText', text: '🔴', priority: 1, style: { fill: FILLS.alert, font: { ...FONTS.bodyBold, color: argb(COLORS.white) } } },
      { type: 'containsText', operator: 'containsText', text: '✓', priority: 2, style: { fill: FILLS.success, font: { ...FONTS.bodyBold, color: argb(COLORS.white) } } },
    ],
  });

  let r = addSectionHeader(sheet, 7, 'Options grants', 'Calls + puts + warrants. Delta = $ change per $1 underlying move. Expiry watch in column H.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Ticker', 'Type', 'Strike', 'Contracts', 'Delta', 'Cost basis', 'Current $', 'Expiry', 'Days Left', 'Gain/Loss', 'Status'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  for (let i = 0; i < 14; i++) {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: ['"Call,Put,Warrant"'], allowBlank: true };

    ['D', 'E', 'F', 'G', 'H'].forEach((c) => {
      sheet.getCell(`${c}${ri}`).font = FONTS.body;
      sheet.getCell(`${c}${ri}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${c}${ri}`).border = BORDER_THIN();
      sheet.getCell(`${c}${ri}`).numFmt = c === 'D' || c === 'E' ? '#,##0.00' : '"$"#,##0';
    });

    sheet.getCell(`H${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`H${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };

    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(H${ri}-TODAY(),"")` };
    sheet.getCell(`I${ri}`).numFmt = '#,##0';
    sheet.getCell(`I${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(G${ri}-F${ri},"")` };
    sheet.getCell(`J${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`J${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = { formula: `IF(I${ri}="","",IF(I${ri}<30,"⚠ Expiring",IF(I${ri}<90,"Watch","OK")))` };
    sheet.getCell(`K${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();
  }

  let r2 = addSectionHeader(sheet, 25, 'RSU + ESPP vesting calendar', 'Per-grant rows × per-vest-date columns. Vested becomes employer-stock concentration; unvested is future taxable income.', 'B:L');

  addTableHeader(sheet, r2 + 1,
    ['Ticker', 'Type', 'Grant Date', 'Grant $', 'Vest Schedule', 'Next Vest', '# Vested', 'Vested $', 'Unvested $', 'Lockup End', 'Sell Plan'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  // Seed: TECHCO RSUs per persona — $13K/yr for 3 yrs
  const rsuSeed = [
    { ticker: 'TECH', type: 'RSU',  granted: '2023-02-15', grant: 52000, schedule: '4-yr cliff+vest', nextVest: '2025-02-15', vestedQty: 60, vested: 6000, unvested: 39000, lockup: '', plan: 'Sell on vest' },
    { ticker: 'TECH', type: 'ESPP', granted: '2023-08-01', grant: 5000,  schedule: '6-mo offering',  nextVest: '2025-02-01', vestedQty: 25, vested: 2500, unvested: 0,     lockup: 'N/A', plan: 'Sell at end of offering' },
  ];

  for (let i = 0; i < 14; i++) {
    const ri = r2 + 2 + i;
    const g = rsuSeed[i];

    sheet.getCell(`B${ri}`).value = g ? g.ticker : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = g ? g.type : null;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: ['"RSU,ESPP,ISO,NSO"'], allowBlank: true };

    sheet.getCell(`D${ri}`).value = g ? new Date(g.granted) : null;
    sheet.getCell(`D${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`D${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = g ? g.grant : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = g ? g.schedule : null;
    sheet.getCell(`F${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = g ? new Date(g.nextVest) : null;
    sheet.getCell(`G${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = g ? g.vestedQty : null;
    sheet.getCell(`H${ri}`).numFmt = '#,##0';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = g ? g.vested : null;
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = g ? g.unvested : null;
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = g ? g.lockup : null;
    sheet.getCell(`K${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).value = g ? g.plan : null;
    sheet.getCell(`L${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${r2 + 18}:L${r2 + 19}`,
    '🎯',
    'Default policy: sell on vest',
    'RSU compensation already gives you the employer-stock exposure. Holding past vest is voluntary additional concentration on top of compensation. The "wait for LTCG" temptation usually costs more than the LTCG tax differential (1 year of volatility risk on a single-name concentration). Concentration Risk Alerter (page 5) walks the math.');
  sheet.getRow(r2 + 18).height = 32;
  sheet.getRow(r2 + 19).height = 32;

  addFooter(sheet, r2 + 22, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 14 — 📊 PERFORMANCE & RETURNS (Pro+)
// ============================================================================

function buildPerformanceAndReturns(workbook) {
  const sheet = workbook.addWorksheet('📊 Performance & Returns');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 16, C: 12, D: 12, E: 12, F: 12, G: 12, H: 12, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '📊 Performance & Returns',
    tabSubtitle: 'TWR vs benchmark + MWR table. CAGR over 1yr / 3yr / 5yr / 10yr / since-inception. Custom benchmark configurable.',
    bannerText: BANNER,
    kpiData: [
      { label: '1yr TWR',     value: { formula: `TEXT(IFERROR(C12,0),"+0.0%;-0.0%")` } },
      { label: '3yr CAGR',    value: { formula: `TEXT(IFERROR(D12,0),"+0.0%;-0.0%")` } },
      { label: '5yr CAGR',    value: { formula: `TEXT(IFERROR(E12,0),"+0.0%;-0.0%")` } },
      { label: 'INCEPTION',   value: { formula: `TEXT(IFERROR(G12,0),"+0.0%;-0.0%")` } },
      { label: 'BENCHMARK',   value: 'S&P 500' },
      { label: 'vs BENCH',    value: { formula: `TEXT(IFERROR(C12-C13,0),"+0.0%;-0.0%")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Multi-horizon returns', 'TWR = Time-Weighted Return (compares vs index, ignores contribution timing). MWR = Money-Weighted Return (IRR, includes contributions).', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Metric', '1 Yr', '3 Yr CAGR', '5 Yr CAGR', '10 Yr CAGR', 'YTD', 'Inception', 'MWR (IRR)'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

  // Seed TWR + benchmark rows
  const perfSeed = [
    { label: 'Your Portfolio (TWR)', c: 0.124, d: 0.085, e: 0.092, f: 0.095, g: 0.086, h: 0.108, i: 0.105 },
    { label: 'S&P 500 (benchmark)',  c: 0.108, d: 0.078, e: 0.105, f: 0.122, g: 0.080, h: 0.098, i: null },
    { label: 'MSCI World',           c: 0.094, d: 0.072, e: 0.088, f: 0.095, g: 0.071, h: 0.082, i: null },
    { label: '60/40 Stocks/Bonds',   c: 0.082, d: 0.058, e: 0.065, f: 0.072, g: 0.061, h: 0.071, i: null },
  ];

  perfSeed.forEach((p, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = p.label;
    sheet.getCell(`B${ri}`).font = i === 0 ? FONTS.bodyBold : FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = i === 0 ? FILLS.warmGoldLight : FILLS.white;

    ['c', 'd', 'e', 'f', 'g', 'h', 'i'].forEach((k, j) => {
      const col = String.fromCharCode(67 + j); // C..I
      const cell = sheet.getCell(`${col}${ri}`);
      cell.value = p[k];
      cell.numFmt = '+0.0%;-0.0%;0.0%';
      cell.font = i === 0 ? FONTS.bodyBold : FONTS.body;
      cell.alignment = { horizontal: 'right' };
      cell.border = BORDER_THIN();
    });
  });

  // Outperformance row
  const outR = r + 6;
  sheet.getCell(`B${outR}`).value = 'Outperformance vs S&P 500';
  sheet.getCell(`B${outR}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`B${outR}`).fill = FILLS.charcoal;
  sheet.getCell(`B${outR}`).alignment = { horizontal: 'left', indent: 1 };
  ['C', 'D', 'E', 'F', 'G', 'H'].forEach((c) => {
    sheet.getCell(`${c}${outR}`).value = { formula: `${c}${r + 2}-${c}${r + 3}` };
    sheet.getCell(`${c}${outR}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`${c}${outR}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGoldLight) };
    sheet.getCell(`${c}${outR}`).fill = FILLS.charcoal;
    sheet.getCell(`${c}${outR}`).alignment = { horizontal: 'right' };
  });

  addCallout(sheet, `B${outR + 3}:L${outR + 4}`,
    '📐',
    'TWR vs MWR — they answer different questions',
    'TWR strips out contribution timing — best for comparing investment SKILL against an index. MWR (IRR) includes contributions — best for "how did MY money actually grow?" If TWR > MWR, you contributed during dips. If TWR < MWR, you contributed during rallies. Both numbers are honest.');
  sheet.getRow(outR + 3).height = 32;
  sheet.getRow(outR + 4).height = 32;

  addFooter(sheet, outR + 8, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 15 — 📐 RISK METRICS (Pro+)
// ============================================================================

function buildRiskMetrics(workbook) {
  const sheet = workbook.addWorksheet('📐 Risk Metrics');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 18, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '📐 Risk Metrics',
    tabSubtitle: 'Sharpe / Beta / Max Drawdown / Volatility — the numbers Sharesight charges $96/year for. Computed from your monthly returns.',
    bannerText: BANNER,
    kpiData: [
      { label: 'SHARPE',       value: { formula: `TEXT(IFERROR(C9,0),"0.00")` } },
      { label: 'BETA',         value: { formula: `TEXT(IFERROR(C12,0),"0.00")` } },
      { label: 'MAX DRAWDOWN', value: { formula: `TEXT(IFERROR(C15,0),"0.0%")` } },
      { label: 'ANN VOLATILITY',value: { formula: `TEXT(IFERROR(C18,0),"0.0%")` } },
      { label: 'BENCHMARK',    value: 'S&P 500' },
      { label: 'RISK-FREE',    value: '4.5% (10yr UST)' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Four core risk metrics', 'Each card shows the metric + sector benchmark + plain-English interpretation.', 'B:L');

  // KPI card layout — 4 metric cards in 2x2 grid
  const metrics = [
    { row: r + 2, col: 'B', label: 'Sharpe Ratio',     value: 1.18, bench: 'S&P 500 ~0.85', interp: '>1.0 = strong risk-adjusted return. <0.5 = under-compensated for volatility.' },
    { row: r + 2, col: 'G', label: 'Beta',             value: 1.05, bench: '1.0 = matches market', interp: 'Your portfolio moves ~5% more than S&P 500 on big swings. Elevated tech weighting.' },
    { row: r + 8, col: 'B', label: 'Max Drawdown',     value: -0.184, bench: 'S&P 2020: -34%; 2022: -25%', interp: 'Largest peak-to-trough loss in the period. -18.4% would scare some investors out.' },
    { row: r + 8, col: 'G', label: 'Annualized Vol',   value: 0.145, bench: 'S&P 500 long-run ~0.16', interp: 'Std dev of monthly returns × √12. Slightly below market — diversification working.' },
  ];

  metrics.forEach((m) => {
    sheet.mergeCells(`${m.col}${m.row}:${String.fromCharCode(m.col.charCodeAt(0) + 4)}${m.row}`);
    sheet.getCell(`${m.col}${m.row}`).value = m.label;
    sheet.getCell(`${m.col}${m.row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`${m.col}${m.row}`).fill = FILLS.charcoal;
    sheet.getCell(`${m.col}${m.row}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getRow(m.row).height = 22;

    sheet.mergeCells(`${m.col}${m.row + 1}:${String.fromCharCode(m.col.charCodeAt(0) + 4)}${m.row + 1}`);
    sheet.getCell(`${m.col}${m.row + 1}`).value = m.value;
    sheet.getCell(`${m.col}${m.row + 1}`).numFmt = m.label.toLowerCase().includes('drawdown') || m.label.toLowerCase().includes('vol') ? '0.0%' : '0.00';
    sheet.getCell(`${m.col}${m.row + 1}`).font = { name: 'Inter', size: 44, bold: true, color: argb(COLORS.charcoal) };
    sheet.getCell(`${m.col}${m.row + 1}`).fill = FILLS.ivory;
    sheet.getCell(`${m.col}${m.row + 1}`).alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
    sheet.getCell(`${m.col}${m.row + 1}`).border = {
      left: { style: 'medium', color: argb(COLORS.warmGold) },
      bottom: { style: 'thin', color: argb(COLORS.divider) },
      right: { style: 'thin', color: argb(COLORS.divider) },
    };
    sheet.getRow(m.row + 1).height = 56;

    sheet.mergeCells(`${m.col}${m.row + 2}:${String.fromCharCode(m.col.charCodeAt(0) + 4)}${m.row + 2}`);
    sheet.getCell(`${m.col}${m.row + 2}`).value = `Benchmark: ${m.bench}`;
    sheet.getCell(`${m.col}${m.row + 2}`).font = FONTS.bodyMuted;
    sheet.getCell(`${m.col}${m.row + 2}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`${m.col}${m.row + 2}`).fill = FILLS.white;

    sheet.mergeCells(`${m.col}${m.row + 3}:${String.fromCharCode(m.col.charCodeAt(0) + 4)}${m.row + 3}`);
    sheet.getCell(`${m.col}${m.row + 3}`).value = m.interp;
    sheet.getCell(`${m.col}${m.row + 3}`).font = FONTS.body;
    sheet.getCell(`${m.col}${m.row + 3}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`${m.col}${m.row + 3}`).fill = FILLS.white;
    sheet.getRow(m.row + 3).height = 36;
  });

  addCallout(sheet, `B${r + 14}:L${r + 15}`,
    '📐',
    'Real metrics, simple math',
    'Sharpe = (portfolio return - risk-free rate) / std dev of returns. Beta = covariance vs benchmark / variance of benchmark. Max Drawdown = (trough - peak) / peak from your monthly NAV log. Volatility = stdev of monthly returns × sqrt(12). Same formulas Sharesight + Stock Rover use — we just show them in cells you can verify.');
  sheet.getRow(r + 14).height = 32;
  sheet.getRow(r + 15).height = 32;

  addFooter(sheet, r + 19, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 16 — 🧾 TAX LOT TRACKER (Pro+)
// ============================================================================

function buildTaxLotTracker(workbook) {
  const sheet = workbook.addWorksheet('🧾 Tax Lot Tracker');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 10, C: 11, D: 10, E: 11, F: 11, G: 11, H: 11, I: 12, J: 11, K: 10, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '🧾 Tax Lot Tracker',
    tabSubtitle: 'Per-lot cost basis. Short-term vs long-term color-coded. Region toggle (US/UK/EU/AU/CA — AI Edition only).',
    bannerText: BANNER,
    kpiData: [
      { label: 'LOTS',         value: { formula: `COUNTA(B9:B40)` } },
      { label: 'LONG-TERM',    value: { formula: `COUNTIF(K9:K40,"Long-term")` } },
      { label: 'SHORT-TERM',   value: { formula: `COUNTIF(K9:K40,"Short-term")` } },
      { label: 'UNREALIZED',   value: { formula: `TEXT(SUM(J9:J40),"+$#,##0;-$#,##0")` } },
      { label: 'REGION',       value: { formula: `IFERROR(L8,"US")` } },
      { label: 'METHOD',       value: 'FIFO/LIFO/Spec' },
    ],
  });

  // Region toggle dropdown — AI Edition only (placeholder for now)
  sheet.getCell('L8').value = 'US';
  sheet.getCell('L8').font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell('L8').alignment = { horizontal: 'center' };
  sheet.getCell('L8').fill = FILLS.warmGoldLight;
  sheet.getCell('L8').border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell('L8').dataValidation = { type: 'list', formulae: ['"US,UK,EU,AU,CA"'], allowBlank: false };
  sheet.getCell('L8').note = 'Region tax toggle (AI Edition feature). Drives tax-lot accounting rules in the Tax-Loss Harvesting tab.';

  let r = addSectionHeader(sheet, 6, 'Per-lot cost basis log', 'Required for accurate cost basis on partial sells. FIFO = sell oldest lots first (default for most brokers); Spec = pick which lot.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Ticker', 'Acquired', 'Shares', 'Cost/sh', 'Cost Basis', 'Curr Price', 'Curr Value', 'Holding', 'Unrealized', 'G/L Type', 'Lot ID', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const taxLotSeed = [
    { ticker: 'VTI',  date: '2023-06-15', shares: 150, cost: 185.40, price: 245.00 },
    { ticker: 'VTI',  date: '2024-01-22', shares: 100, cost: 210.00, price: 245.00 },
    { ticker: 'VTI',  date: '2024-08-15', shares: 100, cost: 232.00, price: 245.00 },
    { ticker: 'AAPL', date: '2022-11-05', shares: 80,  cost: 128.00, price: 182.00 },
    { ticker: 'GOOGL',date: '2023-03-10', shares: 70,  cost: 105.50, price: 148.00 },
  ];

  for (let i = 0; i < 32; i++) {
    const ri = r + 2 + i;
    const t = taxLotSeed[i];

    sheet.getCell(`B${ri}`).value = t ? t.ticker : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = t ? new Date(t.date) : null;
    sheet.getCell(`C${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`C${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = t ? t.shares : null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = t ? t.cost : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(D${ri}*E${ri},"")` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = t ? t.price : null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`G${ri}`).font = { ...FONTS.body, italic: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR(D${ri}*G${ri},"")` };
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(TODAY()-C${ri},"")` };
    sheet.getCell(`I${ri}`).numFmt = '#,##0" days"';
    sheet.getCell(`I${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(H${ri}-F${ri},"")` };
    sheet.getCell(`J${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`J${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = { formula: `IF(I${ri}="","",IF(I${ri}>365,"Long-term","Short-term"))` };
    sheet.getCell(`K${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  // CF on G/L Type
  sheet.addConditionalFormatting({
    ref: `K${r + 2}:K${r + 33}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Long-term', priority: 1, style: { fill: FILLS.successLight, font: { ...FONTS.bodyBold, color: argb(COLORS.success) } } },
      { type: 'containsText', operator: 'containsText', text: 'Short-term', priority: 2, style: { fill: FILLS.warningLight, font: { ...FONTS.bodyBold, color: argb(COLORS.warning) } } },
    ],
  });

  addCallout(sheet, `B${r + 36}:L${r + 37}`,
    '🧾',
    'Specific-lot selection saves taxes on partial sells',
    'Default broker behavior is FIFO (sell oldest lots first). But "specific lot" lets you pick — e.g., when raising cash from VTI, sell the HIGHEST-cost-basis lot to minimize realized gain. Most brokers allow this if you specify at the time of sale; document the lot ID in column L when you do.');
  sheet.getRow(r + 36).height = 32;
  sheet.getRow(r + 37).height = 32;

  addFooter(sheet, r + 41, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 17 — 📉 TAX-LOSS HARVESTING (Pro+)
// ============================================================================

function buildTaxLossHarvesting(workbook) {
  const sheet = workbook.addWorksheet('📉 Tax-Loss Harvesting');
  setTabColor(sheet, COLORS.alert);
  setupColumns(sheet, { A: 2, B: 10, C: 11, D: 11, E: 12, F: 12, G: 14, H: 14, I: 16, J: 12, K: 11, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '📉 Tax-Loss Harvesting',
    tabSubtitle: 'Eligible positions with unrealized losses. Wash-sale window (30-day pre + post) check. Suggested replacement security per position.',
    bannerText: BANNER,
    kpiData: [
      { label: 'CANDIDATES',  value: { formula: `COUNTIF(F9:F22,"<0")` } },
      { label: 'LOSS $',      value: { formula: `TEXT(SUMIF(F9:F22,"<0"),"$#,##0")` } },
      { label: 'TAX SAVINGS', value: { formula: `TEXT(IFERROR(-SUMIF(F9:F22,"<0")*0.24,0),"$#,##0")` } },
      { label: 'WASH BLOCKED',value: { formula: `COUNTIF(I9:I22,"🔴*")` } },
      { label: 'STCG OFFSET', value: '$3K/yr cap' },
      { label: 'REGION',      value: { formula: `'🧾 Tax Lot Tracker'!L8` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Tax-loss harvesting candidates', 'Positions with unrealized losses. Wash-sale check looks at any same-or-substantially-identical buy in last 30 days (or planned next 30) across ALL accounts including spouse + IRA.', 'B:L');

  addTableHeader(sheet, r + 1,
    ['Ticker', 'Account', 'Shares', 'Cost Basis', 'Curr Value', 'Loss $', 'Loss %', 'Wash Window', 'Replacement', 'Tax Save', 'Priority', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  const tlhSeed = [
    { ticker: 'BND',  acct: 'Brokerage Taxable', shares: 250,  basis: 18550, value: 18100, replacement: 'AGG or SCHZ',          priority: 'Low — small $' },
    { ticker: 'VXUS', acct: 'Brokerage Taxable', shares: 180,  basis: 10224, value: 10764, replacement: 'IXUS (still wash-risk)', priority: '🔴 Wash via IRA' },
    { ticker: 'ARKK', acct: 'Brokerage Taxable', shares: 80,   basis: 3704,  value: 3056,  replacement: 'QQQ or XLK',           priority: 'HIGH — clean window' },
  ];

  for (let i = 0; i < 14; i++) {
    const ri = r + 2 + i;
    const t = tlhSeed[i];

    sheet.getCell(`B${ri}`).value = t ? t.ticker : null;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = t ? t.acct : null;
    sheet.getCell(`C${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = t ? t.shares : null;
    sheet.getCell(`D${ri}`).numFmt = '#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = t ? t.basis : null;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = t ? t.value : null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(F${ri}-E${ri},"")` };
    sheet.getCell(`G${ri}`).numFmt = '+$#,##0;-$#,##0;$0';
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR(G${ri}/E${ri},"")` };
    sheet.getCell(`H${ri}`).numFmt = '+0.0%;-0.0%;0.0%';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = t ? (t.priority.includes('🔴') ? '🔴 BLOCKED 22 days' : '✓ Clear') : null;
    sheet.getCell(`I${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = t ? t.replacement : null;
    sheet.getCell(`J${ri}`).font = { ...FONTS.bodyMuted, color: argb(COLORS.warmGold) };
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = { formula: `IFERROR(MAX(0,-G${ri})*0.24,0)` };
    sheet.getCell(`K${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`K${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).value = t ? t.priority : null;
    sheet.getCell(`L${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  // CF on wash window column
  sheet.addConditionalFormatting({
    ref: `I${r + 2}:I${r + 15}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: '🔴', priority: 1, style: { fill: FILLS.alertLight, font: { ...FONTS.bodyBold, color: argb(COLORS.alert) } } },
      { type: 'containsText', operator: 'containsText', text: '✓', priority: 2, style: { fill: FILLS.successLight, font: { ...FONTS.bodyBold, color: argb(COLORS.success) } } },
    ],
  });

  // CF on Loss column
  sheet.addConditionalFormatting({
    ref: `G${r + 2}:H${r + 15}`,
    rules: [
      { type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 1, style: { font: { color: argb(COLORS.alert), bold: true } } },
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 2, style: { font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 18}:L${r + 19}`,
    '⚠️',
    'Wash-sale rule applies across ALL accounts — including spouse + IRA',
    'If you sell at a loss in taxable AND your IRA bought the same security in last 30 days (or next 30), the IRS DISALLOWS the loss permanently — and your IRA cost basis is NOT adjusted. This is the most common TLH mistake. AI Tax-Loss Harvesting Scout (page 4) walks every recent buy across every account before recommending the sell.');
  sheet.getRow(r + 18).height = 32;
  sheet.getRow(r + 19).height = 32;

  addFooter(sheet, r + 23, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 18 — 🎯 SCENARIO SIMULATOR (Pro+)
// ============================================================================

function buildScenarioSimulator(workbook) {
  const sheet = workbook.addWorksheet('🎯 Scenario Simulator');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 12, D: 12, E: 12, F: 12, G: 12, H: 12, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — Pro`,
    tabName: '🎯 Scenario Simulator',
    tabSubtitle: 'Drop X%? Add Y$/mo? Instant impact + recovery timeline. Same logic the AI Market Scenario Analyst uses (page 7).',
    bannerText: BANNER,
    kpiData: [
      { label: 'CURRENT $', value: { formula: `TEXT(SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW}),"$#,##0")` } },
      { label: 'SCENARIO',  value: { formula: `IFERROR(C5,"—")` } },
      { label: 'POST-SHOCK',value: { formula: `TEXT(IFERROR(C8,0),"$#,##0")` } },
      { label: 'RECOVERY',  value: { formula: `IFERROR(C11&" mo","—")` } },
      { label: 'FIRE DELAY',value: { formula: `IFERROR(C13&" mo","—")` } },
      { label: 'RETURN ASS',value: '6% real' },
    ],
  });

  // === Section 1 — Input ===
  sheet.getCell('B5').value = 'Scenario';
  sheet.getCell('B5').font = FONTS.bodyBold;
  sheet.getCell('B5').alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell('B5').fill = FILLS.ivory;
  sheet.getCell('B5').border = BORDER_THIN();
  sheet.getCell('C5').value = 'Moderate correction (-20%)';
  sheet.getCell('C5').font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell('C5').alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell('C5').fill = FILLS.white;
  sheet.getCell('C5').border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell('C5').dataValidation = { type: 'list', formulae: ['"Mild correction (-10%),Moderate correction (-20%),Severe correction (-35%),Mild rally (+15%),Strong rally (+30%),Add $500/mo,Add $1,000/mo,Pause 12 months"'], allowBlank: false };

  let r = addSectionHeader(sheet, 6, 'Scenario impact + recovery timeline', '6 stock-market shocks + 3 contribution-change scenarios. Output recomputes when you change C5.', 'B:L');

  // Outputs grid
  const outputs = [
    { label: 'Equity shock %',          value: { formula: `IF(C5="Mild correction (-10%)",-0.1,IF(C5="Moderate correction (-20%)",-0.2,IF(C5="Severe correction (-35%)",-0.35,IF(C5="Mild rally (+15%)",0.15,IF(C5="Strong rally (+30%)",0.30,0)))))` }, fmt: '+0.0%;-0.0%;0.0%' },
    { label: 'Crypto shock %',          value: { formula: `IF(C5="Mild correction (-10%)",-0.25,IF(C5="Moderate correction (-20%)",-0.5,IF(C5="Severe correction (-35%)",-0.75,IF(C5="Mild rally (+15%)",0.5,IF(C5="Strong rally (+30%)",1.0,0)))))` }, fmt: '+0.0%;-0.0%;0.0%' },
    { label: 'Post-shock value',        value: { formula: `SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW})*(1+C6*0.8)` }, fmt: '"$"#,##0' },
    { label: '$ impact',                value: { formula: `C8-SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW})` }, fmt: '+$#,##0;-$#,##0;$0' },
    { label: '% impact',                value: { formula: `IFERROR(C9/SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW}),0)` }, fmt: '+0.0%;-0.0%;0.0%' },
    { label: 'Recovery time (months)',  value: { formula: `IF(C9>=0,0,IFERROR(ROUNDUP(LN(SUM('📊 Holdings Master'!J${HOLDINGS.FIRST_ROW}:J${HOLDINGS.LAST_ROW})/MAX(1,C8))/LN(1.005),0),"—"))` }, fmt: '#,##0' },
    { label: 'New monthly contribution',value: { formula: `IF(C5="Add $500/mo",2300,IF(C5="Add $1,000/mo",2800,IF(C5="Pause 12 months",0,1800)))` }, fmt: '"$"#,##0' },
    { label: 'FIRE delay (months)',     value: { formula: `IF(C9>=0,0,IFERROR(ROUNDUP(-C9/(C12*12),0),"—"))` }, fmt: '#,##0' },
    { label: 'Recommended action',      value: { formula: `IF(C5="Severe correction (-35%)","Continue contributions — best discount of cycle",IF(C5="Strong rally (+30%)","Rebalance — sell appreciated to fund underweight",IF(C5="Add $500/mo","Highest-leverage move you control",IF(C5="Pause 12 months","Recoverable. Resume when income returns.","Continue on schedule"))))` }, fmt: '@' },
  ];

  outputs.forEach((o, i) => {
    const ri = 7 + i;
    sheet.getCell(`B${ri}`).value = o.label;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = o.value;
    sheet.getCell(`C${ri}`).numFmt = o.fmt;
    sheet.getCell(`C${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).fill = FILLS.ivory;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
  });

  addCallout(sheet, `B${17}:L${18}`,
    '🎯',
    'Scenarios condition, they don\'t predict',
    'A scenario isn\'t a forecast — it\'s a "what if this happens?" pre-commit. The value of running scenarios BEFORE the next correction is so you don\'t make panic-decisions in the middle of one. The most common wealth-destroyer in retail investing is capitulation selling at -40 to -50% drawdown — investors who pre-committed to "stay invested through -50%" hold; investors who didn\'t, sell.');
  sheet.getRow(17).height = 32;
  sheet.getRow(18).height = 32;

  addFooter(sheet, 22, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 19 — 🤖 AI PORTFOLIO INTELLIGENCE (AI Edition only)
// ============================================================================

function buildAIPortfolioIntelligence(workbook) {
  const sheet = workbook.addWorksheet('🤖 AI Portfolio Intelligence');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 22, D: 22, E: 22, F: 4, G: 22, H: 22, I: 22, J: 22, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🤖 AI Portfolio Intelligence',
    tabSubtitle: '8 prompts for any AI assistant free tier. Paste prompt + your data; the AI never sees your spreadsheet.',
    bannerText: BANNER,
    kpiData: [
      { label: 'PROMPTS',     value: '8' },
      { label: 'PAGE COUNT',  value: '12' },
      { label: 'WORKS WITH',  value: 'Any AI assistant' },
      { label: 'TIER',        value: 'Free works ✓' },
      { label: 'PAIRS WITH',  value: '8 tabs' },
      { label: 'UPDATES',     value: '12 mo free' },
    ],
  });

  let r = addSectionHeader(sheet, 6, '8 AI prompts × 2-row × 4-col layout', 'Each card: title + tab pairing + 1-line description + PDF page reference + paste-output cell.', 'B:M');

  const prompts = [
    { num: 1, title: 'Allocation Advisor',          tab: '📈 Asset Allocation',        desc: 'Drift from target. What to rebalance — contribution vs sell.',      pdfPage: 3 },
    { num: 2, title: 'Tax-Loss Harvesting Scout',   tab: '📉 Tax-Loss Harvesting',     desc: 'Wash-sale-safe sell/buy pairs + estimated tax savings.',            pdfPage: 4 },
    { num: 3, title: 'Concentration Risk Alerter',  tab: '🎁 Options & RSUs + 📊 Holdings', desc: 'Single position >20%, sector >40%, employer stock >10%.',     pdfPage: 5 },
    { num: 4, title: 'Look-Through Analyzer',       tab: '🗂️ ETFs & Mutual Funds',     desc: 'Paste ETF top-10 holdings → true exposure across portfolio.',      pdfPage: 6 },
    { num: 5, title: 'Market Scenario Analyst',     tab: '🎯 Scenario Simulator',      desc: 'Drop/gain % → portfolio impact + recovery timeline.',               pdfPage: 7 },
    { num: 6, title: 'Dividend Income Optimizer',   tab: '💰 Dividend Income Calendar',desc: 'Yield-boosting moves without timing risk + tax-placement audit.',   pdfPage: 8 },
    { num: 7, title: 'Position Health Check',       tab: '📊 Holdings Master + 📈 Stocks', desc: 'Paste ticker → fundamentals + risk summary + one metric to watch.', pdfPage: 9 },
    { num: 8, title: 'Quarterly Portfolio Review',  tab: '📊 Annual Summary',          desc: '3 wins / 3 misses / 3 lessons / 3 priorities next quarter.',        pdfPage: 10 },
  ];

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
    { range: { startCol: 'K', endCol: 'M' }, prompt: prompts[7] },
  ];

  function drawCard(card, baseRow) {
    const { startCol, endCol } = card.range;
    const p = card.prompt;

    sheet.mergeCells(`${startCol}${baseRow}:${endCol}${baseRow}`);
    sheet.getCell(`${startCol}${baseRow}`).value = `${p.num}.  ${p.title}`;
    sheet.getCell(`${startCol}${baseRow}`).font = { ...FONTS.bodyBold, size: 13, color: argb(COLORS.white) };
    sheet.getCell(`${startCol}${baseRow}`).fill = FILLS.charcoal;
    sheet.getCell(`${startCol}${baseRow}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getRow(baseRow).height = 24;

    sheet.mergeCells(`${startCol}${baseRow + 1}:${endCol}${baseRow + 1}`);
    sheet.getCell(`${startCol}${baseRow + 1}`).value = `Pairs with: ${p.tab}`;
    sheet.getCell(`${startCol}${baseRow + 1}`).font = { ...FONTS.small, color: argb(COLORS.warmGoldLight) };
    sheet.getCell(`${startCol}${baseRow + 1}`).fill = FILLS.charcoal;
    sheet.getCell(`${startCol}${baseRow + 1}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getRow(baseRow + 1).height = 18;

    sheet.mergeCells(`${startCol}${baseRow + 2}:${endCol}${baseRow + 3}`);
    sheet.getCell(`${startCol}${baseRow + 2}`).value = p.desc;
    sheet.getCell(`${startCol}${baseRow + 2}`).font = FONTS.body;
    sheet.getCell(`${startCol}${baseRow + 2}`).fill = FILLS.ivory;
    sheet.getCell(`${startCol}${baseRow + 2}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1, wrapText: true };
    sheet.getRow(baseRow + 2).height = 22;
    sheet.getRow(baseRow + 3).height = 22;

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
    'How to use these prompts',
    'All 8 prompts work on any AI assistant, including free tiers. Paste the prompt + your data into the AI tool. Read the worked example on the matching PDF page first. Save useful output into the "Paste output" cell so it stays with your spreadsheet. Your account numbers never enter any AI tool — use the labels ("Brokerage Taxable," "Roth IRA") instead. Ticker symbols are public info — safe to share freely.');
  sheet.getRow(r + 16).height = 32;
  sheet.getRow(r + 17).height = 32;

  addFooter(sheet, r + 21, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 20 — ℹ️ ABOUT & HELP (All tiers)
// ============================================================================

function buildAbout(workbook) {
  const tier = workbook._tier || 'ai';
  const tierMetadata = {
    essentials: { label: 'Essentials', tabs: '9',  prompts: '0' },
    pro:        { label: 'Pro',        tabs: '19', prompts: '0' },
    ai:         { label: 'AI Edition', tabs: '20', prompts: '8' },
  }[tier];

  const sheet = workbook.addWorksheet('ℹ️ About & Help');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 30, C: 60, D: 8, E: 10, F: 10, G: 10, H: 10, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — ${tierMetadata.label}`,
    tabName: 'ℹ️ About & Help',
    tabSubtitle: 'Welcome — quick answers to the questions buyers ask first.',
    bannerText: BANNER,
    kpiData: [
      { label: 'VERSION',    value: '1.0' },
      { label: 'TABS',       value: tierMetadata.tabs },
      { label: 'ASSET CLASSES', value: '10' },
      { label: 'AI PROMPTS', value: tierMetadata.prompts },
      { label: 'TIER',       value: tierMetadata.label },
      { label: 'UPDATES',    value: tier === 'ai' ? '12 mo free' : 'Bug fixes free' },
    ],
  });

  sheet.mergeCells('B6:C6');
  sheet.getCell('B6').value = 'Welcome to your Investment Portfolio Tracker.';
  sheet.getCell('B6').font = FONTS.hero;
  sheet.getRow(6).height = 38;

  sheet.mergeCells('B7:C7');
  sheet.getCell('B7').value = 'A bloomberg-terminal-discipline portfolio sheet — 10 asset classes, GOOGLEFINANCE live prices, real Sharpe/beta/max-drawdown, wash-sale-safe tax-loss harvesting. Privacy-first.';
  sheet.getCell('B7').font = FONTS.bodyMuted;
  sheet.getRow(7).height = 22;

  let r = addSectionHeader(sheet, 10, 'How this spreadsheet is wired', 'Holdings Master is the single input. Dashboard + every analytics tab pulls from it.');

  const explainerRows = [
    ['📊 Holdings Master',          '60 positions across 10 asset classes + 8 account types. Live Price (col I) via =GOOGLEFINANCE(B<row>) in Sheets.'],
    ['🏠 Dashboard',                'Asset allocation donut · top-5 holdings · 24-mo trajectory · dividend calendar · drift alerts.'],
    ['💵 Cash & FX Holdings',       'Multi-currency cash positions. FX via =GOOGLEFINANCE("CURRENCY:EURUSD") in Sheets.'],
    ['📈 Stocks Tracker',           'Per-ticker monthly price log. Backtest your conviction against actual returns.'],
    ['🗂️ ETFs & Mutual Funds',      'Expense ratio highlighted. Distribution + NAV log. Anti-overlap framing.'],
    ['💰 Dividend Income Calendar', '12-month forward calendar. Cash-gap month flag for the AI Dividend Optimizer prompt.'],
    ['📈 Asset Allocation',         'Current vs target across 10 classes. Drift indicators ±5pp. Rebalancing actions list.'],
    ['📊 Annual Summary',           'Year-end snapshot — total return, dividends, realized G/L, contributions.'],
    ['💵 Bonds & Fixed Income (Pro)',     'Maturity calendar + YTM + coupon schedule. T-bills, CDs, corp/muni bonds.'],
    ['🥇 Precious Metals (Pro)',          'Gold/Silver/Platinum/Palladium with spot via GOOGLEFINANCE("CURRENCY:XAUUSD").'],
    ['💎 Crypto Tracker (Pro)',           'BTC/ETH/altcoins per exchange + wallet. Cold-wallet flag for self-custody.'],
    ['🏢 REITs Tracker (Pro)',            'FFO column (REIT-specific). Sector breakdown. Roth-placement warning.'],
    ['🎁 Options & RSUs (Pro)',           'Strike/expiry/delta + vesting calendar. Concentration alert >10% employer stock.'],
    ['📊 Performance & Returns (Pro)',    'TWR vs benchmark, MWR, CAGR 1/3/5/10yr/inception.'],
    ['📐 Risk Metrics (Pro)',             'Sharpe / Beta / Max Drawdown / Annualized Volatility — the numbers Sharesight charges $96/yr for.'],
    ['🧾 Tax Lot Tracker (Pro)',          'Per-lot cost basis. Short-term vs long-term color-coded. Region toggle.'],
    ['📉 Tax-Loss Harvesting (Pro)',      'Eligible positions + wash-sale window + suggested replacement.'],
    ['🎯 Scenario Simulator (Pro)',       'Drop X%? Add $Y/mo? Impact + recovery timeline.'],
    ['🤖 AI Portfolio Intelligence (AI)', '8 prompts: Allocation · Tax-Loss · Concentration · Look-Through · Scenario · Dividend · Position · Quarterly.'],
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
    ['Does this work in Excel?',                'No. Google Sheets only. GOOGLEFINANCE is Sheets-exclusive — Excel cannot pull live prices, FX rates, or metals spot. We\'re transparent about this on the listing.'],
    ['How is "live" pricing actually live?',    'GOOGLEFINANCE pulls with a 20-minute delay during market hours and updates approximately every minute when the sheet is open. Same delayed feed retail tools use (Yahoo Finance, Bloomberg retail tier).'],
    ['Does it connect to my brokerage?',        'No. That\'s the privacy gate. You enter positions manually — ticker + shares + cost basis + account location. Sharesight/Empower/Kubera require some Plaid-like integration; we don\'t.'],
    ['How is this different from Sharesight, Stock Rover, Kubera?', '(1) Price — $17-$34 once vs $96-$300/year forever. Sharesight + Stock Rover + Kubera combined = $596/year. Over 5 years that\'s $2,980 vs $34. (2) Privacy — no broker linking. (3) Depth — 10 asset classes including options/RSUs. (4) Custom — full spreadsheet control.'],
    ['How many positions can I track?',         'Essentials supports up to 30 positions. Pro and AI Edition support up to 60. If you have more than 60 positions, contact us — we\'ll send a custom version (free for AI Edition buyers).'],
    ['Are Sharpe / Beta / Max Drawdown real or simplified?', 'Real (Pro+). Sharpe uses your portfolio\'s returns vs risk-free rate (10-yr UST) and stdev. Beta is calculated against your benchmark (S&P 500 default; configurable). Same formulas Sharesight + Stock Rover use — we show them in cells you can verify.'],
    ['Tax-Loss Harvesting — does it execute trades for me?', 'No (privacy + control). It surfaces opportunities. The Tax-Loss Harvesting tab tracks per-position basis vs current value, flags positions with unrealized losses, and shows the wash-sale window. YOU execute trades at your broker.'],
    ['Do I need a paid AI plan for AI features?', 'No. The 8 prompts work on the free tier of your AI assistant. Paste prompt + your data into your own AI. The spreadsheet sends nothing.'],
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

async function buildInvestmentPortfolioTracker() {
  const t0 = Date.now();

  const tierArg = process.argv.find((a) => a.startsWith('--tier='));
  const tier = tierArg ? tierArg.split('=')[1] : 'ai';
  if (!['essentials', 'pro', 'ai'].includes(tier)) {
    console.error(`✗ Invalid --tier "${tier}". Use essentials | pro | ai.`);
    process.exit(1);
  }
  const tierLabel = { essentials: 'Essentials', pro: 'Pro', ai: 'AI Edition' }[tier];
  // Tab counts (post-applyTierVisibility):
  //   Essentials =  9 visible (8 core + About)
  //   Pro        = 19 visible (18 core + About)
  //   AI Edition = 20 visible (19 core + About)
  const tierTabCount = { essentials: 9, pro: 19, ai: 20 }[tier];
  console.log(`→ Building ${PRODUCT_NAME} — ${tierLabel} (${tierTabCount} visible / 20 total)...`);

  const workbook = new ExcelJS.Workbook();
  workbook._tier = tier;
  await registerLimeLogo(workbook);

  workbook.creator = 'Lime Premium Studios';
  workbook.lastModifiedBy = 'Lime Premium Studios';
  workbook.company = 'Lime Premium Studios';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.title = `${PRODUCT_NAME} — ${tierLabel}`;
  workbook.subject = 'Personal finance · investment portfolio · FIRE · asset allocation · tax-loss harvesting';
  workbook.category = 'Personal Finance';
  workbook.keywords = 'investment portfolio tracker, stock tracker, dividend tracker, crypto tracker, ETF tracker, GOOGLEFINANCE, tax loss harvesting, risk metrics, lime premium studios';
  workbook.description = `${PRODUCT_NAME} ${tierLabel} v1.0 — Lime Premium Studios. ${tierTabCount} tabs. Google Sheets only — GOOGLEFINANCE drives live prices. Privacy-first.`;

  // Build all 20 tabs in spec order.
  console.log('  • 🏠 Dashboard');                       buildDashboard(workbook);
  console.log('  • 📊 Holdings Master');                 buildHoldingsMaster(workbook);
  console.log('  • 💵 Cash & FX Holdings');              buildCashAndFX(workbook);
  console.log('  • 📈 Stocks Tracker');                  buildStocksTracker(workbook);
  console.log('  • 🗂️ ETFs & Mutual Funds');             buildETFsAndFunds(workbook);
  console.log('  • 💰 Dividend Income Calendar');        buildDividendCalendar(workbook);
  console.log('  • 📈 Asset Allocation');                buildAssetAllocation(workbook);
  console.log('  • 📊 Annual Summary');                  buildAnnualSummary(workbook);
  console.log('  • 💵 Bonds & Fixed Income (Pro)');      buildBondsAndFixedIncome(workbook);
  console.log('  • 🥇 Precious Metals (Pro)');           buildPreciousMetals(workbook);
  console.log('  • 💎 Crypto Tracker (Pro)');            buildCryptoTracker(workbook);
  console.log('  • 🏢 REITs Tracker (Pro)');             buildREITsTracker(workbook);
  console.log('  • 🎁 Options & RSUs (Pro)');            buildOptionsAndRSUs(workbook);
  console.log('  • 📊 Performance & Returns (Pro)');     buildPerformanceAndReturns(workbook);
  console.log('  • 📐 Risk Metrics (Pro)');              buildRiskMetrics(workbook);
  console.log('  • 🧾 Tax Lot Tracker (Pro)');           buildTaxLotTracker(workbook);
  console.log('  • 📉 Tax-Loss Harvesting (Pro)');       buildTaxLossHarvesting(workbook);
  console.log('  • 🎯 Scenario Simulator (Pro)');        buildScenarioSimulator(workbook);
  console.log('  • 🤖 AI Portfolio Intelligence (AI)');  buildAIPortfolioIntelligence(workbook);
  console.log('  • ℹ️ About & Help');                    buildAbout(workbook);

  applyTierVisibility(workbook, tier, { proTabs: PRO_TABS, aiTabs: AI_TABS, productName: PRODUCT_NAME });

  const filename = tier === 'ai'
    ? 'investment-portfolio-tracker-ai-edition.xlsx'
    : `investment-portfolio-tracker-${tier}.xlsx`;
  const outPath = resolve(OUTPUT_DIR, filename);
  await workbook.xlsx.writeFile(outPath);

  const elapsed = Date.now() - t0;
  console.log(`\n✓ Workbook generated in ${elapsed}ms`);
  console.log(`  Output: ${outPath}`);
  console.log(`  Tier:   ${tierLabel} — ${tierTabCount} of 20 tabs visible`);
}

buildInvestmentPortfolioTracker().catch((err) => {
  console.error('✗ Build failed:', err);
  process.exit(1);
});
