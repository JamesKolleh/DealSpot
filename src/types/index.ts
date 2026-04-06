export type UserRole = 'user' | 'business';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  category: string;
  location: string;
  featured?: boolean;
  createdBy: string;
  createdAt: { seconds: number; nanoseconds: number } | string;
  expiryDate: { seconds: number; nanoseconds: number } | string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  redeemedCount?: number;
}
