import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Shield, CheckCircle, Loader2, AlertCircle, Trophy, ArrowLeft, Download } from 'lucide-react'

const API_BASE = 'http://localhost:8000'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function PaymentModal({ paymentData, onClose, onSuccess, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (paymentData) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [paymentData])

  if (!paymentData) return null

  const { registrationId, razorpayOrderId, amount, currency, keyId, event, leaderName, email, teamName, totalMembers } = paymentData

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      setError('Failed to load payment gateway. Please check your internet connection.')
      setLoading(false)
      return
    }

    const options = {
      key: keyId,
      amount: amount * 100,
      currency,
      name: 'ZenoFest 2K26',
      description: `Registration for ${event.title}`,
      order_id: razorpayOrderId,
      handler: async function (response) {
        try {
          const verifyRes = await fetch(`${API_BASE}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              registration_id: registrationId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          })

          if (!verifyRes.ok) {
            const data = await verifyRes.json()
            throw new Error(data.detail || 'Payment verification failed')
          }

          setConfirmed(true)
          onSuccess?.({
            registrationId,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount,
            event,
            leaderName,
            email,
            teamName,
            totalMembers
          })
        } catch (err) {
          setError('Payment was received but verification failed. Contact support with your payment ID: ' + response.razorpay_payment_id)
        } finally {
          setLoading(false)
        }
      },
      prefill: {
        name: leaderName,
        email: email,
      },
      theme: {
        color: '#8b5cf6'
      },
      modal: {
        ondismiss: function () {
          setLoading(false)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', function (response) {
      setError('Payment failed: ' + (response.error?.description || 'Unknown error'))
      setLoading(false)
    })
    rzp.open()
  }

  const modalContent = (
    <AnimatePresence>
      <div className="event-modal-backdrop" onClick={onClose}>
        <motion.div
          className="event-modal-container payment-modal-container"
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

          {!confirmed ? (
            <div className="payment-content">
              <div className="payment-header">
                <div className="payment-icon-wrap">
                  <CreditCard size={32} className="payment-icon" />
                </div>
                <h2 className="payment-title">Complete Payment</h2>
                <p className="payment-subtitle">Secure payment powered by Razorpay</p>
              </div>

              {error && (
                <div className="register-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="payment-summary-card">
                <div className="summary-row">
                  <span className="summary-label">Event</span>
                  <span className="summary-value">{event.title}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Registration ID</span>
                  <span className="summary-value mono">{registrationId}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Team</span>
                  <span className="summary-value">{teamName}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Team Size</span>
                  <span className="summary-value">{totalMembers} member{totalMembers > 1 ? 's' : ''}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Lead</span>
                  <span className="summary-value">{leaderName}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Email</span>
                  <span className="summary-value">{email}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row summary-total">
                  <span className="summary-label">Amount to Pay</span>
                  <span className="summary-value summary-amount">₹{amount}</span>
                </div>
              </div>

              <div className="payment-security-note">
                <Shield size={14} />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>

              <div className="payment-actions">
                <button className="btn-secondary" onClick={onBack} disabled={loading}>
                  <ArrowLeft size={14} /> Back to Form
                </button>
                <button className="btn-primary-glow btn-pay" onClick={handlePayment} disabled={loading}>
                  {loading ? (
                    <><Loader2 size={16} className="spin" /> Processing...</>
                  ) : (
                    <><CreditCard size={16} /> Pay ₹{amount}</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="payment-success-view">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="success-icon-wrap"
              >
                <CheckCircle size={64} className="success-icon" />
              </motion.div>

              <h3 className="success-title">Payment Successful!</h3>
              <p className="success-message">
                You're registered for <strong>{event.title}</strong> at ZenoFest'26.
              </p>

              <div className="success-details-card">
                <div className="success-detail-row">
                  <span className="s-label">Registration ID:</span>
                  <span className="s-val">{registrationId}</span>
                </div>
                <div className="success-detail-row">
                  <span className="s-label">Team:</span>
                  <span className="s-val">{teamName}</span>
                </div>
                <div className="success-detail-row">
                  <span className="s-label">Amount Paid:</span>
                  <span className="s-val">₹{amount}</span>
                </div>
                <div className="success-detail-row">
                  <span className="s-label">Date & Time:</span>
                  <span className="s-val">{event.date} • {event.time}</span>
                </div>
                <div className="success-detail-row">
                  <span className="s-label">Venue:</span>
                  <span className="s-val">{event.venue}</span>
                </div>
              </div>

              <div className="success-tip">
                <Trophy size={16} />
                <span>A confirmation email has been sent to {email}.</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
                <a
                  href={`${API_BASE}/api/payments/invoice-pdf/${registrationId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-glow"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <Download size={16} /> Download Invoice
                </a>
                <button className="btn-primary-glow" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
