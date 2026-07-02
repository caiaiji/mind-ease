import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-5xl block mb-6">🌤</span>
          <h1 className="font-display text-3xl md:text-4xl text-gray-800 mb-4">关于心晴驿站</h1>
          <p className="text-gray-500 text-lg">
            一个为年轻人打造的心理健康小站
          </p>
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
              {
                emoji: '📖',
                title: '心理科普文章',
                desc: '基于心理学研究和循证实践，撰写关于焦虑、压力、人际关系、睡眠等话题的科普内容。',
              },
              {
                emoji: '📊',
                title: '情绪自评工具',
                desc: '提供轻量级的心理自测量表，帮助你快速了解自己的情绪状态，并获得相应的建议。',
              },
              {
                emoji: '🧘',
                title: '放松练习引导',
                desc: '呼吸练习、正念冥想、渐进性肌肉放松等科学验证的放松方法，配有详细的步骤说明。',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="glass-card p-8 md:p-10 mb-8 bg-peach-50/50">
          <h2 className="font-display text-xl text-gray-800 mb-4">重要声明</h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>
              <strong>本站内容仅供参考和学习用途，不构成专业心理咨询或诊断建议。</strong>
            </p>
            <p>
              我们提供的测评工具基于常见的心理量表简化而来，其结果不能替代专业的心理评估。
              如果你正在经历严重的心理困扰，请及时寻求专业帮助。
            </p>
            <p>
              本站文章内容参考了心理学研究和公开资料，但我们不能保证内容的绝对准确性和完整性。
              建议读者结合自身情况理性参考。
            </p>
          </div>
        </div>

        {/* Crisis Resources */}
        <div className="glass-card p-8 md:p-10 mb-8 bg-lavender-50/50">
          <h2 className="font-display text-xl text-gray-800 mb-4">心理健康资源与热线</h2>
          <p className="text-gray-500 text-sm mb-6">
            如果你或身边的人正在经历心理危机，请拨打以下热线获取帮助：
          </p>
          <div className="space-y-4">
            {[
              { name: '全国心理援助热线', phone: '400-161-9995', hours: '24 小时' },
              { name: '北京心理危机研究与干预中心', phone: '010-82951332', hours: '24 小时' },
              { name: '生命热线', phone: '400-821-1215', hours: '每天 8:00-22:00' },
              { name: '希望24热线', phone: '400-161-9995', hours: '24 小时' },
              { name: '共青团中央心理咨询热线', phone: '12355', hours: '每天 9:00-21:00' },
            ].map((resource) => (
              <div key={resource.name} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{resource.name}</p>
                  <p className="text-xs text-gray-400">{resource.hours}</p>
                </div>
                <span className="font-mono text-lavender-500 font-medium">{resource.phone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-6">你不是一个人在面对这些。</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/articles" className="btn-primary">
              浏览文章
            </Link>
            <Link to="/assessment" className="btn-soft">
              情绪测评
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
