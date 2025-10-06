// Escuchar el evento de instalación y precachear recursos.
self.addEventListener("install", (event) => {
    console.log("Service Worker instalado.");
    event.waitUntil(
        caches.open("v1").then((cache) => {
            console.log("Cache creado y recursos precacheados.");
            return cache.addAll([
                "/", // Ruta de inicio.
                "/index.html", // Tu archivo HTML principal.
                "/vite.svg", // Tu logo de Vite.
                "/styles.css", // Archivos de estilo.
                "/icon-192x192.png", // Icono pequeño.
                "/icon-512x512.png", // Icono grande.
                "/assets/logo.svg", // Tu logo de Vite.
            ]);
        })
    );
});

// Activar el Service Worker y limpiar cachés antiguas.
self.addEventListener("activate", (event) => {
    console.log("Service Worker activado.");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== "v1") {
                        console.log("Caché antigua eliminada:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar solicitudes de red y responder desde caché.
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    if (url.pathname.startsWith("/@vite") || 
    url.pathname.startsWith("/@react-refresh") ||
    url.pathname.startsWith("/src/")) {
    return;
    
}
    console.log("Interceptando solicitud:", event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).catch((error) => {
                console.error("Error al recuperar la solicitud:", error);
                if (event.request.mode === "navigate") {
                    return caches.match("/index.html");
                }
                return new Response("Offline mode", {
                    status: 503,
                    statusText: "Service Unavailable",
                })
            });
        })
    );
});
