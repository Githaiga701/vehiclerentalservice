const CACHE_NAME = 'vehiclerent-v1.3';
const STATIC_CACHE = 'vehiclerent-static-v1.3';
const DYNAMIC_CACHE = 'vehiclerent-dynamic-v1.3';
const IMAGE_CACHE = 'vehiclerent-images-v1.3';
const API_CACHE = 'vehiclerent-api-v1.3';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/explore',
  '/vehicles',
  '/about',
  '/contact',
  '/faq',
  '/how-it-works',
  '/login',
  '/register',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// API endpoints to cache
const CACHEABLE_API_ROUTES = [
  '/vehicles',
  '/auth/me',
  '/kyc/status',
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only',
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting(),
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE &&
              cacheName !== API_CACHE
            ) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim(),
    ])
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests for caching
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (url.origin === location.origin) {
    // Same origin requests (pages, assets)
    event.respondWith(handleSameOriginRequest(request));
  } else if (url.hostname === 'images.unsplash.com' || url.hostname.includes('unsplash')) {
    // Image requests
    event.respondWith(handleImageRequest(request));
  } else if (url.hostname === 'localhost' && url.port === '3001') {
    // API requests
    event.respondWith(handleApiRequest(request));
  } else {
    // External requests - network first
    event.respondWith(handleExternalRequest(request));
  }
});

// Handle same-origin requests (pages, static assets)
async function handleSameOriginRequest(request) {
  const url = new URL(request.url);
  
  // Static assets - cache first
  if (isStaticAsset(url.pathname)) {
    return handleCacheFirst(request, STATIC_CACHE);
  }
  
  // Pages - stale while revalidate
  if (isPageRequest(url.pathname)) {
    return handleStaleWhileRevalidate(request, DYNAMIC_CACHE);
  }
  
  // Default to network first
  return handleNetworkFirst(request, DYNAMIC_CACHE);
}

// Handle image requests
async function handleImageRequest(request) {
  return handleCacheFirst(request, IMAGE_CACHE, {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxEntries: 100,
  });
}

// Handle API requests
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Check if this API endpoint should be cached
  const shouldCache = CACHEABLE_API_ROUTES.some(route => pathname.includes(route));
  
  if (shouldCache) {
    return handleStaleWhileRevalidate(request, API_CACHE, {
      maxAge: 5 * 60 * 1000, // 5 minutes
    });
  }
  
  // Non-cacheable API requests - network only
  return fetch(request);
}

// Handle external requests
async function handleExternalRequest(request) {
  return handleNetworkFirst(request, DYNAMIC_CACHE);
}

// Cache strategies implementation

// Cache First - check cache first, fallback to network
async function handleCacheFirst(request, cacheName, options = {}) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cache is still valid
      if (options.maxAge) {
        const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date') || 0);
        const now = new Date();
        if (now - cacheDate > options.maxAge) {
          // Cache expired, fetch new data
          return fetchAndCache(request, cache, options);
        }
      }
      return cachedResponse;
    }
    
    return fetchAndCache(request, cache, options);
  } catch (error) {
    console.error('Cache First strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First - try network first, fallback to cache
async function handleNetworkFirst(request, cacheName, options = {}) {
  try {
    const cache = await caches.open(cacheName);
    
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Clone and cache the response
        const responseClone = networkResponse.clone();
        await cacheResponse(cache, request, responseClone, options);
      }
      
      return networkResponse;
    } catch (networkError) {
      // Network failed, try cache
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // No cache available, return offline page for navigation requests
      if (request.mode === 'navigate') {
        return caches.match('/offline.html');
      }
      
      throw networkError;
    }
  } catch (error) {
    console.error('Network First strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate - return cache immediately, update in background
async function handleStaleWhileRevalidate(request, cacheName, options = {}) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Fetch fresh data in background
    const fetchPromise = fetchAndCache(request, cache, options);
    
    // Return cached response immediately if available
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // No cache, wait for network
    return fetchPromise;
  } catch (error) {
    console.error('Stale While Revalidate strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Helper functions

async function fetchAndCache(request, cache, options = {}) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const responseClone = response.clone();
      await cacheResponse(cache, request, responseClone, options);
    }
    
    return response;
  } catch (error) {
    // Try to return cached version if available
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function cacheResponse(cache, request, response, options = {}) {
  try {
    // Add cache date header
    const headers = new Headers(response.headers);
    headers.set('sw-cache-date', new Date().toISOString());
    
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
    
    await cache.put(request, modifiedResponse);
    
    // Clean up old entries if maxEntries is specified
    if (options.maxEntries) {
      await cleanupCache(cache, options.maxEntries);
    }
  } catch (error) {
    console.error('Failed to cache response:', error);
  }
}

async function cleanupCache(cache, maxEntries) {
  try {
    const keys = await cache.keys();
    if (keys.length > maxEntries) {
      // Remove oldest entries
      const entriesToDelete = keys.slice(0, keys.length - maxEntries);
      await Promise.all(entriesToDelete.map(key => cache.delete(key)));
    }
  } catch (error) {
    console.error('Failed to cleanup cache:', error);
  }
}

function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/icons/') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2')
  );
}

function isPageRequest(pathname) {
  return (
    pathname === '/' ||
    pathname.startsWith('/explore') ||
    pathname.startsWith('/vehicles') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/faq') ||
    pathname.startsWith('/how-it-works') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/bookings') ||
    pathname.startsWith('/list-car') ||
    pathname.startsWith('/kyc') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/owner')
  );
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Get pending actions from IndexedDB or localStorage
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      try {
        await executeAction(action);
        await removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to execute pending action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getPendingActions() {
  // This would typically use IndexedDB
  // For now, return empty array
  return [];
}

async function executeAction(action) {
  // Execute the pending action (API call, etc.)
  console.log('Executing pending action:', action);
}

async function removePendingAction(actionId) {
  // Remove the action from storage
  console.log('Removing pending action:', actionId);
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/icon-32x32.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-32x32.png',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification('VehicleRent Kenya', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/explore')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      cacheUrls(event.data.urls)
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      clearAllCaches()
    );
  }
});

async function cacheUrls(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.addAll(urls);
    console.log('Service Worker: URLs cached successfully');
  } catch (error) {
    console.error('Service Worker: Failed to cache URLs:', error);
  }
}

async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('Service Worker: All caches cleared');
  } catch (error) {
    console.error('Service Worker: Failed to clear caches:', error);
  }
}