/**
 * Premium Finance Studio — shared spreadsheet library.
 *
 * Hosts the design tokens (colors / fonts / fills / borders) and reusable
 * components (top bar, footer, section header, callout, table header) that
 * every Lime Premium Studios finance product reuses verbatim.
 *
 * Originally extracted from tools/sheets-gen/templates/budget-tracker.js so
 * Debt Payoff Planner, Sinking Funds, Net Worth Tracker, and Small Business
 * Finance Kit can all share the same brand surface without duplication.
 *
 * Usage:
 *   import * as PFS from '../lib/premium-finance-studio.js';
 *   const wb = new ExcelJS.Workbook();
 *   await PFS.registerLimeLogo(wb);
 *   const sheet = wb.addWorksheet('🏠 Dashboard');
 *   PFS.addTopBar(sheet, {
 *     productName: 'Debt Payoff Planner — AI Edition',
 *     tabName: '🏠 Dashboard',
 *     tabSubtitle: 'Your debt-free trajectory at a glance.',
 *     kpiData: [...],
 *   });
 *   ...
 *   PFS.addFooter(sheet, 30, { productName: 'Debt Payoff Planner' });
 *
 * Tier patching: addFooter writes the FOOTER_TIER_TOKEN literal — the
 * applyTierVisibility() helper in each product's generator swaps it for the
 * actual tier label after sheets are removed.
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// DESIGN TOKENS — Lime Premium Studios
// ============================================================================

export const COLORS = {
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

export const argb = (c) => ({ argb: c });

export const FONTS = {
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

export const FILLS = {
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

export const BORDER_THIN = (color = COLORS.gridGray) => ({
  top:    { style: 'thin', color: argb(color) },
  left:   { style: 'thin', color: argb(color) },
  bottom: { style: 'thin', color: argb(color) },
  right:  { style: 'thin', color: argb(color) },
});

export const BORDER_BOTTOM_GOLD = {
  bottom: { style: 'medium', color: argb(COLORS.warmGold) },
};

// Tier label is patched per-build by applyTierVisibility — generator default is "AI Edition".
// Footer rewriter looks for the FOOTER_TIER_TOKEN string and swaps it for the actual tier.
export const FOOTER_TIER_TOKEN = 'AI Edition';

// ============================================================================
// LIME LOGO REGISTRATION — call once per workbook
// ============================================================================

/**
 * Register the shared Lime parent-brand logo on the workbook. Each tab's
 * addTopBar() pulls workbook._limeImageId to re-anchor at A1. PNG is built
 * by tools/pdf-gen/render-logo.js (must run before workbook generation).
 */
export async function registerLimeLogo(workbook) {
  const logoPath = resolve(__dirname, '..', 'assets', 'lime-logo-128.png');
  if (!existsSync(logoPath)) {
    console.warn(`  ⚠ Lime logo not found at ${logoPath} — wordmark only`);
    return false;
  }
  workbook._limeImageId = workbook.addImage({ filename: logoPath, extension: 'png' });
  return true;
}

// ============================================================================
// REUSABLE COMPONENTS — every tab uses these
// ============================================================================

/**
 * Premium top bar (rows 1-4):
 *   Row 1 (32px): wordmark band — charcoal background, white text + Lime logo at A1
 *   Row 2 (54px): 6 KPI tiles — white background, label / value / delta
 *   Row 3 (22px): warm-gold accent banner
 *   Row 4 (28px): tab subtitle/breadcrumb
 *
 * @param {Worksheet} sheet
 * @param {object} opts
 *   - productName: e.g. "Debt Payoff Planner — AI Edition"
 *   - tabName:     e.g. "🏠 Dashboard"
 *   - tabSubtitle: row-4 subtitle text
 *   - kpiData:     array of 6 { label, value (string or {formula}), delta? }
 *   - bannerText:  row-3 banner (defaults to the privacy-first Lime banner)
 */
export function addTopBar(sheet, opts) {
  const { productName, tabName, tabSubtitle, kpiData, bannerText } = opts;

  // === Row 1: wordmark band ===
  // Lime leaf logo anchors the row; the unified "Lime Premium Studios" wordmark sits
  // to its right. Image is added once per workbook (via workbook._limeImageId) then
  // re-inserted on each worksheet that calls addTopBar.
  sheet.mergeCells('A1:C1');
  const wordmark = sheet.getCell('A1');
  wordmark.value = '    Lime Premium Studios';
  wordmark.font = { name: 'Inter', size: 11, bold: true, color: argb(COLORS.white) };
  wordmark.fill = FILLS.charcoal;
  wordmark.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

  if (sheet.workbook._limeImageId !== undefined) {
    sheet.addImage(sheet.workbook._limeImageId, {
      tl: { col: 0, row: 0, nativeColOff: 40000, nativeRowOff: 0 },
      ext: { width: 28, height: 28 },
      editAs: 'oneCell',
    });
  }

  sheet.mergeCells('D1:I1');
  const product = sheet.getCell('D1');
  product.value = productName;
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
  kpiData.forEach((k, i) => {
    const range = tileRanges[i];
    sheet.mergeCells(range);
    const cell = sheet.getCell(range.split(':')[0]);
    const val = k.value;

    if (val && typeof val === 'object' && 'formula' in val) {
      cell.value = { formula: `"${k.label}"&CHAR(10)&(${val.formula})` };
      cell.font = { name: 'Inter', size: 11, bold: true, color: argb(COLORS.charcoal) };
    } else {
      cell.value = {
        richText: [
          { text: `${k.label}\n`, font: FONTS.kpiLabel },
          { text: `${val}`,        font: FONTS.kpiValue },
          ...(k.delta
            ? [{ text: `  ${k.delta}`, font: { ...FONTS.kpiDelta, color: argb(COLORS.textMuted) } }]
            : []),
        ],
      };
    }
    cell.alignment = { vertical: 'top', horizontal: 'left', indent: 1, wrapText: true };
    cell.fill = FILLS.white;
    cell.border = BORDER_THIN();
  });
  sheet.getRow(2).height = 54;

  // === Row 3: warm-gold banner ===
  sheet.mergeCells('A3:M3');
  const banner = sheet.getCell('A3');
  banner.value = bannerText || '✦  Why a Spreadsheet, Not an App?   Your bank credentials never leave your bank. No Plaid. No data ever leaves your machine.';
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
 * Returns the next free row.
 */
export function addSectionHeader(sheet, startRow, title, subtitle, colSpan = 'A:M') {
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

  const underlineRow = subtitle ? startRow + 2 : startRow + 1;
  sheet.mergeCells(`${startCol}${underlineRow}:${endCol}${underlineRow}`);
  const underline = sheet.getCell(`${startCol}${underlineRow}`);
  underline.fill = FILLS.warmGold;
  sheet.getRow(underlineRow).height = 3;

  return underlineRow + 1;
}

/**
 * Callout box — ivory background, warm-gold left accent border.
 */
export function addCallout(sheet, range, icon, title, body) {
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
export function addTableHeader(sheet, row, headers, cols) {
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
 *   row     — first row of the footer block (gold rule). row+1 holds the wordmark.
 *   opts.productName — e.g. "Budget Tracker" / "Debt Payoff Planner".
 */
export function addFooter(sheet, row, opts = {}) {
  const { productName = 'Budget Tracker' } = opts;
  sheet.mergeCells(`A${row}:M${row}`);
  const cell = sheet.getCell(`A${row}`);
  cell.fill = FILLS.warmGold;
  sheet.getRow(row).height = 3;

  sheet.mergeCells(`A${row + 1}:M${row + 1}`);
  const footerCell = sheet.getCell(`A${row + 1}`);
  footerCell.value = `Lime Premium Studios  ·  ${productName} ${FOOTER_TIER_TOKEN} v1.0  ·  Privacy-first. No Plaid. No app.`;
  footerCell.font = FONTS.footer;
  footerCell.fill = FILLS.offWhite;
  footerCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(row + 1).height = 22;
}

/**
 * Set tab color via the tab properties.
 */
export function setTabColor(sheet, color) {
  sheet.properties.tabColor = argb(color);
}

/**
 * Set up column widths from a { A: 3, B: 15, ... } map.
 */
export function setupColumns(sheet, widths) {
  Object.entries(widths).forEach(([col, w]) => {
    sheet.getColumn(col).width = w;
  });
}

// ============================================================================
// TIER VISIBILITY — applyTierVisibility
// ============================================================================

/**
 * Generic tier-removal helper. Pass the product's PRO_TABS + AI_TABS sets.
 *
 *   applyTierVisibility(workbook, tier, {
 *     proTabs:  new Set([...tab names...]),
 *     aiTabs:   new Set([...tab names...]),
 *     productName: 'Budget Tracker',
 *   })
 *
 * For tier !== 'ai', physically removes hidden tabs (so a buyer can't right-click
 * → Unhide to upgrade), then patches the D1 product band + footer band on every
 * remaining sheet to show the actual tier label.
 */
export function applyTierVisibility(workbook, tier, opts) {
  const { proTabs, aiTabs, productName } = opts;
  if (tier === 'ai') return;

  const toRemove = [];
  workbook.eachSheet((sheet) => {
    if (tier === 'essentials' && (proTabs.has(sheet.name) || aiTabs.has(sheet.name))) {
      toRemove.push(sheet);
    } else if (tier === 'pro' && aiTabs.has(sheet.name)) {
      toRemove.push(sheet);
    }
  });
  toRemove.reverse().forEach((sheet) => workbook.removeWorksheet(sheet.id));

  const tierLabel = { essentials: 'Essentials', pro: 'Pro' }[tier] || 'AI Edition';
  if (tierLabel === 'AI Edition') return;

  workbook.eachSheet((sheet) => {
    // Row 1 product band — `productName — AI Edition` → `productName — <Tier>`
    const product = sheet.getCell('D1');
    if (product && typeof product.value === 'string' && product.value.startsWith(`${productName} —`)) {
      product.value = `${productName} — ${tierLabel}`;
    }
    // Footer band — scan all cells for the AI Edition token and swap.
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (typeof cell.value === 'string' && cell.value.includes(`${productName} ${FOOTER_TIER_TOKEN}`)) {
          cell.value = cell.value.replace(`${productName} ${FOOTER_TIER_TOKEN}`, `${productName} ${tierLabel}`);
        }
      });
    });
  });
}
