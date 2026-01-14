import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Onmiddellijke polyfill voor process.env
(window as any).process = { env: { API_KEY: '' }, ...(window as any).process };

// Detecteer of het laden vastloopt (na 5 seconden)
const stuckTimer = setTimeout(() => {
    const stuckMsg = document.getElementById('stuck-message');
    if (stuckMsg) stuckMsg.style.display = 'block';
}, 5000);

// Global error handler
window.addEventListener('error', (event) => {
    console.error('StudyBuddy Crash:', event.error);
    clearTimeout(stuckTimer);
    const root = document.getElementById('root');
    if (root && root.innerHTML.includes('loading-state')) {
        root.innerHTML = `
            <div style="color: white; padding: 40px; font-family: sans-serif; background: #020617; height: 100dvh; display: flex; flex-direction: column; justify-content: center;">
                <h2 style="color: #ef4444; font-size: 24px;">Hulp nodig! 🚨</h2>
                <p style="opacity: 0.7; margin: 10px 0 20px;">De app kon niet veilig opstarten.</p>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; font-family: monospace; font-size: 11px; margin-bottom: 20px; overflow: auto; border: 1px solid rgba(239, 68, 68, 0.2);">
                    ${event.error?.message || 'Script Error'}
                </div>
                <button onclick="location.reload()" style="background: #3b82f6; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: bold;">Probeer Opnieuw</button>
            </div>
        `;
    }
});

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // Verwijder de "stuck timer" zodra React begint te renderen
    clearTimeout(stuckTimer);
    console.log("React render sequence started.");
  } catch (err) {
    console.error("Mounting error:", err);
  }
}