import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white/60 backdrop-blur-sm border-t border-lavender-100/50 mt-20">
      {/* Crisis Banner - Most Prominent */}
      <div className="bg-red-50 border-b border-red-100">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center justify-center flex-wrap gap-4 text-sm">
            <span className="font-medium text-red-700">如果你或身边的人正处于心理危机：</span>
            <span className="px-3 py-1 bg-white rounded-full text-red-600 font-medium border border-red-200">
              📞 24h 全国心理援助热线 400-161-9995
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-red-600 font-medium border border-red-200">
              📞 010-82951332
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-red-600 font-medium border border-red-200">
              📞 共青团 12355
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌤</span>
              <span className="font-display text-xl text-gray-800">心晴驿站</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              给心灵放个假。这里是属于年轻人的心理健康小站，
              愿你在忙碌的生活中找到一片宁静。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">探索</h3>
            <div className="flex flex-col gap-2">
              <Link to="/articles" className="text-sm text-gray-400 hover:text-lavender-500 transition-colors">心理文章</Link>
              <Link to="/assessment" className="text-sm text-gray-400 hover:text-lavender-500 transition-colors">情绪测评</Link>
              <Link to="/relax" className="text-sm text-gray-400 hover:text-lavender-500 transition-colors">放松工具</Link>
              <Link to="/mood-diary" className="text-sm text-gray-400 hover:text-lavender-500 transition-colors">情绪日记</Link>
              <Link to="/treehole" className="text-sm text-gray-400 hover:text-lavender-500 transition-colors">树洞倾诉</Link>
              <Link to="/games" className="text-sm text-gray-400 hover:text-lavender-500 transition-colors">放松游戏</Link>
              <Link to="/about" className="text-sm text-gray-400 hover:text-lavender-500 transition-colors">关于我们</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">心理援助热线</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <p>全国心理援助热线：<strong className="text-gray-600">400-161-9995</strong>（24h）</p>
              <p>北京心理危机干预中心：<strong className="text-gray-600">010-82951332</strong>（24h）</p>
              <p>生命热线：<strong className="text-gray-600">400-821-1215</strong></p>
              <p>希望24热线：<strong className="text-gray-600">400-161-9995</strong></p>
              <p>共青团心理咨询热线：<strong className="text-gray-600">12355</strong></p>
            </div>
          </div>
        </div>

        {/* Disclaimer - Prominent */}
        <div className="mt-10 p-5 bg-amber-50/80 border border-amber-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div className="text-sm text-amber-700 leading-relaxed">
              <strong>重要声明：</strong>
              本站所有内容（包括文章、测评、放松工具等）仅供心理健康科普和日常自我觉察参考，
              <strong>不能替代专业心理咨询、诊断或治疗</strong>。
              本站测评基于简化版量表，结果不具备临床诊断效力。
              如果你正经历持续的情绪低落、焦虑、失眠、自我伤害念头等严重心理困扰超过两周，
              请务必前往<strong>正规医院心理科/精神科</strong>就诊，或拨打上方心理援助热线寻求专业帮助。
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-lavender-100/50">
          <p className="text-center text-xs text-gray-300">
            心晴驿站 MindEase · 用温暖守护每一颗年轻的心
          </p>
        </div>
      </div>
    </footer>
  )
}
