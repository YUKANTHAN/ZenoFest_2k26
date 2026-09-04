import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Send, UserPlus, Trash2, AlertCircle } from 'lucide-react'
import PaymentModal from './PaymentModal'

const API_BASE = 'http://localhost:8000'

export default function RegisterModal({ event, onClose }) {
  const [leaderName, setLeaderName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [college, setCollege] = useState('')
  const [teamName, setTeamName] = useState('')
  const [department, setDepartment] = useState('')
  const [members, setMembers] = useState([])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentData, setPaymentData] = useState(null)

  useEffect(() => {
    if (event) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [event])

  if (!event) return null

  if (paymentData) {
    return createPortal(
      <PaymentModal
        paymentData={paymentData}
        onClose={() => { setPaymentData(null); onClose() }}
        onBack={() => setPaymentData(null)}
      />,
      document.body
    )
  }

  const parseTeamSize = () => {
    const match = event.teamSize?.match(/(\d+)\s*[-–]\s*(\d+)/)
    if (match) return { min: parseInt(match[1]), max: parseInt(match[2]) }
    return { min: 1, max: 3 }
  }

  const { min, max } = parseTeamSize()
  const totalMembers = 1 + members.length

  const addMember = () => {
    if (members.length < max - 1) {
      setMembers([...members, { name: '', email: '', phone: '' }])
    }
  }

  const removeMember = (idx) => {
    setMembers(members.filter((_, i) => i !== idx))
  }

  const updateMember = (idx, field, value) => {
    const updated = [...members]
    updated[idx][field] = value
    setMembers(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!leaderName.trim() || !email.trim()) {
      setError('Name and email are required')
      return
    }

    const participants = [
      { name: leaderName, email, phone, college, department, year: '3rd Year' },
      ...members.map(m => ({ name: m.name, email: m.email, phone: m.phone, college, department, year: '3rd Year' }))
    ]

    setIsSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/registrations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_code: event.id,
          team_name: teamName || `${leaderName}'s Team`,
          leader_name: leaderName,
          leader_email: email,
          leader_phone: phone,
          college_name: college,
          department,
          total_participants: totalMembers,
          participants
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Registration failed')
      }

      const data = await res.json()
      setPaymentData({
        registrationId: data.registration_id,
        razorpayOrderId: data.razorpay_order_id,
        amount: data.amount,
        currency: data.currency,
        keyId: data.key_id,
        event,
        leaderName,
        email,
        teamName: teamName || `${leaderName}'s Team`,
        totalMembers
      })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const modalContent = (
    <AnimatePresence key={event.id}>
      <div className="event-modal-backdrop" onClick={onClose}>
        <motion.div
          className="event-modal-container register-modal-container"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.28 }}
        >
          <div className="modal-corner modal-corner-tl" />
          <div className="modal-corner modal-corner-tr" />
          <div className="modal-corner modal-corner-bl" />
          <div className="modal-corner modal-corner-br" />

          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>

          <div className="register-form-wrapper">
            <div className="register-header">
              <div className="register-badge-row">
                <span className={`modal-type-badge ${event.type === 'TECHNICAL' ? 'badge-tech' : 'badge-non-tech'}`}>
                  {event.type}
                </span>
                <span className="register-limit-badge">
                  <Users size={13} /> {event.teamSize}
                </span>
              </div>
              <h2 className="register-title">Register for {event.title}</h2>
              <p className="register-subtitle">
                Fill in your team details below. You'll proceed to payment after submitting.
              </p>
            </div>

            {error && (
              <div className="register-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Team Leader Name *</label>
                  <input type="text" required placeholder="e.g. Alex Rivera"
                    value={leaderName} onChange={(e) => setLeaderName(e.target.value)}
                    className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Team Name</label>
                  <input type="text" placeholder="e.g. CyberKnights"
                    value={teamName} onChange={(e) => setTeamName(e.target.value)}
                    className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input type="email" required placeholder="alex@college.edu"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" required placeholder="+91 98765 43210"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="form-input" />
                </div>

                <div className="form-group form-col-span-2">
                  <label className="form-label">College / Institute *</label>
                  <input type="text" required placeholder="e.g. PSR Engineering College, Sivakasi"
                    value={college} onChange={(e) => setCollege(e.target.value)}
                    className="form-input" />
                </div>

                <div className="form-group form-col-span-2">
                  <label className="form-label">Department</label>
                  <input type="text" placeholder="e.g. Information Technology"
                    value={department} onChange={(e) => setDepartment(e.target.value)}
                    className="form-input" />
                </div>
              </div>

              {max > 1 && (
                <div className="team-members-section">
                  <div className="team-members-header">
                    <h4 className="team-section-title">
                      <UserPlus size={16} />
                      Team Members ({members.length}/{max - 1} additional)
                    </h4>
                    {members.length < max - 1 && (
                      <button type="button" className="btn-add-member" onClick={addMember}>
                        <UserPlus size={14} /> Add Member
                      </button>
                    )}
                  </div>

                  {members.map((member, idx) => (
                    <motion.div
                      key={idx}
                      className="member-card"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="member-card-header">
                        <span className="member-badge">Member {idx + 1}</span>
                        <button type="button" className="btn-remove-member" onClick={() => removeMember(idx)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">Name *</label>
                          <input type="text" required placeholder="Member name"
                            value={member.name} onChange={(e) => updateMember(idx, 'name', e.target.value)}
                            className="form-input" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Email *</label>
                          <input type="email" required placeholder="member@college.edu"
                            value={member.email} onChange={(e) => updateMember(idx, 'email', e.target.value)}
                            className="form-input" />
                        </div>
                        <div className="form-group form-col-span-2">
                          <label className="form-label">Phone</label>
                          <input type="tel" placeholder="+91 98765 43210"
                            value={member.phone} onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                            className="form-input" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="form-footer-action">
                <button type="submit" disabled={isSubmitting} className="btn-primary-glow btn-submit-reg">
                  {isSubmitting ? (
                    <span>Creating Registration...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
