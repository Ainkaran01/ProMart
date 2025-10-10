import axios from 'axios';
import { User, Listing, Notification, ListingStatus } from '@/types';

// Mock data storage
let users: User[] = [
  {
    id: 'admin-1',
    email: 'admin@promart.com',
    phone: '+1234567890',
    role: 'admin',
  },
  {
    id: 'company-1',
    email: 'company@example.com',
    phone: '+1987654321',
    role: 'company',
    companyName: 'Tech Solutions Inc',
  },
];

let listings: Listing[] = [
  {
    id: 'listing-1',
    companyId: 'company-1',
    companyName: 'Tech Solutions Inc',
    title: 'Enterprise Software Development',
    description: 'Full-stack development services for enterprise clients',
    category: 'Software',
    status: 'pending',
    isPaidAd: false,
    attachments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'listing-2',
    companyId: 'company-1',
    companyName: 'Tech Solutions Inc',
    title: 'Cloud Infrastructure Services',
    description: 'Scalable cloud solutions for modern businesses',
    category: 'Cloud',
    status: 'approved',
    isPaidAd: true,
    attachments: [],
    createdAt: new Date().toISOString(),
  },
];

let notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'new_listing',
    message: 'New listing pending approval: Enterprise Software Development',
    listingId: 'listing-1',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API client
const mockApi = {
  // Auth endpoints
  async sendOTP(phoneOrEmail: string): Promise<{ success: boolean }> {
    await delay(1000);
    console.log('OTP sent to:', phoneOrEmail);
    return { success: true };
  },

  async verifyOTP(phoneOrEmail: string, otp: string): Promise<{ success: boolean; token: string }> {
    await delay(1000);
    console.log('Verifying OTP:', otp, 'for', phoneOrEmail);
    // Mock: accept any 6-digit OTP
    if (otp.length === 6) {
      return { success: true, token: 'mock-token-' + Date.now() };
    }
    throw new Error('Invalid OTP');
  },

  async register(data: { email: string; phone: string; companyName: string; password: string }): Promise<User> {
    await delay(1000);
    const newUser: User = {
      id: 'company-' + Date.now(),
      email: data.email,
      phone: data.phone,
      role: 'company',
      companyName: data.companyName,
    };
    users.push(newUser);
    return newUser;
  },

  async login(email: string, password: string): Promise<User> {
    await delay(1000);
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    return user;
  },

  // Listing endpoints
  async createListing(listing: Omit<Listing, 'id' | 'status' | 'createdAt'>): Promise<Listing> {
    await delay(1000);
    const newListing: Listing = {
      ...listing,
      id: 'listing-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    listings.push(newListing);
    
    // Create notification for admin
    const notification: Notification = {
      id: 'notif-' + Date.now(),
      type: 'new_listing',
      message: `New ${listing.isPaidAd ? 'paid ad' : 'listing'} pending approval: ${listing.title}`,
      listingId: newListing.id,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.push(notification);
    
    return newListing;
  },

  async getListings(filter?: { status?: ListingStatus; companyId?: string }): Promise<Listing[]> {
    await delay(500);
    let filtered = [...listings];
    if (filter?.status) {
      filtered = filtered.filter(l => l.status === filter.status);
    }
    if (filter?.companyId) {
      filtered = filtered.filter(l => l.companyId === filter.companyId);
    }
    return filtered;
  },

  async updateListingStatus(
    listingId: string,
    status: ListingStatus,
    adminComment?: string
  ): Promise<Listing> {
    await delay(1000);
    const listing = listings.find(l => l.id === listingId);
    if (!listing) throw new Error('Listing not found');
    
    listing.status = status;
    if (adminComment) {
      listing.adminComment = adminComment;
    }
    
    // Create notification for company
    const notification: Notification = {
      id: 'notif-' + Date.now(),
      type: 'status_update',
      message: `Your listing "${listing.title}" has been ${status}`,
      listingId: listing.id,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.push(notification);
    
    // Simulate sending email notification
    console.log('📧 Email sent to company:');
    console.log(`To: ${users.find(u => u.id === listing.companyId)?.email}`);
    console.log(`Subject: Listing ${status === 'approved' ? 'Approved' : 'Rejected'} - ${listing.title}`);
    console.log(`Body: Your listing "${listing.title}" has been ${status}.`);
    if (adminComment) {
      console.log(`Admin feedback: ${adminComment}`);
    }
    console.log('---');
    
    return listing;
  },

  // Notification endpoints
  async getNotifications(userId: string): Promise<Notification[]> {
    await delay(500);
    // In real app, filter by userId
    return [...notifications].reverse();
  },

  async markNotificationRead(notificationId: string): Promise<void> {
    await delay(300);
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  },

  async markAllNotificationsRead(): Promise<void> {
    await delay(300);
    notifications.forEach(n => n.read = true);
  },
};

export default mockApi;
