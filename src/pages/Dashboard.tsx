import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useMemo } from 'react'
import { useUser } from '../contexts/UserContext'
import { dark } from '../contexts/ThemeContext'
import { Link } from 'react-router-dom'

// Data loading helpers
function loadMoodJournal() {
  try { return JSON.parse(localStorage.getItem('mindease-mood-journal') || '[]') } catch { return [] }
}
function loadAssessments() {
  try { return JSON.parse(localStorage.getItem('mindease-assessment-history') || '[]') } catch { return [] }
}
function loadCheckin() {
  try {
    const raw = JSON.parse(localStorage.getItem('mindease-checkin') || '{}')
    return Array.isArray(raw.dates) ? raw.dates : []
  } catch { return [] }
}

// Mood mapping
const MOOD_MAP: Record<string, { label: string; color: string; value: number }> = {
  '😊': { label: '开心', color: '#10B981', value: 5 },
  '😌': { label: '平静', color: '#6EE7B7', value: 4 },
  '😐': { label: '一般', color: '#FBBF24', value: 3 },
  '😟': { label: '焦虑', color: '#F97316', value: 2 },
  '😢': { label: '低落', color: '#EF4444', value: 1 },
  '😡': { label: '愤怒', color: '#DC2626', value: 0 },
}

// Assessment name mapping
const ASSESS_NAMES: Record<string, string> = {
  'anxiety': '焦虑自评',
  'stress': '压力指数',
  'mood-thermo': '情绪温度计',
}

export default function Dashboard() {
    useDocumentTitle('情绪仪表盘')

  const { isLogin } = useUser()
  const journal = useMemo(() => loadMoodJournal(), [])
  const assessmentHistory = useMemo(() => loadAssessments(), [])
  const checkinDates = useMemo(() => loadCheckin(), [])

  // === Computed Stats ===
  const moodEntries = journal.map((e: any) => ({
    date: e.date,
    mood: e.mood,
    moodInfo: MOOD_MAP[e.mood] || MOOD_MAP['😐'],
    score: MOOD_MAP[e.mood]?.value ?? 3,
  }))

  const avgMood = moodEntries.length > 0
    ? (moodEntries.slice(-30).reduce((s: number, e: any) => s + e.score, 0) / Math.min(moodEntries.length, 30)).toFixed(1)
    : '--'

  const checkinStreak = useMemo(() => {
    if (!checkinDates.length) return 0
    const unique = [...new Set(checkinDates)].sort().reverse()
    const today = new Date()
    const todayStr = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0')
    const yday = new Date(today); yday.setDate(yday.getDate()-1)
    const ydayStr = yday.getFullYear() + '-' + String(yday.getMonth()+1).padStart(2,'0') + '-' + String(yday.getDate()).padStart(2,'0')
    if (unique[0] !== todayStr && unique[0] !== ydayStr) return 0
    let s = 1; let cur = new Date(unique[0] + 'T00:00:00')
    for (let i = 1; i < unique.length; i++) {
      const p = new Date(cur); p.setDate(p.getDate()-1)
      const ps = p.getFullYear() + '-' + String(p.getMonth()+1).padStart(2,'0') + '-' + String(p.getDate()).padStart(2,'0')
      if (unique[i] === ps) { s++; cur = p } else break
    }
    return s
  }, [checkinDates])

  // Latest assessment scores

  // Mood trend (last 14 entries) for mini chart
  const moodTrend = moodEntries.slice(-14)

  // Mood distribution for radar/pie
  const moodDist = useMemo(() => {
    const counts: Record<string, number> = {}
    moodEntries.forEach((e: any) => {
      const label = e.moodInfo.label
      counts[label] = (counts[label] || 0) + 1
    })
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count, pct: Math.round(count / moodEntries.length * 100) }))
      .sort((a, b) => b.count - a.count)
  }, [moodEntries])

  // Assessment radar data
  const assessRadar = useMemo(() => {
    const latest: Record<string, number> = {}
    assessmentHistory.forEach((r: any) => {
      latest[r.assessmentId || r.type] = r.score
    })
    return Object.entries(latest).map(([id, score]) => ({
      name: ASSESS_NAMES[id] || id,
      score,
      max: id === 'mood-thermo' ? 10 : 100,
    }))
  }, [assessmentHistory])

  // --- Styles ---
  const dk = dark
  const s = {
    page: {
      minHeight: '100vh', padding: '100px 16px 60px', maxWidth: 640, margin: '0 auto',
      fontFamily: '"Noto Sans SC", sans-serif',
    } as React.CSSProperties,
    card: {
      background: dk('rgba(255,255,255,0.8)', 'rgba(40,40,70,0.8)'),
      backdropFilter: 'blur(20px)', borderRadius: 24, padding: '24px 20px', marginBottom: 16,
      border: `1px solid ${dk('rgba(167,139,250,0.15)', 'rgba(139,92,246,0.2)')}`,
      boxShadow: `0 8px 32px ${dk('rgba(139,92,246,0.06)', 'rgba(0,0,0,0.2)')}`,
    } as React.CSSProperties,
    title: {
      fontSize: 28, fontWeight: 700, color: dk('#374151', '#f3f4f6'), marginBottom: 4,
      fontFamily: '"ZCOOL XiaoWei", serif', textAlign: 'center' as const,
    } as React.CSSProperties,
    subtitle: {
      fontSize: 14, color: dk('#9CA3AF', '#6B7280'), marginBottom: 24, textAlign: 'center' as const,
    } as React.CSSProperties,
    statGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16,
    } as React.CSSProperties,
    statCard: (_color: string) => ({
      padding: '16px 14px', borderRadius: 16,
      background: dk('rgba(255,255,255,0.6)', 'rgba(50,50,80,0.6)'),
      border: `1px solid ${dk('rgba(167,139,250,0.1)', 'rgba(139,92,246,0.15)')}`,
    } as React.CSSProperties),
    statNum: {
      fontSize: 28, fontWeight: 800, fontFamily: '"ZCOOL XiaoWei", serif', lineHeight: 1.1,
    } as React.CSSProperties,
    statLabel: { fontSize: 12, color: dk('#9CA3AF', '#6B7280'), marginTop: 4 } as React.CSSProperties,
    sectionTitle: {
      fontSize: 15, fontWeight: 600, color: dk('#374151', '#f3f4f6'), marginBottom: 12,
      display: 'flex', alignItems: 'center', gap: 6,
    } as React.CSSProperties,
    moodBar: (_pct: number, _color: string) => ({
      height: 8, borderRadius: 4, background: dk('#F3F4F6', '#374151'),
      overflow: 'hidden' as const,
    } as React.CSSProperties),
    moodBarFill: (pct: number, color: string) => ({
      width: `${Math.max(pct, 3)}%`, height: '100%', borderRadius: 4, background: color, transition: 'width 0.6s',
    } as React.CSSProperties),
    trendRow: {
      display: 'flex', alignItems: 'flex-end', gap: 4, height: 80, padding: '8px 0',
    } as React.CSSProperties,
    trendCol: (_score: number, _isLast: boolean) => ({
      flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
      height: '100%', justifyContent: 'flex-end',
    } as React.CSSProperties),
    trendBar: (score: number) => ({
      width: '100%', maxWidth: 24, borderRadius: 4, minHeight: 4,
      background: score >= 4 ? '#10B981' : score >= 3 ? '#FBBF24' : score >= 2 ? '#F97316' : '#EF4444',
      height: `${(score / 5) * 100}%`, transition: 'height 0.5s',
    } as React.CSSProperties),
    assessRow_unused: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0', borderBottom: `1px solid ${dk('rgba(0,0,0,0.04)', 'rgba(255,255,255,0.06)')}`,
    } as React.CSSProperties,
    progressBar: (_pct: number) => ({
      width: '60%', height: 8, borderRadius: 4, background: dk('#F3F4F6', '#374151'), overflow: 'hidden' as const,
    } as React.CSSProperties),
    progressFill: (pct: number, color: string) => ({
      width: `${pct}%`, height: '100%', borderRadius: 4, background: color, transition: 'width 0.6s',
    } as React.CSSProperties),
    empty: {
      textAlign: 'center' as const, padding: '32px 16px',
      color: dk('#9CA3AF', '#6B7280'), fontSize: 14, lineHeight: 1.6,
    } as React.CSSProperties,
    actionBtn: {
      display: 'block', width: '100%', padding: '12px 0', borderRadius: 14,
      border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const,
      background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: '#fff',
      textAlign: 'center' as const, textDecoration: 'none', transition: 'all 0.3s',
      marginBottom: 8,
    } as React.CSSProperties,
    softBtn: () => ({
      display: 'block', width: '100%', padding: '10px 0', borderRadius: 14,
      border: `1.5px solid ${dk('rgba(167,139,250,0.3)', 'rgba(139,92,246,0.3)')}`,
      fontSize: 13, fontWeight: 500, cursor: 'pointer' as const,
      background: 'transparent', color: '#7C3AED', textAlign: 'center' as const,
      textDecoration: 'none', transition: 'all 0.3s', marginBottom: 8,
    } as React.CSSProperties),
  }

  if (!isLogin) {
    return (
      <div style={s.page}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>📊</span>
          <h1 style={s.title}>情绪仪表盘</h1>
          <p style={s.subtitle}>全面了解你的心理健康状态</p>
        </div>
        <div style={s.card}>
          <div style={s.empty}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🔐</span>
            <p>登录后即可查看你的情绪数据</p>
            <Link to="/profile"><button style={s.actionBtn}>去登录</button></Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>📊</span>
        <h1 style={s.title}>情绪仪表盘</h1>
        <p style={s.subtitle}>全面了解你的心理健康状态</p>
      </div>

      {/* Overview Stats */}
      <div style={s.statGrid}>
        <div style={s.statCard('#7C3AED')}>
          <div style={{ fontSize: 20, display: 'block', marginBottom: 6 }}>🌤</div>
          <div style={{ ...s.statNum, color: '#7C3AED' }}>{avgMood}</div>
          <div style={s.statLabel}>近30天平均心情</div>
        </div>
        <div style={s.statCard('#10B981')}>
          <div style={{ fontSize: 20, display: 'block', marginBottom: 6 }}>🔥</div>
          <div style={{ ...s.statNum, color: '#10B981' }}>{checkinStreak}</div>
          <div style={s.statLabel}>连续打卡天数</div>
        </div>
        <div style={s.statCard('#F59E0B')}>
          <div style={{ fontSize: 20, display: 'block', marginBottom: 6 }}>📝</div>
          <div style={{ ...s.statNum, color: '#F59E0B' }}>{moodEntries.length}</div>
          <div style={s.statLabel}>情绪日记条数</div>
        </div>
        <div style={s.statCard('#EF4444')}>
          <div style={{ fontSize: 20, display: 'block', marginBottom: 6 }}>📊</div>
          <div style={{ ...s.statNum, color: '#EF4444' }}>{assessmentHistory.length}</div>
          <div style={s.statLabel}>测评次数</div>
        </div>
      </div>

      {/* Mood Trend Mini Chart */}
      <div style={s.card}>
        <p style={s.sectionTitle}>📈 情绪趋势（近14条）</p>
        {moodTrend.length > 0 ? (
          <>
            <div style={s.trendRow}>
              {moodTrend.map((e: any, i: number) => (
                <div key={i} style={s.trendCol(e.score, i === moodTrend.length - 1)}>
                  <div style={s.trendBar(e.score)} title={`${e.date} ${e.moodInfo.label}`} />
                  <span style={{ fontSize: 10, marginTop: 2 }}>{e.mood}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: dk('#D1D5DB', '#4B5563'), marginTop: 4 }}>
              <span>{moodTrend[0]?.date}</span>
              <span>{moodTrend[moodTrend.length - 1]?.date}</span>
            </div>
          </>
        ) : (
          <div style={s.empty}>暂无情绪日记数据，<Link to="/mood-diary" style={{ color: '#7C3AED' }}>去写日记</Link></div>
        )}
      </div>

      {/* Mood Distribution */}
      <div style={s.card}>
        <p style={s.sectionTitle}>🎨 心情分布</p>
        {moodDist.length > 0 ? (
          <div>
            {moodDist.map((d: any) => {
              const moodEntry = Object.values(MOOD_MAP).find(m => m.label === d.label)
              const emoji = Object.entries(MOOD_MAP).find(([_k, v]) => v.label === d.label)?.[0] || '😐'
              return (
                <div key={d.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: dk('#374151', '#f3f4f6') }}>{emoji} {d.label}</span>
                    <span style={{ color: dk('#9CA3AF', '#6B7280') }}>{d.count}次 ({d.pct}%)</span>
                  </div>
                  <div style={s.moodBar(d.pct, moodEntry?.color || '#FBBF24')}>
                    <div style={s.moodBarFill(d.pct, moodEntry?.color || '#FBBF24')} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={s.empty}>暂无数据</div>
        )}
      </div>

      {/* Community Reference */}
      <div style={s.card}>
        <p style={s.sectionTitle}>🌍 心情参照</p>
        <p style={{ fontSize: 12, color: dk('#D1D5DB', '#4B5563'), marginBottom: 12, lineHeight: 1.5 }}>
          以下为模拟的匿名参照数据，帮助你了解自己的情绪在人群中的相对位置。
          数据基于心理健康研究文献中的典型分布模拟，非真实用户聚合。
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: '年轻人平均压力水平', value: '中等偏高', emoji: '📊', note: '约 65% 的年轻人在学期中会经历中度以上压力' },
            { label: '本周情绪基线参考', value: '3.2 / 5', emoji: '🌡️', note: '大多数人每周的平均心情在 3.0-3.5 之间波动' },
            { label: '考试季典型状态', value: '轻度焦虑', emoji: '📝', note: '考前 1 周适度焦虑是正常的，能帮助提升专注力' },
          ].map((ref, i) => (
            <div key={i} style={{
              padding: '12px 14px', borderRadius: 14,
              background: dk('rgba(167,139,250,0.04)', 'rgba(167,139,250,0.06)'),
              border: `1px solid ${dk('rgba(167,139,250,0.1)', 'rgba(139,92,246,0.12)')}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: dk('#374151', '#f3f4f6') }}>
                  {ref.emoji} {ref.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED' }}>{ref.value}</span>
              </div>
              <p style={{ fontSize: 11, color: dk('#9CA3AF', '#6B7280'), lineHeight: 1.5 }}>{ref.note}</p>
            </div>
          ))}
        </div>

        {/* Personal comparison if user has data */}
        {moodEntries.length >= 7 && (
          <div style={{
            marginTop: 16, padding: '14px 16px', borderRadius: 14,
            background: dk('rgba(110,231,183,0.08)', 'rgba(110,231,183,0.06)'),
            border: `1px solid ${dk('rgba(110,231,183,0.2)', 'rgba(110,231,183,0.15)')}`,
          }}>
            <p style={{ fontSize: 13, color: dk('#374151', '#f3f4f6'), lineHeight: 1.6 }}>
              💚 你的近7天平均心情为 <strong>{avgMood}</strong>，
              {parseFloat(avgMood) >= 3.5
                ? '高于大多数人——你的情绪状态不错，继续保持！'
                : parseFloat(avgMood) >= 2.5
                  ? '和大多数人差不多——这是正常的情绪波动范围。'
                  : '低于大多数人的平均水平。这不一定意味着什么，但如果持续低落，建议和信任的人聊聊。'
              }
            </p>
          </div>
        )}
      </div>

      {/* Latest Assessment */}
      <div style={s.card}>
        <p style={s.sectionTitle}>📋 最近测评结果</p>
        {assessmentHistory.length > 0 ? (
          <div>
            {assessRadar.map((a: any) => {
              const pct = Math.min(100, Math.round(a.score / a.max * 100))
              const color = pct < 40 ? '#10B981' : pct < 60 ? '#FBBF24' : pct < 80 ? '#F97316' : '#EF4444'
              return (
                <div key={a.name} style={s.assessRow_unused}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: dk('#374151', '#f3f4f6') }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: dk('#9CA3AF', '#6B7280'), marginTop: 2 }}>
                      得分 {a.score}/{a.max}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ ...s.progressBar(pct), width: 80 }}>
                      <div style={s.progressFill(pct, color)} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color }}>{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={s.empty}>暂无测评数据，<Link to="/assessment" style={{ color: '#7C3AED' }}>去做测评</Link></div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={s.card}>
        <p style={s.sectionTitle}>⚡ 快捷操作</p>
        <Link to="/mood-diary" style={s.actionBtn}>📝 记录今天的心情</Link>
        <Link to="/checkin" style={s.softBtn()}>📅 每日打卡</Link>
        <Link to="/assessment" style={s.softBtn()}>📊 情绪测评</Link>
        <Link to="/relax" style={s.softBtn()}>🧘 放松一下</Link>
      </div>
    </div>
  )
}
