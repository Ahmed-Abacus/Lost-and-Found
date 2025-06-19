/**
 * Type definitions for the Lost and Found application
 */

// Item categories
export type ItemCategory = 
  | 'Wallet'
  | 'Identity'
  | 'Bags'
  | 'Electronics'
  | 'Jewelry'
  | 'Clothes'
  | 'Keys'
  | 'Other';

// Base item interface
export interface BaseItem {
  id: string;
  category: ItemCategory;
  subcategory: string;
  dateReported: string;
  location: string;
  description?: string;
  photo?: File | string | null;
  contactInfo: string;
  status: 'pending' | 'resolved' | 'claimed';
  createdAt: string;
}

// Lost item interface
export interface LostItem extends BaseItem {
  type: 'lost';
  dateLost: string;
  locationLastSeen: string;
  
  // Optional fields based on category
  // Wallet related
  walletBrand?: string;
  walletColor?: string;
  walletContents?: string;
  cardType?: string;
  cardIssuer?: string;
  cardLastFour?: string;
  moneyAmount?: string;
  moneyCurrency?: string;
  
  // Identity related
  firstName?: string;
  lastName?: string;
  idCardNumber?: string;
  idCardIssuer?: string;
  idCardExpiry?: string;
  studentId?: string;
  university?: string;
  department?: string;
  licenseNumber?: string;
  licenseCountry?: string;
  licenseExpiry?: string;
  passportNumber?: string;
  passportCountry?: string;
  passportExpiry?: string;
  
  // Electronics related
  phoneModel?: string;
  phoneBrand?: string;
  phoneColor?: string;
  phoneCase?: string;
  phoneIMEI?: string;
  phonePassword?: string;
  laptopModel?: string;
  laptopBrand?: string;
  laptopCharger?: string;
  
  // Additional fields can be added for other categories
}

// Found item interface
export interface FoundItem extends BaseItem {
  type: 'found';
  dateFound: string;
  foundLocation: string;
  itemCondition?: 'excellent' | 'good' | 'fair' | 'poor';
  storedLocation?: string;
  finderName?: string;
  
  // Optional identifying fields
  identifyingFeatures?: string;
  brandInfo?: string;
  colorInfo?: string;
  serialNumber?: string;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  createdAt: string;
  lostItems?: string[]; // IDs of lost items reported by user
  foundItems?: string[]; // IDs of found items reported by user
  claimedItems?: string[]; // IDs of items claimed by user
}

// Form error interface
export interface FormErrors {
  [key: string]: string;
}

// Notification interface
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  itemId?: string;
  type: 'match' | 'claim' | 'system' | 'update';
}

// Match interface for potential matches between lost and found items
export interface ItemMatch {
  id: string;
  lostItemId: string;
  foundItemId: string;
  matchScore: number; // 0-100 score indicating match confidence
  createdAt: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

// Search filters interface
export interface SearchFilters {
  category?: ItemCategory;
  subcategory?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  location?: string;
  status?: 'pending' | 'resolved' | 'claimed';
  searchTerm?: string;
}

// API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}