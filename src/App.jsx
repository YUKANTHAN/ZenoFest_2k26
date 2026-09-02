import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Hero from './components/Hero'
import About from './components/About'
import Create from './components/Create'
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
        <Hero onSkip={() => setLoading(false)} />
        <About />
        <Create />
      </div>
    </>
  )
}

export default App
