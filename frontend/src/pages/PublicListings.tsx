import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import mockApi from '@/services/mockApi';
import { Listing } from '@/types';
import { Search, Star, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import Lottie from 'lottie-react';

const PublicListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    loadListings();
    fetch('https://assets1.lottiefiles.com/packages/lf20_qmfs6c3i.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(() => console.log('Animation loading failed'));
  }, []);

  const loadListings = async () => {
    try {
      const data = await mockApi.getListings({ status: 'approved' });
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    }
  };

  const filteredListings = listings.filter(
    listing =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paidAds = filteredListings.filter(l => l.isPaidAd);
  const regularListings = filteredListings.filter(l => !l.isPaidAd);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="mb-2 text-3xl font-bold">Browse Listings</h1>
            <p className="mb-6 text-muted-foreground">
              Discover verified business listings and services
            </p>

            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>
          {animationData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <Lottie animationData={animationData} loop={true} style={{ maxHeight: '300px' }} />
            </motion.div>
          )}
        </div>

        {paidAds.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Featured Listings</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paidAds.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group relative overflow-hidden border-2 border-primary p-6 transition-all hover:shadow-lg">
                    <Badge className="absolute right-4 top-4 bg-primary">Featured</Badge>
                    <h3 className="mb-2 pr-20 text-xl font-semibold group-hover:text-primary">
                      {listing.title}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                      {listing.companyName}
                    </p>
                    <p className="mb-4 line-clamp-3 text-sm">{listing.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{listing.category}</Badge>
                      <Button
                        variant="ghost"
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
          </div>
        )}

        <div>
          <h2 className="mb-4 text-xl font-semibold">All Listings</h2>
          {regularListings.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No listings match your search' : 'No listings available yet'}
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularListings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group h-full p-6 transition-all hover:border-primary hover:shadow-md">
                    <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
                      {listing.title}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                      {listing.companyName}
                    </p>
                    <p className="mb-4 line-clamp-3 text-sm">{listing.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{listing.category}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicListings;
