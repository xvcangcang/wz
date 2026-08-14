import Reveal from "./Reveal.jsx";
import { site } from "../data/siteData.js";
import "./Hero.css";

export default function Hero() {
  const { hero } = site;
  return (
    <section id="top" className="hero">
      {/* 背景层：纯 CSS 动画；hero.videoSrc 有值时 <video> 覆盖在其上 */}
      <div className="hero__bg" aria-hidden="true">
        <div className="aurora aurora--1" />
        <div className="aurora aurora--2" />
        <div className="aurora aurora--3" />
        <div className="hero__grid" />
        {/* 使用真实视频：把 siteData.js 中 hero.videoSrc 改为视频文件地址（放 public/ 下，如 "hero.mp4"） */}
        {hero.videoSrc && (
          <video
            className="hero__video"
            src={hero.videoSrc}
            poster={hero.poster ?? undefined}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
      </div>

      <div className="container hero__content">
        <Reveal y={16}>
          <p className="hero__status mono-label">
            <span className="hero__pulse" /> {hero.statusLine}
          </p>
        </Reveal>

        <h1 className="hero__title">
          <Reveal inline blur y={40} delay={0.08}>
            {hero.titleLine1} <span className="hero__name">{hero.name}</span>
          </Reveal>
          <Reveal inline blur y={40} delay={0.18}>
            {hero.titleLine2} <span className="hero__accent">{hero.titleAccent}</span>
          </Reveal>
        </h1>

        <Reveal blur delay={0.28}>
          <p className="hero__sub">{hero.subtitle}</p>
        </Reveal>

        <Reveal delay={0.36}>
          <div className="hero__cta">
            <a className="btn btn--primary" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </a>
            <a className="btn btn--ghost" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label} ↓
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.44}>
          <ul className="hero__meta mono-label">
            {hero.meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>SCROLL</span>
        <i />
      </div>
      <p className="hero__coords mono-label" aria-hidden="true">
        31.2304° N / 121.4737° E
      </p>
    </section>
  );
}
