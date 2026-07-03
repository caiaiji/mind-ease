import { Link } from 'react-router-dom'
import { articles } from '../data/articles'
import { assessments } from '../data/assessments'

const moodOptions = [
  { emoji: '😊', label: '心情不错', color: 'bg-mint-50 border-mint-200 hover:bg-mint-100' },
  { emoji: '😐', label: '有点平淡', color: 'bg-lavender-50 border-lavender-200 hover:bg-lavender-100' },
  { emoji: '😟', label: '有些焦虑', color: 'bg-peach-50 border-peach-200 hover:bg-peach-100' },
  { emoji: '😔', label: '不太好', color: 'bg-gray-50 border-gray-200 hover:bg-gray-100' },
]

const quotes = [
  '"你不必为了取悦全世界而委屈自己。" —— 每一天都值得温柔以待。',
  '"允许自己不完美，是通往内心平静的第一步。" —— 接纳，就是力量。',
  '"你已经做得很好了，即使你觉得还不够。" —— 温柔地对自己说。',
]

const interactiveTools = [
  { to: '/games', emoji: '🎮', title: '放松游戏', desc: '戳泡泡、种花花园、记忆翻牌、漂浮泡泡、舒尔特方格', bg: 'from-lavender-50 to-mint-50', border: 'border-lavender-100' },
  { to: '/mood-diary', emoji: '📝', title: '情绪日记', desc: '记录每日心情，追踪情绪变化趋势，了解自己', bg: 'from-peach-50 to-lavender-50', border: 'border-peach-100' },
  { to: '/treehole', emoji: '🌳', title: '树洞倾诉', desc: '匿名说出心里话，给情绪一个安全的出口', bg: 'from-mint-50 to-lavender-50', border: 'border-mint-100' },
  { to: '/relax', emoji: '🧘', title: '放松工具', desc: '4-7-8 呼吸法、渐进式放松、正念冥想等减压技巧', bg: 'from-lavender-50 to-peach-50', border: 'border-lavender-100' },
  { to: '/assessment', emoji: '📊', title: '情绪测评', desc: '焦虑自评、压力指数、情绪温度计，了解自己', bg: 'from-mint-50 to-peach-50', border: 'border-mint-100' },
  { to: '/articles', emoji: '📖', title: '心理文章', desc: '焦虑管理、人际关系、自我成长等科普文章', bg: 'from-peach-50 to-mint-50', border: 'border-peach-100' },
]

export default function Home() {
  const todayQuote = quotes[new Date().getDate() % quotes.length]
  const featured = articles.slice(0, 4)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-lavender-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-mint-200/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-peach-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-6xl text-gray-800 mb-6 animate-fade-up">
            给心灵放个假
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 animate-fade-up stagger-1" style={{ opacity: 0 }}>
            这里是属于年轻人的心理健康小站。无论你是在备考、在社交、还是在成长中，
            都可以在这里找到让内心安宁的方法。
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-up stagger-2" style={{ opacity: 0 }}>
            <Link to="/games" className="btn-primary">
              开始放松
            </Link>
            <Link to="/assessment" className="btn-soft">
              测一测我的状态
            </Link>
            <Link to="/mood-diary" className="btn-soft">
              记录今天的心情
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Tools - Featured Section */}
      <section className="px-6 md:px-12 lg:px-20 py-16 bg-white/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">探索心晴驿站</h2>
            <p className="section-subtitle mx-auto">丰富的互动工具，陪你度过每一个需要陪伴的时刻</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {interactiveTools.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className={`glass-card p-6 border ${item.border} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.bg} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {item.emoji}
                </div>
                <h3 className="font-medium text-gray-800 text-lg mb-2 group-hover:text-lavender-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mood Check */}
      <section className="px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="section-title">今天感觉怎么样？</h2>
          <p className="section-subtitle mx-auto">选择一个最接近你当前状态的选项，或者去情绪日记详细记录</p>
        </div>
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {moodOptions.map((mood) => (
            <Link
              key={mood.label}
              to="/assessment"
              className={`glass-card-sm p-6 text-center border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${mood.color}`}
            >
              <span className="text-4xl block mb-3">{mood.emoji}</span>
              <span className="text-sm font-medium text-gray-600">{mood.label}</span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/mood-diary" className="text-sm text-lavender-500 hover:text-lavender-600 transition-colors">
            想要详细追踪情绪变化？打开情绪日记 →
          </Link>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="px-6 md:px-12 lg:px-20 py-16 bg-white/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">精选文章</h2>
            <p className="section-subtitle mx-auto">关于心理健康，你关心的那些话题</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-lavender-50 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {article.coverEmoji}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-800 mb-1 group-hover:text-lavender-500 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-300">
                      <span>{article.readTime} 分钟阅读</span>
                      <span>·</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/articles" className="btn-soft">
              查看更多文章
            </Link>
          </div>
        </div>
      </section>

      {/* Assessment Quick Entry */}
      <section className="px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">快速测评</h2>
            <p className="section-subtitle mx-auto">了解自己的心理状态，是关爱自己的第一步</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assessments.map((a) => (
              <Link
                key={a.id}
                to={`/assessment?type=${a.id}`}
                className="glass-card-sm p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-3xl block mb-3">{a.emoji}</span>
                <h3 className="font-medium text-gray-800 mb-1">{a.title}</h3>
                <p className="text-xs text-gray-400">{a.questions.length} 道题 · 约 {a.questions.length} 分钟</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Crisis Info Banner */}
      <section className="px-6 md:px-12 lg:px-20 py-12 bg-white/40">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-6 md:p-8 border border-red-100 text-center">
            <span className="text-2xl block mb-3">🆘</span>
            <h3 className="font-medium text-gray-800 mb-2">需要专业帮助？</h3>
            <p className="text-sm text-gray-500 mb-4">
              如果你或身边的人正在经历心理危机，请及时寻求专业帮助。
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="px-4 py-2 bg-red-50 text-red-600 rounded-full font-medium">
                全国24小时心理危机热线：400-161-9995
              </span>
              <span className="px-4 py-2 bg-lavender-50 text-lavender-600 rounded-full font-medium">
                北京心理危机研究与干预中心：010-82951332
              </span>
              <span className="px-4 py-2 bg-mint-50 text-mint-600 rounded-full font-medium">
                希望24热线：400-161-9995
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-4">
              本站内容仅供心理健康科普参考，不构成专业心理咨询或诊断建议。
            </p>
          </div>
        </div>
      </section>

      {/* Daily Quote */}
      <section className="px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center">
            <span className="text-4xl block mb-6">💫</span>
            <blockquote className="font-display text-xl md:text-2xl text-gray-700 leading-relaxed">
              {todayQuote}
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  )
}
