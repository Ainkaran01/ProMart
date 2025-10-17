
import { Notification} from '@/types';


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
