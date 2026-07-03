import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface UserProfile {
  id: string
  nickname: string
  email: string
  avatar: string
  bio: string
  createdAt: string
  lastLogin: string
  moodStreak: number
  role: 'admin' | 'user'
}

interface UserContextType {
  user: UserProfile | null
  isLogin: boolean
  isAdmin: boolean
  register: (nickname: string, email: string, password: string) => boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  updateProfile: (updates: Partial<Pick<UserProfile, 'nickname' | 'avatar' | 'bio'>>) => void
  getAllUsers: () => Array<{ password: string; profile: UserProfile }>
}

const UserContext = createContext<UserContextType | null>(null)

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

const STORAGE_KEY = 'mindease-users'
const SESSION_KEY = 'mindease-session'

// 预设管理员邮箱列表，注册时自动设为 admin
const ADMIN_EMAILS = ['caiaiji@qq.com', 'caiaiji@gmail.com']

const AVATARS = ['🧑', '👩', '👨', '🧒', '👩‍🎓', '🧑‍🎓', '👨‍🎓', '🌸', '🍀', '⭐']

function generateId(): string {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function getUsers(): Record<string, { password: string; profile: UserProfile }> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveUsers(users: Record<string, { password: string; profile: UserProfile }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

function saveSession(userId: string) {
  localStorage.setItem(SESSION_KEY, userId)
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const userId = getSession()
    if (userId) {
      const users = getUsers()
      if (users[userId]) {
        const profile = { ...users[userId].profile, lastLogin: new Date().toISOString() }
        users[userId].profile = profile
        saveUsers(users)
        setUser(profile)
      } else {
        clearSession()
      }
    }
  }, [])

  const register = (nickname: string, email: string, password: string): boolean => {
    const users = getUsers()
    if (Object.values(users).some(u => u.profile.email === email)) {
      return false
    }
    const id = generateId()
    const role: 'admin' | 'user' = ADMIN_EMAILS.includes(email) ? 'admin' : 'user'
    const profile: UserProfile = {
      id,
      nickname,
      email,
      avatar: role === 'admin' ? '👑' : AVATARS[Math.floor(Math.random() * AVATARS.length)],
      bio: '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      moodStreak: 0,
      role,
    }
    users[id] = { password, profile }
    saveUsers(users)
    saveSession(id)
    setUser(profile)
    return true
  }

  const login = (email: string, password: string): boolean => {
    const users = getUsers()
    const found = Object.values(users).find(u => u.profile.email === email && u.password === password)
    if (!found) return false
    const profile = { ...found.profile, lastLogin: new Date().toISOString() }
    users[found.profile.id].profile = profile
    saveUsers(users)
    saveSession(found.profile.id)
    setUser(profile)
    return true
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  const updateProfile = (updates: Partial<Pick<UserProfile, 'nickname' | 'avatar' | 'bio'>>) => {
    if (!user) return
    const users = getUsers()
    const updated = { ...user, ...updates }
    users[user.id].profile = updated
    saveUsers(users)
    setUser(updated)
  }

  const getAllUsers = () => {
    return Object.values(getUsers())
  }

  const isAdmin = user?.role === 'admin'

  return (
    <UserContext.Provider value={{ user, isLogin: !!user, isAdmin, register, login, logout, updateProfile, getAllUsers }}>
      {children}
    </UserContext.Provider>
  )
}
