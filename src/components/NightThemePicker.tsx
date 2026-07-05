import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'mindease-night-color'

// Preset night theme colors
const PRESETS = [
  { name: '星空紫', bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', solid: '#1a1632', accent: '#7c3aed' },
  { name: '深夜蓝', bg: 'linear-gradient(135deg, #0a1628, #1a2744, #0d1b2a)', solid: '#0f1b2d', accent: '#3b82f6' },
  { name: '森林夜', bg: 'linear-gradient(135deg, #0a1f0a, #1a3a1a, #0d260d)', solid: '#0f250f', accent: '#22c55e' },
  { name: '暖夜橘', bg: 'linear-gradient(135deg, #1a0f0a, #2d1a0f, #26150d)', solid: '#1f120a', accent: '#f97316' },
  { name: '极光绿', bg: 'linear-gradient(135deg, #0a1a1a, #0d2626, #0a2020)', solid: '#0d1f1f', accent: '#06b6d4' },
  { name: '玫瑰夜', bg: 'linear-gradient(135deg, #1a0a14, #2d0f24, #260d1e)', solid: '#1f0d18', accent: '#ec4899' },
]

function getStoredBg(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(STORAGE_KEY) || ''
}

function setStoredBg(bg: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, bg)
}

// Apply background to body
function applyBg(bg: string) {
  const body = document.body
  if (bg.includes('gradient')) {
    body.style.backgroundImage = bg
    body.style.backgroundColor = ''
  } else {
    body.style.backgroundImage = ''
    body.style.backgroundColor = bg
  }
}

// Remove custom background
function removeBg() {
  const body = document.body
  body.style.backgroundImage = ''
  body.style.backgroundColor = ''
}

interface NightThemePickerProps {
  isDark: boolean
}

export default function NightThemePicker({ isDark }: NightThemePickerProps) {
  const [open, setOpen] = useState(false)
  const [customColor, setCustomColor] = useState('#1a1632')
  const [activePreset, setActivePreset] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Load stored bg on mount
  useEffect(() => {
    const stored = getStoredBg()
    if (stored) {
      if (isDark) applyBg(stored)
      // Find matching preset
      const idx = PRESETS.findIndex(p => p.bg === stored)
      if (idx >= 0) setActivePreset(idx)
    }
  }, [isDark])

  // Apply/remove bg when switching themes
  useEffect(() => {
    if (isDark) {
      const stored = getStoredBg()
      if (stored) applyBg(stored)
    } else {
      removeBg()
    }
  }, [isDark])

  // Close on click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handlePreset = (index: number) => {
    const preset = PRESETS[index]
    setActivePreset(index)
    if (isDark) applyBg(preset.bg)
    setStoredBg(preset.bg)
  }

  const handleCustom = () => {
    if (isDark) applyBg(customColor)
    setStoredBg(customColor)
  }

  const handleReset = () => {
    setActivePreset(0)
    setCustomColor('#1a1632')
    const preset = PRESETS[0]
    if (isDark) applyBg(preset.bg)
    setStoredBg(preset.bg)
  }

  if (!isDark) return null

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Picker trigger button */}
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        title="自定义背景色"
        aria-label="自定义背景色"
        style={{
          width: 28, height: 28, borderRadius: '50%',
          border: '2px solid rgba(167,139,250,0.4)',
          background: PRESETS[activePreset].solid,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        <svg style={{ width: 14, height: 14, color: '#a78bfa' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      {/* Picker panel */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 8,
            width: 260, padding: 16, zIndex: 9999,
            background: 'rgba(20, 18, 40, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: 16,
            border: '1px solid rgba(139, 92, 246, 0.25)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            animation: 'fadeUp 0.2s ease-out',
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>🌙</span> 夜景主题
          </p>

          {/* Preset grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
            {PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => handlePreset(i)}
                title={preset.name}
                style={{
                  height: 48, borderRadius: 12,
                  background: preset.bg,
                  border: activePreset === i
                    ? `2px solid ${preset.accent}`
                    : '2px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (activePreset !== i) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                onMouseLeave={e => { if (activePreset !== i) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                {activePreset === i && (
                  <span style={{ position: 'absolute', top: 2, right: 4, fontSize: 10, color: preset.accent }}>✓</span>
                )}
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', display: 'block', paddingTop: 28 }}>{preset.name}</span>
              </button>
            ))}
          </div>

          {/* Custom color */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ position: 'relative' }}>
              <input
                type="color"
                value={customColor}
                onChange={e => setCustomColor(e.target.value)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer', padding: 2,
                }}
              />
            </div>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>自定义颜色</span>
            <button
              onClick={handleCustom}
              style={{
                marginLeft: 'auto', padding: '4px 12px', borderRadius: 8,
                fontSize: 11, fontWeight: 500, border: '1px solid rgba(139,92,246,0.3)',
                background: 'rgba(139,92,246,0.15)', color: '#a78bfa', cursor: 'pointer',
              }}
            >
              应用
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            style={{
              width: '100%', padding: '6px 0', borderRadius: 8,
              fontSize: 11, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', color: '#6b7280',
            }}
          >
            恢复默认（星空紫）
          </button>
        </div>
      )}
    </div>
  )
}

export { PRESETS, getStoredBg, applyBg, removeBg, STORAGE_KEY }
