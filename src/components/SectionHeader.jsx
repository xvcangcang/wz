/* 共享章节头：mono 编号 + 大标题 + 可选副标题（自带出场动效） */
import Reveal from "./Reveal.jsx";

export default function SectionHeader({ index, title, subtitle, align = "left" }) {
  return (
    <header className={`section-head section-head--${align}`}>
      <Reveal y={16}>
        <p className="section-head__index mono-label">
          <span className="accent">{index} /</span> {title}
        </p>
      </Reveal>
      <Reveal variant="line" delay={0.08}>
        <h2 className="section-head__title">{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal blur delay={0.16}>
          <p className="section-head__sub">{subtitle}</p>
        </Reveal>
      )}
    </header>
  );
}
