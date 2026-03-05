
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error handler for catching unhandled promise rejections or syntax errors during load
window.addEventListener('error', (event) => {
  console.error('Global Error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("FATAL: Could not find root element to mount the application.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Critical error during React initialization:", err);
  }
}
