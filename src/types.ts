export type RiskLevel = 'high' | 'medium' | 'low' | 'safe';

export interface RiskItem {
  id: string;
  category: string;
  title: string;
  description: string;
  level: RiskLevel;
  detail: string;
  suggestion: string;
  relatedPolicy?: string;
  value?: number;
  threshold?: number;
}

export interface FinancialData {
  companyName: string;
  industry: string;
  period: string;
  revenue: number;
  cost: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  taxPaid: number;
  vatOutput: number;
  vatInput: number;
  invoiceCount: number;
  entertainmentExpense: number;
  travelExpense: number;
  consultingFee: number;
  cashTransaction: number;
  accountsReceivable: number;
  inventory: number;
  totalAssets: number;
  employeeCount: number;
  socialInsuranceCount: number;
}

export interface AnalysisReport {
  id: string;
  date: string;
  companyName: string;
  overallScore: number;
  overallLevel: RiskLevel;
  risks: RiskItem[];
  summary: string;
  aiThinking: ThinkingStep[];
}

export interface ThinkingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'done';
  result?: string;
  duration?: number;
}

export interface MonitorConfig {
  enabled: boolean;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  wechatBound: boolean;
  lastCheck?: string;
  nextCheck?: string;
}

export type AppPage = 'home' | 'upload' | 'analyzing' | 'report' | 'monitor' | 'history';
