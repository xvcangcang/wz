import { motion } from "framer-motion";
import Reveal from "./Reveal.jsx";
import CopyButton from "./CopyButton.jsx";
import { site } from "../data/siteData.js";
import "./Contact.css";

const EASE = [0.22, 1, 0.36, 1];

export default function Contact() {
  const { contact } = site;
  return (
    <section id="contact" className="contact">
      <div className="container contact__main">
        <Reveal y={16}>
          <p className="contact__index mono-label">
            <span className="accent">{contact.sectionIndex} /</span>{" "}
            {contact.sectionTitle}
          </p>
        </Reveal>

        <h2 className="contact__heading">
          <Reveal variant="line" delay={0.08}>
            {contact.headingLine1}
          </Reveal>
          <Reveal variant="line" delay={0.16}>
            <span className="contact__heading-accent">
              {contact.headingLine2}
            </span>
          </Reveal>
        </h2>

        <Reveal blur delay={0.26}>
          <CopyButton
            className="contact__email"
            value={contact.email}
            label={contact.email}
          />
        </Reveal>

        <ul className="contact__socials">
          {contact.socials.map((social, i) => (
            <motion.li
              key={social.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.34 + i * 0.08, ease: EASE }}
            >
              <CopyButton
                className="contact__social mono-label"
                value={social.href.replace(/^(mailto|tel):/, "")}
                label={`${social.label} ↗`}
              />
            </motion.li>
          ))}
        </ul>
      </div>

      <Reveal className="container contact__bar" y={16} delay={0.1}>
        <span className="mono-label">{contact.copyright}</span>
        <a className="contact__top mono-label" href="#top">
          回到顶部 ↑
        </a>
      </Reveal>
    </section>
  );
}
