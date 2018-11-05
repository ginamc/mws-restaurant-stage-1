const appName = "restaurant-reviews"
    /* declare that app name */
const staticCacheName = appName + "-v1.0";
/* creates a static aoo name with a version number  */
/* the version number gets updated every time you make a change to the application */
/* for static components of the web app */

const contentImageCache = appName + "-images";

var allCaches = [
    staticCacheName,
    contentImageCache
];
/* array that holds all caches */

/** event listener that fires on sw install, caching static assets */
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                '/', //caches index.html
                '/restaurant.html',
                '/css/styles.css',
                '/js/dbhelper.js',
                '/js/main.js',
                '/js/restaurant_info.js',
                'data/restaurants.json'

            ]);
        })
    );
});

/** event listener that fires on sw activation, deletes previous caches if any **/
/** don't change the appName! **/
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith(appName) &&
                        !allCaches.includes(cacheName);
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

/** adding a fetch listener */
self.addEventListener('fetch', function(event) {
    /* saving request url as a new url, giving us access to properties e.g. origin and pathname */
    const requestUrl = new URL(event.request.url);

    if (requestUrl.origin === location.origin) {
        // allows requests made to restaurant.html to access cache if pathname starts with that path
        if (requestUrl.pathname.startsWith('/restaurant.html')) {
            event.respondWith(caches.match('/restaurant.html'));
            return; // requests are done, exit 
        }
    }
    /* sw responds with cached elements failing to connect to a network */
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
            // if there's anything in the cache, it responds with that, otherwise it attempts to go to the network
        })
    );
});