# 心晴驿站 MindEase

> 给心灵放个假 —— 面向年轻人的心理健康内容站

## 功能

- **心理科普文章**：焦虑管理、人际关系、自我成长、睡眠改善、压力应对
- **情绪自评工具**：焦虑自评、压力指数、情绪温度计（纯前端实现）
- **放松练习引导**：4-7-8 呼吸法动画 + 自助减压技巧（渐进性肌肉放松、正念冥想等）
- **治愈系 UI**：温柔治愈风设计，毛玻璃卡片，柔和色彩

## 技术栈

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3
- React Router 7

## 安装与启动

```bash
npm install
npm run dev
```

开发服务器默认启动在 `http://localhost:5173`

## 目录结构

```
src/
├── components/
│   ├── layout/       # Header, Footer, Layout
│   ├── ui/           # 基础 UI 组件
│   └── features/     # 功能组件
├── pages/            # 页面组件
│   ├── Home.tsx       # 首页
│   ├── Articles.tsx   # 文章列表
│   ├── ArticleDetail.tsx # 文章详情
│   ├── Assessment.tsx # 情绪测评
│   ├── Relax.tsx     # 放松工具
│   └── About.tsx      # 关于我们
├── data/              # 文章/测评/放松数据
└── index.css          # 全局样式
```
