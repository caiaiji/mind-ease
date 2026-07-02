import { useState, useEffect, useRef, useCallback } from 'react'

interface Plot {
  id: number
  stage: 'empty' | 'seed' | 'sprout' | 'growing' | 'bloom'
  flower: string
  timer: number
}

const FLOWERS = ['🌸', '🌻', '🌷', '🌺', '🌹', '💐', '🌼', '💮']
const STAGE_EMOJI: Record<string, string> = { empty: '', seed: '🟤', sprout: '🌱', growing: '🌿', bloom: '' }
const STAGE_LABEL: Record<string, string> = { empty: '空地', seed: '刚种下', sprout: '发芽了', growing: '成长中', bloom: '开花了！' }
const STAGE_DURATION: Record<string, number> = { empty: 0, seed: 3, sprout: 5, growing: 7, bloom: 0 }

const GRID_SIZE = 4
const TOTAL = GRID_SIZE * GRID_SIZE

export default function FlowerGarden() {
  const [plots, setPlots] = useState<Plot[]>(
    () => Array.from({ length: TOTAL }, (_, i) => ({ id: i, stage: 'empty', flower: '', timer: 0 }))
  )
  const [bloomCount, setBloomCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  const startGrow = useCallback((plotId: number) => {
    setPlots((prev) => {
      const plot = prev.find((p) => p.id === plotId)
      if (!plot || plot.stage !== 'empty') return prev
      return prev.map((p) =>
        p.id === plotId
          ? { ...p, stage: 'seed', flower: FLOWERS[Math.floor(Math.random() * FLOWERS.length)], timer: 0 }
          : p
      )
    })
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setPlots((prev) => {
        let newBloomCount = 0
        const updated = prev.map((p) => {
          if (p.stage === 'empty') return p
          if (p.stage === 'bloom') { newBloomCount++; return p }
          const nextTimer = p.timer + 1
          const duration = STAGE_DURATION[p.stage] ?? 1
          if (nextTimer >= duration) {
            const order: string[] = ['seed', 'sprout', 'growing', 'bloom']
            const nextStage = order[order.indexOf(p.stage) + 1] ?? 'bloom'
            if (nextStage === 'bloom') newBloomCount++
            return { ...p, stage: nextStage as Plot['stage'], timer: 0 }
          }
          return { ...p, timer: nextTimer }
        })
        setBloomCount(newBloomCount)
        return updated
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const getProgress = (plot: Plot) => {
    if (plot.stage === 'empty' || plot.stage === 'bloom') return 0
    return Math.min((plot.timer / (STAGE_DURATION[plot.stage] ?? 1)) * 100, 100)
  }

  const reset = () => {
    setPlots(Array.from({ length: TOTAL }, (_, i) => ({ id: i, stage: 'empty', flower: '', timer: 0 })))
    setBloomCount(0)
  }

  const plotStyle = (plot: Plot): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: 80, height: 80, borderRadius: 16, border: '2px solid',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 4, transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
      padding: 4,
    }
    if (plot.stage === 'empty') return { ...base, background: 'rgba(254,243,199,0.8)', borderColor: 'rgba(253,224,71,0.5)', cursor: 'pointer' }
    if (plot.stage === 'bloom') return { ...base, background: 'rgba(209,250,229,0.5)', borderColor: 'rgba(110,231,183,0.5)', transform: 'scale(1.05)' }
    return { ...base, background: 'rgba(254,243,199,0.8)', borderColor: 'rgba(253,224,71,0.5)', cursor: 'default' }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', borderRadius: 16, padding: '12px 20px', border: '1px solid rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>已开花</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#374151' }}>{bloomCount} / {TOTAL}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', borderRadius: 16, padding: '12px 20px', border: '1px solid rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>花种</div>
          <div style={{ fontSize: 14 }}>{FLOWERS.join(' ')}</div>
        </div>
      </div>

      <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24 }}>点击空地种下种子，静静等待花开 💐</p>

      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 80px)`,
        gap: 12, padding: 24, borderRadius: 24,
        background: 'rgba(209,250,229,0.3)', justifyContent: 'center', margin: '0 auto', width: 'fit-content',
      }}>
        {plots.map((plot) => (
          <button key={plot.id} onClick={() => startGrow(plot.id)} disabled={plot.stage !== 'empty'} style={plotStyle(plot)}>
            <span style={{ fontSize: 28 }}>{plot.stage === 'bloom' ? plot.flower : STAGE_EMOJI[plot.stage]}</span>
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>{STAGE_LABEL[plot.stage]}</span>
            {plot.stage !== 'empty' && plot.stage !== 'bloom' && (
              <div style={{ position: 'absolute', bottom: 4, left: 8, right: 8, height: 4, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#34D399', borderRadius: 2, width: `${getProgress(plot)}%`, transition: 'width 1s linear' }} />
              </div>
            )}
          </button>
        ))}
      </div>

      {bloomCount > 0 && (
        <div style={{ marginTop: 24 }}>
          <button onClick={reset} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.6)',
            color: '#8B5CF6', border: '1px solid rgba(167,139,250,0.3)',
            fontWeight: 500, cursor: 'pointer', fontSize: 14,
          }}>🔄 重新种</button>
        </div>
      )}

      {bloomCount === TOTAL && (
        <div style={{ marginTop: 24, animation: 'fadeUp 0.6s ease-out forwards' }}>
          <div style={{
            display: 'inline-block', padding: 24, background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🌺</div>
            <div style={{ fontFamily: '"ZCOOL XiaoWei", serif', fontSize: 20, color: '#374151' }}>满园花开，好美！</div>
          </div>
        </div>
      )}
    </div>
  )
}
