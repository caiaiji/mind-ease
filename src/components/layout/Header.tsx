import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/articles', label: '心理文章' },
  { path: '/assessment', label: '情绪测评' },
  { path: '/relax', label: '放松工具' },
  { path: '/games', label: '放松游戏' },
  { path: '/mood-diary', label: '情绪日记' },
  { path: '/treehole', label: '树洞倾诉' },
  { path: '/about', label: '关于' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isLogin, isAdmin } = useUser()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-lg border-b border-lavender-100/50">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-2xl">🌤</span>
            <span className="font-display text-xl text-gray-800">心晴驿站</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'bg-lavender-100 text-lavender-600'
                    : 'text-gray-500 hover:text-lavender-500 hover:bg-lavender-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Button */}
            {isAdmin && (
              <Link
                to="/admin"
                className="ml-1 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 transition-all"
              >
                👑 管理后台
              </Link>
            )}

            {/* User Avatar / Login Button */}
            {isLogin && user ? (
              <Link
                to="/profile"
                className="ml-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-lavender-50 border border-lavender-100 hover:bg-lavender-100 transition-all"
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
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-lavender-100 transition-colors"
            aria-label="菜单"
          >
            <svg
              className="w-6 h-6 text-gray-600"
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
                    ? 'bg-lavender-100 text-lavender-600'
                    : 'text-gray-500 hover:bg-lavender-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile User Section */}
            <div className="border-t border-lavender-100/50 mt-2 pt-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-50 text-amber-600 font-medium mb-2"
                >
                  👑 管理后台
                </Link>
              )}
              {isLogin && user ? (
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-lavender-50"
                >
                  <span className="text-2xl">{user.avatar}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{user.nickname}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
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
