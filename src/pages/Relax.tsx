import { useState, useEffect, useRef, useCallback } from 'react'
import { relaxTips } from '../data/relax'
import WhiteNoise from '../components/WhiteNoise'

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

export default function Relax() {
  const [showBreathing, setShowBreathing] = useState(false)
  const [showWhiteNoise, setShowWhiteNoise] = useState(false)
  const breathActiveRef = useRef(false)
  const [phase, setPhase] = useState<BreathingPhase>('inhale')
  const [count, setCount] = useState(4)
  const [cycles, setCycles] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseRef = useRef<BreathingPhase>('inhale')
  const countRef = useRef(4)
  const cyclesRef = useRef(0)

  const phaseConfig: Record<BreathingPhase, { label: string; duration: number; instruction: string }> = {
    inhale: { label: '吸气', duration: 4, instruction: '用鼻子缓缓吸气' },
    hold: { label: '屏住', duration: 7, instruction: '轻轻屏住呼吸' },
    exhale: { label: '呼气', duration: 8, instruction: '用嘴缓缓呼气' },
    rest: { label: '休息', duration: 1, instruction: '自然呼吸' },
  }

  const phaseOrder: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'rest']

  const stopBreathing = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    breathActiveRef.current = false
    setShowBreathing(false)
    setPhase('inhale')
    setCount(4)
    setCycles(0)
    phaseRef.current = 'inhale'
    countRef.current = 4
    cyclesRef.current = 0
  }, [])

  const tick = useCallback(() => {
    countRef.current -= 1
    setCount(countRef.current)

    if (countRef.current <= 0) {
      const currentIdx = phaseOrder.indexOf(phaseRef.current)
      if (currentIdx === 2) {
        // After exhale, increment cycle
        cyclesRef.current += 1
        setCycles(cyclesRef.current)
        if (cyclesRef.current >= 4) {
          stopBreathing()
          return
        }
      }
      const nextIdx = (currentIdx + 1) % 4
      phaseRef.current = phaseOrder[nextIdx]
      countRef.current = phaseConfig[phaseOrder[nextIdx]].duration
      setPhase(phaseRef.current)
      setCount(countRef.current)
    }
  }, [stopBreathing])

  const startBreathing = () => {
    setShowBreathing(true)
    breathActiveRef.current = true
    phaseRef.current = 'inhale'
    countRef.current = 4
    cyclesRef.current = 0
    setPhase('inhale')
    setCount(4)
    setCycles(0)
    timerRef.current = setInterval(tick, 1000)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const scaleMap: Record<BreathingPhase, string> = {
    inhale: 'scale(1.5)',
    hold: 'scale(1.5)',
    exhale: 'scale(1)',
    rest: 'scale(1)',
  }

  const opacityMap: Record<BreathingPhase, string> = {
    inhale: '1',
    hold: '1',
    exhale: '0.6',
    rest: '0.6',
  }

  if (showBreathing) {
    if (showWhiteNoise) {
    return (
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <button onClick={() => setShowWhiteNoise(false)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← 返回放松工具
            </button>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-gray-800 mb-3">白噪音</h1>
          <p className="text-gray-500 text-lg mb-8 max-w-2xl">
            用自然的声音包裹自己，隔绝外界喧嚣，帮助放松和入睡。
          </p>
          <WhiteNoise />
        </div>
      </div>
    )
  }

    return (
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20 min-h-[80vh] flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center">
          <button onClick={stopBreathing} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 inline-block">
            ← 返回放松工具
          </button>

          {/* Breathing Circle */}
          <div className="relative w-56 h-56 mx-auto mb-8">
            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-lavender-300 to-mint-300 opacity-20 blur-xl"
              style={{
                transform: scaleMap[phase],
                opacity: opacityMap[phase],
                transition: 'all 1s ease-in-out',
              }}
            />
            {/* Main circle */}
            <div
              className="absolute inset-4 rounded-full bg-gradient-to-br from-lavender-300 to-mint-300 flex items-center justify-center"
              style={{
                transform: scaleMap[phase],
                transition: 'all 1s ease-in-out',
              }}
            >
              <div className="text-center text-white">
                <div className="text-5xl font-light mb-1">{count}</div>
                <div className="text-sm font-medium">{phaseConfig[phase].label}</div>
              </div>
            </div>
          </div>

          <p className="text-gray-500 mb-4">{phaseConfig[phase].instruction}</p>
          <p className="text-sm text-gray-300 mb-2">4-7-8 呼吸法</p>
          <p className="text-xs text-gray-300">
            第 {cycles + 1} / 4 个循环
          </p>

          <div className="mt-8">
            <button onClick={stopBreathing} className="btn-soft">
              结束练习
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <section className="px-6 md:px-12 lg:px-20 pt-12 pb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl text-gray-800 mb-3">放松工具</h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            给自己几分钟时间，试试这些简单有效的放松方法，让身心回到平衡状态。
          </p>
        </div>
      </section>

      {/* White Noise Section */}
      <section className="px-6 md:px-12 lg:px-20 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center bg-gradient-to-br from-blue-50/80 to-indigo-50/80">
            <span className="text-4xl block mb-4">🎧</span>
            <h2 className="font-display text-2xl text-gray-800 mb-3">白噪音播放</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              雨声、海浪、篝火……用自然的声音帮助放松、专注或入睡。纯浏览器生成，无需联网。
            </p>
            <button onClick={() => setShowWhiteNoise(true)} className="btn-primary">
              打开白噪音
            </button>
          </div>
        </div>
      </section>

      {/* Breathing Exercise */}
      <section className="px-6 md:px-12 lg:px-20 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center bg-gradient-to-br from-lavender-50/80 to-mint-50/80">
            <span className="text-4xl block mb-4">🌬</span>
            <h2 className="font-display text-2xl text-gray-800 mb-3">4-7-8 呼吸练习</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              一种经典的放松呼吸法，通过控制呼吸节奏来激活副交感神经系统，
              快速缓解焦虑和紧张。4 个循环，约 1 分钟完成。
            </p>
            <button onClick={startBreathing} className="btn-primary">
              开始呼吸练习
            </button>
          </div>
        </div>
      </section>

      {/* Relax Tips */}
      <section className="px-6 md:px-12 lg:px-20 py-10 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title mb-10">自助减压技巧</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relaxTips.map((tip) => (
              <RelaxCard key={tip.id} tip={tip} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function RelaxCard({ tip }: { tip: typeof relaxTips[0] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-xl">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left flex items-start gap-4"
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-lavender-50 flex items-center justify-center text-2xl">
          {tip.emoji}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 mb-1">{tip.title}</h3>
          <p className="text-sm text-gray-400">{tip.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-300">
            <span>{tip.duration}</span>
            <span>{tip.steps.length} 个步骤</span>
            <span className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </div>
      </button>
      {expanded && (
        <div className="px-6 pb-6 pl-22 animate-fade-in">
          <div className="ml-16 space-y-3">
            {tip.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-lavender-100 text-lavender-500 text-xs flex items-center justify-center font-medium">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
