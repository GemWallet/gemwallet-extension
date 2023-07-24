/*
 * Pings the background script to keep it alive, for session management.
 */
export {};

setInterval(() => {
  navigator.serviceWorker.ready.then((registration: ServiceWorkerRegistration) => {
    registration.active?.postMessage('keepAlive');
  });
}, 20e3);
