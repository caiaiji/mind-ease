import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { articles, categories } from '../data/articles'

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let result = activeCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === activeCategory)

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        (a.content && a.content.toLowerCase().includes(q))
      )
    }

    return result
  }, [activeCategory, searchQuery])

  return (
    <div>
      {/* Page Header */}
      <section className="px-6 md:px-12 lg:px-20 pt-12 pb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl text-gray-800 dark:text-gray-100 mb-3">心理文章</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">
            关于焦虑、人际关系、自我成长、睡眠和压力，找到你需要的信息和建议。
          </p>
        </div>
      </section>

      {/* Search + Category Filter */}
      <section className="px-6 md:px-12 lg:px-20 pb-8">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Search bar */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章标题或内容..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-lavender-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-lavender-300 dark:focus:ring-lavender-600 focus:border-transparent transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter */}
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

          {/* Results count */}
          {searchQuery && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              找到 {filtered.length} 篇相关文章
            </p>
          )}
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
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-lavender-50 dark:bg-lavender-900/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
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
              <span className="text-5xl block mb-4">{searchQuery ? '🔍' : '📭'}</span>
              <p className="text-gray-400 dark:text-gray-500">
                {searchQuery ? `没有找到与"${searchQuery}"相关的文章` : '该分类下暂无文章'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-sm text-lavender-500 hover:text-lavender-600 transition-colors"
                >
                  清除搜索
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
