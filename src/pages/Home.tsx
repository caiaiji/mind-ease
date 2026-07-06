import { Link } from 'react-router-dom'
import { useState } from 'react'
import FirstTimeGuide from '../components/FirstTimeGuide'
import { articles } from '../data/articles'

const quotes = [
  '"你不必为了取悦全世界而委屈自己。" —— 每一天都值得温柔以待。',
  '"允许自己不完美，是通往内心平静的第一步。" —— 接纳，就是力量。',
  '"你已经做得很好了，即使你觉得还不够。" —— 温柔地对自己说。',
]

const coreTools = [
  { to: '/games', emoji: '🎮', title: '放松一下', desc: '戳泡泡、种花、记忆翻牌，让大脑休息片刻', bg: 'from-lavender-50 to-mint-50 dark:from-lavender-950/50 dark:to-mint-950/50', border: 'border-lavender-100 dark:border-lavender-800/50' },
  { to: '/mood-diary', emoji: '📝', title: '记录心情', desc: '写下今天的感觉，追踪情绪变化', bg: 'from-peach-50 to-lavender-50 dark:from-peach-950/50 dark:to-lavender-950/50', border: 'border-peach-100 dark:border-peach-800/50' },
  { to: '/treehole', emoji: '🌳', title: '树洞倾诉', desc: '匿名说出心里话，这里没有人会评判你', bg: 'from-mint-50 to-lavender-50 dark:from-mint-950/50 dark:to-lavender-950/50', border: 'border-mint-100 dark:border-mint-800/50' },
  { to: '/articles', emoji: '📖', title: '心理文章', desc: '关于情绪、成长和关系的科普内容', bg: 'from-peach-50 to-mint-50 dark:from-peach-950/50 dark:to-mint-950/50', border: 'border-peach-100 dark:border-peach-800/50' },
]

const moreTools = [
  { to: '/relax', emoji: '🧘', title: '放松工具' },
  { to: '/assessment', emoji: '📊', title: '情绪测评' },
  { to: '/exam-prep', emoji: '📚', title: '考前专题' },
  { to: '/dashboard', emoji: '📈', title: '情绪仪表盘' },
  { to: '/checkin', emoji: '📅', title: '每日打卡' },
  { to: '/weekly-insight', emoji: '📊', title: '情绪周报' },
]

export default function Home() {
  const todayQuote = quotes[new Date().getDate() % quotes.length]
  const featured = articles.slice(0, 3)

  const hour = new Date().getHours()
  const greeting = hour < 6 ? '夜深了，注意休息' : hour < 11 ? '早安，新的一天开始了' : hour < 14 ? '午安，别忘了放松一下' : hour < 18 ? '下午好，辛苦了' : hour < 22 ? '晚上好，今天过得怎么样' : '夜深了，注意休息'

  const [showMore, setShowMore] = useState(false)

  return (
    <div>
      {/* Hero Section - Minimal */}
      <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lavender-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-mint-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-base md:text-lg text-lavender-500 dark:text-lavender-400 mb-3 animate-fade-up font-medium">
            {greeting}
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-gray-800 dark:text-gray-100 mb-5 animate-fade-up">
            给心灵放个假
          </h1>
          <p className="text-base md:text-lg text-gray-400 dark:text-gray-500 max-w-xl mx-auto animate-fade-up stagger-1" style={{ opacity: 0 }}>
            不评判，不说教，只是陪你待一会儿。
          </p>
        </div>
      </section>

      {/* First Time Guide - Prominent */}
      <section className="px-6 md:px-12 lg:px-20 pb-6">
        <FirstTimeGuide />
      </section>

      {/* Core Tools - Only 4 essential ones */}
      <section className="px-6 md:px-12 lg:px-20 py-12 bg-white/40 dark:bg-gray-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {coreTools.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className={`glass-card p-5 border ${item.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.bg} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                  {item.emoji}
                </div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm mb-1 group-hover:text-lavender-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>

          {/* Expandable more tools */}
          {!showMore ? (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowMore(true)}
                className="text-sm text-lavender-400 dark:text-lavender-500 hover:text-lavender-500 transition-colors"
              >
                还有更多工具 ▾
              </button>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3 animate-fade-up">
              {moreTools.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="glass-card-sm p-4 text-center transition-all duration-200 hover:-translate-y-0.5 group"
                >
                  <span className="text-2xl block mb-2">{item.emoji}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-lavender-500 transition-colors">{item.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Articles - 3 instead of 4 */}
      <section className="px-6 md:px-12 lg:px-20 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">精选文章</h2>
            <Link to="/articles" className="text-sm text-lavender-400 hover:text-lavender-500 transition-colors">
              查看全部 →
            </Link>
          </div>
          <div className="space-y-4">
            {featured.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="glass-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-lavender-50 dark:bg-lavender-900/40 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  {article.coverEmoji}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-1 text-sm group-hover:text-lavender-500 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-1">
                    {article.summary}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-300 dark:text-gray-600">
                    <span>{article.readTime} 分钟</span>
                    <span>·</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Crisis Banner - Compact */}
      <section className="px-6 md:px-12 lg:px-20 py-10 bg-white/40 dark:bg-gray-900/40">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-5 border border-red-100 dark:border-red-900/50">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="text-red-500 dark:text-red-400 font-medium">🆘 需要帮助？</span>
              <span className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full">400-161-9995</span>
              <span className="px-3 py-1.5 bg-lavender-50 dark:bg-lavender-950/40 text-lavender-600 dark:text-lavender-400 rounded-full">010-82951332</span>
              <span className="px-3 py-1.5 bg-mint-50 dark:bg-mint-950/40 text-mint-600 dark:text-mint-400 rounded-full">12355</span>
            </div>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-2 text-center">
              本站内容仅供科普参考，不能替代专业心理咨询或治疗
            </p>
          </div>
        </div>
      </section>

      {/* Daily Quote - Compact */}
      <section className="px-6 md:px-12 lg:px-20 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 text-center">
            <blockquote className="font-display text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {todayQuote}
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  )
}
