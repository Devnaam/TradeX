if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);

        // Check for SW updates on every page load
        registration.update();

      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
