import { useState, useEffect, useRef } from 'react';
import { Brain, CheckCircle2, Loader2, Shield } from 'lucide-react';
import type { ThinkingStep, AppPage, FinancialData, AnalysisReport } from '../types';
import { analyzeFinancialData, calculateOverallScore, getOverallLevel, generateSummary } from '../engine/taxRules';

interface AnalyzingPageProps {
  financialData: FinancialData | null;
  onNavigate: (page: AppPage) => void;
  onReportReady: (report: AnalysisReport) => void;
}

const THINKING_STEPS: Omit<ThinkingStep, 'status'>[] = [
  { id: 's1', title: '数据完整性校验', description: '检查财务数据的完整性和逻辑一致性...' },
  { id: 's2', title: '增值税税负率分析', description: '对比行业基准税负率，评估偏离程度...' },
  { id: 's3', title: '进销项发票匹配', description: '分析进项与销项的配比关系，识别异常抵扣...' },
  { id: 's4', title: '毛利率与利润分析', description: '评估毛利率是否偏离行业均值，检查利润合理性...' },
  { id: 's5', title: '高风险费用科目扫描', description: '逐项检查招待费、咨询费等高风险科目...' },
  { id: 's6', title: '资金流向分析', description: '评估现金交易占比，核查资金流转合规性...' },
  { id: 's7', title: '用工与社保匹配', description: '比对员工人数与社保缴纳人数的一致性...' },
  { id: 's8', title: '资产结构分析', description: '检查应收账款、存货等资产科目异常...' },
  { id: 's9', title: '交叉验证与综合研判', description: '多维度数据交叉印证，深度推理风险关联...' },
  { id: 's10', title: '生成风险评估报告', description: '汇总分析结果，生成整改建议和评分...' },
];

export default function AnalyzingPage({ financialData, onNavigate, onReportReady }: AnalyzingPageProps) {
  const [steps, setSteps] = useState<ThinkingStep[]>(
    THINKING_STEPS.map(s => ({ ...s, status: 'pending' }))
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [thinkingText, setThinkingText] = useState('');
  const hasCompleted = useRef(false);

  const thinkingTexts: Record<string, string[]> = {
    s1: [
      '正在验证数据完整性...',
      '营业收入与成本数据已确认',
      '增值税进销项数据完整',
      '数据校验通过，开始深度分析',
    ],
    s2: [
      '获取行业基准税负率数据...',
      `当前企业税负率: ${financialData ? ((financialData.taxPaid / financialData.revenue) * 100).toFixed(2) : '0'}%`,
      '正在与行业均值进行比对...',
      '税负率偏离度计算完成',
    ],
    s3: [
      '分析进项税额与销项税额的配比...',
      `进销项比: ${financialData ? ((financialData.vatInput / financialData.vatOutput) * 100).toFixed(1) : '0'}%`,
      '检查是否存在异常抵扣模式...',
      '进销项匹配分析完成',
    ],
    s4: [
      '计算毛利率...',
      `当前毛利率: ${financialData ? ((financialData.grossProfit / financialData.revenue) * 100).toFixed(1) : '0'}%`,
      '对比行业毛利率基准区间...',
      '利润合理性评估完成',
    ],
    s5: [
      '扫描业务招待费占比...',
      '检查咨询服务费金额及合理性...',
      '评估差旅费结构...',
      '高风险科目扫描完成',
    ],
    s6: [
      '分析现金交易占总收入比例...',
      `现金交易占比: ${financialData ? ((financialData.cashTransaction / financialData.revenue) * 100).toFixed(0) : '0'}%`,
      '评估资金流转的合规性...',
      '资金风险分析完成',
    ],
    s7: [
      `员工人数: ${financialData?.employeeCount || 0}人`,
      `社保缴纳人数: ${financialData?.socialInsuranceCount || 0}人`,
      '比对社保覆盖率...',
      '用工合规性评估完成',
    ],
    s8: [
      '分析应收账款周转情况...',
      '评估存货周转率...',
      '检查资产结构合理性...',
      '资产分析完成',
    ],
    s9: [
      '进行多维度交叉验证...',
      '关联分析税负率与毛利率的一致性...',
      '综合研判各项指标的风险关联度...',
      '深度推理完成，正在汇总结果',
    ],
    s10: [
      '汇总所有风险点...',
      '生成整改建议...',
      '计算综合风险评分...',
      '报告生成完成！',
    ],
  };

  useEffect(() => {
    if (currentStep >= THINKING_STEPS.length) return;

    const stepId = THINKING_STEPS[currentStep].id;
    const texts = thinkingTexts[stepId] || [];
    let textIndex = 0;

    setSteps(prev => prev.map((s, i) =>
      i === currentStep ? { ...s, status: 'running' } : s
    ));

    const textInterval = setInterval(() => {
      if (textIndex < texts.length) {
        setThinkingText(texts[textIndex]);
        textIndex++;
      }
    }, 400);

    const stepDuration = 800 + Math.random() * 600;
    const timer = setTimeout(() => {
      clearInterval(textInterval);
      setSteps(prev => prev.map((s, i) =>
        i === currentStep ? { ...s, status: 'done', duration: stepDuration } : s
      ));
      setProgress(((currentStep + 1) / THINKING_STEPS.length) * 100);
      setCurrentStep(prev => prev + 1);
    }, stepDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(textInterval);
    };
  }, [currentStep]);

  useEffect(() => {
    if (currentStep >= THINKING_STEPS.length && financialData && !hasCompleted.current) {
      hasCompleted.current = true;
      const risks = analyzeFinancialData(financialData);
      const score = calculateOverallScore(risks);
      const level = getOverallLevel(score);
      const summary = generateSummary(risks, score);

      const report: AnalysisReport = {
        id: `RPT-${Date.now()}`,
        date: new Date().toLocaleString('zh-CN'),
        companyName: financialData.companyName,
        overallScore: score,
        overallLevel: level,
        risks,
        summary,
        aiThinking: steps.map(s => ({ ...s, status: 'done' as const })),
      };

      setTimeout(() => {
        onReportReady(report);
        onNavigate('report');
      }, 1000);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4 animate-pulse-ring">
            <Brain size={32} className="text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">AI 深度分析中</h1>
          <p className="text-primary-300">
            {financialData?.companyName || '企业'} · {financialData?.period || ''}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/10 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-400 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Thinking Steps */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                step.status === 'running'
                  ? 'bg-primary-500/10 border border-primary-500/20'
                  : step.status === 'done'
                  ? 'opacity-60'
                  : 'opacity-30'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {step.status === 'running' ? (
                  <Loader2 size={18} className="text-primary-400 animate-spin" />
                ) : step.status === 'done' ? (
                  <CheckCircle2 size={18} className="text-green-400" />
                ) : (
                  <div className="w-[18px] h-[18px] rounded-full border border-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{step.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{step.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Thinking Text */}
        <div className="mt-6 bg-black/30 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-primary-400" />
            <span className="text-xs text-primary-400 font-medium">AI 思考过程</span>
          </div>
          <p className="text-sm text-gray-300 font-mono">
            {thinkingText || '初始化分析引擎...'}
            <span className="inline-block w-1.5 h-4 bg-primary-400 ml-1 animate-pulse" />
          </p>
        </div>
      </div>
    </div>
  );
}
