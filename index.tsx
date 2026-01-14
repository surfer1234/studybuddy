import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("StudyBuddy: Initializing Root Mount...");

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("StudyBuddy: React Render Triggered.");
  } catch (err) {
    console.error("StudyBuddy: Mounting failed", err);
  }
} else {
  console.error("StudyBuddy: Root element not found");
}

// Deferred Cleanup of Service Workers to avoid "invalid state" errors during early load
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => {
        for (let registration of registrations) {
          registration.unregister();
        }
      })
      .catch((err) => console.debug("SW cleanup skipped:", err));
  }
});
