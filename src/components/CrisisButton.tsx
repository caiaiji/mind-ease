import { useState, useCallback } from 'react'
import { dark } from '../contexts/ThemeContext'

const HOTLINES = [
  { name: '全国心理援助热线', number: '400-161-9995', icon: '📞', desc: '24 小时' },
  { name: '北京心理危机干预中心', number: '010-82951332', icon: '📞', desc: '24 小时' },
  { name: '共青团心理咨询热线', number: '12355', icon: '📞', desc: '心理援助' },
  { name: '生命热线', number: '400-821-1215', icon: '📞', desc: '生命热线' },
]

export default function CrisisButton() {
  const [open, setOpen] = useState(false)

  const d = useCallback((light: string, darkVal: string) => dark(light, darkVal), [])

  const cardBg = d('rgba(255,255,255,0.95)', 'rgba(30,27,60,0.95)')
  const textColor = d('#374151', '#d1d5db')
  const subColor = d('#6B7280', '#9ca3af')
  const borderColor = d('rgba(139,92,246,0.15)', 'rgba(139,92,246,0.25)')

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="紧急求助热线"
        title="需要帮助？点击查看心理援助热线"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          background: open ? d('#6B7280', '#374151') : 'linear-gradient(135deg, #FDA4AF, #A78BFA)',
          color: open ? '#fff' : '#fff',
          boxShadow: open
            ? '0 4px 12px rgba(0,0,0,0.15)'
            : '0 4px 16px rgba(139,92,246,0.35)',
          transition: 'all 0.3s ease',
          transform: open ? 'rotate(0deg)' : 'rotate(0deg)',
        }}
      >
        {open ? '✕' : '🆘'}
      </button>

      {/* Popup Panel */}
      {open && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9998,
              background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)',
            }}
          />
          {/* Panel */}
          <div
            style={{
              position: 'fixed',
              bottom: 88,
              right: 24,
              width: 300,
              maxWidth: 'calc(100vw - 48px)',
              borderRadius: 20,
              padding: '20px 18px',
              zIndex: 9999,
              background: cardBg,
              border: `1px solid ${borderColor}`,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              animation: 'page-enter 0.2s ease-out',
              fontFamily: '"Noto Sans SC", sans-serif',
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: textColor, marginBottom: 4, fontFamily: '"ZCOOL XiaoWei", serif' }}>
              紧急求助热线
            </h3>
            <p style={{ fontSize: 12, color: subColor, marginBottom: 14, lineHeight: 1.5 }}>
              如果你或身边的人正在经历心理危机，请立即拨打以下电话。
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HOTLINES.map((h) => (
                <a
                  key={h.number}
                  href={`tel:${h.number}`}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 14,
                    background: d('rgba(167,139,250,0.06)', 'rgba(167,139,250,0.1)'),
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{h.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: subColor }}>{h.desc}</div>
                  </div>
                  <span style={{
                    fontSize: 14, fontWeight: 700, color: '#A78BFA',
                    flexShrink: 0, fontFamily: 'monospace',
                  }}>
                    {h.number}
                  </span>
                </a>
              ))}
            </div>

            <p style={{ fontSize: 11, color: subColor, marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
              你不是一个人。总有人愿意倾听。
            </p>
          </div>
        </>
      )}
    </>
  )
}
