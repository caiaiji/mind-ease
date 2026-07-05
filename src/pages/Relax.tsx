import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useState, lazy, Suspense } from 'react'
import { relaxTips } from '../data/relax'

const WhiteNoise = lazy(() => import('../components/WhiteNoise'))
const BreathingGuide = lazy(() => import('../components/BreathingGuide'))
const MindfulnessTimer = lazy(() => import('../components/MindfulnessTimer'))

function ToolLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-lavender-200 border-t-lavender-500 rounded-full animate-spin" />
        <span className="text-sm text-gray-400 dark:text-gray-500">加载工具中...</span>
      </div>
    </div>
  )
}

export default function Relax() {
    useDocumentTitle('放松工具')

  const [showBreathing, setShowBreathing] = useState(false)
  const [showWhiteNoise, setShowWhiteNoise] = useState(false)
  const [showMindfulness, setShowMindfulness] = useState(false)

  if (showBreathing) {
    return (
      <Suspense fallback={<ToolLoader />}>
        <BreathingGuide onBack={() => setShowBreathing(false)} />
      </Suspense>
    )
  }

  if (showMindfulness) {
    return (
      <Suspense fallback={<ToolLoader />}>
        <MindfulnessTimer onBack={() => setShowMindfulness(false)} />
      </Suspense>
    )
  }

  if (showWhiteNoise) {
    return (
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <button onClick={() => setShowWhiteNoise(false)} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              ← 返回放松工具
            </button>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-gray-800 dark:text-gray-100 mb-3">白噪音</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-2xl">
            用自然的声音包裹自己，隔绝外界喧嚣，帮助放松和入睡。
          </p>
          <Suspense fallback={<ToolLoader />}>
            <WhiteNoise />
          </Suspense>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <section className="px-6 md:px-12 lg:px-20 pt-12 pb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl text-gray-800 dark:text-gray-100 mb-3">放松工具</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">
            给自己几分钟时间，试试这些简单有效的放松方法，让身心回到平衡状态。
          </p>
        </div>
      </section>

      {/* Tool Cards */}
      <section className="px-6 md:px-12 lg:px-20 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Breathing Guide */}
          <div className="glass-card p-8 text-center bg-gradient-to-br from-lavender-50/80 to-mint-50/80 dark:from-lavender-950/30 dark:to-mint-950/30 hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => setShowBreathing(true)}>
            <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">🌬</span>
            <h2 className="font-display text-xl text-gray-800 dark:text-gray-100 mb-2">呼吸引导</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              3种呼吸模式，精美动画引导，跟着节奏放松身心
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              <span className="text-xs px-2 py-0.5 rounded-full bg-lavender-100 dark:bg-lavender-900/40 text-lavender-600 dark:text-lavender-400">4-7-8</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-mint-100 dark:bg-mint-900/40 text-mint-600 dark:text-mint-400">方形</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-peach-100 dark:bg-peach-900/40 text-peach-600 dark:text-peach-400">等比</span>
            </div>
          </div>

          {/* Mindfulness Timer */}
          <div className="glass-card p-8 text-center bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => setShowMindfulness(true)}>
            <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">🧘</span>
            <h2 className="font-display text-xl text-gray-800 dark:text-gray-100 mb-2">正念计时</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              选择时长，在引导语中安静地与内心对话
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">3-15分钟</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">引导语</span>
            </div>
          </div>

          {/* White Noise */}
          <div className="glass-card p-8 text-center bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => setShowWhiteNoise(true)}>
            <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">🎧</span>
            <h2 className="font-display text-xl text-gray-800 dark:text-gray-100 mb-2">白噪音</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              雨声、海浪、篝火，用自然声音帮助放松和入睡
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">6种音效</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400">离线可用</span>
            </div>
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
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-lavender-50 dark:bg-lavender-900/40 flex items-center justify-center text-2xl">
          {tip.emoji}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-1">{tip.title}</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">{tip.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-300 dark:text-gray-600">
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
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-lavender-100 dark:bg-lavender-900/40 text-lavender-500 dark:text-lavender-400 text-xs flex items-center justify-center font-medium">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
