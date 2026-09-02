import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
<<<<<<< HEAD
import Navbar from './components/Navbar'
import About from './components/About'
import Events from './components/Events'
import Gallery from './components/Gallery'
=======
import Hero from './components/Hero'
import About from './components/About'
import Create from './components/Create'
>>>>>>> 7b975c46f4675a0fa76e30470c4a42b1728d5b4e
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
<<<<<<< HEAD
        <Navbar />
        <About />
        <Events />
        <Gallery />
=======
        <Hero onSkip={() => setLoading(false)} />
        <About />
        <Create />
>>>>>>> 7b975c46f4675a0fa76e30470c4a42b1728d5b4e
      </div>
    </>
  )
}

export default App
