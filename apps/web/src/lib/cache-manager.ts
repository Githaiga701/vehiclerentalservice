"use client";

// Cache configuration for different data types
export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
  strategy: 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB';
  compression?: boolean;
  encryption?: boolean;
}

// Cache item structure
interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  size?: number;
  compressed?: boolean;
  encrypted?: boolean;
}

// Cache statistics
interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  itemCount: number;
  hitRate: number;
  memoryUsage: number;
}

// Cache event types
type CacheEvent = 'hit' | 'miss' | 'set' | 'delete' | 'clear' | 'expire';

class CacheManager {
  private memoryCache = new Map<string, CacheItem>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    itemCount: 0,
    hitRate: 0,
    memoryUsage: 0
  };
  private eventListeners = new Map<CacheEvent, Function[]>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupInterval();
    this.loadStatsFromStorage();
  }

  // Default cache configurations for different data types
  private getDefaultConfig(type: string): CacheConfig {
    const configs: Record<string, CacheConfig> = {
      // API responses - short term, localStorage
      api: {
        ttl: 5 * 60 * 1000, // 5 minutes
        maxSize: 100,
        strategy: 'localStorage',
        compression: true
      },
      // User data - medium term, localStorage with encryption
      user: {
        ttl: 30 * 60 * 1000, // 30 minutes
        maxSize: 10,
        strategy: 'localStorage',
        encryption: true
      },
      // Vehicle data - medium term, localStorage
      vehicles: {
        ttl: 15 * 60 * 1000, // 15 minutes
        maxSize: 200,
        strategy: 'localStorage',
        compression: true
      },
      // Search results - short term, memory
      search: {
        ttl: 2 * 60 * 1000, // 2 minutes
        maxSize: 50,
        strategy: 'memory'
      },
      // Static content - long term, localStorage
      static: {
        ttl: 24 * 60 * 60 * 1000, // 24 hours
        maxSize: 50,
        strategy: 'localStorage',
        compression: true
      },
      // Session data - session only
      session: {
        ttl: 60 * 60 * 1000, // 1 hour
        maxSize: 20,
        strategy: 'sessionStorage'
      },
      // Images/media - long term, indexedDB
      media: {
        ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxSize: 100,
        strategy: 'indexedDB',
        compression: true
      }
    };

    return configs[type] || configs.api;
  }

  // Set cache item with automatic configuration
  async set<T>(key: string, data: T, type: string = 'api', customConfig?: Partial<CacheConfig>): Promise<void> {
    const config = { ...this.getDefaultConfig(type), ...customConfig };
    const now = Date.now();
    
    let processedData = data;
    let compressed = false;
    let encrypted = false;

    // Compression
    if (config.compression && typeof data === 'object') {
      try {
        processedData = this.compress(JSON.stringify(data)) as T;
        compressed = true;
      } catch (error) {
        console.warn('Compression failed:', error);
      }
    }

    // Encryption (basic implementation - in production use proper encryption)
    if (config.encryption) {
      try {
        processedData = this.encrypt(JSON.stringify(data)) as T;
        encrypted = true;
      } catch (error) {
        console.warn('Encryption failed:', error);
      }
    }

    const item: CacheItem<T> = {
      data: processedData,
      timestamp: now,
      ttl: config.ttl,
      accessCount: 0,
      lastAccessed: now,
      size: this.calculateSize(processedData),
      compressed,
      encrypted
    };

    // Store based on strategy
    switch (config.strategy) {
      case 'memory':
        this.setMemoryCache(key, item, config);
        break;
      case 'localStorage':
        this.setLocalStorage(key, item, config);
        break;
      case 'sessionStorage':
        this.setSessionStorage(key, item, config);
        break;
      case 'indexedDB':
        await this.setIndexedDB(key, item, config);
        break;
    }

    this.updateStats('set');
    this.emit('set', { key, data, config });
  }

  // Get cache item with automatic decompression/decryption
  async get<T>(key: string, type: string = 'api'): Promise<T | null> {
    const config = this.getDefaultConfig(type);
    let item: CacheItem<T> | null = null;

    // Retrieve based on strategy
    switch (config.strategy) {
      case 'memory':
        item = this.getMemoryCache(key);
        break;
      case 'localStorage':
        item = this.getLocalStorage(key);
        break;
      case 'sessionStorage':
        item = this.getSessionStorage(key);
        break;
      case 'indexedDB':
        item = await this.getIndexedDB(key);
        break;
    }

    if (!item) {
      this.updateStats('miss');
      this.emit('miss', { key });
      return null;
    }

    // Check expiration
    if (Date.now() - item.timestamp > item.ttl) {
      await this.delete(key, type);
      this.updateStats('miss');
      this.emit('expire', { key });
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = Date.now();

    let data = item.data;

    // Decrypt if needed
    if (item.encrypted) {
      try {
        data = JSON.parse(this.decrypt(data as string)) as T;
      } catch (error) {
        console.warn('Decryption failed:', error);
        return null;
      }
    }

    // Decompress if needed
    if (item.compressed) {
      try {
        data = JSON.parse(this.decompress(data as string)) as T;
      } catch (error) {
        console.warn('Decompression failed:', error);
        return null;
      }
    }

    this.updateStats('hit');
    this.emit('hit', { key, data });
    return data;
  }

  // Delete cache item
  async delete(key: string, type: string = 'api'): Promise<void> {
    const config = this.getDefaultConfig(type);

    switch (config.strategy) {
      case 'memory':
        this.memoryCache.delete(key);
        break;
      case 'localStorage':
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`cache_${key}`);
        }
        break;
      case 'sessionStorage':
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(`cache_${key}`);
        }
        break;
      case 'indexedDB':
        await this.deleteIndexedDB(key);
        break;
    }

    this.emit('delete', { key });
  }

  // Clear all cache for a specific type
  async clear(type?: string): Promise<void> {
    if (type) {
      const config = this.getDefaultConfig(type);
      switch (config.strategy) {
        case 'memory':
          this.memoryCache.clear();
          break;
        case 'localStorage':
          this.clearLocalStorageByType(type);
          break;
        case 'sessionStorage':
          this.clearSessionStorageByType(type);
          break;
        case 'indexedDB':
          await this.clearIndexedDBByType(type);
          break;
      }
    } else {
      // Clear all caches
      this.memoryCache.clear();
      if (typeof window !== 'undefined') {
        this.clearAllLocalStorage();
        sessionStorage.clear();
      }
      await this.clearAllIndexedDB();
    }

    this.resetStats();
    this.emit('clear', { type });
  }

  // Get cache statistics
  getStats(): CacheStats {
    this.calculateStats();
    return { ...this.stats };
  }

  // Memory cache operations
  private setMemoryCache<T>(key: string, item: CacheItem<T>, config: CacheConfig): void {
    // Implement LRU eviction if needed
    if (config.maxSize && this.memoryCache.size >= config.maxSize) {
      this.evictLRU();
    }
    this.memoryCache.set(key, item);
  }

  private getMemoryCache<T>(key: string): CacheItem<T> | null {
    return this.memoryCache.get(key) || null;
  }

  // localStorage operations
  private setLocalStorage<T>(key: string, item: CacheItem<T>, config: CacheConfig): void {
    if (typeof window === 'undefined') return;

    try {
      const serialized = JSON.stringify(item);
      localStorage.setItem(`cache_${key}`, serialized);
      
      // Store metadata for cleanup
      const metadata = JSON.parse(localStorage.getItem('cache_metadata') || '{}');
      metadata[key] = {
        timestamp: item.timestamp,
        ttl: item.ttl,
        type: 'localStorage'
      };
      localStorage.setItem('cache_metadata', JSON.stringify(metadata));
    } catch (error) {
      console.warn('localStorage cache failed:', error);
    }
  }

  private getLocalStorage<T>(key: string): CacheItem<T> | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(`cache_${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('localStorage retrieval failed:', error);
      return null;
    }
  }

  // sessionStorage operations
  private setSessionStorage<T>(key: string, item: CacheItem<T>, config: CacheConfig): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('sessionStorage cache failed:', error);
    }
  }

  private getSessionStorage<T>(key: string): CacheItem<T> | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = sessionStorage.getItem(`cache_${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('sessionStorage retrieval failed:', error);
      return null;
    }
  }

  // IndexedDB operations (proper implementation)
  private async setIndexedDB<T>(key: string, item: CacheItem<T>, config: CacheConfig): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const dbName = 'KiroCache';
      const storeName = 'cache_store';
      
      const request = indexedDB.open(dbName, 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'key' });
        }
      };

      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      await new Promise<void>((resolve, reject) => {
        const putRequest = store.put({ key, ...item });
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      });

      db.close();
    } catch (error) {
      console.warn('IndexedDB cache set failed:', error);
    }
  }

  private async getIndexedDB<T>(key: string): Promise<CacheItem<T> | null> {
    if (typeof window === 'undefined') return null;

    try {
      const dbName = 'KiroCache';
      const storeName = 'cache_store';
      
      const request = indexedDB.open(dbName, 1);
      
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      const result = await new Promise<any>((resolve, reject) => {
        const getRequest = store.get(key);
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => reject(getRequest.error);
      });

      db.close();

      if (result) {
        const { key: _, ...item } = result;
        return item as CacheItem<T>;
      }

      return null;
    } catch (error) {
      console.warn('IndexedDB cache get failed:', error);
      return null;
    }
  }

  private async deleteIndexedDB(key: string): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const dbName = 'KiroCache';
      const storeName = 'cache_store';
      
      const request = indexedDB.open(dbName, 1);
      
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      await new Promise<void>((resolve, reject) => {
        const deleteRequest = store.delete(key);
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      });

      db.close();
    } catch (error) {
      console.warn('IndexedDB cache delete failed:', error);
    }
  }

  // Utility methods
  private compress(data: string): string {
    // Simple compression simulation - in production use proper compression
    return btoa(data);
  }

  private decompress(data: string): string {
    return atob(data);
  }

  private encrypt(data: string): string {
    // Simple encryption simulation - in production use proper encryption
    return btoa(data);
  }

  private decrypt(data: string): string {
    return atob(data);
  }

  private calculateSize(data: any): number {
    return JSON.stringify(data).length;
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, item] of this.memoryCache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.memoryCache.delete(oldestKey);
    }
  }

  private updateStats(operation: 'hit' | 'miss' | 'set'): void {
    switch (operation) {
      case 'hit':
        this.stats.hits++;
        break;
      case 'miss':
        this.stats.misses++;
        break;
      case 'set':
        this.stats.itemCount++;
        break;
    }
    this.calculateStats();
  }

  private calculateStats(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    this.stats.size = this.memoryCache.size;
    this.stats.memoryUsage = Array.from(this.memoryCache.values())
      .reduce((total, item) => total + (item.size || 0), 0);
  }

  private resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      itemCount: 0,
      hitRate: 0,
      memoryUsage: 0
    };
  }

  private loadStatsFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem('cache_stats');
      if (saved) {
        this.stats = { ...this.stats, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load cache stats:', error);
    }
  }

  private saveStatsToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('cache_stats', JSON.stringify(this.stats));
    } catch (error) {
      console.warn('Failed to save cache stats:', error);
    }
  }

  // Cleanup expired items
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private async cleanupExpired(): Promise<void> {
    const now = Date.now();

    // Clean memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.memoryCache.delete(key);
      }
    }

    // Clean localStorage
    if (typeof window !== 'undefined') {
      try {
        const metadata = JSON.parse(localStorage.getItem('cache_metadata') || '{}');
        for (const [key, meta] of Object.entries(metadata)) {
          const metaData = meta as { timestamp: number; ttl: number; type: string };
          if (now - metaData.timestamp > metaData.ttl) {
            localStorage.removeItem(`cache_${key}`);
            delete metadata[key];
          }
        }
        localStorage.setItem('cache_metadata', JSON.stringify(metadata));
      } catch (error) {
        console.warn('Cleanup failed:', error);
      }
    }

    this.saveStatsToStorage();
  }

  // Event system
  private emit(event: CacheEvent, data: any): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => listener(data));
  }

  public on(event: CacheEvent, listener: Function): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(listener);
    this.eventListeners.set(event, listeners);
  }

  public off(event: CacheEvent, listener: Function): void {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
      this.eventListeners.set(event, listeners);
    }
  }

  // Cleanup methods
  private clearLocalStorageByType(type: string): void {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`cache_${type}_`)) {
        localStorage.removeItem(key);
      }
    });
  }

  private clearSessionStorageByType(type: string): void {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(`cache_${type}_`)) {
        sessionStorage.removeItem(key);
      }
    });
  }

  private clearAllLocalStorage(): void {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }

  private async clearIndexedDBByType(type: string): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const dbName = 'KiroCache';
      const storeName = 'cache_store';
      
      const request = indexedDB.open(dbName, 1);
      
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Get all keys and filter by type
      const getAllRequest = store.getAllKeys();
      const keys = await new Promise<IDBValidKey[]>((resolve, reject) => {
        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = () => reject(getAllRequest.error);
      });

      // Delete keys that match the type pattern
      for (const key of keys) {
        if (typeof key === 'string' && key.includes(`_${type}_`)) {
          await new Promise<void>((resolve, reject) => {
            const deleteRequest = store.delete(key);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          });
        }
      }

      db.close();
    } catch (error) {
      console.warn('IndexedDB clear by type failed:', error);
    }
  }

  private async clearAllIndexedDB(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const dbName = 'KiroCache';
      
      const deleteRequest = indexedDB.deleteDatabase(dbName);
      await new Promise<void>((resolve, reject) => {
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      });
    } catch (error) {
      console.warn('IndexedDB clear all failed:', error);
    }
  }

  // Destroy cache manager
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.memoryCache.clear();
    this.eventListeners.clear();
  }
}

// Create singleton instance
export const cacheManager = new CacheManager();

// Export types
export type { CacheStats };
export type { CacheConfig as CacheManagerConfig };
export { CacheManager };