import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onClose,
  onMarkRead,
  onMarkAllRead,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-md border-l bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex h-12 items-center justify-between border-b bg-muted px-6">
          <span className="text-sm text-muted-foreground">
            {notifications.filter(n => !n.read).length} unread
          </span>
          <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        </div>

        <div className="h-[calc(100vh-112px)] overflow-y-auto p-4">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                  >
                    <Card
                      className={`cursor-pointer p-4 transition-colors hover:bg-accent ${
                        !notification.read ? 'border-l-4 border-l-primary' : ''
                      }`}
                      onClick={() => onMarkRead(notification._id)}
                    >
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationCenter;
