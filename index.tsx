import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * FIXED: ServiceWorker errors often occur if we query registrations too early
 * or during transition phases. Wrapping in a check and DOM readiness.
 */
const cleanupServiceWorkers = async () => {
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    } catch (err) {
      console.debug("SW Cleanup skipped:", err);
    }
  }
};

// Start boot process
console.log("StudyBuddy: Initializing...");

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
  
  // Clean up workers after a small delay to ensure page is stable
  setTimeout(cleanupServiceWorkers, 1000);
} else {
  console.error("Critical Error: Root element missing");
}
