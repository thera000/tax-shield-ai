import { useState } from 'react';
import {
  CheckCircle2,
  Smartphone,
  Clock,
  Shield,
  ToggleLeft,
  ToggleRight,
  CalendarDays,
  MessageCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';
import type { AppPage, MonitorConfig } from '../types';

interface MonitorPageProps {
  onNavigate: (page: AppPage) => void;
}

export default function MonitorPage({ onNavigate }: MonitorPageProps) {
  const [config, setConfig] = useState<MonitorConfig>({
    enabled: false,
    frequency: 'monthly',
    wechatBound: false,
    lastCheck: '2026-02-15 09:30',
    nextCheck: '2026-03-15 09:30',
  });
  const [showBindModal, setShowBindModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">定期监测设置</h1>
          <p className="text-gray-500">设置自动检测计划，异常指标实时推送微信提醒</p>
        </div>

        {/* Main Toggle */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-primary-500" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">自动监测</h2>
                <p className="text-sm text-gray-500">开启后将按计划自动分析财务数据</p>
              </div>
            </div>
            <button
              onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
              className="cursor-pointer"
            >
              {config.enabled ? (
                <ToggleRight size={40} className="text-primary-500" />
              ) : (
                <ToggleLeft size={40} className="text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Frequency */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-primary-500" />
            检测频率
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {([
              { value: 'weekly' as const, label: '每周', desc: '适合交易频繁的企业' },
              { value: 'biweekly' as const, label: '每两周', desc: '推荐大多数企业' },
              { value: 'monthly' as const, label: '每月', desc: '适合业务稳定的企业' },
            ]).map(opt => (
              <button
                key={opt.value}
                onClick={() => setConfig(prev => ({ ...prev, frequency: opt.value }))}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  config.frequency === opt.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`text-sm font-semibold ${
                  config.frequency === opt.value ? 'text-primary-700' : 'text-gray-900'
                }`}>
                  {opt.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* WeChat Notification */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle size={18} className="text-green-500" />
            微信提醒
          </h2>
          {config.wechatBound ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <CheckCircle2 size={20} className="text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-800">已绑定微信</p>
                <p className="text-xs text-green-600">发现异常将第一时间推送通知</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone size={28} className="text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-4">绑定微信后，检测到异常指标将实时推送提醒</p>
              <button
                onClick={() => setShowBindModal(true)}
                className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-600 transition-colors cursor-pointer"
              >
                <MessageCircle size={16} />
                绑定微信
              </button>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-primary-500" />
            监测状态
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">上次检测</span>
              <span className="text-sm font-medium text-gray-900">{config.lastCheck || '暂无记录'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">下次检测</span>
              <span className="text-sm font-medium text-primary-600">{config.enabled ? config.nextCheck : '未开启'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">累计检测次数</span>
              <span className="text-sm font-medium text-gray-900">3 次</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap size={18} className="text-primary-500" />
            自动监测能力
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              '自动对接财务系统数据',
              '行业税负率实时更新',
              '异常波动智能预警',
              '风险趋势追踪分析',
              '历史报告自动对比',
              '一键生成整改清单',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 size={14} className="text-primary-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 text-center">
          <p className="text-gray-500 text-sm mb-4">还没做过检测？先来一次体检吧</p>
          <button
            onClick={() => onNavigate('upload')}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors cursor-pointer"
          >
            立即检测
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Bind Modal */}
        {showBindModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">绑定微信通知</h3>
              <p className="text-sm text-gray-500 mb-6">扫描下方二维码关注"税盾AI"公众号完成绑定</p>
              <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <div className="text-center text-gray-400">
                  <MessageCircle size={40} className="mx-auto mb-2" />
                  <span className="text-sm">演示二维码</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowBindModal(false);
                  setConfig(prev => ({ ...prev, wechatBound: true }));
                }}
                className="w-full bg-green-500 text-white py-2.5 rounded-xl font-medium hover:bg-green-600 transition-colors cursor-pointer"
              >
                模拟绑定成功
              </button>
              <button
                onClick={() => setShowBindModal(false)}
                className="w-full text-gray-500 py-2.5 mt-2 text-sm cursor-pointer"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
