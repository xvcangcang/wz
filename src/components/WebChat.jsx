/* WebChat 聊天室：整页 iframe 嵌入 public/webchat 静态应用
   - 身份码加好友 + 实时聊天，数据走 Supabase
   - src 用相对路径（import.meta.env.BASE_URL），兼容 GitHub Pages 子路径部署
   - 导航栏固定在顶部，iframe 填满剩余视口 */
import { useEffect } from "react";
import "./WebChat.css";

export default function WebChat() {
  useEffect(() => {
    document.title = "聊天 · 许仓仓";
    return () => {
      document.title = "许仓仓 · 个人主页";
    };
  }, []);

  return (
    <section className="webchat-page">
      <iframe
        className="webchat-frame"
        src={`${import.meta.env.BASE_URL}webchat/index.html`}
        title="WebChat 聊天室"
        allow="clipboard-write"
      />
    </section>
  );
}
