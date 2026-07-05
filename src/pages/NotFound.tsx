import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 opacity-20 select-none">404</div>
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
          页面走丢了
        </h1>
        <p className="text-gray-400 dark:text-gray-500 mb-8 leading-relaxed">
          你访问的页面不存在或已被移动。<br />
          别担心，迷路也是一种探索。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="px-6 py-2.5 bg-lavender-500 hover:bg-lavender-600 text-white rounded-xl font-medium transition-colors"
          >
            回到首页
          </Link>
          <Link
            to="/articles"
            className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-medium transition-colors"
          >
            看看文章
          </Link>
        </div>
      </div>
    </div>
  )
}
