import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Onmiddellijke polyfill voor process.env VOORDAT er iets anders gebeurt
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: { API_KEY: '' } };
}

console.log("StudyBuddy: Systeem check...");

// Detecteer of het laden vastloopt (na 4 seconden voor snellere feedback)
const stuckTimer = setTimeout(() => {
    const stuckMsg = document.getElementById('stuck-message');
    if (stuckMsg) stuckMsg.style.display = 'block';
}, 4000);

// Global error handler
window.addEventListener('error', (event) => {
    console.error('StudyBuddy Runtime Crash:', event.error);
    clearTimeout(stuckTimer);
    const root = document.getElementById('root');
    if (root && root.innerHTML.includes('loading-state')) {
        root.innerHTML = `
            <div style="color: white; padding: 40px; font-family: sans-serif; background: #020617; height: 100dvh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                <div style="font-size: 60px; margin-bottom: 20px;">🚨</div>
                <h2 style="color: #ef4444; font-size: 24px; font-weight: 900;">STARTUP ERROR</h2>
                <p style="opacity: 0.7; margin: 10px 0 20px; font-size: 14px;">Er ging iets mis tijdens het laden van de scripts.</p>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; font-family: monospace; font-size: 10px; margin-bottom: 25px; overflow: auto; border: 1px solid rgba(255, 255, 255, 0.1); width: 100%; max-width: 300px;">
                    ${event.error?.message || event.message || 'Script execution failed'}
                </div>
                <button onclick="location.reload(true)" style="background: #3b82f6; color: white; border: none; padding: 16px 32px; border-radius: 14px; font-weight: 800; font-size: 16px; width: 100%; max-width: 300px;">OPNIEUW PROBEREN</button>
            </div>
        `;
    }
});

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    // Renderen zonder StrictMode voor maximale compatibiliteit op mobiel
    root.render(<App />);
    
    // Verwijder de "stuck timer" zodra React begint te renderen
    clearTimeout(stuckTimer);
    console.log("StudyBuddy: React mounted successfully.");
  } catch (err) {
    console.error("Critical Mounting Error:", err);
  }
} else {
  console.error("Critical DOM Error: #root element missing.");
}
