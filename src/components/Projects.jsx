import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "./SectionHeader.jsx";
import Reveal from "./Reveal.jsx";
import ProjectArtwork from "./ProjectArtwork.jsx";
import Lightbox from "./Lightbox.jsx";
import { site } from "../data/siteData.js";
import "./Projects.css";

/* 多图切换：项目配 2+ 张截图时媒体区启用，箭头/圆点切换（样式对齐螺旋图集）
   - 点图片本体触发 onOpen（直达应用或灯箱看大图）
   - 切换为淡入淡出，两张图绝对定位叠放避免过渡时跳动 */
function MediaSwitcher({ images, imageFit, title, viewLabel, onOpen }) {
  const [idx, setIdx] = useState(0);
  const count = images.length;
  const step = (dir) => setIdx((idx + dir + count) % count);

  return (
    <div
      className="project-card__media project-card__media--switch"
      role="button"
      tabIndex={0}
      aria-label={`${title}：${count} 张截图，可切换`}
      onClick={() => onOpen(images[idx])}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(images[idx]);
        }
      }}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={idx}
          className={`project-card__img${
            imageFit === "contain" ? " project-card__img--contain" : ""
          }`}
          src={images[idx]}
          alt={`${title} 截图 ${idx + 1}`}
          decoding="async"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </AnimatePresence>

      <button
        type="button"
        className="project-card__nav project-card__nav--prev"
        aria-label="上一张"
        onClick={(e) => {
          e.stopPropagation();
          step(-1);
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        className="project-card__nav project-card__nav--next"
        aria-label="下一张"
        onClick={(e) => {
          e.stopPropagation();
          step(1);
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="project-card__dots">
        {images.map((src, i) => (
          <button
            type="button"
            key={src}
            className={`project-card__dot${i === idx ? " project-card__dot--active" : ""}`}
            aria-label={`查看第 ${i + 1} 张`}
            onClick={(e) => {
              e.stopPropagation();
              setIdx(i);
            }}
          />
        ))}
      </div>

      <span className="project-card__count mono-label">
        {String(idx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </span>
      <span className="project-card__view">{viewLabel}</span>
    </div>
  );
}

export default function Projects() {
  const { projects } = site;
  const [activeImage, setActiveImage] = useState(null);
  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="projects__head">
          <SectionHeader
            index={projects.sectionIndex}
            title={projects.sectionTitle}
          />
          <Reveal blur delay={0.1}>
            <p className="projects__intro">{projects.intro}</p>
          </Reveal>
        </div>

        <div className="projects__grid">
          {projects.items.map((project, i) => {
            /* link 非 "#" 时媒体区直达应用；否则点击看大图 */
            const toApp = project.link && project.link !== "#";
            const imgs = project.images?.length
              ? project.images
              : project.image
                ? [project.image]
                : [];
            const media = (
              <>
                {project.image ? (
                  <img
                    className={`project-card__img${
                      project.imageFit === "contain"
                        ? " project-card__img--contain"
                        : ""
                    }`}
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <ProjectArtwork variant={project.variant} index={i} />
                )}
                <span className="project-card__view">
                  {toApp ? "打开应用 ↗" : "查看图片 ↗"}
                </span>
              </>
            );

            return (
              <Reveal key={project.id} variant="card" blur delay={i * 0.12}>
                <article className="project-card">
                  <div className="project-card__info">
                    <div className="project-card__row1">
                      <h3 className="project-card__title">{project.title}</h3>
                      <span className="project-card__year mono-label">
                        {project.year}
                      </span>
                    </div>
                    <p className="project-card__tagline mono-label">
                      {project.tagline}
                    </p>
                    <p className="project-card__desc">{project.desc}</p>
                    <p className="project-card__stack mono-label">
                      {project.stack.join(" · ")}
                    </p>
                  </div>

                  {imgs.length > 1 ? (
                    <MediaSwitcher
                      images={imgs}
                      imageFit={project.imageFit}
                      title={project.title}
                      viewLabel={toApp ? "打开应用 ↗" : "查看图片 ↗"}
                      onOpen={(src) =>
                        toApp
                          ? (window.location.hash = project.link)
                          : setActiveImage({ src, title: project.title })
                      }
                    />
                  ) : toApp ? (
                    <a
                      className="project-card__media"
                      href={project.link}
                      aria-label={`打开${project.title}`}
                    >
                      {media}
                    </a>
                  ) : (
                    <a
                      className="project-card__media"
                      href={project.image}
                      aria-label={`${project.title}（${project.type}）`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveImage({ src: project.image, title: project.title });
                      }}
                    >
                      {media}
                    </a>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      <Lightbox
        image={activeImage?.src}
        title={activeImage?.title}
        onClose={() => setActiveImage(null)}
      />
    </section>
  );
}
