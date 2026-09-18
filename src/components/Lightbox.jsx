/* 灯箱：点击项目截图后弹层放大查看
   - 多图（images 2+ 张）时可 ←/→ 或用左右箭头切换，带 01 / 02 计数
   - Esc / 点背景 / ✕ 关闭 */
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Lightbox.css";

/* 左右切换：循环取模，与卡片内切换一致 */
const wrap = (i, count) => ((i % count) + count) % count;

export default function Lightbox({
  images,
  index = 0,
  title,
  onIndex,
  onClose,
}) {
  const list = images || [];
  const count = list.length;
  const src = count ? list[index] : null;
  const multi = count > 1;

  /* 打开期间：Esc 关闭 + 左右方向键切图 + 锁定页面滚动 */
  useEffect(() => {
    if (!src) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (!multi) return;
      if (e.key === "ArrowLeft") onIndex(wrap(index - 1, count));
      if (e.key === "ArrowRight") onIndex(wrap(index + 1, count));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [src, multi, index, count, onIndex, onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={title || "查看图片"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={onClose}
        >
          <button
            className="lightbox__close mono-label"
            onClick={onClose}
            aria-label="关闭"
          >
            ✕
          </button>

          {multi && (
            <span className="lightbox__count mono-label">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          )}

          <motion.figure
            className="lightbox__figure"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={src}
                className="lightbox__img"
                src={src}
                alt={title || "项目截图"}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              />
            </AnimatePresence>
            {title && (
              <figcaption className="lightbox__title mono-label">
                {title}
              </figcaption>
            )}
          </motion.figure>

          {multi && (
            <>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                aria-label="上一张"
                onClick={(e) => {
                  e.stopPropagation();
                  onIndex(wrap(index - 1, count));
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                aria-label="下一张"
                onClick={(e) => {
                  e.stopPropagation();
                  onIndex(wrap(index + 1, count));
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
