import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { assessments } from '../data/assessments'

type Phase = 'select' | 'quiz' | 'result'

export default function Assessment() {
  const [searchParams] = useSearchParams()
  const preselected = searchParams.get('type')

  const [phase, setPhase] = useState<Phase>(preselected ? 'quiz' : 'select')
  const [activeType, setActiveType] = useState(preselected || '')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [totalScore, setTotalScore] = useState(0)

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

    // Auto advance after short delay
    setTimeout(() => {
      if (assessment && currentQ < assessment.questions.length - 1) {
        setCurrentQ((prev) => prev + 1)
      } else {
        setPhase('result')
      }
    }, 400)
  }

  const restart = () => {
    setPhase('select')
    setCurrentQ(0)
    setAnswers({})
    setTotalScore(0)
  }

  const colorMap: Record<string, { bg: string; text: string; border: string; light: string }> = {
    mint: { bg: 'bg-mint-100', text: 'text-mint-500', border: 'border-mint-200', light: 'bg-mint-50' },
    lavender: { bg: 'bg-lavender-100', text: 'text-lavender-500', border: 'border-lavender-200', light: 'bg-lavender-50' },
    peach: { bg: 'bg-peach-100', text: 'text-peach-500', border: 'border-peach-200', light: 'bg-peach-50' },
  }

  // Select Phase
  if (phase === 'select') {
    return (
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl text-gray-800 mb-3">情绪测评</h1>
          <p className="text-gray-500 text-lg mb-12 max-w-2xl">
            通过简短的测评了解自己的心理状态，获取个性化的建议。测评结果仅供参考，不构成专业诊断。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assessments.map((a) => (
              <button
                key={a.id}
                onClick={() => startQuiz(a.id)}
                className="glass-card p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-left"
              >
                <span className="text-4xl block mb-4">{a.emoji}</span>
                <h3 className="font-medium text-gray-800 text-lg mb-2">{a.title}</h3>
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

  // Quiz Phase
  if (phase === 'quiz' && assessment) {
    const question = assessment.questions[currentQ]
    const progress = ((currentQ + 1) / assessment.questions.length) * 100

    return (
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
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

          {/* Question */}
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
                        : 'bg-white/60 text-gray-600 border-lavender-100 hover:border-lavender-300 hover:bg-lavender-50'
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

  // Result Phase
  if (phase === 'result' && assessment) {
    const result = assessment.getResult(totalScore)
    const maxScore = assessment.questions.length * 3
    const percentage = Math.round((totalScore / maxScore) * 100)
    const colors = colorMap[result.color]

    return (
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center animate-fade-up" style={{ opacity: 0 }}>
            {/* Score Visualization */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#EDE9FE" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke={result.color === 'mint' ? '#6EE7B7' : result.color === 'lavender' ? '#A78BFA' : '#FDA4AF'}
                  strokeWidth="10"
                  strokeDasharray={`${percentage * 3.14} ${314 - percentage * 3.14}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{totalScore}</span>
                <span className="text-xs text-gray-400">/ {maxScore}</span>
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
              <h3 className="font-medium text-gray-800 mb-4">个性化建议</h3>
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
              <Link to="/relax" className="btn-primary">
                试试放松工具
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-300">
              本测评仅供参考，不构成专业心理诊断。如需专业帮助，请联系心理咨询师。
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
