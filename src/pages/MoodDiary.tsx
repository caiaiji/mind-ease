import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useState, useEffect, useRef, useCallback } from 'react'
import { dark } from '../contexts/ThemeContext'

const STORAGE_KEY = 'mindease-mood-journal'

interface MoodEntry {
  id: string
  mood: number
  note: string
  tags: string[]
  date: string
}

const moodConfig = [
  { value: 5, emoji: '😊', label: '很开心', color: '#6EE7B7' },
  { value: 4, emoji: '🙂', label: '还不错', color: '#A7F3D0' },
  { value: 3, emoji: '😐', label: '一般', color: '#FDE68A' },
  { value: 2, emoji: '😟', label: '不太好', color: '#FDBA74' },
  { value: 1, emoji: '😢', label: '很难受', color: '#FDA4AF' },
]

const moodTags = ['学习', '社交', '家庭', '恋爱', '睡眠', '工作', '健康', '其他']

// 危机关键词 - 用于笔记检测和趋势预警
const CRISIS_KEYWORDS = [
  '不想活', '想死', '自杀', '结束生命', '活不下去', '没有意义',
  '还不如死', '去死', '死了算了', '活着好累', '世界没有我',
  '消失', '跳楼', '割腕', '跳河', '吃安眠药',
]

function loadEntries(): MoodEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

function saveEntries(entries: MoodEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export default function MoodDiary() {
    useDocumentTitle('情绪日记')

  const [entries, setEntries] = useState<MoodEntry[]>(loadEntries)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => { saveEntries(entries) }, [entries])

  // 检测笔记中的危机关键词
  const detectNoteCrisis = useCallback((text: string): boolean => {
    return CRISIS_KEYWORDS.some(kw => text.includes(kw))
  }, [])

  const addEntry = useCallback(() => {
    if (selectedMood === null) return
    // 危机关键词检测
    if (note.trim() && detectNoteCrisis(note.trim())) {
      setShowCrisisAlert(true)
      return // 不提交，先显示关怀提示
    }
    const entry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      note: note.trim(),
      tags: selectedTags,
      date: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }
    setEntries(prev => [entry, ...prev].slice(0, 90))
    setSelectedMood(null)
    setNote('')
    setSelectedTags([])
  }, [selectedMood, note, selectedTags, detectNoteCrisis])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].slice(0, 3)
    )
  }

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const clearAll = () => {
    if (entries.length === 0) return
    setEntries([])
  }

  // 绘制趋势图
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || entries.length < 2) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height
    const padding = { top: 20, right: 20, bottom: 30, left: 40 }
    const chartW = w - padding.left - padding.right
    const chartH = h - padding.top - padding.bottom

    ctx.clearRect(0, 0, w, h)

    const dark = document.documentElement.classList.contains('dark')

    // 背景
    ctx.fillStyle = dark ? 'rgba(30,27,60,0.8)' : '#FFFBF5'
    ctx.fillRect(0, 0, w, h)

    // 网格线
    ctx.strokeStyle = dark ? 'rgba(139,92,246,0.15)' : '#F0EEFF'
    ctx.lineWidth = 1
    for (let i = 1; i <= 5; i++) {
      const y = padding.top + chartH - (i / 5) * chartH
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(w - padding.right, y)
      ctx.stroke()
      // Y轴标签
      ctx.fillStyle = dark ? '#6B7280' : '#9CA3AF'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(i.toString(), padding.left - 8, y + 4)
    }

    // 数据点
    const recent = entries.slice(0, 30).reverse()
    const points = recent.map((e, i) => ({
      x: padding.left + (i / (recent.length - 1)) * chartW,
      y: padding.top + chartH - (e.mood / 5) * chartH,
      mood: e.mood,
      emoji: moodConfig[e.mood - 1].emoji,
    }))

    // 面积填充
    const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom)
    gradient.addColorStop(0, 'rgba(167, 139, 250, 0.3)')
    gradient.addColorStop(1, 'rgba(167, 139, 250, 0.02)')
    ctx.beginPath()
    ctx.moveTo(points[0].x, h - padding.bottom)
    points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(points[points.length - 1].x, h - padding.bottom)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // 线条
    ctx.beginPath()
    ctx.strokeStyle = '#A78BFA'
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.stroke()

    // 点
    points.forEach(p => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#A78BFA'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = dark ? '#1a1a2e' : '#fff'
      ctx.fill()
    })

    // X轴日期标签
    ctx.fillStyle = dark ? '#6B7280' : '#9CA3AF'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    const step = Math.max(1, Math.floor(recent.length / 6))
    recent.forEach((e, i) => {
      if (i % step === 0 || i === recent.length - 1) {
        const x = padding.left + (i / (recent.length - 1)) * chartW
        ctx.fillText(e.date.split(' ')[0], x, h - 8)
      }
    })
  }, [entries, showHistory])

  // 平均心情
  const avgMood = entries.length > 0
    ? (entries.reduce((s, e) => s + e.mood, 0) / entries.length).toFixed(1)
    : '--'

  const weekEntries = entries.filter(e => {
    const d = new Date()
    const weekAgo = d.getTime() - 7 * 86400000
    return Date.now() - new Date(e.date.replace(/\//g, '-')).getTime() < weekAgo
  })
  const weekAvg = weekEntries.length > 0
    ? (weekEntries.reduce((s, e) => s + e.mood, 0) / weekEntries.length).toFixed(1)
    : '--'

  // 危机趋势检测：过去7天记录>=3次且全部<=2，或平均<=1.5
  const crisisTrend = weekEntries.length >= 3 && (
    weekEntries.every(e => e.mood <= 2) ||
    (weekEntries.reduce((s, e) => s + e.mood, 0) / weekEntries.length) <= 1.5
  )



  const s = {
    page: { background: '#FFFBF5', minHeight: '100vh', fontFamily: '"Noto Sans SC", sans-serif', color: dark('#374151', '#d1d5db'), padding: '100px 16px 60px' },
    container: { maxWidth: 640, margin: '0 auto' },
    title: { fontSize: 28, fontWeight: 700, color: dark('#374151', '#d1d5db'), marginBottom: 4, fontFamily: '"ZCOOL XiaoWei", serif' },
    subtitle: { fontSize: 14, color: '#9CA3AF', marginBottom: 32 },
    card: { background: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 24, marginBottom: 20, border: '1px solid rgba(167,139,250,0.1)', backdropFilter: 'blur(10px)' },
    cardTitle: { fontSize: 16, fontWeight: 600, color: dark('#374151', '#d1d5db'), marginBottom: 16 },
    moodGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 },
    moodBtn: (selected: boolean, color: string) => ({
      display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 6,
      padding: '12px 8px', borderRadius: 16,
      border: selected ? `2px solid ${color}` : '2px solid transparent',
      background: selected ? `${color}22` : 'rgba(0,0,0,0.02)',
      cursor: 'pointer', transition: 'all 0.2s',
      fontSize: 11, color: '#6B7280',
    }),
    tagsWrap: { display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 20 },
    tag: (active: boolean) => ({
      padding: '4px 14px', borderRadius: 999, fontSize: 12,
      border: `1px solid ${active ? '#A78BFA' : '#E5E7EB'}`,
      background: active ? 'rgba(167,139,250,0.12)' : 'transparent',
      color: active ? '#7C3AED' : '#9CA3AF', cursor: 'pointer',
    }),
    textarea: {
      width: '100%', minHeight: 80, padding: '12px 16px', borderRadius: 14,
      border: '1px solid rgba(167,139,250,0.2)', background: 'rgba(255,255,255,0.6)',
      color: dark('#374151', '#d1d5db'), fontSize: 14, resize: 'vertical' as const, outline: 'none',
      fontFamily: '"Noto Sans SC", sans-serif', marginBottom: 16,
      boxSizing: 'border-box' as const,
    },
    submitBtn: (disabled: boolean) => ({
      width: '100%', padding: '12px', borderRadius: 14, fontSize: 15, fontWeight: 600,
      border: 'none', cursor: disabled ? 'default' : 'pointer',
      background: disabled ? '#E5E7EB' : 'linear-gradient(135deg, #A78BFA, #6EE7B7)',
      color: disabled ? '#9CA3AF' : '#fff', transition: 'all 0.3s',
    }),
    stats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 },
    statItem: { background: '#F0EEFF', borderRadius: 14, padding: '14px 16px', textAlign: 'center' as const },
    statLabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 4 },
    statValue: { fontSize: 22, fontWeight: 700, color: '#7C3AED' },
    entryItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' },
    entryEmoji: { fontSize: 24 },
    entryInfo: { flex: 1 },
    entryNote: { fontSize: 13, color: dark('#374151', '#d1d5db'), marginBottom: 2 },
    entryMeta: { fontSize: 11, color: '#D1D5DB' },
    entryTags: { display: 'flex', gap: 4, marginBottom: 2 },
    entryTag: { fontSize: 10, padding: '1px 8px', borderRadius: 999, background: '#F0EEFF', color: '#7C3AED' },
    deleteBtn: { padding: '4px 10px', borderRadius: 8, fontSize: 11, border: 'none', background: 'rgba(253,164,175,0.15)', color: '#F472B6', cursor: 'pointer' },
    tabRow: { display: 'flex', gap: 8, marginBottom: 24 },
    tab: (active: boolean) => ({
      padding: '8px 20px', borderRadius: 999, fontSize: 13, fontWeight: 500,
      border: 'none', cursor: 'pointer',
      background: active ? '#A78BFA' : 'rgba(0,0,0,0.04)',
      color: active ? '#fff' : '#6B7280',
    }),
    clearBtn: { fontSize: 12, color: '#D1D5DB', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' },
    canvasWrap: { background: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 20, marginBottom: 20, border: '1px solid rgba(167,139,250,0.1)' },
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>📓</span>
          <h1 style={s.title}>情绪日记</h1>
          <p style={s.subtitle}>记录每天的心情，发现情绪变化的规律</p>
        </div>

        <div style={s.tabRow}>
          <button style={s.tab(!showHistory)} onClick={() => setShowHistory(false)}>写日记</button>
          <button style={s.tab(showHistory)} onClick={() => setShowHistory(true)}>
            历史记录 ({entries.length})
          </button>
        </div>

        {!showHistory ? (
          <>
            {/* 记录卡片 */}
            <div style={s.card}>
              <p style={s.cardTitle}>你现在的心情是？</p>
              <div style={s.moodGrid}>
                {moodConfig.map(m => (
                  <button key={m.value} style={s.moodBtn(selectedMood === m.value, m.color)} onClick={() => setSelectedMood(m.value)}>
                    <span style={{ fontSize: 28 }}>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              <p style={{ ...s.cardTitle, fontSize: 14 }}>打上标签（可选）</p>
              <div style={s.tagsWrap}>
                {moodTags.map(tag => (
                  <button key={tag} style={s.tag(selectedTags.includes(tag))} onClick={() => toggleTag(tag)}>
                    {tag}
                  </button>
                ))}
              </div>

              <textarea
                style={s.textarea}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="写点什么吧...今天发生了什么？你现在在想什么？"
                maxLength={300}
              />

              <button style={s.submitBtn(selectedMood === null)} onClick={addEntry} disabled={selectedMood === null}>
                记录这一刻 ✨
              </button>
            </div>

            {/* 统计 */}
            {entries.length > 0 && (
              <div style={s.stats}>
                <div style={s.statItem}>
                  <div style={s.statLabel}>平均心情</div>
                  <div style={s.statValue}>{avgMood} / 5</div>
                </div>
                <div style={s.statItem}>
                  <div style={s.statLabel}>本周平均</div>
                  <div style={s.statValue}>{weekAvg} / 5</div>
                </div>
              </div>
            )}

            {/* 危机趋势预警 */}
            {crisisTrend && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(254,226,226,0.9), rgba(254,215,170,0.9))',
                borderRadius: 20, padding: 20, marginBottom: 20,
                border: '2px solid rgba(239,68,68,0.2)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>💛</span>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#9B1C1C', marginBottom: 8 }}>
                      过去一周你的情绪持续偏低
                    </p>
                    <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.6, marginBottom: 12 }}>
                      我们注意到你最近的心情记录一直不太理想。持续的负面情绪需要被重视，
                      这不是你的错，也不代表你必须独自面对。
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <a href="tel:400-161-9995" style={{
                        padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 500,
                        background: '#EF4444', color: '#fff', textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}>
                        📞 拨打心理热线 400-161-9995
                      </a>
                      <a href="tel:400-821-1215" style={{
                        padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 500,
                        background: '#F97316', color: '#fff', textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}>
                        📞 生命热线 400-821-1215
                      </a>
                    </div>
                    <p style={{ fontSize: 11, color: '#B91C1C', marginTop: 10 }}>
                      也许可以和信任的人聊一聊，或者去学校的心理咨询中心看看——寻求帮助是勇敢的表现。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 趋势图 */}
            {entries.length >= 2 && (
              <div style={s.canvasWrap}>
                <p style={s.cardTitle}>心情趋势 📈</p>
                <canvas ref={canvasRef} style={{ width: '100%', height: 200 }} />
              </div>
            )}
          </>
        ) : (
          <>
            {/* 趋势图 */}
            {entries.length >= 2 && (
              <div style={s.canvasWrap}>
                <p style={s.cardTitle}>心情趋势 📈</p>
                <canvas ref={canvasRef} style={{ width: '100%', height: 200 }} />
              </div>
            )}

            {/* 历史列表 */}
            <div style={s.card}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ ...s.cardTitle, marginBottom: 0 }}>历史记录</p>
                {entries.length > 0 && (
                  <button style={s.clearBtn} onClick={clearAll}>清空全部</button>
                )}
              </div>

              {entries.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#D1D5DB', padding: '20px 0', fontSize: 14 }}>
                  还没有记录，去写第一篇日记吧 ✍️
                </p>
              ) : (
                entries.slice(0, 30).map(entry => {
                  const mc = moodConfig[entry.mood - 1]
                  return (
                    <div key={entry.id} style={s.entryItem}>
                      <span style={s.entryEmoji}>{mc.emoji}</span>
                      <div style={s.entryInfo}>
                        {entry.tags.length > 0 && (
                          <div style={s.entryTags}>
                            {entry.tags.map(t => <span key={t} style={s.entryTag}>{t}</span>)}
                          </div>
                        )}
                        {entry.note && <p style={s.entryNote}>{entry.note}</p>}
                        <p style={s.entryMeta}>{entry.date}</p>
                      </div>
                      <button style={s.deleteBtn} onClick={() => deleteEntry(entry.id)}>删除</button>
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* 危机关键词提醒弹窗 */}
      {showCrisisAlert && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 20,
        }} onClick={() => setShowCrisisAlert(false)}>
          <div style={{
            background: '#fff', borderRadius: 24, padding: 28, maxWidth: 420, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 48 }}>💛</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1F2937', textAlign: 'center', marginBottom: 12 }}>
              我们注意到你写了一些让人担心的话
            </h3>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, textAlign: 'center', marginBottom: 20 }}>
              你并不孤单，很多人都经历过这样的时刻。<br />
              专业的心理支持可以帮助你度过这个阶段——<br />
              请给这些热线一个机会，也给自己一个机会。
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <a href="tel:400-161-9995" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 16px', borderRadius: 14, fontSize: 15, fontWeight: 600,
                background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff',
                textDecoration: 'none',
              }}>
                📞 全国心理援助热线 400-161-9995
              </a>
              <a href="tel:400-821-1215" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 16px', borderRadius: 14, fontSize: 15, fontWeight: 600,
                background: 'linear-gradient(135deg, #F97316, #EA580C)', color: '#fff',
                textDecoration: 'none',
              }}>
                📞 生命热线 400-821-1215
              </a>
              <a href="tel:010-82951332" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 16px', borderRadius: 14, fontSize: 15, fontWeight: 600,
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: '#fff',
                textDecoration: 'none',
              }}>
                📞 北京心理危机热线 010-82951332
              </a>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => {
                setShowCrisisAlert(false)
              }} style={{
                flex: 1, padding: '10px 16px', borderRadius: 12, fontSize: 14, fontWeight: 500,
                border: '1px solid #E5E7EB', background: '#fff', color: '#6B7280', cursor: 'pointer',
              }}>
                我想先记下来
              </button>
              <button onClick={() => {
                setShowCrisisAlert(false)
                setNote('')
                setSelectedMood(null)
              }} style={{
                flex: 1, padding: '10px 16px', borderRadius: 12, fontSize: 14, fontWeight: 500,
                border: 'none', background: '#F3F4F6', color: '#9CA3AF', cursor: 'pointer',
              }}>
                取消记录
              </button>
            </div>
            <p style={{ fontSize: 11, color: '#D1D5DB', textAlign: 'center', marginTop: 12 }}>
              如果你正在经历紧急情况，请立即拨打 120 或 110
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
