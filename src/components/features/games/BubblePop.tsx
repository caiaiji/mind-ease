import { useState, useCallback } from 'react'

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

  return (
    <button
      onClick={handleClick}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '2px solid rgba(167, 139, 250, 0.6)',
        background: 'linear-gradient(135deg, #DDD6FE, #EDE9FE)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transform: animating ? 'scale(1.3)' : 'scale(1)',
        opacity: animating ? 0 : 1,
      }}
      onMouseEnter={(e) => {
        if (!bubble.popped) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #FECDD3, #FFE4E6)'
          e.currentTarget.style.borderColor = '#FDA4AF'
          e.currentTarget.style.transform = 'scale(1.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (!bubble.popped) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #DDD6FE, #EDE9FE)'
          e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.6)'
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
          background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
          borderRadius: 16, padding: '12px 20px', border: '1px solid rgba(255,255,255,0.4)',
        }}>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>已戳破</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#374151' }}>{popCount} / {TOTAL}</div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
          borderRadius: 16, padding: '12px 20px', border: '1px solid rgba(255,255,255,0.4)',
        }}>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>完成度</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#A78BFA' }}>{progress}%</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 8, background: '#EDE9FE', borderRadius: 4,
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
        background: 'rgba(237,233,254,0.3)',
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
              background: 'rgba(255,255,255,0.6)', color: '#8B5CF6',
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
            background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
            borderRadius: 24, border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
            <div style={{ fontFamily: '"ZCOOL XiaoWei", serif', fontSize: 20, color: '#374151' }}>
              全部戳完了，舒服吧！
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
