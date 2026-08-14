/* 数字滚动计数：进入视口后从 0 滚动到目标值 */
import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

export default function Counter({ value, suffix = "", duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration]);

  return (
    <span ref={ref} className="counter">
      0
    </span>
  );
}
