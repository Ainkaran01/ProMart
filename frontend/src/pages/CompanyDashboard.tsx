import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import NotificationCenter from "@/components/NotificationCenter";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings as SettingsIcon, ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "@/components/CompanyDashboard/sidebar";
import DashboardHome from "@/components/CompanyDashboard/dashboardHome";
import Settings from "./Settings";
import type { Notification } from "@/types";
import mockApi from "@/services/mockApi";

const CompanyDashboard = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "settings">("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadData = async () => {
    try {
      const notificationsData = await mockApi.getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        unreadCount={notifications.filter(n => !n.read).length} 
        onNotificationsClick={() => setShowNotifications(true)} 
      />

      {showNotifications && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkRead={async (id) => {
            await mockApi.markNotificationRead(id);
            loadData();
          }}
          onMarkAllRead={async () => {
            await mockApi.markAllNotificationsRead();
            loadData();
          }}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard Menu
            </span>
            {showMobileSidebar ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Above content on mobile, beside on desktop */}
          <div className={`${showMobileSidebar ? 'block' : 'hidden'} lg:block lg:w-80 flex-shrink-0`}>
            <Sidebar 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
            />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === "dashboard" ? <DashboardHome /> : <Settings />}
            </motion.div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CompanyDashboard;