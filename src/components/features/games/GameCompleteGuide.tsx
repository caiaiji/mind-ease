import { useState } from 'react'
import { Link } from 'react-router-dom'
import { dark } from '../../../contexts/ThemeContext'

interface GameCompleteGuideProps {
  /** Game name for display */
  gameName: string
  /** Whether the guide should show (parent controls this) */
  show: boolean
  /** Duration in seconds the user played */
  duration?: number
  /** Called when user dismisses or takes action */
  onDismiss: () => void
}

const moodOptions = [
  { emoji: '😊', label: '更放松了', value: 5 },
  { emoji: '🙂', label: '还不错', value: 4 },
  { emoji: '😐', label: '没什么变化', value: 3 },
  { emoji: '😟', label: '更焦虑了', value: 2 },
]

export default function GameCompleteGuide({ gameName, show, duration, onDismiss }: GameCompleteGuideProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [dismissed, setDismissed] = useState(false)

  const dk = dark
  const cardBg = dk('rgba(255,255,255,0.85)', 'rgba(30,27,60,0.8)')
  const cardBorder = dk('rgba(167,139,250,0.15)', 'rgba(139,92,246,0.2)')
  const textPrimary = dk('#1F2937', '#e5e7eb')
  const textSecondary = dk('#6B7280', '#9ca3af')
  const textMuted = dk('#9CA3AF', '#6b7280')

  if (!show || dismissed) return null

  const handleDismiss = () => {
    // Save mood feedback if selected
    if (selectedMood !== null) {
      try {
        const key = 'mindease-mood-journal'
        const journal = JSON.parse(localStorage.getItem(key) || '[]')
        journal.unshift({
          id: Date.now().toString(),
          mood: selectedMood,
          note: `玩完「${gameName}」后的感受`,
          tags: ['放松', '游戏'],
          date: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        })
        localStorage.setItem(key, JSON.stringify(journal.slice(0, 90)))
      } catch { /* ignore */ }
    }
    setDismissed(true)
    onDismiss()
  }

  const durationText = duration
    ? `${Math.floor(duration / 60)} 分 ${duration % 60} 秒`
    : null

  return (
    <div style={{
      padding: '24px 0', animation: 'fadeUp 0.5s ease-out',
    }}>
      <div style={{
        background: cardBg, backdropFilter: 'blur(12px)',
        borderRadius: 20, padding: 24,
        border: `1px solid ${cardBorder}`,
        boxShadow: '0 8px 24px rgba(139,92,246,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>✨</span>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, marginBottom: 4 }}>
            你已经放松了{durationText ? ` ${durationText}` : '一会儿'}
          </h3>
          <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.6 }}>
            现在感觉怎么样？记录一下当下感受，帮助自己觉察情绪变化
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16,
        }}>
          {moodOptions.map(m => (
            <button
              key={m.value}
              onClick={() => setSelectedMood(m.value)}
              style={{
                padding: '12px 8px', borderRadius: 14, border: selectedMood === m.value
                  ? '2px solid #A78BFA' : '2px solid transparent',
                background: selectedMood === m.value
                  ? 'rgba(167,139,250,0.1)' : 'rgba(0,0,0,0.02)',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}
              onMouseEnter={e => { if (selectedMood !== m.value) e.currentTarget.style.background = 'rgba(167,139,250,0.05)' }}
              onMouseLeave={e => { if (selectedMood !== m.value) e.currentTarget.style.background = 'rgba(0,0,0,0.02)' }}
            >
              <span style={{ fontSize: 24 }}>{m.emoji}</span>
              <span style={{ fontSize: 11, color: '#6B7280' }}>{m.label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleDismiss}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 12,
              background: selectedMood ? 'linear-gradient(135deg, #A78BFA, #6EE7B7)' : '#E5E7EB',
              color: selectedMood ? '#fff' : '#9CA3AF',
              border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}
          >
            {selectedMood ? '记录感受' : '跳过'}
          </button>
          {selectedMood === 2 && (
            <Link
              to="/mood-diary"
              style={{
                padding: '10px 16px', borderRadius: 12,
                background: dk('rgba(253,186,116,0.15)', 'rgba(253,186,116,0.1)'),
                color: '#F97316', fontSize: 13, fontWeight: 500,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              去写日记 →
            </Link>
          )}
        </div>

        <p style={{ fontSize: 11, color: textMuted, textAlign: 'center', marginTop: 10 }}>
          {selectedMood === 2
            ? '如果持续感到焦虑，可以试试呼吸放松工具或找信任的人聊聊'
            : selectedMood
              ? '太好了！觉察自己的情绪变化是保护心灵的第一步'
              : '你的感受会被记录在情绪日记中'}
        </p>
      </div>
    </div>
  )
}
