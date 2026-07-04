import { useState, useEffect, useRef, useCallback } from 'react'
const isDarkMode = () => document.documentElement.classList.contains('dark')

type BreathingMode = '478' | 'box' | 'equal'
type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

interface ModeConfig {
  id: BreathingMode
  name: string
  emoji: string
  description: string
  phases: { phase: BreathingPhase; label: string; duration: number; instruction: string }[]
  cycles: number
}

const breathingModes: ModeConfig[] = [
  {
    id: '478',
    name: '4-7-8 放松呼吸',
    emoji: '🌙',
    description: '经典放松法，激活副交感神经，快速缓解焦虑',
    phases: [
      { phase: 'inhale', label: '吸气', duration: 4, instruction: '用鼻子缓缓吸气，感受腹部隆起' },
      { phase: 'hold', label: '屏住', duration: 7, instruction: '轻轻屏住呼吸，保持放松' },
      { phase: 'exhale', label: '呼气', duration: 8, instruction: '用嘴缓缓呼气，释放所有紧张' },
      { phase: 'rest', label: '休息', duration: 1, instruction: '自然呼吸，准备下一个循环' },
    ],
    cycles: 4,
  },
  {
    id: 'box',
    name: '方形呼吸',
    emoji: '⬜',
    description: '等长吸气-屏住-呼气-屏住，适合专注和压力管理',
    phases: [
      { phase: 'inhale', label: '吸气', duration: 4, instruction: '缓慢均匀地吸气' },
      { phase: 'hold', label: '屏住', duration: 4, instruction: '保持肺部充盈' },
      { phase: 'exhale', label: '呼气', duration: 4, instruction: '缓慢均匀地呼气' },
      { phase: 'hold', label: '屏住', duration: 4, instruction: '感受空肺的平静' },
    ],
    cycles: 4,
  },
  {
    id: 'equal',
    name: '等比呼吸',
    emoji: '⚖',
    description: '吸气和呼气等长，适合日常冥想和放松',
    phases: [
      { phase: 'inhale', label: '吸气', duration: 4, instruction: '柔和地吸气' },
      { phase: 'exhale', label: '呼气', duration: 4, instruction: '柔和地呼气' },
      { phase: 'rest', label: '休息', duration: 1, instruction: '自然呼吸' },
    ],
    cycles: 6,
  },
]

export default function BreathingGuide({ onBack }: { onBack: () => void }) {
  const [selectedMode, setSelectedMode] = useState<BreathingMode | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [count, setCount] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [showRing, setShowRing] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countRef = useRef(0)
  const phaseIdxRef = useRef(0)
  const cyclesRef = useRef(0)
  const totalTimeRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  

  const currentMode = breathingModes.find(m => m.id === selectedMode)!
  const currentPhase = currentMode?.phases[phaseIdx]!

  const ringRadius = 100
  const ringStroke = 8
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringProgress = currentPhase ? count / currentPhase.duration : 0

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    timerRef.current = null
    rafRef.current = null
    setIsRunning(false)
    setShowRing(false)
  }, [])

  const tick = useCallback(() => {
    countRef.current -= 1
    setCount(countRef.current)

    if (countRef.current <= 0) {
      const phases = currentMode?.phases!
      const nextIdx = phaseIdxRef.current + 1

      if (nextIdx >= phases.length) {
        cyclesRef.current += 1
        setCycles(cyclesRef.current)
        if (cyclesRef.current >= currentMode!.cycles) {
          stop()
          return
        }
        phaseIdxRef.current = 0
        setPhaseIdx(0)
      } else {
        phaseIdxRef.current = nextIdx
        setPhaseIdx(nextIdx)
      }

      countRef.current = phases[phaseIdxRef.current].duration
      setCount(countRef.current)
    }
  }, [currentMode, stop])

  const start = useCallback(() => {
    const mode = breathingModes.find(m => m.id === selectedMode)!
    countRef.current = mode.phases[0].duration
    phaseIdxRef.current = 0
    cyclesRef.current = 0
    totalTimeRef.current = 0
    setCount(mode.phases[0].duration)
    setPhaseIdx(0)
    setCycles(0)
    setTotalTime(0)
    setShowRing(true)

    // Delay to show ring animation first
    setTimeout(() => {
      setIsRunning(true)
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        tick()
        totalTimeRef.current += 1
        setTotalTime(totalTimeRef.current)
      }, 1000)
    }, 800)
  }, [selectedMode, tick])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Breathing circle animation
  const breathScale = (() => {
    if (!currentPhase || !showRing) return 1
    const ph = currentPhase.phase
    if (ph === 'inhale') return 1 + 0.35 * ringProgress
    if (ph === 'exhale') return 1.35 - 0.35 * ringProgress
    return ph === 'hold' && phaseIdx <= 1 ? 1.35 : 1
  })()

  const bgGrad = isDarkMode()
    ? 'radial-gradient(circle at 40% 40%, #2d2b55 0%, #1a1a2e 70%)'
    : 'radial-gradient(circle at 40% 40%, #e8e0f0 0%, #f0f4ff 70%)'

  const circleColor = (() => {
    if (!currentPhase) return isDarkMode() ? '#a78bfa' : '#8b5cf6'
    const ph = currentPhase.phase
    if (ph === 'inhale') return isDarkMode() ? '#6ee7b7' : '#34d399'
    if (ph === 'exhale') return isDarkMode() ? '#93c5fd' : '#60a5fa'
    if (ph === 'hold') return isDarkMode() ? '#fbbf24' : '#f59e0b'
    return isDarkMode() ? '#a78bfa' : '#8b5cf6'
  })()

  const textColor = isDarkMode() ? '#e5e7eb' : '#374151'
  const subTextColor = isDarkMode() ? '#9ca3af' : '#9ca3af'

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // Mode Selection
  if (!selectedMode) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: bgGrad }}>
        <button onClick={onBack} style={{ position: 'absolute', top: '5rem', left: '1.5rem', background: 'none', border: 'none', color: subTextColor, cursor: 'pointer', fontSize: '0.875rem' }}>
          ← 返回
        </button>
        <h2 style={{ fontFamily: 'Noto Serif SC, serif', fontSize: '1.75rem', color: textColor, marginBottom: '0.5rem' }}>
          🌬️ 呼吸引导
        </h2>
        <p style={{ color: subTextColor, marginBottom: '2rem', textAlign: 'center' }}>
          选择一种呼吸模式，跟随引导放松身心
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '24rem' }}>
          {breathingModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '1rem',
                border: `1px solid ${isDarkMode() ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.15)'}`,
                background: isDarkMode() ? 'rgba(30,27,60,0.6)' : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{mode.emoji}</span>
                <span style={{ fontWeight: 600, color: textColor, fontSize: '1rem' }}>{mode.name}</span>
              </div>
              <p style={{ color: subTextColor, fontSize: '0.8rem', marginLeft: '2.25rem' }}>{mode.description}</p>
              <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem', marginLeft: '2.25rem', flexWrap: 'wrap' }}>
                {mode.phases.map((p, i) => (
                  <span key={i} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', background: isDarkMode() ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)', color: isDarkMode() ? '#c4b5fd' : '#7c3aed' }}>
                    {p.label} {p.duration}s
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Completed
  if (showRing && !isRunning && cycles > 0 && cycles >= currentMode.cycles) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: bgGrad }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontFamily: 'Noto Serif SC, serif', fontSize: '1.5rem', color: textColor, marginBottom: '0.5rem' }}>
          练习完成！
        </h2>
        <p style={{ color: subTextColor, marginBottom: '0.25rem' }}>
          完成了 {currentMode.cycles} 个 {currentMode.name} 循环
        </p>
        <p style={{ color: subTextColor, marginBottom: '2rem' }}>
          总用时 {formatTime(totalTime)}
        </p>
        <p style={{ color: isDarkMode() ? '#a5b4fc' : '#818cf8', fontStyle: 'italic', marginBottom: '2rem', textAlign: 'center', maxWidth: '20rem' }}>
          做得好！花一点时间感受身体现在的状态，再慢慢回到日常中。
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={start} style={{ padding: '0.625rem 1.5rem', borderRadius: '9999px', background: isDarkMode() ? 'rgba(139,92,246,0.3)' : '#8b5cf6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            再来一次
          </button>
          <button onClick={() => { stop(); setSelectedMode(null) }} style={{ padding: '0.625rem 1.5rem', borderRadius: '9999px', background: isDarkMode() ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: textColor, border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            返回选择
          </button>
        </div>
      </div>
    )
  }

  // Running
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: bgGrad }}>
      <button onClick={onBack} style={{ position: 'absolute', top: '5rem', left: '1.5rem', background: 'none', border: 'none', color: subTextColor, cursor: 'pointer', fontSize: '0.875rem' }}>
        ← 返回
      </button>

      {/* Mode tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <span style={{ fontSize: '1.25rem' }}>{currentMode.emoji}</span>
        <span style={{ color: isDarkMode() ? '#c4b5fd' : '#7c3aed', fontWeight: 600, fontSize: '0.9rem' }}>{currentMode.name}</span>
      </div>

      {/* Breathing Circle with SVG Ring */}
      <div style={{ position: 'relative', width: '15rem', height: '15rem', marginBottom: '2rem' }}>
        <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} width="240" height="240" viewBox={`0 0 ${(ringRadius + ringStroke) * 2} ${(ringRadius + ringStroke) * 2}`}>
          {/* Background ring */}
          <circle
            cx={ringRadius + ringStroke}
            cy={ringRadius + ringStroke}
            r={ringRadius}
            fill="none"
            stroke={isDarkMode() ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)'}
            strokeWidth={ringStroke}
            strokeLinecap="round"
          />
          {/* Progress ring */}
          {showRing && (
            <circle
              cx={ringRadius + ringStroke}
              cy={ringRadius + ringStroke}
              r={ringRadius}
              fill="none"
              stroke={circleColor}
              strokeWidth={ringStroke}
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringCircumference * (1 - ringProgress)}
              style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.5s ease' }}
            />
          )}
        </svg>

        {/* Breathing circle */}
        <div
          style={{
            position: 'absolute',
            inset: '1.5rem',
            borderRadius: '50%',
            background: `radial-gradient(circle at 40% 35%, ${circleColor}88, ${circleColor}44)`,
            boxShadow: `0 0 60px ${circleColor}33, inset 0 0 40px ${circleColor}22`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${breathScale})`,
            transition: 'transform 1s ease-in-out',
          }}
        >
          {isRunning && (
            <>
              <div style={{ fontSize: '3rem', fontWeight: 300, color: '#fff', lineHeight: 1, marginBottom: '0.25rem' }}>
                {count}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                {currentPhase.label}
              </div>
            </>
          )}
          {!isRunning && showRing && (
            <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 500 }}>
              准备开始...
            </div>
          )}
        </div>
      </div>

      {/* Instruction */}
      {isRunning && (
        <p style={{ color: isDarkMode() ? '#d1d5db' : '#4b5563', fontSize: '1rem', marginBottom: '0.5rem', textAlign: 'center' }}>
          {currentPhase.instruction}
        </p>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: subTextColor }}>循环</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: textColor }}>{cycles + (isRunning ? 1 : 0)} / {currentMode.cycles}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: subTextColor }}>用时</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: textColor }}>{formatTime(totalTime)}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {!isRunning && !showRing && (
          <button onClick={start} style={{ padding: '0.75rem 2rem', borderRadius: '9999px', background: isDarkMode() ? 'rgba(139,92,246,0.3)' : '#8b5cf6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '1rem' }}>
            开始
          </button>
        )}
        {isRunning && (
          <button onClick={stop} style={{ padding: '0.625rem 1.5rem', borderRadius: '9999px', background: isDarkMode() ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', color: textColor, border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            结束练习
          </button>
        )}
        {!isRunning && showRing && (
          <button onClick={() => { stop(); setSelectedMode(null) }} style={{ padding: '0.625rem 1.5rem', borderRadius: '9999px', background: isDarkMode() ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', color: textColor, border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            返回选择
          </button>
        )}
        {(isRunning || showRing) && (
          <button onClick={() => { stop(); setSelectedMode(null) }} style={{ padding: '0.625rem 1.5rem', borderRadius: '9999px', background: 'none', color: subTextColor, border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            返回
          </button>
        )}
      </div>

      {/* Phase dots */}
      {isRunning && (
        <div style={{ display: 'flex', gap: '0.375rem', marginTop: '1.5rem' }}>
          {currentMode.phases.map((p, i) => (
            <div
              key={i}
              style={{
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '50%',
                background: i === phaseIdx ? circleColor : isDarkMode() ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                transition: 'background 0.3s ease',
              }}
              title={`${p.label} ${p.duration}s`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
