import type { FinancialData, RiskItem, RiskLevel } from '../types';

interface IndustryBenchmark {
  name: string;
  taxBurdenRate: [number, number];
  grossProfitRate: [number, number];
  entertainmentRatio: number;
  vatDeductionRate: [number, number];
}

const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmark> = {
  retail: {
    name: '零售业',
    taxBurdenRate: [0.008, 0.025],
    grossProfitRate: [0.15, 0.40],
    entertainmentRatio: 0.005,
    vatDeductionRate: [0.70, 0.92],
  },
  manufacturing: {
    name: '制造业',
    taxBurdenRate: [0.02, 0.05],
    grossProfitRate: [0.15, 0.35],
    entertainmentRatio: 0.005,
    vatDeductionRate: [0.75, 0.95],
  },
  service: {
    name: '服务业',
    taxBurdenRate: [0.03, 0.06],
    grossProfitRate: [0.25, 0.60],
    entertainmentRatio: 0.005,
    vatDeductionRate: [0.55, 0.85],
  },
  tech: {
    name: '科技/信息技术',
    taxBurdenRate: [0.02, 0.06],
    grossProfitRate: [0.30, 0.70],
    entertainmentRatio: 0.005,
    vatDeductionRate: [0.50, 0.80],
  },
  food: {
    name: '餐饮业',
    taxBurdenRate: [0.02, 0.05],
    grossProfitRate: [0.40, 0.65],
    entertainmentRatio: 0.005,
    vatDeductionRate: [0.60, 0.88],
  },
  construction: {
    name: '建筑业',
    taxBurdenRate: [0.015, 0.035],
    grossProfitRate: [0.08, 0.20],
    entertainmentRatio: 0.005,
    vatDeductionRate: [0.75, 0.92],
  },
};

export function analyzeFinancialData(data: FinancialData): RiskItem[] {
  const risks: RiskItem[] = [];
  const benchmark = INDUSTRY_BENCHMARKS[data.industry] || INDUSTRY_BENCHMARKS.service;
  let riskId = 0;

  // 1. 税负率分析
  const taxBurdenRate = data.taxPaid / data.revenue;
  const [minTax, maxTax] = benchmark.taxBurdenRate;
  if (taxBurdenRate < minTax * 0.6) {
    risks.push({
      id: `risk-${++riskId}`,
      category: '税负异常',
      title: '增值税税负率显著偏低',
      description: `当前税负率 ${(taxBurdenRate * 100).toFixed(2)}%，远低于${benchmark.name}行业均值 ${(minTax * 100).toFixed(1)}%-${(maxTax * 100).toFixed(1)}%`,
      level: 'high',
      detail: `贵公司增值税税负率为 ${(taxBurdenRate * 100).toFixed(2)}%，而${benchmark.name}行业的正常税负率区间为 ${(minTax * 100).toFixed(1)}%-${(maxTax * 100).toFixed(1)}%。税负率显著偏低是税务局重点关注的预警指标之一，可能触发纳税评估或税务稽查。`,
      suggestion: '1. 核查进项发票是否存在虚开或不合规情况\n2. 检查是否存在收入未及时确认的情况\n3. 梳理进项抵扣是否存在超范围抵扣\n4. 建议主动与主管税务机关沟通说明原因',
      relatedPolicy: '《税收征收管理法》第三十五条；国家税务总局关于纳税评估的相关规定',
      value: taxBurdenRate * 100,
      threshold: minTax * 100,
    });
  } else if (taxBurdenRate < minTax) {
    risks.push({
      id: `risk-${++riskId}`,
      category: '税负异常',
      title: '增值税税负率偏低',
      description: `当前税负率 ${(taxBurdenRate * 100).toFixed(2)}%，低于行业均值下限 ${(minTax * 100).toFixed(1)}%`,
      level: 'medium',
      detail: `贵公司增值税税负率略低于行业均值区间下限，虽未达到严重偏离，但仍可能引起税务关注。`,
      suggestion: '1. 自查收入确认时点是否准确\n2. 核实进项抵扣的合规性\n3. 关注是否存在视同销售未申报情况',
      relatedPolicy: '国家税务总局纳税评估管理办法',
      value: taxBurdenRate * 100,
      threshold: minTax * 100,
    });
  } else {
    risks.push({
      id: `risk-${++riskId}`,
      category: '税负异常',
      title: '增值税税负率正常',
      description: `当前税负率 ${(taxBurdenRate * 100).toFixed(2)}%，处于行业正常区间`,
      level: 'safe',
      detail: '贵公司增值税税负率在行业正常范围内，暂无风险。',
      suggestion: '继续保持合规纳税，定期自查。',
      value: taxBurdenRate * 100,
      threshold: minTax * 100,
    });
  }

  // 2. 进销项匹配分析
  if (data.vatOutput > 0) {
    const deductionRate = data.vatInput / data.vatOutput;
    const [, maxDeduct] = benchmark.vatDeductionRate;
    if (deductionRate > maxDeduct * 1.15) {
      risks.push({
        id: `risk-${++riskId}`,
        category: '发票风险',
        title: '进项税额与销项税额比例异常偏高',
        description: `进销项比 ${(deductionRate * 100).toFixed(1)}%，超出行业正常上限 ${(maxDeduct * 100).toFixed(1)}%`,
        level: 'high',
        detail: `进项税额过高可能表明存在以下问题：虚开进项发票、进项转出不及时、取得不合规发票用于抵扣等。这是金税四期重点监控的风险指标。`,
        suggestion: '1. 逐笔核查大额进项发票来源的真实性\n2. 检查是否存在与经营无关的进项抵扣\n3. 核实供应商是否为"走逃失联"企业\n4. 必要时做进项转出处理',
        relatedPolicy: '《增值税暂行条例》第十条；金税四期风控指标',
        value: deductionRate * 100,
        threshold: maxDeduct * 100,
      });
    } else if (deductionRate > maxDeduct) {
      risks.push({
        id: `risk-${++riskId}`,
        category: '发票风险',
        title: '进销项比例略偏高',
        description: `进销项比 ${(deductionRate * 100).toFixed(1)}%，略高于行业正常上限`,
        level: 'medium',
        detail: '进销项比例偏高，建议关注进项发票的合规性。',
        suggestion: '1. 核查近期大额进项发票\n2. 确认所有进项抵扣均与实际经营相关',
        value: deductionRate * 100,
        threshold: maxDeduct * 100,
      });
    } else {
      risks.push({
        id: `risk-${++riskId}`,
        category: '发票风险',
        title: '进销项匹配正常',
        description: `进销项比 ${(deductionRate * 100).toFixed(1)}%，处于正常区间`,
        level: 'safe',
        detail: '进销项匹配度在行业合理范围内。',
        suggestion: '保持当前发票管理规范。',
        value: deductionRate * 100,
        threshold: maxDeduct * 100,
      });
    }
  }

  // 3. 毛利率分析
  const grossProfitRate = data.grossProfit / data.revenue;
  const [minGP, maxGP] = benchmark.grossProfitRate;
  if (grossProfitRate < minGP * 0.5) {
    risks.push({
      id: `risk-${++riskId}`,
      category: '利润异常',
      title: '毛利率严重偏低',
      description: `毛利率 ${(grossProfitRate * 100).toFixed(1)}%，远低于行业均值 ${(minGP * 100).toFixed(0)}%-${(maxGP * 100).toFixed(0)}%`,
      level: 'high',
      detail: `毛利率严重偏低可能意味着：成本虚高（人为多列成本费用）、收入隐匿、或关联交易定价异常。税务局通过行业对比分析会重点关注此类异常。`,
      suggestion: '1. 核实成本结转是否准确，有无多结转现象\n2. 检查是否存在账外收入\n3. 如有关联交易，确认是否符合独立交易原则\n4. 准备好合理的商业解释材料',
      relatedPolicy: '《企业所得税法》第四十一条（关联交易）；纳税评估指标体系',
      value: grossProfitRate * 100,
      threshold: minGP * 100,
    });
  } else if (grossProfitRate < minGP) {
    risks.push({
      id: `risk-${++riskId}`,
      category: '利润异常',
      title: '毛利率偏低',
      description: `毛利率 ${(grossProfitRate * 100).toFixed(1)}%，低于行业均值下限`,
      level: 'medium',
      detail: '毛利率低于行业均值，建议排查成本核算准确性。',
      suggestion: '1. 审核成本归集和结转流程\n2. 确认收入是否完整入账',
      value: grossProfitRate * 100,
      threshold: minGP * 100,
    });
  } else {
    risks.push({
      id: `risk-${++riskId}`,
      category: '利润异常',
      title: '毛利率正常',
      description: `毛利率 ${(grossProfitRate * 100).toFixed(1)}%，在行业合理区间内`,
      level: 'safe',
      detail: '毛利率处于行业正常水平。',
      suggestion: '继续保持。',
      value: grossProfitRate * 100,
      threshold: minGP * 100,
    });
  }

  // 4. 业务招待费检查
  const entertainmentLimit = Math.min(
    data.entertainmentExpense,
    data.revenue * benchmark.entertainmentRatio,
    data.entertainmentExpense * 0.6
  );
  const entertainmentExcess = data.entertainmentExpense - entertainmentLimit;
  if (data.entertainmentExpense > data.revenue * 0.01) {
    risks.push({
      id: `risk-${++riskId}`,
      category: '费用风险',
      title: '业务招待费占比过高',
      description: `招待费 ${(data.entertainmentExpense / 10000).toFixed(1)}万元，占收入 ${((data.entertainmentExpense / data.revenue) * 100).toFixed(2)}%`,
      level: 'high',
      detail: `业务招待费税前扣除有双重限额：发生额的60%且不超过营业收入的0.5%。当前招待费金额偏高，超出部分 ${(entertainmentExcess / 10000).toFixed(1)}万元需要纳税调增。同时过高的招待费也容易引起税务关注。`,
      suggestion: '1. 严格控制招待费支出，加强审批流程\n2. 注意区分招待费与会议费、差旅费的界限\n3. 确保每笔招待费有完整的原始凭证\n4. 年度汇算清缴时准确做纳税调整',
      relatedPolicy: '《企业所得税法实施条例》第四十三条',
      value: (data.entertainmentExpense / data.revenue) * 100,
      threshold: 0.5,
    });
  } else if (data.entertainmentExpense > data.revenue * 0.005) {
    risks.push({
      id: `risk-${++riskId}`,
      category: '费用风险',
      title: '业务招待费接近限额',
      description: `招待费占比 ${((data.entertainmentExpense / data.revenue) * 100).toFixed(2)}%，接近税前扣除上限`,
      level: 'medium',
      detail: '招待费接近税法限额上限，年末汇算需做纳税调整。',
      suggestion: '1. 提前规划全年招待费预算\n2. 做好招待费与其他费用的区分',
      value: (data.entertainmentExpense / data.revenue) * 100,
      threshold: 0.5,
    });
  } else {
    risks.push({
      id: `risk-${++riskId}`,
      category: '费用风险',
      title: '业务招待费在合理范围内',
      description: `招待费占收入比例 ${((data.entertainmentExpense / data.revenue) * 100).toFixed(2)}%`,
      level: 'safe',
      detail: '业务招待费在税前扣除限额内。',
      suggestion: '继续保持合理控制。',
      value: (data.entertainmentExpense / data.revenue) * 100,
      threshold: 0.5,
    });
  }

  // 5. 大额咨询费检查
  if (data.consultingFee > data.revenue * 0.05) {
    risks.push({
      id: `risk-${++riskId}`,
      category: '费用风险',
      title: '咨询服务费占比异常',
      description: `咨询费 ${(data.consultingFee / 10000).toFixed(1)}万元，占收入 ${((data.consultingFee / data.revenue) * 100).toFixed(1)}%`,
      level: 'high',
      detail: `大额咨询费是税务稽查重点关注科目。部分企业通过虚构咨询服务套取资金、虚增成本。如果无法提供详实的咨询成果和合同，存在被认定为虚列费用的风险。`,
      suggestion: '1. 确保每笔咨询费有正规合同、成果交付物\n2. 保留付款凭证、银行流水等佐证材料\n3. 咨询费发票须与合同内容一致\n4. 避免向关联方或个人支付大额咨询费',
      relatedPolicy: '《企业所得税法》第八条（合理性原则）',
      value: (data.consultingFee / data.revenue) * 100,
      threshold: 5,
    });
  } else if (data.consultingFee > data.revenue * 0.02) {
    risks.push({
      id: `risk-${++riskId}`,
      category: '费用风险',
      title: '咨询服务费偏高',
      description: `咨询费占收入 ${((data.consultingFee / data.revenue) * 100).toFixed(1)}%`,
      level: 'medium',
      detail: '咨询费支出偏高，建议留存相关合同及成果材料。',
      suggestion: '1. 完善咨询服务的合同备案\n2. 留存咨询成果作为佐证',
      value: (data.consultingFee / data.revenue) * 100,
      threshold: 5,
    });
  }

  // 6. 现金交易比例检查
  if (data.cashTransaction > data.revenue * 0.3) {
    risks.push({
      id: `risk-${++riskId}`,
      category: '资金风险',
      title: '现金交易占比过高',
      description: `现金交易 ${(data.cashTransaction / 10000).toFixed(1)}万元，占收入 ${((data.cashTransaction / data.revenue) * 100).toFixed(0)}%`,
      level: 'high',
      detail: `大量现金交易难以追溯资金流向，容易被税务机关怀疑存在收入隐匿、坐支现金等问题。金税四期强调"以票管税"向"以数治税"转型，银行流水与申报数据的匹配是重要监控手段。`,
      suggestion: '1. 逐步减少现金交易，推广银行转账或电子支付\n2. 现金收入及时存入银行并做好登记\n3. 大额现金支出需要完善审批和记录\n4. 确保现金日记账与银行日记账准确',
      relatedPolicy: '《现金管理暂行条例》；金税四期大数据监控',
      value: (data.cashTransaction / data.revenue) * 100,
      threshold: 30,
    });
  } else if (data.cashTransaction > data.revenue * 0.15) {
    risks.push({
      id: `risk-${++riskId}`,
      category: '资金风险',
      title: '现金交易偏多',
      description: `现金交易占比 ${((data.cashTransaction / data.revenue) * 100).toFixed(0)}%`,
      level: 'medium',
      detail: '现金交易比例偏高，建议增加银行转账比例。',
      suggestion: '1. 鼓励客户使用对公转账\n2. 完善现金收支记录',
      value: (data.cashTransaction / data.revenue) * 100,
      threshold: 30,
    });
  }

  // 7. 社保与员工人数匹配
  if (data.employeeCount > 0 && data.socialInsuranceCount > 0) {
    const socialRate = data.socialInsuranceCount / data.employeeCount;
    if (socialRate < 0.6) {
      risks.push({
        id: `risk-${++riskId}`,
        category: '用工风险',
        title: '社保缴纳人数与员工人数严重不匹配',
        description: `员工 ${data.employeeCount}人，社保仅 ${data.socialInsuranceCount}人（${(socialRate * 100).toFixed(0)}%）`,
        level: 'high',
        detail: `社保由税务机关征收后，人社与税务数据已打通。企业实际用工人数远超社保缴纳人数，可能面临追缴社保费及滞纳金的风险，同时也影响个税申报的合理性。`,
        suggestion: '1. 梳理员工花名册，核实用工形式\n2. 对全日制员工依法缴纳社保\n3. 灵活用工可通过劳务派遣或平台合规处理\n4. 咨询专业HR确认合规方案',
        relatedPolicy: '《社会保险法》；社保入税政策',
        value: socialRate * 100,
        threshold: 80,
      });
    } else if (socialRate < 0.8) {
      risks.push({
        id: `risk-${++riskId}`,
        category: '用工风险',
        title: '社保覆盖率偏低',
        description: `社保覆盖率 ${(socialRate * 100).toFixed(0)}%`,
        level: 'medium',
        detail: '部分员工未缴纳社保，存在一定合规风险。',
        suggestion: '1. 区分劳动关系与劳务关系\n2. 确保符合条件的员工全部参保',
        value: socialRate * 100,
        threshold: 80,
      });
    }
  }

  // 8. 存货异常检查
  if (data.inventory > 0 && data.revenue > 0) {
    const inventoryTurnover = data.cost / data.inventory;
    if (inventoryTurnover < 2) {
      risks.push({
        id: `risk-${++riskId}`,
        category: '资产异常',
        title: '存货周转率过低',
        description: `存货周转率仅 ${inventoryTurnover.toFixed(1)} 次/年`,
        level: 'medium',
        detail: '存货周转率过低可能反映：存货积压严重、成本核算不准确、或存货账实不符。税务机关可能怀疑存在成本虚增的问题。',
        suggestion: '1. 进行存货盘点，确保账实相符\n2. 检查存货计价方法是否一致\n3. 对长期积压存货做减值评估\n4. 完善出入库管理制度',
        value: inventoryTurnover,
        threshold: 4,
      });
    }
  }

  // 9. 长期亏损检查
  if (data.netProfit < 0) {
    const lossRate = Math.abs(data.netProfit) / data.revenue;
    if (lossRate > 0.1) {
      risks.push({
        id: `risk-${++riskId}`,
        category: '利润异常',
        title: '企业持续大额亏损',
        description: `亏损额 ${(Math.abs(data.netProfit) / 10000).toFixed(1)}万元，亏损率 ${(lossRate * 100).toFixed(1)}%`,
        level: 'high',
        detail: `企业长期亏损但仍正常经营是税务稽查的重点对象。税务机关会质疑：为何亏损还能持续经营？是否存在账外收入？是否人为调节利润逃避企业所得税？`,
        suggestion: '1. 准备详细的亏损原因说明材料\n2. 核查是否存在应确认而未确认的收入\n3. 检查成本费用列支的合规性\n4. 如实际经营状况确实亏损，保留充分证据',
        relatedPolicy: '《企业所得税法》第五条；纳税评估重点监控指标',
        value: lossRate * 100,
        threshold: 0,
      });
    } else {
      risks.push({
        id: `risk-${++riskId}`,
        category: '利润异常',
        title: '企业存在亏损',
        description: `亏损额 ${(Math.abs(data.netProfit) / 10000).toFixed(1)}万元`,
        level: 'medium',
        detail: '企业当期亏损，建议关注亏损原因的合理性。',
        suggestion: '1. 分析亏损原因，准备说明材料\n2. 关注企业所得税弥补亏损的年限规定',
        value: lossRate * 100,
        threshold: 0,
      });
    }
  }

  // 10. 应收账款异常
  if (data.accountsReceivable > data.revenue * 0.8) {
    risks.push({
      id: `risk-${++riskId}`,
      category: '资产异常',
      title: '应收账款占收入比例过高',
      description: `应收账款 ${(data.accountsReceivable / 10000).toFixed(1)}万元，占收入 ${((data.accountsReceivable / data.revenue) * 100).toFixed(0)}%`,
      level: 'medium',
      detail: '应收账款过高可能说明收入确认存在问题，或者存在虚构收入挂账的嫌疑。同时也反映企业回款能力弱，影响实际税款缴纳。',
      suggestion: '1. 对账龄超过1年的应收款进行清理\n2. 核实大额应收款的真实性\n3. 完善收入确认制度\n4. 符合条件的坏账可申请税前扣除',
      relatedPolicy: '《企业所得税法》第十条（资产损失扣除）',
      value: (data.accountsReceivable / data.revenue) * 100,
      threshold: 80,
    });
  }

  return risks;
}

export function calculateOverallScore(risks: RiskItem[]): number {
  if (risks.length === 0) return 100;

  const weights: Record<RiskLevel, number> = {
    high: 25,
    medium: 10,
    low: 3,
    safe: 0,
  };

  const totalDeduction = risks.reduce((sum, r) => sum + weights[r.level], 0);
  return Math.max(0, Math.min(100, 100 - totalDeduction));
}

export function getOverallLevel(score: number): RiskLevel {
  if (score >= 85) return 'safe';
  if (score >= 65) return 'low';
  if (score >= 40) return 'medium';
  return 'high';
}

export function generateSummary(risks: RiskItem[], score: number): string {
  const highRisks = risks.filter(r => r.level === 'high');
  const mediumRisks = risks.filter(r => r.level === 'medium');

  if (highRisks.length === 0 && mediumRisks.length === 0) {
    return '恭喜！贵公司当前税务指标均处于行业正常范围内，未发现明显风险点。建议继续保持合规经营，定期自查。';
  }

  let summary = `经AI深度分析，贵公司当前税务健康评分为 ${score} 分。`;

  if (highRisks.length > 0) {
    summary += `\n\n⚠️ 发现 ${highRisks.length} 项高风险问题：${highRisks.map(r => r.title).join('、')}。这些问题可能引起税务机关重点关注，建议尽快整改。`;
  }

  if (mediumRisks.length > 0) {
    summary += `\n\n⚡ 发现 ${mediumRisks.length} 项中风险问题：${mediumRisks.map(r => r.title).join('、')}。建议在下一个申报期前完成自查整改。`;
  }

  summary += '\n\n📋 详细的风险分析和整改建议请查看下方报告各项内容。';

  return summary;
}

export const INDUSTRY_OPTIONS = Object.entries(INDUSTRY_BENCHMARKS).map(([key, val]) => ({
  value: key,
  label: val.name,
}));
