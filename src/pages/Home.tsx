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

export default function Home() {
  const todayQuote = quotes[new Date().getDate() % quotes.length]
  const featured = articles.slice(0, 3)

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
            <Link to="/articles" className="btn-primary">
              开始探索
            </Link>
            <Link to="/assessment" className="btn-soft">
              测一测我的状态
            </Link>
          </div>
        </div>
      </section>

      {/* Mood Check */}
      <section className="px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="section-title">今天感觉怎么样？</h2>
          <p className="section-subtitle mx-auto">选择一个最接近你当前状态的选项，获取对应的建议</p>
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
      </section>

      {/* Featured Articles */}
      <section className="px-6 md:px-12 lg:px-20 py-16 bg-white/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">精选文章</h2>
            <p className="section-subtitle mx-auto">关于心理健康，你关心的那些话题</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="w-14 h-14 rounded-2xl bg-lavender-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {article.coverEmoji}
                </div>
                <h3 className="font-medium text-gray-800 mb-2 group-hover:text-lavender-500 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                  {article.summary}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-300">
                  <span>{article.readTime} 分钟阅读</span>
                  <span>·</span>
                  <span>{article.date}</span>
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

      {/* Feature Navigation */}
      <section className="px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">探索更多</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { to: '/articles', emoji: '📖', title: '心理文章', desc: '焦虑管理、人际关系、自我成长等科普文章', bg: 'bg-lavender-50' },
              { to: '/assessment', emoji: '📊', title: '情绪测评', desc: '焦虑自评、压力指数、情绪温度计', bg: 'bg-mint-50' },
              { to: '/relax', emoji: '🧘', title: '放松工具', desc: '呼吸练习、冥想引导、自助减压技巧', bg: 'bg-peach-50' },
            ].map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="glass-card p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
              >
                <div className={`w-16 h-16 rounded-full ${item.bg} flex items-center justify-center text-3xl mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                  {item.emoji}
                </div>
                <h3 className="font-medium text-gray-800 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Quick Entry */}
      <section className="px-6 md:px-12 lg:px-20 py-16 bg-white/40">
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
