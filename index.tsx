import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Ensure 'process' is available for the Gemini SDK in a browser environment
if (typeof (window as any).process === 'undefined') {
    (window as any).process = { env: { API_KEY: '' } };
}

// Global error handler to catch mobile-specific JS failures
window.addEventListener('error', (event) => {
    console.error('StudyBuddy Startup Error:', event.error);
    const root = document.getElementById('root');
    // If the error happens before the app clears the loading state
    if (root && root.querySelector('.loading-state')) {
        root.innerHTML = `
            <div style="color: white; padding: 40px; font-family: sans-serif; background: #020617; height: 100dvh; display: flex; flex-direction: column; justify-content: center;">
                <h2 style="color: #ef4444; font-size: 24px;">Hulp nodig! 🚨</h2>
                <p style="opacity: 0.7; margin: 10px 0 20px;">Je browser blokkeert de verbinding of is te verouderd.</p>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; font-family: monospace; font-size: 11px; margin-bottom: 20px; overflow: auto; border: 1px solid rgba(239, 68, 68, 0.2);">
                    ${event.error?.message || 'Onbekende fout'}
                </div>
                <button onclick="location.reload()" style="background: #3b82f6; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: bold; font-size: 16px;">App Herstarten</button>
            </div>
        `;
    }
});

console.log("Bootstrap starting...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(<App />);
    console.log("React mounting...");
  } catch (err) {
    console.error("React Mounting Failed:", err);
  }
} else {
  console.error("Critical DOM Error: #root missing.");
}
