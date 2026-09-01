import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <div className="app">
        <h1>Welcome to ZenoFest 2K26!</h1>
      </div>
    </>
  )
}

export default App
