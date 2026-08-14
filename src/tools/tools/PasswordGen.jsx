/* 密码生成器：crypto 强随机，勾选的每类字符至少出现一次，全部在前端完成 */
import { useEffect, useState } from "react";
import CopyButton from "../../components/CopyButton.jsx";

const SETS = [
  { key: "lower", label: "小写", chars: "abcdefghijklmnopqrstuvwxyz" },
  { key: "upper", label: "大写", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  { key: "digit", label: "数字", chars: "0123456789" },
  { key: "symbol", label: "符号", chars: "!@#$%^&*()-_=+[]{};:,.<>?" },
];

function randomByte() {
  if (window.crypto?.getRandomValues) {
    const arr = new Uint8Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0];
  }
  return Math.floor(Math.random() * 256);
}

/* 拒绝采样消除取模偏差：只接受 0-255 里字符集长度的整倍数区间 */
function pickChar(chars) {
  const limit = 256 - (256 % chars.length);
  let b;
  do {
    b = randomByte();
  } while (b >= limit);
  return chars[b % chars.length];
}

export default function PasswordGen() {
  const [len, setLen] = useState(16);
  const [selected, setSelected] = useState(["lower", "upper", "digit", "symbol"]);
  const [pwd, setPwd] = useState("");

  const generate = () => {
    const pool = SETS.filter((s) => selected.includes(s.key));
    const charset = pool.map((s) => s.chars).join("");
    /* 每类先各取一个，其余随机填充，再洗牌，保证勾选的字符集都出现 */
    const chars = pool.map((s) => pickChar(s.chars));
    while (chars.length < len) chars.push(pickChar(charset));
    for (let i = chars.length - 1; i > 0; i -= 1) {
      const j = Math.floor((randomByte() / 256) * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    setPwd(chars.join(""));
  };

  /* 长度或字符集变化时自动重新生成 */
  useEffect(() => {
    generate();
  }, [len, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (key) => {
    setSelected((list) => {
      if (list.includes(key)) {
        return list.length > 1 ? list.filter((k) => k !== key) : list; // 至少保留一类
      }
      return [...list, key];
    });
  };

  const charsetSize = SETS.filter((s) => selected.includes(s.key)).reduce(
    (n, s) => n + s.chars.length,
    0
  );
  const bits = Math.round(len * Math.log2(charsetSize)); // 信息熵（位）
  const level = bits >= 80 ? "强" : bits >= 50 ? "中" : "弱";
  const pct = Math.min(100, Math.round((bits / 80) * 100));

  return (
    <div>
      <div className="pwgen__out">
        <div className="pwgen__value">{pwd}</div>
        <CopyButton className="btn btn--ghost tool-btn" value={pwd} label="复制" />
      </div>

      <div className="pwgen__len">
        <span className="mono-label">长度</span>
        <input
          className="tool-range"
          type="range"
          min="8"
          max="32"
          value={len}
          onChange={(e) => setLen(Number(e.target.value))}
          aria-label="密码长度"
        />
        <b>{len}</b>
      </div>

      <div className="pwgen__sets">
        {SETS.map((s) => (
          <label className="tool-label" key={s.key}>
            <input
              className="tool-check"
              type="checkbox"
              checked={selected.includes(s.key)}
              onChange={() => toggle(s.key)}
            />
            {s.label}
          </label>
        ))}
      </div>

      <div className="pwgen__strength">
        <span className="mono-label">
          强度 {level}（{bits} bit）
        </span>
        <div className="pwgen__bar">
          <i style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="color__rand">
        <button type="button" className="btn btn--ghost tool-btn" onClick={generate}>
          重新生成
        </button>
      </div>
    </div>
  );
}
