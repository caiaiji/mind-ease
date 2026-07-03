import re

path = r'C:\Users\GXQ\Documents\lingxi-claw\20260701-22-39-09-880\mind-ease\src\components\layout\Footer.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Footer dark mode adaptations
replacements = [
    # Main footer bg
    ('bg-white/60 backdrop-blur-sm border-t border-lavender-100/50 mt-20',
     'bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-t border-lavender-100/50 dark:border-gray-700/50 mt-20'),
    
    # Crisis banner
    ('<div className="bg-red-50 border-b border-red-100">',
     '<div className="bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900/50">'),
    ('text-red-700">如果你或身边的人正处于心理危机：',
     'text-red-700 dark:text-red-400">如果你或身边的人正处于心理危机：'),
    ('px-3 py-1 bg-white rounded-full text-red-600 font-medium border border-red-200',
     'px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-red-600 dark:text-red-400 font-medium border border-red-200 dark:border-red-800'),
    
    # Brand section
    ('text-xl text-gray-800">心晴驿站</span>',
     'text-xl text-gray-800 dark:text-gray-100">心晴驿站</span>'),
    ('text-gray-400 text-sm leading-relaxed">',
     'text-gray-400 dark:text-gray-500 text-sm leading-relaxed">'),
    
    # Quick Links heading
    ('text-gray-700 mb-3">探索</h3>',
     'text-gray-700 dark:text-gray-300 mb-3">探索</h3>'),
    ('text-sm text-gray-400 hover:text-lavender-500 transition-colors">心理文章</Link>',
     'text-sm text-gray-400 dark:text-gray-500 hover:text-lavender-500 transition-colors">心理文章</Link>'),
    ('text-sm text-gray-400 hover:text-lavender-500 transition-colors">情绪测评</Link>',
     'text-sm text-gray-400 dark:text-gray-500 hover:text-lavender-500 transition-colors">情绪测评</Link>'),
    ('text-sm text-gray-400 hover:text-lavender-500 transition-colors">放松工具</Link>',
     'text-sm text-gray-400 dark:text-gray-500 hover:text-lavender-500 transition-colors">放松工具</Link>'),
    ('text-sm text-gray-400 hover:text-lavender-500 transition-colors">情绪日记</Link>',
     'text-sm text-gray-400 dark:text-gray-500 hover:text-lavender-500 transition-colors">情绪日记</Link>'),
    ('text-sm text-gray-400 hover:text-lavender-500 transition-colors">树洞倾诉</Link>',
     'text-sm text-gray-400 dark:text-gray-500 hover:text-lavender-500 transition-colors">树洞倾诉</Link>'),
    ('text-sm text-gray-400 hover:text-lavender-500 transition-colors">放松游戏</Link>',
     'text-sm text-gray-400 dark:text-gray-500 hover:text-lavender-500 transition-colors">放松游戏</Link>'),
    ('text-sm text-gray-400 hover:text-lavender-500 transition-colors">关于我们</Link>',
     'text-sm text-gray-400 dark:text-gray-500 hover:text-lavender-500 transition-colors">关于我们</Link>'),
    ('text-sm text-gray-400 hover:text-lavender-500 transition-colors">隐私政策</Link>',
     'text-sm text-gray-400 dark:text-gray-500 hover:text-lavender-500 transition-colors">隐私政策</Link>'),
    
    # Resources heading
    ('text-gray-700 mb-3">心理援助热线</h3>',
     'text-gray-700 dark:text-gray-300 mb-3">心理援助热线</h3>'),
    ('text-sm text-gray-400">\n              <p>全国心理援助热线：<strong className="text-gray-600">400-161-9995</strong>',
     'text-sm text-gray-400 dark:text-gray-500">\n              <p>全国心理援助热线：<strong className="text-gray-600 dark:text-gray-300">400-161-9995</strong>'),
    ('text-sm text-gray-400">\n              <p>北京心理危机干预中心：<strong className="text-gray-600">010-82951332</strong>',
     'text-sm text-gray-400 dark:text-gray-500">\n              <p>北京心理危机干预中心：<strong className="text-gray-600 dark:text-gray-300">010-82951332</strong>'),
    ('text-sm text-gray-400">\n              <p>生命热线：<strong className="text-gray-600">400-821-1215</strong>',
     'text-sm text-gray-400 dark:text-gray-500">\n              <p>生命热线：<strong className="text-gray-600 dark:text-gray-300">400-821-1215</strong>'),
    ('text-sm text-gray-400">\n              <p>共青团心理咨询热线：<strong className="text-gray-600">12355</strong>',
     'text-sm text-gray-400 dark:text-gray-500">\n              <p>共青团心理咨询热线：<strong className="text-gray-600 dark:text-gray-300">12355</strong>'),
    
    # Disclaimer
    ('mt-10 p-5 bg-amber-50/80 border border-amber-200 rounded-2xl',
     'mt-10 p-5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl'),
    ('text-sm text-amber-700 leading-relaxed">',
     'text-sm text-amber-700 dark:text-amber-400 leading-relaxed">'),
    
    # Bottom bar
    ('text-center text-xs text-gray-300">',
     'text-center text-xs text-gray-300 dark:text-gray-600">'),
    ('text-gray-200">|</span>',
     'text-gray-200 dark:text-gray-700">|</span>'),
    ('hover:text-lavender-500 transition-colors">隐私政策</Link>',
     'hover:text-lavender-500 dark:hover:text-lavender-400 transition-colors">隐私政策</Link>'),
    ('hover:text-lavender-500 transition-colors">GitHub</a>',
     'hover:text-lavender-500 dark:hover:text-lavender-400 transition-colors">GitHub</a>'),
]

for find, replace in replacements:
    content = content.replace(find, replace, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Footer dark mode done")
