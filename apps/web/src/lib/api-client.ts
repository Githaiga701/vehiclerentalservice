import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Check if we're offline
    if (typeof window !== 'undefined' && !navigator.onLine) {
      // Try to get cached data for GET requests
      if (!options.method || options.method === 'GET') {
        const cachedData = this.getCachedData(endpoint);
        if (cachedData) {
          return cachedData;
        }
      }
      
      throw new Error('You are offline. Please check your internet connection.');
    }
    
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
              const data = retryResponse.json();
              // Cache successful GET requests
              if (!options.method || options.method === 'GET') {
                this.setCachedData(endpoint, data);
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
      
      // Cache successful GET requests
      if (!options.method || options.method === 'GET') {
        this.setCachedData(endpoint, data);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // If network error and it's a GET request, try cache
      if (!options.method || options.method === 'GET') {
        const cachedData = this.getCachedData(endpoint);
        if (cachedData) {
          toast.info('Showing cached data (offline mode)');
          return cachedData;
        }
      }
      
      throw error;
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
    return this.request<any>('/auth/me');
  }

  // Vehicle endpoints
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
    return this.request<{
      data: any[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>(`/vehicles${query ? `?${query}` : ''}`);
  }

  async getVehicle(id: string) {
    return this.request<any>(`/vehicles/${id}`);
  }

  async getMyVehicles() {
    return this.request<any[]>('/vehicles/my-vehicles');
  }

  async createVehicle(data: any) {
    return this.request<any>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addVehicle(formData: FormData) {
    return this.request<any>('/vehicles', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  async updateVehicle(id: string, data: any) {
    return this.request<any>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVehicle(id: string) {
    return this.request<void>(`/vehicles/${id}`, {
      method: 'DELETE',
    });
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

  // KYC endpoints
  async submitKyc(data: FormData) {
    return this.request<{ message: string }>('/kyc', {
      method: 'POST',
      body: data,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  async getKycStatus() {
    return this.request<{ status: string; documents?: any }>('/kyc/status');
  }

  // Admin KYC endpoints
  async getPendingKyc() {
    return this.request<any[]>('/kyc/admin/pending');
  }

  async approveKyc(userId: string) {
    return this.request<{ message: string; user: any; status: string }>(`/kyc/admin/${userId}/approve`, {
      method: 'PUT',
    });
  }

  async rejectKyc(userId: string) {
    return this.request<{ message: string; user: any; status: string }>(`/kyc/admin/${userId}/reject`, {
      method: 'PUT',
    });
  }

  // Booking endpoints
  async createBooking(data: any) {
    return this.request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyBookings() {
    return this.request<any[]>('/bookings/my-bookings');
  }

  async getOwnerBookings() {
    return this.request<any[]>('/bookings/owner-bookings');
  }

  async getBooking(id: string) {
    return this.request<any>(`/bookings/${id}`);
  }

  async updateBookingStatus(id: string, status: string) {
    return this.request<any>(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
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