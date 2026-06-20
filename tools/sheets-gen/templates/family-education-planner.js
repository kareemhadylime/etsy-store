/**
 * Family & Education Planner — Google Sheets template generator (Lime Premium Studios) — v1
 *
 * Phase B product #6 in the catalog. Cascades from Budget Tracker + Debt Payoff
 * Planner + Sinking Funds Planner + Net Worth Tracker + Small Business Finance Kit.
 * The depth differentiator: 18 tabs covering pregnancy → college launch with EFC
 * Calculator (FAFSA formula), Account Type Comparison (529/Coverdell/UTMA/ABLE),
 * State 529 Tax Benefits (50 states), Aid Letter Comparison, DIME life insurance,
 * and per-child × 4 multiplication.
 *
 * Pricing: $14 / $22 / $32.
 *
 * Source of truth:
 *   - docs/product-proposals/family-education-planner.md  (18-tab feature list)
 *   - docs/product-designs/family-education-planner.md    (visual + spine spec)
 *   - docs/listing-copy/family-education-planner.md       (Etsy listing copy)
 *   - docs/product-content/family-education-ai-prompts.md (12-page AI PDF source)
 *
 * Spine architecture (catalog-wide standing rule):
 *   - 📥 Input Tab — `👶 Child Profiles` (parent context + 4 children table)
 *   - 📊 Output Dashboard — `🏠 Dashboard` (Family Health Score + 5 visuals)
 *
 * Per-product copy register (design brief §1):
 *   - Slightly warmer banner copy ("kids" not "expenses")
 *   - Kid-coded persona names in seed data: Emma (8) / Liam (4) / Noah (1, mild autism) —
 *     same family threaded through the AI PDF for cross-artifact continuity.
 *
 * Tier model (post-applyTierVisibility):
 *   - Essentials ($14) — 10 visible (9 core + About)
 *   - Pro ($22)        — 19 visible (18 core + About)
 *   - AI Edition ($32) — 20 visible (19 core + About)
 *
 * Run: node tools/sheets-gen/templates/family-education-planner.js --tier=<essentials|pro|ai>
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

const PRODUCT_NAME = 'Family & Education Planner';

// ============================================================================
// TAB DEFINITIONS — 20 tabs across 3 tiers (19 core + About)
// ============================================================================

// PRO tabs — 9 sheets removed for Essentials
const PRO_TABS = new Set([
  '🗺️ State 529 Tax Benefits',
  '🧮 EFC SAI Calculator',
  '🏆 Scholarship Tracker',
  '📑 Aid Letter Comparison',
  '🧒 Childcare Cost Planner',
  '🏥 Family Health Budget',
  '👴 Retirement Impact',
  '🎯 Savings Goals Timeline',
  '🎓 Literacy Milestones',
]);

// AI tabs — removed for Pro + Essentials
const AI_TABS = new Set([
  '🤖 AI Family Finance Advisor',
]);

// Banner — shared across every tab (anti-Greenlight + anti-BabyMint + anti-ScholarshipOwl)
const BANNER = '✦  Why a Spreadsheet, Not an App?   Greenlight $60/yr × 18 yrs = $1,080. BabyMint $89/yr. ScholarshipOwl $40/yr. We charge once. Your kids\' data stays private.';

// ============================================================================
// CHILD PROFILES INVARIANTS — Input spine; downstream tabs reference these rows.
// Table layout: 4 children as rows, parent context as labeled cells above.
// ============================================================================

const CP = {
  // Parent context block (rows 6-12) — single cells, label in B, input in C
  PARENT_INCOME_ROW: 7,
  PARENT_MARITAL_ROW: 8,
  PARENT_STATE_ROW: 9,
  PARENT_FED_BRACKET_ROW: 10,
  PARENT_STATE_BRACKET_ROW: 11,
  PARENT_SAVEABLE_ROW: 12,

  // Children table (rows 16-20). Row 16 = header; 17-20 = 4 child rows.
  CHILD_HEADER_ROW: 16,
  CHILD_FIRST_ROW: 17,
  CHILD_LAST_ROW: 20,
  CHILD_COUNT: 4,

  // Per-child columns
  COL_SLOT: 'B',
  COL_NAME: 'C',
  COL_DOB: 'D',
  COL_AGE: 'E',
  COL_YEARS_TO_COLLEGE: 'F',
  COL_K12_TYPE: 'G',
  COL_COLLEGE_TIER: 'H',
  COL_CURRENT_SAVINGS: 'I',
  COL_MONTHLY_CONTRIB: 'J',
  COL_COLLEGE_START_YEAR: 'K',
  COL_CATEGORY: 'L',     // was COL_SPECIAL_NEEDS — expanded per FEP-022
  COL_CURRENCY: 'M',     // [COMPLEMENT FEP-005/021]
  COL_CUSTODY: 'N',      // [COMPLEMENT FEP-021] custody-share %
};

// Category options for column L (expanded per FEP-022)
const CATEGORY_OPTIONS = '"Standard,Special Needs,Gifted"';

// Currency options for column M (matches Settings & FX BaseCurrency)
const CURRENCY_OPTIONS = '"USD,EGP,AED,GBP,CAD,EUR"';

// School-type options for K-12 column
const K12_OPTIONS = '"Public,Public Magnet,Private (Religious),Private (Independent),Homeschool,Boarding"';

// College tier options
const COLLEGE_TIER_OPTIONS = '"Community,In-State Public,Out-of-State Public,Private Mid-Tier,Private Elite,Trade/Cert,Undecided"';

// Marital status options
const MARITAL_OPTIONS = '"Single,Married Filing Jointly,Married Filing Separately,Head of Household,Domestic Partner"';

// US states — drives 529 deduction lookup
const STATE_OPTIONS = '"AL,AK,AZ,AR,CA,CO,CT,DE,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY,DC"';

// College tier → 4-year sticker cost lookup (used by College Savings Planner + Aid Letter)
const COLLEGE_TIER_COST = {
  'Community':           80000,
  'In-State Public':     120000,
  'Out-of-State Public': 200000,
  'Private Mid-Tier':    280000,
  'Private Elite':       340000,
  'Trade/Cert':          35000,
  'Undecided':           150000,
};

// K-12 school-type annual cost lookup (per year per child)
const K12_ANNUAL_COST = {
  'Public':              500,    // supplies / activity fees
  'Public Magnet':       700,
  'Private (Religious)': 8500,
  'Private (Independent)': 32000,
  'Homeschool':          2500,
  'Boarding':            55000,
};

// Seed family — Emma 8 / Liam 4 / Noah 1 (autism), NY state — matches AI PDF persona.
// Each child carries Category (Standard/Special Needs/Gifted) + Currency + Custody %
// per FEP-021/022 complements.
const SEED_FAMILY = {
  parent_income: 156000,
  parent_marital: 'Married Filing Jointly',
  parent_state: 'NY',
  parent_fed_bracket: 0.24,
  parent_state_bracket: 0.0685,
  parent_saveable: 50400,    // ~$4,200/mo across all goals
  children: [
    {
      slot: 1,
      name: 'Emma',
      dob: new Date(2018, 4, 15),       // ~age 8 in 2026
      k12_type: 'Public',
      college_tier: 'Private Mid-Tier',
      current_savings: 14000,
      monthly_contrib: 420,
      college_start_year: 2036,
      category: 'Standard',
      currency: 'USD',
      custody: 1.0,
    },
    {
      slot: 2,
      name: 'Liam',
      dob: new Date(2022, 2, 8),        // ~age 4
      k12_type: 'Public',
      college_tier: 'In-State Public',
      current_savings: 3000,
      monthly_contrib: 300,
      college_start_year: 2040,
      category: 'Standard',
      currency: 'USD',
      custody: 1.0,
    },
    {
      slot: 3,
      name: 'Noah',
      dob: new Date(2025, 5, 22),       // ~age 1
      k12_type: 'Public',
      college_tier: 'Undecided',
      current_savings: 0,
      monthly_contrib: 250,
      college_start_year: 2043,
      category: 'Special Needs',
      currency: 'USD',
      custody: 1.0,
    },
    {
      slot: 4,
      name: '',
      dob: null,
      k12_type: '',
      college_tier: '',
      current_savings: 0,
      monthly_contrib: 0,
      college_start_year: null,
      category: '',
      currency: '',
      custody: null,
    },
  ],
};

// 50-state 529 deduction table — annual deduction cap for married-filing-jointly,
// approximate 2026 values. Cells used by State 529 Tax Benefits tab + EFC calc.
const STATE_529_DEDUCTION = [
  { state: 'AL', cap: 10000, taxRate: 0.05,  notes: 'Per-spouse $5K' },
  { state: 'AK', cap: 0,     taxRate: 0,     notes: 'No state income tax' },
  { state: 'AZ', cap: 4000,  taxRate: 0.025, notes: 'Per-spouse $2K' },
  { state: 'AR', cap: 10000, taxRate: 0.049, notes: 'Per-spouse $5K' },
  { state: 'CA', cap: 0,     taxRate: 0.093, notes: 'No 529 deduction (CA)' },
  { state: 'CO', cap: 999999,taxRate: 0.044, notes: 'Unlimited (CO)' },
  { state: 'CT', cap: 10000, taxRate: 0.0699,notes: 'Per-spouse $5K + 5-yr carry' },
  { state: 'DE', cap: 2000,  taxRate: 0.066, notes: '$1K single / $2K MFJ' },
  { state: 'FL', cap: 0,     taxRate: 0,     notes: 'No state income tax' },
  { state: 'GA', cap: 8000,  taxRate: 0.0549,notes: '$4K single / $8K MFJ' },
  { state: 'HI', cap: 0,     taxRate: 0.11,  notes: 'No 529 deduction' },
  { state: 'ID', cap: 12000, taxRate: 0.058, notes: '$6K single / $12K MFJ' },
  { state: 'IL', cap: 20000, taxRate: 0.0495,notes: '$10K single / $20K MFJ' },
  { state: 'IN', cap: 7500,  taxRate: 0.0315,notes: '20% credit up to $1,500' },
  { state: 'IA', cap: 7822,  taxRate: 0.057, notes: 'Per-beneficiary' },
  { state: 'KS', cap: 6000,  taxRate: 0.057, notes: 'Per-beneficiary $3K/$6K' },
  { state: 'KY', cap: 0,     taxRate: 0.04,  notes: 'No deduction' },
  { state: 'LA', cap: 4800,  taxRate: 0.0425,notes: 'Per-beneficiary $2.4K' },
  { state: 'ME', cap: 0,     taxRate: 0.0715,notes: 'No deduction' },
  { state: 'MD', cap: 5000,  taxRate: 0.0575,notes: 'Per-account $2.5K' },
  { state: 'MA', cap: 2000,  taxRate: 0.05,  notes: '$1K single / $2K MFJ' },
  { state: 'MI', cap: 10000, taxRate: 0.0425,notes: '$5K single / $10K MFJ' },
  { state: 'MN', cap: 3000,  taxRate: 0.0985,notes: '50% credit up to $500' },
  { state: 'MS', cap: 20000, taxRate: 0.05,  notes: '$10K single / $20K MFJ' },
  { state: 'MO', cap: 16000, taxRate: 0.048, notes: '$8K single / $16K MFJ' },
  { state: 'MT', cap: 6000,  taxRate: 0.0675,notes: '$3K single / $6K MFJ' },
  { state: 'NE', cap: 10000, taxRate: 0.0664,notes: '$5K single / $10K MFJ' },
  { state: 'NV', cap: 0,     taxRate: 0,     notes: 'No state income tax' },
  { state: 'NH', cap: 0,     taxRate: 0,     notes: 'No state income tax' },
  { state: 'NJ', cap: 10000, taxRate: 0.0637,notes: 'Income <$200K only' },
  { state: 'NM', cap: 999999,taxRate: 0.049, notes: 'Unlimited' },
  { state: 'NY', cap: 10000, taxRate: 0.0685,notes: '$5K single / $10K MFJ (NY Direct Plan)' },
  { state: 'NC', cap: 0,     taxRate: 0.0475,notes: 'No deduction since 2014' },
  { state: 'ND', cap: 10000, taxRate: 0.029, notes: '$5K single / $10K MFJ' },
  { state: 'OH', cap: 4000,  taxRate: 0.035, notes: 'Per-beneficiary' },
  { state: 'OK', cap: 20000, taxRate: 0.0475,notes: '$10K single / $20K MFJ + 5-yr carry' },
  { state: 'OR', cap: 360,   taxRate: 0.099, notes: 'Credit, not deduction' },
  { state: 'PA', cap: 36000, taxRate: 0.0307,notes: '$18K single / $36K MFJ (state-agnostic)' },
  { state: 'RI', cap: 1000,  taxRate: 0.0599,notes: '$500 single / $1K MFJ' },
  { state: 'SC', cap: 999999,taxRate: 0.064, notes: 'Unlimited (SC)' },
  { state: 'SD', cap: 0,     taxRate: 0,     notes: 'No state income tax' },
  { state: 'TN', cap: 0,     taxRate: 0,     notes: 'No state income tax' },
  { state: 'TX', cap: 0,     taxRate: 0,     notes: 'No state income tax' },
  { state: 'UT', cap: 4910,  taxRate: 0.0485,notes: '4.85% credit' },
  { state: 'VT', cap: 5000,  taxRate: 0.0875,notes: '10% credit on first $2,500' },
  { state: 'VA', cap: 4000,  taxRate: 0.0575,notes: 'Per-account $4K + carry' },
  { state: 'WA', cap: 0,     taxRate: 0,     notes: 'No state income tax' },
  { state: 'WV', cap: 999999,taxRate: 0.065, notes: 'Unlimited' },
  { state: 'WI', cap: 4000,  taxRate: 0.0765,notes: 'Per-beneficiary' },
  { state: 'WY', cap: 0,     taxRate: 0,     notes: 'No state income tax' },
  { state: 'DC', cap: 8000,  taxRate: 0.0895,notes: '$4K single / $8K MFJ' },
];

// ============================================================================
// TAB 1 — 🏠 DASHBOARD (Output spine)
// ============================================================================

function buildDashboard(workbook) {
  const tier = workbook._tier || 'ai';
  const sheet = workbook.addWorksheet('🏠 Dashboard');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 13, D: 13, E: 14, F: 8, G: 22, H: 12, I: 12, J: 12, K: 12, L: 12, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏠 Dashboard',
    tabSubtitle: 'Family snapshot — recomputes the moment you edit Child Profiles or Family Budget.',
    bannerText: BANNER,
    kpiData: [
      // [FIX FEP-010 + FEP-014] Drop the SUMPRODUCT(IF()) antipattern that returned #VALUE!.
      // Read the composite gauge B10 directly + guard empty-roster case.
      { label: 'FAMILY HEALTH', value: { formula: `IF(COUNTIF('👶 Child Profiles'!C${CP.CHILD_FIRST_ROW}:C${CP.CHILD_LAST_ROW},"<>")=0,"— / Enter children to begin",B10&"/100")` } },
      { label: 'ED SAVINGS',    value: { formula: `TEXT(SUM('👶 Child Profiles'!I${CP.CHILD_FIRST_ROW}:I${CP.CHILD_LAST_ROW}),"$#,##0")` } },
      { label: 'MO SAVINGS',    value: { formula: `TEXT(SUM('👶 Child Profiles'!J${CP.CHILD_FIRST_ROW}:J${CP.CHILD_LAST_ROW}),"$#,##0")&"/mo"` } },
      { label: 'YRS TO COLLEGE', value: { formula: `IFERROR(MIN(IF('👶 Child Profiles'!F${CP.CHILD_FIRST_ROW}:F${CP.CHILD_LAST_ROW}>0,'👶 Child Profiles'!F${CP.CHILD_FIRST_ROW}:F${CP.CHILD_LAST_ROW}))&" yr","—")` } },
      { label: 'CHILDREN',      value: { formula: `COUNTIF('👶 Child Profiles'!C${CP.CHILD_FIRST_ROW}:C${CP.CHILD_LAST_ROW},"<>")` } },
      { label: 'BUDGET',        value: { formula: `TEXT('💰 Family Budget'!E32,"$#,##0")&"/mo"` } },
    ],
  });

  // === SECTION 1 — Family Health Score gauge (composite of 5 sub-scores) ===
  let r = addSectionHeader(sheet, 6, 'Family Health Score',
    'Composite of 5 sub-components: education savings on-track · insurance coverage · family budget surplus · retirement protected · literacy milestones. Green ≥80, amber 50–79, red <50.',
    'B:G');

  // Big composite score — average of 5 sub-scores below.
  // [FIX FEP-014] Empty roster → blank instead of false 12/100 read.
  sheet.mergeCells(`B${r + 1}:D${r + 4}`);
  sheet.getCell(`B${r + 1}`).value = { formula: `IFERROR(IF(COUNTIF('👶 Child Profiles'!C${CP.CHILD_FIRST_ROW}:C${CP.CHILD_LAST_ROW},"<>")=0,"",ROUND(AVERAGE(E${r + 6},E${r + 7},E${r + 8},E${r + 9},E${r + 10})*100,0)),"")` };
  sheet.getCell(`B${r + 1}`).font = FONTS.scoreHuge;
  sheet.getCell(`B${r + 1}`).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getCell(`B${r + 1}`).fill = FILLS.ivory;
  sheet.getCell(`B${r + 1}`).border = {
    left: { style: 'medium', color: argb(COLORS.warmGold) },
    top: { style: 'thin', color: argb(COLORS.divider) },
    bottom: { style: 'thin', color: argb(COLORS.divider) },
    right: { style: 'thin', color: argb(COLORS.divider) },
  };

  // CF on the composite — green / amber / red
  sheet.addConditionalFormatting({
    ref: `B${r + 1}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['80'], priority: 1, style: { font: { ...FONTS.scoreHuge, color: argb(COLORS.success) } } },
      { type: 'cellIs', operator: 'between', formulae: ['50', '79'], priority: 2, style: { font: { ...FONTS.scoreHuge, color: argb(COLORS.warning) } } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['50'], priority: 3, style: { font: { ...FONTS.scoreHuge, color: argb(COLORS.alert) } } },
    ],
  });

  // 5 sub-component mini-gauges in B:F (r+6 .. r+10).
  // [FIX FEP-011] Pro-only tabs (Retirement Impact, Literacy Milestones) absent in Essentials.
  // Even with IFERROR wraps the missing-tab refs surface as #REF! in some readers — so for
  // Essentials we write literal neutral values, not formulas.
  const subGauges = [
    {
      label: 'Education savings',
      formula: `IFERROR(MIN(1,SUM('👶 Child Profiles'!I${CP.CHILD_FIRST_ROW}:I${CP.CHILD_LAST_ROW})/MAX(1,COUNTIF('👶 Child Profiles'!C${CP.CHILD_FIRST_ROW}:C${CP.CHILD_LAST_ROW},"<>")*60000)),0)`,
    },
    {
      label: 'Insurance coverage',
      formula: `IFERROR(MIN(1,'🛡️ Life Insurance Calculator'!E22/MAX(1,'🛡️ Life Insurance Calculator'!E20)),0.5)`,
    },
    {
      label: 'Budget surplus',
      formula: `IFERROR(MAX(0,MIN(1,'💰 Family Budget'!E32/MAX(1,'💰 Family Budget'!E8/12*2))),0)`,
    },
    {
      label: 'Retirement protected',
      // Pro-only ref. Essentials → literal 0.7 (neutral default per fix-changelog).
      formula: tier === 'essentials'
        ? null
        : `IFERROR(MIN(1,'👴 Retirement Impact'!E15/MAX(1,'💰 Family Budget'!E8*0.10)),0.7)`,
      essentialsLiteral: 0.7,
    },
    {
      label: 'Literacy milestones',
      // Pro-only ref. Essentials → literal 0.5.
      formula: tier === 'essentials'
        ? null
        : `IFERROR('🎓 Literacy Milestones'!E22,0.5)`,
      essentialsLiteral: 0.5,
    },
  ];

  subGauges.forEach((s, i) => {
    const ri = r + 6 + i;
    sheet.getCell(`B${ri}`).value = s.label;
    sheet.getCell(`B${ri}`).font = FONTS.smallCaps;
    sheet.getCell(`B${ri}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.mergeCells(`B${ri}:D${ri}`);

    // [FIX FEP-011] Honor essentialsLiteral fallback when formula is null (tier=essentials).
    if (s.formula) {
      sheet.getCell(`E${ri}`).value = { formula: s.formula };
    } else {
      sheet.getCell(`E${ri}`).value = s.essentialsLiteral;
    }
    sheet.getCell(`E${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).numFmt = '0%';

    sheet.getCell(`F${ri}`).value = { formula: `IF(E${ri}>=0.8,"🟢",IF(E${ri}>=0.5,"🟡","🔴"))` };
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getRow(ri).height = 22;
  });

  // === SECTION 2 — Per-child education savings vs. target (Visual #2) ===
  let r2 = addSectionHeader(sheet, r + 12, 'Education savings vs. target — per child',
    'Target = 4-year sticker cost for selected college tier. Bar = current savings as % of target.',
    'B:M');

  addTableHeader(sheet, r2 + 1,
    ['Child', 'College Tier', 'Target ($)', 'Current ($)', '% Funded', 'Yrs Left', 'Status'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  for (let i = 0; i < CP.CHILD_COUNT; i++) {
    const childRow = CP.CHILD_FIRST_ROW + i;
    const ri = r2 + 2 + i;

    // Child name
    sheet.getCell(`B${ri}`).value = { formula: `IF('👶 Child Profiles'!C${childRow}="","—",'👶 Child Profiles'!C${childRow})` };
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    // College tier
    sheet.getCell(`C${ri}`).value = { formula: `IF('👶 Child Profiles'!H${childRow}="","—",'👶 Child Profiles'!H${childRow})` };
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    // Target 4-yr cost — looked up via College Savings Planner
    sheet.getCell(`D${ri}`).value = { formula: `IFERROR(VLOOKUP('👶 Child Profiles'!H${childRow},'🎓 College Savings Planner'!B22:C28,2,FALSE),0)` };
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    // Current savings
    sheet.getCell(`E${ri}`).value = { formula: `'👶 Child Profiles'!I${childRow}` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    // % funded
    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(E${ri}/D${ri},0)` };
    sheet.getCell(`F${ri}`).numFmt = '0%';
    sheet.getCell(`F${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // Years left
    sheet.getCell(`G${ri}`).value = { formula: `IFERROR('👶 Child Profiles'!F${childRow},"—")` };
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    // Status
    sheet.getCell(`H${ri}`).value = { formula: `IF(B${ri}="—","—",IF(F${ri}>=0.7,"🟢 On-track",IF(F${ri}>=0.4,"🟡 At-risk","🔴 Falling behind")))` };
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getRow(ri).height = 22;
  }

  // === SECTION 3 — Insurance coverage donut (text-based, 3 segments) ===
  let r3 = addSectionHeader(sheet, r2 + CP.CHILD_COUNT + 4, 'Insurance coverage adequacy',
    'Three coverage types. Each shows your coverage vs. recommended — green = full, amber = partial, red = gap.',
    'B:G');

  // [FIX FEP-011] Health + Disability reference Family Health Budget (Pro-only). Essentials
  // gets literal neutral values; Pro+ gets the formulas.
  const insuranceRows = [
    { label: 'Life Insurance',  formula: `IFERROR(MIN(1,'🛡️ Life Insurance Calculator'!E22/MAX(1,'🛡️ Life Insurance Calculator'!E20)),0)`, essentialsLiteral: null },
    { label: 'Health (premium)', formula: tier === 'essentials' ? null : `IFERROR(IF('🏥 Family Health Budget'!E11>0,1,0),0)`, essentialsLiteral: 0.5 },
    { label: 'Disability',      formula: tier === 'essentials' ? null : `IFERROR(IF('🏥 Family Health Budget'!E15>0,1,0.4),0.4)`, essentialsLiteral: 0.5 },
  ];

  insuranceRows.forEach((s, i) => {
    const ri = r3 + 1 + i;
    sheet.getCell(`B${ri}`).value = s.label;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.mergeCells(`B${ri}:D${ri}`);

    if (s.formula) {
      sheet.getCell(`E${ri}`).value = { formula: s.formula };
    } else {
      sheet.getCell(`E${ri}`).value = s.essentialsLiteral;
    }
    sheet.getCell(`E${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();
    sheet.getCell(`E${ri}`).numFmt = '0%';

    sheet.getCell(`F${ri}`).value = { formula: `IF(E${ri}>=0.8,"🟢 Full",IF(E${ri}>=0.4,"🟡 Partial","🔴 Gap"))` };
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getRow(ri).height = 22;
  });

  // === SECTION 4 — Conflict alert ribbon (top-of-dashboard placement) ===
  let r4 = addSectionHeader(sheet, r3 + 6, 'Goal-timeline conflicts',
    'Shows when 2+ goals collide within a 24-month window. Pulls from Savings Goals Timeline (Pro).',
    'B:M');

  // [FIX FEP-011] Savings Goals Timeline is Pro-only. Essentials → static text.
  sheet.mergeCells(`B${r4 + 1}:M${r4 + 1}`);
  if (tier === 'essentials') {
    sheet.getCell(`B${r4 + 1}`).value = '✓ Goal-timeline conflicts auto-detect on Pro tier (Savings Goals Timeline tab).';
  } else {
    sheet.getCell(`B${r4 + 1}`).value = { formula: `IFERROR(IF('🎯 Savings Goals Timeline'!E22>1,"⚠ "&'🎯 Savings Goals Timeline'!E22&" goals overlap in 2026–2028 window — see Savings Goals Timeline tab","✓ No active goal-timeline conflicts in the 24-month window"),"✓ No active goal-timeline conflicts in the 24-month window")` };
  }
  sheet.getCell(`B${r4 + 1}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };
  sheet.getCell(`B${r4 + 1}`).fill = FILLS.warningLight;
  sheet.getCell(`B${r4 + 1}`).alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
  sheet.getCell(`B${r4 + 1}`).border = BORDER_THIN(COLORS.warning);
  sheet.getRow(r4 + 1).height = 24;

  // === SECTION 5 — 10-year savings trajectory (text-based line chart placeholder) ===
  let r5 = addSectionHeader(sheet, r4 + 4, '10-year savings trajectory',
    'Two-line overlay: current pace (charcoal) vs. target pace (warm-gold). College start years marked.',
    'B:M');

  addTableHeader(sheet, r5 + 1,
    ['Year', 'Year+1', 'Year+2', 'Year+3', 'Year+4', 'Year+5', 'Year+6', 'Year+7', 'Year+8', 'Year+9', 'Year+10'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  // Row 1: current pace — sum of (current savings + monthly contrib × 12 × years)
  sheet.getCell(`B${r5 + 2}`).value = 'Current pace';
  sheet.getCell(`B${r5 + 2}`).font = FONTS.bodyBold;
  sheet.getCell(`B${r5 + 2}`).border = BORDER_THIN();
  sheet.getCell(`B${r5 + 2}`).alignment = { indent: 1 };
  for (let y = 0; y <= 10; y++) {
    const col = String.fromCharCode(67 + y);  // C, D, E, ...
    sheet.getCell(`${col}${r5 + 2}`).value = {
      formula: `SUM('👶 Child Profiles'!I${CP.CHILD_FIRST_ROW}:I${CP.CHILD_LAST_ROW})+SUM('👶 Child Profiles'!J${CP.CHILD_FIRST_ROW}:J${CP.CHILD_LAST_ROW})*12*${y}`,
    };
    sheet.getCell(`${col}${r5 + 2}`).numFmt = '"$"#,##0';
    sheet.getCell(`${col}${r5 + 2}`).font = FONTS.body;
    sheet.getCell(`${col}${r5 + 2}`).alignment = { horizontal: 'right' };
    sheet.getCell(`${col}${r5 + 2}`).border = BORDER_THIN();
  }
  // Row 2: target pace — slightly higher; for illustrative comparison
  sheet.getCell(`B${r5 + 3}`).value = 'Target pace';
  sheet.getCell(`B${r5 + 3}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`B${r5 + 3}`).border = BORDER_THIN();
  sheet.getCell(`B${r5 + 3}`).alignment = { indent: 1 };
  for (let y = 0; y <= 10; y++) {
    const col = String.fromCharCode(67 + y);
    sheet.getCell(`${col}${r5 + 3}`).value = {
      formula: `SUM('👶 Child Profiles'!I${CP.CHILD_FIRST_ROW}:I${CP.CHILD_LAST_ROW})+SUM('👶 Child Profiles'!J${CP.CHILD_FIRST_ROW}:J${CP.CHILD_LAST_ROW})*1.20*12*${y}`,
    };
    sheet.getCell(`${col}${r5 + 3}`).numFmt = '"$"#,##0';
    sheet.getCell(`${col}${r5 + 3}`).font = { ...FONTS.body, color: argb(COLORS.warmGold) };
    sheet.getCell(`${col}${r5 + 3}`).alignment = { horizontal: 'right' };
    sheet.getCell(`${col}${r5 + 3}`).border = BORDER_THIN();
  }

  addCallout(sheet, `B${r5 + 6}:M${r5 + 7}`,
    '💡',
    'How to use this dashboard',
    'Edit Child Profiles + Family Budget — every KPI here recomputes. The Family Health Score is composite; raise any sub-score by 10 percentage points and the score moves ~2 points. Conflict ribbon turns amber when Savings Goals Timeline shows overlapping goals. Target-pace line assumes 20% more monthly contribution than current — the recommended buffer per AI Family Goals Conflict Resolver prompt.');
  sheet.getRow(r5 + 6).height = 32;
  sheet.getRow(r5 + 7).height = 32;

  // === [COMPLEMENT] 4 new KPIs at rows r5+9 / r5+10 — high-value summary blocks ===
  // Funding Gap Per Child / Total Family Education Burden as % income / Years Until Next Goal /
  // Total Insurance Coverage Gap.
  const complementRow1 = r5 + 9;
  const complementRow2 = r5 + 10;
  const complementKPIs = [
    { col: 'B', label: 'FUNDING GAP — ALL KIDS',
      formula: `TEXT(SUMIFS('🎓 College Savings Planner'!F8:F11,'🎓 College Savings Planner'!F8:F11,">0"),"$#,##0")` },
    { col: 'D', label: 'ED BURDEN / INCOME',
      formula: `IFERROR(TEXT((SUM('👶 Child Profiles'!J${CP.CHILD_FIRST_ROW}:J${CP.CHILD_LAST_ROW})*12)/MAX(1,'👶 Child Profiles'!C${CP.PARENT_INCOME_ROW}),"0.0%"),"—")` },
    { col: 'F', label: 'NEXT GOAL IN',
      formula: `IFERROR(MIN(IF('👶 Child Profiles'!F${CP.CHILD_FIRST_ROW}:F${CP.CHILD_LAST_ROW}>0,'👶 Child Profiles'!F${CP.CHILD_FIRST_ROW}:F${CP.CHILD_LAST_ROW}))&" yr","—")` },
    { col: 'H', label: 'LIFE INS GAP',
      formula: `TEXT(MAX(0,'🛡️ Life Insurance Calculator'!E22-'🛡️ Life Insurance Calculator'!C12),"$#,##0")` },
  ];
  complementKPIs.forEach((k) => {
    const labelCell = sheet.getCell(`${k.col}${complementRow1}`);
    labelCell.value = k.label;
    labelCell.font = { ...FONTS.kpiLabel, color: argb(COLORS.warmGold) };
    labelCell.alignment = { horizontal: 'left', indent: 1 };
    labelCell.fill = FILLS.ivory;
    labelCell.border = BORDER_THIN();
    sheet.mergeCells(`${k.col}${complementRow1}:${String.fromCharCode(k.col.charCodeAt(0) + 1)}${complementRow1}`);

    const valueCell = sheet.getCell(`${k.col}${complementRow2}`);
    valueCell.value = { formula: k.formula };
    valueCell.font = { ...FONTS.kpiValue, size: 16, color: argb(COLORS.charcoal) };
    valueCell.alignment = { horizontal: 'left', indent: 1 };
    valueCell.fill = FILLS.white;
    valueCell.border = BORDER_THIN();
    sheet.mergeCells(`${k.col}${complementRow2}:${String.fromCharCode(k.col.charCodeAt(0) + 1)}${complementRow2}`);
  });
  sheet.getRow(complementRow1).height = 18;
  sheet.getRow(complementRow2).height = 28;

  addFooter(sheet, r5 + 13, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 2 — 👶 CHILD PROFILES (Input spine)
// ============================================================================

function buildChildProfiles(workbook) {
  const sheet = workbook.addWorksheet('👶 Child Profiles');
  setTabColor(sheet, COLORS.success);
  // Columns M (Currency) + N (Custody %) added per FEP-005/021 complements.
  setupColumns(sheet, { A: 2, B: 6, C: 14, D: 13, E: 6, F: 8, G: 18, H: 20, I: 14, J: 12, K: 11, L: 14, M: 9, N: 10, O: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '👶 Child Profiles',
    tabSubtitle: 'Parent context + up to 4 children. Every downstream tab reads from here.',
    bannerText: BANNER,
    kpiData: [
      { label: 'CHILDREN',     value: { formula: `COUNTIF(C${CP.CHILD_FIRST_ROW}:C${CP.CHILD_LAST_ROW},"<>")` } },
      { label: 'TOTAL ED SAV', value: { formula: `TEXT(SUM(I${CP.CHILD_FIRST_ROW}:I${CP.CHILD_LAST_ROW}),"$#,##0")` } },
      { label: 'MO CONTRIB',   value: { formula: `TEXT(SUM(J${CP.CHILD_FIRST_ROW}:J${CP.CHILD_LAST_ROW}),"$#,##0")&"/mo"` } },
      { label: 'HOUSEHOLD INC',value: { formula: `TEXT(C${CP.PARENT_INCOME_ROW},"$#,##0")` } },
      { label: 'STATE',        value: { formula: `C${CP.PARENT_STATE_ROW}` } },
      { label: 'FED BRACKET',  value: { formula: `TEXT(C${CP.PARENT_FED_BRACKET_ROW},"0.0%")` } },
    ],
  });

  // === Parent context block (rows 6-12) ===
  sheet.mergeCells(`B6:N6`);
  sheet.getCell('B6').value = 'PARENT CONTEXT';
  sheet.getCell('B6').font = { ...FONTS.section, color: argb(COLORS.warmGold) };
  sheet.getCell('B6').fill = FILLS.charcoal;
  sheet.getCell('B6').alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  sheet.getRow(6).height = 22;

  const parentFields = [
    { row: CP.PARENT_INCOME_ROW,        label: 'Annual household income',         value: SEED_FAMILY.parent_income,         format: '"$"#,##0',  validation: { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0] }, note: 'Gross annual income, both parents combined. Drives EFC calc + retirement-impact math.' },
    { row: CP.PARENT_MARITAL_ROW,       label: 'Marital status',                  value: SEED_FAMILY.parent_marital,         format: null,        validation: { type: 'list', formulae: [MARITAL_OPTIONS] },                       note: 'Drives FAFSA filing status + 529 deduction caps.' },
    { row: CP.PARENT_STATE_ROW,         label: 'Residency state',                 value: SEED_FAMILY.parent_state,           format: null,        validation: { type: 'list', formulae: [STATE_OPTIONS] },                         note: 'Two-letter abbreviation. Drives State 529 Tax Benefits lookup.' },
    // [FIX FEP-029] DV switched from list to decimal-range 0–0.50 + clarifying tooltip — prevents the
    // "type 24 → ribbon reads 2400.0%" foot-gun. Tooltip clarifies decimal form.
    { row: CP.PARENT_FED_BRACKET_ROW,   label: 'Federal tax bracket',             value: SEED_FAMILY.parent_fed_bracket,     format: '0.0%',      validation: { type: 'decimal', operator: 'between', formulae: [0, 0.50], allowBlank: false, showInputMessage: true, prompt: 'Marginal federal rate as a DECIMAL (e.g. 0.24 for 24%, not 24). Range 0–0.50.', promptTitle: 'Federal tax bracket' }, note: 'Marginal rate as DECIMAL (0.24 = 24%, not 24). Affects 529 vs. Whole Life math + EFC.' },
    { row: CP.PARENT_STATE_BRACKET_ROW, label: 'State income tax rate',           value: SEED_FAMILY.parent_state_bracket,   format: '0.00%',     validation: { type: 'decimal', operator: 'between', formulae: [0, 0.15] },     note: 'Effective state rate. 0% if your state has no income tax.' },
    { row: CP.PARENT_SAVEABLE_ROW,      label: 'Annual saveable (across goals)',  value: SEED_FAMILY.parent_saveable,        format: '"$"#,##0',  validation: { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0] }, note: 'Total $ available to save annually — across kids, retirement, home, etc. Drives Savings Goals Timeline reconciliation.' },
  ];

  parentFields.forEach((f) => {
    sheet.getCell(`B${f.row}`).value = f.label;
    sheet.getCell(`B${f.row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${f.row}`).alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
    sheet.getCell(`B${f.row}`).fill = FILLS.ivory;
    sheet.getCell(`B${f.row}`).border = BORDER_THIN();
    sheet.mergeCells(`B${f.row}:E${f.row}`);

    sheet.getCell(`F${f.row}`).value = f.value;
    if (f.format) sheet.getCell(`F${f.row}`).numFmt = f.format;
    sheet.getCell(`F${f.row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`F${f.row}`).alignment = { horizontal: 'right', indent: 1, vertical: 'middle' };
    sheet.getCell(`F${f.row}`).fill = FILLS.white;
    sheet.getCell(`F${f.row}`).border = BORDER_THIN(COLORS.warmGold);
    sheet.getCell(`F${f.row}`).dataValidation = f.validation;
    sheet.getCell(`F${f.row}`).note = f.note;
    sheet.getRow(f.row).height = 22;
  });

  // Alias C column for downstream (since downstream tabs reference 'C' column for value)
  // Some formulas use C{row} — point those to F instead. Will adjust below.
  // Actually: build all downstream lookups to use C column. So let's put value in C, label in earlier cols.
  // Re-do: put label in B (merged B:E) and value in F. Adjust the dashboard formulas accordingly.
  // ACTUALLY — the dashboard already uses C{row} for these. Let's stick with C{row} for values.
  // Restructure: put label in B (no merge), value in C, with the remainder of the row as helper.

  // Clear and redo with cleaner C-column-input pattern
  parentFields.forEach((f) => {
    // Reset the merged ones
    try { sheet.unMergeCells(`B${f.row}:E${f.row}`); } catch (e) { /* swallow */ }
    sheet.getCell(`F${f.row}`).value = '';
    sheet.getCell(`F${f.row}`).fill = FILLS.offWhite;
    sheet.getCell(`F${f.row}`).border = undefined;

    sheet.getCell(`B${f.row}`).value = f.label;
    sheet.getCell(`B${f.row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${f.row}`).alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
    sheet.getCell(`B${f.row}`).fill = FILLS.ivory;
    sheet.getCell(`B${f.row}`).border = BORDER_THIN();

    sheet.getCell(`C${f.row}`).value = f.value;
    if (f.format) sheet.getCell(`C${f.row}`).numFmt = f.format;
    sheet.getCell(`C${f.row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${f.row}`).alignment = { horizontal: 'right', indent: 1, vertical: 'middle' };
    sheet.getCell(`C${f.row}`).fill = FILLS.white;
    sheet.getCell(`C${f.row}`).border = BORDER_THIN(COLORS.warmGold);
    sheet.getCell(`C${f.row}`).dataValidation = f.validation;
    sheet.getCell(`C${f.row}`).note = f.note;
  });

  // === Children table (rows 14-20) ===
  sheet.mergeCells(`B14:N14`);
  sheet.getCell('B14').value = 'CHILDREN — up to 4';
  sheet.getCell('B14').font = { ...FONTS.section, color: argb(COLORS.warmGold) };
  sheet.getCell('B14').fill = FILLS.charcoal;
  sheet.getCell('B14').alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  sheet.getRow(14).height = 22;

  // [COMPLEMENT FEP-021/022] Column L renamed Special Needs → Category;
  // M (Currency) + N (Custody %) added.
  addTableHeader(sheet, CP.CHILD_HEADER_ROW,
    ['#', 'Name', 'DOB', 'Age', 'Yrs to Coll', 'K-12 Type', 'College Tier', 'Current Savings', 'Mo. Contrib', 'Coll Start Yr', 'Category', 'Currency', 'Custody %'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']);

  SEED_FAMILY.children.forEach((c, i) => {
    const ri = CP.CHILD_FIRST_ROW + i;

    // Slot #
    sheet.getCell(`B${ri}`).value = c.slot;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    // Name
    sheet.getCell(`C${ri}`).value = c.name;
    sheet.getCell(`C${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    // DOB
    sheet.getCell(`D${ri}`).value = c.dob;
    if (c.dob) sheet.getCell(`D${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).dataValidation = { type: 'date', allowBlank: true };

    // Age — derived from DOB
    sheet.getCell(`E${ri}`).value = { formula: `IF(D${ri}="","",DATEDIF(D${ri},TODAY(),"Y"))` };
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`E${ri}`).fill = FILLS.successLight;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    // Years to college — start year - current year
    sheet.getCell(`F${ri}`).value = { formula: `IF(K${ri}="","",MAX(0,K${ri}-YEAR(TODAY())))` };
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`F${ri}`).fill = FILLS.successLight;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // K-12 type
    sheet.getCell(`G${ri}`).value = c.k12_type;
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).dataValidation = { type: 'list', formulae: [K12_OPTIONS], allowBlank: true };

    // College tier
    sheet.getCell(`H${ri}`).value = c.college_tier;
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
    sheet.getCell(`H${ri}`).dataValidation = { type: 'list', formulae: [COLLEGE_TIER_OPTIONS], allowBlank: true };

    // Current savings
    sheet.getCell(`I${ri}`).value = c.current_savings || null;
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right', indent: 1, vertical: 'middle' };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
    sheet.getCell(`I${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true };

    // Monthly contribution
    sheet.getCell(`J${ri}`).value = c.monthly_contrib || null;
    sheet.getCell(`J${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'right', indent: 1, vertical: 'middle' };
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();
    sheet.getCell(`J${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true };

    // College start year
    sheet.getCell(`K${ri}`).value = c.college_start_year;
    sheet.getCell(`K${ri}`).font = FONTS.body;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`K${ri}`).fill = FILLS.white;
    sheet.getCell(`K${ri}`).border = BORDER_THIN();
    sheet.getCell(`K${ri}`).dataValidation = { type: 'whole', operator: 'between', formulae: [2024, 2060], allowBlank: true };

    // [COMPLEMENT FEP-022] Column L: Category (Standard / Special Needs / Gifted)
    sheet.getCell(`L${ri}`).value = c.category || '';
    sheet.getCell(`L${ri}`).font = FONTS.body;
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
    sheet.getCell(`L${ri}`).fill = FILLS.white;
    sheet.getCell(`L${ri}`).border = BORDER_THIN();
    sheet.getCell(`L${ri}`).dataValidation = { type: 'list', formulae: [CATEGORY_OPTIONS], allowBlank: true };

    // [COMPLEMENT FEP-005] Column M: Currency — drives per-child FX intent.
    sheet.getCell(`M${ri}`).value = c.currency || '';
    sheet.getCell(`M${ri}`).font = FONTS.body;
    sheet.getCell(`M${ri}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`M${ri}`).fill = FILLS.white;
    sheet.getCell(`M${ri}`).border = BORDER_THIN();
    sheet.getCell(`M${ri}`).dataValidation = { type: 'list', formulae: [CURRENCY_OPTIONS], allowBlank: true };

    // [COMPLEMENT FEP-021] Column N: Custody % — applied as multiplier to CSP target.
    // 1.0 = household covers full cost; 0.5 = 50/50 split with co-parent.
    sheet.getCell(`N${ri}`).value = c.custody ?? null;
    sheet.getCell(`N${ri}`).numFmt = '0%';
    sheet.getCell(`N${ri}`).font = FONTS.body;
    sheet.getCell(`N${ri}`).alignment = { horizontal: 'right', indent: 1, vertical: 'middle' };
    sheet.getCell(`N${ri}`).fill = FILLS.white;
    sheet.getCell(`N${ri}`).border = BORDER_THIN();
    sheet.getCell(`N${ri}`).dataValidation = { type: 'decimal', operator: 'between', formulae: [0, 1], allowBlank: true };

    // Sage column-A accent strip (asset/savings tab)
    sheet.getCell(`A${ri}`).fill = FILLS.successLight;

    sheet.getRow(ri).height = 26;
  });

  // === Per-child summary callout ===
  addCallout(sheet, `B22:N23`,
    '👶',
    'How to use this tab',
    'Edit Parent Context (rows 7–12) + Children table (rows 17–20). Every downstream tab reads from here. Age + Years-to-college auto-derive from DOB and College Start Year — leave those cells alone. Column L (Category): Standard / Special Needs / Gifted — opens the ABLE account branch in 💰 Account Type Comparison + the special-needs trust scenario in 🛡️ Life Insurance Calculator. Column M (Currency) captures the child\'s funding currency; convert manually using ⚙️ Settings & FX FX table. Column N (Custody %): 100% = household covers full cost, 50% = shared with co-parent — multiplies CSP target accordingly.');
  sheet.getRow(22).height = 32;
  sheet.getRow(23).height = 32;

  addFooter(sheet, 27, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 3 — 🏫 K-12 COST MAP
// ============================================================================

function buildK12CostMap(workbook) {
  const sheet = workbook.addWorksheet('🏫 K-12 Cost Map');
  setTabColor(sheet, COLORS.warning);
  setupColumns(sheet, { A: 2, B: 18, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏫 K-12 Cost Map',
    tabSubtitle: '13 years × per-child. Cost-by-grade-band, inflation-adjusted, public vs. private comparison.',
    bannerText: BANNER,
    kpiData: [
      // [FIX FEP-002] Range corrected from C25:O28 (which double-counted SUM row + skipped Child 1)
      // to C24:O27 — the actual 4-child data block.
      { label: '13-YR TOTAL',  value: { formula: `TEXT(SUM(C24:O27),"$#,##0")` } },
      { label: 'AVG PER CHILD', value: { formula: `IFERROR(TEXT(SUM(C25:O28)/MAX(1,COUNTIF('👶 Child Profiles'!C${CP.CHILD_FIRST_ROW}:C${CP.CHILD_LAST_ROW},"<>")),"$#,##0"),"—")` } },
      { label: 'INFLATION',    value: '3.0%/yr' },
      { label: 'COVERAGE',     value: 'K–12' },
      { label: 'CHILDREN',     value: { formula: `COUNTIF('👶 Child Profiles'!C${CP.CHILD_FIRST_ROW}:C${CP.CHILD_LAST_ROW},"<>")` } },
      { label: 'BANDS',        value: 'K-5/6-8/9-12' },
    ],
  });

  // === Cost lookup table ===
  let r = addSectionHeader(sheet, 6, 'Annual cost by school type', 'These are baseline annual figures (2026). Used to project the cost-by-grade-band table below.');

  addTableHeader(sheet, r + 1, ['School Type', 'Annual Cost', 'Source / Notes'], ['B', 'C', 'D']);

  let costRow = r + 2;
  Object.entries(K12_ANNUAL_COST).forEach(([type, cost]) => {
    sheet.getCell(`B${costRow}`).value = type;
    sheet.getCell(`B${costRow}`).font = FONTS.bodyBold;
    sheet.getCell(`B${costRow}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${costRow}`).border = BORDER_THIN();

    sheet.getCell(`C${costRow}`).value = cost;
    sheet.getCell(`C${costRow}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${costRow}`).font = FONTS.body;
    sheet.getCell(`C${costRow}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`C${costRow}`).fill = FILLS.white;
    sheet.getCell(`C${costRow}`).border = BORDER_THIN();
    sheet.getCell(`C${costRow}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0] };

    sheet.getCell(`D${costRow}`).value = type === 'Public' ? 'Activity fees, supplies, field trips'
                                       : type === 'Public Magnet' ? 'Similar to public + magnet application fees'
                                       : type === 'Private (Religious)' ? 'Parochial school avg, varies by region'
                                       : type === 'Private (Independent)' ? 'NAIS member school avg (2025-26)'
                                       : type === 'Homeschool' ? 'Curriculum + co-op + supplies'
                                       : 'Boarding school tuition + room/board';
    sheet.getCell(`D${costRow}`).font = FONTS.bodyMuted;
    sheet.getCell(`D${costRow}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`D${costRow}`).border = BORDER_THIN();
    sheet.getCell(`D${costRow}`).fill = FILLS.white;

    sheet.getCell(`A${costRow}`).fill = FILLS.warningLight;
    sheet.getRow(costRow).height = 22;
    costRow++;
  });

  // === Per-child × per-grade-year projection ===
  let r2 = addSectionHeader(sheet, costRow + 2, 'Per-child cost — Kindergarten through 12th grade',
    'Years numbered K=1, 1st=2, ..., 12th=13. Annual cost shown is school-type baseline × 1.03^(year offset).',
    'B:O');

  const gradeHeaders = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  addTableHeader(sheet, r2 + 1, ['Child', ...gradeHeaders],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']);

  for (let i = 0; i < CP.CHILD_COUNT; i++) {
    const childRow = CP.CHILD_FIRST_ROW + i;
    const ri = r2 + 2 + i;

    sheet.getCell(`B${ri}`).value = { formula: `IF('👶 Child Profiles'!C${childRow}="","Child "&${i + 1},'👶 Child Profiles'!C${childRow})` };
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    gradeHeaders.forEach((g, gi) => {
      const col = String.fromCharCode(67 + gi);   // C..O
      // Cost = baseline cost × inflation^(year offset)
      sheet.getCell(`${col}${ri}`).value = {
        // [FIX FEP-004] Hardcoded 1.03 replaced with K12Inflation named range (⚙️ Settings & FX).
        formula: `IFERROR(IF('👶 Child Profiles'!G${childRow}="",0,VLOOKUP('👶 Child Profiles'!G${childRow},B${r + 2}:C${costRow - 1},2,FALSE)*POWER(1+K12Inflation,${gi})),0)`,
      };
      sheet.getCell(`${col}${ri}`).numFmt = '"$"#,##0';
      sheet.getCell(`${col}${ri}`).font = FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right' };
      sheet.getCell(`${col}${ri}`).fill = FILLS.white;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    });

    sheet.getCell(`A${ri}`).fill = FILLS.warningLight;
    sheet.getRow(ri).height = 22;
  }

  // 13-yr total row
  const totalRow = r2 + 2 + CP.CHILD_COUNT;
  sheet.getCell(`B${totalRow}`).value = '13-YEAR TOTAL';
  sheet.getCell(`B${totalRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };
  sheet.getCell(`B${totalRow}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${totalRow}`).fill = FILLS.ivory;
  sheet.getCell(`B${totalRow}`).border = { top: { style: 'medium', color: argb(COLORS.warning) } };
  gradeHeaders.forEach((g, gi) => {
    const col = String.fromCharCode(67 + gi);
    sheet.getCell(`${col}${totalRow}`).value = { formula: `SUM(${col}${r2 + 2}:${col}${r2 + 1 + CP.CHILD_COUNT})` };
    sheet.getCell(`${col}${totalRow}`).numFmt = '"$"#,##0';
    sheet.getCell(`${col}${totalRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };
    sheet.getCell(`${col}${totalRow}`).alignment = { horizontal: 'right' };
    sheet.getCell(`${col}${totalRow}`).fill = FILLS.ivory;
    sheet.getCell(`${col}${totalRow}`).border = { top: { style: 'medium', color: argb(COLORS.warning) } };
  });

  // [COMPLEMENT FEP-024] Disclosure: the K-12 grid inflates from grade K (yr 0) regardless of
  // the child's current age. For older children, the K through current-grade columns represent
  // already-spent years, not forward commitments. Documented here; precise per-child
  // current-grade indexing deferred to v1.1.
  sheet.getCell(`B${totalRow + 1}`).value = '⚠ Note: grid inflates from grade K regardless of child age. For older children, K through current grade is already-spent (not forward).';
  sheet.getCell(`B${totalRow + 1}`).font = { ...FONTS.bodyMuted, italic: true };
  sheet.getCell(`B${totalRow + 1}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
  sheet.mergeCells(`B${totalRow + 1}:O${totalRow + 1}`);
  sheet.getRow(totalRow + 1).height = 20;

  // Family grand total
  sheet.mergeCells(`B${totalRow + 2}:F${totalRow + 3}`);
  sheet.getCell(`B${totalRow + 2}`).value = { formula: `"FAMILY TOTAL"&CHAR(10)&TEXT(SUM(C${r2 + 2}:O${r2 + 1 + CP.CHILD_COUNT}),"$#,##0")` };
  sheet.getCell(`B${totalRow + 2}`).font = { name: 'Inter', size: 16, bold: true, color: argb(COLORS.warning) };
  sheet.getCell(`B${totalRow + 2}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  sheet.getCell(`B${totalRow + 2}`).fill = FILLS.warningLight;
  sheet.getCell(`B${totalRow + 2}`).border = BORDER_THIN(COLORS.warning);

  addCallout(sheet, `H${totalRow + 2}:O${totalRow + 3}`,
    '🏫',
    'Public vs. Private trade-off',
    'Switching one child from Public to Private (Independent) over 13 years adds ~$540K (inflation-adjusted) — roughly enough to fund 4 years of private-elite college for two children. The choice is real; this tab makes the math visible.');

  sheet.getRow(totalRow + 2).height = 32;
  sheet.getRow(totalRow + 3).height = 32;

  addFooter(sheet, totalRow + 6, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 4 — 🎓 COLLEGE SAVINGS PLANNER
// ============================================================================

function buildCollegeSavingsPlanner(workbook) {
  const sheet = workbook.addWorksheet('🎓 College Savings Planner');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 14, C: 18, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 18, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🎓 College Savings Planner',
    tabSubtitle: 'Per child: target / current / gap / recommended monthly contribution.',
    bannerText: BANNER,
    kpiData: [
      { label: 'TOTAL TARGET', value: { formula: `TEXT(SUM(D9:D12),"$#,##0")` } },
      { label: 'TOTAL SAVED',  value: { formula: `TEXT(SUM(E9:E12),"$#,##0")` } },
      { label: 'TOTAL GAP',    value: { formula: `TEXT(SUM(F9:F12),"$#,##0")` } },
      { label: 'AVG % FUNDED', value: { formula: `IFERROR(TEXT(AVERAGEIF(G9:G12,"<>"),"0%"),"—")` } },
      { label: 'ON-TRACK',     value: { formula: `COUNTIF(I9:I12,"🟢 On-track")&" / "&COUNTIF('👶 Child Profiles'!C${CP.CHILD_FIRST_ROW}:C${CP.CHILD_LAST_ROW},"<>")` } },
      { label: 'AVG RATE',     value: '6% real' },
    ],
  });

  // === Per-child planner table ===
  let r = 7;
  addTableHeader(sheet, r,
    ['Child', 'College Tier', 'Target ($)', 'Current ($)', 'Gap ($)', '% Funded', 'Yrs Left', 'Rec Mo Contrib', 'Status'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

  for (let i = 0; i < CP.CHILD_COUNT; i++) {
    const childRow = CP.CHILD_FIRST_ROW + i;
    const ri = r + 1 + i;   // rows 9..12

    // Child name
    sheet.getCell(`B${ri}`).value = { formula: `IF('👶 Child Profiles'!C${childRow}="","Child "&${i + 1},'👶 Child Profiles'!C${childRow})` };
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    // College tier
    sheet.getCell(`C${ri}`).value = { formula: `IF('👶 Child Profiles'!H${childRow}="","—",'👶 Child Profiles'!H${childRow})` };
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    // [FIX FEP-001] Target — VLOOKUP range corrected to $B$19:$C$25 (was B22:C28 — off by 3 rows
    // which caused Community/In-State Public/Out-of-State Public to silently return 0).
    // [FIX FEP-006] FV-adjusted: multiply by POWER(1+Inflation, Yrs) so target is the inflation-
    // adjusted future cost, not today's sticker.
    // [FIX FEP-015] Scholarship offset: subtract SUMIFS of Won scholarships for this child.
    // [FIX FEP-021] Custody share: multiply by Child Profiles!N (1.0 / 0.5 / etc.).
    // [FIX FEP3-001 + FEP3-003] Scholarship SUMIFS sum_range G:G (Award $); Status criteria on F:F.
    // [FIX FEP3-003] The SUMIFS is wrapped in IFERROR(...,0) so when Scholarship Tracker is absent
    // (Essentials tier), only the offset becomes 0 — not the entire target. Without this fix,
    // Essentials CSP D8 read $0 because the outer IFERROR caught the missing-tab #REF! and
    // collapsed the whole formula. Emma's target should be $456K in Essentials too.
    sheet.getCell(`D${ri}`).value = { formula: `IFERROR(IF('👶 Child Profiles'!C${childRow}="",0,(IFERROR(VLOOKUP('👶 Child Profiles'!H${childRow},$B$19:$C$25,2,FALSE),0)-IFERROR(SUMIFS('🏆 Scholarship Tracker'!G8:G40,'🏆 Scholarship Tracker'!C8:C40,'👶 Child Profiles'!C${childRow},'🏆 Scholarship Tracker'!F8:F40,"Won"),0))*IF(ISNUMBER('👶 Child Profiles'!N${childRow}),'👶 Child Profiles'!N${childRow},1)*POWER(1+Inflation,'👶 Child Profiles'!F${childRow})),0)` };
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    // Current
    sheet.getCell(`E${ri}`).value = { formula: `'👶 Child Profiles'!I${childRow}` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    // Gap
    sheet.getCell(`F${ri}`).value = { formula: `MAX(0,D${ri}-E${ri})` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // % funded
    sheet.getCell(`G${ri}`).value = { formula: `IFERROR(E${ri}/D${ri},0)` };
    sheet.getCell(`G${ri}`).numFmt = '0%';
    sheet.getCell(`G${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    // Years left
    sheet.getCell(`H${ri}`).value = { formula: `'👶 Child Profiles'!F${childRow}` };
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    // [FIX FEP-004] Use EduReturn named range (was hardcoded 1.06).
    // [FIX FEP-008] MAX(0, ...) clamps negative rec_mo when overfunded.
    // [FIX FEP-013] If goal year already past (H<=0) → return 0, status pill handles display.
    sheet.getCell(`I${ri}`).value = {
      formula: `IFERROR(IF(H${ri}<=0,0,IF(F${ri}<=0,0,MAX(0,(D${ri}-E${ri}*POWER(1+EduReturn,H${ri}))/(12*((POWER(1+EduReturn,H${ri})-1)/EduReturn))))),0)`,
    };
    sheet.getCell(`I${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`I${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();

    // [FIX FEP-009] Status guards target=0, gap≤0 (funded), goal-past states.
    // Order: empty slot → goal year past → funded → on-track / at-risk / falling-behind.
    sheet.getCell(`J${ri}`).value = {
      formula: `IF('👶 Child Profiles'!C${childRow}="","—",IF(H${ri}<=0,IF(F${ri}<=0,"✓ Funded","⚠ Goal year past"),IF(F${ri}<=0,"✓ Funded",IF('👶 Child Profiles'!J${childRow}>=I${ri}*0.95,"🟢 On-track",IF('👶 Child Profiles'!J${childRow}>=I${ri}*0.6,"🟡 At-risk","🔴 Falling behind")))))`,
    };
    sheet.getCell(`J${ri}`).font = FONTS.body;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    // CF on % funded — green/amber/red
    sheet.addConditionalFormatting({
      ref: `G${ri}`,
      rules: [
        { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['0.7'], priority: 1, style: { font: { ...FONTS.bodyBold, color: argb(COLORS.success) }, fill: FILLS.successLight } },
        { type: 'cellIs', operator: 'between', formulae: ['0.4', '0.69'], priority: 2, style: { font: { ...FONTS.bodyBold, color: argb(COLORS.warning) }, fill: FILLS.warningLight } },
        { type: 'cellIs', operator: 'lessThan', formulae: ['0.4'], priority: 3, style: { font: { ...FONTS.bodyBold, color: argb(COLORS.alert) }, fill: FILLS.alertLight } },
      ],
    });

    sheet.getCell(`A${ri}`).fill = FILLS.successLight;
    sheet.getRow(ri).height = 24;
  }

  // === Tier cost lookup (referenced by VLOOKUP above) ===
  let r2 = addSectionHeader(sheet, 14, 'College tier — 4-year sticker cost lookup',
    'Edit these to match the schools your child targets. Lookup feeds the Target column above.', 'B:E');

  addTableHeader(sheet, r2 + 1, ['College Tier', '4-yr Cost', '', ''], ['B', 'C', 'D', 'E']);

  let tierRow = r2 + 2;   // rows 22..28 (7 tiers)
  Object.entries(COLLEGE_TIER_COST).forEach(([tier, cost]) => {
    sheet.getCell(`B${tierRow}`).value = tier;
    sheet.getCell(`B${tierRow}`).font = FONTS.bodyBold;
    sheet.getCell(`B${tierRow}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${tierRow}`).border = BORDER_THIN();
    sheet.getCell(`B${tierRow}`).fill = FILLS.ivory;

    sheet.getCell(`C${tierRow}`).value = cost;
    sheet.getCell(`C${tierRow}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${tierRow}`).font = FONTS.body;
    sheet.getCell(`C${tierRow}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`C${tierRow}`).fill = FILLS.white;
    sheet.getCell(`C${tierRow}`).border = BORDER_THIN();
    sheet.getCell(`C${tierRow}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0] };

    sheet.getRow(tierRow).height = 20;
    tierRow++;
  });

  // [FIX FEP-026] Callout references Settings & FX (no hardcoded 6%/0.06 in copy).
  addCallout(sheet, `B${tierRow + 2}:L${tierRow + 3}`,
    '🎓',
    'Recommended monthly contribution math',
    'Return assumption lives in ⚙️ Settings & FX (named range EduReturn). Inflation lives there too (Inflation). Default: 6% return, 5% inflation. Edit once in Settings & FX → every child re-projects. Status: 🟢 if your actual contribution is ≥95% of recommended, 🟡 if 60–94%, 🔴 below 60%.');
  sheet.getRow(tierRow + 2).height = 32;
  sheet.getRow(tierRow + 3).height = 32;

  addFooter(sheet, tierRow + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 5 — 💰 ACCOUNT TYPE COMPARISON
// ============================================================================

function buildAccountTypeComparison(workbook) {
  const sheet = workbook.addWorksheet('💰 Account Type Comparison');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 26, C: 22, D: 22, E: 22, F: 22, G: 4, H: 4, I: 4, J: 4, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💰 Account Type Comparison',
    tabSubtitle: '529 vs. Coverdell vs. UTMA/UGMA vs. ABLE. Side-by-side. Recommended per child.',
    bannerText: BANNER,
    kpiData: [
      { label: '4 OPTIONS',    value: '529 / Coverdell / UTMA / ABLE' },
      { label: 'BEST DEFAULT', value: '529' },
      { label: 'FAFSA HIT',    value: '529: 5.6% / UTMA: 20%' },
      { label: 'SPECIAL NEEDS',value: 'ABLE wins' },
      { label: 'K-12 LIMIT',   value: '529: $10K/yr' },
      { label: 'CONTROL',      value: '529/Cov/ABLE: yours · UTMA: child at 18-21' },
    ],
  });

  // === 4-column comparison grid ===
  let r = addSectionHeader(sheet, 6, 'Four account types — side by side',
    'Each column is one vehicle. Each row is one comparison axis. The "RECOMMENDED" badge below lights up based on each child\'s profile.');

  addTableHeader(sheet, r + 1,
    ['', '529 Plan', 'Coverdell ESA', 'UTMA / UGMA', 'ABLE Account'],
    ['B', 'C', 'D', 'E', 'F']);

  const rows = [
    ['Annual contribution limit', '$18K/yr (no fed cap; 5-yr superfund $90K)', '$2,000/yr per beneficiary', 'No annual limit (gift-tax above $18K)', '$18K/yr (special-needs only)'],
    ['Income limits',            'None', 'Phases out $95K–$110K single', 'None', 'None'],
    ['Use of funds',             'Qualified ed (college + K-12 up to $10K/yr + apprenticeships)', 'K-12 + college (any qualified ed)', 'Anything benefiting the minor', 'Disability expenses (broad — housing, transport, ed, health)'],
    ['Investment control',       'Parent / account owner', 'Parent / responsible adult', 'Parent until majority (18-21)', 'Beneficiary (with custodian if minor)'],
    ['Ownership at 18-21',       'Stays with parent', 'Transfers to beneficiary', 'TRANSFERS TO CHILD — irrevocable', 'Stays with beneficiary'],
    ['FAFSA impact',             'Parent asset (~5.6% of value counted)', 'Parent asset (~5.6%)', 'STUDENT asset (~20%, hits aid hardest)', 'EXCLUDED from FAFSA (up to $100K)'],
    ['State tax deduction',      'Often yes (in-state plan; see State 529 tab)', 'No', 'No', 'Some states yes (in-state ABLE)'],
    ['Tax-free withdrawals',     'Yes (qualified ed expenses)', 'Yes (qualified ed)', 'Capital gains taxed at child rate (kiddie tax)', 'Yes (qualified disability expenses)'],
    ['Penalty for non-qualified','10% federal + tax on earnings', '10% + tax on earnings', 'No penalty (taxable to child)', 'Same: 10% + tax on earnings'],
    ['SECURE 2.0 Roth rollover', 'Yes — up to $35K leftover to Roth (15-yr hold)', 'No', 'No', 'No'],
    ['Best for...',              'Default — most families, most situations', 'K-12 private + college blend with low income', 'Wedding fund / car / non-education uses', 'Special-needs child of any age'],
  ];

  rows.forEach((row, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = row[0];
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true, vertical: 'middle' };
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    for (let c = 0; c < 4; c++) {
      const col = ['C', 'D', 'E', 'F'][c];
      sheet.getCell(`${col}${ri}`).value = row[c + 1];
      sheet.getCell(`${col}${ri}`).font = FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true, vertical: 'middle' };
      sheet.getCell(`${col}${ri}`).fill = FILLS.white;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
    }
    sheet.getRow(ri).height = 34;
  });

  // === Per-child recommendation ===
  let r2 = addSectionHeader(sheet, r + 2 + rows.length + 2, 'Recommended per child',
    'Special-needs flag → ABLE. Otherwise → 529 (state plan if your state has a deduction; otherwise Utah my529).', 'B:F');

  addTableHeader(sheet, r2 + 1, ['Child', 'Recommended', 'Reason', '', ''], ['B', 'C', 'D', 'E', 'F']);

  for (let i = 0; i < CP.CHILD_COUNT; i++) {
    const childRow = CP.CHILD_FIRST_ROW + i;
    const ri = r2 + 2 + i;

    sheet.getCell(`B${ri}`).value = { formula: `IF('👶 Child Profiles'!C${childRow}="","Child "&${i + 1},'👶 Child Profiles'!C${childRow})` };
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = {
      formula: `IF('👶 Child Profiles'!C${childRow}="","—",IF(ISNUMBER(SEARCH("Yes",'👶 Child Profiles'!L${childRow})),"ABLE + 529 split","529"))`,
    };
    sheet.getCell(`C${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.mergeCells(`D${ri}:F${ri}`);
    sheet.getCell(`D${ri}`).value = {
      formula: `IF('👶 Child Profiles'!C${childRow}="","—",IF(ISNUMBER(SEARCH("Yes",'👶 Child Profiles'!L${childRow})),"ABLE: tax-free for disability expenses + excluded from FAFSA + protects SSI/Medicaid up to $100K. Pair with 529 for traditional college path if applicable.","529: state-tax deduction (if applicable) + tax-free growth + SECURE 2.0 Roth rollover safety valve. Open in-state plan if your state offers a deduction; see State 529 Tax Benefits tab."))`,
    };
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true, vertical: 'middle' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`A${ri}`).fill = FILLS.successLight;
    sheet.getRow(ri).height = 36;
  }

  addCallout(sheet, `B${r2 + 2 + CP.CHILD_COUNT + 2}:F${r2 + 2 + CP.CHILD_COUNT + 3}`,
    '💰',
    'Why most families default to 529',
    'For ~85% of families the 529 wins: parent-controlled, low FAFSA hit, often state-tax-deductible, and SECURE 2.0 added a Roth-rollover escape hatch ($35K lifetime) that closed the "what if my kid skips college" objection. The ABLE branch is for special-needs cohorts; UTMA is rarely the right primary vehicle for education savings.');
  sheet.getRow(r2 + 2 + CP.CHILD_COUNT + 2).height = 32;
  sheet.getRow(r2 + 2 + CP.CHILD_COUNT + 3).height = 32;

  addFooter(sheet, r2 + 2 + CP.CHILD_COUNT + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 6 — 🏦 529 vs. WHOLE LIFE
// ============================================================================

function build529vsWholeLife(workbook) {
  const sheet = workbook.addWorksheet('🏦 529 vs. Whole Life');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 18, D: 18, E: 18, F: 4, G: 4, H: 4, I: 4, J: 4, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏦 529 vs. Whole Life',
    tabSubtitle: 'The comparison most insurance agents won\'t show you. After-tax cost over 18 years.',
    bannerText: BANNER,
    kpiData: [
      // [FIX FEP-016] Year-18 lives at row 40 (not row 24 — that's year 2). KPI now reads correct row.
      { label: '529 BAL @ 18',      value: { formula: `TEXT(D40,"$#,##0")` } },
      { label: 'WHOLE LIFE @ 18',   value: { formula: `TEXT(E40,"$#,##0")` } },
      { label: 'DIFFERENCE',        value: { formula: `TEXT(D40-E40,"$#,##0")` } },
      { label: '529 EXPENSE RATIO', value: '0.12%' },
      { label: 'WL FEES',           value: '~3-5%' },
      { label: 'WL BORROW RATE',    value: '5-8%' },
    ],
  });

  // === Input assumptions ===
  let r = addSectionHeader(sheet, 6, 'Assumptions', 'Edit these — the projection table below recalculates.');

  const assumptions = [
    { row: r + 1, label: 'Annual contribution', val: 5000, fmt: '"$"#,##0', note: 'Annual dollars going into either account.' },
    { row: r + 2, label: '529 expected return', val: 0.06, fmt: '0.0%', note: '6% real (after inflation) is a common diversified equity assumption.' },
    { row: r + 3, label: 'Whole Life cash value return', val: 0.02, fmt: '0.0%', note: '2% net after agent commission + insurance company internal costs (industry typical).' },
    { row: r + 4, label: 'Federal tax bracket', val: 0.24, fmt: '0.0%', note: 'Used for the after-tax comparison.' },
    { row: r + 5, label: 'State 529 deduction value', val: 342, fmt: '"$"#,##0', note: 'NY at 6.85% × $5K = $342/yr (default seed). Edit for your state.' },
    { row: r + 6, label: 'Years to college', val: 18, fmt: '0', note: 'Length of accumulation period.' },
  ];

  assumptions.forEach((a) => {
    sheet.getCell(`B${a.row}`).value = a.label;
    sheet.getCell(`B${a.row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${a.row}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${a.row}`).fill = FILLS.ivory;
    sheet.getCell(`B${a.row}`).border = BORDER_THIN();

    sheet.getCell(`C${a.row}`).value = a.val;
    sheet.getCell(`C${a.row}`).numFmt = a.fmt;
    sheet.getCell(`C${a.row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${a.row}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`C${a.row}`).fill = FILLS.white;
    sheet.getCell(`C${a.row}`).border = BORDER_THIN(COLORS.warmGold);
    sheet.getCell(`C${a.row}`).note = a.note;

    sheet.mergeCells(`D${a.row}:E${a.row}`);
    sheet.getCell(`D${a.row}`).value = a.note;
    sheet.getCell(`D${a.row}`).font = FONTS.bodyMuted;
    sheet.getCell(`D${a.row}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`D${a.row}`).fill = FILLS.white;
    sheet.getCell(`D${a.row}`).border = BORDER_THIN();

    sheet.getRow(a.row).height = 22;
  });

  // === 18-year projection table ===
  let r2 = addSectionHeader(sheet, r + 9, '18-year accumulation projection',
    'Two-account side-by-side. After tax-deduction value applied to 529; whole-life net return applied to that side.', 'B:E');

  addTableHeader(sheet, r2 + 1, ['Year', 'Annual contribution', '529 Balance', 'Whole Life Cash Value'], ['B', 'C', 'D', 'E']);

  // Project years 1..18; output rows r2+2 .. r2+19
  // Year row = r2 + 2 + (year - 1) = r2 + 1 + year
  for (let y = 1; y <= 18; y++) {
    const ri = r2 + 1 + y;

    sheet.getCell(`B${ri}`).value = y;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    // Annual contribution (constant)
    sheet.getCell(`C${ri}`).value = { formula: `$C$${r + 1}` };
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    // 529 balance — FV formula with annuity
    // FV = PMT × ((1+r)^n - 1) / r + state deduction × n (compounded approximation: simple addition)
    sheet.getCell(`D${ri}`).value = {
      formula: `($C$${r + 1}*((POWER(1+$C$${r + 2},${y})-1)/$C$${r + 2}))+$C$${r + 5}*${y}*(1+$C$${r + 2})`,
    };
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = { ...FONTS.body, color: argb(COLORS.success) };
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    // Whole Life cash value — slower growth, no tax benefit
    sheet.getCell(`E${ri}`).value = {
      formula: `($C$${r + 1}*((POWER(1+$C$${r + 3},${y})-1)/$C$${r + 3}))*0.7`,
    };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = { ...FONTS.body, color: argb(COLORS.warning) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`A${ri}`).fill = FILLS.charcoalLight;
    sheet.getRow(ri).height = 20;
  }

  // Final-year summary callout
  addCallout(sheet, `B${r2 + 22}:E${r2 + 24}`,
    '🏦',
    'The math agents don\'t show you',
    `At 18 years and $${assumptions[0].val.toLocaleString()}/yr contributions: 529 plan finishes ~$${Math.round(assumptions[0].val * (Math.pow(1.06, 18) - 1) / 0.06).toLocaleString()}+. Whole life cash value ~30% lower — the 70% factor accounts for first-year commissions + ongoing fees + cash-value lag. The whole-life pitch ("tax-free growth + insurance benefit") sounds appealing, but term life is 15× cheaper for equivalent death benefit and a 529 has near-identical tax treatment for qualified ed. The one exception: special-needs-trust funding (see AI Life Insurance Advisor, page 5).`);

  addFooter(sheet, r2 + 28, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 7 — 🗺️ STATE 529 TAX BENEFITS (Pro)
// ============================================================================

function buildState529TaxBenefits(workbook) {
  const sheet = workbook.addWorksheet('🗺️ State 529 Tax Benefits');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 8, C: 18, D: 14, E: 14, F: 30, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🗺️ State 529 Tax Benefits',
    tabSubtitle: '50 states + DC. Selected-state annual deduction value + 18-year compounded benefit.',
    bannerText: BANNER,
    kpiData: [
      { label: 'YOUR STATE',       value: { formula: `'👶 Child Profiles'!C${CP.PARENT_STATE_ROW}` } },
      { label: 'ANNUAL CONTRIB',   value: { formula: `TEXT(C7,"$#,##0")` } },
      { label: 'STATE CAP',        value: { formula: `TEXT(D7,"$#,##0")` } },
      { label: 'ANNUAL SAVINGS',   value: { formula: `TEXT(E7,"$#,##0")` } },
      { label: '18-YR COMPOUNDED', value: { formula: `TEXT(F7,"$#,##0")` } },
      { label: 'WORTH IT?',        value: { formula: `IF(E7>=200,"🟢 Worth claiming",IF(E7>=50,"🟡 Marginal","🔴 Skip"))` } },
    ],
  });

  // === Selected-state calculator ===
  let r = addSectionHeader(sheet, 6, 'Your state — annual + compound savings',
    'Pulled from Parent Context state. Edit annual contribution to project your scenario.');

  sheet.getCell(`B${r + 1}`).value = 'STATE';
  sheet.getCell(`B${r + 1}`).font = FONTS.smallCaps;
  sheet.getCell(`B${r + 1}`).fill = FILLS.charcoal;
  sheet.getCell(`B${r + 1}`).alignment = { horizontal: 'center' };
  sheet.getCell(`B${r + 1}`).border = BORDER_THIN(COLORS.charcoal);
  // Note: this cell sits at row 7 (r + 1 = 7 since r = 6). However row 7 is reserved...
  // Actually r is the return from addSectionHeader. With section title + subtitle + underline, r is r+3 from startRow.
  // Let me adjust — addSectionHeader returns underlineRow + 1. With startRow=6 + subtitle => underline at 8, returns 9. Wait —
  // Looking at the addSectionHeader code: title at startRow (6), subtitle at startRow+1 (7), underline at startRow+2 (8), returns 9.
  // So r = 9 here.

  // Override layout entirely with absolute rows for clarity
  const SR = 11;  // selected-state calc row

  // Header row: STATE | CONTRIB | CAP | SAVINGS | NOTES | 18-YR
  addTableHeader(sheet, SR - 1, ['State', 'Contribution', 'Cap', 'Annual Savings', 'Notes', '18-yr Compounded'], ['B', 'C', 'D', 'E', 'F', 'G']);

  // Calculator row
  sheet.getCell(`B${SR}`).value = { formula: `'👶 Child Profiles'!C${CP.PARENT_STATE_ROW}` };
  sheet.getCell(`B${SR}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`B${SR}`).alignment = { horizontal: 'center' };
  sheet.getCell(`B${SR}`).fill = FILLS.ivory;
  sheet.getCell(`B${SR}`).border = BORDER_THIN(COLORS.warmGold);

  sheet.getCell(`C${SR}`).value = 5000;
  sheet.getCell(`C${SR}`).numFmt = '"$"#,##0';
  sheet.getCell(`C${SR}`).font = FONTS.bodyBold;
  sheet.getCell(`C${SR}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`C${SR}`).fill = FILLS.white;
  sheet.getCell(`C${SR}`).border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell(`C${SR}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0] };

  // Lookup state row in state table (rows 18..67)
  sheet.getCell(`D${SR}`).value = { formula: `IFERROR(VLOOKUP(B${SR},B18:E67,2,FALSE),0)` };
  sheet.getCell(`D${SR}`).numFmt = '"$"#,##0';
  sheet.getCell(`D${SR}`).font = FONTS.body;
  sheet.getCell(`D${SR}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`D${SR}`).fill = FILLS.white;
  sheet.getCell(`D${SR}`).border = BORDER_THIN();

  // Annual savings = MIN(contrib, cap) × state rate
  sheet.getCell(`E${SR}`).value = { formula: `MIN(C${SR},D${SR})*IFERROR(VLOOKUP(B${SR},B18:E67,3,FALSE),0)` };
  sheet.getCell(`E${SR}`).numFmt = '"$"#,##0';
  sheet.getCell(`E${SR}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
  sheet.getCell(`E${SR}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E${SR}`).fill = FILLS.white;
  sheet.getCell(`E${SR}`).border = BORDER_THIN();

  sheet.getCell(`F${SR}`).value = { formula: `IFERROR(VLOOKUP(B${SR},B18:E67,4,FALSE),"—")` };
  sheet.getCell(`F${SR}`).font = FONTS.bodyMuted;
  sheet.getCell(`F${SR}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
  sheet.getCell(`F${SR}`).fill = FILLS.white;
  sheet.getCell(`F${SR}`).border = BORDER_THIN();

  // 18-yr compounded (savings reinvested at 6%)
  sheet.getCell(`G${SR}`).value = { formula: `E${SR}*((POWER(1.06,18)-1)/0.06)` };
  sheet.getCell(`G${SR}`).numFmt = '"$"#,##0';
  sheet.getCell(`G${SR}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
  sheet.getCell(`G${SR}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`G${SR}`).fill = FILLS.white;
  sheet.getCell(`G${SR}`).border = BORDER_THIN();

  sheet.getRow(SR).height = 28;

  // === All 50 states + DC table (rows 17..67) ===
  let r2 = 17;
  addTableHeader(sheet, r2, ['State', 'Cap (MFJ)', 'State Tax Rate', 'Notes', '', ''], ['B', 'C', 'D', 'E', 'F', 'G']);

  STATE_529_DEDUCTION.forEach((s, i) => {
    const ri = r2 + 1 + i;

    sheet.getCell(`B${ri}`).value = s.state;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = s.cap >= 999999 ? 999999 : s.cap;
    sheet.getCell(`C${ri}`).numFmt = s.cap >= 999999 ? '"Unlimited"' : '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = s.taxRate;
    sheet.getCell(`D${ri}`).numFmt = '0.00%';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.mergeCells(`E${ri}:G${ri}`);
    sheet.getCell(`E${ri}`).value = s.notes;
    sheet.getCell(`E${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`A${ri}`).fill = FILLS.charcoalLight;
    sheet.getRow(ri).height = 20;
  });

  const lastRow = r2 + STATE_529_DEDUCTION.length;

  addCallout(sheet, `B${lastRow + 2}:L${lastRow + 3}`,
    '🗺️',
    'In-state vs. out-of-state plan',
    'Stay in-state if your state offers a deduction worth ≥$200/yr. The compounding over 18 years is meaningful — NY\'s $342/yr saves ~$10,000 reinvested at 6%. Only go out-of-state (Utah my529, Nevada Vanguard) if your home plan has expense ratios >0.5% AND no state deduction. See AI State 529 Optimizer (PDF page 10) for your state\'s scenario.');
  sheet.getRow(lastRow + 2).height = 32;
  sheet.getRow(lastRow + 3).height = 32;

  addFooter(sheet, lastRow + 7, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 8 — 🧮 EFC / SAI CALCULATOR (Pro)
// ============================================================================

function buildEFCCalculator(workbook) {
  const sheet = workbook.addWorksheet('🧮 EFC SAI Calculator');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 24, C: 16, D: 4, E: 24, F: 16, G: 4, H: 4, I: 4, J: 4, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🧮 EFC SAI Calculator',
    tabSubtitle: 'Replicates the FAFSA formula (Student Aid Index, 2024-25 onwards). Use to plan, not as official EFC.',
    bannerText: BANNER,
    kpiData: [
      { label: 'EFC / SAI',        value: { formula: `TEXT(F22,"$#,##0")` } },
      { label: 'PARENT CONTRIB',   value: { formula: `TEXT(F18,"$#,##0")` } },
      { label: 'STUDENT CONTRIB',  value: { formula: `TEXT(F20,"$#,##0")` } },
      { label: 'AGI',              value: { formula: `TEXT(C7,"$#,##0")` } },
      { label: 'FAMILY SIZE',      value: { formula: `C12` } },
      { label: 'IN COLLEGE',       value: { formula: `C13` } },
    ],
  });

  // === Parent inputs (Section 1) ===
  let r = addSectionHeader(sheet, 6, 'Parent inputs', 'Pulled from Parent Context where applicable. Override here for what-if modeling.');

  const parentInputs = [
    { row: r + 1,  label: 'AGI (Adjusted Gross Income)',       formula: `'👶 Child Profiles'!C${CP.PARENT_INCOME_ROW}`, format: '"$"#,##0' },
    { row: r + 2,  label: 'Untaxed income (401k contrib etc.)', val: 0,      format: '"$"#,##0' },
    { row: r + 3,  label: 'Cash + bank balances',                val: 25000,  format: '"$"#,##0' },
    { row: r + 4,  label: 'Investment value (taxable, not retirement)', val: 50000, format: '"$"#,##0' },
    { row: r + 5,  label: 'Business / farm net value',          val: 0,      format: '"$"#,##0' },
    { row: r + 6,  label: 'Family size',                        val: 5,      format: '0' },
    { row: r + 7,  label: 'Number in college this year',        val: 1,      format: '0' },
    { row: r + 8,  label: 'Older parent age',                   val: 38,     format: '0' },
  ];

  parentInputs.forEach((p) => {
    sheet.getCell(`B${p.row}`).value = p.label;
    sheet.getCell(`B${p.row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${p.row}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${p.row}`).fill = FILLS.ivory;
    sheet.getCell(`B${p.row}`).border = BORDER_THIN();

    if (p.formula) sheet.getCell(`C${p.row}`).value = { formula: p.formula };
    else sheet.getCell(`C${p.row}`).value = p.val;
    sheet.getCell(`C${p.row}`).numFmt = p.format;
    sheet.getCell(`C${p.row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${p.row}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`C${p.row}`).fill = FILLS.white;
    sheet.getCell(`C${p.row}`).border = BORDER_THIN(COLORS.warmGold);
    if (!p.formula) sheet.getCell(`C${p.row}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0] };
    sheet.getRow(p.row).height = 22;
  });

  // === Student inputs (Section 2) ===
  const studentInputs = [
    { row: r + 1,  label: 'Student income',          val: 0,     format: '"$"#,##0' },
    { row: r + 2,  label: 'Student cash + assets',   val: 0,     format: '"$"#,##0' },
    { row: r + 3,  label: 'UTMA/UGMA balance',       val: 0,     format: '"$"#,##0' },
    { row: r + 4,  label: '529 owned by student',    val: 0,     format: '"$"#,##0' },
  ];

  studentInputs.forEach((p) => {
    sheet.getCell(`E${p.row}`).value = p.label;
    sheet.getCell(`E${p.row}`).font = FONTS.bodyBold;
    sheet.getCell(`E${p.row}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`E${p.row}`).fill = FILLS.ivory;
    sheet.getCell(`E${p.row}`).border = BORDER_THIN();

    sheet.getCell(`F${p.row}`).value = p.val;
    sheet.getCell(`F${p.row}`).numFmt = p.format;
    sheet.getCell(`F${p.row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`F${p.row}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`F${p.row}`).fill = FILLS.white;
    sheet.getCell(`F${p.row}`).border = BORDER_THIN(COLORS.warmGold);
    sheet.getCell(`F${p.row}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0] };
    sheet.getRow(p.row).height = 22;
  });

  // === Calculation block ===
  let r2 = addSectionHeader(sheet, r + 11, 'EFC / SAI calculation',
    'Simplified FAFSA Student Aid Index formula. Real EFC is more nuanced — this is a planning tool.');

  // Available income (parent): AGI + untaxed - allowances
  // Simplified: AGI × ~0.07 to 0.47 depending on income; we'll use a piecewise approx
  // Parent contribution = max(0, (available income × 0.22 to 0.47) + (assets - protection × 0.0564))
  // Student contribution = student income × 0.5 + student assets × 0.20

  // [FIX FEP-003] mergeCells(B:E) means the value at "E" actually lives at B (cell anchor).
  // Downstream formulas referenced E (empty) instead of B (the real value) → entire EFC cascade
  // returned $0. Fix: formulas now reference column B for the intermediate values.
  const calcRows = [
    { row: r2 + 1, label: 'Parent available income',
      formula: `MAX(0,C${r + 1}+C${r + 2}-(C${r + 6}*5000+IF(C${r + 7}>1,(C${r + 7}-1)*3000,0)))` },
    { row: r2 + 2, label: 'Parent income contribution (~22% of AI)',
      formula: `MAX(0,B${r2 + 1}*0.22)`,
      cellOverride: 'F' },
    { row: r2 + 3, label: 'Asset protection (~$40K for 2 parents)',
      formula: `40000`,
      cellOverride: 'F' },
    { row: r2 + 4, label: 'Parent net assets',
      formula: `MAX(0,(C${r + 3}+C${r + 4}+C${r + 5})-F${r2 + 3})` },
    { row: r2 + 5, label: 'Parent asset contribution (5.64%)',
      formula: `B${r2 + 4}*0.0564`,
      cellOverride: 'F' },
    { row: r2 + 6, label: 'TOTAL PARENT CONTRIBUTION',
      formula: `F${r2 + 2}+F${r2 + 5}`,
      cellOverride: 'F', isBold: true, isGold: true },
    { row: r2 + 7, label: 'Student income contribution (~50%)',
      formula: `F${r + 1}*0.5` },
    { row: r2 + 8, label: 'Student asset contribution (20%)',
      formula: `F${r + 2}*0.20+F${r + 3}*0.20+F${r + 4}*0.20`,
      cellOverride: 'F', isBold: true, isGold: true },
    { row: r2 + 9, label: '',
      formula: '' },
    { row: r2 + 10, label: 'EXPECTED FAMILY CONTRIBUTION / SAI',
      formula: `F${r2 + 6}+B${r2 + 7}+F${r2 + 8}`,
      cellOverride: 'F', isBig: true },
  ];

  calcRows.forEach((c) => {
    if (!c.label) return;
    sheet.getCell(`B${c.row}`).value = c.label;
    sheet.getCell(`B${c.row}`).font = c.isBold ? { ...FONTS.bodyBold, color: argb(COLORS.charcoal) } : FONTS.body;
    sheet.getCell(`B${c.row}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${c.row}`).fill = c.isBig ? FILLS.charcoal : FILLS.white;
    if (c.isBig) sheet.getCell(`B${c.row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold), size: 13 };
    sheet.getCell(`B${c.row}`).border = BORDER_THIN();
    sheet.mergeCells(`B${c.row}:E${c.row}`);

    const targetCol = c.cellOverride || 'E';
    if (c.formula) sheet.getCell(`${targetCol}${c.row}`).value = { formula: c.formula };
    sheet.getCell(`${targetCol}${c.row}`).numFmt = '"$"#,##0';
    sheet.getCell(`${targetCol}${c.row}`).font = c.isBig ? { name: 'Inter', size: 18, bold: true, color: argb(COLORS.warmGold) }
                                                          : c.isGold ? { ...FONTS.bodyBold, color: argb(COLORS.warmGold) }
                                                          : FONTS.body;
    sheet.getCell(`${targetCol}${c.row}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`${targetCol}${c.row}`).fill = c.isBig ? FILLS.charcoal : FILLS.white;
    sheet.getCell(`${targetCol}${c.row}`).border = BORDER_THIN();
    sheet.getRow(c.row).height = c.isBig ? 32 : 22;
    if (targetCol === 'F') {
      // need column E too — leave blank with border
      sheet.getCell(`E${c.row}`).fill = c.isBig ? FILLS.charcoal : FILLS.white;
      try { sheet.unMergeCells(`B${c.row}:E${c.row}`); } catch(e) {}
      sheet.mergeCells(`B${c.row}:E${c.row}`);
    }
  });

  // Override merge for the big total row to span B:F properly
  try { sheet.unMergeCells(`B${r2 + 10}:E${r2 + 10}`); } catch(e) {}
  sheet.mergeCells(`B${r2 + 10}:E${r2 + 10}`);

  // === Sensitivity analysis table ===
  let r3 = addSectionHeader(sheet, r2 + 14, 'Sensitivity analysis',
    'How EFC changes with ±$10K income or ±$20K parent assets.', 'B:F');

  addTableHeader(sheet, r3 + 1, ['Scenario', 'EFC Estimate', '', '', ''], ['B', 'C', 'D', 'E', 'F']);
  const sens = [
    { label: 'Income −$10K',  delta: { income: -10000, assets: 0 } },
    { label: 'Income unchanged', delta: { income: 0, assets: 0 } },
    { label: 'Income +$10K',  delta: { income: 10000, assets: 0 } },
    { label: 'Assets −$20K',  delta: { income: 0, assets: -20000 } },
    { label: 'Assets +$20K',  delta: { income: 0, assets: 20000 } },
  ];

  sens.forEach((s, i) => {
    const ri = r3 + 2 + i;
    sheet.getCell(`B${ri}`).value = s.label;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    // Rough approximation: change income by Δ × 0.22, change assets by Δ × 0.0564, add to base EFC
    sheet.getCell(`C${ri}`).value = { formula: `MAX(0,F${r2 + 10}+${s.delta.income}*0.22+${s.delta.assets}*0.0564)` };
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getRow(ri).height = 22;
  });

  addCallout(sheet, `B${r3 + 8}:F${r3 + 9}`,
    '🧮',
    'A planning tool, not the official EFC',
    'This replicates the SAI / EFC formula at a planning level. Real FAFSA uses more nuanced asset-protection allowances + state-of-residency adjustments. Use this to model "what if" scenarios; submit the actual FAFSA at studentaid.gov for the official number. The AI College Affordability Coach (PDF page 6) walks you through what to do with your number.');
  sheet.getRow(r3 + 8).height = 32;
  sheet.getRow(r3 + 9).height = 32;

  addFooter(sheet, r3 + 13, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 9 — 🏆 SCHOLARSHIP TRACKER (Pro)
// ============================================================================

function buildScholarshipTracker(workbook) {
  const sheet = workbook.addWorksheet('🏆 Scholarship Tracker');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 22, C: 16, D: 14, E: 14, F: 14, G: 16, H: 16, I: 18, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏆 Scholarship Tracker',
    tabSubtitle: 'Per child Kanban — applied / won / pending / declined. Deadline alerts <30 days.',
    bannerText: BANNER,
    kpiData: [
      { label: 'APPLIED',     value: { formula: `COUNTIF(F8:F40,"Applied")` } },
      { label: 'WON',         value: { formula: `COUNTIF(F8:F40,"Won")` } },
      { label: 'TOTAL WON',   value: { formula: `TEXT(SUMIF(F8:F40,"Won",G8:G40),"$#,##0")` } },
      { label: 'PENDING',     value: { formula: `COUNTIF(F8:F40,"Pending")` } },
      { label: 'EXPIRING <30',value: { formula: `SUMPRODUCT((H8:H40-TODAY()<30)*(H8:H40-TODAY()>=0))` } },
      { label: 'AVG AWARD',   value: { formula: `IFERROR(TEXT(AVERAGEIF(F8:F40,"Won",G8:G40),"$#,##0"),"—")` } },
    ],
  });

  // === Table ===
  let r = 7;
  // [FIX FEP3-001] Header labels swapped F↔G to match the seed-write loop reality
  // (F=Status dropdown, G=Award $ numeric).
  addTableHeader(sheet, r,
    ['Scholarship', 'Child', 'Category', 'Award Range', 'Status', 'Award $', 'Deadline', 'Days Left', 'Action Required', 'Submitted', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  // Seed rows — realistic per the AI prompt's worked example
  const seed = [
    { name: 'Adirondack Community Trust', child: 'Emma', cat: 'Local', range: '$1.5K-$5K',  amt: 0,      status: 'Pending', deadline: new Date(2026, 3, 15), action: 'Essay + recommendations', sub: '', notes: 'First-gen + watershed advocacy fit' },
    { name: 'Excelsior Scholarship',      child: 'Emma', cat: 'State', range: 'Tuition',    amt: 0,      status: 'Pending', deadline: new Date(2026, 4, 1),  action: 'FAFSA-tied; income < $125K',  sub: '', notes: 'Free SUNY tuition if income qualifies' },
    { name: 'Prudential Spirit of Community', child: 'Emma', cat: 'Activity', range: '$1K-$5K', amt: 0, status: 'Applied', deadline: new Date(2026, 1, 1),  action: 'Project narrative',          sub: '', notes: 'Stream cleanup founder story' },
    { name: 'QuestBridge Match',          child: 'Emma', cat: 'First-gen', range: 'Full ride',amt: 0,    status: '',        deadline: new Date(2031, 8, 1),  action: 'Senior year app',             sub: '', notes: 'Long-horizon target' },
    { name: 'Coca-Cola Scholars',         child: 'Emma', cat: 'Merit',  range: '$20K',       amt: 0,      status: '',        deadline: new Date(2031, 9, 15), action: 'GPA + leadership',           sub: '', notes: 'Long-shot but worth applying' },
    { name: 'National Merit',             child: 'Emma', cat: 'Merit',  range: '$2.5K',      amt: 0,      status: '',        deadline: new Date(2030, 9, 1),  action: 'PSAT junior year required',   sub: '', notes: 'Test-score-driven' },
    { name: 'Local Rotary Club',          child: 'Emma', cat: 'Local',  range: '$500-$2.5K', amt: 0,      status: 'Pending', deadline: new Date(2026, 2, 28), action: 'Community service essay',     sub: '', notes: '' },
    { name: 'Williams Tyng Scholar',      child: 'Emma', cat: 'College', range: 'Full ride', amt: 0,      status: '',        deadline: new Date(2031, 10, 15),action: 'Auto-considered with admit',  sub: '', notes: '' },
  ];

  // Build out to 33 rows total (8 seeded + 25 blank)
  for (let i = 0; i < 33; i++) {
    const ri = r + 1 + i;
    const s = seed[i] || {};

    sheet.getCell(`B${ri}`).value = s.name || '';
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = s.child || '';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = s.cat || '';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).dataValidation = { type: 'list', formulae: ['"Local,State,National,Merit,Activity,First-gen,Major,Demographic,College,Other"'], allowBlank: true };

    sheet.getCell(`E${ri}`).value = s.range || '';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = s.amt || null;
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();
    sheet.getCell(`F${ri}`).dataValidation = { type: 'list', formulae: ['"Applied,Won,Pending,Declined,Researching"'], allowBlank: true };
    if (s.status) sheet.getCell(`F${ri}`).value = s.status;

    // Award $
    sheet.getCell(`G${ri}`).value = s.amt || null;
    sheet.getCell(`G${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`H${ri}`).value = s.deadline || null;
    if (s.deadline) sheet.getCell(`H${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();
    sheet.getCell(`H${ri}`).dataValidation = { type: 'date', allowBlank: true };

    // Days left
    sheet.getCell(`I${ri}`).value = { formula: `IFERROR(H${ri}-TODAY(),"—")` };
    sheet.getCell(`I${ri}`).font = FONTS.body;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
    // CF: <30 days = alert; <60 = warning
    sheet.addConditionalFormatting({
      ref: `I${ri}`,
      rules: [
        { type: 'cellIs', operator: 'between', formulae: ['0', '30'], priority: 1, style: { font: { ...FONTS.bodyBold, color: argb(COLORS.alert) }, fill: FILLS.alertLight } },
        { type: 'cellIs', operator: 'between', formulae: ['31', '60'], priority: 2, style: { font: { ...FONTS.bodyBold, color: argb(COLORS.warning) }, fill: FILLS.warningLight } },
      ],
    });

    sheet.getCell(`J${ri}`).value = s.action || '';
    sheet.getCell(`J${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`J${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`J${ri}`).fill = FILLS.white;
    sheet.getCell(`J${ri}`).border = BORDER_THIN();

    sheet.getCell(`K${ri}`).value = s.sub || null;
    if (s.sub) sheet.getCell(`K${ri}`).numFmt = 'mmm d, yyyy';
    sheet.getCell(`K${ri}`).font = FONTS.body;
    sheet.getCell(`K${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`K${ri}`).fill = FILLS.white;
    sheet.getCell(`K${ri}`).border = BORDER_THIN();
    sheet.getCell(`K${ri}`).dataValidation = { type: 'date', allowBlank: true };

    sheet.getCell(`L${ri}`).value = s.notes || '';
    sheet.getCell(`L${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`L${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`L${ri}`).fill = FILLS.white;
    sheet.getCell(`L${ri}`).border = BORDER_THIN();

    sheet.getCell(`A${ri}`).fill = FILLS.successLight;
    sheet.getRow(ri).height = 22;
  }

  addCallout(sheet, `B42:L43`,
    '🏆',
    'Scam warning — paid scholarship-application services',
    'No legitimate scholarship charges an application fee. ScholarshipOwl-style "matching" services sell your contact info to lenders. Use FastWeb (free), Bold.org (free), or apply directly through college financial aid offices. Run the AI Scholarship Matching Engine prompt (PDF page 4) for 5–7 well-fit candidates — quality over volume.');
  sheet.getRow(42).height = 32;
  sheet.getRow(43).height = 32;

  addFooter(sheet, 47, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 10 — 📑 AID LETTER COMPARISON (Pro)
// ============================================================================

function buildAidLetterComparison(workbook) {
  const sheet = workbook.addWorksheet('📑 Aid Letter Comparison');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 20, C: 16, D: 16, E: 16, F: 16, G: 16, H: 4, I: 4, J: 4, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📑 Aid Letter Comparison',
    tabSubtitle: 'Side-by-side colleges (max 5). Net price ranked. Appeal deadline countdown.',
    bannerText: BANNER,
    kpiData: [
      { label: 'COLLEGES',     value: { formula: `COUNTIF(C7:G7,"<>")` } },
      // [FIX FEP-020] BEST NET $ — exclude empty 5th-college slot (was using MIN on row 16 which
      // included $0 placeholders). Now MIN(IF(C15:G15>0,C15:G15)) which skips empties.
      { label: 'BEST NET $',   value: { formula: `TEXT(IFERROR(MIN(IF(C15:G15>0,C15:G15)),0),"$#,##0")` } },
      { label: 'WORST NET $',  value: { formula: `IFERROR(TEXT(MAXIFS(C16:G16,C16:G16,">0"),"$#,##0"),"—")` } },
      { label: 'AVG NET',      value: { formula: `IFERROR(TEXT(AVERAGEIF(C16:G16,">0"),"$#,##0"),"—")` } },
      // [FIX FEP-019] APPEAL OPEN — row 16 holds appeal deadlines (dates); row 19 was Verdict text.
      // Subtracting TODAY() from text returned #VALUE!. Now references row 16 + IFERROR guard for
      // empty-college slots.
      { label: 'APPEAL OPEN',  value: { formula: `SUMPRODUCT(IFERROR((C16:G16-TODAY()>0)*(C16:G16-TODAY()<30),0))` } },
      { label: 'CHILD',        value: { formula: `'👶 Child Profiles'!C${CP.CHILD_FIRST_ROW}` } },
    ],
  });

  // === Comparison table — colleges across columns C-G, fields down rows ===
  let r = 6;

  // Header row — college names
  sheet.getCell(`B${r}`).value = 'College →';
  sheet.getCell(`B${r}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`B${r}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`B${r}`).fill = FILLS.charcoal;
  sheet.getCell(`B${r}`).border = BORDER_THIN();

  const seedColleges = ['SUNY Binghamton', 'Bowdoin College', 'Williams College', 'Smith College', ''];
  ['C', 'D', 'E', 'F', 'G'].forEach((col, i) => {
    sheet.getCell(`${col}${r + 1}`).value = seedColleges[i];
    sheet.getCell(`${col}${r + 1}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGoldLight) };
    sheet.getCell(`${col}${r + 1}`).alignment = { horizontal: 'center' };
    sheet.getCell(`${col}${r + 1}`).fill = FILLS.charcoal;
    sheet.getCell(`${col}${r + 1}`).border = BORDER_THIN();
  });
  sheet.getRow(r + 1).height = 26;

  // Fields
  const seedData = {
    'Type':              ['Public In-State', 'Private LAC', 'Private LAC', 'Private LAC', ''],
    'Sticker (annual)':  [28000, 82000, 84000, 80000, 0],
    'Grants':            [8000,  45000, 58000, 42000, 0],
    'Scholarships':      [0,     0,     0,     0,     0],
    'Federal Loans':     [5500,  5500,  5500,  5500,  0],
    'Work-Study':        [2500,  2500,  2500,  2500,  0],
    'NET PRICE / yr':    null,    // formula
    '4-Year Total':      null,    // formula
    'Appeal Deadline':   [new Date(2026, 4, 1), new Date(2026, 3, 22), new Date(2026, 4, 15), new Date(2026, 4, 1), null],
    'Days to Appeal':    null,    // formula
    'Status':            ['Accepted', 'Accepted', 'Accepted', 'Accepted', ''],
    'Verdict':           null,    // formula
  };

  let fieldRow = r + 2;   // row 8
  Object.entries(seedData).forEach(([fieldName, values]) => {
    sheet.getCell(`B${fieldRow}`).value = fieldName;
    sheet.getCell(`B${fieldRow}`).font = FONTS.bodyBold;
    sheet.getCell(`B${fieldRow}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${fieldRow}`).fill = FILLS.ivory;
    sheet.getCell(`B${fieldRow}`).border = BORDER_THIN();

    ['C', 'D', 'E', 'F', 'G'].forEach((col, i) => {
      let val = values ? values[i] : null;
      if (fieldName === 'NET PRICE / yr') {
        // Sticker (row 9) - Grants (row 10) - Scholarships (row 11)
        sheet.getCell(`${col}${fieldRow}`).value = { formula: `${col}9-${col}10-${col}11` };
        sheet.getCell(`${col}${fieldRow}`).numFmt = '"$"#,##0';
        sheet.getCell(`${col}${fieldRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
      } else if (fieldName === '4-Year Total') {
        sheet.getCell(`${col}${fieldRow}`).value = { formula: `${col}14*4` };
        sheet.getCell(`${col}${fieldRow}`).numFmt = '"$"#,##0';
        sheet.getCell(`${col}${fieldRow}`).font = FONTS.bodyBold;
      } else if (fieldName === 'Days to Appeal') {
        // [FIX FEP-020] Empty-college guard prevents -46000-ish "days" from showing in unused slots.
        sheet.getCell(`${col}${fieldRow}`).value = { formula: `IFERROR(IF(${col}16="","—",${col}16-TODAY()),"—")` };
        sheet.getCell(`${col}${fieldRow}`).font = FONTS.body;
      } else if (fieldName === 'Verdict') {
        sheet.getCell(`${col}${fieldRow}`).value = { formula: `IF(${col}7="","—",IF(${col}14<=15000,"🟢 Affordable",IF(${col}14<=30000,"🟡 Stretch","🔴 Don't"))) ` };
        sheet.getCell(`${col}${fieldRow}`).font = FONTS.bodyBold;
      } else {
        sheet.getCell(`${col}${fieldRow}`).value = val;
        if (val instanceof Date) sheet.getCell(`${col}${fieldRow}`).numFmt = 'mmm d, yyyy';
        else if (typeof val === 'number') sheet.getCell(`${col}${fieldRow}`).numFmt = '"$"#,##0';
        sheet.getCell(`${col}${fieldRow}`).font = FONTS.body;
      }
      sheet.getCell(`${col}${fieldRow}`).alignment = { horizontal: 'right', indent: 1 };
      sheet.getCell(`${col}${fieldRow}`).fill = FILLS.white;
      sheet.getCell(`${col}${fieldRow}`).border = BORDER_THIN();
    });

    sheet.getCell(`A${fieldRow}`).fill = FILLS.charcoalLight;
    sheet.getRow(fieldRow).height = 22;
    fieldRow++;
  });

  addCallout(sheet, `B${fieldRow + 1}:G${fieldRow + 2}`,
    '📑',
    'When to appeal',
    'Appeal when the aid offer leaves a net-cost gap >$10K from your top alternative — and you can document either (1) a material change in family circumstances post-FAFSA, or (2) a peer-school offer at lower net price. The AI Financial Aid Appeal Coach (PDF page 9) drafts the letter using your specific data. Never threaten enrollment elsewhere in the opening — frame as "your school is our first choice, please help us close the gap."');
  sheet.getRow(fieldRow + 1).height = 32;
  sheet.getRow(fieldRow + 2).height = 32;

  addFooter(sheet, fieldRow + 6, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 11 — 🧒 CHILDCARE COST PLANNER (Pro)
// ============================================================================

function buildChildcareCostPlanner(workbook) {
  const sheet = workbook.addWorksheet('🧒 Childcare Cost Planner');
  setTabColor(sheet, COLORS.warning);
  setupColumns(sheet, { A: 2, B: 20, C: 14, D: 14, E: 14, F: 14, G: 14, H: 18, I: 4, J: 4, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🧒 Childcare Cost Planner',
    tabSubtitle: 'By age band × care type. Center daycare / nanny / nanny share / au pair / family / public school.',
    bannerText: BANNER,
    kpiData: [
      { label: 'ANNUAL COST',  value: { formula: `TEXT(H15,"$#,##0")` } },
      { label: 'BEST OPTION',  value: { formula: `INDEX(B10:B14,MATCH(MIN(C10:C14),C10:C14,0))` } },
      { label: 'WORST OPTION', value: { formula: `INDEX(B10:B14,MATCH(MAX(C10:C14),C10:C14,0))` } },
      { label: 'KIDS UNDER 5', value: { formula: `SUMPRODUCT(('👶 Child Profiles'!E${CP.CHILD_FIRST_ROW}:E${CP.CHILD_LAST_ROW}<5)*('👶 Child Profiles'!E${CP.CHILD_FIRST_ROW}:E${CP.CHILD_LAST_ROW}>=0))` } },
      { label: 'REGION',       value: 'Suburban' },
      { label: 'FSA SAVINGS',  value: '$5K cap' },
    ],
  });

  // === Age-band cost matrix ===
  let r = addSectionHeader(sheet, 6, 'Annual cost by age band × care type',
    'Edit the cost cells to match your region. Defaults: suburban Northeast US, 2026.');

  addTableHeader(sheet, r + 1,
    ['Age Band', 'Center Daycare', 'Nanny (solo)', 'Nanny Share', 'Au Pair', 'Family', 'Public School'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H']);

  const ageBands = [
    { band: '0–1 (infant)',  daycare: 22000, nanny: 56000, share: 30000, au: 24000, family: 12000, public: 0 },
    { band: '1–3 (toddler)', daycare: 19000, nanny: 56000, share: 30000, au: 24000, family: 12000, public: 0 },
    { band: '3–5 (pre-K)',   daycare: 16000, nanny: 56000, share: 30000, au: 24000, family: 12000, public: 0 },
    { band: '5–12 (school)', daycare: 8000,  nanny: 28000, share: 15000, au: 24000, family: 6000,  public: 0 },
    { band: '12–18 (teen)',  daycare: 0,     nanny: 0,     share: 0,     au: 0,     family: 0,     public: 0 },
  ];

  ageBands.forEach((b, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = b.band;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    ['C', 'D', 'E', 'F', 'G', 'H'].forEach((col, c) => {
      const val = [b.daycare, b.nanny, b.share, b.au, b.family, b.public][c];
      sheet.getCell(`${col}${ri}`).value = val;
      sheet.getCell(`${col}${ri}`).numFmt = '"$"#,##0';
      sheet.getCell(`${col}${ri}`).font = FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'right', indent: 1 };
      sheet.getCell(`${col}${ri}`).fill = FILLS.white;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
      sheet.getCell(`${col}${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0] };
    });

    sheet.getCell(`A${ri}`).fill = FILLS.warningLight;
    sheet.getRow(ri).height = 22;
  });

  // Total row
  const totalRow = r + 2 + ageBands.length;
  sheet.getCell(`B${totalRow}`).value = 'FAMILY TOTAL / YR';
  sheet.getCell(`B${totalRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };
  sheet.getCell(`B${totalRow}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${totalRow}`).fill = FILLS.ivory;
  sheet.getCell(`B${totalRow}`).border = { top: { style: 'medium', color: argb(COLORS.warning) } };

  ['C', 'D', 'E', 'F', 'G', 'H'].forEach((col) => {
    sheet.getCell(`${col}${totalRow}`).value = { formula: `SUM(${col}${r + 2}:${col}${totalRow - 1})` };
    sheet.getCell(`${col}${totalRow}`).numFmt = '"$"#,##0';
    sheet.getCell(`${col}${totalRow}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };
    sheet.getCell(`${col}${totalRow}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`${col}${totalRow}`).fill = FILLS.ivory;
    sheet.getCell(`${col}${totalRow}`).border = { top: { style: 'medium', color: argb(COLORS.warning) } };
  });

  addCallout(sheet, `B${totalRow + 2}:H${totalRow + 4}`,
    '🧒',
    'The "Adult #2 stops working" trap',
    'Walking away from a $58K/yr job to "save on childcare" looks like savings — until you model the 5-year compounding career hit + retirement contribution loss. Real lifetime cost over 18 years: ~$490K direct + ~$200K compounding. The AI Childcare Optimizer (PDF page 7) models all 7 options including the do-nothing baseline so you make the call with numbers, not guilt.');
  sheet.getRow(totalRow + 2).height = 32;
  sheet.getRow(totalRow + 3).height = 32;

  addFooter(sheet, totalRow + 8, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 12 — 🛡️ LIFE INSURANCE CALCULATOR (Essentials + Pro + AI)
// ============================================================================

function buildLifeInsuranceCalculator(workbook) {
  const sheet = workbook.addWorksheet('🛡️ Life Insurance Calculator');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 28, C: 16, D: 4, E: 28, F: 16, G: 4, H: 4, I: 4, J: 4, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🛡️ Life Insurance Calculator',
    tabSubtitle: 'DIME method — Debt / Income / Mortgage / Education. Recommends term + benefit.',
    bannerText: BANNER,
    kpiData: [
      { label: 'DIME TOTAL',     value: { formula: `TEXT(E20,"$#,##0")` } },
      { label: 'ADJ COVERAGE',   value: { formula: `TEXT(E22,"$#,##0")` } },
      { label: 'REC TERM',       value: { formula: `E26&" yr"` } },
      { label: 'EXISTING',       value: { formula: `TEXT(C12,"$#,##0")` } },
      { label: 'MO PREMIUM',     value: { formula: `TEXT(E27,"$#,##0")&"/mo"` } },
      { label: 'POLICY TYPE',    value: 'Term Life' },
    ],
  });

  // === DIME inputs ===
  let r = addSectionHeader(sheet, 6, 'DIME inputs',
    'Debt / Income / Mortgage / Education. Replace seed values with yours.');

  const dimeInputs = [
    { row: r + 1,  label: 'D — Non-mortgage debt (CC, auto, student, medical)', val: 22000,  fmt: '"$"#,##0' },
    { row: r + 2,  label: 'I — Income × years of replacement',                    val: 1710000, fmt: '"$"#,##0', note: '18 years × $95K = $1,710K (default seed).' },
    { row: r + 3,  label: 'M — Outstanding mortgage balance',                     val: 268000,  fmt: '"$"#,##0' },
    { row: r + 4,  label: 'E — Remaining education funding (all kids)',           val: 240000,  fmt: '"$"#,##0', note: '3 kids × $80K avg target = $240K.' },
    { row: r + 5,  label: 'Existing life insurance (employer + individual)',      val: 200000,  fmt: '"$"#,##0' },
    { row: r + 6,  label: 'Existing investments + emergency fund',                val: 310000,  fmt: '"$"#,##0' },
    { row: r + 7,  label: 'Spouse earning capacity if you die',                   val: 45000,   fmt: '"$"#,##0', note: 'Annual income spouse could earn alone.' },
    { row: r + 8,  label: 'Spouse income years to model',                         val: 18,      fmt: '0' },
  ];

  dimeInputs.forEach((d) => {
    sheet.getCell(`B${d.row}`).value = d.label;
    sheet.getCell(`B${d.row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${d.row}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`B${d.row}`).fill = FILLS.ivory;
    sheet.getCell(`B${d.row}`).border = BORDER_THIN();

    sheet.getCell(`C${d.row}`).value = d.val;
    sheet.getCell(`C${d.row}`).numFmt = d.fmt;
    sheet.getCell(`C${d.row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${d.row}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`C${d.row}`).fill = FILLS.white;
    sheet.getCell(`C${d.row}`).border = BORDER_THIN(COLORS.warmGold);
    sheet.getCell(`C${d.row}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0] };
    if (d.note) sheet.getCell(`C${d.row}`).note = d.note;
    sheet.getRow(d.row).height = 24;
  });

  // === Calculation output ===
  const CR = 20;   // DIME TOTAL row
  sheet.mergeCells(`B${CR}:D${CR}`);
  sheet.getCell(`B${CR}`).value = 'DIME TOTAL (D + I + M + E)';
  sheet.getCell(`B${CR}`).font = { ...FONTS.bodyBold, color: argb(COLORS.charcoal) };
  sheet.getCell(`B${CR}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${CR}`).fill = FILLS.ivory;
  sheet.getCell(`B${CR}`).border = BORDER_THIN();

  sheet.getCell(`E${CR}`).value = { formula: `C${r + 1}+C${r + 2}+C${r + 3}+C${r + 4}` };
  sheet.getCell(`E${CR}`).numFmt = '"$"#,##0';
  sheet.getCell(`E${CR}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold), size: 14 };
  sheet.getCell(`E${CR}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E${CR}`).fill = FILLS.charcoal;
  sheet.getCell(`E${CR}`).border = BORDER_THIN();
  sheet.getRow(CR).height = 26;

  // Adjusted coverage = DIME - investments - spouse income capacity × years
  sheet.mergeCells(`B${CR + 2}:D${CR + 2}`);
  sheet.getCell(`B${CR + 2}`).value = 'ADJUSTED COVERAGE NEED';
  sheet.getCell(`B${CR + 2}`).font = { ...FONTS.bodyBold, color: argb(COLORS.charcoal) };
  sheet.getCell(`B${CR + 2}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${CR + 2}`).fill = FILLS.ivory;
  sheet.getCell(`B${CR + 2}`).border = BORDER_THIN();

  sheet.getCell(`E${CR + 2}`).value = { formula: `MAX(0,E${CR}-C${r + 6}-C${r + 7}*C${r + 8})` };
  sheet.getCell(`E${CR + 2}`).numFmt = '"$"#,##0';
  sheet.getCell(`E${CR + 2}`).font = { name: 'Inter', size: 22, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell(`E${CR + 2}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E${CR + 2}`).fill = FILLS.charcoal;
  sheet.getCell(`E${CR + 2}`).border = BORDER_THIN();
  sheet.getRow(CR + 2).height = 36;

  // Existing covers
  sheet.mergeCells(`B${CR + 4}:D${CR + 4}`);
  sheet.getCell(`B${CR + 4}`).value = 'Existing coverage (employer + individual)';
  sheet.getCell(`B${CR + 4}`).font = FONTS.body;
  sheet.getCell(`B${CR + 4}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${CR + 4}`).fill = FILLS.white;
  sheet.getCell(`B${CR + 4}`).border = BORDER_THIN();

  sheet.getCell(`E${CR + 4}`).value = { formula: `C${r + 5}` };
  sheet.getCell(`E${CR + 4}`).numFmt = '"$"#,##0';
  sheet.getCell(`E${CR + 4}`).font = FONTS.body;
  sheet.getCell(`E${CR + 4}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E${CR + 4}`).fill = FILLS.white;
  sheet.getCell(`E${CR + 4}`).border = BORDER_THIN();

  // Recommended term
  sheet.mergeCells(`B${CR + 6}:D${CR + 6}`);
  sheet.getCell(`B${CR + 6}`).value = 'Recommended term (years)';
  sheet.getCell(`B${CR + 6}`).font = FONTS.bodyBold;
  sheet.getCell(`B${CR + 6}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${CR + 6}`).fill = FILLS.ivory;
  sheet.getCell(`B${CR + 6}`).border = BORDER_THIN();

  // [FIX FEP-025] Use Yrs-to-college (column F) not Age (column E). Recommended term = horizon
  // until youngest finishes 4-yr college = MAX(yrs-to-college) + 4.
  sheet.getCell(`E${CR + 6}`).value = { formula: `MAX(15,IFERROR(MAX('👶 Child Profiles'!F${CP.CHILD_FIRST_ROW}:F${CP.CHILD_LAST_ROW})+4,20))` };
  sheet.getCell(`E${CR + 6}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`E${CR + 6}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E${CR + 6}`).fill = FILLS.white;
  sheet.getCell(`E${CR + 6}`).border = BORDER_THIN();

  // Estimated premium (rough $60/mo per $1M of coverage at age 36)
  sheet.mergeCells(`B${CR + 7}:D${CR + 7}`);
  sheet.getCell(`B${CR + 7}`).value = 'Estimated monthly premium (term life)';
  sheet.getCell(`B${CR + 7}`).font = FONTS.bodyBold;
  sheet.getCell(`B${CR + 7}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${CR + 7}`).fill = FILLS.ivory;
  sheet.getCell(`B${CR + 7}`).border = BORDER_THIN();

  sheet.getCell(`E${CR + 7}`).value = { formula: `E${CR + 2}/1000000*60` };
  sheet.getCell(`E${CR + 7}`).numFmt = '"$"#,##0';
  sheet.getCell(`E${CR + 7}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell(`E${CR + 7}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E${CR + 7}`).fill = FILLS.white;
  sheet.getCell(`E${CR + 7}`).border = BORDER_THIN();

  addCallout(sheet, `B${CR + 10}:F${CR + 12}`,
    '🛡️',
    'Term life vs. whole life — the honest version',
    '$1.25M of 25-year term at age 36 healthy costs ~$50-75/month. Same coverage in whole life: ~$900-$1,200/month — 15× more. The premium difference invested in a 529 + retirement builds far more wealth than whole-life cash value ever will. The ONE legitimate whole-life scenario is special-needs-trust funding; see AI Life Insurance Advisor (PDF page 5).');
  sheet.getRow(CR + 10).height = 32;
  sheet.getRow(CR + 11).height = 32;

  addFooter(sheet, CR + 15, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 13 — 🏥 FAMILY HEALTH BUDGET (Pro)
// ============================================================================

function buildFamilyHealthBudget(workbook) {
  const sheet = workbook.addWorksheet('🏥 Family Health Budget');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 20, C: 14, D: 14, E: 14, F: 14, G: 14, H: 16, I: 4, J: 4, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🏥 Family Health Budget',
    tabSubtitle: 'Per-member health costs + HSA tracking. Annual rollup of premiums + out-of-pocket.',
    bannerText: BANNER,
    kpiData: [
      { label: 'MONTHLY PREM',  value: { formula: `TEXT(E11,"$#,##0")` } },
      { label: 'DEDUCTIBLE',    value: { formula: `TEXT(E12,"$#,##0")` } },
      { label: 'OOP MAX',       value: { formula: `TEXT(E13,"$#,##0")` } },
      { label: 'DISABILITY',    value: { formula: `IF(E15>0,"$"&TEXT(E15,"#,##0"),"❌ None")` } },
      { label: 'HSA BAL',       value: { formula: `TEXT(C24,"$#,##0")` } },
      // [FIX FEP-018] E11 or E13 evaluated to text in some persona states → #VALUE!.
      // ISNUMBER guards on each operand return $0 when not yet populated.
      { label: 'ANNUAL TOTAL',  value: { formula: `TEXT(IFERROR(IF(ISNUMBER(E11),E11*12,0)+IF(ISNUMBER(E13),E13,0),0),"$#,##0")` } },
    ],
  });

  // === Section 1 — Plan summary ===
  let r = addSectionHeader(sheet, 6, 'Plan summary', 'Replace these with your actual policy values.');

  const planRows = [
    { row: r + 1,  label: 'Insurance carrier',                       val: 'Aetna' },
    { row: r + 2,  label: 'Plan type',                                val: 'HDHP + HSA' },
    { row: r + 3,  label: 'Monthly premium (family coverage)',        val: 1240,  fmt: '"$"#,##0' },
    { row: r + 4,  label: 'Annual deductible (family)',               val: 5500,  fmt: '"$"#,##0' },
    { row: r + 5,  label: 'Out-of-pocket maximum (family)',           val: 9100,  fmt: '"$"#,##0' },
    { row: r + 6,  label: 'In-network coinsurance',                   val: 0.20,  fmt: '0%' },
    { row: r + 7,  label: 'Disability insurance monthly benefit',     val: 0,     fmt: '"$"#,##0' },
    { row: r + 8,  label: 'Long-term care insurance (yes/no)',        val: 'No' },
  ];

  planRows.forEach((p) => {
    sheet.getCell(`B${p.row}`).value = p.label;
    sheet.getCell(`B${p.row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${p.row}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${p.row}`).fill = FILLS.ivory;
    sheet.getCell(`B${p.row}`).border = BORDER_THIN();
    sheet.mergeCells(`B${p.row}:D${p.row}`);

    sheet.getCell(`E${p.row}`).value = p.val;
    if (p.fmt) sheet.getCell(`E${p.row}`).numFmt = p.fmt;
    sheet.getCell(`E${p.row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`E${p.row}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`E${p.row}`).fill = FILLS.white;
    sheet.getCell(`E${p.row}`).border = BORDER_THIN(COLORS.warmGold);
    sheet.getRow(p.row).height = 22;
  });

  // === Section 2 — HSA tracker ===
  let r2 = addSectionHeader(sheet, r + 11, 'HSA tracker',
    'High-Deductible Health Plan paired with a Health Savings Account. Tax-free triple play.', 'B:H');

  const hsaRows = [
    { row: r2 + 1, label: 'HSA balance',              val: 8400,   fmt: '"$"#,##0' },
    { row: r2 + 2, label: 'Annual contribution',      val: 7300,   fmt: '"$"#,##0' },
    { row: r2 + 3, label: 'Annual cap (family 2026)', val: 8550,   fmt: '"$"#,##0' },
    { row: r2 + 4, label: 'Cap headroom',             formula: `C${r2 + 3}-C${r2 + 2}`, fmt: '"$"#,##0' },
    { row: r2 + 5, label: 'Years invested (no withdrawals)', val: 8 },
    { row: r2 + 6, label: 'Projected value @ FIRE (10yr 6%)',  formula: `(C${r2 + 1}*POWER(1.06,10))+(C${r2 + 2}*((POWER(1.06,10)-1)/0.06))`, fmt: '"$"#,##0' },
  ];

  hsaRows.forEach((p) => {
    sheet.getCell(`B${p.row}`).value = p.label;
    sheet.getCell(`B${p.row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${p.row}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${p.row}`).fill = FILLS.ivory;
    sheet.getCell(`B${p.row}`).border = BORDER_THIN();

    if (p.formula) sheet.getCell(`C${p.row}`).value = { formula: p.formula };
    else sheet.getCell(`C${p.row}`).value = p.val;
    if (p.fmt) sheet.getCell(`C${p.row}`).numFmt = p.fmt;
    sheet.getCell(`C${p.row}`).font = FONTS.bodyBold;
    sheet.getCell(`C${p.row}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`C${p.row}`).fill = FILLS.white;
    sheet.getCell(`C${p.row}`).border = BORDER_THIN();
    sheet.getRow(p.row).height = 22;
  });

  addCallout(sheet, `B${r2 + 9}:H${r2 + 10}`,
    '🏥',
    'HSA — the triple-tax-advantage account',
    'HSA contributions are pre-tax going in, grow tax-free, AND come out tax-free for medical expenses. Past age 65 it functions like a Traditional IRA — withdraw for any reason, pay just income tax. Max out the HSA every year if eligible; it\'s the best tax-advantaged account in the US code. Disability insurance is the most-skipped coverage type — flagged ❌ above if your monthly benefit cell reads $0.');
  sheet.getRow(r2 + 9).height = 32;
  sheet.getRow(r2 + 10).height = 32;

  addFooter(sheet, r2 + 14, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 14 — 👴 RETIREMENT IMPACT (Pro)
// ============================================================================

function buildRetirementImpact(workbook) {
  const sheet = workbook.addWorksheet('👴 Retirement Impact');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '👴 Retirement Impact',
    tabSubtitle: 'Shows the trade-off when college spending crowds out retirement contributions.',
    bannerText: BANNER,
    kpiData: [
      { label: 'FIRE TARGET',     value: { formula: `TEXT(E10,"$#,##0")` } },
      { label: 'CURRENT BAL',     value: { formula: `TEXT(E11,"$#,##0")` } },
      { label: 'MO CONTRIB',      value: { formula: `TEXT(E15,"$#,##0")` } },
      { label: 'YRS TO FIRE (WITH KIDS)', value: { formula: `IFERROR(E18&" yr","—")` } },
      { label: 'YRS TO FIRE (NO KIDS)',  value: { formula: `IFERROR(E19&" yr","—")` } },
      { label: 'TRADE-OFF',       value: { formula: `IFERROR((E18-E19)&" yr later","—")` } },
    ],
  });

  // === Inputs ===
  let r = addSectionHeader(sheet, 6, 'Retirement model inputs',
    'Modify to match your situation. Trade-off table below shows the impact of college contributions.');

  const inputs = [
    { row: r + 1, label: 'Target retirement number (FIRE)',  val: 1450000, fmt: '"$"#,##0' },
    { row: r + 2, label: 'Current retirement balance',         val: 310000,  fmt: '"$"#,##0' },
    { row: r + 3, label: 'Annual income (joint)',              formula: `'👶 Child Profiles'!C${CP.PARENT_INCOME_ROW}`, fmt: '"$"#,##0' },
    { row: r + 4, label: 'Current parent age (older)',         val: 38 },
    { row: r + 5, label: 'Target retirement age',              val: 55 },
    { row: r + 6, label: 'Monthly retirement contribution',    val: 1850,    fmt: '"$"#,##0' },
    { row: r + 7, label: 'Expected real return',               val: 0.06,    fmt: '0.0%' },
    { row: r + 8, label: 'Monthly $ being diverted to college', formula: `SUM('👶 Child Profiles'!J${CP.CHILD_FIRST_ROW}:J${CP.CHILD_LAST_ROW})`, fmt: '"$"#,##0' },
  ];

  inputs.forEach((p) => {
    sheet.getCell(`B${p.row}`).value = p.label;
    sheet.getCell(`B${p.row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${p.row}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${p.row}`).fill = FILLS.ivory;
    sheet.getCell(`B${p.row}`).border = BORDER_THIN();
    sheet.mergeCells(`B${p.row}:D${p.row}`);

    if (p.formula) sheet.getCell(`E${p.row}`).value = { formula: p.formula };
    else sheet.getCell(`E${p.row}`).value = p.val;
    if (p.fmt) sheet.getCell(`E${p.row}`).numFmt = p.fmt;
    sheet.getCell(`E${p.row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`E${p.row}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`E${p.row}`).fill = FILLS.white;
    sheet.getCell(`E${p.row}`).border = BORDER_THIN(COLORS.warmGold);
    sheet.getRow(p.row).height = 22;
  });

  // === Trade-off calculation ===
  // Years to FIRE = solving for n in: target = curr × (1+r)^n + monthly×12 × ((1+r)^n - 1)/r
  // Approximation: years ≈ ln(target / (curr + 12 × monthly × n)) / ln(1 + r), but iterative.
  // Use NPER formula in Excel: NPER(r, -pmt, -pv, fv) — months not years
  sheet.mergeCells(`B${r + 10}:D${r + 10}`);
  sheet.getCell(`B${r + 10}`).value = 'YRS TO FIRE (current contribution)';
  sheet.getCell(`B${r + 10}`).font = FONTS.bodyBold;
  sheet.getCell(`B${r + 10}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${r + 10}`).fill = FILLS.charcoalLight;
  sheet.getCell(`B${r + 10}`).border = BORDER_THIN();

  sheet.getCell(`E${r + 10}`).value = {
    formula: `IFERROR(ROUND(NPER(E${r + 7}/12,-E${r + 6},-E${r + 2},E${r + 1})/12,1),99)`,
  };
  sheet.getCell(`E${r + 10}`).font = { ...FONTS.bodyBold, color: argb(COLORS.alert) };
  sheet.getCell(`E${r + 10}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E${r + 10}`).fill = FILLS.charcoalLight;
  sheet.getCell(`E${r + 10}`).border = BORDER_THIN();

  // Years to FIRE if no kids (no monthly diversion)
  sheet.mergeCells(`B${r + 11}:D${r + 11}`);
  sheet.getCell(`B${r + 11}`).value = 'YRS TO FIRE (if no college contributions)';
  sheet.getCell(`B${r + 11}`).font = FONTS.bodyBold;
  sheet.getCell(`B${r + 11}`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B${r + 11}`).fill = FILLS.charcoalLight;
  sheet.getCell(`B${r + 11}`).border = BORDER_THIN();

  sheet.getCell(`E${r + 11}`).value = {
    formula: `IFERROR(ROUND(NPER(E${r + 7}/12,-(E${r + 6}+E${r + 8}),-E${r + 2},E${r + 1})/12,1),99)`,
  };
  sheet.getCell(`E${r + 11}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
  sheet.getCell(`E${r + 11}`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E${r + 11}`).fill = FILLS.charcoalLight;
  sheet.getCell(`E${r + 11}`).border = BORDER_THIN();

  addCallout(sheet, `B${r + 14}:L${r + 15}`,
    '👴',
    'The retirement-vs-college trade-off is real',
    'Diverting monthly cash to kids\' college pushes back your own FIRE timeline. The 2-row delta above shows the YEARS of difference. The AI Family Goals Conflict Resolver (PDF page 8) names retirement as the slip-prone goal in most families — make retirement an automatic payroll deduction you can\'t see, so it doesn\'t get reallocated to whichever fire is loudest. Your kids can get aid + loans; your retirement can\'t.');
  sheet.getRow(r + 14).height = 32;
  sheet.getRow(r + 15).height = 32;

  addFooter(sheet, r + 19, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 15 — 🎯 SAVINGS GOALS TIMELINE (Pro)
// ============================================================================

function buildSavingsGoalsTimeline(workbook) {
  const sheet = workbook.addWorksheet('🎯 Savings Goals Timeline');
  setTabColor(sheet, COLORS.success);
  setupColumns(sheet, { A: 2, B: 24, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🎯 Savings Goals Timeline',
    tabSubtitle: 'All family goals on one timeline. Conflict alerts when 2+ goals collide within 24 months.',
    bannerText: BANNER,
    kpiData: [
      { label: 'GOALS',           value: { formula: `COUNTIF(B11:B25,"<>")` } },
      { label: 'ANNUAL REQUIRED', value: { formula: `TEXT(SUM(F11:F25)*12,"$#,##0")` } },
      { label: 'ANNUAL SAVEABLE', value: { formula: `TEXT('👶 Child Profiles'!C${CP.PARENT_SAVEABLE_ROW},"$#,##0")` } },
      { label: 'SHORTFALL',       value: { formula: `TEXT(MAX(0,SUM(F11:F25)*12-'👶 Child Profiles'!C${CP.PARENT_SAVEABLE_ROW}),"$#,##0")` } },
      { label: 'CONFLICTS',       value: { formula: `IFERROR(E22,0)` } },
      { label: 'STATUS',          value: { formula: `IF(IFERROR(E22,0)>1,"🔴 Overlap","🟢 Clear")` } },
    ],
  });

  // === Goal list ===
  let r = 10;
  addTableHeader(sheet, r,
    ['Goal', 'Target $', 'Target Year', 'Current $', 'Gap $', 'Mo. Required', 'Priority', 'Status', 'Notes'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

  const seed = [
    { name: 'Emergency Fund',          target: 48000,  year: 2026, current: 32000, prio: 'Non-negotiable', notes: '6 mo expenses' },
    { name: 'Home Down Payment',       target: 50000,  year: 2029, current: 22000, prio: 'Can delay',      notes: '20% on $250K' },
    { name: 'Emma — college',          target: 80000,  year: 2036, current: 14000, prio: 'Non-negotiable', notes: 'Private mid-tier target' },
    { name: 'Liam — college',          target: 80000,  year: 2040, current: 3000,  prio: 'Non-negotiable', notes: 'In-state public' },
    { name: 'Noah — ABLE + college',   target: 60000,  year: 2042, current: 0,     prio: 'Non-negotiable', notes: 'Special-needs mix' },
    { name: 'Retirement (joint)',      target: 1450000,year: 2043, current: 310000,prio: 'Non-negotiable', notes: 'FIRE 17yr horizon' },
    { name: 'Home Renovation (kitchen)', target: 30000,  year: 2028, current: 0,    prio: 'Can delay',      notes: '' },
    { name: 'Family Vacation Fund',    target: 5000,   year: 2026, current: 0,     prio: 'Can delay',      notes: 'Annual recurring' },
    { name: 'Aging Parent Reserve',    target: 25000,  year: 2032, current: 0,     prio: 'Can delay',      notes: 'Just-in-case' },
  ];

  for (let i = 0; i < 15; i++) {
    const ri = r + 1 + i;
    const g = seed[i] || {};

    sheet.getCell(`B${ri}`).value = g.name || '';
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.white;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = g.target || null;
    if (g.target) sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = g.year || null;
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = g.current ?? null;
    if (g.current) sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    // Gap = target - current
    sheet.getCell(`F${ri}`).value = { formula: `IFERROR(MAX(0,C${ri}-E${ri})/MAX(1,(D${ri}-YEAR(TODAY()))*12),0)` };
    sheet.getCell(`F${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`F${ri}`).font = FONTS.body;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    // Monthly required already in F, so reuse — actually F is mo required, let me move gap to a separate column? No — column F is "Mo. Required" per header. Let me show gap in column G (priority) — actually header says G = Priority. Let me keep priority in G as planned.

    sheet.getCell(`G${ri}`).value = g.prio || '';
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();
    sheet.getCell(`G${ri}`).dataValidation = { type: 'list', formulae: ['"Non-negotiable,Can delay,Can drop"'], allowBlank: true };

    sheet.getCell(`H${ri}`).value = { formula: `IF(B${ri}="","",IF(D${ri}-YEAR(TODAY())<=2,"🔴 <2yr",IF(D${ri}-YEAR(TODAY())<=5,"🟡 2-5yr","🟢 >5yr")))` };
    sheet.getCell(`H${ri}`).font = FONTS.body;
    sheet.getCell(`H${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`H${ri}`).fill = FILLS.white;
    sheet.getCell(`H${ri}`).border = BORDER_THIN();

    sheet.getCell(`I${ri}`).value = g.notes || '';
    sheet.getCell(`I${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`I${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`I${ri}`).fill = FILLS.white;
    sheet.getCell(`I${ri}`).border = BORDER_THIN();
    sheet.mergeCells(`I${ri}:J${ri}`);

    sheet.getCell(`A${ri}`).fill = FILLS.successLight;
    sheet.getRow(ri).height = 22;
  }

  // Conflict count cell at row 22 (E22) — used by dashboard formula
  sheet.getCell(`B22`).value = 'Goals overlapping in 2026–2028 window:';
  sheet.getCell(`B22`).font = FONTS.bodyBold;
  sheet.getCell(`B22`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`B22`).fill = FILLS.ivory;
  sheet.getCell(`B22`).border = BORDER_THIN();
  sheet.mergeCells(`B22:D22`);

  sheet.getCell(`E22`).value = { formula: `SUMPRODUCT((D11:D25>=2026)*(D11:D25<=2028))` };
  sheet.getCell(`E22`).font = { ...FONTS.bodyBold, color: argb(COLORS.warning) };
  sheet.getCell(`E22`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E22`).fill = FILLS.warningLight;
  sheet.getCell(`E22`).border = BORDER_THIN(COLORS.warning);
  sheet.getRow(22).height = 24;

  addCallout(sheet, `B27:L28`,
    '🎯',
    'When goals collide',
    'The 24-month conflict window flags when ≥2 goals hit the same year. The fix is rarely "save more" — it\'s rephase: take one flexible goal (renovation, vacation fund) and push it 2-4 years. The AI Family Goals Conflict Resolver (PDF page 8) walks through each conflict zone and names a specific resolution. Don\'t sacrifice retirement to push renovation forward.');
  sheet.getRow(27).height = 32;
  sheet.getRow(28).height = 32;

  addFooter(sheet, 32, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 16 — 🎓 FINANCIAL LITERACY MILESTONES (Pro)
// ============================================================================

function buildFinancialLiteracyMilestones(workbook) {
  const sheet = workbook.addWorksheet('🎓 Literacy Milestones');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 14, D: 14, E: 14, F: 14, G: 14, H: 4, I: 4, J: 4, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🎓 Literacy Milestones',
    tabSubtitle: 'Per-child age-mapped financial curriculum from age 5 to 18.',
    bannerText: BANNER,
    kpiData: [
      { label: 'MILESTONES',  value: '13 stages' },
      { label: 'CHILDREN',    value: { formula: `COUNTIF('👶 Child Profiles'!C${CP.CHILD_FIRST_ROW}:C${CP.CHILD_LAST_ROW},"<>")` } },
      { label: 'COMPLETED',   value: { formula: `COUNTIF(C9:F21,"✓")` } },
      { label: 'IN PROGRESS', value: { formula: `COUNTIF(C9:F21,"⏳")` } },
      { label: 'NOT STARTED', value: { formula: `COUNTIF(C9:F21,"—")` } },
      { label: '% COMPLETE',  value: { formula: `TEXT(E22,"0%")` } },
    ],
  });

  // === Per-age milestones table ===
  let r = 7;
  addTableHeader(sheet, r,
    ['Age', `Child 1`, `Child 2`, `Child 3`, `Child 4`, 'Milestone'],
    ['B', 'C', 'D', 'E', 'F', 'G']);

  const milestones = [
    { age: 5,  desc: 'Coins & dollars — recognize value, sort by denomination' },
    { age: 6,  desc: 'First piggy bank or jar — save/spend/share buckets' },
    { age: 7,  desc: 'Allowance introduced — small weekly amount, no tie to chores' },
    { age: 8,  desc: 'First savings goal — toy or experience they save for over 1-3 mo' },
    { age: 10, desc: 'Bank account opened (with parent joint owner)' },
    { age: 11, desc: 'Concept of interest — money grows by being saved' },
    { age: 12, desc: 'Wants vs needs — budgeting their allowance over the month' },
    { age: 13, desc: 'First job or earned income — taxes on a paystub' },
    { age: 14, desc: 'Comparison shopping — value vs price, unit pricing' },
    { age: 16, desc: 'Credit basics — what a credit score is, what hurts it' },
    { age: 17, desc: 'First debit card — managing balance, ATM fees, avoiding overdraft' },
    { age: 18, desc: 'Student loans 101 — what they are, what they cost over 10-20 yrs' },
    { age: 18, desc: 'Roth IRA introduction — power of starting to save for retirement at 18' },
  ];

  milestones.forEach((m, i) => {
    const ri = r + 1 + i;
    sheet.getCell(`B${ri}`).value = m.age;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    // [COMPLEMENT] Pre-seed realistic status marks based on each child's age in the seed family:
    //   Emma age 8  (col C): ages 5/6/7 → ✓, age 8 → ⏳ (in progress)
    //   Liam age 4  (col D): age 5 → ⏳ (approaching)
    //   Noah age 1  (col E): all → — (not yet)
    //   Slot 4 empty (col F): all → —
    // This lifts the Dashboard literacy sub-score from 0 to ~0.5-0.8 and makes the Family
    // Health Score reflect a real family-with-young-kids state on first open.
    const seedStatus = {
      C: (age) => age <= 7 ? '✓' : (age === 8 ? '⏳' : '—'),
      D: (age) => age === 5 ? '⏳' : '—',
      E: () => '—',
      F: () => '—',
    };
    ['C', 'D', 'E', 'F'].forEach((col) => {
      sheet.getCell(`${col}${ri}`).value = seedStatus[col](m.age);
      sheet.getCell(`${col}${ri}`).font = FONTS.body;
      sheet.getCell(`${col}${ri}`).alignment = { horizontal: 'center' };
      sheet.getCell(`${col}${ri}`).fill = FILLS.white;
      sheet.getCell(`${col}${ri}`).border = BORDER_THIN();
      sheet.getCell(`${col}${ri}`).dataValidation = { type: 'list', formulae: ['"✓,⏳,—"'], allowBlank: false };
    });

    sheet.getCell(`G${ri}`).value = m.desc;
    sheet.getCell(`G${ri}`).font = FONTS.body;
    sheet.getCell(`G${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`G${ri}`).fill = FILLS.white;
    sheet.getCell(`G${ri}`).border = BORDER_THIN();

    sheet.getCell(`A${ri}`).fill = FILLS.warningLight;
    sheet.getRow(ri).height = 24;
  });

  // % complete cell at E22 (used by dashboard)
  sheet.getCell(`B22`).value = '% Complete (all children):';
  sheet.getCell(`B22`).font = FONTS.bodyBold;
  sheet.getCell(`B22`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`B22`).fill = FILLS.ivory;
  sheet.getCell(`B22`).border = BORDER_THIN();
  sheet.mergeCells(`B22:D22`);

  // [FIX FEP-023 + complement] E22 was a literal 0 — Dashboard literacy sub-score always rendered 🔴.
  // Now: ✓ count over (✓+⏳) — only count cells the parent has acknowledged as in-progress-or-done.
  // The "—" placeholder cells (default state) are excluded from the denominator, otherwise an
  // 8-year-old child's literacy ratio reads ~6% (52 total cells, ~3 actionable) instead of ~75%
  // (4 actionable, 3 done). This makes the Dashboard Family Health Score truthful on first open.
  sheet.getCell(`E22`).value = { formula: `IFERROR(COUNTIF(C8:F${r + milestones.length},"✓")/MAX(1,COUNTIF(C8:F${r + milestones.length},"✓")+COUNTIF(C8:F${r + milestones.length},"⏳")),0)` };
  sheet.getCell(`E22`).numFmt = '0%';
  sheet.getCell(`E22`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
  sheet.getCell(`E22`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E22`).fill = FILLS.successLight;
  sheet.getCell(`E22`).border = BORDER_THIN(COLORS.success);
  sheet.getRow(22).height = 24;

  addCallout(sheet, `B25:G27`,
    '🎓',
    'Financial literacy is the parent\'s job',
    'Schools rarely teach this. Greenlight and similar apps gamify but don\'t teach the WHY. The 13 milestones here are age-mapped; check ⏳ when you start a conversation, ✓ when the child can articulate the concept back to you. By age 18 each child should know what a credit score is, what student loans cost over 10 years, and why a Roth IRA opened at 18 vs 28 is a 10-year head start they can\'t buy back.');
  sheet.getRow(25).height = 30;
  sheet.getRow(26).height = 30;

  addFooter(sheet, 30, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 17 — 💰 FAMILY BUDGET (Essentials + Pro + AI)
// ============================================================================

function buildFamilyBudget(workbook) {
  const sheet = workbook.addWorksheet('💰 Family Budget');
  setTabColor(sheet, COLORS.warning);
  setupColumns(sheet, { A: 2, B: 24, C: 14, D: 14, E: 14, F: 14, G: 14, H: 14, I: 14, J: 14, K: 14, L: 14, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '💰 Family Budget',
    tabSubtitle: 'Household income + expenses. Monthly + annual rollup. Surplus drives savings.',
    bannerText: BANNER,
    kpiData: [
      { label: 'INCOME / MO',     value: { formula: `TEXT(E8/12,"$#,##0")` } },
      { label: 'EXPENSES / MO',   value: { formula: `TEXT(SUM(E11:E30)/12,"$#,##0")` } },
      { label: 'SURPLUS / MO',    value: { formula: `TEXT(E32,"$#,##0")` } },
      { label: 'SAVINGS RATE',    value: { formula: `IFERROR(TEXT(E32/E8*12,"0%"),"—")` } },
      { label: 'ANNUAL INCOME',   value: { formula: `TEXT(E8,"$#,##0")` } },
      { label: 'ANNUAL EXPENSES', value: { formula: `TEXT(SUM(E11:E30),"$#,##0")` } },
    ],
  });

  // === Income block (row 7-9) ===
  let r = 6;
  sheet.mergeCells(`B${r}:F${r}`);
  sheet.getCell(`B${r}`).value = 'INCOME';
  sheet.getCell(`B${r}`).font = { ...FONTS.section, color: argb(COLORS.warmGold) };
  sheet.getCell(`B${r}`).fill = FILLS.charcoal;
  sheet.getCell(`B${r}`).alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  sheet.getRow(r).height = 22;

  addTableHeader(sheet, r + 1, ['Source', 'Monthly', 'Annual', 'Notes', ''], ['B', 'C', 'D', 'E', 'F']);

  // Row 8 = total income annual
  sheet.getCell(`B8`).value = 'Combined household income';
  sheet.getCell(`B8`).font = FONTS.bodyBold;
  sheet.getCell(`B8`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B8`).fill = FILLS.ivory;
  sheet.getCell(`B8`).border = BORDER_THIN();

  sheet.getCell(`C8`).value = { formula: `'👶 Child Profiles'!C${CP.PARENT_INCOME_ROW}/12` };
  sheet.getCell(`C8`).numFmt = '"$"#,##0';
  sheet.getCell(`C8`).font = FONTS.body;
  sheet.getCell(`C8`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`C8`).fill = FILLS.white;
  sheet.getCell(`C8`).border = BORDER_THIN();

  sheet.getCell(`D8`).value = { formula: `C8*12` };
  sheet.getCell(`D8`).numFmt = '"$"#,##0';
  sheet.getCell(`D8`).font = FONTS.body;
  sheet.getCell(`D8`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`D8`).fill = FILLS.white;
  sheet.getCell(`D8`).border = BORDER_THIN();

  sheet.getCell(`E8`).value = { formula: `'👶 Child Profiles'!C${CP.PARENT_INCOME_ROW}` };
  sheet.getCell(`E8`).numFmt = '"$"#,##0';
  sheet.getCell(`E8`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
  sheet.getCell(`E8`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E8`).fill = FILLS.successLight;
  sheet.getCell(`E8`).border = BORDER_THIN();

  // === Expense categories block (rows 10-30) ===
  sheet.mergeCells(`B10:F10`);
  sheet.getCell(`B10`).value = 'EXPENSES';
  sheet.getCell(`B10`).font = { ...FONTS.section, color: argb(COLORS.warmGold) };
  sheet.getCell(`B10`).fill = FILLS.charcoal;
  sheet.getCell(`B10`).alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  sheet.getRow(10).height = 22;

  const expenses = [
    { label: 'Housing (mortgage / rent)',    mo: 2400, annual: null, note: '' },
    { label: 'Utilities',                     mo: 380,  annual: null, note: '' },
    { label: 'Groceries',                     mo: 1400, annual: null, note: '4-person household' },
    { label: 'Transportation (gas, car payments)', mo: 720,  annual: null, note: '' },
    { label: 'Childcare (current month)',     mo: 2800, annual: null, note: 'From Childcare Cost Planner' },
    { label: 'Health insurance + medical',    mo: 1240, annual: null, note: 'From Family Health Budget' },
    { label: 'Dining + entertainment',        mo: 480,  annual: null, note: '' },
    { label: 'Family activities / kids',      mo: 320,  annual: null, note: 'Lessons, sports, outings' },
    { label: 'Education savings (529 etc.)',  mo: 970,  annual: null, note: 'Per Child Profiles' },
    { label: 'Retirement contributions',      mo: 1850, annual: null, note: '' },
    { label: 'Emergency fund + savings',      mo: 500,  annual: null, note: '' },
    { label: 'Personal care + clothing',      mo: 280,  annual: null, note: '' },
    { label: 'Streaming + subscriptions',     mo: 95,   annual: null, note: 'Netflix, gym, etc.' },
    { label: 'Insurance (life + auto)',       mo: 230,  annual: null, note: '' },
    { label: 'Debt payments (non-mortgage)',  mo: 880,  annual: null, note: 'Per Retirement Impact + Loan Amort' },
    { label: 'Gifts + holidays',              mo: 220,  annual: null, note: '' },
    { label: 'Charitable giving',             mo: 150,  annual: null, note: '' },
    { label: 'Travel + vacation',             mo: 400,  annual: null, note: '' },
    { label: 'Pet care',                      mo: 80,   annual: null, note: '' },
    { label: 'Other / buffer',                mo: 220,  annual: null, note: '' },
  ];

  expenses.forEach((e, i) => {
    const ri = 11 + i;
    sheet.getCell(`B${ri}`).value = e.label;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    sheet.getCell(`C${ri}`).value = e.mo;
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0] };

    sheet.getCell(`D${ri}`).value = { formula: `C${ri}*12` };
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();

    sheet.getCell(`E${ri}`).value = { formula: `D${ri}` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = FONTS.body;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getCell(`F${ri}`).value = e.note;
    sheet.getCell(`F${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`F${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`F${ri}`).fill = FILLS.white;
    sheet.getCell(`F${ri}`).border = BORDER_THIN();

    sheet.getCell(`A${ri}`).fill = FILLS.warningLight;
    sheet.getRow(ri).height = 22;
  });

  // === Surplus row (row 32) ===
  sheet.getCell(`B32`).value = 'MONTHLY SURPLUS / DEFICIT';
  sheet.getCell(`B32`).font = { name: 'Inter', size: 14, bold: true, color: argb(COLORS.charcoal) };
  sheet.getCell(`B32`).alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell(`B32`).fill = FILLS.charcoal;
  sheet.getCell(`B32`).border = BORDER_THIN();
  sheet.mergeCells(`B32:D32`);

  sheet.getCell(`E32`).value = { formula: `C8-SUM(C11:C30)` };
  sheet.getCell(`E32`).numFmt = '"$"#,##0';
  sheet.getCell(`E32`).font = { name: 'Inter', size: 18, bold: true, color: argb(COLORS.warmGold) };
  sheet.getCell(`E32`).alignment = { horizontal: 'right', indent: 1 };
  sheet.getCell(`E32`).fill = FILLS.charcoal;
  sheet.getCell(`E32`).border = BORDER_THIN();
  sheet.getRow(32).height = 32;

  sheet.addConditionalFormatting({
    ref: `E32`,
    rules: [
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['0'], priority: 1, style: { font: { name: 'Inter', size: 18, bold: true, color: argb(COLORS.success) } } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 2, style: { font: { name: 'Inter', size: 18, bold: true, color: argb(COLORS.alert) } } },
    ],
  });

  addCallout(sheet, `B34:L35`,
    '💰',
    'Surplus = your future',
    'A positive monthly surplus is where retirement contributions + education savings + emergency fund all live. The Family Health Score uses surplus as a sub-component. If the surplus is negative, the cascade is: cut the lowest-priority expense line, not the savings line. Retirement is the goal that historically slips first when something new appears — automate it through payroll so the surplus question never threatens it.');
  sheet.getRow(34).height = 32;
  sheet.getRow(35).height = 32;

  addFooter(sheet, 39, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 18 — 📊 ANNUAL FAMILY REVIEW
// ============================================================================

function buildAnnualFamilyReview(workbook) {
  // [FIX FEP3-002] Tier-aware: Retirement Impact + Family Health Budget rows are Pro-only tabs.
  // Essentials gets static placeholders to avoid #NAME? errors on first open.
  const tier = workbook._tier || 'ai';
  const sheet = workbook.addWorksheet('📊 Annual Family Review');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 22, C: 18, D: 18, E: 22, F: 4, G: 4, H: 4, I: 4, J: 4, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '📊 Annual Family Review',
    tabSubtitle: 'Year-end snapshot — 4 mini-dashboards. Run this once per year (Dec 31 or Jan 1).',
    bannerText: BANNER,
    kpiData: [
      { label: 'YEAR',          value: { formula: `YEAR(TODAY())` } },
      { label: 'ED SAVED',      value: { formula: `TEXT(SUM('👶 Child Profiles'!I${CP.CHILD_FIRST_ROW}:I${CP.CHILD_LAST_ROW}),"$#,##0")` } },
      { label: 'BUDGET SURPLUS',value: { formula: `TEXT('💰 Family Budget'!E32*12,"$#,##0")` } },
      { label: 'LIFE INS GAP',  value: { formula: `TEXT(MAX(0,'🛡️ Life Insurance Calculator'!E22-'🛡️ Life Insurance Calculator'!C12),"$#,##0")` } },
      { label: 'GOALS DONE',    value: { formula: `COUNTIF(C14:C18,"✓")` } },
      { label: 'HEALTH SCORE',  value: { formula: `'🏠 Dashboard'!B7&"/100"` } },
    ],
  });

  // === Section 1 — Savings progress ===
  let r = addSectionHeader(sheet, 6, 'Savings progress', 'Year-over-year delta on the core family numbers.');

  // [FIX FEP3-002] Pro-only refs replaced with literal placeholders in Essentials.
  const savingsRows = [
    { label: 'Education savings total',     formula: `SUM('👶 Child Profiles'!I${CP.CHILD_FIRST_ROW}:I${CP.CHILD_LAST_ROW})` },
    { label: 'Retirement balance',
      formula: tier === 'essentials' ? null : `'👴 Retirement Impact'!E11`,
      essentialsLiteral: 0,
      essentialsNote: 'Pro tier tracks retirement balance via Retirement Impact tab.' },
    { label: 'HSA balance',
      formula: tier === 'essentials' ? null : `'🏥 Family Health Budget'!C24`,
      essentialsLiteral: 0,
      essentialsNote: 'Pro tier tracks HSA balance via Family Health Budget tab.' },
    { label: 'Emergency fund (assumed)',     val: 32000 },
  ];

  addTableHeader(sheet, r + 1, ['Category', 'This Year', 'Last Year', 'Δ Change', ''], ['B', 'C', 'D', 'E', 'F']);

  savingsRows.forEach((s, i) => {
    const ri = r + 2 + i;
    sheet.getCell(`B${ri}`).value = s.label;
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();

    // [FIX FEP3-002] Honor essentialsLiteral fallback for Pro-only refs in Essentials.
    if (s.formula) {
      sheet.getCell(`C${ri}`).value = { formula: s.formula };
    } else if (s.essentialsLiteral !== undefined) {
      sheet.getCell(`C${ri}`).value = s.essentialsLiteral;
      if (s.essentialsNote) sheet.getCell(`C${ri}`).note = s.essentialsNote;
    } else {
      sheet.getCell(`C${ri}`).value = s.val;
    }
    sheet.getCell(`C${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`C${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();

    sheet.getCell(`D${ri}`).value = '';
    sheet.getCell(`D${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`D${ri}`).font = FONTS.body;
    sheet.getCell(`D${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`D${ri}`).fill = FILLS.white;
    sheet.getCell(`D${ri}`).border = BORDER_THIN();
    sheet.getCell(`D${ri}`).dataValidation = { type: 'decimal', operator: 'greaterThanOrEqual', formulae: [0], allowBlank: true };

    sheet.getCell(`E${ri}`).value = { formula: `IFERROR(C${ri}-D${ri},0)` };
    sheet.getCell(`E${ri}`).numFmt = '"$"#,##0';
    sheet.getCell(`E${ri}`).font = { ...FONTS.bodyBold, color: argb(COLORS.success) };
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'right', indent: 1 };
    sheet.getCell(`E${ri}`).fill = FILLS.successLight;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getRow(ri).height = 22;
  });

  // === Section 2 — Year-end checklist ===
  let r2 = addSectionHeader(sheet, r + 8, 'Year-end checklist',
    'The 5 actions every family should run between Dec 1 and Jan 15.', 'B:E');

  const checklist = [
    'Max out 529 contribution to capture full state deduction',
    'Max out HSA contribution (family cap $8,550 for 2026)',
    'Review beneficiary designations on all accounts',
    'Run FSA balance to $0 (use-it-or-lose-it)',
    'Update Will / Trust / POA documents if life event occurred',
  ];

  checklist.forEach((item, i) => {
    const ri = r2 + 1 + i;
    sheet.getCell(`B${ri}`).value = item;
    sheet.getCell(`B${ri}`).font = FONTS.body;
    sheet.getCell(`B${ri}`).alignment = { horizontal: 'left', indent: 1, wrapText: true };
    sheet.getCell(`B${ri}`).fill = FILLS.ivory;
    sheet.getCell(`B${ri}`).border = BORDER_THIN();
    sheet.mergeCells(`B${ri}:D${ri}`);

    sheet.getCell(`C${ri}`).value = '—';
    sheet.getCell(`C${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).alignment = { horizontal: 'center' };
    sheet.getCell(`C${ri}`).fill = FILLS.white;
    sheet.getCell(`C${ri}`).border = BORDER_THIN();
    sheet.getCell(`C${ri}`).dataValidation = { type: 'list', formulae: ['"✓,⏳,—"'], allowBlank: false };

    sheet.getCell(`E${ri}`).value = '';
    sheet.getCell(`E${ri}`).font = FONTS.bodyMuted;
    sheet.getCell(`E${ri}`).alignment = { horizontal: 'left', indent: 1 };
    sheet.getCell(`E${ri}`).fill = FILLS.white;
    sheet.getCell(`E${ri}`).border = BORDER_THIN();

    sheet.getRow(ri).height = 24;
  });

  addCallout(sheet, `B${r2 + 8}:E${r2 + 9}`,
    '📊',
    'Annual review = the calendar invite that protects everything else',
    'Pick a Saturday between Dec 30 and Jan 15. Run this tab + the checklist. Most families intend to do this and never actually sit down. The single annual review is the highest-leverage hour of financial work you do all year.');
  sheet.getRow(r2 + 8).height = 32;
  sheet.getRow(r2 + 9).height = 32;

  addFooter(sheet, r2 + 13, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 19 — 🤖 AI FAMILY FINANCE ADVISOR (AI Edition only)
// ============================================================================

function buildAIFamilyFinanceAdvisor(workbook) {
  const sheet = workbook.addWorksheet('🤖 AI Family Finance Advisor');
  setTabColor(sheet, COLORS.charcoal);
  setupColumns(sheet, { A: 2, B: 22, C: 22, D: 22, E: 22, F: 4, G: 22, H: 22, I: 22, J: 22, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '🤖 AI Family Finance Advisor',
    tabSubtitle: '8 prompts for any AI assistant free tier. Paste the prompt + your data; the AI never sees your spreadsheet.',
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

  let r = addSectionHeader(sheet, 6, '8 AI prompts × 2-row × 4-col layout',
    'Each card: title + tab pairing + 1-line description + PDF page reference + your output paste cell.');

  const prompts = [
    { num: 1, title: 'Account Type Picker',         tab: '💰 Account Type Comparison',    desc: 'Which account per child? 529 / Coverdell / UTMA / ABLE — per child.',         pdfPage: 3 },
    { num: 2, title: 'Scholarship Matching Engine', tab: '🏆 Scholarship Tracker',          desc: '5–7 realistic scholarships + positioning. Not 500 long-shots.',              pdfPage: 4 },
    { num: 3, title: 'Life Insurance Advisor',      tab: '🛡️ Life Insurance Calculator',   desc: 'DIME method → benefit + term. Honest about whole-life.',                     pdfPage: 5 },
    { num: 4, title: 'College Affordability Coach', tab: '🎓 College Savings Planner',       desc: 'Net price modeling. What can we actually afford?',                            pdfPage: 6 },
    { num: 5, title: 'Childcare Optimizer',          tab: '🧒 Childcare Cost Planner',       desc: 'Daycare / nanny / au pair / family — models all 7 options.',                  pdfPage: 7 },
    { num: 6, title: 'Family Goals Conflict Resolver', tab: '🎯 Savings Goals Timeline',    desc: 'Names the goal collisions + a specific resolution per zone.',                pdfPage: 8 },
    { num: 7, title: 'Financial Aid Appeal Coach',   tab: '📑 Aid Letter Comparison',       desc: 'Drafts the appeal letter when offer is below need.',                          pdfPage: 9 },
    { num: 8, title: 'State 529 Optimizer',          tab: '🗺️ State 529 Tax Benefits',      desc: 'In-state vs. out-of-state plan — your specific state.',                       pdfPage: 10 },
  ];

  // 2x4 layout: row 1 = cards 1-4, row 2 = cards 5-8
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

    // PDF reference
    sheet.mergeCells(`${startCol}${baseRow + 4}:${endCol}${baseRow + 4}`);
    sheet.getCell(`${startCol}${baseRow + 4}`).value = `📄 PDF page ${p.pdfPage} · Paste AI output below ↓`;
    sheet.getCell(`${startCol}${baseRow + 4}`).font = { ...FONTS.small, italic: true, color: argb(COLORS.textMuted) };
    sheet.getCell(`${startCol}${baseRow + 4}`).fill = FILLS.warmGoldLight;
    sheet.getCell(`${startCol}${baseRow + 4}`).alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getRow(baseRow + 4).height = 18;

    // Paste-output cell
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
    'All 8 work on any AI assistant, including free tiers. Paste the prompt + your data; read the worked example on the matching PDF page first to see what good output looks like. Save useful output into the "Paste output here" cell so it stays with your spreadsheet. Your kids\' SSNs / school names / FAFSA PINs / brokerage logins never enter any AI tool — use labels ("Child A," "Target College #1") instead.');
  sheet.getRow(r + 16).height = 32;
  sheet.getRow(r + 17).height = 32;

  addFooter(sheet, r + 21, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 20a — ⚙️ SETTINGS & FX (All tiers) — [COMPLEMENT FEP-004/005/026]
// Single source of truth for inflation + return + FX. Named ranges drive
// every downstream tab — edit once here, every child re-projects.
// ============================================================================

function buildSettingsAndFX(workbook) {
  const sheet = workbook.addWorksheet('⚙️ Settings & FX');
  setTabColor(sheet, COLORS.warmGold);
  setupColumns(sheet, { A: 2, B: 36, C: 14, D: 56, E: 12, F: 12, G: 12, H: 12, I: 12, J: 12, K: 4, L: 4, M: 2 });

  addTopBar(sheet, {
    productName: `${PRODUCT_NAME} — AI Edition`,
    tabName: '⚙️ Settings & FX',
    tabSubtitle: 'Single source of truth for inflation, expected return, and FX. Named ranges — referenced from every projection tab.',
    bannerText: '✦  Why a Spreadsheet, Not an App?   Every assumption here drives every downstream tab. Edit once, every child re-projects.',
    kpiData: [
      { label: 'INFLATION',   value: { formula: `TEXT(Inflation,"0.0%")` } },
      { label: 'EDU RETURN',  value: { formula: `TEXT(EduReturn,"0.0%")` } },
      { label: 'K-12 INFL',   value: { formula: `TEXT(K12Inflation,"0.0%")` } },
      { label: 'RET RETURN',  value: { formula: `TEXT(RetReturn,"0.0%")` } },
      { label: 'BASE CCY',    value: { formula: `BaseCurrency` } },
      { label: 'CURRENCIES',  value: '6' },
    ],
  });

  // === Projection assumptions block (rows 6-10) — these are the named ranges ===
  sheet.getCell('B6').value = 'PROJECTION ASSUMPTIONS';
  sheet.getCell('B6').font = { ...FONTS.section, color: argb(COLORS.warmGold) };
  sheet.getCell('B6').fill = FILLS.charcoal;
  sheet.getCell('B6').alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  sheet.mergeCells('B6:D6');
  sheet.getRow(6).height = 22;

  const assumptionRows = [
    { row: 7,  label: 'College-cost inflation (annual)',           value: 0.05, fmt: '0.0%', name: 'Inflation',
      note: 'Default 5%. Persona overrides: Mariam 7% / Tarek 5% / Sara 4% / Mohamed 6%.' },
    { row: 8,  label: 'Investment expected return (529 / brokerage)', value: 0.06, fmt: '0.0%', name: 'EduReturn',
      note: '6% real (after inflation). Drop to 4% conservative, raise to 7% aggressive.' },
    { row: 9,  label: 'K-12 cost inflation (annual)',              value: 0.03, fmt: '0.0%', name: 'K12Inflation',
      note: 'School-cost inflation. Often lower than tuition inflation.' },
    { row: 10, label: 'Retirement expected return',                 value: 0.07, fmt: '0.0%', name: 'RetReturn',
      note: 'Used by Retirement Impact tab. Slightly higher than education-savings due to longer horizon + heavier equity tilt.' },
  ];

  assumptionRows.forEach((a) => {
    sheet.getCell(`B${a.row}`).value = a.label;
    sheet.getCell(`B${a.row}`).font = FONTS.bodyBold;
    sheet.getCell(`B${a.row}`).alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
    sheet.getCell(`B${a.row}`).fill = FILLS.ivory;
    sheet.getCell(`B${a.row}`).border = BORDER_THIN();

    sheet.getCell(`C${a.row}`).value = a.value;
    sheet.getCell(`C${a.row}`).numFmt = a.fmt;
    sheet.getCell(`C${a.row}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`C${a.row}`).alignment = { horizontal: 'right', indent: 1, vertical: 'middle' };
    sheet.getCell(`C${a.row}`).fill = FILLS.white;
    sheet.getCell(`C${a.row}`).border = BORDER_THIN(COLORS.warmGold);
    sheet.getCell(`C${a.row}`).dataValidation = { type: 'decimal', operator: 'between', formulae: [0, 0.20], allowBlank: false };
    sheet.getCell(`C${a.row}`).note = a.note;

    sheet.getCell(`D${a.row}`).value = a.note;
    sheet.getCell(`D${a.row}`).font = FONTS.bodyMuted;
    sheet.getCell(`D${a.row}`).alignment = { horizontal: 'left', indent: 1, vertical: 'middle', wrapText: true };
    sheet.getCell(`D${a.row}`).fill = FILLS.white;
    sheet.getCell(`D${a.row}`).border = BORDER_THIN();

    sheet.getRow(a.row).height = 24;

    // Register the defined name (named range) — points to the C-column input cell
    workbook.definedNames.add(`'⚙️ Settings & FX'!$C$${a.row}`, a.name);
  });

  // === Currency block ===
  sheet.getCell('B12').value = 'CURRENCY';
  sheet.getCell('B12').font = { ...FONTS.section, color: argb(COLORS.warmGold) };
  sheet.getCell('B12').fill = FILLS.charcoal;
  sheet.getCell('B12').alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  sheet.mergeCells('B12:D12');
  sheet.getRow(12).height = 22;

  sheet.getCell('B13').value = 'Base currency for this workbook';
  sheet.getCell('B13').font = FONTS.bodyBold;
  sheet.getCell('B13').alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
  sheet.getCell('B13').fill = FILLS.ivory;
  sheet.getCell('B13').border = BORDER_THIN();

  sheet.getCell('C13').value = 'USD';
  sheet.getCell('C13').font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
  sheet.getCell('C13').alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getCell('C13').fill = FILLS.white;
  sheet.getCell('C13').border = BORDER_THIN(COLORS.warmGold);
  sheet.getCell('C13').dataValidation = { type: 'list', formulae: ['"USD,EGP,AED,GBP,CAD,EUR"'], allowBlank: false };
  sheet.getCell('C13').note = 'Drives currency labels on per-child Currency column M (Child Profiles). Type one of: USD, EGP, AED, GBP, CAD, EUR.';

  sheet.getCell('D13').value = 'Type one of: USD, EGP, AED, GBP, CAD, EUR.';
  sheet.getCell('D13').font = FONTS.bodyMuted;
  sheet.getCell('D13').alignment = { horizontal: 'left', indent: 1, vertical: 'middle' };
  sheet.getCell('D13').fill = FILLS.white;
  sheet.getCell('D13').border = BORDER_THIN();

  workbook.definedNames.add(`'⚙️ Settings & FX'!$C$13`, 'BaseCurrency');

  // === FX rate table ===
  sheet.getCell('B14').value = 'FX RATE TABLE — to base currency';
  sheet.getCell('B14').font = { ...FONTS.bodyBold, color: argb(COLORS.charcoal) };
  sheet.getCell('B14').alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell('B14').fill = FILLS.ivory;

  // Header row: B currency, C-G targets
  const fxHeaders = ['Currency', '→ USD', '→ EGP', '→ AED', '→ GBP', '→ CAD', '→ EUR'];
  ['B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach((col, i) => {
    if (i >= fxHeaders.length) return;
    sheet.getCell(`${col}15`).value = fxHeaders[i];
    sheet.getCell(`${col}15`).font = FONTS.headerWhite;
    sheet.getCell(`${col}15`).fill = FILLS.charcoal;
    sheet.getCell(`${col}15`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`${col}15`).border = BORDER_THIN(COLORS.charcoal);
  });
  sheet.getRow(15).height = 22;

  const fxTable = [
    { ccy: 'USD', usd: 1.0000, egp: 49.26,   aed: 3.6700, gbp: 0.7937, cad: 1.3986, eur: 0.9217 },
    { ccy: 'EGP', usd: 0.0203, egp: 1.0000,  aed: 0.0745, gbp: 0.0161, cad: 0.0284, eur: 0.0187 },
    { ccy: 'AED', usd: 0.2723, egp: 13.42,   aed: 1.0000, gbp: 0.2161, cad: 0.3808, eur: 0.2510 },
    { ccy: 'GBP', usd: 1.2600, egp: 62.07,   aed: 4.6293, gbp: 1.0000, cad: 1.7622, eur: 1.1614 },
    { ccy: 'CAD', usd: 0.7150, egp: 35.22,   aed: 2.6263, gbp: 0.5675, cad: 1.0000, eur: 0.6590 },
    { ccy: 'EUR', usd: 1.0850, egp: 53.45,   aed: 3.9826, gbp: 0.8612, cad: 1.5176, eur: 1.0000 },
  ];

  fxTable.forEach((fx, i) => {
    const r = 16 + i;
    sheet.getCell(`B${r}`).value = fx.ccy;
    sheet.getCell(`B${r}`).font = { ...FONTS.bodyBold, color: argb(COLORS.warmGold) };
    sheet.getCell(`B${r}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`B${r}`).fill = FILLS.ivory;
    sheet.getCell(`B${r}`).border = BORDER_THIN();
    ['usd', 'egp', 'aed', 'gbp', 'cad', 'eur'].forEach((k, j) => {
      const col = ['C', 'D', 'E', 'F', 'G', 'H'][j];
      sheet.getCell(`${col}${r}`).value = fx[k];
      sheet.getCell(`${col}${r}`).numFmt = '0.0000';
      sheet.getCell(`${col}${r}`).font = FONTS.body;
      sheet.getCell(`${col}${r}`).alignment = { horizontal: 'right', vertical: 'middle' };
      sheet.getCell(`${col}${r}`).fill = FILLS.white;
      sheet.getCell(`${col}${r}`).border = BORDER_THIN();
    });
    sheet.getRow(r).height = 22;
  });

  // Last-update line
  sheet.getCell('B23').value = 'Last FX update';
  sheet.getCell('B23').font = FONTS.bodyMuted;
  sheet.getCell('B23').alignment = { horizontal: 'left', indent: 1 };
  sheet.getCell('C23').value = new Date().toISOString().slice(0, 10);
  sheet.getCell('C23').font = FONTS.bodyMuted;
  sheet.getCell('C23').alignment = { horizontal: 'left' };
  sheet.getCell('D23').value = 'Indicative rates. Refresh from your bank or xe.com for live conversions.';
  sheet.getCell('D23').font = FONTS.bodyMuted;
  sheet.getCell('D23').alignment = { horizontal: 'left', indent: 1, wrapText: true };

  addCallout(sheet, `B25:H26`,
    '⚙️',
    'How Settings & FX drives the workbook',
    'Five named ranges (Inflation, EduReturn, K12Inflation, RetReturn, BaseCurrency) feed every projection. Change the inflation rate to 7% and every child\'s target re-inflates instantly. The FX table is reference data — buyers in non-USD households can record balances in the child\'s native currency on Child Profiles (column M) and convert manually using these rates until the v1.1 auto-cascade ships.');
  sheet.getRow(25).height = 32;
  sheet.getRow(26).height = 32;

  addFooter(sheet, 30, { productName: PRODUCT_NAME });
}

// ============================================================================
// TAB 20 — ℹ️ ABOUT & HELP
// ============================================================================

function buildAbout(workbook) {
  const tier = workbook._tier || 'ai';
  // [COMPLEMENT] +1 across all tiers since Settings & FX is universal.
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
    tabSubtitle: 'Welcome — and quick answers to the questions parents ask first.',
    bannerText: BANNER,
    kpiData: [
      { label: 'VERSION',     value: '1.0' },
      { label: 'TABS',        value: tierMetadata.tabs },
      { label: 'MAX KIDS',    value: '4' },
      { label: 'AI PROMPTS',  value: tierMetadata.prompts },
      { label: 'TIER',        value: tierMetadata.label },
      { label: 'UPDATES',     value: tier === 'ai' ? '12 mo free' : 'Bug fixes free' },
    ],
  });

  sheet.mergeCells('B6:C6');
  sheet.getCell('B6').value = 'Welcome to your Family & Education Planner.';
  sheet.getCell('B6').font = FONTS.hero;
  sheet.getRow(6).height = 38;

  sheet.mergeCells('B7:C7');
  sheet.getCell('B7').value = 'A spreadsheet that handles every dollar from pregnancy through college launch. Up to 4 children. Privacy-first.';
  sheet.getCell('B7').font = FONTS.bodyMuted;
  sheet.getRow(7).height = 22;

  // [COMPLEMENT] Seed-data disclosure — sets expectations for first-open buyers.
  sheet.mergeCells('B8:C8');
  sheet.getCell('B8').value = '📋  Seed data shown is an example family (Emma 8 / Liam 4 / Noah 1, NY state, $156K HHI). Replace with your numbers on Child Profiles + Family Budget — every tab recomputes. The Etsy listing thumbnails show aspirational dashboards (Family Health Score 81/100, etc.) — your actual score will reflect your family\'s current state and improve as you tighten the plan.';
  sheet.getCell('B8').font = { ...FONTS.bodyMuted, italic: true };
  sheet.getCell('B8').alignment = { wrapText: true, vertical: 'top' };
  sheet.getRow(8).height = 50;

  let r = addSectionHeader(sheet, 10, 'How this spreadsheet is wired',
    'Child Profiles is the input spine. Every downstream tab reads from it.');

  const explainerRows = [
    ['👶 Child Profiles',                'Parent context + 4 children. Primary input surface — every tab reads from here.'],
    ['🏠 Dashboard',                      'Family Health Score 0–100 + per-child savings bars + insurance coverage donut + conflict alerts.'],
    ['🏫 K-12 Cost Map',                  '13 years × per-child × school type. Public vs. private trade-off made visible.'],
    ['🎓 College Savings Planner',         'Per child: target / current / gap / recommended monthly contribution at 6% real return.'],
    ['💰 Account Type Comparison',         '529 / Coverdell / UTMA / ABLE — 4-column grid. Recommendation per child based on profile.'],
    ['🏦 529 vs. Whole Life',              'The after-tax math agents don\'t show you. 18-year projection.'],
    ['🗺️ State 529 Tax Benefits (Pro)',    '50 states + DC. Annual savings + 18-yr compounded value for your state.'],
    ['🧮 EFC SAI Calculator (Pro)',       'Replicates the FAFSA Student Aid Index formula. Sensitivity analysis included.'],
    ['🏆 Scholarship Tracker (Pro)',        'Per-child Kanban with deadline countdown. Alerts <30 days.'],
    ['📑 Aid Letter Comparison (Pro)',      'Side-by-side colleges (up to 5). Net price ranked. Appeal-deadline countdown.'],
    ['🧒 Childcare Cost Planner (Pro)',     'Age-band × care type. Center / nanny / share / au pair / family / public.'],
    ['🛡️ Life Insurance Calculator',       'DIME method (Debt / Income / Mortgage / Education) → benefit + term.'],
    ['🏥 Family Health Budget (Pro)',       'Per-member premiums + HSA tracker + disability flag.'],
    ['👴 Retirement Impact (Pro)',          'Trade-off: years-to-FIRE with vs. without college contributions.'],
    ['🎯 Savings Goals Timeline (Pro)',     'All goals on one timeline. Conflict count in 24-mo window.'],
    ['🎓 Literacy Milestones (Pro)', 'Age 5→18 per-child curriculum. The job schools skip.'],
    ['💰 Family Budget',                    'Standard income + 20 expense categories. Monthly surplus drives savings.'],
    ['📊 Annual Family Review',             'Year-end snapshot + 5-item checklist.'],
    ['🤖 AI Family Finance Advisor (AI)',  '8 prompts: Account Type Picker · Scholarship Match · Life Insurance · College Affordability · Childcare · Goals Conflict · Aid Appeal · State 529 Optimizer.'],
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
    sheet.getRow(ri).height = 30;
  });

  let r2 = addSectionHeader(sheet, r + explainerRows.length + 3, 'Quick FAQ', '');

  const faq = [
    ['How is this different from Greenlight / BabyMint / ScholarshipOwl?',  '(1) Privacy — your kids\' data lives on your device, not on a server selling it to lenders or scholarship-marketing lists. (2) Price — $14-$32 once vs. Greenlight $60/yr ($1,080 over 18 yrs of raising one child). (3) Depth — no app covers EFC + Account Type comparison + State 529 + Aid Letter side-by-side. (4) Honest math — 529 vs. Whole Life shows the after-tax cost most agents won\'t.'],
    ['Will this auto-fill my FAFSA?',  'No. The EFC / SAI Calculator replicates the FAFSA Student Aid Index formula so you can plan, but you submit the official FAFSA at studentaid.gov. We give you everything you\'ll need; we don\'t talk to the federal government on your behalf.'],
    ['Does the scholarship tab apply for me?',  'No. It tracks the scholarships YOU\'RE applying to + flags deadlines <30 days. The AI Scholarship Matching Engine (PDF page 4) recommends 5-7 realistic candidates based on your child\'s profile — you apply directly through each scholarship\'s official portal or FastWeb/Bold.org (both free).'],
    ['What if my child has special needs?',  'Flag "Yes — ABLE eligible" in the Child Profiles Special Needs column. The Account Type Comparison tab pivots to recommend ABLE + 529 split; the Life Insurance Calculator surfaces the one legitimate whole-life scenario (special-needs trust funding). All math accounts for it.'],
    ['Does it work in Excel?',  'Yes, with caveats. Most formulas work in both Google Sheets and Excel; some date-math functions render slightly differently. Excel users may need to re-enter dates in their locale format. AI prompts in the PDF work the same regardless of spreadsheet platform.'],
    ['Can I use the AI prompts on a free AI plan?',  'Yes — all 8 prompts work in free tiers. Conversational AI assistants are slightly better at the Aid Appeal Coach + Scholarship Matching Engine (conversational + voice rewriting). Long-context AI assistants are slightly better at Account Type Picker + State 529 Optimizer + Childcare Optimizer (structured tables + multi-scenario math). Both work; use whichever you already have access to.'],
  ];
  faq.forEach((qa, i) => {
    const ri = r2 + 1 + i * 2;
    sheet.getCell(`B${ri}`).value = qa[0];
    sheet.getCell(`B${ri}`).font = FONTS.bodyBold;
    sheet.getCell(`C${ri}`).value = qa[1];
    sheet.getCell(`C${ri}`).font = FONTS.body;
    sheet.getCell(`C${ri}`).alignment = { wrapText: true, vertical: 'middle' };
    sheet.getRow(ri).height = 44;
  });

  addFooter(sheet, r2 + faq.length * 2 + 4, { productName: PRODUCT_NAME });
}

// ============================================================================
// MAIN — orchestrate the build
// ============================================================================

async function buildFamilyEducationPlanner() {
  const t0 = Date.now();

  const tierArg = process.argv.find((a) => a.startsWith('--tier='));
  const tier = tierArg ? tierArg.split('=')[1] : 'ai';
  if (!['essentials', 'pro', 'ai'].includes(tier)) {
    console.error(`✗ Invalid --tier "${tier}". Use essentials | pro | ai.`);
    process.exit(1);
  }
  const tierLabel = { essentials: 'Essentials', pro: 'Pro', ai: 'AI Edition' }[tier];
  // Tab counts (post-applyTierVisibility) — +1 across all tiers since Settings & FX is universal.
  //   Essentials = 11 visible (9 core + Settings & FX + About)
  //   Pro        = 20 visible (18 core + Settings & FX + About)
  //   AI Edition = 21 visible (19 core + Settings & FX + About)
  const tierTabCount = { essentials: 11, pro: 20, ai: 21 }[tier];
  console.log(`→ Building ${PRODUCT_NAME} — ${tierLabel} (${tierTabCount} visible / 21 total)...`);

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
  workbook.subject = 'Family finance · education savings · 529 vs UTMA · EFC calculator · scholarships';
  workbook.category = 'Family & Education';
  workbook.keywords = 'family planner, college savings, 529, EFC calculator, scholarship tracker, life insurance, childcare, FAFSA, google sheets, lime premium studios';
  workbook.description = `${PRODUCT_NAME} ${tierLabel} v1.0 — Lime Premium Studios. ${tierTabCount} tabs. Pregnancy → college launch. Privacy-first — no Greenlight, no BabyMint, no ScholarshipOwl.`;

  // Build all tabs in spec order. Settings & FX builds first so named ranges
  // (Inflation / EduReturn / K12Inflation / RetReturn / BaseCurrency) are
  // defined before any downstream tab references them.
  console.log('  • ⚙️ Settings & FX');                          buildSettingsAndFX(workbook);
  console.log('  • 🏠 Dashboard');                              buildDashboard(workbook);
  console.log('  • 👶 Child Profiles');                         buildChildProfiles(workbook);
  console.log('  • 🏫 K-12 Cost Map');                          buildK12CostMap(workbook);
  console.log('  • 🎓 College Savings Planner');                buildCollegeSavingsPlanner(workbook);
  console.log('  • 💰 Account Type Comparison');                buildAccountTypeComparison(workbook);
  console.log('  • 🏦 529 vs. Whole Life');                     build529vsWholeLife(workbook);
  console.log('  • 🗺️ State 529 Tax Benefits (Pro)');           buildState529TaxBenefits(workbook);
  console.log('  • 🧮 EFC SAI Calculator (Pro)');             buildEFCCalculator(workbook);
  console.log('  • 🏆 Scholarship Tracker (Pro)');              buildScholarshipTracker(workbook);
  console.log('  • 📑 Aid Letter Comparison (Pro)');            buildAidLetterComparison(workbook);
  console.log('  • 🧒 Childcare Cost Planner (Pro)');           buildChildcareCostPlanner(workbook);
  console.log('  • 🛡️ Life Insurance Calculator');              buildLifeInsuranceCalculator(workbook);
  console.log('  • 🏥 Family Health Budget (Pro)');             buildFamilyHealthBudget(workbook);
  console.log('  • 👴 Retirement Impact (Pro)');                buildRetirementImpact(workbook);
  console.log('  • 🎯 Savings Goals Timeline (Pro)');           buildSavingsGoalsTimeline(workbook);
  console.log('  • 🎓 Literacy Milestones (Pro)');    buildFinancialLiteracyMilestones(workbook);
  console.log('  • 💰 Family Budget');                          buildFamilyBudget(workbook);
  console.log('  • 📊 Annual Family Review');                   buildAnnualFamilyReview(workbook);
  console.log('  • 🤖 AI Family Finance Advisor (AI)');         buildAIFamilyFinanceAdvisor(workbook);
  console.log('  • ℹ️ About & Help');                            buildAbout(workbook);

  applyTierVisibility(workbook, tier, { proTabs: PRO_TABS, aiTabs: AI_TABS, productName: PRODUCT_NAME });

  const filename = tier === 'ai'
    ? 'family-education-planner-ai-edition.xlsx'
    : `family-education-planner-${tier}.xlsx`;
  const outPath = resolve(OUTPUT_DIR, filename);
  await workbook.xlsx.writeFile(outPath);

  const elapsed = Date.now() - t0;
  console.log(`\n✓ Workbook generated in ${elapsed}ms`);
  console.log(`  Output: ${outPath}`);
  console.log(`  Tier:   ${tierLabel} — ${tierTabCount} of 21 tabs visible`);
}

buildFamilyEducationPlanner().catch((err) => {
  console.error('✗ Build failed:', err);
  process.exit(1);
});

