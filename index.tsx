import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Minimal log to confirm script execution
console.log("App booting...");

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  document.body.innerHTML = '<div style="color:white;padding:20px;">Critical Error: Root not found</div>';
}
