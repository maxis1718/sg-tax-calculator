/**
 * 新加坡 CPF 計算器
 * 基於 CPF Board 官方規定 (2025年)
 * 來源: https://www.cpf.gov.sg/employer/employer-obligations/how-much-cpf-contributions-to-pay
 */

// CPF 常數 (2025年)
const CPF_CONSTANTS = {
  // 工資上限
  OW_MONTHLY_CEILING: 7400, // 普通工資月度上限
  ANNUAL_SALARY_CEILING: 102000, // 年度薪資總上限 (OW + AW)
  
  // 貢獻率 (55歲以下，新加坡公民/3年以上PR)
  EMPLOYER_RATE: 0.17, // 17%
  EMPLOYEE_RATE: 0.20, // 20%
  TOTAL_RATE: 0.37, // 37%
  
  // 最低工資門檻
  MIN_WAGE_THRESHOLD: 750, // 月薪超過$750才需要貢獻CPF
} as const;

// CPF 計算結果介面
export interface CPFResult {
  // 基本計算
  totalCPFContribution: number; // 總CPF貢獻
  employeeContribution: number; // 員工貢獻 (20%)
  employerContribution: number; // 雇主貢獻 (17%)
  
  // 詳細資訊
  cpfSubjectIncome: number; // 需要貢獻CPF的收入
  exemptIncome: number; // 免CPF的收入
  
  // 計算方式說明
  calculationMethod: 'simple' | 'advanced';
  assumptions?: string[];
}

// 進階計算選項 (V2 預留)
export interface AdvancedCPFOptions {
  monthlySalary?: number;
  yearEndBonus?: number;
  employmentMonths?: number;
  salaryChanges?: Array<{
    month: number;
    newSalary: number;
  }>;
}

/**
 * 簡化版 CPF 計算 (基於年收入估算)
 * @param annualIncome 年收入總額 (包含薪資+獎金)
 * @returns CPF計算結果
 */
export function calculateCPF(annualIncome: number): CPFResult {
  if (annualIncome <= 0) {
    return createEmptyCPFResult();
  }

  // 估算月薪 (假設80%是固定月薪，20%是獎金)
  const estimatedMonthlySalary = (annualIncome * 0.8) / 12;
  // const estimatedBonus = annualIncome * 0.2;

  // 判斷計算方式
  if (estimatedMonthlySalary <= CPF_CONSTANTS.OW_MONTHLY_CEILING) {
    return calculateSimpleCPF(annualIncome);
  } else {
    return calculateCeilingCPF(annualIncome, estimatedMonthlySalary);
  }
}

/**
 * 簡單計算：月薪未超過ceiling的情況
 */
function calculateSimpleCPF(annualIncome: number): CPFResult {
  // 檢查是否超過年度上限
  const cpfSubjectIncome = Math.min(annualIncome, CPF_CONSTANTS.ANNUAL_SALARY_CEILING);
  const exemptIncome = Math.max(0, annualIncome - CPF_CONSTANTS.ANNUAL_SALARY_CEILING);

  // 計算CPF貢獻
  const totalCPFContribution = cpfSubjectIncome * CPF_CONSTANTS.TOTAL_RATE;
  const employeeContribution = cpfSubjectIncome * CPF_CONSTANTS.EMPLOYEE_RATE;
  const employerContribution = cpfSubjectIncome * CPF_CONSTANTS.EMPLOYER_RATE;

  return {
    totalCPFContribution: Math.round(totalCPFContribution),
    employeeContribution: Math.round(employeeContribution),
    employerContribution: Math.round(employerContribution),
    cpfSubjectIncome: Math.round(cpfSubjectIncome),
    exemptIncome: Math.round(exemptIncome),
    calculationMethod: 'simple',
    assumptions: [
      '假設全年在職',
      '基於平均月薪分布計算',
      '適用於55歲以下員工'
    ]
  };
}

/**
 * 複雜計算：月薪超過ceiling的情況
 */
function calculateCeilingCPF(
  annualIncome: number, 
  estimatedMonthlySalary: number
): CPFResult {
  // 計算年度OW (受月度ceiling限制)
  const annualOW = Math.min(
    estimatedMonthlySalary * 12, 
    CPF_CONSTANTS.OW_MONTHLY_CEILING * 12
  );

  // 計算AW ceiling
  const awCeiling = CPF_CONSTANTS.ANNUAL_SALARY_CEILING - annualOW;
  
  // 實際年收入中的AW部分
  const actualAW = annualIncome - annualOW;
  
  // 需要貢獻CPF的AW
  const cpfSubjectAW = Math.max(0, Math.min(actualAW, awCeiling));
  
  // 總計需要貢獻CPF的收入
  const cpfSubjectIncome = annualOW + cpfSubjectAW;
  const exemptIncome = annualIncome - cpfSubjectIncome;

  // 計算CPF貢獻
  const totalCPFContribution = cpfSubjectIncome * CPF_CONSTANTS.TOTAL_RATE;
  const employeeContribution = cpfSubjectIncome * CPF_CONSTANTS.EMPLOYEE_RATE;
  const employerContribution = cpfSubjectIncome * CPF_CONSTANTS.EMPLOYER_RATE;

  return {
    totalCPFContribution: Math.round(totalCPFContribution),
    employeeContribution: Math.round(employeeContribution),
    employerContribution: Math.round(employerContribution),
    cpfSubjectIncome: Math.round(cpfSubjectIncome),
    exemptIncome: Math.round(exemptIncome),
    calculationMethod: 'simple',
    assumptions: [
      '假設80%固定月薪，20%年終獎金',
      '假設全年在職',
      '適用於55歲以下員工',
      `月薪超過上限 $${CPF_CONSTANTS.OW_MONTHLY_CEILING.toLocaleString()}`
    ]
  };
}

/**
 * 創建空的CPF結果
 */
function createEmptyCPFResult(): CPFResult {
  return {
    totalCPFContribution: 0,
    employeeContribution: 0,
    employerContribution: 0,
    cpfSubjectIncome: 0,
    exemptIncome: 0,
    calculationMethod: 'simple',
    assumptions: []
  };
}

/**
 * 計算實際可支配收入 (扣除CPF員工貢獻)
 * @param annualIncome 年收入
 * @returns 扣除CPF後的可支配收入
 */
export function calculateTakeHomeBeforeTax(annualIncome: number): number {
  const cpfResult = calculateCPF(annualIncome);
  return annualIncome - cpfResult.employeeContribution;
}

/**
 * 獲取CPF貢獻摘要
 * @param annualIncome 年收入
 * @returns CPF摘要資訊
 */
export interface CPFSummary extends CPFResult {
  monthlyBreakdown: {
    employeeContribution: number;
    employerContribution: number;
    totalContribution: number;
  };
}

export function getCPFSummary(annualIncome: number): CPFSummary {
  const cpfResult = calculateCPF(annualIncome);
  
  return {
    ...cpfResult,
    monthlyBreakdown: {
      employeeContribution: Math.round(cpfResult.employeeContribution / 12),
      employerContribution: Math.round(cpfResult.employerContribution / 12),
      totalContribution: Math.round(cpfResult.totalCPFContribution / 12),
    }
  };
}

// ===============================================
// V2 進階版預留介面 (未來實作)
// ===============================================

/**
 * 進階CPF計算 (V2 功能，預留)
 * @param options 詳細工資資訊
 * @returns 精確的CPF計算結果
 */
// export function calculateAdvancedCPF(options: AdvancedCPFOptions): CPFResult {
//   // TODO: V2 實作
//   // 支援詳細的月薪/獎金分布計算
//   // 支援年中工作變動
//   // 支援跨年齡段計算 (55歲邊界)
  
//   throw new Error('進階CPF計算功能將在V2版本提供');
// }

/**
 * 檢查是否需要使用進階計算
 * @param annualIncome 年收入
 * @returns 是否建議使用進階計算
 */
export function shouldUseAdvancedCalculation(annualIncome: number): boolean {
  const estimatedMonthlySalary = (annualIncome * 0.8) / 12;
  
  // 月薪接近或超過ceiling時，建議使用進階計算
  return estimatedMonthlySalary > CPF_CONSTANTS.OW_MONTHLY_CEILING * 0.9;
} 