import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { useTheme } from '../../contexts/ThemeContext'

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/articles', label: '心理文章' },
  { path: '/assessment', label: '情绪测评' },
  { path: '/relax', label: '放松工具' },
  { path: '/games', label: '放松游戏' },
  { path: '/mood-diary', label: '情绪日记' },
  { path: '/treehole', label: '树洞倾诉' },
  { path: '/checkin', label: '每日打卡' },
  { path: '/exam-prep', label: '📚 考前专题' },
  { path: '/weekly-insight', label: '📊 情绪周报' },
  { path: '/dashboard', label: '情绪仪表盘' },
  { path: '/about', label: '关于' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isLogin, isAdmin } = useUser()
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-lg border-b border-lavender-100/50 dark:border-gray-700/50" style={resolvedTheme === 'dark' ? { backgroundColor: 'rgba(26,26,46,0.85)' } : undefined}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-2xl">🌤</span>
            <span className="font-display text-xl text-gray-800 dark:text-gray-100">心晴驿站</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'bg-lavender-100 dark:bg-lavender-900/40 text-lavender-600 dark:text-lavender-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-lavender-500 hover:bg-lavender-50 dark:hover:bg-lavender-900/40'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Button */}
            {isAdmin && (
              <Link
                to="/admin"
                className="ml-1 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all"
              >
                👑 管理后台
              </Link>
            )}

            {/* User Avatar / Login Button */}
            {isLogin && user ? (
              <Link
                to="/profile"
                className="ml-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-lavender-50 dark:bg-lavender-900/40 border border-lavender-100 dark:border-lavender-800/50 hover:bg-lavender-100 dark:hover:bg-lavender-900/60 transition-all"
              >
                <span className="text-lg">{user.avatar}</span>
                <span className="text-sm font-medium text-lavender-600">{user.nickname}</span>
              </Link>
            ) : (
              <Link
                to="/profile"
                className="ml-2 px-4 py-1.5 rounded-full text-sm font-medium bg-lavender-500 text-white hover:bg-lavender-600 transition-all"
              >
                注册 / 登录
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full hover:bg-lavender-100 dark:hover:bg-lavender-500/20 transition-colors"
              aria-label={resolvedTheme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
              title={resolvedTheme === 'dark' ? '浅色模式' : '深色模式'}
            >
              {resolvedTheme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-lavender-100 dark:hover:bg-lavender-500/20 transition-colors"
            aria-label="菜单"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="lg:hidden pb-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-lavender-100 dark:bg-lavender-900/40 text-lavender-600 dark:text-lavender-400'
                    : 'text-gray-500 hover:bg-lavender-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile User Section */}
            
              {/* Mobile Theme Toggle */}
              <button
                onClick={() => { toggleTheme() }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-lavender-50 dark:bg-lavender-900/40 hover:bg-lavender-100 dark:hover:bg-lavender-900/60 transition-all"
              >
                <span className="text-xl">{resolvedTheme === 'dark' ? '☀️' : '🌙'}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {resolvedTheme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
                </span>
              </button>
              <div className="border-t border-lavender-100/50 dark:border-gray-700/50 mt-2 pt-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-medium mb-2"
                >
                  👑 管理后台
                </Link>
              )}
              {isLogin && user ? (
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-lavender-50 dark:bg-lavender-900/40"
                >
                  <span className="text-2xl">{user.avatar}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{user.nickname}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{user.email}</div>
                  </div>
                </Link>
              ) : (
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-2xl bg-lavender-500 text-white text-center font-medium"
                >
                  注册 / 登录
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
