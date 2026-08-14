/* 随机抽签：每行一个选项，滚动动画后定格 */
import { useEffect, useRef, useState } from "react";

export default function RandomPick() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [rolling, setRolling] = useState(false);
  const timerRef = useRef(null);

  const items = text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const roll = () => {
    if (rolling || items.length === 0) return;
    setRolling(true);
    let ticks = 0;
    /* 先快速滚动 12 帧再定格，制造抽签的悬念感 */
    timerRef.current = setInterval(() => {
      setResult(items[Math.floor(Math.random() * items.length)]);
      ticks += 1;
      if (ticks >= 12) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setRolling(false);
      }
    }, 70);
  };

  return (
    <div>
      <textarea
        className="tool-textarea"
        placeholder={"每行一个选项，例如：\n食堂\n外卖\n自己煮"}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className={`pick__result${result ? "" : " pick__result--empty"}`}>
        {result || "输入名单后点「开始抽签」"}
      </div>
      <div className="pick__meta">
        <span className="mono-label">{items.length} 个选项</span>
        <button
          type="button"
          className="btn btn--primary tool-btn"
          onClick={roll}
          disabled={rolling || items.length === 0}
        >
          {rolling ? "抽签中…" : "开始抽签"}
        </button>
      </div>
    </div>
  );
}
