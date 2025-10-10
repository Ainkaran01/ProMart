import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import mockApi from '@/services/mockApi';
import { Listing } from '@/types';
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  Tag,
  FileText,
  ArrowLeft,
  MapPin,
  Globe,
  Users,
  TrendingUp,
  Award,
  CheckCircle2,
  Star,
  Download,
  Shield,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const listings = await mockApi.getListings();
      const found = listings.find((l) => l.id === id);
      setListing(found || null);
    } catch (error) {
      console.error('Failed to load listing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold">Listing Not Found</h2>
            <Button onClick={() => navigate('/listings')}>Browse Listings</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative border-b bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex-1">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <StatusBadge status={listing.status} />
                  {listing.isPaidAd && (
                    <Badge className="bg-gradient-to-r from-primary to-primary-hover">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    <Tag className="mr-1 h-3 w-3" />
                    {listing.category}
                  </Badge>
                </div>

                <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
                  {listing.title}
                </h1>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Posted {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="shadow-md">
                  Contact Company
                </Button>
                <Button variant="outline" size="lg">
                  Save Listing
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              {/* Description */}
              <Card className="gradient-card p-8 shadow-premium">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Description</h2>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-base leading-relaxed text-foreground">
                    {listing.description}
                  </p>
                </div>
              </Card>

              {/* Key Features */}
              <Card className="gradient-card p-8 shadow-premium">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Key Features</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    'Professional Service',
                    'Quick Response Time',
                    'Verified Company',
                    'Quality Guarantee',
                    'Competitive Pricing',
                    'Excellent Support',
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Admin Feedback */}
              {listing.adminComment && (
                <Card className="border-l-4 border-l-warning bg-warning/5 p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-warning/10 p-2">
                      <FileText className="h-5 w-5 text-warning" />
                    </div>
                    <h3 className="text-xl font-bold">Admin Feedback</h3>
                  </div>
                  <p className="text-sm leading-relaxed">{listing.adminComment}</p>
                </Card>
              )}

              {/* Attachments */}
              {listing.attachments && listing.attachments.length > 0 && (
                <Card className="gradient-card p-8 shadow-premium">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Documents</h2>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {listing.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border bg-background/50 p-4 transition-colors hover:border-primary"
                      >
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Verification Documents (Admin Only) */}
              {isAdmin && listing.verificationDocuments && listing.verificationDocuments.length > 0 && (
                <Card className="gradient-card border-2 border-primary/20 p-8 shadow-premium">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Verification Documents</h2>
                      <p className="text-sm text-muted-foreground">Admin-only view</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {listing.verificationDocuments.map((doc) => (
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
                </Card>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Company Card */}
              <Card className="gradient-card overflow-hidden shadow-premium">
                <div className="bg-gradient-to-br from-primary to-primary-hover p-6 text-primary-foreground">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Posted by</p>
                      <h3 className="text-xl font-bold">{listing.companyName}</h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-6">
                  <div>
                    <h4 className="mb-4 font-semibold">Company Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                        <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium">contact@company.com</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="font-medium">San Francisco, CA</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <Globe className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Website</p>
                          <Link
                            to="#"
                            className="font-medium text-primary hover:underline"
                          >
                            www.company.com
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="mb-4 font-semibold">Company Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-primary/5 p-4 text-center">
                        <div className="mb-1 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-primary">3</p>
                        <p className="text-xs text-muted-foreground">Active Listings</p>
                      </div>
                      <div className="rounded-lg bg-success/5 p-4 text-center">
                        <div className="mb-1 flex items-center justify-center">
                          <Users className="h-5 w-5 text-success" />
                        </div>
                        <p className="text-2xl font-bold text-success">50+</p>
                        <p className="text-xs text-muted-foreground">Clients Served</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full shadow-md" size="lg">
                    Contact Company
                  </Button>
                </div>
              </Card>

              {/* Trust Badges */}
              <Card className="gradient-card p-6 shadow-premium">
                <h4 className="mb-4 font-semibold">Verified & Trusted</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <span className="font-medium">Admin Verified</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">Premium Member</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">5 Star Rating</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetails;
