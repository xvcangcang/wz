/* 复制按钮：点击把内容复制到剪贴板，并短暂显示「已复制 ✓」反馈
   （mailto:/tel: 链接在未配置默认应用的电脑上点击没反应，改用复制更可靠） */
import { useEffect, useRef, useState } from "react";

export default function CopyButton({ value, label, className = "" }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // 降级方案：非安全上下文（如局域网 IP 预览）或旧浏览器
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      className={`${className} ${copied ? "copy-btn--copied" : ""}`}
      onClick={handleClick}
      title={`点击复制：${value}`}
    >
      {copied ? "已复制 ✓" : label}
    </button>
  );
}
