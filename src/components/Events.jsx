import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  Search,
  Sparkles,
  Code2,
  Gamepad2,
  HelpCircle,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react'
import { eventsData } from '../data/eventsData'
import EventModal from './EventModal'
import RegisterModal from './RegisterModal'
import './Events.css'

export default function Events() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [registeringEvent, setRegisteringEvent] = useState(null)

  const filteredEvents = useMemo(() => {
    return eventsData.filter((event) => {
      const matchesCategory =
        activeCategory === 'ALL' || event.type === activeCategory

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.tagline.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q) ||
        event.type.toLowerCase().includes(q)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const counts = {
    all: eventsData.length,
    technical: eventsData.filter((e) => e.type === 'TECHNICAL').length,
    nonTechnical: eventsData.filter((e) => e.type === 'NON-TECHNICAL').length
  }

  return (
    <section className="events-section" id="events">
      {/* Background Effects */}
      <div className="events-bg-effects">
        <div className="cyber-glow-orb orb-1" />
        <div className="cyber-glow-orb orb-2" />
        <div className="events-dot-grid" />
      </div>

      <div className="events-container">
        {/* Section Header */}
        <motion.div
          className="events-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="section-label">
            <span className="label-number">02</span>
            <span className="label-divider">/</span>
            <span className="label-text">CHALLENGE ARENAS</span>
          </div>

          <h2 className="events-title">
            <span>OUR </span>
            <span className="gradient-text">EVENTS</span>
          </h2>

          <p className="events-subtitle">
            Explore 6 electrifying competitions across Technical and Non-Technical domains. Hover over any event to discover more.
          </p>
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          className="stats-strip"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
        >
          <div className="strip-item">
            <Layers size={16} />
            <span className="strip-val">06</span>
            <span className="strip-lbl">Events</span>
          </div>
          <div className="strip-sep" />
          <div className="strip-item">
            <Trophy size={16} />
            <span className="strip-val">₹10,000</span>
            <span className="strip-lbl">Cash Prize</span>
          </div>
          <div className="strip-sep" />
          <div className="strip-item">
            <Calendar size={16} />
            <span className="strip-val">2 Days</span>
            <span className="strip-lbl">Oct 08–09</span>
          </div>
          <div className="strip-sep" />
          <div className="strip-item">
            <Zap size={16} />
            <span className="strip-val">National</span>
            <span className="strip-lbl">Certification</span>
          </div>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          className="filter-pills-bar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          viewport={{ once: true }}
        >
          <div className="pills-group">
            {[
              { key: 'ALL', label: 'All Events', count: counts.all, icon: <Sparkles size={15} /> },
              { key: 'TECHNICAL', label: 'Technical', count: counts.technical, icon: <Code2 size={15} /> },
              { key: 'NON-TECHNICAL', label: 'Non-Technical', count: counts.nonTechnical, icon: <Gamepad2 size={15} /> }
            ].map((cat) => (
              <button
                key={cat.key}
                className={`filter-pill ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span className="pill-count">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="events-search-wrap">
            <Search size={15} className="search-ico" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="events-search"
            />
          </div>
        </motion.div>

        {/* ════════ EVENTS FLIP CARD GRID ════════ */}
        <motion.div layout className="flip-grid">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, idx) => {
              const isTech = event.type === 'TECHNICAL'

              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.45, delay: idx * 0.07 }}
                  className="flip-card-outer"
                  style={{ '--card-accent': event.accentColor }}
                >
                  <div className="flip-card-inner">
                    {/* ──── FRONT ──── */}
                    <div className="flip-face flip-front">
                      <img
                        src={event.coverImage}
                        alt={event.title}
                        className="front-cover-img"
                        loading="lazy"
                      />
                      <div className="front-overlay" />

                      {/* Top Tags */}
                      <div className="front-top-row">
                        <span className={`type-chip ${isTech ? 'chip-tech' : 'chip-nontech'}`}>
                          {isTech ? 'TECHNICAL' : 'NON-TECHNICAL'}
                        </span>
                        {event.hasCashPrize && (
                          <span className="cash-chip">₹10,000</span>
                        )}
                      </div>

                      {/* Bottom Info */}
                      <div className="front-bottom">
                        <h3 className="front-event-name">{event.title}</h3>
                        <p className="front-tagline">{event.tagline}</p>
                        <div className="front-meta">
                          <span className="front-meta-item">
                            <Calendar size={13} />
                            {event.date.split('(')[0]}
                          </span>
                          <span className="front-meta-item">
                            <Users size={13} />
                            {event.teamSize}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ──── BACK ──── */}
                    <div className="flip-face flip-back">
                      <div className="back-accent-glow" />

                      <div className="back-header">
                        <span className={`type-chip ${isTech ? 'chip-tech' : 'chip-nontech'}`}>
                          {isTech ? 'TECHNICAL' : 'NON-TECHNICAL'}
                        </span>
                        {event.badge && <span className="back-badge">{event.badge}</span>}
                      </div>

                      <h3 className="back-title">{event.title}</h3>

                      <div className="back-time-display">
                        <Clock size={18} className="back-time-icon" />
                        <span className="back-time-text">{event.time}</span>
                      </div>

                      <p className="back-desc">{event.shortDesc}</p>

                      {/* Action Buttons */}
                      <div className="back-actions">
                        <button
                          className="btn-know-more"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEvent(event)
                          }}
                        >
                          <span>Know More</span>
                          <ArrowRight size={15} />
                        </button>

                        <button
                          className="btn-back-register"
                          onClick={(e) => {
                            e.stopPropagation()
                            setRegisteringEvent(event)
                          }}
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="events-empty">
            <HelpCircle size={44} />
            <h3>No events match your search</h3>
            <p>Try a different keyword or reset filters.</p>
            <button className="btn-reset" onClick={() => { setActiveCategory('ALL'); setSearchQuery('') }}>
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onOpenRegister={(evt) => setRegisteringEvent(evt)}
        />
      )}

      {registeringEvent && (
        <RegisterModal
          event={registeringEvent}
          onClose={() => setRegisteringEvent(null)}
        />
      )}
    </section>
  )
}
