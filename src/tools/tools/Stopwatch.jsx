/* 秒表：基于 performance.now 计时，支持计次列表 */
import { useEffect, useRef, useState } from "react";

function fmt(ms) {
  const cs = Math.floor(ms / 10) % 100;
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(m)}:${pad(s)}.${pad(cs)}`;
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0); // 已累计毫秒
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(0); // 本次启动时刻
  const baseRef = useRef(0); // 本次启动前已累计的毫秒

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setElapsed(baseRef.current + (performance.now() - startRef.current));
    }, 31);
    return () => clearInterval(id);
  }, [running]);

  const toggle = () => {
    if (running) {
      /* 暂停时取一次精确值，避免停在两个 tick 之间 */
      setElapsed(baseRef.current + (performance.now() - startRef.current));
      setRunning(false);
    } else {
      baseRef.current = elapsed;
      startRef.current = performance.now();
      setRunning(true);
    }
  };

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    baseRef.current = 0;
    setLaps([]);
  };

  const lap = () => {
    if (!running) return;
    const t = baseRef.current + (performance.now() - startRef.current);
    setLaps((list) => [{ n: list.length + 1, t }, ...list]);
  };

  return (
    <div>
      <div className="stopwatch__time">{fmt(elapsed)}</div>
      <div className="stopwatch__controls">
        <button type="button" className="btn btn--primary" onClick={toggle}>
          {running ? "暂停" : "开始"}
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={lap}
          disabled={!running}
        >
          计次
        </button>
        <button type="button" className="btn btn--ghost" onClick={reset}>
          复位
        </button>
      </div>
      {laps.length > 0 && (
        <div className="stopwatch__laps">
          {laps.map((l) => (
            <div className="stopwatch__lap" key={l.n}>
              <span>第 {l.n} 圈</span>
              <span>{fmt(l.t)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
