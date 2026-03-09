import {
  Shield,
  FileSearch,
  BellRing,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Zap,
  Brain,
  Lock,
} from 'lucide-react';
import type { AppPage } from '../types';

interface HomePageProps {
  onNavigate: (page: AppPage) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
              <Zap size={14} className="text-yellow-300" />
              <span>金税四期时代的智能税务守护者</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              别等税务局来查
              <br />
              <span className="text-primary-200">先让AI帮你自查</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 leading-relaxed max-w-2xl">
              上传财务报表，AI自动扫描10大风险维度，3分钟生成专业级风险体检报告。
              <br />
              比代账公司更懂风险，比税务顾问更快响应。
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('upload')}
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                立即自检
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all cursor-pointer"
              >
                了解更多
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl">
            {[
              { label: '检测维度', value: '10+' },
              { label: '风险规则', value: '200+' },
              { label: '分析耗时', value: '<3分钟' },
              { label: '准确率', value: '95%+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-primary-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">小微企业主的税务困境</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              不知道自己有没有风险，等到被查就晚了
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: '代账公司只管报税',
                desc: '代账公司按流程报税，不会主动帮你排查风险——做了可能吓跑客户。你以为报完税就万事大吉？',
                color: 'text-red-500',
                bg: 'bg-red-50',
              },
              {
                title: '金税四期大数据盯梢',
                desc: '银行流水、发票数据、社保信息……税务局早已实现多维度交叉比对，异常数据无处遁形。',
                color: 'text-orange-500',
                bg: 'bg-orange-50',
              },
              {
                title: '被查时才知道有问题',
                desc: '税务稽查平均补税金额20-50万，加上滞纳金和罚款，足以让一个小企业元气大伤。',
                color: 'text-yellow-600',
                bg: 'bg-yellow-50',
              },
            ].map((item) => (
              <div key={item.title} className={`${item.bg} rounded-2xl p-6 border border-white`}>
                <h3 className={`text-lg font-semibold ${item.color} mb-2`}>{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI深度思考，全方位风险扫描</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              不是简单的规则匹配，而是像资深税务师一样进行深度分析推理
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FileSearch size={24} />,
                title: '发票匹配度扫描',
                desc: '自动比对进销项发票，识别异常抵扣、虚开风险、供应商走逃关联',
              },
              {
                icon: <TrendingUp size={24} />,
                title: '行业税负率对比',
                desc: '基于200+行业基准数据，精准对标你的税负率是否偏离正常区间',
              },
              {
                icon: <Brain size={24} />,
                title: 'AI深度推理',
                desc: '模拟税务师思维链，对费用结构、利润异常、资金流向进行多维度交叉验证',
              },
              {
                icon: <Shield size={24} />,
                title: '高风险科目预警',
                desc: '招待费、咨询费、现金交易等10+高风险科目逐项扫描，精准定位问题',
              },
              {
                icon: <BellRing size={24} />,
                title: '定期自动监测',
                desc: '设置月度/双周自动检测，异常指标实时推送微信提醒，防患于未然',
              },
              {
                icon: <Lock size={24} />,
                title: '数据安全保障',
                desc: '端到端加密传输，数据不出境，分析完成后可一键删除源数据',
              },
            ].map((feature) => (
              <div key={feature.title} className="group p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">三步完成税务体检</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '上传财务数据',
                desc: '导入资产负债表、利润表，或直接拍照上传纸质报表，AI自动识别提取',
              },
              {
                step: '02',
                title: 'AI深度分析',
                desc: '10大维度交叉验证，模拟税务稽查思路进行深度推理，实时展示思考过程',
              },
              {
                step: '03',
                title: '获取体检报告',
                desc: '高风险标红、整改建议逐条给出、引用税法依据，一键导出PDF报告',
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-5xl font-bold text-primary-100 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-3xl p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">为什么选择税盾AI？</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                '覆盖全国各地税务执行差异',
                '持续更新的税法知识库',
                '比人工审计快100倍',
                '费用不到税务顾问的1/10',
                '检测结果严格保密',
                '无需安装，小程序直接使用',
                '专业税务师团队背书',
                '已服务10,000+小微企业',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 size={18} className="text-primary-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            现在就开始你的第一次税务体检
          </h2>
          <p className="text-primary-200 text-lg mb-8">
            免费检测，3分钟出报告，发现问题比被查更从容
          </p>
          <button
            onClick={() => onNavigate('upload')}
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            免费开始自检
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm">
          <p>税盾AI - 智能税务风险自检平台 | 让每个小微企业都有税务安全感</p>
          <p className="mt-2 text-gray-600">本产品提供的分析结果仅供参考，不构成正式税务意见。如有具体税务问题，请咨询专业税务顾问。</p>
        </div>
      </footer>
    </div>
  );
}
