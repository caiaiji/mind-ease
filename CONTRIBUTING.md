# 参与贡献 | Contributing

感谢你关注「心晴驿站 MindEase」！我们欢迎各种形式的贡献。

## 快速开始

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交改动：`git commit -m 'feat: description'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 内容贡献

我们特别欢迎以下类型的内容贡献：

### 心理学专业审校
- 对现有文章的事实核查和学术准确性审校
- 补充或修正参考文献
- 确保内容符合循证心理学原则

### 新文章撰写
- 面向学生/年轻人的心理健康科普文章
- 主题可涵盖：情绪管理、人际关系、学业压力、自我成长等
- 文章应基于已发表的研究文献，并在文末附上参考文献
- 字数建议：1500-3000 字

### 内容格式
- 文章放在 `src/data/articles.ts` 中，遵循现有 `Article` 接口
- 必须包含：`id`（唯一标识）、`title`、`summary`、`content`（Markdown）、`category`、`readTime`
- 可选包含：`coverEmoji`、`references`（参考文献数组）

## 代码贡献

### 开发环境
```bash
npm install
npm run dev
```

### 技术栈
- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3
- React Router 7 (HashRouter)

### 代码规范
- TypeScript 严格模式，提交前确保 `npx tsc --noEmit` 无错误
- 组件使用函数式组件 + Hooks
- 样式优先使用 Tailwind CSS 类名，复杂场景可用内联样式
- 新页面需在 `src/App.tsx` 中注册路由
- 新页面需使用 `useDocumentTitle` hook 设置页面标题

### Commit 规范
```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 样式调整（不影响功能）
refactor: 代码重构
chore: 构建/工具链相关
```

## 设计原则

1. **安全第一**：任何涉及用户安全的功能（如树洞、测评）必须包含危机引导和求助热线
2. **循证内容**：所有心理学科普内容必须基于已发表的学术文献或权威资料
3. **隐私保护**：用户数据存储在 localStorage，不收集任何个人身份信息到服务器
4. **温暖基调**：UI 文案应传达共情和支持，避免说教或负面暗示
5. **轻量优先**：功能实现追求轻量化，不引入不必要的依赖

## 内容审校流程

如果你是心理学专业学生或持证咨询师，希望参与内容审校：

1. 在 Issue 中标记你想审校的文章（标题或 ID）
2. 审校后通过 Pull Request 提交修改
3. 在 PR 描述中说明你的专业背景（如"心理学硕士在读"、"国家二级心理咨询师"等）
4. 维护者会在合并前确认修改的合理性

## 问题反馈

- 发现 Bug → 提交 Issue（标题使用 `[Bug]` 前缀）
- 功能建议 → 提交 Issue（标题使用 `[Feature]` 前缀）
- 内容纠错 → 提交 Issue（标题使用 `[Content]` 前缀）

## 许可

本项目采用 MIT 许可证。贡献的内容同样遵循 MIT 许可证。

---

> 无论你是开发者、心理学专业人士，还是只是想分享自己的经历和建议——
> 每一份贡献都让这个项目变得更好。谢谢你！ 💜
