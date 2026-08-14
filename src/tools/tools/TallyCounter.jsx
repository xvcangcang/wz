/* 计数打卡：数字存 localStorage，刷新页面不丢 */
import { useEffect, useState } from "react";

const KEY = "tool-tally";

export default function TallyCounter() {
  const [n, setN] = useState(() => {
    try {
      const v = parseInt(localStorage.getItem(KEY), 10);
      return Number.isFinite(v) && v >= 0 ? v : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, String(n));
    } catch {
      /* 忽略 */
    }
  }, [n]);

  return (
    <div>
      <div className="tally__num">{n}</div>
      <div className="tally__btns">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setN((v) => Math.max(0, v - 1))}
        >
          −1
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setN(0)}>
          重置
        </button>
        <button type="button" className="btn btn--primary" onClick={() => setN((v) => v + 1)}>
          +1
        </button>
      </div>
    </div>
  );
}
