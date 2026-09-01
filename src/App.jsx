import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import About from './components/About'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <div className="app">
        <About />
      </div>
    </>
  )
}

export default App
