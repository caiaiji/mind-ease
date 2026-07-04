import { useState } from 'react'
import { useUser } from '../contexts/UserContext'


const AVATARS = ['🧑', '👩', '👨', '🧒', '👩‍🎓', '🧑‍🎓', '👨‍🎓', '🌸', '🍀', '⭐', '🌙', '🌈']

type Tab = 'login' | 'register' | 'profile'

export default function Profile() {
  const { user, isLogin, isAdmin, register, login, logout, updateProfile } = useUser()
  const [tab, setTab] = useState<Tab>(isLogin ? 'profile' : 'login')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPwd, setLoginPwd] = useState('')

  // Register form
  const [regNickname, setRegNickname] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPwd, setRegPwd] = useState('')
  const [regPwdConfirm, setRegPwdConfirm] = useState('')

  // Edit profile
  const [editNick, setEditNick] = useState(user?.nickname || '')
  const [editBio, setEditBio] = useState(user?.bio || '')
  const [editAvatar, setEditAvatar] = useState(user?.avatar || AVATARS[0])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!loginEmail || !loginPwd) {
      setError('请填写邮箱和密码')
      return
    }
    const ok = login(loginEmail, loginPwd)
    if (ok) {
      setSuccess('登录成功！')
      setTab('profile')
      // Update form fields with actual user data
      const userData = JSON.parse(localStorage.getItem('mindease-users') || '{}')
      const matched = Object.values(userData).find((u: any) => u.profile.email === loginEmail)
      if (matched) {
        const p = (matched as any).profile
        setEditNick(p.nickname)
        setEditBio(p.bio)
        setEditAvatar(p.avatar)
      }
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError('邮箱或密码错误')
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!regNickname || !regEmail || !regPwd) {
      setError('请填写所有必填项')
      return
    }
    if (regPwd.length < 4) {
      setError('密码至少需要 4 个字符')
      return
    }
    if (regPwd !== regPwdConfirm) {
      setError('两次输入的密码不一致')
      return
    }
    const ok = register(regNickname, regEmail, regPwd)
    if (ok) {
      setSuccess('注册成功！欢迎加入心晴驿站 🎉')
      setTab('profile')
      setEditNick(regNickname)
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError('该邮箱已被注册')
    }
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ nickname: editNick, bio: editBio, avatar: editAvatar })
    setSuccess('资料已更新')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleLogout = () => {
    logout()
    setTab('login')
    setLoginEmail('')
    setLoginPwd('')
    setSuccess('')
  }

  // Styles
  const s = {
    container: {
      minHeight: '100vh',
      padding: '120px 24px 60px',
      maxWidth: 480,
      margin: '0 auto',
    } as React.CSSProperties,
    card: {
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: 24,
      padding: '32px 24px',
      border: '1px solid rgba(200,180,230,0.15)',
      boxShadow: '0 8px 32px rgba(139,92,246,0.06)',
    } as React.CSSProperties,
    tabs: {
      display: 'flex',
      gap: 8,
      marginBottom: 28,
      borderBottom: '2px solid rgba(200,180,230,0.15)',
      paddingBottom: 12,
    } as React.CSSProperties,
    tab: (active: boolean) => ({
      flex: 1,
      textAlign: 'center' as const,
      padding: '10px 0',
      borderRadius: 12,
      fontSize: 15,
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s',
      background: active ? 'linear-gradient(135deg, #EDE9FE, #E0E7FF)' : 'transparent',
      color: active ? '#7C3AED' : '#9CA3AF',
      border: 'none',
    } as React.CSSProperties),
    title: {
      fontSize: 24,
      fontWeight: 600,
      color: '#1F2937',
      textAlign: 'center' as const,
      marginBottom: 24,
      fontFamily: '"ZCOOL XiaoWei", serif',
    } as React.CSSProperties,
    formGroup: {
      marginBottom: 18,
    } as React.CSSProperties,
    label: {
      display: 'block',
      fontSize: 13,
      fontWeight: 500,
      color: '#6B7280',
      marginBottom: 6,
    } as React.CSSProperties,
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: 14,
      border: '1.5px solid rgba(200,180,230,0.2)',
      fontSize: 14,
      color: '#1F2937',
      background: 'rgba(255,255,255,0.6)',
      outline: 'none',
      boxSizing: 'border-box' as const,
      transition: 'border-color 0.3s',
    } as React.CSSProperties,
    btnPrimary: {
      width: '100%',
      padding: '14px 0',
      borderRadius: 16,
      border: 'none',
      fontSize: 15,
      fontWeight: 600,
      color: '#fff',
      background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginTop: 8,
    } as React.CSSProperties,
    btnSoft: {
      width: '100%',
      padding: '12px 0',
      borderRadius: 16,
      border: '1.5px solid rgba(200,180,230,0.3)',
      fontSize: 14,
      fontWeight: 500,
      color: '#7C3AED',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginTop: 8,
    } as React.CSSProperties,
    btnDanger: {
      width: '100%',
      padding: '12px 0',
      borderRadius: 16,
      border: '1.5px solid rgba(239,68,68,0.3)',
      fontSize: 14,
      fontWeight: 500,
      color: '#EF4444',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginTop: 8,
    } as React.CSSProperties,
    error: {
      background: 'rgba(239,68,68,0.08)',
      color: '#EF4444',
      padding: '10px 16px',
      borderRadius: 12,
      fontSize: 13,
      marginBottom: 16,
      textAlign: 'center' as const,
    } as React.CSSProperties,
    success: {
      background: 'rgba(16,185,129,0.08)',
      color: '#10B981',
      padding: '10px 16px',
      borderRadius: 12,
      fontSize: 13,
      marginBottom: 16,
      textAlign: 'center' as const,
    } as React.CSSProperties,
    avatar: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #EDE9FE, #E0E7FF)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 40,
      margin: '0 auto 16px',
      border: '3px solid rgba(139,92,246,0.2)',
    } as React.CSSProperties,
    avatarGrid: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: 10,
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 10,
    } as React.CSSProperties,
    avatarOption: (selected: boolean) => ({
      width: 48,
      height: 48,
      borderRadius: '50%',
      border: selected ? '3px solid #8B5CF6' : '2px solid rgba(200,180,230,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
      cursor: 'pointer',
      background: selected ? 'rgba(139,92,246,0.1)' : 'transparent',
      transition: 'all 0.2s',
    } as React.CSSProperties),
    statsRow: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '16px 0',
      borderTop: '1px solid rgba(200,180,230,0.15)',
      borderBottom: '1px solid rgba(200,180,230,0.15)',
      marginBottom: 24,
      marginTop: 20,
    } as React.CSSProperties,
    statItem: {
      textAlign: 'center' as const,
    } as React.CSSProperties,
    statNum: {
      fontSize: 22,
      fontWeight: 700,
      color: '#7C3AED',
      fontFamily: '"ZCOOL XiaoWei", serif',
    } as React.CSSProperties,
    statLabel: {
      fontSize: 12,
      color: '#9CA3AF',
      marginTop: 2,
    } as React.CSSProperties,
    textarea: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: 14,
      border: '1.5px solid rgba(200,180,230,0.2)',
      fontSize: 14,
      color: '#1F2937',
      background: 'rgba(255,255,255,0.6)',
      outline: 'none',
      boxSizing: 'border-box' as const,
      minHeight: 80,
      resize: 'vertical' as const,
      fontFamily: 'inherit',
    } as React.CSSProperties,
  }

  return (
    <div style={s.container}>
      <div style={s.card}>
        {/* Tabs */}
        <div style={s.tabs}>
          {isLogin ? (
            <>
              <button style={s.tab(tab === 'profile')} onClick={() => setTab('profile')}>个人中心</button>
              <button style={s.tab(tab === 'login')} onClick={handleLogout}>退出登录</button>
            </>
          ) : (
            <>
              <button style={s.tab(tab === 'login')} onClick={() => { setTab('login'); setError('') }}>登录</button>
              <button style={s.tab(tab === 'register')} onClick={() => { setTab('register'); setError('') }}>注册</button>
            </>
          )}
        </div>

        {/* Messages */}
        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}

        {/* ========== LOGIN ========== */}
        {tab === 'login' && (
          <>
            <h2 style={s.title}>欢迎回来</h2>
            <form onSubmit={handleLogin}>
              <div style={s.formGroup}>
                <label style={s.label}>邮箱</label>
                <input
                  type="email"
                  style={s.input}
                  placeholder="请输入注册邮箱"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>密码</label>
                <input
                  type="password"
                  style={s.input}
                  placeholder="请输入密码"
                  value={loginPwd}
                  onChange={e => setLoginPwd(e.target.value)}
                />
              </div>
              <button type="submit" style={s.btnPrimary}>登 录</button>
            </form>
          </>
        )}

        {/* ========== REGISTER ========== */}
        {tab === 'register' && (
          <>
            <h2 style={s.title}>加入心晴驿站</h2>
            <p style={{ textAlign: 'center', fontSize: 14, color: '#9CA3AF', marginBottom: 24 }}>
              创建一个账号，开始你的心灵之旅
            </p>
            <form onSubmit={handleRegister}>
              <div style={s.formGroup}>
                <label style={s.label}>昵称 *</label>
                <input
                  type="text"
                  style={s.input}
                  placeholder="给自己取个好听的名字"
                  value={regNickname}
                  onChange={e => setRegNickname(e.target.value)}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>邮箱 *</label>
                <input
                  type="email"
                  style={s.input}
                  placeholder="your@email.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>密码 *</label>
                <input
                  type="password"
                  style={s.input}
                  placeholder="至少 4 个字符"
                  value={regPwd}
                  onChange={e => setRegPwd(e.target.value)}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>确认密码 *</label>
                <input
                  type="password"
                  style={s.input}
                  placeholder="再次输入密码"
                  value={regPwdConfirm}
                  onChange={e => setRegPwdConfirm(e.target.value)}
                />
              </div>
              <button type="submit" style={s.btnPrimary}>注 册</button>
            </form>
          </>
        )}

        {/* ========== PROFILE ========== */}
        {tab === 'profile' && user && (
          <>
            <h2 style={s.title}>个人中心</h2>

            {/* Avatar & Info Display */}
            <div style={s.avatar}>{user.avatar}</div>
            <p style={{ textAlign: 'center', fontSize: 18, fontWeight: 600, color: '#1F2937' }}>{user.nickname}</p>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
              {user.email}
            </p>

            {/* Admin Badge */}
            {isAdmin && (
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  background: 'rgba(245,158,11,0.1)',
                  color: '#F59E0B',
                  marginBottom: 8,
                }}>👑 管理员</span>
                <br />
                <a href="/mind-ease/admin" style={{
                  display: 'inline-block',
                  padding: '10px 28px',
                  borderRadius: 14,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  textDecoration: 'none',
                  marginTop: 4,
                }}>进入管理后台 →</a>
              </div>
            )}

            {/* Stats */}
            <div style={s.statsRow}>
              <div style={s.statItem}>
                <div style={s.statNum}>
                  {(() => {
                    try {
                      const journal = JSON.parse(localStorage.getItem('mindease-mood-journal') || '[]')
                      return journal.length
                    } catch { return 0 }
                  })()}
                </div>
                <div style={s.statLabel}>日记条数</div>
              </div>
              <div style={s.statItem}>
                <div style={s.statNum}>
                  {(() => {
                    try {
                      const records = JSON.parse(localStorage.getItem('schulte-records') || '[]')
                      return records.length
                    } catch { return 0 }
                  })()}
                </div>
                <div style={s.statLabel}>游戏次数</div>
              </div>
              <div style={s.statItem}>
                <div style={s.statNum}>
                  {(() => {
                    try {
                      const posts = JSON.parse(localStorage.getItem('mindease-treehole') || '[]')
                      return posts.filter((p: any) => p.email === user.email).length
                    } catch { return 0 }
                  })()}
                </div>
                <div style={s.statLabel}>树洞留言</div>
              </div>
              <div style={s.statItem}>
                <div style={s.statNum}>
                  {(() => {
                    try {
                      const ci = JSON.parse(localStorage.getItem('mindease-checkin') || '{}')
                      return ci.dates ? [...new Set(ci.dates)].length : 0
                    } catch { return 0 }
                  })()}
                </div>
                <div style={s.statLabel}>打卡天数</div>
              </div>
            </div>

            {/* Check-in Shortcut */}
            <a href="#/checkin" style={{
              display: 'block',
              textAlign: 'center',
              padding: '14px 0',
              borderRadius: 16,
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, #A78BFA, #6EE7B7)',
              textDecoration: 'none',
              marginBottom: 20,
              boxShadow: '0 4px 16px rgba(139,92,246,0.2)',
            }}>
              📅 去打卡
            </a>

            {/* Edit Form */}
            <form onSubmit={handleSaveProfile}>
              <div style={s.formGroup}>
                <label style={s.label}>昵称</label>
                <input
                  type="text"
                  style={s.input}
                  value={editNick}
                  onChange={e => setEditNick(e.target.value)}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>选择头像</label>
                <div style={s.avatarGrid}>
                  {AVATARS.map(a => (
                    <div
                      key={a}
                      style={s.avatarOption(editAvatar === a)}
                      onClick={() => setEditAvatar(a)}
                    >
                      {a}
                    </div>
                  ))}
                </div>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>个人简介</label>
                <textarea
                  style={s.textarea}
                  placeholder="写点什么介绍一下自己吧..."
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                />
              </div>
              <button type="submit" style={s.btnPrimary}>保存修改</button>
            </form>
            <button style={s.btnDanger} onClick={handleLogout}>
              退出登录
            </button>
          </>
        )}
      </div>

      {/* Tip */}
      <p style={{
        textAlign: 'center',
        fontSize: 12,
        color: '#D1D5DB',
        marginTop: 20,
        lineHeight: 1.6,
      }}>
        你的所有数据都存储在本地浏览器中，清除浏览器数据会导致账号丢失。<br/>
        建议记住你的邮箱和密码以便重新登录。
      </p>
    </div>
  )
}
