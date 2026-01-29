// Vehicle Types for VehicleRent Kenya

/**
 * Transmission type for a vehicle
 */
export type Transmission = "Automatic" | "Manual";

/**
 * Fuel type for a vehicle
 */
export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid";

/**
 * Vehicle category/type
 */
export type VehicleCategory = 
  | "Sedan" 
  | "SUV" 
  | "Truck" 
  | "Van" 
  | "Bus" 
  | "Luxury" 
  | "Economy" 
  | "Convertible" 
  | "Pickup";

/**
 * Vehicle availability status
 */
export type VehicleStatus = "available" | "booked" | "maintenance" | "unavailable";

/**
 * KYC verification status for vehicle owners
 */
export type KycStatus = "pending" | "approved" | "rejected" | null;

/**
 * Base vehicle interface with all properties
 */
export interface Vehicle {
  /** Unique identifier for the vehicle */
  id: string;
  
  /** Vehicle name/model */
  name: string;
  
  /** Vehicle brand/manufacturer */
  brand: string;
  
  /** Vehicle model */
  model: string;
  
  /** Manufacturing year */
  year: number;
  
  /** Main vehicle image URL */
  image: string;
  
  /** Additional vehicle images */
  images?: string[];
  
  /** Price per day in KES */
  pricePerDay: number;
  
  /** Price per hour in KES (optional) */
  pricePerHour?: number;
  
  /** Price per week in KES (optional) */
  pricePerWeek?: number;
  
  /** Number of seats */
  seats: number;
  
  /** Transmission type */
  transmission: Transmission;
  
  /** Fuel type */
  fuelType: FuelType;
  
  /** Vehicle category */
  category: VehicleCategory;
  
  /** Current availability status */
  status: VehicleStatus;
  
  /** Is the vehicle currently available */
  isAvailable: boolean;
  
  /** Vehicle location (city) */
  location: string;
  
  /** Specific pickup address */
  pickupAddress?: string;
  
  /** Vehicle rating (1-5) */
  rating: number;
  
  /** Number of reviews */
  reviewCount?: number;
  
  /** Vehicle description */
  description?: string;
  
  /** Vehicle features/amenities */
  features?: string[];
  
  /** Vehicle owner ID */
  ownerId: string;
  
  /** Vehicle owner details */
  owner?: VehicleOwner;
  
  /** License plate number */
  licensePlate?: string;
  
  /** Vehicle color */
  color?: string;
  
  /** Mileage in kilometers */
  mileage?: number;
  
  /** Minimum rental period in days */
  minRentalDays?: number;
  
  /** Maximum rental period in days */
  maxRentalDays?: number;
  
  /** Security deposit amount in KES */
  securityDeposit?: number;
  
  /** Insurance included */
  insuranceIncluded?: boolean;
  
  /** Free cancellation available */
  freeCancellation?: boolean;
  
  /** Cancellation policy description */
  cancellationPolicy?: string;
  
  /** Additional fees description */
  additionalFees?: string;
  
  /** Created at timestamp */
  createdAt: string;
  
  /** Updated at timestamp */
  updatedAt: string;
}

/**
 * Vehicle owner information
 */
export interface VehicleOwner {
  /** Owner's unique ID */
  id: string;
  
  /** Owner's full name */
  name: string;
  
  /** Owner's email */
  email: string;
  
  /** Owner's phone number */
  phone: string;
  
  /** Owner's profile image */
  avatar?: string;
  
  /** Owner's rating */
  rating?: number;
  
  /** Number of reviews */
  reviewCount?: number;
  
  /** KYC verification status */
  kycStatus: KycStatus;
  
  /** Member since date */
  memberSince?: string;
  
  /** Response rate percentage */
  responseRate?: number;
  
  /** Average response time in minutes */
  responseTime?: number;
}

/**
 * Simplified vehicle card data (for listings)
 */
export interface VehicleCardData {
  id: string;
  name: string;
  image: string;
  pricePerDay: number;
  seats: number;
  transmission: Transmission;
  fuelType: string;
  year: number;
  rating: number;
  isAvailable: boolean;
  location: string;
}

/**
 * Vehicle search filters
 */
export interface VehicleFilters {
  /** Search query */
  query?: string;
  
  /** Location filter */
  location?: string;
  
  /** Vehicle category filter */
  category?: VehicleCategory;
  
  /** Minimum price */
  minPrice?: number;
  
  /** Maximum price */
  maxPrice?: number;
  
  /** Transmission type filter */
  transmission?: Transmission;
  
  /** Fuel type filter */
  fuelType?: FuelType;
  
  /** Minimum seats */
  minSeats?: number;
  
  /** Maximum seats */
  maxSeats?: number;
  
  /** Pickup date */
  pickupDate?: Date;
  
  /** Return date */
  returnDate?: Date;
  
  /** Minimum rating */
  minRating?: number;
  
  /** Sort by option */
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest";
}

/**
 * Vehicle search result
 */
export interface VehicleSearchResult {
  /** List of vehicles */
  vehicles: Vehicle[];
  
  /** Total number of results */
  total: number;
  
  /** Current page */
  page: number;
  
  /** Number of pages */
  totalPages: number;
  
  /** Results per page */
  limit: number;
  
  /** Available filters based on results */
  availableFilters?: {
    locations: string[];
    categories: VehicleCategory[];
    transmissions: Transmission[];
    fuelTypes: FuelType[];
    priceRange: { min: number; max: number };
  };
}

/**
 * Vehicle booking information
 */
export interface VehicleBooking {
  /** Booking ID */
  id: string;
  
  /** Vehicle ID */
  vehicleId: string;
  
  /** Vehicle details */
  vehicle?: Vehicle;
  
  /** Renter/user ID */
  userId: string;
  
  /** Pickup date */
  pickupDate: string;
  
  /** Return date */
  returnDate: string;
  
  /** Number of rental days */
  rentalDays: number;
  
  /** Total price in KES */
  totalPrice: number;
  
  /** Booking status */
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  
  /** Pickup location */
  pickupLocation: string;
  
  /** Return location */
  returnLocation?: string;
  
  /** Additional notes */
  notes?: string;
  
  /** Created at timestamp */
  createdAt: string;
  
  /** Updated at timestamp */
  updatedAt: string;
}

/**
 * Vehicle review/rating
 */
export interface VehicleReview {
  /** Review ID */
  id: string;
  
  /** Vehicle ID */
  vehicleId: string;
  
  /** Reviewer user ID */
  userId: string;
  
  /** Reviewer name */
  userName: string;
  
  /** Reviewer avatar */
  userAvatar?: string;
  
  /** Rating (1-5) */
  rating: number;
  
  /** Review text */
  comment: string;
  
  /** Booking ID associated with this review */
  bookingId?: string;
  
  /** Review date */
  createdAt: string;
  
  /** Owner response (optional) */
  ownerResponse?: string;
  
  /** Owner response date */
  ownerResponseDate?: string;
}

/**
 * Vehicle availability check result
 */
export interface VehicleAvailability {
  /** Is the vehicle available */
  available: boolean;
  
  /** Vehicle ID */
  vehicleId: string;
  
  /** Requested pickup date */
  pickupDate: string;
  
  /** Requested return date */
  returnDate: string;
  
  /** Conflicting bookings if not available */
  conflictingBookings?: {
    pickupDate: string;
    returnDate: string;
  }[];
  
  /** Alternative dates if not available */
  alternativeDates?: {
    pickupDate: string;
    returnDate: string;
  }[];
}

/**
 * Create vehicle input (for owners)
 */
export interface CreateVehicleInput {
  name: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  images?: string[];
  pricePerDay: number;
  pricePerHour?: number;
  pricePerWeek?: number;
  seats: number;
  transmission: Transmission;
  fuelType: FuelType;
  category: VehicleCategory;
  location: string;
  pickupAddress?: string;
  description?: string;
  features?: string[];
  licensePlate?: string;
  color?: string;
  mileage?: number;
  minRentalDays?: number;
  maxRentalDays?: number;
  securityDeposit?: number;
  insuranceIncluded?: boolean;
  freeCancellation?: boolean;
  cancellationPolicy?: string;
  additionalFees?: string;
}

/**
 * Update vehicle input (for owners)
 */
export interface UpdateVehicleInput extends Partial<CreateVehicleInput> {
  status?: VehicleStatus;
}

/**
 * Vehicle statistics (for owner dashboard)
 */
export interface VehicleStats {
  /** Total bookings */
  totalBookings: number;
  
  /** Active bookings */
  activeBookings: number;
  
  /** Completed bookings */
  completedBookings: number;
  
  /** Cancelled bookings */
  cancelledBookings: number;
  
  /** Total earnings in KES */
  totalEarnings: number;
  
  /** Average rating */
  averageRating: number;
  
  /** Total reviews */
  totalReviews: number;
  
  /** Vehicle utilization percentage */
  utilizationRate: number;
  
  /** Monthly earnings history */
  monthlyEarnings?: {
    month: string;
    earnings: number;
    bookings: number;
  }[];
}

/**
 * Compare vehicles input
 */
export interface CompareVehiclesInput {
  /** Vehicle IDs to compare */
  vehicleIds: string[];
}

/**
 * Vehicle comparison result
 */
export interface VehicleComparison {
  /** Vehicles being compared */
  vehicles: Vehicle[];
  
  /** Comparison summary */
  summary: {
    cheapest: string;
    bestRated: string;
    newest: string;
    mostSeats: string;
  };
}