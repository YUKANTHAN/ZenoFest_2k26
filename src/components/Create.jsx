import { motion } from 'framer-motion'
import './Create.css'

export default function Create() {
  return (
    <section className="create-section">
      <div className="create-container">
        <motion.div
          className="create-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <img
            src="/Homepage text.png"
            alt="Nexora Text"
            className="create-text-image"
          />
        </motion.div>

        <motion.div
          className="create-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="create-title">
            NEXORA 2026 <span className="create-divider">|</span> Beyond Limits. Beyond Imagination
          </h2>
          <p className="create-credit">by HackHere</p>
        </motion.div>

        <motion.div
          className="create-right"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <img
            src="/Logo.png"
            alt="Nexora Logo"
            className="create-logo-image"
          />
        </motion.div>
      </div>
    </section>
  )
}
