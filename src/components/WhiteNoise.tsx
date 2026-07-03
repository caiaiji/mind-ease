import { useState, useRef, useEffect, useCallback } from 'react'

interface Sound {
  id: string
  name: string
  emoji: string
  desc: string
  color: string
  type: OscillatorType
  freq: number
  gain: number
  filterFreq: number
}

const sounds: Sound[] = [
  { id: 'rain', name: '雨声', emoji: '🌧', desc: '淅淅沥沥的雨滴声，最适合入睡', color: 'from-blue-50 to-cyan-50', type: 'sawtooth', freq: 120, gain: 0.08, filterFreq: 400 },
  { id: 'ocean', name: '海浪', emoji: '🌊', desc: '轻柔的海浪拍打沙滩', color: 'from-cyan-50 to-blue-50', type: 'sawtooth', freq: 80, gain: 0.06, filterFreq: 300 },
  { id: 'wind', name: '微风', emoji: '🍃', desc: '树叶沙沙作响的轻柔风声', color: 'from-green-50 to-emerald-50', type: 'triangle', freq: 200, gain: 0.04, filterFreq: 600 },
  { id: 'fire', name: '篝火', emoji: '🔥', desc: '噼啪作响的温暖篝火声', color: 'from-orange-50 to-amber-50', type: 'sawtooth', freq: 60, gain: 0.07, filterFreq: 250 },
  { id: 'stream', name: '溪流', emoji: '💧', desc: '潺潺流水声，心灵洗涤', color: 'from-sky-50 to-blue-50', type: 'triangle', freq: 300, gain: 0.03, filterFreq: 800 },
  { id: 'night', name: '夜晚', emoji: '🌙', desc: '夏夜虫鸣，宁静安详', color: 'from-indigo-50 to-purple-50', type: 'sine', freq: 4000, gain: 0.005, filterFreq: 100 },
]

export default function WhiteNoise() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [volume, setVolume] = useState(70)
  const [timerMin, setTimerMin] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode; filter: BiquadFilterNode } | null>(null)
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const noiseGainRef = useRef<GainNode | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (nodesRef.current) {
      try { nodesRef.current.osc.stop() } catch {}
      nodesRef.current = null
    }
    if (noiseSourceRef.current) {
      try { noiseSourceRef.current.stop() } catch {}
      noiseSourceRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close()
      audioCtxRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsPlaying(false)
    setRemaining(0)
    setActiveId(null)
  }, [])

  const play = useCallback((sound: Sound) => {
    stop()
    const ctx = new AudioContext()
    audioCtxRef.current = ctx

    const masterGain = ctx.createGain()
    masterGain.gain.value = volume / 100
    masterGain.connect(ctx.destination)
    noiseGainRef.current = masterGain

    // Create noise buffer
    const bufferSize = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1)
      }
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = sound.filterFreq

    const gain = ctx.createGain()
    gain.gain.value = sound.gain

    source.connect(filter)
    filter.connect(gain)
    gain.connect(masterGain)

    source.start()
    noiseSourceRef.current = source
    nodesRef.current = { osc: source as any, gain, filter }

    setActiveId(sound.id)
    setIsPlaying(true)

    if (timerMin > 0) {
      setRemaining(timerMin * 60)
    }
  }, [volume, timerMin, stop])

  // Volume control
  useEffect(() => {
    if (noiseGainRef.current) {
      noiseGainRef.current.gain.value = volume / 100
    }
  }, [volume])

  // Timer countdown
  useEffect(() => {
    if (remaining > 0 && isPlaying) {
      timerRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            stop()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [remaining, isPlaying, stop])

  const togglePlay = (sound: Sound) => {
    if (activeId === sound.id && isPlaying) {
      stop()
    } else {
      play(sound)
    }
  }

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 0' }}>
      {/* Volume */}
      <div style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: 16,
        border: '1px solid rgba(139,92,246,0.1)',
        padding: '16px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}>
        <span style={{ fontSize: 24 }}>🔊</span>
        <span style={{ fontSize: 14, color: '#6B7280', minWidth: 60 }}>音量</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#8B5CF6', height: 6 }}
        />
        <span style={{ fontSize: 14, color: '#8B5CF6', fontWeight: 600, minWidth: 40 }}>{volume}%</span>
      </div>

      {/* Timer */}
      <div style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: 16,
        border: '1px solid rgba(139,92,246,0.1)',
        padding: '16px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}>
        <span style={{ fontSize: 24 }}>⏱</span>
        <span style={{ fontSize: 14, color: '#6B7280', minWidth: 60 }}>定时</span>
        {remaining > 0 ? (
          <span style={{ fontSize: 24, fontWeight: 700, color: '#8B5CF6', fontFamily: 'monospace', minWidth: 80 }}>
            {fmtTime(remaining)}
          </span>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 15, 30, 60, 120].map(m => (
              <button
                key={m}
                onClick={() => setTimerMin(m)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  border: timerMin === m ? '2px solid #8B5CF6' : '1px solid #E5E7EB',
                  background: timerMin === m ? '#EDE9FE' : '#fff',
                  color: timerMin === m ? '#8B5CF6' : '#6B7280',
                  cursor: 'pointer'
                }}
              >
                {m === 0 ? '不限' : `${m}分`}
              </button>
            ))}
          </div>
        )}
        {isPlaying && remaining > 0 && (
          <button
            onClick={stop}
            style={{
              marginLeft: 'auto',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 13,
              border: '1px solid #F87171',
              background: '#FEF2F2',
              color: '#EF4444',
              cursor: 'pointer'
            }}
          >
            停止定时
          </button>
        )}
      </div>

      {/* Sound Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 16
      }}>
        {sounds.map(sound => {
          const isActive = activeId === sound.id && isPlaying
          return (
            <button
              key={sound.id}
              onClick={() => togglePlay(sound)}
              style={{
                padding: 24,
                borderRadius: 20,
                border: isActive ? '2px solid #8B5CF6' : '2px solid transparent',
                background: isActive
                  ? 'linear-gradient(135deg, #EDE9FE, #F3F4F6)'
                  : 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'left',
                boxShadow: isActive ? '0 4px 20px rgba(139,92,246,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                transform: isActive ? 'scale(1.02)' : 'none'
              }}
            >
              <span style={{ fontSize: 36, display: 'block', marginBottom: 12 }}>{sound.emoji}</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#1F2937', display: 'block', marginBottom: 4 }}>
                {sound.name}
                {isActive && (
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#8B5CF6', fontWeight: 500 }}>
                    ▶ 播放中
                  </span>
                )}
              </span>
              <span style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.5 }}>
                {sound.desc}
              </span>
            </button>
          )
        })}
      </div>

      {/* Tip */}
      <div style={{
        marginTop: 24,
        padding: '16px 20px',
        borderRadius: 16,
        background: 'rgba(167,139,250,0.08)',
        border: '1px solid rgba(139,92,246,0.1)',
        fontSize: 13,
        color: '#8B5CF6',
        lineHeight: 1.6,
        textAlign: 'center'
      }}>
        💡 白噪音由浏览器 Web Audio API 生成，无需联网，不上传任何数据。适合睡前、学习或冥想时播放。
      </div>
    </div>
  )
}
