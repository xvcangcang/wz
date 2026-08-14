/* 日期倒计时：目标日期存 localStorage，每秒刷新天/时/分/秒 */
import { useEffect, useState } from "react";

const KEY = "tool-countdown";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (typeof data.date === "string" && data.date) return data;
    return null;
  } catch {
    return null;
  }
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function DateCountdown() {
  const [saved, setSaved] = useState(load);
  const [date, setDate] = useState(saved?.date ?? "");
  const [label, setLabel] = useState(saved?.label ?? "");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const save = () => {
    if (!date) return;
    const data = { date, label: label.trim() || "目标日" };
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* 隐私模式等场景忽略 */
    }
    setSaved(data);
  };

  const clear = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* 忽略 */
    }
    setSaved(null);
  };

  /* 目标日当天 23:59:59 为止 */
  const target = saved ? new Date(`${saved.date}T23:59:59`).getTime() : 0;
  let parts = null;
  let reached = false;
  if (target) {
    const diff = Math.max(0, target - now);
    reached = diff === 0;
    parts = {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  }

  return (
    <div>
      <div className="countdown__inputs">
        <input
          className="tool-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="目标日期"
        />
        <input
          className="tool-input"
          type="text"
          placeholder="事件名（可选）"
          maxLength={20}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button
          type="button"
          className="btn btn--ghost tool-btn"
          onClick={save}
          disabled={!date}
        >
          保存
        </button>
      </div>

      {parts ? (
        <>
          <div className="countdown__grid">
            <div className="countdown__cell">
              <b>{parts.d}</b>
              <span>天</span>
            </div>
            <div className="countdown__cell">
              <b>{pad(parts.h)}</b>
              <span>时</span>
            </div>
            <div className="countdown__cell">
              <b>{pad(parts.m)}</b>
              <span>分</span>
            </div>
            <div className="countdown__cell">
              <b>{pad(parts.s)}</b>
              <span>秒</span>
            </div>
          </div>
          <div className="countdown__meta">
            <span className="mono-label">
              {reached ? `${saved.label} · 已到达` : `距离${saved.label}`}
            </span>
            <button
              type="button"
              className="btn btn--ghost tool-btn--sm"
              onClick={clear}
            >
              清除
            </button>
          </div>
        </>
      ) : (
        <div className="countdown__empty">设置一个目标日期，开始倒数</div>
      )}
    </div>
  );
}
