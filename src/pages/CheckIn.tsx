import { useState, useEffect, useMemo } from 'react'
import { useUser } from '../contexts/UserContext'
import { dark } from '../contexts/ThemeContext'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'mindease-checkin'

interface CheckInRecord {
  dates: string[] // YYYY-MM-DD
}

function loadRecords(): CheckInRecord {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return { dates: Array.isArray(raw.dates) ? raw.dates : [] }
  } catch { return { dates: [] } }
}

function saveRecords(record: CheckInRecord) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
}

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  const unique = [...new Set(dates)].sort().reverse()
  const today = todayStr()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
  if (unique[0] !== today && unique[0] !== yesterdayStr) return 0
  let streak = 1
  let current = new Date(unique[0] + 'T00:00:00')
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(current)
    prev.setDate(prev.getDate() - 1)
    const prevStr = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-${String(prev.getDate()).padStart(2, '0')}`
    if (unique[i] === prevStr) {
      streak++
      current = prev
    } else {
      break
    }
  }
  return streak
}

interface Achievement {
  id: string
  emoji: string
  title: string
  desc: string
  check: (streak: number, total: number) => boolean
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', emoji: '🌱', title: '初次打卡', desc: '完成第一次打卡', check: (_s, t) => t >= 1 },
  { id: 'streak3', emoji: '🔥', title: '三天连续', desc: '连续打卡 3 天', check: (s) => s >= 3 },
  { id: 'streak7', emoji: '⚡', title: '一周坚持', desc: '连续打卡 7 天', check: (s) => s >= 7 },
  { id: 'streak14', emoji: '🌟', title: '两周习惯', desc: '连续打卡 14 天', check: (s) => s >= 14 },
  { id: 'streak30', emoji: '👑', title: '月度冠军', desc: '连续打卡 30 天', check: (s) => s >= 30 },
  { id: 'total10', emoji: '💚', title: '十次记录', desc: '累计打卡 10 次', check: (_s, t) => t >= 10 },
  { id: 'total30', emoji: '💎', title: '三十次坚持', desc: '累计打卡 30 次', check: (_s, t) => t >= 30 },
  { id: 'total100', emoji: '🏆', title: '百次达人', desc: '累计打卡 100 次', check: (_s, t) => t >= 100 },
]

// Heatmap: 7 rows (Mon-Sun) x N columns (weeks)
function getWeekHeatmap(dates: string[]): { weekCols: { date: string; checked: boolean; day: number }[][] } {
  const dateSet = new Set(dates)
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  // Collect all dates from ~12 weeks ago to today
  const allDates: { date: string; day: number }[] = []
  const start = new Date(today)
  start.setDate(start.getDate() - 83)
  // Align to Monday
  const dayOfWeek = start.getDay()
  start.setDate(start.getDate() - ((dayOfWeek + 6) % 7))

  for (let i = 0; i < 84; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    if (d > today) break
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    allDates.push({ date: str, day: d.getDay() }) // 0=Sun, 1=Mon, ... 6=Sat
  }

  // Build 7 rows x N cols
  const rows: { date: string; checked: boolean }[][] = Array.from({ length: 7 }, () => [])
  for (const item of allDates) {
    const rowIdx = (item.day + 6) % 7 // Convert 0=Sun -> 6, 1=Mon -> 0, ... 6=Sat -> 5
    rows[rowIdx].push({ date: item.date, checked: dateSet.has(item.date) })
  }

  // Transpose: columns of weeks
  const weekCols: { date: string; checked: boolean; day: number }[][] = []
  const maxCols = Math.max(...rows.map(r => r.length))
  for (let c = 0; c < maxCols; c++) {
    const col: { date: string; checked: boolean; day: number }[] = []
    for (let r = 0; r < 7; r++) {
      if (c < rows[r].length) {
        col.push({ ...rows[r][c], day: r })
      } else {
        col.push({ date: '', checked: false, day: r })
      }
    }
    weekCols.push(col)
  }

  return { weekCols }
}

const WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日']

export default function CheckIn() {
  const { isLogin } = useUser()
  const [records, setRecords] = useState<CheckInRecord>(loadRecords)
  const [justCheckedIn, setJustCheckedIn] = useState(false)
  const [newAchievements, setNewAchievements] = useState<string[]>([])

  const today = todayStr()
  const isCheckedToday = records.dates.includes(today)
  const uniqueDates = useMemo(() => [...new Set(records.dates)], [records.dates])
  const streak = useMemo(() => calcStreak(records.dates), [records.dates])
  const totalCount = uniqueDates.length
  const { weekCols } = useMemo(() => getWeekHeatmap(uniqueDates), [uniqueDates])

  const earnedIds = useMemo(
    () => new Set(ACHIEVEMENTS.filter(a => a.check(streak, totalCount)).map(a => a.id)),
    [streak, totalCount]
  )

  useEffect(() => { saveRecords(records) }, [records])

  const handleCheckIn = () => {
    if (isCheckedToday) return
    const newDates = [...records.dates, today]
    setRecords({ dates: newDates })

    // Check for newly earned achievements
    const newUnique = [...new Set(newDates)]
    const newStreak = calcStreak(newDates)
    const newTotal = newUnique.length
    const newlyEarned = ACHIEVEMENTS.filter(
      a => a.check(newStreak, newTotal) && !earnedIds.has(a.id)
    ).map(a => a.id)

    if (newlyEarned.length > 0) {
      setNewAchievements(newlyEarned)
      setTimeout(() => setNewAchievements([]), 3000)
    }

    setJustCheckedIn(true)
    setTimeout(() => setJustCheckedIn(false), 2000)
  }

  // --- Styles ---
  const dk = dark
  const s = {
    page: {
      minHeight: '100vh',
      padding: '100px 16px 60px',
      maxWidth: 600,
      margin: '0 auto',
      fontFamily: '"Noto Sans SC", sans-serif',
    } as React.CSSProperties,
    card: {
      background: dk('rgba(255,255,255,0.8)', 'rgba(40,40,70,0.8)'),
      backdropFilter: 'blur(20px)',
      borderRadius: 24,
      padding: '28px 24px',
      marginBottom: 20,
      border: `1px solid ${dk('rgba(167,139,250,0.15)', 'rgba(139,92,246,0.2)')}`,
      boxShadow: `0 8px 32px ${dk('rgba(139,92,246,0.06)', 'rgba(0,0,0,0.2)')}`,
    } as React.CSSProperties,
    title: {
      fontSize: 28, fontWeight: 700, color: dk('#374151', '#f3f4f6'),
      marginBottom: 4, fontFamily: '"ZCOOL XiaoWei", serif', textAlign: 'center' as const,
    } as React.CSSProperties,
    subtitle: {
      fontSize: 14, color: dk('#9CA3AF', '#6B7280'), marginBottom: 28, textAlign: 'center' as const,
    } as React.CSSProperties,
    streakCard: {
      background: dk('linear-gradient(135deg, #EDE9FE, #E0E7FF)', 'linear-gradient(135deg, #4C1D95, #312E81)'),
      borderRadius: 20, padding: 24, marginBottom: 20, textAlign: 'center' as const,
    } as React.CSSProperties,
    streakNum: {
      fontSize: 56, fontWeight: 800, color: '#7C3AED', lineHeight: 1, fontFamily: '"ZCOOL XiaoWei", serif',
    } as React.CSSProperties,
    streakLabel: { fontSize: 14, color: dk('#6B7280', '#A78BFA'), marginTop: 6 } as React.CSSProperties,
    streakRow: {
      display: 'flex', justifyContent: 'space-around', marginTop: 16, paddingTop: 16,
      borderTop: `1px solid ${dk('rgba(139,92,246,0.1)', 'rgba(139,92,246,0.3)')}`,
    } as React.CSSProperties,
    streakStat: { textAlign: 'center' as const } as React.CSSProperties,
    streakStatNum: {
      fontSize: 24, fontWeight: 700, color: dk('#7C3AED', '#A78BFA'), fontFamily: '"ZCOOL XiaoWei", serif',
    } as React.CSSProperties,
    streakStatLabel: { fontSize: 12, color: dk('#9CA3AF', '#6B7280'), marginTop: 2 } as React.CSSProperties,
    checkinBtn: (checked: boolean) => ({
      width: '100%', padding: '16px 0', borderRadius: 16, border: 'none',
      fontSize: 16, fontWeight: 700, cursor: checked ? 'default' as const : 'pointer' as const,
      background: checked ? dk('#E5E7EB', '#374151') : 'linear-gradient(135deg, #A78BFA, #6EE7B7)',
      color: checked ? dk('#9CA3AF', '#6B7280') : '#fff',
      transition: 'all 0.3s', marginBottom: 20,
    } as React.CSSProperties),
    cardTitle: {
      fontSize: 16, fontWeight: 600, color: dk('#374151', '#f3f4f6'), marginBottom: 16,
    } as React.CSSProperties,
    heatmapCell: (checked: boolean) => ({
      width: '100%', aspectRatio: '1', borderRadius: 3,
      background: checked ? 'linear-gradient(135deg, #A78BFA, #6EE7B7)' : dk('rgba(0,0,0,0.04)', 'rgba(255,255,255,0.06)'),
      transition: 'all 0.2s',
    } as React.CSSProperties),
    heatmapLabel: {
      fontSize: 10, color: dk('#9CA3AF', '#6B7280'),
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4,
    } as React.CSSProperties,
    achievementGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 } as React.CSSProperties,
    achievementItem: (earned: boolean) => ({
      padding: '14px 12px', borderRadius: 16,
      border: `1.5px solid ${earned ? dk('rgba(139,92,246,0.3)', 'rgba(139,92,246,0.4)') : dk('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.08)')}`,
      background: earned ? dk('rgba(139,92,246,0.06)', 'rgba(139,92,246,0.15)') : dk('rgba(0,0,0,0.02)', 'rgba(255,255,255,0.03)'),
      textAlign: 'center' as const, transition: 'all 0.3s',
    } as React.CSSProperties),
    achievementTitle: (earned: boolean) => ({
      fontSize: 13, fontWeight: 600,
      color: earned ? dk('#374151', '#f3f4f6') : dk('#D1D5DB', '#6B7280'), marginBottom: 2,
    } as React.CSSProperties),
    achievementDesc: { fontSize: 11, color: dk('#9CA3AF', '#6B7280') } as React.CSSProperties,
    toast: {
      position: 'fixed' as const, top: 80, left: '50%', transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #A78BFA, #6EE7B7)', color: '#fff',
      padding: '12px 24px', borderRadius: 16, fontSize: 15, fontWeight: 600,
      zIndex: 1000, boxShadow: '0 8px 32px rgba(139,92,246,0.3)',
    } as React.CSSProperties,
  }

  if (!isLogin) {
    return (
      <div style={s.page}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>📅</span>
          <h1 style={s.title}>每日打卡</h1>
          <p style={s.subtitle}>坚持记录，养成关注心灵的好习惯</p>
        </div>
        <div style={s.card}>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🔐</span>
            <p style={{ fontSize: 16, color: dk('#374151', '#f3f4f6'), marginBottom: 16 }}>登录后即可使用打卡功能</p>
            <Link to="/profile"><button style={s.checkinBtn(false)}>去登录</button></Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      {/* Toasts */}
      {justCheckedIn && (
        <div style={s.toast}>✨ 打卡成功！累计第 {totalCount} 次</div>
      )}
      {newAchievements.length > 0 && (
        <div style={{ ...s.toast, top: justCheckedIn ? 130 : 80 }}>
          🏆 解锁新成就：{newAchievements.map(id => ACHIEVEMENTS.find(a => a.id === id)?.title).join('、')}
        </div>
      )}

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>📅</span>
        <h1 style={s.title}>每日打卡</h1>
        <p style={s.subtitle}>坚持记录，养成关注心灵的好习惯</p>
      </div>

      {/* Streak Card */}
      <div style={s.streakCard}>
        <div style={s.streakNum}>{streak}</div>
        <div style={s.streakLabel}>连续打卡天数</div>
        <div style={s.streakRow}>
          <div style={s.streakStat}>
            <div style={s.streakStatNum}>{totalCount}</div>
            <div style={s.streakStatLabel}>累计打卡</div>
          </div>
          <div style={s.streakStat}>
            <div style={s.streakStatNum}>{earnedIds.size}/{ACHIEVEMENTS.length}</div>
            <div style={s.streakStatLabel}>已获成就</div>
          </div>
        </div>
      </div>

      {/* Check-in Button */}
      <button style={s.checkinBtn(isCheckedToday)} onClick={handleCheckIn} disabled={isCheckedToday}>
        {isCheckedToday ? `✅ 今日已打卡 (${today})` : '🎯 立即打卡'}
      </button>

      {/* Heatmap */}
      <div style={s.card}>
        <p style={s.cardTitle}>📊 打卡热力图（近 12 周）</p>
        <div style={{ display: 'grid', gridTemplateColumns: '20px repeat(12, 1fr)', gap: 3, overflowX: 'auto' }}>
          {/* Weekday labels column */}
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={i} style={s.heatmapLabel}>{label}</div>
          ))}
          {/* Heatmap cells */}
          {weekCols.map((col, ci) => (
            col.map((cell, ri) => (
              <div
                key={`${ci}-${ri}`}
                style={{
                  ...s.heatmapCell(cell.checked),
                  opacity: cell.date ? 1 : 0,
                }}
                title={cell.date ? `${cell.date}${cell.checked ? ' ✅' : ''}` : ''}
              />
            ))
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: dk('#D1D5DB', '#6B7280') }}>少</span>
          <div style={{ ...s.heatmapCell(false), width: 12, height: 12, display: 'inline-block' }} />
          <div style={{ ...s.heatmapCell(true), width: 12, height: 12, display: 'inline-block' }} />
          <span style={{ fontSize: 10, color: dk('#D1D5DB', '#6B7280') }}>多</span>
        </div>
      </div>

      {/* Achievements */}
      <div style={s.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <p style={{ ...s.cardTitle, marginBottom: 0 }}>🏆 成就徽章</p>
          <span style={{ fontSize: 13, color: '#7C3AED', fontWeight: 600 }}>
            {earnedIds.size} / {ACHIEVEMENTS.length}
          </span>
        </div>
        <div style={s.achievementGrid}>
          {ACHIEVEMENTS.map(a => {
            const earned = earnedIds.has(a.id)
            return (
              <div key={a.id} style={s.achievementItem(earned)}>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 6, filter: earned ? 'none' : 'grayscale(1) opacity(0.3)' }}>
                  {a.emoji}
                </span>
                <div style={s.achievementTitle(earned)}>{a.title}</div>
                <div style={s.achievementDesc}>{a.desc}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Motivation */}
      <div style={{
        ...s.card, textAlign: 'center' as const,
        background: dk('rgba(139,92,246,0.04)', 'rgba(139,92,246,0.1)'),
      }}>
        {streak === 0 && totalCount === 0 && (
          <p style={{ fontSize: 14, color: dk('#6B7280', '#A78BFA'), lineHeight: 1.6 }}>
            🌟 每天花一分钟打个卡，养成关注自己内心状态的好习惯。<br /><strong>坚持 7 天</strong>就能解锁「一周坚持」成就！
          </p>
        )}
        {streak > 0 && streak < 7 && (
          <p style={{ fontSize: 14, color: dk('#6B7280', '#A78BFA'), lineHeight: 1.6 }}>
            🔥 已连续 {streak} 天，再坚持 {7 - streak} 天解锁「一周坚持」！
          </p>
        )}
        {streak >= 7 && streak < 14 && (
          <p style={{ fontSize: 14, color: dk('#6B7280', '#A78BFA'), lineHeight: 1.6 }}>
            ⚡ 太棒了！连续 {streak} 天，再坚持 {14 - streak} 天解锁「两周习惯」！
          </p>
        )}
        {streak >= 14 && streak < 30 && (
          <p style={{ fontSize: 14, color: dk('#6B7280', '#A78BFA'), lineHeight: 1.6 }}>
            🌟 连续 {streak} 天！距离「月度冠军」还差 {30 - streak} 天，加油！
          </p>
        )}
        {streak >= 30 && (
          <p style={{ fontSize: 14, color: dk('#6B7280', '#A78BFA'), lineHeight: 1.6 }}>
            👑 连续 {streak} 天！你已经是最强打卡达人了！
          </p>
        )}
      </div>
    </div>
  )
}
