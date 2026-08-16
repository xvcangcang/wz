/* AI 对话：自带 API Key 的聊天工具
   - 兼容 OpenAI 格式的接口（DeepSeek / OpenAI / Kimi / 自定义地址）
   - 流式输出（打字机效果），对话自动保存在本机浏览器
   - 导出 JSON（可重新导入）/ 导出 Markdown，导入 JSON 恢复对话
   - API Key 只存本机 localStorage，对话请求直接发给所选服务商 */
import { useEffect, useRef, useState } from "react";

const LS_SETTINGS = "ai-chat-settings";
const LS_MESSAGES = "ai-chat-messages";

const SYSTEM_PROMPT = "你是一个乐于助人、友善的 AI 助手，请用简洁清晰的中文回答。";

const PROVIDERS = [
  { id: "deepseek", label: "DeepSeek", baseUrl: "https://api.deepseek.com/v1", model: "deepseek-chat" },
  { id: "openai", label: "OpenAI", baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini" },
  { id: "moonshot", label: "Kimi 月之暗面", baseUrl: "https://api.moonshot.cn/v1", model: "moonshot-v1-8k" },
  { id: "custom", label: "自定义", baseUrl: "", model: "" },
];

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 隐私模式等场景可能写不进去，忽略 */
  }
}

/* 先整体转义 HTML 再做轻量 markdown 替换，避免 XSS；代码块用占位符保护 */
function mdLite(src) {
  const esc = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const blocks = [];
  let out = esc.replace(/```([\s\S]*?)```/g, (_, code) => {
    blocks.push(code);
    return `\u0000${blocks.length - 1}\u0000`;
  });
  out = out
    .replace(/`([^`\n]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    .replace(/^### (.+)$/gm, "<h5>$1</h5>")
    .replace(/^## (.+)$/gm, "<h4>$1</h4>")
    .replace(/^# (.+)$/gm, "<h3>$1</h3>")
    .replace(/^\s*[-*] (.+)$/gm, "• $1");
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => `<pre><code>${blocks[Number(i)]}</code></pre>`);
}

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function download(text, filename, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AiChat() {
  const [settings, setSettings] = useState(() => load(LS_SETTINGS, { ...PROVIDERS[0], apiKey: "" }));
  const [messages, setMessages] = useState(() => load(LS_MESSAGES, []));
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  /* 从未配置过 API Key 时默认展开设置面板 */
  const [showSettings, setShowSettings] = useState(() => !load(LS_SETTINGS, null)?.apiKey);
  const [draft, setDraft] = useState(settings);
  const msgsRef = useRef(null);
  const abortRef = useRef(null);
  const fileRef = useRef(null);

  /* 对话变化时自动保存 + 滚动到底部 */
  useEffect(() => {
    save(LS_MESSAGES, messages);
    const el = msgsRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* 成功提示 3 秒后自动消失 */
  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(""), 3000);
    return () => clearTimeout(t);
  }, [note]);

  /* 组件卸载时中断进行中的请求 */
  useEffect(() => () => abortRef.current?.abort(), []);

  const onProvider = (e) => {
    const p = PROVIDERS.find((x) => x.id === e.target.value);
    setDraft((d) => ({
      ...d,
      provider: p.id,
      baseUrl: p.id === "custom" ? d.baseUrl : p.baseUrl,
      model: p.id === "custom" ? d.model : p.model,
    }));
  };

  const saveSettings = () => {
    const baseUrl = draft.baseUrl.trim().replace(/\/+$/, "");
    const model = draft.model.trim();
    if (!baseUrl || !model) {
      setError("请填写完整的接口地址和模型名");
      return;
    }
    if (!draft.apiKey.trim()) {
      setError("请填写 API Key");
      return;
    }
    const next = { provider: draft.provider, baseUrl, model, apiKey: draft.apiKey.trim() };
    setSettings(next);
    save(LS_SETTINGS, next);
    setShowSettings(false);
    setError("");
    setNote("设置已保存");
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    if (!settings.apiKey) {
      setShowSettings(true);
      setError("请先在设置里填写 API Key");
      return;
    }
    const history = [
      ...messages,
      { role: "user", content: text, ts: Date.now() },
      { role: "assistant", content: "", ts: Date.now() },
    ];
    setMessages(history);
    setInput("");
    setBusy(true);
    setError("");

    abortRef.current = new AbortController();
    /* 发给接口的消息不含空的占位回复 */
    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history
        .filter((m) => !(m.role === "assistant" && m.content === ""))
        .map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      const res = await fetch(`${settings.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({ model: settings.model, messages: apiMessages, stream: true }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        let detail = "";
        try {
          detail = (await res.json())?.error?.message || "";
        } catch {
          /* 响应不是 JSON，忽略 */
        }
        const hint = detail ? `：${detail}` : "";
        if (res.status === 401 || res.status === 403) {
          throw new Error(`API Key 无效或无权限（${res.status}）${hint}`);
        }
        if (res.status === 429) {
          throw new Error("请求过于频繁，请稍后再试（429）");
        }
        throw new Error(`请求失败（${res.status}）${hint}`);
      }
      if (!res.body) {
        throw new Error("当前浏览器不支持流式响应，请换用最新版浏览器");
      }

      /* 流式解析 SSE：按行切分，累积 delta.content */
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") {
            reader.cancel().catch(() => {});
            return;
          }
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              history[history.length - 1].content = acc;
              setMessages([...history]);
            }
          } catch {
            /* 忽略无法解析的行 */
          }
        }
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
      /* 出错时移除空的占位回复，用户可重发 */
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        return last && last.role === "assistant" && last.content === "" ? prev.slice(0, -1) : prev;
      });
      const msg = err?.message || "请求失败";
      setError(
        /fetch/i.test(msg)
          ? "请求失败：可能是网络不通，或该服务商不允许浏览器直连（CORS），请检查接口地址"
          : msg
      );
    } finally {
      setBusy(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  const exportJson = () => {
    if (!messages.length) {
      setError("当前没有可导出的对话");
      return;
    }
    const payload = {
      app: "ai-chat",
      version: 1,
      exportedAt: new Date().toISOString(),
      provider: settings.provider,
      baseUrl: settings.baseUrl,
      model: settings.model,
      messages,
    };
    download(JSON.stringify(payload, null, 2), `ai-chat-${stamp()}.json`, "application/json;charset=utf-8");
    setNote("已导出 JSON（可重新导入）");
  };

  const exportMarkdown = () => {
    if (!messages.length) {
      setError("当前没有可导出的对话");
      return;
    }
    const head = `# AI 对话导出\n\n导出时间：${new Date().toLocaleString("zh-CN", { hour12: false })}\n模型：${settings.model}（${settings.baseUrl}）\n\n`;
    const body = messages
      .map((m) => {
        const who = m.role === "user" ? "我" : "AI";
        const t = new Date(m.ts).toLocaleString("zh-CN", { hour12: false });
        return `## ${who}（${t}）\n\n${m.content}`;
      })
      .join("\n\n---\n\n");
    download(`${head}${body}\n`, `ai-chat-${stamp()}.md`, "text/markdown;charset=utf-8");
    setNote("已导出 Markdown");
  };

  const onImport = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const list = Array.isArray(data) ? data : data.messages;
        if (!Array.isArray(list)) throw new Error("文件里没有 messages 字段");
        const clean = list
          .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .map((m) => ({ role: m.role, content: m.content, ts: m.ts || Date.now() }));
        if (!clean.length) throw new Error("没有找到有效的对话消息");
        setMessages(clean);
        /* 恢复导出时的服务商/地址/模型，但绝不覆盖本机已保存的 API Key */
        if (!Array.isArray(data) && data.baseUrl) {
          const next = {
            ...settings,
            provider: data.provider || settings.provider,
            baseUrl: data.baseUrl,
            model: data.model || settings.model,
          };
          setSettings(next);
          save(LS_SETTINGS, next);
        }
        setNote(`已导入 ${clean.length} 条消息`);
      } catch (err) {
        setError(`导入失败：${err?.message || "文件格式不对"}`);
      }
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    if (!messages.length) return;
    if (window.confirm("确定清空当前对话吗？此操作不可恢复。")) {
      setMessages([]);
      setNote("对话已清空");
    }
  };

  const providerLabel = PROVIDERS.find((p) => p.id === settings.provider)?.label || "自定义";

  return (
    <div className="chat">
      {/* 工具条：模型信息 + 操作按钮 */}
      <div className="chat__bar">
        <span className="mono-label chat__model" title={`${settings.baseUrl} · ${settings.model}`}>
          {providerLabel} · {settings.model}
          {messages.length > 0 && <span className="chat__count">{messages.length} 条</span>}
        </span>
        <div className="chat__bar-btns">
          <button
            type="button"
            className="btn btn--ghost tool-btn tool-btn--sm"
            onClick={() => setShowSettings((v) => !v)}
          >
            {showSettings ? "收起设置" : "设置"}
          </button>
          <button type="button" className="btn btn--ghost tool-btn tool-btn--sm" onClick={exportJson}>
            导出 JSON
          </button>
          <button type="button" className="btn btn--ghost tool-btn tool-btn--sm" onClick={exportMarkdown}>
            导出 Markdown
          </button>
          <button type="button" className="btn btn--ghost tool-btn tool-btn--sm" onClick={() => fileRef.current?.click()}>
            导入
          </button>
          <button type="button" className="btn btn--ghost tool-btn tool-btn--sm" onClick={clearAll}>
            清空
          </button>
        </div>
        <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={onImport} />
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <div className="chat__settings">
          <div className="chat__set-grid">
            <label className="chat__field">
              <span>服务商</span>
              <select className="tool-select" value={draft.provider} onChange={onProvider}>
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="chat__field">
              <span>API Key</span>
              <input
                className="tool-input"
                type="password"
                value={draft.apiKey}
                onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
                placeholder="sk-..."
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <label className="chat__field">
              <span>接口地址（Base URL）</span>
              <input
                className="tool-input"
                type="text"
                value={draft.baseUrl}
                onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })}
                placeholder="https://api.deepseek.com/v1"
                spellCheck={false}
              />
            </label>
            <label className="chat__field">
              <span>模型</span>
              <input
                className="tool-input"
                type="text"
                value={draft.model}
                onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                placeholder="deepseek-chat"
                spellCheck={false}
              />
            </label>
          </div>
          <div className="chat__set-btns">
            <button type="button" className="btn btn--primary tool-btn" onClick={saveSettings}>
              保存设置
            </button>
            <button type="button" className="btn btn--ghost tool-btn" onClick={() => setShowSettings(false)}>
              取消
            </button>
          </div>
        </div>
      )}

      {/* 错误 / 成功提示 */}
      {(error || note) && (
        <div className={`chat__banner ${error ? "chat__banner--err" : "chat__banner--ok"}`}>
          <span>{error || note}</span>
          <button
            type="button"
            className="chat__banner-x"
            onClick={() => {
              setError("");
              setNote("");
            }}
            aria-label="关闭提示"
          >
            ✕
          </button>
        </div>
      )}

      {/* 消息区 */}
      <div className="chat__msgs" ref={msgsRef}>
        {messages.length === 0 && (
          <div className="chat__empty">
            还没有对话，输入第一句话开始吧～
            <br />
            首次使用请先在「设置」里填写自己的 API Key。
          </div>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div className="chat__msg chat__msg--user" key={i}>
              {m.content}
            </div>
          ) : m.content ? (
            <div
              className="chat__msg chat__msg--ai"
              key={i}
              dangerouslySetInnerHTML={{ __html: mdLite(m.content) }}
            />
          ) : (
            <div className="chat__msg chat__msg--ai" key={i}>
              <span className="chat__thinking">正在思考</span>
            </div>
          )
        )}
      </div>

      {/* 输入区 */}
      <div className="chat__composer">
        <textarea
          className="chat__input"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="输入消息，Enter 发送，Shift+Enter 换行"
          disabled={busy}
          aria-label="消息输入框"
        />
        <button
          type="button"
          className="btn btn--primary chat__send"
          onClick={send}
          disabled={busy || !input.trim()}
        >
          {busy ? "思考中…" : "发送"}
        </button>
      </div>

      <p className="chat__hint">
        API Key 只保存在本机浏览器，对话请求直接发送给所选服务商，本站不存储任何数据。
      </p>
    </div>
  );
}
