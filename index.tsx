import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Functie om de loader te verwijderen
const hideLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// FORCEER UNREGISTER VAN OUDE SERVICE WORKER
// Dit voorkomt caching van verouderde versies op mobiele browsers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
      }
    })
    .catch((err) => {
      console.debug("ServiceWorker registration access skipped:", err);
    });
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Verwijder de initial loader zodra React klaar is
setTimeout(hideLoader, 100);