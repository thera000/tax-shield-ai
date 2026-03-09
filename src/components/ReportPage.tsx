import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  FileDown,
  RefreshCw,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { AnalysisReport, RiskItem, RiskLevel, AppPage } from '../types';

interface ReportPageProps {
  report: AnalysisReport | null;
  onNavigate: (page: AppPage) => void;
}

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  high: {
    label: '高风险',
    color: 'text-risk-high',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <AlertTriangle size={18} className="text-risk-high" />,
  },
  medium: {
    label: '中风险',
    color: 'text-risk-medium',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: <AlertCircle size={18} className="text-risk-medium" />,
  },
  low: {
    label: '低风险',
    color: 'text-risk-low',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: <Info size={18} className="text-risk-low" />,
  },
  safe: {
    label: '正常',
    color: 'text-risk-safe',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    icon: <CheckCircle2 size={18} className="text-risk-safe" />,
  },
};

function ScoreGauge({ score, level }: { score: number; level: RiskLevel }) {
  const colorMap: Record<RiskLevel, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e',
    safe: '#06b6d4',
  };
  const color = colorMap[level];

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (score / 100) * circumference * 0.75;
  const labelMap: Record<RiskLevel, string> = {
    high: '高风险',
    medium: '需关注',
    low: '较安全',
    safe: '健康',
  };

  return (
    <div className="relative w-52 h-52 mx-auto">
      <svg className="w-full h-full -rotate-135" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={circumference * 0.25} strokeLinecap="round" />
        <circle cx="100" cy="100" r="80" fill="none" stroke={color} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-sm text-gray-500 mt-1">{labelMap[level]}</span>
      </div>
    </div>
  );
}

function RiskCard({ risk }: { risk: RiskItem }) {
  const [expanded, setExpanded] = useState(risk.level === 'high');
  const config = RISK_CONFIG[risk.level];

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden transition-all`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left cursor-pointer"
      >
        <div className="shrink-0 mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              risk.level === 'high' ? 'bg-red-100 text-red-700' :
              risk.level === 'medium' ? 'bg-amber-100 text-amber-700' :
              risk.level === 'low' ? 'bg-green-100 text-green-700' :
              'bg-cyan-100 text-cyan-700'
            }`}>
              {config.label}
            </span>
            <span className="text-xs text-gray-400">{risk.category}</span>
          </div>
          <h3 className="font-semibold text-gray-900">{risk.title}</h3>
          <p className="text-sm text-gray-600 mt-0.5">{risk.description}</p>
        </div>
        <div className="shrink-0 text-gray-400">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/50">
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                <Info size={14} />
                详细分析
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{risk.detail}</p>
            </div>

            {risk.value !== undefined && risk.threshold !== undefined && (
              <div className="bg-white/60 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">当前值</span>
                  <span className={`font-semibold ${config.color}`}>
                    {typeof risk.value === 'number' ? risk.value.toFixed(1) : risk.value}
                    {risk.category.includes('率') || risk.category.includes('费用') || risk.category.includes('利润') ? '%' : ''}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (risk.value / Math.max(risk.threshold, 1)) * 100)}%`,
                      backgroundColor: risk.level === 'safe' ? '#06b6d4' : risk.level === 'low' ? '#22c55e' : risk.level === 'medium' ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>行业基准: {risk.threshold?.toFixed(1)}</span>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                <CheckCircle2 size={14} />
                整改建议
              </h4>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-white/60 rounded-lg p-3">
                {risk.suggestion}
              </div>
            </div>

            {risk.relatedPolicy && (
              <div className="text-xs text-gray-400 flex items-start gap-1">
                <span className="shrink-0">📜</span>
                <span>相关法规：{risk.relatedPolicy}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportPage({ report, onNavigate }: ReportPageProps) {
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">暂无报告数据</p>
          <button
            onClick={() => onNavigate('upload')}
            className="text-primary-600 font-medium cursor-pointer"
          >
            去做一次自检
          </button>
        </div>
      </div>
    );
  }

  const highRisks = report.risks.filter(r => r.level === 'high');
  const mediumRisks = report.risks.filter(r => r.level === 'medium');
  const lowRisks = report.risks.filter(r => r.level === 'low');
  const safeItems = report.risks.filter(r => r.level === 'safe');

  const pieData = [
    { name: '高风险', value: highRisks.length, color: '#ef4444' },
    { name: '中风险', value: mediumRisks.length, color: '#f59e0b' },
    { name: '低风险', value: lowRisks.length, color: '#22c55e' },
    { name: '正常', value: safeItems.length, color: '#06b6d4' },
  ].filter(d => d.value > 0);

  const categoryData = report.risks.reduce<Record<string, { high: number; medium: number; low: number; safe: number }>>((acc, risk) => {
    if (!acc[risk.category]) acc[risk.category] = { high: 0, medium: 0, low: 0, safe: 0 };
    acc[risk.category][risk.level]++;
    return acc;
  }, {});

  const barData = Object.entries(categoryData).map(([name, counts]) => ({
    name,
    高风险: counts.high,
    中风险: counts.medium,
    低风险: counts.low,
    正常: counts.safe,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Report Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Shield size={14} />
                <span>税务风险体检报告</span>
                <span className="text-gray-300">|</span>
                <span>{report.date}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{report.companyName}</h1>
              <p className="text-sm text-gray-400 mt-1">报告编号：{report.id}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('upload')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <RefreshCw size={14} />
                重新检测
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors cursor-pointer">
                <FileDown size={14} />
                导出PDF
              </button>
            </div>
          </div>

          {/* Score & Summary */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <ScoreGauge score={report.overallScore} level={report.overallLevel} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">综合评估</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {report.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: '高风险', count: highRisks.length, color: 'bg-red-500', textColor: 'text-red-600' },
            { label: '中风险', count: mediumRisks.length, color: 'bg-amber-500', textColor: 'text-amber-600' },
            { label: '低风险', count: lowRisks.length, color: 'bg-green-500', textColor: 'text-green-600' },
            { label: '正常', count: safeItems.length, color: 'bg-cyan-500', textColor: 'text-cyan-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className={`inline-block w-2 h-2 rounded-full ${stat.color} mb-2`} />
              <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.count}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">风险分布</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.name} {d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">各维度风险</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="高风险" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="中风险" stackId="a" fill="#f59e0b" />
                <Bar dataKey="正常" stackId="a" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-500" />
            详细风险分析
          </h2>

          {highRisks.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                高风险项 ({highRisks.length})
              </h3>
              <div className="space-y-3">
                {highRisks.map(risk => <RiskCard key={risk.id} risk={risk} />)}
              </div>
            </div>
          )}

          {mediumRisks.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-amber-600 mb-3 flex items-center gap-1.5">
                <AlertCircle size={14} />
                中风险项 ({mediumRisks.length})
              </h3>
              <div className="space-y-3">
                {mediumRisks.map(risk => <RiskCard key={risk.id} risk={risk} />)}
              </div>
            </div>
          )}

          {safeItems.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-cyan-600 mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                正常项 ({safeItems.length})
              </h3>
              <div className="space-y-3">
                {safeItems.map(risk => <RiskCard key={risk.id} risk={risk} />)}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">设置定期自动监测</h3>
              <p className="text-primary-200 text-sm">每月自动体检，异常实时推送，让风险无处遁形</p>
            </div>
            <button
              onClick={() => onNavigate('monitor')}
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-50 transition-colors cursor-pointer shrink-0"
            >
              设置监测
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
