import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader.jsx";
import Reveal from "./Reveal.jsx";
import { site } from "../data/siteData.js";
import "./Strengths.css";

/* 4 款手绘线性图标（24px，stroke 继承 currentColor） */
const ICONS = {
  code: (
    <>
      <path d="M9 6l-5 6 5 6" />
      <path d="M15 6l5 6-5 6" />
    </>
  ),
  blocks: (
    <>
      <path d="M9 4h4v4H9z" />
      <path d="M15 4h2a2 2 0 0 1 2 2v2h-4z" />
      <path d="M5 12h4v4H5z" />
      <path d="M13 12h4v2a2 2 0 0 1-2 2h-2z" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" />
    </>
  ),
  drone: (
    <>
      <circle cx="6" cy="7" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="6" cy="17" r="2" />
      <circle cx="18" cy="17" r="2" />
      <path d="M8 7h8" />
      <path d="M8 17h8" />
      <path d="M6 9v6" />
      <path d="M18 9v6" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
};

export default function Strengths() {
  const { strengths } = site;
  return (
    <section id="strengths" className="section strengths">
      <div className="container">
        <SectionHeader
          index={strengths.sectionIndex}
          title={strengths.sectionTitle}
        />

        <div className="strengths__grid">
          {strengths.items.map((item, i) => (
            <Reveal key={item.title} variant="card" blur delay={i * 0.1}>
              <article className="strength-card">
                <div className="strength-card__top">
                  <span className="strength-card__index mono-label">
                    0{i + 1}
                  </span>
                  <svg
                    className="strength-card__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {ICONS[item.icon]}
                  </svg>
                </div>

                <h3 className="strength-card__title">{item.title}</h3>
                <p className="strength-card__desc">{item.desc}</p>

                <div className="strength-card__meter">
                  <div className="strength-card__meter-head">
                    <span className="mono-label">熟练度</span>
                    <span className="strength-card__value mono-label">
                      {item.level}%
                    </span>
                  </div>
                  <div className="strength-card__track">
                    <motion.div
                      className="strength-card__fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.level}%` }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
