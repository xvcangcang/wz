/* 灯箱：点击项目截图后弹层放大查看，Esc / 点背景 / ✕ 关闭 */
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Lightbox.css";

export default function Lightbox({ image, title, onClose }) {
  /* 打开期间：Esc 关闭 + 锁定页面滚动 */
  useEffect(() => {
    if (!image) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [image, onClose]);

  return (
    <AnimatePresence>
      {image && (
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

          <motion.figure
            className="lightbox__figure"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="lightbox__img"
              src={image}
              alt={title || "项目截图"}
            />
            {title && (
              <figcaption className="lightbox__title mono-label">
                {title}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
