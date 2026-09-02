import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import About from './components/About'
import Events from './components/Events'
import Gallery from './components/Gallery'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)

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
