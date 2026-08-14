/* hash 路由（零依赖，兼容 GitHub Pages 子路径部署）：
   - #/tools → 工具箱页
   - 其余 hash（#top、#about…）→ 主页 + 锚点滚动 */
import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import Strengths from "./components/Strengths.jsx";
import Contact from "./components/Contact.jsx";
import Tools from "./tools/Tools.jsx";

export default function App() {
  const [route, setRoute] = useState(() =>
    window.location.hash === "#/tools" ? "tools" : "home"
  );

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#/tools") {
        setRoute("tools");
        window.scrollTo(0, 0);
        return;
      }
      setRoute("home");
      /* 从工具箱页切回主页时元素刚挂载，等渲染完成再滚动到锚点 */
      const target = window.location.hash;
      if (target && target !== "#" && target !== "#top") {
        setTimeout(() => {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView();
        }, 60);
      } else {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route === "tools") {
    return (
      <MotionConfig reducedMotion="user">
        <Navbar />
        <Tools />
        <div className="noise" aria-hidden="true" />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero /> {/* id="top" */}
        <About /> {/* id="about" */}
        <Projects /> {/* id="projects" */}
        <Strengths /> {/* id="strengths" */}
      </main>
      <Contact /> {/* id="contact" */}
      <div className="noise" aria-hidden="true" />
    </MotionConfig>
  );
}
