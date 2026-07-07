import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dark } from '../contexts/ThemeContext'

const STORAGE_KEY = 'mindease-guided'
const guideDismissed = () => localStorage.getItem(STORAGE_KEY) === '1'

interface MoodOption {
  emoji: string
  label: string
  color: string
  primary: { to: string; text: string }
  secondary: { to: string; text: string }
  message: string
}

const moodOptions: MoodOption[] = [
  {
    emoji: '😊', label: '心情不错', color: '#6EE7B7',
    message: '太好了！好心情值得记录下来。',
    primary: { to: '/games', text: '来种朵花庆祝一下' },
    secondary: { to: '/mood-diary', text: '记下今天的好心情' },
  },
  {
    emoji: '😐', label: '有点平淡', color: '#FCD34D',
    message: '来给今天加点色彩吧。',
    primary: { to: '/games', text: '戳几个泡泡，放松一下' },
    secondary: { to: '/articles', text: '看看一篇心理文章' },
  },
  {
    emoji: '😟', label: '有些焦虑', color: '#FDBA74',
    message: '焦虑的时候，身体需要慢慢放松下来。',
    primary: { to: '/relax', text: '试试2分钟呼吸，我陪你' },
    secondary: { to: '/articles/panic-attack-survival', text: '看看情绪急救箱' },
  },
  {
    emoji: '😔', label: '不太好', color: '#FDA4AF',
    message: '每个人都有低落的时候。你不需要独自承受。',
    primary: { to: '/treehole', text: '想说说话吗？树洞在这里' },
    secondary: { to: '/articles/why-not-want-to-heal', text: '看看这篇：不想好起来也没关系' },
  },
]

export default function FirstTimeGuide() {
  const [show, setShow] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  useEffect(() => {
    if (!guideDismissed()) {
      setShow(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setShow(false)
  }

  if (!show) return null

  const selected = selectedMood ? moodOptions.find(m => m.label === selectedMood) : null

  return (
    <div style={{
      maxWidth: 560, margin: '0 auto 24px', padding: '0 16px',
      animation: 'fadeSlideUp 0.6s ease-out',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(110,231,183,0.08))',
        borderRadius: 24, padding: 24, position: 'relative',
        border: '1px solid rgba(167,139,250,0.15)',
        backdropFilter: 'blur(10px)',
      }}>
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute', top: 12, right: 12, width: 28, height: 28,
            borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'rgba(0,0,0,0.05)', color: '#9CA3AF', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title="不再显示"
        >
          ✕
        </button>

        {!selectedMood ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>👋</span>
              <h3 style={{
                fontSize: 18, fontWeight: 600,
                color: dark('#374151', '#d1d5db'), marginBottom: 6,
              }}>
                第一次来心晴驿站？
              </h3>
              <p style={{ fontSize: 13, color: dark('#9CA3AF', '#6b7280'), lineHeight: 1.6 }}>
                告诉我你现在的心情，我帮你找到最合适的事做
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {moodOptions.map(m => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMood(m.label)}
                  style={{
                    padding: '16px 8px', borderRadius: 16, border: '2px solid transparent',
                    background: `${m.color}12`, cursor: 'pointer',
                    transition: 'all 0.25s', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 6,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.borderColor = m.color
                    e.currentTarget.style.boxShadow = `0 4px 12px ${m.color}25`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.borderColor = 'transparent'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span style={{ fontSize: 30 }}>{m.emoji}</span>
                  <span style={{ fontSize: 12, color: dark('#4B5563', '#d1d5db'), fontWeight: 500 }}>{m.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>{selected?.emoji}</span>
              <p style={{
                fontSize: 15, color: dark('#374151', '#e5e7eb'),
                lineHeight: 1.7, fontWeight: 500,
              }}>
                {selected?.message}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Link
                to={selected?.primary.to || '/games'}
                onClick={handleDismiss}
                style={{
                  padding: '12px 28px', borderRadius: 14, fontSize: 14, fontWeight: 600,
                  background: `linear-gradient(135deg, ${selected?.color}, #A78BFA)`,
                  color: '#fff', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  boxShadow: `0 4px 12px ${selected?.color}30`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {selected?.primary.text} →
              </Link>
              <Link
                to={selected?.secondary.to || '/articles'}
                onClick={handleDismiss}
                style={{
                  padding: '12px 20px', borderRadius: 14, fontSize: 13, fontWeight: 500,
                  border: '1px solid rgba(167,139,250,0.2)',
                  color: dark('#6B7280', '#9ca3af'), textDecoration: 'none',
                  background: 'rgba(167,139,250,0.04)',
                  transition: 'border-color 0.2s',
                }}
              >
                {selected?.secondary.text}
              </Link>
            </div>

            <button
              onClick={() => setSelectedMood(null)}
              style={{
                marginTop: 14, padding: '4px 12px', fontSize: 12,
                border: 'none', background: 'none',
                color: dark('#D1D5DB', '#6b7280'), cursor: 'pointer',
                display: 'block', marginLeft: 'auto', marginRight: 'auto',
              }}
            >
              换一个心情
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
