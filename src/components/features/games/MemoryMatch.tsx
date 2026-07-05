import { useState, useCallback, useRef, useEffect } from 'react'

const isDarkMode = () => document.documentElement.classList.contains('dark')

const EMOJI_POOL = ['🐱', '🐶', '🐰', '🦊', '🐼', '🦋', '🐢', '🐡', '🦉', '🌸', '🍀', '🌙']

interface Card {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createDeck(pairs: number): Card[] {
  const selected = shuffle(EMOJI_POOL).slice(0, pairs)
  return shuffle([...selected, ...selected].map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false })))
}

type Difficulty = 'easy' | 'medium' | 'hard'
const DIFFICULTY: Record<Difficulty, { pairs: number; label: string }> = {
  easy: { pairs: 4, label: '简单 (4对)' },
  medium: { pairs: 6, label: '中等 (6对)' },
  hard: { pairs: 8, label: '困难 (8对)' },
}

export default function MemoryMatch() {
  const dark = isDarkMode()
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [cards, setCards] = useState<Card[]>(() => createDeck(4))
  const [flippedIds, setFlippedIds] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedCount, setMatchedCount] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>()
  const isChecking = useRef(false)
  const startTimeRef = useRef(0)

  const totalPairs = DIFFICULTY[difficulty].pairs

  const cardBg = dark ? 'rgba(30,27,60,0.6)' : 'rgba(255,255,255,0.6)'
  const cardBorder = dark ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.4)'
  const textMuted = dark ? '#9ca3af' : '#9CA3AF'
  const textPrimary = dark ? '#e5e7eb' : '#374151'

  const getCardStyle = (card: Card): React.CSSProperties => ({
    width: 72, height: 72, borderRadius: 16, fontSize: 32,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.5s ease', border: '2px solid',
    cursor: card.matched || card.flipped ? 'default' : 'pointer',
    ...(card.matched
      ? { background: dark ? 'rgba(6,78,59,0.4)' : '#ECFDF5', borderColor: dark ? 'rgba(110,231,183,0.3)' : '#A7F3D0', transform: 'scale(0.95)', opacity: 0.7 }
      : card.flipped
        ? { background: dark ? 'rgba(55,65,81,0.8)' : 'white', borderColor: '#DDD6FE', boxShadow: dark ? '0 4px 15px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.1)', transform: 'scale(1.05)' }
        : { background: dark ? 'linear-gradient(135deg, #4c1d95, #9f1239)' : 'linear-gradient(135deg, #DDD6FE, #FECDD3)', borderColor: 'rgba(167,139,250,0.3)', boxShadow: dark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06)' }),
  })

  const getBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 500,
    border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
    ...(active
      ? { background: '#A78BFA', color: 'white', boxShadow: '0 4px 10px rgba(167,139,250,0.3)' }
      : { background: cardBg, color: '#6B7280', border: '1px solid rgba(167,139,250,0.2)' }),
  })

  const statBox: React.CSSProperties = {
    background: cardBg, backdropFilter: 'blur(8px)',
    borderRadius: 16, padding: '12px 20px', border: `1px solid ${cardBorder}`,
  }

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff)
    setCards(createDeck(DIFFICULTY[diff].pairs))
    setFlippedIds([])
    setMoves(0)
    setMatchedCount(0)
    setElapsed(0)
    setIsComplete(false)
    isChecking.current = false
    startTimeRef.current = Date.now()
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
  }, [])

  useEffect(() => {
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const handleCardClick = (id: number) => {
    if (isChecking.current) return
    const card = cards.find((c) => c.id === id)
    if (!card || card.flipped || card.matched) return
    if (flippedIds.length >= 2) return

    const newFlipped = [...flippedIds, id]
    setFlippedIds(newFlipped)
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)))

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1)
      isChecking.current = true
      const [fId, sId] = newFlipped
      const first = cards.find((c) => c.id === fId)!
      const second = cards.find((c) => c.id === sId)!

      if (first.emoji === second.emoji) {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => c.id === fId || c.id === sId ? { ...c, matched: true } : c))
          setFlippedIds([])
          setMatchedCount((mc) => {
            const n = mc + 1
            if (n === totalPairs) setIsComplete(true)
            return n
          })
          isChecking.current = false
        }, 500)
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => c.id === fId || c.id === sId ? { ...c, flipped: false } : c))
          setFlippedIds([])
          isChecking.current = false
        }, 800)
      }
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Difficulty */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {(Object.keys(DIFFICULTY) as Difficulty[]).map((diff) => (
          <button key={diff} onClick={() => startGame(diff)} style={getBtnStyle(difficulty === diff)}>
            {DIFFICULTY[diff].label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
        <div style={statBox}>
          <div style={{ fontSize: 12, color: textMuted }}>步数</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: textPrimary }}>{moves}</div>
        </div>
        <div style={statBox}>
          <div style={{ fontSize: 12, color: textMuted }}>已配对</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#A78BFA' }}>{matchedCount} / {totalPairs}</div>
        </div>
        <div style={statBox}>
          <div style={{ fontSize: 12, color: textMuted }}>用时</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: textPrimary }}>{formatTime(elapsed)}</div>
        </div>
      </div>

      {/* Card grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 72px)',
        gap: 12, padding: 20, borderRadius: 24,
        background: dark ? 'rgba(120,53,15,0.15)' : 'rgba(254,225,211,0.3)', justifyContent: 'center', margin: '0 auto', width: 'fit-content',
      }}>
        {cards.map((card) => (
          <button key={card.id} onClick={() => handleCardClick(card.id)} style={getCardStyle(card)}>
            {card.flipped || card.matched ? card.emoji : '?'}
          </button>
        ))}
      </div>

      {/* Completion */}
      {isComplete && (
        <div style={{ marginTop: 32, animation: 'fadeUp 0.6s ease-out forwards' }}>
          <div style={{
            display: 'inline-block', padding: 32, background: cardBg,
            backdropFilter: 'blur(12px)', borderRadius: 24, border: `1px solid ${cardBorder}`,
            boxShadow: dark ? '0 10px 25px rgba(0,0,0,0.2)' : '0 10px 25px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <div style={{ fontFamily: '"ZCOOL XiaoWei", serif', fontSize: 22, color: textPrimary, marginBottom: 8 }}>
              太棒了！全部配对成功！
            </div>
            <div style={{ color: textMuted, fontSize: 14, marginBottom: 16 }}>
              用了 {moves} 步，耗时 {formatTime(elapsed)}
            </div>
            <button onClick={() => startGame(difficulty)} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '12px 24px', borderRadius: 999, background: '#A78BFA', color: 'white',
              border: 'none', fontWeight: 500, cursor: 'pointer', fontSize: 14,
              boxShadow: '0 4px 10px rgba(167,139,250,0.3)',
            }}>
              再来一局
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
