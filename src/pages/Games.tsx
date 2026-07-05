import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useState } from 'react'
import BubblePop from '../components/features/games/BubblePop'
import FlowerGarden from '../components/features/games/FlowerGarden'
import MemoryMatch from '../components/features/games/MemoryMatch'
import FloatingBubbles from '../components/features/games/FloatingBubbles'
import SchulteGrid from '../components/features/games/SchulteGrid'

type GameId = 'none' | 'bubble-pop' | 'flower-garden' | 'memory-match' | 'floating-bubbles' | 'schulte-grid'

const GAMES: { id: GameId; title: string; description: string; emoji: string; gradient: string; gradientDark: string; tag: string }[] = [
  { id: 'bubble-pop', title: '戳泡泡', description: '模拟捏气泡垫，点击就会"啵"地弹开，极其解压', emoji: '🫧', gradient: 'linear-gradient(135deg, rgba(237,233,254,0.5), rgba(237,233,254,0.2))', gradientDark: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))', tag: '解压神器' },
  { id: 'flower-garden', title: '种花花园', description: '点击空地种下种子，等待它们慢慢成长开花', emoji: '🌸', gradient: 'linear-gradient(135deg, rgba(209,250,229,0.5), rgba(209,250,229,0.2))', gradientDark: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))', tag: '治愈养成' },
  { id: 'memory-match', title: '记忆翻牌', description: '翻开卡牌找配对，可爱的 emoji 图案等你发现', emoji: '🃏', gradient: 'linear-gradient(135deg, rgba(254,205,211,0.5), rgba(254,205,211,0.2))', gradientDark: 'linear-gradient(135deg, rgba(244,114,182,0.2), rgba(244,114,182,0.05))', tag: '轻松益智' },
  { id: 'floating-bubbles', title: '漂浮泡泡', description: '点击屏幕生成彩色泡泡，安静的禅意体验', emoji: '✨', gradient: 'linear-gradient(135deg, rgba(219,234,254,0.5), rgba(233,213,255,0.2))', gradientDark: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(167,139,250,0.05))', tag: '禅意放松' },
  { id: 'schulte-grid', title: '舒尔特方格', description: '按 1 到 N 的顺序依次点击方格中的数字，训练注意力', emoji: '🧩', gradient: 'linear-gradient(135deg, rgba(254,243,199,0.5), rgba(253,224,71,0.2))', gradientDark: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))', tag: '注意力训练' },
]

const isDarkMode = () => document.documentElement.classList.contains('dark')

export default function Games() {
    useDocumentTitle('放松游戏')

  const [activeGame, setActiveGame] = useState<GameId>('none')
  const dark = isDarkMode()

  const glassCard: React.CSSProperties = {
    background: dark ? 'rgba(30,27,60,0.8)' : 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${dark ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.5)'}`,
    borderRadius: 24,
    boxShadow: dark ? '0 10px 25px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.06)',
  }

  const gameCard: React.CSSProperties = {
    background: dark ? 'rgba(30,27,60,0.8)' : 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${dark ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.5)'}`,
    borderRadius: 24,
    boxShadow: dark ? '0 10px 25px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.06)',
    padding: 32, textAlign: 'left', cursor: 'pointer',
    transition: 'all 0.3s ease', width: '100%',
  }

  if (activeGame !== 'none') {
    const game = GAMES.find((g) => g.id === activeGame)!

    return (
      <div style={{ padding: '32px 24px 80px', maxWidth: 800, margin: '0 auto' }}>
        <button
          onClick={() => setActiveGame('none')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: dark ? '#9CA3AF' : '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 24px', marginBottom: 8 }}
        >
          ← 返回游戏列表
        </button>

        <div style={{ ...glassCard, padding: 24, textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{game.emoji}</div>
          <h2 style={{ fontFamily: '"ZCOOL XiaoWei", serif', fontSize: 24, color: dark ? '#f3f4f6' : '#1F2937' }}>{game.title}</h2>
          <p style={{ fontSize: 14, color: dark ? '#9CA3AF' : '#9CA3AF', marginTop: 4 }}>{game.description}</p>
        </div>

        <div style={{ ...glassCard, padding: '24px 32px' }}>
          {activeGame === 'bubble-pop' && <BubblePop />}
          {activeGame === 'flower-garden' && <FlowerGarden />}
          {activeGame === 'memory-match' && <MemoryMatch />}
          {activeGame === 'floating-bubbles' && <FloatingBubbles />}
          {activeGame === 'schulte-grid' && <SchulteGrid />}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ padding: '48px 24px 0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h1 style={{ fontFamily: '"ZCOOL XiaoWei", serif', fontSize: 32, color: dark ? '#f3f4f6' : '#1F2937', marginBottom: 12 }}>放松小游戏</h1>
          <p style={{ fontSize: 18, color: dark ? '#9CA3AF' : '#6B7280', maxWidth: 600 }}>
            不想看文章也不想做测评？那就来玩个小游戏放松一下吧。每个游戏都很轻量，随时可以停下来。
          </p>
        </div>
      </div>

      <div style={{ padding: '48px 24px 80px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              style={{ ...gameCard, background: dark ? game.gradientDark : game.gradient }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = dark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = dark ? '0 10px 25px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.06)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ fontSize: 40 }}>{game.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontFamily: '"ZCOOL XiaoWei", serif', fontSize: 20, color: dark ? '#f3f4f6' : '#1F2937' }}>{game.title}</h3>
                    <span style={{
                      padding: '2px 10px', borderRadius: 999, fontSize: 12,
                      background: dark ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.6)', color: '#8B5CF6', fontWeight: 500,
                    }}>{game.tag}</span>
                  </div>
                  <p style={{ fontSize: 14, color: dark ? '#9CA3AF' : '#6B7280', lineHeight: 1.6 }}>{game.description}</p>
                </div>
              </div>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <span style={{ fontSize: 14, color: '#A78BFA' }}>开始玩 →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
