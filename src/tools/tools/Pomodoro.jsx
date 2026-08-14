/* 番茄钟：25 分钟专注 + 5 分钟休息，SVG 圆环进度，结束时响铃三声 */
import { useEffect, useRef, useState } from "react";

const MODES = [
  { key: "work", label: "专注 25 分", seconds: 25 * 60 },
  { key: "rest", label: "休息 5 分", seconds: 5 * 60 },
];

const R = 84;
const CIRC = 2 * Math.PI * R;

/* Web Audio 提示音：三声短哔，音频被浏览器拦截时静默跳过 */
function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.35, 0.7].forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.25);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.3);
    });
  } catch {
    /* 忽略 */
  }
}

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Pomodoro() {
  const [mode, setMode] = useState("work");
  const [left, setLeft] = useState(MODES[0].seconds);
  const [running, setRunning] = useState(false);
  const endRef = useRef(null); // 本轮结束时间戳（毫秒）
  const prevTitleRef = useRef(null);

  const cfg = MODES.find((m) => m.key === mode);

  /* 用结束时间戳算剩余，避免 setInterval 累积漂移 */
  useEffect(() => {
    if (!running) return undefined;
    const tick = () => {
      const remain = Math.max(
        0,
        Math.round((endRef.current - performance.now()) / 1000)
      );
      setLeft(remain);
      if (remain === 0) {
        setRunning(false);
        beep();
        const next = mode === "work" ? "rest" : "work";
        setMode(next);
        setLeft(MODES.find((m) => m.key === next).seconds);
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [running, mode]);

  /* 运行时把剩余时间同步到页面标题，暂停/卸载时恢复 */
  useEffect(() => {
    if (!running) return undefined;
    if (prevTitleRef.current === null) prevTitleRef.current = document.title;
    document.title = `${fmt(left)} · 番茄钟`;
    return () => {
      document.title = prevTitleRef.current;
    };
  }, [left, running]);

  const toggle = () => {
    if (running) {
      setRunning(false);
    } else {
      endRef.current = performance.now() + left * 1000;
      setRunning(true);
    }
  };

  const reset = () => {
    setRunning(false);
    setLeft(cfg.seconds);
  };

  const switchMode = (key) => {
    setRunning(false);
    setMode(key);
    setLeft(MODES.find((m) => m.key === key).seconds);
  };

  const progress = 1 - left / cfg.seconds;

  return (
    <div>
      <div className="pomodoro__ring-wrap">
        <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="var(--surface-2)"
            strokeWidth="6"
          />
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress)}
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="pomodoro__time">{fmt(left)}</div>
      </div>

      <div className="pomodoro__modes">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            className={`btn ${mode === m.key ? "btn--primary" : "btn--ghost"}`}
            onClick={() => switchMode(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="pomodoro__controls">
        <button type="button" className="btn btn--primary" onClick={toggle}>
          {running ? "暂停" : "开始"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={reset}>
          重置
        </button>
      </div>
    </div>
  );
}
