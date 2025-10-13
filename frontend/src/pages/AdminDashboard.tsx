import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import mockApi from '@/services/mockApi';
import { Listing, Notification } from '@/types';
import { CheckCircle, XCircle, AlertCircle, Eye, FileText, Download, Users, Settings as SettingsIcon, BookOpen, List, BarChart3, TrendingUp, Clock, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import NotificationCenter from '@/components/NotificationCenter';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import BlogManagement from './BlogManagement';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import UserManagement from './UserManagement';
import Settings from './Settings';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [viewDocsListing, setViewDocsListing] = useState<Listing | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'pending' | 'approved' | 'rejected' | 'users' | 'settings' | 'blog'>('dashboard');
  const [viewDetailsListing, setViewDetailsListing] = useState<Listing | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pending, all, notifs] = await Promise.all([
        mockApi.getListings({ status: 'pending' }),
        mockApi.getListings(),
        mockApi.getNotifications('admin-1'),
      ]);
      setPendingListings(pending);
      setAllListings(all);
      setNotifications(notifs);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleApprove = async (listingId: string) => {
    setLoading(true);
    try {
      await mockApi.updateListingStatus(listingId, 'approved');
      toast({
        title: 'Listing approved',
        description: 'The listing is now visible to the public',
      });
      setSelectedListing(null);
      loadData();
    } catch (error) {
      toast({
        title: 'Failed to approve',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (listingId: string) => {
    if (!comment.trim()) {
      toast({
        title: 'Comment required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await mockApi.updateListingStatus(listingId, 'rejected', comment);
      toast({
        title: 'Listing rejected',
        description: 'The company has been notified',
      });
      setSelectedListing(null);
      setComment('');
      loadData();
    } catch (error) {
      toast({
        title: 'Failed to reject',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const approvedListings = allListings.filter(l => l.status === 'approved');
  const rejectedListings = allListings.filter(l => l.status === 'rejected');

  const sidebarItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'pending' as const, label: 'Pending Listings', icon: AlertCircle, count: pendingListings.length },
    { id: 'approved' as const, label: 'Approved Listings', icon: CheckCircle, count: approvedListings.length },
    { id: 'rejected' as const, label: 'Rejected Listings', icon: XCircle, count: rejectedListings.length },
    { id: 'users' as const, label: 'User Management', icon: Users },
    { id: 'settings' as const, label: 'Account Settings', icon: SettingsIcon },
    { id: 'blog' as const, label: 'Blog Management', icon: BookOpen },
  ];

  const chartData = [
    { month: 'Jan', listings: 45, approved: 38, rejected: 7 },
    { month: 'Feb', listings: 52, approved: 44, rejected: 8 },
    { month: 'Mar', listings: 61, approved: 55, rejected: 6 },
    { month: 'Apr', listings: 48, approved: 42, rejected: 6 },
    { month: 'May', listings: 70, approved: 63, rejected: 7 },
    { month: 'Jun', listings: 65, approved: 58, rejected: 7 },
  ];

  const statusData = [
    { name: 'Approved', value: approvedListings.length, color: 'hsl(var(--success))' },
    { name: 'Pending', value: pendingListings.length, color: 'hsl(var(--warning))' },
    { name: 'Rejected', value: rejectedListings.length, color: 'hsl(var(--destructive))' },
  ];

  const renderListings = (listings: Listing[], title: string) => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {listings.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No {title.toLowerCase()} to display</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{listing.title}</h3>
                      <StatusBadge status={listing.status} />
                      {listing.isPaidAd && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          Paid Ad
                        </span>
                      )}
                    </div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      By: {listing.companyName}
                    </p>
                    <p className="mb-2 text-sm">{listing.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Category: {listing.category}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewDetailsListing(listing)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    {listing.verificationDocuments && listing.verificationDocuments.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewDocsListing(listing)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Docs ({listing.verificationDocuments.length})
                      </Button>
                    )}
                    {listing.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-success text-success hover:bg-success hover:text-success-foreground"
                          onClick={() => handleApprove(listing.id)}
                          disabled={loading}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => setSelectedListing(listing)}
                          disabled={loading}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
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
    <div className="min-h-screen bg-background">
      <Navbar 
        unreadCount={unreadCount}
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

      <div className="container mx-auto flex gap-6 px-4 py-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0">
          <Card className="sticky top-4 p-4">
            <div className="mb-4">
              <h2 className="font-semibold">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Manage your platform</p>
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
        <main className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                      <List className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{allListings.length}</div>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                      <Clock className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-warning">{pendingListings.length}</div>
                      <p className="text-xs text-muted-foreground">Needs attention</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Approved</CardTitle>
                      <CheckCircle className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-success">{approvedListings.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {((approvedListings.length / allListings.length) * 100).toFixed(0)}% of total
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">124</div>
                      <p className="text-xs text-muted-foreground">Registered users</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Listing Activity</CardTitle>
                      <CardDescription>Monthly listing submissions and approvals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          listings: { label: 'Total Listings', color: 'hsl(var(--primary))' },
                          approved: { label: 'Approved', color: 'hsl(var(--success))' },
                        }}
                        className="h-[300px] w-full"
                      >
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          />
                          <YAxis 
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="listings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="approved" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Status Distribution</CardTitle>
                      <CardDescription>Current listing status breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          approved: { label: 'Approved', color: 'hsl(var(--success))' },
                          pending: { label: 'Pending', color: 'hsl(var(--warning))' },
                          rejected: { label: 'Rejected', color: 'hsl(var(--destructive))' },
                        }}
                        className="h-[300px] w-full"
                      >
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Growth Trend</CardTitle>
                      <CardDescription>Approved listings over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          approved: { label: 'Approved Listings', color: 'hsl(var(--primary))' },
                        }}
                        className="h-[300px] w-full"
                      >
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          />
                          <YAxis 
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="approved"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            {activeSection === 'pending' && renderListings(pendingListings, 'Pending Listings')}
            {activeSection === 'approved' && renderListings(approvedListings, 'Approved Listings')}
            {activeSection === 'rejected' && renderListings(rejectedListings, 'Rejected Listings')}
            {activeSection === 'users' && <UserManagement />}
            {activeSection === 'settings' && <Settings/>}
            {activeSection === 'blog' && <BlogManagement />}
          </motion.div>
        </main>
      </div>

      <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Provide feedback to help the company improve their listing
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Provide feedback to help the company improve their listing
            </p>
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
              <Button variant="outline" onClick={() => setSelectedListing(null)} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedListing && handleReject(selectedListing.id)}
                disabled={loading || !comment.trim()}
                className="flex-1"
              >
                {loading ? 'Rejecting...' : 'Reject Listing'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={!!viewDetailsListing} onOpenChange={() => setViewDetailsListing(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewDetailsListing?.title}</DialogTitle>
            <div className="flex items-center gap-2">
              <StatusBadge status={viewDetailsListing?.status || 'pending'} />
              {viewDetailsListing?.isPaidAd && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Paid Ad
                </span>
              )}
            </div>
          </DialogHeader>

          {viewDetailsListing && (
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 font-semibold">Company Information</h4>
                <Card className="p-4">
                  <p className="mb-1 text-sm">
                    <span className="font-medium">Company:</span> {viewDetailsListing.companyName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Category:</span> {viewDetailsListing.category}
                  </p>
                </Card>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">Description</h4>
                <Card className="p-4">
                  <p className="text-sm">{viewDetailsListing.description}</p>
                </Card>
              </div>

              {viewDetailsListing.adminComment && (
                <div>
                  <h4 className="mb-2 font-semibold text-destructive">Admin Feedback</h4>
                  <Card className="border-destructive/50 bg-destructive/5 p-4">
                    <p className="text-sm">{viewDetailsListing.adminComment}</p>
                  </Card>
                </div>
              )}

              {viewDetailsListing.verificationDocuments && viewDetailsListing.verificationDocuments.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold">Verification Documents</h4>
                  <div className="space-y-2">
                    {viewDetailsListing.verificationDocuments.map((doc) => (
                      <Card key={doc.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(doc.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.url} download={doc.name}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {viewDetailsListing.status === 'pending' && (
                <div className="flex gap-3 border-t pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-success text-success hover:bg-success hover:text-success-foreground"
                    onClick={() => {
                      handleApprove(viewDetailsListing.id);
                      setViewDetailsListing(null);
                    }}
                    disabled={loading}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
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
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Verification Documents Modal */}
      <Dialog open={!!viewDocsListing} onOpenChange={() => setViewDocsListing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verification Documents</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Review documents submitted by {viewDocsListing?.companyName}
            </p>
          </DialogHeader>

          {viewDocsListing?.verificationDocuments && viewDocsListing.verificationDocuments.length > 0 ? (
            <div className="space-y-3">
              {viewDocsListing.verificationDocuments.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(doc.size / 1024).toFixed(2)} KB • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={doc.url} download={doc.name}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
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
