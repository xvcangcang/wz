/* 番茄钟：专注/休息时长可自定义（存 localStorage），SVG 圆环进度，结束时响铃三声 */
import { useEffect, useRef, useState } from "react";

const KEY = "tool-pomodoro";
const DEFAULT = { work: 25, rest: 5 };

function loadMins() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const data = JSON.parse(raw);
    const clamp = (v) => Math.min(99, Math.max(1, Math.round(Number(v) || 25)));
    return { work: clamp(data.work), rest: clamp(data.rest) };
  } catch {
    return DEFAULT;
  }
}

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
  const [mins, setMins] = useState(loadMins);
  const [mode, setMode] = useState("work");
  const [left, setLeft] = useState(loadMins().work * 60);
  const [running, setRunning] = useState(false);
  const endRef = useRef(null); // 本轮结束时间戳（毫秒）
  const prevTitleRef = useRef(null);

  const seconds = (mode === "work" ? mins.work : mins.rest) * 60;

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(mins));
    } catch {
      /* 忽略 */
    }
  }, [mins]);

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
        setLeft((next === "work" ? mins.work : mins.rest) * 60);
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [running, mode, mins]);

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
    setLeft(seconds);
  };

  const switchMode = (key) => {
    setRunning(false);
    setMode(key);
    setLeft((key === "work" ? mins.work : mins.rest) * 60);
  };

  /* 修改时长：当前模式没在跑时立即生效，跑动中则下次重置/切换时生效 */
  const changeMins = (key, value) => {
    const v = Math.min(99, Math.max(1, Math.round(Number(value) || 1)));
    setMins((prev) => ({ ...prev, [key]: v }));
    if (!running && key === mode) setLeft(v * 60);
  };

  const progress = 1 - left / seconds;

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
        {["work", "rest"].map((key) => (
          <button
            key={key}
            type="button"
            className={`btn ${mode === key ? "btn--primary" : "btn--ghost"}`}
            onClick={() => switchMode(key)}
          >
            {key === "work" ? "专注" : "休息"}
          </button>
        ))}
      </div>

      <div className="pomodoro__mins">
        <label>
          专注
          <input
            className="tool-input"
            type="number"
            min="1"
            max="99"
            value={mins.work}
            onChange={(e) => changeMins("work", e.target.value)}
            aria-label="专注时长（分钟）"
          />
          分
        </label>
        <label>
          休息
          <input
            className="tool-input"
            type="number"
            min="1"
            max="99"
            value={mins.rest}
            onChange={(e) => changeMins("rest", e.target.value)}
            aria-label="休息时长（分钟）"
          />
          分
        </label>
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
