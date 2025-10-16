export async function requestNotificationPermissionAndSubscribe() {
  if (typeof window === 'undefined') return { supported: false }
  const hasNotification = 'Notification' in window
  const hasSW = 'serviceWorker' in navigator
  if (!hasNotification || !hasSW) return { supported: false }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    return { supported: true, permission }
  }

  try {
    const reg = await navigator.serviceWorker.ready
    const hasPush = 'pushManager' in reg
    if (!hasPush) return { supported: true, permission, pushSupported: false }

    const existing = await reg.pushManager.getSubscription()
    if (existing) return { supported: true, permission, subscribed: true }

    const vapid = import.meta?.env?.VITE_VAPID_PUBLIC_KEY
    if (!vapid) {
      // Sin VAPID no nos suscribimos; el permiso sigue concedido.
      return { supported: true, permission, subscribed: false, reason: 'missing_vapid' }
    }

    const applicationServerKey = urlBase64ToUint8Array(vapid)
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })
    // En un entorno real, enviar "sub" al backend para guardar la suscripción.
    return { supported: true, permission, subscribed: !!sub }
  } catch (e) {
    return { supported: true, permission, error: e?.message || String(e) }
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}