import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import About from './components/About'
import Events from './components/Events'
import Gallery from './components/Gallery'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleSpace = (e) => {
      if (e.code === 'Space' && loading) {
        setLoading(false)
      }
    }
    window.addEventListener('keydown', handleSpace)
    return () => window.removeEventListener('keydown', handleSpace)
  }, [loading])

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <div className="app">
        <Navbar />
        <About />
        <Events />
        <Gallery />
      </div>
    </>
  )
}

export default App
