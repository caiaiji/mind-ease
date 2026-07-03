import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-5xl block mb-6">🌤</span>
          <h1 className="font-display text-3xl md:text-4xl text-gray-800 mb-4">关于心晴驿站</h1>
          <p className="text-gray-500 text-lg">一个为年轻人打造的心理健康小站</p>
        </div>

        {/* Mission */}
        <div className="glass-card p-8 md:p-10 mb-8">
          <h2 className="font-display text-xl text-gray-800 mb-4">我们的使命</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              心晴驿站诞生于一个简单的想法：每个年轻人都应该有一个可以安心倾诉和自我关怀的地方。
            </p>
            <p>
              作为学生，我们面对考试压力、社交焦虑、身份认同、未来迷茫……这些情绪是真实的，
              但往往没有人告诉我们该怎么处理。
            </p>
            <p>
              我们希望用简单、温暖的方式，提供科学的心理健康知识和实用的自助工具，
              让关心心理状态变成一件自然的事，而不是难以启齿的秘密。
            </p>
          </div>
        </div>

        {/* What we offer */}
        <div className="glass-card p-8 md:p-10 mb-8">
          <h2 className="font-display text-xl text-gray-800 mb-4">我们提供什么</h2>
          <div className="space-y-6">
            {[
              { emoji: '📖', title: '心理科普文章', desc: '涵盖焦虑管理、人际关系、自我成长、睡眠改善、亲子边界、恋爱内耗等 10+ 篇科普内容，基于循证心理学研究。', to: '/articles' },
              { emoji: '📊', title: '情绪自评工具', desc: '3 种轻量化心理自测量表，测评结果自动保存，支持历史记录和趋势追踪。', to: '/assessment' },
              { emoji: '🧘', title: '放松练习引导', desc: '4-7-8 呼吸法、渐进式肌肉放松、正念冥想、五行放松法等 6 种科学验证的放松方法。', to: '/relax' },
              { emoji: '📝', title: '情绪日记', desc: '每日心情记录，5 级情绪评估 + 标签 + 笔记，自动生成情绪趋势图，追踪长期情绪变化。', to: '/mood-diary' },
              { emoji: '🌳', title: '树洞倾诉', desc: '匿名留言板，安全倾诉内心想法，支持点赞和回复，给情绪一个温暖的出口。', to: '/treehole' },
              { emoji: '🎮', title: '放松小游戏', desc: '戳泡泡、种花花园、记忆翻牌、漂浮泡泡、舒尔特方格 5 款减压小游戏，含排行榜功能。', to: '/games' },
            ].map((item) => (
              <Link key={item.title} to={item.to} className="flex gap-4 group">
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1 group-hover:text-lavender-500 transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Disclaimer - Prominent */}
        <div className="glass-card p-8 md:p-10 mb-8 border-2 border-amber-200 bg-amber-50/50">
          <h2 className="font-display text-xl text-gray-800 mb-4 flex items-center gap-2">
            <span>⚠️</span> 重要声明
          </h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>
              <strong>本站内容仅供心理健康科普和日常自我觉察参考，不构成专业心理咨询或诊断建议。</strong>
            </p>
            <p>
              我们提供的测评工具基于常见心理量表的简化版本，其结果<strong>不能替代专业的心理评估</strong>。
              测评结果不具备临床诊断效力，不应将测评得分等同于心理健康状况的判定。
            </p>
            <p>
              本站文章参考了心理学研究文献和公开资料，但我们<strong>不保证内容的绝对准确性和完整性</strong>。
              建议读者结合自身情况理性参考，如有疑问请咨询专业心理咨询师。
            </p>
            <div className="mt-4 p-4 bg-white rounded-2xl border border-amber-200">
              <p className="font-medium text-amber-700 mb-2">以下情况请立即寻求专业帮助，而非依赖本站：</p>
              <ul className="space-y-1 text-amber-600 list-disc list-inside">
                <li>持续两周以上的情绪低落或兴趣丧失</li>
                <li>频繁的焦虑发作、恐慌或过度担忧</li>
                <li>睡眠严重障碍（失眠或嗜睡超过两周）</li>
                <li>出现自我伤害或自杀念头</li>
                <li>进食障碍（暴食或厌食）</li>
                <li>任何影响日常生活的心理困扰</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Crisis Resources - Expanded */}
        <div className="glass-card p-8 md:p-10 mb-8 bg-red-50/50 border border-red-100">
          <h2 className="font-display text-xl text-gray-800 mb-2 flex items-center gap-2">
            <span>🆘</span> 心理危机求助资源
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            如果你或身边的人正在经历心理危机，请立即拨打以下热线。这些热线由专业机构运营，提供免费、保密的心理支持。
          </p>
          <div className="space-y-3">
            {[
              { name: '全国心理援助热线', phone: '400-161-9995', hours: '24 小时', desc: '国家卫健委设立的全国性心理援助热线' },
              { name: '北京心理危机研究与干预中心', phone: '010-82951332', hours: '24 小时', desc: '国内最早的心理危机干预专业机构' },
              { name: '希望24热线', phone: '400-161-9995', hours: '24 小时', desc: '专注于自杀预防和危机干预' },
              { name: '生命热线', phone: '400-821-1215', hours: '每天 8:00-22:00', desc: '提供心理支持与危机干预服务' },
              { name: '共青团中央心理咨询热线', phone: '12355', hours: '每天 9:00-21:00', desc: '面向青少年的心理咨询和法律援助' },
            ].map((resource) => (
              <div key={resource.name} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-red-50">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{resource.name}</p>
                  <p className="text-xs text-gray-400">{resource.hours} · {resource.desc}</p>
                </div>
                <span className="font-mono text-red-500 font-bold text-lg">{resource.phone}</span>
              </div>
            ))}
          </div>

          {/* In-person help */}
          <div className="mt-6 p-4 bg-white rounded-2xl border border-red-50">
            <p className="font-medium text-gray-700 text-sm mb-2">🏥 线下就医指引</p>
            <ul className="space-y-1.5 text-sm text-gray-500">
              <li>• <strong>三甲医院</strong>心理科/精神科：挂心理科或精神科门诊号，由专业医师评估诊断</li>
              <li>• <strong>高校心理咨询中心</strong>：在校学生可免费预约校内心理咨询师</li>
              <li>• <strong>社区卫生服务中心</strong>：部分社区提供免费或低价心理咨询服务</li>
              <li>• <strong>专业心理咨询机构</strong>：选择持有心理咨询师资质认证的咨询师（中国心理学会注册系统）</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-6">你不是一个人在面对这些。</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/articles" className="btn-primary">浏览文章</Link>
            <Link to="/assessment" className="btn-soft">情绪测评</Link>
            <Link to="/mood-diary" className="btn-soft">记录心情</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
