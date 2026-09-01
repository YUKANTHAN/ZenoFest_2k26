import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Gallery.css'

const galleryItems = [
  {
    id: 1,
    systemId: 'ZF-001',
    title: 'Inauguration Ceremony',
    category: 'INAUGURATION',
    time: 'Day 1 — 09:00 AM',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    description: 'The grand opening of ZenoFest with chief guests and dignitaries.',
  },
  {
    id: 2,
    systemId: 'ZF-002',
    title: 'Project Demonstrations',
    category: 'DEMO',
    time: 'Day 1 — 11:30 AM',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
    description: 'Students showcasing their innovative projects to judges.',
  },
  {
    id: 3,
    systemId: 'ZF-003',
    title: 'Tech Keynote Session',
    category: 'KEYNOTE',
    time: 'Day 1 — 02:00 PM',
    img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
    description: 'Industry experts sharing insights on emerging technologies.',
  },
  {
    id: 4,
    systemId: 'ZF-004',
    title: 'Audience Engagement',
    category: 'AUDIENCE',
    time: 'Day 1 — 03:30 PM',
    img: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&h=600&fit=crop',
    description: 'Energetic participants engaging with the presentations.',
  },
  {
    id: 5,
    systemId: 'ZF-005',
    title: 'Workshop Session',
    category: 'WORKSHOP',
    time: 'Day 2 — 10:00 AM',
    img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
    description: 'Hands-on workshop on latest development frameworks.',
  },
  {
    id: 6,
    systemId: 'ZF-006',
    title: 'Award Ceremony',
    category: 'CEREMONY',
    time: 'Day 2 — 04:00 PM',
    img: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&h=600&fit=crop',
    description: 'Winners receiving prizes and recognition for excellence.',
  },
  {
    id: 7,
    systemId: 'ZF-007',
    title: 'Team Collaborations',
    category: 'TEAM',
    time: 'Day 1 — 04:30 PM',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
    description: 'Teams brainstorming and working together on projects.',
  },
  {
    id: 8,
    systemId: 'ZF-008',
    title: 'Networking Break',
    category: 'NETWORKING',
    time: 'Day 2 — 12:00 PM',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    description: 'Participants connecting and sharing ideas over refreshments.',
  },
]

const categories = ['ALL', ...new Set(galleryItems.map(item => item.category))]

function HudScanner({ items, onItemSelect }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const timeRef = useRef(0)
  const INTERVAL = 4000

  const currentItem = items[currentIndex]

  // Auto advance
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length)
      setProgress(0)
    }, INTERVAL)
    return () => clearInterval(interval)
  }, [items.length, isPaused])

  // Progress bar
  useEffect(() => {
    if (isPaused) return
    let start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      setProgress(Math.min(elapsed / INTERVAL, 1))
      if (elapsed < INTERVAL) {
        animRef.current = requestAnimationFrame(tick)
      }
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [currentIndex, isPaused])

  // Canvas HUD animation
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const cx = w / 2
    const cy = h / 2

    ctx.clearRect(0, 0, w, h)
    timeRef.current += 0.01
    const t = timeRef.current

    // Outer rotating ring
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(t * 0.3)
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(0, 0, 220, 0, Math.PI * 1.5)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 0, 220, Math.PI, Math.PI * 2.5)
    ctx.stroke()
    ctx.restore()

    // Inner rotating ring (opposite)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(-t * 0.5)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)'
    ctx.lineWidth = 1
    ctx.setLineDash([10, 20])
    ctx.beginPath()
    ctx.arc(0, 0, 200, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()

    // Corner brackets (HUD frame)
    const boxSize = 180
    const cornerLen = 30
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)'
    ctx.lineWidth = 2

    // Top-left
    ctx.beginPath()
    ctx.moveTo(cx - boxSize, cy - boxSize + cornerLen)
    ctx.lineTo(cx - boxSize, cy - boxSize)
    ctx.lineTo(cx - boxSize + cornerLen, cy - boxSize)
    ctx.stroke()

    // Top-right
    ctx.beginPath()
    ctx.moveTo(cx + boxSize - cornerLen, cy - boxSize)
    ctx.lineTo(cx + boxSize, cy - boxSize)
    ctx.lineTo(cx + boxSize, cy - boxSize + cornerLen)
    ctx.stroke()

    // Bottom-left
    ctx.beginPath()
    ctx.moveTo(cx - boxSize, cy + boxSize - cornerLen)
    ctx.lineTo(cx - boxSize, cy + boxSize)
    ctx.lineTo(cx - boxSize + cornerLen, cy + boxSize)
    ctx.stroke()

    // Bottom-right
    ctx.beginPath()
    ctx.moveTo(cx + boxSize - cornerLen, cy + boxSize)
    ctx.lineTo(cx + boxSize, cy + boxSize)
    ctx.lineTo(cx + boxSize, cy + boxSize - cornerLen)
    ctx.stroke()

    // Scanning line (vertical sweep)
    const scanY = cy - boxSize + ((t * 40) % (boxSize * 2))
    const scanGradient = ctx.createLinearGradient(cx - boxSize, scanY, cx + boxSize, scanY)
    scanGradient.addColorStop(0, 'transparent')
    scanGradient.addColorStop(0.3, 'rgba(6, 182, 212, 0.6)')
    scanGradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.9)')
    scanGradient.addColorStop(0.7, 'rgba(6, 182, 212, 0.6)')
    scanGradient.addColorStop(1, 'transparent')
    ctx.strokeStyle = scanGradient
    ctx.lineWidth = 2
    ctx.shadowColor = '#06b6d4'
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.moveTo(cx - boxSize, scanY)
    ctx.lineTo(cx + boxSize, scanY)
    ctx.stroke()
    ctx.shadowBlur = 0

    // Data points along left side
    ctx.font = '9px "Space Mono", monospace'
    ctx.fillStyle = 'rgba(139, 92, 246, 0.5)'
    ctx.textAlign = 'left'
    for (let i = 0; i < 6; i++) {
      const y = cy - boxSize + 30 + i * 60
      const flicker = Math.sin(t * 3 + i) > 0.5 ? 1 : 0.3
      ctx.globalAlpha = flicker
      ctx.fillText(`0${i + 1}`, cx - boxSize - 30, y)
      ctx.beginPath()
      ctx.moveTo(cx - boxSize - 10, y)
      ctx.lineTo(cx - boxSize, y)
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // Data points along right side
    ctx.textAlign = 'right'
    for (let i = 0; i < 6; i++) {
      const y = cy - boxSize + 30 + i * 60
      const flicker = Math.sin(t * 3 + i + 2) > 0.5 ? 1 : 0.3
      ctx.globalAlpha = flicker
      ctx.fillText(`${(currentIndex * 7 + i * 13) % 100}`, cx + boxSize + 35, y)
      ctx.beginPath()
      ctx.moveTo(cx + boxSize, y)
      ctx.lineTo(cx + boxSize + 10, y)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // Center crosshair
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx - 20, cy)
    ctx.lineTo(cx + 20, cy)
    ctx.moveTo(cx, cy - 20)
    ctx.lineTo(cx, cy + 20)
    ctx.stroke()

    // Pulsing circles
    const pulseR = 40 + Math.sin(t * 2) * 10
    ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 + Math.sin(t * 2) * 0.1})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(cx, cy, pulseR, 0, Math.PI * 2)
    ctx.stroke()

    // Top-left info
    ctx.font = '10px "Space Mono", monospace'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.textAlign = 'left'
    ctx.fillText(`REC ● ${currentItem.systemId}`, cx - boxSize, cy - boxSize - 15)
    ctx.fillText(`CAM_0${currentIndex + 1}`, cx - boxSize, cy - boxSize - 3)

    // Top-right timestamp
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(6, 182, 212, 0.5)'
    ctx.fillText(`FRAME: ${String(currentIndex + 1).padStart(3, '0')}/${String(items.length).padStart(3, '0')}`, cx + boxSize, cy - boxSize - 15)
    ctx.fillText(currentItem.time, cx + boxSize, cy - boxSize - 3)

    // Bottom status bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.textAlign = 'left'
    ctx.fillText(`> SCANNING: ${currentItem.category}`, cx - boxSize, cy + boxSize + 20)
    ctx.textAlign = 'right'
    ctx.fillText(`STATUS: ACTIVE`, cx + boxSize, cy + boxSize + 20)

    // Progress bar at bottom
    const barWidth = boxSize * 2
    const barX = cx - boxSize
    const barY = cy + boxSize + 30
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.fillRect(barX, barY, barWidth, 3)
    const progGrad = ctx.createLinearGradient(barX, barY, barX + barWidth * progress, barY)
    progGrad.addColorStop(0, '#8b5cf6')
    progGrad.addColorStop(1, '#06b6d4')
    ctx.fillStyle = progGrad
    ctx.fillRect(barX, barY, barWidth * progress, 3)

    animRef.current = requestAnimationFrame(draw)
  }, [currentIndex, items.length, currentItem, progress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)
    animRef.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [draw])

  return (
    <div
      className="hud-scanner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <canvas ref={canvasRef} className="hud-canvas" onClick={() => onItemSelect(currentItem)} />

      {/* Image overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          className="hud-image-container"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
        >
          <img src={currentItem.img} alt={currentItem.title} className="hud-image" />
          <div className="hud-image-overlay" />
        </motion.div>
      </AnimatePresence>

      {/* Info overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          className="hud-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span className="hud-info-category">{currentItem.category}</span>
          <h3 className="hud-info-title">{currentItem.title}</h3>
          <p className="hud-info-desc">{currentItem.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Bottom thumbnails */}
      <div className="hud-thumbnails">
        {items.map((item, i) => (
          <button
            key={item.id}
            className={`hud-thumb ${i === currentIndex ? 'active' : ''}`}
            onClick={() => { setCurrentIndex(i); setProgress(0) }}
          >
            <img src={item.img} alt="" />
            <div className="hud-thumb-overlay" />
          </button>
        ))}
      </div>

      {/* Click to inspect */}
      <button className="hud-inspect-btn" onClick={() => onItemSelect(currentItem)}>
        {'>'} $ INSPECT_FEED
      </button>
    </div>
  )
}

export default function Gallery() {
  const [view, setView] = useState('scanner')
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [selectedImage, setSelectedImage] = useState(null)

  const filteredItems = activeFilter === 'ALL'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter)

  const getCategoryCount = (cat) => {
    if (cat === 'ALL') return galleryItems.length
    return galleryItems.filter(item => item.category === cat).length
  }

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-bg">
        <div className="gallery-grid-pattern" />
      </div>

      <div className="gallery-container">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="gallery-pill">LIVE SCANNER ARCHIVE</span>
          <h2 className="gallery-title">
            EVENT <span className="gradient-text">GLIMPSE</span> SCANNER
          </h2>
          <p className="gallery-subtitle">
            Capturing moments from ZenoFest — browse through the visual archive of our event.
          </p>
        </motion.div>

        <motion.div
          className="view-toggle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <button
            className={`toggle-btn ${view === 'scanner' ? 'active' : ''}`}
            onClick={() => setView('scanner')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
              <line x1="12" y1="2" x2="12" y2="6"/>
              <line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="6" y2="12"/>
              <line x1="18" y1="12" x2="22" y2="12"/>
            </svg>
            HUD SCANNER
          </button>
          <button
            className={`toggle-btn ${view === 'grid' ? 'active' : ''}`}
            onClick={() => setView('grid')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
            GRID ARCHIVE
          </button>
        </motion.div>

        {view === 'scanner' && (
          <HudScanner items={galleryItems} onItemSelect={setSelectedImage} />
        )}

        {view === 'grid' && (
          <div className="grid-view">
            <div className="filter-bar">
              <span className="filter-label">FILTER:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat} <span className="filter-count">{getCategoryCount(cat)}</span>
                </button>
              ))}
            </div>

            <div className="gallery-grid">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="gallery-card"
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    onClick={() => setSelectedImage(item)}
                  >
                    <div className="card-header">
                      <span className="card-dot" />
                      <span className="card-cam">CAM_0{item.id}</span>
                      <span className="card-id">[{item.systemId}]</span>
                    </div>
                    <div className="card-image-wrapper">
                      <img src={item.img} alt={item.title} className="card-image" />
                      <div className="card-image-overlay" />
                      <span className="card-category">{item.category}</span>
                    </div>
                    <div className="card-content">
                      <div className="card-time">{item.time}</div>
                      <h3 className="card-title">{item.title}</h3>
                      <p className="card-description">{item.description}</p>
                      <button className="card-inspect-btn">
                        {'>'} $ INSPECT_FEED
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
                ✕
              </button>
              <img src={selectedImage.img} alt={selectedImage.title} className="lightbox-image" />
              <div className="lightbox-info">
                <span className="lightbox-category">{selectedImage.category}</span>
                <h3 className="lightbox-title">{selectedImage.title}</h3>
                <p className="lightbox-description">{selectedImage.description}</p>
                <div className="lightbox-meta">
                  <span>{selectedImage.time}</span>
                  <span>ID: {selectedImage.systemId}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
