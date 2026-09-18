import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "./SectionHeader.jsx";
import Reveal from "./Reveal.jsx";
import ProjectArtwork from "./ProjectArtwork.jsx";
import Lightbox from "./Lightbox.jsx";
import { site } from "../data/siteData.js";
import "./Projects.css";

/* 多图切换：项目配 2+ 张截图时媒体区启用，箭头/圆点切换
   - 切换动效与「My life」螺旋图集同款：滑动 + 旋转 + 模糊
   - 点图片本体触发 onOpen（直达应用或灯箱看大图） */
const SWITCH_EASE = [0.22, 1, 0.36, 1];

function MediaSwitcher({ images, imageFit, title, viewLabel, onOpen, onOpenApp }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const count = images.length;
  const step = (d) => {
    setDir(d);
    setIdx((idx + d + count) % count);
  };
  /* 圆点直达：按目标方位决定划入方向 */
  const jump = (target) => {
    setDir(target > idx ? 1 : -1);
    setIdx(target);
  };

  /* 预加载全部截图：切换时新图已在缓存里，动效不卡顿（同螺旋图集） */
  useEffect(() => {
    images.forEach((src) => {
      const im = new Image();
      im.src = src;
    });
  }, [images]);

  return (
    <div
      className="project-card__media project-card__media--switch"
      role="button"
      tabIndex={0}
      aria-label={`${title}：${count} 张截图，${onOpenApp ? "单击看大图，双击打开应用" : "单击看大图"}`}
      onClick={() => onOpen(images[idx])}
      onDoubleClick={onOpenApp}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(images[idx]);
        }
      }}
    >
      <AnimatePresence custom={dir} initial={false}>
        <motion.div
          key={idx}
          className="project-card__switch-layer"
          custom={dir}
          variants={{
            enter: (d) => ({
              opacity: 0,
              x: d * 90,
              y: 26,
              rotate: d * 16,
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
            exit: (d) => ({
              opacity: 0,
              x: d * -90,
              y: -26,
              rotate: d * -16,
              scale: 0.8,
              filter: "blur(6px)",
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: SWITCH_EASE }}
        >
          <img
            className={`project-card__img${
              imageFit === "contain" ? " project-card__img--contain" : ""
            }`}
            src={images[idx]}
            alt={`${title} 截图 ${idx + 1}`}
            decoding="async"
          />
        </motion.div>
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
              jump(i);
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
  /* activeLightbox: { projectId, index } | null */
  const [activeLightbox, setActiveLightbox] = useState(null);
  const activeProject = activeLightbox
    ? projects.items.find((p) => p.id === activeLightbox.projectId)
    : null;
  const activeImages = activeProject?.images?.length
    ? activeProject.images
    : activeProject?.image
      ? [activeProject.image]
      : [];

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
                      viewLabel={toApp ? "查看大图 / 双击打开应用" : "单击看大图"}
                      onOpen={(src) =>
                        setActiveLightbox({
                          projectId: project.id,
                          index: imgs.indexOf(src),
                        })
                      }
                      onOpenApp={
                        toApp ? () => (window.location.hash = project.link) : undefined
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
                        setActiveLightbox({ projectId: project.id, index: 0 });
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
        images={activeImages}
        index={activeLightbox?.index ?? 0}
        title={activeProject?.title}
        onIndex={(i) =>
          setActiveLightbox((prev) => (prev ? { ...prev, index: i } : prev))
        }
        onClose={() => setActiveLightbox(null)}
      />
    </section>
  );
}
