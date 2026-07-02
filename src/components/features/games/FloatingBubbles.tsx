import { useState, useRef, useEffect, useCallback } from 'react'

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  color: string
  opacity: number
  speed: number
  wobble: number
  wobbleSpeed: number
}

const COLORS = ['#A78BFA', '#6EE7B7', '#FDA4AF', '#93C5FD', '#C084FC', '#F9A8D4', '#67E8F9']
export default function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const nextId = useRef(0)
  const animRef = useRef<ReturnType<typeof requestAnimationFrame>>()
  const prevTime = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showHint, setShowHint] = useState(true)

  const addBubble = useCallback((clientX?: number, clientY?: number) => {
    if (showHint) setShowHint(false)
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = clientX ? clientX - rect.left : Math.random() * rect.width
    const y = clientY ? clientY - rect.top : rect.height - 30
    const size = 24 + Math.random() * 50
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    setBubbles((prev) => [...prev, {
      id: nextId.current++, x, y, size, color,
      opacity: 0.7 + Math.random() * 0.3,
      speed: 0.5 + Math.random() * 1.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
    }])
  }, [showHint])

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const touches = 'touches' in e ? e.touches : null
    const cx = touches ? touches[0]?.clientX : (e as React.MouseEvent).clientX
    const cy = touches ? touches[0]?.clientY : (e as React.MouseEvent).clientY
    if (cx !== undefined && cy !== undefined) addBubble(cx, cy)
  }, [addBubble])

  useEffect(() => {
    const animate = (time: number) => {
      const delta = prevTime.current ? (time - prevTime.current) / 16 : 1
      prevTime.current = time
      setBubbles((prev) =>
        prev
          .map((b) => ({
            ...b,
            y: b.y - b.speed * delta,
            wobble: b.wobble + b.wobbleSpeed * delta,
            x: b.x + Math.sin(b.wobble) * 0.5,
            opacity: b.opacity - 0.002 * delta,
          }))
          .filter((b) => b.y + b.size > -50 && b.opacity > 0)
      )
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  const clearAll = () => { setBubbles([]); setShowHint(true) }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
          borderRadius: 16, padding: '12px 20px', border: '1px solid rgba(255,255,255,0.4)',
        }}>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>泡泡数</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#374151' }}>{bubbles.length}</div>
        </div>
        <button onClick={clearAll} style={{
          padding: '10px 20px', borderRadius: 999, fontSize: 14,
          background: 'rgba(255,255,255,0.6)', color: '#8B5CF6',
          border: '1px solid rgba(167,139,250,0.3)', fontWeight: 500, cursor: 'pointer',
        }}>🌊 清空</button>
      </div>

      <div
        ref={containerRef}
        onClick={handleInteraction}
        onMouseMove={(e) => { if (e.buttons === 1) addBubble(e.clientX, e.clientY) }}
        onTouchMove={handleInteraction}
        style={{
          width: '100%', height: 450, borderRadius: 24, overflow: 'hidden',
          cursor: 'crosshair', userSelect: 'none', position: 'relative',
          background: 'linear-gradient(180deg, #EDE9FE 0%, #D1FAE5 40%, #FDE68A 70%, #FBCFE8 100%)',
        }}
      >
        {showHint && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          }}>
            <div style={{
              padding: '16px 24px', borderRadius: 16,
              background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.4)',
              animation: 'float 6s ease-in-out infinite',
            }}>
              <p style={{ color: '#6B7280', fontSize: 14 }}>点击或拖动屏幕，创造泡泡 🫧</p>
            </div>
          </div>
        )}

        {bubbles.map((b) => {
          return (
            <div key={b.id} style={{
              position: 'absolute', borderRadius: '50%',
              width: b.size, height: b.size,
              left: b.x - b.size / 2, top: b.y - b.size / 2,
              opacity: b.opacity, pointerEvents: 'none',
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, ${b.color}33 50%, ${b.color}66 100%)`,
              boxShadow: `0 0 ${b.size * 0.3}px ${b.color}22`,
            }}>
              <div style={{
                position: 'absolute', borderRadius: '50%', background: 'rgba(255,255,255,0.35)',
                width: b.size * 0.22, height: b.size * 0.18,
                top: b.size * 0.18, left: b.size * 0.22,
              }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
