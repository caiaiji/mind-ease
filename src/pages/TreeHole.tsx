import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useState, useEffect, useRef, useCallback } from 'react'
import { dark } from '../contexts/ThemeContext'

const STORAGE_KEY = 'mindease-treehole'
const NICKNAME_KEY = 'mindease-treehole-nickname'

interface Reply {
  nickname: string
  content: string
  date: string
  isWarm?: boolean
}

interface Message {
  id: string
  content: string
  mood: number
  nickname: string
  date: string
  likes: number
  tags: string[]
  replies: Reply[]
}

const moodEmojis = ['😢', '😟', '😐', '🙂', '😊']
const moodLabels = ['很难受', '不太好', '一般', '还不错', '很开心']

const tags = [
  { id: 'study', label: '学习压力', emoji: '📚', color: '#8b5cf6' },
  { id: 'relationship', label: '人际关系', emoji: '👥', color: '#ec4899' },
  { id: 'family', label: '家庭烦恼', emoji: '🏠', color: '#f59e0b' },
  { id: 'self', label: '自我困惑', emoji: '🪞', color: '#06b6d4' },
  { id: 'anxiety', label: '焦虑不安', emoji: '😰', color: '#ef4444' },
  { id: 'lonely', label: '孤独寂寞', emoji: '🌙', color: '#6366f1' },
  { id: 'future', label: '未来迷茫', emoji: '🔭', color: '#14b8a6' },
  { id: 'random', label: '随便说说', emoji: '💬', color: '#a3a3a3' },
]

const warmReplies = [
  '你很勇敢，能把这些说出来 🤗',
  '每个人都有这样的时刻，你不是一个人 💜',
  '谢谢你愿意分享，这份勇敢很珍贵',
  '你已经做得很好了，给自己一个拥抱吧 🫂',
  '困难是暂时的，你已经比想象中更坚强了',
  '不管怎样，都值得被温柔对待 🌸',
  '你现在的一切感受都是真实的，都是被允许的',
  '哭出来也没关系，眼泪是心灵的雨水 🌧',
  '慢慢来，不需要急着好起来',
  '深呼吸，你正坐在这里，这本身就是力量',
  '把烦恼交给树洞吧，它会替你保管 🌳',
  '看到你的文字，我想给你一个温暖的微笑',
  '世界这么大，总会有人懂你的',
  '今天的你，比昨天又多坚持了一天',
  '允许自己不完美，这就是真实的你',
]

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
function getRandomWarmReplies(): string[] {
  const shuffled = [...warmReplies].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

export default function TreeHole() {
    useDocumentTitle('树洞倾诉')

  const [messages, setMessages] = useState<Message[]>(loadMessages)
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState(loadNickname)
  const [selectedMood, setSelectedMood] = useState(2)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [replyTarget, setReplyTarget] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [replyNick, setReplyNick] = useState(loadNickname)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [crisisAlert, setCrisisAlert] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // 危机关键词检测
  const CRISIS_KEYWORDS = ['不想活', '想死', '自杀', '死掉', '活着没意思', '了结', '跳楼', '割腕', '安眠药', '遗书', '再也见不到', '离开这个世界', '撑不下去', '不如死了', '没有意义了']
  const checkCrisis = (text: string) => CRISIS_KEYWORDS.some(kw => text.includes(kw))

  useEffect(() => { saveMessages(messages) }, [messages])

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : prev.length < 3 ? [...prev, tagId] : prev
    )
  }

  const submitMessage = useCallback(() => {
    if (!content.trim()) return
    if (checkCrisis(content)) {
      setCrisisAlert(true)
      return
    }
    const nick = nickname.trim() || '匿名小树'
    const msg: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      mood: selectedMood,
      nickname: nick,
      date: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      likes: 0,
      tags: selectedTags,
      replies: [],
    }
    setMessages(prev => [msg, ...prev])
    setContent('')
    setSelectedTags([])
    localStorage.setItem(NICKNAME_KEY, nick)
  }, [content, nickname, selectedMood, selectedTags])

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

  const submitWarmReply = (msgId: string, replyText: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? {
      ...m,
      replies: [...m.replies, {
        nickname: '暖心小树',
        content: replyText,
        date: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        isWarm: true,
      }]
    } : m))
    setReplyTarget(null)
  }

  const openReply = (msgId: string) => {
    setReplyTarget(msgId)
    setQuickReplies(getRandomWarmReplies())
  }

  const clearAll = () => { setMessages([]) }

  const filteredMessages = filterTag
    ? messages.filter(m => m.tags.includes(filterTag))
    : messages

  const d = (light: string, darkVal: string) => dark(light, darkVal)

  return (
    <div style={{
      background: d('#FFFBF5', '#1a1a2e'),
      minHeight: '100vh',
      fontFamily: '"Noto Sans SC", sans-serif',
      color: d('#374151', '#d1d5db'),
      padding: '100px 16px 60px',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>🌳</span>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: d('#374151', '#d1d5db'), marginBottom: 4, fontFamily: '"ZCOOL XiaoWei", serif' }}>树洞倾诉</h1>
          <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 8 }}>说出你心里的声音，这里只有倾听没有评判</p>
        </div>

        {/* Notice */}
        <div style={{
          background: d('rgba(167,139,250,0.08)', 'rgba(167,139,250,0.12)'),
          borderRadius: 14, padding: '14px 18px', marginBottom: 20,
          fontSize: 13, color: d('#6B7280', '#9ca3af'), lineHeight: 1.6,
        }}>
          这是一个安全的倾诉空间。所有数据存储在本地浏览器中，不会上传到任何服务器。请放心表达真实的自己。如果你正在经历严重的心理痛苦，请拨打
          <strong>全国心理援助热线 400-161-9995</strong> 寻求专业帮助。
        </div>

        {/* Compose Card */}
        <div style={{
          background: d('rgba(255,255,255,0.7)', 'rgba(30,27,60,0.6)'),
          borderRadius: 20, padding: 24, marginBottom: 20,
          border: `1px solid ${d('rgba(167,139,250,0.1)', 'rgba(167,139,250,0.2)')}`,
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: d('#374151', '#d1d5db'), marginBottom: 16 }}>说出你的心声</p>

          {/* Nickname */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>昵称</span>
            <input
              style={{
                flex: 1, padding: '8px 14px', borderRadius: 999, fontSize: 13,
                border: `1px solid ${d('rgba(167,139,250,0.25)', 'rgba(167,139,250,0.3)')}`,
                background: d('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.3)'),
                color: d('#374151', '#d1d5db'), outline: 'none', boxSizing: 'border-box',
              }}
              value={nickname} onChange={e => setNickname(e.target.value)} placeholder="匿名小树" maxLength={12}
            />
          </div>

          {/* Mood */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>心情</span>
            {moodEmojis.map((emoji, i) => (
              <button key={i} title={moodLabels[i]} onClick={() => setSelectedMood(i)} style={{
                width: 40, height: 40, borderRadius: 12, fontSize: 22,
                border: selectedMood === i ? '2px solid #A78BFA' : '2px solid transparent',
                background: selectedMood === i ? 'rgba(167,139,250,0.12)' : d('rgba(0,0,0,0.02)', 'rgba(255,255,255,0.05)'),
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {emoji}
              </button>
            ))}
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#9CA3AF' }}>标签</span>
              <span style={{ fontSize: 11, color: '#D1D5DB' }}>({selectedTags.length}/3)</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 12, cursor: 'pointer',
                    border: selectedTags.includes(tag.id) ? `1px solid ${tag.color}` : `1px solid ${d('rgba(0,0,0,0.08)', 'rgba(255,255,255,0.1)')}`,
                    background: selectedTags.includes(tag.id) ? `${tag.color}18` : d('rgba(0,0,0,0.02)', 'rgba(255,255,255,0.03)'),
                    color: selectedTags.includes(tag.id) ? tag.color : '#9CA3AF',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tag.emoji} {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <textarea
            style={{
              width: '100%', minHeight: 100, padding: '12px 16px', borderRadius: 14,
              border: `1px solid ${d('rgba(167,139,250,0.2)', 'rgba(167,139,250,0.25)')}`,
              background: d('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.3)'),
              color: d('#374151', '#d1d5db'), fontSize: 14, resize: 'vertical' as const, outline: 'none',
              fontFamily: '"Noto Sans SC", sans-serif', marginBottom: 12, boxSizing: 'border-box' as const,
            }}
            value={content} onChange={e => setContent(e.target.value)}
            placeholder="这里没有人认识你，放心说出你此刻的想法..."
            maxLength={500}
          />

          <button
            style={{
              width: '100%', padding: '12px', borderRadius: 14, fontSize: 15, fontWeight: 600,
              border: 'none', cursor: content.trim() ? 'pointer' : 'default',
              background: content.trim() ? 'linear-gradient(135deg, #FDA4AF, #A78BFA)' : d('#E5E7EB', '#374151'),
              color: content.trim() ? '#fff' : '#9CA3AF',
            }}
            onClick={submitMessage} disabled={!content.trim()}
          >
            投入树洞 🕳
          </button>

          {/* Crisis Alert */}
          {crisisAlert && (
            <div style={{
              marginTop: 16, padding: 16, borderRadius: 14,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              animation: 'page-enter 0.3s ease-out',
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#EF4444', marginBottom: 6 }}>
                我注意到你写下了一些让人担心的话
              </p>
              <p style={{ fontSize: 13, color: d('#6B7280', '#9ca3af'), marginBottom: 10, lineHeight: 1.6 }}>
                如果你正在经历强烈的痛苦，或者有伤害自己的想法，<br />
                请先拨打 <strong style={{ color: '#EF4444' }}>全国心理援助热线 400-161-9995</strong>。<br />
                这里有很多愿意帮助你的人。
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href="tel:400-161-9995"
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 12, fontSize: 13, fontWeight: 600,
                    textAlign: 'center' as const, textDecoration: 'none',
                    background: '#EF4444', color: '#fff',
                  }}
                >
                  拨打热线
                </a>
                <button
                  onClick={() => setCrisisAlert(false)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 12, fontSize: 13, fontWeight: 600,
                    border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
                    background: 'transparent', color: d('#6B7280', '#9ca3af'),
                  }}
                >
                  取消发送
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{
          background: d('rgba(255,255,255,0.7)', 'rgba(30,27,60,0.6)'),
          borderRadius: 20, padding: 24,
          border: `1px solid ${d('rgba(167,139,250,0.1)', 'rgba(167,139,250,0.2)')}`,
          backdropFilter: 'blur(10px)',
        }}>
          {/* Filter Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            <button
              onClick={() => setFilterTag(null)}
              style={{
                padding: '3px 10px', borderRadius: 999, fontSize: 12, cursor: 'pointer',
                border: `1px solid ${filterTag === null ? '#A78BFA' : d('rgba(0,0,0,0.08)', 'rgba(255,255,255,0.1)')}`,
                background: filterTag === null ? 'rgba(167,139,250,0.12)' : 'transparent',
                color: filterTag === null ? '#7C3AED' : '#9CA3AF',
              }}
            >
              全部
            </button>
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => setFilterTag(filterTag === tag.id ? null : tag.id)}
                style={{
                  padding: '3px 10px', borderRadius: 999, fontSize: 12, cursor: 'pointer',
                  border: `1px solid ${filterTag === tag.id ? tag.color : d('rgba(0,0,0,0.08)', 'rgba(255,255,255,0.1)')}`,
                  background: filterTag === tag.id ? `${tag.color}18` : 'transparent',
                  color: filterTag === tag.id ? tag.color : '#9CA3AF',
                }}
              >
                {tag.emoji} {tag.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: d('#374151', '#d1d5db'), marginBottom: 0 }}>
              树洞回声 ({filteredMessages.length})
            </p>
            {filterTag && (
              <span style={{ fontSize: 12, color: '#A78BFA', marginLeft: 8 }}>
                筛选: {tags.find(t => t.id === filterTag)?.label}
              </span>
            )}
            {messages.length > 0 && (
              <button
                onClick={clearAll}
                style={{ fontSize: 12, color: '#D1D5DB', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}
              >
                清空
              </button>
            )}
          </div>

          <div ref={listRef}>
            {filteredMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#D1D5DB', fontSize: 14 }}>
                {filterTag ? '这个标签下暂时没有留言 🏷️' : '树洞还是空的，成为第一个倾诉的人吧 🌿'}
              </div>
            ) : (
              filteredMessages.map(msg => (
                <div key={msg.id} style={{ padding: '16px 0', borderBottom: `1px solid ${d('rgba(0,0,0,0.04)', 'rgba(255,255,255,0.06)')}` }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 22 }}>{moodEmojis[msg.mood]}</span>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#7C3AED' }}>{msg.nickname}</span>
                    <span style={{ fontSize: 11, color: '#D1D5DB' }}>{moodLabels[msg.mood]}</span>
                    <span style={{ fontSize: 11, color: '#D1D5DB', marginLeft: 'auto' }}>{msg.date}</span>
                  </div>

                  {/* Tags */}
                  {msg.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginBottom: 8, paddingLeft: 30 }}>
                      {msg.tags.map(tagId => {
                        const tag = tags.find(t => t.id === tagId)
                        return tag ? (
                          <span key={tag.id} style={{
                            fontSize: 11, padding: '1px 8px', borderRadius: 999,
                            background: `${tag.color}15`, color: tag.color,
                          }}>
                            {tag.emoji} {tag.label}
                          </span>
                        ) : null
                      })}
                    </div>
                  )}

                  {/* Content */}
                  <p style={{
                    fontSize: 14, color: d('#374151', '#d1d5db'),
                    lineHeight: 1.7, marginBottom: 8, paddingLeft: 30,
                  }}>
                    {msg.content}
                  </p>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 12, paddingLeft: 30 }}>
                    <button
                      onClick={() => likeMessage(msg.id)}
                      style={{
                        padding: '3px 10px', borderRadius: 8, fontSize: 12,
                        border: 'none', cursor: 'pointer',
                        background: msg.likes > 0 ? 'rgba(167,139,250,0.12)' : 'transparent',
                        color: msg.likes > 0 ? '#7C3AED' : '#D1D5DB',
                      }}
                    >
                      🤍 {msg.likes > 0 && msg.likes}
                    </button>
                    <button
                      onClick={() => openReply(msg.id)}
                      style={{
                        padding: '3px 10px', borderRadius: 8, fontSize: 12,
                        border: 'none', cursor: 'pointer',
                        background: replyTarget === msg.id ? 'rgba(167,139,250,0.12)' : 'transparent',
                        color: replyTarget === msg.id ? '#7C3AED' : '#D1D5DB',
                      }}
                    >
                      💬 回应
                    </button>
                  </div>

                  {/* Replies */}
                  {msg.replies.length > 0 && (
                    <div style={{ paddingLeft: 30, marginTop: 12 }}>
                      {msg.replies.map((r, i) => (
                        <div key={i} style={{
                          padding: '8px 12px', marginBottom: 8, fontSize: 13,
                          borderRadius: 12,
                          background: r.isWarm ? d('rgba(251,191,36,0.08)', 'rgba(251,191,36,0.1)') : d('#F0EEFF', 'rgba(139,92,246,0.1)'),
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 600, color: r.isWarm ? '#f59e0b' : '#7C3AED', fontSize: 12 }}>
                              {r.isWarm ? '🤗 ' : ''}{r.nickname}
                            </span>
                            <span style={{ fontSize: 10, color: '#D1D5DB' }}>{r.date}</span>
                          </div>
                          <p style={{ color: d('#374151', '#d1d5db'), marginTop: 2 }}>{r.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyTarget === msg.id && (
                    <div style={{ paddingLeft: 30, marginTop: 12 }}>
                      {/* Quick Warm Replies */}
                      <div style={{ marginBottom: 10 }}>
                        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>暖心快回</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {quickReplies.map((qr, i) => (
                            <button
                              key={i}
                              onClick={() => submitWarmReply(msg.id, qr)}
                              style={{
                                padding: '6px 12px', borderRadius: 12, fontSize: 12,
                                border: `1px solid ${d('rgba(251,191,36,0.2)', 'rgba(251,191,36,0.3)')}`,
                                background: d('rgba(251,191,36,0.06)', 'rgba(251,191,36,0.08)'),
                                color: d('#92400e', '#fbbf24'),
                                cursor: 'pointer', transition: 'all 0.2s ease',
                              }}
                            >
                              {qr}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: '#9CA3AF' }}>昵称</span>
                        <input
                          style={{
                            width: 120, padding: '8px 14px', borderRadius: 999, fontSize: 13,
                            border: `1px solid ${d('rgba(167,139,250,0.25)', 'rgba(167,139,250,0.3)')}`,
                            background: d('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.3)'),
                            color: d('#374151', '#d1d5db'), outline: 'none', boxSizing: 'border-box',
                          }}
                          value={replyNick} onChange={e => setReplyNick(e.target.value)} placeholder="匿名小树" maxLength={12}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <textarea
                          style={{
                            flex: 1, minHeight: 40, padding: '8px 12px', borderRadius: 12,
                            border: `1px solid ${d('rgba(167,139,250,0.2)', 'rgba(167,139,250,0.25)')}`,
                            background: d('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.3)'),
                            color: d('#374151', '#d1d5db'), fontSize: 13, outline: 'none', resize: 'none' as const,
                            fontFamily: '"Noto Sans SC", sans-serif',
                          }}
                          value={replyContent} onChange={e => setReplyContent(e.target.value)}
                          placeholder="温暖地回应..." maxLength={200}
                        />
                        <button
                          onClick={() => submitReply(msg.id)}
                          disabled={!replyContent.trim()}
                          style={{
                            padding: '6px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                            border: 'none', cursor: replyContent.trim() ? 'pointer' : 'default',
                            background: replyContent.trim() ? '#A78BFA' : d('#E5E7EB', '#374151'),
                            color: replyContent.trim() ? '#fff' : '#9CA3AF',
                          }}
                        >
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
