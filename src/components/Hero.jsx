import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './Hero.css'

export default function Hero({ onSkip }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
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
        <span className="hero-top-percent">{progress}%</span>
      </div>

      {/* Circuit Background */}
      <div className="hero-circuit-bg">
        <div className="circuit-line circuit-1" />
        <div className="circuit-line circuit-2" />
        <div className="circuit-line circuit-3" />
        <div className="circuit-line circuit-4" />
        <div className="circuit-line circuit-5" />
        <div className="circuit-dot circuit-dot-1" />
        <div className="circuit-dot circuit-dot-2" />
        <div className="circuit-dot circuit-dot-3" />
        <div className="circuit-dot circuit-dot-4" />
        <div className="circuit-dot circuit-dot-5" />
        <div className="circuit-dot circuit-dot-6" />
      </div>

      {/* Glow Effects */}
      <div className="hero-glow-center" />
      <div className="hero-glow-left" />
      <div className="hero-glow-right" />

      {/* HUD Elements */}
      <div className="hud-element hud-top-left">
        <span className="hud-label">CORE STABILITY</span>
        <span className="hud-value">{progress}%</span>
        <span className="hud-status">OPTIMAL</span>
      </div>

      <div className="hud-element hud-top-right">
        <span className="hud-label">LOAD</span>
        <span className="hud-value">{progress}%</span>
        <span className="hud-status">SYSTEM READY</span>
      </div>

      <div className="hud-element hud-mid-right">
        <span className="hud-label">POWER LEVEL</span>
        <span className="hud-value">{progress}%</span>
        <span className="hud-status">OPTIMAL</span>
      </div>

      <div className="hud-element hud-bottom-left">
        <span className="hud-label">INNOVATION FLOW</span>
        <span className="hud-value-sm">ACTIVE</span>
        <span className="hud-tagline">IDEAS. BUILD. IMPACT.</span>
      </div>

      <div className="hud-element hud-bottom-right">
        <span className="hud-label">FUTURE STATUS</span>
        <span className="hud-value-sm">UNLOCKED</span>
        <span className="hud-tagline">LIMITS. BROKEN.</span>
      </div>

      {/* Main Content */}
      <div className="hero-content">
        {/* Nexora-style Wireframe Title */}
        <motion.div
          className="hero-title-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="hero-title-nexora">ZENOFEST</h1>
          <div className="hero-title-wireframe" />
          <div className="hero-title-glow-ring" />
          <div className="hero-title-particles" />
        </motion.div>

        {/* Subtitle */}
        <motion.div
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          CODE THE NEXT ERA
        </motion.div>

        {/* Domain Badges */}
        <motion.div
          className="hero-domains"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <span className="domain-badge">AI / ML</span>
          <span className="domain-badge">CYBER SECURITY</span>
          <span className="domain-badge">BLOCKCHAIN</span>
          <span className="domain-badge">DEVOPS</span>
        </motion.div>

        {/* Event Info */}
        <motion.div
          className="hero-event-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
        >
          <span className="event-location">SNS IHUB COIMBATORE</span>
          <span className="event-date-badge">AUG 22–23, 2026</span>
        </motion.div>

        {/* Skip Button */}
        <motion.div
          className="hero-skip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <button className="skip-btn" onClick={onSkip}>
            [ CLICK OR PRESS SPACE TO SKIP ]
          </button>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="hero-bottom-bar">
        <span className="hero-bottom-label">FINAL PORTAL</span>
        <a href="#register" className="hero-register-btn">Register Now</a>
        <span className="hero-scroll-text">Scroll Down</span>
      </div>
    </section>
  )
}
