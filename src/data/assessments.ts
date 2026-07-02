export interface Question {
  id: number
  text: string
  options: { label: string; score: number }[]
}

export interface AssessmentType {
  id: string
  title: string
  description: string
  emoji: string
  questions: Question[]
  getResult: (total: number) => { level: string; color: string; description: string; suggestions: string[] }
}

export const assessments: AssessmentType[] = [
  {
    id: 'anxiety',
    title: '焦虑自评',
    description: '了解你最近的焦虑程度，获取个性化建议',
    emoji: '😰',
    questions: [
      { id: 1, text: '最近两周，你是否经常感到紧张、不安或烦躁？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 2, text: '你是否难以停止或控制担忧？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 3, text: '你是否对很多事情过度担心？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 4, text: '你是否感到坐立不安？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 5, text: '你是否容易感到疲劳或精力不足？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 6, text: '你是否难以集中注意力？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 7, text: '你是否容易烦躁或发脾气？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 8, text: '你是否感到肌肉紧张？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
    ],
    getResult(total) {
      if (total <= 5) return { level: '轻度', color: 'mint', description: '你的焦虑程度较低，整体心态比较平和。这是很好的状态，继续保持哦！', suggestions: ['继续保持健康的生活方式', '定期做一些放松活动作为日常保养'] }
      if (total <= 12) return { level: '中度', color: 'lavender', description: '你最近可能感受到一些压力和焦虑，这在忙碌的学生生活中很常见。建议多关注自己的情绪状态。', suggestions: ['尝试每天 10 分钟的深呼吸或冥想', '和信任的朋友聊聊你的感受', '保证充足的睡眠和规律运动', '适当减少不必要的压力源'] }
      return { level: '较高', color: 'peach', description: '你的焦虑程度偏高，这可能会影响日常生活和学习效率。请重视自己的心理状态，积极采取应对措施。', suggestions: ['学习并实践放松技巧（如渐进性肌肉放松）', '减少咖啡因摄入，避免刺激神经系统', '坚持规律运动，运动是天然的抗焦虑剂', '如果持续感到困扰，建议寻求专业心理咨询帮助', '全国心理援助热线：400-161-9995'] }
    },
  },
  {
    id: 'stress',
    title: '压力指数',
    description: '评估你当前的压力水平，找到适合的减压方式',
    emoji: '💫',
    questions: [
      { id: 1, text: '你是否感到有太多事情要做，时间不够用？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 2, text: '你是否因为学业或工作感到不堪重负？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 3, text: '你是否觉得自己无法有效应对生活中的重要问题？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 4, text: '你是否经常感到事情不如预期那样顺利？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 5, text: '你是否感到自己无法控制生活中重要的事情？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 6, text: '你是否觉得自己遇到的困难堆积如山，无法克服？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 7, text: '你是否觉得信心满满的事情也越来越不确定？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
      { id: 8, text: '你是否感到自己无法应付日常事务？', options: [{ label: '几乎没有', score: 0 }, { label: '偶尔有', score: 1 }, { label: '经常有', score: 2 }, { label: '几乎每天都有', score: 3 }] },
    ],
    getResult(total) {
      if (total <= 5) return { level: '低压力', color: 'mint', description: '你的压力水平较低，能够较好地应对生活中的各种挑战。继续保持良好的压力管理习惯！', suggestions: ['保持当前的生活节奏', '适当做一些预防性的放松活动'] }
      if (total <= 12) return { level: '中等压力', color: 'lavender', description: '你正在经历一定程度的压力，这在学生生活中很常见。学会识别压力信号，及时调整，可以防止压力累积。', suggestions: ['列出待办事项，按优先级排序', '每天安排 30 分钟纯休息时间', '和亲友分享你的感受', '尝试运动或户外活动来释放压力'] }
      return { level: '高压', color: 'peach', description: '你的压力水平偏高，长期处于高压力状态会对身心健康产生负面影响。请认真对待，采取积极的减压措施。', suggestions: ['重新评估和调整你的目标和期望', '学会说"不"，减少不必要的负担', '保证每天有足够的休息和睡眠', '尝试正念冥想或瑜伽等减压方法', '如果感到难以承受，请及时寻求帮助：400-161-9995'] }
    },
  },
  {
    id: 'mood',
    title: '情绪温度计',
    description: '快速检查你近期的整体情绪状态',
    emoji: '🌡',
    questions: [
      { id: 1, text: '最近两周，你大部分时间的心情是？', options: [{ label: '愉快而平静', score: 0 }, { label: '还好，有起有落', score: 1 }, { label: '比较低落', score: 2 }, { label: '很难开心起来', score: 3 }] },
      { id: 2, text: '你对平时喜欢做的事情还有兴趣吗？', options: [{ label: '和以前一样有兴趣', score: 0 }, { label: '稍微有点兴趣', score: 1 }, { label: '兴趣明显减少', score: 2 }, { label: '完全不想做', score: 3 }] },
      { id: 3, text: '你的睡眠质量如何？', options: [{ label: '很好，一觉到天亮', score: 0 }, { label: '偶尔不好', score: 1 }, { label: '经常失眠或早醒', score: 2 }, { label: '严重失眠', score: 3 }] },
      { id: 4, text: '你的食欲如何？', options: [{ label: '正常', score: 0 }, { label: '偶尔不太好', score: 1 }, { label: '明显减少或增加', score: 2 }, { label: '变化很大', score: 3 }] },
      { id: 5, text: '你对自己怎么看？', options: [{ label: '整体满意', score: 0 }, { label: '有些不满意', score: 1 }, { label: '比较自卑', score: 2 }, { label: '觉得自己很差劲', score: 3 }] },
      { id: 6, text: '你能否集中注意力做事？', options: [{ label: '可以很好地集中', score: 0 }, { label: '偶尔分心', score: 1 }, { label: '经常走神', score: 2 }, { label: '很难集中精力', score: 3 }] },
    ],
    getResult(total) {
      if (total <= 4) return { level: '情绪良好', color: 'mint', description: '你的整体情绪状态很好！保持积极的心态，继续做自己喜欢的事情。', suggestions: ['继续维持当前健康的生活习惯', '多和让你感到愉快的人相处'] }
      if (total <= 10) return { level: '情绪波动', color: 'lavender', description: '你的情绪近期出现了一些波动，这可能是压力、疲劳或环境变化引起的。关注自己的感受，适当调整节奏。', suggestions: ['每天记录 3 件让你感恩的小事', '保持规律作息和运动', '减少社交媒体使用时间', '找信任的朋友倾诉'] }
      return { level: '需要关注', color: 'peach', description: '你的情绪状态需要认真关注。持续的低落情绪可能影响你的生活质量和身体健康。请善待自己，积极寻求支持。', suggestions: ['不要独自承受，告诉信任的人你的感受', '保持基本的作息规律，即使不想动也尽量起来走走', '做一些简单的事给自己成就感', '持续两周以上无改善，建议联系心理咨询中心', '紧急情况请拨打：400-161-9995'] }
    },
  },
]
