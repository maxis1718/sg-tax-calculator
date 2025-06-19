/**
 * 新加坡個人所得稅計算器
 * 基於 IRAS 官方稅率表 (YA 2025)
 * 來源: https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/individual-income-tax-rates
 */

import { calculateCPF, getCPFSummary, type CPFResult, type CPFSummary } from './cpfCalculator';

// 稅率階梯結構
interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  baseAmount: number; // 累計稅額
}

// 新加坡個人所得稅階梯稅率 (YA 2025)
const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 20000, rate: 0, baseAmount: 0 },
  { min: 20000, max: 30000, rate: 0.02, baseAmount: 0 },
  { min: 30000, max: 40000, rate: 0.035, baseAmount: 200 },
  { min: 40000, max: 80000, rate: 0.07, baseAmount: 550 },
  { min: 80000, max: 120000, rate: 0.115, baseAmount: 3350 },
  { min: 120000, max: 160000, rate: 0.15, baseAmount: 7950 },
  { min: 160000, max: 200000, rate: 0.18, baseAmount: 13950 },
  { min: 200000, max: 240000, rate: 0.19, baseAmount: 21150 },
  { min: 240000, max: 280000, rate: 0.195, baseAmount: 28750 },
  { min: 280000, max: 320000, rate: 0.20, baseAmount: 36550 },
  { min: 320000, max: 500000, rate: 0.22, baseAmount: 44550 },
  { min: 500000, max: 1000000, rate: 0.23, baseAmount: 84150 },
  { min: 1000000, max: Infinity, rate: 0.24, baseAmount: 199150 }
];

// Personal Income Tax Rebate (YA 2025)
const REBATE_RATE = 0.6; // 60%
const REBATE_CAP = 200; // 最高 $200

/**
 * 計算個人所得稅
 * @param annualIncome 年收入
 * @returns 應繳稅額
 */
export function calculateIncomeTax(annualIncome: number): number {
  if (annualIncome <= 0) return 0;

  // 找到適用的稅率階梯
  for (const bracket of TAX_BRACKETS) {
    if (annualIncome <= bracket.max) {
      const taxableIncome = annualIncome - bracket.min;
      const tax = bracket.baseAmount + (taxableIncome * bracket.rate);
      return Math.max(0, tax);
    }
  }

  // 超過最高階梯的情況
  const highestBracket = TAX_BRACKETS[TAX_BRACKETS.length - 1];
  const taxableIncome = annualIncome - highestBracket.min;
  const tax = highestBracket.baseAmount + (taxableIncome * highestBracket.rate);
  return Math.max(0, tax);
}

/**
 * 計算 Personal Income Tax Rebate
 * @param taxAmount 應繳稅額
 * @returns 退稅金額
 */
export function calculateTaxRebate(taxAmount: number): number {
  if (taxAmount <= 0) return 0;
  return Math.min(taxAmount * REBATE_RATE, REBATE_CAP);
}

/**
 * 計算淨應繳稅額 (扣除退稅後)
 * @param annualIncome 年收入
 * @returns 淨應繳稅額
 */
export function calculateNetTax(annualIncome: number): number {
  const grossTax = calculateIncomeTax(annualIncome);
  const rebate = calculateTaxRebate(grossTax);
  return Math.max(0, grossTax - rebate);
}

/**
 * 計算稅後收入 (只考慮所得稅)
 * @param annualIncome 年收入
 * @returns 稅後收入
 */
export function calculateAfterTaxIncome(annualIncome: number): number {
  const netTax = calculateNetTax(annualIncome);
  return Math.max(0, annualIncome - netTax);
}

/**
 * 計算平均稅率
 * @param annualIncome 年收入
 * @returns 平均稅率 (百分比)
 */
export function calculateAverageTaxRate(annualIncome: number): number {
  if (annualIncome <= 0) return 0;
  const netTax = calculateNetTax(annualIncome);
  return (netTax / annualIncome) * 100;
}

/**
 * 計算邊際稅率
 * @param annualIncome 年收入
 * @returns 邊際稅率 (百分比)
 */
export function calculateMarginalTaxRate(annualIncome: number): number {
  if (annualIncome <= 0) return 0;

  for (const bracket of TAX_BRACKETS) {
    if (annualIncome <= bracket.max) {
      return bracket.rate * 100;
    }
  }

  // 超過最高階梯
  return TAX_BRACKETS[TAX_BRACKETS.length - 1].rate * 100;
}

/**
 * 獲取稅務計算摘要 (不含CPF)
 * @param annualIncome 年收入
 * @returns 稅務計算摘要
 */
export interface TaxSummary {
  annualIncome: number;
  grossTax: number;
  rebate: number;
  netTax: number;
  afterTaxIncome: number;
  averageTaxRate: number;
  marginalTaxRate: number;
}

export function getTaxSummary(annualIncome: number): TaxSummary {
  const grossTax = calculateIncomeTax(annualIncome);
  const rebate = calculateTaxRebate(grossTax);
  const netTax = calculateNetTax(annualIncome);
  const afterTaxIncome = calculateAfterTaxIncome(annualIncome);
  const averageTaxRate = calculateAverageTaxRate(annualIncome);
  const marginalTaxRate = calculateMarginalTaxRate(annualIncome);

  return {
    annualIncome,
    grossTax,
    rebate,
    netTax,
    afterTaxIncome,
    averageTaxRate,
    marginalTaxRate
  };
}

// ===============================================
// 整合 TAX + CPF 計算
// ===============================================

/**
 * 綜合財務摘要 (稅務 + CPF)
 */
export interface ComprehensiveSummary {
  // 輸入
  annualIncome: number;
  
  // 稅務相關
  tax: {
    grossTax: number;
    rebate: number;
    netTax: number;
    averageTaxRate: number;
    marginalTaxRate: number;
  };
  
  // CPF 相關
  cpf: CPFSummary;
  
  // 最終結果
  finalTakeHome: number; // 扣除稅和CPF員工貢獻後的實收
  totalDeductions: number; // 總扣除額 (稅 + CPF員工貢獻)
  effectiveTakeHomeRate: number; // 實收比例
}

/**
 * 獲取完整的財務摘要 (稅務 + CPF)
 * @param annualIncome 年收入
 * @returns 綜合財務摘要
 */
export function getComprehensiveSummary(annualIncome: number): ComprehensiveSummary {
  const taxSummary = getTaxSummary(annualIncome);
  const cpfSummary = getCPFSummary(annualIncome);
  
  // 計算最終實收 (扣除稅和CPF員工貢獻)
  const finalTakeHome = annualIncome - taxSummary.netTax - cpfSummary.employeeContribution;
  const totalDeductions = taxSummary.netTax + cpfSummary.employeeContribution;
  const effectiveTakeHomeRate = annualIncome > 0 ? (finalTakeHome / annualIncome) * 100 : 0;

  return {
    annualIncome,
    tax: {
      grossTax: taxSummary.grossTax,
      rebate: taxSummary.rebate,
      netTax: taxSummary.netTax,
      averageTaxRate: taxSummary.averageTaxRate,
      marginalTaxRate: taxSummary.marginalTaxRate,
    },
    cpf: cpfSummary,
    finalTakeHome: Math.round(finalTakeHome),
    totalDeductions: Math.round(totalDeductions),
    effectiveTakeHomeRate: Number(effectiveTakeHomeRate.toFixed(1))
  };
} 