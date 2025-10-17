import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute, NavigationRoute, setCatchHandler } from 'workbox-routing'
import { NetworkFirst, NetworkOnly, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { BackgroundSyncPlugin } from 'workbox-background-sync'
import { openDB } from 'idb'

self.skipWaiting()
clientsClaim()

//Precachea recursos generados en build
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

//Navegacion de paginas, index.html desde precache (cache-first)
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))

registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new CacheFirst({
    cacheName: 'app-shell',
    plugins: [new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 7 * 24 * 60 * 60 })],
  })
)

//Stale-while-revalidate para imagenes y fuentes
registerRoute(
  ({ request, url }) => request.destination === 'image' || url.pathname.startsWith('/icons/'),
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 })],
  })
)
registerRoute(
  ({ request }) => request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'fonts',
    plugins: [new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 24 * 60 * 60 })],
  })
)

//NetworkFirst para APIs GET con cache
registerRoute(
  ({ url, request }) => url.pathname.startsWith('/api/') && request.method === 'GET',
  new NetworkFirst({
    cacheName: 'api-data',
    networkTimeoutSeconds: 3,
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 5 * 60 })],
  }),
  'GET'
)

//Fallback 
setCatchHandler(async ({ event }) => {
  if (event.request.destination === 'document') {
    const cached = await caches.match('/offline.html')
    if (cached) return cached
    return Response.error()
  }
  return Response.error()
})

// Push notifications: mostrar notificación con payload
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = { title: 'Balance+', body: event.data?.text() || 'Tienes una actualización' }
  }

  const title = data.title || 'Balance+'
  const options = {
    body: data.body || 'Nueva notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    data: { url: data.url || '/#/' },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Clic en notificación: abrir o enfocar la app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification?.data?.url || '/#/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl)
    })
  )
})

// Background sync para POST de gastos
const bgSyncPlugin = new BackgroundSyncPlugin('expenses-queue', {
  maxRetentionTime: 24 * 60, 
})

registerRoute(
  ({ url, request }) => url.pathname.startsWith('/api/expenses') && request.method === 'POST',
  new NetworkOnly({ plugins: [bgSyncPlugin] }),
  'POST'
)

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-expenses') {
    event.waitUntil(syncExpensesFromIDB())
  }
})

async function syncExpensesFromIDB() {
  try {
    const db = await openDB('balance-db', 1)
    const tx = db.transaction('expenses', 'readonly')
    const items = await tx.store.getAll()
    await tx.done

    if (!items || items.length === 0) return

    for (const expense of items) {
      const ok = await sendExpense(expense)
      if (ok && typeof expense.id !== 'undefined') {
        await deleteExpenseFromIDB(expense.id)
      }
    }
  } catch (err) {
    console.error('[SW] syncExpensesFromIDB error', err)
  }
}

async function sendExpense(expense) {
  try {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    })
    if (!res.ok) throw new Error('Failed to POST expense')
    return true
  } catch (err) {
    console.warn('[SW] sendExpense failed, will retry later', err)
    return false
  }
}

async function deleteExpenseFromIDB(id) {
  try {
    const db = await openDB('balance-db', 1)
    const tx = db.transaction('expenses', 'readwrite')
    await tx.store.delete(id)
    await tx.done
  } catch (err) {
    console.error('[SW] deleteExpenseFromIDB error', err)
  }
}