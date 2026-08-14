/* 螺旋个人图集：滚轮切换图片 + 螺旋扫入动效
   - 滚轮用原生监听（passive:false）才能 preventDefault 阻止页面滚动，
     React 合成 wheel 事件是被动的，preventDefault 无效
   - index/direction 存在 ref 中，监听器只注册一次也不会读到过期闭包 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "../data/siteData.js";
import "./SpiralGallery.css";

const EASE = [0.22, 1, 0.36, 1];

export default function SpiralGallery() {
  const images = site.about.gallery;
  const count = images.length;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let current = 0;
    let lastWheel = 0;

    const onWheel = (e) => {
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheel < 500) return; // 节流：一次滚轮动作会连发一串事件
      lastWheel = now;
      const dir = e.deltaY > 0 ? 1 : -1;
      current = (current + dir + count) % count;
      setIndex(current);
      setDirection(dir);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [count]);

  /* 预加载前后一张：切换时新图已在缓存里，螺旋动效不卡顿 */
  useEffect(() => {
    [-1, 1].forEach((offset) => {
      const img = images[((index + offset) % count + count) % count];
      if (img) {
        const pre = new Image();
        pre.src = img.src;
      }
    });
  }, [index, images, count]);

  /* 点击圆点直接跳转 */
  const jump = (target) => {
    setDirection(target > index ? 1 : -1);
    setIndex(target);
  };

  /* 箭头按钮切换（手机触屏；桌面滚轮仍可用） */
  const step = (dir) => {
    setDirection(dir);
    setIndex((index + dir + count) % count);
  };

  return (
    <div
      ref={wrapRef}
      className="spiral-gallery"
      aria-label="个人图集：滚轮或按钮切换图片"
    >
      <div className="spiral-gallery__stage">
        <button
          className="spiral-gallery__arrow spiral-gallery__arrow--prev"
          aria-label="上一张"
          onClick={() => step(-1)}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.img
            key={index}
            className="spiral-gallery__img"
            src={images[index].src}
            alt={images[index].label}
            decoding="async"
            custom={direction}
            variants={{
              enter: (dir) => ({
                opacity: 0,
                x: dir * 90,
                y: 26,
                rotate: dir * 16,
                scale: 0.8,
                filter: "blur(6px)",
              }),
              center: {
                opacity: 1,
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
                filter: "blur(0px)",
              },
              exit: (dir) => ({
                opacity: 0,
                x: dir * -90,
                y: -26,
                rotate: dir * -16,
                scale: 0.8,
                filter: "blur(6px)",
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: EASE }}
          />
        </AnimatePresence>

        <button
          className="spiral-gallery__arrow spiral-gallery__arrow--next"
          aria-label="下一张"
          onClick={() => step(1)}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="spiral-gallery__meta">
        <span className="spiral-gallery__count mono-label">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <div className="spiral-gallery__dots">
          {images.map((img, i) => (
            <button
              key={img.src}
              className={`spiral-gallery__dot${
                i === index ? " spiral-gallery__dot--active" : ""
              }`}
              aria-label={`查看第 ${i + 1} 张`}
              onClick={() => jump(i)}
            />
          ))}
        </div>
        <span className="spiral-gallery__hint mono-label">滚轮/箭头切换</span>
      </div>
    </div>
  );
}
