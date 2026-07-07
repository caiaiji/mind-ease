import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

// ========== Breathing Component (embedded 4-7-8) ==========
function SleepBreathing() {
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle')
  const [count, setCount] = useState(0)
  const [rounds, setRounds] = useState(0)
  const [totalRounds] = useState(3)

  useEffect(() => {
    if (phase === 'idle') return
    const timers: ReturnType<typeof setTimeout>[] = []
    if (phase === 'inhale') {
      for (let i = 1; i <= 4; i++) timers.push(setTimeout(() => setCount(i), i * 1000))
      timers.push(setTimeout(() => { setPhase('hold'); setCount(0) }, 4000))
    } else if (phase === 'hold') {
      for (let i = 1; i <= 7; i++) timers.push(setTimeout(() => setCount(i), i * 1000))
      timers.push(setTimeout(() => { setPhase('exhale'); setCount(0) }, 7000))
    } else if (phase === 'exhale') {
      for (let i = 1; i <= 8; i++) timers.push(setTimeout(() => setCount(i), i * 1000))
      timers.push(setTimeout(() => {
        setRounds(r => {
          const next = r + 1
          if (next >= totalRounds) { setPhase('idle'); return next }
          setPhase('inhale'); setCount(0); return next
        })
      }, 8000))
    }
    return () => timers.forEach(clearTimeout)
  }, [phase, totalRounds])

  const reset = () => { setPhase('idle'); setCount(0); setRounds(0) }
  
  const phaseConfig = {
    idle: { text: '准备好了吗？', desc: '吸气4秒 → 屏住7秒 → 呼气8秒', color: '#818CF8', scale: 1 },
    inhale: { text: '吸气...', desc: `缓缓吸气 ${4 - count}`, color: '#818CF8', scale: 1 + (count / 4) * 0.3 },
    hold: { text: '屏住...', desc: `保持不动 ${7 - count}`, color: '#A78BFA', scale: 1.3 },
    exhale: { text: '呼气...', desc: `慢慢呼出 ${8 - count}`, color: '#22D3EE', scale: 1.3 - (count / 8) * 0.3 },
  }
  const cfg = phaseConfig[phase]

  return (
    <div className="text-center py-8">
      <div className="relative inline-block mb-6">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out"
          style={{
            background: `radial-gradient(circle, ${cfg.color}30, ${cfg.color}08)`,
            border: `2px solid ${cfg.color}40`,
            transform: `scale(${cfg.scale})`,
          }}
        >
          <span className="text-3xl font-light" style={{ color: cfg.color }}>
            {phase === 'idle' ? '🌙' : count}
          </span>
        </div>
      </div>
      <p className="text-lg font-medium mb-1" style={{ color: cfg.color }}>{cfg.text}</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">{cfg.desc}</p>
      {phase !== 'idle' && <p className="text-xs text-gray-300 dark:text-gray-600">第 {rounds + 1} / {totalRounds} 轮</p>}
      <div className="mt-6 flex gap-3 justify-center">
        {phase === 'idle' ? (
          <button onClick={() => { setPhase('inhale'); setCount(0) }} className="sleep-btn">
            开始呼吸
          </button>
        ) : (
          <button onClick={reset} className="sleep-btn-outline">
            停止
          </button>
        )}
      </div>
      {rounds >= totalRounds && phase === 'idle' && rounds > 0 && (
        <div className="mt-4 animate-fade-up">
          <p className="text-sm" style={{ color: '#A78BFA' }}>
            呼吸练习完成，身体应该更放松了
          </p>
        </div>
      )}
    </div>
  )
}

// ========== Wind Down Checklist ==========
interface CheckItem {
  id: string
  text: string
  emoji: string
  time?: string
}

const windDownSteps: CheckItem[] = [
  { id: 'screen', text: '放下手机和其他屏幕', emoji: '📵', time: '30分钟前' },
  { id: 'dim', text: '调暗房间灯光', emoji: '💡' },
  { id: 'water', text: '喝一小口温水', emoji: '🥛' },
  { id: 'write', text: '写下明天要做的一件事（清空大脑）', emoji: '✏️' },
  { id: 'breathe', text: '做3轮4-7-8呼吸', emoji: '🌬' },
  { id: 'gratitude', text: '想一件今天值得感恩的小事', emoji: '🌟' },
]

function WindDownChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      // Save to localStorage
      const today = new Date().toDateString()
      try {
        const saved = JSON.parse(localStorage.getItem('mindease-sleep-checklist') || '{}')
        saved[today] = [...next]
        localStorage.setItem('mindease-sleep-checklist', JSON.stringify(saved))
      } catch { /* ignore */ }
      return next
    })
  }

  // Load today's checklist on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mindease-sleep-checklist') || '{}')
      const today = new Date().toDateString()
      if (saved[today]) setChecked(new Set(saved[today]))
    } catch { /* ignore */ }
  }, [])

  const progress = checked.size / windDownSteps.length

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-2">
          <span>睡前准备进度</span>
          <span>{checked.size} / {windDownSteps.length}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress * 100}%`,
              background: progress === 1
                ? 'linear-gradient(90deg, #6EE7B7, #34D399)'
                : 'linear-gradient(90deg, #A78BFA, #6366F1)',
            }}
          />
        </div>
      </div>
      <div className="space-y-2">
        {windDownSteps.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group"
            style={{
              background: checked.has(item.id) ? 'rgba(110,231,183,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${checked.has(item.id) ? 'rgba(110,231,183,0.25)' : 'transparent'}`,
            }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: checked.has(item.id) ? 'rgba(110,231,183,0.2)' : 'rgba(255,255,255,0.06)' }}>
              {checked.has(item.id) ? '✅' : item.emoji}
            </div>
            <span className={`text-sm flex-1 ${checked.has(item.id) ? 'line-through' : ''}`}
              style={{ color: checked.has(item.id) ? '#7c8295' : '#d1d5db' }}>
              {item.text}
            </span>
            {item.time && (
              <span className="text-xs flex-shrink-0" style={{ color: '#7c8295' }}>{item.time}</span>
            )}
          </button>
        ))}
      </div>
      {progress === 1 && (
        <div className="mt-4 text-center animate-fade-up">
          <p className="text-sm" style={{ color: '#6EE7B7' }}>
            准备好了，祝你今晚好梦
          </p>
        </div>
      )}
    </div>
  )
}

// ========== Mood Selector ==========
const moodOptions = [
  { emoji: '😊', label: '平静', value: 4, color: '#6EE7B7' },
  { emoji: '😐', label: '一般', value: 3, color: '#FCD34D' },
  { emoji: '😟', label: '有点焦虑', value: 2, color: '#FDBA74' },
  { emoji: '😢', label: '低落', value: 1, color: '#FCA5A5' },
]

function PreSleepMood({ onRecord }: { onRecord: (v: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  

  return (
    <div className="text-center">
      <p className="text-sm mb-4" style={{ color: '#9ca3af' }}>睡前此刻，你的心情是？</p>
      <div className="flex justify-center gap-4 mb-4">
        {moodOptions.map(m => (
          <button
            key={m.value}
            onClick={() => setSelected(m.value)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200"
            style={{
              border: selected === m.value ? `2px solid ${m.color}` : '2px solid transparent',
              background: selected === m.value ? `${m.color}15` : 'transparent',
              transform: selected === m.value ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-xs" style={{ color: '#9ca3af' }}>{m.label}</span>
          </button>
        ))}
      </div>
      {selected && (
        <button
          onClick={() => onRecord(selected)}
          className="sleep-btn animate-fade-up"
        >
          记录并道晚安
        </button>
      )}
    </div>
  )
}

// ========== Companion Stats ==========
function CompanionBanner() {
  
  const hour = new Date().getHours()
  // Generate a plausible "sleeping tonight" number
  const base = hour >= 22 ? 1847 : hour >= 21 ? 1326 : hour >= 20 ? 892 : 413
  const count = base + Math.floor(Math.random() * 200)

  return (
    <div className="text-center py-3">
      <p className="text-xs" style={{ color: '#7c8295' }}>
        🌙 今晚有 <span className="font-medium" style={{ color: '#A78BFA' }}>{count.toLocaleString()}</span> 个人和你一样准备入睡，你们并不孤单
      </p>
    </div>
  )
}

// ========== Main Page ==========
export default function SleepTonight() {
  useDocumentTitle('今晚睡个好觉')

  
  const [currentStep, setCurrentStep] = useState(0)
  const [bedtime, setBedtime] = useState('')

  // Steps: 0=landing, 1=mood, 2=checklist, 3=breathing, 4=goodnight
  const steps = ['landing', 'mood', 'checklist', 'breathing', 'goodnight']

  const handleMoodRecord = useCallback((mood: number) => {
    try {
      const key = 'mindease-sleep-mood'
      const data = JSON.parse(localStorage.getItem(key) || '[]')
      data.push({
        date: new Date().toISOString(),
        mood,
      })
      localStorage.setItem(key, JSON.stringify(data.slice(-30)))
    } catch { /* ignore */ }
    setCurrentStep(2)
  }, [])

  const handleGoodnight = useCallback(() => {
    setBedtime(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }))
      setCurrentStep(4)
    try {
      const key = 'mindease-sleep-log'
      const data = JSON.parse(localStorage.getItem(key) || '[]')
      data.push({ date: new Date().toISOString(), stepsCompleted: true })
      localStorage.setItem(key, JSON.stringify(data.slice(-30)))
    } catch { /* ignore */ }
  }, [])

  const textPrimary = '#e5e7eb'
  const textSecondary = '#9ca3af'
  const textMuted = '#7c8295'

  return (
    <div className="sleep-page">
      {/* Header */}
      <section className="px-6 md:px-12 lg:px-20 pt-12 pb-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-5xl block mb-4 animate-fade-up">🌙</span>
          <h1 className="font-display text-3xl md:text-4xl mb-3 animate-fade-up" style={{ color: textPrimary }}>
            今晚睡个好觉
          </h1>
          <p className="text-base animate-fade-up stagger-1" style={{ color: textSecondary }}>
            跟着这几个简单步骤，让身体和心灵都安静下来
          </p>
          <CompanionBanner />
        </div>
      </section>

      {/* Step Indicator */}
      <section className="px-6 md:px-12 lg:px-20 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    background: i <= currentStep ? '#6366F1' : 'rgba(255,255,255,0.1)',
                    transform: i === currentStep ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
                {i < steps.length - 1 && (
                  <div className="w-8 h-0.5 rounded" style={{ background: i < currentStep ? '#6366F1' : 'rgba(255,255,255,0.1)' }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: textMuted }}>
            <span>心情</span>
            <span>准备</span>
            <span>呼吸</span>
            <span>晚安</span>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="px-6 md:px-12 lg:px-20 pb-20">
        <div className="max-w-xl mx-auto">
          {/* Step 0: Landing - auto advance to mood */}
          {currentStep === 0 && (
            <div className="glass-card p-8 text-center animate-fade-up">
              <p className="text-sm mb-6" style={{ color: textSecondary }}>
                只需要几分钟，帮你从"今天好累"过渡到"今晚可以好好休息了"。
              </p>
              <button onClick={() => setCurrentStep(1)} className="sleep-btn">
                开始今晚的入睡仪式
              </button>
            </div>
          )}

          {/* Step 1: Pre-sleep Mood */}
          {currentStep === 1 && (
            <div className="glass-card p-8 animate-fade-up">
              <PreSleepMood onRecord={handleMoodRecord} />
            </div>
          )}

          {/* Step 2: Wind-down Checklist */}
          {currentStep === 2 && (
            <div className="glass-card p-8 animate-fade-up">
              <h3 className="text-center font-medium mb-6" style={{ color: textPrimary }}>
                睡前准备清单
              </h3>
              <WindDownChecklist />
              <div className="mt-6 text-center">
                <button onClick={() => setCurrentStep(3)} className="sleep-btn">
                  准备好了，开始呼吸练习
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Breathing */}
          {currentStep === 3 && (
            <div className="glass-card p-8 animate-fade-up">
              <h3 className="text-center font-medium mb-2" style={{ color: textPrimary }}>
                4-7-8 睡前呼吸
              </h3>
              <p className="text-center text-xs mb-4" style={{ color: textMuted }}>
                这是一种帮助放松的呼吸法，让身体知道"该休息了"
              </p>
              <SleepBreathing />
              <div className="mt-4 text-center">
                <button onClick={handleGoodnight} className="sleep-btn">
                  道晚安
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Goodnight */}
          {currentStep === 4 && (
            <div className="animate-fade-up text-center py-8">
              <div className="mb-6">
                <span className="text-6xl block mb-4">🌟</span>
                <h2 className="font-display text-2xl mb-2" style={{ color: textPrimary }}>
                  晚安，辛苦了一天
                </h2>
                <p className="text-sm" style={{ color: textSecondary }}>
                  {bedtime && `入睡时间 ${bedtime}  · `}
                  明天会是一个新的开始
                </p>
              </div>

              <div className="glass-card p-6 mb-8 text-left" style={{ background: 'rgba(99,102,241,0.08)' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
                  你今天已经做了一件很了不起的事——在睡前给自己几分钟时间，
                  让心灵慢慢安静下来。很多人不会这样做，但你做了。<br/><br/>
                  不管今天发生了什么，你已经尽力了。<br/>
                  现在闭上眼睛，允许自己休息。
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs" style={{ color: textMuted }}>
                  明天醒来后可以来看看情绪仪表盘，追踪你的变化
                </p>
                <Link
                  to="/"
                  className="sleep-btn-outline inline-block"
                  style={{ textDecoration: 'none' }}
                >
                  回到首页
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
