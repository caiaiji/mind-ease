import { useState, useCallback } from 'react'

const isDarkMode = () => document.documentElement.classList.contains('dark')

interface Bubble {
  id: number
  popped: boolean
}

const COLS = 10
const ROWS = 8
const TOTAL = COLS * ROWS

const BubbleButton: React.FC<{
  bubble: Bubble
  onPop: (id: number) => void
}> = ({ bubble, onPop }) => {
  const [animating, setAnimating] = useState(false)
  const dark = isDarkMode()

  const handleClick = () => {
    if (bubble.popped) return
    setAnimating(true)
    onPop(bubble.id)
    setTimeout(() => setAnimating(false), 300)
  }

  if (bubble.popped) {
    return (
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          transition: 'all 0.2s ease',
          opacity: 0,
          transform: 'scale(0.7)',
        }}
      />
    )
  }

  const defaultBg = dark ? 'linear-gradient(135deg, #4c1d95, #5b21b6)' : 'linear-gradient(135deg, #DDD6FE, #EDE9FE)'
  const hoverBg = dark ? 'linear-gradient(135deg, #9f1239, #be123c)' : 'linear-gradient(135deg, #FECDD3, #FFE4E6)'
  const borderColor = dark ? 'rgba(139,92,246,0.5)' : 'rgba(167, 139, 250, 0.6)'

  return (
    <button
      onClick={handleClick}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: `2px solid ${borderColor}`,
        background: defaultBg,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: dark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
        transform: animating ? 'scale(1.3)' : 'scale(1)',
        opacity: animating ? 0 : 1,
      }}
      onMouseEnter={(e) => {
        if (!bubble.popped) {
          e.currentTarget.style.background = hoverBg
          e.currentTarget.style.borderColor = '#FDA4AF'
          e.currentTarget.style.transform = 'scale(1.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (!bubble.popped) {
          e.currentTarget.style.background = defaultBg
          e.currentTarget.style.borderColor = borderColor
          e.currentTarget.style.transform = 'scale(1)'
        }
      }}
    />
  )
}

export default function BubblePop() {
  const [bubbles, setBubbles] = useState<Bubble[]>(
    () => Array.from({ length: TOTAL }, (_, i) => ({ id: i, popped: false }))
  )
  const [popCount, setPopCount] = useState(0)
  const dark = isDarkMode()

  const cardBg = dark ? 'rgba(30,27,60,0.6)' : 'rgba(255,255,255,0.6)'
  const cardBorder = dark ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.4)'
  const textMuted = dark ? '#9ca3af' : '#9CA3AF'
  const textPrimary = dark ? '#e5e7eb' : '#374151'

  const pop = useCallback((id: number) => {
    setBubbles((prev) =>
      prev.map((b) => (b.id === id && !b.popped ? { ...b, popped: true } : b))
    )
    setPopCount((c) => c + 1)
  }, [])

  const reset = () => {
    setBubbles(Array.from({ length: TOTAL }, (_, i) => ({ id: i, popped: false })))
    setPopCount(0)
  }

  const progress = Math.round((popCount / TOTAL) * 100)

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
        <div style={{
          background: cardBg, backdropFilter: 'blur(8px)',
          borderRadius: 16, padding: '12px 20px', border: `1px solid ${cardBorder}`,
        }}>
          <div style={{ fontSize: 12, color: textMuted }}>已戳破</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: textPrimary }}>{popCount} / {TOTAL}</div>
        </div>
        <div style={{
          background: cardBg, backdropFilter: 'blur(8px)',
          borderRadius: 16, padding: '12px 20px', border: `1px solid ${cardBorder}`,
        }}>
          <div style={{ fontSize: 12, color: textMuted }}>完成度</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#A78BFA' }}>{progress}%</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 8, background: dark ? 'rgba(139,92,246,0.2)' : '#EDE9FE', borderRadius: 4,
        overflow: 'hidden', maxWidth: 480, margin: '0 auto 32px',
      }}>
        <div style={{
          height: '100%', borderRadius: 4,
          background: 'linear-gradient(90deg, #A78BFA, #6EE7B7)',
          width: `${progress}%`, transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Bubble grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 40px)`,
        gap: 8,
        padding: 20,
        borderRadius: 24,
        background: dark ? 'rgba(30,27,60,0.3)' : 'rgba(237,233,254,0.3)',
        justifyContent: 'center',
        margin: '0 auto',
        width: 'fit-content',
      }}>
        {bubbles.map((bubble) => (
          <BubbleButton key={bubble.id} bubble={bubble} onPop={pop} />
        ))}
      </div>

      {/* Reset */}
      {popCount > 0 && popCount < TOTAL && (
        <div style={{ marginTop: 32 }}>
          <button
            onClick={reset}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '10px 20px', borderRadius: 999,
              background: cardBg, color: '#8B5CF6',
              border: '1px solid rgba(167,139,250,0.3)',
              fontWeight: 500, cursor: 'pointer', fontSize: 14,
            }}
          >
            🔄 重新来一板
          </button>
        </div>
      )}

      {/* Completion */}
      {popCount === TOTAL && (
        <div style={{ marginTop: 24, animation: 'fadeUp 0.6s ease-out forwards' }}>
          <div style={{
            display: 'inline-block', padding: 24,
            background: cardBg, backdropFilter: 'blur(12px)',
            borderRadius: 24, border: `1px solid ${cardBorder}`,
            boxShadow: dark ? '0 10px 25px rgba(0,0,0,0.2)' : '0 10px 25px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
            <div style={{ fontFamily: '"ZCOOL XiaoWei", serif', fontSize: 20, color: textPrimary }}>
              全部戳完了，舒服吧！
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
