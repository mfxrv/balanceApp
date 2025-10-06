import { useState, useEffect } from 'react'
import Splash from './components/Splash.jsx'  // Importa el splash

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [count, setCount] = useState(0)

  // Simula la carga, en producción puedes esperar a datos, assets, etc.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2 segundos de splash, ajusta a tu gusto
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Splash />
  }

  return (
    <>
      <div>
        {/* Aquí tu contenido normal */}
        <h1 style={{ textAlign: 'center', backgroundColor: '#a5cc7f', padding: '10px', borderRadius: '8px', color: 'white' }}>
          Balance+
        </h1>
        <h1 style={{ textAlign: 'center', backgroundColor: '#a5cc7f', padding: '10px', borderRadius: '8px', color: 'white' }}>
          Control de Gastos Personales
        </h1>

      </div>
    </>
  )
}

export default App
