/**
 * Minimal service worker - its only job is to make the site installable
 * ("Ajouter à l'écran d'accueil"). It does NOT cache anything: every request
 * falls through to the network untouched.
 */
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {
  // No-op fetch handler (required for installability) - network pass-through.
})
