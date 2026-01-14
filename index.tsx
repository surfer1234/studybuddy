import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Global error handler to debug "black screen" issues
window.addEventListener('error', (event) => {
    console.error('StudyBuddy Startup Error:', event.error);
    const root = document.getElementById('root');
    if (root && root.innerHTML === '') {
        root.innerHTML = `
            <div style="color: white; padding: 30px; font-family: sans-serif; background: #020617; height: 100vh;">
                <h2 style="color: #ef4444;">Oops! Startup Failed.</h2>
                <p style="opacity: 0.7;">This usually happens due to a browser compatibility issue or version mismatch.</p>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px; margin: 20px 0; overflow: auto;">
                    ${event.error?.message || 'Unknown Error'}
                </div>
                <button onclick="location.reload()" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold;">Reload App</button>
            </div>
        `;
    }
});

console.log("StudyBuddy booting...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(<App />);
    console.log("React render initiated.");
  } catch (err) {
    console.error("Critical Render Error:", err);
  }
} else {
  console.error("Error: #root element not found in DOM.");
}
