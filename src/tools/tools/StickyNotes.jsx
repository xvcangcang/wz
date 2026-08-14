/* 便签本：内容实时保存到 localStorage，复制/两段式清空 */
import { useEffect, useRef, useState } from "react";
import CopyButton from "../../components/CopyButton.jsx";

const KEY = "tool-notes";

export default function StickyNotes() {
  const [text, setText] = useState(() => {
    try {
      return localStorage.getItem(KEY) || "";
    } catch {
      return "";
    }
  });
  const [confirming, setConfirming] = useState(false);
  const confirmTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, text);
    } catch {
      /* 忽略 */
    }
  }, [text]);

  useEffect(() => () => clearTimeout(confirmTimer.current), []);

  /* 两段式清空：第一次点击变成「再点一次清空」，3 秒后恢复，防误触 */
  const clear = () => {
    if (!confirming) {
      setConfirming(true);
      confirmTimer.current = setTimeout(() => setConfirming(false), 3000);
      return;
    }
    clearTimeout(confirmTimer.current);
    setText("");
    setConfirming(false);
  };

  return (
    <div>
      <textarea
        className="tool-textarea"
        placeholder="记点什么，会自动保存在本机浏览器…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="notes__btns">
        {text && (
          <CopyButton className="btn btn--ghost tool-btn" value={text} label="复制内容" />
        )}
        <button
          type="button"
          className="btn btn--ghost tool-btn"
          onClick={clear}
          disabled={!text}
        >
          {confirming ? "再点一次清空" : "清空"}
        </button>
      </div>
      <p className="notes__hint">{text.length} 字 · 自动保存在本机</p>
    </div>
  );
}
