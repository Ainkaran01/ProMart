export type UserRole = 'company' | 'admin';

export type ListingStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  companyName?: string;
}

export interface Listing {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  category: string;
  status: ListingStatus;
  isPaidAd: boolean;
  attachments: string[];
  verificationDocuments?: VerificationDocument[];
  createdAt: string;
  adminComment?: string;
}

export interface VerificationDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Notification {
  id: string;
  type: 'new_listing' | 'status_update';
  message: string;
  listingId: string;
  read: boolean;
  createdAt: string;
}
