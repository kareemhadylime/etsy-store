/**
 * Small Business Finance Kit — Google Sheets template generator (Lime Premium Studios) — v1
 *
 * Phase B product #5 in the catalog. Largest + highest-priced standalone product
 * — 23 visible tabs (24 incl. About), pricing $24 / $39 / $54. Cascades from
 * Budget Tracker / Debt Payoff / Sinking Funds / Net Worth.
 *
 * The depth differentiator: a full small-business back-office in one workbook —
 * P&L + Cash Flow + Balance Sheet + Invoicing + Inventory + Payroll + HR + Project
 * Costing + Tax Prep — vs. QuickBooks Online $35–$235/month.
 *
 * Source of truth:
 *   - docs/product-proposals/small-business-finance-kit.md
 *   - docs/product-designs/small-business-finance-kit.md
 *   - docs/listing-copy/small-business-finance-kit.md
 *   - docs/product-content/small-business-ai-prompts.md
 *   - docs/small-business-build-tickets.md (15 tickets SB01..SB15)
 *
 * Spine architecture (catalog-wide standing rule):
 *   - 📥 Input Tabs — `💵 Revenue Tracker` + `💸 Expense Tracker` (paired)
 *   - 📊 Output Dashboard — `🏠 Dashboard` (visual KPI surface)
 *
 * Per-product visual restraint overrides (design brief §1):
 *   - KPI tile shadow opacity 5% (vs. catalog default 10%) — built into PFS via
 *     border-only treatment, so this is honored automatically.
 *   - Mandatory numeric right-alignment EVERYWHERE (currency, counts, %).
 *   - Emoji decoration in tab names only — no emoji in content rows.
 *
 * Tier model (post-applyTierVisibility):
 *   - Essentials ($24)  —  9 visible (+ About = 10)
 *   - Pro ($39)         — 22 visible (+ About = 23)
 *   - AI Edition ($54)  — 23 visible (+ About = 24)
 *
 * Run: node tools/sheets-gen/templates/small-business-finance-kit.js --tier=<essentials|pro|ai>
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

const PRODUCT_NAME = 'Small Business Finance Kit';

// ============================================================================
// TAB DEFINITIONS — 24 tabs across 3 tiers
// ============================================================================

// PRO tabs — removed for Essentials (13 sheets)
const PRO_TABS = new Set([
  '🏦 Balance Sheet',
  '📅 Recurring Invoice Schedule',
  '⏳ Receivables Aging',
  '⏳ Payables Aging',
  '📊 Customer Profitability',
  '📦 Inventory Tracker',
  '🏭 Supplier & PO Manager',
  '🏗️ Asset Depreciation',
  '💰 Loan Amortization',
  '👥 HR Employee Records',
  '💰 Payroll & Payslips',
  '🌐 Social Security Tracker',
  '📋 Project Costing',
  '📈 KPI Dashboard',
  '🔮 Cash Flow Forecast',
]);

// AI tabs — removed for Pro + Essentials
const AI_TABS = new Set([
  '🤖 AI Business Co-Pilot',
]);

// Schedule C expense categories (for tax prep auto-mapping)
const SCHEDULE_C_CATEGORIES = [
  'Advertising', 'Car & Truck', 'Commissions', 'Contract Labor', 'Depreciation',
  'Insurance', 'Interest', 'Legal & Professional', 'Office Expense', 'Rent',
  'Repairs', 'Supplies', 'Taxes & Licenses', 'Travel', 'Meals (50%)',
  'Utilities', 'Wages', 'Software', 'Bank Fees', 'Other',
];

// Banner — shared across every tab (anti-QuickBooks framing from listing copy)
const BANNER = '✦  Why a Spreadsheet, Not an App?   QuickBooks $35–$235/mo. FreshBooks $19+/mo. We charge $24 once. Your books stay yours.';

// Revenue Tracker invariants — every downstream tab references these rows.
const REV = {
  HEADER_ROW: 11,
  FIRST_ROW: 12,
  LAST_ROW: 111,    // 100 revenue lines
  ROW_COUNT: 100,
};

// Expense Tracker invariants
const EXP = {
  HEADER_ROW: 11,
  FIRST_ROW: 12,
  LAST_ROW: 161,    // 150 expense lines
  ROW_COUNT: 150,
};

// ============================================================================
// TAB 1 — 🏠 DASHBOARD (Output spine — Tab #1)
// ============================================================================

function buildDashboard(workbook) {
  const tier = workbook._tier || 'ai';
  const sheet = workbook.addWorksheet('🏠 Dashboard');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 18, C: 13, D: 13, E: 14, F: 8, G: 22, H: 12, I: 12, J: 12, K: 12, L: 12, M: 2 });

  // 6 KPI tiles per design brief §2 (small-business framing).
  // MTD = Month-to-Date; sourced from Revenue + Expense Trackers.
  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏠 Dashboard',
    tabSubtitle: 'Your business at a glance — updates the moment you log revenue or expenses.',
    bannerText: BANNER,
    kpiData: [
      { label: 'MTD REVENUE',     value: { formula: `TEXT(SUMIFS('💵 Revenue Tracker'!F12:F111,'💵 Revenue Tracker'!C12:C111,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),'💵 Revenue Tracker'!C12:C111,"<"&DATE(YEAR(TODAY()),MONTH(TODAY())+1,1)),"$#,##0")` } },
      { label: 'MTD NET PROFIT',  value: { formula: `TEXT(SUMIFS('💵 Revenue Tracker'!F12:F111,'💵 Revenue Tracker'!C12:C111,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),'💵 Revenue Tracker'!C12:C111,"<"&DATE(YEAR(TODAY()),MONTH(TODAY())+1,1))-SUMIFS('💸 Expense Tracker'!F12:F161,'💸 Expense Tracker'!C12:C161,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),'💸 Expense Tracker'!C12:C161,"<"&DATE(YEAR(TODAY()),MONTH(TODAY())+1,1)),"$#,##0")` } },
      { label: 'CASH ON HAND',    value: { formula: `TEXT(SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161),"$#,##0")` } },
      { label: 'RUNWAY (MOS)',    value: { formula: `IFERROR(TEXT((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/MAX(1,SUM('💸 Expense Tracker'!F12:F161)/12),"0.0")&" mo","—")` } },
      { label: 'RECEIVABLES',     value: { formula: `TEXT(SUMIFS('🧾 Invoice Tracker'!F11:F60,'🧾 Invoice Tracker'!H11:H60,"<>Paid",'🧾 Invoice Tracker'!H11:H60,"<>Cancelled"),"$#,##0")` } },
      { label: tier === 'ai' ? 'HEALTH SCORE' : 'BIZ MARGIN',
        value: tier === 'ai'
          ? { formula: `IFERROR(ROUND(MIN(100,MAX(0,` +
              `(SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/MAX(1,SUM('💵 Revenue Tracker'!F12:F111))*100` +
              `)),0),"—")` }
          : { formula: `IFERROR(TEXT((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/SUM('💵 Revenue Tracker'!F12:F111),"0.0%"),"—")` } },
    ],
  });

  // === SECTION 1 — Business Health Score gauge (AI Edition) OR Margin breakdown (Essentials/Pro) ===
  let r = addSectionHeader(sheet, 6, tier === 'ai' ? 'Business Health Score' : 'Margin breakdown',
    tier === 'ai' ? 'Composite of 5 sub-scores: gross margin · net margin · runway · receivables health · cash flow trend.'
                  : 'Gross + net margin. The two numbers that decide whether the business is healthy.',
    'B:F');

  if (tier === 'ai') {
    // Health-score big number + 5 sub-gauges
    sheet.mergeCells(`B${r + 1}:F${r + 5}`);
    const scoreCell = sheet.getCell(`B${r + 1}`);
    scoreCell.value = { formula:
      `IFERROR(ROUND(MIN(100,MAX(0,` +
      `(SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/MAX(1,SUM('💵 Revenue Tracker'!F12:F111))*100` +
      `)),0)&" / 100","—")` };
    scoreCell.font = { name: 'Inter', size: 56, bold: true, color: argb(COLORS.success) };
    scoreCell.alignment = { vertical: 'middle', horizontal: 'center' };
    scoreCell.fill = FILLS.ivory;
    scoreCell.border = BORDER_THIN();
    for (let i = 0; i < 5; i++) sheet.getRow(r + 1 + i).height = 28;

    // 5 sub-gauges
    const subs = [
      { label: 'Gross Margin',       formula: `IFERROR(TEXT((SUM('💵 Revenue Tracker'!F12:F111)-SUMIF('💸 Expense Tracker'!I12:I161,"COGS",'💸 Expense Tracker'!F12:F161))/SUM('💵 Revenue Tracker'!F12:F111),"0.0%"),"—")` },
      { label: 'Net Margin',         formula: `IFERROR(TEXT((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/SUM('💵 Revenue Tracker'!F12:F111),"0.0%"),"—")` },
      { label: 'Runway',             formula: `IFERROR(TEXT((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/MAX(1,SUM('💸 Expense Tracker'!F12:F161)/12),"0.0")&" mo","—")` },
      { label: 'Receivables Health', formula: `IFERROR(TEXT(1-SUMIFS('🧾 Invoice Tracker'!F11:F60,'🧾 Invoice Tracker'!H11:H60,"Overdue")/MAX(1,SUMIFS('🧾 Invoice Tracker'!F11:F60,'🧾 Invoice Tracker'!H11:H60,"<>Paid",'🧾 Invoice Tracker'!H11:H60,"<>Cancelled")),"0%"),"—")` },
      { label: 'Cash Flow Trend',    formula: `IFERROR(IF((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))>0,"Positive","Negative"),"—")` },
    ];
    subs.forEach((s, i) => {
      const ri = r + 7 + i;
      sheet.getCell(`B${ri}`).value = s.label;
      sheet.getCell(`B${ri}`).font = FONTS.smallCaps;
      sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
      sheet.getCell(`B${ri}`).border = BORDER_THIN();
      sheet.mergeCells(`B${ri}:D${ri}`);

      sheet.getCell(`E${ri}`).value = { formula: s.formula };
      sheet.getCell(`E${ri}`).font = FONTS.bodyBold;
      sheet.getCell(`E${ri}`).alignment = { horizontal: 'right', indent: 1 };
      sheet.getCell(`E${ri}`).border = BORDER_THIN();
      sheet.mergeCells(`E${ri}:F${ri}`);
      sheet.getRow(ri).height = 22;
    });
  } else {
    // Non-AI: simpler 2-row margin block
    const lines = [
      { label: 'Gross Margin %',     formula: `IFERROR(TEXT((SUM('💵 Revenue Tracker'!F12:F111)-SUMIF('💸 Expense Tracker'!I12:I161,"COGS",'💸 Expense Tracker'!F12:F161))/SUM('💵 Revenue Tracker'!F12:F111),"0.0%"),"—")` },
      { label: 'Net Margin %',       formula: `IFERROR(TEXT((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/SUM('💵 Revenue Tracker'!F12:F111),"0.0%"),"—")` },
      { label: 'YTD Revenue',        formula: `TEXT(SUM('💵 Revenue Tracker'!F12:F111),"$#,##0")` },
      { label: 'YTD Expenses',       formula: `TEXT(SUM('💸 Expense Tracker'!F12:F161),"$#,##0")` },
      { label: 'YTD Net Profit',     formula: `TEXT(SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161),"$#,##0")` },
    ];
    lines.forEach((s, i) => {
      const ri = r + 1 + i;
      sheet.getCell(`B${ri}`).value = s.label;
      sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
      sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
      sheet.getCell(`B${ri}`).border = BORDER_THIN();
      sheet.mergeCells(`B${ri}:D${ri}`);

      sheet.getCell(`E${ri}`).value = { formula: s.formula };
      sheet.getCell(`E${ri}`).font = FONTS.bodyBold;
      sheet.getCell(`E${ri}`).alignment = { horizontal: 'right', indent: 1 };
      sheet.getCell(`E${ri}`).border = BORDER_THIN();
      sheet.mergeCells(`E${ri}:F${ri}`);
      sheet.getRow(ri).height = 26;
    });
  }

  // === SECTION 2 — Top 5 customers by revenue ===
  let cR = addSectionHeader(sheet, 6, 'Top 5 customers by revenue', 'Concentration-risk pill fires if top customer > 30% of revenue.', 'G:L');

  addTableHeader(sheet, cR + 1, ['#', 'Customer', 'Revenue', '%'], ['G', 'H', 'J', 'L']);
  // Merge H header across H:I, J across J:K
  sheet.mergeCells(`H${cR + 1}:I${cR + 1}`);
  sheet.mergeCells(`J${cR + 1}:K${cR + 1}`);

  // Customer rows — we render up to 5 unique customer names with their revenue totals
  // pulled from Revenue Tracker col C (Client). Ranked descending via LARGE/INDEX/MATCH.
  for (let i = 0; i < 5; i++) {
    const ri = cR + 2 + i;
    sheet.getCell(`G${ri}`).value = i + 1;
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    // Top-N customer via array formula — Sheets/Excel both support this pattern.
    sheet.mergeCells(`H${ri}:I${ri}`);
    sheet.getCell(`H${ri}`).value = { formula:
      `IFERROR(INDEX('💵 Revenue Tracker'!D12:D111,MATCH(LARGE(IFERROR(SUMIF('💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!F12:F111)/COUNTIF('💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!D12:D111),0),${i + 1}),IFERROR(SUMIF('💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!F12:F111)/COUNTIF('💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!D12:D111),0),0)),"—")` };
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.mergeCells(`J${ri}:K${ri}`);
    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(SUMIF('💵 Revenue Tracker'!D12:D111,H${ri},'💵 Revenue Tracker'!F12:F111),0)` };
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`L${ri}`).value = { formula: `IFERROR(J${ri}/SUM('💵 Revenue Tracker'!F12:F111),0)` };
    sheet.getCell(`L${ri}`).numFmt = '0.0%';
    sheet.getCell(`L${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  // Concentration risk pill (fires on top-1 customer > 30%)
  sheet.mergeCells(`G${cR + 8}:L${cR + 8}`);
  const pillCell = sheet.getCell(`G${cR + 8}`);
  pillCell.value = { formula: `IF(L${cR + 2}>0.3,"⚠️ CONCENTRATION RISK — top customer > 30% of revenue","✓ Customer mix is diversified")` };
  pillCell.font = FONTS.bodyBold;
  pillCell.alignment = { horizontal: 'center', vertical: 'middle' };
  pillCell.fill = FILLS.ivory;
  pillCell.border = BORDER_THIN();
  sheet.getRow(cR + 8).height = 26;

  sheet.addConditionalFormatting({
    ref: `G${cR + 8}:L${cR + 8}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'CONCENTRATION', priority: 1,
        style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'diversified',   priority: 2,
        style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  // CF on customer % column — amber 20-29%, red >= 30%
  sheet.addConditionalFormatting({
    ref: `L${cR + 2}:L${cR + 6}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['0.3'],  priority: 1,
        style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['0.2'],  priority: 2,
        style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
    ],
  });

  // === SECTION 3 — Runway / burn rate meter ===
  const rR = 22;
  addSectionHeader(sheet, rR, 'Runway · burn rate', 'Months of cash on hand at current burn. Success >12 mo · Warning 6–12 mo · Alert <6 mo.', 'B:L');

  sheet.mergeCells(`B${rR + 3}:E${rR + 3}`);
  const runwayCell = sheet.getCell(`B${rR + 3}`);
  runwayCell.value = { formula: `IFERROR(TEXT((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/MAX(1,SUM('💸 Expense Tracker'!F12:F161)/12),"0.0")&" months","—")` };
  runwayCell.font = { name: 'Inter', size: 32, bold: true, color: argb(COLORS.charcoal) };
  runwayCell.alignment = { horizontal: 'center', vertical: 'middle' };
  runwayCell.fill = FILLS.ivory;
  runwayCell.border = BORDER_THIN();
  sheet.getRow(rR + 3).height = 56;

  sheet.mergeCells(`F${rR + 3}:L${rR + 3}`);
  const runwayBar = sheet.getCell(`F${rR + 3}`);
  runwayBar.value = { formula:
    `IFERROR(IF((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/MAX(1,SUM('💸 Expense Tracker'!F12:F161)/12)>=12,REPT("█",20),` +
    `REPT("█",MAX(1,MIN(20,ROUND((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/MAX(1,SUM('💸 Expense Tracker'!F12:F161)/12)*1.667,0))))&REPT("░",20-MAX(1,MIN(20,ROUND((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/MAX(1,SUM('💸 Expense Tracker'!F12:F161)/12)*1.667,0))))),"░░░░░░░░░░░░░░░░░░░░")` };
  runwayBar.font = { name: 'Inter', size: 18, color: argb(COLORS.success) };
  runwayBar.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  runwayBar.fill = FILLS.white;
  runwayBar.border = BORDER_THIN();

  // === SECTION 4 — Receivables aging buckets ===
  const aR = 28;
  addSectionHeader(sheet, aR, 'Receivables aging', 'Aged-over-30 callout in warning. Aged-over-60 in alert. Source: Invoice Tracker.', 'B:L');

  addTableHeader(sheet, aR + 3, ['Bucket', 'Amount $', 'Count'], ['B', 'D', 'G']);
  sheet.mergeCells(`B${aR + 3}:C${aR + 3}`);
  sheet.mergeCells(`D${aR + 3}:F${aR + 3}`);
  sheet.mergeCells(`G${aR + 3}:H${aR + 3}`);

  const buckets = [
    { label: '0–30 days',  amt: `SUMIFS('🧾 Invoice Tracker'!F11:F60,'🧾 Invoice Tracker'!H11:H60,"<>Paid",'🧾 Invoice Tracker'!H11:H60,"<>Cancelled",'🧾 Invoice Tracker'!I11:I60,"<=30")`,
      cnt: `COUNTIFS('🧾 Invoice Tracker'!H11:H60,"<>Paid",'🧾 Invoice Tracker'!H11:H60,"<>Cancelled",'🧾 Invoice Tracker'!I11:I60,"<=30")` },
    { label: '31–60 days', amt: `SUMIFS('🧾 Invoice Tracker'!F11:F60,'🧾 Invoice Tracker'!H11:H60,"<>Paid",'🧾 Invoice Tracker'!H11:H60,"<>Cancelled",'🧾 Invoice Tracker'!I11:I60,">30",'🧾 Invoice Tracker'!I11:I60,"<=60")`,
      cnt: `COUNTIFS('🧾 Invoice Tracker'!H11:H60,"<>Paid",'🧾 Invoice Tracker'!H11:H60,"<>Cancelled",'🧾 Invoice Tracker'!I11:I60,">30",'🧾 Invoice Tracker'!I11:I60,"<=60")` },
    { label: '61–90 days', amt: `SUMIFS('🧾 Invoice Tracker'!F11:F60,'🧾 Invoice Tracker'!H11:H60,"<>Paid",'🧾 Invoice Tracker'!H11:H60,"<>Cancelled",'🧾 Invoice Tracker'!I11:I60,">60",'🧾 Invoice Tracker'!I11:I60,"<=90")`,
      cnt: `COUNTIFS('🧾 Invoice Tracker'!H11:H60,"<>Paid",'🧾 Invoice Tracker'!H11:H60,"<>Cancelled",'🧾 Invoice Tracker'!I11:I60,">60",'🧾 Invoice Tracker'!I11:I60,"<=90")` },
    { label: '90+ days',   amt: `SUMIFS('🧾 Invoice Tracker'!F11:F60,'🧾 Invoice Tracker'!H11:H60,"<>Paid",'🧾 Invoice Tracker'!H11:H60,"<>Cancelled",'🧾 Invoice Tracker'!I11:I60,">90")`,
      cnt: `COUNTIFS('🧾 Invoice Tracker'!H11:H60,"<>Paid",'🧾 Invoice Tracker'!H11:H60,"<>Cancelled",'🧾 Invoice Tracker'!I11:I60,">90")` },
  ];
  buckets.forEach((b, i) => {
    const ri = aR + 4 + i;
    sheet.mergeCells(`B${ri}:C${ri}`);
    sheet.getCell(`B${ri}`).value = b.label;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.mergeCells(`D${ri}:F${ri}`);
    sheet.getCell(`D${ri}`).value = { formula: `IFERROR(${b.amt},0)` };
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.mergeCells(`G${ri}:H${ri}`);
    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(${b.cnt},0)` };
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
  });

  // CF on aging amounts — amber on 31-60 + 61-90, red on 90+
  sheet.addConditionalFormatting({
    ref: `D${aR + 5}:F${aR + 6}`,
    rules: [{ type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 1,
      style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } }],
  });
  sheet.addConditionalFormatting({
    ref: `D${aR + 7}:F${aR + 7}`,
    rules: [{ type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 1,
      style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } }],
  });

  addCallout(sheet, `B${aR + 10}:L${aR + 11}`,
    '💡',
    'How to use this Dashboard',
    'Every number above derives from Revenue Tracker + Expense Tracker + Invoice Tracker. Log transactions there; this tab updates live. Health Score (AI Edition) composites gross margin · net margin · runway · receivables health · cash flow trend into one 0–100 number for quick triage.');
  sheet.getRow(aR + 10).height = 28;
  sheet.getRow(aR + 11).height = 28;

  addFooter(sheet, aR + 14, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 2 — 💵 REVENUE TRACKER (Input Tab #1)
// ============================================================================

function buildRevenueTracker(workbook) {
  const sheet = workbook.addWorksheet('💵 Revenue Tracker');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 12, C: 22, D: 22, E: 12, F: 14, G: 14, H: 14, I: 22, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💵 Revenue Tracker',
    tabSubtitle: 'Every dollar in. Log here; P&L, Cash Flow, Profitability + Dashboard all derive from this tab.',
    bannerText: BANNER,
    kpiData: [
      { label: 'YTD REVENUE',    value: { formula: `TEXT(SUM(F12:F111),"$#,##0")` } },
      { label: 'ENTRIES',        value: { formula: `COUNTA(B12:B111)` } },
      { label: 'AVG TICKET',     value: { formula: `IFERROR(TEXT(AVERAGE(F12:F111),"$#,##0"),"—")` } },
      { label: 'LARGEST',        value: { formula: `IFERROR(TEXT(MAX(F12:F111),"$#,##0"),"—")` } },
      { label: 'UNIQUE CLIENTS', value: { formula: `IFERROR(SUMPRODUCT((C12:C111<>"")/COUNTIF(C12:C111,C12:C111&"")),0)` } },
      { label: 'CASH RECEIVED',  value: { formula: `TEXT(SUMIF(G12:G111,"Received",F12:F111),"$#,##0")` } },
    ],
  });

  // Sage-green column-A accent strip
  for (let i = 5; i <= 120; i++) {
    sheet.getCell(`A${i}`).fill = { type: 'pattern', pattern: 'solid', fgColor: argb(COLORS.success) };
  }

  // Section header
  let r = addSectionHeader(sheet, 6, 'Log revenue here', 'One row per transaction. Status pill auto-formats. Stream tag chips group by channel (Etsy / Direct / Wholesale / Subscription).');

  if (REV.HEADER_ROW !== 11 || REV.FIRST_ROW !== 12) {
    throw new Error(`Revenue Tracker invariant broken: HEADER_ROW=${REV.HEADER_ROW} (expected 11), FIRST_ROW=${REV.FIRST_ROW} (expected 12). Cross-tab formulas assume these constants.`);
  }

  addTableHeader(sheet, REV.HEADER_ROW, ['#', 'Date', 'Client', 'Product / Service', 'Amount $', 'Stream', 'Status', 'Payment Method', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);
  // We span more columns than 9 — re-bind to actual layout:
  // B(#) C(Date) D(Client) E(Product) F(Amount) G(Stream) H(Status) I(Payment) — wait that's 8. Re-align:

  // Redo with clean column mapping
  const headers = ['#', 'Date', 'Client', 'Product / Service', 'Amount $', 'Status', 'Stream', 'Payment Method'];
  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  // Clear and redraw cleanly
  // (Since addTableHeader already wrote some cells, rewrite with intended layout)
  cols.forEach((col, i) => {
    const cell = sheet.getCell(`${col}${REV.HEADER_ROW}`);
    cell.value = headers[i];
    cell.font = FONTS.headerWhite;
    cell.fill = FILLS.charcoal;
    cell.alignment = { vertical: 'middle', horizontal: i === 0 ? 'center' : (i === 4 ? 'right' : 'left'), indent: 1 };
    cell.border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(REV.HEADER_ROW).height = 24;

  // Seed 6 example rows
  const seedRevenue = [
    { date: '2026-05-02', client: 'Acme Realty',       product: 'Storefront sign install',  amount: 1820, status: 'Received', stream: 'Direct',     method: 'Bank transfer' },
    { date: '2026-05-04', client: 'Beechwood Cafe',    product: 'Window decals refresh',    amount:  340, status: 'Received', stream: 'Direct',     method: 'Card' },
    { date: '2026-05-08', client: 'Downtown Auto',     product: 'A-frame sandwich board',   amount:  280, status: 'Pending',  stream: 'Direct',     method: 'Net-30 invoice' },
    { date: '2026-05-12', client: 'Riverdale Spa',     product: 'Premium illuminated sign', amount: 1980, status: 'Received', stream: 'Direct',     method: 'Bank transfer' },
    { date: '2026-05-15', client: 'Sunset Realty',     product: 'Design hours (×8)',        amount:  680, status: 'Received', stream: 'Direct',     method: 'Card' },
    { date: '2026-05-18', client: 'Online Order #2147', product: 'Window decal — small',    amount:   85, status: 'Received', stream: 'Etsy',       method: 'Etsy Payments' },
  ];

  for (let i = 0; i < REV.ROW_COUNT; i++) {
    const ri = REV.FIRST_ROW + i;
    const row = seedRevenue[i];

    sheet.getCell(`B${ri}`).value = i + 1;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`C${ri}`).value = new Date(row.date);
    sheet.getCell(`C${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`D${ri}`).value = row.client;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`E${ri}`).value = row.product;
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    // Wait — header order says Amount in F. Need to follow header layout above.
    // Re-map: B=#, C=Date, D=Client, E=Product, F=Amount, G=Status, H=Stream, I=Method
    if (row) sheet.getCell(`F${ri}`).value = row.amount;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true };

    if (row) sheet.getCell(`G${ri}`).value = row.status;
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).dataValidation = { type: 'list', formulae: ['"Received,Pending,Refunded"'], allowBlank: true };

    if (row) sheet.getCell(`H${ri}`).value = row.stream;
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
    sheet.getCell(`H${ri}`).dataValidation = { type: 'list', formulae: ['"Direct,Etsy,Wholesale,Subscription,Retainer,Other"'], allowBlank: true };

    if (row) sheet.getCell(`I${ri}`).value = row.method;
    sheet.getCell(`I${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
  }

  // Rewrite key header cell labels to match data layout exactly
  const h = ['#', 'Date', 'Client', 'Product / Service', 'Amount $', 'Status', 'Stream', 'Payment Method'];
  h.forEach((label, i) => {
    const col = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'][i];
    sheet.getCell(`${col}${REV.HEADER_ROW}`).value = label;
  });

  // CF on Status pill
  sheet.addConditionalFormatting({
    ref: `G${REV.FIRST_ROW}:G${REV.LAST_ROW}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Received', priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Pending',  priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Refunded', priority: 3, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
    ],
  });

  // CF on current-month rows — highlight in ivory
  sheet.addConditionalFormatting({
    ref: `B${REV.FIRST_ROW}:I${REV.LAST_ROW}`,
    rules: [{
      type: 'expression',
      formulae: [`AND($C${REV.FIRST_ROW}<>"",MONTH($C${REV.FIRST_ROW})=MONTH(TODAY()),YEAR($C${REV.FIRST_ROW})=YEAR(TODAY()))`],
      priority: 4,
      style: { fill: FILLS.ivory },
    }],
  });

  // Total row
  const totalR = REV.LAST_ROW + 2;
  sheet.getCell(`E${totalR}`).value = 'TOTAL';
  sheet.getCell(`E${totalR}`).font = FONTS.smallCaps;
  sheet.getCell(`E${totalR}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`F${totalR}`).value = { formula: `SUM(F${REV.FIRST_ROW}:F${REV.LAST_ROW})` };
  sheet.getCell(`F${totalR}`).numFmt = '"$"#,##0.00';
  sheet.getCell(`F${totalR}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.success) };
  sheet.getCell(`F${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`F${totalR}`).border = { top: { style: 'medium', color: argb(COLORS.success) } };

  addFooter(sheet, totalR + 4, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 3 — 💸 EXPENSE TRACKER (Input Tab #2)
// ============================================================================

function buildExpenseTracker(workbook) {
  const sheet = workbook.addWorksheet('💸 Expense Tracker');
  setTabColor(sheet, COLORS.alert);
  setupColumns(sheet, { A: 2, B: 6, C: 12, D: 18, E: 22, F: 12, G: 8, H: 8, I: 18, J: 18, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💸 Expense Tracker',
    tabSubtitle: 'Every dollar out. Tax-deductible flag + Schedule C category feed the Tax Prep Summary.',
    bannerText: BANNER,
    kpiData: [
      { label: 'YTD EXPENSES',     value: { formula: `TEXT(SUM(F12:F161),"$#,##0")` } },
      { label: 'ENTRIES',          value: { formula: `COUNTA(B12:B161)` } },
      { label: 'AVG EXPENSE',      value: { formula: `IFERROR(TEXT(AVERAGE(F12:F161),"$#,##0"),"—")` } },
      { label: 'TAX-DEDUCTIBLE',   value: { formula: `TEXT(SUMIF(G12:G161,"✅",F12:F161),"$#,##0")` } },
      { label: 'COGS',             value: { formula: `TEXT(SUMIF(I12:I161,"COGS",F12:F161),"$#,##0")` } },
      { label: 'OPEX',             value: { formula: `TEXT(SUM(F12:F161)-SUMIF(I12:I161,"COGS",F12:F161),"$#,##0")` } },
    ],
  });

  // Alert-red column-A accent strip
  for (let i = 5; i <= 170; i++) {
    sheet.getCell(`A${i}`).fill = { type: 'pattern', pattern: 'solid', fgColor: argb(COLORS.alert) };
  }

  addSectionHeader(sheet, 6, 'Log expenses here', 'Tax-deductible flag (✅) feeds Tax Prep Summary. Schedule C category auto-maps to IRS line items.');

  if (EXP.HEADER_ROW !== 11 || EXP.FIRST_ROW !== 12) {
    throw new Error(`Expense Tracker invariant broken: HEADER_ROW=${EXP.HEADER_ROW} (expected 11), FIRST_ROW=${EXP.FIRST_ROW} (expected 12).`);
  }

  // Header layout: B=#, C=Date, D=Category, E=Vendor, F=Amount, G=Tax✅, H=📎, I=Schedule C, J=Notes
  const expHeaders = ['#', 'Date', 'Category', 'Vendor', 'Amount $', 'Tax', '📎', 'Schedule C', 'Notes'];
  const expCols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  expCols.forEach((col, i) => {
    const cell = sheet.getCell(`${col}${EXP.HEADER_ROW}`);
    cell.value = expHeaders[i];
    cell.font = FONTS.headerWhite;
    cell.fill = FILLS.charcoal;
    cell.alignment = { vertical: 'middle', horizontal: i === 0 || i === 5 || i === 6 ? 'center' : (i === 4 ? 'right' : 'left'), indent: 1 };
    cell.border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(EXP.HEADER_ROW).height = 24;

  // Seed 8 example rows mirroring the AI PDF persona
  const seedExpenses = [
    { date: '2026-05-01', cat: 'Rent',       vendor: 'Westside Properties', amount: 1450, tax: '✅', sch: 'Rent',                attached: '📎' },
    { date: '2026-05-02', cat: 'Supplies',   vendor: 'Acme Corrugated',     amount:  680, tax: '✅', sch: 'COGS',                attached: '📎' },
    { date: '2026-05-03', cat: 'Software',   vendor: 'Adobe',               amount:   55, tax: '✅', sch: 'Software',            attached: '📎' },
    { date: '2026-05-05', cat: 'Insurance',  vendor: 'State Farm',          amount:  240, tax: '✅', sch: 'Insurance',           attached: '📎' },
    { date: '2026-05-07', cat: 'Meals',      vendor: 'Riverdale Diner',     amount:   42, tax: '✅', sch: 'Meals (50%)',         attached: '' },
    { date: '2026-05-09', cat: 'Travel',     vendor: 'United Airlines',     amount:  386, tax: '✅', sch: 'Travel',              attached: '📎' },
    { date: '2026-05-10', cat: 'Marketing',  vendor: 'Google Ads',          amount:  120, tax: '✅', sch: 'Advertising',         attached: '' },
    { date: '2026-05-12', cat: 'Payroll',    vendor: 'Employee #1',         amount: 1900, tax: '✅', sch: 'Wages',               attached: '' },
  ];

  for (let i = 0; i < EXP.ROW_COUNT; i++) {
    const ri = EXP.FIRST_ROW + i;
    const row = seedExpenses[i];

    sheet.getCell(`B${ri}`).value = i + 1;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`C${ri}`).value = new Date(row.date);
    sheet.getCell(`C${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`D${ri}`).value = row.cat;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`E${ri}`).value = row.vendor;
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`F${ri}`).value = row.amount;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true };

    if (row) sheet.getCell(`G${ri}`).value = row.tax;
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).dataValidation = { type: 'list', formulae: ['"✅,—"'], allowBlank: true };

    if (row) sheet.getCell(`H${ri}`).value = row.attached;
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`I${ri}`).value = row.sch;
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
    sheet.getCell(`I${ri}`).dataValidation = { type: 'list', formulae: [`"${SCHEDULE_C_CATEGORIES.join(',')},COGS"`], allowBlank: true };

    sheet.getCell(`J${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
  }

  // Total row
  const totalR = EXP.LAST_ROW + 2;
  sheet.getCell(`E${totalR}`).value = 'TOTAL';
  sheet.getCell(`E${totalR}`).font = FONTS.smallCaps;
  sheet.getCell(`E${totalR}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`F${totalR}`).value = { formula: `SUM(F${EXP.FIRST_ROW}:F${EXP.LAST_ROW})` };
  sheet.getCell(`F${totalR}`).numFmt = '"$"#,##0.00';
  sheet.getCell(`F${totalR}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.alert) };
  sheet.getCell(`F${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`F${totalR}`).border = { top: { style: 'medium', color: argb(COLORS.alert) } };

  addFooter(sheet, totalR + 4, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 4 — 📊 P&L STATEMENT (All tiers)
// ============================================================================

function buildPLStatement(workbook) {
  const sheet = workbook.addWorksheet('📊 P&L Statement');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 26, C: 13, D: 13, E: 13, F: 13, G: 13, H: 13, I: 13, J: 13, K: 13, L: 11, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📊 P&L Statement',
    tabSubtitle: 'Standard accounting format: Revenue → COGS → Gross → Opex → EBITDA → Tax → Net. Monthly + YTD.',
    bannerText: BANNER,
    kpiData: [
      { label: 'YTD REVENUE',  value: { formula: `TEXT(SUM('💵 Revenue Tracker'!F12:F111),"$#,##0")` } },
      { label: 'YTD COGS',     value: { formula: `TEXT(SUMIF('💸 Expense Tracker'!I12:I161,"COGS",'💸 Expense Tracker'!F12:F161),"$#,##0")` } },
      { label: 'YTD GROSS',    value: { formula: `TEXT(SUM('💵 Revenue Tracker'!F12:F111)-SUMIF('💸 Expense Tracker'!I12:I161,"COGS",'💸 Expense Tracker'!F12:F161),"$#,##0")` } },
      { label: 'GROSS MARGIN', value: { formula: `IFERROR(TEXT((SUM('💵 Revenue Tracker'!F12:F111)-SUMIF('💸 Expense Tracker'!I12:I161,"COGS",'💸 Expense Tracker'!F12:F161))/SUM('💵 Revenue Tracker'!F12:F111),"0.0%"),"—")` } },
      { label: 'YTD NET',      value: { formula: `TEXT(SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161),"$#,##0")` } },
      { label: 'NET MARGIN',   value: { formula: `IFERROR(TEXT((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/SUM('💵 Revenue Tracker'!F12:F111),"0.0%"),"—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Monthly + YTD breakdown', 'Margin % column at right per line. CF: alert <0%, warning <10%, success >25%.');

  // Headers — month columns from current month + YTD
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const monthCols = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

  sheet.getCell(`B${r + 1}`).value = 'Line item';
  sheet.getCell(`B${r + 1}`).font = FONTS.headerWhite;
  sheet.getCell(`B${r + 1}`).fill = FILLS.charcoal;
  sheet.getCell(`B${r + 1}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${r + 1}`).border = BORDER_THIN(COLORS.charcoal);

  monthCols.forEach((col, i) => {
    const cell = sheet.getCell(`${col}${r + 1}`);
    cell.value = months[i] || '';
    cell.font = FONTS.headerWhite;
    cell.fill = FILLS.charcoal;
    cell.alignment = { horizontal: 'right', indent: 1 };
    cell.border = BORDER_THIN(COLORS.charcoal);
  });

  sheet.getCell(`L${r + 1}`).value = '% Rev';
  sheet.getCell(`L${r + 1}`).font = FONTS.headerWhite;
  sheet.getCell(`L${r + 1}`).fill = FILLS.charcoal;
  sheet.getCell(`L${r + 1}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`L${r + 1}`).border = BORDER_THIN(COLORS.charcoal);
  sheet.getRow(r + 1).height = 24;

  // Line items
  const lines = [
    { label: 'Revenue',          row: 'rev',   formulaForMonth: (mIdx) => `SUMIFS('💵 Revenue Tracker'!F12:F111,'💵 Revenue Tracker'!C12:C111,">="&DATE(YEAR(TODAY()),${mIdx + 1},1),'💵 Revenue Tracker'!C12:C111,"<"&DATE(YEAR(TODAY()),${mIdx + 2},1))`, bold: true },
    { label: 'COGS',             row: 'cogs',  formulaForMonth: (mIdx) => `SUMIFS('💸 Expense Tracker'!F12:F161,'💸 Expense Tracker'!C12:C161,">="&DATE(YEAR(TODAY()),${mIdx + 1},1),'💸 Expense Tracker'!C12:C161,"<"&DATE(YEAR(TODAY()),${mIdx + 2},1),'💸 Expense Tracker'!I12:I161,"COGS")` },
    { label: 'Gross Profit',     row: 'gross', formulaForMonth: (mIdx, cellRef) => `${cellRef.replace(/\d+/, String(r + 2))}-${cellRef.replace(/\d+/, String(r + 3))}`, bold: true, color: COLORS.success, isDerived: true },
    { label: 'Operating Expense',row: 'opex',  formulaForMonth: (mIdx) => `SUMIFS('💸 Expense Tracker'!F12:F161,'💸 Expense Tracker'!C12:C161,">="&DATE(YEAR(TODAY()),${mIdx + 1},1),'💸 Expense Tracker'!C12:C161,"<"&DATE(YEAR(TODAY()),${mIdx + 2},1),'💸 Expense Tracker'!I12:I161,"<>COGS")` },
    { label: 'EBITDA',           row: 'ebitda',formulaForMonth: (mIdx, cellRef) => `${cellRef.replace(/\d+/, String(r + 4))}-${cellRef.replace(/\d+/, String(r + 5))}`, bold: true, isDerived: true },
    { label: 'Tax estimate (25%)',row: 'tax',  formulaForMonth: (mIdx, cellRef) => `MAX(0,${cellRef.replace(/\d+/, String(r + 6))})*0.25`, isDerived: true },
    { label: 'Net Profit',       row: 'net',   formulaForMonth: (mIdx, cellRef) => `${cellRef.replace(/\d+/, String(r + 6))}-${cellRef.replace(/\d+/, String(r + 7))}`, bold: true, color: COLORS.charcoal, isDerived: true },
  ];

  lines.forEach((line, lIdx) => {
    const ri = r + 2 + lIdx;
    sheet.getCell(`B${ri}`).value = line.label;
    sheet.getCell(`B${ri}`).font = line.bold ? FONTS.bodyBold : FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: line.isDerived ? 1 : 2 };
    sheet.getCell(`B${ri}`).fill = line.bold ? FILLS.ivory : FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    monthCols.forEach((col, mIdx) => {
      const cell = sheet.getCell(`${col}${ri}`);
      cell.value = { formula: line.formulaForMonth(mIdx, `${col}${ri}`) };
      cell.numFmt = '"$"#,##0;("$"#,##0)';
      cell.font = line.bold ? { ...FONTS.bodyBold, color: argb(line.color || COLORS.charcoal) } : FONTS.body;
      cell.alignment = { horizontal: 'right' };
      cell.fill = line.bold ? FILLS.ivory : FILLS.white;
      cell.border = BORDER_THIN();
    });

    // % Revenue column
    sheet.getCell(`L${ri}`).value = { formula: `IFERROR(SUM(C${ri}:K${ri})/SUM(C${r + 2}:K${r + 2}),0)` };
    sheet.getCell(`L${ri}`).numFmt = '0.0%';
    sheet.getCell(`L${ri}`).font = line.bold ? FONTS.bodyBold : FONTS.bodyMuted;
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`L${ri}`).fill = line.bold ? FILLS.ivory : FILLS.white;
    sheet.getCell(`L${ri}`).border = BORDER_THIN();

    sheet.getRow(ri).height = 22;
  });

  // CF on margin row (L column) — alert <0%, warning <10%, success >25%
  sheet.addConditionalFormatting({
    ref: `L${r + 4}:L${r + 4}`,   // Gross Profit margin row
    rules: [
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['0.25'], priority: 1, style: { font: { color: argb(COLORS.success), bold: true } } },
      { type: 'cellIs', operator: 'lessThan',           formulae: ['0.1'],  priority: 2, style: { font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'cellIs', operator: 'lessThan',           formulae: ['0'],    priority: 3, style: { font: { color: argb(COLORS.alert),   bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 11}:L${r + 12}`,
    '💡',
    'How this tab is wired',
    'Revenue pulled from Revenue Tracker (col E) filtered by month. COGS pulled from Expense Tracker where Schedule C category = "COGS". Opex = everything else. EBITDA = Gross − Opex. Tax estimate at 25% — replace with your actual rate. Net = EBITDA − Tax.');
  sheet.getRow(r + 11).height = 28;
  sheet.getRow(r + 12).height = 28;

  addFooter(sheet, r + 15, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 5 — 💧 CASH FLOW STATEMENT (All tiers)
// ============================================================================

function buildCashFlowStatement(workbook) {
  const sheet = workbook.addWorksheet('💧 Cash Flow Statement');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 28, C: 13, D: 13, E: 13, F: 13, G: 13, H: 13, I: 13, J: 13, K: 13, L: 11, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💧 Cash Flow Statement',
    tabSubtitle: '3-section split: Operating · Investing · Financing. Rolling 3-mo avg row at bottom.',
    bannerText: BANNER,
    kpiData: [
      { label: 'YTD CASH IN',   value: { formula: `TEXT(SUMIF('💵 Revenue Tracker'!G12:G111,"Received",'💵 Revenue Tracker'!F12:F111),"$#,##0")` } },
      { label: 'YTD CASH OUT',  value: { formula: `TEXT(SUM('💸 Expense Tracker'!F12:F161),"$#,##0")` } },
      { label: 'NET CASH FLOW', value: { formula: `TEXT(SUMIF('💵 Revenue Tracker'!G12:G111,"Received",'💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161),"$#,##0")` } },
      { label: 'CASH ON HAND',  value: { formula: `TEXT(SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161),"$#,##0")` } },
      { label: 'BURN RATE/MO',  value: { formula: `IFERROR(TEXT(SUM('💸 Expense Tracker'!F12:F161)/12,"$#,##0"),"—")` } },
      { label: 'RUNWAY (MOS)',  value: { formula: `IFERROR(TEXT((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/MAX(1,SUM('💸 Expense Tracker'!F12:F161)/12),"0.0")&" mo","—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Cash flow by month', 'Operating activities derive from Revenue Tracker + Expense Tracker. Investing + Financing are manual entry.');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const monthCols = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

  sheet.getCell(`B${r + 1}`).value = 'Activity';
  sheet.getCell(`B${r + 1}`).font = FONTS.headerWhite;
  sheet.getCell(`B${r + 1}`).fill = FILLS.charcoal;
  sheet.getCell(`B${r + 1}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${r + 1}`).border = BORDER_THIN(COLORS.charcoal);

  monthCols.forEach((col, i) => {
    sheet.getCell(`${col}${r + 1}`).value = months[i] || '';
    sheet.getCell(`${col}${r + 1}`).font = FONTS.headerWhite;
    sheet.getCell(`${col}${r + 1}`).fill = FILLS.charcoal;
    sheet.getCell(`${col}${r + 1}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`${col}${r + 1}`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getCell(`L${r + 1}`).value = 'YTD';
  sheet.getCell(`L${r + 1}`).font = FONTS.headerWhite;
  sheet.getCell(`L${r + 1}`).fill = FILLS.charcoal;
  sheet.getCell(`L${r + 1}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`L${r + 1}`).border = BORDER_THIN(COLORS.charcoal);
  sheet.getRow(r + 1).height = 24;

  // Sections: Operating / Investing / Financing
  const sections = [
    {
      name: 'OPERATING ACTIVITIES',
      rows: [
        { label: 'Cash received from customers', auto: true, posSign: true,
          formulaForMonth: (mIdx) => `SUMIFS('💵 Revenue Tracker'!F12:F111,'💵 Revenue Tracker'!C12:C111,">="&DATE(YEAR(TODAY()),${mIdx + 1},1),'💵 Revenue Tracker'!C12:C111,"<"&DATE(YEAR(TODAY()),${mIdx + 2},1),'💵 Revenue Tracker'!G12:G111,"Received")` },
        { label: 'Cash paid for operating expenses', auto: true, posSign: false,
          formulaForMonth: (mIdx) => `-SUMIFS('💸 Expense Tracker'!F12:F161,'💸 Expense Tracker'!C12:C161,">="&DATE(YEAR(TODAY()),${mIdx + 1},1),'💸 Expense Tracker'!C12:C161,"<"&DATE(YEAR(TODAY()),${mIdx + 2},1))` },
      ],
    },
    {
      name: 'INVESTING ACTIVITIES',
      rows: [
        { label: 'Asset purchases (Capex)',   auto: false },
        { label: 'Asset sales',               auto: false },
      ],
    },
    {
      name: 'FINANCING ACTIVITIES',
      rows: [
        { label: 'Loan proceeds',             auto: false },
        { label: 'Loan repayments',           auto: false },
        { label: 'Owner contributions',       auto: false },
        { label: 'Owner draws / dividends',   auto: false },
      ],
    },
  ];

  let curRow = r + 2;
  const subtotalRows = [];
  sections.forEach((sec) => {
    // Section header row
    sheet.mergeCells(`B${curRow}:L${curRow}`);
    sheet.getCell(`B${curRow}`).value = sec.name;
    sheet.getCell(`B${curRow}`).font = FONTS.smallCaps;
    sheet.getCell(`B${curRow}`).fill = FILLS.ivory;
    sheet.getCell(`B${curRow}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getRow(curRow).height = 20;
    curRow++;

    const sectionStart = curRow;
    sec.rows.forEach((row) => {
      sheet.getCell(`B${curRow}`).value = row.label;
      sheet.getCell(`B${curRow}`).font = FONTS.body;
      sheet.getCell(`B${curRow}`).alignment = { horizontal: 'left', indent: 2 };
      sheet.getCell(`B${curRow}`).fill = FILLS.white;
      sheet.getCell(`B${curRow}`).border = BORDER_THIN();

      monthCols.forEach((col, mIdx) => {
        const cell = sheet.getCell(`${col}${curRow}`);
        if (row.auto) {
          cell.value = { formula: row.formulaForMonth(mIdx) };
        }
        cell.numFmt = '"$"#,##0;("$"#,##0)';
        cell.font = FONTS.body;
        cell.alignment = { horizontal: 'right' };
        cell.fill = FILLS.white;
        cell.border = BORDER_THIN();
      });
      sheet.getCell(`L${curRow}`).value = { formula: `SUM(C${curRow}:K${curRow})` };
      sheet.getCell(`L${curRow}`).numFmt = '"$"#,##0;("$"#,##0)';
      sheet.getCell(`L${curRow}`).font = FONTS.bodyBold;
      sheet.getCell(`L${curRow}`).alignment = { horizontal: 'right' };
      sheet.getCell(`L${curRow}`).fill = FILLS.white;
      sheet.getCell(`L${curRow}`).border = BORDER_THIN();

      curRow++;
    });

    // Section subtotal
    sheet.getCell(`B${curRow}`).value = `Subtotal — ${sec.name.split(' ')[0]}`;
    sheet.getCell(`B${curRow}`).font = FONTS.bodyBold;
    sheet.getCell(`B${curRow}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${curRow}`).fill = FILLS.ivory;
    sheet.getCell(`B${curRow}`).border = { top: { style: 'thin', color: argb(COLORS.charcoal) } };

    monthCols.forEach((col) => {
      sheet.getCell(`${col}${curRow}`).value = { formula: `SUM(${col}${sectionStart}:${col}${curRow - 1})` };
      sheet.getCell(`${col}${curRow}`).numFmt = '"$"#,##0;("$"#,##0)';
      sheet.getCell(`${col}${curRow}`).font = FONTS.bodyBold;
      sheet.getCell(`${col}${curRow}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${col}${curRow}`).fill = FILLS.ivory;
      sheet.getCell(`${col}${curRow}`).border = { top: { style: 'thin', color: argb(COLORS.charcoal) } };
    });
    sheet.getCell(`L${curRow}`).value = { formula: `SUM(C${curRow}:K${curRow})` };
    sheet.getCell(`L${curRow}`).numFmt = '"$"#,##0;("$"#,##0)';
    sheet.getCell(`L${curRow}`).font = FONTS.bodyBold;
    sheet.getCell(`L${curRow}`).alignment = { horizontal: 'right' };
    sheet.getCell(`L${curRow}`).fill = FILLS.ivory;
    sheet.getCell(`L${curRow}`).border = { top: { style: 'thin', color: argb(COLORS.charcoal) } };

    subtotalRows.push(curRow);
    curRow++;
  });

  // Net cash change row
  sheet.getCell(`B${curRow}`).value = 'NET CASH CHANGE';
  sheet.getCell(`B${curRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`B${curRow}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${curRow}`).fill = FILLS.charcoal;
  sheet.getCell(`B${curRow}`).border = BORDER_THIN(COLORS.charcoal);
  monthCols.forEach((col) => {
    sheet.getCell(`${col}${curRow}`).value = { formula: subtotalRows.map((sr) => `${col}${sr}`).join('+') };
    sheet.getCell(`${col}${curRow}`).numFmt = '"$"#,##0;("$"#,##0)';
    sheet.getCell(`${col}${curRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.white) };
    sheet.getCell(`${col}${curRow}`).alignment = { horizontal: 'right' };
    sheet.getCell(`${col}${curRow}`).fill = FILLS.charcoal;
    sheet.getCell(`${col}${curRow}`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getCell(`L${curRow}`).value = { formula: `SUM(C${curRow}:K${curRow})` };
  sheet.getCell(`L${curRow}`).numFmt = '"$"#,##0;("$"#,##0)';
  sheet.getCell(`L${curRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`L${curRow}`).alignment = { horizontal: 'right' };
  sheet.getCell(`L${curRow}`).fill = FILLS.charcoal;
  sheet.getCell(`L${curRow}`).border = BORDER_THIN(COLORS.charcoal);
  sheet.getRow(curRow).height = 26;
  const netRow = curRow;
  curRow++;

  // Rolling 3-mo average row
  sheet.getCell(`B${curRow}`).value = 'Rolling 3-mo avg';
  sheet.getCell(`B${curRow}`).font = FONTS.bodyMuted;
  sheet.getCell(`B${curRow}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${curRow}`).fill = FILLS.white;
  sheet.getCell(`B${curRow}`).border = BORDER_THIN();
  monthCols.forEach((col, mIdx) => {
    if (mIdx >= 2) {
      const startCol = monthCols[mIdx - 2];
      sheet.getCell(`${col}${curRow}`).value = { formula: `AVERAGE(${startCol}${netRow}:${col}${netRow})` };
    }
    sheet.getCell(`${col}${curRow}`).numFmt = '"$"#,##0;("$"#,##0)';
    sheet.getCell(`${col}${curRow}`).font = FONTS.bodyMuted;
    sheet.getCell(`${col}${curRow}`).alignment = { horizontal: 'right' };
    sheet.getCell(`${col}${curRow}`).fill = FILLS.white;
    sheet.getCell(`${col}${curRow}`).border = BORDER_THIN();
  });
  curRow++;

  // Danger ribbon
  curRow += 1;
  sheet.mergeCells(`B${curRow}:L${curRow}`);
  const ribbonCell = sheet.getCell(`B${curRow}`);
  ribbonCell.value = { formula: `IF(SUMPRODUCT((C${netRow}:K${netRow}<0)*1)>=2,"⚠️ DANGER — 2 or more months of negative net cash flow detected. Review the Cash Flow Forecast (Pro) to project the next 90 days.","✓ No consecutive negative-cash months detected.")` };
  ribbonCell.font = FONTS.bodyBold;
  ribbonCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ribbonCell.fill = FILLS.ivory;
  ribbonCell.border = BORDER_THIN();
  sheet.getRow(curRow).height = 28;

  sheet.addConditionalFormatting({
    ref: `B${curRow}:L${curRow}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'DANGER',   priority: 1, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'No conse', priority: 2, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addFooter(sheet, curRow + 3, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 6 — 🏦 BALANCE SHEET (Pro+)
// ============================================================================

function buildBalanceSheet(workbook) {
  const sheet = workbook.addWorksheet('🏦 Balance Sheet');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 28, C: 16, D: 16, E: 4, F: 28, G: 16, H: 16, I: 2, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏦 Balance Sheet',
    tabSubtitle: 'Two-column layout: Assets · Liabilities + Equity. Auto-balance verification at bottom.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL ASSETS',     value: { formula: `TEXT(C30+C31+C32+C33+C34,"$#,##0")` } },
      { label: 'TOTAL LIABILITIES',value: { formula: `TEXT(G30+G31+G32,"$#,##0")` } },
      { label: 'TOTAL EQUITY',     value: { formula: `TEXT(G36+G37+G38,"$#,##0")` } },
      { label: 'NET BOOK VALUE',   value: { formula: `TEXT(C30+C31+C32+C33+C34-G30-G31-G32,"$#,##0")` } },
      { label: 'CURRENT RATIO',    value: { formula: `IFERROR(TEXT(C30/MAX(1,G30),"0.00"),"—")` } },
      { label: 'DEBT / EQUITY',    value: { formula: `IFERROR(TEXT((G30+G31+G32)/MAX(1,G36+G37+G38),"0.00"),"—")` } },
    ],
  });

  // ASSETS column
  let r = addSectionHeader(sheet, 6, 'Assets', 'Current + Fixed. Update monthly or quarterly.', 'B:C');

  const assetRows = [
    { label: 'CURRENT ASSETS',     header: true },
    { label: 'Cash + bank accounts',     formula: `SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161)` },
    { label: 'Accounts receivable',      formula: `SUMIFS('🧾 Invoice Tracker'!F11:F60,'🧾 Invoice Tracker'!H11:H60,"<>Paid",'🧾 Invoice Tracker'!H11:H60,"<>Cancelled")` },
    { label: 'Inventory',                formula: `IFERROR(SUM('📦 Inventory Tracker'!F12:F61),0)` },
    { label: 'Prepaid expenses',         formula: null },
    { label: 'FIXED ASSETS',       header: true },
    { label: 'Equipment + furniture (net)', formula: `IFERROR(SUMPRODUCT('🏗️ Asset Depreciation'!F12:F26-'🏗️ Asset Depreciation'!K12:K26),0)` },
    { label: 'Vehicles (net)',           formula: null },
    { label: 'Property (net)',           formula: null },
  ];

  let aRow = r + 1;
  assetRows.forEach((row) => {
    sheet.getCell(`B${aRow}`).value = row.label;
    sheet.getCell(`B${aRow}`).font = row.header ? FONTS.smallCaps : FONTS.body;
    sheet.getCell(`B${aRow}`).alignment = { horizontal: 'left', indent: row.header ? 1 : 2 };
    sheet.getCell(`B${aRow}`).fill = row.header ? FILLS.ivory : FILLS.white;
    sheet.getCell(`B${aRow}`).border = BORDER_THIN();
    if (!row.header) {
      const cell = sheet.getCell(`C${aRow}`);
      if (row.formula) cell.value = { formula: `IFERROR(${row.formula},0)` };
      cell.numFmt = '"$"#,##0';
      cell.font = FONTS.body;
      cell.alignment = { horizontal: 'right' };
      cell.fill = FILLS.white;
      cell.border = BORDER_THIN();
    }
    sheet.getRow(aRow).height = 22;
    aRow++;
  });

  // Total assets
  sheet.getCell(`B${aRow}`).value = 'TOTAL ASSETS';
  sheet.getCell(`B${aRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`B${aRow}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${aRow}`).fill = FILLS.charcoal;
  sheet.getCell(`B${aRow}`).border = BORDER_THIN(COLORS.charcoal);
  sheet.getCell(`C${aRow}`).value = { formula: `SUM(C${r + 2}:C${aRow - 1})` };
  sheet.getCell(`C${aRow}`).numFmt = '"$"#,##0';
  sheet.getCell(`C${aRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.white) };
  sheet.getCell(`C${aRow}`).alignment = { horizontal: 'right' };
  sheet.getCell(`C${aRow}`).fill = FILLS.charcoal;
  sheet.getCell(`C${aRow}`).border = BORDER_THIN(COLORS.charcoal);
  sheet.getRow(aRow).height = 26;
  const totalAssetsRow = aRow;

  // LIABILITIES + EQUITY column (F:G)
  let lR = addSectionHeader(sheet, 6, 'Liabilities + Equity', 'Current liabilities · Long-term debt · Equity build.', 'F:G');

  const liabRows = [
    { label: 'CURRENT LIABILITIES', header: true },
    { label: 'Accounts payable',           formula: null },
    { label: 'Accrued expenses',           formula: null },
    { label: 'Short-term debt',            formula: null },
    { label: 'LONG-TERM DEBT',       header: true },
    { label: 'Loans outstanding',          formula: `IFERROR(SUM('💰 Loan Amortization'!E12:E16),0)` },
    { label: 'EQUITY',               header: true },
    { label: 'Owner contributions',        formula: null },
    { label: 'Retained earnings',          formula: `SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161)` },
    { label: 'Common stock',               formula: null },
  ];

  let lRow = lR + 1;
  liabRows.forEach((row) => {
    sheet.getCell(`F${lRow}`).value = row.label;
    sheet.getCell(`F${lRow}`).font = row.header ? FONTS.smallCaps : FONTS.body;
    sheet.getCell(`F${lRow}`).alignment = { horizontal: 'left', indent: row.header ? 1 : 2 };
    sheet.getCell(`F${lRow}`).fill = row.header ? FILLS.ivory : FILLS.white;
    sheet.getCell(`F${lRow}`).border = BORDER_THIN();
    if (!row.header) {
      const cell = sheet.getCell(`G${lRow}`);
      if (row.formula) cell.value = { formula: `IFERROR(${row.formula},0)` };
      cell.numFmt = '"$"#,##0';
      cell.font = FONTS.body;
      cell.alignment = { horizontal: 'right' };
      cell.fill = FILLS.white;
      cell.border = BORDER_THIN();
    }
    sheet.getRow(lRow).height = 22;
    lRow++;
  });

  // Total L+E
  sheet.getCell(`F${lRow}`).value = 'TOTAL L + E';
  sheet.getCell(`F${lRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`F${lRow}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`F${lRow}`).fill = FILLS.charcoal;
  sheet.getCell(`F${lRow}`).border = BORDER_THIN(COLORS.charcoal);
  sheet.getCell(`G${lRow}`).value = { formula: `SUM(G${lR + 2}:G${lRow - 1})` };
  sheet.getCell(`G${lRow}`).numFmt = '"$"#,##0';
  sheet.getCell(`G${lRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.white) };
  sheet.getCell(`G${lRow}`).alignment = { horizontal: 'right' };
  sheet.getCell(`G${lRow}`).fill = FILLS.charcoal;
  sheet.getCell(`G${lRow}`).border = BORDER_THIN(COLORS.charcoal);
  sheet.getRow(lRow).height = 26;
  const totalLERow = lRow;

  // Balance verification row
  const balR = Math.max(totalAssetsRow, totalLERow) + 3;
  sheet.mergeCells(`B${balR}:G${balR}`);
  const balCell = sheet.getCell(`B${balR}`);
  balCell.value = { formula: `IF(ABS(C${totalAssetsRow}-G${totalLERow})<0.01,"✓ Books balance: Assets = Liabilities + Equity (within $0.01)","⚠️ OUT OF BALANCE — Assets "&TEXT(C${totalAssetsRow},"$#,##0")&" ≠ L+E "&TEXT(G${totalLERow},"$#,##0")&". Diff: "&TEXT(C${totalAssetsRow}-G${totalLERow},"$#,##0"))` };
  balCell.font = FONTS.bodyBold;
  balCell.alignment = { horizontal: 'center', vertical: 'middle' };
  balCell.fill = FILLS.ivory;
  balCell.border = BORDER_THIN();
  sheet.getRow(balR).height = 30;

  sheet.addConditionalFormatting({
    ref: `B${balR}:G${balR}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'balance:', priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'OUT OF',   priority: 2, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
    ],
  });

  addFooter(sheet, balR + 3, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 7 — 🧾 INVOICE TRACKER (All tiers)
// ============================================================================

function buildInvoiceTracker(workbook) {
  const sheet = workbook.addWorksheet('🧾 Invoice Tracker');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 14, C: 22, D: 13, E: 13, F: 13, G: 13, H: 13, I: 11, J: 24, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🧾 Invoice Tracker',
    tabSubtitle: 'Up to 50 invoices. Days outstanding auto-calc. Status pill grades health.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL OUTSTANDING', value: { formula: `TEXT(SUMIFS(F11:F60,H11:H60,"<>Paid",H11:H60,"<>Cancelled"),"$#,##0")` } },
      { label: 'PAID YTD',          value: { formula: `TEXT(SUMIF(H11:H60,"Paid",F11:F60),"$#,##0")` } },
      { label: 'OVERDUE',           value: { formula: `TEXT(SUMIF(H11:H60,"Overdue",F11:F60),"$#,##0")` } },
      { label: 'INVOICES',          value: { formula: `COUNTA(B11:B60)` } },
      { label: 'AVG TICKET',        value: { formula: `IFERROR(TEXT(AVERAGE(F11:F60),"$#,##0"),"—")` } },
      { label: 'DSO (DAYS)',        value: { formula: `IFERROR(TEXT(SUMIFS(I11:I60,H11:H60,"<>Paid",H11:H60,"<>Cancelled",B11:B60,"<>")/MAX(1,COUNTIFS(H11:H60,"<>Paid",H11:H60,"<>Cancelled",B11:B60,"<>")),"0")&" days","—")` } },
    ],
  });

  // Header layout: B=Invoice#, C=Client, D=Issue, E=Due, F=Amount, G=Paid Date, H=Status, I=Days Out, J=Notes
  const iCols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const iHeaders = ['Invoice #', 'Client', 'Issue Date', 'Due Date', 'Amount $', 'Paid Date', 'Status', 'Days Out', 'Notes'];
  iCols.forEach((col, i) => {
    const cell = sheet.getCell(`${col}10`);
    cell.value = iHeaders[i];
    cell.font = FONTS.headerWhite;
    cell.fill = FILLS.charcoal;
    cell.alignment = { vertical: 'middle', horizontal: i === 4 || i === 7 ? 'right' : 'left', indent: 1 };
    cell.border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(10).height = 24;

  // Seed 6 sample invoices
  const seedInvoices = [
    { num: 'INV-2026-0042', client: 'Acme Realty',      issue: '2026-04-15', due: '2026-05-15', amount: 4200, paid: '2026-05-10', status: 'Paid' },
    { num: 'INV-2026-0043', client: 'Beechwood Cafe',   issue: '2026-04-22', due: '2026-05-22', amount:  890, paid: '2026-05-18', status: 'Paid' },
    { num: 'INV-2026-0044', client: 'Downtown Auto',    issue: '2026-04-28', due: '2026-05-28', amount: 1420, paid: '',           status: 'Overdue' },
    { num: 'INV-2026-0045', client: 'Riverdale Spa',    issue: '2026-05-05', due: '2026-06-05', amount: 1980, paid: '',           status: 'Sent' },
    { num: 'INV-2026-0046', client: 'Mr. Hardware',     issue: '2026-05-12', due: '2026-06-12', amount:  620, paid: '',           status: 'Sent' },
    { num: 'INV-2026-0047', client: 'Sunset Realty',    issue: '2026-05-18', due: '2026-06-18', amount: 1240, paid: '',           status: 'Draft' },
  ];

  for (let i = 0; i < 50; i++) {
    const ri = 11 + i;
    const row = seedInvoices[i];

    if (row) sheet.getCell(`B${ri}`).value = row.num;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`C${ri}`).value = row.client;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`D${ri}`).value = new Date(row.issue);
    sheet.getCell(`D${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`E${ri}`).value = new Date(row.due);
    sheet.getCell(`E${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`F${ri}`).value = row.amount;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    if (row && row.paid) sheet.getCell(`G${ri}`).value = new Date(row.paid);
    sheet.getCell(`G${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`H${ri}`).value = row.status;
    sheet.getCell(`H${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
    sheet.getCell(`H${ri}`).dataValidation = { type: 'list', formulae: ['"Draft,Sent,Paid,Overdue,Cancelled"'], allowBlank: true };

    // Days outstanding — only for unpaid; uses TODAY()
    sheet.getCell(`I${ri}`).value = { formula: `IF(OR(B${ri}="",H${ri}="Paid",H${ri}="Cancelled"),"",TODAY()-D${ri})` };
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
  }

  // CF on Status pill
  sheet.addConditionalFormatting({
    ref: `H11:H60`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Paid',      priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Sent',      priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Overdue',   priority: 3, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Draft',     priority: 4, style: { fill: FILLS.ivory } },
      { type: 'containsText', operator: 'containsText', text: 'Cancelled', priority: 5, style: { font: { color: argb(COLORS.textMuted), italic: true } } },
    ],
  });

  // CF on Days Out
  sheet.addConditionalFormatting({
    ref: `I11:I60`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['60'], priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'cellIs', operator: 'greaterThan', formulae: ['30'], priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
    ],
  });

  // Total row
  sheet.getCell(`E62`).value = 'TOTAL';
  sheet.getCell(`E62`).font = FONTS.smallCaps;
  sheet.getCell(`E62`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`F62`).value = { formula: `SUM(F11:F60)` };
  sheet.getCell(`F62`).numFmt = '"$"#,##0.00';
  sheet.getCell(`F62`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell(`F62`).alignment = { horizontal: 'right' };
  sheet.getCell(`F62`).border = { top: { style: 'medium', color: argb(COLORS.charcoal) } };

  addFooter(sheet, 66, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 8 — 📄 INVOICE TEMPLATES (All tiers — 5 essentials, 10 Pro+)
// ============================================================================

function buildInvoiceTemplates(workbook) {
  const tier = workbook._tier || 'ai';
  const sheet = workbook.addWorksheet('📄 Invoice Templates');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 2, L: 2, M: 2 });

  const templateCount = tier === 'essentials' ? 5 : 10;

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📄 Invoice Templates',
    tabSubtitle: `${templateCount} print-ready invoice templates. Duplicate, edit, export to PDF, send.`,
    bannerText: BANNER,
    kpiData: [
      { label: 'TEMPLATES',     value: `${templateCount}` },
      { label: 'TIER',          value: tier === 'essentials' ? 'Essentials' : (tier === 'pro' ? 'Pro' : 'AI Edition') },
      { label: 'CURRENCY',      value: 'USD' },
      { label: 'TAX',           value: 'Configurable' },
      { label: 'FORMAT',        value: 'US Letter' },
      { label: 'EXPORT',        value: 'PDF' },
    ],
  });

  // Single rendered invoice template — buyer duplicates this block N times
  let r = addSectionHeader(sheet, 6, 'Template — Standard Invoice', 'Edit fields below. Print to PDF (File → Print → Save as PDF) to send.');

  // Logo placeholder + Business info
  sheet.mergeCells(`B${r + 1}:E${r + 3}`);
  sheet.getCell(`B${r + 1}`).value = '[ YOUR LOGO ]';
  sheet.getCell(`B${r + 1}`).font = { ...FONTS.bodyMuted, size: 14 };
  sheet.getCell(`B${r + 1}`).alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getCell(`B${r + 1}`).fill = FILLS.ivory;
  sheet.getCell(`B${r + 1}`).border = BORDER_THIN();

  sheet.mergeCells(`F${r + 1}:J${r + 1}`);
  sheet.getCell(`F${r + 1}`).value = 'INVOICE';
  sheet.getCell(`F${r + 1}`).font = { name: 'Inter', size: 36, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell(`F${r + 1}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getRow(r + 1).height = 40;

  sheet.mergeCells(`F${r + 2}:G${r + 2}`);
  sheet.getCell(`F${r + 2}`).value = 'Invoice #';
  sheet.getCell(`F${r + 2}`).font = FONTS.smallCaps;
  sheet.mergeCells(`H${r + 2}:J${r + 2}`);
  sheet.getCell(`H${r + 2}`).value = 'INV-2026-####';
  sheet.getCell(`H${r + 2}`).font = FONTS.body;
  sheet.getCell(`H${r + 2}`).alignment = { horizontal: 'right' };

  sheet.mergeCells(`F${r + 3}:G${r + 3}`);
  sheet.getCell(`F${r + 3}`).value = 'Date';
  sheet.getCell(`F${r + 3}`).font = FONTS.smallCaps;
  sheet.mergeCells(`H${r + 3}:J${r + 3}`);
  sheet.getCell(`H${r + 3}`).value = { formula: `TEXT(TODAY(),"mmm d, yyyy")` };
  sheet.getCell(`H${r + 3}`).font = FONTS.body;
  sheet.getCell(`H${r + 3}`).alignment = { horizontal: 'right' };

  // Bill From / Bill To
  let billR = r + 5;
  sheet.mergeCells(`B${billR}:E${billR}`);
  sheet.getCell(`B${billR}`).value = 'BILL FROM';
  sheet.getCell(`B${billR}`).font = FONTS.smallCaps;
  sheet.mergeCells(`F${billR}:J${billR}`);
  sheet.getCell(`F${billR}`).value = 'BILL TO';
  sheet.getCell(`F${billR}`).font = FONTS.smallCaps;

  ['[Your Business Name]', '[Your Address Line 1]', '[City, State, ZIP]', '[Phone · Email]'].forEach((line, i) => {
    sheet.mergeCells(`B${billR + 1 + i}:E${billR + 1 + i}`);
    sheet.getCell(`B${billR + 1 + i}`).value = line;
    sheet.getCell(`B${billR + 1 + i}`).font = FONTS.body;
  });
  ['[Client Name]', '[Client Address]', '[Client City, State, ZIP]', '[Client Email]'].forEach((line, i) => {
    sheet.mergeCells(`F${billR + 1 + i}:J${billR + 1 + i}`);
    sheet.getCell(`F${billR + 1 + i}`).value = line;
    sheet.getCell(`F${billR + 1 + i}`).font = FONTS.body;
  });

  // Line items table
  let liR = billR + 6;
  const liHeaders = ['Description', 'Qty', 'Unit Price', 'Tax %', 'Amount $'];
  const liCols = ['B', 'F', 'G', 'H', 'J'];
  liCols.forEach((col, i) => {
    const cell = sheet.getCell(`${col}${liR}`);
    cell.value = liHeaders[i];
    cell.font = FONTS.headerWhite;
    cell.fill = FILLS.charcoal;
    cell.alignment = { vertical: 'middle', horizontal: i === 0 ? 'left' : 'right', indent: 1 };
    cell.border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.mergeCells(`B${liR}:E${liR}`);
  sheet.mergeCells(`H${liR}:I${liR}`);
  sheet.getRow(liR).height = 24;

  // 6 line item rows
  const sampleItems = [
    { desc: 'Storefront sign — install + materials', qty: 1, unitPrice: 1200, tax: 0.08 },
    { desc: 'Design hours @ $85/hr',                 qty: 8, unitPrice:   85, tax: 0    },
    { desc: 'Installation labor',                     qty: 1, unitPrice:  350, tax: 0    },
  ];
  for (let i = 0; i < 6; i++) {
    const ri = liR + 1 + i;
    const item = sampleItems[i];

    sheet.mergeCells(`B${ri}:E${ri}`);
    sheet.getCell(`B${ri}`).value = item ? item.desc : '';
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = item ? item.qty : null;
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = item ? item.unitPrice : null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.mergeCells(`H${ri}:I${ri}`);
    sheet.getCell(`H${ri}`).value = item ? item.tax : null;
    sheet.getCell(`H${ri}`).numFmt = '0.00%';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(F${ri}*G${ri}*(1+H${ri}),0)` };
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
  }

  // Totals block
  const totR = liR + 8;
  sheet.mergeCells(`H${totR}:I${totR}`);
  sheet.getCell(`H${totR}`).value = 'Subtotal';
  sheet.getCell(`H${totR}`).font = FONTS.body;
  sheet.getCell(`H${totR}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`J${totR}`).value = { formula: `SUMPRODUCT(F${liR + 1}:F${liR + 6},G${liR + 1}:G${liR + 6})` };
  sheet.getCell(`J${totR}`).numFmt = '"$"#,##0.00';
  sheet.getCell(`J${totR}`).font = FONTS.body;
  sheet.getCell(`J${totR}`).alignment = { horizontal: 'right' };

  sheet.mergeCells(`H${totR + 1}:I${totR + 1}`);
  sheet.getCell(`H${totR + 1}`).value = 'Tax';
  sheet.getCell(`H${totR + 1}`).font = FONTS.body;
  sheet.getCell(`H${totR + 1}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`J${totR + 1}`).value = { formula: `SUM(J${liR + 1}:J${liR + 6})-J${totR}` };
  sheet.getCell(`J${totR + 1}`).numFmt = '"$"#,##0.00';
  sheet.getCell(`J${totR + 1}`).font = FONTS.body;
  sheet.getCell(`J${totR + 1}`).alignment = { horizontal: 'right' };

  sheet.mergeCells(`H${totR + 2}:I${totR + 2}`);
  sheet.getCell(`H${totR + 2}`).value = 'TOTAL DUE';
  sheet.getCell(`H${totR + 2}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`H${totR + 2}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`H${totR + 2}`).fill = FILLS.charcoal;
  sheet.getCell(`J${totR + 2}`).value = { formula: `SUM(J${liR + 1}:J${liR + 6})` };
  sheet.getCell(`J${totR + 2}`).numFmt = '"$"#,##0.00';
  sheet.getCell(`J${totR + 2}`).font = { ...FONTS.bodyBold, color: argb(COLORS.white), size: 14 };
  sheet.getCell(`J${totR + 2}`).alignment = { horizontal: 'right' };
  sheet.getCell(`J${totR + 2}`).fill = FILLS.charcoal;
  sheet.getRow(totR + 2).height = 28;

  // Payment terms callout
  const ptR = totR + 5;
  addCallout(sheet, `B${ptR}:J${ptR + 1}`,
    '📌',
    'Payment terms',
    `Net-30 from invoice date. Late fee 1.5% per month on overdue balances. Wire / ACH / Check accepted. Bank details: [Your bank name · Routing # · Account #]. Reference invoice # on payment. Questions? Reply to this email.`);
  sheet.getRow(ptR).height = 28;
  sheet.getRow(ptR + 1).height = 28;

  // Template variants reference
  let varR = ptR + 4;
  addSectionHeader(sheet, varR, 'Other template variants', `Duplicate this sheet and modify. ${tier === 'essentials' ? '5 variants in Essentials' : '10 variants in Pro+'}.`);

  const variants = tier === 'essentials'
    ? ['Standard', 'Hourly Service', 'Subscription', 'Wholesale', 'Retail']
    : ['Standard', 'Hourly Service', 'Subscription', 'Wholesale', 'Retail', 'International (multi-currency)', 'Construction (deposit + balance)', 'Recurring monthly', 'Custom 1', 'Custom 2'];

  variants.forEach((v, i) => {
    const ri = varR + 3 + Math.floor(i / 2);
    const col = i % 2 === 0 ? 'B' : 'F';
    const endCol = i % 2 === 0 ? 'E' : 'J';
    sheet.mergeCells(`${col}${ri}:${endCol}${ri}`);
    sheet.getCell(`${col}${ri}`).value = `${i + 1}. ${v}`;
    sheet.getCell(`${col}${ri}`).font = FONTS.body;
    sheet.getCell(`${col}${ri}`).fill = FILLS.white;
    sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
    sheet.getRow(ri).height = 22;
  });

  addFooter(sheet, varR + 12, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 9 — 📅 RECURRING INVOICE SCHEDULE (Pro+)
// ============================================================================

function buildRecurringInvoiceSchedule(workbook) {
  const sheet = workbook.addWorksheet('📅 Recurring Invoice Schedule');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 22, D: 14, E: 14, F: 14, G: 14, H: 22, I: 2, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📅 Recurring Invoice Schedule',
    tabSubtitle: 'Set once. Generate each cycle. Tracks frequency, next-generate date, last-sent.',
    bannerText: BANNER,
    kpiData: [
      { label: 'ACTIVE RECURRING', value: { formula: `COUNTIF(F11:F30,"Active")` } },
      { label: 'MONTHLY RECURRING $', value: { formula: `TEXT(SUMIFS(D11:D30,F11:F30,"Active",E11:E30,"Monthly"),"$#,##0")` } },
      { label: 'NEXT 7 DAYS DUE',  value: { formula: `COUNTIFS(G11:G30,">="&TODAY(),G11:G30,"<="&TODAY()+7,F11:F30,"Active")` } },
      { label: 'OVERDUE TO SEND',  value: { formula: `COUNTIFS(G11:G30,"<"&TODAY(),F11:F30,"Active")` } },
      { label: 'CLIENTS',          value: { formula: `IFERROR(SUMPRODUCT((C11:C30<>"")/COUNTIF(C11:C30,C11:C30&"")),0)` } },
      { label: 'ANNUAL $',         value: { formula: `TEXT(SUMPRODUCT(D11:D30*IF(E11:E30="Monthly",12,IF(E11:E30="Quarterly",4,1))*(F11:F30="Active")),"$#,##0")` } },
    ],
  });

  // Header
  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const headers = ['Template', 'Client', 'Amount $', 'Frequency', 'Status', 'Next Generate', 'Notes'];
  cols.forEach((col, i) => {
    const cell = sheet.getCell(`${col}10`);
    cell.value = headers[i];
    cell.font = FONTS.headerWhite;
    cell.fill = FILLS.charcoal;
    cell.alignment = { vertical: 'middle', horizontal: i === 2 ? 'right' : 'left', indent: 1 };
    cell.border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(10).height = 24;

  // Seed 5 recurring schedules
  const seedRecurring = [
    { tpl: 'Subscription — Monthly retainer',  client: 'Acme Realty',     amount: 1800, freq: 'Monthly',   status: 'Active', next: '2026-06-01', notes: 'Preferred-vendor 18-mo contract' },
    { tpl: 'Hourly — Maintenance retainer',    client: 'Beechwood Cafe',  amount:  400, freq: 'Monthly',   status: 'Active', next: '2026-06-05', notes: '4-hr/mo maintenance cap' },
    { tpl: 'Subscription — Quarterly refresh', client: 'Riverdale Spa',   amount: 1200, freq: 'Quarterly', status: 'Active', next: '2026-07-15', notes: 'Window decals + outdoor signage' },
    { tpl: 'Custom — Annual',                  client: 'Mr. Hardware',    amount: 2400, freq: 'Annual',    status: 'Active', next: '2027-02-01', notes: 'Annual signage refresh contract' },
    { tpl: 'Wholesale — Monthly',              client: 'Sunset Realty',   amount:  900, freq: 'Monthly',   status: 'Paused', next: '',           notes: 'Paused mid-Apr per client request' },
  ];

  for (let i = 0; i < 20; i++) {
    const ri = 11 + i;
    const row = seedRecurring[i];

    if (row) sheet.getCell(`B${ri}`).value = row.tpl;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`C${ri}`).value = row.client;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`D${ri}`).value = row.amount;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`E${ri}`).value = row.freq;
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).dataValidation = { type: 'list', formulae: ['"Monthly,Quarterly,Annual,Semi-Annual"'], allowBlank: true };

    if (row) sheet.getCell(`F${ri}`).value = row.status;
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).dataValidation = { type: 'list', formulae: ['"Active,Paused,Cancelled"'], allowBlank: true };

    if (row && row.next) sheet.getCell(`G${ri}`).value = new Date(row.next);
    sheet.getCell(`G${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`H${ri}`).value = row.notes;
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  }

  // CF on status
  sheet.addConditionalFormatting({
    ref: `F11:F30`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Active',    priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Paused',    priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Cancelled', priority: 3, style: { font: { color: argb(COLORS.textMuted), italic: true } } },
    ],
  });

  // CF: highlight overdue next-generate dates
  sheet.addConditionalFormatting({
    ref: `G11:G30`,
    rules: [{
      type: 'expression',
      formulae: [`AND($G11<>"",$G11<TODAY(),$F11="Active")`],
      priority: 1,
      style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } },
    }],
  });

  addFooter(sheet, 34, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 10 — ⏳ RECEIVABLES AGING (Pro+)
// ============================================================================

function buildReceivablesAging(workbook) {
  const sheet = workbook.addWorksheet('⏳ Receivables Aging');
  setTabColor(sheet, COLORS.warning);
  setupColumns(sheet, { A: 2, B: 24, C: 14, D: 14, E: 14, F: 14, G: 14, H: 20, I: 2, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '⏳ Receivables Aging',
    tabSubtitle: 'Customer × aging bucket matrix. 0–30 / 31–60 / 61–90 / 90+ days outstanding.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL AR',         value: { formula: `TEXT(SUM(C12:F31),"$#,##0")` } },
      { label: '0–30 DAYS',        value: { formula: `TEXT(SUM(C12:C31),"$#,##0")` } },
      { label: '31–60 DAYS',       value: { formula: `TEXT(SUM(D12:D31),"$#,##0")` } },
      { label: '61–90 DAYS',       value: { formula: `TEXT(SUM(E12:E31),"$#,##0")` } },
      { label: '90+ DAYS',         value: { formula: `TEXT(SUM(F12:F31),"$#,##0")` } },
      { label: 'DSO (DAYS)',       value: { formula: `IFERROR(TEXT(SUMPRODUCT(C12:F31,{15;45;75;110})/MAX(1,SUM(C12:F31)),"0")&" days","—")` } },
    ],
  });

  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const headers = ['Customer', '0–30 days', '31–60 days', '61–90 days', '90+ days', 'Total', 'Notes'];
  cols.forEach((col, i) => {
    sheet.getCell(`${col}11`).value = headers[i];
    sheet.getCell(`${col}11`).font = FONTS.headerWhite;
    sheet.getCell(`${col}11`).fill = FILLS.charcoal;
    sheet.getCell(`${col}11`).alignment = { vertical: 'middle', horizontal: i === 0 || i === 6 ? 'left' : 'right', indent: 1 };
    sheet.getCell(`${col}11`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(11).height = 24;

  // Seed 4 customers
  const seedAR = [
    { client: 'Downtown Auto',  b30: 0,    b60: 0,    b90: 1420, b90plus: 0,    note: 'Chronically slow' },
    { client: 'Riverdale Spa',  b30: 1980, b60: 0,    b90: 0,    b90plus: 0,    note: 'Reliable' },
    { client: 'Mr. Hardware',   b30: 620,  b60: 0,    b90: 0,    b90plus: 0,    note: '' },
    { client: 'Sunset Realty',  b30: 0,    b60: 0,    b90: 0,    b90plus: 850,  note: '⚠️ 90+ days — escalate' },
  ];

  for (let i = 0; i < 20; i++) {
    const ri = 12 + i;
    const row = seedAR[i];

    if (row) sheet.getCell(`B${ri}`).value = row.client;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    ['C', 'D', 'E', 'F'].forEach((col, j) => {
      const key = ['b30', 'b60', 'b90', 'b90plus'][j];
      if (row) sheet.getCell(`${col}${ri}`).value = row[key] || null;
      sheet.getCell(`${col}${ri}`).numFmt = '"$"#,##0';
      sheet.getCell(`${col}${ri}`).font = FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${col}${ri}`).fill = FILLS.white;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    });

    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(SUM(C${ri}:F${ri}),0)` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`H${ri}`).value = row.note;
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  }

  // CF on aging buckets
  sheet.addConditionalFormatting({
    ref: `D12:D31`,
    rules: [{ type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 1, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } }],
  });
  sheet.addConditionalFormatting({
    ref: `E12:F31`,
    rules: [{ type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 1, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } }],
  });

  // Bucket totals row
  const tRow = 33;
  sheet.getCell(`B${tRow}`).value = 'BUCKET TOTAL';
  sheet.getCell(`B${tRow}`).font = FONTS.smallCaps;
  sheet.getCell(`B${tRow}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`B${tRow}`).border = { top: { style: 'medium', color: argb(COLORS.charcoal) } };
  ['C', 'D', 'E', 'F', 'G'].forEach((col) => {
    sheet.getCell(`${col}${tRow}`).value = { formula: `SUM(${col}12:${col}31)` };
    sheet.getCell(`${col}${tRow}`).numFmt = '"$"#,##0';
    sheet.getCell(`${col}${tRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.charcoal) };
    sheet.getCell(`${col}${tRow}`).alignment = { horizontal: 'right' };
    sheet.getCell(`${col}${tRow}`).border = { top: { style: 'medium', color: argb(COLORS.charcoal) } };
  });

  // Aged-over-60 callout
  sheet.mergeCells(`B${tRow + 3}:H${tRow + 4}`);
  const calloutCell = sheet.getCell(`B${tRow + 3}`);
  calloutCell.value = { formula: `IF((SUM(E12:E31)+SUM(F12:F31))>0,"⚠️ Aged-over-60 alert: $"&TEXT(SUM(E12:E31)+SUM(F12:F31),"#,##0")&" outstanding > 60 days. Escalate collections.","✓ No receivables aged over 60 days.")` };
  calloutCell.font = FONTS.bodyBold;
  calloutCell.alignment = { horizontal: 'center', vertical: 'middle' };
  calloutCell.fill = FILLS.ivory;
  calloutCell.border = BORDER_THIN();
  sheet.getRow(tRow + 3).height = 24;
  sheet.getRow(tRow + 4).height = 24;

  sheet.addConditionalFormatting({
    ref: `B${tRow + 3}:H${tRow + 4}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'alert', priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'No',    priority: 2, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addFooter(sheet, tRow + 8, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 11 — ⏳ PAYABLES AGING (Pro+)
// ============================================================================

function buildPayablesAging(workbook) {
  const sheet = workbook.addWorksheet('⏳ Payables Aging');
  setTabColor(sheet, COLORS.warning);
  setupColumns(sheet, { A: 2, B: 24, C: 14, D: 14, E: 14, F: 14, G: 14, H: 22, I: 2, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '⏳ Payables Aging',
    tabSubtitle: 'Supplier × aging bucket matrix. Early-pay discount column shows savings if paid by date.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL AP',          value: { formula: `TEXT(SUM(C12:F31),"$#,##0")` } },
      { label: 'DUE THIS WEEK',     value: { formula: `TEXT(SUM(C12:C31),"$#,##0")` } },
      { label: 'EARLY-PAY SAVINGS', value: { formula: `TEXT(SUM(G12:G31),"$#,##0")` } },
      { label: '31–60',             value: { formula: `TEXT(SUM(D12:D31),"$#,##0")` } },
      { label: '61–90',             value: { formula: `TEXT(SUM(E12:E31),"$#,##0")` } },
      { label: '90+ (RISK)',        value: { formula: `TEXT(SUM(F12:F31),"$#,##0")` } },
    ],
  });

  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const headers = ['Supplier', '0–30 days', '31–60', '61–90', '90+', 'Early-Pay $ Save', 'Notes'];
  cols.forEach((col, i) => {
    sheet.getCell(`${col}11`).value = headers[i];
    sheet.getCell(`${col}11`).font = FONTS.headerWhite;
    sheet.getCell(`${col}11`).fill = FILLS.charcoal;
    sheet.getCell(`${col}11`).alignment = { vertical: 'middle', horizontal: i === 0 || i === 6 ? 'left' : 'right', indent: 1 };
    sheet.getCell(`${col}11`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(11).height = 24;

  // Seed 4 suppliers
  const seedAP = [
    { vend: 'Acme Corrugated',     b30: 1840, b60: 0,   b90: 0,   b90plus: 0, save: 36,  note: '2/10 net-30 — pay by 5/22 saves $36' },
    { vend: 'Adobe (Software)',    b30: 55,   b60: 0,   b90: 0,   b90plus: 0, save: 0,   note: 'Monthly' },
    { vend: 'United Airlines',     b30: 386,  b60: 0,   b90: 0,   b90plus: 0, save: 0,   note: 'Travel' },
    { vend: 'Subcontractor #3',    b30: 0,    b60: 1200,b90: 0,   b90plus: 0, save: 0,   note: 'Escalate — pay soon' },
  ];

  for (let i = 0; i < 20; i++) {
    const ri = 12 + i;
    const row = seedAP[i];

    if (row) sheet.getCell(`B${ri}`).value = row.vend;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    ['C', 'D', 'E', 'F'].forEach((col, j) => {
      const key = ['b30', 'b60', 'b90', 'b90plus'][j];
      if (row) sheet.getCell(`${col}${ri}`).value = row[key] || null;
      sheet.getCell(`${col}${ri}`).numFmt = '"$"#,##0';
      sheet.getCell(`${col}${ri}`).font = FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${col}${ri}`).fill = FILLS.white;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    });

    if (row) sheet.getCell(`G${ri}`).value = row.save || null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`H${ri}`).value = row.note;
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  }

  sheet.addConditionalFormatting({
    ref: `D12:D31`,
    rules: [{ type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 1, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } }],
  });
  sheet.addConditionalFormatting({
    ref: `E12:F31`,
    rules: [{ type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 1, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } }],
  });

  addFooter(sheet, 36, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 12 — 📊 CUSTOMER PROFITABILITY (Pro+)
// ============================================================================

function buildCustomerProfitability(workbook) {
  const sheet = workbook.addWorksheet('📊 Customer Profitability');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 22, I: 2, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📊 Customer Profitability',
    tabSubtitle: 'Top 10 customers by gross-margin contribution. "Fire client" pill on negative-margin.',
    bannerText: BANNER,
    kpiData: [
      { label: 'CUSTOMERS', value: { formula: `IFERROR(SUMPRODUCT((B12:B21<>"")/COUNTIF(B12:B21,B12:B21&"")),0)` } },
      { label: 'BEST GP %', value: { formula: `IFERROR(TEXT(MAX(F12:F21),"0.0%"),"—")` } },
      { label: 'WORST GP %',value: { formula: `IFERROR(TEXT(MIN(F12:F21),"0.0%"),"—")` } },
      { label: 'TOTAL REV', value: { formula: `TEXT(SUM(C12:C21),"$#,##0")` } },
      { label: 'TOTAL GP',  value: { formula: `TEXT(SUM(E12:E21),"$#,##0")` } },
      { label: 'AVG GP %',  value: { formula: `IFERROR(TEXT(SUM(E12:E21)/SUM(C12:C21),"0.0%"),"—")` } },
    ],
  });

  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const headers = ['Customer', 'Revenue', 'COGS', 'Gross Profit', 'GP %', 'Pill', 'Action'];
  cols.forEach((col, i) => {
    sheet.getCell(`${col}11`).value = headers[i];
    sheet.getCell(`${col}11`).font = FONTS.headerWhite;
    sheet.getCell(`${col}11`).fill = FILLS.charcoal;
    sheet.getCell(`${col}11`).alignment = { vertical: 'middle', horizontal: i === 0 || i === 5 || i === 6 ? 'left' : 'right', indent: 1 };
    sheet.getCell(`${col}11`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(11).height = 24;

  // Top-10 customers — pulled by formula from Revenue Tracker
  for (let i = 0; i < 10; i++) {
    const ri = 12 + i;

    sheet.getCell(`B${ri}`).value = { formula:
      `IFERROR(INDEX('💵 Revenue Tracker'!D12:D111,MATCH(LARGE(IFERROR(SUMIF('💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!F12:F111)/COUNTIF('💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!D12:D111),0),${i + 1}),IFERROR(SUMIF('💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!F12:F111)/COUNTIF('💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!D12:D111),0),0)),"")` };
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = { formula: `IFERROR(SUMIF('💵 Revenue Tracker'!D12:D111,B${ri},'💵 Revenue Tracker'!F12:F111),0)` };
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    // COGS estimate — per-customer COGS isn't tracked at row level, so we apportion blended COGS
    sheet.getCell(`D${ri}`).value = { formula: `IFERROR(C${ri}*SUMIF('💸 Expense Tracker'!I12:I161,"COGS",'💸 Expense Tracker'!F12:F161)/SUM('💵 Revenue Tracker'!F12:F111),0)` };
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = { formula: `IFERROR(C${ri}-D${ri},0)` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(E${ri}/C${ri},0)` };
    sheet.getCell(`F${ri}`).numFmt = '0.0%';
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IF(B${ri}="","",IF(F${ri}<0,"🔥 Fire",IF(F${ri}<0.1,"⚠ Low",IF(F${ri}>=0.25,"🌟 Star","✓ OK"))))` };
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IF(B${ri}="","",IF(F${ri}<0,"Renegotiate or drop",IF(F${ri}<0.1,"Raise prices",IF(F${ri}>=0.25,"Grow this account","Maintain"))))` };
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  }

  // CF on pill
  sheet.addConditionalFormatting({
    ref: `G12:G21`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Fire',  priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Low',   priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Star',  priority: 3, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'OK',    priority: 4, style: { fill: FILLS.ivory } },
    ],
  });

  addFooter(sheet, 26, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 13 — 📦 INVENTORY TRACKER (Pro+)
// ============================================================================

function buildInventoryTracker(workbook) {
  const sheet = workbook.addWorksheet('📦 Inventory Tracker');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 14, C: 22, D: 10, E: 10, F: 12, G: 12, H: 12, I: 14, J: 18, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📦 Inventory Tracker',
    tabSubtitle: 'SKU-level stock + unit economics. Low-stock alerts fire when units ≤ reorder point.',
    bannerText: BANNER,
    kpiData: [
      { label: 'SKUS',         value: { formula: `COUNTA(B12:B61)` } },
      { label: 'TOTAL UNITS',  value: { formula: `SUM(D12:D61)` } },
      { label: 'INV VALUE',    value: { formula: `TEXT(SUMPRODUCT(D12:D61,F12:F61),"$#,##0")` } },
      { label: 'RETAIL VALUE', value: { formula: `TEXT(SUMPRODUCT(D12:D61,G12:G61),"$#,##0")` } },
      { label: 'LOW STOCK',    value: { formula: `COUNTIF(I12:I61,"⚠ Low")` } },
      { label: 'OUT OF STOCK', value: { formula: `COUNTIF(I12:I61,"🔴 Out")` } },
    ],
  });

  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const headers = ['SKU', 'Product', 'Units', 'Reorder', 'Unit Cost', 'Retail $', 'Margin %', 'Status', 'Last Restocked'];
  cols.forEach((col, i) => {
    sheet.getCell(`${col}11`).value = headers[i];
    sheet.getCell(`${col}11`).font = FONTS.headerWhite;
    sheet.getCell(`${col}11`).fill = FILLS.charcoal;
    sheet.getCell(`${col}11`).alignment = { vertical: 'middle', horizontal: i >= 2 && i <= 6 ? 'right' : 'left', indent: 1 };
    sheet.getCell(`${col}11`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(11).height = 24;

  const seedInv = [
    { sku: 'SIGN-STD',    prod: 'Standard storefront sign',   units: 4,   reorder: 2,  cost: 260, retail: 520,  lastRestock: '2026-04-12' },
    { sku: 'SIGN-PREM',   prod: 'Premium illuminated sign',   units: 2,   reorder: 1,  cost: 720, retail: 1800, lastRestock: '2026-04-08' },
    { sku: 'DECAL-SM',    prod: 'Window decal — small',       units: 48,  reorder: 20, cost:  12, retail:   85, lastRestock: '2026-05-01' },
    { sku: 'AFRAME',      prod: 'A-frame sandwich board',     units: 1,   reorder: 3,  cost:  88, retail:  175, lastRestock: '2026-03-22' },
    { sku: 'VINYL-RL',    prod: 'Vinyl wrap roll (per ft)',   units: 120, reorder: 50, cost:   4, retail:   12, lastRestock: '2026-05-10' },
  ];

  for (let i = 0; i < 50; i++) {
    const ri = 12 + i;
    const row = seedInv[i];

    if (row) sheet.getCell(`B${ri}`).value = row.sku;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`C${ri}`).value = row.prod;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`D${ri}`).value = row.units;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`E${ri}`).value = row.reorder;
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`F${ri}`).value = row.cost;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`G${ri}`).value = row.retail;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR((G${ri}-F${ri})/G${ri},0)` };
    sheet.getCell(`H${ri}`).numFmt = '0.0%';
    sheet.getCell(`H${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = { formula: `IF(B${ri}="","",IF(D${ri}<=0,"🔴 Out",IF(D${ri}<=E${ri},"⚠ Low","✓ OK")))` };
    sheet.getCell(`I${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    if (row && row.lastRestock) sheet.getCell(`J${ri}`).value = new Date(row.lastRestock);
    sheet.getCell(`J${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`J${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
  }

  sheet.addConditionalFormatting({
    ref: `I12:I61`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Out',  priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Low',  priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'OK',   priority: 3, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addFooter(sheet, 66, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 14 — 🏭 SUPPLIER & PO MANAGER (Pro+)
// ============================================================================

function buildSupplierPOManager(workbook) {
  const sheet = workbook.addWorksheet('🏭 Supplier & PO Manager');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 14, C: 22, D: 13, E: 13, F: 13, G: 13, H: 13, I: 22, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏭 Supplier & PO Manager',
    tabSubtitle: 'Track POs across the lifecycle (Raised → Shipped → Received → Paid).',
    bannerText: BANNER,
    kpiData: [
      { label: 'OPEN POs',     value: { formula: `COUNTIFS(H11:H40,"<>Paid",H11:H40,"<>Cancelled")` } },
      { label: 'TOTAL VALUE',  value: { formula: `TEXT(SUM(G11:G40),"$#,##0")` } },
      { label: 'PAID YTD',     value: { formula: `TEXT(SUMIF(H11:H40,"Paid",G11:G40),"$#,##0")` } },
      { label: 'SUPPLIERS',    value: { formula: `IFERROR(SUMPRODUCT((C11:C40<>"")/COUNTIF(C11:C40,C11:C40&"")),0)` } },
      { label: 'AWAITING',     value: { formula: `COUNTIF(H11:H40,"Raised")+COUNTIF(H11:H40,"Shipped")` } },
      { label: 'AVG PO',       value: { formula: `IFERROR(TEXT(AVERAGE(G11:G40),"$#,##0"),"—")` } },
    ],
  });

  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const headers = ['PO #', 'Supplier', 'Issued', 'Expected', 'Received', 'Total $', 'Status', 'Notes'];
  cols.forEach((col, i) => {
    sheet.getCell(`${col}10`).value = headers[i];
    sheet.getCell(`${col}10`).font = FONTS.headerWhite;
    sheet.getCell(`${col}10`).fill = FILLS.charcoal;
    sheet.getCell(`${col}10`).alignment = { vertical: 'middle', horizontal: i === 5 ? 'right' : 'left', indent: 1 };
    sheet.getCell(`${col}10`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(10).height = 24;

  const seedPO = [
    { po: 'PO-0241', supp: 'Acme Corrugated',    iss: '2026-05-01', exp: '2026-05-08', rec: '2026-05-07', total: 1840, status: 'Paid' },
    { po: 'PO-0242', supp: 'Vinyl Pro Inc.',     iss: '2026-05-08', exp: '2026-05-15', rec: '2026-05-14', total:  680, status: 'Received' },
    { po: 'PO-0243', supp: 'Acme Corrugated',    iss: '2026-05-15', exp: '2026-05-22', rec: '',           total: 1240, status: 'Shipped' },
    { po: 'PO-0244', supp: 'LED Bright',         iss: '2026-05-18', exp: '2026-05-28', rec: '',           total: 2400, status: 'Raised' },
    { po: 'PO-0245', supp: 'Subcontractor #3',   iss: '2026-04-22', exp: '2026-05-05', rec: '2026-05-04', total: 1200, status: 'Received' },
  ];

  for (let i = 0; i < 30; i++) {
    const ri = 11 + i;
    const row = seedPO[i];

    if (row) sheet.getCell(`B${ri}`).value = row.po;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`C${ri}`).value = row.supp;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    ['D', 'E', 'F'].forEach((col, j) => {
      const key = ['iss', 'exp', 'rec'][j];
      if (row && row[key]) sheet.getCell(`${col}${ri}`).value = new Date(row[key]);
      sheet.getCell(`${col}${ri}`).numFmt = 'mmm d, yyyy';
      sheet.getCell(`${col}${ri}`).font = FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'center' };
      sheet.getCell(`${col}${ri}`).fill = FILLS.white;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    });

    if (row) sheet.getCell(`G${ri}`).value = row.total;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`H${ri}`).value = row.status;
    sheet.getCell(`H${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
    sheet.getCell(`H${ri}`).dataValidation = { type: 'list', formulae: ['"Raised,Shipped,Received,Paid,Cancelled"'], allowBlank: true };

    sheet.getCell(`I${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
  }

  sheet.addConditionalFormatting({
    ref: `H11:H40`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Paid',      priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Received',  priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Shipped',   priority: 3, style: { fill: FILLS.ivory } },
      { type: 'containsText', operator: 'containsText', text: 'Raised',    priority: 4, style: { fill: FILLS.white } },
      { type: 'containsText', operator: 'containsText', text: 'Cancelled', priority: 5, style: { font: { color: argb(COLORS.textMuted), italic: true } } },
    ],
  });

  addFooter(sheet, 44, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 15 — 🏗️ ASSET DEPRECIATION (Pro+)
// ============================================================================

function buildAssetDepreciation(workbook) {
  const sheet = workbook.addWorksheet('🏗️ Asset Depreciation');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 13, D: 13, E: 14, F: 14, G: 12, H: 12, I: 14, J: 14, K: 14, L: 18, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏗️ Asset Depreciation',
    tabSubtitle: 'Straight-line + declining-balance. Annual depreciation feeds P&L Opex.',
    bannerText: BANNER,
    kpiData: [
      { label: 'ASSETS',          value: { formula: `COUNTA(B12:B26)` } },
      { label: 'GROSS COST',      value: { formula: `TEXT(SUM(F12:F26),"$#,##0")` } },
      { label: 'ANNUAL DEPR',     value: { formula: `TEXT(SUM(I12:I26),"$#,##0")` } },
      { label: 'ACCUM DEPR',      value: { formula: `TEXT(SUM(J12:J26),"$#,##0")` } },
      { label: 'BOOK VALUE',      value: { formula: `TEXT(SUM(F12:F26)-SUM(J12:J26),"$#,##0")` } },
      { label: 'OLDEST',          value: { formula: `IFERROR(TEXT(MIN(D12:D26),"mmm yyyy"),"—")` } },
    ],
  });

  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const headers = ['Asset', 'Class', 'Purchase Date', 'Useful Life (yr)', 'Cost $', 'Method', 'Salvage $', 'Annual Depr', 'Accum Depr', 'Book Value', 'Notes'];
  cols.forEach((col, i) => {
    sheet.getCell(`${col}11`).value = headers[i];
    sheet.getCell(`${col}11`).font = FONTS.headerWhite;
    sheet.getCell(`${col}11`).fill = FILLS.charcoal;
    sheet.getCell(`${col}11`).alignment = { vertical: 'middle', horizontal: i >= 3 && i <= 9 ? 'right' : 'left', indent: 1 };
    sheet.getCell(`${col}11`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(11).height = 24;

  const seedAssets = [
    { asset: 'Laptop — MacBook Pro 16',   cls: 'Equipment', date: '2024-03-15', life: 5,    cost:  2800, method: 'MACRS',          salvage:    0, notes: '5-yr MACRS' },
    { asset: 'Office desk + chair',        cls: 'Furniture', date: '2025-01-10', life: 7,    cost:  1800, method: 'De minimis',     salvage:    0, notes: 'Expensed under $2,500' },
    { asset: 'Pickup truck (75% biz)',     cls: 'Vehicle',   date: '2024-07-22', life: 5,    cost: 42000, method: 'Bonus + MACRS',  salvage: 4000, notes: '75% business use' },
    { asset: 'CNC machine',                cls: 'Equipment', date: '2026-09-15', life: 7,    cost: 58000, method: 'Section 179',    salvage: 5000, notes: 'Verify §179 income limit' },
    { asset: 'Trade show booth + signage', cls: 'Furniture', date: '2025-06-01', life: 7,    cost:  4200, method: 'Straight-line',  salvage:  400, notes: '' },
  ];

  for (let i = 0; i < 15; i++) {
    const ri = 12 + i;
    const row = seedAssets[i];

    if (row) sheet.getCell(`B${ri}`).value = row.asset;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`C${ri}`).value = row.cls;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: ['"Vehicle,Equipment,Furniture,Software,Building,Real Estate,Other"'], allowBlank: true };

    if (row) sheet.getCell(`D${ri}`).value = new Date(row.date);
    sheet.getCell(`D${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`E${ri}`).value = row.life;
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`F${ri}`).value = row.cost;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`G${ri}`).value = row.method;
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).dataValidation = { type: 'list', formulae: ['"Straight-line,MACRS,Section 179,Bonus + MACRS,Declining-balance,De minimis"'], allowBlank: true };

    if (row) sheet.getCell(`H${ri}`).value = row.salvage;
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    // Annual depreciation — straight-line: (cost - salvage) / life
    // (Method nuances explained in the AI PDF Depreciation Assistant prompt; this is the
    //  general straight-line approximation. Buyer adjusts for MACRS/§179 in real returns.)
    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(IF(G${ri}="De minimis",0,IF(G${ri}="Section 179",F${ri},(F${ri}-H${ri})/MAX(1,E${ri}))),0)` };
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    // Accumulated depreciation — years since purchase × annual, capped at cost − salvage
    sheet.getCell(`J${ri}`).value = { formula: `IFERROR(MIN(F${ri}-H${ri},I${ri}*MAX(0,(TODAY()-D${ri})/365.25)),0)` };
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    // Book value
    sheet.getCell(`K${ri}`).value = { formula: `IFERROR(F${ri}-J${ri},0)` };
    sheet.getCell(`K${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`K${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`K${ri}`).fill = FILLS.white;
    sheet.getCell(`K${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`L${ri}`).value = row.notes;
    sheet.getCell(`L${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`L${ri}`).fill = FILLS.white;
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B28:L29`,
    '⚠️',
    'Depreciation method matters — verify with your CPA',
    'This tab uses straight-line as the default approximation. MACRS, Section 179, and Bonus depreciation produce different year-1 numbers (often dramatically). The AI Business Co-Pilot Depreciation Assistant prompt (page 5) audits each asset against IRS class life + business-income limit before filing.');
  sheet.getRow(28).height = 28;
  sheet.getRow(29).height = 28;

  addFooter(sheet, 33, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 16 — 💰 LOAN AMORTIZATION (Pro+)
// ============================================================================

function buildLoanAmortization(workbook) {
  const sheet = workbook.addWorksheet('💰 Loan Amortization');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 13, D: 12, E: 14, F: 12, G: 14, H: 14, I: 14, J: 18, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💰 Loan Amortization',
    tabSubtitle: 'Up to 5 loans. Monthly payment + remaining balance + total interest paid.',
    bannerText: BANNER,
    kpiData: [
      { label: 'LOANS',          value: { formula: `COUNTA(B12:B16)` } },
      { label: 'TOTAL BORROWED', value: { formula: `TEXT(SUM(E12:E16),"$#,##0")` } },
      { label: 'TOTAL OUTSTANDING', value: { formula: `TEXT(SUM(H12:H16),"$#,##0")` } },
      { label: 'MONTHLY PAYMENT',value: { formula: `TEXT(SUM(G12:G16),"$#,##0")` } },
      { label: 'YR-1 INTEREST',  value: { formula: `TEXT(SUMPRODUCT(E12:E16,D12:D16),"$#,##0")` } },
      { label: 'WEIGHTED APR',   value: { formula: `IFERROR(TEXT(SUMPRODUCT(E12:E16,D12:D16)/MAX(1,SUM(E12:E16)),"0.00%"),"—")` } },
    ],
  });

  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const headers = ['Loan', 'Origin Date', 'APR %', 'Original $', 'Term (mo)', 'Monthly Payment', 'Outstanding $', 'Payoff Date', 'Notes'];
  cols.forEach((col, i) => {
    sheet.getCell(`${col}11`).value = headers[i];
    sheet.getCell(`${col}11`).font = FONTS.headerWhite;
    sheet.getCell(`${col}11`).fill = FILLS.charcoal;
    sheet.getCell(`${col}11`).alignment = { vertical: 'middle', horizontal: i >= 2 && i <= 7 ? 'right' : 'left', indent: 1 };
    sheet.getCell(`${col}11`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(11).height = 24;

  const seedLoans = [
    { loan: 'SBA loan — equipment',   origin: '2024-09-01', apr: 0.075, orig:  85000, term: 84, notes: 'CNC + truck purchase' },
    { loan: 'Line of credit — working capital', origin: '2025-04-15', apr: 0.110, orig: 25000, term: 36, notes: 'Drawn down $12K' },
    { loan: 'Vehicle loan — pickup',  origin: '2024-07-22', apr: 0.065, orig:  31500, term: 60, notes: '75% biz-use treatment' },
  ];

  for (let i = 0; i < 5; i++) {
    const ri = 12 + i;
    const row = seedLoans[i];

    if (row) sheet.getCell(`B${ri}`).value = row.loan;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`C${ri}`).value = new Date(row.origin);
    sheet.getCell(`C${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`D${ri}`).value = row.apr;
    sheet.getCell(`D${ri}`).numFmt = '0.00%';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).dataValidation = {
      type: 'decimal', operator: 'between', formulae: [0, 0.99], allowBlank: true,
      showErrorMessage: true, errorStyle: 'stop',
      errorTitle: 'APR must be decimal',
      error: 'Enter as decimal. 7.5% APR = 0.075. 11% APR = 0.11.',
      showInputMessage: true, promptTitle: 'APR — decimal please',
      prompt: 'Enter the loan APR as a decimal: 7.5% = 0.075.',
    };

    if (row) sheet.getCell(`E${ri}`).value = row.orig;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`F${ri}`).value = row.term;
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // Monthly payment — standard PMT formula: P * (r * (1+r)^n) / ((1+r)^n - 1)
    // Guard against zero APR (interest-free → P/n) and zero term.
    sheet.getCell(`G${ri}`).value = { formula:
      `IFERROR(IF(OR(E${ri}=0,F${ri}=0),0,` +
      `IF(D${ri}=0,E${ri}/F${ri},` +
      `E${ri}*(D${ri}/12)*POWER(1+D${ri}/12,F${ri})/(POWER(1+D${ri}/12,F${ri})-1))),0)` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    // Outstanding balance — closed-form remaining-balance using months elapsed
    sheet.getCell(`H${ri}`).value = { formula:
      `IFERROR(IF(OR(E${ri}=0,F${ri}=0),0,` +
      `MAX(0,IF(D${ri}=0,E${ri}-G${ri}*MAX(0,DATEDIF(C${ri},TODAY(),"M")),` +
      `E${ri}*POWER(1+D${ri}/12,MAX(0,DATEDIF(C${ri},TODAY(),"M")))-G${ri}*((POWER(1+D${ri}/12,MAX(0,DATEDIF(C${ri},TODAY(),"M")))-1)/(D${ri}/12))))),0)` };
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    // Payoff date — origin + term months
    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(EDATE(C${ri},F${ri}),"")` };
    sheet.getCell(`I${ri}`).numFmt = 'mmm yyyy';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`J${ri}`).value = row.notes;
    sheet.getCell(`J${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
  }

  addFooter(sheet, 22, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 17 — 👥 HR EMPLOYEE RECORDS (Pro+)
// ============================================================================

function buildHREmployeeRecords(workbook) {
  const sheet = workbook.addWorksheet('👥 HR Employee Records');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 14, C: 22, D: 18, E: 14, F: 14, G: 14, H: 14, I: 18, J: 18, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '👥 HR Employee Records',
    tabSubtitle: 'Up to 10 employees. Reference cells only — DO NOT enter actual SSNs or full bank numbers.',
    bannerText: BANNER,
    kpiData: [
      { label: 'EMPLOYEES',     value: { formula: `COUNTA(C12:C21)` } },
      { label: 'FULL-TIME',     value: { formula: `COUNTIF(F12:F21,"Full-time")` } },
      { label: 'PART-TIME',     value: { formula: `COUNTIF(F12:F21,"Part-time")` } },
      { label: 'CONTRACTORS',   value: { formula: `COUNTIF(F12:F21,"Contractor")` } },
      { label: 'AVG TENURE (Y)',value: { formula: `IFERROR(TEXT(AVERAGE(IFERROR(DATEDIF(E12:E21,TODAY(),"Y"),0)),"0.0"),"—")` } },
      { label: 'TOTAL LEAVE',   value: { formula: `SUM(I12:I21)` } },
    ],
  });

  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const headers = ['ID', 'Name', 'Role', 'Start Date', 'Type', 'Pay Rate', 'Tax Code', 'Leave Days', 'Bank Ref'];
  cols.forEach((col, i) => {
    sheet.getCell(`${col}11`).value = headers[i];
    sheet.getCell(`${col}11`).font = FONTS.headerWhite;
    sheet.getCell(`${col}11`).fill = FILLS.charcoal;
    sheet.getCell(`${col}11`).alignment = { vertical: 'middle', horizontal: i >= 5 && i <= 7 ? 'right' : 'left', indent: 1 };
    sheet.getCell(`${col}11`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(11).height = 24;

  const seedEmployees = [
    { id: 'EMP-001', name: 'Employee #1 (Senior Installer)', role: 'Installer',     start: '2022-08-15', type: 'Full-time', rate: 28,    tax: 'W-4',  leave: 15, bank: 'Chase ••••4242' },
    { id: 'EMP-002', name: 'Employee #2 (Designer)',          role: 'Designer',      start: '2023-11-01', type: 'Full-time', rate: 32,    tax: 'W-4',  leave: 10, bank: 'BofA ••••8891' },
    { id: 'EMP-003', name: 'Employee #3 (PT Apprentice)',     role: 'Apprentice',    start: '2025-06-20', type: 'Part-time', rate: 18,    tax: 'W-4',  leave:  5, bank: 'Wells ••••1027' },
    { id: 'EMP-004', name: 'Contractor #4 (Subcontract)',     role: 'Subcontractor', start: '2024-02-12', type: 'Contractor', rate: 55,   tax: 'W-9',  leave:  0, bank: '1099 — no direct deposit' },
  ];

  for (let i = 0; i < 10; i++) {
    const ri = 12 + i;
    const row = seedEmployees[i];

    if (row) sheet.getCell(`B${ri}`).value = row.id;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`C${ri}`).value = row.name;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`D${ri}`).value = row.role;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`E${ri}`).value = new Date(row.start);
    sheet.getCell(`E${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`F${ri}`).value = row.type;
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).dataValidation = { type: 'list', formulae: ['"Full-time,Part-time,Contractor,Intern"'], allowBlank: true };

    if (row) sheet.getCell(`G${ri}`).value = row.rate;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`H${ri}`).value = row.tax;
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`I${ri}`).value = row.leave;
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`J${ri}`).value = row.bank;
    sheet.getCell(`J${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B23:J24`,
    '🔒',
    'Privacy reminder',
    'Use REFERENCE values in the Bank Ref column (e.g., "Chase ••••4242"). Do NOT paste full account numbers, full SSNs, or driver license numbers into this sheet. Keep sensitive identifiers in your bank portal or a password manager — never in a spreadsheet you may share.');
  sheet.getRow(23).height = 28;
  sheet.getRow(24).height = 28;

  addFooter(sheet, 28, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 18 — 💰 PAYROLL & PAYSLIPS (Pro+)
// ============================================================================

function buildPayrollPayslips(workbook) {
  const sheet = workbook.addWorksheet('💰 Payroll & Payslips');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 12, D: 12, E: 12, F: 12, G: 12, H: 12, I: 12, J: 14, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💰 Payroll & Payslips',
    tabSubtitle: 'Gross → Deductions → Net per employee per pay period. Verify rates against current IRS/state guidance.',
    bannerText: BANNER,
    kpiData: [
      { label: 'PAYROLL PERIOD', value: { formula: `TEXT(TODAY(),"mmm yyyy")` } },
      { label: 'EMPLOYEES PAID', value: { formula: `COUNTA(B12:B21)` } },
      { label: 'TOTAL GROSS',    value: { formula: `TEXT(SUM(D12:D21),"$#,##0")` } },
      { label: 'TOTAL DEDUCT',   value: { formula: `TEXT(SUM(E12:E21)+SUM(F12:F21)+SUM(G12:G21)+SUM(H12:H21),"$#,##0")` } },
      { label: 'TOTAL NET',      value: { formula: `TEXT(SUM(I12:I21),"$#,##0")` } },
      { label: 'EMPLOYER FICA',  value: { formula: `TEXT(SUM(D12:D21)*0.0765,"$#,##0")` } },
    ],
  });

  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const headers = ['Employee', 'Hours', 'Gross $', 'Federal', 'State', 'FICA 7.65%', 'Other', 'Net Pay', 'Notes'];
  cols.forEach((col, i) => {
    sheet.getCell(`${col}11`).value = headers[i];
    sheet.getCell(`${col}11`).font = FONTS.headerWhite;
    sheet.getCell(`${col}11`).fill = FILLS.charcoal;
    sheet.getCell(`${col}11`).alignment = { vertical: 'middle', horizontal: i >= 1 && i <= 7 ? 'right' : 'left', indent: 1 };
    sheet.getCell(`${col}11`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(11).height = 24;

  const seedPayroll = [
    { name: 'Employee #1 (Installer)',   hours: 80,  gross: 2240, fed: 224, st: 112, other: 0 },
    { name: 'Employee #2 (Designer)',    hours: 80,  gross: 2560, fed: 256, st: 128, other: 0 },
    { name: 'Employee #3 (PT Apprent.)', hours: 40,  gross:  720, fed:  72, st:  36, other: 0 },
    { name: 'Contractor #4 (Sub.)',      hours: 24,  gross: 1320, fed:   0, st:   0, other: 0 },
  ];

  for (let i = 0; i < 10; i++) {
    const ri = 12 + i;
    const row = seedPayroll[i];

    if (row) sheet.getCell(`B${ri}`).value = row.name;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`C${ri}`).value = row.hours;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`D${ri}`).value = row.gross;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`E${ri}`).value = row.fed;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`F${ri}`).value = row.st;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // FICA — Social Security 6.2% + Medicare 1.45% = 7.65% (employee portion)
    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(D${ri}*0.0765,0)` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`H${ri}`).value = row.other;
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    // Net = Gross - Federal - State - FICA - Other
    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(D${ri}-E${ri}-F${ri}-G${ri}-H${ri},0)` };
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`I${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    sheet.getCell(`J${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
  }

  // Total row
  sheet.getCell(`B23`).value = 'TOTAL';
  sheet.getCell(`B23`).font = FONTS.smallCaps;
  sheet.getCell(`B23`).alignment = { horizontal: 'right', indent: 1 };
  ['C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach((col) => {
    sheet.getCell(`${col}23`).value = { formula: `SUM(${col}12:${col}21)` };
    sheet.getCell(`${col}23`).numFmt = col === 'C' ? '0' : '"$"#,##0.00';
    sheet.getCell(`${col}23`).font = { ...FONTS.bodyBold, color: argb(COLORS.charcoal) };
    sheet.getCell(`${col}23`).alignment = { horizontal: 'right' };
    sheet.getCell(`${col}23`).border = { top: { style: 'medium', color: argb(COLORS.charcoal) } };
  });

  addCallout(sheet, `B25:J26`,
    '⚠️',
    'Rate disclaimer',
    'FICA 7.65% (employee portion) is the published rate. Federal + State withholding columns are manual — replace with actual W-4 / state withholding calculation for each employee. This kit calculates the math; it does NOT file or remit payroll taxes (use Gusto, Justworks, or your CPA for that).');
  sheet.getRow(25).height = 28;
  sheet.getRow(26).height = 28;

  addFooter(sheet, 30, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 19 — 🌐 SOCIAL SECURITY TRACKER (Pro+)
// ============================================================================

function buildSocialSecurityTracker(workbook) {
  const sheet = workbook.addWorksheet('🌐 Social Security Tracker');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 18, I: 2, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🌐 Social Security Tracker',
    tabSubtitle: 'Per-employee YTD SS contributions. Wage-base alert at ~$168,600 (2026 estimate).',
    bannerText: BANNER,
    kpiData: [
      { label: 'EMPLOYEES',         value: { formula: `COUNTA(B12:B21)` } },
      { label: 'TOTAL WAGES',       value: { formula: `TEXT(SUM(C12:C21),"$#,##0")` } },
      { label: 'EMPLOYEE SS',       value: { formula: `TEXT(SUM(D12:D21),"$#,##0")` } },
      { label: 'EMPLOYER SS',       value: { formula: `TEXT(SUM(E12:E21),"$#,##0")` } },
      { label: 'COMBINED MEDICARE', value: { formula: `TEXT(SUM(F12:F21),"$#,##0")` } },
      { label: 'TOTAL LIABILITY',   value: { formula: `TEXT(SUM(G12:G21),"$#,##0")` } },
    ],
  });

  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const headers = ['Employee', 'YTD Wages', 'Employee SS 6.2%', 'Employer SS 6.2%', 'Medicare 2.9%', 'Total Liability', 'Wage Base Alert'];
  cols.forEach((col, i) => {
    sheet.getCell(`${col}11`).value = headers[i];
    sheet.getCell(`${col}11`).font = FONTS.headerWhite;
    sheet.getCell(`${col}11`).fill = FILLS.charcoal;
    sheet.getCell(`${col}11`).alignment = { vertical: 'middle', horizontal: i >= 1 && i <= 5 ? 'right' : 'left', indent: 1 };
    sheet.getCell(`${col}11`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(11).height = 24;

  const seedSS = [
    { name: 'Employee #1 (Installer)', wages: 38000 },
    { name: 'Employee #2 (Designer)',  wages: 42000 },
    { name: 'Employee #3 (PT Appr.)',  wages: 12000 },
  ];

  for (let i = 0; i < 10; i++) {
    const ri = 12 + i;
    const row = seedSS[i];

    if (row) sheet.getCell(`B${ri}`).value = row.name;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`C${ri}`).value = row.wages;
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    // Employee SS — 6.2% capped at the wage base ($168,600 in 2026; adjust annually)
    sheet.getCell(`D${ri}`).value = { formula: `IFERROR(MIN(C${ri},168600)*0.062,0)` };
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    // Employer SS — matches employee portion
    sheet.getCell(`E${ri}`).value = { formula: `IFERROR(MIN(C${ri},168600)*0.062,0)` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    // Medicare — 1.45% × 2 = 2.9% combined, no wage cap
    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(C${ri}*0.029,0)` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // Total
    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(D${ri}+E${ri}+F${ri},0)` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    // Wage base alert
    sheet.getCell(`H${ri}`).value = { formula: `IF(B${ri}="","",IF(C${ri}>=168600,"🔴 At wage base cap",IF(C${ri}>=150000,"⚠ Approaching cap","✓ OK")))` };
    sheet.getCell(`H${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  }

  sheet.addConditionalFormatting({
    ref: `H12:H21`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'cap',  priority: 1, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Approach', priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'OK',  priority: 3, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addCallout(sheet, `B23:H24`,
    '📅',
    'Annual rate refresh required',
    'The SS wage base ($168,600 in 2026) changes annually. Update column-D + column-E formulas each January with the new SSA-published cap. Medicare 2.9% combined rate has been stable since 1990 but verify with your CPA.');
  sheet.getRow(23).height = 28;
  sheet.getRow(24).height = 28;

  addFooter(sheet, 28, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 20 — 📋 PROJECT COSTING (Pro+)
// ============================================================================

function buildProjectCosting(workbook) {
  const sheet = workbook.addWorksheet('📋 Project Costing');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 18, D: 13, E: 13, F: 13, G: 13, H: 13, I: 18, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📋 Project Costing',
    tabSubtitle: 'Project-level P&L: hours + materials + subs vs. revenue. Winners-vs-losers sort at bottom.',
    bannerText: BANNER,
    kpiData: [
      { label: 'PROJECTS',          value: { formula: `COUNTA(B12:B31)` } },
      { label: 'TOTAL REV',         value: { formula: `TEXT(SUM(D12:D31),"$#,##0")` } },
      { label: 'TOTAL COST',        value: { formula: `TEXT(SUM(E12:E31)+SUM(F12:F31)+SUM(G12:G31),"$#,##0")` } },
      { label: 'TOTAL PROFIT',      value: { formula: `TEXT(SUM(D12:D31)-SUM(E12:E31)-SUM(F12:F31)-SUM(G12:G31),"$#,##0")` } },
      { label: 'AVG MARGIN %',      value: { formula: `IFERROR(TEXT(AVERAGE(H12:H31),"0.0%"),"—")` } },
      { label: 'WORST PROJECT %',   value: { formula: `IFERROR(TEXT(MIN(H12:H31),"0.0%"),"—")` } },
    ],
  });

  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const headers = ['Project', 'Client', 'Revenue', 'Labor Hrs $', 'Materials $', 'Subs $', 'Margin %', 'Status'];
  cols.forEach((col, i) => {
    sheet.getCell(`${col}11`).value = headers[i];
    sheet.getCell(`${col}11`).font = FONTS.headerWhite;
    sheet.getCell(`${col}11`).fill = FILLS.charcoal;
    sheet.getCell(`${col}11`).alignment = { vertical: 'middle', horizontal: i >= 2 && i <= 6 ? 'right' : 'left', indent: 1 };
    sheet.getCell(`${col}11`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(11).height = 24;

  const seedProjects = [
    { name: 'Acme Realty — Phase 2 signs', client: 'Acme Realty',     rev: 8400, labor: 1840, mat: 2600, subs:  900, status: 'Complete' },
    { name: 'Riverdale Spa storefront',     client: 'Riverdale Spa',   rev: 4200, labor:  640, mat: 1200, subs:    0, status: 'Complete' },
    { name: 'Beechwood Cafe rebrand',       client: 'Beechwood Cafe',  rev: 6800, labor: 2240, mat: 1800, subs: 1200, status: 'In progress' },
    { name: 'Downtown Auto monthly retainer',client: 'Downtown Auto',  rev: 1800, labor:  280, mat:  340, subs:    0, status: 'Recurring' },
    { name: 'Mr. Hardware seasonal',         client: 'Mr. Hardware',   rev: 1100, labor:  220, mat:  280, subs:    0, status: 'Complete' },
  ];

  for (let i = 0; i < 20; i++) {
    const ri = 12 + i;
    const row = seedProjects[i];

    if (row) sheet.getCell(`B${ri}`).value = row.name;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`C${ri}`).value = row.client;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`D${ri}`).value = row.rev;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`E${ri}`).value = row.labor;
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`F${ri}`).value = row.mat;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`G${ri}`).value = row.subs;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR((D${ri}-E${ri}-F${ri}-G${ri})/D${ri},0)` };
    sheet.getCell(`H${ri}`).numFmt = '0.0%';
    sheet.getCell(`H${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    if (row) sheet.getCell(`I${ri}`).value = row.status;
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
    sheet.getCell(`I${ri}`).dataValidation = { type: 'list', formulae: ['"In progress,Complete,On hold,Recurring,Cancelled"'], allowBlank: true };
  }

  // CF on margin column
  sheet.addConditionalFormatting({
    ref: `H12:H31`,
    rules: [
      { type: 'cellIs', operator: 'lessThan',           formulae: ['0'],    priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'cellIs', operator: 'lessThan',           formulae: ['0.1'],  priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['0.25'], priority: 3, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  addFooter(sheet, 36, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 21 — 🧮 TAX PREP SUMMARY (All tiers)
// ============================================================================

function buildTaxPrepSummary(workbook) {
  const sheet = workbook.addWorksheet('🧮 Tax Prep Summary');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 28, C: 14, D: 14, E: 14, F: 14, G: 14, H: 22, I: 2, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🧮 Tax Prep Summary',
    tabSubtitle: 'Year-end summary mapped to Schedule C. Auto-populates from Expense Tracker.',
    bannerText: BANNER,
    kpiData: [
      { label: 'YTD REVENUE',     value: { formula: `TEXT(SUM('💵 Revenue Tracker'!F12:F111),"$#,##0")` } },
      { label: 'YTD EXPENSES',    value: { formula: `TEXT(SUM('💸 Expense Tracker'!F12:F161),"$#,##0")` } },
      { label: 'NET PROFIT',      value: { formula: `TEXT(SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161),"$#,##0")` } },
      { label: 'TAX-DEDUCTIBLE',  value: { formula: `TEXT(SUMIF('💸 Expense Tracker'!G12:G161,"✅",'💸 Expense Tracker'!F12:F161),"$#,##0")` } },
      { label: 'EST. TAX @25%',   value: { formula: `TEXT(MAX(0,(SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))*0.25),"$#,##0")` } },
      { label: 'QUARTERLY EST',   value: { formula: `TEXT(MAX(0,(SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))*0.25/4),"$#,##0")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Schedule C category breakdown', 'Auto-categorized from Expense Tracker column I. Ready to hand to your accountant.');

  // Headers
  sheet.getCell(`B${r + 1}`).value = 'Schedule C Category';
  sheet.getCell(`B${r + 1}`).font = FONTS.headerWhite;
  sheet.getCell(`B${r + 1}`).fill = FILLS.charcoal;
  sheet.getCell(`B${r + 1}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${r + 1}`).border = BORDER_THIN(COLORS.charcoal);

  ['Q1', 'Q2', 'Q3', 'Q4', 'YTD'].forEach((q, i) => {
    const col = ['C', 'D', 'E', 'F', 'G'][i];
    sheet.getCell(`${col}${r + 1}`).value = q;
    sheet.getCell(`${col}${r + 1}`).font = FONTS.headerWhite;
    sheet.getCell(`${col}${r + 1}`).fill = FILLS.charcoal;
    sheet.getCell(`${col}${r + 1}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`${col}${r + 1}`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getCell(`H${r + 1}`).value = 'IRS Line';
  sheet.getCell(`H${r + 1}`).font = FONTS.headerWhite;
  sheet.getCell(`H${r + 1}`).fill = FILLS.charcoal;
  sheet.getCell(`H${r + 1}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`H${r + 1}`).border = BORDER_THIN(COLORS.charcoal);
  sheet.getRow(r + 1).height = 24;

  // One row per Schedule C category
  // IRS Schedule C line references for buyer convenience
  const irsLines = {
    'Advertising': 'Line 8', 'Car & Truck': 'Line 9', 'Commissions': 'Line 10',
    'Contract Labor': 'Line 11', 'Depreciation': 'Line 13', 'Insurance': 'Line 15',
    'Interest': 'Line 16', 'Legal & Professional': 'Line 17', 'Office Expense': 'Line 18',
    'Rent': 'Line 20', 'Repairs': 'Line 21', 'Supplies': 'Line 22',
    'Taxes & Licenses': 'Line 23', 'Travel': 'Line 24a', 'Meals (50%)': 'Line 24b',
    'Utilities': 'Line 25', 'Wages': 'Line 26', 'Software': 'Line 27a (Other)',
    'Bank Fees': 'Line 27a (Other)', 'Other': 'Line 27a',
  };

  SCHEDULE_C_CATEGORIES.forEach((cat, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = cat;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    // Per-quarter sums — filter by quarter via MONTH() comparison
    ['C', 'D', 'E', 'F'].forEach((col, qIdx) => {
      const startMonth = qIdx * 3 + 1;
      const endMonth = startMonth + 3;
      sheet.getCell(`${col}${ri}`).value = { formula:
        `SUMIFS('💸 Expense Tracker'!F12:F161,` +
        `'💸 Expense Tracker'!I12:I161,B${ri},` +
        `'💸 Expense Tracker'!C12:C161,">="&DATE(YEAR(TODAY()),${startMonth},1),` +
        `'💸 Expense Tracker'!C12:C161,"<"&DATE(YEAR(TODAY()),${endMonth},1))` };
      sheet.getCell(`${col}${ri}`).numFmt = '"$"#,##0';
      sheet.getCell(`${col}${ri}`).font = FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${col}${ri}`).fill = FILLS.white;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    });

    sheet.getCell(`G${ri}`).value = { formula: `SUM(C${ri}:F${ri})` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = irsLines[cat] || '';
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  });

  // Total row
  const tRow = r + 2 + SCHEDULE_C_CATEGORIES.length;
  sheet.getCell(`B${tRow}`).value = 'TOTAL DEDUCTIBLE EXPENSES';
  sheet.getCell(`B${tRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`B${tRow}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${tRow}`).fill = FILLS.charcoal;
  ['C', 'D', 'E', 'F', 'G'].forEach((col) => {
    sheet.getCell(`${col}${tRow}`).value = { formula: `SUM(${col}${r + 2}:${col}${tRow - 1})` };
    sheet.getCell(`${col}${tRow}`).numFmt = '"$"#,##0';
    sheet.getCell(`${col}${tRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.white) };
    sheet.getCell(`${col}${tRow}`).alignment = { horizontal: 'right' };
    sheet.getCell(`${col}${tRow}`).fill = FILLS.charcoal;
  });
  sheet.getRow(tRow).height = 26;

  // Quarterly estimated tax section
  let qR = tRow + 3;
  addSectionHeader(sheet, qR, 'Quarterly estimated tax (25% of net profit)', 'Due Apr 15 · Jun 15 · Sep 15 · Jan 15. Pay via IRS Direct Pay or EFTPS.');

  const qHeaders = ['Quarter', 'Period', 'Net Profit', 'Est. Tax (25%)', 'Due Date'];
  const qCols = ['B', 'D', 'F', 'G', 'H'];
  qCols.forEach((col, i) => {
    sheet.getCell(`${col}${qR + 3}`).value = qHeaders[i];
    sheet.getCell(`${col}${qR + 3}`).font = FONTS.headerWhite;
    sheet.getCell(`${col}${qR + 3}`).fill = FILLS.charcoal;
    sheet.getCell(`${col}${qR + 3}`).alignment = { vertical: 'middle', horizontal: i >= 2 && i <= 3 ? 'right' : 'left', indent: 1 };
    sheet.getCell(`${col}${qR + 3}`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.mergeCells(`B${qR + 3}:C${qR + 3}`);
  sheet.mergeCells(`D${qR + 3}:E${qR + 3}`);
  sheet.getRow(qR + 3).height = 22;

  const quarters = [
    { label: 'Q1', period: 'Jan – Mar', due: 'Apr 15' },
    { label: 'Q2', period: 'Apr – May', due: 'Jun 15' },
    { label: 'Q3', period: 'Jun – Aug', due: 'Sep 15' },
    { label: 'Q4', period: 'Sep – Dec', due: 'Jan 15' },
  ];
  quarters.forEach((q, i) => {
    const ri = qR + 4 + i;
    sheet.mergeCells(`B${ri}:C${ri}`);
    sheet.getCell(`B${ri}`).value = q.label;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.mergeCells(`D${ri}:E${ri}`);
    sheet.getCell(`D${ri}`).value = q.period;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    // Quarterly net profit
    const startMonth = i * 3 + 1;
    const endMonth = startMonth + 3;
    sheet.getCell(`F${ri}`).value = { formula:
      `SUMIFS('💵 Revenue Tracker'!F12:F111,'💵 Revenue Tracker'!C12:C111,">="&DATE(YEAR(TODAY()),${startMonth},1),'💵 Revenue Tracker'!C12:C111,"<"&DATE(YEAR(TODAY()),${endMonth},1))` +
      `-SUMIFS('💸 Expense Tracker'!F12:F161,'💸 Expense Tracker'!C12:C161,">="&DATE(YEAR(TODAY()),${startMonth},1),'💸 Expense Tracker'!C12:C161,"<"&DATE(YEAR(TODAY()),${endMonth},1))` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(MAX(0,F${ri}*0.25),0)` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = q.due;
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  });

  addCallout(sheet, `B${qR + 10}:H${qR + 11}`,
    '🧾',
    'Hand-off ready for your accountant',
    'This tab maps directly to IRS Schedule C lines. Export as PDF (File → Print → Save as PDF) and email to your CPA along with the bank reconciliation. The AI Tax Prep Advisor prompt (page 7) audits the file for missing docs + flags red-flag items before you send.');
  sheet.getRow(qR + 10).height = 28;
  sheet.getRow(qR + 11).height = 28;

  addFooter(sheet, qR + 14, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 22 — 📈 KPI DASHBOARD (Pro+)
// ============================================================================

function buildKPIDashboard(workbook) {
  const sheet = workbook.addWorksheet('📈 KPI Dashboard');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 20, C: 18, D: 20, E: 18, F: 20, G: 18, H: 20, I: 18, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📈 KPI Dashboard',
    tabSubtitle: '8 KPIs in 2×4 grid — every number a CFO would ask for. Source for thumbnail #2.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TIER',    value: 'Pro / AI Edition' },
      { label: 'KPIs',    value: '8 of 8' },
      { label: 'UPDATED', value: { formula: `TEXT(TODAY(),"mmm d")` } },
      { label: 'SCOPE',   value: 'YTD' },
      { label: 'SOURCE',  value: 'All input tabs' },
      { label: 'REFRESH', value: 'Live' },
    ],
  });

  let r = 7;
  addSectionHeader(sheet, 6, '8 KPIs — the CFO scorecard', '2×4 grid. Each card: label · big number · context line.', 'B:I');

  // 8 KPIs in 2×4 grid (B–I cols, two rows)
  const kpis = [
    { label: 'Gross Margin %',   formula: `IFERROR((SUM('💵 Revenue Tracker'!F12:F111)-SUMIF('💸 Expense Tracker'!I12:I161,"COGS",'💸 Expense Tracker'!F12:F161))/SUM('💵 Revenue Tracker'!F12:F111),0)`, fmt: '0.0%', context: 'Revenue − COGS, divided by revenue. Healthy: >40% products / >60% services.' },
    { label: 'Net Margin %',     formula: `IFERROR((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/SUM('💵 Revenue Tracker'!F12:F111),0)`, fmt: '0.0%', context: 'After everything. Healthy small biz: 8–15%.' },
    { label: 'EBITDA',           formula: `SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161)`, fmt: '"$"#,##0', context: 'Approx. — no depreciation broken out here. Use P&L Statement for true EBITDA.' },
    { label: 'Burn Rate / mo',   formula: `SUM('💸 Expense Tracker'!F12:F161)/12`, fmt: '"$"#,##0', context: 'YTD expenses ÷ 12. Monthly OpEx baseline.' },
    { label: 'Runway (months)',  formula: `IFERROR((SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161))/MAX(1,SUM('💸 Expense Tracker'!F12:F161)/12),0)`, fmt: '0.0" mo"', context: 'Months of OpEx coverage. Healthy: 6+. Risk: <3.' },
    { label: 'Revenue / Client', formula: `IFERROR(SUM('💵 Revenue Tracker'!F12:F111)/SUMPRODUCT((('💵 Revenue Tracker'!D12:D111<>"")/COUNTIF('💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!D12:D111&""))),0)`, fmt: '"$"#,##0', context: 'YTD revenue ÷ unique clients. Trend up = bigger deals.' },
    { label: 'CAC (estimated)',  formula: `IFERROR(SUMIF('💸 Expense Tracker'!E12:E161,"Marketing",'💸 Expense Tracker'!F12:F161)/MAX(1,SUMPRODUCT((('💵 Revenue Tracker'!D12:D111<>"")/COUNTIF('💵 Revenue Tracker'!D12:D111,'💵 Revenue Tracker'!D12:D111&"")))),0)`, fmt: '"$"#,##0', context: 'Marketing spend ÷ unique clients YTD. Manual override recommended.' },
    { label: 'MoM Growth %',     formula: `IFERROR(SUMIFS('💵 Revenue Tracker'!F12:F111,'💵 Revenue Tracker'!C12:C111,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),'💵 Revenue Tracker'!C12:C111,"<"&DATE(YEAR(TODAY()),MONTH(TODAY())+1,1))/SUMIFS('💵 Revenue Tracker'!F12:F111,'💵 Revenue Tracker'!C12:C111,">="&DATE(YEAR(TODAY()),MONTH(TODAY())-1,1),'💵 Revenue Tracker'!C12:C111,"<"&DATE(YEAR(TODAY()),MONTH(TODAY()),1))-1,0)`, fmt: '0.0%', context: 'This month vs. last. Volatile in small biz — read trends, not single months.' },
  ];

  // Render 2×4 grid: 4 KPIs across row 1, 4 across row 2
  for (let i = 0; i < 8; i++) {
    const row = Math.floor(i / 4);    // 0 or 1
    const col = i % 4;                 // 0..3
    const startCol = ['B', 'D', 'F', 'H'][col];
    const endCol = ['C', 'E', 'G', 'I'][col];
    const baseRow = 10 + row * 7;

    // Label
    sheet.mergeCells(`${startCol}${baseRow}:${endCol}${baseRow}`);
    sheet.getCell(`${startCol}${baseRow}`).value = kpis[i].label.toUpperCase();
    sheet.getCell(`${startCol}${baseRow}`).font = { ...FONTS.smallCaps, color: argb(COLORS.warmGold) };
    sheet.getCell(`${startCol}${baseRow}`).alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    sheet.getCell(`${startCol}${baseRow}`).fill = FILLS.charcoal;
    sheet.getRow(baseRow).height = 22;

    // Value (big number)
    sheet.mergeCells(`${startCol}${baseRow + 1}:${endCol}${baseRow + 2}`);
    sheet.getCell(`${startCol}${baseRow + 1}`).value = { formula: kpis[i].formula };
    sheet.getCell(`${startCol}${baseRow + 1}`).numFmt = kpis[i].fmt;
    sheet.getCell(`${startCol}${baseRow + 1}`).font = { name: 'Inter', size: 26, bold: true, color: argb(COLORS.charcoal) };
    sheet.getCell(`${startCol}${baseRow + 1}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`${startCol}${baseRow + 1}`).fill = FILLS.ivory;
    sheet.getCell(`${startCol}${baseRow + 1}`).border = BORDER_THIN();
    sheet.getRow(baseRow + 1).height = 28;
    sheet.getRow(baseRow + 2).height = 28;

    // Trend line — simple sparkline substitute via repeated chars
    sheet.mergeCells(`${startCol}${baseRow + 3}:${endCol}${baseRow + 3}`);
    sheet.getCell(`${startCol}${baseRow + 3}`).value = '▁▂▄▅▆▇█▇';
    sheet.getCell(`${startCol}${baseRow + 3}`).font = { name: 'Inter', size: 14, color: argb(COLORS.warmGold) };
    sheet.getCell(`${startCol}${baseRow + 3}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`${startCol}${baseRow + 3}`).fill = FILLS.white;
    sheet.getCell(`${startCol}${baseRow + 3}`).border = BORDER_THIN();
    sheet.getRow(baseRow + 3).height = 22;

    // Context
    sheet.mergeCells(`${startCol}${baseRow + 4}:${endCol}${baseRow + 5}`);
    sheet.getCell(`${startCol}${baseRow + 4}`).value = kpis[i].context;
    sheet.getCell(`${startCol}${baseRow + 4}`).font = { ...FONTS.small, italic: true };
    sheet.getCell(`${startCol}${baseRow + 4}`).alignment = { horizontal: 'center', vertical: 'top', wrapText: true, indent: 1 };
    sheet.getCell(`${startCol}${baseRow + 4}`).fill = FILLS.white;
    sheet.getCell(`${startCol}${baseRow + 4}`).border = BORDER_THIN();
    sheet.getRow(baseRow + 4).height = 22;
    sheet.getRow(baseRow + 5).height = 22;
  }

  addCallout(sheet, `B26:I27`,
    '🎯',
    'Use this with the AI Annual Business Review prompt',
    'The AI Edition Annual Business Review prompt (page 9) reads these 8 KPIs YoY and tells you what worked, what missed, and where to focus next year. Paste this entire dashboard into the prompt; it does the rest.');
  sheet.getRow(26).height = 28;
  sheet.getRow(27).height = 28;

  addFooter(sheet, 31, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 23 — 🔮 CASH FLOW FORECAST (Pro+)
// ============================================================================

function buildCashFlowForecast(workbook) {
  const sheet = workbook.addWorksheet('🔮 Cash Flow Forecast');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 16, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 20, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🔮 Cash Flow Forecast',
    tabSubtitle: '90-day forward projection. Top 5 customers + top 5 suppliers segmented. Danger ribbon fires below buffer.',
    bannerText: BANNER,
    kpiData: [
      { label: 'CURRENT CASH',    value: { formula: `TEXT(SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161),"$#,##0")` } },
      { label: 'BUFFER MIN',      value: { formula: `TEXT(C7,"$#,##0")` } },
      { label: 'PROJECTED LOW',   value: { formula: `TEXT(MIN(C19:N19),"$#,##0")` } },
      { label: 'PROJECTED END',   value: { formula: `TEXT(N19,"$#,##0")` } },
      { label: 'DANGER WEEKS',    value: { formula: `COUNTIF(C20:N20,"⚠")+COUNTIF(C20:N20,"🔴")` } },
      { label: 'BUFFER STATUS',   value: { formula: `IF(MIN(C19:N19)>=C7,"✓ Safe","⚠ At risk")` } },
    ],
  });

  // Top inputs section
  let r = addSectionHeader(sheet, 6, 'Forecast inputs', 'Set your starting cash + buffer. Top 5 customer + supplier expectations drive the projection.');

  sheet.getCell(`B${r + 1}`).value = 'Starting cash today';
  sheet.getCell(`B${r + 1}`).font = FONTS.bodyBold;
  sheet.getCell(`B${r + 1}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`C${r + 1}`).value = { formula: `SUM('💵 Revenue Tracker'!F12:F111)-SUM('💸 Expense Tracker'!F12:F161)` };
  sheet.getCell(`C${r + 1}`).numFmt = '"$"#,##0';
  sheet.getCell(`C${r + 1}`).font = FONTS.body;
  sheet.getCell(`C${r + 1}`).alignment = { horizontal: 'right' };
  sheet.getCell(`C${r + 1}`).fill = FILLS.ivory;
  sheet.getCell(`C${r + 1}`).border = BORDER_THIN(COLORS.warmGold);

  sheet.getCell(`B${r + 2}`).value = 'Minimum buffer';
  sheet.getCell(`B${r + 2}`).font = FONTS.bodyBold;
  sheet.getCell(`B${r + 2}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`C${r + 2}`).value = 25000;
  sheet.getCell(`C${r + 2}`).numFmt = '"$"#,##0';
  sheet.getCell(`C${r + 2}`).font = FONTS.body;
  sheet.getCell(`C${r + 2}`).alignment = { horizontal: 'right' };
  sheet.getCell(`C${r + 2}`).fill = FILLS.ivory;
  sheet.getCell(`C${r + 2}`).border = BORDER_THIN(COLORS.warmGold);

  // 12-week projection grid
  let gR = 12;
  addSectionHeader(sheet, gR, '12-week forward projection', 'Weeks 1–12 from today. Status: Safe / Tight / Danger / Critical.');

  sheet.getCell(`B${gR + 3}`).value = 'Week';
  sheet.getCell(`B${gR + 3}`).font = FONTS.headerWhite;
  sheet.getCell(`B${gR + 3}`).fill = FILLS.charcoal;
  sheet.getCell(`B${gR + 3}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${gR + 3}`).border = BORDER_THIN(COLORS.charcoal);
  for (let w = 1; w <= 12; w++) {
    const col = String.fromCharCode(67 + w - 1);  // C..N
    sheet.getCell(`${col}${gR + 3}`).value = `W${w}`;
    sheet.getCell(`${col}${gR + 3}`).font = FONTS.headerWhite;
    sheet.getCell(`${col}${gR + 3}`).fill = FILLS.charcoal;
    sheet.getCell(`${col}${gR + 3}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`${col}${gR + 3}`).border = BORDER_THIN(COLORS.charcoal);
  }
  sheet.getRow(gR + 3).height = 24;

  const rows = [
    { label: 'Expected inflow',  defaults: [14000, 8000, 12000, 6000, 18000, 9000, 14000, 7000, 22000, 11000, 8000, 19000] },
    { label: 'Expected outflow', defaults: [-18000, -22000, -9000, -24000, -11000, -22000, -9000, -20000, -11000, -20000, -10000, -20000] },
    { label: 'Net cash flow',    formula: true },
    { label: 'Running balance',  formula: true, derived: true },
    { label: 'Status',           pill: true },
  ];

  rows.forEach((row, rIdx) => {
    const ri = gR + 4 + rIdx;
    sheet.getCell(`B${ri}`).value = row.label;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    for (let w = 1; w <= 12; w++) {
      const col = String.fromCharCode(67 + w - 1);
      const cell = sheet.getCell(`${col}${ri}`);

      if (row.formula && row.label === 'Net cash flow') {
        cell.value = { formula: `${col}${gR + 4}+${col}${gR + 5}` };
        cell.numFmt = '"$"#,##0;("$"#,##0)';
      } else if (row.formula && row.label === 'Running balance') {
        if (w === 1) {
          cell.value = { formula: `$C$${r + 1}+${col}${gR + 6}` };
        } else {
          const prevCol = String.fromCharCode(67 + w - 2);
          cell.value = { formula: `${prevCol}${ri}+${col}${gR + 6}` };
        }
        cell.numFmt = '"$"#,##0;("$"#,##0)';
      } else if (row.pill) {
        cell.value = { formula: `IF(${col}${gR + 7}<0,"🔴",IF(${col}${gR + 7}<$C$${r + 2},"⚠","✓"))` };
        cell.alignment = { horizontal: 'center' };
      } else if (row.defaults) {
        cell.value = row.defaults[w - 1];
        cell.numFmt = '"$"#,##0;("$"#,##0)';
      }
      cell.font = row.pill ? FONTS.bodyBold : FONTS.body;
      cell.alignment = cell.alignment || { horizontal: 'right' };
      cell.fill = FILLS.white;
      cell.border = BORDER_THIN();
    }
  });

  // Danger ribbon
  sheet.mergeCells(`B${gR + 11}:N${gR + 11}`);
  const ribbon = sheet.getCell(`B${gR + 11}`);
  ribbon.value = { formula: `IF(MIN(C${gR + 7}:N${gR + 7})<0,"🔴 CRITICAL — cash projected to go negative within 12 weeks. Pull invoice early-pay levers + defer non-critical expenses.",IF(MIN(C${gR + 7}:N${gR + 7})<$C$${r + 2},"⚠️ TIGHT — cash dips below buffer. Review the AI Cash Flow Coach prompt (page 4) for mitigation moves.","✓ Safe — cash stays above buffer for the full 12-week window."))` };
  ribbon.font = FONTS.bodyBold;
  ribbon.alignment = { horizontal: 'center', vertical: 'middle' };
  ribbon.fill = FILLS.ivory;
  ribbon.border = BORDER_THIN();
  sheet.getRow(gR + 11).height = 28;

  sheet.addConditionalFormatting({
    ref: `B${gR + 11}:N${gR + 11}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'CRITICAL', priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'TIGHT',    priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Safe',     priority: 3, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
    ],
  });

  // CF on running balance row
  sheet.addConditionalFormatting({
    ref: `C${gR + 7}:N${gR + 7}`,
    rules: [
      { type: 'cellIs', operator: 'lessThan',           formulae: ['0'],           priority: 1, style: { fill: FILLS.alertLight,   font: { color: argb(COLORS.alert),   bold: true } } },
      { type: 'cellIs', operator: 'lessThan',           formulae: [`$C$${r + 2}`], priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
    ],
  });

  addFooter(sheet, gR + 14, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 24 — ⚖️ BREAK-EVEN CALCULATOR (All tiers)
// ============================================================================

function buildBreakEvenCalculator(workbook) {
  const sheet = workbook.addWorksheet('⚖️ Break-Even Calculator');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 24, C: 16, D: 16, E: 4, F: 24, G: 16, H: 16, I: 2, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '⚖️ Break-Even Calculator',
    tabSubtitle: 'Enter fixed costs · variable cost/unit · price/unit. Output: units + $ to break even.',
    bannerText: BANNER,
    kpiData: [
      { label: 'BE UNITS',         value: { formula: `IFERROR(TEXT(C10/(D11-C11),"#,##0")&" units","—")` } },
      { label: 'BE REVENUE',       value: { formula: `IFERROR(TEXT(C10/(D11-C11)*D11,"$#,##0"),"—")` } },
      { label: 'CONTRIBUTION $',   value: { formula: `IFERROR(TEXT(D11-C11,"$#,##0"),"—")` } },
      { label: 'CONTRIBUTION %',   value: { formula: `IFERROR(TEXT((D11-C11)/D11,"0.0%"),"—")` } },
      { label: 'MARGIN OF SAFETY', value: { formula: `IFERROR(TEXT(C12-C10/(D11-C11),"#,##0")&" units","—")` } },
      { label: 'STATUS',           value: { formula: `IFERROR(IF(C12>C10/(D11-C11),"✓ Profitable","⚠ Below break-even"),"—")` } },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'Inputs · Outputs', 'Edit the three inputs below; outputs update live.', 'B:D');

  // Inputs (left column)
  sheet.getCell(`B${r + 1}`).value = 'Fixed costs (monthly)';
  sheet.getCell(`B${r + 1}`).font = FONTS.bodyBold;
  sheet.getCell(`B${r + 1}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`C${r + 1}`).value = 6800;
  sheet.getCell(`C${r + 1}`).numFmt = '"$"#,##0';
  sheet.getCell(`C${r + 1}`).font = FONTS.body;
  sheet.getCell(`C${r + 1}`).alignment = { horizontal: 'right' };
  sheet.getCell(`C${r + 1}`).fill = FILLS.ivory;
  sheet.getCell(`C${r + 1}`).border = BORDER_THIN(COLORS.warmGold);

  sheet.getCell(`D${r + 1}`).value = 'Price / unit';
  sheet.getCell(`D${r + 1}`).font = FONTS.bodyBold;
  sheet.getCell(`D${r + 1}`).alignment = { horizontal: 'right', indent: 1 };

  sheet.getCell(`B${r + 2}`).value = 'Variable cost / unit';
  sheet.getCell(`B${r + 2}`).font = FONTS.bodyBold;
  sheet.getCell(`B${r + 2}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`C${r + 2}`).value = 260;
  sheet.getCell(`C${r + 2}`).numFmt = '"$"#,##0';
  sheet.getCell(`C${r + 2}`).font = FONTS.body;
  sheet.getCell(`C${r + 2}`).alignment = { horizontal: 'right' };
  sheet.getCell(`C${r + 2}`).fill = FILLS.ivory;
  sheet.getCell(`C${r + 2}`).border = BORDER_THIN(COLORS.warmGold);

  sheet.getCell(`D${r + 2}`).value = 520;
  sheet.getCell(`D${r + 2}`).numFmt = '"$"#,##0';
  sheet.getCell(`D${r + 2}`).font = FONTS.body;
  sheet.getCell(`D${r + 2}`).alignment = { horizontal: 'right' };
  sheet.getCell(`D${r + 2}`).fill = FILLS.ivory;
  sheet.getCell(`D${r + 2}`).border = BORDER_THIN(COLORS.warmGold);

  sheet.getCell(`B${r + 3}`).value = 'Current units sold (monthly)';
  sheet.getCell(`B${r + 3}`).font = FONTS.bodyBold;
  sheet.getCell(`B${r + 3}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`C${r + 3}`).value = 32;
  sheet.getCell(`C${r + 3}`).font = FONTS.body;
  sheet.getCell(`C${r + 3}`).alignment = { horizontal: 'right' };
  sheet.getCell(`C${r + 3}`).fill = FILLS.ivory;
  sheet.getCell(`C${r + 3}`).border = BORDER_THIN(COLORS.warmGold);

  // Outputs (right column)
  let oR = addSectionHeader(sheet, 6, 'Output', 'Break-even, margin of safety, what-if scenarios.', 'F:H');

  const outputs = [
    { label: 'Break-even units',       formula: `IFERROR(C10/(D11-C11),0)`, fmt: '#,##0' },
    { label: 'Break-even revenue',     formula: `IFERROR(C10/(D11-C11)*D11,0)`, fmt: '"$"#,##0' },
    { label: 'Contribution / unit',    formula: `IFERROR(D11-C11,0)`, fmt: '"$"#,##0' },
    { label: 'Contribution margin %',  formula: `IFERROR((D11-C11)/D11,0)`, fmt: '0.0%' },
    { label: 'Current monthly profit', formula: `IFERROR(C12*(D11-C11)-C10,0)`, fmt: '"$"#,##0' },
    { label: 'Margin of safety (units)', formula: `IFERROR(C12-C10/(D11-C11),0)`, fmt: '#,##0' },
  ];
  outputs.forEach((o, i) => {
    const ri = oR + 1 + i;
    sheet.getCell(`F${ri}`).value = o.label;
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.mergeCells(`G${ri}:H${ri}`);
    sheet.getCell(`G${ri}`).value = { formula: o.formula };
    sheet.getCell(`G${ri}`).numFmt = o.fmt;
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getRow(ri).height = 22;
  });

  // What-if scenarios
  let wR = 22;
  addSectionHeader(sheet, wR, 'What-if · price change impact', 'Move the price up/down to see break-even shift.');

  sheet.getCell(`B${wR + 3}`).value = 'Price change';
  sheet.getCell(`B${wR + 3}`).font = FONTS.headerWhite;
  sheet.getCell(`B${wR + 3}`).fill = FILLS.charcoal;
  sheet.getCell(`B${wR + 3}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${wR + 3}`).border = BORDER_THIN(COLORS.charcoal);
  ['BE Units', 'BE Revenue', 'Contribution $', 'Profit @ current vol'].forEach((h, i) => {
    const col = ['D', 'F', 'G', 'H'][i];
    sheet.getCell(`${col}${wR + 3}`).value = h;
    sheet.getCell(`${col}${wR + 3}`).font = FONTS.headerWhite;
    sheet.getCell(`${col}${wR + 3}`).fill = FILLS.charcoal;
    sheet.getCell(`${col}${wR + 3}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`${col}${wR + 3}`).border = BORDER_THIN(COLORS.charcoal);
  });

  [-0.1, -0.05, 0, 0.05, 0.1, 0.15].forEach((delta, i) => {
    const ri = wR + 4 + i;
    sheet.getCell(`B${ri}`).value = delta;
    sheet.getCell(`B${ri}`).numFmt = '+0.0%;-0.0%;"baseline"';
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    const priceFormula = `$D$11*(1+B${ri})`;
    sheet.getCell(`D${ri}`).value = { formula: `IFERROR($C$10/(${priceFormula}-$C$11),0)` };
    sheet.getCell(`D${ri}`).numFmt = '#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = { formula: `IFERROR($C$10/(${priceFormula}-$C$11)*${priceFormula},0)` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(${priceFormula}-$C$11,0)` };
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = { formula: `IFERROR($C$12*(${priceFormula}-$C$11)-$C$10,0)` };
    sheet.getCell(`H${ri}`).numFmt = '"$"#,##0;("$"#,##0)';
    sheet.getCell(`H${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
  });

  addFooter(sheet, wR + 14, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 25 — 🤖 AI BUSINESS CO-PILOT (AI Edition only)
// ============================================================================

function buildAIBusinessCoPilot(workbook) {
  const sheet = workbook.addWorksheet('🤖 AI Business Co-Pilot');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 32, C: 32, D: 32, E: 32, F: 2, G: 2, H: 2, I: 2, J: 2, K: 2, L: 2, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🤖 AI Business Co-Pilot',
    tabSubtitle: '8 prompts in 2×4 grid. Each pairs with a tab + a page in the AI PDF. Free-tier ChatGPT or Claude.',
    bannerText: BANNER,
    kpiData: [
      { label: 'PROMPTS',     value: '8' },
      { label: 'PDF PAGES',   value: '12' },
      { label: 'AI TOOLS',    value: 'ChatGPT · Claude' },
      { label: 'TIER',        value: 'AI Edition' },
      { label: 'COST TO USE', value: 'Free tier OK' },
      { label: 'UPDATES',     value: '12 mo' },
    ],
  });

  let r = addSectionHeader(sheet, 6, 'The 8 prompts', 'Click each card to find the matching page in the AI Business Co-Pilot PDF.');

  const prompts = [
    { num: 1, title: 'P&L Analyst',                  tab: '📊 P&L Statement',           desc: 'Read each line. Flag anomalies vs. 12-mo trailing. Diagnose margin compression.' },
    { num: 2, title: 'Cash Flow Coach',              tab: '🔮 Cash Flow Forecast',      desc: 'Forecast 90 days. Name danger weeks. Recommend invoice + supplier moves.' },
    { num: 3, title: 'Depreciation Assistant',       tab: '🏗️ Asset Depreciation',      desc: 'Audit method choice. Verify §179 + bonus + MACRS. Flag partial-use treatment.' },
    { num: 4, title: 'Supplier Negotiation Brief',   tab: '🏭 Supplier & PO Manager',   desc: 'Write the email. Three justifications. Concessions. Three objections + responses.' },
    { num: 5, title: 'Tax Prep Advisor',             tab: '🧮 Tax Prep Summary',        desc: 'Score readiness 0–100. Surface red flags. Bonus payroll + Solo 401k Q4 moves.' },
    { num: 6, title: 'Pricing Strategist',           tab: '📊 P&L Statement (+ inventory + profitability)', desc: 'Volume × margin matrix. Three pricing moves with $ impact.' },
    { num: 7, title: 'Annual Business Review',       tab: '📈 KPI Dashboard',            desc: 'Three wins · three misses · three lessons · three priorities. No pep talk.' },
    { num: 8, title: 'Customer Concentration Risk',  tab: '📊 Customer Profitability',  desc: 'Name top 3 risk exposures. Recommend diversification by sector + size.' },
  ];

  // 2×4 grid — 2 rows of 4 cards
  prompts.forEach((p, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const startCol = ['B', 'C', 'D', 'E'][col];
    const baseRow = r + 1 + row * 10;

    // Card header — number + title
    sheet.getCell(`${startCol}${baseRow}`).value = `${p.num}.  ${p.title}`;
    sheet.getCell(`${startCol}${baseRow}`).font = { ...FONTS.bodyBold, size: 12, color: argb(COLORS.warmGold) };
    sheet.getCell(`${startCol}${baseRow}`).fill = FILLS.charcoal;
    sheet.getCell(`${startCol}${baseRow}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getRow(baseRow).height = 28;

    // Tab pairing
    sheet.getCell(`${startCol}${baseRow + 1}`).value = `Pairs with: ${p.tab}`;
    sheet.getCell(`${startCol}${baseRow + 1}`).font = { ...FONTS.small, color: argb(COLORS.warmGoldLight) };
    sheet.getCell(`${startCol}${baseRow + 1}`).fill = FILLS.charcoal;
    sheet.getCell(`${startCol}${baseRow + 1}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1, wrapText: true };
    sheet.getRow(baseRow + 1).height = 22;

    // Description
    sheet.getCell(`${startCol}${baseRow + 2}`).value = p.desc;
    sheet.getCell(`${startCol}${baseRow + 2}`).font = FONTS.body;
    sheet.getCell(`${startCol}${baseRow + 2}`).fill = FILLS.ivory;
    sheet.getCell(`${startCol}${baseRow + 2}`).alignment = { vertical: 'top', horizontal: 'left', indent: 1, wrapText: true };
    sheet.getRow(baseRow + 2).height = 38;
    sheet.getRow(baseRow + 3).height = 38;

    // PDF page reference + paste cell label
    sheet.getCell(`${startCol}${baseRow + 4}`).value = `📄 PDF page ${p.num + 2} · Paste AI output ↓`;
    sheet.getCell(`${startCol}${baseRow + 4}`).font = { ...FONTS.small, italic: true, color: argb(COLORS.textMuted) };
    sheet.getCell(`${startCol}${baseRow + 4}`).fill = FILLS.warmGoldLight;
    sheet.getCell(`${startCol}${baseRow + 4}`).alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getRow(baseRow + 4).height = 22;

    // Paste output cell
    sheet.getCell(`${startCol}${baseRow + 5}`).value = '';
    sheet.getCell(`${startCol}${baseRow + 5}`).fill = FILLS.white;
    sheet.getCell(`${startCol}${baseRow + 5}`).alignment = { wrapText: true, vertical: 'top', indent: 1 };
    sheet.getCell(`${startCol}${baseRow + 5}`).border = BORDER_THIN();
    sheet.getRow(baseRow + 5).height = 90;
  });

  // Footer instruction
  addCallout(sheet, `B${r + 22}:E${r + 23}`,
    '🤖',
    'How to use these',
    'All 8 prompts work in ChatGPT free + Claude free. Open the matching PDF page, copy the prompt, paste it into the AI tool with your data. The worked example on each PDF page shows what good output looks like. Save sharp output into the "Paste output here" cell so it stays with your spreadsheet.');
  sheet.getRow(r + 22).height = 28;
  sheet.getRow(r + 23).height = 28;

  addFooter(sheet, r + 27, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 26 — ℹ️ ABOUT & HELP (All tiers)
// ============================================================================

function buildAbout(workbook) {
  const tier = workbook._tier || 'ai';
  const tierMetadata = {
    essentials: { label: 'Essentials', tabs: '9',  prompts: '0' },
    pro:        { label: 'Pro',        tabs: '24', prompts: '0' },
    ai:         { label: 'AI Edition', tabs: '25', prompts: '8' },
  }[tier];

  const sheet = workbook.addWorksheet('ℹ️ About & Help');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 32, C: 64, D: 8, E: 10, F: 10, G: 10, H: 10, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — ${tierMetadata.label}`,
    tabName: 'ℹ️ About & Help',
    tabSubtitle: 'Welcome — and quick answers to the questions small-business buyers ask first.',
    bannerText: BANNER,
    kpiData: [
      { label: 'VERSION',    value: '1.0' },
      { label: 'TABS',       value: tierMetadata.tabs },
      { label: 'STATEMENTS', value: 'P&L · CF · BS' },
      { label: 'AI PROMPTS', value: tierMetadata.prompts },
      { label: 'TIER',       value: tierMetadata.label },
      { label: 'UPDATES',    value: tier === 'ai' ? '12 mo free' : 'Bug fixes free' },
    ],
  });

  sheet.mergeCells('B6:C6');
  sheet.getCell('B6').value = 'Welcome to your Small Business Finance Kit.';
  sheet.getCell('B6').font = FONTS.hero;
  sheet.getRow(6).height = 38;

  sheet.mergeCells('B7:C7');
  sheet.getCell('B7').value = 'A complete financial back-office in one spreadsheet — P&L · Cash Flow · Balance Sheet · Invoicing · Inventory · Payroll · Tax Prep. $24 once vs. QuickBooks $35–$235/month.';
  sheet.getCell('B7').font = FONTS.bodyMuted;
  sheet.getRow(7).height = 22;

  let r = addSectionHeader(sheet, 10, 'How this spreadsheet is wired', 'Two paired Input tabs — Revenue + Expense Tracker — drive every other tab.');

  const explainer = [
    ['💵 Revenue Tracker',         'Input #1. One row per transaction (Date, Client, Product, Amount, Status, Stream, Payment Method).'],
    ['💸 Expense Tracker',         'Input #2. Tax-deductible flag + Schedule C category drive Tax Prep Summary.'],
    ['🏠 Dashboard',               'Output spine. Business Health Score, top customers, runway meter, receivables aging.'],
    ['📊 P&L Statement',           'Standard accounting format: Revenue → COGS → Gross → Opex → EBITDA → Tax → Net.'],
    ['💧 Cash Flow Statement',     'Operating · Investing · Financing. Danger ribbon fires on consecutive negative months.'],
    ['🏦 Balance Sheet (Pro)',     'Assets · L+E. Auto-balance verification at bottom.'],
    ['🧾 Invoice Tracker',         'Up to 50 invoices. Days outstanding auto-calc. DSO at top.'],
    ['📄 Invoice Templates',       `${tier === 'essentials' ? '5' : '10'} print-ready invoice templates. Edit, export to PDF, send.`],
    ['📈 KPI Dashboard (Pro)',     '8 KPIs CFO would ask for: gross margin · net margin · EBITDA · burn · runway · revenue/client · CAC · MoM growth.'],
    ['🔮 Cash Flow Forecast (Pro)', '12-week forward projection with danger ribbon when below buffer.'],
    ['🤖 AI Business Co-Pilot (AI)', '8 ChatGPT/Claude prompts in companion PDF — P&L Analyst · Cash Flow Coach · Depreciation · Supplier · Tax Prep · Pricing · Annual Review · Concentration.'],
  ];

  explainer.forEach((er, i) => {
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

  let r2 = addSectionHeader(sheet, r + explainer.length + 3, 'Quick FAQ', '');

  const faq = [
    ['Is this Google Sheets or Excel?',  'Google Sheets primary; Excel courtesy export included. Some Pro/AI features (live FX, sales-tax-rate lookups via GOOGLEFINANCE) only work in Sheets.'],
    ['Does this replace QuickBooks?',    'For most solopreneurs + small biz: yes. It gives you P&L + Balance Sheet + Cash Flow + Invoicing + Payroll + Tax Prep — the same coverage as QuickBooks Online basic. Trade-off: no bank sync, no auto-categorization. The trade is privacy + $2,046 saved over 5 years.'],
    ['Can I actually run payroll?',      'You can CALCULATE payroll (gross → deductions → net) for up to 10 employees. We DO NOT file taxes or move money. Use Gusto/Justworks for the filing + deposit piece; this kit prepares the inputs + holds the records.'],
    ['Will my accountant accept this?',  'Yes. Tax Prep Summary maps directly to IRS Schedule C lines. Quarterly estimated tax calc included. Export as PDF, send to your CPA.'],
    ['Bank sync?',                       'No. That\'s the privacy gate — Plaid + Yodlee aggregators monetize you to lenders + payroll companies. You enter transactions manually (or paste CSV from your bank). Trade-off: 30 min/week vs. handing over your full financial picture.'],
    ['What if payroll tax rates change?',`${tier === 'ai' ? '12 months of free template updates.' : 'Bug fixes free forever; AI Edition gets 12-mo template updates.'} Rates evolve annually (FICA wage base, state UI) — we ship updated tabs when standards change.`],
  ];
  faq.forEach((qa, i) => {
    const ri = r2 + 1 + i * 2;
    sheet.getCell(`B${ri}`).value = qa[0];
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).value = qa[1];
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { wrapText: true, vertical: 'middle' };
    sheet.getRow(ri).height = 38;
  });

  addFooter(sheet, r2 + faq.length * 2 + 4, { productName: PRODUCT_NAME });
}

// ============================================================================
// MAIN — orchestrate the build
// ============================================================================

async function buildSmallBusinessFinanceKit() {
  const t0 = Date.now();

  const tierArg = process.argv.find((a) => a.startsWith('--tier='));
  const tier = tierArg ? tierArg.split('=')[1] : 'ai';
  if (!['essentials', 'pro', 'ai'].includes(tier)) {
    console.error(`✗ Invalid --tier "${tier}". Use essentials | pro | ai.`);
    process.exit(1);
  }
  const tierLabel = { essentials: 'Essentials', pro: 'Pro', ai: 'AI Edition' }[tier];
  // Tab counts (post-applyTierVisibility):
  //   Essentials =  9 visible (+ About = 10)
  //   Pro        = 22 visible (+ About = 23)
  //   AI Edition = 23 visible (+ About = 24)
  const tierTabCount = { essentials: 9, pro: 24, ai: 25 }[tier];
  console.log(`→ Building ${PRODUCT_NAME} — ${tierLabel} (${tierTabCount} visible / 23 total + About)...`);

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
  workbook.subject = 'Small business · P&L · payroll · invoicing · AI CFO';
  workbook.category = 'Small Business';
  workbook.keywords = 'small business, bookkeeping, P&L, payroll, invoicing, QuickBooks alternative, google sheets, excel, lime premium studios';
  workbook.description = `${PRODUCT_NAME} ${tierLabel} v1.0 — Lime Premium Studios. ${tierTabCount} tabs. P&L + Cash Flow + Balance Sheet + Invoicing + Inventory + Payroll + Tax Prep. Anti-QuickBooks: $24 once vs. $35–$235/month.`;

  // Build all tabs in spec order. Tier visibility (next step) physically removes
  // PRO_TABS for Essentials and AI_TABS for Pro/Essentials.
  console.log('  • 🏠 Dashboard');                          buildDashboard(workbook);
  console.log('  • 💵 Revenue Tracker');                    buildRevenueTracker(workbook);
  console.log('  • 💸 Expense Tracker');                    buildExpenseTracker(workbook);
  console.log('  • 📊 P&L Statement');                      buildPLStatement(workbook);
  console.log('  • 💧 Cash Flow Statement');                buildCashFlowStatement(workbook);
  console.log('  • 🏦 Balance Sheet (Pro)');                buildBalanceSheet(workbook);
  console.log('  • 🧾 Invoice Tracker');                    buildInvoiceTracker(workbook);
  console.log('  • 📄 Invoice Templates');                  buildInvoiceTemplates(workbook);
  console.log('  • 📅 Recurring Invoice Schedule (Pro)');   buildRecurringInvoiceSchedule(workbook);
  console.log('  • ⏳ Receivables Aging (Pro)');           buildReceivablesAging(workbook);
  console.log('  • ⏳ Payables Aging (Pro)');              buildPayablesAging(workbook);
  console.log('  • 📊 Customer Profitability (Pro)');       buildCustomerProfitability(workbook);
  console.log('  • 📦 Inventory Tracker (Pro)');            buildInventoryTracker(workbook);
  console.log('  • 🏭 Supplier & PO Manager (Pro)');        buildSupplierPOManager(workbook);
  console.log('  • 🏗️ Asset Depreciation (Pro)');           buildAssetDepreciation(workbook);
  console.log('  • 💰 Loan Amortization (Pro)');            buildLoanAmortization(workbook);
  console.log('  • 👥 HR Employee Records (Pro)');          buildHREmployeeRecords(workbook);
  console.log('  • 💰 Payroll & Payslips (Pro)');           buildPayrollPayslips(workbook);
  console.log('  • 🌐 Social Security Tracker (Pro)');      buildSocialSecurityTracker(workbook);
  console.log('  • 📋 Project Costing (Pro)');              buildProjectCosting(workbook);
  console.log('  • 🧮 Tax Prep Summary');                   buildTaxPrepSummary(workbook);
  console.log('  • 📈 KPI Dashboard (Pro)');                buildKPIDashboard(workbook);
  console.log('  • 🔮 Cash Flow Forecast (Pro)');           buildCashFlowForecast(workbook);
  console.log('  • ⚖️ Break-Even Calculator');              buildBreakEvenCalculator(workbook);
  console.log('  • 🤖 AI Business Co-Pilot (AI)');          buildAIBusinessCoPilot(workbook);
  console.log('  • ℹ️ About & Help');                       buildAbout(workbook);

  applyTierVisibility(workbook, tier, { proTabs: PRO_TABS, aiTabs: AI_TABS, productName: PRODUCT_NAME });

  const filename = tier === 'ai'
    ? 'small-business-finance-kit-ai-edition.xlsx'
    : `small-business-finance-kit-${tier}.xlsx`;
  const outPath = resolve(OUTPUT_DIR, filename);
  await workbook.xlsx.writeFile(outPath);

  const elapsed = Date.now() - t0;
  console.log(`\n✓ Workbook generated in ${elapsed}ms`);
  console.log(`  Output: ${outPath}`);
  console.log(`  Tier:   ${tierLabel} — ${tierTabCount} of 23 tabs visible`);
}

buildSmallBusinessFinanceKit().catch((err) => {
  console.error('✗ Build failed:', err);
  process.exit(1);
});
