import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Listing, Notification } from "@/types";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  Download,
  Users,
  Settings as SettingsIcon,
  BookOpen,
  List,
  BarChart3,
  TrendingUp,
  Clock,
  Building2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import NotificationCenter from "@/components/NotificationCenter";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import BlogManagement from "./BlogManagement";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import UserManagement from "./UserManagement";
import Settings from "./Settings";
import adminApi from "@/services/adminService";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "@/services/notificationService";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [viewDocsListing, setViewDocsListing] = useState<Listing | null>(null);
  const [comment, setComment] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<
    | "dashboard"
    | "pending"
    | "approved"
    | "rejected"
    | "users"
    | "settings"
    | "blog"
  >("dashboard");
  const [viewDetailsListing, setViewDetailsListing] = useState<Listing | null>(
    null
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pendingRes, allRes, notifs, monthlyRes] = await Promise.all([
        adminApi.getListings({ status: "pending" }),
        adminApi.getListings({ status: "all" }),
        getNotifications(),
        adminApi.getMonthlyStats(),
      ]);

      setPendingListings(Array.isArray(pendingRes) ? pendingRes : []);
      setAllListings(Array.isArray(allRes) ? allRes : []);
      setNotifications(notifs || []);
      setChartData(Array.isArray(monthlyRes) ? monthlyRes : []);
    } catch (error) {
      console.error("❌ Failed to load data:", error);
      setPendingListings([]);
      setAllListings([]);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const handleApprove = async (listingId: string) => {
    setLoading(true);
    try {
      await adminApi.approveListing(listingId);
      toast({
        title: "Listing approved",
        description: "The listing is now visible to the public",
      });
      setSelectedListing(null);
      loadData();
    } catch (error) {
      toast({
        title: "Failed to approve",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (listingId: string) => {
    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await adminApi.rejectListing(listingId, comment);
      toast({
        title: "Listing rejected",
        description: "The company has been notified with your comment",
      });
      setSelectedListing(null);
      setComment("");
      loadData();
    } catch (error) {
      console.error("Rejection error:", error);
      toast({
        title: "Failed to reject listing",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const approvedListings = allListings.filter((l) => l.status === "approved");
  const rejectedListings = allListings.filter((l) => l.status === "rejected");

  const sidebarItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
    {
      id: "pending" as const,
      label: "Pending Listings",
      icon: AlertCircle,
      count: pendingListings.length,
    },
    {
      id: "approved" as const,
      label: "Approved Listings",
      icon: CheckCircle,
      count: approvedListings.length,
    },
    {
      id: "rejected" as const,
      label: "Rejected Listings",
      icon: XCircle,
      count: rejectedListings.length,
    },
    { id: "users" as const, label: "User Management", icon: Users },
    { id: "settings" as const, label: "Account Settings", icon: SettingsIcon },
    { id: "blog" as const, label: "Blog Management", icon: BookOpen },
  ];

  const statusData = [
    {
      name: "Approved",
      value: stats.approvedListings,
      color: "hsl(var(--success))",
    },
    {
      name: "Pending",
      value: stats.pendingListings,
      color: "hsl(var(--warning))",
    },
    {
      name: "Rejected",
      value: stats.rejectedListings,
      color: "hsl(var(--destructive))",
    },
  ];

  const renderListings = (listings: Listing[] = [], title: string) => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>

      {!Array.isArray(listings) || listings.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No {title.toLowerCase()} to display
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing, index) => (
            <motion.div
              key={listing._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 sm:p-6 transition-shadow hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold">{listing.title}</h3>
                      <StatusBadge status={listing.status} />
                    </div>
                    <p className="mb-1 text-xs sm:text-sm font-medium text-muted-foreground">
                      By: {listing.companyName}
                    </p>
                    <p className="mb-2 text-xs sm:text-sm">{listing.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Category: {listing.category}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewDetailsListing(listing)}
                    >
                      <Eye className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">View</span>
                    </Button>

                    {listing.verificationDocuments?.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewDocsListing(listing)}
                      >
                        <FileText className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">
                          Docs ({listing.verificationDocuments.length})
                        </span>
                      </Button>
                    )}

                    {listing.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-success text-success hover:bg-success hover:text-success-foreground"
                          onClick={() => handleApprove(listing._id)}
                          disabled={loading}
                        >
                          <CheckCircle className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">Approve</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => setSelectedListing(listing)}
                          disabled={loading}
                        >
                          <XCircle className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">Reject</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        unreadCount={unreadCount}
        onNotificationsClick={() => setShowNotifications(true)}
      />

      {showNotifications && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkRead={async (_id) => {
            await markAsRead(_id);
            loadData();
          }}
          onMarkAllRead={async () => {
            await markAllAsRead();
            loadData();
          }}
        />
      )}

      <div className="flex-1 container mx-auto px-2 sm:px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - only visible on large screens */}
          <aside className="lg:w-64 lg:shrink-0 hidden lg:block">
            <Card className="sticky top-6 p-4">
              <div className="mb-4">
                <h2 className="font-semibold">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">
                  Manage your platform
                </p>
              </div>
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection(item.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count !== undefined && (
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {item.count}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              {activeSection === "dashboard" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Dashboard Overview</h2>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Listings
                        </CardTitle>
                        <List className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {stats.totalListings}
                        </div>
                        <p className="text-xs text-muted-foreground">All time</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Pending Review
                        </CardTitle>
                        <Clock className="h-4 w-4 text-warning" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-warning">
                          {stats.pendingListings}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Needs attention
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Approved
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-success" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-success">
                          {stats.approvedListings}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {(
                            (stats.approvedListings / stats.totalListings) *
                            100
                          ).toFixed(0)}
                          % of total
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Companies
                        </CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {stats.totalCompanies}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Registered users
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Listing Activity</CardTitle>
                        <CardDescription>
                          Monthly listing submissions and approvals
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            listings: {
                              label: "Total Listings",
                              color: "hsl(var(--primary))",
                            },
                            approved: {
                              label: "Approved",
                              color: "hsl(var(--success))",
                            },
                          }}
                          className="h-[250px] w-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis
                                dataKey="month"
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                              />
                              <YAxis
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                              />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar
                                dataKey="listings"
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                              />
                              <Bar
                                dataKey="approved"
                                fill="hsl(var(--success))"
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Status Distribution</CardTitle>
                        <CardDescription>
                          Current listing status breakdown
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            approved: { label: "Approved", color: "hsl(var(--success))" },
                            pending: { label: "Pending", color: "hsl(var(--warning))" },
                            rejected: { label: "Rejected", color: "hsl(var(--destructive))" },
                          }}
                          className="h-[250px] w-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                dataKey="value"
                              >
                                {statusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Growth Trend</CardTitle>
                        <CardDescription>
                          Approved listings over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            approved: {
                              label: "Approved Listings",
                              color: "hsl(var(--primary))",
                            },
                          }}
                          className="h-[250px] w-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis
                                dataKey="month"
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                              />
                              <YAxis
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                              />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Line
                                type="monotone"
                                dataKey="approved"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeSection === "pending" &&
                renderListings(pendingListings, "Pending Listings")}
              {activeSection === "approved" &&
                renderListings(approvedListings, "Approved Listings")}
              {activeSection === "rejected" &&
                renderListings(rejectedListings, "Rejected Listings")}
              {activeSection === "users" && <UserManagement />}
              {activeSection === "settings" && <Settings />}
              {activeSection === "blog" && <BlogManagement />}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Reject Listing Dialog */}
      <Dialog
        open={!!selectedListing}
        onOpenChange={() => setSelectedListing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Provide feedback to help the company improve their listing
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment">Rejection Reason *</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explain why this listing doesn't meet our standards..."
                rows={5}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedListing(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  selectedListing && handleReject(selectedListing._id)
                }
                disabled={loading || !comment.trim()}
                className="flex-1"
              >
                {loading ? "Rejecting..." : "Reject Listing"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog
        open={!!viewDetailsListing}
        onOpenChange={() => setViewDetailsListing(null)}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              {viewDetailsListing?.title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <StatusBadge status={viewDetailsListing?.status || "pending"} />
            </div>
          </DialogHeader>

          {viewDetailsListing && (
            <div className="space-y-6 py-2">
              <div>
                <h4 className="mb-2 font-semibold text-sm sm:text-base">Company Information</h4>
                <Card className="p-3 sm:p-4">
                  <p className="mb-1 text-xs sm:text-sm">
                    <span className="font-medium">Company:</span> {viewDetailsListing.companyName}
                  </p>
                  <p className="mb-1 text-xs sm:text-sm">
                    <span className="font-medium">Category:</span> {viewDetailsListing.category}
                  </p>
                  <p className="mb-1 text-xs sm:text-sm">
                    <span className="font-medium">Website:</span> {viewDetailsListing.website || "N/A"}
                  </p>
                  <p className="mb-1 text-xs sm:text-sm">
                    <span className="font-medium">Location:</span> {viewDetailsListing.location || "N/A"}
                  </p>
                  <p className="mb-1 text-xs sm:text-sm">
                    <span className="font-medium">Key Features:</span>{" "}
                    {(() => {
                      let features: string[] = [];
                      try {
                        if (
                          Array.isArray(viewDetailsListing.keyFeatures) &&
                          typeof viewDetailsListing.keyFeatures[0] === "string"
                        ) {
                          features = JSON.parse(viewDetailsListing.keyFeatures[0]);
                        } else if (Array.isArray(viewDetailsListing.keyFeatures)) {
                          features = viewDetailsListing.keyFeatures;
                        } else if (typeof viewDetailsListing.keyFeatures === "string") {
                          features = JSON.parse(viewDetailsListing.keyFeatures);
                        }
                      } catch (err) {
                        console.error("Error parsing keyFeatures:", err);
                      }
                      return features.length > 0 ? features.join(", ") : "No features listed";
                    })()}
                  </p>
                </Card>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-sm sm:text-base">Description</h4>
                <Card className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm">{viewDetailsListing.description}</p>
                </Card>
              </div>

              {viewDetailsListing.attachments &&
                viewDetailsListing.attachments.length > 0 && (
                  <Card className="rounded-xl border p-3 sm:p-4">
                    <h4 className="mb-3 font-semibold text-sm sm:text-base">Company Images</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {viewDetailsListing.attachments
                        .filter(
                          (file) =>
                            file.url?.toLowerCase().endsWith(".jpg") ||
                            file.url?.toLowerCase().endsWith(".jpeg") ||
                            file.url?.toLowerCase().endsWith(".png")
                        )
                        .map((image, index) => (
                          <div
                            key={index}
                            className="overflow-hidden rounded-lg border"
                          >
                            <img
                              src={
                                image?.url?.startsWith("http")
                                  ? image.url
                                  : `http://localhost:5000${image.url}`
                              }
                              alt={image.name || `Image ${index + 1}`}
                              className="h-32 sm:h-40 w-full object-cover"
                            />
                          </div>
                        ))}
                    </div>
                  </Card>
                )}

              {viewDetailsListing.verificationDocuments &&
                viewDetailsListing.verificationDocuments.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-semibold text-sm sm:text-base">
                      Verification Documents
                    </h4>
                    <div className="space-y-2">
                      {viewDetailsListing.verificationDocuments.map((doc) => (
                        <Card key={doc.id} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(doc.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={doc.url} download={doc.name}>
                                <Download className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                <span className="text-xs sm:text-sm">Download</span>
                              </a>
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

              {viewDetailsListing.status === "pending" && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1 border-success text-success hover:bg-success hover:text-success-foreground"
                    onClick={() => {
                      handleApprove(viewDetailsListing._id);
                      setViewDetailsListing(null);
                    }}
                    disabled={loading}
                  >
                    <CheckCircle className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Approve</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                      setSelectedListing(viewDetailsListing);
                      setViewDetailsListing(null);
                    }}
                    disabled={loading}
                  >
                    <XCircle className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Reject</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Verification Documents Modal */}
      <Dialog
        open={!!viewDocsListing}
        onOpenChange={() => setViewDocsListing(null)}
      >
        <DialogContent className="max-w-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verification Documents</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Review documents submitted by {viewDocsListing?.companyName}
            </p>
          </DialogHeader>

          {viewDocsListing?.verificationDocuments &&
          viewDocsListing.verificationDocuments.length > 0 ? (
            <div className="space-y-3">
              {viewDocsListing.verificationDocuments.map((doc) => (
                <Card key={doc.id} className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(doc.size / 1024).toFixed(2)} KB •{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={doc.url} download={doc.name}>
                        <Download className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">Download</span>
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No documents uploaded
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;