import { useRef, useEffect, useCallback } from 'react'

interface ReportData {
  title: string
  emoji: string
  score: number
  maxScore: number
  level: string
  color: string // 'mint' | 'lavender' | 'peach'
  description: string
  suggestions: string[]
  date: string
  nickname?: string
}

const COLOR_CONFIG = {
  mint:    { primary: '#10B981', light: '#D1FAE5', dark: '#065F46', gradient1: '#6EE7B7', gradient2: '#10B981' },
  lavender:{ primary: '#8B5CF6', light: '#EDE9FE', dark: '#4C1D95', gradient1: '#C4B5FD', gradient2: '#8B5CF6' },
  peach:   { primary: '#F472B6', light: '#FCE7F3', dark: '#9D174D', gradient1: '#F9A8D4', gradient2: '#EC4899' },
} as const

const W = 750
const H = 960

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, line?: string[]): string[] {
  const lines = line || []
  let current = ''
  for (let i = 0; i < text.length; i++) {
    const test = current + text[i]
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = text[i]
    } else {
      current = test
    }
  }
  lines.push(current)
  return lines
}

function drawReportCard(canvas: HTMLCanvasElement, data: ReportData) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const colors = COLOR_CONFIG[data.color as keyof typeof COLOR_CONFIG] || COLOR_CONFIG.lavender

  // Clear
  ctx.clearRect(0, 0, W, H)

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, W, H)
  bgGrad.addColorStop(0, '#FAFAFE')
  bgGrad.addColorStop(1, colors.light + '40')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  // Decorative circles
  ctx.globalAlpha = 0.08
  ctx.fillStyle = colors.primary
  ctx.beginPath(); ctx.arc(-50, -50, 200, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(W + 80, H - 100, 250, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 0.05
  ctx.beginPath(); ctx.arc(W * 0.7, 200, 150, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1

  // Header bar
  const headerH = 100
  const headerGrad = ctx.createLinearGradient(0, 0, W, headerH)
  headerGrad.addColorStop(0, colors.gradient1)
  headerGrad.addColorStop(1, colors.gradient2)
  ctx.fillStyle = headerGrad
  roundRect(ctx, 0, 0, W, headerH, 0, 0, 32, 32)
  ctx.fill()

  // Header text
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 22px "Noto Sans SC", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('心晴驿站 · 心理测评报告', W / 2, 42)
  ctx.font = '14px "Noto Sans SC", sans-serif'
  ctx.globalAlpha = 0.8
  ctx.fillText('MindEase Assessment Report', W / 2, 68)
  ctx.globalAlpha = 1

  // Card body
  const cardY = 120
  const cardX = 30
  const cardW = W - 60
  const cardR = 24

  // White card background
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowColor = 'rgba(0,0,0,0.06)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 8
  roundRect(ctx, cardX, cardY, cardW, H - cardY - 30, cardR, cardR, cardR, cardR)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  // Assessment title + emoji
  let y = cardY + 50
  ctx.font = '40px serif'
  ctx.textAlign = 'center'
  ctx.fillText(data.emoji, W / 2, y)

  y += 35
  ctx.font = 'bold 26px "Noto Sans SC", sans-serif'
  ctx.fillStyle = '#1F2937'
  ctx.fillText(data.title, W / 2, y)

  y += 28
  ctx.font = '13px "Noto Sans SC", sans-serif'
  ctx.fillStyle = '#9CA3AF'
  const fmtDate = data.date ? (() => {
    const d = new Date(data.date)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  })() : ''
  ctx.fillText(fmtDate, W / 2, y)

  // Score circle
  y += 50
  const cx = W / 2
  const radius = 65
  const pct = data.maxScore > 0 ? data.score / data.maxScore : 0

  // Background circle
  ctx.beginPath()
  ctx.arc(cx, y, radius, 0, Math.PI * 2)
  ctx.strokeStyle = '#F3F4F6'
  ctx.lineWidth = 10
  ctx.stroke()

  // Progress arc
  ctx.beginPath()
  ctx.arc(cx, y, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct)
  ctx.strokeStyle = colors.primary
  ctx.lineWidth = 10
  ctx.lineCap = 'round'
  ctx.stroke()
  ctx.lineCap = 'butt'

  // Score text
  ctx.fillStyle = colors.primary
  ctx.font = 'bold 42px "Noto Sans SC", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(data.score), cx, y - 6)
  ctx.font = '16px "Noto Sans SC", sans-serif'
  ctx.fillStyle = '#9CA3AF'
  ctx.fillText(`/ ${data.maxScore}`, cx, y + 22)
  ctx.textBaseline = 'alphabetic'

  // Level badge
  y += radius + 30
  const levelWidth = ctx.measureText(data.level).width + 40
  ctx.fillStyle = colors.light
  const badgeW = Math.max(levelWidth, 80)
  roundRect(ctx, (W - badgeW) / 2, y - 14, badgeW, 32, 16, 16, 16, 16)
  ctx.fill()
  ctx.font = 'bold 15px "Noto Sans SC", sans-serif'
  ctx.fillStyle = colors.dark
  ctx.fillText(data.level, W / 2, y + 6)

  // Description
  y += 40
  const descLines = wrapText(ctx, data.description, cardW - 80)
  ctx.font = '14px "Noto Sans SC", sans-serif'
  ctx.fillStyle = '#4B5563'
  descLines.forEach(line => {
    ctx.fillText(line, W / 2, y)
    y += 22
  })

  // Suggestions
  y += 16
  ctx.font = 'bold 15px "Noto Sans SC", sans-serif'
  ctx.fillStyle = '#374151'
  ctx.fillText('个性化建议', W / 2, y)
  y += 24

  const sugX = cardX + 45
  const sugW = cardW - 90
  data.suggestions.forEach((s, i) => {
    ctx.font = 'bold 13px "Noto Sans SC", sans-serif'
    ctx.fillStyle = colors.primary
    ctx.textAlign = 'left'
    ctx.fillText(`${i + 1}.`, sugX, y)

    ctx.font = '13px "Noto Sans SC", sans-serif'
    ctx.fillStyle = '#6B7280'
    const lines = wrapText(ctx, s, sugW - 24)
    lines.forEach((line, li) => {
      ctx.fillText(line, sugX + 18, y + li * 20)
    })
    y += lines.length * 20 + 8
  })

  // Divider
  y += 8
  ctx.strokeStyle = '#F3F4F6'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(sugX, y)
  ctx.lineTo(W - sugX, y)
  ctx.stroke()

  // Footer
  y += 24
  ctx.font = '11px "Noto Sans SC", sans-serif'
  ctx.fillStyle = '#D1D5DB'
  ctx.textAlign = 'center'
  ctx.fillText('本测评仅用于日常自我觉察，不能替代专业心理评估', W / 2, y)
  y += 18
  ctx.fillText('全国心理援助热线：400-161-9995（24 小时）', W / 2, y)
  y += 24
  ctx.fillStyle = colors.primary
  ctx.font = 'bold 12px "Noto Sans SC", sans-serif'
  ctx.fillText('心晴驿站 MindEase · 关注你的心理健康', W / 2, y)
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, tl: number, tr: number, br: number, bl: number) {
  ctx.beginPath()
  ctx.moveTo(x + tl, y)
  ctx.lineTo(x + w - tr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr)
  ctx.lineTo(x + w, y + h - br)
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h)
  ctx.lineTo(x + bl, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl)
  ctx.lineTo(x, y + tl)
  ctx.quadraticCurveTo(x, y, x + tl, y)
  ctx.closePath()
}

interface AssessmentReportCardProps {
  data: ReportData
  visible: boolean
  onClose: () => void
}

export default function AssessmentReportCard({ data, visible, onClose }: AssessmentReportCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (visible && canvasRef.current) {
      // Need to wait for fonts to load
      const timer = setTimeout(() => {
        drawReportCard(canvasRef.current!, data)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [visible, data])

  const handleSave = useCallback(() => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `心晴驿站-${data.title}-测评报告.png`
    link.href = canvasRef.current.toDataURL('image/png', 1.0)
    link.click()
  }, [data.title])

  const handleShare = useCallback(async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob | null>(resolve =>
        canvasRef.current!.toBlob(resolve, 'image/png', 1.0)
      )
      if (!blob) return
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `心晴驿站-${data.title}-测评报告.png`, { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `心晴驿站 · ${data.title}`,
            text: `我在心晴驿站完成了「${data.title}」测评，得分 ${data.score}/${data.maxScore}，结果：${data.level}`,
            files: [file],
          })
          return
        }
      }
      // Fallback: copy to clipboard or download
      handleSave()
    } catch {
      handleSave()
    }
  }, [data, handleSave])

  if (!visible) return null

  const colors = COLOR_CONFIG[data.color as keyof typeof COLOR_CONFIG] || COLOR_CONFIG.lavender

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={onClose}>
      <div style={{
        maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto',
        background: '#fff', borderRadius: 24, padding: 20,
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        animation: 'fadeIn 0.3s ease',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#374151', margin: 0 }}>📋 测评报告卡片</h3>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none',
            background: '#F3F4F6', cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 16, border: `1px solid ${colors.light}` }}>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: '14px 0', borderRadius: 14, border: 'none',
            background: `linear-gradient(135deg, ${colors.gradient1}, ${colors.gradient2})`,
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: `0 4px 16px ${colors.primary}33`,
          }}>
            📥 保存图片
          </button>
          <button onClick={handleShare} style={{
            flex: 1, padding: '14px 0', borderRadius: 14,
            border: `1.5px solid ${colors.primary}`,
            background: 'transparent', color: colors.primary,
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}>
            📤 分享
          </button>
        </div>
      </div>
    </div>
  )
}
