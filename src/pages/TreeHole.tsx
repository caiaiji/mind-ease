import { useState, useEffect, useRef, useCallback } from 'react'
import { dark } from '../contexts/ThemeContext'

const STORAGE_KEY = 'mindease-treehole'

interface Message {
  id: string
  content: string
  mood: number
  nickname: string
  date: string
  likes: number
  replies: { nickname: string; content: string; date: string }[]
}

const moodEmojis = ['😢', '😟', '😐', '🙂', '😊']
const moodLabels = ['很难受', '不太好', '一般', '还不错', '很开心']

const NICKNAME_KEY = 'mindease-treehole-nickname'

function loadMessages(): Message[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}
function saveMessages(msgs: Message[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(0, 200)))
}
function loadNickname(): string {
  try { return localStorage.getItem(NICKNAME_KEY) || '' }
  catch { return '' }
}

export default function TreeHole() {
  const [messages, setMessages] = useState<Message[]>(loadMessages)
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState(loadNickname)
  const [selectedMood, setSelectedMood] = useState(2)
  const [replyTarget, setReplyTarget] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [replyNick, setReplyNick] = useState(loadNickname)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => { saveMessages(messages) }, [messages])

  const submitMessage = useCallback(() => {
    if (!content.trim()) return
    const nick = nickname.trim() || '匿名小树'
    const msg: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      mood: selectedMood,
      nickname: nick,
      date: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      likes: 0,
      replies: [],
    }
    setMessages(prev => [msg, ...prev])
    setContent('')
    localStorage.setItem(NICKNAME_KEY, nick)
  }, [content, nickname, selectedMood])

  const likeMessage = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m))
  }

  const submitReply = (msgId: string) => {
    if (!replyContent.trim()) return
    const nick = replyNick.trim() || '匿名小树'
    setMessages(prev => prev.map(m => m.id === msgId ? {
      ...m,
      replies: [...m.replies, {
        nickname: nick,
        content: replyContent.trim(),
        date: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      }]
    } : m))
    setReplyContent('')
    setReplyTarget(null)
  }

  const clearAll = () => { setMessages([]) }

  const s = {
    page: { background: '#FFFBF5', minHeight: '100vh', fontFamily: '"Noto Sans SC", sans-serif', color: dark('#374151', '#d1d5db'), padding: '100px 16px 60px' },
    container: { maxWidth: 640, margin: '0 auto' },
    title: { fontSize: 28, fontWeight: 700, color: dark('#374151', '#d1d5db'), marginBottom: 4, fontFamily: '"ZCOOL XiaoWei", serif' },
    subtitle: { fontSize: 14, color: '#9CA3AF', marginBottom: 32 },
    card: { background: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 24, marginBottom: 20, border: '1px solid rgba(167,139,250,0.1)', backdropFilter: 'blur(10px)' },
    cardTitle: { fontSize: 16, fontWeight: 600, color: dark('#374151', '#d1d5db'), marginBottom: 16 },
    moodRow: { display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' },
    moodBtn: (selected: boolean) => ({
      width: 40, height: 40, borderRadius: 12, fontSize: 22,
      border: selected ? '2px solid #A78BFA' : '2px solid transparent',
      background: selected ? 'rgba(167,139,250,0.12)' : 'rgba(0,0,0,0.02)',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }),
    nickInput: (isSmall: boolean) => ({
      width: isSmall ? 120 : '100%', padding: '8px 14px', borderRadius: 999, fontSize: 13,
      border: '1px solid rgba(167,139,250,0.25)', background: 'rgba(255,255,255,0.6)',
      color: dark('#374151', '#d1d5db'), outline: 'none', marginBottom: isSmall ? 0 : 12,
      boxSizing: 'border-box' as const,
    }),
    textarea: {
      width: '100%', minHeight: 100, padding: '12px 16px', borderRadius: 14,
      border: '1px solid rgba(167,139,250,0.2)', background: 'rgba(255,255,255,0.6)',
      color: dark('#374151', '#d1d5db'), fontSize: 14, resize: 'vertical' as const, outline: 'none',
      fontFamily: '"Noto Sans SC", sans-serif', marginBottom: 12,
      boxSizing: 'border-box' as const,
    },
    submitBtn: (disabled: boolean) => ({
      width: '100%', padding: '12px', borderRadius: 14, fontSize: 15, fontWeight: 600,
      border: 'none', cursor: disabled ? 'default' : 'pointer',
      background: disabled ? '#E5E7EB' : 'linear-gradient(135deg, #FDA4AF, #A78BFA)',
      color: disabled ? '#9CA3AF' : '#fff',
    }),
    msgItem: { padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' },
    msgHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
    msgEmoji: { fontSize: 22 },
    msgNick: { fontWeight: 600, fontSize: 13, color: '#7C3AED' },
    msgMood: { fontSize: 11, color: '#D1D5DB' },
    msgDate: { fontSize: 11, color: '#D1D5DB', marginLeft: 'auto' },
    msgContent: { fontSize: 14, color: dark('#374151', '#d1d5db'), lineHeight: 1.7, marginBottom: 8, paddingLeft: 30 },
    msgActions: { display: 'flex', gap: 12, paddingLeft: 30 },
    actionBtn: (active: boolean) => ({
      padding: '3px 10px', borderRadius: 8, fontSize: 12,
      border: 'none', cursor: 'pointer',
      background: active ? 'rgba(167,139,250,0.12)' : 'transparent',
      color: active ? '#7C3AED' : '#D1D5DB',
    }),
    replyArea: { paddingLeft: 30, marginTop: 12 },
    replyItem: { padding: '8px 12px', background: '#F0EEFF', borderRadius: 12, marginBottom: 8, fontSize: 13 },
    replyNick: { fontWeight: 600, color: '#7C3AED', fontSize: 12 },
    replyContent: { color: dark('#374151', '#d1d5db'), marginTop: 2 },
    replyDate: { fontSize: 10, color: '#D1D5DB', marginTop: 2 },
    replyInputRow: { display: 'flex', gap: 8, marginTop: 8 },
    replyTextarea: {
      flex: 1, minHeight: 40, padding: '8px 12px', borderRadius: 12,
      border: '1px solid rgba(167,139,250,0.2)', background: 'rgba(255,255,255,0.6)',
      color: dark('#374151', '#d1d5db'), fontSize: 13, outline: 'none', resize: 'none' as const,
      fontFamily: '"Noto Sans SC", sans-serif',
    },
    replySubmitBtn: {
      padding: '6px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
      border: 'none', cursor: 'pointer',
      background: '#A78BFA', color: '#fff',
    },
    empty: { textAlign: 'center' as const, padding: '40px 0', color: '#D1D5DB', fontSize: 14 },
    clearBtn: { fontSize: 12, color: '#D1D5DB', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' },
    notice: { background: 'rgba(167,139,250,0.08)', borderRadius: 14, padding: '14px 18px', marginBottom: 20, fontSize: 13, color: '#6B7280', lineHeight: 1.6 },
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>🌳</span>
          <h1 style={s.title}>树洞倾诉</h1>
          <p style={s.subtitle}>说出你心里的声音，这里只有倾听没有评判</p>
        </div>

        {/* 温馨提示 */}
        <div style={s.notice}>
          这是一个安全的倾诉空间。所有数据存储在本地浏览器中，不会上传到任何服务器。请放心表达真实的自己。如果你正在经历严重的心理痛苦，请拨打
          <strong>全国心理援助热线 400-161-9995</strong> 寻求专业帮助。
        </div>

        {/* 发表卡片 */}
        <div style={s.card}>
          <p style={s.cardTitle}>说出你的心声</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>昵称</span>
            <input style={s.nickInput(false)} value={nickname} onChange={e => setNickname(e.target.value)} placeholder="匿名小树" maxLength={12} />
          </div>

          <div style={s.moodRow}>
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>心情</span>
            {moodEmojis.map((emoji, i) => (
              <button key={i} style={s.moodBtn(selectedMood === i)} onClick={() => setSelectedMood(i)} title={moodLabels[i]}>
                {emoji}
              </button>
            ))}
          </div>

          <textarea
            style={s.textarea}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="这里没有人认识你，放心说出你此刻的想法..."
            maxLength={500}
          />

          <button style={s.submitBtn(!content.trim())} onClick={submitMessage} disabled={!content.trim()}>
            投入树洞 🕳
          </button>
        </div>

        {/* 留言列表 */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ ...s.cardTitle, marginBottom: 0 }}>
              树洞回声 ({messages.length})
            </p>
            {messages.length > 0 && (
              <button style={s.clearBtn} onClick={clearAll}>清空</button>
            )}
          </div>

          <div ref={listRef}>
            {messages.length === 0 ? (
              <div style={s.empty}>
                树洞还是空的，成为第一个倾诉的人吧 🌿
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} style={s.msgItem}>
                  <div style={s.msgHeader}>
                    <span style={s.msgEmoji}>{moodEmojis[msg.mood]}</span>
                    <span style={s.msgNick}>{msg.nickname}</span>
                    <span style={s.msgMood}>{moodLabels[msg.mood]}</span>
                    <span style={s.msgDate}>{msg.date}</span>
                  </div>
                  <p style={s.msgContent}>{msg.content}</p>
                  <div style={s.msgActions}>
                    <button style={s.actionBtn(false)} onClick={() => likeMessage(msg.id)}>
                      🤍 {msg.likes > 0 && msg.likes}
                    </button>
                    <button style={s.actionBtn(replyTarget === msg.id)} onClick={() => setReplyTarget(replyTarget === msg.id ? null : msg.id)}>
                      💬 回应
                    </button>
                  </div>

                  {/* 回复列表 */}
                  {msg.replies.length > 0 && (
                    <div style={s.replyArea}>
                      {msg.replies.map((r, i) => (
                        <div key={i} style={s.replyItem}>
                          <span style={s.replyNick}>{r.nickname}</span>
                          <p style={s.replyContent}>{r.content}</p>
                          <p style={s.replyDate}>{r.date}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 回复输入 */}
                  {replyTarget === msg.id && (
                    <div style={s.replyArea}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: '#9CA3AF' }}>昵称</span>
                        <input style={s.nickInput(true)} value={replyNick} onChange={e => setReplyNick(e.target.value)} placeholder="匿名小树" maxLength={12} />
                      </div>
                      <div style={s.replyInputRow}>
                        <textarea style={{ ...s.replyTextarea, flex: 1 }} value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="温暖地回应..." maxLength={200} />
                        <button style={s.replySubmitBtn} onClick={() => submitReply(msg.id)} disabled={!replyContent.trim()}>
                          发送
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
