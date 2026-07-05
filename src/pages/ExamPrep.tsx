import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Link } from 'react-router-dom'
import { dark } from '../contexts/ThemeContext'

const STRATEGIES = [
  {
    emoji: '🧘',
    title: '考前焦虑急救',
    tips: [
      { label: '4-7-8 呼吸法', desc: '吸气4秒，屏息7秒，呼气8秒。重复3-5次可快速降低心率' },
      { label: '渐进性肌肉放松', desc: '从脚趾开始，逐个绷紧再放松肌肉群，15分钟完成全身放松' },
      { label: '5-4-3-2-1 感官法', desc: '说出5个看到的、4个触到的、3个听到的、2个闻到的、1个尝到的事物' },
      { label: '蝴蝶拍', desc: '双臂交叉抱胸，交替轻拍肩膀，配合深呼吸，60秒可恢复平静' },
    ],
  },
  {
    emoji: '📚',
    title: '科学备考策略',
    tips: [
      { label: '番茄工作法', desc: '25分钟专注学习 + 5分钟休息，每4个番茄钟休息15-30分钟' },
      { label: '费曼学习法', desc: '学完一个知识点后，尝试用简单语言讲给完全不懂的人听' },
      { label: '间隔重复', desc: '不要考前突击，每天复习一遍，间隔逐渐拉长（1天→3天→7天→14天）' },
      { label: '主动回忆', desc: '合上书本，试着回忆刚学的内容，比反复阅读效果强3倍' },
    ],
  },
  {
    emoji: '🌙',
    title: '考前夜调整',
    tips: [
      { label: '固定就寝时间', desc: '考前一晚保证7-8小时睡眠，不要熬夜复习——睡眠中大脑会整合记忆' },
      { label: '避免咖啡因', desc: '下午2点后不喝咖啡/茶/奶茶，咖啡因半衰期5-6小时，影响深睡眠' },
      { label: '整理考试用品', desc: '提前准备好文具、证件、水杯，减少第二天忙乱带来的焦虑' },
      { label: '不看手机入睡', desc: '睡前30分钟放下手机，蓝光会抑制褪黑素分泌，影响入睡质量' },
    ],
  },
  {
    emoji: '💪',
    title: '考场心态调整',
    tips: [
      { label: '先易后难', desc: '遇到难题先跳过，做完简单的再回头。积累答题信心很重要' },
      { label: '合理分配时间', desc: '按分值分配时间，不要在某道题上耗太多时间' },
      { label: '接纳紧张', desc: '适度紧张是正常的，说明你在乎。告诉自己"紧张 = 身体在帮我集中注意力"' },
      { label: '遇到不会的题', desc: '深呼吸3次，写下所有相关的公式或思路，往往写着写着就想起来了' },
    ],
  },
]

const QUICK_TIPS = [
  { emoji: '🎵', text: '考前听白噪音或轻音乐，帮助集中注意力' },
  { emoji: '💧', text: '考试前喝一杯温水，轻度脱水会降低认知能力' },
  { emoji: '🏃', text: '考前30分钟散步或轻度拉伸，促进血液循环和大脑供氧' },
  { emoji: '🍬', text: '备一颗巧克力或薄荷糖，低血糖时快速补充能量' },
  { emoji: '✏️', text: '考前最后复习：只看错题本和高频考点，不碰新内容' },
  { emoji: '🗣️', text: '进考场前，对自己说三遍"我已经准备好了"' },
]

const AFFIRMATIONS = [
  '我已经尽了最大努力，无论结果如何都值得肯定',
  '紧张是正常的，它说明我在乎这次考试',
  '我准备好了，我有能力应对这场考试',
  '成绩不能定义我，我的价值远超一张试卷',
  '一步一步来，一道一道做，我能做到',
]

export default function ExamPrep() {
    useDocumentTitle('考前减压')

  const dk = dark
  const s = {
    page: {
      minHeight: '100vh', padding: '100px 16px 60px', maxWidth: 640, margin: '0 auto',
      fontFamily: '"Noto Sans SC", sans-serif',
    } as React.CSSProperties,
    hero: {
      textAlign: 'center' as const, marginBottom: 32, padding: '24px 0',
    } as React.CSSProperties,
    heroEmoji: { fontSize: 56, display: 'block', marginBottom: 10 } as React.CSSProperties,
    title: {
      fontSize: 28, fontWeight: 700, color: dk('#374151', '#f3f4f6'),
      marginBottom: 6, fontFamily: '"ZCOOL XiaoWei", serif',
    } as React.CSSProperties,
    subtitle: { fontSize: 14, color: dk('#9CA3AF', '#6B7280'), lineHeight: 1.6 } as React.CSSProperties,
    card: {
      background: dk('rgba(255,255,255,0.8)', 'rgba(40,40,70,0.8)'),
      backdropFilter: 'blur(20px)', borderRadius: 24, padding: '24px 20px', marginBottom: 20,
      border: `1px solid ${dk('rgba(167,139,250,0.15)', 'rgba(139,92,246,0.2)')}`,
      boxShadow: `0 8px 32px ${dk('rgba(139,92,246,0.06)', 'rgba(0,0,0,0.2)')}`,
    } as React.CSSProperties,
    sectionTitle: {
      fontSize: 16, fontWeight: 600, color: dk('#374151', '#f3f4f6'),
      marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
    } as React.CSSProperties,
    tipCard: {
      padding: '14px 16px', borderRadius: 16, marginBottom: 10,
      background: dk('rgba(139,92,246,0.03)', 'rgba(139,92,246,0.08)'),
      border: `1px solid ${dk('rgba(167,139,250,0.1)', 'rgba(139,92,246,0.15)')}`,
    } as React.CSSProperties,
    tipTitle: {
      fontSize: 14, fontWeight: 600, color: dk('#7C3AED', '#A78BFA'), marginBottom: 4,
    } as React.CSSProperties,
    tipDesc: {
      fontSize: 13, color: dk('#6B7280', '#9CA3AF'), lineHeight: 1.5,
    } as React.CSSProperties,
    quickTip: {
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '12px 14px', borderRadius: 14,
      background: dk('rgba(255,255,255,0.6)', 'rgba(50,50,80,0.6)'),
      marginBottom: 8,
    } as React.CSSProperties,
    quickTipEmoji: { fontSize: 18, flexShrink: 0 } as React.CSSProperties,
    quickTipText: { fontSize: 13, color: dk('#374151', '#f3f4f6'), lineHeight: 1.5 } as React.CSSProperties,
    affirmationCard: {
      padding: '18px 20px', borderRadius: 16, marginBottom: 10,
      background: 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(110,231,183,0.08))',
      border: `1px solid ${dk('rgba(167,139,250,0.15)', 'rgba(139,92,246,0.2)')}`,
    } as React.CSSProperties,
    affirmationText: {
      fontSize: 14, color: dk('#374151', '#f3f4f6'), lineHeight: 1.6,
      fontStyle: 'italic' as const,
    } as React.CSSProperties,
    ctaCard: {
      background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(110,231,183,0.06))',
      borderRadius: 20, padding: '24px 20px', textAlign: 'center' as const,
      border: `1px solid ${dk('rgba(167,139,250,0.15)', 'rgba(139,92,246,0.2)')}`,
    } as React.CSSProperties,
    ctaText: { fontSize: 14, color: dk('#6B7280', '#9CA3AF'), marginBottom: 16, lineHeight: 1.6 } as React.CSSProperties,
    ctaBtn: {
      display: 'inline-block', padding: '12px 32px', borderRadius: 14,
      background: 'linear-gradient(135deg, #A78BFA, #6EE7B7)', color: '#fff',
      fontSize: 15, fontWeight: 700, textDecoration: 'none',
      boxShadow: '0 4px 16px rgba(139,92,246,0.2)',
    } as React.CSSProperties,
    disclaimer: {
      fontSize: 12, color: dk('#D1D5DB', '#4B5563'), textAlign: 'center' as const,
      padding: '16px 0 0', lineHeight: 1.5,
    } as React.CSSProperties,
  }

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <span style={s.heroEmoji}>🎯</span>
        <h1 style={s.title}>考前心理准备指南</h1>
        <p style={s.subtitle}>考前紧张是正常的，科学准备帮助你以最佳状态迎接挑战</p>
      </div>

      {/* 4 Strategy Sections */}
      {STRATEGIES.map((section, si) => (
        <div key={si} style={s.card}>
          <h2 style={s.sectionTitle}>{section.emoji} {section.title}</h2>
          {section.tips.map((tip, ti) => (
            <div key={ti} style={s.tipCard}>
              <div style={s.tipTitle}>{tip.label}</div>
              <div style={s.tipDesc}>{tip.desc}</div>
            </div>
          ))}
        </div>
      ))}

      {/* Quick Tips */}
      <div style={s.card}>
        <h2 style={s.sectionTitle}>⚡ 考前速记小贴士</h2>
        {QUICK_TIPS.map((tip, i) => (
          <div key={i} style={s.quickTip}>
            <span style={s.quickTipEmoji}>{tip.emoji}</span>
            <span style={s.quickTipText}>{tip.text}</span>
          </div>
        ))}
      </div>

      {/* Affirmations */}
      <div style={s.card}>
        <h2 style={s.sectionTitle}>🌟 给自己的话</h2>
        <p style={{ fontSize: 13, color: dk('#9CA3AF', '#6B7280'), marginBottom: 12 }}>
          考前紧张时，默念下面的话给自己力量：
        </p>
        {AFFIRMATIONS.map((text, i) => (
          <div key={i} style={s.affirmationCard}>
            <div style={s.affirmationText}>「{text}」</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={s.ctaCard}>
        <p style={s.ctaText}>
          感到压力时，试试我们的放松工具和情绪测评
        </p>
        <Link to="/relax" style={s.ctaBtn}>🧘 放松一下</Link>
        <div style={{ marginTop: 10 }}>
          <Link to="/assessment" style={{ fontSize: 13, color: '#7C3AED', textDecoration: 'none' }}>
            → 做一次焦虑自评，了解自己的状态
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={s.disclaimer}>
        本页面内容仅供参考，不构成专业心理咨询建议。<br />
        如需专业支持，请拨打 <strong>400-161-9995</strong>（24小时）
      </div>
    </div>
  )
}
