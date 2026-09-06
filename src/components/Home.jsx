import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Calendar, ArrowRight } from 'lucide-react'
import './Home.css'

const REGISTER_URL = 'https://forms.gle/vo2t7PCV5QAFyT8e6'

export default function Home() {
  const morphRef = useRef(null)
  const glowRef = useRef(null)
  const timerRef = useRef(null)
  const firedRef = useRef(false)
  const [registering, setRegistering] = useState(false)
  const [showMorph, setShowMorph] = useState(false)

  const glowDoneRef = useRef(false)

  const handleGlowTime = () => {
    const v = glowRef.current
    if (showMorph || glowDoneRef.current || !v) return
    // Show the logo at the 6s mark of the first pass of the glow video.
    if (v.currentTime >= 6) {
      glowDoneRef.current = true
      setShowMorph(true)
    }
  }
    const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const openRegister = () => {
    if (firedRef.current) return
    firedRef.current = true
    const win = window.open(REGISTER_URL, '_blank', 'noopener,noreferrer')
    if (!win) {
      window.location.assign(REGISTER_URL)
    }
  }

  const resetMorph = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    const v = morphRef.current
    if (v) {
      v.pause()
      v.currentTime = 0
    }
    setRegistering(false)
    setTimeout(() => {
      firedRef.current = false
    }, 700)
  }

  const handleRegister = () => {
    if (registering || !morphRef.current) return
    setRegistering(true)
    const v = morphRef.current
    try {
      v.currentTime = 0
    } catch (err) {
      /* ignore */
    }
    const p = v.play()
    if (p && typeof p.catch === 'function') {
      p.catch(() => openRegister())
    }
    timerRef.current = setTimeout(openRegister, 2700)
  }

  const handleEnded = () => {
    openRegister()
    resetMorph()
  }

  return (
    <section className="home-hero-section" id="home">
      {/* Glowing Video Background */}
      <video
        className="home-video-bg"
        ref={glowRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onTimeUpdate={handleGlowTime}
      >
        <source src="/zenofest_glowing.mp4" type="video/mp4" />
      </video>
      <div className="home-video-shade" />

      {/* Festival Logo (right side) — the morph video appears after the glow loop ends */}
      {showMorph && (
        <div className="home-logo">
          <video
            ref={morphRef}
            className="home-logo-video"
            playsInline
            preload="auto"
            onEnded={handleEnded}
          >
            <source src="/zenofest_register_morph.mp4" type="video/mp4" />
          </video>
          <div className="home-logo-cover" />
        </div>
      )}

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
          <button
            className="btn-cyber-primary"
            onClick={handleRegister}
            disabled={registering}
          >
            <Sparkles size={16} />
            <span>{registering ? 'Entering...' : 'Click to Register'}</span>
            <ArrowRight size={16} className="btn-arrow" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}