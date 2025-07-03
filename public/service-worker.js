self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('expo-2025-cache').then((cache) => {
            return cache.addAll([
                '/expo-2025',
                '/expo-2025/index.html',
                '/expo-2025/manifest.json',
                '/expo-2025/favicon.ico',
                '/expo-2025/icons/icon-192.png',
                '/expo-2025/icons/icon-512.png',
                '/expo-2025/icons/icon-180.png',
                '/expo-2025/link-updater.js',
                '/expo-2025/prep',
                '/expo-2025/prep/index.html',
                '/expo-2025/prep/apps',
                '/expo-2025/prep/apps/index.html',
                '/expo-2025/pavilions',
                '/expo-2025/pavilions/index.html',
                '/expo-2025/logos/logo-66.png',
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
