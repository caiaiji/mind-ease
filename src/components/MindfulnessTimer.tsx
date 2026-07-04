import { useState, useEffect, useRef, useCallback } from 'react'
const isDarkMode = () => document.documentElement.classList.contains('dark')

type TimerState = 'idle' | 'running' | 'paused' | 'finished'

const presets = [
  { label: '3 分钟', seconds: 180, emoji: '🌱' },
  { label: '5 分钟', seconds: 300, emoji: '🌿' },
  { label: '10 分钟', seconds: 600, emoji: '🌳' },
  { label: '15 分钟', seconds: 900, emoji: '🏔' },
  { label: '自定义', seconds: 0, emoji: '⏱' },
]

const mindfulnessPhrases = [
  '感受此刻的呼吸，不急不缓',
  '让思绪如流水般流过，不追逐不抗拒',
  '你此刻正坐在这里，这本身就是一件美好的事',
  '把注意力带回身体，感受身体的重量和温度',
  '每一次呼吸都是一个新的开始',
  '不需要去任何地方，此刻就是目的地',
  '温柔地对待自己，就像对待一位好朋友',
  '允许自己什么都不做，只是存在着',
  '此刻的安全感，来自你内心的力量',
  '每一次觉察，都是一份对自我的关怀',
]

// Simple audio beep using Web Audio API
function playBeep(_isDark: boolean) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 528
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 2)
  } catch {
    // Audio not available
  }
}

function playBell() {
  try {
    const ctx = new AudioContext()
    const frequencies = [528, 660] as const
    frequencies.forEach((freq: number, i: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.3)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 2.5)
      osc.start(ctx.currentTime + i * 0.3)
      osc.stop(ctx.currentTime + i * 0.3 + 2.5)
    })
  } catch {
    // Audio not available
  }
}

export default function MindfulnessTimer({ onBack }: { onBack: () => void }) {
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [totalSeconds, setTotalSeconds] = useState(300)
  const [remaining, setRemaining] = useState(300)
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [showCustom, setShowCustom] = useState(false)
  const [customMinutes, setCustomMinutes] = useState(5)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const remainingRef = useRef(300)
  const elapsedRef = useRef(0)
  

  const progress = totalSeconds > 0 ? 1 - remaining / totalSeconds : 0

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const startTimer = useCallback((seconds: number) => {
    setTotalSeconds(seconds)
    setRemaining(seconds)
    remainingRef.current = seconds
    setElapsed(0)
    elapsedRef.current = 0
    setPhraseIdx(0)
    setTimerState('running')
    playBeep(isDarkMode())
  }, [isDarkMode()])

  const pause = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    setTimerState('paused')
  }, [])

  const resume = useCallback(() => {
    setTimerState('running')
    timerRef.current = setInterval(() => {
      remainingRef.current -= 1
      elapsedRef.current += 1
      setRemaining(remainingRef.current)
      setElapsed(elapsedRef.current)

      // Change phrase every 20 seconds
      if (elapsedRef.current % 20 === 0 && elapsedRef.current > 0) {
        setPhraseIdx(prev => (prev + 1) % mindfulnessPhrases.length)
      }

      // Halfway gentle bell
      if (remainingRef.current === Math.floor(totalSeconds / 2)) {
        playBell()
      }

      if (remainingRef.current <= 0) {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
        setTimerState('finished')
        playBell()
      }
    }, 1000)
  }, [totalSeconds])

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    setTimerState('idle')
    setRemaining(totalSeconds)
    remainingRef.current = totalSeconds
    setElapsed(0)
    elapsedRef.current = 0
    setPhraseIdx(0)
  }, [totalSeconds])

  const goBack = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    onBack()
  }, [onBack])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const bgGrad = isDarkMode()
    ? 'radial-gradient(circle at 40% 40%, #1e3a5f 0%, #1a1a2e 70%)'
    : 'radial-gradient(circle at 40% 40%, #dbeafe 0%, #f0f4ff 70%)'

  const textColor = isDarkMode() ? '#e5e7eb' : '#374151'
  const subTextColor = isDarkMode() ? '#9ca3af' : '#9ca3af'
  const accentColor = isDarkMode() ? '#60a5fa' : '#3b82f6'
  const cardBg = isDarkMode() ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.7)'

  // Idle - preset selection
  if (timerState === 'idle') {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: bgGrad }}>
        <button onClick={goBack} style={{ position: 'absolute', top: '5rem', left: '1.5rem', background: 'none', border: 'none', color: subTextColor, cursor: 'pointer', fontSize: '0.875rem' }}>
          ← 返回
        </button>
        <h2 style={{ fontFamily: 'Noto Serif SC, serif', fontSize: '1.75rem', color: textColor, marginBottom: '0.5rem' }}>
          🧘 正念计时
        </h2>
        <p style={{ color: subTextColor, marginBottom: '2rem', textAlign: 'center', maxWidth: '20rem' }}>
          选择时长，在安静中与内心对话
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '20rem' }}>
          {presets.map(preset => (
            preset.seconds > 0 ? (
              <button
                key={preset.label}
                onClick={() => startTimer(preset.seconds)}
                style={{
                  padding: '1rem 1.5rem',
                  borderRadius: '1rem',
                  border: `1px solid ${isDarkMode() ? 'rgba(96,165,250,0.2)' : 'rgba(59,130,246,0.15)'}`,
                  background: cardBg,
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{preset.emoji}</span>
                <span style={{ fontWeight: 600, color: textColor }}>{preset.label}</span>
              </button>
            ) : (
              <div key={preset.label} style={{
                padding: '1rem 1.5rem',
                borderRadius: '1rem',
                border: `1px solid ${isDarkMode() ? 'rgba(96,165,250,0.2)' : 'rgba(59,130,246,0.15)'}`,
                background: cardBg,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{preset.emoji}</span>
                  <span style={{ fontWeight: 600, color: textColor }}>{preset.label}</span>
                </div>
                {showCustom ? (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={customMinutes}
                      onChange={e => setCustomMinutes(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                      style={{
                        width: '4rem',
                        padding: '0.375rem 0.5rem',
                        borderRadius: '0.5rem',
                        border: `1px solid ${isDarkMode() ? 'rgba(96,165,250,0.3)' : 'rgba(59,130,246,0.2)'}`,
                        background: isDarkMode() ? 'rgba(0,0,0,0.3)' : '#fff',
                        color: textColor,
                        textAlign: 'center',
                        fontSize: '1rem',
                        outline: 'none',
                      }}
                    />
                    <span style={{ color: subTextColor, fontSize: '0.85rem' }}>分钟</span>
                    <button
                      onClick={() => startTimer(customMinutes * 60)}
                      style={{
                        marginLeft: 'auto',
                        padding: '0.375rem 1rem',
                        borderRadius: '9999px',
                        background: isDarkMode() ? 'rgba(59,130,246,0.3)' : '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                      }}
                    >
                      开始
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCustom(true)}
                    style={{ background: 'none', border: 'none', color: accentColor, cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
                  >
                    设置自定义时长 →
                  </button>
                )}
              </div>
            )
          ))}
        </div>

        <p style={{ color: subTextColor, fontSize: '0.75rem', marginTop: '2rem', textAlign: 'center', maxWidth: '18rem', lineHeight: 1.6 }}>
          正念冥想可以帮助你减轻压力、改善注意力、增强情绪调节能力。每天只需几分钟，就能感受到改变。
        </p>
      </div>
    )
  }

  // Finished
  if (timerState === 'finished') {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: bgGrad }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
        <h2 style={{ fontFamily: 'Noto Serif SC, serif', fontSize: '1.5rem', color: textColor, marginBottom: '0.5rem' }}>
          冥想结束
        </h2>
        <p style={{ color: subTextColor, marginBottom: '0.25rem' }}>
          完成了 {formatTime(totalSeconds)} 的正念练习
        </p>
        <p style={{ color: isDarkMode() ? '#93c5fd' : '#60a5fa', fontStyle: 'italic', marginBottom: '2rem', textAlign: 'center', maxWidth: '20rem', lineHeight: 1.6 }}>
          慢慢睁开眼睛，轻轻活动身体。带着这份平静，回到你的生活中。
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => startTimer(totalSeconds)} style={{ padding: '0.625rem 1.5rem', borderRadius: '9999px', background: isDarkMode() ? 'rgba(59,130,246,0.3)' : '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            再来一次
          </button>
          <button onClick={goBack} style={{ padding: '0.625rem 1.5rem', borderRadius: '9999px', background: isDarkMode() ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: textColor, border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            返回
          </button>
        </div>
      </div>
    )
  }

  // Running / Paused
  const circleRadius = 100
  const circleStroke = 6
  const circumference = 2 * Math.PI * circleRadius
  const dashOffset = circumference * (1 - progress)

  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: bgGrad }}>
      <button onClick={goBack} style={{ position: 'absolute', top: '5rem', left: '1.5rem', background: 'none', border: 'none', color: subTextColor, cursor: 'pointer', fontSize: '0.875rem' }}>
        ← 返回
      </button>

      {/* Timer Circle */}
      <div style={{ position: 'relative', width: '14rem', height: '14rem', marginBottom: '1.5rem' }}>
        <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} width="224" height="224" viewBox={`0 0 ${(circleRadius + circleStroke) * 2} ${(circleRadius + circleStroke) * 2}`}>
          {/* Background circle */}
          <circle
            cx={circleRadius + circleStroke}
            cy={circleRadius + circleStroke}
            r={circleRadius}
            fill="none"
            stroke={isDarkMode() ? 'rgba(96,165,250,0.15)' : 'rgba(59,130,246,0.1)'}
            strokeWidth={circleStroke}
          />
          {/* Progress circle */}
          <circle
            cx={circleRadius + circleStroke}
            cy={circleRadius + circleStroke}
            r={circleRadius}
            fill="none"
            stroke={accentColor}
            strokeWidth={circleStroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 300, color: textColor, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            {formatTime(remaining)}
          </div>
          <div style={{ fontSize: '0.75rem', color: subTextColor, marginTop: '0.25rem' }}>
            {timerState === 'paused' ? '已暂停' : `${formatTime(elapsed)} 已过`}
          </div>
        </div>
      </div>

      {/* Mindfulness phrase */}
      <div style={{
        maxWidth: '20rem',
        textAlign: 'center',
        padding: '1rem 1.5rem',
        borderRadius: '1rem',
        background: isDarkMode() ? 'rgba(96,165,250,0.08)' : 'rgba(59,130,246,0.05)',
        border: `1px solid ${isDarkMode() ? 'rgba(96,165,250,0.15)' : 'rgba(59,130,246,0.1)'}`,
        marginBottom: '2rem',
        minHeight: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 1s ease',
        opacity: timerState === 'paused' ? 0.5 : 1,
      }}>
        <p style={{ color: isDarkMode() ? '#bfdbfe' : '#1e40af', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.6 }}>
          {mindfulnessPhrases[phraseIdx]}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {timerState === 'running' ? (
          <button
            onClick={pause}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '9999px',
              background: isDarkMode() ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              color: textColor,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '1rem',
            }}
          >
            ⏸ 暂停
          </button>
        ) : (
          <button
            onClick={resume}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '9999px',
              background: isDarkMode() ? 'rgba(59,130,246,0.3)' : '#3b82f6',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '1rem',
            }}
          >
            ▶ 继续
          </button>
        )}
        <button
          onClick={reset}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '9999px',
            background: 'none',
            color: subTextColor,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.9rem',
          }}
        >
          重置
        </button>
      </div>
    </div>
  )
}
