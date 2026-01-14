import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// 1. Essentiële polyfills voor Gemini SDK
if (typeof (window as any).process === 'undefined') {
    (window as any).process = { env: { API_KEY: '' } };
}

const container = document.getElementById('root');

if (container) {
    try {
        const root = createRoot(container);
        // Render de app. Eventuele fouten in de App component worden gevangen door window.onerror in HTML.
        root.render(<App />);
        console.log("StudyBuddy: React engine is running.");
    } catch (err) {
        console.error("StudyBuddy: Mounting failed", err);
        const errMsg = document.getElementById('error-message');
        const errBox = document.getElementById('error-display');
        if (errMsg && errBox) {
            errBox.style.display = 'block';
            errMsg.innerText = err instanceof Error ? err.message : String(err);
        }
    }
}