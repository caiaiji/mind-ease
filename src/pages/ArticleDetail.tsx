import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useParams, Link } from 'react-router-dom'
import { articles, categories } from '../data/articles'

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const article = articles.find((a) => a.id === id)
  useDocumentTitle(article?.title)


  if (!article) {
    return (
      <div className="px-6 md:px-12 lg:px-20 py-32 text-center">
        <span className="text-6xl block mb-6">📭</span>
        <h2 className="font-display text-2xl text-gray-800 dark:text-gray-100 mb-3">文章未找到</h2>
        <p className="text-gray-400 dark:text-gray-500 mb-8">你访问的文章不存在或已被移除</p>
        <Link to="/articles" className="btn-primary">返回文章列表</Link>
      </div>
    )
  }

  const related = articles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3)

  const categoryLabel = categories.find((c) => c.id === article.category)?.label

  // Parse markdown-like content into paragraphs
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, i) => {
      if (block.startsWith('**') && block.endsWith('**')) {
        return (
          <h2 key={i} className="font-display text-xl md:text-2xl text-gray-800 dark:text-gray-100 mt-8 mb-4">
            {block.replace(/\*\*/g, '')}
          </h2>
        )
      }
      if (block.startsWith('**')) {
        const text = block.replace(/\*\*/g, '')
        const [heading, ...rest] = text.split('\n')
        return (
          <div key={i} className="mb-6">
            {heading && (
              <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2">{heading}</h3>
            )}
            {rest.map((line, j) => (
              <p key={j} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{line}</p>
            ))}
          </div>
        )
      }
      if (block.startsWith('- ')) {
        return (
          <ul key={i} className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-6 ml-4">
            {block.split('\n').map((line, j) => (
              <li key={j}>{line.replace('- ', '')}</li>
            ))}
          </ul>
        )
      }
      return (
        <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{block}</p>
      )
    })
  }

  return (
    <div>
      {/* Article Header */}
      <section className="px-6 md:px-12 lg:px-20 pt-12 pb-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/articles" className="text-sm text-lavender-400 dark:text-lavender-300 hover:text-lavender-500 transition-colors mb-6 inline-block">
            ← 返回文章列表
          </Link>
          <div className="flex items-center gap-3 mb-4">
            {categoryLabel && (
              <span className="px-3 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/40 text-lavender-500 dark:text-lavender-400 text-xs font-medium">
                {categoryLabel}
              </span>
            )}
            <span className="text-xs text-gray-300 dark:text-gray-600">{article.readTime} 分钟阅读</span>
            <span className="text-xs text-gray-300">{article.date}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-gray-800 dark:text-gray-100 mb-4">
            {article.title}
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-lg">{article.summary}</p>
        </div>
      </section>

      {/* Article Content */}
      <section className="px-6 md:px-12 lg:px-20 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <div className="animate-fade-in">
              {renderContent(article.content)}
            </div>
          </div>

          {/* References */}
          {article.references && article.references.length > 0 && (
            <div className="mt-8 p-6 rounded-xl bg-lavender-50/60 dark:bg-gray-800/60 border border-lavender-200/40 dark:border-gray-700/40">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                参考文献与延伸阅读
              </h3>
              <ol className="space-y-2">
                {article.references.map((ref, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-4 border-l-2 border-lavender-200 dark:border-gray-600 ml-1">
                    {ref}
                  </li>
                ))}
              </ol>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                以上参考文献仅供学习参考，不构成专业诊断或治疗建议。如有需要，请咨询专业人士。
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="px-6 md:px-12 lg:px-20 pb-20 bg-white/40 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title mb-8 dark:!text-gray-100">推荐阅读</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((a) => (
                <Link
                  key={a.id}
                  to={`/articles/${a.id}`}
                  className="glass-card-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                >
                  <span className="text-2xl block mb-3">{a.coverEmoji}</span>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm mb-1 group-hover:text-lavender-500 transition-colors line-clamp-2">
                    {a.title}
                  </h3>
                  <span className="text-xs text-gray-300 dark:text-gray-600">{a.readTime} 分钟阅读</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
