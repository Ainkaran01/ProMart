import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import mockApi from '@/services/mockApi';
import { Listing, Notification, VerificationDocument } from '@/types';
import { Plus, FileText, Megaphone, Eye, Upload, X, File, LayoutDashboard, Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import NotificationCenter from '@/components/NotificationCenter';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'settings'>('dashboard');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    isPaidAd: false,
  });

  const [verificationDocs, setVerificationDocs] = useState<File[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      const [listingsData, notificationsData] = await Promise.all([
        mockApi.getListings({ companyId: user.id }),
        mockApi.getNotifications(user.id),
      ]);
      setListings(listingsData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Simulate document upload and create verification documents
      const uploadedDocs: VerificationDocument[] = verificationDocs.map((file, index) => ({
        id: 'doc-' + Date.now() + '-' + index,
        name: file.name,
        url: URL.createObjectURL(file), // In production, this would be a server URL
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }));

      await mockApi.createListing({
        companyId: user.id,
        companyName: user.companyName!,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        isPaidAd: formData.isPaidAd,
        attachments: [],
        verificationDocuments: uploadedDocs,
      });

      toast({
        title: 'Listing created!',
        description: 'Your listing is pending admin approval',
      });

      setShowCreateModal(false);
      setFormData({ title: '', description: '', category: '', isPaidAd: false });
      setVerificationDocs([]);
      loadData();
    } catch (error) {
      toast({
        title: 'Failed to create listing',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVerificationDocs([...verificationDocs, ...files]);
  };

  const removeDocument = (index: number) => {
    setVerificationDocs(verificationDocs.filter((_, i) => i !== index));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
              <h2 className="font-semibold">Company Panel</h2>
              <p className="text-xs text-muted-foreground">Manage your business</p>
            </div>
            <nav className="space-y-1">
              <Button
                variant={activeSection === 'dashboard' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection('dashboard')}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activeSection === 'settings' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
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
              <div className="space-y-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">Company Dashboard</h1>
                    <p className="text-muted-foreground">Manage your listings and ads</p>
                  </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Listing
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Listing</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateListing} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Enter listing title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      placeholder="e.g., Software, Consulting, Manufacturing"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      placeholder="Describe your service or product"
                      rows={5}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <Label htmlFor="isPaidAd" className="text-base">Promote as Paid Ad</Label>
                      <p className="text-sm text-muted-foreground">
                        Get featured placement and priority visibility
                      </p>
                    </div>
                    <Switch
                      id="isPaidAd"
                      checked={formData.isPaidAd}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPaidAd: checked })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="verificationDocs" className="mb-2 block">
                      Verification Documents *
                    </Label>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Upload business license, certificates, or other verification documents
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          id="verificationDocs"
                          type="file"
                          onChange={handleFileUpload}
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        <Label
                          htmlFor="verificationDocs"
                          className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 px-4 py-3 transition-colors hover:border-primary hover:bg-muted"
                        >
                          <Upload className="h-5 w-5" />
                          <span className="text-sm font-medium">Choose Files</span>
                        </Label>
                      </div>

                      {verificationDocs.length > 0 && (
                        <div className="space-y-2">
                          {verificationDocs.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                            >
                              <div className="flex items-center gap-3">
                                <File className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB each)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading || verificationDocs.length === 0} className="flex-1">
                      {loading ? 'Creating...' : 'Submit for Approval'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{listings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Listings</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-success/10 p-3">
                  <Megaphone className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {listings.filter(l => l.status === 'approved').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Listings</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-warning/10 p-3">
                  <FileText className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {listings.filter(l => l.status === 'pending').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Listings</h2>
          
            {listings.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="mb-4 text-muted-foreground">No listings yet</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  Create Your First Listing
                </Button>
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
                          <p className="mb-2 text-sm text-muted-foreground">{listing.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Category: {listing.category}
                          </p>
                          
                          {listing.status === 'rejected' && listing.adminComment && (
                            <div className="mt-4 rounded-lg border-l-4 border-l-destructive bg-destructive/10 p-4">
                              <p className="mb-1 text-sm font-semibold text-destructive">Admin Feedback:</p>
                              <p className="text-sm">{listing.adminComment}</p>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/listings/${listing.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Account Settings</h1>
                  <p className="text-muted-foreground">Manage your company profile and preferences</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Company Profile</CardTitle>
                    <CardDescription>Your business information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Company Name</Label>
                      <p className="text-sm text-muted-foreground">{user?.companyName}</p>
                    </div>
                    <div>
                      <Label>Email Address</Label>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <p className="text-sm text-muted-foreground">{user?.phone}</p>
                    </div>
                    <div>
                      <Label>Account Type</Label>
                      <p className="text-sm text-muted-foreground">Company Account</p>
                    </div>
                    <div>
                      <Label>Account Status</Label>
                      <p className="text-sm text-success">Active</p>
                    </div>
                    <Button variant="outline" className="mt-4">
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates about your listings</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Listing Status Updates</p>
                        <p className="text-sm text-muted-foreground">Get notified when listings are approved/rejected</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">Receive promotional offers and tips</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Listing Statistics</CardTitle>
                    <CardDescription>Overview of your listing performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Listings</span>
                        <span className="font-semibold">{listings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Approved</span>
                        <span className="font-semibold text-success">
                          {listings.filter(l => l.status === 'approved').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Pending</span>
                        <span className="font-semibold text-warning">
                          {listings.filter(l => l.status === 'pending').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rejected</span>
                        <span className="font-semibold text-destructive">
                          {listings.filter(l => l.status === 'rejected').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>Manage your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive hover:text-destructive-foreground">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CompanyDashboard;
