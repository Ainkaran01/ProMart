import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Building2, Shield, TrendingUp, Users, CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

const Index = () => {
  const [heroAnimation, setHeroAnimation] = useState<any>(null);
  const [networkAnimation, setNetworkAnimation] = useState<any>(null);

  useEffect(() => {
    // Business growth animation
    fetch('https://assets5.lottiefiles.com/packages/lf20_uu0x8lqv.json')
      .then(response => response.json())
      .then(data => setHeroAnimation(data))
      .catch(() => console.log('Hero animation loading failed'));
    
    // Network/connection animation
    fetch('https://assets4.lottiefiles.com/private_files/lf30_WdTEui.json')
      .then(response => response.json())
      .then(data => setNetworkAnimation(data))
      .catch(() => console.log('Network animation loading failed'));
  }, []);

  const features = [
    {
      icon: Building2,
      title: 'List Your Business',
      description: 'Create professional listings and reach potential clients',
    },
    {
      icon: TrendingUp,
      title: 'Promoted Ads',
      description: 'Boost visibility with featured ad placements',
    },
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'All listings reviewed and approved by our admin team',
    },
    {
      icon: Users,
      title: 'B2B Network',
      description: 'Connect with businesses across industries',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-primary py-24 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
                Connect, Trade, Grow
              </h1>
              <p className="mb-8 text-xl opacity-95">
                The premier B2B marketplace for businesses to showcase services and find opportunities
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="shadow-lg text-lg hover:shadow-xl">
                    Get Started
                  </Button>
                </Link>
                <Link to="/listings">
                  <Button size="lg" variant="outline" className="border-2 border-primary-foreground bg-transparent text-lg text-primary-foreground shadow-lg hover:bg-primary-foreground hover:text-primary hover:shadow-xl">
                    Browse Listings
                  </Button>
                </Link>
              </div>
            </motion.div>
            {heroAnimation && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block"
              >
                <Lottie animationData={heroAnimation} loop={true} />
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L1440 120L1440 0C1440 0 1080 80 720 80C360 80 0 0 0 0L0 120Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-4xl font-bold">Why Choose ProMart?</h2>
              <p className="text-lg text-muted-foreground">
                Professional marketplace built for B2B success
              </p>
            </motion.div>
            {networkAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Lottie animationData={networkAnimation} loop={true} />
              </motion.div>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-premium"
              >
                <feature.icon className="mb-4 h-12 w-12 text-primary transition-transform group-hover:scale-110" />
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-gradient-to-br from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">ProMart by the Numbers</h2>
            <p className="text-lg text-muted-foreground">
              Join a thriving community of businesses
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { number: '500+', label: 'Active Businesses', icon: Building2 },
              { number: '10K+', label: 'Monthly Visitors', icon: Users },
              { number: '95%', label: 'Satisfaction Rate', icon: TrendingUp },
              { number: '2.5K+', label: 'Successful Deals', icon: CheckCircle },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="mx-auto mb-4 h-12 w-12 text-primary" />
                    <div className="mb-2 text-4xl font-bold text-primary">{stat.number}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Create Your Account',
                description: 'Sign up and complete your business profile in minutes',
                icon: Users,
              },
              {
                step: '02',
                title: 'List Your Services',
                description: 'Create professional listings with all the details',
                icon: Building2,
              },
              {
                step: '03',
                title: 'Connect & Grow',
                description: 'Start receiving inquiries and close deals',
                icon: TrendingUp,
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="relative overflow-hidden border-2 p-6">
                  <div className="absolute right-4 top-4 text-6xl font-bold text-primary/10">
                    {step.step}
                  </div>
                  <step.icon className="mb-4 h-12 w-12 text-primary" />
                  <CardTitle className="mb-3">{step.title}</CardTitle>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground">
              Real stories from businesses like yours
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: 'Sarah Johnson',
                company: 'TechFlow Solutions',
                quote: 'ProMart helped us connect with quality clients. We\'ve seen a 40% increase in leads within the first month.',
              },
              {
                name: 'Michael Chen',
                company: 'Global Logistics Co',
                quote: 'The verification process gives us credibility. Clients trust us more knowing we\'re verified by ProMart.',
              },
              {
                name: 'Emily Rodriguez',
                company: 'Creative Design Studio',
                quote: 'Best B2B platform we\'ve used. The interface is intuitive and customer support is excellent.',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <MessageSquare className="mb-2 h-8 w-8 text-primary" />
                    <CardDescription className="text-base italic">
                      "{testimonial.quote}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-gradient-to-br from-muted/50 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold">Ready to Expand Your Reach?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join hundreds of businesses already growing with ProMart
            </p>
            <Link to="/register">
              <Button size="lg" className="shadow-lg text-lg hover:shadow-xl">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
