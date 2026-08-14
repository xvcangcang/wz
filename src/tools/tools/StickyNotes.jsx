/* 便签本：多篇笔记，支持新建/打开/保存/删除，数据存 localStorage */
import { useEffect, useRef, useState } from "react";
import CopyButton from "../../components/CopyButton.jsx";

const KEY = "tool-notes";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    /* 兼容旧版单篇笔记（纯文本）：迁移成一篇带标题的笔记 */
    if (typeof data === "string") {
      return data ? [{ id: "n1", title: "我的便签", content: data }] : [];
    }
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function newId() {
  return `n${Date.now()}`;
}

export default function StickyNotes() {
  const [notes, setNotes] = useState(load);
  const [curId, setCurId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const flashTimer = useRef(null);
  const confirmTimer = useRef(null);

  /* 编辑实时写入 notes 并持久化；「保存」按钮作为确认反馈，切换笔记不丢内容 */
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(notes));
    } catch {
      /* 忽略 */
    }
  }, [notes]);

  useEffect(
    () => () => {
      clearTimeout(flashTimer.current);
      clearTimeout(confirmTimer.current);
    },
    []
  );

  const open = (id) => {
    setCurId(id);
    const n = notes.find((x) => x.id === id);
    setTitle(n?.title ?? "");
    setContent(n?.content ?? "");
    setConfirming(false);
  };

  const create = () => {
    const n = { id: newId(), title: "", content: "" };
    setNotes((list) => [...list, n]);
    setCurId(n.id);
    setTitle("");
    setContent("");
    setConfirming(false);
  };

  const update = (field, value) => {
    if (field === "title") setTitle(value);
    else setContent(value);
    setNotes((list) =>
      list.map((n) => (n.id === curId ? { ...n, [field]: value } : n))
    );
  };

  const save = () => {
    if (!curId) return;
    setSavedFlash(true);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setSavedFlash(false), 2000);
  };

  /* 两段式删除：第一次点击变成「再点删除」，3 秒后恢复，防误触 */
  const remove = () => {
    if (!curId) return;
    if (!confirming) {
      setConfirming(true);
      clearTimeout(confirmTimer.current);
      confirmTimer.current = setTimeout(() => setConfirming(false), 3000);
      return;
    }
    clearTimeout(confirmTimer.current);
    setNotes((list) => list.filter((n) => n.id !== curId));
    setCurId(null);
    setTitle("");
    setContent("");
    setConfirming(false);
  };

  return (
    <div>
      <div className="notes__head">
        <select
          className="tool-select"
          value={curId ?? ""}
          onChange={(e) => open(e.target.value)}
          aria-label="打开笔记"
        >
          <option value="" disabled>
            打开笔记…
          </option>
          {notes.map((n) => (
            <option key={n.id} value={n.id}>
              {n.title || "未命名"}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn--ghost tool-btn" onClick={create}>
          新建
        </button>
      </div>

      {notes.length === 0 && (
        <p className="notes__hint">还没有笔记，点「新建」写第一篇</p>
      )}

      {curId && (
        <>
          <input
            className="tool-input notes__title"
            type="text"
            placeholder="标题"
            maxLength={30}
            value={title}
            onChange={(e) => update("title", e.target.value)}
          />
          <textarea
            className="tool-textarea"
            placeholder="记点什么…"
            value={content}
            onChange={(e) => update("content", e.target.value)}
          />
          <div className="notes__btns">
            <button type="button" className="btn btn--primary tool-btn" onClick={save}>
              {savedFlash ? "已保存 ✓" : "保存"}
            </button>
            {content && (
              <CopyButton className="btn btn--ghost tool-btn" value={content} label="复制" />
            )}
            <button type="button" className="btn btn--ghost tool-btn" onClick={remove}>
              {confirming ? "再点删除" : "删除"}
            </button>
          </div>
        </>
      )}

      <p className="notes__hint">{notes.length} 篇笔记 · 保存在本机浏览器</p>
    </div>
  );
}
