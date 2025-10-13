import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import mockApi from '@/services/mockApi';
import { Listing } from '@/types';
import { Search, Star, Eye, ArrowRight } from 'lucide-react';
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 
                className="mb-4 text-4xl md:text-5xl font-bold tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Browse Listings
              </h1>
              <p className="mb-8 text-lg text-slate-300 max-w-2xl">
                Discover verified business listings and professional services from trusted companies.
              </p>

              <div className="relative max-w-2xl">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by title, category, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-slate-400 focus:bg-white/15 focus:border-amber-400"
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
        </div>
        
        {/* Wave divider */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-background"
          >
            <path
              d="M0 120L1440 120L1440 0C1440 0 1080 80 720 80C360 80 0 0 0 0L0 120Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Listings Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {paidAds.length > 0 && (
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8 flex items-center gap-3"
              >
                <Star className="h-6 w-6 text-amber-500" />
                <h2 
                  className="text-2xl md:text-3xl font-bold text-slate-800"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Featured Listings
                </h2>
              </motion.div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {paidAds.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group relative h-full overflow-hidden rounded-2xl border-2 border-amber-500 bg-white/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <Badge className="absolute right-4 top-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 border-0">
                        Featured
                      </Badge>
                      <h3 className="mb-3 pr-20 text-xl font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                        {listing.title}
                      </h3>
                      <p className="mb-3 text-sm font-medium text-slate-600">
                        {listing.companyName}
                      </p>
                      <p className="mb-6 line-clamp-3 text-sm text-slate-600">{listing.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                          {listing.category}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/listings/${listing.id}`)}
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 group"
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 
                className="text-2xl md:text-3xl font-bold text-slate-800"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                All Listings
              </h2>
              <p className="mt-2 text-slate-600">
                {searchTerm ? `Search results for "${searchTerm}"` : 'Browse all available listings'}
              </p>
            </motion.div>

            {regularListings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="p-12 text-center rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm">
                  <p className="text-slate-600 text-lg">
                    {searchTerm ? 'No listings match your search' : 'No listings available yet'}
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      className="mt-4 border-amber-500 text-amber-600 hover:bg-amber-50"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear Search
                    </Button>
                  )}
                </Card>
              </motion.div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {regularListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group h-full rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-amber-200">
                      <h3 className="mb-3 text-lg font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                        {listing.title}
                      </h3>
                      <p className="mb-3 text-sm font-medium text-slate-600">
                        {listing.companyName}
                      </p>
                      <p className="mb-6 line-clamp-3 text-sm text-slate-600">{listing.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                          {listing.category}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/listings/${listing.id}`)}
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 group"
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
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="mb-4 text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to List Your Business?
            </h2>
            <p className="mb-10 text-lg text-slate-300 max-w-2xl mx-auto">
              Join thousands of businesses already growing with ProMart.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-amber-500/40 transition-all duration-300 group"
              onClick={() => navigate('/register')}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PublicListings;