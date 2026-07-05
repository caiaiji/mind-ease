import { useState, useCallback, useRef, useEffect } from 'react'

const isDarkMode = () => document.documentElement.classList.contains('dark')

type Size = 3 | 4 | 5
const SIZE_CONFIG: Record<Size, { label: string; total: number; cellPx: number }> = {
  3: { label: '3x3 入门', total: 9, cellPx: 80 },
  4: { label: '4x4 标准', total: 16, cellPx: 68 },
  5: { label: '5x5 挑战', total: 25, cellPx: 56 },
}

interface SchulteRecord {
  name: string
  time: number
  date: string
  wrong: number
}

const STORAGE_KEY = 'schulte-records'
const NICKNAME_KEY = 'schulte-nickname'

function loadRecords(): Record<Size, SchulteRecord[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { 3: [], 4: [], 5: [] }
}

function saveRecords(records: Record<Size, SchulteRecord[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

function loadNickname(): string {
  try { return localStorage.getItem(NICKNAME_KEY) || '' } catch { return '' }
}

function saveNickname(name: string) {
  localStorage.setItem(NICKNAME_KEY, name)
}

export default function SchulteGrid() {
  const dark = isDarkMode()
  const [size, setSize] = useState<Size>(5)
  const [numbers, setNumbers] = useState<number[]>([])
  const [nextTarget, setNextTarget] = useState(1)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [displayTime, setDisplayTime] = useState('0.000s')
  const [wrongClicks, setWrongClicks] = useState(0)
  const [wrongId, setWrongId] = useState<number | null>(null)
  const [bestTime, setBestTime] = useState<Record<Size, number | null>>({ 3: null, 4: null, 5: null })
  const [records, setRecords] = useState<Record<Size, SchulteRecord[]>>(() => {
    const loaded = loadRecords()
    const best: Record<Size, number | null> = { 3: null, 4: null, 5: null }
    for (const s of [3, 4, 5] as Size[]) {
      if (loaded[s].length > 0) {
        const bestOne = loaded[s].reduce((a: SchulteRecord, b: SchulteRecord) => a.time < b.time ? a : b)
        best[s] = bestOne.time
      }
    }
    setBestTime(best)
    return loaded
  })
  const [nickname, setNickname] = useState(loadNickname)
  const [showRank, setShowRank] = useState(false)
  const startTimeRef = useRef(0)
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame>>()

  const config = SIZE_CONFIG[size]

  const cardBg = dark ? 'rgba(30,27,60,0.6)' : 'rgba(255,255,255,0.6)'
  const cardBorder = dark ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.4)'
  const textMuted = dark ? '#9ca3af' : '#9CA3AF'
  const textPrimary = dark ? '#e5e7eb' : '#374151'
  const textSecondary = dark ? '#6b7280' : '#6B7280'
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)'
  const inputColor = dark ? '#e5e7eb' : '#374151'
  const gridBg = dark ? 'rgba(30,27,60,0.3)' : 'rgba(237,233,254,0.2)'
  const cellDefaultBg = dark ? 'rgba(55,65,81,0.6)' : '#F0EEFF'
  const cellDefaultBorder = dark ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.5)'

  const shuffle = useCallback((n: number): number[] => {
    const arr = Array.from({ length: n }, (_, i) => i + 1)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [])

  const startGame = useCallback((s: Size) => {
    setSize(s)
    const total = SIZE_CONFIG[s].total
    setNumbers(shuffle(total))
    setNextTarget(1)
    setStarted(false)
    setFinished(false)
    setElapsed(0)
    setDisplayTime('0.000s')
    setWrongClicks(0)
    setWrongId(null)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setShowRank(false)
  }, [shuffle])

  useEffect(() => { startGame(5) }, [])

  const handleCellClick = (num: number) => {
    if (finished) return

    if (num === nextTarget) {
      if (!started) {
        setStarted(true)
        startTimeRef.current = Date.now()
        const tick = () => {
          const ms = Date.now() - startTimeRef.current
          setElapsed(ms)
          setDisplayTime((ms / 1000).toFixed(3) + 's')
          rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
      }

      if (num === SIZE_CONFIG[size].total) {
        const finalMs = Date.now() - startTimeRef.current
        setElapsed(finalMs)
        setDisplayTime((finalMs / 1000).toFixed(3) + 's')
        setFinished(true)
        setNextTarget(num + 1)
        if (rafRef.current) cancelAnimationFrame(rafRef.current)

        const currentName = nickname.trim() || '匿名玩家'
        saveNickname(currentName)
        const newRecord: SchulteRecord = {
          name: currentName,
          time: finalMs,
          date: new Date().toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          wrong: wrongClicks,
        }
        setRecords((prev: Record<Size, SchulteRecord[]>) => {
          const updated = { ...prev, [size]: [newRecord, ...prev[size]].slice(0, 20) }
          saveRecords(updated)
          return updated
        })
        setBestTime((prev: Record<Size, number | null>) => {
          const current = prev[size]
          if (current === null || finalMs < current) {
            return { ...prev, [size]: finalMs }
          }
          return prev
        })
      } else {
        setNextTarget(num + 1)
      }
    } else {
      setWrongClicks((w) => w + 1)
      setWrongId(num)
      setTimeout(() => setWrongId(null), 400)
    }
  }

  const formatTime = (ms: number) => {
    const sec = ms / 1000
    return sec >= 60
      ? `${Math.floor(sec / 60)}:${(sec % 60).toFixed(3).padStart(6, '0')}`
      : `${sec.toFixed(3)}s`
  }

  const clearRecords = (s?: Size) => {
    if (s !== undefined) {
      setRecords((prev: Record<Size, SchulteRecord[]>) => {
        const updated = { ...prev, [s]: [] }
        saveRecords(updated)
        return updated
      })
      setBestTime((prev: Record<Size, number | null>) => ({ ...prev, [s]: null }))
    } else {
      const empty = { 3: [], 4: [], 5: [] } as Record<Size, SchulteRecord[]>
      setRecords(empty)
      saveRecords(empty)
      setBestTime({ 3: null, 4: null, 5: null })
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Nickname input */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 14, color: textMuted }}>玩家</span>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="输入昵称"
          maxLength={12}
          style={{
            width: 140, padding: '6px 14px', borderRadius: 999, fontSize: 13,
            border: '1px solid rgba(167,139,250,0.25)', background: inputBg,
            color: inputColor, outline: 'none', textAlign: 'center',
          }}
        />
      </div>

      {/* Size selector + rank button */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {([3, 4, 5] as Size[]).map((s) => (
          <button
            key={s}
            onClick={() => startGame(s)}
            style={{
              padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 500,
              border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
              ...(size === s
                ? { background: '#A78BFA', color: 'white', boxShadow: '0 4px 10px rgba(167,139,250,0.3)' }
                : { background: cardBg, color: textSecondary, border: '1px solid rgba(167,139,250,0.2)' }),
            }}
          >
            {SIZE_CONFIG[s].label}
          </button>
        ))}
        <button
          onClick={() => setShowRank(!showRank)}
          style={{
            padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 500,
            border: 'none', cursor: 'pointer',
            background: showRank ? '#F59E0B' : cardBg,
            color: showRank ? 'white' : textSecondary,
            transition: 'all 0.3s ease',
          }}
        >
          🏅 排行榜
        </button>
      </div>

      {/* Ranking panel */}
      {showRank && !finished && (
        <div style={{
          maxWidth: 400, margin: '0 auto 24px', padding: 20,
          background: dark ? 'rgba(30,27,60,0.7)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
          borderRadius: 20, border: `1px solid ${cardBorder}`,
          boxShadow: dark ? '0 10px 25px rgba(0,0,0,0.2)' : '0 10px 25px rgba(0,0,0,0.06)', textAlign: 'left',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontFamily: '"ZCOOL XiaoWei", serif', fontSize: 18, color: textPrimary }}>
              🏅 排行榜
            </h3>
            <button onClick={() => clearRecords()} style={{
              fontSize: 12, color: textMuted, background: 'none', border: 'none', cursor: 'pointer',
            }}>
              清空全部
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: textSecondary, whiteSpace: 'nowrap' }}>昵称</span>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="输入你的昵称"
              maxLength={12}
              style={{
                flex: 1, padding: '6px 12px', borderRadius: 10, fontSize: 13,
                border: '1px solid rgba(167,139,250,0.25)', background: inputBg,
                color: inputColor, outline: 'none',
              }}
            />
          </div>

          {([3, 4, 5] as Size[]).map((s) => (
            <div key={s} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: textSecondary, marginBottom: 6 }}>
                {SIZE_CONFIG[s].label}
                {bestTime[s] !== null && (
                  <span style={{ color: '#F59E0B', fontWeight: 400, marginLeft: 8 }}>
                    最佳 {formatTime(bestTime[s]!)}
                  </span>
                )}
              </div>
              {records[s].length === 0 ? (
                <div style={{ fontSize: 13, color: dark ? '#4b5563' : '#D1D5DB', padding: '8px 0' }}>暂无记录</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {records[s].slice(0, 5).map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '6px 12px', borderRadius: 10, fontSize: 13,
                      background: i === 0 ? 'rgba(245,158,11,0.1)' : (dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                    }}>
                      <span style={{ minWidth: 20 }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                      </span>
                      <span style={{ fontWeight: 600, color: '#7C3AED', fontSize: 12, maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.name}
                      </span>
                      <span style={{ fontWeight: 600, color: textPrimary, fontFamily: 'monospace' }}>
                        {formatTime(r.time)}
                      </span>
                      <span style={{ fontSize: 11, color: textMuted }}>
                        {r.wrong > 0 ? `误点${r.wrong}` : '无误点'}
                      </span>
                      <span style={{ fontSize: 11, color: dark ? '#4b5563' : '#D1D5DB' }}>{r.date}</span>
                    </div>
                  ))}
                  {records[s].length > 5 && (
                    <div style={{ fontSize: 11, color: dark ? '#4b5563' : '#D1D5DB', textAlign: 'center' }}>
                      共 {records[s].length} 条记录
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          background: cardBg, backdropFilter: 'blur(8px)',
          borderRadius: 16, padding: '10px 18px', border: `1px solid ${cardBorder}`,
        }}>
          <div style={{ fontSize: 11, color: textMuted }}>用时</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: textPrimary, fontFamily: 'monospace' }}>
            {displayTime}
          </div>
        </div>
        {wrongClicks > 0 && (
          <div style={{
            background: cardBg, backdropFilter: 'blur(8px)',
            borderRadius: 16, padding: '10px 18px', border: `1px solid ${cardBorder}`,
          }}>
            <div style={{ fontSize: 11, color: textMuted }}>误点</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#FDA4AF' }}>
              {wrongClicks}
            </div>
          </div>
        )}
        {bestTime[size] !== null && (
          <div style={{
            background: cardBg, backdropFilter: 'blur(8px)',
            borderRadius: 16, padding: '10px 18px', border: `1px solid ${cardBorder}`,
          }}>
            <div style={{ fontSize: 11, color: textMuted }}>最佳</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#F59E0B', fontFamily: 'monospace' }}>
              {formatTime(bestTime[size]!)}
            </div>
          </div>
        )}
      </div>

      {/* Instruction */}
      {!started && !finished && (
        <div style={{
          padding: '10px 20px', borderRadius: 16, marginBottom: 20,
          background: dark ? 'rgba(139,92,246,0.15)' : 'rgba(237,233,254,0.4)', color: '#7C3AED',
          fontSize: 14, fontWeight: 500, display: 'inline-block',
        }}>
          按 1 → {config.total} 的顺序依次点击
        </div>
      )}

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, ${config.cellPx}px)`,
        gap: 6,
        padding: 16,
        borderRadius: 20,
        background: gridBg,
        justifyContent: 'center',
        margin: '0 auto',
        width: 'fit-content',
      }}>
        {numbers.map((num) => {
          const isWrong = num === wrongId
          const completed = num < nextTarget

          let bg: string
          let borderColor: string
          let color: string
          let opacity: number = 1

          if (isWrong) {
            bg = dark ? 'rgba(127,29,29,0.5)' : '#FEE2E2'
            borderColor = '#FCA5A5'
            color = '#EF4444'
          } else {
            bg = cellDefaultBg
            borderColor = cellDefaultBorder
            color = textPrimary
          }

          if (completed) {
            opacity = 0
          }

          return (
            <button
              key={num}
              onClick={() => handleCellClick(num)}
              style={{
                width: config.cellPx,
                height: config.cellPx,
                borderRadius: 14,
                fontSize: size <= 3 ? 24 : size === 4 ? 20 : 16,
                fontWeight: 700,
                fontFamily: '"Noto Sans SC", sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: bg,
                border: `2px solid ${borderColor}`,
                color,
                cursor: completed ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                opacity,
                boxShadow: dark ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              {num}
            </button>
          )
        })}
      </div>

      {/* Restart */}
      {started && !finished && (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => startGame(size)}
            style={{
              padding: '8px 18px', borderRadius: 999, fontSize: 13,
              background: cardBg, color: '#8B5CF6',
              border: '1px solid rgba(167,139,250,0.3)',
              fontWeight: 500, cursor: 'pointer',
            }}
          >
            🔄 重新开始
          </button>
        </div>
      )}

      {/* Completion */}
      {finished && (
        <div style={{ marginTop: 24, animation: 'fadeUp 0.6s ease-out forwards' }}>
          <div style={{
            display: 'inline-block', padding: 32, background: dark ? 'rgba(30,27,60,0.7)' : 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)', borderRadius: 24, border: `1px solid ${cardBorder}`,
            boxShadow: dark ? '0 10px 25px rgba(0,0,0,0.2)' : '0 10px 25px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
            <div style={{ fontFamily: '"ZCOOL XiaoWei", serif', fontSize: 22, color: textPrimary, marginBottom: 8 }}>
              完成！
            </div>
            <div style={{ color: textSecondary, fontSize: 15, marginBottom: 4 }}>
              用时 <span style={{ fontWeight: 700, color: '#A78BFA', fontSize: 20, fontFamily: 'monospace' }}>{formatTime(elapsed)}</span>
            </div>
            {wrongClicks > 0 && (
              <div style={{ color: '#FDA4AF', fontSize: 13, marginBottom: 4 }}>
                误点 {wrongClicks} 次
              </div>
            )}
            {wrongClicks === 0 && (
              <div style={{ color: '#6EE7B7', fontSize: 13, marginBottom: 4 }}>
                零误点，完美！
              </div>
            )}
            {bestTime[size] === elapsed && (
              <div style={{ color: '#F59E0B', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                🎉 新纪录！
              </div>
            )}

            {/* Mini rank in completion card */}
            {records[size].length > 1 && (
              <div style={{ marginTop: 12, marginBottom: 8, textAlign: 'left' }}>
                <div style={{ fontSize: 12, color: textMuted, marginBottom: 4 }}>
                  历史 TOP 3
                </div>
                {records[size].slice(0, 3).map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px',
                    borderRadius: 8, fontSize: 12,
                    background: i === 0 ? 'rgba(245,158,11,0.08)' : 'transparent',
                  }}>
                    <span>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                    <span style={{ color: '#7C3AED', fontWeight: 500, maxWidth: 50, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.name}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 500, color: textPrimary }}>
                      {formatTime(r.time)}
                    </span>
                    <span style={{ color: textMuted }}>{r.date}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => startGame(size)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '12px 24px', borderRadius: 999, background: '#A78BFA', color: 'white',
                border: 'none', fontWeight: 500, cursor: 'pointer', fontSize: 14,
                boxShadow: '0 4px 10px rgba(167,139,250,0.3)', marginTop: 8,
              }}
            >
              再来一局
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
