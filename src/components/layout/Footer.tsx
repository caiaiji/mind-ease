import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white/60 backdrop-blur-sm border-t border-lavender-100/50 mt-20">
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
              <Link to="/articles" className="text-sm text-gray-400 hover:text-lavender-500 transition-colors">
                心理文章
              </Link>
              <Link to="/assessment" className="text-sm text-gray-400 hover:text-lavender-500 transition-colors">
                情绪测评
              </Link>
              <Link to="/relax" className="text-sm text-gray-400 hover:text-lavender-500 transition-colors">
                放松工具
              </Link>
              <Link to="/about" className="text-sm text-gray-400 hover:text-lavender-500 transition-colors">
                关于我们
              </Link>
              <Link to="/games" className="text-sm text-gray-400 hover:text-lavender-500 transition-colors">
                放松游戏
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">心理健康资源</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <p>全国心理援助热线：400-161-9995</p>
              <p>北京心理危机研究与干预中心：010-82951332</p>
              <p>生命热线：400-821-1215</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-lavender-100/50">
          <p className="text-center text-xs text-gray-300">
            本站内容仅供参考，不构成专业心理咨询或诊断建议。如有严重心理困扰，请及时寻求专业帮助。
          </p>
        </div>
      </div>
    </footer>
  )
}
