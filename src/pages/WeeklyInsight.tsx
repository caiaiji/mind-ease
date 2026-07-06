import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const MOOD_KEY = 'mindease-mood-journal'
const ASSESS_KEY = 'mindease-assessment-history'
const CHECKIN_KEY = 'mindease-checkin'

interface MoodEntry {
  id: string
  mood: number
  note: string
  tags: string[]
  date: string
}

interface HistoryRecord {
  id: string
  assessmentId: string
  assessmentTitle: string
  assessmentEmoji: string
  score: number
  maxScore: number
  level: string
  date: string
}

interface CheckInRecord {
  dates: string[]
}

const moodLabels = ['', '很难受', '不太好', '一般', '还不错', '很开心']
const moodEmojis = ['', '😢', '😟', '😐', '🙂', '😊']
const moodColors = ['', '#FDA4AF', '#FDBA74', '#FDE68A', '#A7F3D0', '#6EE7B7']

const dayNames = ['日', '一', '二', '三', '四', '五', '六']

function loadData<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') }
  catch { return [] }
}
function loadCheckin(): CheckInRecord {
  try {
    const raw = JSON.parse(localStorage.getItem(CHECKIN_KEY) || '{}')
    return { dates: Array.isArray(raw?.dates) ? raw.dates : [] }
  } catch { return { dates: [] } }
}

function getDateNDaysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d
}

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

function formatDateCN(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function getWeekRange(offset: number = 0) {
  const end = getDateNDaysAgo(offset * 7 - 1)
  const start = getDateNDaysAgo((offset + 1) * 7)
  return { start: toDateStr(start), end: toDateStr(end) }
}

export default function WeeklyInsight() {
    useDocumentTitle('情绪周报')

  const [weekOffset, setWeekOffset] = useState(0)

  const isDark = document.documentElement.classList.contains('dark')
  const d = (light: string, darkVal: string) => isDark ? darkVal : light

  const weekRange = useMemo(() => getWeekRange(weekOffset), [weekOffset])
  const moodEntries = useMemo(() => loadData<MoodEntry>(MOOD_KEY), [])
  const assessRecords = useMemo(() => loadData<HistoryRecord>(ASSESS_KEY), [])
  const checkinRecord = useMemo(() => loadCheckin(), [])

  // Filter data for this week
  const weekMoods = useMemo(() =>
    moodEntries.filter(e => e.date >= weekRange.start && e.date <= weekRange.end),
    [moodEntries, weekRange]
  )

  const weekAssess = useMemo(() =>
    assessRecords.filter(r => r.date >= weekRange.start && r.date <= weekRange.end),
    [assessRecords, weekRange]
  )

  const weekCheckins = useMemo(() =>
    checkinRecord.dates.filter(d => d >= weekRange.start && d <= weekRange.end),
    [checkinRecord, weekRange]
  )

  // Build daily data (7 days)
  const dailyData = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = getDateNDaysAgo(weekOffset * 7 + (6 - i))
      const dateStr = toDateStr(date)
      const dayMoods = moodEntries.filter(e => e.date === dateStr)
      const avgMood = dayMoods.length > 0
        ? dayMoods.reduce((sum, e) => sum + e.mood, 0) / dayMoods.length
        : null
      const isCheckedIn = checkinRecord.dates.includes(dateStr)
      const dayAssess = assessRecords.filter(r => r.date === dateStr)
      days.push({
        date,
        dateStr,
        dayName: dayNames[date.getDay()],
        avgMood,
        moodCount: dayMoods.length,
        isCheckedIn,
        assessCount: dayAssess.length,
      })
    }
    return days
  }, [moodEntries, assessRecords, checkinRecord, weekOffset])

  // Stats
  const avgMood = weekMoods.length > 0
    ? weekMoods.reduce((s, e) => s + e.mood, 0) / weekMoods.length
    : null
  const bestDay = useMemo(() => {
    if (dailyData.length === 0) return null
    const withMood = dailyData.filter(d => d.avgMood !== null)
    if (withMood.length === 0) return null
    return withMood.reduce((best, d) => d.avgMood! > best.avgMood! ? d : best)
  }, [dailyData])
  const worstDay = useMemo(() => {
    if (dailyData.length === 0) return null
    const withMood = dailyData.filter(d => d.avgMood !== null)
    if (withMood.length === 0) return null
    return withMood.reduce((worst, d) => d.avgMood! < worst.avgMood! ? d : worst)
  }, [dailyData])

  // Mood distribution
  const moodDist = useMemo(() => {
    const dist = [0, 0, 0, 0, 0]
    weekMoods.forEach(e => dist[e.mood - 1]++)
    const total = weekMoods.length || 1
    return dist.map(c => ({ count: c, pct: Math.round(c / total * 100) }))
  }, [weekMoods])

  // Insight text
  const insightText = useMemo(() => {
    if (weekMoods.length === 0) return null
    const parts: string[] = []
    if (avgMood && avgMood >= 4) parts.push('本周整体心情不错，保持住了积极的状态')
    else if (avgMood && avgMood >= 3) parts.push('本周心情比较平稳，有起伏但总体还好')
    else if (avgMood && avgMood < 3) parts.push('本周情绪偏低，记得多关注自己的感受')
    if (weekCheckins.length >= 5) parts.push('打卡非常积极，坚持得很好')
    else if (weekCheckins.length >= 3) parts.push('保持了不错的打卡频率')
    if (weekAssess.length > 0) parts.push(`完成了 ${weekAssess.length} 次心理测评`)
    if (bestDay && worstDay && bestDay.dayName === worstDay.dayName) {
      // only one day
    } else {
      if (bestDay) parts.push(`${bestDay.dayName}心情最好`)
      if (worstDay) parts.push(`${worstDay.dayName}情绪波动较大`)
    }
    return parts.join('。') + '。'
  }, [weekMoods, weekCheckins, weekAssess, avgMood, bestDay, worstDay])

  // Personalized action recommendation based on mood patterns
  const actionRecommendation = useMemo(() => {
    if (weekMoods.length < 2) return null
    const recommendations: { text: string; link?: string; linkText?: string }[] = []
    
    // High anxiety pattern: multiple days with mood <= 2
    const anxiousDays = weekMoods.filter(e => e.mood <= 2).length
    if (anxiousDays >= 3) {
      recommendations.push({
        text: `这周有 ${anxiousDays} 天情绪偏低，试试睡前做4-7-8呼吸放松法，帮助缓解焦虑。`,
        link: '/relax',
        linkText: '试试呼吸放松',
      })
    }
    
    // Consistently low mood
    if (avgMood && avgMood <= 2 && weekMoods.length >= 3) {
      recommendations.push({
        text: '情绪持续偏低超过几天，建议找个信任的人聊一聊，或者考虑联系学校心理咨询。',
        link: '/articles/benefits-of-therapy',
        linkText: '了解心理咨询',
      })
    }
    
    // Good streak - encourage continuation
    const highDays = weekMoods.filter(e => e.mood >= 4).length
    if (highDays >= 4 && weekMoods.length >= 5) {
      recommendations.push({
        text: '这周大部分时间心情不错！把让你开心的事记录下来，下次低落时翻出来看看。',
        link: '/mood-diary',
        linkText: '写一篇日记',
      })
    }
    
    // No checkin streak
    if (weekCheckins.length === 0 && weekMoods.length >= 3) {
      recommendations.push({
        text: '这周还没打过卡，试试每天来心晴驿站打个卡，养成关注心灵的习惯。',
        link: '/checkin',
        linkText: '去打卡',
      })
    }
    
    // Mood swings
    if (avgMood && weekMoods.length >= 3) {
      const moods = weekMoods.map(e => e.mood)
      const maxSwing = Math.max(...moods) - Math.min(...moods)
      if (maxSwing >= 3) {
        recommendations.push({
          text: '本周情绪波动较大，这很正常。试着在情绪剧烈变化时暂停一下，做几次深呼吸。',
          link: '/articles/mood-swings',
          linkText: '了解情绪波动',
        })
      }
    }
    
    return recommendations.length > 0 ? recommendations[0] : null
  }, [weekMoods, weekCheckins, avgMood])

  const pageBg = d('#FFFBF5', '#1a1a2e')
  const textColor = d('#374151', '#d1d5db')
  const subColor = d('#9CA3AF', '#6b7280')
  const cardBg = d('rgba(255,255,255,0.7)', 'rgba(30,27,60,0.6)')
  const cardBorder = d('rgba(167,139,250,0.1)', 'rgba(167,139,250,0.2)')

  return (
    <div style={{ background: pageBg, minHeight: '100vh', fontFamily: '"Noto Sans SC", sans-serif', color: textColor, padding: '100px 16px 60px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>📊</span>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: '"ZCOOL XiaoWei", serif', marginBottom: 4 }}>情绪洞察周报</h1>
          <p style={{ fontSize: 14, color: subColor }}>回顾一周的心情轨迹，发现内心的规律</p>
        </div>

        {/* Week Selector */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24,
        }}>
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            disabled={weekOffset >= 4}
            style={{ padding: '6px 14px', borderRadius: 10, border: 'none', cursor: weekOffset < 4 ? 'pointer' : 'default', background: d('rgba(167,139,250,0.1)', 'rgba(167,139,250,0.15)'), color: '#7C3AED', fontSize: 13, fontWeight: 600, opacity: weekOffset >= 4 ? 0.4 : 1 }}
          >
            ← 上周
          </button>
          <span style={{ fontSize: 14, fontWeight: 600, color: textColor }}>
            {weekOffset === 0 ? '本周' : `${weekOffset}周前`}
            <span style={{ color: subColor, fontWeight: 400, marginLeft: 6 }}>
              {formatDateCN(weekRange.start)} - {formatDateCN(weekRange.end)}
            </span>
          </span>
          <button
            onClick={() => setWeekOffset(w => w - 1)}
            disabled={weekOffset <= 0}
            style={{ padding: '6px 14px', borderRadius: 10, border: 'none', cursor: weekOffset > 0 ? 'pointer' : 'default', background: d('rgba(167,139,250,0.1)', 'rgba(167,139,250,0.15)'), color: '#7C3AED', fontSize: 13, fontWeight: 600, opacity: weekOffset <= 0 ? 0.4 : 1 }}
          >
            下周 →
          </button>
        </div>

        {/* AI Insight */}
        {insightText ? (
          <div style={{
            background: d('rgba(167,139,250,0.06)', 'rgba(167,139,250,0.1)'),
            borderRadius: 16, padding: '16px 20px', marginBottom: 20,
            border: `1px solid ${d('rgba(167,139,250,0.12)', 'rgba(167,139,250,0.2)')}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: '1.25rem' }}>✨</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#7C3AED' }}>本周洞察</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: d('#4b5563', '#d1d5db') }}>{insightText}</p>
          </div>
        ) : null}

        {/* Personalized Action Recommendation */}
        {actionRecommendation ? (
          <div style={{
            background: d('rgba(110,231,183,0.06)', 'rgba(110,231,183,0.1)'),
            borderRadius: 16, padding: '14px 18px', marginBottom: 20,
            border: `1px solid ${d('rgba(110,231,183,0.15)', 'rgba(110,231,183,0.25)')}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: '1.1rem' }}>💡</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#059669' }}>个性化建议</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: d('#4b5563', '#d1d5db'), margin: 0 }}>{actionRecommendation.text}</p>
            </div>
            {actionRecommendation.link && (
              <Link to={actionRecommendation.link} style={{
                padding: '8px 14px', borderRadius: 10, flexShrink: 0,
                background: d('rgba(110,231,183,0.15)', 'rgba(110,231,183,0.2)'),
                color: '#059669', fontSize: 12, fontWeight: 600,
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
                {actionRecommendation.linkText} →
              </Link>
            )}
          </div>
        ) : null}

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { emoji: '😊', label: '平均心情', value: avgMood ? moodEmojis[Math.round(avgMood)] + ' ' + moodLabels[Math.round(avgMood)] : '暂无', sub: `${weekMoods.length} 条记录` },
            { emoji: '📅', label: '打卡天数', value: `${weekCheckins.length}/7`, sub: weekCheckins.length >= 5 ? '很棒' : weekCheckins.length >= 3 ? '不错' : '加油' },
            { emoji: '🧪', label: '测评次数', value: `${weekAssess.length}`, sub: weekAssess.length > 0 ? '持续关注' : '去做一个？' },
          ].map((card, i) => (
            <div key={i} style={{
              background: cardBg, borderRadius: 16, padding: 16, textAlign: 'center',
              border: `1px solid ${cardBorder}`, backdropFilter: 'blur(10px)',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{card.emoji}</div>
              <div style={{ fontSize: 12, color: subColor, marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{card.value}</div>
              <div style={{ fontSize: 11, color: subColor, marginTop: 2 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Weekly Mood Chart */}
        <div style={{
          background: cardBg, borderRadius: 20, padding: 24, marginBottom: 20,
          border: `1px solid ${cardBorder}`, backdropFilter: 'blur(10px)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>心情轨迹</h3>

          {/* Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, marginBottom: 12, padding: '0 4px' }}>
            {dailyData.map((day, i) => {
              const barHeight = day.avgMood ? (day.avgMood / 5) * 140 : 4
              const barColor = day.avgMood ? moodColors[Math.round(day.avgMood)] : d('#e5e7eb', '#374151')
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  {day.avgMood && (
                    <span style={{ fontSize: 11, color: subColor }}>{day.avgMood.toFixed(1)}</span>
                  )}
                  <div style={{
                    width: '100%', maxWidth: 36,
                    height: Math.max(4, barHeight),
                    borderRadius: 8,
                    background: day.avgMood ? `linear-gradient(180deg, ${barColor}, ${barColor}88)` : d('#e5e7eb', '#374151'),
                    transition: 'height 0.5s ease',
                    minHeight: 4,
                  }} />
                  {day.isCheckedIn && (
                    <span style={{ fontSize: 10, opacity: 0.6 }}>✓</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Day labels */}
          <div style={{ display: 'flex', gap: 8, padding: '0 4px' }}>
            {dailyData.map((day, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 12, color: day.dayName === '一' || day.dayName === '六' ? textColor : subColor }}>
                周{day.dayName}
                <div style={{ fontSize: 10, color: subColor, marginTop: 1 }}>{formatDateCN(day.dateStr)}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { color: '#6EE7B7', label: '开心' },
              { color: '#A7F3D0', label: '不错' },
              { color: '#FDE68A', label: '一般' },
              { color: '#FDBA74', label: '不好' },
              { color: '#FDA4AF', label: '难受' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: subColor }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Mood Distribution */}
        <div style={{
          background: cardBg, borderRadius: 20, padding: 24, marginBottom: 20,
          border: `1px solid ${cardBorder}`, backdropFilter: 'blur(10px)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>心情分布</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {moodDist.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{moodEmojis[i + 1]}</span>
                <span style={{ fontSize: 13, width: 48, color: subColor }}>{moodLabels[i + 1]}</span>
                <div style={{
                  flex: 1, height: 12, borderRadius: 6,
                  background: d('#f3f4f6', 'rgba(255,255,255,0.05)'),
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${Math.max(item.pct, 2)}%`,
                    height: '100%',
                    borderRadius: 6,
                    background: moodColors[i + 1],
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <span style={{ fontSize: 12, color: subColor, width: 60, textAlign: 'right' }}>
                  {item.count}次 ({item.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Checkin + Activity Timeline */}
        <div style={{
          background: cardBg, borderRadius: 20, padding: 24, marginBottom: 20,
          border: `1px solid ${cardBorder}`, backdropFilter: 'blur(10px)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>活动时间线</h3>
          {dailyData.every(d => !d.isCheckedIn && d.moodCount === 0 && d.assessCount === 0) ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: subColor, fontSize: 14 }}>
              这周还没有记录，开始你的第一天吧 🌱
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dailyData.map((day, i) => {
                const hasActivity = day.isCheckedIn || day.moodCount > 0 || day.assessCount > 0
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px',
                    borderRadius: 12,
                    background: hasActivity ? d('rgba(167,139,250,0.04)', 'rgba(167,139,250,0.06)') : 'transparent',
                  }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: hasActivity ? '#A78BFA' : d('#e5e7eb', '#374151'),
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 13, fontWeight: 500, width: 50 }}>
                      周{day.dayName}
                    </span>
                    <span style={{ fontSize: 12, color: subColor }}>{formatDateCN(day.dateStr)}</span>
                    <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', flexWrap: 'wrap' }}>
                      {day.isCheckedIn && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: d('rgba(110,231,183,0.15)', 'rgba(110,231,183,0.15)'), color: '#34d399' }}>已打卡</span>}
                      {day.moodCount > 0 && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: d('rgba(251,191,36,0.12)', 'rgba(251,191,36,0.12)'), color: '#f59e0b' }}>{day.moodCount}条心情</span>}
                      {day.assessCount > 0 && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: d('rgba(96,165,250,0.12)', 'rgba(96,165,250,0.12)'), color: '#3b82f6' }}>{day.assessCount}次测评</span>}
                      {!hasActivity && <span style={{ fontSize: 11, color: subColor, fontStyle: 'italic' }}>无记录</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Tips */}
        <div style={{
          background: d('rgba(167,139,250,0.06)', 'rgba(167,139,250,0.1)'),
          borderRadius: 16, padding: '16px 20px', marginBottom: 20,
          border: `1px solid ${d('rgba(167,139,250,0.12)', 'rgba(167,139,250,0.2)')}`,
        }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#7C3AED', marginBottom: 8 }}>💡 情绪小贴士</div>
          {weekMoods.length === 0 && weekCheckins.length === 0 ? (
            <p style={{ fontSize: 13, lineHeight: 1.7, color: d('#4b5563', '#d1d5db') }}>
              这周还没有任何记录。每天花1分钟记录心情、打个卡，积累的数据会帮助你更好地了解自己。开始你的第一天吧！
            </p>
          ) : avgMood && avgMood >= 4 ? (
            <p style={{ fontSize: 13, lineHeight: 1.7, color: d('#4b5563', '#d1d5db') }}>
              本周心情整体积极！继续保持你目前的生活方式，同时留意自己的"好心情来源"——是什么让你感到开心？可以有意识地把这些元素融入日常生活。
            </p>
          ) : avgMood && avgMood >= 3 ? (
            <p style={{ fontSize: 13, lineHeight: 1.7, color: d('#4b5563', '#d1d5db') }}>
              情绪有起伏是正常的。试着找出影响你心情的因素——睡眠不足？社交压力？学习节奏？针对性的调整往往比笼统的"放松"更有效。
            </p>
          ) : (
            <p style={{ fontSize: 13, lineHeight: 1.7, color: d('#4b5563', '#d1d5db') }}>
              这周似乎不太容易。记得：低落不是软弱的表现。试着每天做一件让自己舒服的小事——散步、听音乐、和朋友聊天。如果情绪持续低落超过两周，建议寻求专业帮助。
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{
          background: cardBg, borderRadius: 20, padding: 24,
          border: `1px solid ${cardBorder}`, backdropFilter: 'blur(10px)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>开始记录</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <Link to="/mood-diary" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '12px 16px', borderRadius: 14, textAlign: 'center',
                background: d('rgba(251,191,36,0.08)', 'rgba(251,191,36,0.1)'),
                border: `1px solid ${d('rgba(251,191,36,0.15)', 'rgba(251,191,36,0.2)')}`,
              }}>
                <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: 4 }}>📝</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: textColor }}>写心情日记</span>
              </div>
            </Link>
            <Link to="/assessment" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '12px 16px', borderRadius: 14, textAlign: 'center',
                background: d('rgba(96,165,250,0.08)', 'rgba(96,165,250,0.1)'),
                border: `1px solid ${d('rgba(96,165,250,0.15)', 'rgba(96,165,250,0.2)')}`,
              }}>
                <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: 4 }}>🧪</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: textColor }}>心理测评</span>
              </div>
            </Link>
            <Link to="/checkin" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '12px 16px', borderRadius: 14, textAlign: 'center',
                background: d('rgba(110,231,183,0.08)', 'rgba(110,231,183,0.1)'),
                border: `1px solid ${d('rgba(110,231,183,0.15)', 'rgba(110,231,183,0.2)')}`,
              }}>
                <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: 4 }}>📅</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: textColor }}>每日打卡</span>
              </div>
            </Link>
            <Link to="/relax" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '12px 16px', borderRadius: 14, textAlign: 'center',
                background: d('rgba(167,139,250,0.08)', 'rgba(167,139,250,0.1)'),
                border: `1px solid ${d('rgba(167,139,250,0.15)', 'rgba(167,139,250,0.2)')}`,
              }}>
                <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: 4 }}>🌬</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: textColor }}>放松一下</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
