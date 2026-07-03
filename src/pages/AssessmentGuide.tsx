import { Link } from 'react-router-dom'

export default function AssessmentGuide() {
  return (
    <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
      <div className="max-w-3xl mx-auto">

        <h1 className="font-display text-3xl md:text-4xl text-gray-800 mb-3">了解心理测评</h1>
        <p className="text-gray-500 text-lg mb-10 max-w-2xl">
          帮你搞清楚本站测评与医院专业量表的区别，更好地使用这些工具。
        </p>

        {/* 核心结论 */}
        <div className="glass-card p-6 md:p-8 mb-10 border-l-4 border-lavender-400 dark:border-lavender-600">
          <h2 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">一句话总结</h2>
          <p className="text-gray-600 leading-relaxed">
            本站的测评是<strong>简化版自测量表</strong>，适合日常情绪觉察和趋势追踪。
            如果你想了解自己"最近状态怎么样"，它们很方便；但如果需要专业诊断，请去医院做标准化量表。
          </p>
        </div>

        {/* 对比表格 */}
        <h2 className="font-display text-2xl text-gray-800 dark:text-gray-100 mb-6">自测量表 vs 专业量表</h2>
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-lavender-50 dark:bg-lavender-900/30">
                <th className="text-left p-4 rounded-tl-2xl font-medium text-gray-700 dark:text-gray-300">维度</th>
                <th className="text-left p-4 font-medium text-lavender-600 dark:text-lavender-400">本站自测量表</th>
                <th className="text-left p-4 rounded-tr-2xl font-medium text-gray-600 dark:text-gray-400">医院专业量表</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['题目数量', '6~8 题', '20~90 题不等'],
                ['答题时间', '3~5 分钟', '15~30 分钟'],
                ['编制依据', '参考经典量表简化', '经过严格的信效度检验'],
                ['结果精度', '粗略情绪参考', '可辅助临床诊断'],
                ['适用场景', '日常自我觉察', '临床诊断与研究'],
                ['谁来解读', '你自己', '持证心理师/精神科医生'],
                ['能否诊断', '不能', '作为诊断参考之一'],
              ].map(([dim, self, pro], i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300">{dim}</td>
                  <td className="p-4 text-lavender-600">{self}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 常见专业量表科普 */}
        <h2 className="font-display text-2xl text-gray-800 dark:text-gray-100 mb-6">常见的专业心理量表</h2>
        <div className="space-y-4 mb-10">
          {[
            {
              name: 'SAS（焦虑自评量表）',
              desc: '由 Zung 编制，20 题，用于评估主观焦虑程度，是国内最常用的焦虑筛查工具之一。',
              tag: '焦虑',
              tagColor: 'bg-peach-50 dark:bg-peach-950/40 text-peach-500 dark:text-peach-400',
            },
            {
              name: 'SDS（抑郁自评量表）',
              desc: '同样由 Zung 编制，20 题，用于评估抑郁情绪的严重程度，广泛应用于临床和科研。',
              tag: '抑郁',
              tagColor: 'bg-lavender-50 dark:bg-lavender-950/40 text-lavender-500 dark:text-lavender-400',
            },
            {
              name: 'SCL-90（症状自评量表）',
              desc: '90 题，覆盖 9 个因子（躯体化、强迫、人际敏感等），是综合性最强的自评工具。',
              tag: '综合',
              tagColor: 'bg-mint-50 dark:bg-mint-950/40 text-mint-500 dark:text-mint-400',
            },
            {
              name: 'PHQ-9（患者健康问卷）',
              desc: '9 题，快速筛查抑郁症，WHO 推荐的初级保健筛查工具，简洁且有效。',
              tag: '抑郁',
              tagColor: 'bg-lavender-50 dark:bg-lavender-950/40 text-lavender-500 dark:text-lavender-400',
            },
            {
              name: 'GAD-7（广泛性焦虑量表）',
              desc: '7 题，专门筛查广泛性焦虑障碍，灵敏度和特异性都很好。',
              tag: '焦虑',
              tagColor: 'bg-peach-50 dark:bg-peach-950/40 text-peach-500 dark:text-peach-400',
            },
            {
              name: 'PSQI（匹兹堡睡眠质量指数）',
              desc: '评估近一个月的睡眠质量，包含 7 个维度，是睡眠研究的金标准量表。',
              tag: '睡眠',
              tagColor: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400',
            },
          ].map((item) => (
            <div key={item.name} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">{item.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs ${item.tagColor}`}>{item.tag}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 使用建议 */}
        <h2 className="font-display text-2xl text-gray-800 dark:text-gray-100 mb-6">如何正确使用本站测评</h2>
        <div className="space-y-4 mb-10">
          {[
            {
              icon: '✅',
              title: '适合做的事',
              items: [
                '定期（如每周/每月）做一次，观察情绪趋势变化',
                '把它当作"心情打卡"，辅助自我觉察',
                '结合情绪日记一起使用，效果更好',
                '得分偏高时，主动关注自己的状态并采取调节措施',
              ],
            },
            {
              icon: '❌',
              title: '不适合做的事',
              items: [
                '不要把结果当成"诊断书"或给自己贴标签',
                '不要过度解读单次得分，情绪本来就有波动',
                '不要用它来判断"我到底有没有病"',
                '不要用它替代专业的心理咨询或精神科就诊',
              ],
            },
          ].map((section) => (
            <div key={section.title} className="glass-card p-6">
              <h3 className="font-medium text-gray-800 mb-3">{section.icon} {section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="text-sm text-gray-500 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-300 dark:before:text-gray-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 何时需要专业帮助 */}
        <div className="p-6 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800/50 rounded-2xl mb-10">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🏥</span>
            <div>
              <h3 className="font-bold text-red-700 dark:text-red-400 mb-2">什么时候应该去医院？</h3>
              <ul className="space-y-2 text-sm text-red-600 dark:text-red-400 leading-relaxed">
                <li>• 情绪低落、焦虑或失眠<strong>持续超过两周</strong>，且没有好转趋势</li>
                <li>• 出现<strong>躯体化症状</strong>（头痛、胸闷、胃痛等查不出器质性原因）</li>
                <li>• 严重影响日常生活（无法上课/工作、社交退缩、食欲明显变化）</li>
                <li>• 出现<strong>自我伤害念头</strong>或行为</li>
                <li>• 家族中有精神疾病史，近期状态明显异常</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-red-600 border border-red-200">
                  📞 400-161-9995（24h 全国心理援助）
                </span>
                <span className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-red-600 border border-red-200">
                  📞 010-82951332（北京心理危机干预）
                </span>
                <span className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-red-600 border border-red-200">
                  📞 12355 青年热线
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-400 dark:text-gray-500 mb-6">了解了区别后，可以开始体验：</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/assessment" className="btn-primary">开始测评</Link>
            <Link to="/assessment?guide=1" className="btn-soft">先看看免责说明</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
