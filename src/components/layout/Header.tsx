import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

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
          <nav className="hidden md:flex items-center gap-1">
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
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-lavender-100 transition-colors"
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
          <nav className="md:hidden pb-4 animate-fade-in">
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
          </nav>
        )}
      </div>
    </header>
  )
}
