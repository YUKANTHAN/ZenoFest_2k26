import { motion } from 'framer-motion'
import { Sparkles, Calendar, ArrowRight } from 'lucide-react'
import './Home.css'

export default function Home() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="home-hero-section" id="home">
      {/* Glowing Video Background */}
      <video
        className="home-video-bg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/zenofest_glowing.mp4" type="video/mp4" />
      </video>
      <div className="home-video-shade" />

      <div className="home-container home-video-layout">
        {/* CTA Actions */}
        <motion.div
          className="home-actions-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <button
            className="btn-cyber-secondary"
            onClick={() => scrollToSection('events')}
          >
            <Calendar size={16} />
            <span>Explore Events</span>
            <ArrowRight size={16} className="btn-arrow" />
          </button>
          <a
            href="https://forms.gle/vo2t7PCV5QAFyT8e6"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber-primary"
            style={{ textDecoration: 'none' }}
          >
            <Sparkles size={16} />
            <span>Click to Register</span>
            <ArrowRight size={16} className="btn-arrow" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}