import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dark } from '../contexts/ThemeContext'

const STORAGE_KEY = 'mindease-guided'
const guideDismissed = () => localStorage.getItem(STORAGE_KEY) === '1'

const moodRoutes = {
  '很开心': { primary: '/games', secondary: '/mood-diary', message: '好心情值得记录！试试玩个小游戏放松一下，或者记录一下今天的好心情' },
  '还不错': { primary: '/articles', secondary: '/relax', message: '状态不错时适合学习新知识！看看心理科普文章，或试试冥想练习' },
  '有些焦虑': { primary: '/assessment', secondary: '/relax', message: '感到焦虑很正常。先做个快速测评了解自己，试试呼吸放松法缓解一下' },
  '不太好': { primary: '/treehole', secondary: '/assessment', message: '每个人都有低落的时候。可以在树洞安全地倾诉，或做个测评了解状况' },
}

const moodEntry = [
  { emoji: '😊', label: '很开心', color: '#6EE7B7' },
  { emoji: '🙂', label: '还不错', color: '#A7F3D0' },
  { emoji: '😟', label: '有些焦虑', color: '#FDBA74' },
  { emoji: '😔', label: '不太好', color: '#FDA4AF' },
]

export default function FirstTimeGuide() {
  const [show, setShow] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  useEffect(() => {
    if (!guideDismissed()) {
      setShow(true)
    }
  }, [])

  const handleSelect = (label: string) => {
    setSelectedMood(label)
  }

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setShow(false)
  }

  if (!show) return null

  const recommendation = selectedMood ? moodRoutes[selectedMood as keyof typeof moodRoutes] : null

  return (
    <div style={{
      maxWidth: 640, margin: '0 auto 32px', padding: '0 16px',
      animation: 'fadeSlideUp 0.6s ease-out',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(110,231,183,0.08))',
        borderRadius: 24, padding: 24, position: 'relative',
        border: '1px solid rgba(167,139,250,0.15)',
        backdropFilter: 'blur(10px)',
      }}>
        {/* Close button */}
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
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>👋</span>
              <h3 style={{
                fontSize: 18, fontWeight: 600,
                color: dark('#374151', '#d1d5db'), marginBottom: 4,
              }}>
                欢迎来到心晴驿站！
              </h3>
              <p style={{ fontSize: 13, color: '#9CA3AF' }}>
                第一次来？选一个最接近你现在状态的选项，我来帮你找到合适的工具
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {moodEntry.map(m => (
                <button
                  key={m.label}
                  onClick={() => handleSelect(m.label)}
                  style={{
                    padding: '14px 8px', borderRadius: 16, border: '2px solid transparent',
                    background: `${m.color}15`, cursor: 'pointer',
                    transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 6,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = m.color }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'transparent' }}
                >
                  <span style={{ fontSize: 28 }}>{m.emoji}</span>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{m.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>
                {moodEntry.find(m => m.label === selectedMood)?.emoji}
              </span>
              <p style={{
                fontSize: 14, color: dark('#374151', '#d1d5db'),
                lineHeight: 1.7, marginBottom: 12,
              }}>
                {recommendation?.message}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Link
                to={recommendation?.primary || '/articles'}
                onClick={handleDismiss}
                style={{
                  padding: '10px 24px', borderRadius: 14, fontSize: 14, fontWeight: 600,
                  background: 'linear-gradient(135deg, #A78BFA, #6EE7B7)', color: '#fff',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                去看看 →
              </Link>
              <Link
                to={recommendation?.secondary || '/games'}
                onClick={handleDismiss}
                style={{
                  padding: '10px 24px', borderRadius: 14, fontSize: 14, fontWeight: 500,
                  border: '1px solid #E5E7EB', color: '#6B7280',
                  textDecoration: 'none', background: '#fff',
                }}
              >
                或者试试这个
              </Link>
            </div>
            <button
              onClick={() => setSelectedMood(null)}
              style={{
                marginTop: 10, padding: '4px 12px', fontSize: 12,
                border: 'none', background: 'none', color: '#D1D5DB', cursor: 'pointer',
                display: 'block', marginLeft: 'auto', marginRight: 'auto',
              }}
            >
              重新选择
            </button>
          </>
        )}
      </div>
    </div>
  )
}
