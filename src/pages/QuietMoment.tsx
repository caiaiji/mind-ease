import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

// 温柔的句子集合
const gentleSentences = [
  '你不需要做任何事，在这里安静待一会儿就好。',
  '你已经很努力了，允许自己什么都不做。',
  '此刻的你，值得被温柔以待。',
  '深呼吸，让一切慢慢来。',
  '不着急，时间会陪你等。',
  '你比想象中更勇敢。',
  '慢慢来，比较快。',
  '今天的你，做得已经够好了。',
  '没有什么必须完成的，此刻只是存在就好。',
  '世界很大，而这里很安静。',
  '你值得拥有这段安静的时光。',
  '累了就休息，这不是偷懒，是爱护自己。',
  '闭上眼睛，感受呼吸的节奏。',
  '每一个平凡的日子，都有温柔的一面。',
  '允许自己脆弱，也是一种力量。',
  '你现在所处的地方，就是你该在的地方。',
];

// 背景渐变主题 —— 模拟一天的光影变化
const scenes = [
  { name: '清晨', colors: ['#fceabb', '#f8b500', '#f09819', '#fceabb'], dur: 25 },
  { name: '正午', colors: ['#a8edea', '#fed6e3', '#d4fc79', '#96e6a1'], dur: 25 },
  { name: '黄昏', colors: ['#f7971e', '#ffd200', '#ee9ca7', '#ffdde1'], dur: 25 },
  { name: '星夜', colors: ['#0c0e1a', '#1a1a3e', '#2d1b69', '#0c0e1a'], dur: 25 },
];

// Web Audio 生成柔和白噪音 + 低频嗡鸣
class AmbientSound {
  private ctx: AudioContext | null = null;
  private noise: AudioBufferSourceNode | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;

  async start() {
    if (this.ctx) return;
    this.ctx = new AudioContext();

    // 白噪音（低通滤波后）
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    this.noise = this.ctx.createBufferSource();
    this.noise.buffer = buffer;
    this.noise.loop = true;

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 400;

    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0;

    // Fade in
    this.gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 2);

    this.noise.connect(this.filter);
    this.filter.connect(this.gain);
    this.gain.connect(this.ctx.destination);
    this.noise.start();

    // 低频正弦波（柔和嗡鸣）
    this.osc = this.ctx.createOscillator();
    this.osc.type = 'sine';
    this.osc.frequency.value = 80;
    const oscGain = this.ctx.createGain();
    oscGain.gain.value = 0.06;
    this.osc.connect(oscGain);
    oscGain.connect(this.gain);
    this.osc.start();
  }

  async stop() {
    if (!this.ctx || !this.gain) return;
    this.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);
    await new Promise(resolve => setTimeout(resolve, 1600));
    this.noise?.stop();
    this.osc?.stop();
    this.ctx.close();
    this.ctx = null;
    this.noise = null;
    this.osc = null;
    this.gain = null;
    this.filter = null;
  }
}

const QuietMoment: React.FC = () => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [sentenceVisible, setSentenceVisible] = useState(true);
  const [fadeBg, setFadeBg] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const soundRef = useRef<AmbientSound | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scene = scenes[sceneIndex];

  // 场景切换
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeBg(false);
      setTimeout(() => {
        setSceneIndex(prev => (prev + 1) % scenes.length);
        setFadeBg(true);
      }, 2000);
    }, scene.dur * 1000);
    return () => clearInterval(interval);
  }, [sceneIndex]);

  // 句子切换（每8秒换一句）
  useEffect(() => {
    const interval = setInterval(() => {
      setSentenceVisible(false);
      setTimeout(() => {
        setSentenceIndex(prev => (prev + 1) % gentleSentences.length);
        setSentenceVisible(true);
      }, 1500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // 计时
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // 隐藏提示
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // 声音开关
  const toggleSound = useCallback(async () => {
    if (soundOn) {
      await soundRef.current?.stop();
      soundRef.current = null;
      setSoundOn(false);
    } else {
      const s = new AmbientSound();
      soundRef.current = s;
      await s.start();
      setSoundOn(true);
    }
  }, [soundOn]);

  // 清理
  useEffect(() => {
    return () => {
      soundRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const bgStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${scene.colors.join(', ')})`,
    transition: 'background 2s ease-in-out, opacity 2s ease-in-out',
    opacity: fadeBg ? 1 : 0.6,
  };

  // 星夜场景的额外星星
  const isNight = sceneIndex === 3;

  return (
    <div className="fixed inset-0 overflow-hidden" style={bgStyle}>
      {/* 星星（仅星夜） */}
      {isNight && (
        <div className="absolute inset-0">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 光斑（清晨/黄昏） */}
      {(sceneIndex === 0 || sceneIndex === 2) && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute rounded-full"
            style={{
              width: '300px',
              height: '300px',
              background: sceneIndex === 0
                ? 'radial-gradient(circle, rgba(255,220,100,0.4) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255,140,50,0.3) 0%, transparent 70%)',
              top: '15%',
              right: '10%',
              filter: 'blur(40px)',
              animation: 'floatBlob 12s ease-in-out infinite alternate',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: '200px',
              height: '200px',
              background: sceneIndex === 0
                ? 'radial-gradient(circle, rgba(255,200,80,0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255,100,50,0.2) 0%, transparent 70%)',
              bottom: '30%',
              left: '15%',
              filter: 'blur(30px)',
              animation: 'floatBlob 10s ease-in-out infinite alternate-reverse',
            }}
          />
        </div>
      )}

      {/* 呼吸引导圆 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="rounded-full"
          style={{
            width: '120px',
            height: '120px',
            background: isNight
              ? 'radial-gradient(circle, rgba(100,100,180,0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
            animation: 'breathe 6s ease-in-out infinite',
          }}
        />
      </div>

      {/* 句子 */}
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <p
          className="text-center max-w-lg leading-relaxed font-light select-none"
          style={{
            fontSize: '1.25rem',
            color: isNight ? 'rgba(200,200,230,0.9)' : 'rgba(80,60,40,0.85)',
            transition: 'opacity 1.5s ease-in-out',
            opacity: sentenceVisible ? 1 : 0,
            textShadow: isNight ? '0 0 20px rgba(100,100,180,0.3)' : '0 1px 8px rgba(255,255,255,0.5)',
          }}
        >
          {gentleSentences[sentenceIndex]}
        </p>
      </div>

      {/* 计时器 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <span
          className="font-mono text-sm tracking-widest select-none"
          style={{
            color: isNight ? 'rgba(180,180,210,0.5)' : 'rgba(100,80,60,0.4)',
          }}
        >
          {formatTime(timeElapsed)}
        </span>
      </div>

      {/* 底部控制栏 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
        {/* 声音开关 */}
        <button
          onClick={toggleSound}
          className="transition-all duration-300 hover:scale-110 active:scale-95"
          style={{ color: isNight ? 'rgba(180,180,210,0.5)' : 'rgba(100,80,60,0.45)' }}
          title={soundOn ? '关闭声音' : '打开声音'}
        >
          {soundOn ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        {/* 返回首页 */}
        <Link
          to="/"
          className="transition-all duration-300 hover:scale-110 active:scale-95 text-xs tracking-wide"
          style={{ color: isNight ? 'rgba(180,180,210,0.4)' : 'rgba(100,80,60,0.35)' }}
        >
          返回
        </Link>
      </div>

      {/* 入场提示 */}
      <div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 transition-opacity duration-1000"
        style={{ opacity: showHint ? 0.4 : 0 }}
      >
        <span
          className="text-xs select-none"
          style={{ color: isNight ? 'rgba(180,180,210,0.6)' : 'rgba(100,80,60,0.5)' }}
        >
          什么都不需要做，安静待一会儿就好
        </span>
      </div>
    </div>
  );
};

export default QuietMoment;
