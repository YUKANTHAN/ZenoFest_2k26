import { useState, useEffect, useRef } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import * as THREE from 'three'
import './ContactEarth.css'

/**
 * ZenoFest Contact — Full-Screen Scroll Zoom Earth
 * Mirrors the Abhisarga /contact location experience without R3F/gsap:
 *   Phase 0..0.1 : earth autospins in deep space (stars)
 *   Phase 0.1..0.3: globe locks onto PSR Engineering College, mild push-in
 *   Phase 0.3..1.0: camera dives toward the pin
 *   Phase 0.74..1 : satellite map (Google tiles) fades in over the dive,
 *                   pulsing marker + location card
 * All driven by framer-motion useScroll on a stickied 400vh block.
 */

const LAT = 9.294 // PSR Engineering College, Sivakasi
const LON = 77.702
const DEG2RAD = Math.PI / 180

const ALIGN_YAW = -(LON + 90) * DEG2RAD
const TILT_X = LAT * DEG2RAD

const TILE = 256 // Google tile pixel size

// Satellite tile grid padding: cover the viewport plus a healthy margin so no
// dark gap ever shows at scale(1) (the zoom-in scales the tile block smaller
// than its laid-out pixels, so it must start oversized).
function tilePad(px) {
  return Math.min(8, Math.ceil(px / TILE / 2) + 2)
}

const TEX = {
  day: '/textures/earth-day-hq.jpg',
  clouds: '/textures/earth-clouds-hq.jpg',
  bump: '/textures/earth-bump.jpg',
  specular: '/textures/earth-specular.jpg'
}

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const clampEqualize = clamp01
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

function makeLabelTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 220
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const x = 16
  const y = 16
  const w = canvas.width - 32
  const h = canvas.height - 32
  const r = 26

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  ctx.fillStyle = 'rgba(4, 14, 24, 0.92)'
  ctx.fill()
  ctx.lineWidth = 6
  ctx.strokeStyle = '#22d3ee'
  ctx.shadowColor = 'rgba(34, 211, 238, 0.8)'
  ctx.shadowBlur = 26
  ctx.stroke()
  ctx.restore()

  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.font = "bold 58px 'Segoe UI', 'Trebuchet MS', sans-serif"
  ctx.fillStyle = '#e0f2fe'
  ctx.shadowColor = 'rgba(6, 182, 212, 0.7)'
  ctx.shadowBlur = 16
  ctx.fillText('PSR Engineering College', x + 52, y + 52)

  ctx.font = "40px 'Segoe UI', 'Trebuchet MS', sans-serif"
  ctx.fillStyle = '#67e8f9'
  ctx.shadowBlur = 10
  ctx.fillText('Sivakasi · Tamil Nadu · 9.294°N 77.702°E', x + 52, y + 130)

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function EarthGlobe({ progressRef }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#04070f')

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200)
    camera.position.set(0, 0, 3.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    scene.add(new THREE.AmbientLight(0x8899bb, 1.0))
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.3)
    keyLight.position.set(3, 2, 6)
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight(0x22d3ee, 0.7)
    rimLight.position.set(-4, 3, 2)
    scene.add(rimLight)
    const fillLight = new THREE.DirectionalLight(0x8b5cf6, 0.5)
    fillLight.position.set(-2, -4, 4)
    scene.add(fillLight)

    // Starfield
    const starCount = 1400
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 6 + Math.random() * 14
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      starPos[i * 3 + 1] = r * Math.cos(phi)
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xcfeaff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // Earth group (rotates to align with the campus)
    const globe = new THREE.Group()
    scene.add(globe)

    const earthGeo = new THREE.SphereGeometry(1, 64, 64)
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: new THREE.Color(0x333344),
      shininess: 16,
      bumpScale: 0.05
    })
    const earth = new THREE.Mesh(earthGeo, earthMat)
    globe.add(earth)

    const loader = new THREE.TextureLoader()
    loader.load(TEX.day, (tex) => {
      earthMat.map = tex
      earthMat.needsUpdate = true
    })
    loader.load(TEX.bump, (tex) => {
      earthMat.bumpMap = tex
      earthMat.needsUpdate = true
    })
    loader.load(TEX.specular, (tex) => {
      earthMat.specularMap = tex
      earthMat.needsUpdate = true
    })

    const cloudGeo = new THREE.SphereGeometry(1.012, 48, 48)
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    const clouds = new THREE.Mesh(cloudGeo, cloudMat)
    loader.load(TEX.clouds, (tex) => {
      cloudMat.map = tex
      cloudMat.needsUpdate = true
    })
    globe.add(clouds)

    // Atmosphere halo
    const haloGeo = new THREE.SphereGeometry(1.13, 48, 48)
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    globe.add(new THREE.Mesh(haloGeo, haloMat))

    // Location pin (local frame, surface point for LAT/LON on this texture set)
    const polar = (90 - LAT) * DEG2RAD
    const offset = (LON + 180) * DEG2RAD
    const d = new THREE.Vector3(
      -Math.sin(polar) * Math.cos(offset),
      Math.cos(polar),
      Math.sin(polar) * Math.sin(offset)
    )
    const pinNormal = d.clone().normalize()
    const pinPos = pinNormal.clone().multiplyScalar(1.004)
    const labelPos = pinNormal.clone().multiplyScalar(1.34)

    const pinHolder = new THREE.Group()
    pinHolder.position.copy(pinPos)
    pinHolder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pinNormal)

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const ringBig = new THREE.Mesh(new THREE.RingGeometry(0.016, 0.021, 40), ringMat)
    const ringSmall = new THREE.Mesh(
      new THREE.RingGeometry(0.023, 0.029, 40),
      ringMat.clone()
    )
    ringSmall.material.opacity = 0.55
    pinHolder.add(ringBig, ringSmall)

    const stalkMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const stalk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0035, 0.0035, 0.05, 8),
      stalkMat
    )
    stalk.position.y = 0.025
    pinHolder.add(stalk)

    const tipMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const tip = new THREE.Mesh(new THREE.OctahedronGeometry(0.0075, 0), tipMat)
    tip.position.y = 0.052
    pinHolder.add(tip)

    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), glowMat)
    glow.position.y = 0.052
    pinHolder.add(glow)

    globe.add(pinHolder)

    const labelTex = makeLabelTexture()
    const labelMat = new THREE.SpriteMaterial({
      map: labelTex,
      transparent: true,
      depthTest: false,
      opacity: 0
    })
    const label = new THREE.Sprite(labelMat)
    label.position.copy(labelPos)
    label.scale.set(0.82, 0.176, 1)
    globe.add(label)

    // Scroll-programmed camera & rotation
    let animationFrameId
    const clock = new THREE.Clock()
    const state = { phase2: false, startYaw: 0 }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      const r = clamp01(progressRef.current)
      const time = t

      clouds.rotation.y += 0.0016
      stars.rotation.y = time * 0.008

      if (r < 0.1) {
        state.phase2 = false
        globe.rotation.y = 0.2 * time
        globe.rotation.x = 0
        camera.position.z = 3.5
      } else if (r < 0.3) {
        if (!state.phase2) {
          state.phase2 = true
          state.startYaw = globe.rotation.y
        }
        const e = easeOutCubic(clamp01((r - 0.1) / 0.2))
        globe.rotation.y = state.startYaw + (ALIGN_YAW - state.startYaw) * e
        globe.rotation.x = 0
        camera.position.z = 3.5 - 0.5 * e
      } else {
        const e = clamp01((r - 0.3) / 0.7)
        globe.rotation.y = ALIGN_YAW
        globe.rotation.x = TILT_X
        camera.position.z = 3 - 1.94 * e
      }
      camera.lookAt(0, 0, 0)

      const pulse = 0.5 + 0.5 * Math.sin(time * 2.1)
      ringBig.scale.setScalar(1 + pulse * 0.9)
      ringSmall.scale.setScalar(1 + pulse * 0.55)
      ringMat.opacity = 0.35 + pulse * 0.55
      ringSmall.material.opacity = (0.5 + pulse * 0.3) * 0.55
      tip.position.y = 0.052 + Math.sin(time * 2.1) * 0.008
      glow.position.y = tip.position.y

      label.material.opacity = clamp01((r - 0.5) / 0.12)

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!mountRef.current) return
      const w = mountRef.current.clientWidth || window.innerWidth
      const h = mountRef.current.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      earthGeo.dispose()
      earthMat.dispose()
      cloudGeo.dispose()
      cloudMat.dispose()
      haloGeo.dispose()
      haloMat.dispose()
      starGeo.dispose()
      starMat.dispose()
      ringBig.geometry.dispose()
      ringSmall.geometry.dispose()
      ringMat.dispose()
      ringSmall.material.dispose()
      stalk.geometry.dispose()
      stalkMat.dispose()
      tip.geometry.dispose()
      tipMat.dispose()
      glow.geometry.dispose()
      glowMat.dispose()
      labelMat.dispose()
      labelTex.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [progressRef])

  return (
    <div
      ref={mountRef}
      className="contact-earth-canvas"
      aria-hidden="true"
    />
  )
}

function tileXY(lat, lon, z) {
  const n = Math.pow(2, z)
  const latRad = lat * DEG2RAD
  const x = ((lon + 180) / 360) * n
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  return { x, y }
}

function SatelliteMap({ opacity, scale, cardOpacity, size }) {
  const Z = 17 // Google satellite tile zoom level (Abhisarga style ~15/17/18)
  const { width, height } = size
  const n = Math.pow(2, Z)
  const anchor = tileXY(LAT, LON, Z)
  const x = anchor.x
  const y = anchor.y

  const padX = tilePad(width)
  const padY = tilePad(height)
  const x0 = Math.floor(x) - padX
  const x1 = Math.floor(x) + padX
  const y0 = Math.floor(y) - padY
  const y1 = Math.floor(y) + padY

  const tiles = []
  for (let ix = x0; ix <= x1; ix++) {
    for (let iy = y0; iy <= y1; iy++) {
      const wx = ((ix % n) + n) % n
      const wy = ((iy % n) + n) % n
      tiles.push({
        key: `${ix}-${iy}`,
        left: (ix - x) * TILE + width / 2,
        top: (iy - y) * TILE + height / 2,
        wx,
        wy
      })
    }
  }

  const mapOpacity = opacity
  const mapScale = scale

  return (
    <div className="contact-earth-map" style={{ opacity: mapOpacity }}>
      <div className="contact-earth-tiles" style={{ transform: `scale(${mapScale})` }}>
        {tiles.map((t) => (
          <div key={t.key} className="contact-earth-tile" style={{ left: t.left, top: t.top }}>
            <img
              src={`https://mt1.google.com/vt/lyrs=s&x=${t.wx}&y=${t.wy}&z=${Z}`}
              alt=""
              decoding="async"
            />
            <img
              src={`https://mt1.google.com/vt/lyrs=h&x=${t.wx}&y=${t.wy}&z=${Z}`}
              alt=""
              decoding="async"
              className="contact-earth-tile-labels"
            />
          </div>
        ))}
      </div>

      <div className="contact-earth-vignette" />

      <div className="contact-earth-marker">
        <span className="contact-earth-marker-ping" />
        <span className="contact-earth-marker-pulse" />
        <span className="contact-earth-marker-core">🏛️</span>
      </div>

      <div className="contact-earth-card" style={{ opacity: cardOpacity }}>
        <div className="contact-earth-card-title">📍 PSR Engineering College</div>
        <div className="contact-earth-card-sub">Sevalpatti, Sivakasi · Tamil Nadu 626140</div>
        <div className="contact-earth-card-coords">9.294°N · 77.702°E</div>
        <div className="contact-earth-card-tag">ZENOFEST 2K26 · MAIN VENUE</div>
      </div>
    </div>
  )
}

export default function ContactEarth() {
  const pinRef = useRef(null)
  const stickyRef = useRef(null)
  const progressRef = useRef(0)
  const [prog, setProg] = useState(0)
  const [size, setSize] = useState({ width: 0, height: 0 })

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ['start start', 'end end']
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progressRef.current = v
    setProg(v)
  })

  const on = prog >= 0.7
  const hintOpacity = clampEqualize(1 - prog / 0.08)
  const canvasMask = clampEqualize(1 - (prog - 0.72) / 0.16)
  const mapOpacity = clampEqualize((prog - 0.72) / 0.1)
  const mapScale = 1.35 - 0.35 * clampEqualize((prog - 0.78) / 0.22)
  const cardOpacity = clampEqualize((prog - 0.9) / 0.07)

  useEffect(() => {
    const el = stickyRef.current
    if (!el) return
    const update = () =>
      setSize({ width: el.clientWidth, height: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="contact-earth-pin" ref={pinRef}>
      <div className="contact-earth-sticky" ref={stickyRef}>
        <div className="contact-earth-canvas-wrap" style={{ opacity: canvasMask }}>
          <EarthGlobe progressRef={progressRef} />
        </div>

        {on && size.width > 0 && (
          <SatelliteMap
            opacity={mapOpacity}
            scale={mapScale}
            cardOpacity={cardOpacity}
            size={size}
          />
        )}

        <div className="contact-earth-hint" style={{ opacity: hintOpacity }}>
          <span className="contact-earth-hint-line" />
          <span className="contact-earth-hint-text">SCROLL TO ZOOM INTO THE VENUE</span>
        </div>
      </div>
    </div>
  )
}