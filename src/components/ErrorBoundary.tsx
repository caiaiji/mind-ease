import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoHome = () => {
    window.location.hash = '#/'
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const isDark = document.documentElement.classList.contains('dark')
    const bg = isDark ? '#1a1a2e' : '#FFFBF5'
    const cardBg = isDark ? 'rgba(30,27,60,0.8)' : 'rgba(255,255,255,0.8)'
    const textColor = isDark ? '#e5e7eb' : '#374151'
    const subColor = isDark ? '#9ca3af' : '#9ca3af'
    const borderColor = isDark ? 'rgba(167,139,250,0.2)' : 'rgba(167,139,250,0.1)'

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: bg,
        fontFamily: '"Noto Sans SC", sans-serif',
      }}>
        <div style={{
          maxWidth: 400,
          textAlign: 'center' as const,
          padding: '2.5rem',
          borderRadius: 20,
          background: cardBg,
          border: `1px solid ${borderColor}`,
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😅</div>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: textColor,
            marginBottom: '0.5rem',
            fontFamily: '"ZCOOL XiaoWei", serif',
          }}>
            页面出了点小问题
          </h2>
          <p style={{
            color: subColor,
            fontSize: '0.875rem',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}>
            抱歉，页面加载时遇到了一个意外错误。
            你可以尝试刷新页面，或者返回首页。
          </p>

          {/* Error detail (collapsed by default) */}
          {this.state.error && (
            <details style={{
              textAlign: 'left' as const,
              marginBottom: '1.5rem',
              borderRadius: 12,
              overflow: 'hidden',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
            }}>
              <summary style={{
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                color: subColor,
                cursor: 'pointer',
                background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
              }}>
                错误详情（开发者用）
              </summary>
              <pre style={{
                padding: '0.75rem 1rem',
                fontSize: '0.7rem',
                color: '#ef4444',
                background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)',
                overflow: 'auto' as const,
                margin: 0,
                lineHeight: 1.5,
                wordBreak: 'break-all' as const,
              }}>
                {this.state.error.message}
              </pre>
            </details>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button onClick={this.handleReset} style={{
              padding: '0.625rem 1.5rem',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.875rem',
              background: isDark ? 'rgba(139,92,246,0.3)' : '#8b5cf6',
              color: '#fff',
            }}>
              重新加载
            </button>
            <button onClick={this.handleGoHome} style={{
              padding: '0.625rem 1.5rem',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.875rem',
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              color: textColor,
            }}>
              返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }
}
