import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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

  // Markdown component overrides matching site design
  const mdComponents: any = {
    h1: ({ children }: any) => <h1 className="font-display text-2xl md:text-3xl text-gray-800 dark:text-gray-100 mt-10 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="font-display text-xl md:text-2xl text-gray-800 dark:text-gray-100 mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-display text-lg md:text-xl text-gray-800 dark:text-gray-100 mt-6 mb-3">{children}</h3>,
    p: ({ children }: any) => <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-6 ml-2">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-6 ml-2">{children}</ol>,
    li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-lavender-300 dark:border-lavender-600 pl-4 py-1 my-6 bg-lavender-50/50 dark:bg-lavender-950/20 rounded-r-lg italic text-gray-500 dark:text-gray-400">{children}</blockquote>
    ),
    strong: ({ children }: any) => <strong className="text-gray-800 dark:text-gray-200 font-semibold">{children}</strong>,
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead className="bg-lavender-100 dark:bg-lavender-900/30">{children}</thead>,
    th: ({ children }: any) => <th className="border border-lavender-200 dark:border-gray-700 px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 font-medium">{children}</th>,
    td: ({ children }: any) => <td className="border border-lavender-200 dark:border-gray-700 px-4 py-2.5 text-gray-600 dark:text-gray-400">{children}</td>,
    hr: () => <hr className="border-lavender-200 dark:border-gray-700 my-8" />,
    a: ({ href, children }: any) => <a href={href} className="text-purple-600 dark:text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
    code: ({ children }: any) => (
      <code className="bg-lavender-100 dark:bg-lavender-900/40 px-1.5 py-0.5 rounded text-sm text-gray-700 dark:text-gray-300">{children}</code>
    ),
    pre: ({ children }: any) => (
      <pre className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 overflow-x-auto mb-6 text-sm text-gray-700 dark:text-gray-300">{children}</pre>
    ),
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
              <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
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
