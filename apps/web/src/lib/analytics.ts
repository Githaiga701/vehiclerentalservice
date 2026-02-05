"use client";

// Google Analytics 4
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Business-specific event tracking
export const trackBusinessEvents = {
  // Vehicle interactions
  vehicleView: (vehicleId: string, vehicleName: string) => {
    event({
      action: 'view_vehicle',
      category: 'Vehicle',
      label: `${vehicleId} - ${vehicleName}`,
    });
  },

  vehicleSearch: (searchTerm: string, filters: any) => {
    event({
      action: 'search_vehicles',
      category: 'Search',
      label: searchTerm,
    });
  },

  occasionFilter: (occasion: string) => {
    event({
      action: 'filter_by_occasion',
      category: 'Filter',
      label: occasion,
    });
  },

  // Booking flow
  bookingStart: (vehicleId: string) => {
    event({
      action: 'booking_start',
      category: 'Booking',
      label: vehicleId,
    });
  },

  bookingComplete: (vehicleId: string, amount: number) => {
    event({
      action: 'booking_complete',
      category: 'Booking',
      label: vehicleId,
      value: amount,
    });
  },

  // Vehicle listing
  listingStart: () => {
    event({
      action: 'listing_start',
      category: 'Listing',
    });
  },

  listingComplete: (vehicleType: string) => {
    event({
      action: 'listing_complete',
      category: 'Listing',
      label: vehicleType,
    });
  },

  leasingEnabled: (vehicleType: string) => {
    event({
      action: 'leasing_enabled',
      category: 'Leasing',
      label: vehicleType,
    });
  },

  // Authentication
  loginStart: () => {
    event({
      action: 'login_start',
      category: 'Auth',
    });
  },

  loginComplete: (method: string) => {
    event({
      action: 'login_complete',
      category: 'Auth',
      label: method,
    });
  },

  registrationStart: () => {
    event({
      action: 'registration_start',
      category: 'Auth',
    });
  },

  registrationComplete: () => {
    event({
      action: 'registration_complete',
      category: 'Auth',
    });
  },

  // Engagement
  ctaClick: (ctaName: string, location: string) => {
    event({
      action: 'cta_click',
      category: 'Engagement',
      label: `${ctaName} - ${location}`,
    });
  },

  servicePreviewClick: (serviceName: string) => {
    event({
      action: 'service_preview_click',
      category: 'Engagement',
      label: serviceName,
    });
  },
};

// Performance monitoring
export const trackPerformance = {
  // Core Web Vitals
  trackCLS: (value: number) => {
    event({
      action: 'CLS',
      category: 'Web Vitals',
      value: Math.round(value * 1000),
    });
  },

  trackFID: (value: number) => {
    event({
      action: 'FID',
      category: 'Web Vitals',
      value: Math.round(value),
    });
  },

  trackFCP: (value: number) => {
    event({
      action: 'FCP',
      category: 'Web Vitals',
      value: Math.round(value),
    });
  },

  trackLCP: (value: number) => {
    event({
      action: 'LCP',
      category: 'Web Vitals',
      value: Math.round(value),
    });
  },

  trackTTFB: (value: number) => {
    event({
      action: 'TTFB',
      category: 'Web Vitals',
      value: Math.round(value),
    });
  },
};

// Error tracking
export const trackError = (error: Error, errorInfo?: any) => {
  event({
    action: 'javascript_error',
    category: 'Error',
    label: error.message,
  });

  // In production, you might want to send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    console.error('Tracked error:', error, errorInfo);
  }
};

// User journey tracking
export const trackUserJourney = {
  landingPageView: () => {
    event({
      action: 'landing_page_view',
      category: 'User Journey',
    });
  },

  explorePageView: () => {
    event({
      action: 'explore_page_view',
      category: 'User Journey',
    });
  },

  listCarPageView: () => {
    event({
      action: 'list_car_page_view',
      category: 'User Journey',
    });
  },

  conversionFunnel: (step: string, data?: any) => {
    event({
      action: 'conversion_funnel',
      category: 'Funnel',
      label: step,
    });
  },
};