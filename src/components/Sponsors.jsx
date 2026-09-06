import { motion } from 'framer-motion'
import { Rocket, Mail } from 'lucide-react'
import './Sponsors.css'

export default function Sponsors() {
  return (
    <section className="sponsors-section" id="sponsors">
      <div className="sponsors-bg">
        <div className="sponsor-glow-orb" />
        <div className="sponsor-dot-grid" />
      </div>

      <div className="sponsors-container">
        <motion.div
          className="sponsors-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="section-label">
            <span className="label-text">POWERED BY</span>
          </div>

          <h2 className="sponsors-title">
            <span>OUR </span>
            <span className="gradient-text">SPONSORS</span>
          </h2>

          <p className="sponsors-subtitle">
            We're proud to partner with leading organizations powering ZenoFest&apos;26.
          </p>
        </motion.div>

        {/* Sponsor Slot Cards */}
        <div className="sponsor-slots">
          {[1, 2].map((slot, idx) => (
            <motion.div
              key={slot}
              className="sponsor-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="sponsor-card-inner">
                <span className="sponsor-question-mark">?</span>
                <span className="sponsor-reveal-text">Will Be Revealed Soon</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="sponsor-cta-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <button
            className="btn-sponsor"
            onClick={() => (window.location.href = 'mailto:sponsors@zenofest.in?subject=Sponsorship%20Enquiry')}
          >
            <Rocket size={16} />
            <span>Be a Sponsor</span>
            <Mail size={16} className="btn-sponsor-arrow" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}