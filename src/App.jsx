import { useState, useEffect } from 'react'
import Splash from './components/Splash.jsx'  // Importa el splash
import ExpenseForm from './components/Form.jsx'
import { addExpense, listExpenses, clearExpenses } from './utils/db.js'
import { requestNotificationPermissionAndSubscribe } from './utils/notifications.js'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [route, setRoute] = useState(window.location.hash || '#/lista')
  const [expenses, setExpenses] = useState([])
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800) 
    return () => clearTimeout(timer)
  }, [])

  // Solicitar permiso de notificaciones y suscribirse (si hay VAPID)
  useEffect(() => {
    (async () => {
      try {
        const result = await requestNotificationPermissionAndSubscribe()
        // Opcional: podríamos mostrar un toast según "result.permission" o "result.subscribed"
        console.log('[Notifications] permiso/suscripción:', result)
      } catch (e) {
        console.warn('[Notifications] error:', e)
      }
    })()
  }, [])

  useEffect(() => {
    const handler = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)
    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const items = await listExpenses()
        setExpenses(items)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  if (isLoading) {
    return <Splash />
  }

  const handleAdd = async (expense) => {
    try {
      const id = await addExpense(expense)
      const items = await listExpenses()
      setExpenses(items)
      alert(`Gasto guardado offline (id: ${id}).`)
    } catch (e) {
      console.error(e)
      alert('No se pudo guardar el gasto. Intenta nuevamente.')
    }
  }

  const handleClear = async () => {
    try {
      await clearExpenses()
      setExpenses([])
      alert('Gastos borrados.')
    } catch (e) {
      console.error(e)
      alert('No se pudieron borrar los gastos.')
    }
  }

  if (route === '#/form') {
    return (
      <div style={{ padding: 16 }}>
        <h1 style={{ textAlign: 'center', backgroundColor: '#a5cc7f', padding: '10px', borderRadius: '8px', color: 'white' }}>
          Registrar gasto
        </h1>
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/#/" className="btn" style={{ display: 'inline-block', backgroundColor: '#a5cc7f', color: '#fff', padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>
            ← Volver al dashboard
          </a>
          <span aria-live="polite" style={{ fontSize: 12, padding: '4px 8px', borderRadius: 999, backgroundColor: isOnline ? '#4caf50' : '#d9534f', color: '#fff' }}>
            {isOnline ? 'Conectado' : 'Sin conexión'}
          </span>
        </div>
        <ExpenseForm onAdd={handleAdd} />
      </div>
    )
  }

  if (route === '#/lista') {
    return (
      <div style={{ padding: 16 }}>
        <h1 style={{ textAlign: 'center', backgroundColor: '#a5cc7f', padding: '10px', borderRadius: '8px', color: 'white' }}>
          Lista de gastos guardados
        </h1>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/#/" className="btn" style={{ display: 'inline-block', backgroundColor: '#a5cc7f', color: '#fff', padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>
            ← Volver al dashboard
          </a>
          <button onClick={handleClear} style={{ backgroundColor: '#a5cc7f', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Limpiar gastos
          </button>
          <span aria-live="polite" style={{ fontSize: 12, padding: '4px 8px', borderRadius: 999, backgroundColor: isOnline ? '#4caf50' : '#d9534f', color: '#fff' }}>
            {isOnline ? 'Conectado' : 'Sin conexión'}
          </span>
        </div>
        {expenses.length === 0 ? (
          <p>No hay gastos guardados.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {expenses.map((e) => (
              <li key={e.id} style={{ background: '#f3f3f3', marginBottom: 8, padding: 8, borderRadius: 6 }}>
                <strong>{e.description}</strong> — ${Number(e.amount).toFixed(2)} — {e.category} — {e.date}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <>
      <div>
        <h1 style={{ textAlign: 'center', backgroundColor: '#a5cc7f', padding: '10px', borderRadius: '8px', color: 'white' }}>
          Balance+
        </h1>
        <h1 style={{ textAlign: 'center', backgroundColor: '#a5cc7f', padding: '10px', borderRadius: '8px', color: 'white' }}>
          Control de Gastos Personales
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <span aria-live="polite" style={{ fontSize: 12, padding: '4px 8px', borderRadius: 999, backgroundColor: isOnline ? '#4caf50' : '#d9534f', color: '#fff' }}>
            {isOnline ? 'Conectado' : 'Sin conexión'}
          </span>
        </div>
        <div className="card">
          <a href="/#/form" className="btn" style={{ display: 'inline-block', backgroundColor: '#a5cc7f', color: '#fff', padding: '10px 14px', borderRadius: 8, textDecoration: 'none' }}>
            Abrir formulario
          </a>
          <a href="/#/lista" className="btn" style={{ display: 'inline-block', marginLeft: 8, backgroundColor: '#a5cc7f', color: '#fff', padding: '10px 14px', borderRadius: 8, textDecoration: 'none' }}>
            Ver lista
          </a>
        </div>
        <div style={{ marginTop: 16 }}>
          <h2>Gastos guardados (offline)</h2>
          {expenses.length === 0 ? (
            <p>No hay gastos guardados.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {expenses.map((e) => (
                <li key={e.id} style={{ background: '#f3f3f3', marginBottom: 8, padding: 8, borderRadius: 6 }}>
                  <strong>{e.description}</strong> — ${Number(e.amount).toFixed(2)} — {e.category} — {e.date}
                </li>
              ))}
            </ul>
          )}
          <button onClick={handleClear} style={{ backgroundColor: '#a5cc7f', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Limpiar gastos
          </button>
        </div>
      </div>
    </>
  )
}

export default App
