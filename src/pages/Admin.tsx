import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, getUsers } from '../contexts/UserContext'

type AdminTab = 'overview' | 'users' | 'mood' | 'treehole' | 'schulte'

interface StatCard {
  label: string
  value: number
  icon: string
  color: string
}

export default function Admin() {
  const { user, isAdmin, isLogin } = useUser()
  const navigate = useNavigate()
  const [tab, setTab] = useState<AdminTab>('overview')
  const [users, setUsers] = useState<Array<{ password: string; profile: any }>>([])
  const [moodData, setMoodData] = useState<any[]>([])
  const [treeholeData, setTreeholeData] = useState<any[]>([])
  const [schulteData, setSchulteData] = useState<any[]>([])

  // Auth guard
  useEffect(() => {
    if (!isLogin) {
      navigate('/profile')
      return
    }
    if (!isAdmin) {
      navigate('/')
      return
    }
  }, [isLogin, isAdmin, navigate])

  // Load data
  const refreshData = () => {
    setUsers(getUsers ? Object.values(getUsers()) : [])
    try {
      setMoodData(JSON.parse(localStorage.getItem('mindease-mood-journal') || '[]'))
    } catch { setMoodData([]) }
    try {
      setTreeholeData(JSON.parse(localStorage.getItem('mindease-treehole') || '[]'))
    } catch { setTreeholeData([]) }
    try {
      setSchulteData(JSON.parse(localStorage.getItem('schulte-records') || '[]'))
    } catch { setSchulteData([]) }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const stats: StatCard[] = useMemo(() => [
    { label: '注册用户', value: users.length, icon: '👥', color: '#8B5CF6' },
    { label: '管理员', value: users.filter(u => u.profile.role === 'admin').length, icon: '👑', color: '#F59E0B' },
    { label: '情绪日记', value: moodData.length, icon: '📝', color: '#10B981' },
    { label: '树洞留言', value: treeholeData.length, icon: '🌳', color: '#3B82F6' },
    { label: '舒尔特记录', value: schulteData.length, icon: '🧠', color: '#EC4899' },
    { label: '今日活跃', value: moodData.filter(m => {
      const today = new Date().toISOString().slice(0, 10)
      return (m.date || '').startsWith(today)
    }).length, icon: '🔥', color: '#EF4444' },
  ], [users, moodData, treeholeData, schulteData])

  if (!isLogin || !isAdmin) {
    return (
      <div style={{ ...s.container, ...s.center }}>
        <div style={s.card}>
          <span style={{ fontSize: 48, display: 'block', textAlign: 'center', marginBottom: 16 }}>🔒</span>
          <p style={{ textAlign: 'center', color: '#6B7280' }}>
            {!isLogin ? '请先登录管理员账号' : '你没有管理员权限'}
          </p>
        </div>
      </div>
    )
  }

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso)
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
    } catch { return iso }
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const moodEmoji: Record<string, string> = {
    '5': '😄', '4': '😊', '3': '😐', '2': '😟', '1': '😢',
  }

  const moodLabel: Record<string, string> = {
    '5': '很开心', '4': '还不错', '3': '一般', '2': '不太好', '1': '很差',
  }

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <span style={{ fontSize: 32 }}>👑</span>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', margin: 0 }}>管理后台</h1>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: '4px 0 0' }}>
              欢迎回来，{user?.nickname} · {user?.email}
            </p>
          </div>
        </div>
        <button style={s.refreshBtn} onClick={refreshData}>刷新数据</button>
      </div>

      {/* Stats Cards */}
      <div style={s.statsGrid}>
        {stats.map(stat => (
          <div key={stat.label} style={{ ...s.statCard, borderTopColor: stat.color }}>
            <span style={{ fontSize: 28 }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1F2937' }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={s.tabBar}>
        {([
          { key: 'overview' as AdminTab, label: '总览', icon: '📊' },
          { key: 'users' as AdminTab, label: '用户管理', icon: '👥' },
          { key: 'mood' as AdminTab, label: '情绪日记', icon: '📝' },
          { key: 'treehole' as AdminTab, label: '树洞数据', icon: '🌳' },
          { key: 'schulte' as AdminTab, label: '舒尔特排行', icon: '🧠' },
        ]).map(t => (
          <button
            key={t.key}
            style={{
              ...s.tabBtn,
              ...(tab === t.key ? s.tabActive : {}),
            }}
            onClick={() => setTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={s.content}>

        {/* ===== OVERVIEW ===== */}
        {tab === 'overview' && (
          <div>
            {/* Mood distribution */}
            <div style={s.section}>
              <h3 style={s.sectionTitle}>📊 情绪分布（近 30 天）</h3>
              <div style={s.moodDist}>
                {[5, 4, 3, 2, 1].map(level => {
                  const count = moodData.filter(m => {
                    const d = new Date(m.date)
                    const now = new Date()
                    return m.mood == level && (now.getTime() - d.getTime()) < 30 * 86400000
                  }).length
                  const pct = moodData.length > 0 ? Math.round(count / Math.max(moodData.length, 1) * 100) : 0
                  return (
                    <div key={level} style={s.moodDistRow}>
                      <span style={{ fontSize: 24, width: 36 }}>{moodEmoji[String(level)]}</span>
                      <span style={{ fontSize: 13, color: '#6B7280', width: 50 }}>{moodLabel[String(level)]}</span>
                      <div style={{ flex: 1, height: 24, background: '#F3F4F6', borderRadius: 12, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          minWidth: pct > 0 ? 20 : 0,
                          background: level >= 4 ? '#10B981' : level === 3 ? '#F59E0B' : '#EF4444',
                          borderRadius: 12,
                          transition: 'width 0.5s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: 8,
                          boxSizing: 'border-box',
                        }}>
                          {count > 0 && <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{count}</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent activity */}
            <div style={s.section}>
              <h3 style={s.sectionTitle}>🕐 最近动态</h3>
              <div style={s.activityList}>
                {/* Mood entries */}
                {moodData.slice(-5).reverse().map((m: any, i: number) => (
                  <div key={`m${i}`} style={s.activityItem}>
                    <span style={{ fontSize: 20 }}>{moodEmoji[String(m.mood)] || '😐'}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, color: '#1F2937' }}>情绪日记 — {moodLabel[String(m.mood)] || '未记录'}</span>
                      {m.note && <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>{m.note.slice(0, 60)}</p>}
                    </div>
                    <span style={{ fontSize: 11, color: '#D1D5DB' }}>{formatDate(m.date)}</span>
                  </div>
                ))}
                {/* Treehole posts */}
                {treeholeData.slice(-5).reverse().map((t: any, i: number) => (
                  <div key={`t${i}`} style={s.activityItem}>
                    <span style={{ fontSize: 20 }}>🌳</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, color: '#1F2937' }}>树洞留言 — {t.nickname || '匿名'}</span>
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>{(t.content || '').slice(0, 60)}</p>
                    </div>
                    <span style={{ fontSize: 11, color: '#D1D5DB' }}>{formatDate(t.date)}</span>
                  </div>
                ))}
                {moodData.length === 0 && treeholeData.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#D1D5DB', padding: '30px 0' }}>暂无动态数据</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== USERS ===== */}
        {tab === 'users' && (
          <div>
            <h3 style={s.sectionTitle}>👥 用户列表（{users.length} 人）</h3>
            {users.length === 0 ? (
              <div style={s.empty}>暂无注册用户</div>
            ) : (
              <div style={s.userGrid}>
                {users.map(u => (
                  <div key={u.profile.id} style={s.userCard}>
                    <div style={s.userAvatar}>{u.profile.avatar}</div>
                    <div style={s.userNickname}>{u.profile.nickname}</div>
                    <div style={s.userEmail}>{u.profile.email}</div>
                    <div style={{
                      ...s.roleBadge,
                      background: u.profile.role === 'admin' ? 'rgba(245,158,11,0.1)' : 'rgba(139,92,246,0.1)',
                      color: u.profile.role === 'admin' ? '#F59E0B' : '#8B5CF6',
                    }}>
                      {u.profile.role === 'admin' ? '👑 管理员' : '👤 用户'}
                    </div>
                    <div style={s.userInfo}>
                      <span>注册: {formatDate(u.profile.createdAt)}</span>
                    </div>
                    <div style={s.userInfo}>
                      <span>登录: {formatDate(u.profile.lastLogin)}</span>
                    </div>
                    {u.profile.bio && (
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: '6px 0 0', textAlign: 'center', lineHeight: 1.4 }}>
                        {u.profile.bio}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== MOOD DIARY ===== */}
        {tab === 'mood' && (
          <div>
            <h3 style={s.sectionTitle}>📝 情绪日记记录（{moodData.length} 条）</h3>
            {moodData.length === 0 ? (
              <div style={s.empty}>暂无情绪日记数据</div>
            ) : (
              <div style={s.dataTable}>
                <div style={{ ...s.tableHeader, display: 'flex', padding: '10px 16px', borderBottom: '2px solid #E5E7EB' }}>
                  <span style={{ width: 40 }}>心情</span>
                  <span style={{ width: 80, fontWeight: 600 }}>等级</span>
                  <span style={{ flex: 1, fontWeight: 600 }}>笔记</span>
                  <span style={{ width: 120, fontWeight: 600 }}>标签</span>
                  <span style={{ width: 80, fontWeight: 600 }}>时间</span>
                </div>
                {moodData.slice().reverse().map((m: any, i: number) => (
                  <div key={i} style={{ display: 'flex', padding: '10px 16px', borderBottom: '1px solid #F3F4F6', alignItems: 'center', fontSize: 13 }}>
                    <span style={{ width: 40, fontSize: 20 }}>{moodEmoji[String(m.mood)] || '😐'}</span>
                    <span style={{ width: 80, color: '#6B7280' }}>{moodLabel[String(m.mood)] || '-'}</span>
                    <span style={{ flex: 1, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.note || '-'}
                    </span>
                    <span style={{ width: 120, color: '#8B5CF6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {(m.tags || []).join(', ') || '-'}
                    </span>
                    <span style={{ width: 80, color: '#D1D5DB', fontSize: 11 }}>{formatDate(m.date).slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== TREEHOLE ===== */}
        {tab === 'treehole' && (
          <div>
            <h3 style={s.sectionTitle}>🌳 树洞留言（{treeholeData.length} 条）</h3>
            {treeholeData.length === 0 ? (
              <div style={s.empty}>暂无树洞留言数据</div>
            ) : (
              <div style={s.treeholeList}>
                {treeholeData.slice().reverse().map((t: any, i: number) => (
                  <div key={i} style={s.treeholeCard}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 20, marginRight: 8 }}>🌱</span>
                      <span style={{ fontWeight: 600, color: '#1F2937', fontSize: 14 }}>{t.nickname || '匿名'}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#D1D5DB' }}>{formatDate(t.date)}</span>
                    </div>
                    <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: '0 0 8px' }}>{t.content}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#9CA3AF' }}>
                      <span>❤️ {t.likes || 0}</span>
                      <span>💬 {t.replies?.length || 0} 条回复</span>
                      {t.mood && <span>心情: {moodEmoji[String(t.mood)] || '😐'}</span>}
                    </div>
                    {t.replies && t.replies.length > 0 && (
                      <div style={{ marginTop: 8, paddingLeft: 12, borderLeft: '2px solid #E5E7EB' }}>
                        {t.replies.map((r: any, ri: number) => (
                          <div key={ri} style={{ marginBottom: 4, fontSize: 13 }}>
                            <span style={{ fontWeight: 500, color: '#8B5CF6' }}>{r.nickname || '匿名'}</span>
                            <span style={{ color: '#374151', marginLeft: 6 }}>{r.content}</span>
                            <span style={{ color: '#D1D5DB', marginLeft: 8, fontSize: 11 }}>{formatDate(r.date)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== SCHULTE ===== */}
        {tab === 'schulte' && (
          <div>
            <h3 style={s.sectionTitle}>🧠 舒尔特方格排行榜（{schulteData.length} 条记录）</h3>
            {schulteData.length === 0 ? (
              <div style={s.empty}>暂无舒尔特记录</div>
            ) : (
              <div style={s.dataTable}>
                <div style={{ ...s.tableHeader, display: 'flex', padding: '10px 16px', borderBottom: '2px solid #E5E7EB' }}>
                  <span style={{ width: 40 }}>排名</span>
                  <span style={{ flex: 1, fontWeight: 600 }}>玩家</span>
                  <span style={{ width: 100, fontWeight: 600 }}>用时</span>
                  <span style={{ width: 80, fontWeight: 600 }}>规格</span>
                  <span style={{ width: 100, fontWeight: 600 }}>时间</span>
                </div>
                {[...schulteData]
                  .sort((a: any, b: any) => (a.time || 999999) - (b.time || 999999))
                  .slice(0, 20)
                  .map((r: any, i: number) => (
                    <div key={i} style={{ display: 'flex', padding: '10px 16px', borderBottom: '1px solid #F3F4F6', alignItems: 'center', fontSize: 13 }}>
                      <span style={{ width: 40, fontWeight: 700, color: i < 3 ? '#F59E0B' : '#9CA3AF', fontSize: i < 3 ? 16 : 13 }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </span>
                      <span style={{ flex: 1, color: '#1F2937' }}>{r.name || '匿名玩家'}</span>
                      <span style={{ width: 100, fontWeight: 700, color: '#8B5CF6' }}>{formatTime(r.time || 0)}</span>
                      <span style={{ width: 80, color: '#6B7280' }}>{r.size ? `${r.size}x${r.size}` : '5x5'}</span>
                      <span style={{ width: 100, color: '#D1D5DB', fontSize: 11 }}>{formatDate(r.date).slice(5)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== STYLES ====================

const s: Record<string, any> = {
  container: {
    padding: '100px 24px 60px',
    maxWidth: 960,
    margin: '0 auto',
    fontFamily: '"Noto Sans SC", sans-serif',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  card: {
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: 24,
    padding: 40,
    border: '1px solid rgba(200,180,230,0.15)',
    textAlign: 'center' as const,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  refreshBtn: {
    padding: '8px 20px',
    borderRadius: 12,
    border: '1.5px solid rgba(139,92,246,0.3)',
    background: 'transparent',
    color: '#8B5CF6',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s',
  } as React.CSSProperties,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: 12,
    marginBottom: 24,
  } as React.CSSProperties,
  statCard: {
    background: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 16,
    border: '1px solid rgba(200,180,230,0.1)',
    borderTopWidth: 3,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  } as React.CSSProperties,
  tabBar: {
    display: 'flex',
    gap: 6,
    marginBottom: 20,
    overflowX: 'auto' as const,
    paddingBottom: 4,
  } as React.CSSProperties,
  tabBtn: {
    padding: '8px 16px',
    borderRadius: 12,
    border: '1.5px solid rgba(200,180,230,0.15)',
    background: 'transparent',
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,
  tabActive: {
    background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
    color: '#fff',
    border: 'none',
  } as React.CSSProperties,
  content: {
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
    border: '1px solid rgba(200,180,230,0.15)',
    padding: 24,
    minHeight: 300,
  } as React.CSSProperties,
  section: {
    marginBottom: 28,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1F2937',
    marginBottom: 16,
  } as React.CSSProperties,
  moodDist: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  } as React.CSSProperties,
  moodDistRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  } as React.CSSProperties,
  activityList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  } as React.CSSProperties,
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    background: 'rgba(249,250,251,0.8)',
    borderRadius: 12,
  } as React.CSSProperties,
  userGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 12,
  } as React.CSSProperties,
  userCard: {
    background: 'rgba(249,250,251,0.8)',
    borderRadius: 16,
    padding: 20,
    textAlign: 'center' as const,
    border: '1px solid rgba(200,180,230,0.1)',
  } as React.CSSProperties,
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #EDE9FE, #E0E7FF)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    margin: '0 auto 10px',
    border: '2px solid rgba(139,92,246,0.2)',
  } as React.CSSProperties,
  userNickname: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1F2937',
    marginBottom: 2,
  } as React.CSSProperties,
  userEmail: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
    wordBreak: 'break-all' as const,
  } as React.CSSProperties,
  roleBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 8,
  } as React.CSSProperties,
  userInfo: {
    fontSize: 11,
    color: '#D1D5DB',
    marginBottom: 2,
  } as React.CSSProperties,
  dataTable: {
    background: 'rgba(249,250,251,0.6)',
    borderRadius: 14,
    overflow: 'hidden',
  } as React.CSSProperties,
  tableHeader: {
    fontSize: 13,
    color: '#6B7280',
  } as React.CSSProperties,
  treeholeList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  } as React.CSSProperties,
  treeholeCard: {
    background: 'rgba(249,250,251,0.8)',
    borderRadius: 14,
    padding: 16,
    border: '1px solid rgba(200,180,230,0.1)',
  } as React.CSSProperties,
  empty: {
    textAlign: 'center' as const,
    color: '#D1D5DB',
    padding: '40px 0',
    fontSize: 14,
  } as React.CSSProperties,
}
