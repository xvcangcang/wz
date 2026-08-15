import { useEffect, useState } from "react";
import { site } from "../data/siteData.js";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "关于我", href: "#about" },
  { label: "精选项目", href: "#projects" },
  { label: "个人优势", href: "#strengths" },
  { label: "工具箱", href: "#/tools" },
  /* 联系入口用右侧「联系我」按钮，文字菜单里不再重复 */
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    /* rAF 节流：滚动事件每帧最多触发一次 setState */
    let rafId = 0;
    const apply = () => setScrolled(window.scrollY > 40);
    const onScroll = () => {
      if (rafId) return; // 已排队，等下一帧再处理
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        apply();
      });
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <a
          href="#top"
          className="navbar__logo mono-label"
          onClick={() => setMenuOpen(false)}
        >
          {site.nameEn.replace(" ", "·")}
          <span className="navbar__logo-dot" />
        </a>

        <div className="navbar__right">
          <ul className="navbar__links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a className="navbar__link mono-label" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn--primary navbar__cta" href="#contact">
            联系我
          </a>

          {/* 移动端汉堡按钮（≤900px 显示） */}
          <button
            type="button"
            className={`navbar__menu-btn${menuOpen ? " navbar__menu-btn--open" : ""}`}
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {menuOpen && (
        <div className="navbar__menu">
          <div className="container">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                className="navbar__menu-link mono-label"
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              className="btn btn--primary navbar__menu-cta"
              href="#contact"
              onClick={() => setMenuOpen(false)}
            >
              联系我
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
