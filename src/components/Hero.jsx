import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Hero.css'

export default function Hero({ onSkip }) {
  const [loaded, setLoaded] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLoaded((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="hero-section">
      {/* Top Bar */}
      <div className="hero-top-bar">
        <span className="hero-top-text">
          NEXORA 2026 | Beyond Limits. Beyond Imagination — by HackHere
        </span>
        <span className="hero-top-percent">{loaded}%</span>
      </div>

      {/* Background Effects */}
      <div className="hero-bg-grid" />
      <div className="hero-glow-orb hero-glow-1" />
      <div className="hero-glow-orb hero-glow-2" />

      {/* Main Content */}
      <div className="hero-content">
        <motion.div
          className="hero-presenter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          HACKHERE PRESENTS
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          NEXORA
        </motion.h1>

        <motion.div
          className="hero-domains"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <span className="domain-badge">AI / ML</span>
          <span className="domain-badge">CYBER SECURITY</span>
          <span className="domain-badge">BLOCKCHAIN</span>
          <span className="domain-badge">DEVOPS</span>
        </motion.div>

        <motion.div
          className="hero-event-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <span className="event-location">SNS IHUB COIMBATORE</span>
          <span className="event-date-badge">AUG 22–23, 2026</span>
        </motion.div>

        <motion.div
          className="hero-skip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <button className="skip-btn" onClick={onSkip}>
            [ CLICK OR PRESS SPACE TO SKIP ]
          </button>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="hero-nav">
        <a href="#about">About</a>
        <a href="#domains">Domains</a>
        <a href="#schedule">Schedule</a>
        <a href="#rewards">Rewards</a>
        <a href="#sponsors">Sponsors</a>
        <a href="#team">Team</a>
        <a href="#faq">FAQ</a>
      </nav>

      {/* Bottom Bar */}
      <div className="hero-bottom-bar">
        <span className="hero-bottom-label">FINAL PORTAL</span>
        <a href="#register" className="hero-register-btn">Register Now</a>
      </div>
    </section>
  )
}
