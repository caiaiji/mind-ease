import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { assessments } from '../data/assessments'
import AssessmentReportCard from '../components/AssessmentReportCard'

type Phase = 'select' | 'quiz' | 'result' | 'history'

interface HistoryRecord {
  id: string
  assessmentId: string
  assessmentTitle: string
  assessmentEmoji: string
  score: number
  maxScore: number
  level: string
  description: string
  date: string
  userEmail?: string
}

const HISTORY_KEY = 'mindease-assessment-history'
const MAX_HISTORY = 50

function loadHistory(): HistoryRecord[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') }
  catch { return [] }
}

function saveHistory(records: HistoryRecord[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
}

export default function Assessment() {
  const [searchParams] = useSearchParams()
  const preselected = searchParams.get('type')
  const { user, isLogin } = useUser()

  const [phase, setPhase] = useState<Phase>(preselected ? 'quiz' : 'select')
  const [activeType, setActiveType] = useState(preselected || '')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [totalScore, setTotalScore] = useState(0)
  const [history, setHistory] = useState<HistoryRecord[]>(loadHistory)
  const [showReport, setShowReport] = useState(false)

  const assessment = useMemo(
    () => assessments.find((a) => a.id === activeType),
    [activeType]
  )

  const startQuiz = (typeId: string) => {
    setActiveType(typeId)
    setCurrentQ(0)
    setAnswers({})
    setTotalScore(0)
    setPhase('quiz')
  }

  const handleAnswer = (questionId: number, score: number) => {
    const newAnswers = { ...answers, [questionId]: score }
    setAnswers(newAnswers)
    const newTotal = Object.values(newAnswers).reduce((sum, s) => sum + s, 0)
    setTotalScore(newTotal)

    setTimeout(() => {
      if (assessment && currentQ < assessment.questions.length - 1) {
        setCurrentQ((prev) => prev + 1)
      } else {
        setPhase('result')
      }
    }, 400)
  }

  const saveResult = () => {
    if (!assessment) return
    const result = assessment.getResult(totalScore)
    const maxScore = assessment.questions.length * 3
    const record: HistoryRecord = {
      id: 'ar_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      assessmentEmoji: assessment.emoji,
      score: totalScore,
      maxScore,
      level: result.level,
      description: result.description,
      date: new Date().toISOString(),
      userEmail: user?.email,
    }
    const records = [record, ...loadHistory()].slice(0, MAX_HISTORY)
    saveHistory(records)
    setHistory(records)
  }

  const deleteRecord = (id: string) => {
    const records = loadHistory().filter(r => r.id !== id)
    saveHistory(records)
    setHistory(records)
  }

  const restart = () => {
    setPhase('select')
    setCurrentQ(0)
    setAnswers({})
    setTotalScore(0)
  }

  const colorMap: Record<string, { bg: string; text: string; border: string; light: string; hex: string }> = {
    mint: { bg: 'bg-mint-100', text: 'text-mint-500', border: 'border-mint-200', light: 'bg-mint-50', hex: '#10B981' },
    lavender: { bg: 'bg-lavender-100', text: 'text-lavender-500', border: 'border-lavender-200', light: 'bg-lavender-50', hex: '#8B5CF6' },
    peach: { bg: 'bg-peach-100', text: 'text-peach-500', border: 'border-peach-200', light: 'bg-peach-50', hex: '#F472B6' },
  }

  // Format date
  const fmtDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }

  // ===== SELECT PHASE =====
  if (phase === 'select') {
    return (
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl text-gray-800 dark:text-gray-100 mb-3">情绪测评</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2 max-w-2xl">
            通过简短的测评了解自己的心理状态，获取个性化建议。
          </p>
          <Link to="/assessment-guide" className="text-sm text-lavender-500 hover:text-lavender-600 transition-colors mb-4 inline-block">
            测评结果准吗？了解本站量表与医院量表的区别 →
          </Link>

          {/* Disclaimer Banner */}
          <div className="mb-10 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex items-start gap-3">
            <span className="text-xl flex-shrink-0 mt-0.5">⚠️</span>
            <div className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
              <strong>重要提示：</strong>本测评仅用于日常自我觉察，基于简化版量表，结果<strong>不能作为心理诊断依据</strong>。
              如果你正在经历持续的情绪低落、焦虑或自我伤害倾向，请立即联系专业心理咨询师或拨打
              <strong>全国心理援助热线：400-161-9995</strong>（24 小时）。
              <Link to="/assessment-guide" className="block mt-2 text-lavender-600 hover:text-lavender-700 transition-colors underline">
                不确定测评结果是否靠谱？了解自测量表与医院量表的区别
              </Link>
            </div>
          </div>

          {/* History Entry */}
          {history.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-gray-700 dark:text-gray-300">历史测评记录</h2>
                <button
                  onClick={() => setPhase('history')}
                  className="text-sm text-lavender-500 hover:text-lavender-600 transition-colors"
                >
                  查看全部（{history.length} 条）→
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {history.slice(0, 4).map(r => (
                  <div key={r.id} className="flex-shrink-0 p-4 bg-white/80 dark:bg-gray-800/80 border border-lavender-100/50 dark:border-gray-700/50 rounded-2xl min-w-[180px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{r.assessmentEmoji}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{r.assessmentTitle}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-800 dark:text-gray-100">{r.score}<span className="text-xs text-gray-400 font-normal">/{r.maxScore}</span></div>
                    <div className="text-xs text-lavender-500 dark:text-lavender-400 mt-1">{r.level}</div>
                    <div className="text-xs text-gray-300 dark:text-gray-600 mt-2">{fmtDate(r.date)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assessments.map((a) => (
              <button
                key={a.id}
                onClick={() => startQuiz(a.id)}
                className="glass-card p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-left"
              >
                <span className="text-4xl block mb-4">{a.emoji}</span>
                <h3 className="font-medium text-gray-800 dark:text-gray-100 text-lg mb-2">{a.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{a.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">{a.questions.length} 道题</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[a.getResult(0).color].light} ${colorMap[a.getResult(0).color].text}`}>
                    开始测评
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ===== QUIZ PHASE =====
  if (phase === 'quiz' && assessment) {
    const question = assessment.questions[currentQ]
    const progress = ((currentQ + 1) / assessment.questions.length) * 100

    return (
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <button onClick={restart} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                ← 返回
              </button>
              <span className="text-sm text-gray-400">
                {currentQ + 1} / {assessment.questions.length}
              </span>
            </div>
            <div className="h-2 bg-lavender-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-lavender-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-center mb-10 animate-fade-in" key={currentQ}>
            <span className="text-3xl block mb-6">{assessment.emoji}</span>
            <h2 className="font-display text-xl md:text-2xl text-gray-800 mb-8">
              {question.text}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((option, idx) => {
                const isSelected = answers[question.id] === option.score
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(question.id, option.score)}
                    className={`p-4 rounded-2xl text-sm font-medium transition-all duration-300 border-2 ${
                      isSelected
                        ? 'bg-lavender-400 text-white border-lavender-400 shadow-lg scale-95'
                        : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 border-lavender-100 dark:border-gray-700 hover:border-lavender-300 dark:hover:border-lavender-600 hover:bg-lavender-50 dark:hover:bg-lavender-950/50'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ===== HISTORY PHASE =====
  if (phase === 'history') {
    return (
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setPhase('select')} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← 返回测评
            </button>
            <h1 className="font-display text-2xl md:text-3xl text-gray-800 dark:text-gray-100">测评历史记录</h1>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-20 text-gray-300 dark:text-gray-600">
              <span className="text-5xl block mb-4">📋</span>
              <p>暂无测评记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(r => {
                const a = assessments.find(x => x.id === r.assessmentId)
                const colors = a ? colorMap[a.getResult(0).color] : colorMap.lavender
                const pct = Math.round((r.score / r.maxScore) * 100)
                return (
                  <div key={r.id} className="glass-card p-5 flex items-center gap-5">
                    <span className="text-3xl flex-shrink-0">{r.assessmentEmoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-gray-800">{r.assessmentTitle}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.light} ${colors.text}`}>
                          {r.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">得分：{r.score}/{r.maxScore}（{pct}%）</span>
                        <span className="text-gray-300 dark:text-gray-600">{fmtDate(r.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={() => { startQuiz(r.assessmentId) }}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-lavender-50 text-lavender-500 hover:bg-lavender-100 transition-colors"
                      >
                        重新测评
                      </button>
                      <button
                        onClick={() => deleteRecord(r.id)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {history.length > 5 && (
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  if (confirm('确定清空所有测评历史记录？')) {
                    saveHistory([])
                    setHistory([])
                  }
                }}
                className="text-sm text-red-400 dark:text-red-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                清空所有记录
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }


  // Auto-save result when entering result phase
  useEffect(() => {
    if (phase === 'result' && assessment) {
      saveResult()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])
  // ===== RESULT PHASE =====
  if (phase === 'result' && assessment) {
    const result = assessment.getResult(totalScore)
    const maxScore = assessment.questions.length * 3
    const percentage = Math.round((totalScore / maxScore) * 100)
    const colors = colorMap[result.color]


    const isHighRisk = percentage >= 70

    return (
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* High Risk Warning */}
          {isHighRisk && (
            <div className="mb-6 p-5 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800/50 rounded-2xl">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🆘</span>
                <div>
                  <h3 className="font-bold text-red-700 dark:text-red-400 mb-1">需要关注</h3>
                  <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed mb-3">
                    你的测评结果显示可能存在较高的心理压力。请注意，这不是诊断结果，
                    但建议你关注自己的情绪状态。
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-red-700 font-medium">请立即拨打以下热线获取专业帮助：</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-red-600 border border-red-200">
                        📞 400-161-9995（24h）
                      </span>
                      <span className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-red-600 border border-red-200">
                        📞 010-82951332（24h）
                      </span>
                      <span className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-red-600 border border-red-200">
                        📞 12355 青年热线
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="glass-card p-8 md:p-12 text-center animate-fade-up" style={{ opacity: 0 }}>
            {/* Score Visualization */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#EDE9FE" strokeWidth="10" className="dark:stroke-gray-700" />
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke={colors.hex}
                  strokeWidth="10"
                  strokeDasharray={`${percentage * 3.14} ${314 - percentage * 3.14}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalScore}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">/ {maxScore}</span>
              </div>
            </div>

            {/* Result */}
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${colors.bg} ${colors.text}`}>
              {result.level}
            </div>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-lg mx-auto">
              {result.description}
            </p>

            {/* Suggestions */}
            <div className="text-left max-w-lg mx-auto">
              <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-4">个性化建议</h3>
              <div className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <div key={i} className={`p-4 rounded-2xl ${colors.light}`}>
                    <span className={`text-sm ${colors.text} font-medium`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button onClick={() => startQuiz(activeType)} className="btn-soft">
                重新测评
              </button>
              <button onClick={() => setPhase('history')} className="btn-soft">
                查看历史记录
              </button>
              <Link to="/relax" className="btn-primary">
                试试放松工具
              </Link>
              <button
                onClick={() => setShowReport(true)}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #F472B6, #8B5CF6)',
                  boxShadow: '0 4px 16px rgba(139,92,246,0.3)',
                  border: 'none', cursor: 'pointer',
                }}
              >
                📋 生成报告卡片
              </button>
            </div>
          </div>

          {/* Enhanced Disclaimer */}
          <div className="mt-8 p-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl">
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <div className="text-sm text-amber-700 leading-relaxed">
                <strong>专业免责声明：</strong>本测评基于简化版心理量表，仅供日常自我觉察参考，
                <strong>不能替代专业心理评估或诊断</strong>。测评结果不构成任何心理健康问题的诊断依据。
                如你正经历持续的情绪困扰（超过两周的抑郁、焦虑、失眠等），请务必前往正规医院心理科或精神科就诊，
                或拨打<strong>全国心理援助热线 400-161-9995</strong>获取专业支持。
              </div>
            </div>
          </div>

          {/* Result saved notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-300 dark:text-gray-600">
              {isLogin ? `测评结果已自动保存（${user?.nickname}）` : '登录后测评结果将自动保存，方便追踪情绪变化'}
            </p>
          </div>

          {/* Report Card Modal */}
          <AssessmentReportCard
            visible={showReport}
            onClose={() => setShowReport(false)}
            data={{
              title: assessment.title,
              emoji: assessment.emoji,
              score: totalScore,
              maxScore,
              level: result.level,
              color: result.color,
              description: result.description,
              suggestions: result.suggestions,
              date: new Date().toISOString(),
              nickname: user?.nickname,
            }}
          />
        </div>
      </div>
    )
  }

  return null
}
