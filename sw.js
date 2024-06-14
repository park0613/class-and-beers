const version = 1;
const cacheName = `park0613-${version}`;
const staticFiles = [
  '/',
  '/css/main.css',
  '/image/beer.png',
  '/js/main.js',
  '/index.html',
  '/manifest.json',
  '/sw.js'
];

self.addEventListener('install', (ev) => {
    console.log("Service worker install event")
    ev.waitUtil(
        caches.open(cacheName).then((cache) => {
        return cache.addAll(staticFiles)
        .then(() => {
            console.log(`${staticFiles} has been updated.`)
        }),
        (err) => {
            console.warn(`failed to updated ${staticFiles}`)
        }
    })
        .catch(console.error)
)
})

self.addEventListener('activate', (ev) => {
  //delete old version
  ev.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    })
  );
});

self.addEventListener('fetch', (ev) => {
  //try the cache first, then fetch and save copy in cache

  ev.respondWith(cacheFirstAndSave(ev))
  
});

function cacheFirst(ev) {
  //try cache then fetch
  return caches.match(ev.request).then((cacheResponse) => {
    return cacheResponse || fetch(ev.request);
  });
}

function cacheFirstAndSave(ev) {
  //try cache then fetch

ev.respondWith(
    caches.match(ev.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(ev.request).then((fetchResponse) => {
          if(ev.request.url.includes(location.origin)) 
            return fetchResponse
            return caches.open(userCache).then(async (cache) => {
              const keys = await cache.keys()
              if(keys) {
                const key = keys.filter(({url}) => url.includes(ev.request))
                if(key.length) {
                  const result = await cache.match(key[0].url)
                  if (result) return fetchResponse
                } 
              }
              cache.put(ev.request, fetchResponse.clone());
              return fetchResponse;
            });
        }) // fetch 
      ); // return of match
    }) // end of match
  ); // end of responseWith

/*
  return caches.match(ev.request).then((cacheResponse) => {
      let fetchResponse = fetch(ev.request).then((response) => {
      return caches.open(cacheName).then((cache) => {
          cache.put(ev.request, response.clone());
          return response;
      });
      });
      return cacheResponse || fetchResponse;
  });
*/
}
function response404() {
  //any generic 404 error that we want to generate
  return new Response(null, { status: 404 });
}
