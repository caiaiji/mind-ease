import { useState } from 'react'
import { Link } from 'react-router-dom'
import { articles, categories } from '../data/articles'

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter((a) => a.category === activeCategory)

  return (
    <div>
      {/* Page Header */}
      <section className="px-6 md:px-12 lg:px-20 pt-12 pb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl text-gray-800 dark:text-gray-100 mb-3">心理文章</h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            关于焦虑、人际关系、自我成长、睡眠和压力，找到你需要的信息和建议。
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 md:px-12 lg:px-20 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-lavender-400 dark:bg-lavender-500 text-white shadow-md'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 hover:bg-lavender-50 dark:hover:bg-lavender-950/50 hover:text-lavender-500 border border-lavender-100 dark:border-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="px-6 md:px-12 lg:px-20 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group flex gap-5"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-lavender-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {article.coverEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-1 group-hover:text-lavender-500 transition-colors truncate">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2 mb-3">
                    {article.summary}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-300 dark:text-gray-600">
                    <span className={`px-2 py-0.5 rounded-full bg-lavender-50 dark:bg-lavender-900/40 text-lavender-500 dark:text-lavender-400`}>
                      {categories.find((c) => c.id === article.category)?.label}
                    </span>
                    <span>{article.readTime} 分钟</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">📭</span>
              <p className="text-gray-400 dark:text-gray-500">该分类下暂无文章</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
