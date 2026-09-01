import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Gallery.css'

const galleryItems = [
  {
    id: 1,
    systemId: 'ZF-001',
    title: 'Inauguration Ceremony',
    category: 'INAUGURATION',
    time: 'Day 1 — 09:00 AM',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=450&fit=crop',
    description: 'The grand opening of ZenoFest with chief guests and dignitaries.',
  },
  {
    id: 2,
    systemId: 'ZF-002',
    title: 'Project Demonstrations',
    category: 'DEMO',
    time: 'Day 1 — 11:30 AM',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=450&fit=crop',
    description: 'Students showcasing their innovative projects to judges.',
  },
  {
    id: 3,
    systemId: 'ZF-003',
    title: 'Tech Keynote Session',
    category: 'KEYNOTE',
    time: 'Day 1 — 02:00 PM',
    img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=450&fit=crop',
    description: 'Industry experts sharing insights on emerging technologies.',
  },
  {
    id: 4,
    systemId: 'ZF-004',
    title: 'Audience Engagement',
    category: 'AUDIENCE',
    time: 'Day 1 — 03:30 PM',
    img: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600&h=450&fit=crop',
    description: 'Energetic participants engaging with the presentations.',
  },
  {
    id: 5,
    systemId: 'ZF-005',
    title: 'Workshop Session',
    category: 'WORKSHOP',
    time: 'Day 2 — 10:00 AM',
    img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=450&fit=crop',
    description: 'Hands-on workshop on latest development frameworks.',
  },
  {
    id: 6,
    systemId: 'ZF-006',
    title: 'Award Ceremony',
    category: 'CEREMONY',
    time: 'Day 2 — 04:00 PM',
    img: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600&h=450&fit=crop',
    description: 'Winners receiving prizes and recognition for excellence.',
  },
  {
    id: 7,
    systemId: 'ZF-007',
    title: 'Team Collaborations',
    category: 'TEAM',
    time: 'Day 1 — 04:30 PM',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=450&fit=crop',
    description: 'Teams brainstorming and working together on projects.',
  },
  {
    id: 8,
    systemId: 'ZF-008',
    title: 'Networking Break',
    category: 'NETWORKING',
    time: 'Day 2 — 12:00 PM',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=450&fit=crop',
    description: 'Participants connecting and sharing ideas over refreshments.',
  },
]

const categories = ['ALL', ...new Set(galleryItems.map(item => item.category))]

export default function Gallery() {
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
      {/* Background */}
      <div className="gallery-bg">
        <div className="gallery-grid-pattern" />
      </div>

      <div className="gallery-container">
        {/* Header */}
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

        {/* Filter Bar */}
        <motion.div
          className="filter-bar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
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
        </motion.div>

        {/* Card Grid */}
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

      {/* Lightbox Modal */}
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
