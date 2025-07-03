self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('expo-2025-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/favicon.ico',
                '/icons/icon-192.png',
                '/icons/icon-512.png',
                '/icons/icon-180.png',
                '/link-updater.js',
                '/prep',
                '/prep/apps',
                '/pavilions',
                '/logos/logo-66.png',
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
