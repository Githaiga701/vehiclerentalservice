import { toast } from "sonner";
import { cacheManager, type CacheManagerConfig, type CacheStats } from './cache-manager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

interface CacheConfig {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean;
  key?: string;
  type?: string; // Cache type for the cache manager
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  // Legacy cache for backward compatibility - will be phased out
  private requestCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
      this.loadCacheFromStorage();
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private loadCacheFromStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const cached = localStorage.getItem('api_cache');
      if (cached) {
        const cacheData = JSON.parse(cached);
        // Only load non-expired cache entries
        Object.entries(cacheData).forEach(([key, value]: [string, any]) => {
          if (value.timestamp + value.ttl > Date.now()) {
            this.requestCache.set(key, value);
          }
        });
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    }
  }

  private saveCacheToStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData: any = {};
      this.requestCache.forEach((value, key) => {
        // Only save non-expired entries
        if (value.timestamp + value.ttl > Date.now()) {
          cacheData[key] = value;
        }
      });
      localStorage.setItem('api_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }

  private getCacheKey(endpoint: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${endpoint}:${body}`;
  }

  private getFromCache(cacheKey: string): any | null {
    const cached = this.requestCache.get(cacheKey);
    if (cached && cached.timestamp + cached.ttl > Date.now()) {
      return cached.data;
    }
    
    // Remove expired cache
    if (cached) {
      this.requestCache.delete(cacheKey);
    }
    
    return null;
  }

  private setCache(cacheKey: string, data: any, ttl: number = 5 * 60 * 1000) {
    this.requestCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl
    });
    
    // Periodically save to localStorage
    this.saveCacheToStorage();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheConfig: CacheConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';
    const cacheType = cacheConfig.type || 'api';
    const cacheKey = cacheConfig.key || this.getCacheKey(endpoint, options);
    
    // For GET requests, check cache first using the new cache manager
    if (method === 'GET') {
      try {
        const cachedData = await cacheManager.get<T>(cacheKey, cacheType);
        if (cachedData) {
          // If stale-while-revalidate is enabled, return cached data but fetch fresh data in background
          if (cacheConfig.staleWhileRevalidate) {
            this.fetchAndUpdateCache(url, options, cacheKey, cacheType, cacheConfig.ttl);
          }
          return cachedData;
        }
      } catch (error) {
        console.warn('Cache retrieval failed:', error);
      }
    }
    
    // Check if we're offline
    if (typeof window !== 'undefined' && !navigator.onLine) {
      // For GET requests, try to get any cached data (even expired)
      if (method === 'GET') {
        try {
          const staleData = await cacheManager.get<T>(cacheKey, cacheType);
          if (staleData) {
            toast.info('Showing cached data (offline mode)');
            return staleData;
          }
        } catch (error) {
          console.warn('Offline cache retrieval failed:', error);
        }
      }
      
      throw new Error('You are offline. Please check your internet connection.');
    }
    
    return this.fetchAndCache(url, options, cacheKey, cacheType, cacheConfig.ttl);
  }

  private async fetchAndCache<T>(
    url: string, 
    options: RequestInit, 
    cacheKey: string, 
    cacheType: string,
    ttl?: number
  ): Promise<T> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry the original request
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${this.token}`,
            };
            const retryResponse = await fetch(url, config);
            if (retryResponse.ok) {
              const data = await retryResponse.json();
              // Cache successful GET requests using the new cache manager
              if (!options.method || options.method === 'GET') {
                try {
                  await cacheManager.set(cacheKey, data, cacheType, { ttl });
                } catch (error) {
                  console.warn('Cache set failed:', error);
                }
              }
              return data;
            }
          }
          // If refresh failed, clear tokens and redirect to login
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Authentication failed');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Cache successful GET requests using the new cache manager
      if (!options.method || options.method === 'GET') {
        try {
          await cacheManager.set(cacheKey, data, cacheType, { ttl });
        } catch (error) {
          console.warn('Cache set failed:', error);
        }
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // If network error and it's a GET request, try any cached data
      if (!options.method || options.method === 'GET') {
        try {
          const staleData = await cacheManager.get<T>(cacheKey, cacheType);
          if (staleData) {
            toast.info('Showing cached data (network error)');
            return staleData;
          }
        } catch (cacheError) {
          console.warn('Fallback cache retrieval failed:', cacheError);
        }
      }
      
      throw error;
    }
  }

  private async fetchAndUpdateCache(
    url: string, 
    options: RequestInit, 
    cacheKey: string, 
    cacheType: string,
    ttl?: number
  ) {
    try {
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      if (response.ok) {
        const data = await response.json();
        await cacheManager.set(cacheKey, data, cacheType, { ttl });
      }
    } catch (error) {
      // Silently fail for background updates
      console.warn('Background cache update failed:', error);
    }
  }

  private getCachedData(endpoint: string): any {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(`cache_${endpoint}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Cache expires after 1 hour
        if (Date.now() - timestamp < 60 * 60 * 1000) {
          return data;
        }
        // Remove expired cache
        localStorage.removeItem(`cache_${endpoint}`);
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    
    return null;
  }

  private setCachedData(endpoint: string, data: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(`cache_${endpoint}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  }

  // Clear all caches using the new cache manager
  clearCache() {
    // Clear new cache manager
    cacheManager.clear();
    
    // Clear legacy cache for backward compatibility
    this.requestCache.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('api_cache');
      // Clear individual caches too
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  // Get cache statistics
  getCacheStats() {
    return cacheManager.getStats();
  }

  // Clear specific cache type
  async clearCacheType(type: string) {
    await cacheManager.clear(type);
  }

  // Auth endpoints
  async requestOtp(phone: string) {
    return this.request<{ message: string; expiresIn: number }>('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOtp(phone: string, code: string) {
    const response = await this.request<{
      accessToken: string;
      refreshToken: string;
      user: any;
    }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });

    if (response.accessToken) {
      this.setToken(response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me', {}, { 
      ttl: 10 * 60 * 1000, // Cache for 10 minutes
      staleWhileRevalidate: true,
      type: 'user'
    });
  }

  async updateProfile(data: { name?: string; email?: string }) {
    const result = await this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    // Clear user cache after profile update
    await cacheManager.delete('GET:/auth/me:', 'user');
    
    return result;
  }

  // Vehicle endpoints with enhanced caching
  async getVehicles(params?: {
    page?: number;
    limit?: number;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    seats?: number;
    transmission?: string;
    fuelType?: string;
    withDriver?: boolean;
    available?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    const endpoint = `/vehicles${query ? `?${query}` : ''}`;
    
    return this.request<{
      data: any[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>(endpoint, {}, { 
      ttl: 5 * 60 * 1000, // Cache for 5 minutes
      staleWhileRevalidate: true,
      key: `vehicles:${query}`,
      type: 'vehicles'
    });
  }

  async getVehicle(id: string) {
    return this.request<any>(`/vehicles/${id}`, {}, { 
      ttl: 10 * 60 * 1000, // Cache for 10 minutes
      staleWhileRevalidate: true,
      type: 'vehicles'
    });
  }

  async getMyVehicles() {
    return this.request<any[]>('/vehicles/my-vehicles', {}, { 
      ttl: 2 * 60 * 1000, // Cache for 2 minutes
      staleWhileRevalidate: true,
      type: 'vehicles'
    });
  }

  async createVehicle(data: any) {
    const result = await this.request<any>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Clear vehicles cache after creating
    await this.clearVehiclesCaches();
    
    return result;
  }

  async addVehicle(formData: FormData) {
    const result = await this.request<any>('/vehicles', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
    
    // Clear vehicles cache after adding
    await this.clearVehiclesCaches();
    
    return result;
  }

  async updateVehicle(id: string, data: any) {
    const result = await this.request<any>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    // Clear specific vehicle and vehicles list cache
    await cacheManager.delete(`GET:/vehicles/${id}:`, 'vehicles');
    await this.clearVehiclesCaches();
    
    return result;
  }

  async deleteVehicle(id: string) {
    const result = await this.request<void>(`/vehicles/${id}`, {
      method: 'DELETE',
    });
    
    // Clear specific vehicle and vehicles list cache
    await cacheManager.delete(`GET:/vehicles/${id}:`, 'vehicles');
    await this.clearVehiclesCaches();
    
    return result;
  }

  private async clearVehiclesCaches() {
    // Clear all vehicles-related caches using the new cache manager
    await cacheManager.clear('vehicles');
  }

  // Admin vehicle approval endpoints
  async approveVehicle(id: string) {
    const result = await this.request<any>(`/vehicles/${id}/approve`, {
      method: 'PUT',
    });
    
    // Clear specific vehicle and vehicles list cache
    await cacheManager.delete(`GET:/vehicles/${id}:`, 'vehicles');
    await this.clearVehiclesCaches();
    
    return result;
  }

  async rejectVehicle(id: string, reason?: string) {
    const result = await this.request<any>(`/vehicles/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
    
    // Clear specific vehicle and vehicles list cache
    await cacheManager.delete(`GET:/vehicles/${id}:`, 'vehicles');
    await this.clearVehiclesCaches();
    
    return result;
  }

  async updateVehicleAvailability(id: string, isAvailable: boolean) {
    const result = await this.request<any>(`/vehicles/${id}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ isAvailable }),
    });
    
    // Clear specific vehicle and vehicles list cache
    await cacheManager.delete(`GET:/vehicles/${id}:`, 'vehicles');
    await this.clearVehiclesCaches();
    
    return result;
  }

  // Contact form endpoint
  async submitContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    return this.request<{ message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // KYC endpoints with caching
  async submitKyc(data: FormData) {
    const result = await this.request<{ message: string }>('/kyc', {
      method: 'POST',
      body: data,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
    
    // Clear KYC status cache after submission
    await cacheManager.delete('GET:/kyc/status:', 'user');
    
    return result;
  }

  async getKycStatus() {
    return this.request<{ status: string; documents?: any }>('/kyc/status', {}, { 
      ttl: 30 * 1000, // Cache for 30 seconds (KYC status changes frequently)
      staleWhileRevalidate: true,
      type: 'user'
    });
  }

  // Admin KYC endpoints
  async getPendingKyc() {
    return this.request<any[]>('/kyc/admin/pending', {}, { 
      ttl: 60 * 1000, // Cache for 1 minute
      staleWhileRevalidate: true,
      type: 'user'
    });
  }

  async approveKyc(userId: string) {
    const result = await this.request<{ message: string; user: any; status: string }>(`/kyc/admin/${userId}/approve`, {
      method: 'PUT',
    });
    
    // Clear KYC-related caches
    await cacheManager.delete('GET:/kyc/admin/pending:', 'user');
    
    return result;
  }

  async rejectKyc(userId: string) {
    const result = await this.request<{ message: string; user: any; status: string }>(`/kyc/admin/${userId}/reject`, {
      method: 'PUT',
    });
    
    // Clear KYC-related caches
    await cacheManager.delete('GET:/kyc/admin/pending:', 'user');
    
    return result;
  }

  // Booking endpoints with caching
  async createBooking(data: any) {
    const result = await this.request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Clear bookings cache after creating
    await this.clearBookingsCaches();
    
    return result;
  }

  async getMyBookings() {
    return this.request<any[]>('/bookings/my-bookings', {}, { 
      ttl: 2 * 60 * 1000, // Cache for 2 minutes
      staleWhileRevalidate: true,
      type: 'user'
    });
  }

  async getOwnerBookings() {
    return this.request<any[]>('/bookings/owner-bookings', {}, { 
      ttl: 2 * 60 * 1000, // Cache for 2 minutes
      staleWhileRevalidate: true,
      type: 'user'
    });
  }

  async getBooking(id: string) {
    return this.request<any>(`/bookings/${id}`, {}, { 
      ttl: 5 * 60 * 1000, // Cache for 5 minutes
      staleWhileRevalidate: true,
      type: 'user'
    });
  }

  async updateBookingStatus(id: string, status: string) {
    const result = await this.request<any>(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    
    // Clear specific booking and bookings list cache
    await cacheManager.delete(`GET:/bookings/${id}:`, 'user');
    await this.clearBookingsCaches();
    
    return result;
  }

  private async clearBookingsCaches() {
    // Clear all bookings-related caches using the new cache manager
    // Since bookings are user-specific, we clear the user cache type
    await cacheManager.clear('user');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Helper function for handling API errors with toast notifications
export const handleApiError = (error: any) => {
  const message = error?.message || 'An unexpected error occurred';
  toast.error(message);
  console.error('API Error:', error);
};

// Helper function for success notifications
export const handleApiSuccess = (message: string) => {
  toast.success(message);
};

// Helper function to clear all caches (useful for debugging or user logout)
export const clearAllCaches = () => {
  apiClient.clearCache();
  toast.success('All caches cleared');
};

// Helper function to get cache statistics
export const getCacheStatistics = () => {
  return apiClient.getCacheStats();
};

// Helper function to clear specific cache type
export const clearCacheType = async (type: string) => {
  await apiClient.clearCacheType(type);
  toast.success(`${type} cache cleared`);
};