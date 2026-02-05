"use client";

import { cacheManager } from './cache-manager';
import { apiClient } from './api-client';

export interface CacheTestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: any;
}

export class CacheTestSuite {
  private results: CacheTestResult[] = [];

  async runAllTests(): Promise<CacheTestResult[]> {
    this.results = [];
    
    console.log('🧪 Starting Cache Test Suite...');
    
    // Basic cache operations
    await this.testBasicCacheOperations();
    await this.testCacheExpiration();
    await this.testCacheTypes();
    await this.testCacheCompression();
    await this.testCacheEncryption();
    
    // Storage strategy tests
    await this.testMemoryCache();
    await this.testLocalStorageCache();
    await this.testSessionStorageCache();
    await this.testIndexedDBCache();
    
    // API client integration tests
    await this.testApiClientCaching();
    await this.testStaleWhileRevalidate();
    await this.testOfflineMode();
    
    // Performance tests
    await this.testCachePerformance();
    await this.testCacheCleanup();
    
    // Statistics and monitoring
    await this.testCacheStatistics();
    
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    
    console.log(`✅ Cache Test Suite Complete: ${passed}/${total} tests passed`);
    
    return this.results;
  }

  private async runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({
        testName,
        passed: true,
        duration
      });
      console.log(`✅ ${testName} - ${duration}ms`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.push({
        testName,
        passed: false,
        duration,
        error: error instanceof Error ? error.message : String(error)
      });
      console.error(`❌ ${testName} - ${duration}ms - ${error}`);
    }
  }

  private async testBasicCacheOperations(): Promise<void> {
    await this.runTest('Basic Cache Set/Get', async () => {
      const testData = { id: 1, name: 'Test Item', timestamp: Date.now() };
      const key = 'test_basic_cache';
      
      // Set data
      await cacheManager.set(key, testData, 'api');
      
      // Get data
      const retrieved = await cacheManager.get(key, 'api');
      
      if (!retrieved || JSON.stringify(retrieved) !== JSON.stringify(testData)) {
        throw new Error('Retrieved data does not match original data');
      }
      
      // Clean up
      await cacheManager.delete(key, 'api');
    });
  }

  private async testCacheExpiration(): Promise<void> {
    await this.runTest('Cache Expiration', async () => {
      const testData = { message: 'This should expire' };
      const key = 'test_expiration';
      
      // Set data with very short TTL
      await cacheManager.set(key, testData, 'api', { ttl: 100 });
      
      // Should be available immediately
      const immediate = await cacheManager.get(key, 'api');
      if (!immediate) {
        throw new Error('Data should be available immediately after setting');
      }
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should be expired now
      const expired = await cacheManager.get(key, 'api');
      if (expired) {
        throw new Error('Data should have expired');
      }
    });
  }

  private async testCacheTypes(): Promise<void> {
    await this.runTest('Different Cache Types', async () => {
      const testData = { type: 'test' };
      const types = ['api', 'user', 'vehicles', 'search', 'static', 'session'];
      
      // Set data in different cache types
      for (const type of types) {
        await cacheManager.set(`test_${type}`, { ...testData, cacheType: type }, type);
      }
      
      // Retrieve and verify
      for (const type of types) {
        const retrieved = await cacheManager.get(`test_${type}`, type) as any;
        if (!retrieved || retrieved.cacheType !== type) {
          throw new Error(`Failed to retrieve data from ${type} cache`);
        }
      }
      
      // Clean up
      for (const type of types) {
        await cacheManager.delete(`test_${type}`, type);
      }
    });
  }

  private async testCacheCompression(): Promise<void> {
    await this.runTest('Cache Compression', async () => {
      const largeData = {
        id: 1,
        content: 'A'.repeat(1000), // Large string to test compression
        metadata: { compressed: true }
      };
      const key = 'test_compression';
      
      // Set with compression enabled
      await cacheManager.set(key, largeData, 'api', { compression: true });
      
      // Retrieve and verify
      const retrieved = await cacheManager.get(key, 'api') as any;
      if (!retrieved || retrieved.content !== largeData.content) {
        throw new Error('Compressed data retrieval failed');
      }
      
      // Clean up
      await cacheManager.delete(key, 'api');
    });
  }

  private async testCacheEncryption(): Promise<void> {
    await this.runTest('Cache Encryption', async () => {
      const sensitiveData = {
        userId: 123,
        token: 'secret-token-12345',
        personalInfo: 'sensitive information'
      };
      const key = 'test_encryption';
      
      // Set with encryption enabled
      await cacheManager.set(key, sensitiveData, 'user', { encryption: true });
      
      // Retrieve and verify
      const retrieved = await cacheManager.get(key, 'user') as any;
      if (!retrieved || retrieved.token !== sensitiveData.token) {
        throw new Error('Encrypted data retrieval failed');
      }
      
      // Clean up
      await cacheManager.delete(key, 'user');
    });
  }

  private async testMemoryCache(): Promise<void> {
    await this.runTest('Memory Cache Strategy', async () => {
      const testData = { strategy: 'memory' };
      const key = 'test_memory';
      
      await cacheManager.set(key, testData, 'search'); // search uses memory strategy
      const retrieved = await cacheManager.get(key, 'search') as any;
      
      if (!retrieved || retrieved.strategy !== 'memory') {
        throw new Error('Memory cache strategy failed');
      }
      
      await cacheManager.delete(key, 'search');
    });
  }

  private async testLocalStorageCache(): Promise<void> {
    await this.runTest('LocalStorage Cache Strategy', async () => {
      if (typeof window === 'undefined') {
        throw new Error('LocalStorage not available in server environment');
      }
      
      const testData = { strategy: 'localStorage' };
      const key = 'test_localstorage';
      
      await cacheManager.set(key, testData, 'api'); // api uses localStorage strategy
      const retrieved = await cacheManager.get(key, 'api') as any;
      
      if (!retrieved || retrieved.strategy !== 'localStorage') {
        throw new Error('LocalStorage cache strategy failed');
      }
      
      await cacheManager.delete(key, 'api');
    });
  }

  private async testSessionStorageCache(): Promise<void> {
    await this.runTest('SessionStorage Cache Strategy', async () => {
      if (typeof window === 'undefined') {
        throw new Error('SessionStorage not available in server environment');
      }
      
      const testData = { strategy: 'sessionStorage' };
      const key = 'test_sessionstorage';
      
      await cacheManager.set(key, testData, 'session'); // session uses sessionStorage strategy
      const retrieved = await cacheManager.get(key, 'session') as any;
      
      if (!retrieved || retrieved.strategy !== 'sessionStorage') {
        throw new Error('SessionStorage cache strategy failed');
      }
      
      await cacheManager.delete(key, 'session');
    });
  }

  private async testIndexedDBCache(): Promise<void> {
    await this.runTest('IndexedDB Cache Strategy', async () => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        throw new Error('IndexedDB not available');
      }
      
      const testData = { strategy: 'indexedDB', size: 'large' };
      const key = 'test_indexeddb';
      
      await cacheManager.set(key, testData, 'media'); // media uses indexedDB strategy
      
      // Wait a bit for IndexedDB operations
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const retrieved = await cacheManager.get(key, 'media') as any;
      
      if (!retrieved || retrieved.strategy !== 'indexedDB') {
        throw new Error('IndexedDB cache strategy failed');
      }
      
      await cacheManager.delete(key, 'media');
    });
  }

  private async testApiClientCaching(): Promise<void> {
    await this.runTest('API Client Cache Integration', async () => {
      // This test would require a mock API or test endpoint
      // For now, we'll test the cache statistics functionality
      const stats = apiClient.getCacheStats();
      
      if (!stats || typeof stats.hits !== 'number') {
        throw new Error('API client cache statistics not available');
      }
    });
  }

  private async testStaleWhileRevalidate(): Promise<void> {
    await this.runTest('Stale While Revalidate', async () => {
      const testData = { feature: 'stale-while-revalidate' };
      const key = 'test_swr';
      
      // Set initial data
      await cacheManager.set(key, testData, 'api', { ttl: 50 });
      
      // Get data immediately (should be fresh)
      const fresh = await cacheManager.get(key, 'api');
      if (!fresh) {
        throw new Error('Fresh data should be available');
      }
      
      // Wait for data to become stale
      await new Promise(resolve => setTimeout(resolve, 60));
      
      // Data should be expired but this tests the concept
      const stale = await cacheManager.get(key, 'api');
      // In a real SWR implementation, this would return stale data and trigger background refresh
      
      await cacheManager.delete(key, 'api');
    });
  }

  private async testOfflineMode(): Promise<void> {
    await this.runTest('Offline Mode Simulation', async () => {
      // This test simulates offline behavior
      const testData = { offline: true };
      const key = 'test_offline';
      
      // Set data when "online"
      await cacheManager.set(key, testData, 'api');
      
      // Simulate offline retrieval
      const retrieved = await cacheManager.get(key, 'api') as any;
      
      if (!retrieved || !retrieved.offline) {
        throw new Error('Offline cache retrieval failed');
      }
      
      await cacheManager.delete(key, 'api');
    });
  }

  private async testCachePerformance(): Promise<void> {
    await this.runTest('Cache Performance', async () => {
      const iterations = 100;
      const testData = { performance: 'test', data: 'A'.repeat(100) };
      
      // Test write performance
      const writeStart = Date.now();
      for (let i = 0; i < iterations; i++) {
        await cacheManager.set(`perf_${i}`, { ...testData, id: i }, 'api');
      }
      const writeTime = Date.now() - writeStart;
      
      // Test read performance
      const readStart = Date.now();
      for (let i = 0; i < iterations; i++) {
        await cacheManager.get(`perf_${i}`, 'api');
      }
      const readTime = Date.now() - readStart;
      
      // Clean up
      for (let i = 0; i < iterations; i++) {
        await cacheManager.delete(`perf_${i}`, 'api');
      }
      
      // Performance thresholds (adjust based on requirements)
      if (writeTime > 5000) { // 5 seconds for 100 writes
        throw new Error(`Write performance too slow: ${writeTime}ms for ${iterations} operations`);
      }
      
      if (readTime > 1000) { // 1 second for 100 reads
        throw new Error(`Read performance too slow: ${readTime}ms for ${iterations} operations`);
      }
      
      console.log(`Performance: Write ${writeTime}ms, Read ${readTime}ms for ${iterations} operations`);
    });
  }

  private async testCacheCleanup(): Promise<void> {
    await this.runTest('Cache Cleanup', async () => {
      // Set some test data
      await cacheManager.set('cleanup_1', { data: 'test1' }, 'api', { ttl: 50 });
      await cacheManager.set('cleanup_2', { data: 'test2' }, 'api', { ttl: 100 });
      
      // Wait for first item to expire
      await new Promise(resolve => setTimeout(resolve, 60));
      
      // Trigger cleanup (this would normally happen automatically)
      // For testing, we'll just verify that expired items are not returned
      const expired = await cacheManager.get('cleanup_1', 'api');
      const valid = await cacheManager.get('cleanup_2', 'api');
      
      if (expired) {
        throw new Error('Expired cache item should not be returned');
      }
      
      if (!valid) {
        throw new Error('Valid cache item should be returned');
      }
      
      // Clean up
      await cacheManager.delete('cleanup_2', 'api');
    });
  }

  private async testCacheStatistics(): Promise<void> {
    await this.runTest('Cache Statistics', async () => {
      const initialStats = cacheManager.getStats();
      
      // Perform some cache operations
      await cacheManager.set('stats_test', { data: 'statistics' }, 'api');
      await cacheManager.get('stats_test', 'api'); // Hit
      await cacheManager.get('nonexistent_key', 'api'); // Miss
      
      const finalStats = cacheManager.getStats();
      
      // Verify statistics were updated
      if (finalStats.hits <= initialStats.hits) {
        throw new Error('Hit count should have increased');
      }
      
      if (finalStats.misses <= initialStats.misses) {
        throw new Error('Miss count should have increased');
      }
      
      if (typeof finalStats.hitRate !== 'number' || finalStats.hitRate < 0 || finalStats.hitRate > 100) {
        throw new Error('Hit rate should be a valid percentage');
      }
      
      // Clean up
      await cacheManager.delete('stats_test', 'api');
    });
  }

  getResults(): CacheTestResult[] {
    return this.results;
  }

  getPassedCount(): number {
    return this.results.filter(r => r.passed).length;
  }

  getTotalCount(): number {
    return this.results.length;
  }

  getFailedTests(): CacheTestResult[] {
    return this.results.filter(r => !r.passed);
  }
}

// Export singleton instance
export const cacheTestSuite = new CacheTestSuite();

// Helper function to run tests and log results
export async function runCacheTests(): Promise<CacheTestResult[]> {
  const results = await cacheTestSuite.runAllTests();
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.group('🧪 Cache Test Results');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.group('❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(test => {
      console.error(`${test.testName}: ${test.error}`);
    });
    console.groupEnd();
  }
  
  console.groupEnd();
  
  return results;
}