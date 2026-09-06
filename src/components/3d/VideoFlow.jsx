import { useEffect, useRef } from 'react'

/**
 * VideoFlow — recreates the zenofest_glowing.mp4 background exactly in Canvas
 * 2D: near-black base, 46px cyan grid (drawn UNDER the particles), the video's
 * 150-particle field (cyan / blue / white / violet) with proximity connector
 * lines.
 *
 * Static + scroll: particles are pinned to static anchors with zero motion at
 * rest. While scrolling, PARALLAX > 1 makes the whole layer sweep faster than
 * the page, so the background's speed visibly rises with your scroll and
 * settles back to static the moment you stop.
 *
 * Interactive: pointer repels nearby particles, connector lines glow near the
 * cursor, cursor leaves a spark trail, and tapping/clicking fires a shockwave
 * ring + radial push (an echo of the video's finale burst).
 */

const COLORS = [
  [0, 240, 255], // CYAN
  [0, 150, 255], // BLUE
  [235, 246, 255], // WHITE
  [150, 120, 255], // VIOLET
]

const COUNT = 150
const GRID = 46 // px spacing (same as the video)
const PARALLAX = 3 // >1 = bg sweeps faster than the page when scrolling

export default function VideoFlow() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let w = 0
    let h = 0
    let sc = 1 // scale factor relative to the video's 1280px-wide canvas
    let rafId = 0
    let particles = []
    let rings = []
    let trail = [] // cursor sparks (screen space)
    let scrollX = 0
    let scrollY = 0
    const pointer = { cx: -1e4, cy: -1e4, active: false, down: false }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sc = w / 1280
    }

    const makeParticle = () => {
      // Same spawn distribution as the video: elliptical burst from center,
      // rr = sqrt(rand) * 1400 * 0.62 scaled to our width.
      const a = Math.random() * Math.PI * 2
      const rr = Math.sqrt(Math.random()) * w * 0.678
      return {
        x: w / 2 + Math.cos(a) * rr,
        y: h / 2 + Math.sin(a) * rr * 0.62,
        ax: w / 2 + Math.cos(a) * rr,
        ay: h / 2 + Math.sin(a) * rr * 0.62,
        vx: 0,
        vy: 0,
        s: Math.random() * 1.5 + 0.5,
        ph: Math.random() * Math.PI * 2,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }
    }

    const wrap = (v, m) => ((v % m) + m) % m

    const drawGrid = (offX, offY) => {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)'
      ctx.lineWidth = 1
      ctx.beginPath()
      const gx0 = wrap(offX, GRID)
      for (let x = gx0; x <= w; x += GRID) {
        ctx.moveTo(Math.round(x) + 0.5, 0)
        ctx.lineTo(Math.round(x) + 0.5, h)
      }
      const gy0 = wrap(offY, GRID)
      for (let y = gy0; y <= h; y += GRID) {
        ctx.moveTo(0, Math.round(y) + 0.5)
        ctx.lineTo(w, Math.round(y) + 0.5)
      }
      ctx.stroke()
    }

    const step = (t) => {
      // Opaque near-black base (video background), repainted every frame.
      ctx.fillStyle = '#04060d'
      ctx.fillRect(0, 0, w, h)

      const offX = scrollX * PARALLAX
      const offY = scrollY * PARALLAX
      const cx = pointer.cx + offX // cursor in world space
      const cy = pointer.cy + offY

      // Grid sits UNDER the particles, exactly like the video.
      drawGrid(offX, offY)

      // Particles are anchored and stationary — the field moves only when you
      // scroll (PARALLAX sweep) or interact with the pointer.
      for (const p of particles) {
        p.ph += 0.06
        // Minimum liveliness: a whisper of motion (a few px/s) so the field
        // reads as static yet is never visually dead. The anchor spring then
        // keeps it drifting around its resting spot, not wandering away.
        // Minimum but noticeable liveliness: particles sway a few pixels around
        // their anchor in a slow, visible drift (~5-7px travel, gentle speed),
        // then settle — reads as "static" but clearly alive.
        p.vx += Math.cos(t * 0.8 + p.ph * 0.5) * 0.03 * sc + (p.ax - p.x) * 0.006
        p.vy += Math.sin(t * 0.8 + p.ph * 0.5) * 0.02 * sc + (p.ay - p.y) * 0.006

        if (pointer.active && pointer.cx > -1e3) {
          const dx = p.x - cx
          const dy = p.y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 16) {
            if (pointer.down) {
              // Attract with a swirl so particles spiral in instead of stacking.
              const R = 360 * sc
              if (dist < R) {
                const m = (R - dist) / R
                const f = 0.55 * sc * m
                p.vx -= (dx / dist) * f + (-dy / dist) * f * 0.35
                p.vy -= (dy / dist) * f + (dx / dist) * f * 0.35
              }
              // Keep the cores from landing exactly on the cursor.
              if (dist < 40 * sc) {
                const k = ((40 * sc - dist) / (40 * sc)) * 1.1
                p.vx += (dx / dist) * k
                p.vy += (dy / dist) * k
              }
            } else {
              const R = 170 * sc
              if (dist < R) {
                const f = ((R - dist) / R) * 9 * sc
                p.vx += (dx / dist) * f
                p.vy += (dy / dist) * f
              }
            }
          }
        }

p.vx *= 0.9
        p.vy *= 0.9
        p.x += p.vx
        p.y += p.vy
      }
      // Cursor spark trail (drawn in screen space, attached to the cursor).
      for (let i = trail.length - 1; i >= 0; i--) {
        const s = trail[i]
        s.vx *= 0.9
        s.vy *= 0.9
        s.x += s.vx
        s.y += s.vy
        if (t - s.t0 > s.life) trail.splice(i, 1)
      }

      // Connector lines between close particles (video: 130px radius).
      ctx.lineWidth = 1
      const th = 130 * sc
      const th2 = th * th
      const cursorR2 = 200 * sc * 200 * sc
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < th2) {
            const d = Math.sqrt(d2)
            let op = (1 - d / th) * 0.22
            const mx = (a.x + b.x) / 2
            const my = (a.y + b.y) / 2
            const pdx = mx - cx
            const pdy = my - cy
            if (pdx * pdx + pdy * pdy < cursorR2) op += 0.3
            ctx.strokeStyle =
              'rgba(0, 220, 255, ' + (op > 1 ? 1 : op).toFixed(3) + ')'
            ctx.beginPath()
            ctx.moveTo(a.x - offX, a.y - offY)
            ctx.lineTo(b.x - offX, b.y - offY)
            ctx.stroke()
          }
        }
      }

      // Tie lines: particles near the cursor link straight to it.
      const ptie = 110 * sc
      const ptie2 = ptie * ptie
      ctx.lineWidth = 1
      for (const p of particles) {
        const pdx = p.x - cx
        const pdy = p.y - cy
        const d2 = pdx * pdx + pdy * pdy
        if (d2 < ptie2 && d2 > 1) {
          const d = Math.sqrt(d2)
          const op = (pointer.down ? 0.5 : 0.32) * (1 - d / ptie)
          ctx.strokeStyle = 'rgba(0, 240, 255, ' + op.toFixed(3) + ')'
          ctx.beginPath()
          ctx.moveTo(p.x - offX, p.y - offY)
          ctx.lineTo(pointer.cx, pointer.cy)
          ctx.stroke()
        }
      }

      // Interactive shockwave rings (echo of the video finale, user-triggered).
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i]
        const p = Math.min(1, (t - r.t0) / 1.4)
        if (p >= 1) {
          rings.splice(i, 1)
          continue
        }
        const rad = 30 * sc + p * Math.max(w, h) * 0.7
        const alp = Math.pow(1 - p, 1.3) * 0.4
        ctx.strokeStyle = 'rgba(0, 240, 255, ' + alp.toFixed(3) + ')'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.ellipse(r.x - offX, r.y - offY, rad, rad * 0.62, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Glowing dots, drawn wrapped exactly like the video (x % W, y % H).
      for (const p of particles) {
        const px = wrap(p.x - offX, w)
        const py = wrap(p.y - offY, h)
        const gl = Math.sin(p.ph) * 0.5 + 0.6
        const r = p.s * gl * sc
        ctx.fillStyle =
          'rgba(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ',0.16)'
        ctx.beginPath()
        ctx.arc(px, py, r * 2.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle =
          'rgb(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ')'
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Soft glow that follows the cursor.
      if (pointer.active && pointer.cx > -1e3) {
        const g = ctx.createRadialGradient(
          pointer.cx,
          pointer.cy,
          0,
          pointer.cx,
          pointer.cy,
          60 * sc
        )
        g.addColorStop(
          0,
          'rgba(0, 240, 255, ' + (pointer.down ? 0.16 : 0.1) + ')'
        )
        g.addColorStop(1, 'rgba(0, 240, 255, 0)')
        ctx.fillStyle = g
        ctx.fillRect(
          pointer.cx - 60 * sc,
          pointer.cy - 60 * sc,
          120 * sc,
          120 * sc
        )
      }

      // Cursor sparks.
      for (const s of trail) {
        const a = Math.max(0, 1 - (t - s.t0) / s.life)
        ctx.fillStyle =
          'rgba(' +
          s.c[0] +
          ',' +
          s.c[1] +
          ',' +
          s.c[2] +
          ',' +
          (a * 0.9).toFixed(3) +
          ')'
        ctx.beginPath()
        ctx.arc(s.x, s.y, Math.max(0.6, (2 - a) * 1.4 * sc), 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = (time) => {
      step(time / 1000)
      rafId = requestAnimationFrame(loop)
    }

    resize()
    scrollX = window.scrollX || 0
    scrollY = window.scrollY || 0
    particles = Array.from({ length: COUNT }, makeParticle)

    rafId = requestAnimationFrame(loop)

    const onMove = (e) => {
      const nx = e.clientX
      const ny = e.clientY
      const rest = Math.hypot(nx - pointer.cx, ny - pointer.cy)
      pointer.cx = nx
      pointer.cy = ny
      pointer.active = true
      if (rest < 0.5) return
      const count = pointer.down ? 2 : 1
      if (trail.length < 500) {
        for (let i = 0; i < count; i++) {
          const c = COLORS[(Math.random() * COLORS.length) | 0]
          trail.push({
            x: nx + (Math.random() - 0.5) * 8,
            y: ny + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 3 * sc,
            vy: (Math.random() - 0.5) * 3 * sc,
            c,
            t0: performance.now() / 1000,
            life: 0.5 + Math.random() * 0.4,
          })
        }
      }
    }
    const onDown = (e) => {
      pointer.down = true
      pointer.active = true
      pointer.cx = e.clientX
      pointer.cy = e.clientY
      const offX = scrollX * PARALLAX
      const offY = scrollY * PARALLAX
      rings.push({
        x: e.clientX + offX,
        y: e.clientY + offY,
        t0: performance.now() / 1000,
      })
      const R = 180 * sc
      const R2 = R * R
      const cx = e.clientX + offX
      const cy = e.clientY + offY
      for (const p of particles) {
        const dx = p.x - cx
        const dy = p.y - cy
        const d2 = dx * dx + dy * dy
        if (d2 < R2 && d2 > 1) {
          const d = Math.sqrt(d2)
          const f = ((R - d) / R) * 14
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }
      }
    }
    const onUp = () => {
      pointer.down = false
    }
    const onScroll = () => {
      scrollX = window.scrollX || 0
      scrollY = window.scrollY || 0
    }
    const onResize = () => {
      resize()
      particles = Array.from({ length: COUNT }, makeParticle)
    }
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId)
        rafId = 0
      } else if (!rafId) {
        rafId = requestAnimationFrame(loop)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}