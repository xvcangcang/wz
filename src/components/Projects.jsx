import { useState } from "react";
import SectionHeader from "./SectionHeader.jsx";
import Reveal from "./Reveal.jsx";
import ProjectArtwork from "./ProjectArtwork.jsx";
import Lightbox from "./Lightbox.jsx";
import { site } from "../data/siteData.js";
import "./Projects.css";

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
          {projects.items.map((project, i) => (
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

                <a
                  className="project-card__media"
                  href={project.image}
                  aria-label={`${project.title}（${project.type}）`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveImage({ src: project.image, title: project.title });
                  }}
                >
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
                  <span className="project-card__view">查看图片 ↗</span>
                </a>
              </article>
            </Reveal>
          ))}
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
