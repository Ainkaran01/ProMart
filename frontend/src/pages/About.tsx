import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Target, Users, Award, TrendingUp, Shield, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

const About = () => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('https://assets9.lottiefiles.com/packages/lf20_w51pcehl.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(() => console.log('Animation loading failed'));
  }, []);

  const values = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'Every contractor, applicator, and subcontractor is verified for trust and reliability.',
    },
    {
      icon: Users,
      title: 'Industry Community',
      description: 'Connect with construction & engineering professionals who understand your challenges.',
    },
    {
      icon: Award,
      title: 'Quality First',
      description: 'We prioritize excellence in every listing, application, and partnership.',
    },
    {
      icon: Heart,
      title: 'Dedicated Support',
      description: 'Our team is here to help you succeed—before, during, and after your project.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Verified Professionals' },
    { number: '50,000+', label: 'Project Connections' },
    { number: '150+', label: 'Countries Served' },
    { number: '98%', label: 'Client Satisfaction' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left text-primary-foreground"
            >
              <h1 className="mb-6 text-5xl font-bold tracking-tight">About ProMart</h1>
              <p className="text-xl opacity-95">
                Connecting Construction & Engineering Professionals for Success
              </p>
            </motion.div>
            {animationData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block"
              >
                <Lottie animationData={animationData} loop={true} />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                We aim to transform the way construction and engineering professionals interact.
                Our digital marketplace provides businesses and individuals with the tools to
                showcase their services, explore new opportunities, and stay updated on the latest
                industry trends.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">What We Offer</h2>
              </div>
              <ul className="space-y-3 text-lg leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✅</span>
                  <span><strong>Business Listings:</strong> Discover trusted contractors, applicators, and service providers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✅</span>
                  <span><strong>Applications:</strong> Apply for projects and grow your professional network.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✅</span>
                  <span><strong>Industry News:</strong> Stay updated with the latest insights and trends.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✅</span>
                  <span><strong>Advertisement:</strong> Promote your services to a targeted audience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✅</span>
                  <span><strong>Easy Search:</strong> Find the right professionals effortlessly.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="mb-2 text-4xl font-bold text-primary">{stat.number}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">Why Choose ProMart?</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              We’re passionate about laying the foundation for your success
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="gradient-card h-full p-6 shadow-premium transition-all hover:shadow-lg">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="border-t bg-gradient-to-br from-muted/30 to-background py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-6 text-4xl font-bold">Our Story</h2>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              Founded in 2020, ProMart was born from a simple observation: construction and
              engineering professionals needed a better way to find reliable partners.
              Traditional methods were slow, risky, and inefficient.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              We built ProMart to solve this—creating a verified, easy-to-use platform where
              contractors, applicators, and subcontractors can connect with confidence.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Today, we empower thousands of professionals worldwide to win projects,
              build networks, and grow their businesses on a foundation of trust.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;