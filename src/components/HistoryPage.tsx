import {
  FileText,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Clock,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import type { AppPage, AnalysisReport, RiskLevel } from '../types';

interface HistoryPageProps {
  reports: AnalysisReport[];
  onNavigate: (page: AppPage) => void;
  onViewReport: (report: AnalysisReport) => void;
}

const MOCK_HISTORY: { date: string; score: number; level: RiskLevel; highCount: number; mediumCount: number }[] = [
  { date: '2026-01-15', score: 52, level: 'medium', highCount: 3, mediumCount: 2 },
  { date: '2026-02-15', score: 61, level: 'low', highCount: 2, mediumCount: 3 },
];

export default function HistoryPage({ reports, onNavigate, onViewReport }: HistoryPageProps) {
  const allRecords = [
    ...reports.map(r => ({
      date: r.date,
      score: r.overallScore,
      level: r.overallLevel,
      highCount: r.risks.filter(x => x.level === 'high').length,
      mediumCount: r.risks.filter(x => x.level === 'medium').length,
      report: r,
    })),
    ...MOCK_HISTORY.map(h => ({
      ...h,
      report: null as AnalysisReport | null,
    })),
  ];

  const levelColors: Record<RiskLevel, string> = {
    high: 'text-red-500',
    medium: 'text-amber-500',
    low: 'text-green-500',
    safe: 'text-cyan-500',
  };

  const levelLabels: Record<RiskLevel, string> = {
    high: '高风险',
    medium: '需关注',
    low: '较安全',
    safe: '健康',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">检测记录</h1>
          <p className="text-gray-500">查看历次税务风险检测结果和趋势</p>
        </div>

        {/* Trend Summary */}
        {allRecords.length >= 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-500" />
              风险趋势
            </h2>
            <div className="flex items-end gap-2 h-32">
              {allRecords.map((record, i) => {
                const height = `${record.score}%`;
                const color = record.level === 'high' ? 'bg-red-400' : record.level === 'medium' ? 'bg-amber-400' : record.level === 'low' ? 'bg-green-400' : 'bg-cyan-400';
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-gray-700">{record.score}</span>
                    <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                      <div
                        className={`absolute bottom-0 left-0 right-0 ${color} rounded-t-lg transition-all`}
                        style={{ height }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{record.date.split(' ')[0].slice(5)}</span>
                  </div>
                );
              })}
            </div>
            {allRecords.length >= 2 && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                {allRecords[0].score > allRecords[allRecords.length - 1].score ? (
                  <>
                    <TrendingUp size={16} className="text-green-500" />
                    <span className="text-green-600">
                      较上次提升 {allRecords[0].score - allRecords[allRecords.length - 1].score} 分，持续改善中
                    </span>
                  </>
                ) : allRecords[0].score < allRecords[allRecords.length - 1].score ? (
                  <>
                    <TrendingDown size={16} className="text-red-500" />
                    <span className="text-red-600">
                      较上次下降 {allRecords[allRecords.length - 1].score - allRecords[0].score} 分，请关注
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">评分持平</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Records List */}
        <div className="space-y-3">
          {allRecords.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">暂无检测记录</p>
              <button
                onClick={() => onNavigate('upload')}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors cursor-pointer"
              >
                开始第一次检测
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            allRecords.map((record, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl font-bold ${levelColors[record.level]}`}>
                      {record.score}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${levelColors[record.level]}`}>
                          {levelLabels[record.level]}
                        </span>
                        {record.highCount > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-red-500">
                            <AlertTriangle size={12} />
                            {record.highCount}
                          </span>
                        )}
                        {record.mediumCount > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-amber-500">
                            <AlertCircle size={12} />
                            {record.mediumCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                        <Clock size={12} />
                        <span>{record.date}</span>
                      </div>
                    </div>
                  </div>
                  {record.report ? (
                    <button
                      onClick={() => onViewReport(record.report!)}
                      className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700 cursor-pointer"
                    >
                      查看报告
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">历史记录</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
