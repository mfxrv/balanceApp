import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      injectRegister: 'auto',
      registerType: "autoUpdate",
      includeAssets: ['icons/icon-192x192.png', 'icons/icon-512x512.png', 'vite.svg', 'offline.html'],
      manifest: {
        "name": "Balance+ Control de Gastos Personales",
        "short_name": "Balance+",
        "description": "Ayudar a los usuarios a registrar, visualizar y analizar sus ingresos y egresos diarios, con una interfaz intuitiva y accesible desde cualquier dispositivo",
        "start_url": "/",
        "display": "standalone",
        "orientation": "any",
        "scope": "/",
        "lang": "es",
        "background_color": "#e0e0e0",
        "theme_color": "#a5cc7f",
        "prefer_related_applications": false,
        "icons": [
          {
            "src": "icons/icon-96x96.png",
            "sizes": "96x96",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "icons/icon-128x128.png",
            "sizes": "128x128",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "icons/icon-144x144.png",
            "sizes": "144x144",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "icons/icon-152x152.png",
            "sizes": "152x152",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "icons/icon-180x180.png",
            "sizes": "180x180",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "icons/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "icons/icon-96x96.png",
            "sizes": "96x96",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "icons/icon-128x128.png",
            "sizes": "128x128",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "icons/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
})
