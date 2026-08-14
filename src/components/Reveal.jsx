/* 出场动效封装：
   - variant="rise"（默认）：淡入上移，用于文字段落
   - variant="line"：遮罩行上移出场，用于大标题（更有张力）
   - variant="card"：淡入上移 + 轻微缩放，用于卡片/媒体块
   - blur：附带模糊渐清，更丝滑 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export default function Reveal({
  children,
  delay = 0,
  duration = 0.8,
  y = 28,
  blur = false,
  variant = "rise",
  inline = false,
  className = "",
}) {
  /* line 变体只用 framer 做进入视口观察，滑入动画交给 CSS transition：
     transform 动画在 reduced-motion 下可能被跳过，若文字藏在遮罩里会永远不可见。
     once:false → 离开视口自动滑出，回到顶部再往下滑会重新播放 */
  const lineRef = useRef(null);
  const lineInView = useInView(lineRef, { once: false, margin: "-60px" });

  /* 遮罩行上移：标题文字从下往上滑入 */
  if (variant === "line") {
    return (
      <span
        ref={lineRef}
        className={`reveal-line${lineInView ? " reveal-line--in" : ""}`}
      >
        <span style={{ transitionDelay: `${delay}s` }}>{children}</span>
      </span>
    );
  }

  const Tag = inline ? motion.span : motion.div;
  const isCard = variant === "card";

  return (
    <Tag
      className={className}
      style={inline ? { display: "block" } : undefined}
      initial={{
        opacity: 0,
        y,
        ...(isCard && { scale: 0.96 }),
        ...(blur && { filter: "blur(8px)" }),
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        ...(isCard && { scale: 1 }),
        ...(blur && { filter: "blur(0px)" }),
      }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
