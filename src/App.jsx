import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Timeline from './components/Timeline'
import Events from './components/Events'
import Sponsors from './components/Sponsors'
import Contact from './components/Contact'
import Faq from './components/Faq'
import SceneCanvas from './components/3d/SceneCanvas'
import CrackEffectOverlay from './components/fx/CrackEffectOverlay'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)

  const handleLoadingComplete = () => {
    setLoading(false)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  useEffect(() => {
    const handleSpace = (e) => {
      if (e.code === 'Space' && loading) {
        handleLoadingComplete()
      }
    }
    window.addEventListener('keydown', handleSpace)
    return () => window.removeEventListener('keydown', handleSpace)
  }, [loading])

  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const cursorDot = document.getElementById('cursor-dot')
    if (!cursor || !cursorDot) return

    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      cursorDot.style.left = mx + 'px'
      cursorDot.style.top = my + 'px'
    }

    let raf
    const loop = () => {
      cx += (mx - cx) * .16
      cy += (my - cy) * .16
      cursor.style.left = cx + 'px'
      cursor.style.top = cy + 'px'
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)

    const interactives = document.querySelectorAll('a,button,.magnetic')
    const onEnter = () => cursor.classList.add('grow')
    const onLeave = () => cursor.classList.remove('grow')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <SceneCanvas />
      <CrackEffectOverlay />
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div className="app">
        <Navbar />
        <Home ready={!loading} />
        <About />
        <Events />
        <Timeline />
        <Sponsors />
        <Faq />
        <Contact />
      </div>
    </>
  )
}

export default App