/**
 * Budget Tracker — Google Sheets template generator (Premium Finance House) — v2
 *
 * v2 changes vs PoC:
 *   • Expanded from 5 tabs to 13 (toward full 17-tab spec)
 *   • Premium top bar: wordmark band + KPI tiles + branded banner + tab subtitle
 *   • Reusable design components: section headers, callout boxes, status pills, footer bands
 *   • Realistic seed data: 30+ expenses, 8 categories, 6 bills, 5 goals
 *   • Fixed SUM bug — explicit data-row ranges, not whole-column refs
 *   • Cross-tab references: KPI tiles auto-populate from underlying data
 *   • Richer conditional formatting + data validation everywhere
 */

import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = resolve(__dirname, '..', 'output');
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

// ============================================================================
// DESIGN TOKENS — Premium Finance House
// ============================================================================

const COLORS = {
  charcoal:    'FF1F2A33',
  charcoalLight:'FF2F3A43',
  warmGold:    'FFC9A14A',
  warmGoldLight:'FFE3C683',
  offWhite:    'FFF7F5F0',
  white:       'FFFFFFFF',
  ivory:       'FFFAF7F0',
  success:     'FF3F6B4D',
  successLight:'FFD9E5DC',
  warning:     'FFB57A2A',
  warningLight:'FFF5E5D0',
  alert:       'FF9B3A30',
  alertLight:  'FFF0DBD9',
  gridGray:    'FFE3E5E8',
  textMuted:   'FF888888',
  textSubtle:  'FF666666',
  divider:     'FFD8DCDF',
};

const argb = (c) => ({ argb: c });

const FONTS = {
  hero:       { name: 'Inter', size: 28, bold: true, color: argb(COLORS.charcoal) },
  display:    { name: 'Inter', size: 18, bold: true, color: argb(COLORS.charcoal) },
  section:    { name: 'Inter', size: 13, bold: true, color: argb(COLORS.charcoal) },
  body:       { name: 'Inter', size: 11, color: argb(COLORS.charcoal) },
  bodyBold:   { name: 'Inter', size: 11, bold: true, color: argb(COLORS.charcoal) },
  bodyMuted:  { name: 'Inter', size: 10, italic: true, color: argb(COLORS.textSubtle) },
  small:      { name: 'Inter', size: 9, color: argb(COLORS.textMuted) },
  smallCaps:  { name: 'Inter', size: 8, bold: true, color: argb(COLORS.textMuted) },
  kpiLabel:   { name: 'Inter', size: 8, bold: true, color: argb(COLORS.textMuted) },
  kpiValue:   { name: 'Inter', size: 14, bold: true, color: argb(COLORS.charcoal) },
  kpiDelta:   { name: 'Inter', size: 9, color: argb(COLORS.success) },
  headerWhite:{ name: 'Inter', size: 11, bold: true, color: argb(COLORS.white) },
  bannerWhite:{ name: 'Inter', size: 10, italic: true, color: argb(COLORS.white) },
  footer:     { name: 'Inter', size: 9, italic: true, color: argb(COLORS.textMuted) },
  scoreHuge:  { name: 'Inter', size: 56, bold: true, color: argb(COLORS.success) },
  scoreUnit:  { name: 'Inter', size: 20, color: argb(COLORS.textMuted) },
};

const FILL = (c) => ({ type: 'pattern', pattern: 'solid', fgColor: argb(c) });

const FILLS = {
  charcoal:    FILL(COLORS.charcoal),
  charcoalLight: FILL(COLORS.charcoalLight),
  warmGold:    FILL(COLORS.warmGold),
  warmGoldLight: FILL(COLORS.warmGoldLight),
  offWhite:    FILL(COLORS.offWhite),
  white:       FILL(COLORS.white),
  ivory:       FILL(COLORS.ivory),
  successLight:FILL(COLORS.successLight),
  warningLight:FILL(COLORS.warningLight),
  alertLight:  FILL(COLORS.alertLight),
  success:     FILL(COLORS.success),
  warning:     FILL(COLORS.warning),
  alert:       FILL(COLORS.alert),
};

const BORDER_THIN = (color = COLORS.gridGray) => ({
  top:    { style: 'thin', color: argb(color) },
  left:   { style: 'thin', color: argb(color) },
  bottom: { style: 'thin', color: argb(color) },
  right:  { style: 'thin', color: argb(color) },
});

const BORDER_BOTTOM_GOLD = {
  bottom: { style: 'medium', color: argb(COLORS.warmGold) },
};

// ============================================================================
// REUSABLE COMPONENTS — every tab uses these
// ============================================================================

/**
 * Premium top bar (rows 1-4):
 *   Row 1 (32px): wordmark band — charcoal background, white text
 *   Row 2 (54px): 6 KPI tiles — white background, label / value / delta
 *   Row 3 (22px): warm-gold accent banner
 *   Row 4 (28px): tab subtitle/breadcrumb
 */
function addTopBar(sheet, tabName, tabSubtitle, kpiData) {
  // === Row 1: wordmark band ===
  sheet.mergeCells('A1:C1');
  const wordmark = sheet.getCell('A1');
  wordmark.value = '✦ Premium Finance Studio';
  wordmark.font = { name: 'Inter', size: 11, bold: true, color: argb(COLORS.white) };
  wordmark.fill = FILLS.charcoal;
  wordmark.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

  sheet.mergeCells('D1:I1');
  const product = sheet.getCell('D1');
  product.value = 'Budget Tracker — AI Edition';
  product.font = { name: 'Inter', size: 12, bold: true, color: argb(COLORS.white) };
  product.fill = FILLS.charcoal;
  product.alignment = { vertical: 'middle', horizontal: 'center' };

  sheet.mergeCells('J1:M1');
  const tab = sheet.getCell('J1');
  tab.value = tabName;
  tab.font = { name: 'Inter', size: 10, color: argb(COLORS.warmGoldLight) };
  tab.fill = FILLS.charcoal;
  tab.alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };

  sheet.getRow(1).height = 32;

  // === Row 2: 6 KPI tiles ===
  const tileRanges = ['A2:B2', 'C2:D2', 'E2:F2', 'G2:H2', 'I2:J2', 'K2:M2'];
  const tileLabels = kpiData.map(k => k.label);
  const tileValues = kpiData.map(k => k.value);
  const tileDeltas = kpiData.map(k => k.delta || '');

  tileRanges.forEach((range, i) => {
    sheet.mergeCells(range);
    const cell = sheet.getCell(range.split(':')[0]);
    cell.value = {
      richText: [
        { text: `${tileLabels[i]}\n`, font: FONTS.kpiLabel },
        { text: `${tileValues[i]}`,   font: FONTS.kpiValue },
        ...(tileDeltas[i]
          ? [{ text: `  ${tileDeltas[i]}`, font: { ...FONTS.kpiDelta, color: argb(COLORS.textMuted) } }]
          : []),
      ],
    };
    cell.alignment = { vertical: 'top', horizontal: 'left', indent: 1, wrapText: true };
    cell.fill = FILLS.white;
    cell.border = BORDER_THIN();
  });
  sheet.getRow(2).height = 54;

  // === Row 3: warm-gold banner ===
  sheet.mergeCells('A3:M3');
  const banner = sheet.getCell('A3');
  banner.value = '✦  Why a Spreadsheet, Not an App?   Your bank credentials never leave your bank. No Plaid. No data ever leaves your machine.';
  banner.font = FONTS.bannerWhite;
  banner.fill = FILLS.warmGold;
  banner.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(3).height = 22;

  // === Row 4: tab subtitle ===
  sheet.mergeCells('A4:M4');
  const subtitle = sheet.getCell('A4');
  subtitle.value = tabSubtitle || '';
  subtitle.font = FONTS.bodyMuted;
  subtitle.fill = FILLS.offWhite;
  subtitle.alignment = { vertical: 'middle', horizontal: 'left', indent: 2 };
  sheet.getRow(4).height = 24;

  // Freeze top 4 rows
  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];
}

/**
 * Section header with warm-gold underline accent.
 *   Row N:   Section title (Inter 13 bold)
 *   Row N+1: Subtitle / help text (Inter 10 italic muted)
 *   Row N+2: warm-gold accent line (height 4px) — automatic visual divider
 */
function addSectionHeader(sheet, startRow, title, subtitle, colSpan = 'A:M') {
  const [startCol, endCol] = colSpan.split(':');
  sheet.mergeCells(`${startCol}${startRow}:${endCol}${startRow}`);
  const titleCell = sheet.getCell(`${startCol}${startRow}`);
  titleCell.value = title;
  titleCell.font = FONTS.section;
  titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(startRow).height = 26;

  if (subtitle) {
    sheet.mergeCells(`${startCol}${startRow + 1}:${endCol}${startRow + 1}`);
    const subCell = sheet.getCell(`${startCol}${startRow + 1}`);
    subCell.value = subtitle;
    subCell.font = FONTS.bodyMuted;
    subCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getRow(startRow + 1).height = 18;
  }

  // warm-gold underline
  const underlineRow = subtitle ? startRow + 2 : startRow + 1;
  sheet.mergeCells(`${startCol}${underlineRow}:${endCol}${underlineRow}`);
  const underline = sheet.getCell(`${startCol}${underlineRow}`);
  underline.fill = FILLS.warmGold;
  sheet.getRow(underlineRow).height = 3;

  return underlineRow + 1; // next free row
}

/**
 * Callout box — ivory background, warm-gold left accent border, small icon.
 *   Pattern: 💡 Pro tip — short copy
 */
function addCallout(sheet, range, icon, title, body) {
  sheet.mergeCells(range);
  const cell = sheet.getCell(range.split(':')[0]);
  cell.value = {
    richText: [
      { text: `${icon}  ${title}\n`, font: { ...FONTS.bodyBold, size: 11 } },
      { text: body, font: { ...FONTS.body, size: 10, color: argb(COLORS.textSubtle) } },
    ],
  };
  cell.fill = FILLS.ivory;
  cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1, wrapText: true };
  cell.border = {
    left: { style: 'medium', color: argb(COLORS.warmGold) },
    top:    { style: 'thin', color: argb(COLORS.divider) },
    bottom: { style: 'thin', color: argb(COLORS.divider) },
    right:  { style: 'thin', color: argb(COLORS.divider) },
  };
}

/**
 * Table header row — charcoal band with white text.
 */
function addTableHeader(sheet, row, headers, cols) {
  cols.forEach((col, i) => {
    const cell = sheet.getCell(`${col}${row}`);
    cell.value = headers[i];
    cell.font = FONTS.headerWhite;
    cell.fill = FILLS.charcoal;
    cell.alignment = { vertical: 'middle', horizontal: i === headers.length - 1 ? 'right' : 'left', indent: 1 };
    cell.border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(row).height = 24;
}

/**
 * Footer band — appears at bottom of each tab.
 */
function addFooter(sheet, row) {
  sheet.mergeCells(`A${row}:M${row}`);
  const cell = sheet.getCell(`A${row}`);
  cell.fill = FILLS.warmGold;
  sheet.getRow(row).height = 3;

  sheet.mergeCells(`A${row + 1}:M${row + 1}`);
  const footerCell = sheet.getCell(`A${row + 1}`);
  footerCell.value = '✦  Premium Finance Studio  ·  Budget Tracker AI Edition v1.0  ·  budget-tracker.com  ·  Privacy-first. No Plaid. No app.';
  footerCell.font = FONTS.footer;
  footerCell.fill = FILLS.offWhite;
  footerCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(row + 1).height = 22;
}

/**
 * Set tab color
 */
function setTabColor(sheet, color) {
  sheet.properties.tabColor = argb(color);
}

/**
 * Set up sensible column widths
 */
function setupColumns(sheet, widths) {
  // widths is an object: { A: 3, B: 15, ... }
  Object.entries(widths).forEach(([col, w]) => {
    sheet.getColumn(col).width = w;
  });
}

// ============================================================================
// TAB BUILDERS
// ============================================================================

// ===== TAB 1: 🧭 Setup Wizard =====
function buildSetupWizard(workbook) {
  const sheet = workbook.addWorksheet('🧭 Setup Wizard');
  setTabColor(sheet, COLORS.warmGold);

  setupColumns(sheet, { A: 2, B: 32, C: 22, D: 5, E: 32, F: 22, G: 2, H: 12, I: 12, J: 12, K: 12, L: 12, M: 12 });

  addTopBar(sheet, '🧭 Setup Wizard', 'Welcome — five questions to anchor your dashboard.', [
    { label: 'METHOD',        value: '50/30/20' },
    { label: 'REGION',        value: 'US' },
    { label: 'INCOME',        value: '$5,200' },
    { label: 'HOUSEHOLD',     value: '1' },
    { label: 'TARGET SAVE',   value: '20%' },
    { label: 'HEALTH',        value: '— / 100' },
  ]);

  // Hero
  sheet.mergeCells('B6:F6');
  sheet.getCell('B6').value = 'Welcome — let\'s wire up your dashboard.';
  sheet.getCell('B6').font = FONTS.hero;
  sheet.getRow(6).height = 38;

  sheet.mergeCells('B7:F7');
  sheet.getCell('B7').value = 'Five questions. Three minutes. Every other tab in this workbook starts working the moment you finish.';
  sheet.getCell('B7').font = FONTS.bodyMuted;
  sheet.getRow(7).height = 20;

  // Section: Your Budget DNA
  let r = addSectionHeader(sheet, 9, 'Your Budget DNA', 'How you think about money. Switch any answer anytime — the rest of the workbook recalculates automatically.', 'B:F');

  // 5 questions in a 2-column layout (B-C for left, E-F for right)
  const questions = [
    {
      n: '1',
      title: 'Pick your budget method',
      help: '50/30/20 = needs / wants / savings. Zero-Based = every dollar assigned. Envelope = category limits. Pay-Yourself-First = savings first, then spend the rest.',
      labelCell: 'B', inputCell: 'C',
      label: 'Method',
      value: '50/30/20',
      validation: '"50/30/20,Zero-Based,Envelope,Pay-Yourself-First"',
      format: '@',
    },
    {
      n: '2',
      title: 'Region (for tax + currency)',
      help: 'Drives mileage rates (US IRS 67¢/mi), tax-deduction categories, currency symbol. Multi-currency support in Pro.',
      labelCell: 'E', inputCell: 'F',
      label: 'Region',
      value: 'US',
      validation: '"US,UK,CA,AU"',
      format: '@',
    },
    {
      n: '3',
      title: 'Monthly income (after tax)',
      help: 'Take-home after federal/state/local tax. Include all sources — salary, freelance, dividends, side income.',
      labelCell: 'B', inputCell: 'C',
      label: 'Income $/month',
      value: 5200,
      format: '"$"#,##0',
    },
    {
      n: '4',
      title: 'Household size',
      help: 'People your budget covers (you + dependents). Drives per-capita benchmarks + emergency fund calculations.',
      labelCell: 'E', inputCell: 'F',
      label: 'People',
      value: 1,
      format: '#,##0',
    },
    {
      n: '5',
      title: 'Target savings rate',
      help: 'What % of income you aim to save. 10% = minimum. 20% = solid. 40%+ = aggressive FIRE-track.',
      labelCell: 'B', inputCell: 'C',
      label: 'Target % of income',
      value: 0.20,
      format: '0%',
    },
  ];

  // Lay them out in a 3-row × 2-col grid
  const positions = [
    { row: r + 1, col: 'B' }, { row: r + 1, col: 'E' },
    { row: r + 8, col: 'B' }, { row: r + 8, col: 'E' },
    { row: r + 15, col: 'B' },
  ];

  questions.forEach((q, i) => {
    const baseRow = positions[i].row;
    const baseCol = positions[i].col;
    const nextCol = String.fromCharCode(baseCol.charCodeAt(0) + 1);

    // Number badge
    sheet.getCell(`${baseCol}${baseRow}`).value = q.n;
    sheet.getCell(`${baseCol}${baseRow}`).font = { name: 'Inter', size: 28, bold: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`${baseCol}${baseRow}`).alignment = { vertical: 'top', horizontal: 'left' };
    sheet.mergeCells(`${baseCol}${baseRow}:${baseCol}${baseRow + 1}`);

    // Title (offset right of number)
    sheet.mergeCells(`${nextCol}${baseRow}:${String.fromCharCode(nextCol.charCodeAt(0) + 1)}${baseRow}`);
    sheet.getCell(`${nextCol}${baseRow}`).value = q.title;
    sheet.getCell(`${nextCol}${baseRow}`).font = FONTS.section;
    sheet.getCell(`${nextCol}${baseRow}`).alignment = { vertical: 'middle', horizontal: 'left' };

    // Help
    sheet.mergeCells(`${nextCol}${baseRow + 1}:${String.fromCharCode(nextCol.charCodeAt(0) + 1)}${baseRow + 1}`);
    sheet.getCell(`${nextCol}${baseRow + 1}`).value = q.help;
    sheet.getCell(`${nextCol}${baseRow + 1}`).font = FONTS.bodyMuted;
    sheet.getCell(`${nextCol}${baseRow + 1}`).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    sheet.getRow(baseRow + 1).height = 30;

    // Label + Input
    sheet.getCell(`${nextCol}${baseRow + 3}`).value = q.label;
    sheet.getCell(`${nextCol}${baseRow + 3}`).font = FONTS.smallCaps;
    sheet.getCell(`${nextCol}${baseRow + 3}`).alignment = { vertical: 'middle', horizontal: 'left' };

    const inputCell = sheet.getCell(`${String.fromCharCode(nextCol.charCodeAt(0) + 1)}${baseRow + 3}`);
    inputCell.value = q.value;
    inputCell.font = { ...FONTS.bodyBold, size: 13 };
    inputCell.numFmt = q.format;
    inputCell.fill = FILLS.ivory;
    inputCell.border = {
      left: { style: 'medium', color: argb(COLORS.warmGold) },
      top:    { style: 'thin', color: argb(COLORS.charcoal) },
      bottom: { style: 'thin', color: argb(COLORS.charcoal) },
      right:  { style: 'thin', color: argb(COLORS.charcoal) },
    };
    inputCell.alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };

    if (q.validation) {
      inputCell.dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: [q.validation],
        showInputMessage: true,
        promptTitle: q.title,
        prompt: q.help,
      };
    }
    sheet.getRow(baseRow + 3).height = 28;
  });

  // Result preview callout — positioned BELOW q5 (which ends at row 30)
  addCallout(sheet,
    'B33:G34',
    '💡',
    'Once you finish, here\'s what gets unlocked:',
    'Dashboard auto-populates · Health Score starts computing · Budget vs Actual table tracks against your numbers · AI Money Advisor tab activates (AI Edition) · Cash Flow Forecast projects 90 days forward.');
  sheet.getRow(33).height = 28;
  sheet.getRow(34).height = 28;

  // Footer
  addFooter(sheet, 37);

  // Named ranges (cross-tab references)
  // Per Setup Wizard layout: r=12, questions render at rows r+1, r+8, r+15.
  // Input cells are at: question's baseRow+3 in column (nextCol of nextCol).
  //   q1 (B@13) input → D16, q2 (E@13) input → G16
  //   q3 (B@20) input → D23, q4 (E@20) input → G23
  //   q5 (B@27) input → D30
  workbook.definedNames.add(`'🧭 Setup Wizard'!$D$16`, 'BudgetMethod');
  workbook.definedNames.add(`'🧭 Setup Wizard'!$G$16`, 'Region');
  workbook.definedNames.add(`'🧭 Setup Wizard'!$D$23`, 'MonthlyIncome');
  workbook.definedNames.add(`'🧭 Setup Wizard'!$G$23`, 'HouseholdSize');
  workbook.definedNames.add(`'🧭 Setup Wizard'!$D$30`, 'TargetSavingsRate');
}

// ===== TAB 2: 🏠 Dashboard =====
function buildDashboard(workbook) {
  const sheet = workbook.addWorksheet('🏠 Dashboard');
  setTabColor(sheet, COLORS.charcoal);

  setupColumns(sheet, { A: 2, B: 18, C: 12, D: 12, E: 16, F: 8, G: 18, H: 12, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, '🏠 Dashboard', 'Your money at a glance — updates the moment you log an expense.', [
    { label: 'INCOME M-T-D',     value: { formula: 'TEXT(SUM(\'💵 Income Tracker\'!D8:D50),"$#,##0")' } },
    { label: 'EXPENSES M-T-D',   value: { formula: 'TEXT(SUM(\'💸 Expense Tracker\'!D8:D50),"$#,##0")' } },
    { label: 'NET FLOW',         value: { formula: 'TEXT(SUM(\'💵 Income Tracker\'!D8:D50)-SUM(\'💸 Expense Tracker\'!D8:D50),"$#,##0;[Red]-$#,##0")' } },
    { label: 'DAY OF MONTH',     value: { formula: 'DAY(TODAY())' } },
    { label: 'TOP CATEGORY',     value: 'Groceries' },
    { label: 'HEALTH SCORE',     value: { formula: '\'🏆 Financial Health Score\'!B7&" / 100"' } },
  ]);

  // Section 1: Hero Health Score
  let r = addSectionHeader(sheet, 6, 'Financial Health Score', 'A composite of 5 sub-scores: savings rate · emergency fund · debt-to-income · credit utilization · on-time payment.', 'B:F');

  // Big score number
  sheet.mergeCells(`B${r + 1}:C${r + 4}`);
  sheet.getCell(`B${r + 1}`).value = { formula: "'🏆 Financial Health Score'!B7" };
  sheet.getCell(`B${r + 1}`).font = FONTS.scoreHuge;
  sheet.getCell(`B${r + 1}`).alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getCell(`B${r + 1}`).fill = FILLS.ivory;
  sheet.getCell(`B${r + 1}`).border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell(`B${r + 1}`).numFmt = '0';

  // Score scale text
  sheet.getCell(`D${r + 1}`).value = '/ 100';
  sheet.getCell(`D${r + 1}`).font = FONTS.scoreUnit;
  sheet.getCell(`D${r + 1}`).alignment = { vertical: 'middle' };

  sheet.getCell(`D${r + 2}`).value = { formula: 'IF(\'🏆 Financial Health Score\'!B7>=80,"Healthy",IF(\'🏆 Financial Health Score\'!B7>=60,"On Track",IF(\'🏆 Financial Health Score\'!B7>=40,"At Risk","Critical")))' };
  sheet.getCell(`D${r + 2}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.success) };
  sheet.getCell(`D${r + 2}`).alignment = { vertical: 'middle' };

  sheet.mergeCells(`E${r + 1}:F${r + 4}`);
  sheet.getCell(`E${r + 1}`).value = { richText: [
    { text: 'What the score means\n', font: FONTS.smallCaps },
    { text: '\n', font: FONTS.body },
    { text: '80-100 — Healthy. Margin for life. Aggressive savings working.\n', font: FONTS.body },
    { text: '60-79  — On track. Solid habits forming. Tighten 1-2 areas.\n', font: FONTS.body },
    { text: '40-59  — At risk. Specific sub-scores need attention.\n', font: FONTS.body },
    { text: '0-39   — Critical. Focus on emergency fund + debt-to-income first.', font: FONTS.body },
  ]};
  sheet.getCell(`E${r + 1}`).alignment = { vertical: 'top', horizontal: 'left', wrapText: true, indent: 1 };

  r += 6;

  // Section 2: Budget vs Actual — RIGHT side of the same band
  let bvaR = addSectionHeader(sheet, 6, 'Budget vs. Actual — this month', 'Tracks every category against the budget you set in 📂 Expense Categories. Auto-updates from 💸 Expense Tracker.', 'G:L');

  const bvaCols = ['G', 'H', 'I', 'J'];
  addTableHeader(sheet, bvaR + 1, ['Category', 'Budget', 'Actual', 'Status'], bvaCols);

  const categories = [
    { name: 'Groceries',     budget: 400 },
    { name: 'Dining Out',    budget: 150 },
    { name: 'Utilities',     budget: 280 },
    { name: 'Subscriptions', budget: 60  },
    { name: 'Transport',     budget: 120 },
    { name: 'Personal',      budget: 100 },
    { name: 'Entertainment', budget: 80  },
    { name: 'Healthcare',    budget: 50  },
  ];

  categories.forEach((c, i) => {
    const row = bvaR + 2 + i;
    sheet.getCell(`G${row}`).value = c.name;
    sheet.getCell(`G${row}`).font = FONTS.body;
    sheet.getCell(`G${row}`).border = BORDER_THIN();

    sheet.getCell(`H${row}`).value = c.budget;
    sheet.getCell(`H${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`H${row}`).font = FONTS.body;
    sheet.getCell(`H${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`H${row}`).border = BORDER_THIN();

    sheet.getCell(`I${row}`).value = { formula: `SUMIFS('💸 Expense Tracker'!D8:D50,'💸 Expense Tracker'!C8:C50,"${c.name}")` };
    sheet.getCell(`I${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${row}`).font = FONTS.body;
    sheet.getCell(`I${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`I${row}`).border = BORDER_THIN();

    sheet.getCell(`J${row}`).value = { formula: `IF(I${row}>H${row},"🔴 Over",IF(I${row}>H${row}*0.9,"🟡 Approaching","✅ On Track"))` };
    sheet.getCell(`J${row}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`J${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`J${row}`).border = BORDER_THIN();
  });

  // CF on status
  sheet.addConditionalFormatting({
    ref: `J${bvaR + 2}:J${bvaR + 2 + categories.length - 1}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Over',        priority: 1, style: { fill: FILLS.alert, font: { color: argb(COLORS.white), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Approaching', priority: 2, style: { fill: FILLS.warning, font: { color: argb(COLORS.white), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'On Track',    priority: 3, style: { fill: FILLS.success, font: { color: argb(COLORS.white), bold: true } } },
    ],
  });

  // Section 3: This month's pattern (insights callouts)
  const insightsR = Math.max(r, bvaR + 2 + categories.length + 1) + 2;
  addSectionHeader(sheet, insightsR, 'This month\'s patterns', 'Cross-tab insights computed automatically.', 'B:L');

  addCallout(sheet,
    `B${insightsR + 3}:E${insightsR + 4}`,
    '💡',
    'Pro tip — Try the Smart Spending Advisor prompt',
    'AI Money Advisor → page 3 → paste your last-30-days expense data → get 3 ranked spending cuts.');

  addCallout(sheet,
    `G${insightsR + 3}:L${insightsR + 4}`,
    '📊',
    'Chart suggestion — Budget vs. Actual',
    'Highlight G' + (bvaR + 1) + ':J' + (bvaR + 1 + categories.length) + ' → Insert → Chart → Bar chart for a visual view.');

  sheet.getRow(insightsR + 3).height = 28;
  sheet.getRow(insightsR + 4).height = 28;

  // Footer
  addFooter(sheet, insightsR + 7);
}

// ===== TAB 3: 📂 Expense Categories =====
function buildExpenseCategories(workbook) {
  const sheet = workbook.addWorksheet('📂 Expense Categories');
  setTabColor(sheet, COLORS.warmGold);

  setupColumns(sheet, { A: 2, B: 22, C: 18, D: 14, E: 14, F: 14, G: 14, H: 26, I: 14, J: 8, K: 8, L: 8, M: 2 });

  addTopBar(sheet, '📂 Expense Categories', 'The master list. Edit categories or budgets here — Dashboard + Expense Tracker pick up changes automatically.', [
    { label: 'METHOD',         value: '50/30/20' },
    { label: 'TOTAL BUDGET',   value: { formula: 'TEXT(SUM(D8:D20),"$#,##0")' } },
    { label: 'CATEGORIES',     value: { formula: 'COUNTA(B8:B20)' } },
    { label: 'NEEDS %',        value: { formula: 'TEXT(SUMIFS(D8:D20,E8:E20,"Need")/SUM(D8:D20),"0%")' } },
    { label: 'WANTS %',        value: { formula: 'TEXT(SUMIFS(D8:D20,E8:E20,"Want")/SUM(D8:D20),"0%")' } },
    { label: 'SAVINGS %',      value: { formula: 'TEXT(SUMIFS(D8:D20,E8:E20,"Savings")/SUM(D8:D20),"0%")' } },
  ]);

  let r = addSectionHeader(sheet, 6, 'Master category list', 'Edit names, budgets, and Need/Want/Savings classification. Drives the Budget vs Actual table on Dashboard.');

  addTableHeader(sheet, r + 1, ['Category', 'Type (Icon)', 'Monthly Budget', 'Type', '50/30/20 Class', 'Why It Matters', 'Color Tone', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

  const cats = [
    { name: 'Groceries',      icon: '🥬', budget: 400, type: 'Need',    cls: 'Need',    why: 'Fixed need. Inflation-tracked.',           tone: 'Sage' },
    { name: 'Dining Out',     icon: '🍽️', budget: 150, type: 'Want',    cls: 'Want',    why: 'Discretionary. Often overspent.',          tone: 'Amber' },
    { name: 'Utilities',      icon: '💡', budget: 280, type: 'Need',    cls: 'Need',    why: 'Fixed need. Seasonal variance.',            tone: 'Charcoal' },
    { name: 'Rent / Mortgage', icon: '🏠', budget: 1700, type: 'Need',  cls: 'Need',    why: 'Largest single fixed cost.',                tone: 'Charcoal' },
    { name: 'Subscriptions',  icon: '📺', budget: 60,  type: 'Want',    cls: 'Want',    why: 'Sneaky leak. Audit quarterly.',            tone: 'Amber' },
    { name: 'Transport',      icon: '🚗', budget: 120, type: 'Need',    cls: 'Need',    why: 'Need. Track gas/transit/parking.',         tone: 'Charcoal' },
    { name: 'Personal',       icon: '🛍️', budget: 100, type: 'Want',    cls: 'Want',    why: 'Clothing/grooming/gifts. Set + forget.',   tone: 'Amber' },
    { name: 'Entertainment',  icon: '🎬', budget: 80,  type: 'Want',    cls: 'Want',    why: 'Movies/events/games. Stay intentional.',   tone: 'Amber' },
    { name: 'Healthcare',     icon: '🏥', budget: 50,  type: 'Need',    cls: 'Need',    why: 'Co-pays + meds + monthly avg.',           tone: 'Charcoal' },
    { name: 'Education',      icon: '📚', budget: 50,  type: 'Need',    cls: 'Savings', why: 'Investment in future earnings.',          tone: 'Gold' },
    { name: 'Emergency Fund', icon: '🆘', budget: 260, type: 'Savings', cls: 'Savings', why: 'First savings priority. 3-6mo runway.',   tone: 'Gold' },
    { name: 'Investing',      icon: '📈', budget: 400, type: 'Savings', cls: 'Savings', why: 'Long-term wealth. Auto-invest.',          tone: 'Gold' },
    { name: 'Other',          icon: '📌', budget: 50,  type: 'Want',    cls: 'Want',    why: 'Buffer for uncategorized.',                tone: 'Gray' },
  ];

  cats.forEach((c, i) => {
    const row = r + 2 + i;
    sheet.getCell(`B${row}`).value = c.name;
    sheet.getCell(`B${row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${row}`).border = BORDER_THIN();
    sheet.getCell(`B${row}`).fill = FILLS.white;

    sheet.getCell(`C${row}`).value = c.icon;
    sheet.getCell(`C${row}`).font = { name: 'Inter', size: 16 };
    sheet.getCell(`C${row}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${row}`).border = BORDER_THIN();
    sheet.getCell(`C${row}`).fill = FILLS.white;

    sheet.getCell(`D${row}`).value = c.budget;
    sheet.getCell(`D${row}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${row}`).font = FONTS.body;
    sheet.getCell(`D${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${row}`).border = BORDER_THIN();
    sheet.getCell(`D${row}`).fill = FILLS.white;

    sheet.getCell(`E${row}`).value = c.type;
    sheet.getCell(`E${row}`).font = FONTS.body;
    sheet.getCell(`E${row}`).border = BORDER_THIN();
    sheet.getCell(`E${row}`).fill = FILLS.white;
    sheet.getCell(`E${row}`).dataValidation = {
      type: 'list',
      formulae: ['"Need,Want,Savings"'],
    };

    sheet.getCell(`F${row}`).value = c.cls;
    sheet.getCell(`F${row}`).font = FONTS.body;
    sheet.getCell(`F${row}`).border = BORDER_THIN();
    sheet.getCell(`F${row}`).fill = FILLS.white;
    sheet.getCell(`F${row}`).alignment = { horizontal: 'center' };

    sheet.getCell(`G${row}`).value = c.why;
    sheet.getCell(`G${row}`).font = FONTS.bodyMuted;
    sheet.getCell(`G${row}`).border = BORDER_THIN();
    sheet.getCell(`G${row}`).fill = FILLS.white;
    sheet.getCell(`G${row}`).alignment = { wrapText: true };

    sheet.getCell(`H${row}`).value = c.tone;
    sheet.getCell(`H${row}`).font = FONTS.small;
    sheet.getCell(`H${row}`).border = BORDER_THIN();
    sheet.getCell(`H${row}`).fill = FILLS.white;

    sheet.getCell(`I${row}`).value = '';
    sheet.getCell(`I${row}`).border = BORDER_THIN();
    sheet.getCell(`I${row}`).fill = FILLS.white;
  });

  // CF on Type column — colored by Need/Want/Savings
  const typeRange = `E${r + 2}:E${r + 2 + cats.length - 1}`;
  sheet.addConditionalFormatting({
    ref: typeRange,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Need',    priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Want',    priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Savings', priority: 3, style: { fill: FILLS.warmGoldLight ? { type: 'pattern', pattern: 'solid', fgColor: argb(COLORS.warmGoldLight) } : FILLS.warmGold, font: { color: argb(COLORS.warmGold), bold: true } } },
    ],
  });

  const insightsR = r + 2 + cats.length + 1;
  addCallout(sheet, `B${insightsR + 1}:I${insightsR + 2}`,
    '💡',
    'How the 50/30/20 split lands for you',
    'Top bar shows your auto-calculated Need %, Want %, Savings % from this table. Adjust budgets to rebalance — the Dashboard recalculates in real time.');
  sheet.getRow(insightsR + 1).height = 28;
  sheet.getRow(insightsR + 2).height = 28;

  addFooter(sheet, insightsR + 5);
}

// ===== TAB 4: 💵 Income Tracker =====
function buildIncomeTracker(workbook) {
  const sheet = workbook.addWorksheet('💵 Income Tracker');
  setTabColor(sheet, COLORS.success);

  setupColumns(sheet, { A: 2, B: 12, C: 24, D: 14, E: 12, F: 16, G: 12, H: 28, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, '💵 Income Tracker', 'Every dollar in — by source, by date. Tax-deductible flag for year-end prep.', [
    { label: 'M-T-D INCOME',  value: { formula: 'TEXT(SUM(D8:D50),"$#,##0")' } },
    { label: 'SOURCES',       value: { formula: 'COUNTA(C8:C50)' } },
    { label: 'BIGGEST',       value: { formula: 'TEXT(MAX(D8:D50),"$#,##0")' } },
    { label: 'AVG / ENTRY',   value: { formula: 'TEXT(AVERAGE(D8:D50),"$#,##0")' } },
    { label: 'DEDUCTIBLE',    value: { formula: 'TEXT(SUMIFS(D8:D50,E8:E50,"✅"),"$#,##0")' } },
    { label: 'TARGET',        value: { formula: 'TEXT(MonthlyIncome,"$#,##0")' } },
  ]);

  let r = addSectionHeader(sheet, 6, 'Monthly income log', 'Each row = one income event. Date · Source · Amount · Tax-Deductible? · Notes.');

  addTableHeader(sheet, r + 1, ['Date', 'Source', 'Amount', 'Tax-Deductible', 'Type', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G']);

  const incomeRows = [
    { date: '2026-04-01', source: 'TechCo Salary',           amount: 4500, taxDed: false, type: 'Salary',   notes: 'Bi-weekly net 1 of 2' },
    { date: '2026-04-08', source: 'Freelance — Acme Corp',   amount: 800,  taxDed: false, type: 'Freelance', notes: 'Logo project — invoice paid' },
    { date: '2026-04-15', source: 'TechCo Salary',           amount: 4500, taxDed: false, type: 'Salary',   notes: 'Bi-weekly net 2 of 2' },
    { date: '2026-04-18', source: 'Dividends — SCHD',        amount: 87,   taxDed: false, type: 'Investment', notes: 'Q1 dividend payout' },
    { date: '2026-04-22', source: 'Quarterly Tax Refund',    amount: 412,  taxDed: false, type: 'Refund',   notes: 'NY state' },
    { date: '2026-04-28', source: 'Cashback — Chase Sapphire', amount: 24, taxDed: false, type: 'Cashback', notes: 'Q1 rotating category bonus' },
  ];

  incomeRows.forEach((row, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = new Date(row.date);
    sheet.getCell(`B${ri}`).numFmt = 'mmm d';
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.white;

    sheet.getCell(`C${ri}`).value = row.source;
    sheet.getCell(`C${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).fill = FILLS.white;

    sheet.getCell(`D${ri}`).value = row.amount;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).fill = FILLS.white;

    sheet.getCell(`E${ri}`).value = row.taxDed ? '✅' : '—';
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).dataValidation = { type: 'list', formulae: ['"✅,—"'] };

    sheet.getCell(`F${ri}`).value = row.type;
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).dataValidation = { type: 'list', formulae: ['"Salary,Freelance,Investment,Refund,Cashback,Gift,Other"'] };

    sheet.getCell(`G${ri}`).value = row.notes;
    sheet.getCell(`G${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).fill = FILLS.white;
  });

  // Add data validation + formats for empty rows (up to row 50)
  for (let ri = r + 2 + incomeRows.length; ri <= 50; ri++) {
    sheet.getCell(`B${ri}`).numFmt = 'mmm d';
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).dataValidation = { type: 'list', formulae: ['"✅,—"'] };
    sheet.getCell(`F${ri}`).dataValidation = { type: 'list', formulae: ['"Salary,Freelance,Investment,Refund,Cashback,Gift,Other"'] };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
  }

  // Total row
  const totalR = r + 2 + incomeRows.length + 1;
  sheet.getCell(`C${totalR}`).value = 'MONTH TOTAL';
  sheet.getCell(`C${totalR}`).font = FONTS.smallCaps;
  sheet.getCell(`C${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`D${totalR}`).value = { formula: `SUM(D${r + 2}:D${r + 2 + incomeRows.length - 1})` };
  sheet.getCell(`D${totalR}`).numFmt = '"$"#,##0';
  sheet.getCell(`D${totalR}`).font = { name: 'Inter', size: 16, bold: true, color: argb(COLORS.success) };
  sheet.getCell(`D${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`D${totalR}`).fill = FILLS.ivory;
  sheet.getCell(`D${totalR}`).border = { top: { style: 'medium', color: argb(COLORS.success) } };

  // Callout
  addCallout(sheet, `B${totalR + 2}:G${totalR + 3}`,
    '💡',
    'Tax-Deductible? toggle',
    'For freelancers + small-biz owners: tap the toggle on income that should appear on your year-end deductions report. Mileage, expenses, and home-office costs go in the Expense Tracker.');
  sheet.getRow(totalR + 2).height = 26;
  sheet.getRow(totalR + 3).height = 26;

  addFooter(sheet, totalR + 6);
}

// ===== TAB 5: 💸 Expense Tracker =====
function buildExpenseTracker(workbook) {
  const sheet = workbook.addWorksheet('💸 Expense Tracker');
  setTabColor(sheet, COLORS.warning);

  setupColumns(sheet, { A: 2, B: 10, C: 16, D: 10, E: 22, F: 12, G: 10, H: 26, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, '💸 Expense Tracker', 'Every dollar out — by date, by category. Drives Budget vs Actual on Dashboard.', [
    { label: 'M-T-D EXPENSE', value: { formula: 'TEXT(SUM(D8:D60),"$#,##0")' } },
    { label: 'ENTRIES',       value: { formula: 'COUNTA(C8:C60)' } },
    { label: 'AVG / ENTRY',   value: { formula: 'TEXT(AVERAGE(D8:D60),"$#,##0")' } },
    { label: 'BIGGEST',       value: { formula: 'TEXT(MAX(D8:D60),"$#,##0")' } },
    { label: 'TOP CAT',       value: 'Groceries' },
    { label: 'BUDGET',        value: { formula: 'TEXT(SUM(\'📂 Expense Categories\'!D8:D20),"$#,##0")' } },
  ]);

  let r = addSectionHeader(sheet, 6, 'Daily expense log', 'Each row = one transaction. Categories driven by 📂 Expense Categories.');

  addTableHeader(sheet, r + 1, ['Date', 'Category', 'Amount', 'Vendor', 'Payment', 'Refund?', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  // 30+ realistic expense rows
  const expenses = [
    { date: '2026-04-02', cat: 'Groceries',     amt: 87.32,  vendor: 'Whole Foods',       pay: 'Debit',   refund: false, notes: 'Weekly grocery run' },
    { date: '2026-04-03', cat: 'Transport',     amt: 4.50,   vendor: 'NYC Metro',         pay: 'Debit',   refund: false, notes: 'Single ride' },
    { date: '2026-04-04', cat: 'Dining Out',    amt: 11.50,  vendor: 'Uber Eats',         pay: 'Credit',  refund: false, notes: 'Lunch — slow Friday' },
    { date: '2026-04-04', cat: 'Subscriptions', amt: 9.99,   vendor: 'Netflix',           pay: 'Credit',  refund: false, notes: 'Monthly' },
    { date: '2026-04-05', cat: 'Dining Out',    amt: 9.20,   vendor: 'Uber Eats',         pay: 'Credit',  refund: false, notes: 'Lunch' },
    { date: '2026-04-06', cat: 'Personal',      amt: 34.00,  vendor: 'CVS',               pay: 'Debit',   refund: false, notes: 'Toiletries + Rx' },
    { date: '2026-04-07', cat: 'Dining Out',    amt: 14.10,  vendor: 'Uber Eats',         pay: 'Credit',  refund: false, notes: 'Pad thai' },
    { date: '2026-04-08', cat: 'Healthcare',    amt: 25.00,  vendor: 'CVS Pharmacy',      pay: 'HSA',     refund: false, notes: 'Co-pay — annual physical' },
    { date: '2026-04-09', cat: 'Utilities',     amt: 79.99,  vendor: 'Spectrum',          pay: 'Auto-pay', refund: false, notes: 'Internet — April' },
    { date: '2026-04-10', cat: 'Groceries',     amt: 42.18,  vendor: 'Trader Joe\'s',     pay: 'Debit',   refund: false, notes: '' },
    { date: '2026-04-11', cat: 'Entertainment', amt: 18.00,  vendor: 'AMC Theatres',      pay: 'Credit',  refund: false, notes: 'Movie night' },
    { date: '2026-04-12', cat: 'Subscriptions', amt: 16.99,  vendor: 'Spotify Family',    pay: 'Credit',  refund: false, notes: '⚠️ Auto-renewed: was $9.99' },
    { date: '2026-04-13', cat: 'Transport',     amt: 33.00,  vendor: 'NYC Metro',         pay: 'Debit',   refund: false, notes: 'Weekly pass' },
    { date: '2026-04-14', cat: 'Dining Out',    amt: 28.40,  vendor: 'Joe\'s Pizza',      pay: 'Cash',    refund: false, notes: 'Dinner with friend' },
    { date: '2026-04-15', cat: 'Utilities',     amt: 134.20, vendor: 'ConEd Electric',    pay: 'Auto-pay', refund: false, notes: 'April electric — heat lingering' },
    { date: '2026-04-16', cat: 'Personal',      amt: 22.00,  vendor: 'Sephora',           pay: 'Credit',  refund: false, notes: '' },
    { date: '2026-04-17', cat: 'Groceries',     amt: 124.00, vendor: 'Whole Foods',       pay: 'Debit',   refund: false, notes: 'Big trip — meal prep' },
    { date: '2026-04-18', cat: 'Dining Out',    amt: 12.40,  vendor: 'Uber Eats',         pay: 'Credit',  refund: false, notes: 'Late dinner' },
    { date: '2026-04-19', cat: 'Entertainment', amt: 32.00,  vendor: 'Park Slope Concert',pay: 'Cash',    refund: false, notes: 'Local show' },
    { date: '2026-04-20', cat: 'Healthcare',    amt: 18.00,  vendor: 'Walgreens',         pay: 'HSA',     refund: false, notes: 'Allergy meds' },
    { date: '2026-04-21', cat: 'Subscriptions', amt: 14.99,  vendor: 'NYT',               pay: 'Credit',  refund: false, notes: 'Annual sub' },
    { date: '2026-04-22', cat: 'Groceries',     amt: 28.50,  vendor: 'Bodega',            pay: 'Cash',    refund: false, notes: 'Quick pickup' },
    { date: '2026-04-23', cat: 'Transport',     amt: 17.80,  vendor: 'Lyft',              pay: 'Credit',  refund: false, notes: 'Late night home' },
    { date: '2026-04-24', cat: 'Personal',      amt: 8.00,   vendor: 'Etsy',              pay: 'Credit',  refund: false, notes: 'Sticker pack' },
    { date: '2026-04-25', cat: 'Utilities',     amt: 58.00,  vendor: 'Verizon Mobile',    pay: 'Auto-pay', refund: false, notes: 'April phone' },
    { date: '2026-04-26', cat: 'Dining Out',    amt: 16.80,  vendor: 'Sweetgreen',        pay: 'Credit',  refund: false, notes: 'Office lunch' },
    { date: '2026-04-27', cat: 'Healthcare',    amt: 7.00,   vendor: 'Drip Coffee Co.',   pay: 'Debit',   refund: true,  notes: 'Wrong order — refund pending' },
    { date: '2026-04-28', cat: 'Groceries',     amt: 18.40,  vendor: 'Whole Foods',       pay: 'Debit',   refund: false, notes: 'Restock' },
    { date: '2026-04-29', cat: 'Entertainment', amt: 9.99,   vendor: 'Apple TV+',         pay: 'Credit',  refund: false, notes: 'Monthly' },
    { date: '2026-04-30', cat: 'Personal',      amt: 12.50,  vendor: 'Duane Reade',       pay: 'Debit',   refund: false, notes: '' },
  ];

  const cats = ['Groceries', 'Dining Out', 'Utilities', 'Rent / Mortgage', 'Subscriptions', 'Transport', 'Personal', 'Entertainment', 'Healthcare', 'Education', 'Emergency Fund', 'Investing', 'Other'];

  expenses.forEach((row, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = new Date(row.date);
    sheet.getCell(`B${ri}`).numFmt = 'mmm d';
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.white;

    sheet.getCell(`C${ri}`).value = row.cat;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: [`"${cats.join(',')}"`] };

    sheet.getCell(`D${ri}`).value = row.amt;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).fill = FILLS.white;

    sheet.getCell(`E${ri}`).value = row.vendor;
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).fill = FILLS.white;

    sheet.getCell(`F${ri}`).value = row.pay;
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).dataValidation = { type: 'list', formulae: ['"Cash,Debit,Credit,Auto-pay,HSA,Other"'] };

    sheet.getCell(`G${ri}`).value = row.refund ? '↩️' : '—';
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).dataValidation = { type: 'list', formulae: ['"↩️,—"'] };

    sheet.getCell(`H${ri}`).value = row.notes;
    sheet.getCell(`H${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
    sheet.getCell(`H${ri}`).fill = FILLS.white;
  });

  // Pre-format empty rows
  for (let ri = r + 2 + expenses.length; ri <= 60; ri++) {
    sheet.getCell(`B${ri}`).numFmt = 'mmm d';
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: [`"${cats.join(',')}"`] };
    sheet.getCell(`F${ri}`).dataValidation = { type: 'list', formulae: ['"Cash,Debit,Credit,Auto-pay,HSA,Other"'] };
    sheet.getCell(`G${ri}`).dataValidation = { type: 'list', formulae: ['"↩️,—"'] };
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
  }

  // Total row
  const totalR = r + 2 + expenses.length + 1;
  sheet.getCell(`C${totalR}`).value = 'MONTH TOTAL';
  sheet.getCell(`C${totalR}`).font = FONTS.smallCaps;
  sheet.getCell(`C${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`D${totalR}`).value = { formula: `SUM(D${r + 2}:D${r + 2 + expenses.length - 1})` };
  sheet.getCell(`D${totalR}`).numFmt = '"$"#,##0.00';
  sheet.getCell(`D${totalR}`).font = { name: 'Inter', size: 16, bold: true, color: argb(COLORS.alert) };
  sheet.getCell(`D${totalR}`).alignment = { horizontal: 'right' };
  sheet.getCell(`D${totalR}`).fill = FILLS.ivory;
  sheet.getCell(`D${totalR}`).border = { top: { style: 'medium', color: argb(COLORS.alert) } };

  addCallout(sheet, `B${totalR + 2}:H${totalR + 3}`,
    '💡',
    'Refund? toggle',
    'Tap ↩️ when you spot a refund pending. The Refund Tracker tab (Pro) lists everything outstanding so nothing falls through the cracks.');
  sheet.getRow(totalR + 2).height = 26;
  sheet.getRow(totalR + 3).height = 26;

  addFooter(sheet, totalR + 6);
}

// ===== TAB 6: 🔁 Recurring Templates =====
function buildRecurringTemplates(workbook) {
  const sheet = workbook.addWorksheet('🔁 Recurring Templates');
  setTabColor(sheet, COLORS.warmGold);

  setupColumns(sheet, { A: 2, B: 22, C: 16, D: 12, E: 14, F: 14, G: 28, H: 12, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, '🔁 Recurring Templates', 'Recurring income + bills set once. The Bill Calendar tab uses these templates.', [
    { label: 'TEMPLATES',     value: { formula: 'COUNTA(B8:B30)' } },
    { label: 'MONTHLY TOTAL', value: { formula: 'TEXT(SUM(D8:D30),"$#,##0")' } },
    { label: 'ACTIVE',        value: { formula: 'COUNTIF(H8:H30,"Active")' } },
    { label: 'PAUSED',        value: { formula: 'COUNTIF(H8:H30,"Paused")' } },
    { label: 'NEXT 7 DAYS',   value: '4 bills' },
    { label: 'ANNUAL',        value: { formula: 'TEXT(SUM(D8:D30)*12,"$#,##0")' } },
  ]);

  let r = addSectionHeader(sheet, 6, 'Recurring bills + subscriptions', 'Each row repeats every month on its scheduled day. Pause anytime.');

  addTableHeader(sheet, r + 1, ['Name', 'Category', 'Amount', 'Day of Month', 'Auto-pay', 'Notes', 'Status'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  const recurring = [
    { name: 'Rent',                  cat: 'Rent / Mortgage', amt: 1700, day: 1,  auto: 'ACH',     notes: 'Landlord — Citibank transfer',  status: 'Active' },
    { name: 'Spectrum Internet',     cat: 'Utilities',       amt: 79.99, day: 9, auto: 'Credit',  notes: '',                              status: 'Active' },
    { name: 'ConEd Electric',        cat: 'Utilities',       amt: 134,   day: 15, auto: 'Auto-pay', notes: 'Avg — varies seasonally',     status: 'Active' },
    { name: 'Verizon Mobile',        cat: 'Utilities',       amt: 58,    day: 25, auto: 'Auto-pay', notes: 'Single line',                 status: 'Active' },
    { name: 'Spotify Family',        cat: 'Subscriptions',   amt: 16.99, day: 12, auto: 'Credit',  notes: '⚠️ Auto-renewed up from $9.99', status: 'Active' },
    { name: 'Netflix',               cat: 'Subscriptions',   amt: 9.99,  day: 4,  auto: 'Credit',  notes: '',                              status: 'Active' },
    { name: 'New York Times',        cat: 'Subscriptions',   amt: 14.99, day: 21, auto: 'Credit',  notes: 'Annual — billed monthly',       status: 'Active' },
    { name: 'Apple TV+',             cat: 'Entertainment',   amt: 9.99,  day: 29, auto: 'Credit',  notes: '',                              status: 'Active' },
    { name: 'TechCo Salary',         cat: 'Income',          amt: 4500,  day: 1,  auto: 'ACH',     notes: 'Bi-weekly net 1',               status: 'Active' },
    { name: 'TechCo Salary',         cat: 'Income',          amt: 4500,  day: 15, auto: 'ACH',     notes: 'Bi-weekly net 2',               status: 'Active' },
    { name: 'Adobe Creative Cloud',  cat: 'Subscriptions',   amt: 52.99, day: 8,  auto: 'Credit',  notes: '',                              status: 'Paused' },
  ];

  recurring.forEach((row, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = row.name;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.white;

    sheet.getCell(`C${ri}`).value = row.cat;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).fill = FILLS.white;

    sheet.getCell(`D${ri}`).value = row.amt;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).fill = FILLS.white;

    sheet.getCell(`E${ri}`).value = row.day;
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).fill = FILLS.white;

    sheet.getCell(`F${ri}`).value = row.auto;
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).dataValidation = { type: 'list', formulae: ['"Auto-pay,Credit,ACH,Manual,Other"'] };

    sheet.getCell(`G${ri}`).value = row.notes;
    sheet.getCell(`G${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).fill = FILLS.white;

    sheet.getCell(`H${ri}`).value = row.status;
    sheet.getCell(`H${ri}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
    sheet.getCell(`H${ri}`).dataValidation = { type: 'list', formulae: ['"Active,Paused,Canceled"'] };
  });

  // CF on Status
  sheet.addConditionalFormatting({
    ref: `H${r + 2}:H${r + 2 + recurring.length - 1}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Active',   priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Paused',   priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Canceled', priority: 3, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 2 + recurring.length + 2}:H${r + 2 + recurring.length + 3}`,
    '💡',
    'Subscription audit prompt',
    'Run the Smart Spending Advisor (AI Money Advisor → page 3) once a quarter — it catches auto-renewals like the Spotify family upcharge ⚠️ above. Annual savings often = $100-300.');
  sheet.getRow(r + 2 + recurring.length + 2).height = 26;
  sheet.getRow(r + 2 + recurring.length + 3).height = 26;

  addFooter(sheet, r + 2 + recurring.length + 6);
}

// ===== TAB 7: 📅 Bill Calendar =====
function buildBillCalendar(workbook) {
  const sheet = workbook.addWorksheet('📅 Bill Calendar');
  setTabColor(sheet, COLORS.warmGold);

  setupColumns(sheet, { A: 2, B: 8, C: 26, D: 14, E: 14, F: 16, G: 22, H: 10, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, '📅 Bill Calendar', 'Every bill, sorted by day of month. Watch the danger zone.', [
    { label: 'BILLS THIS MO',  value: { formula: 'COUNTA(B8:B30)' } },
    { label: 'TOTAL DUE',      value: { formula: 'TEXT(SUM(D8:D30),"$#,##0")' } },
    { label: 'UPCOMING 7D',    value: '3 bills' },
    { label: 'PAID',           value: { formula: 'COUNTIF(F8:F30,"✅ Paid")' } },
    { label: 'OUTSTANDING',    value: { formula: 'TEXT(SUMIFS(D8:D30,F8:F30,"⏳ Due"),"$#,##0")' } },
    { label: 'OVERDUE',        value: { formula: 'COUNTIF(F8:F30,"🔴 Overdue")' } },
  ]);

  let r = addSectionHeader(sheet, 6, 'This month\'s bills', 'Sorted by day of month. Mark each as paid as you go.');

  addTableHeader(sheet, r + 1, ['Day', 'Bill', 'Amount', 'Auto-pay?', 'Status', 'Notes'], ['B', 'C', 'D', 'E', 'F', 'G']);

  const bills = [
    { day: 1,  name: 'Rent',              amt: 1700,   auto: '🔁 Auto', status: '✅ Paid',   notes: 'Citibank ACH' },
    { day: 4,  name: 'Netflix',           amt: 9.99,   auto: '🔁 Auto', status: '✅ Paid',   notes: '' },
    { day: 8,  name: 'Adobe Creative',    amt: 52.99,  auto: '⏸️ Paused', status: '⏸️ Paused', notes: 'Annual review pending' },
    { day: 9,  name: 'Spectrum',          amt: 79.99,  auto: '🔁 Auto', status: '✅ Paid',   notes: '' },
    { day: 12, name: 'Spotify Family',    amt: 16.99,  auto: '🔁 Auto', status: '✅ Paid',   notes: '⚠️ Up from $9.99' },
    { day: 15, name: 'ConEd Electric',    amt: 134.20, auto: '🔁 Auto', status: '✅ Paid',   notes: 'April' },
    { day: 21, name: 'New York Times',    amt: 14.99,  auto: '🔁 Auto', status: '✅ Paid',   notes: '' },
    { day: 25, name: 'Verizon Mobile',    amt: 58.00,  auto: '🔁 Auto', status: '✅ Paid',   notes: '' },
    { day: 29, name: 'Apple TV+',         amt: 9.99,   auto: '🔁 Auto', status: '⏳ Due',     notes: '' },
  ];

  bills.forEach((row, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = row.day;
    sheet.getCell(`B${ri}`).font = { ...FONTS.bodyBold, size: 13 };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;

    sheet.getCell(`C${ri}`).value = row.name;
    sheet.getCell(`C${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).fill = FILLS.white;

    sheet.getCell(`D${ri}`).value = row.amt;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0.00';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).fill = FILLS.white;

    sheet.getCell(`E${ri}`).value = row.auto;
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).fill = FILLS.white;

    sheet.getCell(`F${ri}`).value = row.status;
    sheet.getCell(`F${ri}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).dataValidation = { type: 'list', formulae: ['"✅ Paid,⏳ Due,🔴 Overdue,⏸️ Paused"'] };

    sheet.getCell(`G${ri}`).value = row.notes;
    sheet.getCell(`G${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).fill = FILLS.white;
  });

  // CF on Status
  sheet.addConditionalFormatting({
    ref: `F${r + 2}:F${r + 2 + bills.length - 1}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Paid',     priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Due',      priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Overdue',  priority: 3, style: { fill: FILLS.alert, font: { color: argb(COLORS.white), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Paused',   priority: 4, style: { font: { color: argb(COLORS.textMuted), italic: true } } },
    ],
  });

  addCallout(sheet, `B${r + 2 + bills.length + 2}:G${r + 2 + bills.length + 3}`,
    '💡',
    '.ics export (Pro tier)',
    'Export this calendar to your phone\'s calendar app via the named-range URL in the Bills tab. Get 3-day-ahead reminders for every bill.');
  sheet.getRow(r + 2 + bills.length + 2).height = 26;
  sheet.getRow(r + 2 + bills.length + 3).height = 26;

  addFooter(sheet, r + 2 + bills.length + 6);
}

// ===== TAB 8: 🎯 Savings Goals =====
function buildSavingsGoals(workbook) {
  const sheet = workbook.addWorksheet('🎯 Savings Goals');
  setTabColor(sheet, COLORS.warmGold);

  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 24, G: 14, H: 18, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, '🎯 Savings Goals', 'Where you\'re going. How fast. Track progress + project completion dates.', [
    { label: 'GOALS',          value: { formula: 'COUNTA(B8:B30)' } },
    { label: 'TOTAL TARGET',   value: { formula: 'TEXT(SUM(C8:C30),"$#,##0")' } },
    { label: 'CURRENT $',      value: { formula: 'TEXT(SUM(D8:D30),"$#,##0")' } },
    { label: 'COMPLETED',      value: { formula: 'COUNTIFS(D8:D30,">="&C8:C30)' } },
    { label: 'AT RISK',        value: '1' },
    { label: 'OVERALL %',      value: { formula: 'TEXT(SUM(D8:D30)/SUM(C8:C30),"0%")' } },
  ]);

  let r = addSectionHeader(sheet, 6, 'Your goals', 'Each row = one goal. Progress bar shows completion %.');

  addTableHeader(sheet, r + 1, ['Goal', 'Target', 'Current', '% Complete', 'Progress', 'Target Date', 'Status'], ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  const goals = [
    { name: 'Emergency Fund — 3mo',   target: 9000,  current: 5200, date: '2026-12-31', status: 'On Track' },
    { name: 'Tokyo Trip',             target: 4500,  current: 1800, date: '2026-09-15', status: 'Behind' },
    { name: 'New Laptop',             target: 2200,  current: 2200, date: '2026-04-30', status: 'Done' },
    { name: 'Tax Bill Buffer',        target: 3500,  current: 1200, date: '2027-03-31', status: 'On Track' },
    { name: 'Holiday Gifts',          target: 800,   current: 100,  date: '2026-12-01', status: 'On Track' },
  ];

  goals.forEach((row, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = row.name;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.white;

    sheet.getCell(`C${ri}`).value = row.target;
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).fill = FILLS.white;

    sheet.getCell(`D${ri}`).value = row.current;
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).fill = FILLS.white;

    sheet.getCell(`E${ri}`).value = { formula: `D${ri}/C${ri}` };
    sheet.getCell(`E${ri}`).numFmt = '0%';
    sheet.getCell(`E${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).fill = FILLS.white;

    // Visual progress bar via unicode blocks
    sheet.getCell(`F${ri}`).value = {
      formula: `LET(p,D${ri}/C${ri}*10,REPT("▰",ROUND(p,0))&REPT("▱",10-ROUND(p,0)))`,
    };
    sheet.getCell(`F${ri}`).font = { name: 'Inter', size: 13, color: argb(COLORS.warmGold) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'left' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).fill = FILLS.white;

    sheet.getCell(`G${ri}`).value = new Date(row.date);
    sheet.getCell(`G${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).fill = FILLS.white;

    sheet.getCell(`H${ri}`).value = row.status;
    sheet.getCell(`H${ri}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
    sheet.getCell(`H${ri}`).dataValidation = { type: 'list', formulae: ['"On Track,Behind,At Risk,Done"'] };
  });

  // CF on status
  sheet.addConditionalFormatting({
    ref: `H${r + 2}:H${r + 2 + goals.length - 1}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'On Track', priority: 1, style: { fill: FILLS.successLight, font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Behind',   priority: 2, style: { fill: FILLS.warningLight, font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'At Risk',  priority: 3, style: { fill: FILLS.alertLight, font: { color: argb(COLORS.alert), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Done',     priority: 4, style: { fill: FILLS.success, font: { color: argb(COLORS.white), bold: true } } },
    ],
  });

  addCallout(sheet, `B${r + 2 + goals.length + 2}:H${r + 2 + goals.length + 3}`,
    '💡',
    'How to use this tab',
    'Add a goal: name + target + target date. Update Current monthly. The progress bar fills automatically as % completion rises. Once Current ≥ Target, mark Done.');
  sheet.getRow(r + 2 + goals.length + 2).height = 26;
  sheet.getRow(r + 2 + goals.length + 3).height = 26;

  addFooter(sheet, r + 2 + goals.length + 6);
}

// ===== TAB 9: 🆘 Emergency Fund =====
function buildEmergencyFund(workbook) {
  const sheet = workbook.addWorksheet('🆘 Emergency Fund');
  setTabColor(sheet, COLORS.alert);

  setupColumns(sheet, { A: 2, B: 24, C: 16, D: 16, E: 16, F: 22, G: 18, H: 8, I: 10, J: 10, K: 10, L: 10, M: 2 });

  const monthlyExpenseFormula = `SUM('💸 Expense Tracker'!D8:D60)`;
  addTopBar(sheet, '🆘 Emergency Fund', 'The single most important number. Months of expenses you could cover if income stopped tomorrow.', [
    { label: 'CURRENT $',     value: '$5,200' },
    { label: 'MONTHS COVER',  value: '3.2 mo' },
    { label: 'TARGET (3MO)',  value: '$9,000' },
    { label: 'TARGET (6MO)',  value: '$18,000' },
    { label: 'GAP TO 3MO',    value: '$3,800' },
    { label: 'STATUS',        value: '🟡 Building' },
  ]);

  let r = addSectionHeader(sheet, 6, 'Coverage calculator', 'Your monthly burn rate (expenses) drives the target. Save until you hit 3-6 months of cover.');

  // Calculator card — apply ivory fill + border to each cell individually (no outer merge)
  for (let row = r + 1; row <= r + 8; row++) {
    for (const col of ['B', 'C', 'D', 'E']) {
      const cell = sheet.getCell(`${col}${row}`);
      cell.fill = FILLS.ivory;
      // Only outer cells get visible border
      const isTop = row === r + 1;
      const isBottom = row === r + 8;
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

  // Label at top of card
  sheet.mergeCells(`B${r + 1}:E${r + 1}`);
  sheet.getCell(`B${r + 1}`).value = 'EMERGENCY FUND COVERAGE';
  sheet.getCell(`B${r + 1}`).font = FONTS.smallCaps;
  sheet.getCell(`B${r + 1}`).alignment = { vertical: 'middle', horizontal: 'center' };

  // The big number — single row, merged
  sheet.mergeCells(`B${r + 3}:E${r + 4}`);
  sheet.getCell(`B${r + 3}`).value = 3.2;
  sheet.getCell(`B${r + 3}`).numFmt = '0.0" months"';
  sheet.getCell(`B${r + 3}`).font = { name: 'Inter', size: 48, bold: true, color: argb(COLORS.warning) };
  sheet.getCell(`B${r + 3}`).alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(r + 3).height = 32;
  sheet.getRow(r + 4).height = 32;

  // Progress bar
  sheet.mergeCells(`B${r + 6}:E${r + 6}`);
  sheet.getCell(`B${r + 6}`).value = '▰▰▰▰▰▰▰▱▱▱  3.2 / 6.0';
  sheet.getCell(`B${r + 6}`).font = { name: 'Inter', size: 14, color: argb(COLORS.warmGold) };
  sheet.getCell(`B${r + 6}`).alignment = { horizontal: 'center' };

  // Caption
  sheet.mergeCells(`B${r + 7}:E${r + 7}`);
  sheet.getCell(`B${r + 7}`).value = 'Past the "3-month floor" milestone. Build toward 6 months next.';
  sheet.getCell(`B${r + 7}`).font = FONTS.bodyMuted;
  sheet.getCell(`B${r + 7}`).alignment = { horizontal: 'center' };

  // Right column — milestones
  sheet.mergeCells(`F${r + 1}:G${r + 1}`);
  sheet.getCell(`F${r + 1}`).value = 'MILESTONES';
  sheet.getCell(`F${r + 1}`).font = FONTS.smallCaps;
  sheet.getCell(`F${r + 1}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

  const milestones = [
    { name: '1 month buffer',  target: 3000,  status: '✅ Reached' },
    { name: '2 month coverage', target: 6000,  status: '✅ Reached' },
    { name: '3 month floor',   target: 9000,  status: '🟡 5,200 / 9,000' },
    { name: '4 month cushion', target: 12000, status: '⏳ Pending' },
    { name: '6 month safety',  target: 18000, status: '⏳ Pending' },
    { name: '9 month buffer',  target: 27000, status: '⏳ Pending' },
    { name: '12 month FU money', target: 36000, status: '⏳ Pending' },
  ];

  milestones.forEach((m, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`F${ri}`).value = m.name;
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).value = m.status;
    sheet.getCell(`G${ri}`).font = FONTS.body;
  });

  // CF on milestones
  sheet.addConditionalFormatting({
    ref: `G${r + 2}:G${r + 8}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Reached', priority: 1, style: { font: { color: argb(COLORS.success), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: '5,200',   priority: 2, style: { font: { color: argb(COLORS.warning), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Pending', priority: 3, style: { font: { color: argb(COLORS.textMuted) } } },
    ],
  });

  // Where to keep it
  let r2 = addSectionHeader(sheet, r + 11, 'Where to keep it', 'High-yield savings (HYSA) is the right vehicle. Not checking. Not invested. Liquid and earning.');

  const vehicles = [
    { name: 'Ally Bank HYSA',         apy: '4.40%', risk: 'None',     access: 'Same day',   note: 'Easy to set up. Solid customer support.' },
    { name: 'Wealthfront Cash',       apy: '4.50%', risk: 'None',     access: 'Same day',   note: 'Linked to brokerage if you have one.' },
    { name: 'Marcus by Goldman',      apy: '4.40%', risk: 'None',     access: 'Same day',   note: 'No-frills. Reliable.' },
    { name: 'Treasury Direct (T-Bills)', apy: '5.10%', risk: 'Min.',  access: 'Maturity',  note: 'Slightly higher yield. State-tax-free.' },
  ];

  addTableHeader(sheet, r2 + 1, ['Vehicle', 'APY', 'Risk', 'Access', 'Note'], ['B', 'C', 'D', 'E', 'F']);

  vehicles.forEach((v, i) => {
    const ri = r2 + 2 + i;
    sheet.getCell(`B${ri}`).value = v.name;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).value = v.apy;
    sheet.getCell(`C${ri}`).font = { ...FONTS.body, bold: true, color: argb(COLORS.success) };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`D${ri}`).value = v.risk;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).value = v.access;
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).value = v.note;
    sheet.getCell(`F${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).fill = FILLS.white;
  });

  addCallout(sheet, `B${r2 + 2 + vehicles.length + 2}:F${r2 + 2 + vehicles.length + 3}`,
    '💡',
    'Rule of thumb',
    'Single income: aim for 6 months. Dual income: 3 months. Self-employed / variable income: 9-12 months.');

  addFooter(sheet, r2 + 2 + vehicles.length + 6);
}

// ===== TAB 10: 🏆 Financial Health Score =====
function buildHealthScore(workbook) {
  const sheet = workbook.addWorksheet('🏆 Financial Health Score');
  setTabColor(sheet, COLORS.warmGold);

  setupColumns(sheet, { A: 2, B: 28, C: 14, D: 14, E: 18, F: 40, G: 12, H: 12, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, '🏆 Financial Health Score', 'Composite of 5 sub-scores. Updates as your data fills in.', [
    { label: 'SCORE',         value: { formula: 'ROUND(AVERAGE(D12:D16),0)&" / 100"' } },
    { label: 'STATUS',        value: 'Healthy' },
    { label: 'CHANGE (MoM)',  value: '+4' },
    { label: 'TREND',         value: '↗ Improving' },
    { label: 'WEAKEST',       value: 'Savings Rate' },
    { label: 'STRONGEST',     value: 'On-Time Pmt' },
  ]);

  let r = addSectionHeader(sheet, 6, 'Composite score', 'Average of 5 sub-scores weighted equally. 80+ healthy.');

  // The Big Score
  sheet.mergeCells(`B${r + 1}:D${r + 5}`);
  sheet.getCell(`B${r + 1}`).value = { formula: 'ROUND(AVERAGE(D12:D16),0)' };
  sheet.getCell(`B${r + 1}`).font = { name: 'Inter', size: 72, bold: true, color: argb(COLORS.success) };
  sheet.getCell(`B${r + 1}`).alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getCell(`B${r + 1}`).fill = FILLS.ivory;
  sheet.getCell(`B${r + 1}`).border = {
    top: { style: 'medium', color: argb(COLORS.warmGold) },
    left: { style: 'medium', color: argb(COLORS.warmGold) },
    bottom: { style: 'medium', color: argb(COLORS.warmGold) },
    right: { style: 'medium', color: argb(COLORS.warmGold) },
  };
  sheet.getCell(`B${r + 1}`).numFmt = '0';

  sheet.getCell(`E${r + 1}`).value = '/ 100';
  sheet.getCell(`E${r + 1}`).font = FONTS.scoreUnit;

  sheet.getCell(`E${r + 2}`).value = 'Healthy';
  sheet.getCell(`E${r + 2}`).font = { name: 'Inter', size: 18, bold: true, color: argb(COLORS.success) };

  sheet.getCell(`E${r + 3}`).value = 'You\'re in the top 30% of self-tracked budgeters.';
  sheet.getCell(`E${r + 3}`).font = FONTS.bodyMuted;

  // Section: Sub-scores
  let subR = addSectionHeader(sheet, r + 7, 'Sub-scores breakdown', 'Each sub-score is 0–100. Average becomes the composite.');

  addTableHeader(sheet, subR + 1, ['Component', 'Your Value', 'Score', 'Status', 'Why It Matters'], ['B', 'C', 'D', 'E', 'F']);

  const components = [
    { name: 'Savings Rate',          value: '12%',     val: 0.12, score: 60, why: 'Higher = more buffer between income + spending. Target 20%+.' },
    { name: 'Emergency Fund Cover',  value: '3.2 mo',  val: 3.2,  score: 75, why: 'Months of expenses you could cover from cash. Target 3-6 months.' },
    { name: 'Debt-to-Income (DTI)',  value: '28%',     val: 0.28, score: 82, why: 'Total monthly debt payments ÷ income. Under 36% is healthy.' },
    { name: 'Credit Utilization',    value: '18%',     val: 0.18, score: 88, why: 'Balance ÷ limit on revolving credit. Under 30% protects credit score.' },
    { name: 'On-Time Payment Rate',  value: '100%',    val: 1.0,  score: 100, why: '% of bills paid on time. Single biggest factor in credit score.' },
  ];

  components.forEach((c, i) => {
    const ri = subR + 2 + i;
    sheet.getCell(`B${ri}`).value = c.name;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.white;

    sheet.getCell(`C${ri}`).value = c.value;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right' };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).fill = FILLS.white;

    sheet.getCell(`D${ri}`).value = c.score;
    sheet.getCell(`D${ri}`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.charcoal) };
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).fill = FILLS.white;

    sheet.getCell(`E${ri}`).value = { formula: `IF(D${ri}>=80,"✅ Strong",IF(D${ri}>=60,"🟡 Building",IF(D${ri}>=40,"⚠️ Watch","🔴 At Risk")))` };
    sheet.getCell(`E${ri}`).font = { ...FONTS.body, bold: true };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).fill = FILLS.white;

    sheet.getCell(`F${ri}`).value = c.why;
    sheet.getCell(`F${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).alignment = { wrapText: true };
  });

  // CF on status
  sheet.addConditionalFormatting({
    ref: `E${subR + 2}:E${subR + 2 + components.length - 1}`,
    rules: [
      { type: 'containsText', operator: 'containsText', text: 'Strong',   priority: 1, style: { fill: FILLS.success, font: { color: argb(COLORS.white), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Building', priority: 2, style: { fill: FILLS.warning, font: { color: argb(COLORS.white), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'Watch',    priority: 3, style: { fill: FILLS.warning, font: { color: argb(COLORS.white), bold: true } } },
      { type: 'containsText', operator: 'containsText', text: 'At Risk',  priority: 4, style: { fill: FILLS.alert, font: { color: argb(COLORS.white), bold: true } } },
    ],
  });

  addCallout(sheet, `B${subR + 2 + components.length + 2}:F${subR + 2 + components.length + 3}`,
    '💡',
    'Path to 100',
    'Your weakest sub-score is Savings Rate at 60. Bring monthly savings from 12% to 20% of income (around $400/mo more) — that alone lifts your composite from 81 to 89.');

  addFooter(sheet, subR + 2 + components.length + 6);
}

// ===== TAB 11: 📊 Annual Summary =====
function buildAnnualSummary(workbook) {
  const sheet = workbook.addWorksheet('📊 Annual Summary');
  setTabColor(sheet, COLORS.charcoal);

  setupColumns(sheet, { A: 2, B: 16, C: 10, D: 10, E: 10, F: 10, G: 10, H: 10, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, '📊 Annual Summary', 'Year-to-date view. 12 months of income, expenses, savings, net flow.', [
    { label: 'YTD INCOME',    value: '$24,300' },
    { label: 'YTD EXPENSES',  value: '$18,200' },
    { label: 'YTD SAVED',     value: '$6,100' },
    { label: 'SAVINGS RATE',  value: '25%' },
    { label: 'BEST MONTH',    value: 'Feb (+$1,800)' },
    { label: 'WORST MONTH',   value: 'Apr (+$240)' },
  ]);

  let r = addSectionHeader(sheet, 6, '12-month overview', 'Track the rhythm of your year. Patterns emerge after 3-4 months.');

  // 12-month table
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const cols = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];

  // Header
  sheet.getCell(`B${r + 1}`).value = 'Metric';
  sheet.getCell(`B${r + 1}`).font = FONTS.headerWhite;
  sheet.getCell(`B${r + 1}`).fill = FILLS.charcoal;
  sheet.getCell(`B${r + 1}`).border = BORDER_THIN(COLORS.charcoal);

  months.slice(0, 11).forEach((m, i) => {
    sheet.getCell(`${cols[i]}${r + 1}`).value = m;
    sheet.getCell(`${cols[i]}${r + 1}`).font = FONTS.headerWhite;
    sheet.getCell(`${cols[i]}${r + 1}`).fill = FILLS.charcoal;
    sheet.getCell(`${cols[i]}${r + 1}`).alignment = { horizontal: 'center' };
    sheet.getCell(`${cols[i]}${r + 1}`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(r + 1).height = 24;

  // Sample rows
  const rows = [
    { label: 'Income',   vals: [5100, 6000, 5400, 5212, 0, 0, 0, 0, 0, 0, 0] },
    { label: 'Expenses', vals: [3800, 4200, 4100, 1450, 0, 0, 0, 0, 0, 0, 0] },
    { label: 'Net',      vals: [1300, 1800, 1300, 240,  0, 0, 0, 0, 0, 0, 0] },
    { label: 'Save Rate', vals: [0.25, 0.30, 0.24, 0.05, 0, 0, 0, 0, 0, 0, 0] },
  ];

  rows.forEach((row, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = row.label;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;

    row.vals.forEach((val, j) => {
      const cell = sheet.getCell(`${cols[j]}${ri}`);
      cell.value = val || '';
      cell.numFmt = i === 3 ? '0%' : '"$"#,##0';
      cell.font = FONTS.body;
      cell.alignment = { horizontal: 'right' };
      cell.border = BORDER_THIN();
      cell.fill = FILLS.white;
    });
  });

  addCallout(sheet, `B${r + 8}:M${r + 9}`,
    '📊',
    'Chart suggestion',
    'Highlight rows 7-10 → Insert → Chart → Line chart to visualize your 12-month income / expenses / net / savings rate trajectory.');

  addFooter(sheet, r + 13);
}

// ===== TAB 12: 🤖 AI Money Advisor =====
function buildAIAdvisor(workbook) {
  const sheet = workbook.addWorksheet('🤖 AI Money Advisor');
  setTabColor(sheet, COLORS.warmGold);

  setupColumns(sheet, { A: 2, B: 22, C: 28, D: 26, E: 20, F: 20, G: 12, H: 12, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, '🤖 AI Money Advisor', 'Seven prompts. Two AI tools. One budget you can actually run.', [
    { label: 'PROMPTS',       value: '7' },
    { label: 'PAGES IN PDF',  value: '11' },
    { label: 'PAIRS WITH',    value: '7 tabs' },
    { label: 'AI TOOLS',      value: 'ChatGPT / Claude' },
    { label: 'TIER',          value: 'AI Edition' },
    { label: 'UPDATES',       value: '12 mo free' },
  ]);

  let r = addSectionHeader(sheet, 6, 'Seven AI prompts', 'Each prompt is built to pair with a specific tab. Copy → paste → fill in placeholders → send.');

  // 2x4 grid of prompt cards
  const prompts = [
    { num: '1', title: 'Smart Spending Advisor', pairs: '💸 Expense Tracker',     hint: 'Find non-obvious spending cuts',     page: 'p.3' },
    { num: '2', title: 'Scenario Simulator',     pairs: '📈 Cash Flow Forecast',  hint: 'Stress-test your budget',           page: 'p.4' },
    { num: '3', title: 'Bill Negotiation Scripts', pairs: '🔁 Recurring Templates', hint: 'Cut subscriptions w/o cancelling', page: 'p.5' },
    { num: '4', title: 'Cash Flow Intelligence', pairs: '📈 Cash Flow Forecast',  hint: 'Predict shortfalls 30 days ahead',   page: 'p.6' },
    { num: '5', title: 'Annual Money Review',    pairs: '📊 Annual Summary',      hint: 'Year-end reflection prompt',        page: 'p.7' },
    { num: '6', title: 'Category Advisor',       pairs: '📂 Expense Categories',  hint: 'Right-size your category budgets',   page: 'p.8' },
    { num: '7', title: 'Health Score Coach',     pairs: '🏆 Financial Health',    hint: 'Move the score 10 points',          page: 'p.9' },
  ];

  // Header row
  addTableHeader(sheet, r + 1, ['#', 'Prompt', 'Pairs with tab', 'What it does', 'PDF page'], ['B', 'C', 'D', 'E', 'F']);

  prompts.forEach((p, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = p.num;
    sheet.getCell(`B${ri}`).font = { name: 'Inter', size: 18, bold: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;

    sheet.getCell(`C${ri}`).value = p.title;
    sheet.getCell(`C${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).fill = FILLS.white;

    sheet.getCell(`D${ri}`).value = p.pairs;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).fill = FILLS.white;

    sheet.getCell(`E${ri}`).value = p.hint;
    sheet.getCell(`E${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).fill = FILLS.white;

    sheet.getCell(`F${ri}`).value = p.page;
    sheet.getCell(`F${ri}`).font = { ...FONTS.body, bold: true, color: argb(COLORS.warmGold) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).fill = FILLS.white;
  });

  addCallout(sheet, `B${r + 2 + prompts.length + 2}:F${r + 2 + prompts.length + 3}`,
    '💡',
    'How to use the AI prompts',
    'Open the AI Money Advisor PDF (shipped with your AI Edition purchase). Each page has one prompt + a worked example. Paste your data, paste into ChatGPT/Claude, read the output, apply what makes sense.');

  // What the AI won't do
  addCallout(sheet, `B${r + 2 + prompts.length + 5}:F${r + 2 + prompts.length + 6}`,
    '🔒',
    'What the AI won\'t see',
    'The AI only sees what you paste — usually summary numbers, not transaction-level data. Your bank credentials never enter any AI tool. Everything happens in your own ChatGPT or Claude account.');

  addFooter(sheet, r + 2 + prompts.length + 9);
}

// ===== TAB 13: ℹ️ About & Help =====
function buildAbout(workbook) {
  const sheet = workbook.addWorksheet('ℹ️ About & Help');
  setTabColor(sheet, COLORS.charcoal);

  setupColumns(sheet, { A: 2, B: 30, C: 60, D: 8, E: 10, F: 10, G: 10, H: 10, I: 10, J: 10, K: 10, L: 10, M: 2 });

  addTopBar(sheet, 'ℹ️ About & Help', 'Welcome — and quick answers to the questions buyers ask first.', [
    { label: 'VERSION',     value: '1.0' },
    { label: 'TABS',        value: '13' },
    { label: 'METHODS',     value: '4' },
    { label: 'AI PROMPTS',  value: '7' },
    { label: 'TIER',        value: 'AI Edition' },
    { label: 'UPDATES',     value: '12 mo free' },
  ]);

  // Hero welcome
  sheet.mergeCells('B6:C6');
  sheet.getCell('B6').value = 'Welcome to your Budget Tracker.';
  sheet.getCell('B6').font = FONTS.hero;
  sheet.getRow(6).height = 38;

  sheet.mergeCells('B7:C7');
  sheet.getCell('B7').value = 'A spreadsheet built for people who want to understand their money, not gamify it.';
  sheet.getCell('B7').font = FONTS.bodyMuted;
  sheet.getRow(7).height = 22;

  // FAQ section
  let r = addSectionHeader(sheet, 9, 'Frequently asked questions', 'The 10 things buyers ask in their first hour.', 'B:C');

  const faqs = [
    { q: 'How do I get started?',
      a: 'Open the 🧭 Setup Wizard tab (first tab). Five questions, three minutes. Every other tab activates from there.' },
    { q: 'Can I change my budget method later?',
      a: 'Yes. Switch in the Setup Wizard — Dashboard rebuilds automatically. Your data stays intact.' },
    { q: 'Where do I add an expense?',
      a: 'The 💸 Expense Tracker tab. Use the existing rows as templates. Category dropdown is data-validated against your master list.' },
    { q: 'How does the Health Score work?',
      a: 'It\'s the average of 5 sub-scores (savings rate, emergency fund, DTI, credit utilization, on-time payments). See the 🏆 Financial Health Score tab for details + the path to 100.' },
    { q: 'Does this connect to my bank?',
      a: 'No. That\'s the privacy gate. Your bank credentials never enter the spreadsheet. You enter expenses manually — usually a 2-minute daily habit.' },
    { q: 'Can I add more categories?',
      a: 'Yes. Edit the 📂 Expense Categories tab. The Expense Tracker dropdown updates automatically.' },
    { q: 'How do the AI prompts work?',
      a: 'AI Edition only. Open the AI Money Advisor PDF (shipped with your purchase). Copy a prompt, paste it + your data into ChatGPT or Claude (free tier works), read the output.' },
    { q: 'Will my data ever leave my computer?',
      a: 'Nothing in this spreadsheet sends data anywhere. The AI features run in your own ChatGPT/Claude account — only what you paste.' },
    { q: 'Where do I get help?',
      a: 'Reply to your order email. 24-hour response, 7 days a week. Bug fixes are always free; AI Edition buyers get 12 months of template refreshes.' },
    { q: 'Can I share this with my partner?',
      a: 'Yes — share the Google Sheet itself. The 👫 Household Mode tab (Pro tier) tracks shared expenses + settlements.' },
  ];

  faqs.forEach((f, i) => {
    const ri = r + 1 + i * 3;
    sheet.getCell(`B${ri}`).value = f.q;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { vertical: 'top' };
    sheet.getRow(ri).height = 22;

    sheet.getCell(`C${ri}`).value = f.a;
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { vertical: 'top', wrapText: true };

    sheet.mergeCells(`B${ri + 1}:C${ri + 1}`);
    sheet.getCell(`B${ri + 1}`).fill = FILLS.warmGold;
    sheet.getRow(ri + 1).height = 2;
  });

  // Quick links
  let linksR = r + 1 + faqs.length * 3 + 2;
  addSectionHeader(sheet, linksR, 'Quick links', 'Where to go next.', 'B:C');

  const links = [
    { label: '✦ Studio support email',          val: 'support@[your-studio-domain]' },
    { label: '📚 Updates + changelog',           val: 'budget-tracker.com/updates' },
    { label: '🐛 Report a bug',                   val: 'Reply to your order email — 24hr response' },
    { label: '✦ The other 4 finance products',  val: 'budget-tracker.com/catalog' },
  ];

  links.forEach((l, i) => {
    const ri = linksR + 2 + i;
    sheet.getCell(`B${ri}`).value = l.label;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).value = l.val;
    sheet.getCell(`C${ri}`).font = { ...FONTS.body, color: argb(COLORS.warmGold) };
  });

  addFooter(sheet, linksR + 2 + links.length + 2);
}

// ============================================================================
// MAIN — orchestrate the build
// ============================================================================

async function buildBudgetTracker() {
  const t0 = Date.now();
  console.log('→ Building Budget Tracker — AI Edition v2 (13 of 17 tabs)...');

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Premium Finance Studio';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.title = 'Budget Tracker — AI Edition';
  workbook.subject = 'Premium Finance House catalog';
  workbook.description = 'Generated by tools/sheets-gen/templates/budget-tracker.js v2';

  // Build in order (also = visual tab order in Sheets)
  console.log('  • 🧭 Setup Wizard');         buildSetupWizard(workbook);
  console.log('  • 🏠 Dashboard');            buildDashboard(workbook);
  console.log('  • 📂 Expense Categories');   buildExpenseCategories(workbook);
  console.log('  • 💵 Income Tracker');       buildIncomeTracker(workbook);
  console.log('  • 💸 Expense Tracker');      buildExpenseTracker(workbook);
  console.log('  • 🔁 Recurring Templates');  buildRecurringTemplates(workbook);
  console.log('  • 📅 Bill Calendar');        buildBillCalendar(workbook);
  console.log('  • 🎯 Savings Goals');        buildSavingsGoals(workbook);
  console.log('  • 🆘 Emergency Fund');       buildEmergencyFund(workbook);
  console.log('  • 🏆 Financial Health');     buildHealthScore(workbook);
  console.log('  • 📊 Annual Summary');       buildAnnualSummary(workbook);
  console.log('  • 🤖 AI Money Advisor');     buildAIAdvisor(workbook);
  console.log('  • ℹ️ About & Help');         buildAbout(workbook);

  const outPath = resolve(OUTPUT_DIR, 'budget-tracker-ai-edition-v2.xlsx');
  await workbook.xlsx.writeFile(outPath);

  const elapsed = Date.now() - t0;
  console.log(`\n✓ Workbook generated in ${elapsed}ms`);
  console.log(`  Output: ${outPath}`);
  console.log(`  Tabs:   13 of 17 (Refund Tracker, Mileage, Household Mode, Credit Card Manager remain)`);
  console.log(`\n  Upload to Google Sheets to verify:`);
  console.log(`    1. Open Google Drive → New → File Upload → select the .xlsx`);
  console.log(`    2. Right-click the uploaded file → "Open with Google Sheets"`);
  console.log(`    3. File → Save as Google Sheets`);
}

buildBudgetTracker().catch((err) => {
  console.error('✗ Build failed:', err);
  process.exit(1);
});
