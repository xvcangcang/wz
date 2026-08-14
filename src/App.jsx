import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import Strengths from "./components/Strengths.jsx";
import Contact from "./components/Contact.jsx";

export default function App() {
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
