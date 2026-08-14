/* 颜色工具：取色器 + HEX 输入 + RGB 显示 + 随机配色 */
import { useState } from "react";
import CopyButton from "../../components/CopyButton.jsx";

/* 接受 #abc / abc / #aabbcc 三种写法，归一为 6 位小写；非法输入返回 null */
function normalize(input) {
  let h = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(h)) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return /^[0-9a-fA-F]{6}$/.test(h) ? h.toLowerCase() : null;
}

function randomHex() {
  const bytes = new Uint8Array(3);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    bytes[0] = Math.floor(Math.random() * 256);
    bytes[1] = Math.floor(Math.random() * 256);
    bytes[2] = Math.floor(Math.random() * 256);
  }
  return `#${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export default function ColorTool() {
  const [hex, setHex] = useState("#4ec8ff"); // 最近一个有效值
  const [input, setInput] = useState("#4ec8ff"); // 输入框原样内容（可能正在输入中）

  const commit = (raw) => {
    setInput(raw);
    const norm = normalize(raw);
    if (norm) setHex(`#${norm}`);
  };

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return (
    <div>
      <div className="color__row">
        <input
          className="color__swatch"
          type="color"
          value={hex}
          onChange={(e) => commit(e.target.value)}
          aria-label="取色器"
        />
        <input
          className="tool-input"
          type="text"
          maxLength={7}
          spellCheck={false}
          value={input}
          onChange={(e) => commit(e.target.value)}
          placeholder="#4ec8ff"
          aria-label="HEX 色值"
        />
        <CopyButton className="btn btn--ghost tool-btn" value={hex} label="复制" />
      </div>
      <p className="color__rgb">
        RGB({r}, {g}, {b})
      </p>
      <div className="color__rand">
        <button
          type="button"
          className="btn btn--ghost tool-btn"
          onClick={() => commit(randomHex())}
        >
          随机配色
        </button>
      </div>
    </div>
  );
}
