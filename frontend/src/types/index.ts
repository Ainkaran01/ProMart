export type UserRole = 'company' | 'admin';

export type ListingStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  _id: string;
  email: string;
  phone: string;
  role: UserRole;
  companyName?: string;
  token:string;
  createdAt: string;
}

export interface Attachment {
  name: string;
  url: string;
}

export interface Listing {
  _id: string;
  companyId: {
    _id: string;
    companyName: string;
    email: string;
    phone: string;
  };
  companyName: string;
  title: string;
  keyFeatures: string[];
  description: string;
  category: string;
  location: string;
  website: string;
  status: ListingStatus;
  attachments: Attachment[];
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
  _id: string;
  type: 'new_listing' | 'status_update';
  message: string;
  listingId: string;
  read: boolean;
  createdAt: string;
}
