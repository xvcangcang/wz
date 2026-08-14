import SectionHeader from "./SectionHeader.jsx";
import Reveal from "./Reveal.jsx";
import Counter from "./Counter.jsx";
import SpiralGallery from "./SpiralGallery.jsx";
import { site } from "../data/siteData.js";
import "./About.css";

export default function About() {
  const { about } = site;
  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="about__grid">
          {/* 左列：头像 + 数据统计 */}
          <div className="about__left">
            <Reveal variant="card" blur>
              <SpiralGallery />
            </Reveal>
            <Reveal variant="card" blur delay={0.12}>
              <div className="about__stats">
                {about.stats.map((stat) => (
                  <div className="about__stat" key={stat.label}>
                    <span className="about__stat-value">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="about__stat-label mono-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* 右列：标题 + 简介 + 联系方式 */}
          <div className="about__right">
            <SectionHeader index={about.sectionIndex} title={about.sectionTitle} />

            <Reveal blur delay={0.1}>
              <h3 className="about__intro">{about.introHeading}</h3>
            </Reveal>

            {about.paragraphs.map((p, i) => (
              <Reveal blur key={p.slice(0, 12)} delay={0.16 + i * 0.08}>
                <p className="about__para">{p}</p>
              </Reveal>
            ))}

            <dl className="about__contacts">
              {about.contactItems.map((item, i) => (
                <Reveal key={item.label} delay={0.32 + i * 0.07}>
                  <div className="about__contact">
                    <dt className="mono-label">{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
