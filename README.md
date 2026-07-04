<div align="center">

# 心晴驿站 MindEase

**给心灵放个假 —— 轻量化公益心理科普工具**

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-deployed?logo=github&color=8B5CF6)](https://caiaiji.github.io/mind-ease/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**在线体验**：[caiaiji.github.io/mind-ease](https://caiaiji.github.io/mind-ease/)

</div>

---

## 功能概览

### 📊 情绪测评
- **3种专业量表**：焦虑自评量表 (SAS)、知觉压力问卷 (PSS)、情绪温度计
- **测评报告卡片**：Canvas 生成精美 PNG，支持保存与分享
- **量表科普页**：详细介绍每种量表的背景、信效度和适用场景
- **历史记录**：追踪多次测评结果变化

### 🧘 放松工具
- **呼吸引导**：3种呼吸模式（4-7-8放松呼吸 / 方形呼吸 / 等比呼吸），SVG动画+进度环
- **正念计时器**：3-15分钟可选/自定义时长，引导语轮播 + Web Audio音频提示
- **白噪音**：6种音效（雨声/海浪/篝火/森林/风声/咖啡厅），纯浏览器生成
- **自助减压技巧**：渐进性肌肉放松、身体扫描、五感着陆法等6种方法

### 📝 情绪日记
- 5级心情评分 + 标签系统 + 自由文字记录
- 历史记录查看与删除
- 与仪表盘、周报数据联动

### 📅 每日打卡
- 连续打卡天数统计 + 累计打卡次数
- 类GitHub风格热力图（近12周）
- **8种成就徽章**：连续3/7/14/30天 + 累计10/50/100/365次

### 📈 数据洞察
- **情绪仪表盘**：聚合心情日记+测评+打卡数据，统计卡片+趋势图+心情分布
- **情绪洞察周报**：7天心情柱状图、心情分布、智能洞察文案、活动时间线、周切换

### 📖 心理文章
- **26篇原创科普文章**，覆盖6大分类：焦虑管理/情绪调节/人际关系/自我成长/睡眠改善/压力应对
- 分类筛选 + 搜索 + 阅读时间估算
- 每篇文章含参考文献

### 🎮 放松游戏
- 戳泡泡、种花花园、记忆翻牌、漂浮泡泡、舒尔特方格
- 舒尔特方格排行榜（管理页可查看）

### 🌳 树洞倾诉
- 匿名发布 + 心情标记
- **8种情绪标签**（学习压力/人际关系/焦虑不安等）
- **暖心回应库**：15条预设暖心语一键发送
- 按标签筛选留言

### 📚 考前专题
- 4大策略区：焦虑急救/科学备考/考前夜/考场心态
- 速记小贴士 + 自我肯定语 + CTA放松入口

### 🌓 Dark Mode
- 三种模式：浅色/深色/跟随系统
- 全站适配（Tailwind dark: + 内联样式 dark() 工具函数）

### 🔐 用户系统
- 本地注册/登录（localStorage 持久化）
- 头像选择 + 昵称设置
- 管理员后台（预设邮箱白名单）

### 📱 PWA
- 可安装到桌面
- Service Worker 缓存策略（HTML network-first，静态资源 cache-first）

### ♿ 无障碍
- Skip Link 键盘导航
- Focus Visible 聚焦环
- prefers-reduced-motion 减少动画
- 触控目标最小 44px

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS 3 |
| 路由 | React Router 7 (HashRouter) |
| 部署 | GitHub Pages (Actions) |
| 数据 | localStorage（纯前端，零后端） |

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览构建产物
npm run preview
```

## 项目结构

```
mind-ease/
├── src/
│   ├── components/
│   │   ├── layout/          # Header, Footer, Layout
│   │   ├── BreathingGuide   # 呼吸引导（3种模式）
│   │   ├── MindfulnessTimer # 正念计时器
│   │   ├── AssessmentReportCard # 测评报告Canvas生成
│   │   ├── WhiteNoise       # 白噪音播放器
│   │   └── ErrorBoundary    # 全局错误边界
│   ├── pages/
│   │   ├── Home             # 首页（功能卡片导航）
│   │   ├── Articles         # 文章列表（分类筛选）
│   │   ├── ArticleDetail    # 文章详情
│   │   ├── Assessment       # 情绪测评（3种量表）
│   │   ├── AssessmentGuide  # 量表科普
│   │   ├── Relax            # 放松工具入口
│   │   ├── Games            # 放松游戏
│   │   ├── MoodDiary        # 情绪日记
│   │   ├── TreeHole         # 树洞倾诉（标签+暖心回应）
│   │   ├── CheckIn          # 每日打卡（热力图+成就）
│   │   ├── Dashboard        # 情绪仪表盘
│   │   ├── WeeklyInsight    # 情绪洞察周报
│   │   ├── ExamPrep         # 考前专题
│   │   ├── Profile          # 个人中心
│   │   ├── Admin            # 管理后台
│   │   ├── About            # 关于
│   │   └── PrivacyPolicy    # 隐私政策
│   ├── contexts/
│   │   ├── ThemeContext     # 主题管理（Light/Dark/System）
│   │   └── UserContext      # 用户状态
│   ├── data/
│   │   ├── articles.ts      # 26篇心理科普文章
│   │   ├── assessments.ts   # 3种测评数据
│   │   └── relax.ts         # 6种放松技巧
│   ├── App.tsx              # 路由注册 + Provider
│   ├── main.tsx             # 入口（版本自动刷新）
│   └── index.css            # 全局样式 + Dark Mode + A11y
├── public/
│   ├── manifest.json        # PWA清单
│   ├── sw.js                # Service Worker
│   └── icons/               # PWA图标
└── .github/workflows/
    └── deploy.yml           # GitHub Pages自动部署
```

## 数据隐私

所有用户数据（情绪日记、测评记录、打卡数据、树洞留言等）均存储在浏览器 `localStorage` 中，**不会上传到任何服务器**。关闭/清除浏览器数据后所有记录将被删除。

## 设计理念

- **零门槛**：无需注册即可使用大部分功能，注册仅用于持久化个人数据
- **零后端**：纯前端实现，部署简单，数据完全本地化
- **温柔治愈**：柔和配色 + 毛玻璃质感 + 舒缓动效，降低使用心理门槛
- **科学严谨**：文章附参考文献，量表采用学术验证工具

## License

[MIT](LICENSE)
