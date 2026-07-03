"""
Batch dark mode adaptation for all remaining Tailwind CSS pages.
Processes: Home, Articles, ArticleDetail, Assessment, AssessmentGuide, About, PrivacyPolicy, Header
"""
import os

BASE = r'C:\Users\GXQ\Documents\lingxi-claw\20260701-22-39-09-880\mind-ease\src'

def apply_all(text):
    """Common dark mode replacements that apply to most pages"""
    
    # === COMMON PATTERNS ===
    
    # Page titles
    text = text.replace('text-gray-800 mb-3">心理文章</h1>', 'text-gray-800 dark:text-gray-100 mb-3">心理文章</h1>')
    text = text.replace('text-gray-800 mb-3">情绪测评</h1>', 'text-gray-800 dark:text-gray-100 mb-3">情绪测评</h1>')
    text = text.replace('text-gray-800 mb-2">需要专业帮助？', 'text-gray-800 dark:text-gray-100 mb-2">需要专业帮助？')
    text = text.replace('text-gray-800 mb-4">\n              {article.title}', 'text-gray-800 dark:text-gray-100 mb-4">\n              {article.title}')
    text = text.replace('text-gray-800 mb-2">{item.title}</h3>', 'text-gray-800 dark:text-gray-100 mb-2">{item.title}</h3>')
    
    # Hero h1
    text = text.replace('text-4xl md:text-6xl text-gray-800 mb-6', 'text-4xl md:text-6xl text-gray-800 dark:text-gray-100 mb-6')
    
    # Hero subtitle
    text = text.replace('text-gray-500 max-w-2xl mx-auto mb-10', 'text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10')
    
    # bg-white/40 sections
    text = text.replace('py-16 bg-white/40"', 'py-16 bg-white/40 dark:bg-gray-900/40"')
    text = text.replace('py-12 bg-white/40"', 'py-12 bg-white/40 dark:bg-gray-900/40"')
    text = text.replace('py-16 bg-white/40 py-16"', 'py-16 bg-white/40 dark:bg-gray-900/40"')
    
    # Section titles (from index.css, but need dark text)
    text = text.replace('section-title mb-8">推荐阅读', 'section-title mb-8 dark:!text-gray-100">推荐阅读')
    
    # Crisis banner cards
    text = text.replace('px-4 py-2 bg-red-50 text-red-600 rounded-full', 'px-4 py-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full')
    text = text.replace('px-4 py-2 bg-lavender-50 text-lavender-600 rounded-full font-medium">\n                北京心理危机研究与干预中心',
                        'px-4 py-2 bg-lavender-50 dark:bg-lavender-950/40 text-lavender-600 dark:text-lavender-400 rounded-full font-medium">\n                北京心理危机研究与干预中心')
    text = text.replace('px-4 py-2 bg-mint-50 text-mint-600 rounded-full', 'px-4 py-2 bg-mint-50 dark:bg-mint-950/40 text-mint-600 dark:text-mint-400 rounded-full')
    
    # Assessment page-specific patterns
    text = text.replace('text-gray-500 text-lg mb-2 max-w-2xl"', 'text-gray-500 dark:text-gray-400 text-lg mb-2 max-w-2xl"')
    text = text.replace('mb-10 p-4 bg-amber-50 border border-amber-200 rounded-2xl', 'mb-10 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl')
    text = text.replace('text-sm text-amber-700 leading-relaxed">\n              <strong>重要提示', 
                        'text-sm text-amber-700 dark:text-amber-400 leading-relaxed">\n              <strong>重要提示')
    text = text.replace('font-medium text-gray-700">历史测评记录', 'font-medium text-gray-700 dark:text-gray-300">历史测评记录')
    text = text.replace('font-medium text-gray-800 text-lg mb-2">{a.title}', 'font-medium text-gray-800 dark:text-gray-100 text-lg mb-2">{a.title}')
    
    # Quiz phase
    text = text.replace('h2 bg-lavender-100"', 'h2 bg-lavender-100 dark:bg-lavender-900/40"')
    text = text.replace('font-medium text-gray-700">维度', 'font-medium text-gray-700 dark:text-gray-300">维度')
    text = text.replace('font-medium text-lavender-600">本站自测量表', 'font-medium text-lavender-600 dark:text-lavender-400">本站自测量表')
    text = text.replace('font-medium text-gray-600">医院专业量表', 'font-medium text-gray-600 dark:text-gray-400">医院专业量表')
    text = text.replace('border-b border-gray-100 last:border-0"', 'border-b border-gray-100 dark:border-gray-800 last:border-0"')
    text = text.replace('font-medium text-gray-700">{dim}', 'font-medium text-gray-700 dark:text-gray-300">{dim}')
    text = text.replace('text-gray-500">{pro}</td>', 'text-gray-500 dark:text-gray-400">{pro}</td>')
    
    # Assessment result disclaimer
    text = text.replace('mt-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl">\n            <div', 
                        'mt-8 p-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl">\n            <div')
    
    # History phase
    text = text.replace('font-display text-2xl md:text-3xl text-gray-800">测评历史记录', 
                        'font-display text-2xl md:text-3xl text-gray-800 dark:text-gray-100">测评历史记录')
    text = text.replace('text-center py-20 text-gray-300"', 'text-center py-20 text-gray-300 dark:text-gray-600"')
    
    # About page
    text = text.replace('text-gray-500 text-lg">一个为年轻人打造的心理健康小站', 
                        'text-gray-500 dark:text-gray-400 text-lg">一个为年轻人打造的心理健康小站')
    text = text.replace('glass-card p-8 md:p-10 mb-8 border-2 border-amber-200 bg-amber-50/50',
                        'glass-card p-8 md:p-10 mb-8 border-2 border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20')
    text = text.replace('glass-card p-8 md:p-10 mb-8 bg-red-50/50 border border-red-100',
                        'glass-card p-8 md:p-10 mb-8 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50')
    text = text.replace('p-4 bg-white rounded-2xl border border-amber-200"',
                        'p-4 bg-white dark:bg-gray-800 rounded-2xl border border-amber-200 dark:border-amber-800/50"')
    text = text.replace('p-4 bg-white rounded-2xl border border-red-50">',
                        'p-4 bg-white dark:bg-gray-800 rounded-2xl border border-red-50 dark:border-red-900/50">')
    
    # About page tech grid
    text = text.replace('p-3 bg-lavender-50/50 rounded-xl"', 'p-3 bg-lavender-50/50 dark:bg-lavender-950/30 rounded-xl"')
    text = text.replace('p-3 bg-mint-50/50 rounded-xl"', 'p-3 bg-mint-50/50 dark:bg-mint-950/30 rounded-xl"')
    text = text.replace('p-3 bg-peach-50/50 rounded-xl"', 'p-3 bg-peach-50/50 dark:bg-peach-950/30 rounded-xl"')
    text = text.replace('p-3 bg-blue-50/50 rounded-xl"', 'p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl"')
    text = text.replace('text-gray-400">技术栈', 'text-gray-400 dark:text-gray-500">技术栈')
    text = text.replace('text-gray-400">UI 框架', 'text-gray-400 dark:text-gray-500">UI 框架')
    text = text.replace('text-gray-400">托管平台', 'text-gray-400 dark:text-gray-500">托管平台')
    text = text.replace('text-gray-400">开源协议', 'text-gray-400 dark:text-gray-500">开源协议')
    text = text.replace('text-gray-700 font-medium">React + TypeScript + Vite', 
                        'text-gray-700 dark:text-gray-300 font-medium">React + TypeScript + Vite')
    text = text.replace('text-gray-700 font-medium">Tailwind CSS', 
                        'text-gray-700 dark:text-gray-300 font-medium">Tailwind CSS')
    text = text.replace('text-gray-700 font-medium">GitHub Pages', 
                        'text-gray-700 dark:text-gray-300 font-medium">GitHub Pages')
    text = text.replace('text-gray-700 font-medium">MIT License', 
                        'text-gray-700 dark:text-gray-300 font-medium">MIT License')
    
    # Privacy Policy
    text = text.replace('text-gray-400 text-sm mb-8">最后更新', 'text-gray-400 dark:text-gray-500 text-sm mb-8">最后更新')
    text = text.replace('p-4 bg-lavender-50/50 rounded-2xl"', 'p-4 bg-lavender-50/50 dark:bg-lavender-950/30 rounded-2xl"')
    text = text.replace('p-4 bg-peach-50/50 rounded-2xl"', 'p-4 bg-peach-50/50 dark:bg-peach-950/30 rounded-2xl"')
    text = text.replace('p-4 bg-mint-50/50 rounded-2xl"', 'p-4 bg-mint-50/50 dark:bg-mint-950/30 rounded-2xl"')
    text = text.replace('bg-amber-50/80 border border-amber-200 rounded-2xl text-amber-700"', 
                        'bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl text-amber-700 dark:text-amber-400"')
    
    # Assessment guide page specific
    text = text.replace('glass-card p-6 md:p-8 mb-10 border-l-4 border-lavender-400', 
                        'glass-card p-6 md:p-8 mb-10 border-l-4 border-lavender-400 dark:border-lavender-600')
    text = text.replace('font-medium text-gray-800 mb-3">一句话总结', 'font-medium text-gray-800 dark:text-gray-100 mb-3">一句话总结')
    text = text.replace('font-display text-2xl text-gray-800 mb-6">自测量表 vs 专业量表', 
                        'font-display text-2xl text-gray-800 dark:text-gray-100 mb-6">自测量表 vs 专业量表')
    text = text.replace('font-display text-2xl text-gray-800 mb-6">常见的专业心理量表', 
                        'font-display text-2xl text-gray-800 dark:text-gray-100 mb-6">常见的专业心理量表')
    text = text.replace('font-display text-2xl text-gray-800 mb-6">如何正确使用本站测评', 
                        'font-display text-2xl text-gray-800 dark:text-gray-100 mb-6">如何正确使用本站测评')
    text = text.replace('font-medium text-gray-800">{section.title}', 'font-medium text-gray-800 dark:text-gray-100">{section.title}')
    text = text.replace('font-medium text-gray-800">{item.name}', 'font-medium text-gray-800 dark:text-gray-100">{item.name}')
    
    # When to see doctor section in guide
    text = text.replace('p-6 bg-red-50 border-2 border-red-200 rounded-2xl mb-10">',
                        'p-6 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800/50 rounded-2xl mb-10">')
    text = text.replace('font-bold text-red-700 mb-2">什么时候应该去医院？', 
                        'font-bold text-red-700 dark:text-red-400 mb-2">什么时候应该去医院？')
    text = text.replace('text-sm text-red-600 leading-relaxed">', 'text-sm text-red-600 dark:text-red-400 leading-relaxed">')
    text = text.replace('font-medium text-red-700 mb-2">请立即拨打以下热线获取专业帮助',
                        'font-medium text-red-700 dark:text-red-400 mb-2">请立即拨打以下热线获取专业帮助')
    
    # Guide CTA
    text = text.replace('text-gray-400 mb-6">了解了区别后', 'text-gray-400 dark:text-gray-500 mb-6">了解了区别后')
    
    # About CTA
    text = text.replace('text-gray-400 text-sm mb-6">你不是一个人在面对这些', 
                        'text-gray-400 dark:text-gray-500 text-sm mb-6">你不是一个人在面对这些')
    
    # Quiz phase options
    text = text.replace("'bg-white/60 text-gray-600 border-lavender-100 hover:border-lavender-300 hover:bg-lavender-50'",
                        "'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 border-lavender-100 dark:border-gray-700 hover:border-lavender-300 dark:hover:border-lavender-600 hover:bg-lavender-50 dark:hover:bg-lavender-950/50'")
    
    # Assessment result circular progress
    text = text.replace('stroke="#EDE9FE"', 'strokeDark="#EDE9FE"')
    # Fix the SVG circle - replace the static stroke with dark-aware one
    # We'll handle SVG separately
    
    # Assessment result score text
    text = text.replace('text-2xl font-bold text-gray-800">{totalScore}', 
                        'text-2xl font-bold text-gray-800 dark:text-gray-100">{totalScore}')
    text = text.replace('text-xs text-gray-400">/ {maxScore}', 
                        'text-xs text-gray-400 dark:text-gray-500">/ {maxScore}')
    
    # Result suggestions
    text = text.replace('font-medium text-gray-800 mb-4">个性化建议', 'font-medium text-gray-800 dark:text-gray-100 mb-4">个性化建议')
    
    # Result saved notice
    text = text.replace('text-xs text-gray-300">\n            {isLogin',
                        'text-xs text-gray-300 dark:text-gray-600">\n            {isLogin')
    
    # Assessment high risk warning
    text = text.replace('mb-6 p-5 bg-red-50 border-2 border-red-200 rounded-2xl"',
                        'mb-6 p-5 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800/50 rounded-2xl"')
    text = text.replace('font-bold text-red-700 mb-1">需要关注', 'font-bold text-red-700 dark:text-red-400 mb-1">需要关注')
    text = text.replace('text-sm text-red-600 leading-relaxed mb-3">',
                        'text-sm text-red-600 dark:text-red-400 leading-relaxed mb-3">')
    text = text.replace('font-medium text-red-700 mb-2">请立即拨打以下热线获取专业帮助',
                        'font-medium text-red-700 dark:text-red-400 mb-2">请立即拨打以下热线获取专业帮助')
    
    # History cards in assessment
    text = text.replace('flex-shrink-0 p-4 bg-white/80 border border-lavender-100/50 rounded-2xl',
                        'flex-shrink-0 p-4 bg-white/80 dark:bg-gray-800/80 border border-lavender-100/50 dark:border-gray-700/50 rounded-2xl')
    text = text.replace('text-lg font-bold text-gray-800">{r.score}', 'text-lg font-bold text-gray-800 dark:text-gray-100">{r.score}')
    
    # Privacy policy font-medium headings
    text = text.replace('font-medium text-gray-800 text-lg mb-3">一', 'font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">一')
    text = text.replace('font-medium text-gray-800 text-lg mb-3">二', 'font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">二')
    text = text.replace('font-medium text-gray-800 text-lg mb-3">三', 'font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">三')
    text = text.replace('font-medium text-gray-800 text-lg mb-3">四', 'font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">四')
    text = text.replace('font-medium text-gray-800 text-lg mb-3">五', 'font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">五')
    text = text.replace('font-medium text-gray-800 text-lg mb-3">六', 'font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">六')
    text = text.replace('font-medium text-gray-800 text-lg mb-3">七', 'font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">七')
    text = text.replace('font-medium text-gray-800 text-lg mb-3">八', 'font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">八')
    text = text.replace('font-medium text-gray-800 text-lg mb-3">九', 'font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">九')
    text = text.replace('font-medium text-gray-800 text-lg mb-3">十', 'font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">十')
    text = text.replace('font-medium text-gray-800 text-lg mb-3">十一', 'font-medium text-gray-800 dark:text-gray-100 text-lg mb-3">十一')
    
    # Privacy policy sub-headings
    text = text.replace('font-medium text-gray-700 mb-1">我们不主动收集', 'font-medium text-gray-700 dark:text-gray-300 mb-1">我们不主动收集')
    text = text.replace('font-medium text-gray-700 mb-1">用户主动提供的信息', 'font-medium text-gray-700 dark:text-gray-300 mb-1">用户主动提供的信息')
    text = text.replace('font-medium text-gray-700 text-sm mb-2">🏥 线下就医指引', 
                        'font-medium text-gray-700 dark:text-gray-300 text-sm mb-2">🏥 线下就医指引')
    
    # About page crisis resources
    text = text.replace('font-medium text-gray-800 text-sm">{resource.name}', 
                        'font-medium text-gray-800 dark:text-gray-100 text-sm">{resource.name}')
    text = text.replace('text-xs text-gray-400">{resource.hours}', 'text-xs text-gray-400 dark:text-gray-500">{resource.hours}')
    text = text.replace('font-mono text-red-500 font-bold text-lg">{resource.phone}', 
                        'font-mono text-red-500 dark:text-red-400 font-bold text-lg">{resource.phone}')
    
    # About page headings
    text = text.replace('font-display text-xl text-gray-800 mb-4">我们的使命', 
                        'font-display text-xl text-gray-800 dark:text-gray-100 mb-4">我们的使命')
    text = text.replace('font-display text-xl text-gray-800 mb-4">我们提供什么', 
                        'font-display text-xl text-gray-800 dark:text-gray-100 mb-4">我们提供什么')
    text = text.replace('text-gray-500 text-sm mb-6">\n            如果你或身边的人正在经历心理危机', 
                        'text-gray-500 dark:text-gray-400 text-sm mb-6">\n            如果你或身边的人正在经历心理危机')
    text = text.replace('font-display text-xl text-gray-800 mb-4 flex items-center gap-2">\n            <span>⚠️',
                        'font-display text-xl text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">\n            <span>⚠️')
    text = text.replace('font-display text-xl text-gray-800 mb-4 flex items-center gap-2">\n            <span>🆘',
                        'font-display text-xl text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">\n            <span>🆘')
    text = text.replace('font-display text-xl text-gray-800 mb-4">关于本项目', 
                        'font-display text-xl text-gray-800 dark:text-gray-100 mb-4">关于本项目')
    
    # Privacy header
    text = text.replace('font-display text-3xl md:text-4xl text-gray-800 mb-2">隐私政策', 
                        'font-display text-3xl md:text-4xl text-gray-800 dark:text-gray-100 mb-2">隐私政策')
    
    # Assessment page result phase SVG - replace background circle stroke
    # The circle uses stroke="#EDE9FE" - we need to make it dynamic
    text = text.replace('stroke="#EDE9FE"', 'className="dark:stroke-gray-700"')
    
    # About page list items with amber colors
    text = text.replace('text-amber-600 list-disc list-inside">', 'text-amber-600 dark:text-amber-400 list-disc list-inside">')
    text = text.replace('font-medium text-amber-700 mb-2">以下情况', 'font-medium text-amber-700 dark:text-amber-400 mb-2">以下情况')
    text = text.replace('p-4 bg-white rounded-2xl border border-amber-200"', 
                        'p-4 bg-white dark:bg-gray-800 rounded-2xl border border-amber-200 dark:border-amber-800/50"')
    
    # About mission text
    text = text.replace('text-gray-600 leading-relaxed">\n            <p>\n              心晴驿站诞生于',
                        'text-gray-600 dark:text-gray-400 leading-relaxed">\n            <p>\n              心晴驿站诞生于')
    
    # About features
    text = text.replace('text-gray-800 mb-1 group-hover:text-lavender-500 transition-colors">{item.title}',
                        'text-gray-800 dark:text-gray-100 mb-1 group-hover:text-lavender-500 transition-colors">{item.title}')
    text = text.replace('text-sm text-gray-500 leading-relaxed">{item.desc}', 
                        'text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}')
    
    # About site info text
    text = text.replace('text-sm text-gray-600">\n            <p>\n              心晴驿站 MindEase 是一个',
                        'text-sm text-gray-600 dark:text-gray-400">\n            <p>\n              心晴驿站 MindEase 是一个')
    text = text.replace('text-gray-400 text-xs">\n              本站所有用户数据',
                        'text-gray-400 dark:text-gray-500 text-xs">\n              本站所有用户数据')
    
    # Assessment Guide - table header bg
    text = text.replace('<tr className="bg-lavender-50">', '<tr className="bg-lavender-50 dark:bg-lavender-900/30">')
    
    # Assessment Guide - do/don't section items
    text = text.replace('before:text-gray-300">\n                    {item}',
                        'before:text-gray-300 dark:before:text-gray-600">\n                    {item}')
    
    # Privacy policy contact link
    text = text.replace('text-lavender-500 hover:text-lavender-600">github.com/caiaiji/mind-ease',
                        'text-lavender-500 dark:text-lavender-400 hover:text-lavender-600 dark:hover:text-lavender-300">github.com/caiaiji/mind-ease')
    
    return text


def apply_home(text):
    """Home page specific dark mode"""
    # Glass card backgrounds handled by index.css
    # bg-* classes for mood options
    text = text.replace("'bg-mint-50 border-mint-200 hover:bg-mint-100'", 
                        "'bg-mint-50 dark:bg-mint-950/40 border-mint-200 dark:border-mint-800/50 hover:bg-mint-100 dark:hover:bg-mint-900/60'")
    text = text.replace("'bg-lavender-50 border-lavender-200 hover:bg-lavender-100'", 
                        "'bg-lavender-50 dark:bg-lavender-950/40 border-lavender-200 dark:border-lavender-800/50 hover:bg-lavender-100 dark:hover:bg-lavender-900/60'")
    text = text.replace("'bg-peach-50 border-peach-200 hover:bg-peach-100'", 
                        "'bg-peach-50 dark:bg-peach-950/40 border-peach-200 dark:border-peach-800/50 hover:bg-peach-100 dark:hover:bg-peach-900/60'")
    text = text.replace("'bg-gray-50 border-gray-200 hover:bg-gray-100'", 
                        "'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/60'")
    
    # Interactive tools card backgrounds
    text = text.replace("'from-lavender-50 to-mint-50'", "'from-lavender-50 to-mint-50 dark:from-lavender-950/50 dark:to-mint-950/50'")
    text = text.replace("'from-peach-50 to-lavender-50'", "'from-peach-50 to-lavender-50 dark:from-peach-950/50 dark:to-lavender-950/50'")
    text = text.replace("'from-mint-50 to-lavender-50'", "'from-mint-50 to-lavender-50 dark:from-mint-950/50 dark:to-lavender-950/50'")
    text = text.replace("'from-lavender-50 to-peach-50'", "'from-lavender-50 to-peach-50 dark:from-lavender-950/50 dark:to-peach-950/50'")
    text = text.replace("'from-mint-50 to-peach-50'", "'from-mint-50 to-peach-50 dark:from-mint-950/50 dark:to-peach-950/50'")
    text = text.replace("'from-peach-50 to-mint-50'", "'from-peach-50 to-mint-50 dark:from-peach-950/50 dark:to-mint-950/50'")
    
    # Interactive tools hover colors  
    text = text.replace("'border-lavender-100'", "'border-lavender-100 dark:border-lavender-800/50'")
    text = text.replace("'border-peach-100'", "'border-peach-100 dark:border-peach-800/50'")
    text = text.replace("'border-mint-100'", "'border-mint-100 dark:border-mint-800/50'")
    
    # Card text
    text = text.replace('text-gray-800 text-lg mb-2 group-hover:text-lavender-500', 
                        'text-gray-800 dark:text-gray-100 text-lg mb-2 group-hover:text-lavender-500')
    text = text.replace('text-sm text-gray-400 leading-relaxed">{item.desc}', 
                        'text-sm text-gray-400 dark:text-gray-500 leading-relaxed">{item.desc}')
    
    # Mood options text
    text = text.replace('text-sm font-medium text-gray-600">{mood.label}', 
                        'text-sm font-medium text-gray-600 dark:text-gray-300">{mood.label}')
    
    # Featured articles
    text = text.replace('text-gray-800 mb-1 group-hover:text-lavender-500 transition-colors">\n                      {article.title}',
                        'text-gray-800 dark:text-gray-100 mb-1 group-hover:text-lavender-500 transition-colors">\n                      {article.title}')
    text = text.replace('text-sm text-gray-400 leading-relaxed line-clamp-2">\n                      {article.summary}',
                        'text-sm text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2">\n                      {article.summary}')
    text = text.replace('text-xs text-gray-300">\n                      <span>{article.readTime}',
                        'text-xs text-gray-300 dark:text-gray-600">\n                      <span>{article.readTime}')
    
    # Quick assessment cards
    text = text.replace('font-medium text-gray-800 mb-1">{a.title}</h3>', 
                        'font-medium text-gray-800 dark:text-gray-100 mb-1">{a.title}</h3>')
    text = text.replace('text-xs text-gray-400">{a.questions.length} 道题', 
                        'text-xs text-gray-400 dark:text-gray-500">{a.questions.length} 道题')
    
    # Crisis banner glass card border
    text = text.replace('border border-red-100 text-center"', 'border border-red-100 dark:border-red-900/50 text-center"')
    text = text.replace('text-sm text-gray-500 mb-4">\n              \n            </p>',
                        'text-sm text-gray-500 dark:text-gray-400 mb-4">\n              \n            </p>')
    text = text.replace('text-xs text-gray-300 mt-4">\n              \n            </p>',
                        'text-xs text-gray-300 dark:text-gray-600 mt-4">\n              \n            </p>')
    
    # Daily quote
    text = text.replace('font-display text-xl md:text-2xl text-gray-700 leading-relaxed">',
                        'font-display text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">')
    
    return text


def apply_articles(text):
    """Articles page specific"""
    text = text.replace("'bg-lavender-400 text-white shadow-md'",
                        "'bg-lavender-400 dark:bg-lavender-500 text-white shadow-md'")
    text = text.replace("'bg-white/60 text-gray-500 hover:bg-lavender-50 hover:text-lavender-500 border border-lavender-100'",
                        "'bg-white/60 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 hover:bg-lavender-50 dark:hover:bg-lavender-950/50 hover:text-lavender-500 border border-lavender-100 dark:border-gray-700'")
    
    # Article list cards
    text = text.replace('text-gray-800 mb-1 group-hover:text-lavender-500 transition-colors truncate">',
                        'text-gray-800 dark:text-gray-100 mb-1 group-hover:text-lavender-500 transition-colors truncate">')
    text = text.replace('text-sm text-gray-400 leading-relaxed line-clamp-2 mb-3">',
                        'text-sm text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2 mb-3">')
    text = text.replace('text-xs text-gray-300">\n                    <span className={`px-2 py-0.5 rounded-full bg-lavender-50 text-lavender-500`}',
                        'text-xs text-gray-300 dark:text-gray-600">\n                    <span className={`px-2 py-0.5 rounded-full bg-lavender-50 dark:bg-lavender-900/40 text-lavender-500 dark:text-lavender-400`}')
    
    # Empty state
    text = text.replace('text-gray-400">该分类下暂无文章', 'text-gray-400 dark:text-gray-500">该分类下暂无文章')
    
    return text


def apply_article_detail(text):
    """ArticleDetail page specific"""
    # Not found state
    text = text.replace('text-2xl text-gray-800 mb-3">文章未找到', 'text-2xl text-gray-800 dark:text-gray-100 mb-3">文章未找到')
    text = text.replace('text-gray-400 mb-8">你访问的文章不存在', 'text-gray-400 dark:text-gray-500 mb-8">你访问的文章不存在')
    text = text.replace('text-center py-16">\n              <span className="text-6xl',
                        'text-center py-16 dark:text-gray-600">\n              <span className="text-6xl')
    
    # Article header
    text = text.replace('text-sm text-lavender-400 hover:text-lavender-500 transition-colors mb-6',
                        'text-sm text-lavender-400 dark:text-lavender-300 hover:text-lavender-500 transition-colors mb-6')
    text = text.replace('px-3 py-1 rounded-full bg-lavender-100 text-lavender-500 text-xs',
                        'px-3 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/40 text-lavender-500 dark:text-lavender-400 text-xs')
    text = text.replace('text-xs text-gray-300">{article.readTime}', 'text-xs text-gray-300 dark:text-gray-600">{article.readTime}')
    text = text.replace('text-gray-800 mb-4">\n            {article.title}', 'text-gray-800 dark:text-gray-100 mb-4">\n            {article.title}')
    text = text.replace('text-gray-400 text-lg">{article.summary}', 'text-gray-400 dark:text-gray-500 text-lg">{article.summary}')
    
    # Article content
    text = text.replace('font-display text-xl md:text-2xl text-gray-800 mt-8 mb-4">',
                        'font-display text-xl md:text-2xl text-gray-800 dark:text-gray-100 mt-8 mb-4">')
    text = text.replace('font-medium text-gray-800 mb-2">', 'font-medium text-gray-800 dark:text-gray-100 mb-2">')
    text = text.replace('text-gray-600 leading-relaxed mb-2">', 'text-gray-600 dark:text-gray-400 leading-relaxed mb-2">')
    text = text.replace('list-disc list-inside space-y-2 text-gray-600 mb-6', 
                        'list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-6')
    text = text.replace('text-gray-600 leading-relaxed mb-6">{block}</p>', 
                        'text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{block}</p>')
    
    # Related articles
    text = text.replace('text-gray-800 text-sm mb-1 group-hover:text-lavender-500', 
                        'text-gray-800 dark:text-gray-100 text-sm mb-1 group-hover:text-lavender-500')
    text = text.replace('text-xs text-gray-300">{a.readTime}', 'text-xs text-gray-300 dark:text-gray-600">{a.readTime}')
    
    return text


def apply_assessment(text):
    """Assessment page specific"""
    # History cards
    text = text.replace('text-gray-500">得分：{r.score}', 'text-gray-500 dark:text-gray-400">得分：{r.score}')
    text = text.replace('text-gray-300">{fmtDate(r.date)}', 'text-gray-300 dark:text-gray-600">{fmtDate(r.date)}')
    text = text.replace("bg-lavender-50 text-lavender-500 hover:bg-lavender-100 transition-colors'\n                        >\n                          重新测评",
                        "bg-lavender-50 dark:bg-lavender-900/40 text-lavender-500 dark:text-lavender-400 hover:bg-lavender-100 dark:hover:bg-lavender-900/60 transition-colors'\n                        >\n                          重新测评")
    text = text.replace("bg-red-50 text-red-400 hover:bg-red-100 transition-colors'\n                        >\n                          删除",
                        "bg-red-50 dark:bg-red-950/40 text-red-400 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors'\n                        >\n                          删除")
    
    # Clear all button
    text = text.replace('text-sm text-red-400 hover:text-red-500 transition-colors"\n              >\n                清空所有记录',
                        'text-sm text-red-400 dark:text-red-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"\n              >\n                清空所有记录')
    
    # History entry scroll
    text = text.replace('text-gray-400">{r.assessmentTitle}', 'text-gray-400 dark:text-gray-500">{r.assessmentTitle}')
    text = text.replace('text-xs text-lavender-500 mt-1">{r.level}', 'text-xs text-lavender-500 dark:text-lavender-400 mt-1">{r.level}')
    text = text.replace('text-xs text-gray-300 mt-2">{fmtDate', 'text-xs text-gray-300 dark:text-gray-600 mt-2">{fmtDate')
    
    return text


def apply_assessment_guide(text):
    """Assessment guide specific"""
    # Tag colors
    text = text.replace("'bg-peach-50 text-peach-500'", "'bg-peach-50 dark:bg-peach-950/40 text-peach-500 dark:text-peach-400'")
    text = text.replace("'bg-lavender-50 text-lavender-500'", "'bg-lavender-50 dark:bg-lavender-950/40 text-lavender-500 dark:text-lavender-400'")
    text = text.replace("'bg-mint-50 text-mint-500'", "'bg-mint-50 dark:bg-mint-950/40 text-mint-500 dark:text-mint-400'")
    text = text.replace("'bg-indigo-50 text-indigo-500'", "'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400'")
    
    return text


def apply_about(text):
    """About page specific"""
    # About features link colors
    text = text.replace('font-medium text-gray-800 mb-1 group-hover:text-lavender-500 transition-colors">{item.title}</h3>',
                        'font-medium text-gray-800 dark:text-gray-100 mb-1 group-hover:text-lavender-500 transition-colors">{item.title}</h3>')
    text = text.replace('text-sm text-gray-500 leading-relaxed">{item.desc}</p>',
                        'text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>')
    
    # About disclaimer text
    text = text.replace('text-gray-600 text-sm leading-relaxed">',
                        'text-gray-600 dark:text-gray-400 text-sm leading-relaxed">')
    
    # About crisis resources description
    text = text.replace('text-gray-500">\n              <p className="font-medium',
                        'text-gray-500 dark:text-gray-400">\n              <p className="font-medium')
    
    # About in-person help
    text = text.replace('text-sm text-gray-500">\n              <li>• <strong>三甲医院',
                        'text-sm text-gray-500 dark:text-gray-400">\n              <li>• <strong>三甲医院')
    
    return text


def apply_privacy(text):
    """Privacy policy specific"""
    text = text.replace('space-y-8 text-gray-600 text-sm leading-relaxed">',
                        'space-y-8 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">')
    text = text.replace('text-gray-500">\n            </p>',
                        'text-gray-500 dark:text-gray-400">\n            </p>')
    
    # Sub-section texts
    text = text.replace('text-gray-500">如果您选择使用', 'text-gray-500 dark:text-gray-400">如果您选择使用')
    text = text.replace('text-gray-500 mt-2">\n                    <li>',
                        'text-gray-500 dark:text-gray-400 mt-2">\n                    <li>')
    
    return text


def apply_header(text):
    """Header page specific - add mobile theme toggle"""
    # Mobile menu hamburger dark
    text = text.replace(
        'lg:hidden p-2 rounded-full hover:bg-lavender-100 transition-colors"\n            aria-label="菜单"',
        'lg:hidden p-2 rounded-full hover:bg-lavender-100 dark:hover:bg-lavender-500/20 transition-colors"\n            aria-label="菜单"'
    )
    text = text.replace(
        'w-6 h-6 text-gray-600"',
        'w-6 h-6 text-gray-600 dark:text-gray-300"'
    )
    
    # Desktop nav links
    text = text.replace(
        "'bg-lavender-100 text-lavender-600'",
        "'bg-lavender-100 dark:bg-lavender-900/40 text-lavender-600 dark:text-lavender-400'"
    )
    text = text.replace(
        "'text-gray-500 hover:text-lavender-500 hover:bg-lavender-50'",
        "'text-gray-500 dark:text-gray-400 hover:text-lavender-500 hover:bg-lavender-50 dark:hover:bg-lavender-900/40'"
    )
    
    # Admin button desktop
    text = text.replace(
        'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100',
        'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/60'
    )
    
    # User avatar desktop
    text = text.replace(
        'bg-lavender-50 border border-lavender-100 hover:bg-lavender-100',
        'bg-lavender-50 dark:bg-lavender-900/40 border border-lavender-100 dark:border-lavender-800/50 hover:bg-lavender-100 dark:hover:bg-lavender-900/60'
    )
    
    # Theme toggle button hover
    text = text.replace(
        'ml-2 p-2 rounded-full hover:bg-lavender-100 dark:hover:bg-lavender-500/20',
        'ml-2 p-2 rounded-full hover:bg-lavender-100 dark:hover:bg-lavender-500/20'
    )
    
    # Mobile nav links
    text = text.replace(
        "'bg-lavender-100 text-lavender-600'\n                    : 'text-gray-500 hover:bg-lavender-50'",
        "'bg-lavender-100 dark:bg-lavender-900/40 text-lavender-600 dark:text-lavender-400'\n                    : 'text-gray-500 dark:text-gray-400 hover:bg-lavender-50 dark:hover:bg-lavender-900/40'"
    )
    
    # Mobile user section border
    text = text.replace(
        'border-t border-lavender-100/50 mt-2 pt-3',
        'border-t border-lavender-100/50 dark:border-gray-700/50 mt-2 pt-3'
    )
    
    # Mobile admin button
    text = text.replace(
        'bg-amber-50 text-amber-600 font-medium mb-2',
        'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-medium mb-2'
    )
    
    # Mobile user card
    text = text.replace(
        'px-4 py-3 rounded-2xl bg-lavender-50"\n                >\n                  <span className="text-2xl">{user.avatar}</span>\n                  <div>\n                    <div className="text-sm font-medium text-gray-800">{user.nickname}</div>\n                    <div className="text-xs text-gray-400">{user.email}</div>',
        'px-4 py-3 rounded-2xl bg-lavender-50 dark:bg-lavender-900/40"\n                >\n                  <span className="text-2xl">{user.avatar}</span>\n                  <div>\n                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{user.nickname}</div>\n                    <div className="text-xs text-gray-400 dark:text-gray-500">{user.email}</div>'
    )
    
    # Add theme toggle to mobile menu (before the mobile user section closing div)
    # Find the mobile user section and add theme toggle button
    mobile_theme_toggle = """
              {/* Mobile Theme Toggle */}
              <button
                onClick={() => { toggleTheme() }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-lavender-50 dark:bg-lavender-900/40 hover:bg-lavender-100 dark:hover:bg-lavender-900/60 transition-all"
              >
                <span className="text-xl">{resolvedTheme === 'dark' ? '☀️' : '🌙'}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {resolvedTheme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
                </span>
              </button>"""

    text = text.replace(
        '<div className="border-t border-lavender-100/50 dark:border-gray-700/50 mt-2 pt-3">',
        mobile_theme_toggle + '\n              <div className="border-t border-lavender-100/50 dark:border-gray-700/50 mt-2 pt-3">'
    )
    
    return text


# Process each file
files_to_process = [
    ('pages/Home.tsx', [apply_all, apply_home]),
    ('pages/Articles.tsx', [apply_all, apply_articles]),
    ('pages/ArticleDetail.tsx', [apply_all, apply_article_detail]),
    ('pages/Assessment.tsx', [apply_all, apply_assessment]),
    ('pages/AssessmentGuide.tsx', [apply_all, apply_assessment_guide]),
    ('pages/About.tsx', [apply_all, apply_about]),
    ('pages/PrivacyPolicy.tsx', [apply_all, apply_privacy]),
    ('components/layout/Header.tsx', [apply_header]),
]

for filename, transformers in files_to_process:
    filepath = os.path.join(BASE, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    for transformer in transformers:
        content = transformer(content)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ {filename} done")

print("\nAll pages processed!")
