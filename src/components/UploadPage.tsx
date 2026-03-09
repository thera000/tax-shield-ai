import { useState } from 'react';
import {
  Upload,
  Camera,
  FileSpreadsheet,
  ArrowRight,
  HelpCircle,
  Building2,
  ChevronDown,
} from 'lucide-react';
import type { FinancialData, AppPage } from '../types';
import { INDUSTRY_OPTIONS } from '../engine/taxRules';

interface UploadPageProps {
  onNavigate: (page: AppPage) => void;
  onStartAnalysis: (data: FinancialData) => void;
}

const DEMO_DATA: FinancialData = {
  companyName: '示例科技有限公司',
  industry: 'tech',
  period: '2025年度',
  revenue: 8500000,
  cost: 6800000,
  grossProfit: 1700000,
  operatingExpenses: 1500000,
  netProfit: 200000,
  taxPaid: 85000,
  vatOutput: 1105000,
  vatInput: 1020000,
  invoiceCount: 356,
  entertainmentExpense: 120000,
  travelExpense: 85000,
  consultingFee: 550000,
  cashTransaction: 2800000,
  accountsReceivable: 3200000,
  inventory: 1200000,
  totalAssets: 5500000,
  employeeCount: 25,
  socialInsuranceCount: 18,
};

type InputMode = 'form' | 'upload';

export default function UploadPage({ onNavigate, onStartAnalysis }: UploadPageProps) {
  const [mode, setMode] = useState<InputMode>('form');
  const [formData, setFormData] = useState<FinancialData>(DEMO_DATA);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleSubmit = () => {
    onStartAnalysis(formData);
    onNavigate('analyzing');
  };

  const handleDemoAnalysis = () => {
    onStartAnalysis(DEMO_DATA);
    onNavigate('analyzing');
  };

  const updateField = (field: keyof FinancialData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const FieldInput = ({
    label,
    field,
    unit = '万元',
    tooltip,
  }: {
    label: string;
    field: keyof FinancialData;
    unit?: string;
    tooltip?: string;
  }) => (
    <div className="relative">
      <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1.5">
        {label}
        {tooltip && (
          <button
            className="cursor-pointer"
            onMouseEnter={() => setShowTooltip(field)}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <HelpCircle size={14} className="text-gray-400" />
          </button>
        )}
      </label>
      {showTooltip === field && tooltip && (
        <div className="absolute z-10 top-0 left-full ml-2 bg-gray-800 text-white text-xs rounded-lg p-3 w-56 shadow-xl">
          {tooltip}
        </div>
      )}
      <div className="relative">
        <input
          type="number"
          value={typeof formData[field] === 'number' ? formData[field] : ''}
          onChange={(e) => updateField(field, parseFloat(e.target.value) || 0)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          {unit}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">税务风险自检</h1>
          <p className="text-gray-500">
            输入财务数据，AI将从10个维度为您进行深度风险扫描
          </p>
        </div>

        {/* Mode Switch */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode('form')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              mode === 'form'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FileSpreadsheet size={16} />
            手动填写
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Upload size={16} />
            上传报表
          </button>
        </div>

        {mode === 'upload' ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-primary-300 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} className="text-primary-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">上传Excel报表</h3>
                <p className="text-sm text-gray-500 mb-4">
                  支持资产负债表、利润表
                  <br />
                  Excel/CSV格式
                </p>
                <div className="inline-flex items-center gap-1 bg-primary-50 text-primary-600 px-4 py-2 rounded-lg text-sm font-medium">
                  <Upload size={14} />
                  选择文件
                </div>
              </div>

              {/* Camera Upload */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-primary-300 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera size={28} className="text-green-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">拍照识别</h3>
                <p className="text-sm text-gray-500 mb-4">
                  拍摄纸质报表
                  <br />
                  AI自动识别提取数据
                </p>
                <div className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-medium">
                  <Camera size={14} />
                  打开相机
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-xl text-sm text-yellow-700 flex items-start gap-2">
              <HelpCircle size={16} className="shrink-0 mt-0.5" />
              <span>
                当前为演示版本，拍照及文件上传功能开发中。您可以切换到"手动填写"模式体验完整分析流程，或点击下方按钮使用演示数据。
              </span>
            </div>

            <button
              onClick={handleDemoAnalysis}
              className="mt-4 w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              使用演示数据体验
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-primary-500" />
                基本信息
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">公司名称</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">所属行业</label>
                  <div className="relative">
                    <select
                      value={formData.industry}
                      onChange={(e) => updateField('industry', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                    >
                      {INDUSTRY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">检测期间</label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => updateField('period', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="如：2025年度"
                  />
                </div>
              </div>
            </div>

            {/* Revenue & Profit */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">收入与利润</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <FieldInput label="营业收入" field="revenue" tooltip="主营业务收入+其他业务收入" />
                <FieldInput label="营业成本" field="cost" tooltip="与收入对应的直接成本" />
                <FieldInput label="毛利润" field="grossProfit" tooltip="营业收入 - 营业成本" />
                <FieldInput label="期间费用合计" field="operatingExpenses" tooltip="管理费用+销售费用+财务费用" />
                <FieldInput label="净利润" field="netProfit" tooltip="利润总额 - 所得税费用" />
                <FieldInput label="已缴增值税" field="taxPaid" tooltip="当期实际缴纳的增值税额" />
              </div>
            </div>

            {/* VAT & Invoice */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">增值税与发票</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <FieldInput label="销项税额" field="vatOutput" tooltip="销售产生的增值税" />
                <FieldInput label="进项税额" field="vatInput" tooltip="采购取得的可抵扣增值税" />
                <FieldInput label="发票份数" field="invoiceCount" unit="份" tooltip="当期开具的发票总数" />
              </div>
            </div>

            {/* Key Expenses */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">重点费用科目</h2>
              <p className="text-sm text-gray-400 mb-4">以下科目是税务稽查重点关注项</p>
              <div className="grid sm:grid-cols-3 gap-4">
                <FieldInput
                  label="业务招待费"
                  field="entertainmentExpense"
                  tooltip="按发生额60%扣除，且不超过收入的0.5%"
                />
                <FieldInput label="差旅费" field="travelExpense" />
                <FieldInput
                  label="咨询服务费"
                  field="consultingFee"
                  tooltip="大额咨询费是稽查重点，需有合同和成果支撑"
                />
                <FieldInput
                  label="现金交易额"
                  field="cashTransaction"
                  tooltip="现金收支总额，过高易引起关注"
                />
              </div>
            </div>

            {/* Assets & HR */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">资产与用工</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <FieldInput label="应收账款" field="accountsReceivable" />
                <FieldInput label="存货" field="inventory" />
                <FieldInput label="资产总额" field="totalAssets" />
                <FieldInput label="员工人数" field="employeeCount" unit="人" />
                <FieldInput label="社保缴纳人数" field="socialInsuranceCount" unit="人" tooltip="实际缴纳社保的人数" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pb-8">
              <button
                onClick={handleDemoAnalysis}
                className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200 cursor-pointer"
              >
                使用演示数据
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                开始AI分析
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Quick Info */}
            <div className="pb-8">
              <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                <HelpCircle size={16} className="shrink-0 mt-0.5" />
                <span>
                  已预填演示数据方便您体验。您可以修改任意数值后点击"开始AI分析"，或直接点击"使用演示数据"查看分析效果。
                  所有数据仅在本地处理，不会上传至服务器。
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
